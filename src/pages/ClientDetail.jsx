import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Phone,
  FolderKanban,
  Loader2,
  Calendar,
} from 'lucide-react';
import { clientsApi } from '../api/clients';
import EmptyState from '../components/ui/EmptyState';

const statusStyles = {
  active: 'badge-accent',
  completed: 'badge-success',
  on_hold: 'badge-warning',
};

export default function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchClient();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchClient = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await clientsApi.get(id);
      setClient(data);
    } catch (err) {
      console.error('Fetch client error:', err.response?.data);
      setError(
        err.response?.status === 404
          ? 'Client not found.'
          : 'Failed to load client.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={20} className="text-text-muted animate-spin" />
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="text-center py-16">
        <h2 className="text-lg font-semibold text-text-primary mb-2">
          {error || 'Client not found'}
        </h2>
        <Link to="/clients" className="btn-primary mt-4 inline-flex">
          Back to Clients
        </Link>
      </div>
    );
  }

  const initials = (client.name || '?')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const projects = Array.isArray(client.projects) ? client.projects : [];

  return (
    <div>
      {/* Back */}
      <Link
        to="/clients"
        className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors mb-4"
      >
        <ArrowLeft size={14} strokeWidth={2} />
        Back to Clients
      </Link>

      {/* Header */}
      <div className="flex items-start gap-3 sm:gap-4 mb-8">
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-accent-subtle flex items-center justify-center text-accent text-sm sm:text-lg font-semibold flex-shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl sm:text-2xl font-semibold text-text-primary mb-1 truncate">
            {client.name}
          </h2>
          {client.company && (
            <p className="text-sm text-text-muted truncate">
              {client.company}
            </p>
          )}
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="card">
          <div className="flex items-center gap-3">
            <Mail size={16} strokeWidth={1.75} className="text-text-subtle flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-text-subtle uppercase tracking-wide">
                Email
              </p>
              <p className="text-sm text-text-primary mt-0.5 truncate">
                {client.email || '—'}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <Phone size={16} strokeWidth={1.75} className="text-text-subtle flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-text-subtle uppercase tracking-wide">
                Phone
              </p>
              <p className="text-sm text-text-primary mt-0.5 truncate">
                {client.phone || '—'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      {client.notes && (
        <div className="card mb-8">
          <p className="text-xs text-text-subtle uppercase tracking-wide mb-2">
            Notes
          </p>
          <p className="text-sm text-text-primary whitespace-pre-wrap">
            {client.notes}
          </p>
        </div>
      )}

      {/* Projects */}
      <div>
        <h3 className="text-sm font-semibold text-text-primary mb-3">
          Projects ({projects.length})
        </h3>

        {projects.length === 0 ? (
          <div className="card">
            <EmptyState
              icon={FolderKanban}
              title="No projects yet"
              description="This client doesn't have any projects."
            />
          </div>
        ) : (
          <div className="space-y-2">
            {projects.map((project) => (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="block card p-4 hover:border-border-strong transition-colors"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 min-w-0">
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
                  <span className="text-xs text-text-muted tabular-nums flex-shrink-0">
                    {project.progress || 0}%
                  </span>
                </div>
                <div className="h-1.5 bg-bg-hover rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent transition-all duration-300"
                    style={{ width: `${project.progress || 0}%` }}
                  />
                </div>
                {project.deadline && (
                  <p className="text-xs text-text-subtle mt-2 flex items-center gap-1">
                    <Calendar size={11} strokeWidth={1.75} />
                    Due{' '}
                    {new Date(project.deadline).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
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