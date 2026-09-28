import { useState } from 'react';
import {
  FileText,
  Image as ImageIcon,
  FileArchive,
  File as FileIcon,
  Download,
  Trash2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmModal from './ConfirmModal';
import { attachmentsApi } from '../../api/attachments';

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
  if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('tar')) return FileArchive;
  if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('text')) return FileText;
  return FileIcon;
}

export default function FilesList({ files, onDeleted }) {
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleDownload = (file) => {
    const url = attachmentsApi.downloadUrl(file.id);
    window.open(url, '_blank');
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await attachmentsApi.delete(deleteTarget.id);
      toast.success('File deleted');
      onDeleted(deleteTarget.id);
      setDeleteTarget(null);
    } catch (err) {
      toast.error('Failed to delete file');
    } finally {
      setDeleting(false);
    }
  };

  if (!files || files.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-text-muted">
        No files uploaded yet.
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2">
        {files.map((file) => {
          const Icon = getFileIcon(file.mime_type);
          return (
            <div
              key={file.id}
              className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-bg-hover transition-colors group"
            >
              <div className="w-9 h-9 rounded-lg bg-accent-subtle flex items-center justify-center flex-shrink-0">
                <Icon size={16} className="text-accent" strokeWidth={1.75} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  {file.name}
                </p>
                <p className="text-xs text-text-subtle mt-0.5">
                  {formatBytes(file.size)}
                  {file.created_at && (
                    <>
                      {' • '}
                      {new Date(file.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </>
                  )}
                </p>
              </div>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleDownload(file)}
                  className="p-1.5 rounded-lg text-text-muted hover:text-accent hover:bg-accent-subtle transition-colors"
                  title="Download"
                >
                  <Download size={14} strokeWidth={1.75} />
                </button>
                <button
                  onClick={() => setDeleteTarget(file)}
                  className="p-1.5 rounded-lg text-text-muted hover:text-danger hover:bg-danger/5 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={14} strokeWidth={1.75} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete File"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmText="Delete File"
        loading={deleting}
        variant="danger"
      />
    </>
  );
}