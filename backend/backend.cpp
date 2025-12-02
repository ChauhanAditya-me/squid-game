#include <iostream>
#include <string>
#include <cstdlib>
#include <ctime>
#include <sstream>
#include <map>
#include <vector>

#ifdef _WIN32
    #include <winsock2.h>
    #include <ws2tcpip.h>
    #pragma comment(lib, "ws2_32.lib")
    typedef int socklen_t;
#else
    #include <sys/socket.h>
    #include <netinet/in.h>
    #include <unistd.h>
    #define SOCKET int
    #define INVALID_SOCKET -1
    #define SOCKET_ERROR -1
    #define closesocket close
#endif

using namespace std;

// ================= JSON Helper Functions =================
string createJsonResponse(const map<string, string>& data) {
    stringstream json;
    json << "{";
    bool first = true;
    for (const auto& pair : data) {
        if (!first) json << ",";
        json << "\"" << pair.first << "\":\"" << pair.second << "\"";
        first = false;
    }
    json << "}";
    return json.str();
}

string parseJsonField(const string& json, const string& field) {
    size_t pos = json.find("\"" + field + "\"");
    if (pos == string::npos) return "";
    
    pos = json.find(":", pos);
    if (pos == string::npos) return "";
    
    pos = json.find("\"", pos);
    if (pos == string::npos) return "";
    
    size_t end = json.find("\"", pos + 1);
    if (end == string::npos) return "";
    
    return json.substr(pos + 1, end - pos - 1);
}

int parseJsonInt(const string& json, const string& field) {
    size_t pos = json.find("\"" + field + "\"");
    if (pos == string::npos) return 0;
    
    pos = json.find(":", pos);
    if (pos == string::npos) return 0;
    
    // Skip whitespace and quotes
    while (pos < json.length() && (json[pos] == ':' || json[pos] == ' ' || json[pos] == '"')) pos++;
    
    string numStr;
    while (pos < json.length() && (isdigit(json[pos]) || json[pos] == '-')) {
        numStr += json[pos++];
    }
    
    return numStr.empty() ? 0 : atoi(numStr.c_str());
}

// ================= Game Logic Classes =================
class RedLightGreenLightGame {
public:
    static string processAction(const string& playerName, const string& action, int position) {
        // Generate light (50/50 chance)
        bool isGreen = (rand() % 100) < 50;
        string light = isGreen ? "GREEN" : "RED";
        
        bool survived = true;
        string message;
        int newPosition = position;
        
        // Player action: "move" or "stay"
        if (action == "move") {
            if (light == "GREEN") {
                // GREEN light - safe to move forward
                newPosition = position + 1;
                message = "Ran forward safely!";
            } else {
                // RED light and player moved - instant death, no chance
                survived = false;
                message = "BANG! Moved during RED light! Shot by the doll!";
                newPosition = position;  // Don't advance if dead
            }
        } else {
            // Player stayed
            if (light == "GREEN") {
                message = "Stayed still during GREEN light. No progress.";
            } else {
                message = "Stayed frozen during RED light. Safe!";
            }
        }
        
        map<string, string> response;
        response["light"] = light;
        response["survived"] = survived ? "true" : "false";
        response["position"] = to_string(newPosition);
        response["message"] = message;
        
        return createJsonResponse(response);
    }
};

class GlassBridgeGame {
private:
    // Track broken panels globally - shared across all players
    static bool brokenPanels[18][2]; // [step][0=left, 1=right]
    static bool bridgeInitialized;
    
public:
    static string processChoice(const string& playerName, const string& choice, int step) {
        // Initialize bridge if first use
        if (!bridgeInitialized) {
            for (int i = 0; i < 18; i++) {
                brokenPanels[i][0] = false;
                brokenPanels[i][1] = false;
            }
            bridgeInitialized = true;
        }
        
        bool choseLeft = (choice == "left");
        int panelIndex = choseLeft ? 0 : 1;
        
        // Check if panel is already known to be broken
        if (brokenPanels[step][panelIndex]) {
            map<string, string> response;
            response["survived"] = "false";
            response["correctChoice"] = choseLeft ? "right" : "left";
            response["message"] = "That panel is already broken! You fall!";
            return createJsonResponse(response);
        }
        
        // Check if the other panel is broken (making this one safe)
        int otherPanel = 1 - panelIndex;
        if (brokenPanels[step][otherPanel]) {
            map<string, string> response;
            response["survived"] = "true";
            response["correctChoice"] = choice;
            response["message"] = "Only safe option! You advance!";
            return createJsonResponse(response);
        }
        
        // Random 50/50 chance - one is tempered, one is normal
        // Use consistent seed for same step to maintain bridge integrity
        srand(time(0) + step * 7 + panelIndex);
        bool isSafe = (rand() % 10 < 7);
        srand(time(0)); // Reset
        
        map<string, string> response;
        
        if (isSafe) {
            response["survived"] = "true";
            response["correctChoice"] = choice;
            response["message"] = "Tempered glass! Safe step!";
        } else {
            // Mark this panel as broken for future players
            brokenPanels[step][panelIndex] = true;
            response["survived"] = "false";
            response["correctChoice"] = choseLeft ? "right" : "left";
            response["message"] = "Normal glass! It shatters! You fall!";
        }
        
        return createJsonResponse(response);
    }
    
