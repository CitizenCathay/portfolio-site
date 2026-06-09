import { useState } from 'react';
import { SectionHeader } from './Projects';

const SKILLS = [
  // Core — strongest and most relevant
  { name: 'C++',          icon: 'devicon-cplusplus-plain'                      },
  { name: 'C',            icon: 'devicon-c-plain'                              },
  { name: 'CUDA',         icon: 'https://cdn.simpleicons.org/nvidia/76b900'    },
  { name: 'OpenGL',       icon: 'devicon-opengl-plain'                         },
  { name: 'GLSL',         icon: 'devicon-opengl-plain'                         },
  { name: 'WebGPU',       icon: 'devicon-webgpu-plain'                         },
  { name: 'WebAssembly', icon: 'devicon-wasm-plain' },
  { name: 'OpenCL',       icon: 'devicon-opencl-plain'                         },

  // Familiar
  { name: 'Python',       icon: 'devicon-python-plain'                         },
  { name: 'PyTorch',      icon: 'devicon-pytorch-original'                     },
  { name: 'CMake',        icon: 'devicon-cmake-plain'                          },
  { name: 'GitHub',  icon: 'devicon-github-plain'                              },
  { name: 'Git',          icon: 'devicon-git-plain'                            },
  { name: 'Linux',        icon: 'devicon-linux-plain'                          },
  { name: 'Ubuntu',       icon: 'devicon-ubuntu-plain'                         },
  { name: 'Visual Studio',icon: 'devicon-visualstudio-plain'                   },
  { name: 'VS Code',      icon: 'devicon-vscode-plain'                         },
  { name: 'Bash',         icon: 'devicon-bash-plain'                           },

  // Web
  { name: 'HTML',         icon: 'devicon-html5-plain'                          },
  { name: 'CSS',          icon: 'devicon-css3-plain'                           },
  { name: 'JavaScript',   icon: 'devicon-javascript-plain'                     },
  { name: 'TypeScript',   icon: 'devicon-typescript-plain'                     },
  { name: 'React',        icon: 'devicon-react-original'                       },
  { name: 'Three.js',     icon: 'devicon-threejs-original'                     },
];

function SkillPill({ name, icon }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '8px 16px',
        border: `1px solid ${hovered ? 'rgba(0,0,0,0.16)' : 'var(--border)'}`,
        borderRadius: 999,
        background: hovered ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.6)',
        backdropFilter: 'blur(8px)',
        whiteSpace: 'nowrap',
        fontSize: 13, color: 'var(--text)',
        boxShadow: hovered
          ? '0 4px 12px rgba(0,0,0,0.10)'
          : '0 1px 2px rgba(0,0,0,0.04)',
        transform: hovered ? 'scale(1.08)' : 'scale(1)',
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        cursor: 'default',
      }}>
      <i className={`${icon} colored`} style={{ fontSize: hovered ? 18 : 16, transition: 'font-size 0.2s' }}/>
      {name}
    </div>
  );
}

export default function About() {
  return (
    <section id="about" style={{
      maxWidth: 1080, margin: '0 auto', padding: '62px 32px',
    }}>
      <SectionHeader label="About" />

      <div style={{ paddingTop: 56, display: 'grid', gap: 40, maxWidth: 640, marginBottom: 64 }}>
        <p style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--text)' }}>
          In the course of my degree, I've covered algorithms, physics 
          simulation, AI systems, and software architecture — all mostly built from scratch 
          as part of the curriculum.
        </p>
        <p style={{ fontSize: 15, lineHeight: 1.75, color: 'var(--text-muted)' }}>
          I've shipped a C++/OpenGL/CUDA game engine, a multithreaded TCP/UDP paper trading system, 
          and a couple of games in C/C++ — plus this and a few other sites. Most side projects start the same way: 
          I wanted to understand how something worked well enough to build it myself.
        </p>
        <p style={{ fontSize: 15, lineHeight: 1.75, color: 'var(--text-muted)' }}>
          When I'm not writing shaders I'm usually underwater — I scuba dive, which
          is probably why many of my projects end up with ocean aesthetics.
        </p>
      </div>

      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 11,
        color: 'var(--text-dim)', textTransform: 'uppercase',
        letterSpacing: '0.08em', marginBottom: 20,
      }}>
        Skills & Technologies
      </div>

      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 10,
      }}>
        {SKILLS.map(s => (
          <SkillPill key={s.name} name={s.name} icon={s.icon} />
        ))}
      </div>
    </section>
  );
}