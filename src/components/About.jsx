import { motion } from 'framer-motion';
import headshot from '../assets/headshot.jpg';

const reveal = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
};

// Built from what the projects actually use, systems / C++ first
const ROWS = [
  { key: 'Languages', items: ['C++17/20', 'C', 'CUDA', 'C#', 'Python', 'TypeScript'] },
  { key: 'Systems', items: ['Multithreading', 'TCP/UDP networking', 'Winsock', 'Cyclone DDS', 'OpenSSL', 'SQLite', 'PostgreSQL', 'OpenGL / GLSL', 'OpenCL'] },
  { key: 'Tools', items: ['perf', 'Wireshark', 'ASan / UBSan / TSan', 'RenderDoc', 'CMake', 'vcpkg', 'Docker', 'Git', 'Visual Studio', 'Linux'] },
  { key: 'Also', items: ['ASP.NET Core', 'Jenkins', 'PyTorch', 'Vue', 'React', 'Three.js', 'WebGL', 'WebGPU', 'ImGui'], dim: true },
];

export default function About() {
  return (
    <section id="about" className="section">
      <div className="container">
        <div className="section__head">
          <h2>About</h2>
          <span className="eyebrow">Singapore</span>
        </div>

        <div className="about">
          <motion.div className="about__photo" {...reveal}>
            <img src={headshot} alt="Choi Meng Yew" loading="lazy" />
          </motion.div>

          <motion.div {...reveal} transition={{ ...reveal.transition, delay: 0.1 }}>
            <p className="about__lede">
              I&rsquo;m a CS student at DigiPen Singapore who loves C++ and <em>systems programming</em>.
              Most of my projects are low-level, from game engines to trading systems, and I want to
              keep building software where speed matters.
            </p>

            <div className="rows">
              {ROWS.map((row) => (
                <div className="row" key={row.key}>
                  <div className="row__key">{row.key}</div>
                  <div className={`row__val tools${row.dim ? ' tools--dim' : ''}`}>
                    {row.items.map((t) => <span className="chip" key={t}>{t}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
