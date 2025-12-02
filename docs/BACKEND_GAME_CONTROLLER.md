# Squid Game – Backend Game Controller and Game Logic

This document explains how the game is powered by the backend controller implemented in `web/main.cpp`. It covers the tournament orchestration, the player model, and detailed mechanics for each game: Red Light Green Light, Glass Bridge, and Tug of War. The content here is directly aligned with the code and its runtime behavior.

---

## Architecture Overview

- **Controller:** `GameManager`
  - Orchestrates the tournament: registers players, runs games in order, shows rules once per game, applies survivor rules, and prints final results.
  - Sequence: Red Light Green Light → Glass Bridge → Tug of War.
- **Games API:** `class Game`
  - `virtual const char* title() const` – game display name.
  - `virtual void startRound(vector<Player>& players)` – optional per-round setup.
  - `virtual void play(Player& p)` – executes the game rules for one player.
- **Concrete Games:**
  - `RedLightGreenLight`, `GlassBridge`, `TugOfWar` – each derives from `Game` and implements `title()`, `startRound(...)` (when needed), and `play(...)`.
- **Player State:** `struct Player`
  - `string name`
  - `bool alive` – tournament status
  - `int rlgAttempts` – successful GREEN moves in RLGL
  - `int bridgeStep` – steps crossed in Glass Bridge
  - `double tugStrength` – accumulated strength in Tug of War
- **RNG:** A single `std::mt19937` engine for consistent randomness.

### GameManager Flow

1. Prompt for number of players (1–10; defaults to 2) and names (defaults to "Player N" if blank).
2. For each game:
   - Print title and show rules once (`showRulesOnce`).
   - Run `startRound(players)` for game-specific setup.
   - For each alive player, call `game.play(player)`.
3. After Tug of War, apply survivor rule (`applyTugSurvivors`).
4. Print results (`printResults`).

---

## Red Light Green Light

- **Objective:** Complete 4 successful moves while the light is GREEN within the round time budget.
- **Timing:** A strict 20-second budget for the player’s RLGL session.
- **Turn Loop:**
  - Each turn, the light is 50/50 GREEN/RED.
  - The player chooses to MOVE or STAY (console: `m`/`move` vs anything else).
- **Rules:**
  - Move on GREEN → `rlgAttempts++`.
  - Move on RED → immediate elimination (`alive = false`).
  - Stay → safe, no progress.
  - If 20 seconds elapse before reaching 4 successes → elimination.
- **State Updates:**
  - `Player::rlgAttempts` increments on successful GREEN moves.
  - Reaching 4 successes completes the game for that player.
- **Key Code Paths:**
  - `RedLightGreenLight::play` – turn loop, timing checks, move resolution.

---

## Glass Bridge

- **Objective:** Cross 5 rows by choosing the safe panel (left/right) on each step.
- **Progression Safeguards:**
  - Step 1 is always safe.
  - If 3 or more players are alive at round start, one player is selected as a guaranteed survivor for this game to maintain progression.
- **Per-Step Resolution:**
  - Player inputs `left` or `right`.
  - If step 1 or the player is the guaranteed survivor → safe.
  - Otherwise, the chosen tile is safe with ~60% probability; a wrong choice eliminates the player and the correct side is reported.
- **State Updates:**
  - On safe → `Player::bridgeStep++`.
  - On fail → `Player::alive = false`.
  - On reaching 5 → the player clears the game.
- **Key Code Paths:**
  - `GlassBridge::startRound` – selects `guaranteedName` when 3+ alive players.
  - `GlassBridge::play` – step-by-step decision and outcome logic.

---

## Tug of War

- **Objective:** Build the highest strength by the end of the round. Ties survive.
- **Timer Behavior:** The 10-second round timer starts on the first tap.
- **Interaction Model:**
  - Each tap extends the bar from the left by a base increment with a frequency-based bonus (faster taps add more).
  - Between taps, the bar steadily shrinks (simulated fatigue).
- **Moving Target Window:**
  - The highlight window moves via a smooth random walk:
    - Velocity/acceleration change at randomized intervals.
    - Bounces at track edges and re-randomizes direction/accel.
  - Parameters include bounds such as `minV`, `maxV`, `maxA`, and the re-acceleration timing window.
- **Scoring:**
  - Strength accrues only while the bar’s tip is inside the moving window.
  - Accrual rate is steady (≈ 28 units/second while aligned).
- **State Updates:**
  - `Player::tugStrength` accumulates across the 10-second session.
- **Key Code Paths:**
  - `TugOfWar::play` – timer-on-first-tap, random-walk target, tap growth/shrink, strength accumulation.

---

## Survivor Selection and Results

- **Post-Tug Rule:** After all players finish Tug of War, only players whose `tugStrength` equals the maximum remain alive; ties survive.
- **Final Output:** The controller prints each player’s name, status (SURVIVED/ELIMINATED), and final strength.
- **Key Code Paths:**
  - `GameManager::applyTugSurvivors` – survivor filter.
  - `GameManager::printResults` – final scoreboard.

---

## Rulebook (Shown Once Per Game)

- On first entry to each game, the controller prints concise rules via `showRulesOnce`:
  - RLGL – complete 4 GREEN moves within time; moving on RED eliminates you.
  - Glass Bridge – make 5 safe choices; first step is safe; chosen side is usually safe.
  - Tug of War – tap to extend; shrink when idle; gain only when aligned; highest strength survives.

---

## Tuning Parameters (Quick Reference)

- **Red Light Green Light:**
  - Successes required: `required = 4`
  - Time budget: `timeLimitSec = 20`
  - Light randomness: 50/50 per turn
- **Glass Bridge:**
  - Steps to cross: `totalSteps = 5`
  - First step safe: enforced
  - Guaranteed survivor: enabled when `alive.size() >= 3`
  - Chosen-safe probability (non-guaranteed): ~60%
- **Tug of War:**
  - Round duration: `duration = 10.0` seconds (starts on first tap)
  - Growth/shrink: `baseInc = 30.0`, `shrinkSpeed = 210.0`, `barMin`, `barMax`
  - Target motion bounds: `minV`, `maxV`, `maxA`, randomized intervals for acceleration
  - Scoring rate while aligned: ~28 units/second

---

## File Reference

- Backend controller and games: `web/main.cpp`
  - Types: `GameManager`, `Game`, `Player`
  - Games: `RedLightGreenLight`, `GlassBridge`, `TugOfWar`
  - Core methods: `startRound`, `play`, `showRulesOnce`, `applyTugSurvivors`, `printResults`

---

## Notes

- The controller design prioritizes clarity, fairness, and pacing:
  - First-step safety reduces immediate eliminations on Glass Bridge.
  - Guaranteed survivor (when 3+ players) maintains tournament momentum.
  - Tug of War rewards consistent timing and attention with dynamic target motion and tap frequency bonuses.
- Difficulty can be tuned using the parameters listed above without changing the architecture.
