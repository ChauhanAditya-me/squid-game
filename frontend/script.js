// ================= Game State Management =================
class GameState {
  constructor() {
    this.players = [];
    this.currentPlayerIndex = 0;
    this.currentGameIndex = 0;
    this.gameNames = ["Red Light Green Light", "Glass Bridge", "Tug of War"];
    this.apiUrl = "http://localhost:8080"; // Backend API URL
    this.devMode = false; // Dev buttons hidden by default
    // Glass Bridge guarantee: one player guaranteed to succeed when >=3 alive
    this.glassBridgeGuaranteedName = null;
    // Track whether the rulebook has been shown per game index
    this.rulesShown = {};
  }

  getCurrentPlayer() {
    return this.players[this.currentPlayerIndex];
  }

  getAlivePlayers() {
    return this.players.filter((p) => p.alive);
  }

  nextPlayer() {
    do {
      this.currentPlayerIndex++;
      if (this.currentPlayerIndex >= this.players.length) {
        this.currentPlayerIndex = 0;
        return false; // Round complete
      }
    } while (!this.players[this.currentPlayerIndex].alive);
    return true;
  }

  nextGame() {
    this.currentGameIndex++;
    this.currentPlayerIndex = 0;
    // Skip eliminated players
    while (
      this.currentPlayerIndex < this.players.length &&
      !this.players[this.currentPlayerIndex].alive
    ) {
      this.currentPlayerIndex++;
    }
  }

  isGameComplete() {
    return this.currentGameIndex >= this.gameNames.length;
  }

  resetToFirstAlivePlayer() {
    this.currentPlayerIndex = 0;
    while (
      this.currentPlayerIndex < this.players.length &&
      !this.players[this.currentPlayerIndex].alive
    ) {
      this.currentPlayerIndex++;
    }
  }

  updatePlayerInfo() {
    const currentPlayer = this.getCurrentPlayer();
    const aliveCount = this.getAlivePlayers().length;
    const totalCount = this.players.length;

    if (currentPlayer) {
      document.getElementById("currentPlayer").textContent = currentPlayer.name;
    } else {
      document.getElementById("currentPlayer").textContent = "No Player";
    }
    document.getElementById(
      "alivePlayers"
    ).textContent = `Alive: ${aliveCount} / ${totalCount}`;
  }
}

const gameState = new GameState();

// ================= Timer System =================

// ================= Audio Manager =================
const bgMusic = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");
const musicIcon = document.getElementById("musicIcon");
let musicMuted = false;

function playBgMusic(forcePlay = false) {
  if (bgMusic) {
    bgMusic.volume = 0.5;
    bgMusic.muted = musicMuted;
    // Try to play, handle browser restrictions
    if (!musicMuted && (forcePlay || bgMusic.paused)) {
      const playPromise = bgMusic.play();
      if (playPromise) {
        playPromise.catch(() => {
          // Wait for user interaction to play
        });
      }
    }
  }
}

function toggleMusic() {
  if (!bgMusic || !musicIcon) return;
  musicMuted = !musicMuted;
  bgMusic.muted = musicMuted;
  musicIcon.textContent = musicMuted ? "🔇" : "🔊";
  if (!musicMuted) playBgMusic(true);
}

if (musicToggle) {
  musicToggle.onclick = toggleMusic;
}

// Try to play on load, but also on first user interaction if blocked
document.addEventListener("DOMContentLoaded", function () {
  playBgMusic();
});
window.addEventListener(
  "click",
  function () {
    playBgMusic(true);
  },
  { once: true }
);

// ================= Screen Management =================
function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.remove("active");
  });
  document.getElementById(screenId).classList.add("active");
}

function updateGameHeader() {
  const header = document.getElementById("gameHeader");
  const title = document.getElementById("gameTitle");
  const currentPlayer = document.getElementById("currentPlayer");
  const alivePlayers = document.getElementById("alivePlayers");

  if (gameState.isGameComplete()) {
    header.classList.add("hidden");
    return;
  }

  header.classList.remove("hidden");
  title.textContent = gameState.gameNames[gameState.currentGameIndex];
  currentPlayer.textContent = `Player: ${gameState.getCurrentPlayer().name}`;
  alivePlayers.textContent = `Alive: ${gameState.getAlivePlayers().length}/${
    gameState.players.length
  }`;
}

