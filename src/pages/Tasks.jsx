import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  CheckCircle2,
  Circle,
  Clock,
  Loader2,
  FolderKanban,
  Pencil,
  Trash2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../components/ui/Modal';
import ConfirmModal from '../components/ui/ConfirmModal';
import EmptyState from '../components/ui/EmptyState';
import { tasksApi } from '../api/tasks';

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

const filters = [
  { key: 'all', label: 'All' },
  { key: 'todo', label: 'To Do' },
  { key: 'doing', label: 'In Progress' },
  { key: 'done', label: 'Completed' },
];

const emptyForm = {
  title: '',
  description: '',
  status: 'todo',
  due_date: '',
};

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await tasksApi.listAll();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Fetch tasks error:', err.response?.data);
      toast.error('Failed to load tasks');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (task) => {
    const nextStatus = {
      todo: 'doing',
      doing: 'done',
      done: 'todo',
    }[task.status];

    try {
      const updated = await tasksApi.update(task.id, { status: nextStatus });
      setTasks(tasks.map((t) => (t.id === task.id ? { ...t, ...updated } : t)));
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const openEditModal = (task, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setEditingTask(task);
    setForm({
      title: task.title || '',
      description: task.description || '',
      status: task.status || 'todo',
      due_date: task.due_date ? task.due_date.split('T')[0] : '',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingTask) return;
    setSubmitting(true);
    try {
      const payload = {
        title: form.title,
        description: form.description || null,
        status: form.status,
        due_date: form.due_date || null,
      };

      const updated = await tasksApi.update(editingTask.id, payload);
      setTasks(
        tasks.map((t) => (t.id === editingTask.id ? { ...t, ...updated } : t))
      );
      toast.success('Task updated');
      closeModal();
    } catch (err) {
      const errors = err.response?.data?.errors;
      const message = errors
        ? Object.values(errors)[0][0]
        : 'Failed to update task';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (task, e) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteTarget(task);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await tasksApi.delete(deleteTarget.id);
      setTasks(tasks.filter((t) => t.id !== deleteTarget.id));
      toast.success('Task deleted');
      setDeleteTarget(null);
    } catch (err) {
      toast.error('Failed to delete task');
    } finally {
      setDeleting(false);
    }
  };

  const filtered = tasks.filter((t) => {
    const matchesSearch =
      (t.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (t.project?.name || '').toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || t.status === filter;
    return matchesSearch && matchesFilter;
  });

  const counts = {
    all: tasks.length,
    todo: tasks.filter((t) => t.status === 'todo').length,
    doing: tasks.filter((t) => t.status === 'doing').length,
    done: tasks.filter((t) => t.status === 'done').length,
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl heading-tighter text-text-primary">Tasks</h2>
        <p className="text-sm text-text-muted mt-1">
          All tasks across your projects
        </p>
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
          placeholder="Search tasks or projects..."
          className="input pl-9"
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1 -mx-1 px-1">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap flex-shrink-0 border ${
              filter === f.key
                ? 'bg-text-primary text-bg-base border-text-primary'
                : 'text-text-muted border-border hover:text-text-primary hover:border-border-strong bg-bg-card'
            }`}
          >
            {f.label}
            <span
              className={`ml-1.5 tabular-nums ${
                filter === f.key ? 'text-bg-base/70' : 'text-text-subtle'
              }`}
            >
              {counts[f.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Task List */}
      {loading ? (
        <div className="card flex items-center justify-center py-12">
          <Loader2 size={20} className="text-text-muted animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={CheckCircle2}
            title={
              search || filter !== 'all' ? 'No tasks found' : 'No tasks yet'
            }
            description={
              search || filter !== 'all'
                ? 'Try a different search or filter.'
                : 'Add tasks to your projects to see them here.'
            }
          />
        </div>
      ) : (
        <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
          {filtered.map((task, index) => {
            const Icon = statusIcon[task.status] || Circle;
            return (
              <div
                key={task.id}
                className={`group flex items-start gap-3 p-4 hover:bg-bg-hover transition-colors ${
                  index !== filtered.length - 1
                    ? 'border-b border-border'
                    : ''
                }`}
              >
                <button
                  onClick={() => toggleStatus(task)}
                  className={`flex-shrink-0 mt-0.5 ${
                    statusColor[task.status] || 'text-text-subtle'
                  } hover:scale-110 transition-transform`}
                  title="Click to change status"
                >
                  <Icon size={18} strokeWidth={2} />
                </button>

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

                  {task.description && (
                    <p className="text-xs text-text-muted mt-1 line-clamp-2">
                      {task.description}
                    </p>
                  )}

                  <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                    {task.project && (
                      <Link
                        to={`/projects/${task.project.id}`}
                        className="text-xs text-text-muted hover:text-accent transition-colors flex items-center gap-1"
                      >
                        <FolderKanban size={11} strokeWidth={1.75} />
                        <span className="truncate max-w-[150px]">
                          {task.project.name}
                        </span>
                      </Link>
                    )}
                    {task.due_date && (
                      <span className="text-xs text-text-subtle">
                        Due{' '}
                        {new Date(task.due_date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    )}
                  </div>

                  {/* Status badge — mobile only */}
                  <div className="sm:hidden mt-2">
                    <span
                      className={
                        task.status === 'done'
                          ? 'badge-success'
                          : task.status === 'doing'
                          ? 'badge-warning'
                          : 'badge-neutral'
                      }
                    >
                      {task.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <span
                  className={`hidden sm:inline-flex flex-shrink-0 ${
                    task.status === 'done'
                      ? 'badge-success'
                      : task.status === 'doing'
                      ? 'badge-warning'
                      : 'badge-neutral'
                  }`}
                >
                  {task.status.replace('_', ' ')}
                </span>

                {/* Actions — Desktop */}
                <div className="hidden sm:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button
                    onClick={(e) => openEditModal(task, e)}
                    className="p-1.5 rounded-lg text-text-muted hover:text-accent hover:bg-accent-subtle transition-colors"
                    title="Edit task"
                  >
                    <Pencil size={14} strokeWidth={1.75} />
                  </button>
                  <button
                    onClick={(e) => handleDeleteClick(task, e)}
                    className="p-1.5 rounded-lg text-text-muted hover:text-danger hover:bg-danger/5 transition-colors"
                    title="Delete task"
                  >
                    <Trash2 size={14} strokeWidth={1.75} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Edit Task"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="input"
              placeholder="Task title"
              required
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
              placeholder="Optional details..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="label">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="input"
              >
                <option value="todo">To Do</option>
                <option value="doing">In Progress</option>
                <option value="done">Completed</option>
              </select>
            </div>
            <div>
              <label className="label">Due Date</label>
              <input
                type="date"
                value={form.due_date}
                onChange={(e) =>
                  setForm({ ...form, due_date: e.target.value })
                }
                className="input"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={closeModal}
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
              {submitting ? 'Updating...' : 'Update Task'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Task"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmText="Delete Task"
        loading={deleting}
        variant="danger"
      />
    </div>
  );
}