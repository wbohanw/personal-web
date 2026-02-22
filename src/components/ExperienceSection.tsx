import { Experience } from '../types'

type ExperienceSectionProps = {
  experiences: Experience[]
}

export default function ExperienceSection({ experiences }: ExperienceSectionProps) {
  return (
    <section id="experience" className="min-h-screen px-8 md:px-24 py-24 relative">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl font-bold mb-20 text-black dark:text-white">
          Experience 💼
        </h2>

        <div className="max-w-4xl mx-auto relative">
          {experiences.map((exp, index) => (
            <div
              key={exp.id}
              className={`flex mb-20 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} relative`}
            >
              <div className="w-8 h-8 absolute left-1/2 transform -translate-x-1/2 bg-black dark:bg-white rounded-full z-10" />

              <div className={`w-5/12 px-4 ${index % 2 === 0 ? 'text-right pr-4 md:pr-16' : 'text-left pl-4 md:pl-16'}`}>
                <h3 className="text-xl font-bold text-black dark:text-white">{exp.role}</h3>
                <div className="text-gray-700 dark:text-gray-300 font-medium">{exp.company}</div>
                <div className="text-sm italic text-gray-500 dark:text-white">{exp.period}</div>
              </div>

              <div className="w-2/12 flex justify-center">
                <div className="w-1 bg-black dark:bg-white h-full rounded-full" />
              </div>

              <div className={`w-5/12 px-4 ${index % 2 === 0 ? 'text-left pl-4 md:pl-16' : 'text-right pr-4 md:pr-16'}`}>
                <p className="text-gray-600 dark:text-white/70">{exp.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
