import { useState } from 'react'
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
  wide?: boolean
}

const ITEMS: Milestone[] = [
  { src: databricks4, caption: '1st Place — Databricks Montreal AI Agent Hackathon', year: '2025', wide: true  },
  { src: databricks1, caption: '1st Place — Databricks Montreal AI Agent Hackathon', year: '2025', wide: false },
  { src: databricks2, caption: '1st Place — Databricks Montreal AI Agent Hackathon', year: '2025', wide: false },
  { src: databricks3, caption: '1st Place — Databricks Montreal AI Agent Hackathon', year: '2025', wide: true  },
  { src: qec3,        caption: '1st Place — Quebec Engineering Competition (QEC)',    year: '2025', wide: true  },
  { src: qec1,        caption: '1st Place — Quebec Engineering Competition (QEC)',    year: '2025', wide: false },
  { src: qec2,        caption: '1st Place — Quebec Engineering Competition (QEC)',    year: '2025', wide: false },
  { src: '',          caption: '3rd Place — Shanxi AI Challenge Cup',                year: '2025', wide: false },
  { src: '',          caption: '1st Place — McGill Engineering Competition (MEC)',   year: '2024', wide: false },
  { src: '',          caption: 'Best Game Development — McHacks 2024',              year: '2024', wide: false },
  { src: bagelhack1,  caption: '2nd Place — Bagel Hack II @ Montreal',              year: '2024', wide: false },
  { src: bagelhack2,  caption: '2nd Place — Bagel Hack II @ Montreal',              year: '2024', wide: false },
  { src: '',          caption: 'Honorable Award — CareXR Hackathon',                year: '2024', wide: false },
  { src: '',          caption: '1st Place — RoboHack McGill',                       year: '2023', wide: false },
  { src: '',          caption: '2nd Place — 123LoadBoard Coding Challenge',          year: '2023', wide: false },
  { src: handan1,     caption: '3rd Place — 15th Handan Youth Innovation & Entrepreneurship Competition', year: '2025', wide: true },
]

// ─── Group items into rows of 1 or 2 ─────────────────────────────────────────
// Rule: if item is wide OR the next item is missing → solo row; otherwise pair up
function buildRows(items: Milestone[]): Milestone[][] {
  const rows: Milestone[][] = []
  let i = 0
  while (i < items.length) {
    const cur = items[i]
    const next = items[i + 1]
    if (cur.wide || !next) {
      rows.push([cur])
      i++
    } else {
      rows.push([cur, next])
      i += 2
    }
  }
  return rows
}

// ─── Single photo cell ────────────────────────────────────────────────────────
function PhotoCell({ item }: { item: Milestone }) {
  const [hovered, setHovered] = useState(false)

  // No photo: render a clean text award card
  if (!item.src) {
    return (
      <div className="flex-1 flex items-center justify-center px-8 py-10 border border-black/8 dark:border-white/8 rounded-sm min-h-40">
        <div className="text-center">
          {item.year && (
            <p className="text-[11px] tracking-widest uppercase text-gray-400 dark:text-gray-500 mb-2">{item.year}</p>
          )}
          <p className="text-sm font-medium text-black dark:text-white leading-snug">{item.caption}</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="relative overflow-hidden flex-1"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={item.src}
        alt={item.caption ?? ''}
        className="w-full h-full object-cover block transition-transform duration-700"
        style={{ transform: hovered ? 'scale(1.03)' : 'scale(1)' }}
        loading="lazy"
      />

      {/* Subtle caption on hover */}
      {(item.caption || item.year) && (
        <div
          className="absolute bottom-0 left-0 right-0 px-4 py-3 flex items-end gap-3 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 100%)',
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
  const rows = buildRows(ITEMS)

  return (
    <section id="milestones" className="py-24">
      <div className="px-8 md:px-24 mb-16">
        <h2 className="text-5xl font-bold text-black dark:text-white">Milestones 🏆</h2>
        <p className="mt-3 text-sm text-gray-400 dark:text-gray-500 tracking-widest uppercase">
          Awards · Hackathons · Memories
        </p>
      </div>

      {/* Photo rows */}
      <div className="flex flex-col gap-3 px-8 md:px-24">
        {rows.map((row, ri) => (
          <div key={ri} className="flex gap-3" style={{ minHeight: row.length === 1 ? '420px' : '320px' }}>
            {row.map((item, ci) => (
              <PhotoCell key={ci} item={item} />
            ))}
          </div>
        ))}
      </div>

    </section>
  )
}
