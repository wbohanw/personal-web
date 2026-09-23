import { caseStudies, videoProjects } from '../portfolio/portfolioData'
import content from '../data/content.json'
import portrait from '../assets/planet/bohan-portrait.jpg'

export type PlaceId = 'projects' | 'experience' | 'awards' | 'books' | 'life' | 'research'
export const places: { id: PlaceId; title: string; short: string; subtitle: string; number: string; lat: number; lon: number; color: string }[] = [
  { id: 'projects', title: 'The idea workshop', short: 'Projects', subtitle: 'Things I bring to life.', number: '01', lat: 46, lon: -40, color: '#527ea7' },
  { id: 'experience', title: 'The north lighthouse', short: 'Experience', subtitle: 'Places that shaped my journey.', number: '02', lat: 57, lon: 42, color: '#749ea8' },
  { id: 'awards', title: 'The adventure camp', short: 'Milestones', subtitle: 'Big challenges. Good company.', number: '03', lat: 9, lon: -22, color: '#b5915d' },
  { id: 'books', title: 'The little library', short: 'Bookshelf', subtitle: 'Room for another perspective.', number: '04', lat: 12, lon: 49, color: '#667c9e' },
  { id: 'life', title: 'The slow-living garden', short: 'Life', subtitle: 'Photos, small moments, and life beyond the workbench.', number: '05', lat: -34, lon: 2, color: '#669698' },
  { id: 'research', title: 'The discovery lab', short: 'Research', subtitle: 'Research & Leadership', number: '06', lat: 8, lon: -70, color: '#768cab' },
]
export const publications = [
  { title: 'MILO: An LLM Multi-Stage Conversational Agent for Fostering Teenagers’ Mental Resilience', venue: 'UIST 2025' },
  { title: 'Sensitively humidity-driven actuator and sensor derived from natural skin system', venue: 'Sensors and Actuators B' },
]
export const leadership = [
  { organization: 'McGill Competitive Programming', role: 'Vice President', period: 'Sep 2025 – Present', location: 'Montreal', description: 'Organized training sessions, competitions, and workshops to improve algorithmic problem-solving skills.' },
  { organization: 'McGill Engineering Competition', role: 'Vice President', period: 'Sep 2024 – Apr 2025', location: 'Montreal', description: 'Coordinated engineering competitions and managed cross-team logistics and judging processes.' },
  { organization: 'McGill ROBOHACK Team', role: 'Team Leader', period: 'Jan 2022 – Aug 2023', location: '', description: 'Led a multidisciplinary team in designing, building, and programming competitive robotics systems.' },
]
export const experiences = content.experiences
export { portrait }
export const projects = [
  ...caseStudies.map(p => ({ title: p.title, description: p.oneLiner, cover: p.coverImage, category: p.label, stack: p.stack, result: p.result, repo: p.repoUrl, url: undefined as string | undefined, video: p.video, problem: p.problem, approach: p.approach, metrics: p.metrics })),
  ...videoProjects.map(p => ({ title: p.title, description: p.description, cover: p.coverImage, category: p.label, stack: p.stack ?? [], result: p.result, repo: p.repoUrl, url: p.projectUrl, video: p.video, problem: undefined as string | undefined, approach: [] as string[], metrics: p.metrics ?? [] })),
]
const images = import.meta.glob('../assets/milestones/*.{png,jpg}', { eager: true, import: 'default' }) as Record<string, string>
const photo = (name: string) => images[`../assets/milestones/${name}`]
export const awards = [
  { title: 'Bagel Hack II', result: '2nd place', year: '2026', location: 'Montreal', photos: [photo('bagelhack-1.png'), photo('bagelhack-2.png')] },
  { title: 'CareXR Hackathon', result: 'Honorable award', year: '2026', location: 'Building in extended reality', photos: [photo('carexr-1.jpg'), photo('carexr-2.jpg')] },
  { title: 'Databricks AI Agent Hackathon', result: '1st place', year: '2025', location: 'Montreal', photos: [photo('databricks-4.png'), photo('databricks-1.png'), photo('databricks-2.png'), photo('databricks-3.png')] },
  { title: 'Quebec Engineering Competition', result: '1st place', year: '2025', location: 'QEC', photos: [photo('qec-3.png'), photo('qec-1.png'), photo('qec-2.png')] },
  { title: 'Handan Youth Innovation & Entrepreneurship', result: '3rd place', year: '2025', location: '15th edition', photos: [photo('handan-1.png')] },
  { title: 'Shanxi AI Challenge Cup', result: '3rd place', year: '2025', location: 'Artificial intelligence', photos: [] as string[] },
  { title: 'McGill Engineering Competition', result: '1st place', year: '2024', location: 'MEC', photos: [] as string[] },
  { title: 'McHacks', result: 'Best game development', year: '2024', location: 'McGill University', photos: [] as string[] },
  { title: 'RoboHack', result: '1st place', year: '2023', location: 'McGill University', photos: [photo('robohack-1.png'), photo('robohack-2.png')] },
  { title: '123LoadBoard Coding Challenge', result: '2nd place', year: '2023', location: 'Coding & collaboration', photos: [photo('loadboard-1.png')] },
]
export const photos = awards.flatMap(a => a.photos.map((src, i) => ({ src, title: a.title, caption: `${a.title} · ${a.year}`, id: `${a.title}-${i}` })))
