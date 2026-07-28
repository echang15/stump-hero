/* STUMP — throw the hammer, catch it, live with how you caught it.
   Everything is drawn at 256x224 and scaled up with nearest-neighbour. */

(() => {
'use strict';

const W = 256, H = 224;
const canvas = document.getElementById('screen');
const ctx = canvas.getContext('2d', { alpha: false });

/* ---------------------------------------------------------------- palette */
const C = {
  sky1:'#5c94fc', sky2:'#74a4fc', sky3:'#8cb4fc', cloud:'#ffffff', cloudS:'#c8d8fc',
  sun:'#fce8a0',
  farHill:'#4a7a52', hill:'#3f7a38',
  treeD:'#1d5b2a', treeM:'#2a7a36', treeL:'#3d9445', trunk:'#4a2e15',
  grass:'#4ca832', grassD:'#2f7a28', grassL:'#6cc44a', dirt:'#8a5a2b', dirtD:'#5e3c1c',
  bark:'#6b4420', barkD:'#4a2e15', barkL:'#8a5a2b',
  wood1:'#d8b06c', wood2:'#c09454', wood3:'#a67a40', wood4:'#8a6232',
  metalL:'#e8e8f4', metal:'#a8a8bc', metalD:'#6a6a80', metalX:'#454556',
  handleL:'#d2a05a', handle:'#b07f3c', handleD:'#8a5f28',
  skin:'#f0b078', skinD:'#c07850',
  shirt:'#d83a2a', shirtD:'#9a2418', shirtL:'#f06a52',
  pants:'#3a5ad0', pantsD:'#24378a',
  hair:'#6b3f18', boot:'#3a2a1a',
  ink:'#141420', white:'#ffffff', black:'#000000',
  gold:'#fcd428', bad:'#e04030', good:'#5ce05c', dim:'#6a6a80'
};

/* ------------------------------------------------------------------ font */
const G = {
'A':'.###.|#...#|#...#|#####|#...#|#...#|#...#',
'B':'####.|#...#|#...#|####.|#...#|#...#|####.',
'C':'.###.|#...#|#....|#....|#....|#...#|.###.',
'D':'####.|#...#|#...#|#...#|#...#|#...#|####.',
'E':'#####|#....|#....|####.|#....|#....|#####',
'F':'#####|#....|#....|####.|#....|#....|#....',
'G':'.###.|#...#|#....|#.###|#...#|#...#|.###.',
'H':'#...#|#...#|#...#|#####|#...#|#...#|#...#',
'I':'#####|..#..|..#..|..#..|..#..|..#..|#####',
'J':'..###|...#.|...#.|...#.|...#.|#..#.|.##..',
'K':'#...#|#..#.|#.#..|##...|#.#..|#..#.|#...#',
'L':'#....|#....|#....|#....|#....|#....|#####',
'M':'#...#|##.##|#.#.#|#...#|#...#|#...#|#...#',
'N':'#...#|##..#|#.#.#|#..##|#...#|#...#|#...#',
'O':'.###.|#...#|#...#|#...#|#...#|#...#|.###.',
'P':'####.|#...#|#...#|####.|#....|#....|#....',
'Q':'.###.|#...#|#...#|#...#|#.#.#|#..#.|.##.#',
'R':'####.|#...#|#...#|####.|#.#..|#..#.|#...#',
'S':'.####|#....|#....|.###.|....#|....#|####.',
'T':'#####|..#..|..#..|..#..|..#..|..#..|..#..',
'U':'#...#|#...#|#...#|#...#|#...#|#...#|.###.',
'V':'#...#|#...#|#...#|#...#|#...#|.#.#.|..#..',
'W':'#...#|#...#|#...#|#.#.#|#.#.#|##.##|#...#',
'X':'#...#|#...#|.#.#.|..#..|.#.#.|#...#|#...#',
'Y':'#...#|#...#|.#.#.|..#..|..#..|..#..|..#..',
'Z':'#####|....#|...#.|..#..|.#...|#....|#####',
'0':'.###.|#...#|#..##|#.#.#|##..#|#...#|.###.',
'1':'..#..|.##..|..#..|..#..|..#..|..#..|.###.',
'2':'.###.|#...#|....#|...#.|..#..|.#...|#####',
'3':'####.|....#|....#|.###.|....#|....#|####.',
'4':'...#.|..##.|.#.#.|#..#.|#####|...#.|...#.',
'5':'#####|#....|####.|....#|....#|#...#|.###.',
'6':'.###.|#...#|#....|####.|#...#|#...#|.###.',
'7':'#####|....#|...#.|..#..|.#...|.#...|.#...',
'8':'.###.|#...#|#...#|.###.|#...#|#...#|.###.',
'9':'.###.|#...#|#...#|.####|....#|#...#|.###.',
' ':'.....|.....|.....|.....|.....|.....|.....',
'!':'..#..|..#..|..#..|..#..|..#..|.....|..#..',
'.':'.....|.....|.....|.....|.....|.....|..#..',
',':'.....|.....|.....|.....|.....|..#..|.#...',
':':'.....|..#..|..#..|.....|..#..|..#..|.....',
'-':'.....|.....|.....|#####|.....|.....|.....',
'+':'.....|..#..|..#..|#####|..#..|..#..|.....',
'/':'....#|....#|...#.|..#..|.#...|#....|#....',
"'":'..#..|..#..|.....|.....|.....|.....|.....',
'?':'.###.|#...#|....#|..##.|..#..|.....|..#..',
'%':'#...#|....#|...#.|..#..|.#...|#....|#...#',
'(':'...#.|..#..|.#...|.#...|.#...|..#..|...#.',
')':'.#...|..#..|...#.|...#.|...#.|..#..|.#...',
'^':'.###.|.#.#.|.###.|.....|.....|.....|.....',   // degree sign
'*':'.....|#.#.#|.###.|#####|.###.|#.#.#|.....',
'=':'.....|.....|#####|.....|#####|.....|.....',
'<':'...#.|..#..|.#...|#....|.#...|..#..|...#.',
'>':'.#...|..#..|...#.|....#|...#.|..#..|.#...'
};
const GLYPH = {};
for (const k in G) GLYPH[k] = G[k].split('|');

function text(str, x, y, col, s = 1) {
  ctx.fillStyle = col;
  let cx = x | 0;
  for (const ch of String(str).toUpperCase()) {
    const g = GLYPH[ch];
    if (!g) { cx += 6 * s; continue; }
    for (let r = 0; r < 7; r++)
      for (let c = 0; c < 5; c++)
        if (g[r][c] === '#') ctx.fillRect(cx + c * s, (y | 0) + r * s, s, s);
    cx += 6 * s;
  }
  return cx - x;
}
const textW = (str, s = 1) => String(str).length * 6 * s - s;
const textC = (str, y, col, s = 1) => text(str, ((W - textW(str, s)) / 2) | 0, y, col, s);

/* draws text with a 1px ink outline so it reads over any background */
function textO(str, x, y, col, s = 1, oc = C.ink) {
  for (const [dx, dy] of [[-s,0],[s,0],[0,-s],[0,s],[-s,-s],[s,-s],[-s,s],[s,s]])
    text(str, x + dx, y + dy, oc, s);
  text(str, x, y, col, s);
}
const textCO = (str, y, col, s = 1, oc) =>
  textO(str, ((W - textW(str, s)) / 2) | 0, y, col, s, oc);

/* ----------------------------------------------------------------- sprite */
function sprite(rows, pal) {
  const w = rows[0].length, h = rows.length;
  const cv = document.createElement('canvas');
  cv.width = w; cv.height = h;
  const c = cv.getContext('2d');
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const p = pal[rows[y][x]];
      if (p) { c.fillStyle = p; c.fillRect(x, y, 1, 1); }
    }
  return cv;
}

/* The hammer: head up, handle down, claw on the left. 14 x 30. */
const HAMMER = sprite([
  '..DDDDDDDDDDD.',
  '.DLLMMMMMMMMMD',
  'DLLMMMMMMMMMMD',
  'DLMMMMMMMMMMMD',
  'DLMMMMMMMMMMMD',
  'DLMMMMMMMMMMMD',
  'DLDDMMMMMMMMMD',
  'DLD.DMMMMMMMMD',
  '.DD..DmmmmmmD.',
  '....DHHhhD....',
  '....DHHhhD....',
  '....DHHhhD....',
  '....DHHhhD....',
  '....DHHhhD....',
  '....DHHhhD....',
  '....DHHhhD....',
  '....DHHhhD....',
  '....DHHhhD....',
  '....DHHhhD....',
  '....DHHhhD....',
  '....DHHhhD....',
  '....DHHhhD....',
  '....DHHhhD....',
  '....DhhhhD....',
  '....DhhhhD....',
  '....DhhhhD....',
  '....DhhhhD....',
  '....DHHhhD....',
  '...DHHHhhhD...',
  '...DDDDDDDD...'
], { D: C.ink, L: C.metalL, M: C.metal, m: C.metalD,
     H: C.handleL, h: C.handle });

/* pivot = the point the hand grips, and the point the hammer tumbles around */
const HPX = 7, HPY = 21;
/* how far the head centre sits from the pivot, along the hammer's own "up" */
const HEAD_OFF = 17;

/* ------------------------------------------------------------------ audio */
let actx = null;
function audio() {
  if (!actx) { try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} }
  if (actx && actx.state === 'suspended') actx.resume();
  return actx;
}
function tone(f, dur, type = 'square', vol = 0.12, f2 = null) {
  const a = audio(); if (!a) return;
  const o = a.createOscillator(), g = a.createGain();
  o.type = type; o.frequency.setValueAtTime(f, a.currentTime);
  if (f2) o.frequency.exponentialRampToValueAtTime(Math.max(20, f2), a.currentTime + dur);
  g.gain.setValueAtTime(vol, a.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0005, a.currentTime + dur);
  o.connect(g); g.connect(a.destination);
  o.start(); o.stop(a.currentTime + dur + 0.02);
}
function noise(dur, vol = 0.25, lp = 1600) {
  const a = audio(); if (!a) return;
  const n = Math.floor(a.sampleRate * dur);
  const buf = a.createBuffer(1, n, a.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
  const src = a.createBufferSource(); src.buffer = buf;
  const f = a.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = lp;
  const g = a.createGain(); g.gain.value = vol;
  src.connect(f); f.connect(g); g.connect(a.destination);
  src.start();
}
function arp(notes, step = 0.06, type = 'square', vol = 0.12) {
  notes.forEach((f, i) => setTimeout(() => tone(f, step * 1.6, type, vol), i * step * 1000));
}
const SFX = {
  charge: () => tone(160, 0.05, 'square', 0.05),
  throw:  () => { tone(220, 0.16, 'square', 0.1, 640); noise(0.06, 0.08, 900); },
  spin:   () => tone(880, 0.02, 'square', 0.03),
  catch:  () => { tone(520, 0.05, 'square', 0.12); noise(0.05, 0.14, 2400); },
  perfect:() => arp([523, 659, 784, 1046], 0.05),
  good:   () => arp([440, 659], 0.05),
  hit:    () => { noise(0.16, 0.35, 1100); tone(110, 0.14, 'triangle', 0.22, 55); },
  weak:   () => { noise(0.09, 0.16, 700); tone(90, 0.1, 'triangle', 0.12, 60); },
  whiff:  () => tone(300, 0.16, 'sawtooth', 0.07, 110),
  sweep:  () => tone(1200, 0.012, 'square', 0.025),
  lock:   () => tone(660, 0.06, 'square', 0.13),
  core:   () => { tone(990, 0.05, 'square', 0.15); arp([1320, 1760], 0.045); },
  lockMiss: () => tone(140, 0.14, 'sawtooth', 0.11, 70),
  drop:   () => { tone(300, 0.35, 'square', 0.12, 70); noise(0.1, 0.14, 500); },
  ow:     () => { tone(180, 0.3, 'sawtooth', 0.14, 60); noise(0.14, 0.2, 400); },
  level:  () => arp([523, 659, 784, 1046, 1318], 0.06, 'square', 0.13),
  over:   () => arp([392, 330, 262, 196], 0.14, 'square', 0.13),
  start:  () => arp([392, 523, 659], 0.07)
};

/* ------------------------------------------------------------------ world */
const GROUND_Y = 194;          // where the player stands
const STUMP_L = 158, STUMP_R = 232, STUMP_TOP = 166;
const NAIL_X = 195, NAIL_Y = STUMP_TOP + 4;
const NAIL_LEN = 15;           // shaft visible above the wood at zero depth
const PLAYER_X = 142;
const HAND_X = 158, HAND_Y = 134;   // rest / throw point
const DROP_LINE = HAND_Y + 9;       // past this it hits the dirt
const SHOULDER = [148, 164], SHOULDER_L = [137, 165];
const GRAVITY = 0.13;

/* ------------------------------------------------- pre-rendered background */
const bg = document.createElement('canvas');
bg.width = W; bg.height = H;
(function paintBackground() {
  const b = bg.getContext('2d');
  const R = (x, y, w, h, c) => { b.fillStyle = c; b.fillRect(x | 0, y | 0, w | 0, h | 0); };

  R(0, 0, W, H, C.sky1);
  R(0, 62, W, 34, C.sky2);
  R(0, 96, W, 40, C.sky3);
  // dither seams between sky bands
  for (const [y, c] of [[60, C.sky2], [94, C.sky3]])
    for (let x = 0; x < W; x += 2) R(x + (y / 2 % 2), y, 1, 2, c);

  // sun
  R(30, 22, 18, 18, C.sun); R(26, 26, 26, 10, C.sun); R(34, 18, 10, 26, C.sun);

  // clouds
  const cloud = (x, y, s) => {
    R(x, y, 22 * s, 5, C.cloud); R(x + 5, y - 4, 12 * s, 5, C.cloud);
    R(x + 11, y - 7, 8, 4, C.cloud); R(x - 3, y + 3, 28 * s, 3, C.cloudS);
  };
  cloud(72, 30, 1); cloud(184, 46, 1); cloud(126, 18, 0.7); cloud(220, 22, 0.6);

  // far hills
  for (let x = 0; x < W; x++) {
    const h = 16 + Math.sin(x * 0.035) * 7 + Math.sin(x * 0.011 + 2) * 9;
    R(x, 136 - h, 1, h + 6, C.farHill);
  }
  // pine treeline
  const pine = (x, base, hgt, wid) => {
    for (let i = 0; i < hgt; i++) {
      const w = Math.ceil((i / hgt) * wid) + 1;
      R(x - w, base - hgt + i, w * 2 + 1, 1, i % 5 < 3 ? C.treeD : C.treeM);
    }
    R(x - 1, base - 3, 3, 5, C.trunk);
  };
  let seed = 7;
  const rnd = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
  for (let x = -6; x < W + 10; x += 11 + ((rnd() * 7) | 0))
    pine(x, 150 + ((rnd() * 4) | 0), 22 + ((rnd() * 16) | 0), 6 + ((rnd() * 4) | 0));

  // grass field
  R(0, 148, W, H - 148, C.grassD);
  for (let x = 0; x < W; x++) {
    const h = 148 + Math.round(Math.sin(x * 0.09) * 1.4) + 4;
    R(x, h, 1, H - h, C.grass);
    if ((x * 7 + ((x * x) % 13)) % 11 === 0) R(x, h - 2, 1, 3, C.grassL);
  }
  R(0, 200, W, 3, C.grassD);
  for (let x = 0; x < W; x += 3) R(x + (x % 2), 206 + ((x * 5) % 9), 2, 1, C.grassL);
  R(0, 214, W, 10, C.dirt);
  for (let x = 0; x < W; x += 5) R(x, 214, 2, 2, C.dirtD);

  /* ---- stump ---- */
  const cx = (STUMP_L + STUMP_R) / 2, rx = (STUMP_R - STUMP_L) / 2, ry = 8;
  const botY = 198;
  // bark barrel
  for (let y = STUMP_TOP; y < botY; y++) {
    const t = (y - STUMP_TOP) / (botY - STUMP_TOP);
    const w = rx * (1 + t * 0.06);
    R(cx - w, y, w * 2, 1, C.bark);
  }
  // volume: lit on the sun side, shadowed on the far side
  R(STUMP_L + 1, STUMP_TOP + 8, 5, botY - STUMP_TOP - 10, C.barkL);
  R(STUMP_R - 8, STUMP_TOP + 8, 8, botY - STUMP_TOP - 10, C.barkD);
  // ragged vertical bark cracks
  let s2 = 3;
  const rr = () => (s2 = (s2 * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
  for (let i = 0; i < 30; i++) {
    const x = STUMP_L + 1 + ((rr() * (STUMP_R - STUMP_L - 2)) | 0);
    const y0 = STUMP_TOP + 8 + ((rr() * 22) | 0);
    const hh = Math.min(6 + ((rr() * 26) | 0), botY - 5 - y0);
    const col = rr() < 0.55 ? C.barkD : C.barkL;
    if (hh > 0) R(x, y0, 1, hh, col);
    if (rr() < 0.45 && hh > 6) R(x + 1, y0 + 3, 1, hh - 5, col);
  }
  for (let i = 0; i < 46; i++) {
    const x = STUMP_L + 1 + ((rr() * (STUMP_R - STUMP_L - 3)) | 0);
    const y = STUMP_TOP + 10 + ((rr() * (botY - STUMP_TOP - 16)) | 0);
    R(x, y, 2, 1, rr() < 0.5 ? C.barkD : C.barkL);
  }
  R(STUMP_L - 2, botY - 4, STUMP_R - STUMP_L + 4, 4, C.barkD);
  // roots
  R(STUMP_L - 7, botY - 6, 8, 6, C.bark); R(STUMP_R - 1, botY - 5, 8, 5, C.bark);
  R(STUMP_L - 7, botY - 2, 8, 2, C.barkD); R(STUMP_R - 1, botY - 2, 8, 2, C.barkD);

  // cut face, with rings
  const img = b.getImageData(0, 0, W, H);
  const px = img.data;
  const put = (x, y, hex) => {
    const i = ((y | 0) * W + (x | 0)) * 4;
    px[i] = parseInt(hex.slice(1, 3), 16);
    px[i + 1] = parseInt(hex.slice(3, 5), 16);
    px[i + 2] = parseInt(hex.slice(5, 7), 16);
  };
  for (let y = STUMP_TOP - ry; y <= STUMP_TOP + ry; y++)
    for (let x = STUMP_L - 1; x <= STUMP_R + 1; x++) {
      const dx = (x - cx) / rx, dy = (y - STUMP_TOP) / ry;
      const r = Math.sqrt(dx * dx + dy * dy);
      if (r > 1) continue;
      if (r > 0.93) { put(x, y, C.barkD); continue; }
      // wobbly concentric rings
      const wob = r * 9 + Math.sin(Math.atan2(dy, dx) * 3) * 0.35 + Math.sin(x * 0.4) * 0.15;
      const band = Math.sin(wob) ;
      let col = band > 0.45 ? C.wood1 : band > -0.1 ? C.wood2 : band > -0.7 ? C.wood3 : C.wood4;
      if (r > 0.86) col = C.wood4;
      put(x, y, col);
    }
  b.putImageData(img, 0, 0);
  // saw-cut highlight along the front lip
  R(STUMP_L + 2, STUMP_TOP + ry - 1, STUMP_R - STUMP_L - 4, 1, C.wood4);
})();

/* --------------------------------------------------------------- entities */
const rand = (a, b) => a + Math.random() * (b - a);
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const lerp = (a, b, t) => a + (b - a) * t;
const norm = a => ((a + 180) % 360 + 360) % 360 - 180;
const D2R = Math.PI / 180;
/* the hammer's own "up" vector for a given rotation */
const upVec = a => [Math.sin(a * D2R), -Math.cos(a * D2R)];

/* how far the hands can actually get toward a point before the arms run out */
const ARM_REACH = 42;
function reachTo(x, y) {
  const dx = x - SHOULDER[0], dy = y - SHOULDER[1];
  const d = Math.hypot(dx, dy) || 1;
  if (d <= ARM_REACH) return [x, y];
  return [SHOULDER[0] + dx / d * ARM_REACH, SHOULDER[1] + dy / d * ARM_REACH];
}

let particles = [];
function burst(x, y, n, cols, spd, life, grav = 0.16) {
  for (let i = 0; i < n; i++) {
    const a = rand(0, Math.PI * 2), s = rand(spd * 0.3, spd);
    particles.push({
      x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - rand(0, spd * 0.6),
      life: rand(life * 0.5, life), col: cols[(Math.random() * cols.length) | 0],
      sz: Math.random() < 0.3 ? 2 : 1, g: grav
    });
  }
}

let floaters = [];
const float = (str, x, y, col, s = 1, life = 60) =>
  floaters.push({ str, x, y, col, s, life, max: life });

/* ----------------------------------------------------------------- state */
const S = {
  TITLE: 'title', READY: 'ready', CHARGE: 'charge', FLY: 'fly',
  CAUGHT: 'caught', AIM: 'aim', SWING: 'swing', SETTLE: 'settle',
  DROP: 'drop', CLEAR: 'clear', OVER: 'over'
};

let g = null;
function newGame() {
  g = {
    state: S.TITLE, t: 0, score: 0, lives: 3, level: 1, combo: 0, best: bestScore(),
    depth: 0, bends: 0, nailX: NAIL_X,
    charge: 0, power: 0,
    ham: { x: HAND_X, y: HAND_Y, vy: 0, a: 0, spin: 0 }, catchPos: [HAND_X, HAND_Y],
    grip: 0, grade: null, aim: null, swingT: 0, struck: false,
    hand: [HAND_X, HAND_Y], lean: 0, shake: 0, flash: 0,
    msg: '', msgCol: C.white, msgT: 0,
    tooEarly: 0, dropT: 0, clearT: 0, overT: 0, hintT: 0
  };
  particles = []; floaters = [];
}
function bestScore() { try { return +localStorage.getItem('stump.best') || 0; } catch (e) { return 0; } }
function saveBest(v) { try { localStorage.setItem('stump.best', v); } catch (e) {} }

/* Difficulty knobs.
   The hammer is catchable for the whole of its descent, from `catchTop` down to
   DROP_LINE, so every throw sweeps through a true grip at least once — whether
   you take it is on you. Later nails raise the ceiling (fewer chances) and a
   harder throw spins faster (more chances, but each one flashes past). */
/* The ceiling of the reach creeps down as nails get stubborn, which costs you
   chances rather than reaction time. Bounded so a throw always turns past true
   at least once. */
const catchTop = () => Math.min(46, 36 + (g.level - 1) * 4);
/* Ceiling on how fast it may tumble, so the top grade stays reachable by hand. */
const spinCap = () => Math.min(16, 13 + (g.level - 1) * 0.6);
/* Total degrees the hammer should turn while it is catchable. Always more than
   one full turn, so every throw passes through a true grip — missing it is a
   timing error, never bad luck. Harder throws and later nails turn faster. */
const sweepFor = p => 400 + (g.level - 1) * 70 + p * 140;
/* Later nails are longer, so a run asks for more good swings in a row. */
const depthNeed = () => 100 + (g.level - 1) * 15;

function say(msg, col, life = 50) { g.msg = msg; g.msgCol = col; g.msgT = life; }

/* ------------------------------------------------------------------ input */
let pressed = false;
function down() {
  audio();
  if (g.state === S.TITLE) { newGame(); g.state = S.READY; SFX.start(); return; }
  if (g.state === S.OVER) { if (g.overT > 45) { newGame(); g.state = S.READY; SFX.start(); } return; }
  if (g.state === S.READY) { g.state = S.CHARGE; g.charge = 0; SFX.charge(); return; }
  if (g.state === S.FLY) { attemptCatch(); return; }
  // brief lockout so the press that caught the hammer cannot also fire the swing
  if (g.state === S.AIM && g.aim.t > 5 && g.aim.locked < 0) { lockSwing(g.aim.pos); return; }
}
function up() { if (g.state === S.CHARGE) release(); }

addEventListener('keydown', e => {
  if (e.code === 'Space' || e.code === 'Enter' || e.code === 'ArrowUp') {
    e.preventDefault();
    if (!e.repeat && !pressed) { pressed = true; down(); }
  }
  if (e.code === 'KeyR') { newGame(); g.state = S.READY; }
});
addEventListener('keyup', e => {
  if (e.code === 'Space' || e.code === 'Enter' || e.code === 'ArrowUp') { pressed = false; up(); }
});
canvas.addEventListener('pointerdown', e => { e.preventDefault(); pressed = true; down(); });
addEventListener('pointerup', e => { if (pressed) { pressed = false; up(); } });
addEventListener('blur', () => { if (pressed) { pressed = false; up(); } });
addEventListener('contextmenu', e => e.preventDefault());

/* ------------------------------------------------------------------- flow */
function release() {
  g.power = clamp(g.charge, 0.18, 1);
  const h = g.ham;
  h.x = HAND_X; h.y = HAND_Y;
  h.vy = -(4.4 + g.power * 0.9);
  h.a = 0;
  // spin is solved from the flight so the catchable stretch turns `sweep` degrees
  const apex = HAND_Y - h.vy * h.vy / (2 * GRAVITY);
  const top = Math.max(apex, catchTop());
  const t1 = Math.sqrt(Math.max(0, 2 * (top - apex) / GRAVITY));
  const t2 = Math.sqrt(2 * (DROP_LINE - apex) / GRAVITY);
  const live = Math.max(8, t2 - t1);
  h.spin = clamp(sweepFor(g.power) / live, 5, spinCap()) * (Math.random() < 0.5 ? -1 : 1);
  g.state = S.FLY; g.t = 0; g.tooEarly = 0;
  SFX.throw();
  burst(HAND_X, HAND_Y, 5, [C.white, C.cloudS], 1.2, 14, 0.05);
}

function attemptCatch() {
  const h = g.ham;
  if (h.vy <= 0) {                       // still on the way up — nothing to grab
    g.tooEarly = 16;
    return;
  }
  if (h.y < catchTop()) {                // lunged at it way out of reach
    fumble('OUT OF REACH');
    return;
  }
  g.grip = norm(h.a);
  const a = Math.abs(g.grip);
  if (a > 155) { fumble('CAUGHT THE HEAD!', true); return; }

  SFX.catch();
  g.state = S.CAUGHT; g.t = 0;
  g.catchPos = [h.x, h.y];
  g.hand = reachTo(h.x, h.y);
  g.flash = 4;
  burst(h.x, h.y, 8, [C.white, C.gold], 1.6, 16, 0.08);

  /* The grip decides how much room you get on the swing. Square in the hand and
     the nail is hard to miss; cocked over and you are threading a needle. */
  if (a <= 12)      g.grade = { name: 'PERFECT',  depth: 34, win: .42, core: .130, bend: 0, col: C.gold,    pts: 300 };
  else if (a <= 28) g.grade = { name: 'SOLID',    depth: 23, win: .30, core: .090, bend: 0, col: C.good,    pts: 180 };
  else if (a <= 55) g.grade = { name: 'OFF-TRUE', depth: 14, win: .19, core: .055, bend: 0, col: C.white,   pts: 80  };
  else if (a <= 100)g.grade = { name: 'GLANCING', depth: 7,  win: .11, core: .032, bend: 1, col: C.handleL, pts: 25  };
  else              g.grade = { name: 'BACKWARDS',depth: 3,  win: .055,core: .018, bend: 1, col: C.bad,     pts: 10  };
}

/* Arm the swing meter: a marker sweeps once, and where you stop it decides
   whether the head finds the nail at all. */
function armSwing() {
  const gr = g.grade;
  const half = gr.win / 2;
  g.aim = {
    t: 0, pos: 0, frames: Math.max(38, 56 - (g.level - 1) * 3),
    win: gr.win, core: gr.core,
    centre: clamp(rand(0.44, 0.80), half + 0.05, 1 - half - 0.05),
    locked: -1, result: null, off: 0
  };
  g.state = S.AIM; g.t = 0;
}

/* Stop the marker. `pos` of null means it ran off the end untouched. */
function lockSwing(pos) {
  const a = g.aim;
  a.locked = pos === null ? 1 : pos;
  const d = pos === null ? 9 : a.locked - a.centre;
  const sign = d < 0 ? -1 : 1;

  if (pos !== null && Math.abs(d) <= a.core / 2) {
    a.result = 'core'; a.off = 0;
    SFX.core();
  } else if (pos !== null && Math.abs(d) <= a.win / 2) {
    a.result = 'zone'; a.off = sign * 3;
    SFX.lock();
  } else {
    a.result = 'miss'; a.off = sign * rand(15, 27);
    SFX.lockMiss();
  }
  g.state = S.SWING; g.t = 0; g.swingT = 0; g.struck = false;
}

function fumble(msg, ow) {
  g.state = S.DROP; g.t = 0; g.dropT = 0;
  g.ham.vy = Math.max(g.ham.vy, 1.2);
  g.lives--; g.combo = 0;
  say(msg, C.bad, 80);
  g.shake = ow ? 7 : 4;
  (ow ? SFX.ow : SFX.drop)();
  if (ow) burst(HAND_X, HAND_Y, 14, [C.bad, C.shirt, C.white], 2.4, 26);
}

function strike() {
  g.struck = true;
  const gr = g.grade, res = g.aim.result;
  const swingMul = res === 'core' ? 1 : res === 'zone' ? 0.6 : 0;
  const powMul = 1 + g.power * 0.55;
  const bendPen = 1 - Math.min(0.4, g.bends * 0.1);
  const dep = gr.depth * swingMul * powMul * bendPen;

  if (res === 'miss') g.combo = 0;
  else if (res === 'core' && gr.depth >= 14) g.combo++;
  const mult = 1 + Math.min(4, g.combo) * 0.5;
  const pts = Math.round((gr.pts * (res === 'core' ? 1 : 0.5) + dep * 6) * mult * powMul);

  const ny = nailTopY();
  if (dep > 0.5) {
    g.depth = Math.min(depthNeed(), g.depth + dep);
    g.score += pts;
    g.shake = clamp(dep * 0.22, 1, 6);
    const nx = g.nailX;
    const big = res === 'core' && gr.depth >= 23;
    burst(nx, ny, big ? 16 : 9, [C.wood1, C.wood2, C.wood3, C.metalL], big ? 2.6 : 1.7, 30);
    if (res === 'core' && gr.depth >= 34) { g.flash = 6; SFX.perfect(); SFX.hit(); }
    else if (big) { SFX.good(); SFX.hit(); }
    else SFX.weak();
    float(res === 'core' ? 'FLUSH!' : 'CLEAN', nx, ny - 24, res === 'core' ? gr.col : C.white, 1, 55);
    float('+' + pts, nx, ny - 36, C.white, 1, 55);
    if (mult > 1) float('X' + mult.toFixed(1).replace('.0', ''), nx + 32, ny - 10, C.gold, 1, 50);
  } else {
    // the head came down on bare wood next to the nail
    SFX.whiff();
    g.shake = 3;
    const mx = g.nailX + g.aim.off;
    burst(mx, NAIL_Y - 2, 12, [C.wood1, C.wood2, C.wood3, C.wood4], 2.2, 28);
    float(gr.name === 'BACKWARDS' ? 'WRONG END!' : 'MISSED THE NAIL', mx, ny - 26, C.bad, 1, 60);
  }
  if ((gr.bend || res === 'miss') && g.depth < depthNeed()) {
    g.bends++;
    g.nailX += rand(-0.6, 0.6);
    if (g.bends === 3) float('BENT NAIL', g.nailX, ny - 38, C.bad, 1, 60);
  }
}

function nailTopY() {
  const out = NAIL_LEN * (1 - g.depth / depthNeed());
  return NAIL_Y - out;
}

/* ------------------------------------------------------------------ update */
function update() {
  g.t++;
  if (g.shake > 0) g.shake *= 0.82;
  if (g.flash > 0) g.flash--;
  if (g.msgT > 0) g.msgT--;
  if (g.tooEarly > 0) g.tooEarly--;
  g.hintT++;

  for (const p of particles) {
    p.x += p.vx; p.y += p.vy; p.vy += p.g; p.vx *= 0.99; p.life--;
    if (p.y > 208) { p.y = 208; p.vy *= -0.35; p.vx *= 0.6; }
  }
  particles = particles.filter(p => p.life > 0);
  for (const f of floaters) { f.y -= 0.35; f.life--; }
  floaters = floaters.filter(f => f.life > 0);

  const h = g.ham;

  switch (g.state) {
    case S.TITLE:
      h.a = (g.t * 1.6) % 360;
      h.x = W / 2; h.y = 104 + Math.sin(g.t * 0.05) * 5;
      break;

    case S.READY:
      g.hand = [HAND_X, HAND_Y + Math.sin(g.t * 0.08) * 1.2];
      h.x = g.hand[0]; h.y = g.hand[1]; h.a = 0;
      g.lean = 0;
      break;

    case S.CHARGE:
      g.charge = Math.min(1, g.charge + 0.021);
      if (g.t % 7 === 0) tone(180 + g.charge * 420, 0.03, 'square', 0.05);
      g.hand = [HAND_X - g.charge * 4, HAND_Y + 4 + g.charge * 7];
      h.x = g.hand[0]; h.y = g.hand[1];
      h.a = -g.charge * 22;
      break;

    case S.FLY: {
      h.y += h.vy; h.vy += GRAVITY; h.a += h.spin;
      // hands track it once it is on the way down and within reach
      const live = h.vy > 0 && h.y >= catchTop();
      const tgt = live ? reachTo(h.x, h.y) : [HAND_X, HAND_Y - 2 + Math.sin(g.t * 0.2) * 1.5];
      g.hand = [lerp(g.hand[0], tgt[0], 0.35), lerp(g.hand[1], tgt[1], 0.35)];
      if (h.y > DROP_LINE) fumble('DROPPED IT');
      break;
    }

    case S.CAUGHT: {
      // gather it in: the hammer comes down to the rest pose, grip untouched
      const e = 1 - Math.pow(1 - Math.min(1, g.t / 14), 3);
      h.x = lerp(g.catchPos[0], HAND_X, e);
      h.y = lerp(g.catchPos[1], HAND_Y, e);
      h.a = g.grip;
      g.hand = reachTo(h.x, h.y);
      if (g.t > 28) armSwing();
      break;
    }

    case S.AIM: {
      const a = g.aim;
      a.t++;
      a.pos = Math.min(1, a.t / a.frames);
      if (a.t % 5 === 0) SFX.sweep();
      // held ready — matches the swing's rest pose so there is no pop
      h.x = HAND_X; h.y = HAND_Y + Math.sin(a.t * 0.28); h.a = g.grip;
      g.hand = [h.x, h.y];
      if (a.pos >= 1) lockSwing(null);      // let it run out and you flail
      break;
    }

    case S.SWING: {
      g.swingT++;
      const t = g.swingT;
      const rest = [HAND_X, HAND_Y];
      const wind = [HAND_X - 15, HAND_Y - 13];
      /* Aim the blow. A true grip with a well-timed swing puts the head square
         on the nail head; mistiming walks the whole arc off to one side. */
      const A_HIT = 128;
      const miss = g.aim.result === 'miss';
      const nt = miss ? NAIL_Y - 1 : nailTopY();
      const hit = [g.nailX + g.aim.off - HEAD_OFF * Math.sin(A_HIT * D2R),
                   (nt - 2) + HEAD_OFF * Math.cos(A_HIT * D2R)];
      let base;
      if (t <= 12) {                       // wind up
        const k = t / 12, e = k * k;
        g.hand = [lerp(rest[0], wind[0], e), lerp(rest[1], wind[1], e)];
        base = lerp(0, -52, e);
        g.lean = -k * 2;
      } else if (t <= 21) {                // strike
        const k = (t - 12) / 9, e = k * k;
        g.hand = [lerp(wind[0], hit[0], e), lerp(wind[1], hit[1], e)];
        base = lerp(-52, A_HIT, e);
        g.lean = lerp(-2, 7, e);
      } else {                             // recoil
        const k = Math.min(1, (t - 21) / 20);
        const ez = 1 - (1 - k) * (1 - k);
        g.hand = [lerp(hit[0], rest[0], ez), lerp(hit[1], rest[1], ez)];
        base = lerp(A_HIT, 0, ez);
        g.lean = lerp(7, 0, ez);
      }
      h.x = g.hand[0]; h.y = g.hand[1]; h.a = base + g.grip;
      if (t === 21 && !g.struck) strike();
      if (t > 44) {
        g.state = S.SETTLE; g.t = 0;
        g.lean = 0;
      }
      break;
    }

    case S.SETTLE:
      h.x = HAND_X; h.y = HAND_Y; h.a = 0;
      g.hand = [HAND_X, HAND_Y];
      if (g.t > 14) {
        if (g.depth >= depthNeed()) {
          g.state = S.CLEAR; g.t = 0; g.clearT = 0;
          const bonus = 500 + g.level * 150 + Math.max(0, 3 - g.bends) * 200;
          g.score += bonus;
          say('NAIL DRIVEN!  +' + bonus, C.gold, 999);
          SFX.level();
          burst(g.nailX, NAIL_Y, 26, [C.gold, C.white, C.wood1], 3, 40);
        } else {
          g.state = S.READY; g.t = 0;
        }
      }
      break;

    case S.DROP:
      g.dropT++;
      h.y += h.vy; h.vy += GRAVITY; h.a += h.spin * 0.7;
      if (h.y > 196) {
        h.y = 196;
        if (Math.abs(h.vy) > 0.5) {
          h.vy *= -0.35; h.spin *= 0.4;
          burst(h.x, 198, 6, [C.dirt, C.grassL, C.wood3], 1.6, 18);
          noise(0.06, 0.12, 700);
        } else { h.vy = 0; h.spin = 0; }
      }
      if (g.dropT > 72) {
        if (g.lives <= 0) {
          g.state = S.OVER; g.overT = 0;
          if (g.score > g.best) { g.best = g.score; saveBest(g.score); }
          SFX.over();
        } else { g.state = S.READY; g.t = 0; g.msgT = 0; }
      }
      break;

    case S.CLEAR:
      g.clearT++;
      h.x = HAND_X; h.y = HAND_Y; h.a = 0;
      if (g.clearT % 9 === 0) burst(g.nailX, NAIL_Y, 4, [C.gold, C.white], 2, 26);
      if (g.clearT > 96) {
        g.level++; g.depth = 0; g.bends = 0; g.nailX = NAIL_X;
        g.state = S.READY; g.t = 0; g.msgT = 0;
      }
      break;

    case S.OVER:
      g.overT++;
      h.a += 0.6;
      break;
  }
}

/* -------------------------------------------------------------------- draw */
const R = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x | 0, y | 0, w | 0, h | 0); };

function drawRot(img, x, y, px, py, deg) {
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));
  ctx.rotate(deg * D2R);
  ctx.drawImage(img, -px, -py);
  ctx.restore();
}

