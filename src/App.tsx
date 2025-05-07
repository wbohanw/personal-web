import { useState, useEffect, useRef } from 'react'
import './App.css'
// import Spline from '@splinetool/react-spline/next';


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
}

function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [activeSection, setActiveSection] = useState('projects')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [showDescription, setShowDescription] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioAllowed, setAudioAllowed] = useState(false)
  const mainRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Sample projects data - replace with your actual projects
  const projects: Project[] = [
    {
      id: 1,
      title: "Interactive Data Visualization",
      description: "A React-based dashboard for visualizing complex datasets with interactive charts and filters.",
      tags: ["React", "D3.js", "TypeScript"],
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      content: [
        { type: 'text', data: 'Created a comprehensive data visualization platform using React and D3.js. The application allows users to interact with complex datasets through customizable charts and graphs.' },
        { type: 'image', data: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
        { type: 'video', data: 'https://www.example.com/video1.mp4' }
      ]
    },
    {
      id: 2,
      title: "AI-Powered Content Generator",
      description: "An application that uses machine learning to generate high-quality content based on user input.",
      tags: ["Python", "TensorFlow", "NLP"],
      image: "https://images.unsplash.com/photo-1677442135071-c453979243d2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      content: [
        { type: 'text', data: 'Developed an AI-powered content generation tool using Python and TensorFlow. The system leverages natural language processing to create coherent and contextually relevant content.' },
        { type: 'image', data: 'https://images.unsplash.com/photo-1677442135071-c453979243d2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' }
      ]
    },
    {
      id: 3,
      title: "E-commerce Platform Redesign",
      description: "A complete redesign of an e-commerce platform focusing on user experience and conversion optimization.",
      tags: ["UX/UI", "Next.js", "Tailwind CSS"],
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      content: [
        { type: 'text', data: 'Led the complete redesign of an e-commerce platform, focusing on improving user experience and conversion rates. Implemented modern UI elements and streamlined checkout process.' },
        { type: 'image', data: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
        { type: 'video', data: 'https://www.example.com/video2.mp4' }
      ]
    },
    {
      id: 4,
      title: "Blockchain-based Supply Chain Tracker",
      description: "A supply chain management system built on blockchain technology for enhanced transparency and security.",
      tags: ["Blockchain", "Solidity", "React"],
      image: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      content: [
        { type: 'text', data: 'Built a blockchain-based supply chain tracking system that enhances transparency and security throughout the logistics process. Implemented smart contracts using Solidity.' },
        { type: 'image', data: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' }
      ]
    },
    {
      id: 5,
      title: "Mobile Health App",
      description: "A mobile application focused on personal health tracking and wellness advice.",
      tags: ["React Native", "Firebase", "Health API"],
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      content: [
        { type: 'text', data: 'Designed and developed a mobile health application that helps users track fitness goals, monitor vital signs, and receive personalized wellness recommendations.' },
        { type: 'image', data: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
        { type: 'video', data: 'https://www.example.com/video3.mp4' }
      ]
    }
  ]

  // Experience data - replace with your actual experience
  const experiences = [
    {
      id: 1,
      company: "TechCorp Inc.",
      role: "Senior Frontend Developer",
      period: "2021 - Present",
      description: "Led development of multiple client-facing applications using React and TypeScript. Improved performance metrics by 45% through code optimization."
    },
    {
      id: 2,
      company: "Digital Solutions Ltd.",
      role: "Full Stack Developer",
      period: "2018 - 2021",
      description: "Developed and maintained full-stack web applications. Implemented RESTful APIs and database architecture."
    },
    {
      id: 3,
      company: "StartupHub",
      role: "Junior Developer",
      period: "2016 - 2018",
      description: "Contributed to development of MVP for various startup projects. Gained experience in agile development methodologies."
    }
  ]

  // Music auto-play functionality
  useEffect(() => {
    if (audioAllowed && audioRef.current) {
      audioRef.current.volume = 0.3; // Set lower volume
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(error => {
        console.log("Audio play prevented:", error);
        setIsPlaying(false);
      });
    }
  }, [audioAllowed]);

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

  // Asymmetric grid layout configuration
  const getGridLayout = (index: number) => {
    const layouts = [
      'col-span-2 row-span-2 h-[550px] -rotate-1 translate-y-6',
      'col-span-1 row-span-1 h-[280px] rotate-1 translate-x-4',
      'col-span-1 row-span-2 h-[450px] -rotate-1 -translate-x-2',
      'col-span-2 row-span-1 h-[320px] rotate-2 translate-y-4',
      'col-span-1 row-span-1 h-[300px] -rotate-2 translate-x-6',
    ];
    return layouts[index % layouts.length];
  };

  // Track cursor position for interactive elements
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toggle dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  // Function to handle project click
  const handleProjectClick = (project: Project) => {
    setSelectedProject(project)
    setShowDescription(true)
    document.body.style.overflow = 'hidden'
  }

  // Function to close project description
  const closeProjectDescription = () => {
    setShowDescription(false)
    document.body.style.overflow = ''
    setTimeout(() => setSelectedProject(null), 300)
  }

  // Project card with distorted hover effect
  const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
    const cardRef = useRef<HTMLDivElement>(null)
    const [isHovered, setIsHovered] = useState(false)
    
    const randomRotation = Math.floor(Math.random() * 5) * (Math.random() > 0.5 ? 1 : -1)
    const randomOffset = Math.floor(Math.random() * 10)

    return (
      <div
        ref={cardRef}
        className={`group relative overflow-hidden ${getGridLayout(index)} transition-all duration-700`}
        style={{ 
          clipPath: isHovered 
            ? 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' 
            : `polygon(${randomOffset}px ${randomOffset}px, calc(100% - ${randomOffset}px) ${randomOffset}px, calc(100% - ${randomOffset}px) calc(100% - ${randomOffset}px), ${randomOffset}px calc(100% - ${randomOffset}px))`
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => handleProjectClick(project)}
      >
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url(${project.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
        <div 
          className={`absolute bottom-0 left-0 right-0 p-6 text-white z-10 space-y-3 transition-transform duration-500 ${isHovered ? 'translate-y-0' : 'translate-y-6'}`}
        >
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag, i) => (
              <span 
                key={i}
                className="px-3 py-1 text-xs font-medium bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300"
                style={{ 
                  borderRadius: `${Math.random() * 10 + 10}px ${Math.random() * 10 + 10}px ${Math.random() * 10 + 10}px ${Math.random() * 10 + 10}px`
                }}
              >
                {tag}
              </span>
            ))}
          </div>
          <h3 className="text-2xl font-bold drop-shadow-md">{project.title}</h3>
          <p className="text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {project.description}
          </p>
        </div>
      </div>
    )
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
    <div className="min-h-screen font-sans antialiased overflow-x-hidden bg-white dark:bg-black transition-colors duration-300">
      {/* Background Audio Player */}
      <audio 
        ref={audioRef} 
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" 
        loop
      />

      {/* Music Control Button */}
      <div className="fixed left-8 bottom-8 z-50 flex items-center gap-3">
        {!audioAllowed ? (
          <button 
            onClick={() => setAudioAllowed(true)}
            className="flex items-center justify-center p-3 bg-black dark:bg-white text-white dark:text-black rounded-full shadow-lg hover:scale-105 transform transition-transform duration-300"
          >
            <span className="text-xs font-medium mr-2">Play Music</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        ) : (
          <button 
            onClick={toggleMusic}
            className="flex items-center justify-center p-3 bg-black/80 dark:bg-white/80 text-white dark:text-black rounded-full shadow-lg hover:scale-105 transform transition-transform duration-300"
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </button>
        )}
        
        {isPlaying && (
          <div className="flex items-center gap-1 h-4">
            {[...Array(4)].map((_, i) => (
              <div 
                key={i} 
                className="w-0.5 h-full bg-black dark:bg-white rounded-full animate-sound-wave" 
                style={{ animationDelay: `${i * 0.2}s` }}
              ></div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Navigation */}
      <div className="fixed -left-16 top-1/2 -translate-y-1/2 transform rotate-90 z-50 flex items-center space-x-12 px-6 py-4 bg-gray-100 dark:bg-gray-900 shadow-lg rounded-t-lg">
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
        <button 
          onClick={() => scrollToSection('about')}
          className={`text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors duration-300 ${activeSection === 'about' ? 'font-bold text-black dark:text-white' : ''}`}
        >
          About
        </button>
      </div>

      {/* Dark Mode Toggle - Corner Circle */}
      <button 
        onClick={() => setDarkMode(!darkMode)}
        className="fixed right-8 top-8 w-12 h-12 flex items-center justify-center rounded-full bg-gray-900 dark:bg-white text-white dark:text-black shadow-lg z-50 transform hover:scale-110 transition-transform duration-300"
        aria-label="Toggle Dark Mode"
      >
        {darkMode ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>

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
        <section className="min-h-screen grid grid-cols-1 md:grid-cols-3 relative">
          <div className="md:col-span-2 flex flex-col justify-center px-12 md:px-24 py-24">
            <h1 className="text-6xl md:text-8xl font-bold mb-8 text-black dark:text-white leading-tight">
              Your<br/>Name
            </h1>
            <p className="text-xl max-w-xl text-gray-600 dark:text-gray-400 mb-12">
              Creative developer with a passion for building beautiful, interactive digital experiences.
            </p>
            <div className="flex flex-wrap gap-6">
              <button className="px-8 py-3 bg-black hover:bg-gray-900 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-black font-medium transition-all duration-300 transform hover:-translate-y-1">
                Download CV
              </button>
              <button className="px-8 py-3 border-2 border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black font-medium transition-all duration-300 transform hover:-translate-y-1">
                Contact Me
              </button>
            </div>
          </div>
          <div className="hidden md:block relative overflow-hidden">
            <div className="absolute inset-0 bg-gray-100 dark:bg-gray-900 transform -skew-x-6" />
            <div className="absolute inset-0 flex items-center justify-center p-12">
              <div className="w-64 h-64 rounded-full overflow-hidden border-8 border-white dark:border-gray-800 shadow-2xl transform hover:rotate-6 transition-transform duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  alt="Profile" 
                  className="w-full h-full object-cover" 
                />
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section - Asymmetric Grid */}
        <section id="projects" className="min-h-screen px-8 md:px-16 py-24 relative">
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-white dark:from-black to-transparent z-10" />
          
          <h2 className="text-5xl font-bold mb-16 text-black dark:text-white -rotate-1 transform translate-x-6">
            Featured Projects
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 auto-rows-auto">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        </section>

        {/* Experience Section - Zigzag Timeline */}
        <section id="experience" className="min-h-screen px-8 md:px-16 py-24 bg-gray-50 dark:bg-gray-950 relative">
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

        {/* About Section - Split Layout */}
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
              
              <div className="grid grid-cols-4 gap-6">
                {['JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'CSS/SCSS', 'Tailwind', 'Git'].map((skill, i) => (
                  <div 
                    key={i} 
                    className="aspect-square flex items-center justify-center bg-white dark:bg-black p-4 shadow-md transform hover:rotate-3 hover:scale-110 transition-all duration-300"
                    style={{ 
                      transform: `rotate(${(i % 4) * 3 - 4}deg)`,
                      borderRadius: `${Math.random() * 20 + 10}% ${Math.random() * 20 + 10}% ${Math.random() * 20 + 10}% ${Math.random() * 20 + 10}%`,
                    }}
                  >
                    <span className="text-sm font-medium text-center text-black dark:text-white">{skill}</span>
                  </div>
                ))}
              </div>
              
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
        </section>

        {/* Footer */}
        <footer className="bg-black dark:bg-white text-white dark:text-black py-12 relative overflow-hidden">
          <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start">
              <div className="mb-8 md:mb-0">
                <h2 className="text-3xl font-bold mb-4">Your Name</h2>
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
          <div className="absolute inset-0 opacity-30">
            {Array.from({ length: 20 }).map((_, i) => (
              <div 
                key={i}
                className="absolute bg-gray-400 dark:bg-gray-700"
                style={{
                  width: `${Math.random() * 300 + 50}px`,
                  height: '1px',
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              />
            ))}
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
    </div>
  )
}

export default App