// ================= Backend API Communication =================
async function callBackend(endpoint, data) {
  // For Glass Bridge, always use local simulation to ensure fairness and first-step safety
  if (endpoint === "/glassbridge") {
    return simulateBackend(endpoint, data);
  }
  try {
    const response = await fetch(`${gameState.apiUrl}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Backend error:", error);
    // Fallback to local simulation if backend is unavailable
    return simulateBackend(endpoint, data);
  }
}

// ================= Local Backend Simulation (Fallback) =================
function simulateBackend(endpoint, data) {
  // Simulate C++ backend logic in JavaScript
  if (endpoint === "/redlight") {
    const light = Math.random() < 0.5 ? "GREEN" : "RED"; // 50/50 chance
    const survived = !(data.action === "move" && light === "RED"); // Instant death on red
    return {
      light: light,
      survived: survived,
      position:
        survived && data.action === "move" ? data.position + 1 : data.position,
      message: survived
        ? data.action === "move"
          ? "Safe move!"
          : "Stayed safe"
        : "Moved on RED! Eliminated!",
    };
  }

  if (endpoint === "/glassbridge") {
    let survived;
    let correctChoice;
    if (data.step === 0) {
      // First step always safe, regardless of choice
      survived = true;
      correctChoice = data.choice; // player's choice is always correct
    } else {
      // Guarantee: if this player is selected as guaranteed, always survive
      if (
        gameState.glassBridgeGuaranteedName &&
        data.playerName === gameState.glassBridgeGuaranteedName
      ) {
        survived = true;
        correctChoice = data.choice;
      } else {
        // 60% chance the chosen tile is safe (40% chance it breaks)
        if (Math.random() < 0.6) {
          survived = true;
          correctChoice = data.choice; // chosen side is safe
        } else {
          survived = false;
          correctChoice = data.choice === "left" ? "right" : "left"; // opposite side is safe
        }
      }
    }
    return {
      survived: survived,
      correctChoice: correctChoice,
      message: survived ? "Safe step!" : "Glass broke! You fall!",
    };
  }

  if (endpoint === "/tugofwar") {
    const playerStrength = data.strength + (Math.floor(Math.random() * 3) + 1);
    const opponentStrength =
      data.opponentStrength || Math.floor(Math.random() * 10) + 8;
    const survived = playerStrength >= opponentStrength;
    return {
      playerStrength: playerStrength,
      opponentStrength: opponentStrength,
      survived: survived,
      message: survived ? "You won!" : "You lost!",
    };
  }

  return { error: "Unknown endpoint" };
}

// ================= Welcome Screen Handlers =================
document.addEventListener("DOMContentLoaded", function () {
  const playerCountInput = document.getElementById("playerCount");
  if (playerCountInput) {
    playerCountInput.addEventListener("change", function () {
      const count = parseInt(this.value);
      const container = document.getElementById("playerNames");
      container.innerHTML = "";
      for (let i = 0; i < count; i++) {
        const input = document.createElement("input");
        input.type = "text";
        input.className = "player-name-input";
        input.placeholder = `Player ${i + 1} Name`;
        input.value = `Player ${i + 1}`;
        container.appendChild(input);
      }
    });
    // Initialize with 1 player
    playerCountInput.dispatchEvent(new Event("change"));
  }

  const startBtn = document.getElementById("startBtn");
  if (startBtn) {
    startBtn.addEventListener("click", function () {
      const playerInputs = document.querySelectorAll(".player-name-input");
      gameState.players = [];
      for (let i = 0; i < playerInputs.length; i++) {
        const input = playerInputs[i];
        gameState.players.push({
          name: input.value || "Player " + (i + 1),
          alive: true,
          position: 0,
          bridgeStep: 0,
          tugStrength: 0,
          tugTurns: 0,
        });
      }
      startGame();
    });
  }
});

// Start game from rulebook
// Removed redundant rulebook start handler

// ================= Main Game Flow =================
async function startGame() {
  if (gameState.isGameComplete()) {
    showResults();
    return;
  }

  const alivePlayers = gameState.getAlivePlayers();
  if (alivePlayers.length === 0) {
    showResults();
    return;
  }

  // Show rulebook only once per game
  const idx = gameState.currentGameIndex;
  if (gameState.rulesShown && gameState.rulesShown[idx]) {
    showScreenForCurrentGame();
  } else {
    await showRulebookForCurrentGame();
  }
}

async function showRulebookForCurrentGame() {
  // Hide all game-specific rules
  document.getElementById("rulesRedLight").style.display = "none";
  document.getElementById("rulesGlassBridge").style.display = "none";
  document.getElementById("rulesTugOfWar").style.display = "none";

  // Hide player info while viewing the rulebook
  const playerInfo = document.getElementById("playerInfo");
  if (playerInfo) {
    playerInfo.classList.add("hidden");
  }
  // Hide header while in rulebook
  const gameHeader = document.getElementById("gameHeader");
  if (gameHeader) {
    gameHeader.classList.add("hidden");
  }

  // Show only the relevant rules section
  let rulesId = "";
  switch (gameState.currentGameIndex) {
    case 0:
      rulesId = "rulesRedLight";
      break;
    case 1:
      rulesId = "rulesGlassBridge";
      break;
    case 2:
      rulesId = "rulesTugOfWar";
      break;
  }
  if (rulesId) {
    document.getElementById(rulesId).style.display = "block";
  }
  showScreen("rulebookScreen");

  // Wait for user to click "LET'S PLAY!" before starting the game
  return new Promise((resolve) => {
    const btn = document.getElementById("startGameFromRulebook");
    // Remove previous listeners
    btn.onclick = null;
    btn.onclick = () => {
      // Mark rules as shown for this game index
      gameState.rulesShown[gameState.currentGameIndex] = true;
      // Hide rulebook
      showScreenForCurrentGame();
      resolve();
    };
  });
}

function showScreenForCurrentGame() {
  updateGameHeader();
  document.getElementById("playerInfo").classList.remove("hidden");
  gameState.updatePlayerInfo();
  switch (gameState.currentGameIndex) {
    case 0:
      startRedLightGreenLight();
      break;
    case 1:
      startGlassBridge();
      break;
    case 2:
      startTugOfWar();
      break;
  }
}

// ================= Red Light Green Light =================
async function startRedLightGreenLight() {
  showScreen("redLightScreen");
  await setupRedLightGreenLightMode();
}

// ================= New Red Light / Green Light Mode =================
async function setupRedLightGreenLightMode() {
  // Dev skip button setup function
  const btnSkipRedLight = document.getElementById("btnSkipRedLight");
  function updateDevSkipButton() {
    if (gameState.devMode) {
      btnSkipRedLight.style.display = "inline-block";
      btnSkipRedLight.onclick = function () {
        player.rlg_attempts = config.requiredAttempts;
        attemptSlots.forEach((slot) => {
          slot.textContent = "";
          slot.classList.add("filled");
        });
        finishPlayer();
      };
    } else {
      btnSkipRedLight.style.display = "none";
      btnSkipRedLight.onclick = null;
    }
  }
  updateDevSkipButton();
  // Listen for devMode changes (polling every 500ms)
  let lastDevMode = gameState.devMode;
  const devModeInterval = setInterval(() => {
    if (gameState.devMode !== lastDevMode) {
      lastDevMode = gameState.devMode;
      updateDevSkipButton();
    }
    // If screen changes, stop polling
    if (document.getElementById("redLightScreen").style.display === "none") {
      clearInterval(devModeInterval);
    }
  }, 500);
  // Configurable parameters (exposed for easy tuning)
  const config = {
    totalTime: 15, // seconds
    requiredAttempts: 4,
    greenMin: 250, // ms
    greenMax: 500, // ms
    redMin: 400, // ms
    redMax: 2200, // ms
    moveCooldown: 300, // ms
    inputWindow: 120, // ms grace period
    readyTimeout: 8000, // ms to auto-ready
  };

  // State
  const player = gameState.getCurrentPlayer();
  player.rlg_attempts = 0;
  player.rlg_timer = config.totalTime;
  player.rlg_eliminated = false;
  let lightState = "red";
  let canMove = false;
  let lastMoveTime = 0;
  let timerInterval = null;
  let lightTimeout = null;
  let running = false;
  let ready = false;
  let readyTimeoutHandle = null;

  // UI elements
  const centralLight = document.getElementById("centralLight");
  const centralLightSymbol = document.getElementById("centralLightSymbol");
  const centralLightText = document.getElementById("centralLightText");
  const btnSingleMove = document.getElementById("btnSingleMove");
  const countdownValue = document.getElementById("countdownValue");
  const attemptSlots = [
    document.getElementById("attemptSlot1"),
    document.getElementById("attemptSlot2"),
    document.getElementById("attemptSlot3"),
    document.getElementById("attemptSlot4"),
  ];
  const feedbackOverlay = document.getElementById("feedbackOverlay");
  const eliminationModal = document.getElementById("eliminationModal");
  const eliminationReason = document.getElementById("eliminationReason");
  const eliminationContinueBtn = document.getElementById(
    "eliminationContinueBtn"
  );

  // Reset UI
  centralLight.className = "central-light red";
  centralLightSymbol.textContent = "🔴";
  centralLightText.textContent = "READY?";
  countdownValue.textContent = config.totalTime;
  attemptSlots.forEach((slot) => {
    slot.textContent = "";
    slot.classList.remove("filled");
  });
  feedbackOverlay.style.display = "none";
  eliminationModal.style.display = "none";
  btnSingleMove.textContent = "READY";
  btnSingleMove.disabled = false;

  // Inline status bar (for accessibility)
  btnSingleMove.style.background = "";
  btnSingleMove.classList.remove(
    "btn-single-move-success",
    "btn-single-move-fail"
  );

  // Ready flow
  function confirmReady() {
    if (ready) return;
    ready = true;
    btnSingleMove.textContent = "MOVE";
    btnSingleMove.disabled = false;
    centralLightText.textContent = "RED";
    running = true;
    setLight("red");
    setTimeout(nextLightCycle, 800);
    timerInterval = setInterval(updateTimer, 1000);
    // After ready, set button to move handler
    btnSingleMove.onclick = handleMove;
  }
  // Initial button handler: always starts ready flow
  btnSingleMove.onclick = function () {
    confirmReady();
  };
  // Removed auto-ready: game only starts when player presses READY

  // Timer logic
  function updateTimer() {
    if (!running) return;
    player.rlg_timer -= 1;
    countdownValue.textContent = player.rlg_timer;
    if (player.rlg_timer <= 0) {
      eliminatePlayer("Timeout!");
    }
  }

  // Light logic
  function setLight(state) {
    lightState = state;
    if (state === "green") {
      centralLight.className = "central-light green";
      centralLightSymbol.textContent = "🟢";
      centralLightText.textContent = "GREEN";
      canMove = true;
    } else {
      centralLight.className = "central-light red";
      centralLightSymbol.textContent = "🔴";
      centralLightText.textContent = "RED";
      canMove = false;
    }
  }

  function nextLightCycle() {
    if (!running) return;
    if (player.rlg_attempts >= config.requiredAttempts) return;
    // Green phase
    setLight("green");
    // Make greenMin less frequent than greenMax
    // 75% chance to pick a value closer to greenMax, 25% chance to pick greenMin
    let greenDuration;
    if (Math.random() < 0.25) {
      greenDuration = config.greenMin;
    } else {
      greenDuration =
        Math.floor(Math.random() * (config.greenMax - config.greenMin + 1)) +
        config.greenMin;
      // Bias towards higher values
      greenDuration = Math.floor((greenDuration + config.greenMax) / 2);
    }
    lightTimeout = setTimeout(() => {
      setLight("red");
      const redDuration =
        Math.floor(Math.random() * (config.redMax - config.redMin + 1)) +
        config.redMin;
      lightTimeout = setTimeout(nextLightCycle, redDuration);
    }, greenDuration);
  }

  // Move handler
  function handleMove() {
    if (!running || player.rlg_eliminated) return;
    const now = Date.now();
    if (now - lastMoveTime < config.moveCooldown) return; // cooldown
    lastMoveTime = now;
    if (lightState === "green" && canMove) {
      // Success
      player.rlg_attempts++;
      const slot = attemptSlots[player.rlg_attempts - 1];
      slot.textContent = "";
      slot.classList.add("filled", "flash");
      setTimeout(() => {
        slot.classList.remove("flash");
      }, 500);
      if (player.rlg_attempts >= config.requiredAttempts) {
        // Passed round
        finishPlayer();
      }
    } else {
      // Moved on red
      eliminatePlayer("Moved during RED!");
    }
  }

  // Feedback overlay
  function showFeedback(msg) {
    feedbackOverlay.textContent = msg;
    feedbackOverlay.classList.add("show");
    feedbackOverlay.style.display = "flex";
    setTimeout(() => {
      feedbackOverlay.classList.remove("show");
      feedbackOverlay.style.display = "none";
    }, 700);
  }

  // Elimination modal
  function eliminatePlayer(reason) {
    running = false;
    player.rlg_eliminated = true;
    clearInterval(timerInterval);
    clearTimeout(lightTimeout);
    eliminationReason.textContent = `Eliminated! ${reason}`;
    eliminationModal.style.display = "flex";
    player.alive = false;
  }
  eliminationContinueBtn.onclick = () => {
    eliminationModal.style.display = "none";
    moveToNextPlayer();
  };

  // Finish modal
  function finishPlayer() {
    running = false;
    clearInterval(timerInterval);
    clearTimeout(lightTimeout);
    showFeedback("Round Complete!");
    setTimeout(() => {
      moveToNextPlayer();
    }, 900);
  }

  // Do not start timer or light cycle until READY is pressed
}

let currentTimerInterval = null;

function startActionTimer() {
  // Clear any existing timer first
  if (currentTimerInterval) {
    clearInterval(currentTimerInterval);
    currentTimerInterval = null;
  }

  const container = document.getElementById("actionTimerContainer");
  const valueElement = document.getElementById("actionTimerValue");
  const progressElement = document.getElementById("actionTimerProgress");

  if (!container || !valueElement || !progressElement) {
    return;
  }

  // Attach timer to the current game's main area (below rules)
  const currentScreen = document.querySelector(".screen.active");
  const gameArea = currentScreen
    ? currentScreen.querySelector(".game-area")
    : null;
  if (gameArea && container.parentElement !== gameArea) {
    gameArea.appendChild(container);
  }

  // Show timer if hidden (only on first start)
  if (
    container.style.display === "none" ||
    container.classList.contains("hidden")
  ) {
    container.classList.remove("hidden");
    container.style.display = "block";
  }

  // Reset timer state
  container.classList.remove("warning", "danger");
  let timeLeft = 10;
  valueElement.textContent = timeLeft;
  progressElement.style.width = "100%";

  currentTimerInterval = setInterval(function () {
    timeLeft--;
    valueElement.textContent = timeLeft;
    progressElement.style.width = (timeLeft / 10) * 100 + "%";

    // Update colors based on time left
    container.classList.remove("warning", "danger");
    if (timeLeft <= 3) {
      container.classList.add("danger");
    } else if (timeLeft <= 5) {
      container.classList.add("warning");
    }

    if (timeLeft <= 0) {
      stopActionTimer();
      handleTimeout();
    }
  }, 1000);
}

function handleTimeout() {
  const currentScreen = document.querySelector(".screen.active");
  if (!currentScreen) return;

  if (currentScreen.id === "redLightScreen") {
    handleRedLightAction("stay");
  } else if (currentScreen.id === "glassBridgeScreen") {
    const randomChoice = Math.random() < 0.5 ? "left" : "right";
    handleBridgeChoice(randomChoice);
  } else if (currentScreen.id === "tugOfWarScreen") {
    if (window.endTugRound) {
      window.endTugRound();
    }
  }
}

function stopActionTimer() {
  if (currentTimerInterval) {
    clearInterval(currentTimerInterval);
    currentTimerInterval = null;
  }
}

function hideActionTimer() {
  stopActionTimer();
  const container = document.getElementById("actionTimerContainer");
  if (container) {
    container.style.display = "none";
    container.classList.remove("warning", "danger");
    container.classList.add("hidden");
  }
}

async function setupRedLightGame() {
  const player = gameState.getCurrentPlayer();
  const finishLine = 4;

  updateRedLightTrack();
  document.getElementById("lightIndicator").className = "light-circle";
  document.getElementById("lightText").textContent = "Ready?";
  document.getElementById("lightText").className = "light-text";
  document.getElementById("statusMessage").textContent = "";
  document.getElementById("statusMessage").className = "status-message";

  // Enable buttons
  document.getElementById("btnMove").disabled = false;
  document.getElementById("btnStay").disabled = false;
  document.getElementById("btnSkipRound").disabled = false;

  // Start timer for this player's turn
  startActionTimer();

  // Set up button event listeners
  document.getElementById("btnMove").onclick = function () {
    handleRedLightAction("move");
  };
  document.getElementById("btnStay").onclick = function () {
    handleRedLightAction("stay");
  };
  document.getElementById("btnSkipRound").onclick = function () {
    skipRedLightRound();
  };
}

function updateRedLightTrack() {
  const player = gameState.getCurrentPlayer();
  const finishLine = 4;
  const track = document.getElementById("trackDisplay");
  track.innerHTML = "";

  for (let i = 0; i <= finishLine; i++) {
    const dot = document.createElement("div");
    dot.className = "track-dot";
    if (i === player.position) dot.classList.add("player");
    if (i === finishLine) dot.classList.add("finish");
    track.appendChild(dot);
  }
}

async function handleRedLightAction(action) {
  const player = gameState.getCurrentPlayer();
  const finishLine = 4;

  // Stop current timer
  stopActionTimer();

  // Disable buttons during processing
  document.getElementById("btnMove").disabled = true;
  document.getElementById("btnStay").disabled = true;

  const result = await callBackend("/redlight", {
    playerName: player.name,
    action: action,
    position: player.position,
  });

  // Parse backend response (backend sends strings, convert to proper types)
  const survived = result.survived === true || result.survived === "true";
  const position = parseInt(result.position);

  // Show light
  const lightIndicator = document.getElementById("lightIndicator");
  const lightText = document.getElementById("lightText");
  lightIndicator.className = `light-circle ${result.light.toLowerCase()}`;
  lightText.className = `light-text ${result.light.toLowerCase()}`;
  lightText.textContent = result.light;

  await sleep(400); // Reduced from 800

  // Update player position
  player.position = position;
  updateRedLightTrack();

  // Show status
  const statusMsg = document.getElementById("statusMessage");
  statusMsg.textContent = result.message;
  statusMsg.className = `status-message ${survived ? "success" : "danger"}`;

  // Audio removed

  await sleep(800); // Reduced from 1500

  if (!survived) {
    player.alive = false;
    await sleep(500); // Reduced from 1000
    moveToNextPlayer();
  } else if (player.position >= finishLine) {
    statusMsg.textContent = `${player.name} reached the finish!`;
    statusMsg.className = "status-message success";
    await sleep(1000); // Reduced from 2000
    moveToNextPlayer();
  } else {
    // Continue same player - restart timer
    document.getElementById("btnMove").disabled = false;
    document.getElementById("btnStay").disabled = false;
    document.getElementById("btnSkipRound").disabled = false;
    startActionTimer();
  }
}

async function skipRedLightRound() {
  const player = gameState.getCurrentPlayer();
  const finishLine = 4;

  // Disable buttons
  document.getElementById("btnMove").disabled = true;
  document.getElementById("btnStay").disabled = true;
  document.getElementById("btnSkipRound").disabled = true;

  // Auto-win the current player
  player.position = finishLine;
  updateRedLightTrack();

  const statusMsg = document.getElementById("statusMessage");
  statusMsg.textContent = `⚡ DEV: ${player.name} auto-completed!`;
  statusMsg.className = "status-message success";

  await sleep(800); // Reduced from 1500
  moveToNextPlayer();
}

// ================= Glass Bridge =================
async function startGlassBridge() {
  showScreen("glassBridgeScreen");
  const player = gameState.getCurrentPlayer();
  // If there are at least 3 alive players and no guarantee assigned, pick one
  if (!gameState.glassBridgeGuaranteedName) {
    const alive = gameState.getAlivePlayers();
    if (alive.length >= 3) {
      const pick = alive[Math.floor(Math.random() * alive.length)];
      gameState.glassBridgeGuaranteedName = pick.name;
    }
  }
  player.bridgeStep = 0;
  // Create bridge state: array of 'safe' or 'broken' for each step, null for unknown
  player.bridgeState = Array(5).fill(null);
  // Reset last choice so we don't bias initial positioning
  player.lastChoice = null;
  updateBridgeDisplay();
  // Initialize and show a single overlay player indicator (no per-tile images)
  const bridgePlayer = document.getElementById("bridgePlayer");
  if (bridgePlayer) {
    bridgePlayer.style.display = "block";
    bridgePlayer.style.position = "absolute";
    bridgePlayer.innerHTML =
      '<img src="assets/amongus.webp" alt="Player" style="width:54px;height:54px;display:block;">';
    // Ensure overlay is on top in DOM for stacking/positioning
    const container = document.querySelector(".bridge-container");
    if (container) container.appendChild(bridgePlayer);
  }
  document.getElementById("bridgeStatus").textContent = "";
  document.getElementById("bridgeStatus").className = "status-message";
  document.getElementById("btnSkipBridge").disabled = false;
  // Wire dev skip for Glass Bridge
  const btnSkipBridge = document.getElementById("btnSkipBridge");
  if (btnSkipBridge) {
    btnSkipBridge.onclick = skipBridgeRound;
    btnSkipBridge.style.display = gameState.devMode ? "inline-block" : "none";
  }
  startActionTimer();
  // Remove left/right button listeners (no longer used)
  document.getElementById("btnLeft").style.display = "none";
  document.getElementById("btnRight").style.display = "none";
  // Position player at start after layout settles
  centerStartAfterLayout();
  // Enable click only on the next row
  updateBridgeInteractivity();
}

function updateBridgeDisplay() {
  const player = gameState.getCurrentPlayer();
  const totalSteps = 5;
  const bridgeDisplay = document.getElementById("bridgeDisplay");
  bridgeDisplay.innerHTML = "";
  for (let i = 0; i < totalSteps; i++) {
    const row = document.createElement("div");
    row.className = "bridge-row";
    row.style.position = "relative";
    const leftTile = document.createElement("div");
    leftTile.className = "bridge-tile";
    leftTile.dataset.position = i;
    leftTile.dataset.side = "left";
    const rightTile = document.createElement("div");
    rightTile.className = "bridge-tile";
    rightTile.dataset.position = i;
    rightTile.dataset.side = "right";
    // Set tile state from player.bridgeState
    if (player.bridgeState && player.bridgeState[i]) {
      if (player.bridgeState[i] === "left-safe") leftTile.classList.add("safe");
      if (player.bridgeState[i] === "right-safe")
        rightTile.classList.add("safe");
      if (player.bridgeState[i] === "left-broken")
        leftTile.classList.add("broken");
      if (player.bridgeState[i] === "right-broken")
        rightTile.classList.add("broken");
    }
    row.appendChild(leftTile);
    row.appendChild(rightTile);
    bridgeDisplay.appendChild(row);
  }
}

// ===== Glass Bridge Helpers: geometry, animation, interactivity =====
function getBridgeContainer() {
  return document.querySelector(".bridge-container");
}

function getContainerPadding(container) {
  const cs = window.getComputedStyle(container);
  const padLeft = parseFloat(cs.paddingLeft) || 0;
  const padTop = parseFloat(cs.paddingTop) || 0;
  return { padLeft, padTop };
}

function getTileElement(side, row) {
  const bridgeDisplay = document.getElementById("bridgeDisplay");
  if (!bridgeDisplay) return null;
  return bridgeDisplay.querySelector(
    `.bridge-tile[data-side="${side}"][data-position="${row}"]`
  );
}

function getTileCenter(side, row) {
  const container = getBridgeContainer();
  const tile = getTileElement(side, row);
  if (!container || !tile) return null;
  const cr = container.getBoundingClientRect();
  const tr = tile.getBoundingClientRect();
  const { padLeft, padTop } = getContainerPadding(container);
  return {
    x: tr.left - cr.left - padLeft + tr.width / 2,
    y: tr.top - cr.top - padTop + tr.height / 2,
  };
}

function getRowMidCenter(row) {
  const left = getTileCenter("left", row);
  const right = getTileCenter("right", row);
  if (!left || !right) return null;
  return { x: (left.x + right.x) / 2, y: (left.y + right.y) / 2 };
}

function positionBridgePlayerAtStart() {
  const player = gameState.getCurrentPlayer();
  const bp = document.getElementById("bridgePlayer");
  if (!bp) return;
  // Start on podium for first step; otherwise place on last chosen tile or row center
  let center = null;
  if (player.bridgeStep <= 0) {
    center = getStartCenter(-16);
  }
  if (!center) {
    const currentRow = Math.max(0, player.bridgeStep);
    if (player.lastChoice === "left" || player.lastChoice === "right") {
      center = getTileCenter(player.lastChoice, currentRow - 1);
    }
    if (!center) center = getRowMidCenter(currentRow);
  }
  if (!center) return;
  bp.style.left = `${center.x}px`;
  bp.style.top = `${center.y}px`;
}

function centerStartAfterLayout() {
  // Defer to let layout complete (fonts, sizes, margins)
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const startPoint = getStartCenter(-12) || {
        x: getBridgeContainer().clientWidth / 2,
        y: getBridgeContainer().clientHeight - 60,
      };
      positionBridgePlayerToPoint(startPoint, false);
    });
  });
}

function positionBridgePlayer(side, row, withHop = false) {
  const bp = document.getElementById("bridgePlayer");
  const center = side && (row || row === 0) ? getTileCenter(side, row) : null;
  if (!bp || !center) return;
  if (withHop) {
    bp.classList.remove("stepping");
    // trigger reflow for animation restart
    void bp.offsetWidth;
    bp.classList.add("stepping");
    setTimeout(() => bp.classList.remove("stepping"), 260);
  }
  bp.style.left = `${center.x}px`;
  bp.style.top = `${center.y}px`;
}

function positionBridgePlayerToPoint(point, withHop = false) {
  const bp = document.getElementById("bridgePlayer");
  if (!bp || !point) return;
  if (withHop) {
    bp.classList.remove("stepping");
    void bp.offsetWidth;
    bp.classList.add("stepping");
    setTimeout(() => bp.classList.remove("stepping"), 260);
  }
  bp.style.left = `${point.x}px`;
  bp.style.top = `${point.y}px`;
}

function getPodiumCenter() {
  // Removed function as it is no longer needed
}

function getStartCenter(offsetY = 0) {
  const container = getBridgeContainer();
  if (container) {
    const tiles = container.querySelector("#bridgeDisplay");
    const cr = container.getBoundingClientRect();
    const { padLeft, padTop } = getContainerPadding(container);
    if (tiles) {
      const tr = tiles.getBoundingClientRect();
      const x = container.clientWidth / 2;
      const y = tr.bottom - cr.top - padTop + 40 + offsetY; // 40px beneath tiles
      return { x, y };
    }
    // If tiles not found, fall back to container bottom center
    const x = container.clientWidth / 2;
    const y = container.clientHeight - 60 + offsetY;
    return { x, y };
  }
  return null;
}

function getFinishTarget(offset = 28) {
  const container = getBridgeContainer();
  const finish = container ? container.querySelector(".bridge-finish") : null;
  if (!container || !finish) return null;
  const cr = container.getBoundingClientRect();
  const fr = finish.getBoundingClientRect();
  const { padLeft, padTop } = getContainerPadding(container);
  return {
    x: fr.left - cr.left - padLeft + fr.width / 2,
    y: fr.top - cr.top - padTop - offset,
  };
}

async function animateFinishCrossing() {
  const target = getFinishTarget(30);
  if (!target) return;
  positionBridgePlayerToPoint(target, true);
  await sleep(350);
}

function updateBridgeInteractivity() {
  const bridgeDisplay = document.getElementById("bridgeDisplay");
  if (!bridgeDisplay) return;
  const currentRow = gameState.getCurrentPlayer().bridgeStep;
  Array.from(bridgeDisplay.querySelectorAll(".bridge-tile")).forEach((tile) => {
    const row = parseInt(tile.dataset.position);
    tile.onpointerdown = null;
    tile.classList.remove("clickable", "inactive");
    if (row === currentRow) {
      tile.classList.add("clickable");
      tile.onpointerdown = (e) => {
        e.preventDefault();
        // Lock input immediately
        disableBridgeInteractivity();
        const side = tile.dataset.side;
        // Animate to clicked tile
        positionBridgePlayer(side, row, true);
        // Process logic
        handleBridgeChoice(side);
      };
    } else {
      tile.classList.add("inactive");
    }
  });

  // If still at start, recenter once more in case of late layout shifts
  if (currentRow === 0 && gameState.getCurrentPlayer().lastChoice == null) {
    centerStartAfterLayout();
  }
}

function disableBridgeInteractivity() {
  const bridgeDisplay = document.getElementById("bridgeDisplay");
  if (!bridgeDisplay) return;
  Array.from(bridgeDisplay.querySelectorAll(".bridge-tile")).forEach((tile) => {
    tile.classList.remove("clickable");
    tile.onpointerdown = null;
  });
}

async function handleBridgeChoice(choice) {
  const player = gameState.getCurrentPlayer();
  player.lastChoice = choice;

  const totalSteps = 5; // Increased from 3 to 5

  // Stop timer when choice is made
  stopActionTimer();

  // Disable buttons
  document.getElementById("btnLeft").disabled = true;
  document.getElementById("btnRight").disabled = true;
  document.getElementById("btnSkipBridge").disabled = true;

  const result = await callBackend("/glassbridge", {
    playerName: player.name,
    choice: choice,
    step: player.bridgeStep,
  });

  // Parse backend response (convert string to boolean)
  let survived = result.survived === true || result.survived === "true";
  // Enforce first step safety client-side regardless of backend
  if (player.bridgeStep === 0) {
    survived = true;
    result.correctChoice = choice;
    result.message = "Safe step!";
  }

  // Update bridge state and UI
  const step = player.bridgeStep;
  if (survived) {
    if (result.correctChoice === "left") {
      player.bridgeState[step] = "left-safe";
    } else {
      player.bridgeState[step] = "right-safe";
    }
    player.bridgeStep++;
  } else {
    if (step !== 0) {
      if (result.correctChoice === "left") {
        player.bridgeState[step] = "right-broken";
      } else {
        player.bridgeState[step] = "left-broken";
      }
    }
    await sleep(400);
  }
  updateBridgeDisplay();
  // Show status
  const statusMsg = document.getElementById("bridgeStatus");
  statusMsg.textContent = result.message;
  statusMsg.className = `status-message ${survived ? "success" : "danger"}`;
  await sleep(800);
  if (!survived) {
    // Simple fall animation
    const bp = document.getElementById("bridgePlayer");
    if (bp) bp.classList.add("falling");
    player.alive = false;
    await sleep(600);
    if (bp) bp.classList.remove("falling");
    moveToNextPlayer();
  } else if (player.bridgeStep >= totalSteps) {
    // Hop beyond the finish line for a satisfying end
    await animateFinishCrossing();
    statusMsg.textContent = `${player.name} crossed the bridge!`;
    statusMsg.className = "status-message success";
    await sleep(800);
    moveToNextPlayer();
  } else {
    // Continue same player
    document.getElementById("btnLeft").disabled = false;
    document.getElementById("btnRight").disabled = false;
    document.getElementById("btnSkipBridge").disabled = false;
    // Position overlay at the tile we just stepped on (already moved), then enable next row
    updateBridgeInteractivity();
    startActionTimer();
  }
}

async function skipBridgeRound() {
  const player = gameState.getCurrentPlayer();
  const totalSteps = 5; // Increased from 3 to 5

  // Stop any running turn timers and disable tile input
  stopActionTimer();
  disableBridgeInteractivity();

  // Disable buttons
  document.getElementById("btnLeft").disabled = true;
  document.getElementById("btnRight").disabled = true;
  document.getElementById("btnSkipBridge").disabled = true;

  // Auto-win the current player
  player.bridgeStep = totalSteps;
  updateBridgeDisplay();

  const statusMsg = document.getElementById("bridgeStatus");
  statusMsg.textContent = `⚡ DEV: ${player.name} auto-completed!`;
  statusMsg.className = "status-message success";

  // Give a satisfying finish hop animation
  await animateFinishCrossing();
  await sleep(700);
  moveToNextPlayer();
}

// ================= Tug of War =================
async function startTugOfWar() {
  showScreen("tugOfWarScreen");
  const player = gameState.getCurrentPlayer();
  // Initialize minigame state
  player.tugStrength = 0;
  const status = document.getElementById("tugStatus");
  const strengthValue = document.getElementById("tugStrengthValue");
  const tugTimeValue = document.getElementById("tugTimeValue");
  const track = document.getElementById("tugTrack");
  const targetEl = document.getElementById("tugTarget");
  const barEl = document.getElementById("tugBar");
  const growBtn = document.getElementById("tugGrowBtn");

  status.textContent = "";
  status.className = "status-message";
  // Keep shared action timer hidden until first tap/click
  hideActionTimer();
  let tugTimerStarted = false;

  let running = true;
  let lastTs = null;
  const duration = 10; // seconds per player
  let elapsed = 0;
  let trackWidth = 0;

  function measure() {
    const rect = track.getBoundingClientRect();
    trackWidth = rect.width;
  }
  measure();
  window.addEventListener("resize", measure);

  // Target window motion (random-walk with acceleration)
  let targetX = 18; // px from left
  const targetW = 100;
  let targetV = 0; // px/s
  let targetA = 0; // px/s^2
  let accelTimer = 0; // seconds until next acceleration change
  const minV = 80;
  const maxV = 340;
  const maxA = 600;
  function randomizeAccel() {
    targetA = (Math.random() * 2 - 1) * maxA; // [-maxA, maxA]
    accelTimer = 0.18 + Math.random() * 0.6; // 0.18-0.78s
  }
  randomizeAccel();

  // Bar logic (tap to extend, idle shrinks)
  const barLeft = 2; // align visually with target padding
  const barMin = 6;
  let barWidth = barMin;
  const barMax = Math.max(60, trackWidth * 0.85);
  const shrinkSpeed = 210; // px/s
  const baseInc = 30; // px per tap
  let lastTapAt = 0; // ms timestamp

  function place() {
    // clamp target inside track
    targetX = Math.max(2, Math.min(trackWidth - targetW - 2, targetX));
    targetEl.style.left = targetX + "px";
    // place bar by width from left
    const clampedW = Math.max(
      barMin,
      Math.min(barWidth, trackWidth - barLeft - 4)
    );
    barEl.style.width = clampedW + "px";
  }
  place();

  // Use dedicated button for taps; disable track click
  track.onpointerdown = null;
  function handleTap() {
    if (!running) return;
    const now = performance.now();
    const dt = lastTapAt ? Math.max(0.04, (now - lastTapAt) / 1000) : 0.35; // seconds
    lastTapAt = now;
    // Start the shared timer on the first tap
    if (!tugTimerStarted) {
      startActionTimer();
      tugTimerStarted = true;
    }
    const bonus = Math.min(5.0, 0.5 / dt); // faster clicks => bigger bonus (0..5)
    const inc = baseInc * (1 + bonus);
    barWidth = Math.min(barMax, barWidth + inc);
  }
  if (growBtn) {
    growBtn.onclick = (e) => {
      // visual tap animation
      growBtn.classList.remove("tap-anim");
      void growBtn.offsetWidth; // restart animation
      growBtn.classList.add("tap-anim");
      handleTap();
    };
  }
  // Keyboard support: Space/Enter as taps
  function keyTap(e) {
    if (e.code === "Space" || e.code === "Enter") {
      e.preventDefault();
      handleTap();
    }
  }
  window.addEventListener("keydown", keyTap);

  // Allow global timer timeout to end the round cleanly
  window.endTugRound = () => {
    if (!running) return;
    running = false;
    if (growBtn) {
      growBtn.onclick = null;
    }
    track.onpointerdown = null;
    window.removeEventListener("keydown", keyTap);
    window.removeEventListener("resize", measure);
    status.textContent = `Time! Final strength: ${Math.floor(
      player.tugStrength
    )}`;
    setTimeout(() => moveToNextPlayer(), 700);
  };

  function step(ts) {
    if (!running) return;
    if (lastTs == null) lastTs = ts;
    const dt = Math.min(0.05, (ts - lastTs) / 1000);
    lastTs = ts;
    elapsed += dt;

    // Target random-walk with boundary bounce
    accelTimer -= dt;
    if (accelTimer <= 0) randomizeAccel();
    targetV += targetA * dt;
    if (Math.abs(targetV) < minV) targetV = (targetV >= 0 ? 1 : -1) * minV;
    if (targetV > maxV) targetV = maxV;
    if (targetV < -maxV) targetV = -maxV;
    targetX += targetV * dt;
    if (targetX <= 2) {
      targetX = 2;
      targetV = Math.abs(targetV);
      randomizeAccel();
    } else if (targetX + targetW >= trackWidth - 2) {
      targetX = trackWidth - 2 - targetW;
      targetV = -Math.abs(targetV);
      randomizeAccel();
    }

    // Passive shrink when idle between taps
    barWidth -= shrinkSpeed * dt;
    if (barWidth < barMin) barWidth = barMin;

    // Scoring: keep the bar's tip (right edge) inside the moving window
    const barTip = barLeft + barWidth;
    const inWindow = barTip >= targetX && barTip <= targetX + targetW;
    // Toggle bar color based on alignment
    if (inWindow) {
      player.tugStrength += dt * 28; // gain per second inside window
      barEl.classList.add("good");
    } else {
      barEl.classList.remove("good");
    }
    strengthValue.textContent = Math.floor(player.tugStrength);

    place();

    requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

function updateTugDisplay() {
  const player = gameState.getCurrentPlayer();
  document.getElementById("playerStrength").textContent = player.tugStrength;
  document.getElementById("opponentStrength").textContent =
    player.tugTurns >= 5 ? player.opponentStrength : "?";
  document.getElementById(
    "turnCounter"
  ).textContent = `Turn: ${player.tugTurns}/5`;

  // Update rope marker position
  if (player.tugTurns >= 5) {
    const total = player.tugStrength + player.opponentStrength;
    const percentage = total > 0 ? (player.tugStrength / total) * 100 : 50;
    document.getElementById("ropeMarker").style.left = `${percentage}%`;
  } else {
    document.getElementById("ropeMarker").style.left = "50%";
  }
}

async function handlePull() {
  const player = gameState.getCurrentPlayer();
  const maxTurns = 5;

  // Stop timer when pulling
  stopActionTimer();

  // Disable button
  document.getElementById("btnPull").disabled = true;
  document.getElementById("btnSkipTug").disabled = true;

  const result = await callBackend("/tugofwar", {
    playerName: player.name,
    strength: player.tugStrength,
    turn: player.tugTurns + 1,
    opponentStrength: player.opponentStrength,
  });

  player.tugStrength = result.playerStrength;
  player.tugTurns++;

  updateTugDisplay();
  const statusMsg = document.getElementById("tugStatus");
  statusMsg.textContent = `Pull +${
    result.playerStrength -
    player.tugStrength +
    (Math.floor(Math.random() * 3) + 1)
  } strength!`;
  statusMsg.className = "status-message success";

  await sleep(600);

  if (player.tugTurns >= maxTurns) {
    // Final result
    player.opponentStrength = result.opponentStrength;
    updateTugDisplay();

    await sleep(600);

    statusMsg.textContent = `${player.tugStrength} vs ${player.opponentStrength} - ${result.message}`;
    statusMsg.className = `status-message ${
      result.survived ? "success" : "danger"
    }`;

    if (result.survived) {
    } else {
      player.alive = false;
    }

    await sleep(1200);
    moveToNextPlayer();
  } else {
    // Continue - restart timer
    document.getElementById("btnPull").disabled = false;
    document.getElementById("btnSkipTug").disabled = false;
    startActionTimer();
  }
}

async function skipTugRound() {
  const player = gameState.getCurrentPlayer();

  // Disable buttons
  document.getElementById("btnPull").disabled = true;
  document.getElementById("btnSkipTug").disabled = true;

  // Auto-win
  player.tugStrength = 99;
  player.tugTurns = 5;
  updateTugDisplay();

  const statusMsg = document.getElementById("tugStatus");
  statusMsg.textContent = `⚡ DEV: ${player.name} auto-won!`;
  statusMsg.className = "status-message success";

  await sleep(1500);
  moveToNextPlayer();
}

// ================= Player/Game Transition =================
function moveToNextPlayer() {
  // Hide timer when moving to next player
  hideActionTimer();

  const hasNextPlayer = gameState.nextPlayer();

  if (!hasNextPlayer) {
    // All players finished this game, move to next game
    // If Tug of War just finished, keep only top strength players alive
    const justFinishedIndex = gameState.currentGameIndex;
    if (justFinishedIndex === 2) {
      const alive = gameState.getAlivePlayers();
      if (alive.length > 0) {
        const maxStrength = Math.max(
          ...alive.map((p) => Math.floor(p.tugStrength || 0))
        );
        gameState.players.forEach((p) => {
          if (p.alive) {
            const s = Math.floor(p.tugStrength || 0);
            p.alive = s === maxStrength; // ties survive
          }
        });
      }
    }

    gameState.nextGame();
    gameState.resetToFirstAlivePlayer();

    if (
      gameState.getAlivePlayers().length === 0 ||
      gameState.isGameComplete()
    ) {
      showResults();
    } else {
      startGame();
    }
  } else {
    // Next player in same game
    updateGameHeader();
    startGame();
  }
}

// ================= Results Screen =================
function showResults() {
  showScreen("resultsScreen");
  // Ensure player info bar is hidden on results
  const playerInfo = document.getElementById("playerInfo");
  if (playerInfo) {
    playerInfo.classList.add("hidden");
  }
  // Hide game header on results
  const gameHeader = document.getElementById("gameHeader");
  if (gameHeader) {
    gameHeader.classList.add("hidden");
  }
  const resultsDisplay = document.getElementById("resultsDisplay");
  resultsDisplay.innerHTML = "";

  gameState.players.forEach((player, index) => {
    setTimeout(() => {
      const item = document.createElement("div");
      item.className = `result-item ${
        player.alive ? "survivor" : "eliminated"
      }`;
      const strength = Math.floor(player.tugStrength || 0);
      item.innerHTML = `
                <span>${player.name}</span>
                <span class="result-strength">${strength} STR</span>
                <span>${player.alive ? "✓ SURVIVED" : "✗ ELIMINATED"}</span>
            `;
      item.style.animationDelay = `${index * 0.1}s`;
      resultsDisplay.appendChild(item);
    }, index * 200);
  });

  if (gameState.getAlivePlayers().length > 0) {
    // Winner sound removed
  }
}

document.getElementById("restartBtn").addEventListener("click", () => {
  // Reset game state
  gameState.players = [];
  gameState.currentPlayerIndex = 0;
  gameState.currentGameIndex = 0;

  // Reset displays
  document.getElementById("playerCount").value = 2;
  document.getElementById("playerCount").dispatchEvent(new Event("change"));

  // Keep player info hidden on welcome screen
  const playerInfo = document.getElementById("playerInfo");
  if (playerInfo) {
    playerInfo.classList.add("hidden");
  }
  // Keep header hidden on welcome screen
  const gameHeader = document.getElementById("gameHeader");
  if (gameHeader) {
    gameHeader.classList.add("hidden");
  }

  showScreen("welcomeScreen");
});

// ================= Utility Functions =================
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ================= Dev Mode Key Combo (Ctrl+D) =================
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key === "d") {
    e.preventDefault();
    gameState.devMode = !gameState.devMode;

    // Toggle visibility of all dev buttons
    const devButtons = document.querySelectorAll(".btn-dev");
    devButtons.forEach((btn) => {
      btn.style.display = gameState.devMode ? "inline-block" : "none";
    });

    // Show notification
    const notification = document.createElement("div");
    notification.textContent = `⚡ Dev Mode: ${
      gameState.devMode ? "ON" : "OFF"
    }`;
    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${gameState.devMode ? "#00ff00" : "#ff0000"};
            color: #000;
            padding: 15px 25px;
            border-radius: 8px;
            font-weight: bold;
            z-index: 10000;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        `;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 2000);
  }
});

