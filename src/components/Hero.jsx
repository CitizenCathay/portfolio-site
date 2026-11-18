import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Mail } from 'lucide-react';
import { createBoids } from '../sketches/boids';
import { useSketch } from '../sketches/useSketch';
import { GitHubIcon, LinkedInIcon } from './Icons';
import { EMAIL, GITHUB, LINKEDIN } from '../links';

const rise = (delay) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] },
});

export default function Hero() {
  const [stats, setStats] = useState(null);
  const canvasRef = useSketch((canvas) =>
    createBoids(canvas, {
      onStats: setStats,
      mobile: window.matchMedia('(max-width: 700px)').matches,
    }),
  );

  return (
    <section className="hero" aria-label="Intro">
      <canvas ref={canvasRef} className="hero__canvas" aria-hidden="true" />
      <div className="hero__shade" />

      {stats && (
        <motion.div className="hero__hud" {...rise(0.8)} aria-hidden="true">
          <span><b>{stats.count.toLocaleString()}</b> boids · <b>{stats.fps || '··'}</b> fps · {stats.mode === 'GPU' ? 'GPU compute' : 'CPU'}</span>
          {!stats.reduced && <span className="hero__hint">move your cursor through the school</span>}
          <a className="hero__hud-link" href="#grape-engine">same idea at 500K in CUDA ↓</a>
        </motion.div>
      )}

      <div className="hero__content container">
        <motion.div className="hero__status" {...rise(0.1)}>
          <span className="chip"><span className="live-dot" /> Open to internships · May 2027</span>
        </motion.div>
        <motion.h1 {...rise(0.2)}>Choi Meng Yew</motion.h1>
        <motion.p className="hero__role" {...rise(0.3)}>
          <strong>GPU &amp; graphics programmer.</strong> Engines, renderers, simulations.
        </motion.p>
        <motion.div className="hero__actions" {...rise(0.4)}>
          <a className="btn btn--primary" href="#experience"><ArrowDown /> See my work</a>
          <a className="btn btn--icon" href={GITHUB} target="_blank" rel="noreferrer" aria-label="GitHub"><GitHubIcon /></a>
          <a className="btn btn--icon" href={LINKEDIN} target="_blank" rel="noreferrer" aria-label="LinkedIn"><LinkedInIcon /></a>
          <a className="btn btn--icon" href={`mailto:${EMAIL}`} aria-label="Email"><Mail /></a>
        </motion.div>
      </div>
    </section>
  );
}
