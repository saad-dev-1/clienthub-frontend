import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  CheckCircle2,
  Circle,
  Clock,
  Loader2,
  FolderKanban,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { tasksApi } from '../api/tasks';
import EmptyState from '../components/ui/EmptyState';

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

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

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
      setTasks(tasks.map((t) => (t.id === task.id ? updated : t)));
    } catch (err) {
      toast.error('Failed to update task');
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
        <h2 className="text-2xl font-semibold text-text-primary">Tasks</h2>
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
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap flex-shrink-0 ${
              filter === f.key
                ? 'bg-accent-subtle text-accent'
                : 'text-text-muted hover:text-text-primary hover:bg-bg-hover'
            }`}
          >
            {f.label}
            <span className="ml-1.5 text-text-subtle tabular-nums">
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
        <div className="card p-0 divide-y divide-border">
          {filtered.map((task) => {
            const Icon = statusIcon[task.status] || Circle;
            return (
              <div
                key={task.id}
                className="flex items-start gap-3 p-4 hover:bg-bg-hover transition-colors"
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

                  {/* Status badge — visible on mobile below */}
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

                {/* Status badge — desktop right side */}
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
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}