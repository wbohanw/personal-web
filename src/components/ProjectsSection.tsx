import { Project } from '../types'
import ProjectModal from './ProjectModal'

const GitHubIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
  </svg>
)

type ProjectsSectionProps = {
  projects: Project[]
  selectedProject: Project | null
  onSelectProject: (project: Project) => void
  onCloseProject: () => void
}

export default function ProjectsSection({ projects, selectedProject, onSelectProject, onCloseProject }: ProjectsSectionProps) {
  const featured = projects.filter(p => p.isFeatured)
  const regular = projects.filter(p => !p.isFeatured)

  return (
    <>
      <section id="projects" className="min-h-screen px-8 md:px-24 py-24 relative">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-bold mb-16 text-black dark:text-white">
            Oh, you're here? These are some of my projects, don't miss the repo:)
          </h2>

          {/* Featured Projects */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-12">
            {featured.map(project => (
              <div
                key={project.id}
                className="relative group h-96 rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 cursor-pointer"
                onClick={() => onSelectProject(project)}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/80 to-black/90 p-8 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="space-y-4">
                    <h3 className="text-3xl font-bold text-white py-1 rounded-lg">{project.title}</h3>
                    <p className="text-gray-300 text-md">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, i) => (
                        <span key={i} className="px-3 py-1 text-sm bg-white/10 backdrop-blur-sm text-white rounded-full hover:bg-white/20 transition-colors">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 mt-4">
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center hover:scale-105 gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-colors"
                        onClick={e => e.stopPropagation()}
                      >
                        <GitHubIcon className="w-5 h-5" />
                        View Repository
                      </a>
                      {project.projectLink ? (
                        <a
                          href={project.projectLink}
                          className="flex border-2 rounded-xl px-2 py-1 cursor-pointer hover:scale-105 border-white gap-2 text-gray-300"
                          onClick={e => e.stopPropagation()}
                        >
                          Demo link
                        </a>
                      ) : (
                        <span className="flex border-2 rounded-xl px-2 py-1 cursor-not-allowed border-gray-500 gap-2 text-gray-500">
                          Unavailable
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Regular Projects */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {regular.map(project => (
              <div key={project.id} className="group relative h-80 bg-white dark:bg-gray-900 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                  <p className="text-gray-300 text-sm line-clamp-2 mb-3">{project.description}</p>
                  <div className="flex items-center justify-between">
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-white hover:text-gray-300 transition-colors"
                    >
                      <GitHubIcon className="w-4 h-4" />
                      <span className="text-sm">View Code</span>
                    </a>
                    <div className="flex -space-x-2">
                      {project.collaborators?.map((collab, i) => (
                        <div key={i} className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center text-xs text-white">
                          {collab}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={onCloseProject} />
      )}
    </>
  )
}
