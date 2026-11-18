// Echoes Below sketch: a single fragment shader showing the ingredients of the
// game's look — animated caustics, an SDF seabed with bevelled normals,
// point lights with GGX specular, HDR accumulation and ACES tone mapping.

import { program, FULLSCREEN_VS, autoResize, trackPointer, prefersReducedMotion, loop } from './gl';

const FS = /* glsl */ `#version 300 es
precision highp float;
in vec2 vUv;
uniform float uAspect;
uniform float uTime;
uniform vec3 uMouse;
out vec4 o;

const float PI = 3.14159265;

vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return fract(sin(p) * 43758.5453);
}
float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

// Distance between nearest and second-nearest animated cell points:
// small along cell borders, which reads as caustic filaments.
float cellEdge(vec2 x, float t) {
  vec2 n = floor(x), f = fract(x);
  float f1 = 8.0, f2 = 8.0;
  for (int j = -1; j <= 1; j++)
  for (int i = -1; i <= 1; i++) {
    vec2 g = vec2(i, j);
    vec2 h = 0.5 + 0.5 * sin(t + 6.2831 * hash2(n + g));
    float d = length(g + h - f);
    if (d < f1) { f2 = f1; f1 = d; } else if (d < f2) { f2 = d; }
  }
  return f2 - f1;
}

float caustics(vec2 p, float t) {
  p *= 6.0;
  // two layers of domain warp turn straight cell borders into wavy filaments
  p += 0.9 * vec2(sin(p.y * 0.55 + t * 0.6), cos(p.x * 0.5 - t * 0.5));
  p += 0.4 * vec2(sin(p.y * 1.3 - t * 0.4), cos(p.x * 1.2 + t * 0.45));
  return exp(-cellEdge(p, t * 0.8) * 14.0) * 0.8
       + exp(-cellEdge(p * 1.6 + 3.1, t * 1.1) * 18.0) * 0.4;
}

float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

float scene(vec2 p) {
  float ground = p.y - (0.17 + 0.05 * sin(p.x * 5.0 + 0.7) + 0.025 * sin(p.x * 13.0 + 2.0) + 0.008 * sin(p.x * 37.0));
  float d = ground;
  d = smin(d, length(p - vec2(0.32, 0.22)) - 0.12, 0.08);
  d = smin(d, length(p - vec2(uAspect - 0.38, 0.2)) - 0.15, 0.08);
  d = smin(d, length(p - vec2(uAspect * 0.6, 0.14)) - 0.07, 0.06);
  d = min(d, length(p - vec2(uAspect * 0.78, 0.62)) - 0.045); // floating rock
  return d;
}

float bevel(vec2 p) { return smoothstep(0.0, -0.05, scene(p)); }

vec3 aces(vec3 x) { return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0); }

void main() {
  vec2 p = vec2(vUv.x * uAspect, vUv.y);
  float t = uTime;

  // Point lights: xy position, z height above the plane
  vec3 lp[3]; vec3 lc[3];
  lp[0] = vec3(uAspect * (0.5 + 0.32 * sin(t * 0.31)), 0.55 + 0.18 * sin(t * 0.47), 0.09);
  lc[0] = vec3(0.25, 1.0, 0.85) * 1.6;
  lp[1] = vec3(uAspect * (0.5 + 0.38 * cos(t * 0.23 + 1.0)), 0.42 + 0.2 * cos(t * 0.37), 0.08);
  lc[1] = vec3(1.0, 0.25, 0.55) * 1.4;
  vec2 m = uMouse.z > 0.5 ? uMouse.xy : vec2(uAspect * (0.5 + 0.25 * sin(t * 0.17 + 2.0)), 0.75 + 0.1 * sin(t * 0.29));
  lp[2] = vec3(m, 0.1);
  lc[2] = vec3(1.0, 0.68, 0.32) * 1.8;

  // Water column
  vec3 col = mix(vec3(0.002, 0.008, 0.016), vec3(0.01, 0.06, 0.09), pow(vUv.y, 1.3));
  float shafts = smoothstep(0.6, 1.0, sin((p.x + (1.0 - p.y) * 0.35) * 9.0 + t * 0.2));
  col += vec3(0.1, 0.3, 0.35) * shafts * pow(vUv.y, 3.0) * 0.25;

  float d = scene(p);
  if (d < 0.0) {
    // Surface normal from the bevel height field
    vec2 e = vec2(0.0025, 0.0);
    float h = bevel(p);
    vec2 g = vec2(bevel(p + e.xy) - bevel(p - e.xy), bevel(p + e.yx) - bevel(p - e.yx)) / (2.0 * e.x);
    vec3 n = normalize(vec3(-g * 0.035, 1.0));
    vec3 albedo = vec3(0.05, 0.065, 0.075) * (0.8 + 0.4 * hash(floor(p * 220.0)));
    vec3 V = vec3(0, 0, 1);
    float rough = 0.38, a2 = rough * rough * rough * rough;

    vec3 lit = albedo * 0.06;
    // Sunlight caustics on up-facing surfaces, fading with depth
    lit += vec3(0.25, 0.65, 0.7) * caustics(p, t) * (0.25 + 0.75 * clamp(n.y + 0.6, 0.0, 1.0)) * vUv.y * 0.9 * albedo * 8.0;
    for (int i = 0; i < 3; i++) {
      vec3 L = vec3(lp[i].xy - p, lp[i].z);
      float dist = length(L);
      L /= dist;
      float att = 1.0 / (1.0 + 60.0 * dist * dist) * smoothstep(0.7, 0.0, dist);
      float ndl = max(dot(n, L), 0.0);
      vec3 H = normalize(L + V);
      float ndh = max(dot(n, H), 0.0);
      float D = a2 / (PI * pow(ndh * ndh * (a2 - 1.0) + 1.0, 2.0));
      float F = 0.04 + 0.96 * pow(1.0 - max(dot(H, V), 0.0), 5.0);
      lit += (albedo / PI + D * F * 0.25) * lc[i] * ndl * att * 6.0;
    }
    col = mix(col, lit, smoothstep(0.0, -0.004, d)); // anti-aliased edge
  } else {
    // Faint caustics in suspended water + marine snow
    col += vec3(0.1, 0.3, 0.32) * caustics(p * 0.6 + 2.0, t * 0.6) * 0.04 * vUv.y;
    vec2 q = p * 22.0 + vec2(0.0, -t * 0.35);
    vec2 cell = floor(q);
    vec2 r = hash2(cell);
    vec2 pos = cell + 0.5 + 0.35 * sin(r * 6.28 + t * 0.5);
    float snow = smoothstep(0.09, 0.0, length(q - pos)) * step(0.72, r.x);
    col += vec3(0.6, 0.8, 0.85) * snow * 0.35;
  }

  // In-scattered glow around each light (the "bloom")
  for (int i = 0; i < 3; i++) {
    float dl = length(lp[i].xy - p);
    col += lc[i] * (0.0009 / (dl * dl + 0.0006) + 0.04 * exp(-dl * 7.0));
  }

  col = aces(col * 1.25);
  col *= 1.0 - 0.35 * pow(length(vUv - 0.5) * 1.3, 2.5); // vignette
  col = pow(col, vec3(1.0 / 2.2));
  col += (hash(gl_FragCoord.xy + t) - 0.5) / 255.0;
  o = vec4(col, 1.0);
}`;

export function createUnderwater(canvas) {
  const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, depth: false });
  if (!gl) return null;
  let prog;
  try {
    prog = program(gl, FULLSCREEN_VS, FS);
  } catch (err) {
    console.warn('[underwater] shader error', err);
    return null;
  }
  gl.bindVertexArray(gl.createVertexArray());

  const reduced = prefersReducedMotion();
  const ptr = trackPointer(canvas);
  let time = 4;

  const draw = () => {
    const aspect = canvas.width / canvas.height;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.useProgram(prog.p);
    gl.uniform1f(prog.u.uAspect, aspect);
    gl.uniform1f(prog.u.uTime, time);
    gl.uniform3f(prog.u.uMouse, ptr.x * aspect, ptr.y, ptr.active ? 1 : 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const l = loop((dt) => { time += dt; draw(); });
  const stopResize = autoResize(canvas, () => draw(), 1.5);

  return {
    start() { reduced ? draw() : l.start(); },
    stop() { l.stop(); },
    destroy() {
      l.stop();
      stopResize();
      ptr.dispose();
    },
  };
}
