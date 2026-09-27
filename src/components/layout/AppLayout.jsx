import { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function AppLayout({ title }) {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:ml-60">
        <Topbar
          title={title}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="p-4 sm:p-6 max-w-[1200px] w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}