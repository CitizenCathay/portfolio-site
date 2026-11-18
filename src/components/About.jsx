import { motion } from 'framer-motion';
import headshot from '../assets/headshot.jpg';

const reveal = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
};

const CORE = ['C++', 'C', 'CUDA', 'OpenGL / GLSL', 'OpenCL', 'TCP/UDP networking'];
const TOOLS = ['RenderDoc', 'ImGui', 'CMake', 'Git', 'Visual Studio', 'Linux'];
const ALSO = ['Python', 'PyTorch', 'TypeScript', 'React', 'Three.js', 'WebGL', 'WebGPU'];

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
              <div className="row">
                <div className="row__key">Core</div>
                <div className="row__val tools">{CORE.map((t) => <span className="chip" key={t}>{t}</span>)}</div>
              </div>
              <div className="row">
                <div className="row__key">Tools</div>
                <div className="row__val tools">{TOOLS.map((t) => <span className="chip" key={t}>{t}</span>)}</div>
              </div>
              <div className="row">
                <div className="row__key">Also</div>
                <div className="row__val tools tools--dim">{ALSO.map((t) => <span className="chip" key={t}>{t}</span>)}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
