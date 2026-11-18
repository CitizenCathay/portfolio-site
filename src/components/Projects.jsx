import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ChevronDown, Play } from 'lucide-react';
import { GitHubIcon } from './Icons';
import { useSketch } from '../sketches/useSketch';
import { createUnderwater } from '../sketches/underwater';
import { createGravity } from '../sketches/gravity';
import grapeEngine1 from '../assets/projects/grape-engine-1.jpg';
import grapeEngine2 from '../assets/projects/grape-engine-2.jpg';
import tradeflowTrade from '../assets/projects/tradeflow-trade.jpg';
import tradeflowMarkets from '../assets/projects/tradeflow-markets.jpg';
import tradeflowPortfolio from '../assets/projects/tradeflow-portfolio.jpg';

// media.type: 'gallery' | 'video' | 'sketch'
// To show real footage, swap a project's media for:
//   { type: 'video', src: clip, poster: still }   (import the .mp4/.webm like the images)
const PROJECTS = [
  {
    id: 'grape-engine',
    title: 'Grape Engine',
    tagline: 'C++17 engine with a custom OpenGL renderer, ECS runtime and CUDA-accelerated simulation.',
    role: 'GPU & tools programmer',
    year: '2025 — 26',
    metrics: [
      { value: '500K+', label: 'boids at 60 fps' },
      { value: '100×', label: 'scale-up via GPU neighbour queries' },
      { value: 'Async', label: 'GPU picking, no frame stalls' },
    ],
    stack: ['C++17', 'OpenGL 4.5', 'CUDA', 'GLSL', 'ImGui', 'RenderDoc'],
    media: { type: 'gallery', images: [grapeEngine1, grapeEngine2], badge: 'Engine editor', position: '40% center' },
    repo: 'https://github.com/Chaotic-Grapes/GrapeEngine',
    details: [
      'OpenGL 4.5 renderer with MRT/FBO support, layer-sorted rendering, and GLSL shader support.',
      'CUDA–OpenGL interop systems for GPU-accelerated particles and flocking simulations.',
      'Scaled boids simulation from ~5,000 to over 500,000 agents while maintaining 60 FPS by parallelizing neighbour queries across the GPU.',
      'Async PBO readback for GPU object picking without stalling the frame.',
    ],
  },
  {
    id: 'echoes-below',
    title: 'Echoes Below',
    tagline: 'Underwater puzzle platformer. I wrote every shader, light and post pass.',
    role: 'Graphics & GPU programmer',
    year: '2025 — 26',
    metrics: [
      { value: 'PBR', label: 'Cook–Torrance, GGX, Smith' },
      { value: 'HDR', label: 'bloom → tone map → gamma' },
      { value: 'SDF', label: 'resolution-independent UI' },
    ],
    stack: ['C++', 'OpenGL', 'GLSL', 'SSBO'],
    media: { type: 'sketch', sketch: createUnderwater, badge: 'Live sketch · move cursor = light', stat: () => 'caustics · SDF normals · GGX · ACES' },
    repo: 'https://github.com/Chaotic-Grapes/EchoesBelow',
    details: [
      'Cook–Torrance PBR pipeline (GGX NDF, Smith geometry, Fresnel-Schlick) with normal maps, MRA maps, and emissive mask support.',
      'SDF rendering for resolution-independent UI text and geometry.',
      'SSBO-driven dynamic point light system with smooth distance attenuation.',
      'Multi-stage post-processing pipeline — HDR rendering, bloom, tone mapping, and gamma correction across chained off-screen passes.',
    ],
  },
  {
    id: 'tradeflow',
    title: 'TradeFlow',
    tagline: 'Paper-trading exchange in native C++. Hand-rolled HTTP server, limit order book, SQLite persistence.',
    role: 'Systems & networking',
    year: '2026',
    metrics: [
      { value: '8.8×', label: 'order throughput after profiling' },
      { value: '1.9 ms', label: 'p50 order latency, durable commits' },
      { value: '25×', label: 'matching speed-up, in-memory' },
    ],
    stack: ['C++20', 'Winsock', 'SQLite', 'JWT', 'CMake', 'vcpkg'],
    media: {
      type: 'gallery',
      images: [tradeflowTrade, tradeflowMarkets, tradeflowPortfolio],
      position: 'left top',
    },
    repo: 'https://github.com/CitizenCathay/CSD2161-Trading-System',
    details: [
      'HTTP/1.1 server written directly on Winsock: request parsing, routing and a thread per client connection.',
      'Limit order book with price/time priority; cash, holdings, order status and the trade record settle in one SQLite transaction.',
      'JWT sessions and PBKDF2 password hashing (100k iterations).',
      'Profiled the matching path: an index on the order book took on-disk throughput from 52.5 to 462.5 orders/s and worst-case latency from 402 ms to 16.2 ms.',
      '34-check correctness suite guards every performance change, plus benchmarks for lock contention and HTTP concurrency.',
    ],
  },
  {
    id: 'astral-siege',
    title: 'Astral Siege',
    tagline: 'Tower defense where gravity bends every shot.',
    role: 'Systems & gameplay programmer',
    year: '2025',
    metrics: [
      { value: 'O(1)', label: 'field lookup per entity' },
      { value: '2D', label: 'discrete vector-field gravity' },
    ],
    stack: ['C++', 'Game physics', 'OOP'],
    media: {
      type: 'sketch', sketch: createGravity, badge: 'Live sketch · hover to add a well',
      stat: (s) => (s ? `${s.shots} shots · ${s.cells} cells` : 'vector field'),
    },
    repo: 'https://github.com/CitizenCathay/astral-siege',
    details: [
      'Discrete 2D vector field models non-uniform gravitational forces.',
      'Per-cell acceleration sampling drives projectile trajectories and entity movement.',
      'O(1) grid-indexed lookup — no iterating every cell per entity per frame.',
      'Object-oriented design patterns for configurable enemy and entity creation.',
    ],
  },
];

