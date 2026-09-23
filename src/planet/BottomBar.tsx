import type { ReactNode } from 'react'
import { Pause, Play } from 'lucide-react'
import musicRecord from '../assets/planet/music-record.png'
import './bottom-bar.css'

type Props = {
  children: ReactNode
  playing: boolean
  roaming: boolean
  onToggleMusic: () => void
}

export default function BottomBar({ children, playing, roaming, onToggleMusic }: Props) {
  return <footer className="planet-bottom-bar">
    {!roaming && <div className="bottom-navigation">{children}</div>}
    <button
      className={`music-orbit-button${playing ? ' is-playing' : ''}`}
      onClick={onToggleMusic}
      aria-label={playing ? 'Pause background music' : 'Play background music'}
      title={playing ? 'Pause music' : 'Play music'}
    >
      <span className="music-orbit-ring" aria-hidden="true">
        <img className="music-record-art" src={musicRecord} alt="" draggable={false} />
      </span>
      <span className="music-playback-icon" aria-hidden="true">
        {playing ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
      </span>
    </button>
  </footer>
}