// ================= Initialize =================
console.log("Squid Game Loaded! Ready to play.");
console.log("Press Ctrl+D to toggle Dev Mode");

// Hide dev buttons on load
document.addEventListener("DOMContentLoaded", () => {
  const devButtons = document.querySelectorAll(".btn-dev");
  devButtons.forEach((btn) => {
    btn.style.display = "none";
  });

  // Initialize stats display
  updatePlayerStats();
});

function updatePlayerStats() {
  const currentPlayerElement = document.getElementById("currentPlayer");
  const alivePlayersElement = document.getElementById("alivePlayers");

  if (!currentPlayerElement || !alivePlayersElement) {
    return;
  }

  // Check if players exist and are initialized
  if (!gameState.players || gameState.players.length === 0) {
    currentPlayerElement.textContent = "No Player";
    alivePlayersElement.textContent = "Alive: 0 / 0";
    return;
  }

  const currentPlayer = gameState.getCurrentPlayer();
  const alivePlayers = gameState.getAlivePlayers().length;
  const totalPlayers = gameState.players.length;

  if (currentPlayer) {
    currentPlayerElement.textContent = currentPlayer.name;
  } else {
    currentPlayerElement.textContent = "No Player";
  }

  alivePlayersElement.textContent = `Alive: ${alivePlayers} / ${totalPlayers}`;
}

// Update player stats every 2 seconds instead of every second for better performance
setInterval(updatePlayerStats, 2000);

// ================= Action Timer =================
