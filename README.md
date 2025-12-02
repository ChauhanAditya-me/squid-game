# 🦑 Squid Game - Web Application

An interactive web-based version of Squid Game challenges with a C++ backend.

## 📁 Project Structure

```
web/
├── backend/           # C++ backend server
│   ├── backend.cpp    # Server implementation
│   └── backend.exe    # Compiled server
│
├── frontend/          # Web interface
│   ├── index.html     # Main game page
│   ├── script.js      # Game logic
│   ├── style.css      # Styling
│   ├── assets/        # Images and audio
│   └── package.json   # Dependencies
│
├── scripts/           # Automation scripts
│   ├── quick-start.ps1       # Start both servers
│   ├── build-backend.ps1     # Compile and run backend
│   └── start-frontend.ps1    # Start frontend server
│
└── docs/              # Documentation
    ├── START_HERE.md  # Quick start guide
    ├── SETUP.md       # Setup instructions
    └── ...            # Other documentation
```

## 🚀 Quick Start

Run the game with one command:

```powershell
.\scripts\quick-start.ps1
```

This will:
1. Compile and start the C++ backend server (port 8080)
2. Start the frontend server (port 3000)
3. Open two terminal windows for monitoring

Then open your browser to: **http://localhost:3000**

## 🎮 Games Included

1. **Red Light, Green Light** - Move when green, freeze when red
2. **Glass Bridge** - Choose the correct glass panel (left/right)
3. **Tug of War** - Strategic team battle with 4 strategies

## 📖 Documentation

- **[START_HERE.md](docs/START_HERE.md)** - New user guide
- **[SETUP.md](docs/SETUP.md)** - Installation and setup
- **[PROJECT_OVERVIEW.md](docs/PROJECT_OVERVIEW.md)** - Technical details
- **[GAME_LOGIC_FIXES.md](docs/GAME_LOGIC_FIXES.md)** - Movie-accurate changes

## 🛠️ Manual Setup

### Backend (C++)
```powershell
cd backend
g++ backend.cpp -o backend.exe -lws2_32 -std=c++11
.\backend.exe
```

### Frontend
```powershell
cd frontend
python -m http.server 3000
# Or: npx http-server -p 3000
```

## 📋 Requirements

- **C++ Compiler**: MinGW (g++) or MSVC (cl)
- **Web Server**: Python 3.x or Node.js
- **Browser**: Modern browser (Chrome, Firefox, Edge)

## 🎯 Features

- ✅ Movie-accurate game logic
- ✅ C++ backend for authentic processing
- ✅ Responsive web interface
- ✅ Audio effects and animations
- ✅ Multiple player support
- ✅ No loading screens - instant gameplay

---

For more information, see the [docs](docs/) folder.
