import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { art } from './art';
import { pointer, watchPointer, easePointer } from './pointer';

/**
 * A picture that is alive: its loose cloth and flowers stir in the same wind
 * as the mist, and it has real depth when the eye (or the camera) moves.
 * One textured quad in WebGL; the plain <img> underneath is the still version
 * and the fallback, and carries the alt text.
 *
 * `haze` (0..1 toward the page's ivory), `light` (0 cool shade .. 1 warm sun)
 * and `lift` (camera height, -1..1) may be numbers or framer-motion values.
 */
const VERT = `attribute vec2 p; varying vec2 v;
void main(){ v = vec2(p.x * 0.5 + 0.5, 0.5 - p.y * 0.5); gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `precision mediump float;
varying vec2 v;
uniform sampler2D uTex, uMap;
uniform float uTime, uWind, uDepth, uHaze, uLight;
uniform vec2 uPar;
void main(){
  vec4 m = texture2D(uMap, v);
  float sway = sin(uTime * 0.9 + v.y * 7.0 + v.x * 3.0) * 0.6 + sin(uTime * 1.63 + v.y * 13.0 - v.x * 2.0) * 0.4;
  vec2 o = uPar * (m.r - 0.5) * uDepth;
  o.x += m.g * sway * uWind;
  o.y += m.g * cos(uTime * 0.71 + v.x * 6.0) * uWind * 0.3;
  vec4 c = texture2D(uTex, v + o);
  vec3 col = c.a > 0.001 ? c.rgb / c.a : vec3(0.0);
  col *= mix(vec3(0.93, 0.925, 0.955), vec3(1.035, 1.012, 0.972), uLight);
  col = mix(col, vec3(0.984, 0.969, 0.933), uHaze);
  gl_FragColor = vec4(col * c.a, c.a);
}`;

const read = (v, fallback) => (v == null ? fallback : typeof v === 'number' ? v : v.get());

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function texture(gl, unit, img, premultiply) {
  const tex = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0 + unit);
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, premultiply);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return tex;
}

export default function LivingImage({
  slot,
  alt = '',
  className = '',
  live = true,
  wind = 0.0035,
  depth = 0.018,
  haze,
  light,
  lift,
  maxDpr = 2,
  eager = false,
  active = true,
}) {
  const entry = art(slot);
  const canvasRef = useRef(null);
  const [ready, setReady] = useState(false);
  const params = useRef({});
  const wakeRef = useRef(null);
  useLayoutEffect(() => { params.current = { wind, depth, haze, light, lift, active }; });

  // A picture nobody can see does not draw.
  useEffect(() => { if (active) wakeRef.current?.(); }, [active]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!live || !entry?.map || !canvas) return undefined;
    const gl = canvas.getContext('webgl', { premultipliedAlpha: true, antialias: false, powerPreference: 'low-power' });
    if (!gl) return undefined;

    let raf = 0;
    let alive = true;
    let visible = false;
    let drawn = false;
    const stopPointer = watchPointer();

    const compile = (type, source) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, source);
      gl.compileShader(s);
      return s;
    };
    const program = gl.createProgram();
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { stopPointer(); return undefined; }
    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const u = (name) => gl.getUniformLocation(program, name);
    const U = { time: u('uTime'), wind: u('uWind'), depth: u('uDepth'), haze: u('uHaze'), light: u('uLight'), par: u('uPar') };
    gl.uniform1i(u('uTex'), 0);
    gl.uniform1i(u('uMap'), 1);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    const size = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      const scale = Math.min(1, 2048 / Math.max(1, Math.max(rect.width, rect.height) * dpr));
      const w = Math.max(2, Math.round(rect.width * dpr * scale));
      const h = Math.max(2, Math.round(rect.height * dpr * scale));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
      gl.viewport(0, 0, w, h);
    };
    const resize = new ResizeObserver(size);
    resize.observe(canvas);

    const start = performance.now();
    const frame = (now) => {
      raf = 0;
      if (!alive || !visible || document.hidden) return;
      const p = params.current;
      if (!p.active) return;
      easePointer();
      gl.uniform1f(U.time, (now - start) / 1000);
      gl.uniform1f(U.wind, p.wind);
      gl.uniform1f(U.depth, p.depth);
      gl.uniform1f(U.haze, read(p.haze, 0));
      gl.uniform1f(U.light, read(p.light, 1));
      gl.uniform2f(U.par, -pointer.x, -pointer.y * 0.6 + read(p.lift, 0));
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (!drawn) { drawn = true; setReady(true); }
      raf = requestAnimationFrame(frame);
    };
    const wake = () => { if (!raf && alive && visible && !document.hidden) raf = requestAnimationFrame(frame); };
    wakeRef.current = wake;

    const seen = new IntersectionObserver(([e]) => { visible = e.isIntersecting; wake(); }, { rootMargin: '10%' });
    document.addEventListener('visibilitychange', wake);

    let textures = [];
    Promise.all([loadImage(entry.src), loadImage(entry.map)])
      .then(([img, map]) => {
        if (!alive) return;
        textures = [texture(gl, 0, img, true), texture(gl, 1, map, false)];
        size();
        seen.observe(canvas);
      })
      .catch(() => {});

    return () => {
      alive = false;
      wakeRef.current = null;
      cancelAnimationFrame(raf);
      seen.disconnect();
      resize.disconnect();
      stopPointer();
      document.removeEventListener('visibilitychange', wake);
      textures.forEach((t) => gl.deleteTexture(t));
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      setReady(false);
    };
  }, [live, entry?.src, entry?.map, maxDpr]);

  if (!entry) return null;
  return (
    <span className={`living ${ready ? 'is-live' : ''} ${className}`} style={{ aspectRatio: `${entry.w} / ${entry.h}` }}>
      <img
        src={entry.src}
        alt={alt}
        width={entry.w}
        height={entry.h}
        decoding="async"
        loading={eager ? 'eager' : 'lazy'}
        draggable="false"
      />
      {live && entry.map && <canvas ref={canvasRef} aria-hidden="true" />}
    </span>
  );
}
