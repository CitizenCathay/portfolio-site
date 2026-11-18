import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ChevronDown, Maximize2, Play } from 'lucide-react';
import { GitHubIcon } from './Icons';
import Lightbox from './Lightbox';
import Modal from './Modal';
import { useSketch } from '../sketches/useSketch';
import { createUnderwater } from '../sketches/underwater';
import { createGravity } from '../sketches/gravity';
import grapeEngine1 from '../assets/projects/grape-engine-1.jpg';
import grapeEngine2 from '../assets/projects/grape-engine-2.jpg';
import tradeflowTrade from '../assets/projects/tradeflow-trade.jpg';
import tradeflowMarkets from '../assets/projects/tradeflow-markets.jpg';
import tradeflowPortfolio from '../assets/projects/tradeflow-portfolio.jpg';
import hakutakuOverview from '../assets/projects/hakutaku-overview.jpg';
import hakutakuData from '../assets/projects/hakutaku-data.jpg';
import colorFloor1 from '../assets/projects/colorfloor-1.png';
import colorFloor2 from '../assets/projects/colorfloor-2.png';

// media.type: 'gallery' | 'video' | 'sketch'
// To show real footage, swap a project's media for:
//   { type: 'video', src: clip, poster: still }   (import the .mp4/.webm like the images)
const ALL_PROJECTS = [
  {
    id: 'grape-engine',
    title: 'Grape Engine',
    tagline: 'C++17 engine with a custom OpenGL renderer, ECS runtime and CUDA-accelerated simulation.',
    role: 'GPU & tools programmer',
    year: 'Sep 2025 — Apr 2026',
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
    year: 'Sep 2025 — Apr 2026',
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
    id: 'color-the-floor',
    title: 'Color the Floor',
    tagline: 'Distributed, encrypted real-time multiplayer in C on Cyclone DDS. Key-to-screen latency cut from 156 ms to 1.5 ms.',
    role: 'Networking & security · team of 3',
    year: 'Sep 2026 — Oct 2026',
    metrics: [
      { value: '1.5 ms', label: 'key → screen, 5 players (was 156 ms)' },
      { value: '32×', label: 'fewer server wake-ups (perf: 863 → 27/s)' },
      { value: 'AES-GCM', label: 'every message; HMAC joins, replay-proof' },
    ],
    stack: ['C', 'Cyclone DDS', 'OpenSSL', 'pthreads', 'OpenGL / GLFW', 'perf', 'Wireshark', 'ASan / TSan'],
    media: { type: 'gallery', images: [colorFloor1, colorFloor2], aspect: '4 / 3' },
    repo: 'https://github.com/CitizenCathay/CSD3116-Distributed-and-Secure-Simulation',
    details: [
      'Made both programs event-driven: DDS waitsets and a condition variable replace 1 ms polling loops, and the server no longer sleeps while holding its lock.',
      'Publish on change instead of every tick: 1,358 → 584 network messages for the same 5-player test (Wireshark).',
      'Security: HMAC-SHA256 join tokens over a nonce, AES-256-GCM on every message bound to its type and DDS key, and sequence-number replay protection.',
      'Cross-machine play over fixed DDS ports with optional peer addresses; clients rejoin by themselves after a server restart.',
      'A benchmark harness that builds the old and new code side by side, headless integration tests, and 130 unit-test checks; clean under ASan, UBSan and TSan.',
    ],
  },
  {
    id: 'hakutaku',
    title: 'Hakutaku',
    tagline: 'Self-hosted, PlayFab-style game backend: player accounts, player data and an admin dashboard.',
    role: 'Backend · team project',
    year: 'Sep 2026 — now',
    metrics: [
      { value: '202', label: 'tests, incl. integration on real Postgres' },
      { value: 'Argon2id', label: 'passwords; SHA-256 tokens and keys' },
      { value: 'CI/CD', label: 'Jenkins deploy + smoke test per merge' },
    ],
    stack: ['C# / .NET 10', 'ASP.NET Core', 'PostgreSQL', 'EF Core', 'Vue 3 + TS', 'Docker', 'Caddy', 'Jenkins'],
    media: {
      type: 'gallery',
      images: [hakutakuOverview, hakutakuData],
      position: 'left top',
    },
    repo: 'https://github.com/Bamboo01/Hakutaku',
    details: [
      'Built most of the server: guest device sign-in, email linking with verification and password reset by code, and admin cookie sessions with idle and absolute expiry.',
      'Three tiers of per-player data (client-writable, read-only, internal) with strict limits and transactional writes, editable from a PlayFab-style admin editor.',
      'Server keys let game servers validate player sessions and read or write their data; keys are hashed, revocable and owner-only.',
      'Abuse limits: per-IP rate limits, 5 email codes a day per account, Gmail-alias dedupe and capped display-name changes.',
      '202 unit and integration tests, plus a simulator that drives mock players through the C# SDK the Unity plugin uses.',
      'Ships as one Docker image behind a default-deny Caddy proxy; Jenkins deploys and smoke-tests every merge.',
    ],
  },
  {
    id: 'tradeflow',
    title: 'TradeFlow',
    tagline: 'Paper-trading exchange in native C++. Hand-rolled HTTP server, limit order book, SQLite persistence.',
    role: 'Systems & networking',
    year: 'Mar 2026 — Apr 2026',
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
    year: 'Jan 2025 — Apr 2025',
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

function Gallery({ images, title, badge, position = 'center', aspect }) {
  const [i, setI] = useState(0);
  const [zoom, setZoom] = useState(null); // index shown in the lightbox, or null
  const close = useCallback(() => setZoom(null), []);
  const go = useCallback((k) => { setZoom(k); setI(k); }, []);
  return (
    <div>
      <div className="project__media" style={aspect ? { aspectRatio: aspect } : undefined}>
        <button className="media__zoom" onClick={() => setZoom(i)} aria-label={`Enlarge ${title} screenshot ${i + 1}`}>
          <img src={images[i]} alt={`${title} screenshot ${i + 1}`} loading="lazy" style={{ objectPosition: position }} />
          <span className="media__zoom-hint" aria-hidden="true"><Maximize2 /></span>
        </button>
        {badge && <span className="chip media__badge">{badge}</span>}
      </div>
      <Lightbox images={images} index={zoom} title={title} onClose={close} onIndex={go} />
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

// Display order: C++ low-latency and systems work first, then backend, then graphics/gameplay.
const ORDER = ['tradeflow', 'color-the-floor', 'grape-engine', 'hakutaku', 'echoes-below', 'astral-siege'];
const PROJECTS = ORDER.map((id) => ALL_PROJECTS.find((p) => p.id === id));

const reveal = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
};

function Project({ project, index }) {
  return (
    <motion.article id={project.id} className={`project ${index % 2 ? 'project--flip' : ''}`} {...reveal}>
      <ProjectContent project={project} index={index} />
    </motion.article>
  );
}

// Media + info, shared by the full cards and the details pop-up
function ProjectContent({ project, index, openDetails = false }) {
  return (
    <>
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

        <details className="details" open={openDetails}>
          <summary>How it works <ChevronDown /></summary>
          <ul>{project.details.map((d) => <li key={d}>{d}</li>)}</ul>
        </details>
      </div>
    </>
  );
}

// Small live preview for a sketch project's compact card
function MiniSketch({ media }) {
  const ref = useSketch((canvas) => media.sketch(canvas, {}));
  return <canvas ref={ref} aria-hidden="true" />;
}

// Compact card in the "More projects" row; opens the full card in a pop-up
function MiniProject({ project, index, onOpen }) {
  const { media } = project;
  const metric = project.metrics[0];
  return (
    <motion.button
      id={project.id}
      className="mini"
      onClick={() => onOpen(project.id)}
      aria-haspopup="dialog"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: (index % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className="mini__media">
        {media.type === 'gallery' && <img src={media.images[0]} alt="" loading="lazy" />}
        {media.type === 'sketch' && <MiniSketch media={media} />}
        {media.type === 'sketch' && <span className="chip media__badge"><span className="live-dot" /> Live</span>}
      </span>
      <span className="mini__body">
        <span className="mini__meta"><span className="mini__num">{String(index + 1).padStart(2, '0')}</span> · {project.year}</span>
        <span className="mini__title">{project.title}</span>
        <span className="mini__tagline">{project.tagline}</span>
        <span className="mini__metric">
          <b>{metric.value}</b> {metric.label}
        </span>
        <span className="mini__cta">View details <ArrowUpRight /></span>
      </span>
    </motion.button>
  );
}

// The first few get full cards; the rest show as a compact "More projects" row
// (so Contact isn't buried) and open their full card in a pop-up.
const FEATURED = 3;
const compactIds = PROJECTS.slice(FEATURED).map((p) => p.id);
const hashProject = () => {
  const id = window.location.hash.slice(1);
  return compactIds.includes(id) ? id : null;
};

export default function Projects() {
  const [openId, setOpenId] = useState(hashProject); // a link like #astral-siege opens it
  const close = useCallback(() => setOpenId(null), []);

  useEffect(() => {
    const onHash = () => { const id = hashProject(); if (id) setOpenId(id); };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const featured = PROJECTS.slice(0, FEATURED);
  const compact = PROJECTS.slice(FEATURED);
  const openIndex = PROJECTS.findIndex((p) => p.id === openId);
  const open = openIndex >= 0 ? PROJECTS[openIndex] : null;

  return (
    <section id="projects" className="section">
      <div className="container">
        <div className="section__head">
          <h2>Projects</h2>
          <span className="eyebrow">{String(PROJECTS.length).padStart(2, '0')} projects</span>
        </div>
        <div className="projects">
          {featured.map((p, i) => <Project key={p.id} project={p} index={i} />)}
        </div>

        {compact.length > 0 && (
          <div className="also">
            <div className="also__head">
              <span className="eyebrow">More projects</span>
            </div>
            <div className="also__grid">
              {compact.map((p, i) => (
                <MiniProject key={p.id} project={p} index={FEATURED + i} onOpen={setOpenId} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Modal open={!!open} onClose={close} label={open ? `${open.title} details` : ''}>
        {open && (
          <article className="project project--modal">
            <ProjectContent project={open} index={openIndex} openDetails />
          </article>
        )}
      </Modal>
    </section>
  );
}