function thickLine(x0, y0, x1, y1, w, col) {
  const dx = x1 - x0, dy = y1 - y0;
  const n = Math.max(1, Math.ceil(Math.hypot(dx, dy)));
  ctx.fillStyle = col;
  const o = (w / 2) | 0;
  for (let i = 0; i <= n; i++) {
    const x = Math.round(x0 + dx * i / n) - o;
    const y = Math.round(y0 + dy * i / n) - o;
    ctx.fillRect(x, y, w, w);
  }
}

function elbow(sx, sy, hx, hy, l1, l2, sign) {
  let dx = hx - sx, dy = hy - sy;
  let d = Math.hypot(dx, dy) || 0.001;
  const ux = dx / d, uy = dy / d;
  d = Math.min(d, l1 + l2 - 0.01);
  const a = (l1 * l1 - l2 * l2 + d * d) / (2 * d);
  const hh = Math.sqrt(Math.max(0, l1 * l1 - a * a));
  return [sx + ux * a - uy * hh * sign, sy + uy * a + ux * hh * sign];
}

function drawArm(sx, sy, hx, hy, sign, back) {
  const [ex, ey] = elbow(sx, sy, hx, hy, 17, 20, sign);
  thickLine(sx, sy, ex, ey, 5, back ? C.shirtD : C.shirt);
  thickLine(ex, ey, hx, hy, 4, back ? C.skinD : C.skin);
  R(ex - 2, ey - 2, 4, 4, back ? C.shirtD : C.shirtD);
  R(hx - 2, hy - 2, 5, 5, back ? C.skinD : C.skin);
  R(hx - 2, hy - 2, 5, 1, C.ink);
}

