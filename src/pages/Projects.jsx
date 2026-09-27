import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  FolderKanban,
  Pencil,
  Trash2,
  Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../components/ui/Modal';
import ConfirmModal from '../components/ui/ConfirmModal';
import EmptyState from '../components/ui/EmptyState';
import { projectsApi } from '../api/projects';
import { clientsApi } from '../api/clients';

const statusStyles = {
  active: 'badge-accent',
  completed: 'badge-success',
  on_hold: 'badge-warning',
};

const emptyForm = {
  name: '',
  client_id: '',
  deadline: '',
  description: '',
  status: 'active',
  progress: 0,
};

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projectsData, clientsData] = await Promise.all([
        projectsApi.list(),
        clientsApi.list(),
      ]);
      setProjects(Array.isArray(projectsData) ? projectsData : []);
      setClients(Array.isArray(clientsData) ? clientsData : []);
    } catch (err) {
      console.error('Fetch error:', err.response?.data || err);
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

  const openCreateModal = () => {
    setEditingProject(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setForm({
      name: project.name || '',
      client_id: project.client_id || '',
      deadline: project.deadline
        ? new Date(project.deadline).toISOString().split('T')[0]
        : '',
      description: project.description || '',
      status: project.status || 'active',
      progress: project.progress || 0,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        client_id: form.client_id || null,
        deadline: form.deadline || null,
      };

      if (editingProject) {
        const updated = await projectsApi.update(editingProject.id, payload);
        setProjects(
          projectsArray.map((p) =>
            p.id === editingProject.id ? updated : p
          )
        );
        toast.success('Project updated');
      } else {
        const newProject = await projectsApi.create(payload);
        setProjects([newProject, ...projectsArray]);
        toast.success('Project created');
      }
      setIsModalOpen(false);
      setEditingProject(null);
      setForm(emptyForm);
    } catch (err) {
      console.error('Submit error:', err.response?.data);
      const errors = err.response?.data?.errors;
      const message = errors
        ? Object.values(errors)[0][0]
        : err.response?.data?.message || 'Something went wrong';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await projectsApi.delete(deleteTarget.id);
      setProjects(projectsArray.filter((p) => p.id !== deleteTarget.id));
      toast.success('Project deleted');
      setDeleteTarget(null);
    } catch (err) {
      console.error('Delete error:', err.response?.data);
      toast.error('Failed to delete project');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl heading-tighter text-text-primary">
            Projects
          </h2>
          <p className="text-sm text-text-muted mt-1">
            Track all your ongoing work in one place
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="btn-primary w-full sm:w-auto"
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
                <button onClick={openCreateModal} className="btn-primary">
                  <Plus size={16} strokeWidth={2} />
                  Create Project
                </button>
              )
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={openEditModal}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      {/* Delete Confirm Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Project"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmText="Delete Project"
        loading={deleting}
        variant="danger"
      />

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProject(null);
          setForm(emptyForm);
        }}
        title={editingProject ? 'Edit Project' : 'New Project'}
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
              onChange={(e) =>
                setForm({ ...form, client_id: e.target.value })
              }
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
            <label className="label">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="input"
            >
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="on_hold">On Hold</option>
            </select>
          </div>

          <div>
            <label className="label">Progress (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={form.progress}
              onChange={(e) =>
                setForm({
                  ...form,
                  progress: parseInt(e.target.value) || 0,
                })
              }
              className="input"
              placeholder="0"
            />
          </div>

          <div>
            <label className="label">Deadline</label>
            <input
              type="date"
              value={form.deadline}
              onChange={(e) =>
                setForm({ ...form, deadline: e.target.value })
              }
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
              onClick={() => {
                setIsModalOpen(false);
                setEditingProject(null);
                setForm(emptyForm);
              }}
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
              {submitting
                ? editingProject
                  ? 'Saving...'
                  : 'Creating...'
                : editingProject
                ? 'Save Changes'
                : 'Create Project'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function ProjectCard({ project, onEdit, onDelete }) {
  return (
    <div className="card card-hover group relative">
      <Link
        to={`/projects/${project.id}`}
        className="block cursor-pointer pr-16"
      >
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-base font-semibold heading-tight text-text-primary truncate flex-1">
            {project.name}
          </h3>
          <span
            className={`${
              statusStyles[project.status] || 'badge-neutral'
            } flex-shrink-0`}
          >
            {(project.status || 'active').replace('_', ' ')}
          </span>
        </div>

        <p className="text-xs text-text-muted mb-4 truncate">
          {project.client?.name || 'No client'} • Due{' '}
          {project.deadline
            ? new Date(project.deadline).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })
            : '—'}
        </p>

        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-text-subtle">Progress</span>
          <span className="text-xs font-medium text-text-primary tabular-nums">
            {project.progress || 0}%
          </span>
        </div>
        <div className="h-1.5 bg-bg-hover rounded-full overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-500 rounded-full"
            style={{ width: `${project.progress || 0}%` }}
          />
        </div>
      </Link>

      <div className="absolute top-5 right-5 flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onEdit(project);
          }}
          className="p-1.5 rounded-lg bg-bg-card border border-border text-text-muted hover:text-text-primary hover:border-border-strong transition-colors"
          title="Edit"
        >
          <Pencil size={13} strokeWidth={1.75} />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete(project);
          }}
          className="p-1.5 rounded-lg bg-bg-card border border-border text-text-muted hover:text-danger hover:border-danger/30 hover:bg-danger/5 transition-colors"
          title="Delete"
        >
          <Trash2 size={13} strokeWidth={1.75} />
        </button>
      </div>
    </div>
  );
}