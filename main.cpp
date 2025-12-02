// Squid Game - Game Controller (backend orchestration)
#include <algorithm>
#include <chrono>
#include <iostream>
#include <limits>
#include <map>
#include <random>
#include <string>
#include <thread>
#include <vector>
using namespace std;

// Util
static string toLower(string s)
{
    transform(s.begin(), s.end(), s.begin(), ::tolower);
    return s;
}
static void sleepMs(int ms) { this_thread::sleep_for(chrono::milliseconds(ms)); }

// Core model
struct Player
{
    string name;
    bool alive = true;
    // RLGL
    int rlgAttempts = 0;
    // Glass Bridge
    int bridgeStep = 0;
    // Tug of War
    double tugStrength = 0.0;
};

class Game
{
public:
    virtual ~Game() {}
    virtual const char *title() const = 0;
    virtual void startRound(vector<Player> &players) { (void)players; }
    virtual void play(Player &p) = 0;
};

// RNG
static mt19937 &rng()
{
    static mt19937 eng((unsigned)chrono::high_resolution_clock::now().time_since_epoch().count());
    return eng;
}

// Red Light, Green Light
class RedLightGreenLight : public Game
{
public:
    const char *title() const override { return "Red Light Green Light"; }

    void play(Player &p) override
    {
        if (!p.alive)
            return;
        cout << "  -> RLGL for " << p.name << "\n";
        const int required = 4;      // requires 4 successful GREEN moves
        const int timeLimitSec = 20; // 20s round budget
        p.rlgAttempts = 0;

        auto t0 = chrono::steady_clock::now();
        uniform_int_distribution<int> coin(0, 1); // 0=RED, 1=GREEN
        while (p.alive && p.rlgAttempts < required)
        {
            // Time check
            auto now = chrono::steady_clock::now();
            int elapsed = (int)chrono::duration_cast<chrono::seconds>(now - t0).count();
            if (elapsed >= timeLimitSec)
            {
                cout << "     TIMEOUT -> eliminated\n";
                p.alive = false;
                break;
            }

            bool isGreen = coin(rng()) == 1; // 50/50
            cout << "     Light: " << (isGreen ? "GREEN" : "RED")
                 << " | press 'm' to MOVE or other to stay: ";
            string s;
            cin >> s;
            s = toLower(s);
            bool move = (s == "m" || s == "move");

            if (move && !isGreen)
            {
                cout << "     Moved on RED -> eliminated\n";
                p.alive = false;
                break;
            }
            if (move && isGreen)
            {
                p.rlgAttempts++;
                cout << "     Success " << p.rlgAttempts << "/" << required << "\n";
            }
            else
            {
                cout << "     Stayed\n";
            }
        }
        if (p.alive && p.rlgAttempts >= required)
        {
            cout << "  -> RLGL complete\n";
        }
    }
};

// Glass Bridge
class GlassBridge : public Game
{
public:
    const char *title() const override { return "Glass Bridge"; }

    void startRound(vector<Player> &players) override
    {
        // Choose a guaranteed survivor if >=3 alive to ensure progress
        guaranteedName.clear();
        vector<string> alive;
        for (auto &p : players)
            if (p.alive)
                alive.push_back(p.name);
        if (alive.size() >= 3)
        {
            uniform_int_distribution<size_t> pick(0, alive.size() - 1);
            guaranteedName = alive[pick(rng())];
        }
    }

