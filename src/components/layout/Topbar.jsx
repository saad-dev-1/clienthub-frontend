import { useAuth } from '../../context/useAuth';

export default function Topbar({ title }) {
  const { user } = useAuth();

  return (
    <header className="h-15 bg-bg-base border-b border-border flex items-center justify-between px-6 sticky top-0 z-10">
      <h1 className="text-base font-semibold text-text-primary">
        {title}
      </h1>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-accent-subtle flex items-center justify-center text-accent text-xs font-semibold">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}