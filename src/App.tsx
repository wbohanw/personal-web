import { useState, useEffect, useRef } from 'react'
import './App.css'
import Spline from '@splinetool/react-spline';
import Squares from './Squares';
import { SiJavascript, SiTypescript, SiNextdotjs, SiNodedotjs, SiSass, SiTailwindcss, SiMysql, SiAmazon } from 'react-icons/si';
import { FaReact, FaPython, FaGitAlt, FaDocker } from 'react-icons/fa';
import blueAudio from './assets/blue.mp3';
import bohanImage from './assets/Bohan.jpg';
import aiDarlingImage from './assets/project/featured/AIDarling.jpg';
import colordormImage from './assets/project/featured/Colordorm.png';
import paintAIImage from './assets/project/featured/PaintAI.png';
import menulensImage from './assets/project/featured/Menulens.jpg';
import miloImage from './assets/project/featured/milo.jpg';
import punchImage from './assets/project/featured/punch.png';
import truckingImage from './assets/project/featured/trucking.png';
import cybersightImage from './assets/project/featured/cybersight.png';
import assetplusImage from './assets/project/regular/assetplus.png';
import robohacksImage from './assets/project/regular/robohack.jpg';
import robotImage from './assets/project/regular/211Robot.png';
import CPUImage from './assets/project/regular/16bitCPU.png';
import cityswImage from './assets/project/regular/citysw.jpg';
import CVpdf from './CV-2025.pdf';
type Project = {
  id: number
  title: string
  description: string
  tags: string[]
  image: string
  content: {
    type: 'text' | 'image' | 'video'
    data: string
  }[]
  colSpan?: number
  rowSpan?: number
  borderColor?: string
  repoUrl: string
  collaborators?: string[]
  isFeatured?: boolean
  projectLink?: string
}

