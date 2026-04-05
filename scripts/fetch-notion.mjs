/**
 * fetch-notion.mjs
 * Pulls all projects from the Notion "Personal-Project" database
 * and writes them into src/data/content.json (preserving experiences).
 *
 * Run: node scripts/fetch-notion.mjs
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import fetch from 'node-fetch'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

// Load .env
const envPath = path.join(ROOT, '.env')
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const [k, ...v] = line.split('=')
    if (k?.trim() && v.length) process.env[k.trim()] = v.join('=').trim()
  }
}

const TOKEN = process.env.NOTION_API_KEY
const DB_ID = '339ae245-2309-8058-89e0-caf635e22824'

if (!TOKEN) { console.error('Missing NOTION_API_KEY in .env'); process.exit(1) }

const HEADERS = {
  Authorization: `Bearer ${TOKEN}`,
  'Notion-Version': '2022-06-28',
  'Content-Type': 'application/json',
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getText(prop) {
  return prop?.rich_text?.map(t => t.plain_text).join('') ?? ''
}

function getTitle(prop) {
  return prop?.title?.map(t => t.plain_text).join('') ?? ''
}

function getTags(prop) {
  return prop?.multi_select?.map(s => s.name) ?? []
}

function getUrl(prop) {
  return prop?.url ?? null
}

function getCheckbox(prop) {
  return prop?.checkbox ?? false
}

function getDate(prop) {
  return prop?.date?.start ?? null
}

function getCoverUrl(page) {
  const cover = page.cover
  if (!cover) return null
  if (cover.type === 'external') return cover.external.url
  if (cover.type === 'file') return cover.file.url
  return null
}

async function queryAllPages() {
  const pages = []
  let cursor = undefined
  do {
    const body = cursor ? { start_cursor: cursor } : {}
    const res = await fetch(`https://api.notion.com/v1/databases/${DB_ID}/query`, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify(body),
    })
    const data = await res.json()
    if (data.object === 'error') {
      console.error('Notion API error:', data.message)
      process.exit(1)
    }
    pages.push(...(data.results ?? []))
    cursor = data.has_more ? data.next_cursor : undefined
  } while (cursor)
  return pages
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('Fetching projects from Notion...')
  const pages = await queryAllPages()
  console.log(`  Found ${pages.length} pages`)

  const contentPath = path.join(ROOT, 'src/data/content.json')
  const existing = JSON.parse(fs.readFileSync(contentPath, 'utf8'))

  // Build a map of existing local imagePaths keyed by title for fallback
  const existingByTitle = {}
  for (const p of existing.projects ?? []) {
    if (p.title && p.imagePath && !p.imagePath.startsWith('http')) {
      existingByTitle[p.title] = p.imagePath
    }
  }

  const projects = pages.map((page, i) => {
    const p = page.properties
    const coverUrl = getCoverUrl(page)
    const title = getTitle(p.Name)

    // Prefer the Notion cover URL (live image); fall back to local path if available
    const imagePath = coverUrl ?? existingByTitle[title] ?? ''

    return {
      id: i + 1,
      title,
      description: getText(p.Description),
      tags: getTags(p.Tags),
      imagePath,
      date: getDate(p.Date),
      repoUrl: getUrl(p.RepoUrl) ?? '',
      projectLink: getUrl(p.ProjectLink),
      youtubeLink: getUrl(p.YoutubeLink),
      isFeatured: getCheckbox(p.IsFeatured),
      content: [{ type: 'text', data: getText(p.Description) }],
    }
  })

  // Sort: newest first, undated fall to the bottom
  projects.sort((a, b) => {
    if (!a.date && !b.date) return 0
    if (!a.date) return 1
    if (!b.date) return -1
    return new Date(b.date) - new Date(a.date)
  })

  const updated = {
    projects,
    experiences: existing.experiences, // preserve experiences untouched
  }

  fs.writeFileSync(contentPath, JSON.stringify(updated, null, 2))
  console.log(`\n✓ Written ${projects.length} projects to src/data/content.json`)
  console.log('\nProjects:')
  projects.forEach(p => console.log(`  ${p.isFeatured ? '★' : '·'} ${p.title}`))
}

main().catch(err => { console.error(err); process.exit(1) })
