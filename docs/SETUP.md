# Quick Setup Guide

## 🚀 Method 1: PowerShell Quick Start (Easiest)

1. **Run the quick start script:**
   ```powershell
   cd web
   .\quick-start.ps1
   ```
   This will open two windows: one for backend, one for frontend.

2. **Open your browser:**
   Navigate to `http://localhost:3000`

3. **Play the game!** 🎮

---

## 🔧 Method 2: Manual Setup

### Step 1: Compile Backend
```powershell
cd web
g++ backend.cpp -o backend.exe -lws2_32 -std=c++11
```

### Step 2: Run Backend
```powershell
.\backend.exe
```
Keep this terminal open. You should see:
```
==================================
  SQUID GAME Backend Server
  Running on port: 8080
==================================
```

### Step 3: Start Frontend (New Terminal)
```powershell
cd web
python -m http.server 3000
```

### Step 4: Open Browser
Go to `http://localhost:3000`

---

## 📦 Method 3: Using Node.js

### Step 1: Install Dependencies
```powershell
cd web
npm install
```

### Step 2: Start Frontend
```powershell
npm start
```

### Step 3: Compile and Run Backend (Separate Terminal)
```powershell
cd web
g++ backend.cpp -o backend.exe -lws2_32 -std=c++11
.\backend.exe
```

---

## ⚠️ Troubleshooting

### Backend Won't Compile
**Problem:** `g++` not found
**Solution:** Install MinGW or Visual Studio with C++ tools

**Problem:** Port 8080 already in use
**Solution:** Change port in `backend.cpp` and `script.js`

### Frontend Won't Load
**Problem:** Python not found
**Solution:** Install Python from python.org or use Node.js method

**Problem:** CORS errors
**Solution:** Don't use `file://` - use HTTP server

### Game Not Working
**Problem:** Backend not responding
**Solution:** 
1. Check backend.exe is running
2. Look for errors in backend terminal
3. Check browser console (F12)

**Problem:** No audio
**Solution:** Audio files are optional. Add MP3 files to `assets/` folder

---

## 🎮 Quick Test

After setup, verify everything works:

1. ✓ Backend running: Visit `http://localhost:8080/` in browser (should return error - that's OK!)
2. ✓ Frontend running: Visit `http://localhost:3000` (should show game)
3. ✓ Communication working: Start game, click buttons (check browser console for errors)

---

## 📁 Required Files Checklist

```
web/
├── ✓ index.html
├── ✓ style.css
├── ✓ script.js
├── ✓ backend.cpp
├── ✓ backend.exe (after compilation)
├── ✓ README.md
└── assets/ (optional)
    ├── background.mp3
    ├── move.mp3
    ├── win.mp3
    ├── lose.mp3
    └── shatter.mp3
```

---

## 🎯 Next Steps

Once running:
1. Click "START GAME"
2. Enter player names
3. Follow game instructions
4. Have fun! 🎉

Need help? Check the main README.md for detailed documentation.
