import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Clock,
  Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { projectsApi } from '../api/projects';
import { tasksApi } from '../api/tasks';
import EmptyState from '../components/ui/EmptyState';
import Modal from '../components/ui/Modal';

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

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'todo',
    due_date: '',
  });

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projectData, tasksData] = await Promise.all([
        projectsApi.get(id),
        tasksApi.list(id),
      ]);
      setProject(projectData);
      setTasks(tasksData);
    } catch (err) {
      console.error('Fetch error:', err.response?.data);
      toast.error('Failed to load project');
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        due_date: form.due_date || null,
      };
      const newTask = await tasksApi.create(id, payload);
      setTasks([...tasks, newTask]);
      setForm({ title: '', description: '', status: 'todo', due_date: '' });
      setIsModalOpen(false);
      toast.success('Task added');
    } catch (err) {
      console.error(err.response?.data);
      toast.error('Failed to add task');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleTaskStatus = async (task) => {
    const nextStatus = {
      todo: 'doing',
      doing: 'done',
      done: 'todo',
    }[task.status];

    try {
      const updated = await tasksApi.update(task.id, { status: nextStatus });
      setTasks(tasks.map((t) => (t.id === task.id ? updated : t)));
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const deleteTask = async (taskId) => {
    if (!confirm('Delete this task?')) return;
    try {
      await tasksApi.delete(taskId);
      setTasks(tasks.filter((t) => t.id !== taskId));
      toast.success('Task deleted');
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={20} className="text-text-muted animate-spin" />
      </div>
    );
  }

  if (!project) return null;

  const doneCount = tasks.filter((t) => t.status === 'done').length;
  const progress = tasks.length > 0 ? Math.round((doneCount / tasks.length) * 100) : 0;

  return (
    <div>
      {/* Back */}
      <Link
        to="/projects"
        className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors mb-4"
      >
        <ArrowLeft size={14} strokeWidth={2} />
        Back to Projects
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-text-primary mb-1">
            {project.name}
          </h2>
          <p className="text-sm text-text-muted">
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
          onClick={() => setIsModalOpen(true)}
          className="btn-primary"
        >
          <Plus size={16} strokeWidth={2} />
          Add Task
        </button>
      </div>

      {/* Progress Card */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-text-subtle">Overall Progress</span>
          <span className="text-xs font-medium text-text-primary tabular-nums">
            {doneCount} / {tasks.length} done
          </span>
        </div>
        <div className="h-2 bg-bg-hover rounded-full overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Tasks */}
      <h3 className="text-sm font-semibold text-text-primary mb-3">
        Tasks ({tasks.length})
      </h3>

      {tasks.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={CheckCircle2}
            title="No tasks yet"
            description="Break this project into small tasks to track progress."
            action={
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn-primary"
              >
                <Plus size={16} strokeWidth={2} />
                Add First Task
              </button>
            }
          />
        </div>
      ) : (
        <div className="card p-0 divide-y divide-border">
          {tasks.map((task) => {
            const Icon = statusIcon[task.status];
            return (
              <div
                key={task.id}
                className="flex items-center gap-3 p-3 hover:bg-bg-hover transition-colors group"
              >
                <button
                  onClick={() => toggleTaskStatus(task)}
                  className={`flex-shrink-0 ${statusColor[task.status]} hover:scale-110 transition-transform`}
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
                  {task.due_date && (
                    <p className="text-xs text-text-subtle mt-0.5">
                      Due {new Date(task.due_date).toLocaleDateString()}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-1.5 rounded-lg text-text-subtle hover:text-danger hover:bg-danger/10 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={14} strokeWidth={1.75} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Task Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Task"
      >
        <form onSubmit={handleAddTask} className="space-y-4">
          <div>
            <label className="label">Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="input"
              placeholder="Design homepage"
              required
              autoFocus
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

          <div>
            <label className="label">Due Date</label>
            <input
              type="date"
              value={form.due_date}
              onChange={(e) => setForm({ ...form, due_date: e.target.value })}
              className="input"
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
              {submitting ? 'Adding...' : 'Add Task'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}