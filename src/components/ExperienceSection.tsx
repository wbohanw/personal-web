import { Experience } from '../types'

type ExperienceSectionProps = {
  experiences: Experience[]
}

function ExperienceCard({ exp }: { exp: Experience }) {
  return (
    <div className="flex flex-row relative">
      {/* Timeline dot — centered on the spine */}
      <div className="w-4 h-4 absolute left-1/2 transform -translate-x-1/2 top-1 bg-black dark:bg-white rounded-full z-10 ring-4 ring-white dark:ring-black" />

      {/* Role / company / period */}
      <div className="w-5/12 pb-16 px-4 text-right pr-6 md:pr-16">
        <h3 className="text-xl font-bold text-black dark:text-white leading-snug">{exp.role}</h3>
        {exp.stack && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{exp.stack}</div>
        )}
        <div className="text-gray-700 dark:text-gray-300 font-medium">{exp.company}</div>
        <div className="text-sm italic text-gray-500 dark:text-gray-400">{exp.period}</div>
        {exp.location && (
          <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{exp.location}</div>
        )}
      </div>

      {/* Spine spacer */}
      <div className="w-2/12" />

      {/* Bullet points */}
      <div className="w-5/12 pb-16 px-4 text-left pl-6 md:pl-16">
        <ul className="space-y-2">
          {exp.bullets.map((bullet, i) => (
            <li key={i} className="flex gap-2 text-sm text-gray-600 dark:text-white/70 leading-relaxed">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-white/40 flex-shrink-0" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default function ExperienceSection({ experiences }: ExperienceSectionProps) {
  return (
    <section id="experience" className="min-h-screen px-8 md:px-24 py-24 relative">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl font-bold mb-20 text-black dark:text-white">
          Experience 💼
        </h2>

        <div className="max-w-4xl mx-auto relative">
          {/* Continuous vertical spine */}
          <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-px bg-black dark:bg-white" />

          {experiences.map((exp) => (
            <ExperienceCard key={exp.id} exp={exp} />
          ))}
        </div>
      </div>
    </section>
  )
}
