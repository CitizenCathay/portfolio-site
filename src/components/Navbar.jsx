import { useState, useEffect } from 'react';

const links = [
  { label: 'About',      href: '#about'      },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects',    href: '#projects'       },
  { label: 'Contact',    href: '#contact'    },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <>
      {/* SVG filter for glass distortion */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="glass-distortion" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              stitchTiles="stitch"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="8"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <nav style={{
        position: 'fixed', top: 16, left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        opacity: scrolled ? 1 : 0,
        pointerEvents: scrolled ? 'auto' : 'none',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
      }}>
        {/* Glass wrapper */}
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: 28,
          padding: '10px 24px',
          borderRadius: 999,
          overflow: 'hidden',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
        }}>
          {/* Glass distortion + blur layer */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 0,
            backdropFilter: 'blur(16px) saturate(180%)',
            WebkitBackdropFilter: 'blur(16px) saturate(180%)',
            filter: 'url(#glass-distortion)',
            borderRadius: 999,
            overflow: 'hidden',
          }}/>

          {/* White tint layer */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 1,
            background: 'rgba(255,255,255,0.25)',
            borderRadius: 999,
          }}/>

          {/* Inner shine / rim highlight */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 2,
            borderRadius: 999,
            boxShadow: `
              inset 2px 2px 1px rgba(255,255,255,0.7),
              inset -1px -1px 1px rgba(255,255,255,0.5)
            `,
          }}/>

          {/* Nav content */}
          <a href="#" style={{
            position: 'relative', zIndex: 3,
            fontFamily: 'var(--font-mono)', fontSize: 13,
            fontWeight: 500, color: 'var(--text)',
            letterSpacing: '-0.01em',
          }}>
            cmy
          </a>

          <div style={{
            position: 'relative', zIndex: 3,
            display: 'flex', gap: 24, alignItems: 'center',
          }}>
            {links.map(l => (
              <a key={l.href} href={l.href}
                style={{
                  fontSize: 13, color: 'var(--text-muted)',
                  fontWeight: 400, transition: 'color 0.15s',
                }}
                onMouseEnter={e => e.target.style.color = 'var(--text)'}
                onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Static top bar before scroll */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 99,
        height: 56, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '0 32px',
        opacity: scrolled ? 0 : 1,
        pointerEvents: scrolled ? 'none' : 'auto',
        transition: 'opacity 0.3s ease',
      }}>
        <a href="#" style={{
          fontFamily: 'var(--font-mono)', fontSize: 13,
          fontWeight: 500, color: 'var(--text)',
        }}>
          cmy
        </a>
        <div style={{ display: 'flex', gap: 28 }}>
          {links.map(l => (
            <a key={l.href} href={l.href}
              style={{ fontSize: 13, color: 'var(--text-muted)' }}
              onMouseEnter={e => e.target.style.color = 'var(--text)'}
              onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </>
  );
}