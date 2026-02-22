import { SiJavascript, SiTypescript, SiNextdotjs, SiNodedotjs, SiSass, SiTailwindcss, SiMysql, SiAmazon } from 'react-icons/si'
import { FaReact, FaPython, FaGitAlt, FaDocker } from 'react-icons/fa'
import bohanImage from '../assets/Bohan.jpg'

const skills = [
  { name: 'JavaScript', Icon: SiJavascript },
  { name: 'TypeScript', Icon: SiTypescript },
  { name: 'React', Icon: FaReact },
  { name: 'Next.js', Icon: SiNextdotjs },
  { name: 'Node.js', Icon: SiNodedotjs },
  { name: 'CSS/SCSS', Icon: SiSass },
  { name: 'Tailwind', Icon: SiTailwindcss },
  { name: 'Git', Icon: FaGitAlt },
  { name: 'Python', Icon: FaPython },
  { name: 'SQL', Icon: SiMysql },
  { name: 'Docker', Icon: FaDocker },
  { name: 'AWS', Icon: SiAmazon },
]

export default function AboutSection() {
  return (
    <section id="about" className="min-h-screen relative px-8 md:px-24 py-24">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl font-bold mb-16 text-black dark:text-white">
          About Me ✌️
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 relative group">
            <div className="relative overflow-hidden rounded-3xl shadow-2xl transform transition-all duration-500 hover:shadow-3xl">
              <img
                src={bohanImage}
                alt="Bohan Wang"
                className="w-full h-auto object-cover transform transition-all duration-500 group-hover:scale-105"
              />
              <p className='text-white absolute top-1/4 left-1/4 font-serif bg-black/60 p-2 rounded-xl'>
                Campbell ---- One of the best Prof at Mcgill
              </p>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
          </div>

          <div className='flex flex-col justify-center items-center'>
            <div className="grid grid-cols-4 gap-2 p-10">
              {skills.map(({ name, Icon }, i) => (
                <div
                  key={i}
                  className="aspect-square flex flex-col items-center justify-center bg-white dark:bg-black p-4 shadow-md transform hover:rotate-3 hover:scale-110 transition-all duration-300 space-y-2"
                  style={{
                    transform: `rotate(${(i % 4) * 3 - 4}deg)`,
                    borderRadius: `${Math.random() * 20 + 10}% ${Math.random() * 20 + 10}% ${Math.random() * 20 + 10}% ${Math.random() * 20 + 10}%`,
                  }}
                >
                  <Icon className="w-8 h-8 text-gray-800 dark:text-gray-200" />
                  <span className="text-sm font-medium text-center text-black dark:text-white">{name}</span>
                </div>
              ))}
            </div>

            <div className="text-center lg:text-left space-y-4">
              <h2 className="px-12 text-5xl font-bold bg-gradient-to-r bg-clip-text text-black dark:text-white">
                McGill U4 Comp Eng
              </h2>
              <p className="px-12 text-xl text-gray-600 dark:text-white/90 leading-relaxed max-w-2xl">
                My name is Bohan Wang, a Full Stack Developer interested in large language models (LLM) job and projects. I'm passionate about building innovative web applications and exploring new AI technologies.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
