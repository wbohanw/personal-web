import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, ArrowUpRight, ChevronLeft, ChevronRight, Grid2X2, X } from 'lucide-react'
import { FaGithub } from 'react-icons/fa'
import { caseStudies, videoProjects, type CaseStudy, type PortfolioVideo } from './portfolioData'
import './portfolio.css'

const GalleryScene = lazy(() => import('./GalleryScene'))

export type GalleryItem = {
  id: string
  number: string
  title: string
  year: string
  category: string
  description: string
  problem?: string
  approach?: string[]
  result: string
  metrics: { value: string; label: string }[]
  stack: string[]
  visual?: CaseStudy['visual']
  coverImage: string
  video?: PortfolioVideo
  repoUrl?: string
  projectUrl?: string
}

function VideoPlayer({ video, title }: { video: PortfolioVideo; title: string }) {
  if (video.provider === 'youtube') {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${video.id}?rel=0`}
        title={`${title} demo video`}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    )
  }

  if (video.provider === 'vimeo') {
    return (
      <iframe
        src={`https://player.vimeo.com/video/${video.id}?badge=0&autopause=0`}
        title={`${title} demo video`}
        loading="lazy"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
    )
  }

  return <video src={video.src} poster={video.poster} controls preload="metadata" />
}

function ProjectPreview({ item }: { item: GalleryItem }) {
  return (
    <div className="archive-preview">
      <img src={item.coverImage} alt={`${item.title} project interface`} />
      <span>PROJECT STILL / {item.number}</span>
    </div>
  )
}

function ProjectArchive({ item, open, onClose }: { item: GalleryItem; open: boolean; onClose: () => void }) {
  return (
    <section className={`project-archive${open ? ' project-archive--open' : ''}`} aria-hidden={!open}>
      <div className="project-archive__frame">
        <header className="archive-header">
          <div><span>PROJECT ARCHIVE</span><strong>{item.number} / {item.title.toUpperCase()}</strong></div>
          <button onClick={onClose} aria-label="Return to the gallery"><X size={18} /> Return to gallery</button>
        </header>

        <div className="archive-grid">
          <div className="archive-media">
            {item.video ? <VideoPlayer video={item.video} title={item.title} /> : <ProjectPreview item={item} />}
          </div>

          <article className="archive-story">
            <div className="archive-meta"><span>{item.category}</span><span>{item.year}</span></div>
            <h1>{item.title}</h1>
            <p className="archive-lead">{item.description}</p>

            {item.problem && <div className="archive-section"><span>THE CONSTRAINT</span><p>{item.problem}</p></div>}
            {item.approach && (
              <div className="archive-section">
                <span>WHAT I BUILT</span>
                <ol>{item.approach.map(step => <li key={step}>{step}</li>)}</ol>
              </div>
            )}
            <div className="archive-section archive-section--result"><span>OUTCOME</span><p>{item.result}</p></div>
          </article>
        </div>

        <footer className="archive-footer">
          <div className="archive-metrics">
            {item.metrics.map(metric => <div key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></div>)}
          </div>
          <div className="archive-tools">
            <div>{item.stack.map(tool => <span key={tool}>{tool}</span>)}</div>
            <nav>
              {item.repoUrl && <a href={item.repoUrl} target="_blank" rel="noreferrer"><FaGithub /> Repository</a>}
              {item.projectUrl && <a href={item.projectUrl} target="_blank" rel="noreferrer">Project <ArrowUpRight size={14} /></a>}
            </nav>
          </div>
        </footer>
      </div>
    </section>
  )
}

