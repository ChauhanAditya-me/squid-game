# 🎨 Visual Features & Animation Guide

This document showcases all the visual features and animations in the Squid Game web application.

---

## 🌟 Core Visual Elements

### 1. Welcome Screen
**Features:**
- Animated title with pulsing effect
- Gradient background (dark with red tint)
- Glass-morphism player setup card
- Smooth fade-in entrance animation

**CSS Animations:**
```css
@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
}

@keyframes fadeInScale {
    from { opacity: 0; transform: scale(0.9) translateY(20px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
}
```

**Color Scheme:**
- Background: Gradient from black to dark red
- Title: Bright red (#d32f2f) with glow
- Accent: Cyan/green (#00ff88)
- Glass effect: Semi-transparent white overlay

---

### 2. Game Header
**Features:**
- Sliding down animation on entry
- Current game title display
- Live player count tracker
- Alive vs total players

**Visual Effects:**
```css
@keyframes slideDown {
    from { transform: translateY(-50px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}
```

**Layout:**
```
┌────────────────────────────────────────────┐
│  Red Light Green Light  │  Player: Alice   │
│                         │  Alive: 3/5      │
└────────────────────────────────────────────┘
```

---

## 🎮 Game-Specific Visuals

### Game 1: Red Light Green Light

#### Traffic Light Indicator
**Visual States:**
1. **Waiting State**: Gray circle
2. **Green Light**: Bright green with glow animation
3. **Red Light**: Bright red with glow animation

**Animations:**
```css
.light-circle.green {
    background: radial-gradient(circle, #00ff88, #00aa55);
    box-shadow: 0 0 50px rgba(0, 255, 136, 0.8);
    animation: glowGreen 1s ease-in-out;
}

@keyframes glowGreen {
    0%, 100% { box-shadow: 0 0 30px rgba(0, 255, 136, 0.5); }
    50% { box-shadow: 0 0 60px rgba(0, 255, 136, 1); }
}
```

#### Track Display
**Visual Layout:**
```
[·] [·] [O] [·] [★]
 0   1   2   3   4
      ^player  ^finish
```

**Features:**
- Dots represent positions
- Player position: Green glowing circle with pulse
- Finish line: Gold star
- Smooth transitions between positions

**Player Marker Animation:**
```css
@keyframes playerPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.2); }
}
```

---

### Game 2: Glass Bridge

#### Bridge Structure
**Visual Layout:**
```
     Player: 🧍
     
[Left] [Right]  ← Step 3
[Left] [Right]  ← Step 2
[Left] [Right]  ← Step 1
```

**Tile States:**
1. **Unknown**: Blue semi-transparent with "?" symbol
2. **Safe**: Green glow with smooth transition
3. **Broken**: Shattering animation with red tint

#### Glass Shattering Animation
```css
@keyframes shatter {
    0% {
        opacity: 1;
        transform: scale(1);
    }
    50% {
        transform: scale(1.1);
    }
    100% {
        opacity: 0;
        transform: scale(0.5) rotate(45deg);
        background: rgba(255, 23, 68, 0.3);
    }
}
```

**Visual Effects:**
- Tile enlarges briefly before shattering
- Rotates while disappearing
- Color shifts from blue to red
- Opacity fades to zero

#### Player Animation
```css
@keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}
```

---

### Game 3: Tug of War

#### Rope Visualization
**Visual Layout:**
```
┌─────────────────────────────────────────┐
│  YOU        ═══════⚫═══════    OPPONENT │
│   8                              12      │
└─────────────────────────────────────────┘
              Turn: 3/5
```

**Components:**
1. **Rope**: Brown gradient with shadow
2. **Marker**: Black circle with white glow
3. **Strength Numbers**: Large, animated digits
4. **Turn Counter**: Progress indicator

#### Rope Marker Movement
**Calculation:**
```javascript
const percentage = (playerStrength / total) * 100;
ropeMarker.style.left = `${percentage}%`;
```

**Animation:**
- Smooth 0.5s transition
- Moves left/right based on strength
- 50% = center (tie)
- <50% = losing
- >50% = winning

**Visual States:**
- Player side: Green background
- Opponent side: Red background
- Marker: Glowing effect

---

## 📊 Status Messages

### Success Message
**Visual:**
```
┌─────────────────────────────┐
│  ✓ Safe move!              │  ← Green border, green text
└─────────────────────────────┘
```

**CSS:**
```css
.status-message.success {
    background: rgba(0, 230, 118, 0.2);
    border: 2px solid var(--success-color);
    color: var(--success-color);
    animation: messageSlide 0.5s ease;
}
```

### Danger Message
**Visual:**
```
┌─────────────────────────────┐
│  ✗ Eliminated!             │  ← Red border, red text
└─────────────────────────────┘
```

**Animation:**
```css
@keyframes messageShake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
}
```

---

## 🏆 Results Screen

### Layout
**Visual Structure:**
```
┌───────────────────────────────────┐
│        FINAL RESULTS              │
│                                   │
│  ┌─────────────────────────────┐ │
│  │ Alice        ✓ SURVIVED     │ │  ← Green
│  └─────────────────────────────┘ │
│  ┌─────────────────────────────┐ │
│  │ Bob          ✗ ELIMINATED   │ │  ← Red, strikethrough
│  └─────────────────────────────┘ │
│                                   │
│         [PLAY AGAIN]              │
└───────────────────────────────────┘
```

### Animations
**Staggered Fade-in:**
```css
.result-item {
    animation: resultFade 0.5s ease forwards;
    opacity: 0;
}

@keyframes resultFade {
    to { opacity: 1; }
}
```

**JavaScript Delay:**
```javascript
setTimeout(() => {
    // Add result item
}, index * 200); // 200ms delay per item
```

---

## 🎨 Button Styles

### Primary Button (Start Game)
**Visual:**
- Red gradient background
- White text, uppercase
- Shadow with red glow
- Hover: Lifts up with enhanced glow

```css
.btn-primary:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 30px rgba(211, 47, 47, 0.6);
}
```

### Action Buttons
**Four Styles:**

1. **MOVE** - Green gradient
   ```css
   background: linear-gradient(135deg, #00e676, #00c853);
   ```

2. **STAY** - Orange gradient
   ```css
   background: linear-gradient(135deg, #ff9800, #f57c00);
   ```

3. **LEFT** - Blue gradient
   ```css
   background: linear-gradient(135deg, #2196f3, #1565c0);
   ```

4. **RIGHT** - Purple gradient
   ```css
   background: linear-gradient(135deg, #9c27b0, #6a1b9a);
   ```

5. **PULL** - Red gradient
   ```css
   background: linear-gradient(135deg, #f44336, #c62828);
   ```

**Hover Effect:**
```css
.btn-action:hover {
    transform: translateY(-5px) scale(1.05);
    box-shadow: 0 10px 30px rgba(255, 255, 255, 0.3);
}
```

**Disabled State:**
```css
.btn-action:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
}
```

---

## 🔄 Loading Overlay

### Visual Design
**Components:**
- Full-screen dark overlay (90% black)
- Spinning circular loader
- Loading text

**Spinner Animation:**
```css
.spinner {
    width: 60px;
    height: 60px;
    border: 5px solid rgba(255, 255, 255, 0.1);
    border-top-color: var(--primary-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}
```

---

## 📱 Responsive Design

### Breakpoints
**Mobile (max-width: 768px):**
- Reduced title size: 5rem → 3rem
- Smaller buttons: Adjusted padding
- Compact player setup: 400px → 300px
- Smaller bridge tiles: 100px → 70px
- Smaller light indicator: 120px → 80px

**CSS Example:**
```css
@media (max-width: 768px) {
    .game-title {
        font-size: 3rem;
    }
    
    .bridge-tile {
        width: 70px;
        height: 70px;
    }
}
```

---

## 🎭 Transition Effects

### Screen Transitions
**Fade and Scale:**
```css
.screen {
    opacity: 0;
    transform: scale(0.95);
    transition: opacity 0.5s ease, transform 0.5s ease;
}

.screen.active {
    opacity: 1;
    transform: scale(1);
}
```

**Duration:** 500ms
**Easing:** Ease-out for natural feel

### Element Transitions
**All Interactive Elements:**
```css
button, .track-dot, .bridge-tile, .rope-marker {
    transition: all 0.3s ease;
}
```

---

## 🌈 Color Palette

### Primary Colors
```css
:root {
    --primary-color: #d32f2f;      /* Squid Game Red */
    --secondary-color: #1a1a1a;    /* Dark Background */
    --accent-color: #00ff88;       /* Success Green */
    --danger-color: #ff1744;       /* Elimination Red */
    --success-color: #00e676;      /* Win Green */
}
```

### Gradient Backgrounds
**Main Background:**
```css
background: linear-gradient(135deg, 
    #0a0a0a 0%,    /* Pure black */
    #1a1a1a 50%,   /* Dark gray */
    #2a0a0a 100%   /* Dark red tint */
);
```

### Text Colors
- Primary Text: White (#ffffff)
- Secondary Text: Light gray (rgba(255, 255, 255, 0.7))
- Error Text: Red (#ff1744)
- Success Text: Green (#00e676)

---

## ✨ Special Effects

### Glass Morphism
**Used in:** Player setup card, rules panel

```css
background: rgba(255, 255, 255, 0.05);
backdrop-filter: blur(10px);
border: 2px solid rgba(211, 47, 47, 0.3);
```

### Text Shadows & Glows
**Title Glow:**
```css
text-shadow: 
    0 0 30px rgba(211, 47, 47, 0.6),
    0 0 60px rgba(211, 47, 47, 0.4);
```

**Element Shadows:**
```css
box-shadow: 
    0 10px 40px rgba(0, 0, 0, 0.7),     /* Depth */
    inset 0 0 20px rgba(0, 0, 0, 0.3);  /* Inner depth */
```

---

## 🎬 Animation Timing

### Standard Timings
- **Quick interactions**: 0.3s (button hover)
- **Medium transitions**: 0.5s (screen changes)
- **Slow animations**: 1s (light glow)
- **Game feedback**: 1.5s (status messages)
- **Results stagger**: 200ms per item

### Easing Functions
- **Ease-out**: Natural deceleration (most common)
- **Ease-in-out**: Symmetric acceleration/deceleration
- **Linear**: Constant speed (spinners)

---

## 🔊 Visual-Audio Sync

### When Animations Trigger Sounds

1. **Move Action**: Slide animation + move.mp3
2. **Successful Step**: Glow animation + move.mp3
3. **Glass Shatter**: Shatter animation + shatter.mp3
4. **Elimination**: Shake animation + lose.mp3
5. **Victory**: Scale-up animation + win.mp3

### Timing Coordination
```javascript
// Play sound before/during animation
audioManager.playSfx(audioManager.sfxMove);
element.classList.add('safe'); // Triggers CSS animation
await sleep(1500); // Wait for animation to complete
```

---

## 🎨 Customization Examples

### Change Theme to Blue
```css
:root {
    --primary-color: #1976d2;      /* Blue instead of red */
    --accent-color: #ffeb3b;       /* Yellow instead of green */
}
```

### Faster Animations
```css
.screen {
    transition: opacity 0.3s ease, transform 0.3s ease;
}
```

### Brighter Design
```css
body {
    background: linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%);
}
```

---

## 📐 Layout Guidelines

### Spacing System
- Small: 10px
- Medium: 20px
- Large: 40px
- Extra Large: 60px

### Font Sizes
- Mega Title: 5rem (80px)
- Title: 2.5rem (40px)
- Subtitle: 1.5rem (24px)
- Body: 1rem (16px)
- Small: 0.875rem (14px)

### Border Radius
- Small elements: 5px
- Medium elements: 10px
- Large cards: 15px
- Circular: 50%

---

## 🖼️ Visual Hierarchy

### Z-Index Layers
1. **Background**: 0 (body)
2. **Content**: 1 (screens, cards)
3. **Overlays**: 100 (status messages)
4. **Loading**: 9999 (full-screen overlay)

### Element Sizing
- **Mobile**: Touch targets minimum 44px
- **Desktop**: Buttons minimum 150px width
- **Icons**: 24px - 48px
- **Large displays**: 60px - 120px (traffic light)

---

This visual guide provides comprehensive documentation of all animations, effects, and visual elements in the Squid Game web application. Use it as a reference for understanding or customizing the design! 🎨
