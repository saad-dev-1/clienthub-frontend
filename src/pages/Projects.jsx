import { useState } from 'react';
import { Plus, Search, FolderKanban, MoreHorizontal } from 'lucide-react';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';

const mockProjects = [
  {
    id: 1,
    name: 'Nexus Store',
    client: 'Ali Furniture',
    status: 'active',
    progress: 78,
    deadline: '2026-10-12',
  },
  {
    id: 2,
    name: 'AANGAN Website',
    client: 'Ahmed Clothing',
    status: 'completed',
    progress: 100,
    deadline: '2026-09-20',
  },
  {
    id: 3,
    name: 'Portfolio Redesign',
    client: 'XYZ Agency',
    status: 'active',
    progress: 45,
    deadline: '2026-11-05',
  },
];

const statusStyles = {
  active: 'badge-accent',
  completed: 'badge-success',
  on_hold: 'badge-warning',
};

export default function Projects() {
  const [projects, setProjects] = useState(mockProjects);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    client: '',
    deadline: '',
    description: '',
  });

  const filtered = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.client.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProject = {
      id: projects.length + 1,
      name: form.name,
      client: form.client,
      status: 'active',
      progress: 0,
      deadline: form.deadline || '—',
    };
    setProjects([newProject, ...projects]);
    setForm({ name: '', client: '', deadline: '', description: '' });
    setIsModalOpen(false);
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
      {filtered.length === 0 ? (
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
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
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
            <label className="label">Client *</label>
            <input
              type="text"
              value={form.client}
              onChange={(e) => setForm({ ...form, client: e.target.value })}
              className="input"
              placeholder="Ali Furniture"
              required
            />
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
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1">
              Create Project
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function ProjectCard({ project }) {
  return (
    <div className="card hover:border-border-strong transition-colors cursor-pointer">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold text-text-primary">
              {project.name}
            </h3>
            <span className={statusStyles[project.status]}>
              {project.status.replace('_', ' ')}
            </span>
          </div>
          <p className="text-xs text-text-muted">
            {project.client} • Due {project.deadline}
          </p>
        </div>
        <button className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors">
          <MoreHorizontal size={16} strokeWidth={1.75} />
        </button>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-text-subtle">Progress</span>
          <span className="text-xs font-medium text-text-primary tabular-nums">
            {project.progress}%
          </span>
        </div>
        <div className="h-1.5 bg-bg-hover rounded-full overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-300"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}