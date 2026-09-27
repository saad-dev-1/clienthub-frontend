import { Menu } from 'lucide-react';
import { useAuth } from '../../context/useAuth';

export default function Topbar({ title, onMenuClick }) {
  const { user } = useAuth();

  return (
    <header className="h-15 bg-bg-base border-b border-border flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors"
        >
          <Menu size={18} strokeWidth={2} />
        </button>

        <h1 className="text-base font-semibold text-text-primary truncate">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-accent-subtle flex items-center justify-center text-accent text-xs font-semibold">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}