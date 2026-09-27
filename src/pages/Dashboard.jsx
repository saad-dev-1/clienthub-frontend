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
      <div className="mb-8">
        <h2 className="text-3xl heading-tightest text-text-primary mb-1.5">
          {greeting}, {firstName}
        </h2>
        <p className="text-sm text-text-muted">
          Here's what's happening with your business today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
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
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold heading-tight text-text-primary">
              Recent Projects
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              Your most recently updated work
            </p>
          </div>
          <Link
            to="/projects"
            className="text-xs text-text-muted hover:text-text-primary transition-colors inline-flex items-center gap-1"
          >
            View all
            <ArrowRight size={12} strokeWidth={2} />
          </Link>
        </div>

        {!data?.recent_projects || data.recent_projects.length === 0 ? (
          <div className="card text-center py-12">
            <div className="w-12 h-12 rounded-xl bg-bg-hover flex items-center justify-center mx-auto mb-4">
              <FolderKanban
                size={20}
                strokeWidth={1.75}
                className="text-text-subtle"
              />
            </div>
            <h4 className="text-sm font-semibold text-text-primary mb-1">
              No projects yet
            </h4>
            <p className="text-xs text-text-muted mb-4">
              Create your first project to get started.
            </p>
            <Link to="/projects" className="btn-primary inline-flex">
              Go to Projects
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {data.recent_projects.map((project) => (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="card card-hover block p-5"
              >
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="text-sm font-medium text-text-primary truncate">
                      {project.name}
                    </span>
                    <span
                      className={`${
                        statusStyles[project.status] || 'badge-neutral'
                      } flex-shrink-0`}
                    >
                      {(project.status || 'active').replace('_', ' ')}
                    </span>
                  </div>
                  <span className="text-xs text-text-muted tabular-nums flex-shrink-0 font-medium">
                    {project.progress || 0}%
                  </span>
                </div>

                <div className="h-1.5 bg-bg-hover rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent transition-all duration-500 rounded-full"
                    style={{ width: `${project.progress || 0}%` }}
                  />
                </div>

                {project.client && (
                  <p className="text-xs text-text-subtle mt-3 truncate">
                    <span className="text-text-muted">Client:</span>{' '}
                    {project.client.name}
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
    <div className="card card-hover p-5">
      <div className="flex items-center justify-between mb-3 gap-2">
        <p className="text-[10px] sm:text-xs font-medium uppercase tracking-wider text-text-subtle truncate">
          {label}
        </p>
        <div className="w-7 h-7 rounded-lg bg-bg-hover flex items-center justify-center flex-shrink-0">
          <Icon
            size={14}
            strokeWidth={1.75}
            className="text-text-muted"
          />
        </div>
      </div>
      <p className="text-2xl font-semibold text-text-primary tabular-nums heading-tight">
        {value}
      </p>
    </div>
  );
}