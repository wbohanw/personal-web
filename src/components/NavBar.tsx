type NavBarProps = {
  activeSection: string
  onNavigate: (section: string) => void
}

const sections = ['home', 'about', 'projects', 'experience']

export default function NavBar({ activeSection, onNavigate }: NavBarProps) {
  return (
    <>
      {/* Mobile Top Navigation */}
      <div className="fixed left-0 right-0 md:hidden z-40 bg-gray-100 shadow-lg justify-between" style={{ top: '32px' }}>
        <div className="px-8 py-4 max-w-7xl justify-between flex">
          {sections.map(section => (
            <button
              key={section}
              onClick={() => onNavigate(section)}
              className={`text-gray-700 hover:text-black dark:hover:text-gray-700/70 cursor-pointer transition-colors duration-300 ${activeSection === section ? 'font-bold text-black dark:text-white' : ''}`}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Floating Side Navigation - Desktop only */}
      <div className="fixed -left-44 top-1/2 -translate-y-1/2 transform rotate-90 z-50 hidden md:flex items-center space-x-12 px-6 py-4 bg-gray-100 shadow-lg rounded-t-lg">
        {sections.map(section => (
          <button
            key={section}
            onClick={() => onNavigate(section)}
            className={`text-gray-700 hover:text-black dark:hover:text-gray-700/70 cursor-pointer transition-colors duration-300 ${activeSection === section ? 'font-bold text-black' : ''}`}
          >
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </button>
        ))}
      </div>
    </>
  )
}
