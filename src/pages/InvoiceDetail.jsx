import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  FileText,
  Download,
  Trash2,
  CheckCircle2,
  Loader2,
  Calendar,
  User,
  AlertTriangle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { invoicesApi } from '../api/invoices';

const statusStyles = {
  draft: 'badge-neutral',
  sent: 'badge-accent',
  paid: 'badge-success',
  overdue: 'badge-danger',
};

export default function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchInvoice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await invoicesApi.get(id);
      setInvoice(data);
    } catch (err) {
      console.error('Fetch invoice error:', err.response?.data);
      setError(
        err.response?.status === 404
          ? 'Invoice not found.'
          : 'Failed to load invoice.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleMarkPaid = async () => {
    try {
      const updated = await invoicesApi.markPaid(invoice.id);
      setInvoice({ ...invoice, ...updated });
      toast.success('Marked as paid');
    } catch (err) {
      toast.error('Failed to mark as paid');
    }
  };

  const handleDownload = async () => {
    try {
      await invoicesApi.downloadPdf(invoice.id, invoice.number);
      toast.success('PDF downloaded');
    } catch (err) {
      console.error('PDF error:', err);
      toast.error('Failed to download PDF');
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete invoice ${invoice.number}? This cannot be undone.`))
      return;
    setDeleting(true);
    try {
      await invoicesApi.delete(invoice.id);
      toast.success('Invoice deleted');
      navigate('/invoices');
    } catch (err) {
      toast.error('Failed to delete invoice');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={20} className="text-text-muted animate-spin" />
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="text-center py-16 px-4">
        <div className="w-12 h-12 rounded-xl bg-danger/10 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={22} className="text-danger" />
        </div>
        <h2 className="text-lg font-semibold text-text-primary mb-2">
          {error || 'Invoice not found'}
        </h2>
        <Link to="/invoices" className="btn-primary mt-4 inline-flex">
          Back to Invoices
        </Link>
      </div>
    );
  }

  const items = Array.isArray(invoice.items) ? invoice.items : [];
  const subtotal = items.reduce(
    (sum, item) => sum + parseFloat(item.amount || 0),
    0
  );
  const total = parseFloat(invoice.total || subtotal || 0);

  const formattedIssue = invoice.issue_date
    ? new Date(invoice.issue_date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '—';

  const formattedDue = invoice.due_date
    ? new Date(invoice.due_date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '—';

  return (
    <div>
      {/* Back */}
      <Link
        to="/invoices"
        className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors mb-4"
      >
        <ArrowLeft size={14} strokeWidth={2} />
        Back to Invoices
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-start gap-3 sm:gap-4 min-w-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-accent-subtle flex items-center justify-center flex-shrink-0">
            <FileText
              size={18}
              strokeWidth={1.75}
              className="text-accent sm:hidden"
            />
            <FileText
              size={22}
              strokeWidth={1.75}
              className="text-accent hidden sm:block"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h2 className="text-lg sm:text-2xl heading-tighter text-text-primary break-all">
                {invoice.number}
              </h2>
              <span
                className={statusStyles[invoice.status] || 'badge-neutral'}
              >
                {invoice.status}
              </span>
            </div>
            <p className="text-sm text-text-muted truncate">
              {invoice.client?.name || 'No client'}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2">
          <button
            onClick={handleDownload}
            className="btn-secondary justify-center"
          >
            <Download size={14} strokeWidth={2} />
            PDF
          </button>
          {invoice.status !== 'paid' && (
            <button
              onClick={handleMarkPaid}
              className="btn-secondary justify-center text-success hover:text-success hover:bg-success/5"
            >
              <CheckCircle2 size={14} strokeWidth={2} />
              Mark Paid
            </button>
          )}
          <button
            onClick={handleDelete}
            disabled={deleting}
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
                Billed To
              </p>
              <p className="text-sm text-text-primary mt-0.5 truncate">
                {invoice.client?.name || '—'}
              </p>
              {invoice.client?.email && (
                <p className="text-xs text-text-muted truncate mt-0.5">
                  {invoice.client.email}
                </p>
              )}
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
                Issue Date
              </p>
              <p className="text-sm text-text-primary mt-0.5">
                {formattedIssue}
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
                Due Date
              </p>
              <p className="text-sm text-text-primary mt-0.5">
                {formattedDue}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Items — Desktop table */}
      <div className="card p-0 overflow-hidden mb-6 hidden sm:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-bg-hover/50">
                <th className="text-left text-xs font-medium uppercase tracking-wider text-text-muted px-5 py-3">
                  Description
                </th>
                <th className="text-right text-xs font-medium uppercase tracking-wider text-text-muted px-5 py-3 whitespace-nowrap">
                  Qty
                </th>
                <th className="text-right text-xs font-medium uppercase tracking-wider text-text-muted px-5 py-3 whitespace-nowrap">
                  Rate
                </th>
                <th className="text-right text-xs font-medium uppercase tracking-wider text-text-muted px-5 py-3 whitespace-nowrap">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center text-sm text-text-muted py-8"
                  >
                    No items on this invoice.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-5 py-3 text-sm text-text-primary">
                      {item.description}
                    </td>
                    <td className="px-5 py-3 text-sm text-text-body text-right tabular-nums">
                      {parseFloat(item.quantity || 0)}
                    </td>
                    <td className="px-5 py-3 text-sm text-text-body text-right tabular-nums">
                      ${parseFloat(item.rate || 0).toFixed(2)}
                    </td>
                    <td className="px-5 py-3 text-sm text-text-primary font-medium text-right tabular-nums">
                      ${parseFloat(item.amount || 0).toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-border p-5 flex justify-end">
          <div className="text-right">
            <p className="text-xs text-text-subtle uppercase tracking-wider mb-1">
              Total
            </p>
            <p className="text-2xl font-semibold heading-tight text-text-primary tabular-nums">
              ${total.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Items — Mobile cards */}
      <div className="sm:hidden space-y-3 mb-6">
        <p className="text-xs text-text-subtle uppercase tracking-wider px-1">
          Items
        </p>
        {items.length === 0 ? (
          <div className="card text-center text-sm text-text-muted py-8">
            No items on this invoice.
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="card p-4">
              <p className="text-sm text-text-primary font-medium mb-2 break-words">
                {item.description}
              </p>
              <div className="flex items-center justify-between text-xs text-text-muted">
                <span className="tabular-nums">
                  {parseFloat(item.quantity || 0)} × ${parseFloat(item.rate || 0).toFixed(2)}
                </span>
                <span className="font-semibold text-text-primary tabular-nums">
                  ${parseFloat(item.amount || 0).toFixed(2)}
                </span>
              </div>
            </div>
          ))
        )}

        <div className="card flex items-center justify-between">
          <span className="text-sm text-text-muted">Total</span>
          <span className="text-xl font-semibold heading-tight text-text-primary tabular-nums">
            ${total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <div className="card">
          <p className="text-xs text-text-subtle uppercase tracking-wider mb-2">
            Notes
          </p>
          <p className="text-sm text-text-body whitespace-pre-wrap break-words">
            {invoice.notes}
          </p>
        </div>
      )}
    </div>
  );
}