import { Component, lazy, Suspense, useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { ArrowDown, ArrowUpRight, BookOpen, Check, Coffee, Compass, House, Microscope, Tent, Wrench } from 'lucide-react'
import ContentPanel, { type PanelId } from './ContentPanel'
import EntryExperience from './EntryExperience'
import { places, type PlaceId } from './data'
import type { ViewCommand } from './PlanetScene'
import type { WalkInput, WorldMode } from './WorldWalk'
import blueAudio from '../assets/blue.mp3'
import BottomBar from './BottomBar'
import cvPdf from '../bohancv.pdf'
import './planet.css'
import './content.css'

const PlanetScene = lazy(() => import('./PlanetScene'))
const icons = { projects: Wrench, experience: Compass, awards: Tent, books: BookOpen, life: Coffee, research: Microscope }
const validPanel = (value: string): PanelId | null => ['about', 'directory', ...places.map(p => p.id)].includes(value) ? value as PanelId : null
const getPanel = () => {
  const hash = window.location.hash.slice(1)
  return validPanel(hash === 'photos' ? 'life' : hash)
}
function readVisited(): PlaceId[] { try { const saved = JSON.parse(localStorage.getItem('bohan-planet-visited') || '[]'); return Array.isArray(saved) ? saved.filter((id: PlaceId) => places.some(p => p.id === id)) : [] } catch { return [] } }
class SceneBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch() { this.props.onError() }
  render() { return this.state.failed ? null : this.props.children }
}
export default function PlanetPage() {
  const [active, setActive] = useState<PanelId | null>(getPanel)
  const [visited, setVisited] = useState<PlaceId[]>(readVisited)
  const [command, setCommand] = useState<ViewCommand>({ place: null, serial: 0 })
  const [preview, setPreview] = useState<PlaceId | null>(null)
  const [night, setNight] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [hasEntered, setHasEntered] = useState(false)
  const [audioMessage, setAudioMessage] = useState('')
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [visible, setVisible] = useState(!document.hidden)
  const [worldMode, setWorldMode] = useState<WorldMode>('overview')
  const [nearby, setNearby] = useState<PlaceId | null>(null)
  const walkInput = useRef<WalkInput>({ keys: new Set(), pulse: new Map() })
  const stage = useRef<HTMLElement>(null)
  const worldEntry = useRef<HTMLButtonElement>(null)
  const previousWorldMode = useRef<WorldMode>('overview')
  const roaming = worldMode !== 'overview'
  const nearbyPlace = places.find(place => place.id === nearby)
  const labels = useRef<HTMLDivElement>(null)
  const audio = useRef<HTMLAudioElement>(null)
  const onReady = useCallback(() => setReady(true), [])
  const onError = useCallback(() => { setFailed(true); setWorldMode('overview') }, [])
  const changeWorldMode = useCallback((mode: WorldMode) => {
    setWorldMode(mode)
    if (mode === 'overview') { setNearby(null) }
  }, [])
  useEffect(() => {
    if (worldMode === 'overview' && previousWorldMode.current !== 'overview') worldEntry.current?.focus()
    previousWorldMode.current = worldMode
  }, [worldMode])
  const visit = useCallback((id: PanelId | null) => {
    setActive(id)
    if (places.some(p => p.id === id)) {
      setCommand(c => ({ place: id as PlaceId, serial: c.serial + 1 }))
      setVisited(current => {
        if (current.includes(id as PlaceId)) return current
        const next = [...current, id as PlaceId]; try { localStorage.setItem('bohan-planet-visited', JSON.stringify(next)) } catch { /* Exploration works without storage. */ }
        return next
      })
    }
  }, [])
  const previewPlace = useCallback((id: PlaceId) => {
    setPreview(id)
    setCommand(c => ({ place: id, serial: c.serial + 1 }))
  }, [])
  const openPanel = useCallback((id: PanelId) => { history.pushState(null, '', `#${id}`); visit(id) }, [visit])
  const closePanel = useCallback(() => { history.replaceState(null, '', window.location.pathname + window.location.search); visit(null) }, [visit])
  useEffect(() => {
    const handler = () => visit(getPanel())
    window.addEventListener('hashchange', handler); window.addEventListener('popstate', handler)
    handler()
    return () => { window.removeEventListener('hashchange', handler); window.removeEventListener('popstate', handler) }
  }, [visit])
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = () => setReducedMotion(mq.matches)
    const visibility = () => setVisible(!document.hidden)
    mq.addEventListener('change', handler); document.addEventListener('visibilitychange', visibility)
    return () => { mq.removeEventListener('change', handler); document.removeEventListener('visibilitychange', visibility) }
  }, [])
  useEffect(() => {
    const theme = window.matchMedia('(prefers-color-scheme: dark)')
    const syncTheme = () => setNight(theme.matches)
    syncTheme()
    theme.addEventListener('change', syncTheme)
    return () => theme.removeEventListener('change', syncTheme)
  }, [])
  useEffect(() => { if (audio.current) audio.current.volume = .3 }, [])
  useEffect(() => {
    if (!roaming) return
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !active) { changeWorldMode('overview') }
    }
    window.addEventListener('keydown', escape)
    return () => { document.body.style.overflow = overflow; window.removeEventListener('keydown', escape) }
  }, [roaming, active, changeWorldMode])
  const playMusic = async () => {
    if (!audio.current) return
    try { await audio.current.play(); setAudioMessage('') } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) setAudioMessage('Music couldn’t start. Tap to try again.')
    }
  }
  const toggleMusic = () => {
    if (!audio.current?.paused) audio.current?.pause()
    else void playMusic()
  }
  const enterPlanet = (withMusic: boolean) => {
    // Start inside the visitor’s click so browsers allow audio playback.
    if (withMusic) void playMusic()
    else audio.current?.pause()
    setHasEntered(true)
  }
  return <main className={`planet-page${night ? ' is-night' : ''}${roaming ? ' is-roaming' : ''}`} data-world-mode={worldMode}>
    <audio ref={audio} src={blueAudio} loop preload="none" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => { setPlaying(false); setAudioMessage('Music is unavailable right now.') }} />
    <div className="sky-grain" aria-hidden="true" />
    <button ref={worldEntry} className="world-entry-button" disabled={!ready || failed} onClick={() => {
      if (worldMode === 'overview') { setPreview(null); setWorldMode('loading') }
      else { changeWorldMode('overview') }
    }}>{worldMode === 'overview' ? 'Enter the World' : 'Exit'}{!roaming && <ArrowUpRight size={15} aria-hidden="true" />}</button>
    <section className="developer-intro" aria-labelledby="developer-title">
      <h1 id="developer-title"><button onClick={() => openPanel('about')}>Bohan<br /><em>Wang</em></button></h1>
      <p className="developer-role">Full Stack<br />AI Product Engineer</p>
      <p className="developer-description">Building innovative web applications and exploring new AI technologies.</p>
      <div className="developer-actions">
        <a className="developer-action is-primary" href={cvPdf} download="Bohan-Wang-CV.pdf">Download CV</a>
        <a className="developer-action" href="mailto:bohanwang@mail.mcgill.ca">Contact Me</a>
        <a className="developer-action" href="https://github.com/wbohanw" target="_blank" rel="noreferrer">GitHub Repo</a>
        <a className="developer-action is-primary" href="https://www.linkedin.com/in/bohan-wang-1a71b024a/" target="_blank" rel="noreferrer">Let’s Connect</a>
      </div>
      <p className="developer-quote">Only <span>10</span> types of people<br />in this world.</p>
    </section>
    <section ref={stage} aria-busy={worldMode === 'loading'} className={`planet-stage${ready ? ' is-ready' : ''}${failed ? ' has-failed' : ''}`} aria-label={roaming ? 'First-person planet walk' : 'Interactive blue planet. Drag to rotate, or choose a destination using the map or navigation below.'}>
      <div className="planet-halo" aria-hidden="true" />
      <div className="orbit-line orbit-one" aria-hidden="true" /><div className="orbit-line orbit-two" aria-hidden="true" />
      <span className="sky-spark spark-one" aria-hidden="true">✧</span><span className="sky-spark spark-two" aria-hidden="true">+</span><span className="sky-spark spark-three" aria-hidden="true">✧</span>
      {!failed && <SceneBoundary onError={onError}><Suspense fallback={null}><PlanetScene labels={labels} command={command} night={night} reducedMotion={reducedMotion} paused={!hasEntered || !!active || !visible} mode={worldMode} walkInput={walkInput} onModeChange={changeWorldMode} onNearby={setNearby} onReady={onReady} onError={onError} onSelect={openPanel} /></Suspense></SceneBoundary>}
      {!ready && !failed && <div className="planet-loading" role="status"><span className="loading-orbit"><span /></span><p>A little world is taking shape…</p></div>}
      {failed && <div className="scene-fallback" role="status">Unavailable</div>}
      <div className="place-labels" ref={labels} aria-label="Planet destinations" style={{ display: ready && !failed ? 'block' : 'none' }}>{places.map(p => { const Icon = icons[p.id]; return <button key={p.id} className={`place-label label-${p.id}${visited.includes(p.id) ? ' was-visited' : ''}${preview === p.id ? ' is-previewed' : ''}`} onClick={() => openPanel(p.id)} aria-label={`Visit ${p.title}: ${p.short}`}><Icon size={14} strokeWidth={1.6} /><span>{p.title.replace('The ', '')}</span><span className="place-label-dot">{visited.includes(p.id) ? <Check size={9} /> : <ArrowUpRight size={10} />}</span></button> })}</div>
    </section>
    <BottomBar playing={playing} roaming={roaming} onToggleMusic={toggleMusic}>
      <nav className="destination-dock" aria-label="Explore the planet">{places.map(p => { const Icon = icons[p.id]; return <button key={p.id} onPointerEnter={event => { if (event.pointerType !== 'touch') previewPlace(p.id) }} onPointerLeave={() => setPreview(null)} onFocus={event => { if (event.currentTarget.matches(':focus-visible')) previewPlace(p.id) }} onBlur={() => setPreview(null)} onClick={() => openPanel(p.id)} aria-label={`Explore ${p.short}`} className={`${visited.includes(p.id) ? 'is-visited' : ''}${preview === p.id ? ' is-previewing' : ''}`}><span className="dock-icon"><Icon size={21} strokeWidth={1.5} />{visited.includes(p.id) && <i />}</span><span>{p.short}</span></button> })}</nav>
    </BottomBar>
    {worldMode === 'loading' && <div className="world-entry-loading" role="status">Loading…</div>}
    {roaming && <div className="walk-overlay">
      {worldMode === 'walking' && <>
        {nearbyPlace && <button className="walk-nearby" onClick={() => openPanel(nearbyPlace.id)}><span>NEARBY · {nearbyPlace.short.toUpperCase()}</span><strong>{nearbyPlace.title}</strong><small>Explore this place <span className="walk-desktop-hint">· E</span><ArrowUpRight size={14} /></small></button>}
        <div className="walk-pad" aria-label="Walking controls">{[{ key: 'KeyW', label: 'Walk forward', symbol: '↑' }, { key: 'KeyA', label: 'Walk left', symbol: '←' }, { key: 'KeyS', label: 'Walk backward', symbol: '↓' }, { key: 'KeyD', label: 'Walk right', symbol: '→' }].map(control => <button key={control.key} aria-label={control.label} onPointerDown={event => { event.preventDefault(); event.currentTarget.setPointerCapture(event.pointerId); walkInput.current.keys.add(control.key); walkInput.current.pulse.set(control.key, performance.now() + 160); stage.current?.querySelector('canvas')?.focus() }} onPointerUp={() => walkInput.current.keys.delete(control.key)} onPointerCancel={() => walkInput.current.keys.delete(control.key)} onLostPointerCapture={() => walkInput.current.keys.delete(control.key)} onClick={() => { walkInput.current.pulse.set(control.key, performance.now() + 160); stage.current?.querySelector('canvas')?.focus() }}>{control.symbol}</button>)}</div>
      </>}
    </div>}
    {audioMessage && <div className="audio-message" role="status">{audioMessage}</div>}
    <button className="mobile-explore" onClick={() => openPanel('directory')}><House size={15} /> Find your next little adventure <ArrowDown size={14} /></button>
    {hasEntered ? <ContentPanel active={active} onClose={closePanel} onNavigate={openPanel} /> : <EntryExperience onEnter={enterPlanet} />}
  </main>
}
