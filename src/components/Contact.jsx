import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Check, Copy } from 'lucide-react';
import { GitHubIcon, LinkedInIcon } from './Icons';
import { EMAIL, GITHUB, LINKEDIN } from '../links';

// Clipboard API where available; a hidden textarea + execCommand otherwise.
async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;';
    document.body.appendChild(ta);
    ta.select();
    let ok;
    try { ok = document.execCommand('copy'); } catch { ok = false; }
    ta.remove();
    return ok;
  }
}

// mailto only works when the visitor has a mail app set up, so offer a copy too.
function CopyEmail() {
  const [state, setState] = useState('idle'); // idle | copied | failed
  const timer = useRef(0);
  useEffect(() => () => clearTimeout(timer.current), []);

  const onClick = async () => {
    const ok = await copyText(EMAIL);
    setState(ok ? 'copied' : 'failed');
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setState('idle'), 2000);
  };

  return (
    <button className={`btn contact__copy contact__copy--${state}`} onClick={onClick} aria-label={`Copy ${EMAIL}`}>
      {state === 'copied' ? <Check /> : <Copy />}
      <span aria-live="polite">
        {state === 'copied' ? 'Copied!' : state === 'failed' ? 'Press Ctrl+C' : 'Copy email'}
      </span>
    </button>
  );
}

export default function Contact() {
  return (
    <>
      <section id="contact" className="section contact">
        <motion.div
          className="container"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="chip"><span className="live-dot" /> Internships · May 2027 – Apr 2028</span>
          <div className="contact__mailrow">
            <a className="contact__mail" href={`mailto:${EMAIL}`}>
              {EMAIL} <ArrowUpRight />
            </a>
            <CopyEmail />
          </div>
          <p className="contact__meta">C++ systems · Low-latency · GPU compute · HPC</p>
          <div className="contact__links">
            <a className="btn" href={GITHUB} target="_blank" rel="noreferrer"><GitHubIcon /> GitHub</a>
            <a className="btn" href={LINKEDIN} target="_blank" rel="noreferrer"><LinkedInIcon /> LinkedIn</a>
          </div>
        </motion.div>
      </section>

      <footer className="footer">
        <div className="container">
          <span>© {new Date().getFullYear()} Choi Meng Yew</span>
          <span>Hero &amp; sketches render live in your browser</span>
        </div>
      </footer>
    </>
  );
}