    void play(Player &p) override
    {
        if (!p.alive)
            return;
        cout << "  -> Bridge for " << p.name << "\n";
        p.bridgeStep = 0;
        const int totalSteps = 5; // web uses 5
        while (p.alive && p.bridgeStep < totalSteps)
        {
            int step = p.bridgeStep;
            cout << "     Step " << (step + 1) << "/" << totalSteps << ": choose left/right: ";
            string choice;
            cin >> choice;
            choice = toLower(choice);
            while (choice != "left" && choice != "right")
            {
                cout << "     left/right: ";
                cin >> choice;
                choice = toLower(choice);
            }

            bool survive = false;
            string correct = choice;

            if (step == 0)
            {
                // First step always safe
                survive = true;
            }
            else if (!guaranteedName.empty() && p.name == guaranteedName)
            {
                survive = true; // guaranteed path if chosen
            }
            else
            {
                // 60% chance the chosen tile is safe
                uniform_real_distribution<double> U(0.0, 1.0);
                survive = (U(rng()) < 0.60);
                if (!survive)
                    correct = (choice == "left" ? "right" : "left");
            }

            if (survive)
            {
                cout << "       Safe step!\n";
                p.bridgeStep++;
            }
            else
            {
                cout << "       Glass broke! Correct was: " << correct << " -> eliminated\n";
                p.alive = false;
            }
        }
        if (p.alive && p.bridgeStep >= totalSteps)
        {
            cout << "  -> Crossed the bridge\n";
        }
    }

private:
    string guaranteedName;
};

// Tug of War
// - Tap to extend a bar from the left; it shrinks when idle
// - Keep bar tip inside a moving window to gain strength
// - Timer is 10s and starts on the first tap
class TugOfWar : public Game
{
public:
    const char *title() const override { return "Tug of War"; }

    void play(Player &p) override
    {
        if (!p.alive)
            return;
        cout << "  -> Tug of War for " << p.name << "\n";
        cout << "     Timer starts on first tap. Press ENTER repeatedly to tap.\n";
        cout << "     Type 'q' + ENTER to stop early.\n";

        // Track layout (abstract units)
        const double trackW = 1000.0;
        const double targetW = 100.0;
        double targetX = 18.0; // px from left
        double targetV = 0.0;  // px/s
        double targetA = 0.0;  // px/s^2
        double accelTimer = 0.0;
        const double minV = 80.0, maxV = 340.0, maxA = 600.0;
        auto randomizeAccel = [&]()
        {
            uniform_real_distribution<double> U(-maxA, maxA);
            uniform_real_distribution<double> T(0.18, 0.78);
            targetA = U(rng());
            accelTimer = T(rng());
        };
        randomizeAccel();

        // Bar
        const double barMin = 6.0, barMax = trackW * 0.85;
        const double shrinkSpeed = 210.0; // px/s
        const double baseInc = 30.0;      // px per tap
        double barW = barMin;
        auto lastTap = chrono::steady_clock::time_point{};

        // Timing
        const double duration = 10.0;
        bool started = false;
        auto t0 = chrono::steady_clock::time_point{};
        auto tPrev = chrono::steady_clock::time_point{};

        p.tugStrength = 0.0;

        // Consume the trailing newline from previous inputs
        cin.ignore(numeric_limits<streamsize>::max(), '\n');

        while (true)
        {
            // Early end if timer elapsed
            if (started)
            {
                auto now = chrono::steady_clock::now();
                double t = chrono::duration<double>(now - t0).count();
                if (t >= duration)
                    break;
            }

            cout << "     Tap (ENTER) or 'q'+ENTER to finish: ";
            string line;
            getline(cin, line);
            if (line == "q" || line == "Q")
                break;

            auto now = chrono::steady_clock::now();
            if (!started)
            {
                started = true;
                t0 = now;
                tPrev = now;
                lastTap = now;
            }

            // Time step since last interaction
            double dt = chrono::duration<double>(now - tPrev).count();
            if (dt > 0.2)
                dt = 0.2; // clamp for stability
            tPrev = now;

            // Target random-walk update
            accelTimer -= dt;
            if (accelTimer <= 0.0)
                randomizeAccel();
            targetV += targetA * dt;
            if (fabs(targetV) < minV)
                targetV = (targetV >= 0.0 ? 1.0 : -1.0) * minV;
            if (targetV > maxV)
                targetV = maxV;
            if (targetV < -maxV)
                targetV = -maxV;
            targetX += targetV * dt;
            if (targetX < 2.0)
            {
                targetX = 2.0;
                targetV = fabs(targetV);
                randomizeAccel();
            }
            if (targetX + targetW > trackW - 2.0)
            {
                targetX = trackW - 2.0 - targetW;
                targetV = -fabs(targetV);
                randomizeAccel();
            }

            // Passive shrink between taps
            barW -= shrinkSpeed * dt;
            if (barW < barMin)
                barW = barMin;

            // Compute tap growth with frequency-based bonus
            double dtTap = lastTap.time_since_epoch().count() ? chrono::duration<double>(now - lastTap).count() : 0.35;
            lastTap = now;
            double bonus = min(5.0, 0.5 / max(0.04, dtTap));
            double inc = baseInc * (1.0 + bonus);
            barW = min(barMax, barW + inc);

            // Score if bar tip inside target window
            double tip = barW; // bar grows from left=0
            bool inWindow = (tip >= targetX && tip <= targetX + targetW);
            if (inWindow)
            {
                p.tugStrength += dt * 28.0; // gain per second while aligned
            }

            cout << "       tip=" << (int)tip << " window=[" << (int)targetX << "," << (int)(targetX + targetW) << "]"
                 << (inWindow ? " GOOD" : " ") << " | strength=" << (int)p.tugStrength << "\n";
        }

        cout << "  -> Tug complete (strength=" << (int)p.tugStrength << ")\n";
    }
};

