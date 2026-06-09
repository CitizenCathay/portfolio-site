import { SectionHeader } from './Projects';

const LINKS = [
  { label: 'Email',   value: 'g2skurai@gmail.com',              href: 'mailto:g2skurai@gmail.com' },
  { label: 'GitHub',  value: 'github.com/CitizenCathay',        href: 'https://github.com/CitizenCathay' },
  { label: 'LinkedIn',value: 'linkedin.com/in/meng-yew',        href: 'https://www.linkedin.com/in/meng-yew/' },
  { label: 'Resume',  value: 'Download PDF',                    href: '/resume.pdf' },
];

export default function Contact() {
  return (
    <section id="contact" style={{
      maxWidth: 1080, margin: '0 auto', padding: '20px 32px 20px',
    }}>
      <SectionHeader label="Contact" />

      <div style={{ paddingTop: 56, maxWidth: 640 }}>
        <h3 style={{
          fontSize: 28, fontWeight: 500, letterSpacing: '-0.025em',
          marginBottom: 16, lineHeight: 1.2,
        }}>
          Open to internship opportunities.
        </h3>
        <p style={{
          fontSize: 15, lineHeight: 1.7, color: 'var(--text-muted)',
          marginBottom: 40,
        }}>
          Available May 2027 — April 2028. Particularly interested in systems engineering,
          GPU compute, high-performance computing and scalable infrastructure.
        </p>

        <dl style={{ display: 'grid', gap: 0 }}>
          {LINKS.map((l, i) => (
            <a key={l.label} href={l.href}
              target={l.href.startsWith('http') ? '_blank' : undefined}
              rel="noreferrer"
              style={{
                display: 'grid',
                gridTemplateColumns: '140px 1fr auto',
                gap: 16, alignItems: 'center',
                padding: '18px 0',
                borderTop: i === 0 ? '1px solid var(--border)' : 'none',
                borderBottom: '1px solid var(--border)',
                color: 'var(--text)',
                transition: 'background 0.15s, padding-left 0.15s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                e.currentTarget.style.paddingLeft = '8px';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.paddingLeft = '0';
              }}>
              <span style={{
                fontSize: 13, color: 'var(--text-muted)',
                fontFamily: 'var(--font-mono)',
              }}>{l.label}</span>
              <span style={{ fontSize: 14 }}>{l.value}</span>
              <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>↗</span>
            </a>
          ))}
        </dl>
      </div>

      <footer style={{
        marginTop: 96, paddingTop: 24,
        borderTop: '1px solid var(--border)',
        display: 'flex', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 12,
        fontSize: 12, color: 'var(--text-dim)',
        fontFamily: 'var(--font-mono)',
      }}>
        <span>© {new Date().getFullYear()} Choi Meng Yew</span>
        <span>SIT-DigiPen · Real-Time Interactive Simulation</span>
      </footer>
    </section>
  );
}
