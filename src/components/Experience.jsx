import { useState, useEffect } from 'react';
import { SectionHeader } from './Projects';

const EXPERIENCE = [
  {
    role: 'Teaching Assistant',
    company: 'DigiPen Institute of Technology',
    period: 'Jan 2025 — Present',
    bullets: [
      'Served as Teaching Assistant for the modules: High Level Programming I & II, Software Engineering Project I & II, and Computer Environment.',
      'Held office hours at the Academic Support Center and reviewed code submissions, providing feedback on correctness, style, and software engineering practices.',
      'Supported students in C and C++ programming, covering memory management, data structures, object-oriented design, and compiler behaviour.',
      'Conducted one-on-one sessions with students to work through code, debug problems, and clarify theoretical concepts.',
    ],
  },
];

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const fn = () => setWidth(window.innerWidth);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return width;
}

export default function Experience() {
  const width = useWindowWidth();
  const isMobile = width < 700;

  return (
    <section id="experience" style={{
      maxWidth: 1080, margin: '0 auto',
      padding: isMobile ? '80px 20px' : '80px 32px',
    }}>
      <SectionHeader label="Experience" />

      <div style={{ paddingTop: 56 }}>
        {EXPERIENCE.map((e, i) => (
          <div key={i} style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '200px 1fr',
            gap: isMobile ? 8 : 32,
            paddingBottom: 48,
            marginBottom: 48,
            borderBottom: i === EXPERIENCE.length - 1 ? 'none' : '1px solid var(--border)',
          }}>
            <div>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 12,
                color: 'var(--text-dim)', lineHeight: 1.6,
              }}>
                {e.period}
              </div>
            </div>

            <div>
              <div style={{
                fontSize: 16, fontWeight: 500, color: 'var(--text)',
                marginBottom: 4, letterSpacing: '-0.01em',
                marginTop: isMobile ? 4 : 0,
              }}>
                {e.role}
              </div>
              <div style={{
                fontSize: 13, color: 'var(--text-muted)',
                marginBottom: 16, fontFamily: 'var(--font-mono)',
              }}>
                {e.company}
              </div>
              <ul style={{ listStyle: 'none', display: 'grid', gap: 8 }}>
                {e.bullets.map((b, j) => (
                  <li key={j} style={{
                    fontSize: 14, lineHeight: 1.7,
                    color: 'var(--text-muted)',
                    paddingLeft: 18, position: 'relative',
                  }}>
                    <span style={{
                      position: 'absolute', left: 0, top: 10,
                      width: 6, height: 1, background: 'var(--text-faint)',
                    }}/>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}