import notionPkg from '@notionhq/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import fetch from 'node-fetch'
import FormData from 'form-data'

const { Client } = notionPkg
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

// Load .env manually
const envPath = path.join(ROOT, '.env')
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const [k, ...v] = line.split('=')
    if (k?.trim() && v.length) process.env[k.trim()] = v.join('=').trim()
  }
}

const TOKEN = process.env.NOTION_API_KEY
const DB_ID = '339ae245-2309-8058-89e0-caf635e22824'

if (!TOKEN) { console.error('Missing NOTION_API_KEY'); process.exit(1) }

const notion = new Client({ auth: TOKEN })

const HEADERS = {
  Authorization: `Bearer ${TOKEN}`,
  'Notion-Version': '2022-06-28',
  'Content-Type': 'application/json',
}

const MIME = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.gif': 'image/gif', '.webp': 'image/webp' }

// ── Helpers ──────────────────────────────────────────────────────────────────

async function notionFetch(method, endpoint, body) {
  const res = await fetch(`https://api.notion.com/v1${endpoint}`, {
    method,
    headers: HEADERS,
    body: body ? JSON.stringify(body) : undefined,
  })
  return res.json()
}

async function listDatabasePages() {
  const pages = []
  let cursor = undefined
  do {
    const body = cursor ? { start_cursor: cursor } : {}
    const data = await notionFetch('POST', `/databases/${DB_ID}/query`, body)
    if (data.results) pages.push(...data.results)
    cursor = data.has_more ? data.next_cursor : undefined
  } while (cursor)
  return pages
}

async function uploadImage(absolutePath) {
  if (!fs.existsSync(absolutePath)) {
    console.warn(`    image not found: ${absolutePath}`)
    return null
  }

  const ext = path.extname(absolutePath).toLowerCase()
  const mime = MIME[ext] ?? 'application/octet-stream'
  const filename = path.basename(absolutePath)
  const fileSize = fs.statSync(absolutePath).size

  const BASE = 'https://api.notion.com/v1'

  // Step 1: create upload session
  const createRes = await fetch(`${BASE}/file_uploads`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({ filename, content_type: mime }),
  })
  const createData = await createRes.json()

  if (!createData?.id) {
    console.warn(`    create failed: ${JSON.stringify(createData)}`)
    return null
  }

  // Step 2: send file bytes as multipart
  const form = new FormData()
  form.append('part_number', '1')
  form.append('file', fs.createReadStream(absolutePath), { filename, contentType: mime })

  const sendRes = await fetch(`${BASE}/file_uploads/${createData.id}/send`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Notion-Version': '2022-06-28',
      ...form.getHeaders(),
    },
    body: form,
  })
  const sendData = await sendRes.json()

  if (sendData?.object === 'error') {
    console.warn(`    send failed: ${JSON.stringify(sendData)}`)
    return null
  }

  // Single-part uploads auto-complete after send — no complete call needed
  return createData.id
}

async function createPage(p, uploadId) {
  const props = {
    Name:        { title: [{ text: { content: p.title } }] },
    Description: { rich_text: [{ text: { content: p.desc } }] },
    Tags:        { multi_select: p.tags.map(t => ({ name: t })) },
    RepoUrl:     { url: p.repo },
    IsFeatured:  { checkbox: p.featured },
  }
  if (p.link) props.ProjectLink = { url: p.link }
  if (p.youtube) props.YoutubeLink = { url: p.youtube }
  if (p.date) props.Date = { date: { start: p.date } }

  const body = { parent: { database_id: DB_ID }, properties: props }

  if (uploadId) {
    body.cover = { type: 'file_upload', file_upload: { id: uploadId } }
  }

  try {
    return await notionFetch('POST', '/pages', body)
  } catch (err) {
    // Retry without cover
    delete body.cover
    return await notionFetch('POST', '/pages', body)
  }
}

// ── Projects data ─────────────────────────────────────────────────────────────

