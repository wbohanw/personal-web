import { useState } from 'react'
import { Project } from '../types'
import ProjectModal from './ProjectModal'

const GitHubIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
  </svg>
)

const ExternalIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
)

const YouTubeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
)

function getYouTubeId(url?: string | null): string | null {
  if (!url) return null
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  return match?.[1] ?? null
}

function getVimeoId(url?: string | null): string | null {
  if (!url) return null
  const match = url.match(/vimeo\.com\/(?:manage\/videos\/|video\/|)(\d+)/)
  return match?.[1] ?? null
}

function ProjectPreview({ project }: { project: Project }) {
  const youtubeId = getYouTubeId(project.youtubeLink) ?? getYouTubeId(project.projectLink)
  const vimeoId   = getVimeoId(project.youtubeLink)   ?? getVimeoId(project.projectLink)
  const isDevpost = project.projectLink?.includes('devpost.com')

  // YouTube is always landscape 16:9; Vimeo can be any ratio — let it size naturally
  let embedEl: React.ReactNode = null
  if (youtubeId) {
    embedEl = (
      <div style={{ aspectRatio: '16/9' }} className="w-full rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-800">
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}`}
          title={project.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full border-0"
        />
      </div>
    )
  } else if (vimeoId) {
    embedEl = (
      <div className="w-full rounded-2xl overflow-hidden flex-shrink-0 bg-black flex justify-center">
        <iframe
          src={`https://player.vimeo.com/video/${vimeoId}?badge=0&autopause=0&player_id=0&app_id=58479`}
          title={project.title}
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
          allowFullScreen
          className="border-0 w-full"
          style={{ aspectRatio: '9/16', maxHeight: '480px' }}
        />
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Media: video embed or image fallback */}
      {embedEl ?? (
        <div className="relative w-full rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-800" style={{ aspectRatio: '16/9' }}>
          {project.image ? (
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No preview</div>
          )}
          {project.isFeatured && (
            <span className="absolute top-3 left-3 px-2 py-0.5 text-xs font-semibold bg-black/70 text-white rounded-full backdrop-blur-sm">
              Featured
            </span>
          )}
        </div>
      )}

      {/* Details */}
      <div className="mt-5 flex flex-col gap-3 flex-1">
        <div>
          <div className="flex items-baseline gap-3">
            <h3 className="text-2xl font-bold text-black dark:text-white leading-tight">{project.title}</h3>
            {project.date && (
              <span className="text-xs text-gray-400 dark:text-gray-500 tabular-nums flex-shrink-0">
                {formatDate(project.date)}
              </span>
            )}
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-white/70 leading-relaxed">{project.description}</p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag, i) => (
            <span
              key={i}
              className="px-2.5 py-0.5 text-xs font-medium bg-black/8 dark:bg-white/10 text-black dark:text-white rounded-full border border-black/10 dark:border-white/10"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-2 mt-auto pt-2">
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-black dark:bg-white text-white dark:text-black rounded-lg hover:opacity-80 transition-opacity"
            onClick={e => e.stopPropagation()}
          >
            <GitHubIcon className="w-4 h-4" />
            Repository
          </a>
          {project.youtubeLink && (() => {
            const isVimeo = !!getVimeoId(project.youtubeLink)
            return (
              <a
                href={project.youtubeLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isVimeo
                    ? 'border border-sky-500/40 text-sky-500 hover:bg-sky-500/5'
                    : 'border border-red-500/40 text-red-500 hover:bg-red-500/5'
                }`}
                onClick={e => e.stopPropagation()}
              >
                {isVimeo ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.977 6.416c-.105 2.338-1.739 5.543-4.894 9.609-3.268 4.247-6.026 6.37-8.29 6.37-1.409 0-2.578-1.294-3.553-3.881L5.322 11.4C4.603 8.816 3.834 7.522 3.01 7.522c-.179 0-.806.378-1.881 1.132L0 7.197c1.185-1.044 2.351-2.084 3.501-3.128C5.08 2.701 6.266 1.984 7.055 1.91c1.867-.18 3.016 1.1 3.447 3.838.465 2.953.787 4.789.968 5.507.537 2.scrutiny.116 3.963-.954 4.213-.248-.254-.55-.816-.657-1.498 1.013-1.04 1.503-2.094 1.472-3.169-.057-1.983-1.101-2.743-2.968-2.25l-.706.178c.478 2.119.7 4.08.661 5.892-.037 1.805-.572 2.86-1.49 2.86-.847 0-1.545-.94-2.089-2.82L4.976 9.9c-.6-2.173-.983-3.253-1.146-3.255-.038 0-.476.299-1.31.896z"/>
                  </svg>
                ) : (
                  <YouTubeIcon className="w-4 h-4" />
                )}
                {isVimeo ? 'Vimeo' : 'YouTube'}
              </a>
            )
          })()}
          {project.projectLink ? (
            <a
              href={project.projectLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium border border-black/20 dark:border-white/20 text-black dark:text-white rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              onClick={e => e.stopPropagation()}
            >
              <ExternalIcon className="w-4 h-4" />
              {isDevpost ? 'Devpost' : 'Live Demo'}
            </a>
          ) : !project.youtubeLink && (
            <span className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium border border-black/10 dark:border-white/10 text-gray-400 dark:text-gray-600 rounded-lg cursor-not-allowed">
              No Demo
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

// Mobile: accordion row
function MobileProjectRow({ project }: { project: Project }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-black/10 dark:border-white/10 last:border-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-4 text-left group"
      >
        <div className="flex items-center gap-3 min-w-0">
          {project.isFeatured && (
            <span className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white flex-shrink-0" />
          )}
          <span className="font-semibold text-black dark:text-white group-hover:opacity-70 transition-opacity truncate">
            {project.title}
          </span>
          {project.date && (
            <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">{formatDate(project.date)}</span>
          )}
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="pb-6">
          <ProjectPreview project={project} />
        </div>
      )}
    </div>
  )
}

type ProjectsSectionProps = {
  projects: Project[]
  selectedProject: Project | null
  onSelectProject: (project: Project) => void
  onCloseProject: () => void
}

function formatDate(date?: string) {
  if (!date) return null
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
}

export default function ProjectsSection({ projects, selectedProject, onSelectProject, onCloseProject }: ProjectsSectionProps) {
  // Sort newest first
  const sorted = [...projects].sort((a, b) => {
    if (!a.date && !b.date) return 0
    if (!a.date) return 1
    if (!b.date) return -1
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  const [hovered, setHovered] = useState<Project>(sorted[0])
  const activePreview = hovered ?? sorted[0]

  return (
    <>
      <section id="projects" className="min-h-screen px-8 md:px-24 py-24 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12 ">
            <h2 className="text-5xl font-bold text-black dark:text-white md:max-w-lg">
              Oh, you're here? These are some of my projects, don't miss the repo:)
            </h2>
            <a href="https://gitroll.io/profile/uuYKZ3aKRzuRzMVCsQOIaHg481M93" target="_blank" rel="noopener noreferrer" className="pl-4 md:w-1/2 flex-shrink-0">
              <img
                src="https://gitroll.io/api/badges/profiles/v1/uuYKZ3aKRzuRzMVCsQOIaHg481M93?theme=dracula"
                alt="GitRoll Profile Badge"
                className="w-full"
              />
            </a>
          </div>

          {/* ── Desktop: two-column layout ── */}
          <div className="hidden md:flex gap-8 items-start">
            {/* Left: project list */}
            <div className="w-1/2 bg-white/5 rounded-lg flex flex-col divide-y divide-black/10 dark:divide-white/10 border-y border-black/10 dark:border-white/10">
              {sorted.map(project => (
                <button
                  key={project.id}
                  onMouseEnter={() => setHovered(project)}
                  onClick={() => onSelectProject(project)}
                  className={`w-full flex items-center justify-between py-4 px-2 text-left group transition-colors rounded-lg
                    ${activePreview?.id === project.id
                      ? 'bg-black/5 dark:bg-white/5'
                      : 'hover:bg-black/3 dark:hover:bg-white/3'
                    }`}
                >
                  <div className="flex items-center gap-3 pl-4 min-w-0">
                    {project.isFeatured && (
                      <span className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white flex-shrink-0" />
                    )}
                    <span className={`font-semibold transition-opacity truncate ${activePreview?.id === project.id ? 'text-black dark:text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white'}`}>
                      {project.title}
                    </span>
                    <div className="flex gap-1 ml-1 flex-shrink-0">
                      {project.tags.slice(0, 2).map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 text-xs bg-black/6 dark:bg-white/10 text-gray-500 dark:text-gray-400 rounded-full">
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 2 && (
                        <span className="px-2 py-0.5 text-xs text-gray-400 dark:text-gray-500">+{project.tags.length - 2}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 pl-2">
                    {project.date && (
                      <span className="text-xs text-gray-400 dark:text-gray-500 tabular-nums">
                        {formatDate(project.date)}
                      </span>
                    )}
                    <svg
                      className={`w-4 h-4 flex-shrink-0 transition-opacity ${activePreview?.id === project.id ? 'opacity-100 text-black dark:text-white' : 'opacity-0 group-hover:opacity-40'}`}
                      fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>

            {/* Right: sticky preview */}
            <div className="w-1/2 sticky top-24 self-start">
              <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-black/40 backdrop-blur-sm p-6 min-h-96 transition-all duration-200">
                {activePreview && <ProjectPreview project={activePreview} />}
              </div>
            </div>
          </div>

          {/* ── Mobile: accordion list ── */}
          <div className="md:hidden border-t border-black/10 dark:border-white/10">
            {sorted.map(project => (
              <MobileProjectRow key={project.id} project={project} />
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
