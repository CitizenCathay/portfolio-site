// Small WebGL2 helpers shared by the sketches.

export function compile(gl, type, src) {
  const sh = gl.createShader(type);
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(sh);
    gl.deleteShader(sh);
    throw new Error(log);
  }
  return sh;
}

export function program(gl, vsSrc, fsSrc) {
  const p = gl.createProgram();
  const vs = compile(gl, gl.VERTEX_SHADER, vsSrc);
  const fs = compile(gl, gl.FRAGMENT_SHADER, fsSrc);
  gl.attachShader(p, vs);
  gl.attachShader(p, fs);
  gl.linkProgram(p);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(p));
  }
  const uniforms = {};
  const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < n; i++) {
    const info = gl.getActiveUniform(p, i);
    uniforms[info.name] = gl.getUniformLocation(p, info.name);
  }
  return { p, u: uniforms };
}

// Fullscreen triangle generated from gl_VertexID — no buffers needed.
export const FULLSCREEN_VS = /* glsl */ `#version 300 es
out vec2 vUv;
void main() {
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  vUv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

// Keeps the drawing buffer matched to the element's CSS size × DPR.
export function autoResize(canvas, onResize, maxDpr = 2) {
  const ro = new ResizeObserver(() => {
    const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
    const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      onResize?.(w, h);
    }
  });
  ro.observe(canvas);
  return () => ro.disconnect();
}

// Pointer position in canvas-normalised coords (0..1, y up). Listens on the
// window so overlaid UI doesn't block it.
export function trackPointer(canvas) {
  const ptr = { x: 0.5, y: 0.5, active: false };
  const move = (e) => {
    const r = canvas.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = 1 - (e.clientY - r.top) / r.height;
    ptr.x = x;
    ptr.y = y;
    ptr.active = x >= 0 && x <= 1 && y >= 0 && y <= 1 && e.pointerType !== 'touch';
  };
  const touch = (e) => {
    move(e);
    if (ptr.x >= 0 && ptr.x <= 1 && ptr.y >= 0 && ptr.y <= 1) ptr.active = true;
  };
  const leave = () => { ptr.active = false; };
  const up = (e) => { if (e.pointerType === 'touch') leave(); };
  window.addEventListener('pointermove', move, { passive: true });
  window.addEventListener('pointerdown', touch, { passive: true });
  window.addEventListener('pointerup', up, { passive: true });
  document.addEventListener('pointerleave', leave);
  ptr.dispose = () => {
    window.removeEventListener('pointermove', move);
    window.removeEventListener('pointerdown', touch);
    window.removeEventListener('pointerup', up);
    document.removeEventListener('pointerleave', leave);
  };
  return ptr;
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// Simple rAF loop with start/stop and clamped dt.
export function loop(frame) {
  let raf = 0, last = 0, running = false;
  const tick = (t) => {
    if (!running) return;
    const dt = last ? Math.min((t - last) / 1000, 1 / 20) : 1 / 60;
    const rawDt = last ? (t - last) / 1000 : 1 / 60;
    last = t;
    frame(dt, t / 1000, rawDt);
    raf = requestAnimationFrame(tick);
  };
  return {
    start() { if (!running) { running = true; last = 0; raf = requestAnimationFrame(tick); } },
    stop() { running = false; cancelAnimationFrame(raf); },
    get running() { return running; },
  };
}