function App() {
  const [darkMode, setDarkMode] = useState(() => 
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  )
  const [activeSection, setActiveSection] = useState('Home')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [scrollY, setScrollY] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioAllowed, setAudioAllowed] = useState(false)
  const [needsUserInteraction, setNeedsUserInteraction] = useState(true)
  const mainRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Sample projects data - replace with your actual projects
  const projects: Project[] = [
    {
      id: 1,
      title: "AI Darlings",
      description: "An AI-powered daily agent for senior companions, improve their daily well-being",
      tags: ["AI/ML", "TensorFlow", "React", "TypeScript"],
      image: aiDarlingImage,
      repoUrl: "https://github.com/wbohanw/AIDerly",
      projectLink:"https://github.com/yourusername/ai-music",
      collaborators: ["@collab1", "@collab2"],
      isFeatured: true,
      content: [{ type: 'text', data: 'Detailed content...' }]
    },
    {
      id: 2,
      title: "ColorDorm",
      description: "Next-gen Color inspiration for UI designers, feels like your dorm rooms",
      tags: ["React", "TypeScript"],
      image: colordormImage,
      repoUrl: "https://github.com/wbohanw/colordorm",
      projectLink:"https://uidorm.vercel.app/",
      collaborators: ["@collab1", "@collab2"],
      isFeatured: true,
      content: [{ type: 'text', data: 'Detailed content...' }]
    },
    {
      id: 3,
      title: "PaintAI",
      description: "Using AI to convert 2D arts to 3D AI game platform",
      tags: ["AI/ML", "OpenCV", "React", "TypeScript"],
      image: paintAIImage,
      repoUrl: "https://github.com/wbohanw/Painty-dance-ai",
      collaborators: ["@collab1", "@collab2"],
      isFeatured: true,
      content: [{ type: 'text', data: 'Detailed content...' }]
    },
    {
      id: 4,
      title: "Menulens",
      description: "Translation tool generates personalized restaurant menu with interactive features",
      tags: ["AI/ML", "OpenCV", "React", "TypeScript"],
      image: menulensImage,
      repoUrl: "https://github.com/wbohanw/menu-lens",
      projectLink:"https://menu-lens.vercel.app/",
      collaborators: ["@collab1", "@collab2"],
      isFeatured: true,
      content: [{ type: 'text', data: 'Detailed content...' }]
    },
    {
      id: 5,
      title: "Milo AI",
      description: "AI chat agent helps young teenager with well-being and mental health",
      tags: ["AI/ML", "CBT Logic", "React", "TypeScript"],
      image: miloImage,
      repoUrl: "https://github.com/Michaelyya/Teenager-wellbeing",
      collaborators: ["@collab1", "@collab2"],
      isFeatured: true,
      content: [{ type: 'text', data: 'Detailed content...' }]
    },
    {
      id: 6,
      title: "Punch my professor",
      description: "Using hand-tracking and AI to convert 2D images into 3D models for humorous virtual professor-punching",
      tags: ["Python", "OpenCV", "Unity", "React", "C#"],
      image: punchImage,
      repoUrl: "https://github.com/wbohanw/PunchMyProf",
      projectLink:"https://devpost.com/software/box-my-professor",
      collaborators: ["@collab1", "@collab2"],
      isFeatured: true,
      content: [{ type: 'text', data: 'Detailed content...' }]
    },
    {
      id: 7,
      title: "Trucking AI",
      description: "Computer Vision and ML algorithm to optimize trucking routes and reduce fuel consumption",
      tags: ["Python", "OpenCV", "ML", "React", "TypeScript"],
      image: truckingImage,
      repoUrl: "https://github.com/NameErrorException/trucking",
      projectLink:"https://devpost.com/software/trucking",
      collaborators: ["@collab1", "@collab2"],
      isFeatured: true,
      content: [{ type: 'text', data: 'Detailed content...' }]
    },
    {
      id: 8,
      title: "Cybersight AI",
      description: "Helping Blind Visual Impaired people to navigate the world with AI",
      tags: ["Python", "OpenCV", "TensorFlow", "React-Native", "TypeScript"],
      image: cybersightImage,
      repoUrl: "https://github.com/wbohanw/Cybersight",
      collaborators: ["@collab1", "@collab2"],
      isFeatured: true,
      content: [{ type: 'text', data: 'Detailed content...' }]
    },
    {
      id: 9,
      title: "AssetPlus",
      description: "Full-stack hotel management platform for asset tracking and management",
      tags: ["Next.js", "Node.js", "MongoDB", "Stripe"],
      image: assetplusImage,
      repoUrl: "https://github.com/F2023-ECSE223/ecse223-group-project-p10",
      content: [{ type: 'text', data: 'Detailed content...' }]
    },
    {
      id: 10,
      title: "Fire Fighter Robot",
      description: "Fire Fighter Robot using Raspberry Pi and BrickPi",
      tags: ["Raspberry Pi", "Arduino", "C++"],
      image: robohacksImage,
      repoUrl: "https://github.com/wbohanw/Robohacks_2024_McGill_Robotics",
      content: [{ type: 'text', data: 'Detailed content...' }]
    },
    {
      id: 12,
      title: "Cube Loading Robot",
      description: "BrickPi and Raspberry Pi based robot to load cube into the robot",
      tags: ["Raspberry Pi", "BrickPi", "Python"],
      image: robotImage,
      repoUrl: "https://github.com/wbohanw/Robohacks_2024_McGill_Robotics",
      content: [{ type: 'text', data: 'Detailed content...' }]
    },
    {
      id: 13,
      title: "16-bit CPU",
      description: "Full-stack shopping platform with real-time analytics",
      tags: ["Next.js", "Node.js", "MongoDB", "Stripe"],
      image: CPUImage,
      repoUrl: "https://github.com/404-not-found-404/16-bit-CPU",
      content: [{ type: 'text', data: 'Detailed content...' }]
    },
    {
      id: 14,
      title: "CitySweeper",
      description: "Full-stack shopping platform with real-time analytics",
      tags: ["Next.js", "Node.js", "MongoDB", "Stripe"],
      image: cityswImage,
      repoUrl: "https://github.com/wbohanw/Robohacks_2024_McGill_Robotics",
      content: [{ type: 'text', data: 'Detailed content...' }]
    }
    // Add at least 4 more projects
  ]
  const experiences = [
    {
      id: 1,
      company: "Data-Curve",
      role: "Frontend Developer (Independent Contractor)",
      period: "May 2024 – Present",
      description: "Developed AI-resistant interactive components using React, Tailwind CSS, and TypeScript, achieving 20% expansion in front-end data collection. Delivered production-ready code to enhance AI-driven UI generation for language model companies."
    },
    {
      id: 2,
      company: "Northking Information",
      role: "Software Development Intern (Computer Vision)",
      period: "Apr 2023 – Aug 2023",
      description: "Enhanced YOLO model performance (+2.5% accuracy, +4% precision) through optimized CNN architectures and filtering loops. Improved license plate recognition systems contributing to revenue growth using Python and OpenCV."
    },
    {
      id: 3,
      company: "TaiHe Technology",
      role: "Python Machine Learning Engineer Intern",
      period: "Apr 2022 – Aug 2022",
      description: "Boosted NLP model accuracy by 7% and processing speed by 2% through parameter optimization. Developed financial event classification systems compatible with quantitative trading algorithms using Numpy and Pandas."
    }
  ];

  // Auto-play music on page load
  useEffect(() => {
    if (audioAllowed && audioRef.current && !needsUserInteraction) {
      audioRef.current.volume = 0.3;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(error => {
        console.log("Audio play prevented:", error);
        setIsPlaying(false);
      });
    }
  }, [audioAllowed, needsUserInteraction]);

  // Toggle music play/pause
  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            setAudioAllowed(true);
          })
          .catch(error => {
            console.log("Audio play prevented:", error);
          });
      }
    }
  };

  // Scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Add a useEffect to listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = (e: MediaQueryListEvent) => {
      setDarkMode(e.matches)
    }
    
    // Add event listener
    mediaQuery.addEventListener('change', handleChange)
    
    // Clean up
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Existing dark mode effect remains the same
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])


  // Section scroll handler
  const scrollToSection = (section: string) => {
    setActiveSection(section)
    const sectionElement = document.getElementById(section)
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen font-sans antialiased overflow-x-hidden transition-colors duration-300">
      {/* Squares Background */}
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

      {/* Add an overlay for first-time visitors */}
      {needsUserInteraction && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center">
          <div className="text-center p-8 max-w-md">
            <h2 className="text-3xl font-bold text-white mb-6">Welcome to My Portfolio</h2>
            <p className="text-gray-300 mb-8">This site includes an audio experience. Click below to continue with music.</p>
            <button 
              onClick={() => {
                setNeedsUserInteraction(false);
                setAudioAllowed(true);
              }}
              className="px-8 py-4 bg-white text-black font-medium rounded-full hover:bg-gray-200 transition-colors"
            >
              Enter with Music
            </button>
          </div>
        </div>
      )}

      {/* Background Audio Player */}
      <audio 
        ref={audioRef} 
        src={blueAudio} 
        loop
      />

      {/* Progress Indicator */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 h-48 w-1 bg-gray-200 dark:bg-gray-800 z-40 rounded-full overflow-hidden">
        <div 
          className="w-full bg-black dark:bg-white transition-all duration-300 rounded-full"
          style={{ height: `${Math.min((scrollY / (document.body.scrollHeight - window.innerHeight)) * 100, 100)}%` }}
        />
      </div>

      {/* Main Content with Diagonal Sections */}
      <main ref={mainRef} className="relative">
        {/* Hero Section - Diagonal Split */}
        <section id="home" className="min-h-screen grid grid-cols-1 md:grid-cols-2 relative mx-auto px-8 md:px-24 py-24">
          <div className="md:col-span-1 flex flex-col justify-center text-center md:text-left md:px-16">
            <h1 className="text-6xl md:text-8xl font-bold mb-8 text-black dark:text-white leading-tight">
              Bohan<br/>Wang
            </h1>
            <p className="text-xl max-w-xl mx-auto md:mx-0 md:text-left text-gray-600 dark:text-white/80">
              <p className='uppercase  mb-16'>
              Only 10 types of people<br/> in this beautiful HelloWorld 👋
              </p>
            </p>
            <div className="flex flex-wrap gap-6 justify-center md:justify-start text-center">
              <a href={CVpdf} download className="w-48 px-8 py-3 bg-black hover:bg-gray-900 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-black font-medium transition-all duration-300 transform hover:-translate-y-1">
                Download CV
              </a>
              <a href='mailto:bohanwang@mail.mcgill.ca' className="w-48 px-8 py-3 border-2 border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black font-medium transition-all duration-300 transform hover:-translate-y-1">
                Contact Me
              </a>
            </div>
            <div className="flex flex-wrap mt-4 gap-6 justify-center md:justify-start text-center">
              <a href='https://github.com/wbohanw' className="w-48 px-8 py-3 border-2 border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black font-medium transition-all duration-300 transform hover:-translate-y-1">
                GitHub Repo
              </a>
              <a href='https://www.linkedin.com/in/bohan-wang-1a71b024a/' className="w-48 px-8 py-3 bg-black hover:bg-gray-900 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-black font-medium transition-all duration-300 transform hover:-translate-y-1">
                Let's Connect
              </a>
            </div>
          </div>
          <div className="items-center justify-center flex">
            <div className="-ml-28 md:ml-0 w-full scale-60 sm:-ml-12 sm:scale-80 md:scale-60 md:-ml-12 lg:scale-100 lg:-ml-24">
              <Spline 
                scene="https://prod.spline.design/SaiarIHVInH3Qiv3/scene.splinecode" 
                onClick={toggleMusic}
                style={{ 
                  cursor: 'pointer',
                  width: '180%',
                  height: '100%',
                  maxWidth: '170vw',
                  transformOrigin: 'center center',
                }}
              />
            </div>
          </div>
        </section>

        {/* About Section - Split Layout */}
        <section id="about" className="min-h-screen relative px-8 md:px-24 py-24">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-5xl font-bold mb-16 text-black dark:text-white">
                  About Me ✌️
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8 relative group">
                <div className="relative overflow-hidden rounded-3xl shadow-2xl transform transition-all duration-500 hover:shadow-3xl">
                  <img 
                    src={bohanImage} 
                    alt="Bohan Wang"
                    className="w-full h-auto object-cover transform transition-all duration-500 group-hover:scale-105"
                  />
                  <p className='text-white absolute top-1/4 left-1/4 font-serif bg-black/60 p-2 rounded-xl'>Campbell ---- One of the best Prof at Mcgill</p>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
              </div>
              <div className='flex flex-col justify-center items-center'>

                <div className="grid grid-cols-4 gap-2 p-10">
                  {[
                    { name: 'JavaScript', Icon: SiJavascript },
                    { name: 'TypeScript', Icon: SiTypescript },
                    { name: 'React', Icon: FaReact },
                    { name: 'Next.js', Icon: SiNextdotjs },
                    { name: 'Node.js', Icon: SiNodedotjs },
                    { name: 'CSS/SCSS', Icon: SiSass },
                    { name: 'Tailwind', Icon: SiTailwindcss },
                    { name: 'Git', Icon: FaGitAlt },
                    { name: 'Python', Icon: FaPython },
                    { name: 'SQL', Icon: SiMysql },
                    { name: 'Docker', Icon: FaDocker },
                    { name: 'AWS', Icon: SiAmazon },
                  ].map((skill, i) => (
                    <div 
                      key={i} 
                      className="aspect-square flex flex-col items-center justify-center bg-white dark:bg-black p-4 shadow-md transform hover:rotate-3 hover:scale-110 transition-all duration-300 space-y-2"
                      style={{ 
                        transform: `rotate(${(i % 4) * 3 - 4}deg)`,
                        borderRadius: `${Math.random() * 20 + 10}% ${Math.random() * 20 + 10}% ${Math.random() * 20 + 10}% ${Math.random() * 20 + 10}%`,
                      }}
                    >
                      <skill.Icon className="w-8 h-8 text-gray-800 dark:text-gray-200" />
                      <span className="text-sm font-medium text-center text-black dark:text-white">{skill.name}</span>
                    </div>
                  ))}
                </div>
                <div className="text-center lg:text-left space-y-4">
                  <h2 className="px-12 text-5xl font-bold bg-gradient-to-r bg-clip-text text-black dark:text-white">
                    McGill U4 Comp Eng
                  </h2>
                  <p className="px-12 text-xl text-gray-600 dark:text-white/90 leading-relaxed max-w-2xl">
                    My name is Bohan Wang, a Full Stack Developer interested in large language models (LLM) job and projects. I'm passionate about building innovative web applications and exploring new AI technologies. 
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Projects Section - Asymmetric Grid */}
        <section id="projects" className="min-h-screen px-8 md:px-24 py-24 relative">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-5xl font-bold mb-16 text-black dark:text-white">
              Oh, you're here? These are some of my projects, don't miss the repo:)
            </h2>

            {/* Featured Project */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-12">
              {projects.filter(p => p.isFeatured).map(project => (
                <div key={project.id} className="relative group h-96 rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 cursor-pointer">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/80 to-black/90 p-8 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="space-y-4">
                      <h3 className="text-3xl font-bold text-white py-1 rounded-lg">{project.title}</h3>
                      <p className="text-gray-300 text-md">{project.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag, i) => (
                          <span 
                            key={i}
                            className="px-3 py-1 text-sm bg-white/10 backdrop-blur-sm text-white rounded-full hover:bg-white/20 transition-colors"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 mt-4">
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center hover:scale-105 gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                          </svg>
                          View Repository
                        </a>
                        {project.projectLink ? (
                          <a href={project.projectLink} className="flex border-2 rounded-xl px-2 py-1 cursor-pointer hover:scale-105 border-white gap-2 text-gray-300">
                            Link Available
                          </a>
                        ) : (
                          <span className="flex border-2 rounded-xl px-2 py-1 cursor-not-allowed border-gray-500 gap-2 text-gray-500">
                            Unavailable
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Regular Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {projects.filter(p => !p.isFeatured).map(project => (
                <div key={project.id} className="group relative h-80 bg-white dark:bg-gray-900 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                    <p className="text-gray-300 text-sm line-clamp-2 mb-3">{project.description}</p>
                    <div className="flex items-center justify-between">
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-white hover:text-gray-300 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm">View Code</span>
                      </a>
                      <div className="flex -space-x-2">
                        {project.collaborators?.map((collab, i) => (
                          <div key={i} className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center text-xs text-white">
                            {collab}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Experience Section - Zigzag Timeline */}
        <section id="experience" className="min-h-screen px-8 md:px-24 py-24 relative">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-5xl font-bold mb-20 text-black dark:text-white">
              Experience 💼
            </h2>
            
            <div className="max-w-4xl mx-auto relative">
              {experiences.map((exp, index) => (
                <div 
                  key={exp.id} 
                  className={`flex mb-20 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} relative`}
                >
                  <div className="w-8 h-8 absolute left-1/2 transform -translate-x-1/2 bg-black dark:bg-white rounded-full z-10" />
                  
                  <div className={`w-5/12 px-4 ${index % 2 === 0 ? 'text-right pr-4 md:pr-16' : 'text-left pl-4 md:pl-16'}`}>
                    <h3 className="text-xl font-bold text-black dark:text-white">{exp.role}</h3>
                    <div className="text-gray-700 dark:text-gray-300 font-medium">{exp.company}</div>
                    <div className="text-sm italic text-gray-500 dark:text-white">{exp.period}</div>
                  </div>
                  
                  <div className="w-2/12 flex justify-center">
                    <div className="w-1 bg-black dark:bg-white h-full rounded-full" />
                  </div>
                  
                  <div className={`w-5/12 px-4 ${index % 2 === 0 ? 'text-left pl-4 md:pl-16' : 'text-right pr-4 md:pr-16'}`}>
                    <p className="text-gray-600 dark:text-white/70">
                      {exp.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black dark:bg-white text-white dark:text-black py-12 px-8 md:px-24 relative overflow-hidden">
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start">
              <div className="mb-8 md:mb-0">
                <h2 className="text-3xl font-bold mb-4">Bohan Wang</h2>
                <p className="text-gray-400 dark:text-gray-600">© {new Date().getFullYear()} All Rights Reserved</p>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <a href="https://github.com/wbohanw?tab=overview&from=2025-05-01&to=2025-05-07" className="w-12 h-12 rounded-full flex items-center justify-center border border-white/30 dark:border-black/30 hover:bg-white/10 dark:hover:bg-black/10 transition-colors duration-300">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="https://www.linkedin.com/in/bohan-wang-1a71b024a/" className="w-12 h-12 rounded-full flex items-center justify-center border border-white/30 dark:border-black/30 hover:bg-white/10 dark:hover:bg-black/10 transition-colors duration-300">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                <a href="https://www.instagram.com/wohan_bang" className="w-12 h-12 rounded-full flex items-center justify-center border border-white/30 dark:border-black/30 hover:bg-white/10 dark:hover:bg-black/10 transition-colors duration-300">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* Minimalist Project Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 transition-all duration-300">
          <div className="bg-white dark:bg-black max-w-5xl w-full mx-8 md:mx-auto rounded-none shadow-2xl overflow-hidden">
            <div className="relative h-80 sm:h-96 overflow-hidden">
              <img 
                src={selectedProject.image} 
                alt={selectedProject.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h2 className="text-4xl sm:text-5xl font-bold mb-2 transform -translate-x-4">{selectedProject.title}</h2>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tags.map((tag, i) => (
                    <span 
                      key={i} 
                      className="px-3 py-1 text-sm bg-white/20 hover:bg-white/30 transition-colors duration-300"
                      style={{ 
                        borderRadius: `${Math.random() * 10 + 10}px ${Math.random() * 10 + 10}px ${Math.random() * 10 + 10}px ${Math.random() * 10 + 10}px`
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <button 
                className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-black/40 text-white hover:bg-black/60 transition-colors duration-300"
                onClick={closeProjectDescription}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {selectedProject.description}
              </p>
              
              <div className="space-y-10">
                {selectedProject.content.map((item, i) => (
                  <div 
                    key={i} 
                    className="opacity-0 animate-fade-in"
                    style={{ 
                      animationDelay: `${i * 150}ms`, 
                      animationFillMode: 'forwards',
                      transform: `rotate(${Math.random() * 2 - 1}deg)`
                    }}
                  >
                    {item.type === 'text' && (
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{item.data}</p>
                    )}
                    {item.type === 'image' && (
                      <div className="overflow-hidden shadow-md transform hover:scale-[1.01] transition-transform duration-300">
                        <img src={item.data} alt="Project visual" className="w-full h-auto" />
                      </div>
                    )}
                    {item.type === 'video' && (
                      <div className="overflow-hidden shadow-md">
                        <video 
                          src={item.data} 
                          controls 
                          className="w-full h-auto"
                          poster={selectedProject.image}
                        >
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Top Navigation */}
      <div className="fixed top-0 left-0 right-0 md:hidden z-50 bg-gray-100 shadow-lg justify-between">
        <div className="px-8 py-4 max-w-7xl justify-between flex">
          <button 
            onClick={() => scrollToSection('home')}
            className={`text-gray-700 hover:text-black dark:hover:text-gray-700/70 cursor-pointer transition-colors duration-300 ${activeSection === 'home' ? 'font-bold text-black dark:text-white' : ''}`}
          >
            Home
          </button>
          <button 
            onClick={() => scrollToSection('about')}
            className={`text-gray-700 hover:text-black dark:hover:text-gray-700/70 cursor-pointer transition-colors duration-300 ${activeSection === 'about' ? 'font-bold text-black dark:text-white' : ''}`}
          >
            About
          </button>
          <button 
            onClick={() => scrollToSection('projects')}
            className={`text-gray-700 hover:text-black dark:hover:text-gray-700/70 cursor-pointer transition-colors duration-300 ${activeSection === 'projects' ? 'font-bold text-black dark:text-white' : ''}`}
          >
            Projects
          </button>

          <button 
            onClick={() => scrollToSection('experience')}
            className={`text-gray-700 hover:text-black dark:hover:text-gray-700/70 cursor-pointer transition-colors duration-300 ${activeSection === 'experience' ? 'font-bold text-black dark:text-white' : ''}`}
          >
            Experience
          </button>
        </div>
      </div>

      {/* Floating Side Navigation - Hide on mobile */}
      <div className="fixed -left-44 top-1/2 -translate-y-1/2 transform rotate-90 z-50 hidden md:flex items-center space-x-12 px-6 py-4 bg-gray-100 shadow-lg rounded-t-lg">
        <button 
          onClick={() => scrollToSection('home')}
          className={`text-gray-700 hover:text-black dark:hover:text-gray-700/70 cursor-pointer transition-colors duration-300 ${activeSection === 'home' ? 'font-bold text-black' : ''}`}
        >
          Home
        </button>
        <button 
          onClick={() => scrollToSection('about')}
          className={`text-gray-700 hover:text-black dark:hover:text-gray-700/70 cursor-pointer transition-colors duration-300 ${activeSection === 'about' ? 'font-bold text-black' : ''}`}
        >
          About
        </button>
        <button 
          onClick={() => scrollToSection('projects')}
          className={`text-gray-700 hover:text-black dark:hover:text-gray-700/70 cursor-pointer transition-colors duration-300 ${activeSection === 'projects' ? 'font-bold text-black' : ''}`}
        >
          Projects
        </button>
        <button 
          onClick={() => scrollToSection('experience')}
          className={`text-gray-700 hover:text-black dark:hover:text-gray-700/70  cursor-pointer transition-colors duration-300 ${activeSection === 'experience' ? 'font-bold text-black' : ''}`}
        >
          Experience
        </button>
      </div>
    </div>
  )
}

export default App
