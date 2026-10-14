// ==============================================================
// ⚽ 1v1 EMOJI HEAD SOCCER ENGINE
// Jump, header the ball, and tune Light vs Defense stats!
// ==============================================================

// Web Audio API Synthesizer
class SoundFX {
  constructor() {
    this.ctx = null;
  }
  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) this.ctx = new AudioContext();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }
  playHeader(isHard = false) {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = isHard ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(isHard ? 240 : 180, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(45, this.ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } catch (e) {}
  }
  playJump() {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(450, this.ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
    } catch (e) {}
  }
  playPostPing() {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(900, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.2);
    } catch (e) {}
  }
  playGoal() {
    if (!this.ctx) return;
    try {
      const notes = [440, 554, 659, 880];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.1);
        gain.gain.setValueAtTime(0.25, this.ctx.currentTime + idx * 0.1);
        gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + idx * 0.1 + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + idx * 0.1);
        osc.stop(this.ctx.currentTime + idx * 0.1 + 0.35);
      });
    } catch (e) {}
  }
  playWhistle() {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(2500, this.ctx.currentTime);
      osc.frequency.setValueAtTime(2900, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
    } catch (e) {}
  }
  playVictory() {
    if (!this.ctx) return;
    try {
      const notes = [523, 659, 784, 1046];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.14);
        gain.gain.setValueAtTime(0.28, this.ctx.currentTime + idx * 0.14);
        gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + idx * 0.14 + 0.45);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + idx * 0.14);
        osc.stop(this.ctx.currentTime + idx * 0.14 + 0.45);
      });
    } catch (e) {}
  }
  playDefeat() {
    if (!this.ctx) return;
    try {
      const notes = [440, 392, 349, 293];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.2);
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime + idx * 0.2);
        gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + idx * 0.2 + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + idx * 0.2);
        osc.stop(this.ctx.currentTime + idx * 0.2 + 0.35);
      });
    } catch (e) {}
  }
}

const sfx = new SoundFX();

// Canvas & Dimension Constants
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const WIDTH = 860;
const HEIGHT = 480;
const GROUND_Y = 410; // Turf ground level
const GOAL_WIDTH = 75;
const GOAL_HEIGHT = 160;
const CROSSBAR_Y = GROUND_Y - GOAL_HEIGHT; // Top bar height = 250

// Character Head Images
const playerImg = new Image();
playerImg.src = 'player.png';

const enemyImg = new Image();
enemyImg.src = 'enemy.png';

// Ball Object
const ball = {
  x: WIDTH / 2,
  y: 180,
  vx: 0,
  vy: 0,
  radius: 16,
  gravity: 0.42,
  bounce: 0.78,
  emoji: '⚽',
  cooldownFrames: 0,
  lastHitter: null
};

// Player 1 (User - Blue Team) with 1 to 10 customizable attributes
const player = {
  emoji: '🦁',
  x: 200,
  y: GROUND_Y,
  vx: 0,
  vy: 0,
  headRadius: 32,
  isGrounded: true,
  attrs: {
    weight: 3,      // 1 (feather light) to 10 (iron heavy)
    strength: 6,    // 1 (weak) to 10 (titanic strength)
    swiftness: 8,   // 1 (sluggish) to 10 (ultra swift)
    bounciness: 7   // 1 (flat) to 10 (trampoline bounce)
  },
  facing: 1 // 1 = facing right
};

// Player 2 (CPU - Red Team) with 1 to 10 customizable attributes
const cpu = {
  emoji: '🐯',
  x: 660,
  y: GROUND_Y,
  vx: 0,
  vy: 0,
  headRadius: 32,
  isGrounded: true,
  attrs: {
    weight: 6,      // 1 to 10
    strength: 7,    // 1 to 10
    swiftness: 6,   // 1 to 10
    bounciness: 5   // 1 to 10
  },
  facing: -1 // -1 = facing left
};

// Shockwave / Header Particle Effects
const effects = [];
function addHeaderWave(x, y, color = '#60a5fa') {
  effects.push({ x, y, r: 10, maxR: 40, alpha: 1, color });
}

// Game State
let scorePlayer = 0;
let scoreCpu = 0;
let selectedMatchDuration = 90;
let matchTime = selectedMatchDuration;
let isGoalScored = false;
let isGameOver = false;

// -------------------------------------------------------------
// DYNAMIC STATS FORMULA (Based on Weight, Strength, Swiftness, Bounciness)
// -------------------------------------------------------------
function getPlayerAttributes() {
  const w = player.attrs.weight;      // 1..10
  const s = player.attrs.strength;    // 1..10
  const sw = player.attrs.swiftness;  // 1..10
  const b = player.attrs.bounciness;  // 1..10

  // 1. SPEED: Driven by Swiftness, reduced by Weight, boosted slightly by Strength
  // Heavy (w=10, sw=2) => ~3.8 | Light & Swift (w=2, sw=9) => ~8.6
  const rawSpeed = 3.6 + (sw * 0.58) - (w * 0.26) + (s * 0.08);
  const speed = Number(Math.max(3.2, Math.min(9.5, rawSpeed)).toFixed(1));

  // 2. DEFENSE: Driven by Weight & Strength (Heavy = slow but good at defense!)
  // Heavy & Strong (w=10, s=8) => ~92 | Featherweight (w=2, s=3) => ~26
  const rawDef = (w * 6.2) + (s * 3.2) + (11 - sw) * 0.4;
  const defense = Math.max(15, Math.min(99, Math.round(rawDef)));

  // 3. JUMP: Driven by Swiftness and Bounciness, weighed down by Weight
  const rawJump = - (9.2 + (b * 0.42) + (sw * 0.32) - (w * 0.24));
  const jumpPower = Number(Math.min(-9.2, Math.max(-15.5, rawJump)).toFixed(1));

  // 4. BALL BOUNCE HEIGHT ON HEADERS:
  // "if you are not swift you bounce the ball higher if you are swift then you bounce it less"
  // Plus Bounciness springs it up even more!
  const bounceHeightFactor = Number((((11 - sw) * 0.7) + (b * 0.45)).toFixed(1));

  // 5. SHOT / HEADER FORWARD DRIVE:
  // Strength and Swiftness determine forward shot speed
  const shotDrivePower = Number((5.2 + (s * 0.85) + (sw * 0.25)).toFixed(1));

  // 6. PHYSICAL BODY MASS (In collisions, heavier/stronger players push lighter ones)
  const mass = (w * 9.5) + (s * 3.5);

  return {
    speed,
    defense,
    jumpPower,
    bounceHeightFactor,
    shotDrivePower,
    mass,
    gravity: Math.max(0.48, Math.min(0.66, 0.5 + (w * 0.016)))
  };
}