function drawPlayer() {
  const cx = Math.round(PLAYER_X + g.lean);
  const fy = GROUND_Y;
  const ink = C.ink;

  // shadow
  ctx.globalAlpha = 0.22;
  R(cx - 12, fy - 1, 24, 3, C.black);
  ctx.globalAlpha = 1;

  // boots + legs
  R(cx - 10, fy - 5, 10, 5, C.boot); R(cx + 1, fy - 5, 10, 5, C.boot);
  R(cx - 10, fy - 2, 10, 2, ink);    R(cx + 1, fy - 2, 10, 2, ink);
  R(cx - 8, fy - 17, 7, 12, C.pants); R(cx + 2, fy - 17, 7, 12, C.pants);
  R(cx - 8, fy - 17, 2, 12, C.pantsD); R(cx + 2, fy - 17, 2, 12, C.pantsD);
  R(cx - 9, fy - 17, 1, 12, ink); R(cx + 9, fy - 17, 1, 12, ink);

  // torso (plaid)
  const ty = fy - 36, th = 20;
  R(cx - 10, ty, 20, th, C.shirt);
  for (let y = ty; y < ty + th; y += 5) R(cx - 10, y, 20, 1, C.shirtD);
  for (let x = cx - 10; x < cx + 10; x += 5) R(x, ty, 1, th, C.shirtD);
  for (let y = ty + 2; y < ty + th; y += 5) R(cx - 10, y, 20, 1, C.shirtL);
  R(cx - 11, ty, 1, th, ink); R(cx + 10, ty, 1, th, ink);
  R(cx - 10, ty - 1, 20, 1, ink);
  // belt
  R(cx - 10, fy - 18, 20, 3, C.barkD);
  R(cx - 2, fy - 18, 4, 3, C.gold);

  // head
  const hy = fy - 52, hgt = 16;
  R(cx - 7, hy, 14, hgt, C.skin);
  R(cx - 8, hy, 1, hgt, ink); R(cx + 7, hy, 1, hgt, ink);
  R(cx - 7, hy + hgt, 14, 1, ink);
  // beard
  R(cx - 7, hy + 9, 14, 7, C.hair);
  R(cx - 5, hy + 9, 10, 3, C.skinD);
  R(cx - 7, hy + 12, 14, 4, C.hair);
  // eyes (looking right / up at the hammer)
  const look = (g.state === S.FLY) ? 1 : 0;
  R(cx - 4 + look, hy + 5, 2, 3, ink);
  R(cx + 2 + look, hy + 5, 2, 3, ink);
  // hair + cap
  R(cx - 8, hy - 1, 16, 4, C.hair);
  R(cx - 10, hy - 2, 20, 3, C.shirtD);
  R(cx - 8, hy - 7, 16, 5, C.shirt);
  R(cx - 8, hy - 8, 16, 1, ink); R(cx - 10, hy - 3, 20, 1, ink);
  R(cx - 10, hy + 1, 20, 1, ink);
}