    static void resetBridge() {
        bridgeInitialized = false;
    }
};

// Static member initialization
bool GlassBridgeGame::brokenPanels[18][2];
bool GlassBridgeGame::bridgeInitialized = false;

class TugOfWarGame {
public:
    static string processPull(const string& playerName, int currentStrength, int turn, int opponentStrength, const string& strategy) {
        // Strategy-based Tug of War (more realistic)
        int pullStrength = 0;
        string message;
        int staminaCost = 0;
        
        // Decode strategy: 1=hard pull, 2=steady, 3=three-steps, 4=hold
        int strategyNum = 2; // default
        if (strategy == "hard" || strategy == "1") {
            strategyNum = 1;
        } else if (strategy == "steady" || strategy == "2") {
            strategyNum = 2;
        } else if (strategy == "three-steps" || strategy == "3") {
            strategyNum = 3;
        } else if (strategy == "hold" || strategy == "4") {
            strategyNum = 4;
        }
        
        switch(strategyNum) {
            case 1: // Hard pull
                pullStrength = rand() % 6 + 4; // 4-9
                staminaCost = 8;
                message = "Pulled hard!";
                break;
            case 2: // Steady
                pullStrength = rand() % 4 + 3; // 3-6
                staminaCost = 3;
                message = "Steady pull!";
                break;
            case 3: // Three-steps technique
                if (rand() % 100 < 60) { // 60% success
                    pullStrength = rand() % 8 + 6; // 6-13
                    message = "Three-steps worked! Big advantage!";
                } else {
                    pullStrength = rand() % 3 + 1; // 1-3
                    message = "Three-steps failed! Bad timing!";
                }
                staminaCost = 5;
                break;
            case 4: // Hold position
                pullStrength = rand() % 2 + 1; // 1-2
                staminaCost = -5; // Regain stamina
                message = "Held position, regained stamina!";
                break;
            default:
                pullStrength = 3;
                staminaCost = 3;
                message = "Keep pulling!";
        }
        
        int newStrength = currentStrength + pullStrength;
        
        // Determine if game is over (10 rounds or position extreme)
        bool survived = false;
        if (turn >= 10) {
            survived = (newStrength >= opponentStrength);
            message = survived ? "You won!" : "You lost!";
        } else {
            message += " Current advantage: " + to_string(newStrength - opponentStrength);
        }
        
        map<string, string> response;
        response["playerStrength"] = to_string(newStrength);
        response["opponentStrength"] = to_string(opponentStrength);
        response["survived"] = survived ? "true" : "false";
        response["message"] = message;
        response["pullStrength"] = to_string(pullStrength);
        response["staminaCost"] = to_string(staminaCost);
        
        return createJsonResponse(response);
    }
};

// ================= HTTP Server =================
class SimpleHttpServer {
private:
    SOCKET serverSocket;
    int port;
    
public:
    SimpleHttpServer(int p = 8080) : port(p), serverSocket(INVALID_SOCKET) {}
    
    bool initialize() {
#ifdef _WIN32
        WSADATA wsaData;
        if (WSAStartup(MAKEWORD(2, 2), &wsaData) != 0) {
            cerr << "WSAStartup failed" << endl;
            return false;
        }
#endif
        
        serverSocket = socket(AF_INET, SOCK_STREAM, 0);
        if (serverSocket == INVALID_SOCKET) {
            cerr << "Socket creation failed" << endl;
            return false;
        }
        
        // Set socket options to reuse address
        int opt = 1;
#ifdef _WIN32
        setsockopt(serverSocket, SOL_SOCKET, SO_REUSEADDR, (char*)&opt, sizeof(opt));
#else
        setsockopt(serverSocket, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));
#endif
        