// Update UI Stats Display & Explanation
function updateStatsUI() {
  const w = player.attrs.weight;
  const s = player.attrs.strength;
  const sw = player.attrs.swiftness;
  const b = player.attrs.bounciness;

  // Update slider badge labels
  const lblWeight = document.getElementById('label-weight');
  const lblStrength = document.getElementById('label-strength');
  const lblSwift = document.getElementById('label-swiftness');
  const lblBounce = document.getElementById('label-bounciness');

  if (lblWeight) lblWeight.textContent = w;
  if (lblStrength) lblStrength.textContent = s;
  if (lblSwift) lblSwift.textContent = sw;
  if (lblBounce) lblBounce.textContent = b;

  // Sync inputs if not already matching
  const inWeight = document.getElementById('input-weight');
  const inStrength = document.getElementById('input-strength');
  const inSwift = document.getElementById('input-swiftness');
  const inBounce = document.getElementById('input-bounciness');

  if (inWeight && Number(inWeight.value) !== w) inWeight.value = w;
  if (inStrength && Number(inStrength.value) !== s) inStrength.value = s;
  if (inSwift && Number(inSwift.value) !== sw) inSwift.value = sw;
  if (inBounce && Number(inBounce.value) !== b) inBounce.value = b;

  const attrs = getPlayerAttributes();

  // Progress bars
  const speedBar = document.getElementById('bar-speed');
  const defBar = document.getElementById('bar-def');
  const jumpBar = document.getElementById('bar-jump');
  const bounceBar = document.getElementById('bar-bounce');

  const speedVal = document.getElementById('val-speed');
  const defVal = document.getElementById('val-def');
  const jumpVal = document.getElementById('val-jump');
  const bounceVal = document.getElementById('val-bounce');

  if (speedBar) speedBar.style.width = `${Math.min(100, (attrs.speed / 10) * 100)}%`;
  if (defBar) defBar.style.width = `${attrs.defense}%`;
  if (jumpBar) jumpBar.style.width = `${Math.min(100, (Math.abs(attrs.jumpPower) / 16) * 100)}%`;
  if (bounceBar) bounceBar.style.width = `${Math.min(100, (attrs.bounceHeightFactor / 11) * 100)}%`;

  if (speedVal) speedVal.textContent = attrs.speed.toFixed(1);
  if (defVal) defVal.textContent = attrs.defense;
  if (jumpVal) jumpVal.textContent = Math.abs(attrs.jumpPower).toFixed(1);

  let bounceDescription = 'Medium';
  if (attrs.bounceHeightFactor >= 8.5) bounceDescription = 'Sky High 🚀';
  else if (attrs.bounceHeightFactor >= 6.0) bounceDescription = 'High 🦘';
  else if (attrs.bounceHeightFactor >= 4.0) bounceDescription = 'Moderate ⚽';
  else bounceDescription = 'Low / Driven ⚡';

  if (bounceVal) bounceVal.textContent = bounceDescription;

  // Detailed Dynamic Analysis Text
  const explanation = document.getElementById('stat-explanation');
  if (explanation) {
    const weightNote = w >= 7 ? `Heavy build (${w}/10) provides huge defense (${attrs.defense}) & body push, but slows your sprint (${attrs.speed}).`
      : (w <= 3 ? `Light build (${w}/10) makes you nimble and quick (${attrs.speed} speed), but defense is fragile (${attrs.defense}).`
      : `Balanced weight (${w}/10) gives an even mix of defense (${attrs.defense}) and mobility (${attrs.speed}).`);

    const swiftNote = sw <= 4 ? `Because swiftness is low (${sw}/10), headers pop the ball MUCH HIGHER into the air!`
      : (sw >= 8 ? `Because swiftness is high (${sw}/10), headers stay lower with fast forward drive!`
      : `Moderate swiftness (${sw}/10) gives balanced header height.`);

    explanation.innerHTML = `💡 <strong>Tactical Analysis:</strong> ${weightNote} ${swiftNote} (Strength: ${s}/10 • Bounciness: ${b}/10)`;
  }
}

