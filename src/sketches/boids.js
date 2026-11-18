// GPU flocking for the hero. Boid state (pos.xy, vel.zw) lives in an RGBA32F
// texture and is stepped with a ping-pong fragment pass; fish are drawn with
// one instanced draw call that reads straight from the state texture.
// Falls back to a CPU sim (same render path) when float render targets are
// unavailable.

import { program, FULLSCREEN_VS, autoResize, trackPointer, prefersReducedMotion, loop } from './gl';

const TIERS = [
  [64, 64], // 4,096
  [64, 32], // 2,048
  [32, 32], // 1,024
];
const CPU_SIZE = [32, 16]; // 512

const R_VIEW = 0.055;
const R_SEP = 0.016;
const MAX_SPEED = 0.15;
const MIN_SPEED = 0.055;
const FLEE_R = 0.17;

const UPDATE_FS = /* glsl */ `#version 300 es
precision highp float;
precision highp int;
uniform highp sampler2D uState;
uniform ivec2 uSize;
uniform float uDt;
uniform float uTime;
uniform vec2 uWorld;
uniform vec3 uPointer;
out vec4 outState;

const float R_VIEW = ${R_VIEW};
const float R_SEP = ${R_SEP};
const float MAX_SPEED = ${MAX_SPEED};
const float MIN_SPEED = ${MIN_SPEED};
const float FLEE_R = ${FLEE_R};

vec2 wrapD(vec2 d) { return d - uWorld * floor(d / uWorld + 0.5); }

void main() {
  vec4 s = texelFetch(uState, ivec2(gl_FragCoord.xy), 0);
  vec2 p = s.xy, v = s.zw;

  vec2 sumV = vec2(0), sumD = vec2(0), sep = vec2(0);
  float n = 0.0;
  for (int y = 0; y < uSize.y; y++) {
    for (int x = 0; x < uSize.x; x++) {
      vec4 o = texelFetch(uState, ivec2(x, y), 0);
      vec2 d = wrapD(o.xy - p);
      float d2 = dot(d, d);
      if (d2 < R_VIEW * R_VIEW && d2 > 1e-10) {
        n += 1.0;
        sumV += o.zw;
        sumD += d;
        if (d2 < R_SEP * R_SEP) sep -= d / d2;
      }
    }
  }

  vec2 acc = vec2(0);
  if (n > 0.0) {
    acc += (sumV / n - v) * 2.2;   // alignment
    acc += (sumD / n) * 3.0;       // cohesion
    acc += sep * 0.0016;           // separation
  }
  // slow ambient current so the scene never settles
  acc += vec2(sin(p.y * 5.0 + uTime * 0.21), cos(p.x * 4.0 - uTime * 0.17)) * 0.035;

  float fear = 0.0;
  if (uPointer.z > 0.5) {
    vec2 d = wrapD(p - uPointer.xy);
    float l = length(d);
    if (l < FLEE_R) {
      fear = 1.0 - l / FLEE_R;
      acc += d / max(l, 1e-4) * fear * 3.0;
    }
  }

  v += acc * uDt;
  float sp = length(v);
  float maxS = MAX_SPEED * (1.0 + 1.8 * fear);
  if (sp > maxS) v *= maxS / sp;
  else if (sp < MIN_SPEED) v = (sp > 1e-6 ? v / sp : vec2(1, 0)) * MIN_SPEED;

  p = mod(p + v * uDt, uWorld);
  outState = vec4(p, v);
}`;

const BG_FS = /* glsl */ `#version 300 es
precision highp float;
in vec2 vUv;
uniform float uTime;
uniform vec2 uWorld;
out vec4 o;
float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
void main() {
  vec2 uv = vUv;
  vec3 col = mix(vec3(0.006, 0.016, 0.028), vec3(0.03, 0.095, 0.14), pow(uv.y, 1.5));
  // slanted light shafts from the surface
  float x = uv.x * uWorld.x + (1.0 - uv.y) * 0.4;
  float rays = smoothstep(0.55, 1.0, sin(x * 6.0 + uTime * 0.12))
             + smoothstep(0.7, 1.0, sin(x * 11.0 - uTime * 0.09 + 1.3)) * 0.6
             + smoothstep(0.8, 1.0, sin(x * 19.0 + uTime * 0.05 + 4.0)) * 0.4;
  col += vec3(0.35, 0.75, 0.85) * rays * pow(uv.y, 2.2) * 0.07;
  col += (hash(gl_FragCoord.xy + fract(uTime)) - 0.5) / 255.0; // dither
  o = vec4(col, 1.0);
}`;