export default function PortfolioPage() {
  const galleryItems = useMemo<GalleryItem[]>(() => {
    const projects: GalleryItem[] = [
      ...caseStudies.map(project => ({
      id: project.slug,
      number: project.number,
      title: project.title,
      year: '2025—26',
      category: project.label.split(' · ').join(' / '),
      description: project.oneLiner,
      problem: project.problem,
      approach: project.approach,
      result: project.result,
      metrics: project.metrics,
      stack: project.stack,
      visual: project.visual,
      coverImage: project.coverImage,
      video: project.video,
      repoUrl: project.repoUrl,
      })),
      ...videoProjects.map((project, index) => ({
      id: project.title.toLowerCase(),
      number: String(caseStudies.length + index + 1).padStart(2, '0'),
      title: project.title,
      year: project.year,
      category: project.label.split(' · ').join(' / '),
      description: project.description,
      result: project.result ?? 'A working prototype built and presented as a complete product experience.',
      metrics: project.metrics ?? [{ value: project.video ? 'VIDEO' : 'BUILD', label: project.video ? 'recorded demo' : 'project archive' }],
      stack: project.stack ?? project.label.split(' · '),
      coverImage: project.coverImage,
      video: project.video,
      repoUrl: project.repoUrl,
      projectUrl: project.projectUrl,
      })),
    ]

    const featuredOrder = [
      'alex',
      'joku',
      'dreamopia',
      'revly',
      'colordorm',
      'menulens',
      'milo ai',
      'market signal lab',
      'agent cost router',
      'ai skills library',
    ]
    const rank = new Map(featuredOrder.map((id, index) => [id, index]))

    return projects
      .sort((left, right) => (rank.get(left.id) ?? 1_000) - (rank.get(right.id) ?? 1_000))
      .map((project, index) => ({ ...project, number: String(index + 1).padStart(2, '0') }))
  }, [])

  const [activeId, setActiveId] = useState(galleryItems[0]?.id ?? '')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [frameTurned, setFrameTurned] = useState(false)
  const [archiveOpen, setArchiveOpen] = useState(false)
  const [indexOpen, setIndexOpen] = useState(false)
  const openTimer = useRef<number | null>(null)
  const closeTimer = useRef<number | null>(null)
  const selectedItem = galleryItems.find(item => item.id === selectedId) ?? null
  const activeIndex = Math.max(0, galleryItems.findIndex(item => item.id === activeId))
  const activeItem = galleryItems[activeIndex]

  useEffect(() => {
    const previousTitle = document.title
    const previousOverflow = document.body.style.overflow
    document.title = 'Gallery — Bohan Wang'
    document.body.style.overflow = 'hidden'
    return () => { document.title = previousTitle; document.body.style.overflow = previousOverflow }
  }, [])

  useEffect(() => () => {
    if (openTimer.current) window.clearTimeout(openTimer.current)
    if (closeTimer.current) window.clearTimeout(closeTimer.current)
  }, [])

  const selectProject = (id: string) => {
    if (openTimer.current) window.clearTimeout(openTimer.current)
    if (closeTimer.current) window.clearTimeout(closeTimer.current)
    setArchiveOpen(false)
    setFrameTurned(false)
    setActiveId(id)
    setIndexOpen(false)
    setSelectedId(id)
  }

  const browseTo = (index: number) => {
    const nextIndex = Math.max(0, Math.min(galleryItems.length - 1, index))
    setActiveId(galleryItems[nextIndex].id)
    setIndexOpen(false)
  }

  const handleCameraFocused = () => {
    if (frameTurned) return
    setFrameTurned(true)
    openTimer.current = window.setTimeout(() => setArchiveOpen(true), 720)
  }

  const closeArchive = () => {
    if (openTimer.current) window.clearTimeout(openTimer.current)
    setArchiveOpen(false)
    closeTimer.current = window.setTimeout(() => { setFrameTurned(false); setSelectedId(null) }, 520)
  }

  return (
    <main className="gallery-page">
      <Suspense fallback={<div className="gallery-loading"><span>Entering archive</span><i /></div>}>
        <GalleryScene
          items={galleryItems}
          activeId={activeId}
          selectedId={selectedId}
          frameTurned={frameTurned}
          onActiveChange={setActiveId}
          onSelect={selectProject}
          onFocused={handleCameraFocused}
        />
      </Suspense>

      <header className="gallery-hud">
        <a href="/" className="gallery-hud__name">Bohan Wang <span>Selected work</span></a>
        <div className="gallery-hud__center"><span>PRODUCTS · SYSTEMS · EXPERIMENTS</span><b>2023—2026</b></div>
        <div className="gallery-hud__actions">
          <button onClick={() => setIndexOpen(true)}><Grid2X2 size={13} /> Index <span>{galleryItems.length}</span></button>
          <a href="/"><ArrowLeft size={13} /> Home</a>
        </div>
      </header>

      {activeItem && (
        <section className="gallery-caption" aria-live="polite">
          <div className="gallery-caption__eyebrow"><span>{activeItem.number}</span><span>{activeItem.category}</span><span>{activeItem.year}</span></div>
          <h1>{activeItem.title}</h1>
          <p>{activeItem.description}</p>
          <button onClick={() => selectProject(activeItem.id)}>View project <ArrowUpRight size={14} /></button>
        </section>
      )}

      <div className="gallery-controls">
        <button onClick={() => browseTo(activeIndex - 1)} disabled={activeIndex === 0} aria-label="Previous project"><ChevronLeft size={18} /></button>
        <div className="gallery-controls__progress">
          <span style={{ width: `${((activeIndex + 1) / galleryItems.length) * 100}%` }} />
        </div>
        <strong>{String(activeIndex + 1).padStart(2, '0')} <i>/</i> {String(galleryItems.length).padStart(2, '0')}</strong>
        <button onClick={() => browseTo(activeIndex + 1)} disabled={activeIndex === galleryItems.length - 1} aria-label="Next project"><ChevronRight size={18} /></button>
      </div>

      <div className="gallery-instruction" aria-hidden="true"><span>Drag</span><i /> <span>Swipe</span><i /> <span>Arrow keys</span></div>

      <section className={`gallery-index${indexOpen ? ' gallery-index--open' : ''}`} aria-hidden={!indexOpen}>
        <header><div><span>PROJECT INDEX</span><strong>{galleryItems.length} selected works</strong></div><button onClick={() => setIndexOpen(false)}><X size={16} /> Close</button></header>
        <div className="gallery-index__grid">
          {galleryItems.map((item, index) => (
            <button key={item.id} className={item.id === activeId ? 'is-active' : ''} onClick={() => browseTo(index)}>
              <span>{item.number}</span>
              <div><strong>{item.title}</strong><small>{item.category} · {item.year}</small></div>
              <ArrowUpRight size={14} />
            </button>
          ))}
        </div>
      </section>

      {selectedItem && <ProjectArchive item={selectedItem} open={archiveOpen} onClose={closeArchive} />}
    </main>
  )
}