// -------------------------------------------------------------
// DYNAMIC STATS FORMULA FOR CPU ENEMY
// -------------------------------------------------------------
function getCpuAttributes() {
  const w = cpu.attrs.weight;      // 1..10
  const s = cpu.attrs.strength;    // 1..10
  const sw = cpu.attrs.swiftness;  // 1..10
  const b = cpu.attrs.bounciness;  // 1..10

  const rawSpeed = 3.6 + (sw * 0.58) - (w * 0.26) + (s * 0.08);
  const speed = Number(Math.max(3.2, Math.min(9.5, rawSpeed)).toFixed(1));

  const rawDef = (w * 6.2) + (s * 3.2) + (11 - sw) * 0.4;
  const defense = Math.max(15, Math.min(99, Math.round(rawDef)));

  const rawJump = - (9.2 + (b * 0.42) + (sw * 0.32) - (w * 0.24));
  const jumpPower = Number(Math.min(-9.2, Math.max(-15.5, rawJump)).toFixed(1));

  const bounceHeightFactor = Number((((11 - sw) * 0.7) + (b * 0.45)).toFixed(1));
  const shotDrivePower = Number((5.2 + (s * 0.85) + (sw * 0.25)).toFixed(1));
  const mass = (w * 9.5) + (s * 3.5);

  return {
    speed,
    defense,
    jumpPower,
    bounceHeightFactor,
    shotDrivePower,
    mass,
    gravity: Math.max(0.48, Math.min(0.66, 0.5 + (w * 0.016)))
  };
}

// Update CPU Stats UI
function updateCpuStatsUI() {
  const w = cpu.attrs.weight;
  const s = cpu.attrs.strength;
  const sw = cpu.attrs.swiftness;
  const b = cpu.attrs.bounciness;

  // Labels
  const lblWeight = document.getElementById('label-cpu-weight');
  const lblStrength = document.getElementById('label-cpu-strength');
  const lblSwift = document.getElementById('label-cpu-swiftness');
  const lblBounce = document.getElementById('label-cpu-bounciness');

  if (lblWeight) lblWeight.textContent = w;
  if (lblStrength) lblStrength.textContent = s;
  if (lblSwift) lblSwift.textContent = sw;
  if (lblBounce) lblBounce.textContent = b;

  // Sliders
  const inWeight = document.getElementById('input-cpu-weight');
  const inStrength = document.getElementById('input-cpu-strength');
  const inSwift = document.getElementById('input-cpu-swiftness');
  const inBounce = document.getElementById('input-cpu-bounciness');

  if (inWeight && Number(inWeight.value) !== w) inWeight.value = w;
  if (inStrength && Number(inStrength.value) !== s) inStrength.value = s;
  if (inSwift && Number(inSwift.value) !== sw) inSwift.value = sw;
  if (inBounce && Number(inBounce.value) !== b) inBounce.value = b;

  const attrs = getCpuAttributes();

  // Progress bars
  const speedBar = document.getElementById('bar-cpu-speed');
  const defBar = document.getElementById('bar-cpu-def');
  const jumpBar = document.getElementById('bar-cpu-jump');
  const bounceBar = document.getElementById('bar-cpu-bounce');

  const speedVal = document.getElementById('val-cpu-speed');
  const defVal = document.getElementById('val-cpu-def');
  const jumpVal = document.getElementById('val-cpu-jump');
  const bounceVal = document.getElementById('val-cpu-bounce');

  if (speedBar) speedBar.style.width = `${Math.min(100, (attrs.speed / 10) * 100)}%`;
  if (defBar) defBar.style.width = `${attrs.defense}%`;
  if (jumpBar) jumpBar.style.width = `${Math.min(100, (Math.abs(attrs.jumpPower) / 16) * 100)}%`;
  if (bounceBar) bounceBar.style.width = `${Math.min(100, (attrs.bounceHeightFactor / 11) * 100)}%`;

  if (speedVal) speedVal.textContent = attrs.speed.toFixed(1);
  if (defVal) defVal.textContent = attrs.defense;
  if (jumpVal) jumpVal.textContent = Math.abs(attrs.jumpPower).toFixed(1);

  let bounceDescription = 'Medium';
  if (attrs.bounceHeightFactor >= 8.5) bounceDescription = 'Sky High 🚀';
  else if (attrs.bounceHeightFactor >= 6.0) bounceDescription = 'High 🦘';
  else if (attrs.bounceHeightFactor >= 4.0) bounceDescription = 'Moderate ⚽';
  else bounceDescription = 'Low / Driven ⚡';

  if (bounceVal) bounceVal.textContent = bounceDescription;

  // Analysis for Enemy
  const explanation = document.getElementById('stat-cpu-explanation');
  if (explanation) {
    const weightNote = w >= 7 ? `Enemy Tank (${w}/10): Heavy defense (${attrs.defense}) & body push, slower movement (${attrs.speed}).`
      : (w <= 3 ? `Enemy Sprinter (${w}/10): Very fast (${attrs.speed} speed), but defense is fragile (${attrs.defense}).`
      : `Enemy Balanced (${w}/10): Even defense (${attrs.defense}) and mobility (${attrs.speed}).`);

    const swiftNote = sw <= 4 ? `Low swiftness (${sw}/10): Enemy headers bounce SKY HIGH!`
      : (sw >= 8 ? `High swiftness (${sw}/10): Enemy headers stay low and driven!`
      : `Moderate swiftness (${sw}/10): Balanced bounce.`);

    explanation.innerHTML = `👹 <strong>Enemy Analysis:</strong> ${weightNote} ${swiftNote} (Strength: ${s}/10 • Bounciness: ${b}/10)`;
  }
}

// Keyboard Input
const keys = {
  ArrowLeft: false,
  ArrowRight: false,
  ArrowUp: false,
  KeyA: false,
  KeyD: false,
  KeyW: false,
  Space: false
};

window.addEventListener('keydown', (e) => {
  sfx.init();
  if (keys.hasOwnProperty(e.code)) {
    keys[e.code] = true;
    if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
      e.preventDefault();
      tryPlayerJump();
    }
  }
});

