# Squid Game - Interactive Web Game

An interactive web-based recreation of the popular Squid Game challenges with C++ backend logic and modern HTML5/CSS3/JavaScript frontend.

## 🎮 Game Features

### Games Included:
1. **Red Light Green Light** - Move on green, freeze on red!
2. **Glass Bridge** - Choose the correct glass panel to survive
3. **Tug of War** - Pull your way to victory

### Features:
- ✨ Smooth CSS3 animations and transitions
- 🎨 Dark, cinematic theme inspired by Squid Game
- 🎵 Background music and sound effects support
- 📱 Responsive design for all devices
- 🔄 Real-time backend communication
- 👥 Multi-player support (1-10 players)
- 🎯 Async game state management

## 🏗️ Project Structure

```
web/
├── index.html          # Main HTML structure
├── style.css           # All styles and animations
├── script.js           # Frontend game logic and API communication
├── backend.cpp         # C++ backend server with game logic
├── assets/             # Audio files (create this folder)
│   ├── background.mp3  # Background music
│   ├── move.mp3        # Move sound effect
│   ├── win.mp3         # Win sound effect
│   ├── lose.mp3        # Lose/elimination sound effect
│   └── shatter.mp3     # Glass breaking sound effect
└── README.md           # This file
```

## 🚀 Setup Instructions

### Prerequisites
- C++ compiler (g++, MSVC, or clang)
- Web browser (Chrome, Firefox, Edge recommended)
- (Optional) Local web server for serving HTML files

### Backend Setup (C++ Server)

#### Windows:
```powershell
# Compile the backend server
g++ backend.cpp -o backend.exe -lws2_32

# Or using MSVC
cl backend.cpp ws2_32.lib

# Run the server
.\backend.exe
```

#### Linux/Mac:
```bash
# Compile the backend server
g++ backend.cpp -o backend -std=c++11

# Run the server
./backend
```

The server will start on `http://localhost:8080`

### Frontend Setup

#### Option 1: Using Python's HTTP Server (Recommended)
```powershell
# Navigate to the web directory
cd web

# Start a simple HTTP server (Python 3)
python -m http.server 3000

# Or Python 2
python -m SimpleHTTPServer 3000
```

Then open: `http://localhost:3000`

#### Option 2: Using Node.js HTTP Server
```powershell
# Install http-server globally
npm install -g http-server

# Navigate to web directory
cd web

# Start server
http-server -p 3000
```

#### Option 3: Direct File Access (Limited functionality)
Simply open `index.html` in your browser. Note: Backend communication may not work due to CORS restrictions.

### Audio Files Setup

Create an `assets` folder in the `web` directory and add your audio files:
- `background.mp3` - Looping background music
- `move.mp3` - Sound for successful moves
- `win.mp3` - Victory sound
- `lose.mp3` - Elimination sound
- `shatter.mp3` - Glass breaking sound

**Note:** The game will work without audio files, but sound effects enhance the experience.

## 🎯 How to Play

1. **Start the backend server** first (backend.exe or ./backend)
2. **Open the frontend** in your web browser
3. **Enter number of players** (1-10) and their names
4. **Click START GAME** to begin
5. Follow the on-screen instructions for each game:
   - **Red Light Green Light**: Choose to MOVE or STAY based on the light
   - **Glass Bridge**: Choose LEFT or RIGHT to cross safely
   - **Tug of War**: PULL 5 times to build strength
6. View final results showing survivors!

## 🔧 Configuration

### Change Backend Port
Edit `backend.cpp`:
```cpp
SimpleHttpServer server(8080); // Change port here
```

Edit `script.js`:
```javascript
this.apiUrl = 'http://localhost:8080'; // Update to match backend
```

### Adjust Game Difficulty
Edit `backend.cpp`:
- Red Light: Change `rand() % 100 < 70` (70% green light chance)
- Glass Bridge: Modify step count in frontend
- Tug of War: Adjust `rand() % 3 + 1` for pull strength

## 🌐 Backend API Endpoints

### POST /redlight
**Request:**
```json
{
  "playerName": "Player1",
  "action": "move",
  "position": 2
}
```
**Response:**
```json
{
  "light": "GREEN",
  "survived": "true",
  "position": "3",
  "message": "Safe move!"
}
```

### POST /glassbridge
**Request:**
```json
{
  "playerName": "Player1",
  "choice": "left",
  "step": 0
}
```
**Response:**
```json
{
  "survived": "true",
  "correctChoice": "left",
  "message": "Safe step!"
}
```

### POST /tugofwar
**Request:**
```json
{
  "playerName": "Player1",
  "strength": 5,
  "turn": 3,
  "opponentStrength": 12
}
```
**Response:**
```json
{
  "playerStrength": "8",
  "opponentStrength": "12",
  "survived": "false",
  "message": "You lost!"
}
```

## 🎨 Customization

### Colors
Edit CSS variables in `style.css`:
```css
:root {
    --primary-color: #d32f2f;
    --accent-color: #00ff88;
    --danger-color: #ff1744;
    --success-color: #00e676;
}
```

### Animations
Modify animation durations and effects in `style.css`:
```css
@keyframes fadeInScale {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
}
```

## 🐛 Troubleshooting

### Backend not connecting
- Ensure backend.exe is running
- Check port 8080 is not in use
- Verify firewall allows connections
- Check console for CORS errors

### Frontend not loading
- Use a proper HTTP server (not file://)
- Check browser console for errors
- Ensure all file paths are correct

### No sound
- Check audio files exist in `assets/` folder
- Browser may block autoplay - click on page first
- Verify audio file formats are supported

### Game logic issues
- Check backend console for error messages
- Verify JSON parsing is working correctly
- Test API endpoints individually

## 📝 Development Notes

### Fallback Mode
If the backend is unavailable, the frontend includes a JavaScript fallback that simulates the C++ game logic. This ensures the game remains playable even without the backend server.

### Cross-Origin Resource Sharing (CORS)
The backend includes CORS headers to allow frontend communication from any origin. In production, restrict this to specific domains.

### Future Enhancements
- [ ] WebSocket support for real-time updates
- [ ] Player authentication system
- [ ] Leaderboard and statistics
- [ ] More games from the series
- [ ] Replay functionality
- [ ] Mobile app version

## 📄 License

This project is created for educational purposes. Squid Game is a trademark of Netflix.

## 🤝 Contributing

Feel free to fork this project and add your own improvements:
- Additional games
- Better animations
- Enhanced sound effects
- Multiplayer networking
- Database integration

## 📧 Support

If you encounter issues:
1. Check the troubleshooting section
2. Review browser console logs
3. Verify backend server logs
4. Ensure all files are in correct locations

---

**Enjoy the game and may the odds be ever in your favor!** 🎮