function drawNail() {
  const out = NAIL_LEN * (1 - g.depth / depthNeed());
  const bend = g.bends * 6 * (g.nailX < NAIL_X ? -1 : 1);
  const bx = g.nailX;
  ctx.save();
  ctx.translate(Math.round(bx), NAIL_Y);
  ctx.rotate(bend * D2R);
  if (out > 0.6) {
    R(-1, -out, 2, out + 2, C.metal);      // shaft
    R(-1, -out, 1, out + 2, C.metalL);
    R(-3, -out - 2, 6, 2, C.metal);        // head
    R(-3, -out - 3, 6, 1, C.metalL);
    R(-3, -out, 6, 1, C.metalD);
    R(-4, -out - 3, 1, 4, C.ink); R(3, -out - 3, 1, 4, C.ink);
    R(-3, -out - 4, 6, 1, C.ink);
  } else {
    // driven flush — just the head sitting in the wood
    R(-3, -1, 6, 2, C.metalD);
    R(-3, -1, 6, 1, C.metal);
    R(-4, -2, 8, 1, C.wood4);
  }
  ctx.restore();
  // dimple in the wood
  R(bx - 5, NAIL_Y, 11, 1, C.wood4);
}

function drawCatchZone() {
  if (g.state !== S.FLY && g.state !== S.CHARGE) return;
  const top = catchTop();
  const live = g.state === S.FLY && g.ham.vy > 0 && g.ham.y >= top;
  const x0 = 132, x1 = 186;

  // the reachable corridor
  ctx.globalAlpha = live ? 0.13 : 0.07;
  R(x0, top, x1 - x0, DROP_LINE - top, live ? C.gold : C.white);
  ctx.globalAlpha = live ? 0.8 : 0.35;
  for (let y = top; y < DROP_LINE; y += 4) {
    R(x0, y, 1, 2, live ? C.gold : C.white);
    R(x1 - 1, y, 1, 2, live ? C.gold : C.white);
  }
  // ceiling of the reach
  ctx.globalAlpha = live ? 0.7 : 0.35;
  for (let x = x0; x < x1; x += 4) R(x, top, 2, 1, C.white);
  ctx.globalAlpha = 1;

  // the deadline — cross it and the hammer is in the dirt
  const dl = live ? C.bad : C.dim;
  for (let x = x0 - 6; x < x1 + 6; x += 3) R(x, DROP_LINE, 2, 1, dl);
  R(x0 - 6, DROP_LINE - 2, 1, 5, dl); R(x1 + 5, DROP_LINE - 2, 1, 5, dl);
}

