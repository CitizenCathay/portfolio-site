import { motion } from 'framer-motion';
import { ArrowUpRight, FileText } from 'lucide-react';
import { GitHubIcon, LinkedInIcon } from './Icons';
import { EMAIL, GITHUB, LINKEDIN, RESUME } from '../links';

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
          <div>
            <a className="contact__mail" href={`mailto:${EMAIL}`}>
              {EMAIL} <ArrowUpRight />
            </a>
          </div>
          <p className="contact__meta">Systems · GPU compute · Graphics · HPC</p>
          <div className="contact__links">
            <a className="btn btn--primary" href={RESUME}><FileText /> Resume</a>
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
