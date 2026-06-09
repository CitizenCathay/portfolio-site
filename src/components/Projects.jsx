const PROJECTS = [
  {
    title: 'Grape Engine',
    role: 'GPU Lead · Completed',
    year: 'Sep 2025 — Apr 2026',
    summary: 'A C++17 game engine featuring a custom OpenGL renderer, Entity Component System architecture, and CUDA-accelerated GPU subsystems.',
    description: 'Built a custom game engine to explore software architecture, real-time rendering and GPU acceleration. The engine includes an Entity Component System-based runtime, OpenGL 4.5 rendering, editor tooling, GPU object picking, and CUDA–OpenGL interoperability for simulation systems.',
    keyFeatures: [
      'OpenGL 4.5 renderer with MRT/FBO support, layer-sorted rendering, and GLSL shader support.',
      'CUDA–OpenGL interop systems for GPU-accelerated particles and flocking simulations.',
      'Scaled boids simulation from ~5,000 to over 500,000 agents while maintaining 60 FPS by parallelizing neighbour queries across the GPU.',
      'Async PBO readback for GPU object picking without stalling the frame.',
    ],
    stack: ['C++17', 'OpenGL 4.5', 'CUDA', 'CUDA–OpenGL Interop', 'GLSL', 'ImGui', 'RenderDoc'],
    links: [
      { label: 'Repository', href: 'https://github.com/Chaotic-Grapes/GrapeEngine',         icon: 'devicon-github-plain'  },
      { label: 'Video Demo',  href: 'https://youtube.com/',                                 icon: 'youtube'               },
    ],
  },
  {
    title: 'Echoes Below',
    role: 'Graphics & GPU Programmer · Completed',
    year: 'Sep 2025 - Apr 2026',
    summary: 'A 2D underwater puzzle platformer where players navigate flooded environments — built around atmospheric rendering, shader-driven visuals, and real-time lighting to sell the feeling of being submerged.',
    description: 'Architected and implemented all rendering systems for a student team game project, authoring the shader stack, lighting systems, and post-processing passes from scratch to achieve a distinct underwater visual atmosphere.',
    keyFeatures: [
      'Cook–Torrance PBR pipeline (GGX NDF, Smith geometry, Fresnel-Schlick) with normal maps, MRA maps, and emissive mask support.',
      'SDF rendering for resolution-independent UI text and geometry.',
      'SSBO-driven dynamic point light system with smooth distance attenuation.',
      'Built a multi-stage post-processing pipeline — HDR rendering, bloom, tone mapping, and gamma correction across chained off-screen passes.',
    ],
    stack: ['C++', 'OpenGL', 'GLSL'],
    links: [
      { label: 'Repository', href: 'https://github.com/Chaotic-Grapes/EchoesBelow',   icon: 'devicon-github-plain' },
      { label: 'Video Demo',  href: 'https://youtube.com/',                           icon: 'youtube'              },
    ],
  },
  {
    title: 'Astral Siege',
    role: 'Systems & Gameplay Programmer · Completed',
    year: 'Jan 2025 — Apr 2025',
    summary: 'A 2D tower defense game featuring a custom gravity system built using discrete vector fields and real-time physics simulation.',
    description: 'Developed gameplay and simulation systems for Astral Siege — a 2D tower defense built in DigiPen\'s Alpha Engine where gravity fields shape projectile trajectories and entity behavior.',
    keyFeatures: [
      'Implemented a discrete 2D vector field to model non-uniform gravitational forces.',
      'Applied per-cell acceleration sampling to influence projectile trajectories and entity movement.',
      'O(1) vector field lookup via grid-indexed sampling — avoids iterating all cells per entity per frame.',
      'Used object-oriented design patterns to support configurable enemy and entity creation.',
    ],
    stack: ['C++', 'Game Physics', 'Object-Oriented Design'],
    links: [
      { label: 'Repository', href: 'https://github.com/',  icon: 'devicon-github-plain' },
      { label: 'Video Demo',  href: 'https://youtube.com/', icon: 'youtube'              },
    ],
  },
];