function drawGripDial(x, y, ang, label) {
  const r = 12;
  // octagonal bezel, so it reads as a gauge and not a box
  for (let i = -r; i <= r; i++) {
    const w = Math.abs(i) > r - 4 ? r - (Math.abs(i) - (r - 4)) - 1 : r;
    R(x - w - 1, y + i, w * 2 + 3, 1, C.ink);
  }
  ctx.globalAlpha = 0.8;
  for (let i = -r + 1; i <= r - 1; i++) {
    const w = Math.abs(i) > r - 5 ? r - (Math.abs(i) - (r - 4)) - 2 : r - 1;
    R(x - w, y + i, w * 2 + 1, 1, '#232338');
  }
  ctx.globalAlpha = 1;
  // "true" marker at the top, plus quarter ticks
  R(x - 1, y - r + 1, 3, 1, C.good); R(x, y - r + 1, 1, 3, C.good);
  R(x - r + 2, y, 2, 1, C.dim); R(x + r - 3, y, 2, 1, C.dim);
  R(x, y + r - 3, 1, 2, C.dim);
  // the hammer, held exactly as it was caught
  const [ux, uy] = upVec(ang);
  thickLine(x - ux * 3, y - uy * 3, x + ux * 5, y + uy * 5, 2, C.handle);
  const hx = Math.round(x + ux * 7), hy = Math.round(y + uy * 7);
  R(hx - 2, hy - 2, 5, 5, C.metalL);
  R(hx - 1, hy - 1, 3, 3, C.metal);
  if (label) textO(label, x - textW(label) / 2, y + r + 3, C.white);
}

