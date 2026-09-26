import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderKanban,
  Users,
  CheckSquare,
  DollarSign,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/useAuth';
import { dashboardApi } from '../api/dashboard';

const statusStyles = {
  active: 'badge-accent',
  completed: 'badge-success',
  on_hold: 'badge-warning',
};

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await dashboardApi.get();
      setData(response);
    } catch (err) {
      console.error('Dashboard fetch error:', err.response?.data);
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const firstName = user?.name?.split(' ')[0] || 'there';
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={20} className="text-text-muted animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Greeting */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-text-primary mb-1">
          {greeting}, {firstName} 👋
        </h2>
        <p className="text-sm text-text-muted">
          Here's what's happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Active Projects"
          value={data?.stats?.active_projects || 0}
          icon={FolderKanban}
        />
        <StatCard
          label="Clients"
          value={data?.stats?.clients || 0}
          icon={Users}
        />
        <StatCard
          label="Pending Tasks"
          value={data?.stats?.pending_tasks || 0}
          icon={CheckSquare}
        />
        <StatCard
          label="Revenue"
          value={`$${data?.stats?.revenue || 0}`}
          icon={DollarSign}
        />
      </div>

      {/* Recent Projects */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-text-primary">
            Recent Projects
          </h3>
          <Link
            to="/projects"
            className="text-xs text-text-muted hover:text-text-primary transition-colors inline-flex items-center gap-1"
          >
            View all
            <ArrowRight size={12} strokeWidth={2} />
          </Link>
        </div>

        {!data?.recent_projects || data.recent_projects.length === 0 ? (
          <div className="card text-center py-8">
            <p className="text-sm text-text-muted">
              No projects yet. Create your first project to get started.
            </p>
            <Link to="/projects" className="btn-primary mt-4 inline-flex">
              Go to Projects
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {data.recent_projects.map((project) => (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="block card p-4 hover:border-border-strong transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-text-primary">
                      {project.name}
                    </span>
                    <span
                      className={
                        statusStyles[project.status] || 'badge-neutral'
                      }
                    >
                      {project.status.replace('_', ' ')}
                    </span>
                  </div>
                  <span className="text-xs text-text-muted tabular-nums">
                    {project.progress}%
                  </span>
                </div>
                <div className="h-1.5 bg-bg-hover rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                {project.client && (
                  <p className="text-xs text-text-subtle mt-2">
                    Client: {project.client.name}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium uppercase tracking-wide text-text-subtle">
          {label}
        </p>
        <Icon size={16} strokeWidth={1.75} className="text-text-subtle" />
      </div>
      <p className="text-2xl font-semibold text-text-primary tabular-nums">
        {value}
      </p>
    </div>
  );
}