function Gallery({ images, title, badge, position = 'center' }) {
  const [i, setI] = useState(0);
  return (
    <div>
      <div className="project__media">
        <img src={images[i]} alt={`${title} screenshot ${i + 1}`} loading="lazy" style={{ objectPosition: position }} />
        {badge && <span className="chip media__badge">{badge}</span>}
      </div>
      {images.length > 1 && (
        <div className="gallery__thumbs">
          {images.map((src, k) => (
            <button key={k} className="gallery__thumb" aria-current={k === i} aria-label={`Screenshot ${k + 1}`} onClick={() => setI(k)}>
              <img src={src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Sketch({ media }) {
  const [stats, setStats] = useState(null);
  const ref = useSketch((canvas) => media.sketch(canvas, { onStats: setStats }));
  return (
    <>
      <canvas ref={ref} aria-label={media.badge} />
      <span className="chip media__badge"><span className="live-dot" /> {media.badge}</span>
      <span className="chip media__stat">{media.stat(stats)}</span>
    </>
  );
}

function Media({ project }) {
  const { media } = project;
  return (
    <div className="project__visual">
      {media.type === 'gallery' && <Gallery {...media} title={project.title} />}
      {media.type === 'sketch' && <div className="project__media"><Sketch media={media} /></div>}
      {media.type === 'video' && (
        <div className="project__media">
          <video src={media.src} poster={media.poster} autoPlay muted loop playsInline />
        </div>
      )}
    </div>
  );
}

const reveal = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
};

function Project({ project, index }) {
  return (
    <motion.article id={project.id} className={`project ${index % 2 ? 'project--flip' : ''}`} {...reveal}>
      <Media project={project} />
      <div className="project__info">
        <div className="project__index">
          <span>{String(index + 1).padStart(2, '0')}</span>
          <span>{project.role} · {project.year}</span>
        </div>
        <h3 className="project__title">{project.title}</h3>
        <p className="project__tagline">{project.tagline}</p>

        <div className="metrics">
          {project.metrics.map((m) => (
            <div className="metric" key={m.label}>
              <div className="metric__value">{m.value}</div>
              <div className="metric__label">{m.label}</div>
            </div>
          ))}
        </div>

        <div className="stack">
          {project.stack.map((s) => <span className="chip" key={s}>{s}</span>)}
        </div>

        <div className="project__links">
          <a className="btn" href={project.repo} target="_blank" rel="noreferrer"><GitHubIcon /> Source <ArrowUpRight /></a>
          {project.demo && (
            <a className="btn" href={project.demo} target="_blank" rel="noreferrer"><Play /> Demo</a>
          )}
        </div>

        <details className="details">
          <summary>How it works <ChevronDown /></summary>
          <ul>{project.details.map((d) => <li key={d}>{d}</li>)}</ul>
        </details>
      </div>
    </motion.article>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="section">
      <div className="container">
        <div className="section__head">
          <h2>Projects</h2>
          <span className="eyebrow">{String(PROJECTS.length).padStart(2, '0')} projects</span>
        </div>
        <div className="projects">
          {PROJECTS.map((p, i) => <Project key={p.id} project={p} index={i} />)}
        </div>
      </div>
    </section>
  );
}
