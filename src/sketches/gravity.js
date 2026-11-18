// Astral Siege sketch: a discrete 2D gravity field on a grid. Each projectile
// reads its acceleration from the cell it's in (O(1) lookup) instead of
// summing every well. Hovering adds your own well to bend the shots.

import { trackPointer, prefersReducedMotion, loop } from './gl';

const CELL = 26;        // css px per field cell
const G = 5.5e6;        // gravity constant (px³/s²)
const SOFT2 = 22 * 22;  // softening, avoids singularities
const SPEED = 270;      // muzzle speed (px/s)
const FIRE_EVERY = 0.05;
const MAX_SHOTS = 320;
const TRAIL = 22;

const PLANETS = [
  { fx: 0.34, fy: 0.42, m: 1.0, r: 26, c: ['#fbbf77', '#b45309'] },
  { fx: 0.7, fy: 0.26, m: 0.65, r: 17, c: ['#f472b6', '#9d174d'] },
  { fx: 0.66, fy: 0.74, m: 0.85, r: 21, c: ['#5eead4', '#0f766e'] },
];

export function createGravity(canvas, { onStats } = {}) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  const reduced = prefersReducedMotion();
  const ptr = trackPointer(canvas);

  let w = 0, h = 0, dpr = 1, cols = 0, rows = 0;
  let field = new Float32Array(0);
  let stars = [];
  let shots = [];
  let sparks = [];
  let fireT = 0, time = 0;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    cols = Math.ceil(w / CELL); rows = Math.ceil(h / CELL);
    field = new Float32Array(cols * rows * 2);
    stars = Array.from({ length: Math.round((w * h) / 2200) }, () => [Math.random() * w, Math.random() * h, Math.random()]);
  }

  function wells() {
    const list = PLANETS.map((p) => ({ x: p.fx * w, y: p.fy * h, m: p.m, r: p.r, c: p.c }));
    if (ptr.active) list.push({ x: ptr.x * w, y: (1 - ptr.y) * h, m: 0.9, r: 0, mouse: true });
    return list;
  }

  function buildField(ws) {
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const cx = (i + 0.5) * CELL, cy = (j + 0.5) * CELL;
        let ax = 0, ay = 0;
        for (const wl of ws) {
          const dx = wl.x - cx, dy = wl.y - cy;
          const d2 = dx * dx + dy * dy + SOFT2;
          const k = (G * wl.m) / (d2 * Math.sqrt(d2));
          ax += dx * k; ay += dy * k;
        }
        const idx = (j * cols + i) * 2;
        field[idx] = ax; field[idx + 1] = ay;
      }
    }
  }

  const sample = (x, y) => {
    const i = Math.min(cols - 1, Math.max(0, (x / CELL) | 0));
    const j = Math.min(rows - 1, Math.max(0, (y / CELL) | 0));
    const idx = (j * cols + i) * 2;
    return [field[idx], field[idx + 1]];
  };

  const turrets = () => [
    [18, h * 0.62, -0.25 + Math.sin(time * 0.9) * 0.55],
    [w * 0.14, h - 14, -1.1 + Math.sin(time * 0.7 + 1) * 0.45],
  ];

  function step(dt, ws) {
    time += dt;
    // Turrets sweep their aim through the field
    fireT += dt;
    while (fireT > FIRE_EVERY) {
      fireT -= FIRE_EVERY;
      for (const [tx, ty, aim] of turrets()) {
        if (shots.length >= MAX_SHOTS) break;
        const a = aim + (Math.random() - 0.5) * 0.06;
        shots.push({ x: tx, y: ty, vx: Math.cos(a) * SPEED, vy: Math.sin(a) * SPEED, trail: [] });
      }
    }
    const sub = 2, sdt = dt / sub;
    shots = shots.filter((s) => {
      for (let k = 0; k < sub; k++) {
        const [ax, ay] = sample(s.x, s.y);
        s.vx += ax * sdt; s.vy += ay * sdt;
        s.x += s.vx * sdt; s.y += s.vy * sdt;
      }
      s.trail.push(s.x, s.y);
      if (s.trail.length > TRAIL * 2) s.trail.splice(0, 2);
      for (const wl of ws) {
        if (wl.r && (s.x - wl.x) ** 2 + (s.y - wl.y) ** 2 < wl.r * wl.r) {
          for (let n = 0; n < 5; n++) {
            const a = Math.random() * Math.PI * 2, v = 40 + Math.random() * 90;
            sparks.push({ x: s.x, y: s.y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 1, c: wl.c[0] });
          }
          return false;
        }
      }
      return s.x > -60 && s.x < w + 60 && s.y > -60 && s.y < h + 60;
    });
    sparks = sparks.filter((p) => {
      p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt * 2.2;
      return p.life > 0;
    });
  }

  function draw(ws) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    const bg = ctx.createRadialGradient(w * 0.5, h * 0.45, 0, w * 0.5, h * 0.5, Math.max(w, h) * 0.75);
    bg.addColorStop(0, '#0b1424');
    bg.addColorStop(1, '#02040a');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    for (const [x, y, b] of stars) {
      ctx.fillStyle = `rgba(200,220,255,${0.15 + b * 0.45})`;
      ctx.fillRect(x, y, b > 0.8 ? 1.5 : 1, b > 0.8 ? 1.5 : 1);
    }

    // Vector field arrows
    ctx.lineWidth = 1;
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const idx = (j * cols + i) * 2;
        const ax = field[idx], ay = field[idx + 1];
        const mag = Math.hypot(ax, ay);
        if (mag < 1) continue;
        const len = Math.min(CELL * 0.42, Math.log1p(mag / 120) * 3.2);
        const cx = (i + 0.5) * CELL, cy = (j + 0.5) * CELL;
        const ux = ax / mag, uy = ay / mag;
        const alpha = Math.min(0.6, 0.1 + Math.log1p(mag / 300) * 0.1);
        ctx.strokeStyle = `rgba(96,165,250,${alpha})`;
        ctx.beginPath();
        ctx.moveTo(cx - ux * len * 0.5, cy - uy * len * 0.5);
        ctx.lineTo(cx + ux * len * 0.5, cy + uy * len * 0.5);
        ctx.stroke();
        ctx.fillStyle = `rgba(96,165,250,${alpha * 1.6})`;
        ctx.fillRect(cx + ux * len * 0.5 - 1, cy + uy * len * 0.5 - 1, 2, 2);
      }
    }

    ctx.globalCompositeOperation = 'lighter';
    // Trails
    ctx.lineCap = 'round';
    for (const s of shots) {
      const t = s.trail;
      for (let k = 2; k < t.length; k += 2) {
        const f = k / t.length;
        ctx.strokeStyle = `rgba(94,234,212,${f * 0.55})`;
        ctx.lineWidth = 0.5 + f * 1.6;
        ctx.beginPath();
        ctx.moveTo(t[k - 2], t[k - 1]);
        ctx.lineTo(t[k], t[k + 1]);
        ctx.stroke();
      }
      ctx.fillStyle = '#d5fff8';
      ctx.fillRect(s.x - 1.2, s.y - 1.2, 2.4, 2.4);
    }
    for (const p of sparks) {
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.c;
      ctx.fillRect(p.x - 1, p.y - 1, 2, 2);
    }
    ctx.globalAlpha = 1;

    // Wells
    for (const wl of ws) {
      if (wl.mouse) {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = 'rgba(233,239,245,0.55)';
        ctx.setLineDash([3, 4]);
        ctx.beginPath(); ctx.arc(wl.x, wl.y, 14, 0, Math.PI * 2); ctx.stroke();
        ctx.setLineDash([]);
        continue;
      }
      ctx.globalCompositeOperation = 'lighter';
      const glow = ctx.createRadialGradient(wl.x, wl.y, wl.r * 0.6, wl.x, wl.y, wl.r * 3.2);
      glow.addColorStop(0, wl.c[0] + '55');
      glow.addColorStop(1, wl.c[0] + '00');
      ctx.fillStyle = glow;
      ctx.beginPath(); ctx.arc(wl.x, wl.y, wl.r * 3.2, 0, Math.PI * 2); ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
      const body = ctx.createRadialGradient(wl.x - wl.r * 0.35, wl.y - wl.r * 0.35, 1, wl.x, wl.y, wl.r);
      body.addColorStop(0, wl.c[0]);
      body.addColorStop(1, wl.c[1]);
      ctx.fillStyle = body;
      ctx.beginPath(); ctx.arc(wl.x, wl.y, wl.r, 0, Math.PI * 2); ctx.fill();
    }

    // Turret
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#e9eff5';
    for (const [tx, ty] of turrets()) {
      ctx.beginPath(); ctx.arc(tx, ty, 5, 0, Math.PI * 2); ctx.fill();
    }
  }

  let statT = 0;
  const frame = (dt) => {
    const ws = wells();
    buildField(ws);
    step(dt, ws);
    draw(ws);
    statT += dt;
    if (statT > 0.25) { statT = 0; onStats?.({ shots: shots.length, cells: cols * rows }); }
  };

  const l = loop(frame);
  const ro = new ResizeObserver(() => { resize(); if (!l.running) frame(0); });
  resize();
  ro.observe(canvas);
  // Pre-simulate so the first frame already has trails in flight
  { const ws = wells(); buildField(ws); for (let i = 0; i < 180; i++) step(1 / 60, ws); draw(ws); }

  return {
    start() { reduced ? frame(0) : l.start(); },
    stop() { l.stop(); },
    destroy() { l.stop(); ro.disconnect(); ptr.dispose(); },
  };
}
