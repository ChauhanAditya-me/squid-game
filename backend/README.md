# Backend Folder

This folder contains the C++ backend server and an OOP demo:

- `backend.cpp`: HTTP server handling game endpoints (runs on port 8080)
- `backend.exe`: Compiled server executable (Windows)
- `main.cpp`: Standalone OOP demo that models the core game flow

## Build & Run

- Server (recommended for the website):

  - PowerShell: run `scripts/build-backend.ps1`
  - Or manually with MinGW: `g++ backend.cpp -o backend.exe -lws2_32 -std=c++11`; then `./backend.exe`

- OOP demo (no networking, prints to console):
  - PowerShell from `backend/`: `g++ main.cpp -o main.exe -std=c++11`; then `./main.exe`

The OOP demo shows a simple GameManager controlling three games (Red Light Green Light, Glass Bridge, Tug of War), a single rulebook shown once, and a results summary. It does not affect or replace the HTTP server.

See `docs/README.md` for overall project structure and setup instructions.
