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
import ShareButton from '../components/ui/ShareButton';

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
  const [error, setError] = useState(null);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      let projectData = null;
      try {
        const res = await projectsApi.get(id);
        projectData = res?.data?.id ? res.data : res;
      } catch (projErr) {
        console.error(
          'Project fetch failed:',
          projErr.response?.status,
          projErr.response?.data
        );
        setError(
          projErr.response?.status === 404
            ? 'Project not found. It may have been deleted.'
            : 'Failed to load project.'
        );
        setLoading(false);
        return;
      }

      let tasksData = [];
      try {
        const tRes = await tasksApi.list(id);
        tasksData = Array.isArray(tRes) ? tRes : tRes?.data || [];
      } catch (taskErr) {
        console.error('Tasks fetch failed:', taskErr.response?.data);
        tasksData = [];
      }

      setProject(projectData);
      setTasks(tasksData);
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('Something went wrong.');
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

  if (error || !project) {
    return (
      <div className="text-center py-16">
        <h2 className="text-lg font-semibold text-text-primary mb-2">
          {error || 'Project not found'}
        </h2>
        <p className="text-sm text-text-muted mb-4">
          Project ID: <code className="text-accent">{id}</code>
        </p>
        <Link to="/projects" className="btn-primary inline-flex">
          Back to Projects
        </Link>
      </div>
    );
  }

  const tasksArray = Array.isArray(tasks) ? tasks : [];
  const doneCount = tasksArray.filter((t) => t.status === 'done').length;
  const progress =
    tasksArray.length > 0
      ? Math.round((doneCount / tasksArray.length) * 100)
      : 0;

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
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl sm:text-2xl font-semibold text-text-primary mb-1 truncate">
            {project.name || 'Untitled Project'}
          </h2>
          <p className="text-sm text-text-muted truncate">
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
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <ShareButton project={project} onUpdate={setProject} />
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex-1 sm:flex-none justify-center"
          >
            <Plus size={16} strokeWidth={2} />
            Add Task
          </button>
        </div>
      </div>

      {/* Progress Card */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-text-subtle">Overall Progress</span>
          <span className="text-xs font-medium text-text-primary tabular-nums">
            {doneCount} / {tasksArray.length} done
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
        Tasks ({tasksArray.length})
      </h3>

      {tasksArray.length === 0 ? (
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
          {tasksArray.map((task) => {
            const Icon = statusIcon[task.status] || Circle;
            return (
              <div
                key={task.id}
                className="flex items-start gap-3 p-4 hover:bg-bg-hover transition-colors group"
              >
                <button
                  onClick={() => toggleTaskStatus(task)}
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

                {/* Delete — always visible on mobile, hover on desktop */}
                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-1.5 rounded-lg text-text-subtle hover:text-danger hover:bg-danger/10 transition-colors sm:opacity-0 sm:group-hover:opacity-100 flex-shrink-0"
                  title="Delete task"
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