const FISH_VS = /* glsl */ `#version 300 es
precision highp float;
precision highp int;
uniform highp sampler2D uState;
uniform int uWidth;
uniform vec2 uWorld;
uniform float uScale;
uniform float uTime;
out vec4 vColor;

float hash(float n) { return fract(sin(n * 12.9898) * 43758.5453); }

void main() {
  int id = gl_InstanceID;
  vec4 s = texelFetch(uState, ivec2(id % uWidth, id / uWidth), 0);
  vec2 p = s.xy, v = s.zw;
  float sp = length(v);
  vec2 f = sp > 1e-6 ? v / sp : vec2(1, 0);
  vec2 r = vec2(-f.y, f.x);
  float h = hash(float(id) + 1.0);
  float depth = 0.3 + 0.7 * h;

  // two triangles: (nose, top, bottom) (top, tail, bottom)
  int vi = gl_VertexID;
  vec2 L = vi == 0 ? vec2(1.0, 0.0)
         : (vi == 1 || vi == 3) ? vec2(-0.1, 0.3)
         : (vi == 2 || vi == 5) ? vec2(-0.1, -0.3)
         : vec2(-1.0, 0.0);
  if (vi == 4) L.y += sin(uTime * (9.0 + sp * 70.0) + h * 40.0) * 0.32;

  float size = uScale * (0.5 + 0.8 * depth);
  vec2 wp = p + (f * L.x + r * L.y) * size;
  gl_Position = vec4((wp / uWorld) * 2.0 - 1.0, 0.0, 1.0);

  vec3 col = mix(vec3(0.38, 0.62, 0.98), vec3(0.37, 0.92, 0.83), fract(h * 7.13));
  float shade = vi == 0 ? 1.0 : (vi == 4 ? 0.25 : 0.7);
  vColor = vec4(col * shade, depth * depth);
}`;

const FISH_FS = /* glsl */ `#version 300 es
precision mediump float;
in vec4 vColor;
out vec4 o;
void main() { o = vColor; }`;

