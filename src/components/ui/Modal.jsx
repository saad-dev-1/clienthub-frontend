import { X } from 'lucide-react';
import { useEffect } from 'react';

export default function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal wrapper */}
      <div className="flex min-h-full items-start sm:items-center justify-center p-4 py-6">
        <div
          className="relative w-full max-w-md bg-bg-card border border-border rounded-xl shadow-xl my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-3 p-4 sm:p-5 border-b border-border sticky top-0 bg-bg-card rounded-t-xl z-10">
            <h2 className="text-base font-semibold text-text-primary truncate">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors flex-shrink-0"
            >
              <X size={18} strokeWidth={1.75} />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 sm:p-5">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}