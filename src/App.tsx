import { useEffect, useRef, useState } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import Home from './components/Home'
import Dashboard from './components/Dashboard'
import Transactions from './components/Transactions'
import Insights from './components/Insights'
import { useAppStore } from './store/appStore'
import { ChevronDown, Menu, MoonStar, SunMedium } from 'lucide-react'
import Button from './components/ui/Button'

function App() {
  const { activeSection, role, setRole, theme, toggleTheme } = useAppStore()
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [roleMenuOpen, setRoleMenuOpen] = useState(false)
  const [highlightedRoleIndex, setHighlightedRoleIndex] = useState(0)
  const roleDropdownRef = useRef<HTMLDivElement | null>(null)
  const roleListRef = useRef<HTMLUListElement | null>(null)

  const roleOptions: Array<{ value: 'viewer' | 'admin'; label: string }> = [
    { value: 'viewer', label: 'Viewer' },
    { value: 'admin', label: 'Admin' },
  ]

  useEffect(() => {
    const isDark = theme === 'dark'
    const root = document.documentElement
    const body = document.body

    root.classList.toggle('dark', isDark)
    body.classList.toggle('dark', isDark)
    root.style.colorScheme = isDark ? 'dark' : 'light'
  }, [theme])

  useEffect(() => {
    setHighlightedRoleIndex(roleOptions.findIndex((item) => item.value === role))
  }, [role])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(target)) {
        setRoleMenuOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setRoleMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  useEffect(() => {
    if (roleMenuOpen && roleListRef.current) {
      roleListRef.current.focus()
    }
  }, [roleMenuOpen])

  const selectedRoleLabel = roleOptions.find((item) => item.value === role)?.label ?? 'Viewer'

  const selectRoleAtIndex = (index: number) => {
    const option = roleOptions[index]
    if (!option) {
      return
    }

    setRole(option.value)
    setRoleMenuOpen(false)
  }

  const handleRoleButtonKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setRoleMenuOpen(true)
      setHighlightedRoleIndex(roleOptions.findIndex((item) => item.value === role))
    }
  }

  const handleRoleListKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setHighlightedRoleIndex((prev) => (prev + 1) % roleOptions.length)
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setHighlightedRoleIndex((prev) => (prev - 1 + roleOptions.length) % roleOptions.length)
      return
    }

    if (event.key === 'Home') {
      event.preventDefault()
      setHighlightedRoleIndex(0)
      return
    }

    if (event.key === 'End') {
      event.preventDefault()
      setHighlightedRoleIndex(roleOptions.length - 1)
      return
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      selectRoleAtIndex(highlightedRoleIndex)
      return
    }

    if (event.key === 'Escape' || event.key === 'Tab') {
      setRoleMenuOpen(false)
    }
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return <Home />
      case 'dashboard':
        return <Dashboard />
      case 'transactions':
        return <Transactions />
      case 'insights':
        return <Insights />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-dark-900">
      <div className={`hidden md:block md:shrink-0 transition-[width] duration-300 ${isSidebarOpen ? 'w-[240px]' : 'w-[72px]'}`}>
        <Sidebar isSidebarOpen={isSidebarOpen} />
      </div>

      {mobileSidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-20 bg-black/40 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      )}
      <div className={`fixed top-0 left-0 z-30 h-full w-[240px] transform transition-transform duration-300 md:hidden ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar onNavigate={() => setMobileSidebarOpen(false)} isMobile isSidebarOpen />
      </div>

      <main className="flex-1 overflow-auto">
        <div className="sticky top-0 z-10 bg-white/95 dark:bg-dark-800/95 backdrop-blur border-b border-gray-200 dark:border-dark-700 px-4 md:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 md:gap-3">
              <Button variant="ghost" className="md:hidden p-2" onClick={() => setMobileSidebarOpen(true)}>
                <Menu size={18} />
              </Button>
              <Button
                variant="ghost"
                className="hidden md:inline-flex p-2"
                onClick={() => setIsSidebarOpen((prev) => !prev)}
                aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
              >
                <Menu size={18} />
              </Button>
              <div>
                <h1 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white leading-tight">Zorvyn Finance</h1>
                <p className="hidden md:block text-xs text-gray-500 dark:text-gray-400">Global finance dashboard</p>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <Button
                variant="ghost"
                className="px-3 py-2 flex items-center gap-2"
                onClick={toggleTheme}
                aria-label="Toggle dark mode"
              >
                {theme === 'dark' ? <SunMedium size={16} /> : <MoonStar size={16} />}
                <span className="hidden sm:inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
              </Button>
              <label htmlFor="role-select" className="panel-label hidden sm:block">
                Role
              </label>
              <div className="relative w-36" ref={roleDropdownRef}>
                <button
                  id="role-select"
                  type="button"
                  className={`role-dropdown-trigger ${roleMenuOpen ? 'open' : ''}`}
                  onClick={() => setRoleMenuOpen((prev) => !prev)}
                  onKeyDown={handleRoleButtonKeyDown}
                  aria-haspopup="listbox"
                  aria-expanded={roleMenuOpen}
                  aria-controls="role-listbox"
                >
                  <span className="text-sm font-medium text-gray-100">{selectedRoleLabel}</span>
                  <ChevronDown
                    size={16}
                    className={`text-gray-300 transition-transform duration-200 ${roleMenuOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {roleMenuOpen && (
                  <ul
                    id="role-listbox"
                    role="listbox"
                    aria-label="Select role"
                    tabIndex={-1}
                    ref={roleListRef}
                    className="role-dropdown-menu dropdown-pop"
                    onKeyDown={handleRoleListKeyDown}
                    aria-activedescendant={`role-option-${roleOptions[highlightedRoleIndex]?.value}`}
                  >
                    {roleOptions.map((option, index) => {
                      const isSelected = role === option.value
                      const isHighlighted = highlightedRoleIndex === index

                      return (
                        <li key={option.value} id={`role-option-${option.value}`} role="option" aria-selected={isSelected}>
                          <button
                            type="button"
                            className={`role-dropdown-option ${isSelected ? 'selected' : ''} ${isHighlighted ? 'highlighted' : ''}`}
                            onMouseEnter={() => setHighlightedRoleIndex(index)}
                            onClick={() => selectRoleAtIndex(index)}
                          >
                            <span>{option.label}</span>
                            {isSelected && <span className="text-xs font-semibold text-primary-300">Current</span>}
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
        <div key={activeSection} className="max-w-7xl mx-auto w-full px-4 md:px-6 lg:px-8 py-6 section-enter">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}

export default App