export function createBoids(canvas, { onStats, mobile = false } = {}) {
  const gl = canvas.getContext('webgl2', {
    antialias: true, alpha: false, depth: false, powerPreference: 'high-performance',
  });
  if (!gl) return null;

  const reduced = prefersReducedMotion();
  const gpu = !!gl.getExtension('EXT_color_buffer_float');

  let update, bg, fish;
  try {
    if (gpu) update = program(gl, FULLSCREEN_VS, UPDATE_FS);
    bg = program(gl, FULLSCREEN_VS, BG_FS);
    fish = program(gl, FISH_VS, FISH_FS);
  } catch (err) {
    console.warn('[boids] shader error', err);
    return null;
  }

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  let world = [canvas.clientWidth / Math.max(1, canvas.clientHeight) || 1.6, 1];
  let tier = mobile ? 2 : 0;
  let W = 0, H = 0, N = 0;
  let tex = [], fbo = [], cur = 0;
  let cpuState = null;
  let mode = gpu ? 'GPU' : 'CPU';
  let time = 0;
  let sampleFrames = 0, samples = [], measuring = true;

  const ptr = trackPointer(canvas);

  function makeTex(data) {
    const t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, W, H, 0, gl.RGBA, gl.FLOAT, data);
    return t;
  }

  function seed() {
    const d = new Float32Array(N * 4);
    for (let i = 0; i < N; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED);
      d[i * 4] = Math.random() * world[0];
      d[i * 4 + 1] = Math.random();
      d[i * 4 + 2] = Math.cos(a) * s;
      d[i * 4 + 3] = Math.sin(a) * s;
    }
    return d;
  }

  function init() {
    tex.forEach((t) => gl.deleteTexture(t));
    fbo.forEach((f) => gl.deleteFramebuffer(f));
    tex = []; fbo = [];
    [W, H] = mode === 'GPU' ? TIERS[tier] : CPU_SIZE;
    N = W * H;
    const data = seed();
    if (mode === 'GPU') {
      for (let i = 0; i < 2; i++) {
        tex.push(makeTex(data));
        const f = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, f);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex[i], 0);
        fbo.push(f);
      }
      const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      if (!ok) { mode = 'CPU'; return init(); }
    } else {
      cpuState = data;
      tex.push(makeTex(data));
    }
    cur = 0;
    sampleFrames = 0; samples = []; measuring = true;
    const warm = reduced ? 240 : 45;
    for (let i = 0; i < warm; i++) step(1 / 30);
  }

  function step(dt) {
    const px = ptr.x * world[0], py = ptr.y, pa = ptr.active ? 1 : 0;
    if (mode === 'GPU') {
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo[1 - cur]);
      gl.viewport(0, 0, W, H);
      gl.disable(gl.BLEND);
      gl.useProgram(update.p);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, tex[cur]);
      gl.uniform1i(update.u.uState, 0);
      gl.uniform2i(update.u.uSize, W, H);
      gl.uniform1f(update.u.uDt, dt);
      gl.uniform1f(update.u.uTime, time);
      gl.uniform2f(update.u.uWorld, world[0], world[1]);
      gl.uniform3f(update.u.uPointer, px, py, pa);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      cur = 1 - cur;
    } else {
      cpuStep(dt, px, py, pa);
      gl.bindTexture(gl.TEXTURE_2D, tex[0]);
      gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, W, H, gl.RGBA, gl.FLOAT, cpuState);
    }
  }

  function cpuStep(dt, px, py, pa) {
    const s = cpuState, [wx, wy] = world;
    const next = new Float32Array(s.length);
    const wrap = (d, w) => d - w * Math.floor(d / w + 0.5);
    for (let i = 0; i < N; i++) {
      let x = s[i * 4], y = s[i * 4 + 1], vx = s[i * 4 + 2], vy = s[i * 4 + 3];
      let n = 0, svx = 0, svy = 0, sdx = 0, sdy = 0, spx = 0, spy = 0;
      for (let j = 0; j < N; j++) {
        if (j === i) continue;
        const dx = wrap(s[j * 4] - x, wx), dy = wrap(s[j * 4 + 1] - y, wy);
        const d2 = dx * dx + dy * dy;
        if (d2 < R_VIEW * R_VIEW && d2 > 1e-10) {
          n++; svx += s[j * 4 + 2]; svy += s[j * 4 + 3]; sdx += dx; sdy += dy;
          if (d2 < R_SEP * R_SEP) { spx -= dx / d2; spy -= dy / d2; }
        }
      }
      let ax = 0, ay = 0;
      if (n) {
        ax += (svx / n - vx) * 2.2 + (sdx / n) * 3 + spx * 0.0016;
        ay += (svy / n - vy) * 2.2 + (sdy / n) * 3 + spy * 0.0016;
      }
      ax += Math.sin(y * 5 + time * 0.21) * 0.035;
      ay += Math.cos(x * 4 - time * 0.17) * 0.035;
      let fear = 0;
      if (pa) {
        const dx = wrap(x - px, wx), dy = wrap(y - py, wy);
        const l = Math.hypot(dx, dy);
        if (l < FLEE_R) { fear = 1 - l / FLEE_R; ax += (dx / Math.max(l, 1e-4)) * fear * 3; ay += (dy / Math.max(l, 1e-4)) * fear * 3; }
      }
      vx += ax * dt; vy += ay * dt;
      const sp = Math.hypot(vx, vy), maxS = MAX_SPEED * (1 + 1.8 * fear);
      if (sp > maxS) { vx *= maxS / sp; vy *= maxS / sp; }
      else if (sp < MIN_SPEED) { const k = sp > 1e-6 ? MIN_SPEED / sp : 0; vx = sp > 1e-6 ? vx * k : MIN_SPEED; vy *= k; }
      x = ((x + vx * dt) % wx + wx) % wx;
      y = ((y + vy * dt) % wy + wy) % wy;
      next.set([x, y, vx, vy], i * 4);
    }
    cpuState = next;
  }

  function draw() {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.disable(gl.BLEND);
    gl.useProgram(bg.p);
    gl.uniform1f(bg.u.uTime, time);
    gl.uniform2f(bg.u.uWorld, world[0], world[1]);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    gl.useProgram(fish.p);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex[mode === 'GPU' ? cur : 0]);
    gl.uniform1i(fish.u.uState, 0);
    gl.uniform1i(fish.u.uWidth, W);
    gl.uniform2f(fish.u.uWorld, world[0], world[1]);
    gl.uniform1f(fish.u.uScale, 0.0068);
    gl.uniform1f(fish.u.uTime, time);
    gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, N);
  }

  let statT = 0, statFrames = 0;
  const report = () => onStats?.({ count: N, mode, fps: 0, reduced });

  const l = loop((dt, _t, rawDt) => {
    time += dt;
    step(dt);
    draw();

    // Adaptive quality: if early frames are GPU-slow, drop a tier. Intervals
    // over 100 ms are the browser throttling rAF (background/hidden), not the
    // sim, so they're ignored; the median keeps one-off hitches from counting.
    sampleFrames++;
    if (measuring && sampleFrames > 20 && rawDt < 0.1) samples.push(rawDt);
    if (measuring && samples.length === 90) {
      const median = samples.sort((a, b) => a - b)[45];
      measuring = false;
      if (mode === 'GPU' && tier < TIERS.length - 1 && median > 0.026) {
        tier++;
        init();
        report();
      }
    }

    statT += rawDt; statFrames++;
    if (statT >= 0.5) {
      onStats?.({ count: N, mode, fps: Math.round(statFrames / statT), reduced });
      statT = 0; statFrames = 0;
    }
  });

  const stopResize = autoResize(canvas, (w, h) => {
    world = [w / h, 1];
    if (!l.running) draw();
  });
  // Size synchronously once so the seed uses the real aspect ratio.
  {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
    canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));
    world = [canvas.width / canvas.height, 1];
  }

  const onLost = (e) => { e.preventDefault(); l.stop(); };
  canvas.addEventListener('webglcontextlost', onLost);

  init();
  report();
  draw();

  return {
    start() { if (!reduced) l.start(); else draw(); },
    stop() { l.stop(); },
    destroy() {
      l.stop();
      stopResize();
      ptr.dispose();
      canvas.removeEventListener('webglcontextlost', onLost);
    },
  };
}
