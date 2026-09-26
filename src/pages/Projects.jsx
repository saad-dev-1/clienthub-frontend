import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, FolderKanban, MoreHorizontal, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import { projectsApi } from '../api/projects';
import { clientsApi } from '../api/clients';

const statusStyles = {
  active: 'badge-accent',
  completed: 'badge-success',
  on_hold: 'badge-warning',
};

// Helper: extract array from any response shape
function extractArray(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.data)) return response.data.data;
  return [];
}

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    client_id: '',
    deadline: '',
    description: '',
    status: 'active',
    progress: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projectsResponse, clientsResponse] = await Promise.all([
        projectsApi.list(),
        clientsApi.list(),
      ]);

      // 🔍 DEBUG LOGS
      console.log('🚀 Projects API raw:', projectsResponse);
      console.log('🚀 Clients API raw:', clientsResponse);

      const projectsArray = extractArray(projectsResponse);
      const clientsArray = extractArray(clientsResponse);

      console.log('✅ Projects array:', projectsArray);
      console.log('✅ First project:', projectsArray[0]);
      console.log('✅ First project ID:', projectsArray[0]?.id);

      setProjects(projectsArray);
      setClients(clientsArray);
    } catch (err) {
      console.error('❌ Fetch error:', err.response?.data || err);
      toast.error('Failed to load projects');
      setProjects([]);
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  const projectsArray = Array.isArray(projects) ? projects : [];
  const clientsArray = Array.isArray(clients) ? clients : [];

  const filtered = projectsArray.filter(
    (p) =>
      (p.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.client?.name || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        client_id: form.client_id || null,
        deadline: form.deadline || null,
      };
      const newProject = await projectsApi.create(payload);
      setProjects([newProject, ...projectsArray]);
      setForm({
        name: '',
        client_id: '',
        deadline: '',
        description: '',
        status: 'active',
        progress: 0,
      });
      setIsModalOpen(false);
      toast.success('Project created');
    } catch (err) {
      console.error('Create project error:', err.response?.data);
      const errors = err.response?.data?.errors;
      const message = errors
        ? Object.values(errors)[0][0]
        : err.response?.data?.message || 'Failed to create project';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-text-primary">
            Projects
          </h2>
          <p className="text-sm text-text-muted mt-1">
            Track all your ongoing work in one place
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary"
        >
          <Plus size={16} strokeWidth={2} />
          New Project
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search
          size={16}
          strokeWidth={1.75}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-text-subtle"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search projects..."
          className="input pl-9"
        />
      </div>

      {/* Projects List */}
      {loading ? (
        <div className="card flex items-center justify-center py-12">
          <Loader2 size={20} className="text-text-muted animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={FolderKanban}
            title={search ? 'No projects found' : 'No projects yet'}
            description={
              search
                ? 'Try a different search term.'
                : 'Create your first project to get started.'
            }
            action={
              !search && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="btn-primary"
                >
                  <Plus size={16} strokeWidth={2} />
                  Create Project
                </button>
              )
            }
          />
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((project, index) => (
            <ProjectCard
              key={project.id || project._id || index}
              project={project}
            />
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="New Project"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Project Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input"
              placeholder="Nexus Store Redesign"
              required
            />
          </div>

          <div>
            <label className="label">Client</label>
            <select
              value={form.client_id}
              onChange={(e) => setForm({ ...form, client_id: e.target.value })}
              className="input"
            >
              <option value="">— No client —</option>
              {clientsArray.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Deadline</label>
            <input
              type="date"
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              className="input"
            />
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="input min-h-[80px] resize-none"
              placeholder="Short description..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn-secondary flex-1"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={submitting}
            >
              {submitting ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function ProjectCard({ project }) {
  // Defensive: try multiple ID fields
  const projectId = project.id || project._id || project.uuid;

  const handleClick = (e) => {
    if (!projectId) {
      e.preventDefault();
      console.error('❌ Project ID missing:', project);
      return;
    }
  };

  return (
    <Link
      to={projectId ? `/projects/${projectId}` : '#'}
      onClick={handleClick}
      className="block card hover:border-border-strong transition-colors cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold text-text-primary">
              {project.name || 'Untitled'}
            </h3>
            <span className={statusStyles[project.status] || 'badge-neutral'}>
              {(project.status || 'active').replace('_', ' ')}
            </span>
          </div>
          <p className="text-xs text-text-muted">
            {project.client?.name || 'No client'} • Due{' '}
            {project.deadline
              ? new Date(project.deadline).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : '—'}
          </p>
        </div>
        <button
          onClick={(e) => e.preventDefault()}
          className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors"
        >
          <MoreHorizontal size={16} strokeWidth={1.75} />
        </button>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-text-subtle">Progress</span>
          <span className="text-xs font-medium text-text-primary tabular-nums">
            {project.progress || 0}%
          </span>
        </div>
        <div className="h-1.5 bg-bg-hover rounded-full overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-300"
            style={{ width: `${project.progress || 0}%` }}
          />
        </div>
      </div>
    </Link>
  );
}