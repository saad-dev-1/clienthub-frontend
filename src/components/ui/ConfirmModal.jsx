import { AlertTriangle, Loader2 } from 'lucide-react';
import Modal from './Modal';

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  loading = false,
  variant = 'danger',
}) {
  const variantStyles = {
    danger: {
      iconBg: 'bg-danger/10',
      iconColor: 'text-danger',
      buttonClass: 'btn-danger',
    },
    warning: {
      iconBg: 'bg-warning/10',
      iconColor: 'text-warning',
      buttonClass: 'btn-primary',
    },
  };

  const styles = variantStyles[variant] || variantStyles.danger;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex items-start gap-3 sm:gap-4 mb-6">
        <div
          className={`w-10 h-10 rounded-full ${styles.iconBg} flex items-center justify-center flex-shrink-0`}
        >
          <AlertTriangle
            size={20}
            strokeWidth={2}
            className={styles.iconColor}
          />
        </div>
        <div className="flex-1 pt-1 min-w-0">
          <p className="text-sm text-text-body leading-relaxed break-words">
            {description}
          </p>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row gap-3">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="btn-secondary flex-1 justify-center"
        >
          {cancelText}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={loading}
          className={`${styles.buttonClass} flex-1 justify-center`}
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Deleting...
            </>
          ) : (
            confirmText
          )}
        </button>
      </div>
    </Modal>
  );
}