window.addEventListener('keyup', (e) => {
  if (keys.hasOwnProperty(e.code)) {
    keys[e.code] = false;
  }
});

function tryPlayerJump() {
  if (player.isGrounded) {
    const attrs = getPlayerAttributes();
    player.vy = attrs.jumpPower;
    player.isGrounded = false;
    sfx.playJump();
    addHeaderWave(player.x, player.y - 10, '#93c5fd');
  }
}

// Canvas Touch / Click Handling
canvas.addEventListener('pointerdown', (e) => {
  sfx.init();
  const rect = canvas.getBoundingClientRect();
  const clickX = (e.clientX - rect.left) * (canvas.width / rect.width);
  const clickY = (e.clientY - rect.top) * (canvas.height / rect.height);

  if (clickY < GROUND_Y - 70) {
    tryPlayerJump();
  } else if (clickX < player.x - 20) {
    keys.KeyA = true;
    setTimeout(() => keys.KeyA = false, 250);
  } else if (clickX > player.x + 20) {
    keys.KeyD = true;
    setTimeout(() => keys.KeyD = false, 250);
  }
});

// Emoji Pickers
document.querySelectorAll('.emoji-opt').forEach(btn => {
  btn.addEventListener('click', () => {
    sfx.init();
    document.querySelectorAll('.emoji-opt').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    player.emoji = btn.getAttribute('data-emoji');
    const avatarDisplay = document.getElementById('current-player-avatar');
    if (avatarDisplay) avatarDisplay.textContent = player.emoji;
  });
});

// Sliders for 1 to 10 Attributes (Weight, Strength, Swiftness, Bounciness)
const setupSlider = (id, key) => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener('input', (e) => {
      sfx.init();
      player.attrs[key] = Number(e.target.value);
      updateStatsUI();
    });
  }
};

setupSlider('input-weight', 'weight');
setupSlider('input-strength', 'strength');
setupSlider('input-swiftness', 'swiftness');
setupSlider('input-bounciness', 'bounciness');

// Archetype Preset Buttons
const applyArchetype = (w, s, sw, b) => {
  sfx.init();
  player.attrs.weight = w;
  player.attrs.strength = s;
  player.attrs.swiftness = sw;
  player.attrs.bounciness = b;
  updateStatsUI();
};

document.getElementById('btn-preset-light')?.addEventListener('click', () => applyArchetype(2, 4, 10, 7));
document.getElementById('btn-preset-tank')?.addEventListener('click', () => applyArchetype(10, 9, 2, 3));
document.getElementById('btn-preset-bouncer')?.addEventListener('click', () => applyArchetype(3, 5, 1, 10));
document.getElementById('btn-preset-balanced')?.addEventListener('click', () => applyArchetype(5, 5, 5, 5));

// CPU Sliders for 1 to 10 Attributes (Weight, Strength, Swiftness, Bounciness)
const setupCpuSlider = (id, key) => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener('input', (e) => {
      sfx.init();
      cpu.attrs[key] = Number(e.target.value);
      updateCpuStatsUI();
    });
  }
};

setupCpuSlider('input-cpu-weight', 'weight');
setupCpuSlider('input-cpu-strength', 'strength');
setupCpuSlider('input-cpu-swiftness', 'swiftness');
setupCpuSlider('input-cpu-bounciness', 'bounciness');

// CPU Archetype Preset Buttons
const applyCpuArchetype = (w, s, sw, b) => {
  sfx.init();
  cpu.attrs.weight = w;
  cpu.attrs.strength = s;
  cpu.attrs.swiftness = sw;
  cpu.attrs.bounciness = b;
  updateCpuStatsUI();
};

document.getElementById('btn-cpu-preset-light')?.addEventListener('click', () => applyCpuArchetype(2, 4, 10, 7));
document.getElementById('btn-cpu-preset-tank')?.addEventListener('click', () => applyCpuArchetype(10, 9, 2, 3));
document.getElementById('btn-cpu-preset-bouncer')?.addEventListener('click', () => applyCpuArchetype(3, 5, 1, 10));
document.getElementById('btn-cpu-preset-balanced')?.addEventListener('click', () => applyCpuArchetype(5, 5, 5, 5));

// CPU Emoji Picker
document.querySelectorAll('.emoji-opt-cpu').forEach(btn => {
  btn.addEventListener('click', () => {
    sfx.init();
    document.querySelectorAll('.emoji-opt-cpu').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    cpu.emoji = btn.getAttribute('data-emoji');
    const avatarDisplay = document.getElementById('current-cpu-avatar');
    if (avatarDisplay) avatarDisplay.textContent = cpu.emoji;
  });
});

// Reset positions for kick-off
function resetRound(scoringTeam = null) {
  ball.x = WIDTH / 2;
  ball.y = 160;
  ball.vx = scoringTeam === 'player' ? 2 : (scoringTeam === 'cpu' ? -2 : (Math.random() > 0.5 ? 2 : -2));
  ball.vy = -3;
  ball.cooldownFrames = 0;

  player.x = 220;
  player.y = GROUND_Y;
  player.vx = 0;
  player.vy = 0;
  player.isGrounded = true;

  cpu.x = 640;
  cpu.y = GROUND_Y;
  cpu.vx = 0;
  cpu.vy = 0;
  cpu.isGrounded = true;
}

// Full Match Restart
function restartFullMatch() {
  sfx.init();
  sfx.playWhistle();
  isGameOver = false;
  isGoalScored = false;
  scorePlayer = 0;
  scoreCpu = 0;
  matchTime = selectedMatchDuration;

  const modal = document.getElementById('game-over-modal');
  if (modal) modal.classList.add('hidden');

  const banner = document.getElementById('goal-banner');
  if (banner) banner.classList.add('hidden');

  const badge = document.getElementById('game-status-badge');
  if (badge) {
    badge.textContent = '🟢 1v1 DUEL LIVE';
    badge.className = 'badge live';
  }

  updateScoreboard();
  resetRound();
}

