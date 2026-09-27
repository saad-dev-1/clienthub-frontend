import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  CheckSquare,
  FileText,
  Settings,
  LogOut,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/useAuth';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/clients', icon: Users, label: 'Clients' },
  { to: '/projects', icon: FolderKanban, label: 'Projects' },
  { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { to: '/invoices', icon: FileText, label: 'Invoices' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-50
          w-60 h-screen bg-bg-card border-r border-border
          flex flex-col
          transform transition-transform duration-200 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* Logo + Close (mobile) */}
        <div className="h-15 flex items-center justify-between gap-2 px-5 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
              <span className="text-white font-semibold text-xs">C</span>
            </div>
            <span className="text-sm font-semibold text-text-primary">
              ClientHub
            </span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors"
          >
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-accent-subtle text-accent'
                    : 'text-text-muted hover:text-text-primary hover:bg-bg-hover'
                }`
              }
            >
              <item.icon size={18} strokeWidth={1.75} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-accent-subtle flex items-center justify-center text-accent text-xs font-semibold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">
                {user?.name}
              </p>
              <p className="text-xs text-text-subtle truncate">
                {user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-text-muted hover:text-danger hover:bg-danger/5 transition-colors mt-1"
          >
            <LogOut size={16} strokeWidth={1.75} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>
    </>
  );
}