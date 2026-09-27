import { Menu, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import { useTheme } from '../../context/ThemeContext';

export default function Topbar({ title, onMenuClick }) {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-16 bg-bg-base/80 backdrop-blur-xl border-b border-border flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors"
        >
          <Menu size={18} strokeWidth={2} />
        </button>

        <h1 className="text-base font-semibold text-text-primary truncate heading-tight">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors relative"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <span className="relative block w-4 h-4">
            <Sun
              size={16}
              strokeWidth={1.75}
              className={`absolute inset-0 transition-all duration-300 ${
                theme === 'dark'
                  ? 'opacity-100 rotate-0'
                  : 'opacity-0 -rotate-90'
              }`}
            />
            <Moon
              size={16}
              strokeWidth={1.75}
              className={`absolute inset-0 transition-all duration-300 ${
                theme === 'light'
                  ? 'opacity-100 rotate-0'
                  : 'opacity-0 rotate-90'
              }`}
            />
          </span>
        </button>

        <div className="w-8 h-8 rounded-full bg-accent-subtle flex items-center justify-center text-accent text-xs font-semibold">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}