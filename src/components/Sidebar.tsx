import React from 'react';
import { useAppStore } from '../store/appStore';
import { Menu, LayoutDashboard, CreditCard, TrendingUp } from 'lucide-react';

interface SidebarProps {
  onNavigate?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate }) => {
  const { activeSection, setActiveSection } = useAppStore();

  const menuItems = [
    { id: 'home', label: 'Home', icon: Menu },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: CreditCard },
    { id: 'insights', label: 'Insights', icon: TrendingUp },
  ] as const;

  return (
    <aside className="w-72 bg-white dark:bg-dark-800 border-r border-gray-200 dark:border-dark-700 h-screen fixed md:sticky top-0 shadow-sm">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">Z</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Zorvyn</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Finance Console</p>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                setActiveSection(id);
                onNavigate?.();
              }}
              className={`sidebar-item w-full text-left flex items-center gap-3 ${
                activeSection === id ? 'active' : ''
              }`}
            >
              <Icon size={20} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 dark:border-dark-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
            <span className="text-primary-700 dark:text-primary-400 font-bold">U</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">User</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">user@example.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