function GlassLink({ href, label, icon }) {
  const isYoutube = icon === 'youtube';
  return (
    <a href={href} target="_blank" rel="noreferrer"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '8px 16px', borderRadius: 999,
        fontSize: 13, color: 'var(--text)',
        textDecoration: 'none', position: 'relative', overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06), inset 2px 2px 1px rgba(255,255,255,0.7), inset -1px -1px 1px rgba(255,255,255,0.4)',
        transition: 'box-shadow 0.2s, transform 0.2s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'scale(1.03)';
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.10), inset 2px 2px 1px rgba(255,255,255,0.8), inset -1px -1px 1px rgba(255,255,255,0.5)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06), inset 2px 2px 1px rgba(255,255,255,0.7), inset -1px -1px 1px rgba(255,255,255,0.4)';
      }}>
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        backdropFilter: 'blur(10px) saturate(160%)',
        WebkitBackdropFilter: 'blur(10px) saturate(160%)',
        borderRadius: 999,
      }}/>
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: 'rgba(255,255,255,0.35)',
        borderRadius: 999,
        border: '1px solid rgba(255,255,255,0.6)',
      }}/>
      {isYoutube ? (
        <svg viewBox="0 0 24 24" style={{ width: 15, height: 15, position: 'relative', zIndex: 2, fill: '#FF0000' }}>
          <path d="M23.5 6.2s-.3-2-1.2-2.8c-1.1-1.2-2.4-1.2-3-1.3C16.8 2 12 2 12 2s-4.8 0-7.3.1c-.6.1-1.9.1-3 1.3C.8 4.2.5 6.2.5 6.2S.2 8.5.2 10.8v2.1c0 2.3.3 4.6.3 4.6s.3 2 1.2 2.8c1.1 1.2 2.6 1.1 3.3 1.2C7.2 21.7 12 21.8 12 21.8s4.8 0 7.3-.2c.6-.1 1.9-.1 3-1.3.9-.8 1.2-2.8 1.2-2.8s.3-2.3.3-4.6v-2.1c0-2.3-.3-4.6-.3-4.6zM9.7 15.5V8.4l8.1 3.6-8.1 3.5z"/>
        </svg>
      ) : (
        <i className={icon} style={{ fontSize: 15, position: 'relative', zIndex: 2 }}/>
      )}
      <span style={{ position: 'relative', zIndex: 2 }}>{label}</span>
    </a>
  );
}

function ProjectCard({ project, index, last }) {
  return (
    <article style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 48,
      paddingTop: 48, paddingBottom: 48,
      borderBottom: last ? 'none' : '1px solid var(--border)',
      alignItems: 'start',
    }}>
      {/* Left column — title, meta, stack, link */}
      <div style={{ position: 'sticky', top: 80 }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'baseline', flexWrap: 'wrap', gap: 8,
          marginBottom: 8,
        }}>
          <h3 style={{
            fontSize: 24, fontWeight: 500,
            letterSpacing: '-0.025em', color: 'var(--text)',
          }}>
            {project.title}
          </h3>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 12,
            color: 'var(--text-dim)',
          }}>
            {project.year}
          </span>
        </div>

        <div style={{
          fontSize: 13, color: 'var(--text-muted)',
          marginBottom: 20,
        }}>
          {project.role}
        </div>

        <p style={{
          fontSize: 15, lineHeight: 1.6,
          color: 'var(--text)', marginBottom: 28,
        }}>
          {project.summary}
        </p>

        {/* Stack */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 28 }}>
          {project.stack.map(s => (
            <span key={s} style={{
              fontFamily: 'var(--font-mono)', fontSize: 11,
              color: 'var(--text-muted)', padding: '3px 8px',
              border: '1px solid var(--border)', borderRadius: 4,
            }}>{s}</span>
          ))}
        </div>

        {/* Links */}
        {project.links?.length > 0 && (
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {project.links.map(l => (
              <GlassLink key={l.label} href={l.href} label={l.label} icon={l.icon} />
            ))}
          </div>
        )}
      </div>

      {/* Right column — description + key features */}
      <div>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 11,
          color: 'var(--text-dim)', textTransform: 'uppercase',
          letterSpacing: '0.08em', marginBottom: 10,
        }}>
          Description
        </div>
        <p style={{
          fontSize: 14, lineHeight: 1.75,
          color: 'var(--text-muted)', marginBottom: 32,
        }}>
          {project.description}
        </p>

        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 11,
          color: 'var(--text-dim)', textTransform: 'uppercase',
          letterSpacing: '0.08em', marginBottom: 12,
        }}>
          Key features
        </div>
        <ul style={{ listStyle: 'none', display: 'grid', gap: 10 }}>
          {project.keyFeatures.map((f, i) => (
            <li key={i} style={{
              fontSize: 14, lineHeight: 1.65,
              color: 'var(--text-muted)',
              paddingLeft: 18, position: 'relative',
            }}>
              <span style={{
                position: 'absolute', left: 0, top: 10,
                width: 6, height: 1, background: 'var(--text-faint)',
              }}/>
              {f}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{
      fontFamily: 'var(--font-mono)', fontSize: 11,
      color: 'var(--text-dim)', textTransform: 'uppercase',
      letterSpacing: '0.08em', marginBottom: 10,
    }}>
      {children}
    </div>
  );
}

export default function Projects() {
  return (
    <section id="projects" style={{
      maxWidth: 1080, margin: '0 auto', padding: '48px 32px',
    }}>
      <SectionHeader label="Projects" />
      <div>
        {PROJECTS.map((p, i) => (
          <ProjectCard key={p.title} project={p} index={i} last={i === PROJECTS.length - 1} />
        ))}
      </div>
    </section>
  );
}

export function SectionHeader({ number, label }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'baseline', gap: 16,
      marginTop: 32,
      marginBottom: 8,
      paddingBottom: 20,
      borderBottom: '1px solid rgba(0,0,0,0.18)',
    }}>
      {number && (
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 12,
          color: 'var(--text-faint)',
        }}>
          {number}
        </span>
      )}
      <h2 style={{
        fontSize: 16, fontWeight: 500, color: 'var(--text-dim)',
        letterSpacing: '0.06em', textTransform: 'uppercase',
      }}>
        {label}
      </h2>
    </div>
  );
}