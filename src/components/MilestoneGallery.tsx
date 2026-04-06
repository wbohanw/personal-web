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

type Award = {
  id: string
  title: string
  year: string
  images: string[]
}

const AWARDS: Award[] = [
  {
    id: 'databricks',
    title: '1st Place — Databricks Montreal AI Agent Hackathon',
    year: '2025',
    images: [databricks4, databricks1, databricks2, databricks3],
  },
  {
    id: 'qec',
    title: '1st Place — Quebec Engineering Competition (QEC)',
    year: '2025',
    images: [qec3, qec1, qec2],
  },
  {
    id: 'handan',
    title: '3rd Place — 15th Handan Youth Innovation & Entrepreneurship Competition',
    year: '2025',
    images: [handan1],
  },
  {
    id: 'shanxi',
    title: '3rd Place — Shanxi AI Challenge Cup',
    year: '2025',
    images: [],
  },
  {
    id: 'mec',
    title: '1st Place — McGill Engineering Competition (MEC)',
    year: '2024',
    images: [],
  },
  {
    id: 'mchacks',
    title: 'Best Game Development — McHacks 2024',
    year: '2024',
    images: [],
  },
  {
    id: 'bagelhack',
    title: '2nd Place — Bagel Hack II @ Montreal',
    year: '2024',
    images: [bagelhack1, bagelhack2],
  },
  {
    id: 'carexr',
    title: 'Honorable Award — CareXR Hackathon',
    year: '2024',
    images: [],
  },
  {
    id: 'robohack',
    title: '1st Place — RoboHack McGill',
    year: '2023',
    images: [],
  },
  {
    id: '123loadboard',
    title: '2nd Place — 123LoadBoard Coding Challenge',
    year: '2023',
    images: [],
  },
]

// All images in display order, tagged with their award id
const ALL_IMAGES = AWARDS.flatMap(a => a.images.map(src => ({ src, awardId: a.id })))

export default function MilestoneGallery() {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const visibleImages = hoveredId
    ? ALL_IMAGES.filter(img => img.awardId === hoveredId)
    : ALL_IMAGES

  return (
    <section id="milestones" className="py-24 px-8 md:px-24">
      <div className="mb-16">
        <h2 className="text-5xl font-bold text-black dark:text-white">Milestones 🏆</h2>
        <p className="mt-3 text-sm text-gray-400 dark:text-gray-500 tracking-widest uppercase">
          Awards · Hackathons · Memories
        </p>
      </div>

      <div className="flex gap-12 items-start">

        {/* ── Left: award list ── */}
        <div className="w-full md:w-2/5 flex-shrink-0 flex flex-col gap-1">
          {AWARDS.map(award => (
            <div
              key={award.id}
              onMouseEnter={() => setHoveredId(award.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="group flex items-start gap-3 py-3 px-4 rounded-lg cursor-default transition-colors duration-150 hover:bg-black/4 dark:hover:bg-white/5"
            >
              <span className="mt-0.5 text-[11px] tracking-widest uppercase text-gray-300 dark:text-gray-600 w-8 shrink-0 text-right">
                {award.year}
              </span>
              <p
                className={`text-sm leading-snug transition-colors duration-150 ${
                  hoveredId === null
                    ? 'text-black dark:text-white'
                    : hoveredId === award.id
                      ? 'text-black dark:text-white'
                      : 'text-black/20 dark:text-white/20'
                }`}
              >
                {award.title}
              </p>
              {award.images.length > 0 && (
                <span className="ml-auto shrink-0 text-[10px] text-gray-300 dark:text-gray-600 mt-0.5">
                  {award.images.length} photo{award.images.length > 1 ? 's' : ''}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* ── Right: photo grid ── */}
        <div className="hidden md:block flex-1 min-w-0">
          {visibleImages.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-sm text-gray-300 dark:text-gray-600 italic">
              no photos for this one 📷
            </div>
          ) : (
            <div
              style={{
                columnCount: visibleImages.length === 1 ? 1 : 2,
                columnGap: '10px',
              }}
            >
              {visibleImages.map((img, i) => (
                <div key={i} className="break-inside-avoid mb-2.5 overflow-hidden rounded-sm">
                  <img
                    src={img.src}
                    alt=""
                    className="w-full h-auto block transition-all duration-500"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  )
}
