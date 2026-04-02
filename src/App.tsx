import { useEffect, useState } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import Home from './components/Home'
import Dashboard from './components/Dashboard'
import Transactions from './components/Transactions'
import Insights from './components/Insights'
import { useAppStore } from './store/appStore'
import { Menu, MoonStar, SunMedium } from 'lucide-react'
import Button from './components/ui/Button'

function App() {
  const { activeSection, role, setRole, theme, toggleTheme } = useAppStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const isDark = theme === 'dark'
    const root = document.documentElement
    const body = document.body

    root.classList.toggle('dark', isDark)
    body.classList.toggle('dark', isDark)
    root.style.colorScheme = isDark ? 'dark' : 'light'
  }, [theme])

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
      <div className="hidden md:block md:shrink-0">
        <Sidebar />
      </div>

      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-20 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      )}
      <div className={`fixed top-0 left-0 z-30 h-full w-72 transform transition-transform duration-300 md:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar onNavigate={() => setSidebarOpen(false)} />
      </div>

      <main className="flex-1 overflow-auto">
        <div className="sticky top-0 z-10 bg-white/95 dark:bg-dark-800/95 backdrop-blur border-b border-gray-200 dark:border-dark-700 px-4 md:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 md:gap-3">
              <Button variant="ghost" className="md:hidden p-2" onClick={() => setSidebarOpen(true)}>
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
              <select
                id="role-select"
                value={role}
                onChange={(e) => setRole(e.target.value as 'viewer' | 'admin')}
                className="surface-input w-36"
              >
                <option value="viewer">Viewer</option>
                <option value="admin">Admin</option>
              </select>
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
