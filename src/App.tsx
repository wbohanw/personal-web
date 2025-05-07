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
  const [showDescription, setShowDescription] = useState(false)
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
      repoUrl: "https://github.com/yourusername/ai-music",
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
      repoUrl: "https://github.com/yourusername/ai-music",
      projectLink:"https://github.com/yourusername/ai-music",
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
      repoUrl: "https://github.com/yourusername/ai-music",
      projectLink:"https://github.com/yourusername/ai-music",
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
      repoUrl: "https://github.com/yourusername/ai-music",
      projectLink:"https://github.com/yourusername/ai-music",
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
      repoUrl: "https://github.com/yourusername/ai-music",
      projectLink:"https://github.com/yourusername/ai-music",
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
      repoUrl: "https://github.com/yourusername/ai-music",
      projectLink:"https://github.com/yourusername/ai-music",
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
      repoUrl: "https://github.com/yourusername/ai-music",
      projectLink:"https://github.com/yourusername/ai-music",
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
      repoUrl: "https://github.com/yourusername/ecommerce",
      content: [{ type: 'text', data: 'Detailed content...' }]
    },
    {
      id: 10,
      title: "Fire Fighter Robot",
      description: "Fire Fighter Robot using Raspberry Pi and BrickPi",
      tags: ["Raspberry Pi", "Arduino", "C++"],
      image: robohacksImage,
      repoUrl: "https://github.com/yourusername/ecommerce",
      content: [{ type: 'text', data: 'Detailed content...' }]
    },
    {
      id: 12,
      title: "Cube Loading Robot",
      description: "BrickPi and Raspberry Pi based robot to load cube into the robot",
      tags: ["Raspberry Pi", "BrickPi", "Python"],
      image: robotImage,
      repoUrl: "https://github.com/yourusername/ecommerce",
      content: [{ type: 'text', data: 'Detailed content...' }]
    },
    {
      id: 13,
      title: "16-bit CPU",
      description: "Full-stack shopping platform with real-time analytics",
      tags: ["Next.js", "Node.js", "MongoDB", "Stripe"],
      image: CPUImage,
      repoUrl: "https://github.com/yourusername/ecommerce",
      content: [{ type: 'text', data: 'Detailed content...' }]
    },
    {
      id: 14,
      title: "CitySweeper",
      description: "Full-stack shopping platform with real-time analytics",
      tags: ["Next.js", "Node.js", "MongoDB", "Stripe"],
      image: cityswImage,
      repoUrl: "https://github.com/yourusername/ecommerce",
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

  // Function to close project description
  const closeProjectDescription = () => {
    setShowDescription(false)
    document.body.style.overflow = ''
    setTimeout(() => setSelectedProject(null), 300)
  }

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
        <section id="home" className="min-h-screen grid grid-cols-1 md:grid-cols-2 relative pl-10">
          <div className="md:col-span-1 flex flex-col justify-center px-12 md:px-24 py-24 text-center md:text-left">
            <h1 className="text-6xl md:text-8xl font-bold mb-8 text-black dark:text-white leading-tight">
              Bohan<br/>Wang
            </h1>
            <p className="text-xl max-w-xl mx-auto md:mx-0 text-gray-600 dark:text-gray-400 mb-12">
              Creative developer with a passion for building beautiful, interactive digital experiences.
            </p>
            <div className="flex flex-wrap gap-6 justify-center md:justify-start">
              <a href={CVpdf} download className="w-48 px-8 py-3 bg-black hover:bg-gray-900 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-black font-medium transition-all duration-300 transform hover:-translate-y-1">
                Download CV
              </a>
              <a href='mailto:bohanwang@mail.mcgill.ca' className="w-48 px-8 py-3 border-2 border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black font-medium transition-all duration-300 transform hover:-translate-y-1">
                Contact Me
              </a>
            </div>
            <div className="flex flex-wrap mt-4 gap-6 justify-center md:justify-start">
              <a href='https://github.com/wbohanw' className="w-48 px-8 py-3 border-2 border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black font-medium transition-all duration-300 transform hover:-translate-y-1">
                GitHub Repo
              </a>
              <a href='https://www.linkedin.com/in/bohan-wang-1a71b024a/' className="w-48 px-8 py-3 bg-black hover:bg-gray-900 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-black font-medium transition-all duration-300 transform hover:-translate-y-1">
                Let's Connect
              </a>
            </div>
          </div>
            <div className="md:block w-full ">
              <Spline 
                scene="https://prod.spline.design/SaiarIHVInH3Qiv3/scene.splinecode" 
                onClick={toggleMusic}
                style={{ cursor: 'pointer' }}
              />
            </div>
        </section>

        {/* About Section - Split Layout */}
        <section id="about" className="min-h-screen relative py-24 px-8 md:px-16">
          
        <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        <div className="space-y-8 relative group">
                  <div className="relative overflow-hidden rounded-3xl shadow-2xl transform transition-all duration-500 hover:shadow-3xl">
                    <img 
                      src={bohanImage} 
                      alt="Bohan Wang"
                      className="w-full h-auto object-cover transform transition-all duration-500 group-hover:scale-105"
                    />
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
                              <h2 className="text-5xl font-bold bg-gradient-to-r bg-clip-text text-black dark:text-white">
                                McGill U4 Comp Eng
                              </h2>
                              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
                              My name is Bohan Wang, a Full Stack Developer interested in large language models (LLM) job and projects. I'm passionate about building innovative web applications and exploring new AI technologies. 
                              </p>
                            </div>
                        </div>
                </div>
              </div>
        </section>
        {/* Projects Section - Asymmetric Grid */}
        <section id="projects" className="min-h-screen px-8 md:px-16 py-24 relative">
          <h2 className="text-5xl font-bold mb-16 text-black dark:text-white -rotate-1 transform translate-x-6">
            Oh, you're here? These are some of my projects, don't miss the repo:)
          </h2>

          {/* Featured Project */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
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
                      <a href={project.projectLink} className="flex border-2 rounded-xl px-2 py-1 cursor-pointer hover:scale-105 border-white gap-2 text-gray-300">
                        Link Avaliable
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Regular Projects Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
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
        </section>

        {/* Experience Section - Zigzag Timeline */}
        <section id="experience" className="min-h-screen px-8 md:px-16 py-24 relative">
          <h2 className="text-5xl font-bold mb-20 text-black dark:text-white transform rotate-1 translate-x-8">
            Work Experience
          </h2>
          
          <div className="max-w-4xl mx-auto relative">
            {experiences.map((exp, index) => (
              <div 
                key={exp.id} 
                className={`flex mb-20 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} relative`}
              >
                <div className="w-8 h-8 absolute left-1/2 transform -translate-x-1/2 bg-black dark:bg-white rounded-full z-10" />
                
                <div className={`w-5/12 px-4 ${index % 2 === 0 ? 'text-right pr-16' : 'text-left pl-16'}`}>
                  <h3 className="text-xl font-bold text-black dark:text-white">{exp.role}</h3>
                  <div className="text-gray-700 dark:text-gray-300 font-medium">{exp.company}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{exp.period}</div>
                </div>
                
                <div className="w-2/12 flex justify-center">
                  <div className="w-1 bg-black dark:bg-white h-full rounded-full" />
                </div>
                
                <div className={`w-5/12 px-4 ${index % 2 === 0 ? 'text-left pl-16' : 'text-right pr-16'}`}>
                  <p className="text-gray-600 dark:text-gray-400">
                    {exp.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* About Section - Split Layout
        <section id="about" className="min-h-screen relative">
          <div className="absolute inset-0">
            <div className="h-full w-full md:w-1/2 bg-white dark:bg-black absolute top-0 left-0" />
            <div className="h-full w-full md:w-1/2 bg-gray-100 dark:bg-gray-900 absolute top-0 right-0" />
          </div>
          
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-0 min-h-screen">
            <div className="px-8 md:px-16 py-24 flex flex-col justify-center">
              <h2 className="text-5xl font-bold mb-12 text-black dark:text-white transform -rotate-2">
                About Me
              </h2>
              
              <div className="space-y-6 max-w-xl">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  I'm a passionate developer with a background in [your background]. 
                  With over [number] years of experience in the industry, I've had the 
                  opportunity to work on a diverse range of projects from [type of projects].
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  My approach to development focuses on creating clean, efficient code 
                  that delivers exceptional user experiences. I'm particularly interested 
                  in [your interests/specialties].
                </p>
              </div>
            </div>
            
            <div className="px-8 md:px-16 py-24 flex flex-col justify-center">
              <h3 className="text-2xl font-bold mb-8 text-black dark:text-white">Skills</h3>
              

              
              <div className="mt-12 relative">
                <div className="rounded-xl overflow-hidden shadow-lg transform rotate-2 transition-transform duration-500 hover:rotate-0">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                    alt="About me" 
                    className="w-full h-auto object-cover" 
                  />
                </div>
              </div>
            </div>
          </div>
        </section> */}

        {/* Footer */}
        <footer className="bg-black dark:bg-white text-white dark:text-black py-12 relative overflow-hidden">
          <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start">
              <div className="mb-8 md:mb-0">
                <h2 className="text-3xl font-bold mb-4">Bohan Wang</h2>
                <p className="text-gray-400 dark:text-gray-600">© {new Date().getFullYear()} All Rights Reserved</p>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <a href="#" className="w-12 h-12 rounded-full flex items-center justify-center border border-white/30 dark:border-black/30 hover:bg-white/10 dark:hover:bg-black/10 transition-colors duration-300">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="w-12 h-12 rounded-full flex items-center justify-center border border-white/30 dark:border-black/30 hover:bg-white/10 dark:hover:bg-black/10 transition-colors duration-300">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                <a href="#" className="w-12 h-12 rounded-full flex items-center justify-center border border-white/30 dark:border-black/30 hover:bg-white/10 dark:hover:bg-black/10 transition-colors duration-300">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* Minimalist Project Modal */}
      {selectedProject && (
        <div 
          className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 transition-all duration-300 ${showDescription ? 'opacity-100' : 'opacity-0'}`}
          onClick={closeProjectDescription}
        >
          <div 
            className={`bg-white dark:bg-black max-w-5xl w-full rounded-none shadow-2xl overflow-hidden transition-all duration-500 ${showDescription ? 'translate-y-0 scale-100' : 'translate-y-10 scale-95'}`}
            onClick={(e) => e.stopPropagation()}
          >
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
      <div className="fixed top-0 left-0 right-0 md:hidden z-50 bg-gray-100 dark:bg-gray-900 shadow-lg">
        <div className="flex justify-center items-center space-x-8 px-6 py-4">
          <button 
            onClick={() => scrollToSection('home')}
            className={`text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors duration-300 ${activeSection === 'home' ? 'font-bold text-black dark:text-white' : ''}`}
          >
            Home
          </button>
          <button 
            onClick={() => scrollToSection('about')}
            className={`text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors duration-300 ${activeSection === 'about' ? 'font-bold text-black dark:text-white' : ''}`}
          >
            About
          </button>
          <button 
            onClick={() => scrollToSection('projects')}
            className={`text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors duration-300 ${activeSection === 'projects' ? 'font-bold text-black dark:text-white' : ''}`}
          >
            Projects
          </button>

          <button 
            onClick={() => scrollToSection('experience')}
            className={`text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors duration-300 ${activeSection === 'experience' ? 'font-bold text-black dark:text-white' : ''}`}
          >
            Experience
          </button>
        </div>
      </div>

      {/* Floating Side Navigation - Hide on mobile */}
      <div className="fixed -left-44 top-1/2 -translate-y-1/2 transform rotate-90 z-50 hidden md:flex items-center space-x-12 px-6 py-4 bg-gray-100 dark:bg-gray-900 shadow-lg rounded-t-lg">
        <button 
          onClick={() => scrollToSection('home')}
          className={`text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors duration-300 ${activeSection === 'home' ? 'font-bold text-black dark:text-white' : ''}`}
        >
          Home
        </button>
        <button 
          onClick={() => scrollToSection('about')}
          className={`text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors duration-300 ${activeSection === 'about' ? 'font-bold text-black dark:text-white' : ''}`}
        >
          About
        </button>
        <button 
          onClick={() => scrollToSection('projects')}
          className={`text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors duration-300 ${activeSection === 'projects' ? 'font-bold text-black dark:text-white' : ''}`}
        >
          Projects
        </button>
        <button 
          onClick={() => scrollToSection('experience')}
          className={`text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors duration-300 ${activeSection === 'experience' ? 'font-bold text-black dark:text-white' : ''}`}
        >
          Experience
        </button>
      </div>
    </div>
  )
}

export default App
