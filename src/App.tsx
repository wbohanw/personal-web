import { useState, useEffect, useRef } from 'react'
import './App.css'
import { FaCoffee } from 'react-icons/fa'
import Squares from './Squares'
import NavBar from './components/NavBar'
import LandingSection from './components/LandingSection'
import AboutSection from './components/AboutSection'
import ProjectsSection from './components/ProjectsSection'
import ExperienceSection from './components/ExperienceSection'
import Footer from './components/Footer'
import blueAudio from './assets/blue.mp3'
import content from './data/content.json'
import { Project, Experience } from './types'

const imageModules = import.meta.glob('./assets/**/*.{png,jpg,jpeg,gif,webp}', { eager: true, import: 'default' }) as Record<string, string>

type ProjectInput = Omit<Project, 'image'> & { imageKey?: string; imagePath?: string }

const resolveImagePath = (imagePath?: string) => {
  if (!imagePath) return ''
  const normalized = imagePath.startsWith('./') ? imagePath : `./${imagePath}`
  return imageModules[normalized] ?? normalized
}

function App() {
  const [darkMode, setDarkMode] = useState(() =>
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  )
  const [activeSection, setActiveSection] = useState('home')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [scrollY, setScrollY] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioAllowed, setAudioAllowed] = useState(false)
  const [needsUserInteraction, setNeedsUserInteraction] = useState(true)
  const mainRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  const data = content as { projects: ProjectInput[]; experiences: Experience[] }

  const projects: Project[] = data.projects.map(project => ({
    ...project,
    image: project.imagePath ? resolveImagePath(project.imagePath) : '',
  }))

  const experiences = data.experiences

  useEffect(() => {
    if (audioAllowed && audioRef.current && !needsUserInteraction) {
      audioRef.current.volume = 0.3
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false))
    }
  }, [audioAllowed, needsUserInteraction])

  const toggleMusic = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
        .then(() => { setIsPlaying(true); setAudioAllowed(true) })
        .catch(err => console.log('Audio play prevented:', err))
    }
  }

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => setDarkMode(e.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  const scrollToSection = (section: string) => {
    setActiveSection(section)
    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' })
  }

  const closeProjectDescription = () => {
    document.body.style.overflow = ''
    setSelectedProject(null)
  }

  return (
    <div className="min-h-screen font-sans antialiased overflow-x-hidden transition-colors duration-300">
      {/* Animated grid background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Squares
          speed={0.5}
          squareSize={40}
          direction='diagonal'
          borderColor={darkMode ? '#333' : '#e5e5e5'}
          hoverFillColor={darkMode ? '#222' : '#f3f3f3'}
        />
        <div className="absolute inset-0 bg-white/40 dark:bg-black/70 backdrop-blur-[1px]" />
      </div>

      {/* Welcome / audio consent overlay */}
      {needsUserInteraction && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center">
          <div className="text-center p-8 max-w-md">
            <h2 className="text-3xl font-bold text-white mb-6">Welcome to My Portfolio</h2>
            <p className="text-gray-300 mb-8">This site includes an audio experience. Click below to continue with music.</p>
            <button
              onClick={() => { setNeedsUserInteraction(false); setAudioAllowed(true) }}
              className="px-8 py-4 bg-white text-black font-medium rounded-full hover:bg-gray-200 transition-colors"
            >
              Enter with Music
            </button>
          </div>
        </div>
      )}

      <audio ref={audioRef} src={blueAudio} loop />

      {/* Café announcement banner */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-black/10 dark:border-white/10">
        <a
          href="https://cafe.bo-han.wang/en"
          className="flex items-center justify-center italic gap-2 py-2 px-4 text-md text-black dark:text-white hover:underline"
        >
          <FaCoffee className="w-4 h-4" />
          <span className="font-medium">Bohan Café Is Now Open!</span>
        </a>
      </div>

      {/* Scroll progress indicator */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 h-48 w-1 bg-gray-200 dark:bg-gray-800 z-40 rounded-full overflow-hidden">
        <div
          className="w-full bg-black dark:bg-white transition-all duration-300 rounded-full"
          style={{ height: `${Math.min((scrollY / (document.body.scrollHeight - window.innerHeight)) * 100, 100)}%` }}
        />
      </div>

      <NavBar activeSection={activeSection} onNavigate={scrollToSection} />

      <main ref={mainRef} className="relative pt-16">
        <LandingSection onToggleMusic={toggleMusic} />
        <AboutSection />
        <ProjectsSection
          projects={projects}
          selectedProject={selectedProject}
          onSelectProject={setSelectedProject}
          onCloseProject={closeProjectDescription}
        />
        <ExperienceSection experiences={experiences} />
        <Footer />
      </main>
    </div>
  )
}

export default App
