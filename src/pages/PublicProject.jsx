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
  FileText,
  Image as ImageIcon,
  FileArchive,
  File as FileIcon,
  Download,
  AlertCircle,
  MessageSquare,
} from 'lucide-react';
import toast from 'react-hot-toast';
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

function formatBytes(bytes) {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function getFileIcon(mimeType) {
  if (!mimeType) return FileIcon;
  if (mimeType.startsWith('image/')) return ImageIcon;
  if (
    mimeType.includes('zip') ||
    mimeType.includes('rar') ||
    mimeType.includes('tar')
  )
    return FileArchive;
  if (
    mimeType.includes('pdf') ||
    mimeType.includes('document') ||
    mimeType.includes('text')
  )
    return FileText;
  return FileIcon;
}

export default function PublicProject() {
  const { token } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [feedbackApproved, setFeedbackApproved] = useState(null);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

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
      setFeedback(response.feedback || null);
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

  const handleChooseApprove = () => {
    setFeedbackApproved(true);
    setShowForm(true);
    setFeedbackComment('');
  };

  const handleChooseChanges = () => {
    setFeedbackApproved(false);
    setShowForm(true);
    setFeedbackComment('');
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setFeedbackApproved(null);
    setFeedbackComment('');
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!feedbackApproved) {
      toast.error('Please choose Approve or Request Changes');
      return;
    }
    if (!feedbackApproved && !feedbackComment.trim()) {
      toast.error('Please describe the changes you would like');
      return;
    }

    setSubmitting(true);
    try {
      const response = await publicProjectsApi.submitFeedback(token, {
        approved: feedbackApproved,
        feedback: feedbackComment.trim() || null,
      });
      setFeedback(response.feedback);
      setShowForm(false);
      setFeedbackApproved(null);
      setFeedbackComment('');
      toast.success('Thank you for your feedback!');
    } catch (err) {
      const errors = err.response?.data?.errors;
      const message = errors
        ? Object.values(errors)[0][0]
        : 'Failed to submit feedback';
      toast.error(message);
    } finally {
      setSubmitting(false);
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
            Go to Klient
          </Link>
        </div>
      </div>
    );
  }

  const { project, tasks, files, owner } = data;
  const tasksArray = Array.isArray(tasks) ? tasks : [];
  const filesArray = Array.isArray(files) ? files : [];
  const doneCount = tasksArray.filter((t) => t.status === 'done').length;
  const progress =
    tasksArray.length > 0
      ? Math.round((doneCount / tasksArray.length) * 100)
      : project.progress || 0;

  return (
    <div className="min-h-screen bg-bg-base">
      {/* Top Bar */}
      <header className="border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/logo.svg"
              alt="Klient"
              className="w-7 h-7 rounded-lg"
            />
            <span className="text-sm font-semibold text-text-primary">
              Klient
            </span>
          </div>
          <Link
            to="/register"
            className="text-xs text-text-muted hover:text-text-primary transition-colors"
          >
            Powered by Klient
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* Project Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-semibold heading-tighter text-text-primary mb-2">
                {project.name}
              </h1>
              {project.description && (
                <p className="text-sm text-text-muted max-w-2xl">
                  {project.description}
                </p>
              )}
            </div>
            <span
              className={`${
                projectStatusStyles[project.status] || 'badge-neutral'
              } flex-shrink-0 self-start`}
            >
              {(project.status || 'active').replace('_', ' ')}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-text-muted mt-4">
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
            <span className="text-xs font-medium uppercase tracking-wider text-text-subtle">
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

        {/* Files */}
        {filesArray.length > 0 && (
          <div className="mb-8">
            <h2 className="text-base font-semibold text-text-primary mb-4">
              Files ({filesArray.length})
            </h2>
            <div className="card p-0 overflow-hidden">
              {filesArray.map((file, index) => {
                const Icon = getFileIcon(file.mime_type);
                return (
                  <a
                    key={file.id}
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-3 p-3 sm:p-4 hover:bg-bg-hover transition-colors group ${
                      index !== filesArray.length - 1
                        ? 'border-b border-border'
                        : ''
                    }`}
                  >
                    <div className="w-9 h-9 rounded-lg bg-accent-subtle flex items-center justify-center flex-shrink-0">
                      <Icon
                        size={16}
                        className="text-accent"
                        strokeWidth={1.75}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-text-subtle mt-0.5">
                        {formatBytes(file.size)}
                      </p>
                    </div>
                    <div className="p-1.5 rounded-lg text-text-subtle group-hover:text-accent transition-colors">
                      <Download size={14} strokeWidth={1.75} />
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* Tasks */}
        <div className="mb-8">
          <h2 className="text-base font-semibold text-text-primary mb-4">
            Tasks
          </h2>

          {tasksArray.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-sm text-text-muted">No tasks added yet.</p>
            </div>
          ) : (
            <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
              {tasksArray.map((task, index) => {
                const Icon = statusIcon[task.status] || Circle;
                return (
                  <div
                    key={task.id}
                    className={`flex items-center gap-3 p-4 ${
                      index !== tasksArray.length - 1
                        ? 'border-b border-border'
                        : ''
                    }`}
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
                          {new Date(task.due_date).toLocaleDateString(
                            'en-US',
                            {
                              month: 'short',
                              day: 'numeric',
                            }
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ===== Feedback Section ===== */}
        <div className="mb-8">
          <h2 className="text-base font-semibold text-text-primary mb-4 flex items-center gap-2">
            <MessageSquare size={16} strokeWidth={1.75} />
            Your Feedback
          </h2>

          {feedback?.submitted_at ? (
            /* ===== Already submitted ===== */
            <div className="card">
              <div
                className={`flex items-start gap-3 p-4 rounded-lg ${
                  feedback.approved
                    ? 'bg-success/5 border border-success/20'
                    : 'bg-warning/5 border border-warning/20'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    feedback.approved ? 'bg-success/10' : 'bg-warning/10'
                  }`}
                >
                  {feedback.approved ? (
                    <CheckCircle2 size={20} className="text-success" />
                  ) : (
                    <AlertCircle size={20} className="text-warning" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium ${
                      feedback.approved ? 'text-success' : 'text-warning'
                    }`}
                  >
                    {feedback.approved
                      ? 'You approved this project'
                      : 'You requested changes'}
                  </p>
                  <p className="text-xs text-text-muted mt-0.5">
                    Submitted on{' '}
                    {new Date(feedback.submitted_at).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </p>
                  {feedback.comment && (
                    <p className="text-sm text-text-body mt-3 whitespace-pre-wrap break-words bg-bg-hover/60 p-3 rounded-lg">
                      {feedback.comment}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* ===== Not submitted yet â€” show form ===== */
            <div className="card">
              {!showForm ? (
                <>
                  <p className="text-sm text-text-body mb-4">
                    Are you happy with this project? Please share your
                    feedback.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={handleChooseApprove}
                      className="flex items-center justify-center gap-2 p-4 rounded-lg border-2 border-success/30 bg-success/5 text-success hover:bg-success/10 hover:border-success/50 transition-all font-medium text-sm"
                    >
                      <CheckCircle2 size={18} strokeWidth={2} />
                      Approve Project
                    </button>
                    <button
                      type="button"
                      onClick={handleChooseChanges}
                      className="flex items-center justify-center gap-2 p-4 rounded-lg border-2 border-warning/30 bg-warning/5 text-warning hover:bg-warning/10 hover:border-warning/50 transition-all font-medium text-sm"
                    >
                      <AlertCircle size={18} strokeWidth={2} />
                      Request Changes
                    </button>
                  </div>
                </>
              ) : (
                <form onSubmit={handleSubmitFeedback}>
                  <div
                    className={`flex items-center gap-3 mb-4 p-3 rounded-lg ${
                      feedbackApproved ? 'bg-success/5' : 'bg-warning/5'
                    }`}
                  >
                    {feedbackApproved ? (
                      <CheckCircle2 size={18} className="text-success" />
                    ) : (
                      <AlertCircle size={18} className="text-warning" />
                    )}
                    <p
                      className={`text-sm font-medium ${
                        feedbackApproved ? 'text-success' : 'text-warning'
                      }`}
                    >
                      {feedbackApproved
                        ? 'Approving this project'
                        : 'Requesting changes'}
                    </p>
                    <button
                      type="button"
                      onClick={handleCancelForm}
                      className="ml-auto text-xs text-text-muted hover:text-text-primary underline"
                    >
                      Change
                    </button>
                  </div>

                  <div className="mb-4">
                    <label className="label">
                      {feedbackApproved
                        ? 'Add a comment (optional)'
                        : 'What needs to change?'}
                    </label>
                    <textarea
                      value={feedbackComment}
                      onChange={(e) => setFeedbackComment(e.target.value)}
                      className="input min-h-[100px] resize-none"
                      placeholder={
                        feedbackApproved
                          ? 'Any final thoughts...'
                          : 'Please describe the changes you would like...'
                      }
                      required={!feedbackApproved}
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleCancelForm}
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
                      {submitting ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        'Submit Feedback'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Footer CTA */}
        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-xs text-text-subtle">
            Want a portal like this for your clients?
          </p>
          <Link
            to="/register"
            className="text-xs text-accent hover:text-accent-hover font-medium mt-1 inline-block"
          >
            Get started with Klient â†’
          </Link>
        </div>
      </main>
    </div>
  );
}