import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  FolderKanban,
  Calendar,
  User,
  CheckCircle2,
  Circle,
  Clock,
  Loader2,
  Pencil,
  Trash2,
  Share2,
  Copy,
  Plus,
  MessageSquare,
  AlertCircle,
  FileText,
  Image as ImageIcon,
  FileArchive,
  File as FileIcon,
  Download,
  X,
  Upload,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../components/ui/Modal';
import ConfirmModal from '../components/ui/ConfirmModal';
import { projectsApi } from '../api/projects';
import { tasksApi } from '../api/tasks';
import { clientsApi } from '../api/clients';
import { attachmentsApi } from '../api/attachments';

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

const API_URL =
  import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

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

const emptyProjectForm = {
  name: '',
  client_id: '',
  description: '',
  status: 'active',
  progress: 0,
  deadline: '',
};

const emptyTaskForm = {
  title: '',
  description: '',
  status: 'todo',
  due_date: '',
};

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [project, setProject] = useState(null);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Edit project
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [form, setForm] = useState(emptyProjectForm);
  const [submitting, setSubmitting] = useState(false);

  // Delete project
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Share
  const [showShare, setShowShare] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);

  // Clear feedback
  const [clearFeedbackOpen, setClearFeedbackOpen] = useState(false);
  const [clearingFeedback, setClearingFeedback] = useState(false);

  // Task modal
  const [isTaskOpen, setIsTaskOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskForm, setTaskForm] = useState(emptyTaskForm);
  const [taskSubmitting, setTaskSubmitting] = useState(false);

  // Task delete
  const [taskDeleteTarget, setTaskDeleteTarget] = useState(null);
  const [taskDeleting, setTaskDeleting] = useState(false);

  // Upload
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [attachmentDeleteTarget, setAttachmentDeleteTarget] = useState(null);
  const [attachmentDeleting, setAttachmentDeleting] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [projectData, clientsData] = await Promise.all([
        projectsApi.get(id),
        clientsApi.list().catch(() => []),
      ]);
      setProject(projectData);
      setClients(Array.isArray(clientsData) ? clientsData : []);
    } catch (err) {
      console.error('Fetch project error:', err.response?.data);
      setError(
        err.response?.status === 404
          ? 'Project not found.'
          : 'Failed to load project.'
      );
    } finally {
      setLoading(false);
    }
  };

  // ============= EDIT PROJECT =============
  const openEdit = () => {
    if (!project) return;
    setForm({
      name: project.name || '',
      client_id: project.client_id || '',
      description: project.description || '',
      status: project.status || 'active',
      progress: project.progress || 0,
      deadline: project.deadline ? project.deadline.split('T')[0] : '',
    });
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        name: form.name,
        client_id: form.client_id || null,
        description: form.description || null,
        status: form.status,
        progress: parseInt(form.progress, 10) || 0,
        deadline: form.deadline || null,
      };
      const updated = await projectsApi.update(project.id, payload);
      setProject((prev) => ({ ...prev, ...updated }));
      toast.success('Project updated');
      setIsEditOpen(false);
    } catch (err) {
      const errors = err.response?.data?.errors;
      const message = errors
        ? Object.values(errors)[0][0]
        : 'Failed to update project';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  // ============= DELETE PROJECT =============
  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      await projectsApi.delete(project.id);
      toast.success('Project deleted');
      navigate('/projects');
    } catch (err) {
      toast.error('Failed to delete project');
      setDeleting(false);
    }
  };

  // ============= SHARE =============
  const handleShare = async () => {
    setShareLoading(true);
    try {
      const res = await projectsApi.share(project.id);
      setProject((prev) => ({
        ...prev,
        share_token: res.share_token,
        is_public: res.is_public,
      }));
      setShowShare(true);
    } catch (err) {
      toast.error('Failed to generate share link');
    } finally {
      setShareLoading(false);
    }
  };

  const handleUnshare = async () => {
    setShareLoading(true);
    try {
      await projectsApi.unshare(project.id);
      setProject((prev) => ({ ...prev, is_public: false }));
      toast.success('Sharing disabled');
      setShowShare(false);
    } catch (err) {
      toast.error('Failed to disable sharing');
    } finally {
      setShareLoading(false);
    }
  };

  const copyShareLink = () => {
    if (!project?.share_token) return;
    const url = `${window.location.origin}/p/${project.share_token}`;
    navigator.clipboard
      .writeText(url)
      .then(() => toast.success('Link copied to clipboard'))
      .catch(() => toast.error('Failed to copy'));
  };

  // ============= CLEAR FEEDBACK =============
  const handleClearFeedback = async () => {
    setClearingFeedback(true);
    try {
      await projectsApi.clearFeedback(project.id);
      setProject((prev) => ({
        ...prev,
        client_feedback: null,
        client_approved: null,
        client_feedback_at: null,
      }));
      toast.success('Feedback cleared');
      setClearFeedbackOpen(false);
    } catch (err) {
      toast.error('Failed to clear feedback');
    } finally {
      setClearingFeedback(false);
    }
  };

  // ============= TASK ADD/EDIT =============
  const openAddTask = () => {
    setEditingTask(null);
    setTaskForm(emptyTaskForm);
    setIsTaskOpen(true);
  };

  const openEditTask = (task) => {
    setEditingTask(task);
    setTaskForm({
      title: task.title || '',
      description: task.description || '',
      status: task.status || 'todo',
      due_date: task.due_date ? task.due_date.split('T')[0] : '',
    });
    setIsTaskOpen(true);
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    setTaskSubmitting(true);
    try {
      const payload = {
        title: taskForm.title,
        description: taskForm.description || null,
        status: taskForm.status,
        due_date: taskForm.due_date || null,
      };

      if (editingTask) {
        const updated = await tasksApi.update(editingTask.id, payload);
        setProject((prev) => ({
          ...prev,
          tasks: (prev.tasks || []).map((t) =>
            t.id === editingTask.id ? { ...t, ...updated } : t
          ),
        }));
        toast.success('Task updated');
      } else {
        const created = await tasksApi.create(project.id, payload);
        setProject((prev) => ({
          ...prev,
          tasks: [...(prev.tasks || []), created],
        }));
        toast.success('Task added');
      }
      setIsTaskOpen(false);
      setEditingTask(null);
      setTaskForm(emptyTaskForm);
    } catch (err) {
      const errors = err.response?.data?.errors;
      const message = errors
        ? Object.values(errors)[0][0]
        : 'Failed to save task';
      toast.error(message);
    } finally {
      setTaskSubmitting(false);
    }
  };

  const handleTaskDelete = async () => {
    if (!taskDeleteTarget) return;
    setTaskDeleting(true);
    try {
      await tasksApi.delete(taskDeleteTarget.id);
      setProject((prev) => ({
        ...prev,
        tasks: (prev.tasks || []).filter((t) => t.id !== taskDeleteTarget.id),
      }));
      toast.success('Task deleted');
      setTaskDeleteTarget(null);
    } catch (err) {
      toast.error('Failed to delete task');
    } finally {
      setTaskDeleting(false);
    }
  };

  // ============= FILE UPLOAD =============
  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File too large. Max 10 MB.');
      e.target.value = '';
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const uploaded = await attachmentsApi.upload(
        project.id,
        file,
        setUploadProgress
      );
      setProject((prev) => ({
        ...prev,
        attachments: [uploaded, ...(prev.attachments || [])],
      }));
      toast.success('File uploaded');
    } catch (err) {
      const errors = err.response?.data?.errors;
      const message = errors
        ? Object.values(errors)[0][0]
        : err.response?.data?.message || 'Failed to upload file';
      toast.error(message);
    } finally {
      setUploading(false);
      setUploadProgress(0);
      e.target.value = '';
    }
  };

  // ============= FILE DOWNLOAD (Direct fetch, bypass module) =============
  const handleFileDownload = async (file) => {
    if (downloadingId) return;
    setDownloadingId(file.id);
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(
        `${API_URL}/attachments/${file.id}/download`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = file.name || file.original_name || 'file';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Download started');
    } catch (err) {
      console.error('Download error:', err);
      toast.error('Failed to download file');
    } finally {
      setDownloadingId(null);
    }
  };

  // ============= FILE DELETE =============
  const handleAttachmentDelete = async () => {
    if (!attachmentDeleteTarget) return;
    setAttachmentDeleting(true);
    try {
      await attachmentsApi.delete(attachmentDeleteTarget.id);
      setProject((prev) => ({
        ...prev,
        attachments: (prev.attachments || []).filter(
          (a) => a.id !== attachmentDeleteTarget.id
        ),
      }));
      toast.success('File deleted');
      setAttachmentDeleteTarget(null);
    } catch (err) {
      console.error('Delete error:', err.response?.data || err);
      const errors = err.response?.data?.errors;
      const message = errors
        ? Object.values(errors)[0][0]
        : err.response?.data?.message || 'Failed to delete file';
      toast.error(message);
    } finally {
      setAttachmentDeleting(false);
    }
  };

  // ============= LOADING / ERROR =============
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 size={22} className="text-text-muted animate-spin" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="text-center py-16 px-4">
        <div className="w-12 h-12 rounded-xl bg-danger/10 flex items-center justify-center mx-auto mb-4">
          <FolderKanban size={22} className="text-danger" />
        </div>
        <h2 className="text-lg font-semibold text-text-primary mb-2">
          {error || 'Project not found'}
        </h2>
        <Link to="/projects" className="btn-primary mt-4 inline-flex">
          Back to Projects
        </Link>
      </div>
    );
  }

  // ============= COMPUTED =============
  const tasksArray = Array.isArray(project.tasks) ? project.tasks : [];
  const attachmentsArray = Array.isArray(project.attachments)
    ? project.attachments
    : [];

  const doneCount = tasksArray.filter((t) => t.status === 'done').length;
  const progress =
    tasksArray.length > 0
      ? Math.round((doneCount / tasksArray.length) * 100)
      : project.progress || 0;

  const formattedDeadline = project.deadline
    ? new Date(project.deadline).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '—';

  const hasFeedback = !!project.client_feedback_at;
  const shareUrl = project.share_token
    ? `${window.location.origin}/p/${project.share_token}`
    : '';

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
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-start gap-3 sm:gap-4 min-w-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-accent-subtle flex items-center justify-center flex-shrink-0">
            <FolderKanban
              size={20}
              strokeWidth={1.75}
              className="text-accent"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h2 className="text-lg sm:text-2xl heading-tighter text-text-primary break-all">
                {project.name}
              </h2>
              <span
                className={
                  projectStatusStyles[project.status] || 'badge-neutral'
                }
              >
                {(project.status || 'active').replace('_', ' ')}
              </span>
            </div>
            {project.client?.name && (
              <p className="text-sm text-text-muted truncate">
                {project.client.name}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2">
          <button
            onClick={openEdit}
            className="btn-secondary justify-center"
          >
            <Pencil size={14} strokeWidth={2} />
            Edit
          </button>
          <button
            onClick={handleShare}
            disabled={shareLoading}
            className="btn-secondary justify-center"
          >
            <Share2 size={14} strokeWidth={2} />
            {shareLoading ? 'Loading...' : 'Share'}
          </button>
          <button
            onClick={() => setShowDelete(true)}
            className="btn-secondary justify-center text-danger hover:text-danger hover:bg-danger/5 col-span-2 sm:col-span-1"
          >
            <Trash2 size={14} strokeWidth={2} />
            Delete
          </button>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
        <div className="card">
          <div className="flex items-center gap-3">
            <User
              size={16}
              strokeWidth={1.75}
              className="text-text-subtle flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-text-subtle uppercase tracking-wider">
                Client
              </p>
              <p className="text-sm text-text-primary mt-0.5 truncate">
                {project.client?.name || '—'}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <Calendar
              size={16}
              strokeWidth={1.75}
              className="text-text-subtle flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-text-subtle uppercase tracking-wider">
                Deadline
              </p>
              <p className="text-sm text-text-primary mt-0.5">
                {formattedDeadline}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <CheckCircle2
              size={16}
              strokeWidth={1.75}
              className="text-text-subtle flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-text-subtle uppercase tracking-wider">
                Progress
              </p>
              <p className="text-sm text-text-primary mt-0.5 tabular-nums">
                {progress}% ({doneCount}/{tasksArray.length})
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="card mb-6">
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
      </div>

      {/* ========== CLIENT FEEDBACK CARD ========== */}
      {hasFeedback && (
        <div className="mb-6">
          <h2 className="text-base font-semibold text-text-primary mb-4 flex items-center gap-2">
            <MessageSquare size={16} strokeWidth={1.75} />
            Client Feedback
          </h2>
          <div
            className={`card ${
              project.client_approved
                ? 'border-success/30 bg-success/5'
                : 'border-warning/30 bg-warning/5'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  project.client_approved
                    ? 'bg-success/10'
                    : 'bg-warning/10'
                }`}
              >
                {project.client_approved ? (
                  <CheckCircle2 size={20} className="text-success" />
                ) : (
                  <AlertCircle size={20} className="text-warning" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p
                      className={`text-sm font-semibold ${
                        project.client_approved
                          ? 'text-success'
                          : 'text-warning'
                      }`}
                    >
                      {project.client_approved
                        ? 'Client approved this project'
                        : 'Client requested changes'}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {new Date(project.client_feedback_at).toLocaleString(
                        'en-US',
                        {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                        }
                      )}
                    </p>
                  </div>
                  <button
                    onClick={() => setClearFeedbackOpen(true)}
                    className="p-1.5 rounded-lg text-text-muted hover:text-danger hover:bg-danger/5 transition-colors flex-shrink-0"
                    title="Clear feedback"
                  >
                    <X size={14} strokeWidth={1.75} />
                  </button>
                </div>
                {project.client_feedback && (
                  <div className="mt-3 p-3 rounded-lg bg-bg-base/60 border border-border">
                    <p className="text-sm text-text-body whitespace-pre-wrap break-words">
                      {project.client_feedback}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Description */}
      {project.description && (
        <div className="card mb-6">
          <p className="text-xs text-text-subtle uppercase tracking-wider mb-2">
            Description
          </p>
          <p className="text-sm text-text-body whitespace-pre-wrap break-words">
            {project.description}
          </p>
        </div>
      )}

      {/* ========== TASKS ========== */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-text-primary">
            Tasks ({tasksArray.length})
          </h2>
          <button
            onClick={openAddTask}
            className="text-xs text-accent hover:text-accent-hover font-medium flex items-center gap-1"
          >
            <Plus size={14} strokeWidth={2} />
            Add Task
          </button>
        </div>

        {tasksArray.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-sm text-text-muted">No tasks yet.</p>
            <button
              onClick={openAddTask}
              className="btn-primary mt-4 inline-flex"
            >
              <Plus size={16} strokeWidth={2} />
              Add First Task
            </button>
          </div>
        ) : (
          <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
            {tasksArray.map((task, index) => {
              const Icon = statusIcon[task.status] || Circle;
              return (
                <div
                  key={task.id}
                  className={`group flex items-start gap-3 p-4 hover:bg-bg-hover transition-colors ${
                    index !== tasksArray.length - 1
                      ? 'border-b border-border'
                      : ''
                  }`}
                >
                  <Icon
                    size={18}
                    strokeWidth={2}
                    className={`flex-shrink-0 mt-0.5 ${
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
                    {task.description && (
                      <p className="text-xs text-text-muted mt-1 line-clamp-2">
                        {task.description}
                      </p>
                    )}
                    {task.due_date && (
                      <p className="text-xs text-text-subtle mt-1">
                        Due{' '}
                        {new Date(task.due_date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    )}
                  </div>
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
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <button
                      onClick={() => openEditTask(task)}
                      className="p-1.5 rounded-lg text-text-muted hover:text-accent hover:bg-accent-subtle transition-colors"
                      title="Edit task"
                    >
                      <Pencil size={13} strokeWidth={1.75} />
                    </button>
                    <button
                      onClick={() => setTaskDeleteTarget(task)}
                      className="p-1.5 rounded-lg text-text-muted hover:text-danger hover:bg-danger/5 transition-colors"
                      title="Delete task"
                    >
                      <Trash2 size={13} strokeWidth={1.75} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ========== FILES ========== */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-text-primary">
            Files ({attachmentsArray.length})
          </h2>
          <button
            onClick={handleFileSelect}
            disabled={uploading}
            className="text-xs text-accent hover:text-accent-hover font-medium flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Uploading {uploadProgress}%
              </>
            ) : (
              <>
                <Upload size={14} strokeWidth={2} />
                Upload File
              </>
            )}
          </button>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".jpg,.jpeg,.png,.gif,.webp,.svg,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip,.rar,.7z,.gz"
        />

        {attachmentsArray.length === 0 ? (
          <div className="card text-center py-12">
            <div className="w-12 h-12 rounded-xl bg-accent-subtle flex items-center justify-center mx-auto mb-3">
              <Upload size={20} className="text-accent" />
            </div>
            <p className="text-sm text-text-muted mb-4">
              No files uploaded yet.
            </p>
            <button
              onClick={handleFileSelect}
              disabled={uploading}
              className="btn-primary inline-flex"
            >
              <Upload size={16} strokeWidth={2} />
              Upload First File
            </button>
            <p className="text-xs text-text-subtle mt-3">
              Images, PDFs, Docs, Archives — Max 10 MB
            </p>
          </div>
        ) : (
          <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
            {attachmentsArray.map((file, index) => {
              const Icon = getFileIcon(file.mime_type);
              const isDownloading = downloadingId === file.id;
              return (
                <div
                  key={file.id}
                  className={`group flex items-center gap-3 p-3 sm:p-4 hover:bg-bg-hover transition-colors ${
                    index !== attachmentsArray.length - 1
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
                      {file.name || file.original_name}
                    </p>
                    <p className="text-xs text-text-subtle mt-0.5">
                      {formatBytes(file.size)}
                    </p>
                  </div>

                  <button
                    onClick={() => handleFileDownload(file)}
                    disabled={isDownloading}
                    className="p-1.5 rounded-lg text-text-muted hover:text-accent hover:bg-accent-subtle transition-colors disabled:opacity-50"
                    title="Download"
                  >
                    {isDownloading ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Download size={14} strokeWidth={1.75} />
                    )}
                  </button>

                  <button
                    onClick={() => setAttachmentDeleteTarget(file)}
                    className="p-1.5 rounded-lg text-text-muted hover:text-danger hover:bg-danger/5 transition-colors"
                    title="Delete file"
                  >
                    <Trash2 size={14} strokeWidth={1.75} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ========== EDIT PROJECT MODAL ========== */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Project"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label className="label">Project Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input"
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
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="input min-h-[70px] resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Status</label>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value })
                }
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
                  setForm({ ...form, progress: e.target.value })
                }
                className="input"
              />
            </div>
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

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsEditOpen(false)}
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
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

      {/* ========== SHARE MODAL ========== */}
      <Modal
        isOpen={showShare}
        onClose={() => setShowShare(false)}
        title="Share Project"
      >
        <div className="space-y-4">
          <p className="text-sm text-text-muted">
            Share this link with your client so they can view the project
            progress and give feedback.
          </p>

          <div className="flex items-center gap-2 p-3 bg-bg-hover rounded-lg border border-border">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 bg-transparent text-xs text-text-primary outline-none truncate"
            />
            <button
              onClick={copyShareLink}
              className="p-2 rounded-lg bg-accent text-white hover:bg-accent-hover transition-colors flex-shrink-0"
              title="Copy link"
            >
              <Copy size={14} strokeWidth={2} />
            </button>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleUnshare}
              disabled={shareLoading}
              className="btn-secondary flex-1 text-danger hover:text-danger hover:bg-danger/5"
            >
              Stop Sharing
            </button>
            <button
              onClick={() => setShowShare(false)}
              className="btn-primary flex-1"
            >
              Done
            </button>
          </div>
        </div>
      </Modal>

      {/* ========== TASK MODAL ========== */}
      <Modal
        isOpen={isTaskOpen}
        onClose={() => {
          setIsTaskOpen(false);
          setEditingTask(null);
          setTaskForm(emptyTaskForm);
        }}
        title={editingTask ? 'Edit Task' : 'Add Task'}
      >
        <form onSubmit={handleTaskSubmit} className="space-y-4">
          <div>
            <label className="label">Title *</label>
            <input
              type="text"
              value={taskForm.title}
              onChange={(e) =>
                setTaskForm({ ...taskForm, title: e.target.value })
              }
              className="input"
              placeholder="Task title"
              required
            />
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              value={taskForm.description}
              onChange={(e) =>
                setTaskForm({ ...taskForm, description: e.target.value })
              }
              className="input min-h-[80px] resize-none"
              placeholder="Optional details..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Status</label>
              <select
                value={taskForm.status}
                onChange={(e) =>
                  setTaskForm({ ...taskForm, status: e.target.value })
                }
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
                value={taskForm.due_date}
                onChange={(e) =>
                  setTaskForm({ ...taskForm, due_date: e.target.value })
                }
                className="input"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setIsTaskOpen(false);
                setEditingTask(null);
                setTaskForm(emptyTaskForm);
              }}
              className="btn-secondary flex-1"
              disabled={taskSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={taskSubmitting}
            >
              {taskSubmitting
                ? 'Saving...'
                : editingTask
                ? 'Update Task'
                : 'Add Task'}
            </button>
          </div>
        </form>
      </Modal>

      {/* ========== DELETE PROJECT ========== */}
      <ConfirmModal
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Project"
        description={`Are you sure you want to delete "${project.name}"? All tasks and attachments will be lost. This cannot be undone.`}
        confirmText="Delete Project"
        loading={deleting}
        variant="danger"
      />

      {/* ========== CLEAR FEEDBACK ========== */}
      <ConfirmModal
        isOpen={clearFeedbackOpen}
        onClose={() => setClearFeedbackOpen(false)}
        onConfirm={handleClearFeedback}
        title="Clear Feedback"
        description="This will remove the client's feedback. The client can submit a new response from the public share link."
        confirmText="Clear Feedback"
        loading={clearingFeedback}
        variant="danger"
      />

      {/* ========== DELETE TASK ========== */}
      <ConfirmModal
        isOpen={!!taskDeleteTarget}
        onClose={() => setTaskDeleteTarget(null)}
        onConfirm={handleTaskDelete}
        title="Delete Task"
        description={`Delete task "${taskDeleteTarget?.title}"?`}
        confirmText="Delete Task"
        loading={taskDeleting}
        variant="danger"
      />

      {/* ========== DELETE FILE ============ */}
      <ConfirmModal
        isOpen={!!attachmentDeleteTarget}
        onClose={() => setAttachmentDeleteTarget(null)}
        onConfirm={handleAttachmentDelete}
        title="Delete File"
        description={`Delete "${attachmentDeleteTarget?.name || attachmentDeleteTarget?.original_name}"? This cannot be undone.`}
        confirmText="Delete File"
        loading={attachmentDeleting}
        variant="danger"
      />
    </div>
  );
}