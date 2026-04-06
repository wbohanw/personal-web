import { useState, useEffect } from 'react'
import bagelhack1 from '../assets/milestones/bagelhack-1.png'
import bagelhack2 from '../assets/milestones/bagelhack-2.png'
import databricks1 from '../assets/milestones/databricks-1.png'
import databricks2 from '../assets/milestones/databricks-2.png'
import databricks3 from '../assets/milestones/databricks-3.png'
import databricks4 from '../assets/milestones/databricks-4.png'
import qec1 from '../assets/milestones/qec-1.png'
import qec2 from '../assets/milestones/qec-2.png'
import qec3 from '../assets/milestones/qec-3.png'
import handan1 from '../assets/milestones/handan-1.png'

export type Milestone = {
  src: string
  caption?: string
  year?: string
}

const ITEMS: Milestone[] = [
  { src: databricks4, caption: '1st Place — Databricks Montreal AI Agent Hackathon', year: '2025' },
  { src: databricks1, caption: '1st Place — Databricks Montreal AI Agent Hackathon', year: '2025' },
  { src: databricks2, caption: '1st Place — Databricks Montreal AI Agent Hackathon', year: '2025' },
  { src: databricks3, caption: '1st Place — Databricks Montreal AI Agent Hackathon', year: '2025' },
  { src: qec3,        caption: '1st Place — Quebec Engineering Competition (QEC)',    year: '2025' },
  { src: qec1,        caption: '1st Place — Quebec Engineering Competition (QEC)',    year: '2025' },
  { src: qec2,        caption: '1st Place — Quebec Engineering Competition (QEC)',    year: '2025' },
  { src: handan1,     caption: '3rd Place — 15th Handan Youth Innovation & Entrepreneurship Competition', year: '2025' },
  { src: '',          caption: '3rd Place — Shanxi AI Challenge Cup',                year: '2025' },
  { src: '',          caption: '1st Place — McGill Engineering Competition (MEC)',   year: '2024' },
  { src: '',          caption: 'Best Game Development — McHacks 2024',              year: '2024' },
  { src: bagelhack1,  caption: '2nd Place — Bagel Hack II @ Montreal',              year: '2024' },
  { src: bagelhack2,  caption: '2nd Place — Bagel Hack II @ Montreal',              year: '2024' },
  { src: '',          caption: 'Honorable Award — CareXR Hackathon',                year: '2024' },
  { src: '',          caption: '1st Place — RoboHack McGill',                       year: '2023' },
  { src: '',          caption: '2nd Place — 123LoadBoard Coding Challenge',          year: '2023' },
]


// ─── Single photo cell ────────────────────────────────────────────────────────
function PhotoCell({ item }: { item: Milestone }) {
  const [hovered, setHovered] = useState(false)

  if (!item.src) {
    return (
      <div className="break-inside-avoid mb-3 flex flex-col items-center justify-center gap-2 px-6 py-10 bg-white dark:bg-zinc-900 border border-black/8 dark:border-white/8 rounded-sm min-h-36">
        <span className="text-2xl">😢</span>
        <p className="text-[11px] text-gray-400 dark:text-gray-500 italic">can't find the photo...</p>
        {item.year && (
          <p className="text-[11px] tracking-widest uppercase text-gray-300 dark:text-gray-600 mt-1">{item.year}</p>
        )}
        <p className="text-xs font-medium text-black dark:text-white leading-snug text-center mt-0.5">{item.caption}</p>
      </div>
    )
  }

  return (
    <div
      className="break-inside-avoid mb-3 relative overflow-hidden rounded-sm"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={item.src}
        alt={item.caption ?? ''}
        className="w-full h-auto block transition-transform duration-700"
        style={{ transform: hovered ? 'scale(1.03)' : 'scale(1)' }}
        loading="lazy"
      />

      {(item.caption || item.year) && (
        <div
          className="absolute bottom-0 left-0 right-0 px-4 py-3 flex items-end gap-3 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 100%)',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        >
          {item.year && (
            <span className="text-[11px] text-white/60 tracking-widest uppercase">{item.year}</span>
          )}
          {item.caption && (
            <span className="text-xs text-white/90 tracking-wide">{item.caption}</span>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function MilestoneGallery() {
  const [cols, setCols] = useState(3)
  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) setCols(1)
      else if (window.innerWidth < 1024) setCols(2)
      else setCols(3)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return (
    <section id="milestones" className="py-24">
      <div className="px-8 md:px-24 mb-16">
        <h2 className="text-5xl font-bold text-black dark:text-white">Milestones 🏆</h2>
        <p className="mt-3 text-sm text-gray-400 dark:text-gray-500 tracking-widest uppercase">
          Awards · Hackathons · Memories
        </p>
      </div>

      <div className="px-8 md:px-24">
        <div
          className="mx-auto"
          style={{
            maxWidth: '960px',
            columnCount: cols,
            columnGap: '12px',
          }}
        >
          {ITEMS.map((item, i) => (
            <PhotoCell key={i} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}