const projects = [
  { title: 'Remi',               date: '2025-03-01', desc: 'AI-powered patient-doctor portal and activity monitoring to help Alzheimer patients and doctors with AI-generated insights',                  tags: ['Python','Node.js','React','TypeScript'],                 repo: 'https://github.com/0vp/HackRx-2025',                           link: null,                                             youtube: 'https://www.youtube.com/watch?v=d7SWmeHx35I', featured: true,  imagePath: 'src/assets/project/featured/Remi.png'       },
  { title: 'RabizAI',            date: '2025-01-01', desc: 'AI-Powered E-Commerce Automation platform that builds and runs an entire dropshipping operation with minimal human input',                    tags: ['Python','React','Node.js','Stripe'],                     repo: 'https://github.com/wbohanw/CodeJam2025',                       link: 'https://devpost.com/software/rabiz-ai',          youtube: null,                                          featured: true,  imagePath: 'src/assets/project/featured/rabizAI.png'    },
  { title: 'AI Darlings',        date: '2024-11-01', desc: 'An AI-powered daily agent for senior companions, improve their daily well-being',                                                              tags: ['AI/ML','TensorFlow','React','TypeScript'],               repo: 'https://github.com/wbohanw/AIDerly',                           link: null,                                             youtube: null,                                          featured: true,  imagePath: 'src/assets/project/featured/AIDarling.jpg'  },
  { title: 'Milo AI',            date: '2024-10-01', desc: 'AI chat agent helps young teenager with well-being and mental health',                                                                        tags: ['AI/ML','CBT Logic','React','TypeScript'],                repo: 'https://github.com/Michaelyya/Teenager-wellbeing',             link: null,                                             youtube: null,                                          featured: true,  imagePath: 'src/assets/project/featured/milo.jpg'       },
  { title: 'Trucking AI',        date: '2024-09-01', desc: 'Computer Vision and ML algorithm to optimize trucking routes and reduce fuel consumption',                                                    tags: ['Python','OpenCV','ML','React','TypeScript'],             repo: 'https://github.com/NameErrorException/trucking',               link: 'https://devpost.com/software/trucking',          youtube: null,                                          featured: true,  imagePath: 'src/assets/project/featured/trucking.png'   },
  { title: 'Punch my professor', date: '2024-09-01', desc: 'Using hand-tracking and AI to convert 2D images into 3D models for humorous virtual professor-punching',                                      tags: ['Python','OpenCV','Unity','React','C#'],                  repo: 'https://github.com/wbohanw/PunchMyProf',                       link: 'https://devpost.com/software/box-my-professor',  youtube: null,                                          featured: true,  imagePath: 'src/assets/project/featured/punch.png'      },
  { title: 'ColorDorm',          date: '2024-08-01', desc: 'Next-gen Color inspiration for UI designers, feels like your dorm rooms',                                                                     tags: ['React','TypeScript'],                                    repo: 'https://github.com/wbohanw/colordorm',                         link: 'https://uidorm.vercel.app/',                     youtube: null,                                          featured: true,  imagePath: 'src/assets/project/featured/Colordorm.png'  },
  { title: 'Menulens',           date: '2024-07-01', desc: 'Translation tool generates personalized restaurant menu with interactive features',                                                            tags: ['AI/ML','OpenCV','React','TypeScript'],                   repo: 'https://github.com/wbohanw/menu-lens',                         link: 'https://menu-lens.vercel.app/',                  youtube: null,                                          featured: true,  imagePath: 'src/assets/project/featured/Menulens.jpg'   },
  { title: 'Cybersight AI',      date: '2024-03-01', desc: 'Helping Blind Visual Impaired people to navigate the world with AI',                                                                         tags: ['Python','OpenCV','TensorFlow','React-Native','TypeScript'], repo: 'https://github.com/wbohanw/Cybersight',                      link: null,                                             youtube: null,                                          featured: true,  imagePath: 'src/assets/project/featured/cybersight.png' },
  { title: 'PaintAI',            date: '2024-01-01', desc: 'Using AI to convert 2D arts to 3D AI game platform',                                                                                         tags: ['AI/ML','OpenCV','React','TypeScript'],                   repo: 'https://github.com/wbohanw/Painty-dance-ai',                   link: null,                                             youtube: null,                                          featured: true,  imagePath: 'src/assets/project/featured/PaintAI.png'    },
  { title: 'AssetPlus',          date: '2023-12-01', desc: 'Full-stack hotel management platform for asset tracking and management',                                                                      tags: ['Next.js','Node.js','MongoDB','Stripe'],                  repo: 'https://github.com/F2023-ECSE223/ecse223-group-project-p10',   link: null,                                             youtube: null,                                          featured: false, imagePath: 'src/assets/project/regular/assetplus.png'   },
  { title: 'CitySweeper',        date: '2023-11-01', desc: 'City management and sweeping simulation platform',                                                                                           tags: ['Next.js','Node.js','MongoDB','Stripe'],                  repo: 'https://github.com/wbohanw/Robohacks_2024_McGill_Robotics',    link: null,                                             youtube: null,                                          featured: false, imagePath: 'src/assets/project/regular/citysw.jpg'      },
  { title: '16-bit CPU',         date: '2023-10-01', desc: 'Full 16-bit CPU implementation in hardware description language',                                                                            tags: ['VHDL','Digital Logic','Computer Architecture'],          repo: 'https://github.com/404-not-found-404/16-bit-CPU',              link: null,                                             youtube: null,                                          featured: false, imagePath: 'src/assets/project/regular/16bitCPU.png'    },
  { title: 'Fire Fighter Robot', date: '2024-02-01', desc: 'Fire Fighter Robot using Raspberry Pi and BrickPi',                                                                                          tags: ['Raspberry Pi','Arduino','C++'],                          repo: 'https://github.com/wbohanw/Robohacks_2024_McGill_Robotics',    link: null,                                             youtube: null,                                          featured: false, imagePath: 'src/assets/project/regular/robohack.jpg'    },
  { title: 'Cube Loading Robot', date: '2023-09-01', desc: 'BrickPi and Raspberry Pi based robot to load cube into the robot',                                                                           tags: ['Raspberry Pi','BrickPi','Python'],                       repo: 'https://github.com/wbohanw/Robohacks_2024_McGill_Robotics',    link: null,                                             youtube: null,                                          featured: false, imagePath: 'src/assets/project/regular/211Robot.png'    },
]

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  // Fetch existing pages to avoid wiping manually-added projects
  console.log('Fetching existing Notion pages...')
  const existing = await listDatabasePages()
  const existingTitles = new Set(
    existing.map(p => p.properties?.Name?.title?.[0]?.plain_text?.trim().toLowerCase())
  )
  console.log(`  Found ${existing.length} existing pages: ${[...existingTitles].join(', ')}\n`)

  const toCreate = projects.filter(p => !existingTitles.has(p.title.trim().toLowerCase()))
  const toSkip   = projects.filter(p =>  existingTitles.has(p.title.trim().toLowerCase()))

  if (toSkip.length) console.log(`Skipping (already exist): ${toSkip.map(p => p.title).join(', ')}\n`)

  if (!toCreate.length) {
    console.log('Nothing new to create. Run notion:fetch to pull latest data.')
    return
  }

  console.log(`Creating ${toCreate.length} new project page(s)...\n`)

  for (const p of toCreate) {
    process.stdout.write(`→ ${p.title.padEnd(22)} `)

    const absPath = path.join(ROOT, p.imagePath)
    process.stdout.write(`uploading image... `)
    const uploadId = await uploadImage(absPath)
    process.stdout.write(uploadId ? `✓ upload  ` : `✗ no-img  `)

    const page = await createPage(p, uploadId)
    if (page?.id) {
      console.log(`✓ page created`)
    } else {
      console.log(`✗ failed: ${JSON.stringify(page)}`)
    }
  }

  console.log('\nAll done! Run notion:fetch to update content.json.')
}

main().catch(err => { console.error(err); process.exit(1) })
