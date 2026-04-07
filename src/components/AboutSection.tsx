import { useState } from 'react'
import { SiJavascript, SiTypescript, SiNextdotjs, SiNodedotjs, SiSass, SiTailwindcss, SiMysql, SiAmazon } from 'react-icons/si'
import { FaReact, FaPython, FaGitAlt, FaDocker } from 'react-icons/fa'
import bohanImage from '../assets/Bohan.jpg'
import TetrisPuzzle from './TetrisPuzzle'

// Tetris colour groups
// orange: JavaScript, SQL, Python, Node.js
// purple: CSS/SCSS, Tailwind, React, TypeScript
// blue:   Docker, AWS, Git, Next.js
const skills = [
  { name: 'JavaScript', Icon: SiJavascript,  color: '#f97316' }, // orange
  { name: 'TypeScript', Icon: SiTypescript,  color: '#a855f7' }, // purple
  { name: 'React',      Icon: FaReact,       color: '#a855f7' }, // purple
  { name: 'Next.js',    Icon: SiNextdotjs,   color: '#3b82f6' }, // blue
  { name: 'Node.js',    Icon: SiNodedotjs,   color: '#f97316' }, // orange
  { name: 'CSS/SCSS',   Icon: SiSass,        color: '#a855f7' }, // purple
  { name: 'Tailwind',   Icon: SiTailwindcss, color: '#a855f7' }, // purple
  { name: 'Git',        Icon: FaGitAlt,      color: '#3b82f6' }, // blue
  { name: 'Python',     Icon: FaPython,      color: '#f97316' }, // orange
  { name: 'SQL',        Icon: SiMysql,       color: '#f97316' }, // orange
  { name: 'Docker',     Icon: FaDocker,      color: '#3b82f6' }, // blue
  { name: 'AWS',        Icon: SiAmazon,      color: '#3b82f6' }, // blue
]

export default function AboutSection() {
  const [flipped, setFlipped] = useState(false)

  return (
    <section id="about" className="min-h-screen relative px-8 md:px-24 py-24">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl font-bold mb-16 text-black dark:text-white">
          About Me ✌️
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* ── Photo card with flip ── */}
          <div className="flex flex-col items-center gap-4">
            {/* 3-D flip container */}
            <div
              className="w-full relative"
              style={{ perspective: '1200px' }}
            >
              <div
                className="relative w-full transition-transform duration-700"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
              >
                {/* Front */}
                <div
                  className="relative overflow-hidden rounded-3xl shadow-2xl"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <img
                    src={bohanImage}
                    alt="Bohan Wang"
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>

                {/* Back — Tetris puzzle */}
                <div
                  className="absolute inset-0 overflow-hidden rounded-3xl shadow-2xl"
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                >
                  <TetrisPuzzle />
                </div>
              </div>
            </div>
          </div>

          {/* ── Skills + bio ── */}
          <div className="flex flex-col justify-center items-center">
            <div className="grid grid-cols-4 gap-2 p-10">
              {skills.map(({ name, Icon, color }, i) => (
                <div
                  key={i}
                  className={`aspect-square flex flex-col items-center justify-center p-4 shadow-md hover:scale-110 space-y-2 ${
                    flipped ? '' : 'bg-white dark:bg-black'
                  }`}
                  style={{
                    ...(flipped ? { backgroundColor: color } : {}),
                    transform: `rotate(${(i % 4) * 3 - 4}deg)`,
                    borderRadius: '18% 22% 20% 16%',
                    transition: 'background-color 0.6s ease, transform 0.3s ease',
                  }}
                >
                  <Icon
                    className={`w-8 h-8 transition-colors duration-500 ${flipped ? '' : 'text-gray-800 dark:text-gray-200'}`}
                    style={flipped ? { color: 'white' } : {}}
                  />
                  <span
                    className={`text-xs font-medium text-center transition-colors duration-500 ${flipped ? '' : 'text-black dark:text-white'}`}
                    style={flipped ? { color: 'white' } : {}}
                  >
                    {name}
                  </span>
                </div>
              ))}
            </div>

            <div className="text-center lg:text-left space-y-4">
              {!flipped ? (
                <>
                  <h2 className="px-12 text-5xl font-bold text-black dark:text-white">
                    McGill U4 Comp Eng
                  </h2>
                  <p className="px-12 text-xl text-gray-600 dark:text-white/90 leading-relaxed max-w-2xl">
                    My name is Bohan Wang, a Full Stack Developer interested in large language models (LLM) job and projects. I'm passionate about building innovative web applications and exploring new AI technologies.
                  </p>
                </>
              ) : (
                <>
                  <h2 className="px-12 text-5xl font-bold text-black dark:text-white">
                    Tetris Puzzle Challenge
                  </h2>
                  <p className="px-12 text-xl text-gray-600 dark:text-white/90 leading-relaxed max-w-2xl">
                    Try it out and DM your solution to me on LinkedIn — screenshots, math proof, anything works!
                  </p>
                  <p className="px-12 text-md text-gray-700 dark:text-gray-500 mt-2">
                    drag to place · double-click to rotate
                  </p>
                  <a
                    href="https://www.linkedin.com/in/wbohanw/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mx-12 mt-1 inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    linkedin.com/in/wbohanw →
                  </a>
                </>
              )}
              <button
                onClick={() => setFlipped(f => !f)}
                className="mx-12 mt-2 px-5 py-2 text-sm font-medium rounded-full border border-black/15 dark:border-white/15 text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-200"
              >
                {flipped ? '← Flip photo back' : 'Flip photo ↺'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
