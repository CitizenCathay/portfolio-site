import { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

// status: 'next' (hollow, dashed) · 'now' (pulsing) · 'past' (solid)
const TIMELINE = [
  {
    status: 'next',
    date: 'May 2027 —',
    title: 'Internship',
    org: 'Open to offers',
    summary: 'Available May 2027 – Apr 2028 for systems, GPU compute, graphics or HPC work.',
    cta: { label: 'Get in touch', href: '#contact' },
  },
  {
    status: 'now',
    date: 'Jan 2025 — now',
    title: 'Teaching Assistant',
    org: 'DigiPen Institute of Technology Singapore',
    tags: ['High Level Programming I & II', 'Software Engineering Project I & II', 'Computer Environment'],
    points: [
      'Office hours at the Academic Support Center',
      'Code reviews for correctness, style and engineering practice',
      '1:1 debugging in C and C++: memory, data structures, OOP, compiler behaviour',
    ],
  },
  {
    status: 'past',
    date: 'In progress',
    title: 'BSc Computer Science',
    org: 'SIT – DigiPen · Real-Time Interactive Simulation',
    tags: ['Algorithms', 'Physics simulation', 'AI systems', 'Software architecture'],
  },
];

const ease = [0.16, 1, 0.3, 1];

function Item({ item, index }) {
  return (
    <motion.li
      className={`tl__item tl__item--${item.status}`}
      initial={{ opacity: 0, x: 24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay: index * 0.05, ease }}
    >
      <div className="tl__date">{item.date}</div>
      <div className="tl__node" aria-hidden="true"><span className="tl__dot" /></div>
      <div className="tl__card">
        <h3 className="tl__title">{item.title}</h3>
        <div className="tl__org">{item.org}</div>
        {item.summary && <p className="tl__summary">{item.summary}</p>}
        {item.tags && (
          <div className="tl__tags">{item.tags.map((t) => <span className="chip" key={t}>{t}</span>)}</div>
        )}
        {item.points && (
          <ul className="tl__points">{item.points.map((p) => <li key={p}>{p}</li>)}</ul>
        )}
        {item.cta && (
          <a className="btn tl__cta" href={item.cta.href}>{item.cta.label} <ArrowRight /></a>
        )}
      </div>
    </motion.li>
  );
}

export default function Experience() {
  const ref = useRef(null);
  // The accent rail fills as the timeline scrolls through the viewport.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 60%'] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <section id="experience" className="section">
      <div className="container">
        <div className="section__head">
          <h2>Experience</h2>
          <span className="eyebrow">Timeline</span>
        </div>

        <div className="tl" ref={ref}>
          <div className="tl__rail" aria-hidden="true">
            <motion.div className="tl__fill" style={{ scaleY: fill }} />
          </div>
          <ol className="tl__list">
            {TIMELINE.map((item, i) => <Item key={item.title} item={item} index={i} />)}
          </ol>
        </div>
      </div>
    </section>
  );
}
