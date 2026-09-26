import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function AppLayout({ title }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <div className="text-text-muted text-sm">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-bg-base">
      <Sidebar />
      <div className="ml-60">
        <Topbar title={title} />
        <main className="p-6 max-w-[1200px]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}