/* The swing meter. Its lit zone is exactly as wide as the grip earned. */
function drawSwingMeter() {
  const showFor = g.state === S.AIM || (g.state === S.SWING && g.swingT < 20);
  if (!showFor || !g.aim) return;
  const a = g.aim, gr = g.grade;
  const bw = 148, bx = ((W - bw) / 2) | 0, by = 202, bh = 9;

  R(bx - 2, by - 2, bw + 4, bh + 4, C.ink);
  R(bx, by, bw, bh, '#2a2a40');
  R(bx, by, bw, 1, '#1a1a2c');

  const zx = Math.round(bx + (a.centre - a.win / 2) * bw);
  const zw = Math.max(2, Math.round(a.win * bw));
  const cx = Math.round(bx + (a.centre - a.core / 2) * bw);
  const cw = Math.max(1, Math.round(a.core * bw));

  R(zx, by, zw, bh, gr.col);                       // the room your grip bought
  R(zx, by, zw, 1, C.white);
  R(cx, by, cw, bh, C.white);                      // flush-hit core
  R(cx, by + bh - 1, cw, 1, gr.col);

  // marker: sweeping, or frozen where you stopped it
  const mp = a.locked >= 0 ? a.locked : a.pos;
  const mx = Math.round(bx + mp * bw);
  const live = a.locked < 0;
  const mcol = live ? C.metalL : a.result === 'core' ? C.gold
             : a.result === 'zone' ? C.good : C.bad;
  R(mx - 1, by - 4, 3, bh + 8, C.ink);
  R(mx, by - 3, 1, bh + 6, mcol);
  R(mx - 1, by - 4, 3, 2, mcol);

  if (live) {
    if ((g.aim.t >> 3) % 2 === 0) textO('STRIKE!', bx + bw / 2 - textW('STRIKE!') / 2, by - 14, C.white);
  } else {
    const lbl = a.result === 'core' ? 'FLUSH' : a.result === 'zone' ? 'CONNECTED' : 'MISSED';
    textO(lbl, bx + bw / 2 - textW(lbl) / 2, by - 14, mcol);
  }
}

