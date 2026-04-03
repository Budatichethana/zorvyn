import React from 'react';
import { useAppStore } from '../store/appStore';
import { House, LayoutDashboard, CreditCard, TrendingUp } from 'lucide-react';

interface SidebarProps {
  onNavigate?: () => void;
  isSidebarOpen?: boolean;
  isMobile?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate, isSidebarOpen = true, isMobile = false }) => {
  const { activeSection, setActiveSection } = useAppStore();

  const menuItems = [
    { id: 'home', label: 'Home', icon: House },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: CreditCard },
    { id: 'insights', label: 'Insights', icon: TrendingUp },
  ] as const;

  const showCollapsedDesktop = !isSidebarOpen && !isMobile;
  const collapsedItemBaseClass = 'group relative h-12 w-12 p-0 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 text-gray-700 dark:text-gray-300';
  const expandedItemBaseClass = 'sidebar-item w-full text-left flex items-center gap-3';
  const sidebarIconClass = 'h-5 w-5';
  const sidebarIconStroke = 1.75;

  return (
    <aside className="w-full bg-white dark:bg-dark-800 border-r border-gray-200 dark:border-dark-700 h-screen md:sticky top-0 shadow-sm transition-all duration-300">
      <div className={`h-full flex flex-col ${showCollapsedDesktop ? 'p-3' : 'p-6'} transition-all duration-300`}>
        <div className={`flex items-center ${showCollapsedDesktop ? 'justify-center mb-2' : 'gap-3 mb-8'} transition-all duration-300`}>
          <div className={`${showCollapsedDesktop ? 'w-12 h-12 rounded-xl' : 'w-10 h-10 rounded-lg'} bg-primary-600 flex items-center justify-center`}>
            <span className="text-white font-bold text-lg">Z</span>
          </div>
          <div className={`overflow-hidden transition-all duration-300 ${showCollapsedDesktop ? 'max-w-0 opacity-0' : 'max-w-[160px] opacity-100'}`}>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white whitespace-nowrap">Zorvyn</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">Finance Console</p>
          </div>
        </div>

        <nav className={showCollapsedDesktop ? 'flex flex-col items-center gap-2' : 'space-y-2'}>
          {menuItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                setActiveSection(id);
                onNavigate?.();
              }}
              className={`group relative transition-all duration-200 ${showCollapsedDesktop
                ? `${collapsedItemBaseClass} ${
                    activeSection === id
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 shadow-sm'
                      : 'hover:bg-gray-100 dark:hover:bg-dark-700'
                  }`
                : `${expandedItemBaseClass} ${activeSection === id ? 'active' : ''}`
              }`}
              aria-label={label}
            >
              <Icon className={sidebarIconClass} strokeWidth={sidebarIconStroke} />
              {(isSidebarOpen || isMobile) && <span>{label}</span>}
              {showCollapsedDesktop && (
                <span className="sidebar-collapsed-tooltip">
                  {label}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className={`mt-auto border-t border-gray-200 dark:border-dark-700 ${showCollapsedDesktop ? 'pt-3' : 'pt-6'} transition-all duration-300`}>
          <div className={`group relative flex items-center ${showCollapsedDesktop ? 'justify-center' : 'gap-3'}`}>
            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
              <span className="text-primary-700 dark:text-primary-400 font-bold">U</span>
            </div>
            <div className={`overflow-hidden transition-all duration-300 ${showCollapsedDesktop ? 'max-w-0 opacity-0' : 'max-w-[180px] opacity-100'}`}>
              <p className="text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">User</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">user@example.com</p>
            </div>
            {showCollapsedDesktop && (
              <span className="sidebar-collapsed-tooltip">
                User
              </span>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
