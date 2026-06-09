import { useEffect, useRef } from 'react';

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2  u_res;
uniform float u_time;

float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * vec3(443.897, 441.423, 437.195));
  p3 += dot(p3, p3.yzx + 19.19);
  return fract((p3.x + p3.y) * p3.z);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  return mix(
    mix(hash(i + vec2(0,0)), hash(i + vec2(1,0)), u.x),
    mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float aspect = u_res.x / u_res.y;
  uv.x *= aspect;

  float t = u_time * 0.05;

  // Domain warp for organic shapes
  vec2 q = vec2(
    fbm(uv * 1.2 + vec2(t, t * 0.8)),
    fbm(uv * 1.2 + vec2(t * 0.6 + 3.2, t * 0.9))
  );
  vec2 warped = uv + (q - 0.5) * 0.5;

  // Three slow noise fields at different frequencies
  float n1 = fbm(warped * 1.8 + vec2(t * 0.4, t * 0.3));
  float n2 = fbm(warped * 1.4 + vec2(t * 0.3 + 4.1, t * 0.5));
  float n3 = fbm(warped * 2.2 + vec2(t * 0.5 + 8.3, t * 0.2));

  // Palette — cream, pale blue, pale lavender, white
  vec3 cream    = vec3(1.00, 0.97, 0.92);
  vec3 paleBlue = vec3(0.88, 0.93, 1.00);
  vec3 lavender = vec3(0.93, 0.90, 1.00);
  vec3 white    = vec3(1.00, 1.00, 1.00);

  // Blend colors based on noise fields
  vec3 col = white;
  col = mix(col, cream,    n1 * 0.5);
  col = mix(col, paleBlue, n2 * 0.45);
  col = mix(col, lavender, n3 * 0.4);

  // Keep it very close to white overall
  col = mix(vec3(1.0), col, 0.85);

  // Fade in
  float fadeIn = smoothstep(0.0, 2.5, u_time);
  col = mix(vec3(1.0), col, fadeIn);

  gl_FragColor = vec4(col, 1.0);
}
`;

function compileShader(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(s));
    return null;
  }
  return s;
}

export default function Background() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false });
    if (!gl) return;

    const vert = compileShader(gl, gl.VERTEX_SHADER, VERT);
    const frag = compileShader(gl, gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram();
    gl.attachShader(prog, vert);
    gl.attachShader(prog, frag);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1,-1,  1,-1,  -1,1,
       1,-1,  1, 1,  -1,1,
    ]), gl.STATIC_DRAW);

    const aPos = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes  = gl.getUniformLocation(prog, 'u_res');
    const uTime = gl.getUniformLocation(prog, 'u_time');

    function resize() {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width  = window.innerWidth  * dpr;
      canvas.height = window.innerHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    resize();
    window.addEventListener('resize', resize);

    let rafId;
    function render(t) {
      gl.uniform2f(uRes,  canvas.width, canvas.height);
      gl.uniform1f(uTime, t * 0.001);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      rafId = requestAnimationFrame(render);
    }
    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      gl.deleteProgram(prog);
      gl.deleteBuffer(buf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', inset: 0, zIndex: 0,
        width: '100%', height: '100%',
        display: 'block', pointerEvents: 'none',
      }}
    />
  );
}