function drawHUD() {
  // top bar
  ctx.globalAlpha = 0.55; R(0, 0, W, 20, C.ink); ctx.globalAlpha = 1;
  R(0, 20, W, 1, '#000');

  text('SCORE', 4, 3, C.dim);
  text(String(g.score).padStart(6, '0'), 4, 11, C.white);

  const nl = 'NAIL ' + g.level;
  text(nl, ((W - textW(nl)) / 2) | 0, 3, C.dim);
  // depth bar
  const bw = 54, bx = ((W - bw) / 2) | 0;
  R(bx - 1, 11, bw + 2, 7, C.ink);
  R(bx, 12, bw, 5, '#2a2a40');
  const f = Math.round(bw * g.depth / depthNeed());
  if (f > 0) {
    R(bx, 12, f, 5, C.gold);
    R(bx, 12, f, 1, C.white);
  }

  // lives, as little hammers
  for (let i = 0; i < 3; i++) {
    const x = W - 10 - i * 11, y = 5;
    const on = i < g.lives;
    R(x - 4, y, 9, 4, on ? C.metal : '#3a3a4a');
    R(x - 4, y, 9, 1, on ? C.metalL : '#4a4a5a');
    R(x - 1, y + 4, 3, 8, on ? C.handleL : '#3a3a4a');
  }
  if (g.combo >= 2) {
    const cstr = 'X' + (1 + Math.min(4, g.combo) * 0.5).toFixed(1).replace('.0', '');
    text(cstr, W - 40 - textW(cstr), 12, C.gold);
  }
}

