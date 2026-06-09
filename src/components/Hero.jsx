import { useState, useEffect } from 'react';
import headshot from '../assets/headshot.jpg';

const LINKS = [
  { label: 'GitHub',   href: 'https://github.com/CitizenCathay'          },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/meng-yew/'     },
  { label: 'Resume',   href: '/resume.pdf'                               },
  { label: 'Email',    href: 'mailto:g2skurai@gmail.com'                 },
];

const TITLES = [
  'GPU & Graphics Programmer.',
  'Software Engineer.',
  'CUDA Developer.',
];

function useTypewriter(texts, typingSpeed = 60, deletingSpeed = 35, pauseMs = 2000) {
  const [displayed, setDisplayed] = useState('');
  const [index, setIndex] = useState(0);
  const [typing, setTyping] = useState(true);
  const [pausing, setPausing] = useState(false);

  useEffect(() => {
    if (pausing) {
      const t = setTimeout(() => { setPausing(false); setTyping(false); }, pauseMs);
      return () => clearTimeout(t);
    }
    if (typing) {
      if (displayed.length < texts[index].length) {
        const t = setTimeout(() => setDisplayed(texts[index].slice(0, displayed.length + 1)), typingSpeed);
        return () => clearTimeout(t);
      } else {
        setPausing(true);
      }
    } else {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), deletingSpeed);
        return () => clearTimeout(t);
      } else {
        setIndex((index + 1) % texts.length);
        setTyping(true);
      }
    }
  }, [displayed, typing, pausing, index, texts, typingSpeed, deletingSpeed, pauseMs]);

  return displayed;
}

export default function Hero() {
  const typed = useTypewriter(TITLES);

  return (
    <section style={{
      minHeight: '92vh',
      display: 'flex', alignItems: 'center',
      padding: '120px 32px 80px',
      maxWidth: 1080, margin: '0 auto',
    }}>
      {/* Left — text */}
      <div className="fade-in" style={{ flex: 1, maxWidth: 580 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '5px 12px', marginBottom: 32,
          border: '1px solid var(--border)', borderRadius: 999,
          fontSize: 12, color: 'var(--text-muted)',
          fontFamily: 'var(--font-mono)',
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: '#4ade80',
            boxShadow: '0 0 8px rgba(74,222,128,0.6)',
          }}/>
          Seeking internship · May 2027
        </div>

        <h1 style={{
          fontSize: 'clamp(40px, 6vw, 60px)',
          fontWeight: 500, letterSpacing: '-0.035em',
          lineHeight: 1.05, marginBottom: 12,
        }}>
          Choi Meng Yew
        </h1>

        {/* Typewriter line */}
        <p style={{
          fontSize: 18, color: 'var(--text-muted)',
          marginBottom: 20, minHeight: 32,
          letterSpacing: '-0.01em',
        }}>
          <span style={{ color: 'var(--text)' }}>{typed}</span>
          <span style={{
            display: 'inline-block', width: 2, height: '1.1em',
            background: 'var(--text)', marginLeft: 2,
            verticalAlign: 'text-bottom',
            animation: 'blink 1s step-end infinite',
          }}/>
        </p>

        <p style={{
          fontSize: 15, lineHeight: 1.65, color: 'var(--text-muted)',
          marginBottom: 40, maxWidth: 500,
        }}>
          Hey! I'm Meng Yew, a second-year Computer Science student at DigiPen (Singapore) who 
          spends most of his time thinking about how to make things run faster on the GPU. I care about systems, graphics, and understanding the hardware beneath the abstraction.
        </p>

        <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
          {LINKS.map(link => (
            <a key={link.label} href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel="noreferrer"
              style={{
                fontSize: 14, color: 'var(--text-muted)',
                display: 'inline-flex', alignItems: 'center', gap: 5,
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
              {link.label}
              <span style={{ fontSize: 11, opacity: 0.6 }}>↗</span>
            </a>
          ))}
        </div>
      </div>

      {/* Right — headshot */}
      <div className="fade-in" style={{
        flexShrink: 0, marginLeft: 80,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          width: 260, height: 260,
          borderRadius: '50%',
          overflow: 'hidden',
          border: '1px solid var(--border)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
        }}>
          <img
            src={headshot}
            alt="Choi Meng Yew"
            style={{
              width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'center top',
            }}
          />
        </div>
      </div>
    </section>
  );
}