import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowUpRight, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { awards, experiences, leadership, photos, places, portrait, projects, publications, type PlaceId } from './data'

export type PanelId = PlaceId | 'about' | 'directory'
type Props = { active: PanelId | null; onClose: () => void; onNavigate: (id: PlaceId) => void }
const sections: Record<PanelId, { title: string; description: string }> = {
  projects: { title: 'Projects', description: 'Selected work in software, AI, and things beyond the screen.' },
  experience: { title: 'Experience', description: 'Where I’ve worked and what I’ve built along the way.' },
  awards: { title: 'Milestones', description: 'Competitions, awards, and the teams behind them.' },
  books: { title: 'Bookshelf', description: 'Books, notes, and ideas to return to.' },
  life: { title: 'Life', description: 'People, places, and moments outside of work.' },
  research: { title: 'Research & Leadership', description: 'Publications and contributions to the McGill community.' },
  about: { title: 'About me', description: '' },
  directory: { title: 'Explore', description: '' },
}
function LifeLinks() {
  return <div className="life-content"><a className="life-link" href="https://cafe.bo-han.wang/en" target="_blank" rel="noreferrer"><div><strong>Bohan Café</strong><span>A little detour.</span></div><ArrowUpRight size={17} /></a><a className="life-link" href="https://www.instagram.com/wohan_bang" target="_blank" rel="noreferrer"><div><strong>Instagram</strong><span>More everyday moments.</span></div><ArrowUpRight size={17} /></a></div>
}
function Content({ active, onNavigate }: { active: PanelId; onNavigate: Props['onNavigate'] }) {
  const [query, setQuery] = useState('')
  const [projectIndex, setProjectIndex] = useState<number | null>(null)
  const [photoIndex, setPhotoIndex] = useState<number | null>(null)
  useEffect(() => { document.querySelector('.panel-body')?.scrollTo(0, 0) }, [projectIndex, photoIndex])
  const currentProject = projectIndex === null ? null : projects[projectIndex]
  const currentPhoto = photoIndex === null ? null : photos[photoIndex]
  if (active === 'directory') return <div className="directory-list">{places.map(p => <button key={p.id} onClick={() => onNavigate(p.id)}><div><h3>{sections[p.id].title}</h3><p>{sections[p.id].description}</p></div><ArrowUpRight size={20} /></button>)}</div>
  if (active === 'about') return <div className="about-content">
    <img className="portrait" src={portrait} alt="Bohan Wang" />
    <h3>Hi, I’m Bohan.</h3>
    <p>I’m a developer with a background in computer engineering at McGill. I like turning curious ideas into things people can actually use — from AI agents and web apps to robots and augmented reality.</p>
    <p>This little planet is a home for what I’m building, the people and experiences I learn from, and the moments along the way.</p>
    <div className="external-links"><a href="https://github.com/wbohanw" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={14} /></a><a href="https://www.linkedin.com/in/wbohanw/" target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={14} /></a><a href="https://www.instagram.com/wohan_bang" target="_blank" rel="noreferrer">Instagram <ArrowUpRight size={14} /></a></div>
  </div>
  if (active === 'projects') {
    if (currentProject) {
      const video = currentProject.video
      const videoUrl = video?.provider === 'youtube' ? `https://www.youtube.com/watch?v=${video.id}` : video?.provider === 'vimeo' ? `https://vimeo.com/${video.id}` : video?.src
      return <article className="project-detail">
        <button className="text-button" onClick={() => setProjectIndex(null)}><ArrowLeft size={16} /> All projects</button>
        <span className="eyebrow">{currentProject.category}</span><h3>{currentProject.title}</h3><p className="project-lead">{currentProject.description}</p>
        <img src={currentProject.cover} alt={`${currentProject.title} project`} />
        {currentProject.problem && <section><h4>The challenge</h4><p>{currentProject.problem}</p></section>}
        {currentProject.approach.length > 0 && <section><h4>What I built</h4><ul>{currentProject.approach.map(step => <li key={step}>{step}</li>)}</ul></section>}
        {currentProject.result && <section><h4>The outcome</h4><p>{currentProject.result}</p></section>}
        {currentProject.metrics.length > 0 && <div className="project-metrics">{currentProject.metrics.map(m => <div key={m.label}><strong>{m.value}</strong><span>{m.label}</span></div>)}</div>}
        <div className="tech-tags">{currentProject.stack.map(s => <span key={s}>{s}</span>)}</div>
        <div className="external-links">{currentProject.repo && <a href={currentProject.repo} target="_blank" rel="noreferrer">Source code <ArrowUpRight size={14} /></a>}{currentProject.url && <a href={currentProject.url} target="_blank" rel="noreferrer">View project <ArrowUpRight size={14} /></a>}{videoUrl && <a href={videoUrl} target="_blank" rel="noreferrer">Watch demo <ArrowUpRight size={14} /></a>}</div>
      </article>
    }
    const filtered = projects.map((p, index) => ({ ...p, index })).filter(p => `${p.title} ${p.category} ${p.description}`.toLowerCase().includes(query.toLowerCase()))
    return <>
      <label className="project-search"><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search projects…" aria-label="Search projects" /><span>{filtered.length} {filtered.length === 1 ? 'project' : 'projects'}</span></label>
      <div className="project-grid">{filtered.map(p => <button className="project-card" key={p.title} onClick={() => setProjectIndex(p.index)}><div className="project-cover"><img loading="lazy" src={p.cover} alt={`${p.title} preview`} /></div><div className="project-copy"><span className="eyebrow">{p.category}</span><h3>{p.title}</h3><p>{p.description}</p></div><ArrowUpRight className="project-open" size={18} aria-hidden="true" /></button>)}</div>
      {filtered.length === 0 && <p className="empty-search">No projects found. Try “AI”, “robot”, or another idea.</p>}
    </>
  }
  if (active === 'experience') return <div className="experience-list">{experiences.map(e => <article key={e.id}><div className="experience-meta"><span>{e.period}</span><span>{e.location}</span></div><h3>{e.company}</h3><p className="role">{e.role}</p><ul>{e.bullets.map(b => <li key={b}>{b}</li>)}</ul><div className="tech-tags">{e.stack.split(', ').map(t => <span key={t}>{t}</span>)}</div></article>)}</div>
  if (active === 'research') return <div className="research-content">
    <section aria-labelledby="publications-title">
      <h3 id="publications-title" className="research-section-title">Publications</h3>
      <div className="publication-list">{publications.map(publication => <article key={publication.title}>
        <div><p className="publication-venue">{publication.venue}</p><h4>{publication.title}</h4></div>
      </article>)}</div>
    </section>
    <section aria-labelledby="leadership-title">
      <h3 id="leadership-title" className="research-section-title">Leadership & Community</h3>
      <div className="experience-list leadership-list">{leadership.map(entry => <article key={entry.organization}>
        <div className="experience-meta"><span>{entry.period}</span>{entry.location && <span>{entry.location}</span>}</div>
        <h4>{entry.organization}</h4><p className="role">{entry.role}</p><p className="leadership-description">{entry.description}</p>
      </article>)}</div>
    </section>
  </div>
  if (active === 'awards') return <div className="award-list">{awards.map(a => <article key={a.title}><div className="award-copy"><div className="award-top"><span>{a.year}</span><span className="award-result">{a.result}</span></div><h3>{a.title}</h3><p>{a.location}</p></div>{a.photos[0] && <img loading="lazy" src={a.photos[0]} alt={`${a.title} memory`} />}</article>)}</div>
  if (active === 'life') {
    if (currentPhoto && photoIndex !== null) return <div className="photo-viewer"><button className="text-button" onClick={() => setPhotoIndex(null)}><ArrowLeft size={16} /> Back to all moments</button><img src={currentPhoto.src} alt={currentPhoto.caption} /><p>{currentPhoto.caption}</p><div className="photo-controls"><button aria-label="Previous photo" onClick={() => setPhotoIndex((photoIndex + photos.length - 1) % photos.length)}><ChevronLeft size={20} /></button><span>{photoIndex + 1} / {photos.length}</span><button aria-label="Next photo" onClick={() => setPhotoIndex((photoIndex + 1) % photos.length)}><ChevronRight size={20} /></button></div></div>
    return <><div className="photo-grid">{photos.map((p, index) => <button key={p.id} onClick={() => setPhotoIndex(index)}><img src={p.src} loading="lazy" alt={p.caption} /><span>{p.caption}</span></button>)}</div><LifeLinks /></>
  }
  if (active === 'books') return <div className="quiet-content"><h3>A reading list in progress.</h3><p>I’ll be adding books and notes here.</p></div>
  return null
}
export default function ContentPanel({ active, onClose, onNavigate }: Props) {
  const dialog = useRef<HTMLDialogElement>(null)
  const scroll = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)
  useEffect(() => { if (active) { if (!dialog.current?.open) dialog.current?.showModal(); scroll.current?.scrollTo(0, 0) } else dialog.current?.close() }, [active])
  useEffect(() => {
    if (!active) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previous }
  }, [active])
  const section = active ? sections[active] : null
  return <dialog ref={dialog} className={`planet-dialog${active === 'directory' ? ' is-directory' : ''}`} onCancel={onClose} onClick={e => { if (e.target === e.currentTarget) onClose() }} aria-labelledby="panel-title">
    <div className="panel-shell"><header className="panel-header"><div><span className="panel-byline">Bohan Wang</span><h2 id="panel-title">{section?.title}</h2>{section?.description && <p>{section.description}</p>}</div><button className="close-button" onClick={onClose} aria-label="Return to the planet">Close <X size={17} /></button></header>
      <div ref={scroll} className="panel-body">{active && <Content key={active} active={active} onNavigate={onNavigate} />}</div>
      <footer className="panel-footer"><span>Bohan Wang</span><button className="text-button" onClick={async () => { try { await navigator.clipboard.writeText(window.location.href); setCopied(true); window.setTimeout(() => setCopied(false), 2000) } catch { setCopied(false) } }}>{copied ? 'Link copied' : 'Copy link'}</button></footer>
    </div>
  </dialog>
}