document.getElementById('btn-restart')?.addEventListener('click', restartFullMatch);
document.getElementById('btn-play-again')?.addEventListener('click', restartFullMatch);

// Time of game picker buttons
document.querySelectorAll('.time-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    sfx.init();
    document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedMatchDuration = Number(btn.getAttribute('data-time'));
    restartFullMatch();
  });
});

function triggerGameOver() {
  if (isGameOver) return;
  isGameOver = true;
  sfx.playWhistle();

  const modal = document.getElementById('game-over-modal');
  const title = document.getElementById('game-over-title');
  const subtitle = document.getElementById('game-over-subtitle');
  const card = modal?.querySelector('.modal-card');
  const badge = document.getElementById('game-status-badge');

  if (badge) {
    badge.textContent = '🏁 MATCH FINISHED';
    badge.className = 'badge';
  }

  if (modal && title && subtitle && card) {
    card.classList.remove('win', 'lose', 'draw');
    if (scorePlayer > scoreCpu) {
      title.textContent = 'GAME! YOU WIN! 🏆';
      card.classList.add('win');
      setTimeout(() => sfx.playVictory(), 200);
    } else if (scorePlayer < scoreCpu) {
      title.textContent = 'GAME! YOU LOSE! 💀';
      card.classList.add('lose');
      setTimeout(() => sfx.playDefeat(), 200);
    } else {
      title.textContent = "GAME! IT'S A DRAW! 🤝";
      card.classList.add('draw');
    }
    subtitle.textContent = `Final Score: YOU ${scorePlayer} - ${scoreCpu} CPU`;
    modal.classList.remove('hidden');
  }
}

