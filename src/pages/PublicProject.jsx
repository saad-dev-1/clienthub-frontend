import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Circle,
  Clock,
  Loader2,
  Calendar,
  User,
  FolderKanban,
} from 'lucide-react';
import { publicProjectsApi } from '../api/publicApi';

const statusIcon = {
  todo: Circle,
  doing: Clock,
  done: CheckCircle2,
};

const statusColor = {
  todo: 'text-text-subtle',
  doing: 'text-warning',
  done: 'text-success',
};

const projectStatusStyles = {
  active: 'badge-accent',
  completed: 'badge-success',
  on_hold: 'badge-warning',
};

export default function PublicProject() {
  const { token } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await publicProjectsApi.get(token);
      setData(response);
    } catch (err) {
      console.error('Public fetch error:', err.response?.data);
      setError(
        err.response?.status === 404
          ? 'This project link is invalid or has been disabled.'
          : 'Failed to load project.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <Loader2 size={24} className="text-accent animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-12 h-12 rounded-xl bg-danger/10 flex items-center justify-center mx-auto mb-4">
            <FolderKanban size={22} className="text-danger" />
          </div>
          <h1 className="text-lg font-semibold text-text-primary mb-2">
            Link not available
          </h1>
          <p className="text-sm text-text-muted mb-6">
            {error || 'This project link is invalid or has been disabled.'}
          </p>
          <Link to="/" className="btn-primary inline-flex">
            Go to ClientHub
          </Link>
        </div>
      </div>
    );
  }

  const { project, tasks, owner } = data;
  const tasksArray = Array.isArray(tasks) ? tasks : [];
  const doneCount = tasksArray.filter((t) => t.status === 'done').length;
  const progress =
    tasksArray.length > 0
      ? Math.round((doneCount / tasksArray.length) * 100)
      : project.progress || 0;

  return (
    <div className="min-h-screen bg-bg-base">
      {/* Top Bar */}
      <header className="border-b border-border">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
              <span className="text-white font-semibold text-xs">C</span>
            </div>
            <span className="text-sm font-semibold text-text-primary">
              ClientHub
            </span>
          </div>
          <Link
            to="/register"
            className="text-xs text-text-muted hover:text-text-primary transition-colors"
          >
            Powered by ClientHub
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-10">
        {/* Project Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h1 className="text-3xl font-semibold text-text-primary mb-2">
                {project.name}
              </h1>
              {project.description && (
                <p className="text-sm text-text-muted max-w-2xl">
                  {project.description}
                </p>
              )}
            </div>
            <span
              className={
                projectStatusStyles[project.status] || 'badge-neutral'
              }
            >
              {(project.status || 'active').replace('_', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs text-text-muted mt-4">
            {owner?.name && (
              <div className="flex items-center gap-1.5">
                <User size={14} strokeWidth={1.75} />
                <span>Managed by {owner.name}</span>
              </div>
            )}
            {project.deadline && (
              <div className="flex items-center gap-1.5">
                <Calendar size={14} strokeWidth={1.75} />
                <span>
                  Due{' '}
                  {new Date(project.deadline).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Progress Card */}
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium uppercase tracking-wide text-text-subtle">
              Overall Progress
            </span>
            <span className="text-sm font-semibold text-text-primary tabular-nums">
              {progress}%
            </span>
          </div>
          <div className="h-2 bg-bg-hover rounded-full overflow-hidden">
            <div
              className="h-full bg-accent transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-text-subtle mt-3">
            {doneCount} of {tasksArray.length} tasks completed
          </p>
        </div>

        {/* Tasks */}
        <div>
          <h2 className="text-base font-semibold text-text-primary mb-4">
            Tasks
          </h2>

          {tasksArray.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-sm text-text-muted">
                No tasks added yet.
              </p>
            </div>
          ) : (
            <div className="card p-0 divide-y divide-border">
              {tasksArray.map((task) => {
                const Icon = statusIcon[task.status] || Circle;
                return (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-4"
                  >
                    <Icon
                      size={18}
                      strokeWidth={2}
                      className={`flex-shrink-0 ${
                        statusColor[task.status] || 'text-text-subtle'
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm ${
                          task.status === 'done'
                            ? 'text-text-subtle line-through'
                            : 'text-text-primary'
                        }`}
                      >
                        {task.title}
                      </p>
                      {task.due_date && (
                        <p className="text-xs text-text-subtle mt-0.5">
                          Due{' '}
                          {new Date(task.due_date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-xs text-text-subtle">
            Want a portal like this for your clients?
          </p>
          <Link
            to="/register"
            className="text-xs text-accent hover:text-accent-hover font-medium mt-1 inline-block"
          >
            Get started with ClientHub →
          </Link>
        </div>
      </main>
    </div>
  );
}