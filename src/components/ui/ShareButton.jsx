import { useState } from 'react';
import { Share2, Copy, Check, Globe } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

export default function ShareButton({ project, onUpdate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = project?.share_token
    ? `${window.location.origin}/p/${project.share_token}`
    : '';

  const toggleShare = async () => {
    if (!project?.id) return;
    setLoading(true);
    try {
      if (project.is_public) {
        await api.delete(`/projects/${project.id}/share`);
        onUpdate({ ...project, is_public: false });
        toast.success('Sharing disabled');
      } else {
        const res = await api.post(`/projects/${project.id}/share`);
        onUpdate({
          ...project,
          is_public: true,
          share_token: res.data.share_token,
        });
        toast.success('Share link created');
      }
    } catch (err) {
      console.error(err.response?.data);
      toast.error('Failed to update share settings');
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success('Link copied');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="btn-secondary">
        <Share2 size={16} strokeWidth={2} />
        Share
        {project?.is_public && (
          <span className="w-1.5 h-1.5 rounded-full bg-success" />
        )}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-md bg-bg-card border border-border rounded-xl shadow-xl p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3 mb-5">
              <div className="w-9 h-9 rounded-lg bg-accent-subtle flex items-center justify-center flex-shrink-0">
                <Globe size={18} strokeWidth={1.75} className="text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-text-primary mb-1">
                  Share this project
                </h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  Anyone with the link can view progress and tasks. No login
                  required.
                </p>
              </div>
            </div>

            {project?.is_public && shareUrl ? (
              <>
                <div className="mb-3">
                  <label className="label">Share Link</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={shareUrl}
                      readOnly
                      className="input flex-1 text-xs"
                      onClick={(e) => e.target.select()}
                    />
                    <button
                      onClick={copyLink}
                      className="btn-primary px-3"
                    >
                      {copied ? (
                        <Check size={16} strokeWidth={2} />
                      ) : (
                        <Copy size={16} strokeWidth={2} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-xs text-text-muted">
                    Sharing enabled
                  </span>
                  <button
                    onClick={toggleShare}
                    disabled={loading}
                    className="text-xs text-danger hover:text-danger/80 font-medium transition-colors"
                  >
                    {loading ? 'Disabling...' : 'Disable sharing'}
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={toggleShare}
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? 'Creating...' : 'Create share link'}
              </button>
            )}

            <button
              onClick={() => setIsOpen(false)}
              className="text-xs text-text-muted hover:text-text-primary transition-colors mt-4 w-full text-center"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}