function drawScene() {
  ctx.drawImage(bg, 0, 0);
  drawNail();
  drawCatchZone();

  const h = g.ham;
  const showHammer = g.state !== S.CLEAR || g.clearT < 90;

  // player + arms, hammer sandwiched so the back arm reads behind it
  drawPlayer();
  const lean = g.lean;
  const sR = [SHOULDER[0] + lean, SHOULDER[1]];
  const sL = [SHOULDER_L[0] + lean, SHOULDER_L[1]];

  if (g.state !== S.FLY && g.state !== S.DROP && g.state !== S.TITLE && g.state !== S.OVER) {
    drawArm(sL[0], sL[1], g.hand[0] - 3, g.hand[1] + 3, 1, true);
    if (showHammer) drawRot(HAMMER, h.x, h.y, HPX, HPY, h.a);
    drawArm(sR[0], sR[1], g.hand[0], g.hand[1], 1, false);
  } else {
    // hands empty and up, hammer in the air
    drawArm(sL[0], sL[1], g.hand[0] - 5, g.hand[1] + 2, 1, true);
    drawArm(sR[0], sR[1], g.hand[0] + 2, g.hand[1], 1, false);
    if (showHammer) drawRot(HAMMER, h.x, h.y, HPX, HPY, h.a);
  }

  for (const p of particles) R(p.x, p.y, p.sz, p.sz, p.col);
  for (const f of floaters) {
    ctx.globalAlpha = f.life > 12 ? 1 : f.life / 12;
    const fw = textW(f.str, f.s);
    // keep it on screen — impact points near the edge would push it off
    const fx = clamp((f.x - fw / 2) | 0, 2, W - fw - 2);
    textO(f.str, fx, f.y | 0, f.col, f.s);
    ctx.globalAlpha = 1;
  }
}

function drawTitle() {
  ctx.drawImage(bg, 0, 0);
  drawNail();
  ctx.globalAlpha = 0.45; R(0, 0, W, H, C.ink); ctx.globalAlpha = 1;

  drawRot(HAMMER, g.ham.x, g.ham.y, HPX, HPY, g.ham.a);

  textCO('STUMP', 22, C.gold, 4);
  textCO('HAMMER  AND  NAIL', 62, C.white, 1);

  ctx.globalAlpha = 0.72; R(14, 138, W - 28, 56, C.ink); ctx.globalAlpha = 1;
  R(14, 137, W - 28, 1, C.dim); R(14, 194, W - 28, 1, C.dim);
  textC('THROW IT UP. CATCH IT.', 143, C.metalL);
  textC('HOW YOU CATCH IT IS HOW YOU', 154, C.dim);
  textC('HOLD IT. A TRUE GRIP BUYS A', 164, C.dim);
  textC('WIDE SWING. A BAD ONE LEAVES', 174, C.dim);
  textC('YOU A SLIVER.', 184, C.metalL);

  if ((g.t >> 4) % 2 === 0) textCO('PRESS  SPACE', 202, C.gold, 1);
  if (g.best > 0) textC('BEST ' + g.best, 214, C.dim);
}

function drawOver() {
  drawScene();
  ctx.globalAlpha = Math.min(0.72, g.overT / 40); R(0, 0, W, H, C.ink); ctx.globalAlpha = 1;
  textCO('GAME OVER', 62, C.bad, 3);
  textC('NAILS DRIVEN   ' + (g.level - 1), 106, C.metalL);
  textC('SCORE   ' + g.score, 120, C.white);
  textC('BEST    ' + g.best, 132, C.gold);
  if (g.overT > 45 && (g.overT >> 4) % 2 === 0) textCO('PRESS TO TRY AGAIN', 164, C.white);
}

function draw() {
  ctx.imageSmoothingEnabled = false;
  ctx.save();
  const sh = g.shake;
  if (sh > 0.4) ctx.translate(Math.round(rand(-sh, sh)), Math.round(rand(-sh, sh)));

  if (g.state === S.TITLE) { drawTitle(); ctx.restore(); return; }
  if (g.state === S.OVER) { drawOver(); ctx.restore(); return; }

  drawScene();
  drawHUD();

  /* charge meter */
  if (g.state === S.CHARGE) {
    const bw = 44, bx = 60, by = 116;
    R(bx - 1, by - 1, bw + 2, 8, C.ink);
    R(bx, by, bw, 6, '#2a2a40');
    const f = Math.round(bw * g.charge);
    R(bx, by, f, 6, g.charge > 0.85 ? C.bad : C.gold);
    R(bx, by, f, 1, C.white);
    textO('POWER', bx + 4, by - 10, C.white);
  }

  /* the grip readout — the whole point of the game */
  if (g.state === S.CAUGHT || g.state === S.AIM || g.state === S.SWING || g.state === S.SETTLE) {
    const dx = 34, dy = 74;
    const deg = Math.round(Math.abs(g.grip));
    textO('GRIP', dx - textW('GRIP') / 2, dy - 24, C.white);
    drawGripDial(dx, dy, g.grip, deg + '^');
    if (g.state === S.CAUGHT) {
      textO('LOCKED', dx - textW('LOCKED') / 2, dy + 24, g.grade.col);
      if (g.t < 22) textCO(g.grade.name, 100, g.grade.col, 2);
    } else {
      textO(g.grade.name, dx - textW(g.grade.name) / 2, dy + 24, g.grade.col);
    }
  }

  drawSwingMeter();

  if (g.tooEarly > 0) textO('TOO EARLY', HAND_X - textW('TOO EARLY') / 2, 106, C.white);

  /* status line */
  if (g.msgT > 0) {
    const a = g.msgT > 12 ? 1 : g.msgT / 12;
    ctx.globalAlpha = a;
    textCO(g.msg, 100, g.msgCol, 2);
    ctx.globalAlpha = 1;
  }

  /* soft prompts */
  if (g.state === S.READY && g.hintT > 40) {
    const p = g.level === 1 && g.score === 0 ? 'HOLD TO WIND UP' : 'HOLD';
    if ((g.t >> 4) % 2 === 0) textCO(p, 210, C.white);
  }
  if (g.state === S.FLY && g.ham.vy > 0 && g.level === 1 && g.score === 0)
    textCO('CATCH!', 210, C.gold);

  if (g.state === S.CLEAR) {
    ctx.globalAlpha = 0.75 + Math.sin(g.clearT * 0.3) * 0.25;
    textCO('FLUSH!', 56, C.gold, 3);
    ctx.globalAlpha = 1;
  }

  if (g.flash > 0) {
    ctx.globalAlpha = g.flash / 26;
    R(0, 0, W, H, C.white);
    ctx.globalAlpha = 1;
  }
  ctx.restore();
}

/* -------------------------------------------------------------------- loop */
function fit() {
  const raw = Math.min((innerWidth - 24) / W, (innerHeight - 76) / H);
  // whole-number scaling keeps pixels square; below 2x, fill the width instead
  const s = raw >= 2 ? Math.floor(raw) : Math.max(1, raw);
  canvas.style.width = Math.round(W * s) + 'px';
  canvas.style.height = Math.round(H * s) + 'px';
}
addEventListener('resize', fit);

newGame();
fit();

/* debug handle: lets a headless/hidden page be stepped and inspected */
window.STUMP = { step: n => { for (let i = 0; i < (n || 1); i++) update(); draw(); },
                 tick: n => { for (let i = 0; i < (n || 1); i++) update(); },
                 get g() { return g; }, S, down, up, reset: newGame };

let last = performance.now(), acc = 0;
const STEP = 1000 / 60;
function frame(now) {
  acc += Math.min(100, now - last);
  last = now;
  while (acc >= STEP) { update(); acc -= STEP; }
  draw();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

})();
