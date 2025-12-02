#include <iostream>
#include <vector>
#include <string>
#include <memory>
#include <random>
#include <chrono>

// This file is a small, standalone OOP demo that models the
// core game orchestration (players, games, flow) without
// touching the HTTP server in backend.cpp. It mirrors the
// web flow at a high level: show rules once, run three games
// in sequence (Red Light Green Light, Glass Bridge, Tug of War),
// and then print results. Use it to illustrate the backend as
// a core controller via basic OOP.

struct Player
{
    std::string name;
    bool alive = true;
    int redPos = 0;      // Red Light position
    int bridgeStep = 0;  // Glass Bridge step
    int tugStrength = 0; // Final Tug-of-War strength
};

class Game
{
public:
    virtual ~Game() {}
    virtual const char *name() const = 0;
    virtual void startRound() {}
    virtual void play(Player &p) = 0;
};

// Global RNG
static std::mt19937 &rng()
{
    static std::mt19937 eng(static_cast<unsigned int>(
        std::chrono::high_resolution_clock::now().time_since_epoch().count()));
    return eng;
}

class RedLightGreenLight : public Game
{
public:
    const char *name() const override { return "Red Light, Green Light"; }

    void play(Player &p) override
    {
        if (!p.alive)
            return;
        std::uniform_int_distribution<int> coin(0, 1);       // 0=RED, 1=GREEN
        std::uniform_int_distribution<int> moveChoice(0, 1); // 0=stay, 1=move

        std::cout << "  -> Starting RLGL for " << p.name << "\n";
        while (p.alive && p.redPos < 5)
        {
            bool isGreen = coin(rng()) == 1;
            bool wantsToMove = moveChoice(rng()) == 1;
            if (wantsToMove)
            {
                if (isGreen)
                {
                    p.redPos++;
                    std::cout << "     GREEN: moved to " << p.redPos << "\n";
                }
                else
                {
                    p.alive = false;
                    std::cout << "     RED: moved -> eliminated\n";
                }
            }
            else
            {
                std::cout << "     " << (isGreen ? "GREEN" : "RED") << ": stayed\n";
            }
        }
        if (p.alive)
            std::cout << "  -> RLGL complete\n";
    }
};

class GlassBridge : public Game
{
public:
    const char *name() const override { return "Glass Bridge"; }

    void startRound() override
    {
        // Precompute a deterministic safe path (0=left, 1=right) for 5 steps.
        safePath.assign(5, 0);
        std::mt19937 local(1337); // fixed seed for consistent path each run
        std::uniform_int_distribution<int> side(0, 1);
        for (size_t i = 0; i < safePath.size(); ++i)
            safePath[i] = side(local);
    }

    void play(Player &p) override
    {
        if (!p.alive)
            return;
        std::uniform_int_distribution<int> pick(0, 1); // player's guess
        std::cout << "  -> Starting Glass Bridge for " << p.name << "\n";
        while (p.alive && p.bridgeStep < static_cast<int>(safePath.size()))
        {
            int guess = pick(rng());
            int correct = safePath[p.bridgeStep];
            if (guess == correct)
            {
                p.bridgeStep++;
                std::cout << "     Step " << p.bridgeStep << ": safe panel\n";
            }
            else
            {
                p.alive = false;
                std::cout << "     Step " << (p.bridgeStep + 1) << ": wrong panel -> eliminated\n";
            }
        }
        if (p.alive)
            std::cout << "  -> Glass Bridge complete\n";
    }

private:
    std::vector<int> safePath; // predetermined safe side per step
};

class TugOfWar : public Game
{
public:
    const char *name() const override { return "Tug of War"; }

    void play(Player &p) override
    {
        if (!p.alive)
            return;
        std::uniform_int_distribution<int> tap(0, 5); // tap burst per tick
        int strength = 0;
        std::cout << "  -> Starting Tug of War for " << p.name << "\n";
        for (int t = 0; t < 10; ++t)
        {
            int burst = tap(rng());
            strength += burst;
            std::cout << "     tick " << (t + 1) << ": +" << burst << ", total=" << strength << "\n";
        }
        p.tugStrength = strength;
        std::cout << "  -> Tug complete (strength=" << p.tugStrength << ")\n";
    }
};

class GameManager
{
public:
    void addPlayer(const std::string &name)
    {
        players.push_back(Player{name});
    }

    void addGame(std::unique_ptr<Game> g)
    {
        games.push_back(std::move(g));
    }

    void run()
    {
        showRulesOnce();
        for (auto &g : games)
        {
            std::cout << "\n=== " << g->name() << " ===\n";
            g->startRound();
            for (auto &p : players)
            {
                if (!p.alive)
                    continue;
                g->play(p);
            }
        }
        printResults();
    }

private:
    void showRulesOnce()
    {
        if (rulesShown)
            return;
        std::cout << "=== Rulebook ===\n";
        std::cout << "- RLGL: move only on GREEN.\n";
        std::cout << "- Glass Bridge: choose safe panel each step.\n";
        std::cout << "- Tug of War: tap to build strength.\n";
        rulesShown = true;
    }

    void printResults()
    {
        std::cout << "\n=== Results ===\n";
        for (const auto &p : players)
        {
            std::cout << p.name << ": "
                      << (p.alive ? "ALIVE" : "ELIMINATED")
                      << ", strength=" << p.tugStrength << "\n";
        }
    }

    bool rulesShown = false;
    std::vector<Player> players;
    std::vector<std::unique_ptr<Game>> games;
};

int main()
{
    GameManager gm;
    gm.addPlayer("Player 1");
    gm.addPlayer("Player 2");

    gm.addGame(std::unique_ptr<Game>(new RedLightGreenLight()));
    gm.addGame(std::unique_ptr<Game>(new GlassBridge()));
    gm.addGame(std::unique_ptr<Game>(new TugOfWar()));

    gm.run();
    return 0;
}
