import { Project } from '../types'

type ProjectModalProps = {
  project: Project
  onClose: () => void
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 transition-all duration-300">
      <div className="bg-white dark:bg-black max-w-5xl w-full mx-8 md:mx-auto rounded-none shadow-2xl overflow-hidden">
        <div className="relative h-80 sm:h-96 overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <h2 className="text-4xl sm:text-5xl font-bold mb-2 transform -translate-x-4">{project.title}</h2>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-sm bg-white/20 hover:bg-white/30 transition-colors duration-300"
                  style={{
                    borderRadius: `${Math.random() * 10 + 10}px ${Math.random() * 10 + 10}px ${Math.random() * 10 + 10}px ${Math.random() * 10 + 10}px`
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <button
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-black/40 text-white hover:bg-black/60 transition-colors duration-300"
            onClick={onClose}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {project.description}
          </p>

          <div className="space-y-10">
            {project.content.map((item, i) => (
              <div
                key={i}
                className="opacity-0 animate-fade-in"
                style={{
                  animationDelay: `${i * 150}ms`,
                  animationFillMode: 'forwards',
                  transform: `rotate(${Math.random() * 2 - 1}deg)`
                }}
              >
                {item.type === 'text' && (
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{item.data}</p>
                )}
                {item.type === 'image' && (
                  <div className="overflow-hidden shadow-md transform hover:scale-[1.01] transition-transform duration-300">
                    <img src={item.data} alt="Project visual" className="w-full h-auto" />
                  </div>
                )}
                {item.type === 'video' && (
                  <div className="overflow-hidden shadow-md">
                    <video
                      src={item.data}
                      controls
                      className="w-full h-auto"
                      poster={project.image}
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