class GameManager
{
public:
    void addPlayer(const string &name) { players.push_back(Player{name}); }
    void addGame(Game *g) { games.push_back(g); }

    void run()
    {
        for (size_t gi = 0; gi < games.size(); ++gi)
        {
            Game *g = games[gi];
            cout << "\n=== " << g->title() << " ===\n";
            showRulesOnce((int)gi);
            g->startRound(players);
            for (auto &p : players)
                if (p.alive)
                    g->play(p);

            // After Tug-of-War (index 2), keep only highest strength
            if (gi == 2)
                applyTugSurvivors();
        }
        printResults();
    }

private:
    void showRulesOnce(int gameIndex)
    {
        if (rulesShown[gameIndex])
            return;
        rulesShown[gameIndex] = true;
        switch (gameIndex)
        {
        case 0:
            cout << "- Goal: complete 4 GREEN moves within time.\n";
            cout << "- Moving on RED eliminates you.\n";
            break;
        case 1:
            cout << "- Goal: make 5 safe choices across the bridge.\n";
            cout << "- First step is always safe; 50/50 feel, ~60% chosen safe.\n";
            break;
        case 2:
            cout << "- Tap to extend; shrink when idle.\n";
            cout << "- Keep tip inside moving window to gain strength.\n";
            cout << "- Highest strength survives (ties survive).\n";
            break;
        }
    }

    void applyTugSurvivors()
    {
        double maxS = -1e9;
        for (auto &p : players)
            if (p.alive)
                maxS = max(maxS, p.tugStrength);
        if (maxS < 0)
            return;
        for (auto &p : players)
            if (p.alive)
            {
                if ((int)floor(p.tugStrength) < (int)floor(maxS))
                    p.alive = false; // ties survive
            }
    }

    void printResults()
    {
        cout << "\n=== Final Results ===\n";
        for (auto &p : players)
        {
            cout << p.name << " | " << (p.alive ? "SURVIVED" : "ELIMINATED")
                 << " | strength=" << (int)floor(p.tugStrength) << "\n";
        }
    }

    vector<Player> players;
    vector<Game *> games;
    map<int, bool> rulesShown;
};

int main()
{
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    GameManager gm;
    // Prompt for players; default 2 if invalid
    int n = 2;
    cout << "Enter number of players (1-10) [default 2]: ";
    if (!(cin >> n) || n < 1 || n > 10)
    {
        cin.clear();
        n = 2;
    }
    for (int i = 0; i < n; ++i)
    {
        string name;
        cout << "Player " << (i + 1) << " name [Player " << (i + 1) << "]: ";
        cin >> ws;
        getline(cin, name);
        if (name.empty())
            name = string("Player ") + to_string(i + 1);
        gm.addPlayer(name);
    }

    gm.addGame(new RedLightGreenLight());
    gm.addGame(new GlassBridge());
    gm.addGame(new TugOfWar());

    gm.run();

    // Cleanup
    return 0;
}