        sockaddr_in serverAddr;
        serverAddr.sin_family = AF_INET;
        serverAddr.sin_port = htons(port);
        serverAddr.sin_addr.s_addr = INADDR_ANY;
        
        if (bind(serverSocket, (sockaddr*)&serverAddr, sizeof(serverAddr)) == SOCKET_ERROR) {
            cerr << "Bind failed" << endl;
            closesocket(serverSocket);
            return false;
        }
        
        if (listen(serverSocket, 10) == SOCKET_ERROR) {
            cerr << "Listen failed" << endl;
            closesocket(serverSocket);
            return false;
        }
        
        cout << "==================================" << endl;
        cout << "  SQUID GAME Backend Server" << endl;
        cout << "  Running on port: " << port << endl;
        cout << "==================================" << endl;
        
        return true;
    }
    
    void run() {
        while (true) {
            sockaddr_in clientAddr;
            socklen_t clientLen = sizeof(clientAddr);
            
            SOCKET clientSocket = accept(serverSocket, (sockaddr*)&clientAddr, &clientLen);
            if (clientSocket == INVALID_SOCKET) {
                cerr << "Accept failed" << endl;
                continue;
            }
            
            handleClient(clientSocket);
            closesocket(clientSocket);
        }
    }
    
    void handleClient(SOCKET clientSocket) {
        char buffer[4096] = {0};
        int bytesRead = recv(clientSocket, buffer, sizeof(buffer) - 1, 0);
        
        if (bytesRead <= 0) return;
        
        string request(buffer);
        string response = processRequest(request);
        
        // Send HTTP response with CORS headers
        stringstream httpResponse;
        httpResponse << "HTTP/1.1 200 OK\r\n";
        httpResponse << "Content-Type: application/json\r\n";
        httpResponse << "Access-Control-Allow-Origin: *\r\n";
        httpResponse << "Access-Control-Allow-Methods: POST, GET, OPTIONS\r\n";
        httpResponse << "Access-Control-Allow-Headers: Content-Type\r\n";
        httpResponse << "Content-Length: " << response.length() << "\r\n";
        httpResponse << "\r\n";
        httpResponse << response;
        
        string fullResponse = httpResponse.str();
        send(clientSocket, fullResponse.c_str(), fullResponse.length(), 0);
    }
    
    string processRequest(const string& request) {
        // Handle OPTIONS request for CORS
        if (request.find("OPTIONS") == 0) {
            return "";
        }
        
        // Parse request path and body
        size_t pathStart = request.find(" ") + 1;
        size_t pathEnd = request.find(" ", pathStart);
        string path = request.substr(pathStart, pathEnd - pathStart);
        
        // Extract JSON body
        size_t bodyStart = request.find("\r\n\r\n");
        string body = "";
        if (bodyStart != string::npos) {
            body = request.substr(bodyStart + 4);
        }
        
        cout << "Request: " << path << endl;
        
        // Route to appropriate game handler
        if (path == "/redlight") {
            string playerName = parseJsonField(body, "playerName");
            string action = parseJsonField(body, "action");
            int position = parseJsonInt(body, "position");
            return RedLightGreenLightGame::processAction(playerName, action, position);
        }
        else if (path == "/glassbridge") {
            string playerName = parseJsonField(body, "playerName");
            string choice = parseJsonField(body, "choice");
            int step = parseJsonInt(body, "step");
            return GlassBridgeGame::processChoice(playerName, choice, step);
        }
        else if (path == "/tugofwar") {
            string playerName = parseJsonField(body, "playerName");
            int strength = parseJsonInt(body, "strength");
            int turn = parseJsonInt(body, "turn");
            int opponentStrength = parseJsonInt(body, "opponentStrength");
            string strategy = parseJsonField(body, "strategy");
            return TugOfWarGame::processPull(playerName, strength, turn, opponentStrength, strategy);
        }
        else {
            map<string, string> error;
            error["error"] = "Unknown endpoint";
            return createJsonResponse(error);
        }
    }
    
    ~SimpleHttpServer() {
        if (serverSocket != INVALID_SOCKET) {
            closesocket(serverSocket);
        }
#ifdef _WIN32
        WSACleanup();
#endif
    }
};

// ================= Main =================
int main() {
    srand(static_cast<unsigned int>(time(0)));
    
    SimpleHttpServer server(8080);
    
    if (!server.initialize()) {
        cerr << "Failed to initialize server" << endl;
        return 1;
    }
    
    cout << "Waiting for connections..." << endl;
    cout << "Press Ctrl+C to stop server" << endl << endl;
    
    server.run();
    
    return 0;
}
