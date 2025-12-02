# 🎮 Squid Game - Interactive Web Application
## Complete Project Overview

---

## 📋 Table of Contents
1. [Project Description](#project-description)
2. [Architecture](#architecture)
3. [Features](#features)
4. [Technologies Used](#technologies-used)
5. [File Structure](#file-structure)
6. [Quick Start](#quick-start)
7. [Detailed Setup](#detailed-setup)
8. [Game Mechanics](#game-mechanics)
9. [API Documentation](#api-documentation)
10. [Customization Guide](#customization-guide)
11. [Troubleshooting](#troubleshooting)
12. [Future Enhancements](#future-enhancements)

---

## 🎯 Project Description

This is a fully interactive web-based game inspired by the popular Netflix series "Squid Game". The project features:

- **Frontend**: Modern HTML5, CSS3, and ES6 JavaScript with smooth animations
- **Backend**: C++ server handling game logic via HTTP API
- **Design**: Dark, cinematic theme with responsive layout
- **Audio**: Background music and sound effects support
- **Gameplay**: Three iconic games from the series

---

## 🏗️ Architecture

```
┌─────────────────┐         HTTP/JSON         ┌─────────────────┐
│                 │◄──────────────────────────►│                 │
│   Frontend      │   POST /redlight          │   C++ Backend   │
│   (Browser)     │   POST /glassbridge       │   (Port 8080)   │
│                 │   POST /tugofwar          │                 │
│   - HTML/CSS    │                           │   - Game Logic  │
│   - JavaScript  │                           │   - Random Gen  │
│   - Animations  │                           │   - State Mgmt  │
└─────────────────┘                           └─────────────────┘
        │                                              │
        │                                              │
        ▼                                              ▼
  User Actions                                  JSON Responses
  (Click Buttons)                               (Game Results)
```

### Communication Flow:
1. User clicks action button (Move, Stay, Left, Right, Pull)
2. JavaScript sends JSON request to C++ backend
3. Backend processes game logic (random outcomes, win/loss)
4. Backend returns JSON response
5. Frontend updates UI with animations
6. Process repeats for next action

### Fallback Mode:
If backend is unavailable, JavaScript includes simulation logic to keep the game playable.

---

## ✨ Features

### Visual Features:
- ✅ Smooth CSS3 animations and transitions
- ✅ Traffic light indicator with color animations
- ✅ Glass bridge with shattering effects
- ✅ Rope marker movement for Tug of War
- ✅ Player progress tracking
- ✅ Elimination animations
- ✅ Results screen with survivor list
- ✅ Responsive design (mobile-friendly)
- ✅ Dark, cinematic theme

### Functional Features:
- ✅ Multi-player support (1-10 players)
- ✅ Real-time game state management
- ✅ Async backend communication
- ✅ Sound effects and background music
- ✅ Error handling and loading states
- ✅ JSON-based API
- ✅ Cross-origin resource sharing (CORS)
- ✅ Game replay functionality

### Game Features:
- ✅ Red Light Green Light (4 steps to finish)
- ✅ Glass Bridge (3 correct choices to survive)
- ✅ Tug of War (5 pulls, strength-based)
- ✅ Persistent game state across rounds
- ✅ Random outcomes from C++ backend
- ✅ Win/loss logic enforcement

---

## 🛠️ Technologies Used

### Frontend:
- **HTML5**: Semantic markup, audio elements
- **CSS3**: Flexbox, Grid, Animations, Gradients, Transforms
- **JavaScript (ES6+)**: 
  - Classes for state management
  - Async/await for API calls
  - Fetch API for HTTP requests
  - DOM manipulation
  - Event handling

### Backend:
- **C++ (C++11)**: 
  - Socket programming (WinSock2 on Windows)
  - HTTP server implementation
  - JSON parsing (manual)
  - Game logic algorithms
  - Random number generation

### Development Tools:
- **Compilers**: g++, MSVC, or Clang
- **Servers**: Python HTTP server, Node.js http-server
- **Browsers**: Chrome, Firefox, Edge (modern browsers)

---

## 📁 File Structure

```
web/
│
├── index.html              # Main game interface
├── style.css               # All styles and animations
├── script.js               # Frontend logic and API communication
├── backend.cpp             # C++ backend server
│
├── test.html               # Backend testing page
├── package.json            # Node.js configuration (optional)
├── .gitignore             # Git ignore rules
│
├── README.md               # Main documentation
├── SETUP.md                # Quick setup guide
├── PROJECT_OVERVIEW.md     # This file
│
├── build-backend.ps1       # PowerShell: Compile backend
├── start-frontend.ps1      # PowerShell: Start frontend server
├── quick-start.ps1         # PowerShell: Start both servers
│
└── assets/                 # Audio files directory
    ├── README.md           # Audio setup instructions
    ├── background.mp3      # Background music (user-provided)
    ├── move.mp3            # Move sound effect (user-provided)
    ├── win.mp3             # Win sound effect (user-provided)
    ├── lose.mp3            # Lose sound effect (user-provided)
    └── shatter.mp3         # Shatter sound effect (user-provided)
```

---

## 🚀 Quick Start

### Option 1: PowerShell Quick Start (Windows - Easiest)
```powershell
cd web
.\quick-start.ps1
# Opens two terminals and starts both servers
# Navigate to http://localhost:3000 in your browser
```

### Option 2: Manual Start
```powershell
# Terminal 1 - Backend
cd web
g++ backend.cpp -o backend.exe -lws2_32 -std=c++11
.\backend.exe

# Terminal 2 - Frontend
cd web
python -m http.server 3000

# Browser
# Open http://localhost:3000
```

### Option 3: Node.js
```powershell
cd web
npm install
npm start
# In another terminal: compile and run backend.exe
```

---

## 📖 Detailed Setup

### Prerequisites:
1. **C++ Compiler** (one of):
   - MinGW (g++) - Recommended for Windows
   - Visual Studio with C++ tools (cl.exe)
   - GCC on Linux/Mac

2. **Web Server** (one of):
   - Python 3.x (built-in http.server)
   - Node.js with http-server
   - Any static file server

### Step-by-Step:

#### 1. Compile Backend
**Windows (MinGW):**
```powershell
g++ backend.cpp -o backend.exe -lws2_32 -std=c++11
```

**Windows (MSVC):**
```powershell
cl backend.cpp ws2_32.lib /EHsc
```

**Linux/Mac:**
```bash
g++ backend.cpp -o backend -std=c++11
chmod +x backend
```

#### 2. Run Backend
```powershell
.\backend.exe  # Windows
./backend      # Linux/Mac
```

Expected output:
```
==================================
  SQUID GAME Backend Server
  Running on port: 8080
==================================
Waiting for connections...
Press Ctrl+C to stop server
```

#### 3. Start Frontend Server
**Python:**
```powershell
python -m http.server 3000
```

**Node.js:**
```powershell
npm install -g http-server
http-server -p 3000
```

#### 4. Open Game
Navigate to: `http://localhost:3000`

#### 5. Test Connection (Optional)
Open: `http://localhost:3000/test.html`
Click test buttons to verify backend communication.

---

## 🎮 Game Mechanics

### Game 1: Red Light Green Light

**Objective**: Reach position 4 without moving on RED light

**Rules**:
- Each turn, a random light appears (70% GREEN, 30% RED)
- MOVE on GREEN: advance one position
- MOVE on RED: elimination
- STAY: always safe

**Backend Logic**:
```cpp
bool isGreen = (rand() % 100) < 70;
if (action == "move" && !isGreen) {
    survived = false; // Eliminated
}
```

**Win Condition**: position >= 4

---

### Game 2: Glass Bridge

**Objective**: Make 3 correct tile choices

**Rules**:
- Each step has 2 tiles: LEFT and RIGHT
- One is safe (tempered glass), one breaks
- Path is random but consistent per player
- Wrong choice = elimination

**Backend Logic**:
```cpp
// Generate random path for player
for (int i = 0; i < 3; i++) {
    isRightSafe[i] = (rand() % 2 == 0);
}
// Check player's choice
survived = (playerChoice == correctChoice);
```

**Win Condition**: Complete all 3 steps

---

### Game 3: Tug of War

**Objective**: Build more strength than opponent

**Rules**:
- Pull 5 times
- Each pull adds 1-3 random strength
- Opponent has random strength (8-17)
- Higher total wins

**Backend Logic**:
```cpp
int gain = rand() % 3 + 1;
playerStrength += gain;
int opponentStrength = rand() % 10 + 8;
survived = (playerStrength >= opponentStrength);
```

**Win Condition**: playerStrength >= opponentStrength after 5 pulls

---

## 📡 API Documentation

### Base URL
```
http://localhost:8080
```

### Endpoints

#### 1. POST /redlight
Test Red Light Green Light action

**Request:**
```json
{
  "playerName": "string",
  "action": "move" | "stay",
  "position": number
}
```

**Response:**
```json
{
  "light": "GREEN" | "RED",
  "survived": "true" | "false",
  "position": "number",
  "message": "string"
}
```

**Example:**
```javascript
fetch('http://localhost:8080/redlight', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    playerName: "Player1",
    action: "move",
    position: 2
  })
});
```

---

#### 2. POST /glassbridge
Test Glass Bridge choice

**Request:**
```json
{
  "playerName": "string",
  "choice": "left" | "right",
  "step": number
}
```

**Response:**
```json
{
  "survived": "true" | "false",
  "correctChoice": "left" | "right",
  "message": "string"
}
```

---

#### 3. POST /tugofwar
Test Tug of War pull

**Request:**
```json
{
  "playerName": "string",
  "strength": number,
  "turn": number,
  "opponentStrength": number
}
```

**Response:**
```json
{
  "playerStrength": "number",
  "opponentStrength": "number",
  "survived": "true" | "false",
  "message": "string"
}
```

---

## 🎨 Customization Guide

### Change Colors
Edit `style.css`:
```css
:root {
    --primary-color: #d32f2f;      /* Red theme */
    --accent-color: #00ff88;       /* Green accents */
    --danger-color: #ff1744;       /* Elimination red */
    --success-color: #00e676;      /* Success green */
}
```

### Adjust Game Difficulty

**Red Light (more green lights):**
```cpp
// backend.cpp line ~65
bool isGreen = (rand() % 100) < 80; // 80% green instead of 70%
```

**Glass Bridge (more steps):**
```javascript
// script.js
const totalSteps = 5; // Increase from 3
```

**Tug of War (easier opponent):**
```cpp
// backend.cpp line ~120
int opponentStrength = rand() % 5 + 5; // Weaker: 5-9 instead of 8-17
```

### Change Port

**Backend:**
```cpp
// backend.cpp line ~200
SimpleHttpServer server(3000); // Change from 8080
```

**Frontend:**
```javascript
// script.js line ~15
this.apiUrl = 'http://localhost:3000';
```

### Add More Players
```javascript
// index.html line ~65
<input type="number" id="playerCount" min="1" max="20" value="1">
```

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: `backend.exe` won't compile
- **Solution**: Install MinGW or Visual Studio C++ tools
- **Check**: Run `g++ --version` to verify compiler

**Problem**: Port 8080 already in use
- **Solution**: Kill process using port or change port in code
- **Windows**: `netstat -ano | findstr :8080` then `taskkill /PID <pid> /F`

**Problem**: Backend crashes immediately
- **Solution**: Check for antivirus blocking, run as administrator

---

### Frontend Issues

**Problem**: Page won't load
- **Solution**: Use HTTP server, not file:// protocol
- **Check**: URL should be `http://localhost:3000`, not `file:///`

**Problem**: CORS errors in console
- **Solution**: Backend includes CORS headers, make sure it's running
- **Check**: Backend should log "Request: /redlight" when you play

**Problem**: Buttons don't respond
- **Solution**: Open browser console (F12), check for JavaScript errors
- **Check**: Verify backend is running and responsive

---

### Game Logic Issues

**Problem**: All players eliminated immediately
- **Solution**: Check backend logic, may need to adjust probabilities

**Problem**: Game stuck on loading
- **Solution**: Backend may be slow, check console for timeout errors

**Problem**: Inconsistent glass bridge path
- **Solution**: Backend stores path per player, clear state if needed

---

### Audio Issues

**Problem**: No sound
- **Solution**: Audio files are optional, game works without them
- **Add files**: Place MP3 files in `assets/` folder

**Problem**: Audio blocked
- **Solution**: Browser may block autoplay, click on page to allow
- **Check**: Console will show "Audio autoplay blocked"

---

## 🔮 Future Enhancements

### Potential Features:
- [ ] WebSocket for real-time multiplayer
- [ ] Database for persistent leaderboards
- [ ] User authentication and profiles
- [ ] More games from the series (Marbles, Honeycomb)
- [ ] Replay/spectator mode
- [ ] Mobile app version (React Native)
- [ ] 3D graphics with Three.js or WebGL
- [ ] Tournament mode
- [ ] AI opponents
- [ ] Streaming integration

### Technical Improvements:
- [ ] Compile backend to WebAssembly for browser execution
- [ ] Add TypeScript for frontend type safety
- [ ] Implement state management library (Redux)
- [ ] Add unit tests and E2E tests
- [ ] Docker containerization
- [ ] CI/CD pipeline
- [ ] Performance monitoring
- [ ] Accessibility improvements (ARIA labels)

---

## 📞 Support & Contact

### Getting Help:
1. Read this documentation thoroughly
2. Check SETUP.md for quick start guide
3. Use test.html to verify backend connection
4. Review browser console (F12) for errors
5. Check backend terminal for log messages

### Common Resources:
- **C++ Socket Programming**: Windows Sockets 2 (Winsock2) documentation
- **JavaScript Fetch API**: MDN Web Docs
- **CSS Animations**: CSS-Tricks, MDN
- **HTTP Servers**: Python docs, Node.js docs

---

## 📜 License & Credits

**Project**: Educational demonstration
**Inspired by**: Netflix's Squid Game series
**Technologies**: HTML5, CSS3, JavaScript, C++
**Created**: 2025

⚠️ **Disclaimer**: This is a fan-made project for educational purposes. Squid Game is a trademark of Netflix. All rights to the original concept and characters belong to their respective owners.

---

## 🎉 Conclusion

You now have a fully functional, interactive Squid Game web application with:
- Beautiful frontend with animations
- Powerful C++ backend handling game logic
- Complete documentation and setup scripts
- Extensible architecture for future enhancements

**Enjoy the game and may the odds be ever in your favor!** 🎮

---

*Last Updated: 2025*
*Version: 1.0.0*
