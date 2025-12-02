# 📚 Documentation Index

Welcome to the Squid Game Web Application documentation! This index will help you find exactly what you need.

---

## 🚀 Quick Start

**New to the project? Start here:**

1. **[SETUP.md](SETUP.md)** - Quick setup guide (5 minutes)
   - Three different methods to get started
   - Step-by-step instructions
   - Troubleshooting tips

2. **[quick-start.ps1](quick-start.ps1)** - One-click launcher (Windows)
   - Automatically starts both servers
   - Opens in separate terminal windows

---

## 📖 Main Documentation

### For Users

**[README.md](README.md)** - Main project documentation
- Game features overview
- Setup instructions (detailed)
- How to play guide
- API endpoint reference
- Configuration options
- Troubleshooting section

**[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Complete overview
- What's included in the project
- Feature checklist
- Technology stack
- Learning opportunities
- Next steps and ideas

### For Developers

**[PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md)** - Architecture & technical details
- System architecture diagram
- Communication flow
- Complete API documentation
- Backend implementation details
- Customization guide
- Future enhancement ideas

**[VISUAL_GUIDE.md](VISUAL_GUIDE.md)** - Design & animations
- Visual component breakdown
- CSS animation reference
- Color palette documentation
- Layout guidelines
- Customization examples

---

## 💻 Code Files

### Frontend

**[index.html](index.html)**
- Main game interface
- 5 screens: Welcome, 3 games, Results
- Audio elements
- Responsive structure

**[style.css](style.css)**
- Complete styling (~800 lines)
- CSS animations and transitions
- Responsive design
- Color system (CSS variables)

**[script.js](script.js)**
- Game state management
- API communication
- Event handlers
- Audio management
- Local simulation fallback

### Backend

**[backend.cpp](backend.cpp)**
- HTTP server implementation
- Game logic (Red Light, Glass Bridge, Tug of War)
- JSON parsing and generation
- CORS support
- Socket programming (WinSock2)

### Testing

**[test.html](test.html)**
- Backend connection tester
- API endpoint verification
- Debug tool for developers
- Status indicator

---

## 🛠️ Automation Scripts

**[build-backend.ps1](build-backend.ps1)** (PowerShell)
- Detects available C++ compiler
- Compiles backend.cpp
- Runs the server automatically
- Error handling

**[start-frontend.ps1](start-frontend.ps1)** (PowerShell)
- Starts HTTP server for frontend
- Python or fallback to direct file opening
- User-friendly output

**[quick-start.ps1](quick-start.ps1)** (PowerShell)
- Launches both backend and frontend
- Opens two separate terminal windows
- Complete automation

---

## 📦 Configuration Files

**[package.json](package.json)**
- Node.js project configuration
- Optional npm scripts
- Dependencies for http-server

**[.gitignore](.gitignore)**
- Git ignore rules
- Excludes compiled files
- Protects audio assets

---

## 🎵 Assets

**[assets/README.md](assets/README.md)**
- Audio file requirements
- Where to find audio
- Format specifications
- License considerations
- Works without audio (optional)

**Required Audio Files** (user-provided):
- `background.mp3` - Background music
- `move.mp3` - Move sound effect
- `win.mp3` - Victory sound
- `lose.mp3` - Elimination sound
- `shatter.mp3` - Glass breaking sound

---

## 📚 Documentation Guide

### By Topic

#### Setup & Installation
- **Quick**: [SETUP.md](SETUP.md) → Method 1 (PowerShell)
- **Detailed**: [README.md](README.md) → Setup Instructions
- **Troubleshooting**: [README.md](README.md) → Troubleshooting

#### Game Design
- **Visual**: [VISUAL_GUIDE.md](VISUAL_GUIDE.md)
- **Mechanics**: [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md) → Game Mechanics
- **Customization**: [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md) → Customization Guide

#### Development
- **Architecture**: [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md) → Architecture
- **API**: [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md) → API Documentation
- **Code Reference**: Individual file comments

#### Audio
- **Setup**: [assets/README.md](assets/README.md)
- **Integration**: [script.js](script.js) → Audio Manager section

---

## 🎯 Common Tasks

### "I want to..."

#### ...get started quickly
→ [SETUP.md](SETUP.md) or run [quick-start.ps1](quick-start.ps1)

#### ...understand the architecture
→ [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md)

#### ...customize the colors
→ [VISUAL_GUIDE.md](VISUAL_GUIDE.md) → Color Palette

#### ...test the backend API
→ Open [test.html](test.html) in browser

#### ...change game difficulty
→ [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md) → Customization Guide

#### ...add audio files
→ [assets/README.md](assets/README.md)

#### ...fix connection issues
→ [README.md](README.md) → Troubleshooting

#### ...modify animations
→ [VISUAL_GUIDE.md](VISUAL_GUIDE.md) → Animations

#### ...understand the code
→ Read inline comments in [script.js](script.js) and [backend.cpp](backend.cpp)

#### ...deploy to production
→ [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md) → Future Enhancements

---

## 📊 File Overview

### By Size (approximate)
1. **style.css** - ~800 lines (styling)
2. **script.js** - ~700 lines (frontend logic)
3. **backend.cpp** - ~500 lines (backend server)
4. **PROJECT_OVERVIEW.md** - ~600 lines (documentation)
5. **VISUAL_GUIDE.md** - ~500 lines (design docs)
6. **README.md** - ~400 lines (main docs)
7. **index.html** - ~200 lines (structure)

### By Purpose

**Essential for Running:**
- index.html
- style.css
- script.js
- backend.cpp

**Essential for Setup:**
- README.md
- SETUP.md

**Helpful but Optional:**
- PROJECT_OVERVIEW.md
- VISUAL_GUIDE.md
- PROJECT_SUMMARY.md
- test.html

**Automation (Optional):**
- build-backend.ps1
- start-frontend.ps1
- quick-start.ps1

---

## 🔍 Search Guide

### Find Information About...

**Backend:**
- Implementation → [backend.cpp](backend.cpp)
- API → [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md) → API Documentation
- Testing → [test.html](test.html)

**Frontend:**
- Structure → [index.html](index.html)
- Styling → [style.css](style.css)
- Logic → [script.js](script.js)

**Games:**
- Red Light Green Light → Search "RedLight" in files
- Glass Bridge → Search "GlassBridge" in files
- Tug of War → Search "TugOfWar" in files

**Visual Design:**
- Colors → [style.css](style.css) → :root variables
- Animations → [VISUAL_GUIDE.md](VISUAL_GUIDE.md)
- Layout → [VISUAL_GUIDE.md](VISUAL_GUIDE.md) → Layout Guidelines

---

## 🗺️ Learning Path

### Beginner Path
1. Read [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Get overview
2. Follow [SETUP.md](SETUP.md) - Get it running
3. Play the game - Experience it firsthand
4. Read [README.md](README.md) - Understand features

### Developer Path
1. Read [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md) - Architecture
2. Study [script.js](script.js) - Frontend patterns
3. Study [backend.cpp](backend.cpp) - Backend logic
4. Read [VISUAL_GUIDE.md](VISUAL_GUIDE.md) - Design system
5. Experiment with customization

### Designer Path
1. Read [VISUAL_GUIDE.md](VISUAL_GUIDE.md) - Complete visual reference
2. Study [style.css](style.css) - Implementation details
3. Review animations in browser DevTools
4. Experiment with color/animation changes

---

## 📞 Support Resources

### When Things Go Wrong

**Backend Issues:**
1. Check [README.md](README.md) → Troubleshooting → Backend Issues
2. Verify compiler installation
3. Check port availability (8080)
4. Review backend terminal output

**Frontend Issues:**
1. Check [README.md](README.md) → Troubleshooting → Frontend Issues
2. Use [test.html](test.html) to verify connection
3. Open browser console (F12)
4. Verify HTTP server is running

**Game Logic Issues:**
1. Check backend terminal for errors
2. Verify API responses in browser Network tab
3. Review game logic in [backend.cpp](backend.cpp)
4. Check JavaScript console for errors

**Audio Issues:**
1. Read [assets/README.md](assets/README.md)
2. Remember: Audio is optional
3. Check browser console for audio errors
4. Click page to allow autoplay

---

## 🎓 Educational Use

### For Teaching

**Topics Covered:**
- Full-stack development
- C++ socket programming
- Modern JavaScript
- CSS animations
- RESTful APIs
- JSON data format

**Suggested Exercises:**
1. Trace a complete API call (frontend → backend → response)
2. Add a new button color variant
3. Adjust game difficulty parameters
4. Create a new game following existing patterns
5. Add a new animation effect

### For Portfolio

**Highlight Points:**
- Real C++ backend (not just JavaScript)
- Professional documentation (5 markdown files)
- Modern web technologies
- Complete game implementation
- Clean, commented code

**Demo Script:**
1. Show the game in action
2. Explain C++/JavaScript integration
3. Highlight animations
4. Walk through code organization
5. Discuss architecture decisions

---

## 📝 Quick Reference

### Important URLs (when running)
- Frontend: http://localhost:3000
- Backend: http://localhost:8080
- Test Page: http://localhost:3000/test.html

### Important Commands
```powershell
# Compile backend (Windows)
g++ backend.cpp -o backend.exe -lws2_32 -std=c++11

# Run backend
.\backend.exe

# Start frontend (Python)
python -m http.server 3000

# One-click start (Windows)
.\quick-start.ps1
```

### Important Files to Edit
- Colors: `style.css` (lines 10-16, :root variables)
- Game Difficulty: `backend.cpp` (search for "rand()")
- Port: `backend.cpp` (line ~200) & `script.js` (line ~15)
- Player Limit: `index.html` (line ~65)

---

## 🎉 You're Ready!

This documentation index should help you navigate the project easily. Whether you're:
- 👨‍💻 A developer learning full-stack development
- 🎨 A designer studying animations and UX
- 🎮 A gamer wanting to play
- 📚 A student using this for education

You now know where to find everything you need!

**Happy coding and gaming!** 🚀

---

*Last Updated: 2025*
*All documentation is comprehensive and interconnected*
*Start with SETUP.md for quickest results*