function updateScoreboard() {
  document.getElementById('score-player').textContent = scorePlayer;
  document.getElementById('score-cpu').textContent = scoreCpu;
  const mins = Math.floor(matchTime / 60);
  const secs = matchTime % 60;
  document.getElementById('match-timer').textContent = 
    `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Goal Scored Handler
function onGoal(team) {
  if (isGoalScored) return;
  isGoalScored = true;
  sfx.playGoal();

  if (team === 'player') scorePlayer++;
  else scoreCpu++;
  updateScoreboard();

  const banner = document.getElementById('goal-banner');
  const goalText = document.getElementById('goal-text');
  if (banner && goalText) {
    goalText.textContent = team === 'player' ? '⚽ GOOOAL YOU SCORED! 🎉' : '💀 GOAL FOR CPU! 🥅';
    banner.classList.remove('hidden');
  }

  setTimeout(() => {
    if (banner) banner.classList.add('hidden');
    resetRound(team);
    isGoalScored = false;
    sfx.playWhistle();
  }, 2200);
}

// -------------------------------------------------------------
// HEAD COLLISION & BALL HEADING PHYSICS
// -------------------------------------------------------------
function solveHeadCollision(p, isUser, stats) {
  // Head center is slightly above player base y
  const headX = p.x;
  const headY = p.y - 42;
  const headR = p.headRadius || 28;

  const dx = ball.x - headX;
  const dy = ball.y - headY;
  const dist = Math.hypot(dx, dy);
  const minDist = headR + ball.radius;

  if (dist < minDist) {
    // Normal direction from head to ball
    const nx = dist > 0.001 ? (dx / dist) : 0;
    const ny = dist > 0.001 ? (dy / dist) : -1;

    // Hard separation so ball cannot clip through the head
    const overlap = minDist - dist;
    ball.x += nx * overlap;
    ball.y += ny * overlap;

    // Heading Impulse Calculation
    sfx.playHeader(p.vy < -2 || isUser);
    addHeaderWave(ball.x, ball.y, isUser ? '#60a5fa' : '#f87171');

    ball.lastHitter = isUser ? 'player' : 'cpu';
    ball.cooldownFrames = 8;

    let launchVx = 0;
    let launchVy = 0;

    if (isUser) {
      // User Heading:
      // "if you are not swift you bounce the ball higher if you are swift then you bounce it less"
      const vertBounce = (stats.bounceHeightFactor * 1.1) + Math.abs(p.vy) * 0.7;
      const horizDrive = stats.shotDrivePower + Math.max(0, p.vx * 0.85);

      if (ny < -0.15) {
        // Popping ball upwards off top of head
        launchVy = -vertBounce;
        launchVx = Math.max(3.5, nx * horizDrive);
      } else if (ny > 0.25 && p.vy > 0) {
        // Downward spike header
        launchVy = 4.0 + (stats.shotDrivePower * 0.35);
        launchVx = Math.max(5.0, nx * horizDrive);
      } else {
        launchVx = Math.max(4.0, nx * horizDrive);
        launchVy = ny * vertBounce;
      }
    } else {
      // CPU Heading: uses dynamic CPU attributes!
      const vertBounce = (stats.bounceHeightFactor * 1.05) + Math.abs(p.vy) * 0.7;
      const horizDrive = stats.shotDrivePower + Math.max(0, -p.vx * 0.85);

      if (ny < -0.15) {
        // Popping ball upwards off top of CPU head
        launchVy = -vertBounce;
        launchVx = Math.min(-3.5, nx * horizDrive);
      } else if (ny > 0.25 && p.vy > 0) {
        // Downward spike header towards blue net
        launchVy = 4.0 + (stats.shotDrivePower * 0.35);
        launchVx = Math.min(-5.0, nx * horizDrive);
      } else {
        launchVx = Math.min(-4.0, nx * horizDrive);
        launchVy = ny * vertBounce;
      }
    }

    ball.vx = Math.max(-18, Math.min(18, launchVx));
    ball.vy = Math.max(-17, Math.min(15, launchVy));
  }
}

// -------------------------------------------------------------
// MAIN GAME PHYSICS LOOP
// -------------------------------------------------------------
function update() {
  if (isGameOver || isGoalScored) return;

  if (ball.cooldownFrames > 0) ball.cooldownFrames--;

  const playerAttrs = getPlayerAttributes();
  const cpuAttrs = getCpuAttributes();

  // 1. Player (User) Movement & Jump
  let pMove = 0;
  if (keys.ArrowLeft || keys.KeyA) pMove -= 1;
  if (keys.ArrowRight || keys.KeyD) pMove += 1;

  player.vx = pMove * playerAttrs.speed;
  player.x += player.vx;

  // Jump Gravity
  player.vy += playerAttrs.gravity;
  player.y += player.vy;

  if (player.y >= GROUND_Y) {
    player.y = GROUND_Y;
    player.vy = 0;
    player.isGrounded = true;
  }

  // Player Pitch Boundaries (Stay inside field, outside own net back wall)
  player.x = Math.max(GOAL_WIDTH + 24, Math.min(WIDTH - 40, player.x));

  // 2. CPU AI Movement & Jump (Dynamically driven by CPU stats)
  const distToBall = ball.x - cpu.x;
  
  if (ball.x > WIDTH * 0.45) {
    // Attack / Contest Ball
    if (distToBall > 15) cpu.vx = cpuAttrs.speed * 0.95;
    else if (distToBall < -15) cpu.vx = -cpuAttrs.speed * 0.95;
    else cpu.vx = 0;

    // Jump when ball is overhead and within reach for a header!
    if (Math.abs(distToBall) < 45 && ball.y < cpu.y - 30 && cpu.isGrounded) {
      cpu.vy = cpuAttrs.jumpPower;
      cpu.isGrounded = false;
      sfx.playJump();
    }
  } else {
    // Guard Goal
    const homeX = WIDTH - GOAL_WIDTH - 65;
    if (cpu.x < homeX - 10) cpu.vx = cpuAttrs.speed * 0.95;
    else if (cpu.x > homeX + 10) cpu.vx = -cpuAttrs.speed * 0.95;
    else cpu.vx = 0;

    // Block incoming aerial shots
    if (ball.vx > 3 && ball.x > WIDTH * 0.5 && cpu.isGrounded) {
      cpu.vy = cpuAttrs.jumpPower;
      cpu.isGrounded = false;
    }
  }

  cpu.x += cpu.vx;
  cpu.vy += cpuAttrs.gravity;
  cpu.y += cpu.vy;

  if (cpu.y >= GROUND_Y) {
    cpu.y = GROUND_Y;
    cpu.vy = 0;
    cpu.isGrounded = true;
  }

  // CPU Pitch Boundaries
  cpu.x = Math.max(GOAL_WIDTH + 40, Math.min(WIDTH - GOAL_WIDTH - 24, cpu.x));

  // 3. Body-to-Body Collision (Player vs CPU: Mass & Strength collision resolution)
  const pCpuDist = Math.hypot(cpu.x - player.x, cpu.y - player.y);
  if (pCpuDist < 60 && pCpuDist > 0) {
    const overlap = 60 - pCpuDist;
    const totalMass = playerAttrs.mass + cpuAttrs.mass;
    const playerPushRatio = cpuAttrs.mass / totalMass;
    const cpuPushRatio = playerAttrs.mass / totalMass;

    // Heavier/stronger combatant pushes the lighter one backward!
    player.x -= overlap * playerPushRatio;
    cpu.x += overlap * cpuPushRatio;
  }

  // 4. Ball Gravity & Pitch Collisions
  ball.vy += ball.gravity;
  ball.x += ball.vx;
  ball.y += ball.vy;

  // Ball Turf Bounce
  if (ball.y + ball.radius >= GROUND_Y) {
    ball.y = GROUND_Y - ball.radius;
    ball.vy = -ball.vy * ball.bounce;
    ball.vx *= 0.94; // turf friction
  }

  // Ball Ceiling Bounce
  if (ball.y - ball.radius <= 15) {
    ball.y = 15 + ball.radius;
    ball.vy = Math.abs(ball.vy) * 0.7;
  }

  // Left Crossbar Bounce (x = GOAL_WIDTH, y = CROSSBAR_Y)
  if (ball.x <= GOAL_WIDTH + ball.radius && ball.x >= GOAL_WIDTH - 15) {
    if (Math.abs(ball.y - CROSSBAR_Y) < 16) {
      sfx.playPostPing();
      ball.vy = -Math.abs(ball.vy) * 0.8;
      ball.vx = Math.abs(ball.vx) * 0.8;
      addHeaderWave(GOAL_WIDTH, CROSSBAR_Y, '#fbbf24');
    }
  }

  // Right Crossbar Bounce (x = WIDTH - GOAL_WIDTH, y = CROSSBAR_Y)
  if (ball.x >= WIDTH - GOAL_WIDTH - ball.radius && ball.x <= WIDTH - GOAL_WIDTH + 15) {
    if (Math.abs(ball.y - CROSSBAR_Y) < 16) {
      sfx.playPostPing();
      ball.vy = -Math.abs(ball.vy) * 0.8;
      ball.vx = -Math.abs(ball.vx) * 0.8;
      addHeaderWave(WIDTH - GOAL_WIDTH, CROSSBAR_Y, '#fbbf24');
    }
  }

  // Goal Checks: Inside Net Under Crossbar
  // Left Net (CPU Scores)
  if (ball.x <= GOAL_WIDTH && ball.y > CROSSBAR_Y) {
    if (ball.x - ball.radius <= 10) {
      onGoal('cpu');
      return;
    }
  } else if (ball.x - ball.radius <= 15) {
    // Upper wall bounce above crossbar
    ball.x = 15 + ball.radius;
    ball.vx = Math.abs(ball.vx) * 0.75;
  }

  // Right Net (Player Scores!)
  if (ball.x >= WIDTH - GOAL_WIDTH && ball.y > CROSSBAR_Y) {
    if (ball.x + ball.radius >= WIDTH - 10) {
      onGoal('player');
      return;
    }
  } else if (ball.x + ball.radius >= WIDTH - 15) {
    // Upper wall bounce above crossbar
    ball.x = WIDTH - 15 - ball.radius;
    ball.vx = -Math.abs(ball.vx) * 0.75;
  }

  // 5. Solve Head Collisions for both 1v1 competitors
  solveHeadCollision(player, true, playerAttrs);
  solveHeadCollision(cpu, false, cpuAttrs);

  // 6. Update Visual Particles
  for (let i = effects.length - 1; i >= 0; i--) {
    const eff = effects[i];
    eff.r += 2.5;
    eff.alpha -= 0.07;
    if (eff.alpha <= 0 || eff.r >= eff.maxR) {
      effects.splice(i, 1);
    }
  }
}

// -------------------------------------------------------------
// RENDER CANVAS (PITCH, GOALS, 1v1 HEAD PLAYERS, BALL)
// -------------------------------------------------------------
function render() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  // Stadium Night Sky
  const skyGrad = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
  skyGrad.addColorStop(0, '#070d1d');
  skyGrad.addColorStop(1, '#0f2444');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, WIDTH, GROUND_Y);

  // Stadium Floodlights Glow
  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.beginPath();
  ctx.moveTo(80, 0); ctx.lineTo(350, GROUND_Y); ctx.lineTo(0, GROUND_Y); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(WIDTH - 80, 0); ctx.lineTo(WIDTH - 350, GROUND_Y); ctx.lineTo(WIDTH, GROUND_Y); ctx.fill();

  // Green Turf Field
  const turfGrad = ctx.createLinearGradient(0, GROUND_Y, 0, HEIGHT);
  turfGrad.addColorStop(0, '#15803d');
  turfGrad.addColorStop(1, '#14532d');
  ctx.fillStyle = turfGrad;
  ctx.fillRect(0, GROUND_Y, WIDTH, HEIGHT - GROUND_Y);

  // White Boundary Line
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, GROUND_Y);
  ctx.lineTo(WIDTH, GROUND_Y);
  ctx.stroke();

  // Center Field Marker
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(WIDTH / 2, GROUND_Y);
  ctx.lineTo(WIDTH / 2, GROUND_Y - 80);
  ctx.stroke();

  // Draw Goals (Left & Right Nets)
  // Left Goal Net
  ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
  ctx.fillRect(5, CROSSBAR_Y, GOAL_WIDTH - 5, GOAL_HEIGHT);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 4;
  ctx.strokeRect(5, CROSSBAR_Y, GOAL_WIDTH - 5, GOAL_HEIGHT);
  // Net mesh lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.lineWidth = 1.5;
  for (let x = 15; x < GOAL_WIDTH; x += 15) {
    ctx.beginPath(); ctx.moveTo(x, CROSSBAR_Y); ctx.lineTo(x, GROUND_Y); ctx.stroke();
  }
  for (let y = CROSSBAR_Y + 20; y < GROUND_Y; y += 20) {
    ctx.beginPath(); ctx.moveTo(5, y); ctx.lineTo(GOAL_WIDTH, y); ctx.stroke();
  }

  // Right Goal Net
  ctx.fillStyle = 'rgba(59, 130, 246, 0.15)';
  ctx.fillRect(WIDTH - GOAL_WIDTH, CROSSBAR_Y, GOAL_WIDTH - 5, GOAL_HEIGHT);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 4;
  ctx.strokeRect(WIDTH - GOAL_WIDTH, CROSSBAR_Y, GOAL_WIDTH - 5, GOAL_HEIGHT);
  // Net mesh lines
  for (let x = WIDTH - GOAL_WIDTH + 15; x < WIDTH; x += 15) {
    ctx.beginPath(); ctx.moveTo(x, CROSSBAR_Y); ctx.lineTo(x, GROUND_Y); ctx.stroke();
  }
  for (let y = CROSSBAR_Y + 20; y < GROUND_Y; y += 20) {
    ctx.beginPath(); ctx.moveTo(WIDTH - GOAL_WIDTH, y); ctx.lineTo(WIDTH - 5, y); ctx.stroke();
  }

  // Draw Shockwave Effects
  effects.forEach(eff => {
    ctx.strokeStyle = eff.color;
    ctx.lineWidth = 3;
    ctx.globalAlpha = Math.max(0, eff.alpha);
    ctx.beginPath();
    ctx.arc(eff.x, eff.y, eff.r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  });

  // Draw Ground Shadows
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  // Player Shadow
  ctx.beginPath();
  const pShadowScale = Math.max(0.3, 1 - (GROUND_Y - player.y) / 250);
  ctx.ellipse(player.x, GROUND_Y + 4, 24 * pShadowScale, 8 * pShadowScale, 0, 0, Math.PI * 2);
  ctx.fill();

  // CPU Shadow
  ctx.beginPath();
  const cpuShadowScale = Math.max(0.3, 1 - (GROUND_Y - cpu.y) / 250);
  ctx.ellipse(cpu.x, GROUND_Y + 4, 24 * cpuShadowScale, 8 * cpuShadowScale, 0, 0, Math.PI * 2);
  ctx.fill();

  // Ball Shadow
  ctx.beginPath();
  const ballShadowScale = Math.max(0.2, 1 - (GROUND_Y - ball.y) / 350);
  ctx.ellipse(ball.x, GROUND_Y + 4, 16 * ballShadowScale, 6 * ballShadowScale, 0, 0, Math.PI * 2);
  ctx.fill();

  // ------------------------------------
  // DRAW 1v1 HEAD SOCCER CHARACTERS
  // ------------------------------------

  // 1. Draw Player (User - Blue)
  // Aura color dynamically matches build:
  const playerAttrs = getPlayerAttributes();
  if (player.attrs.weight >= 7) {
    // Heavy Tank Shield
    ctx.fillStyle = 'rgba(16, 185, 129, 0.28)';
    ctx.beginPath();
    ctx.arc(player.x, player.y - 42, 36, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 3.5;
    ctx.stroke();
  } else if (player.attrs.swiftness >= 8) {
    // Ultra Swift Electric Aura
    ctx.fillStyle = 'rgba(96, 165, 250, 0.3)';
    ctx.beginPath();
    ctx.arc(player.x, player.y - 42, 34, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 2.5;
    ctx.stroke();
  } else if (player.attrs.bounciness >= 8) {
    // Spring Bouncer Aura
    ctx.fillStyle = 'rgba(236, 72, 153, 0.28)';
    ctx.beginPath();
    ctx.arc(player.x, player.y - 42, 35, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#f472b6';
    ctx.lineWidth = 2.5;
    ctx.stroke();
  } else {
    // Balanced Athlete Aura
    ctx.fillStyle = 'rgba(59, 130, 246, 0.25)';
    ctx.beginPath();
    ctx.arc(player.x, player.y - 42, 34, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // Player Shoes / Cleats 👟
  ctx.font = '22px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('👟', player.x + (player.vx > 0 ? 8 : -8), player.y - 8);

  // Player Head Image
  if (playerImg.complete && playerImg.naturalWidth > 0) {
    ctx.drawImage(playerImg, player.x - 38, player.y - 84, 76, 84);
  } else {
    ctx.font = '54px sans-serif';
    ctx.fillText('👦', player.x, player.y - 44);
  }

  // You / Stats Tag
  ctx.font = '11px Outfit, sans-serif';
  ctx.fillStyle = player.attrs.weight >= 7 ? '#6ee7b7' : (player.attrs.swiftness >= 8 ? '#93c5fd' : '#fbcfe8');
  ctx.fillText(`HERO 👑 (Def ${playerAttrs.defense} • Spd ${playerAttrs.speed})`, player.x, player.y - 92);

  // 2. Draw CPU Opponent (Red)
  const cpuAttrs = getCpuAttributes();
  if (cpu.attrs.weight >= 7) {
    // Enemy Tank Shield
    ctx.fillStyle = 'rgba(239, 68, 68, 0.3)';
    ctx.beginPath();
    ctx.arc(cpu.x, cpu.y - 42, 36, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3.5;
    ctx.stroke();
  } else if (cpu.attrs.swiftness >= 8) {
    // Enemy Swift Sparks
    ctx.fillStyle = 'rgba(249, 115, 22, 0.28)';
    ctx.beginPath();
    ctx.arc(cpu.x, cpu.y - 42, 34, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 2.5;
    ctx.stroke();
  } else if (cpu.attrs.bounciness >= 8) {
    // Enemy Bouncer
    ctx.fillStyle = 'rgba(168, 85, 247, 0.28)';
    ctx.beginPath();
    ctx.arc(cpu.x, cpu.y - 42, 35, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 2.5;
    ctx.stroke();
  } else {
    // Default Enemy Aura
    ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
    ctx.beginPath();
    ctx.arc(cpu.x, cpu.y - 42, 34, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#f87171';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // CPU Cleats
  ctx.font = '22px sans-serif';
  ctx.fillText('👟', cpu.x + (cpu.vx > 0 ? 8 : -8), cpu.y - 8);

  // CPU Head Image
  if (enemyImg.complete && enemyImg.naturalWidth > 0) {
    ctx.drawImage(enemyImg, cpu.x - 38, cpu.y - 84, 76, 84);
  } else {
    ctx.font = '54px sans-serif';
    ctx.fillText('👦', cpu.x, cpu.y - 44);
  }

  // CPU Tag
  ctx.font = '11px Outfit, sans-serif';
  ctx.fillStyle = cpu.attrs.weight >= 7 ? '#fca5a5' : (cpu.attrs.swiftness >= 8 ? '#fdba74' : '#e9d5ff');
  ctx.fillText(`RIVAL ⚔️ (Def ${cpuAttrs.defense} • Spd ${cpuAttrs.speed})`, cpu.x, cpu.y - 92);

  // 3. Draw Soccer Ball
  ctx.font = '32px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(ball.emoji, ball.x, ball.y);
}

// Main Animation Loop
function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

// Match Countdown
setInterval(() => {
  if (isGameOver) return;
  if (matchTime > 0) {
    matchTime--;
    updateScoreboard();
    if (matchTime === 0) {
      triggerGameOver();
    }
  }
}, 1000);

// Initialize on Load
document.addEventListener('DOMContentLoaded', () => {
  updateStatsUI();
  updateCpuStatsUI();
  updateScoreboard();
  resetRound();
  requestAnimationFrame(gameLoop);
});
