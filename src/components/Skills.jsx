const SKILL_GROUPS = [
  {
    label: 'Languages',
    skills: ['C++17', 'C', 'CUDA', 'GLSL', 'Python', 'JavaScript'],
  },
  {
    label: 'Graphics & GPU',
    skills: ['OpenGL', 'CUDA', 'Forward+', 'PBR', 'Deferred Shading', 'Ray Tracing'],
  },
  {
    label: 'Engine & Systems',
    skills: ['ECS Architecture', 'Render Graph', 'Spatial Hashing', 'Lock-free DS', 'ucontext'],
  },
  {
    label: 'Tools & APIs',
    skills: ['ImGui', 'SFML', 'OpenGL', 'WinSock', 'Git', 'CMake'],
  },
  {
    label: 'Concepts',
    skills: ['GPU Compute', 'Multithreading', 'Networking (TCP/UDP)', 'Real-Time Simulation', 'Game Architecture'],
  },
];

export default function Skills() {
  return (
    <section id="skills" style={{ padding: '6rem 2rem', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ marginBottom: '3rem' }}>
          <span style={{ color: 'var(--text-dim)', fontSize: 12, letterSpacing: 3, textTransform: 'uppercase' }}>03 /</span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,5vw,48px)', fontWeight: 800, marginTop: 4 }}>
            Skills
          </h2>
          <div style={{ width: 48, height: 2, background: 'var(--accent)', marginTop: 12 }}/>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {SKILL_GROUPS.map(group => (
            <div key={group.label} style={{
              background: 'var(--bg-card)',
              border: '0.5px solid var(--border)',
              padding: '1.25rem',
            }}>
              <div style={{
                fontSize: 11, letterSpacing: 2, color: 'var(--accent)',
                textTransform: 'uppercase', marginBottom: '0.75rem',
                paddingBottom: '0.5rem', borderBottom: '0.5px solid var(--border)'
              }}>
                {group.label}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {group.skills.map(skill => (
                  <span key={skill} style={{
                    fontSize: 12, padding: '3px 10px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '0.5px solid rgba(255,255,255,0.08)',
                    color: 'var(--text)',
                  }}>{skill}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
