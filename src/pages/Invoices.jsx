import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  FileText,
  Trash2,
  Loader2,
  CheckCircle2,
  Download,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import { invoicesApi } from '../api/invoices';
import { clientsApi } from '../api/clients';

const statusStyles = {
  draft: 'badge-neutral',
  sent: 'badge-accent',
  paid: 'badge-success',
  overdue: 'badge-danger',
};

const emptyItem = { description: '', quantity: 1, rate: 0 };

const emptyForm = {
  client_id: '',
  issue_date: new Date().toISOString().split('T')[0],
  due_date: '',
  notes: '',
  items: [{ ...emptyItem }],
};

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [invoicesData, clientsData] = await Promise.all([
        invoicesApi.list(),
        clientsApi.list(),
      ]);
      setInvoices(Array.isArray(invoicesData) ? invoicesData : []);
      setClients(Array.isArray(clientsData) ? clientsData : []);
    } catch (err) {
      console.error('Fetch error:', err.response?.data);
      toast.error('Failed to load invoices');
      setInvoices([]);
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = invoices.filter((inv) => {
    const clientName =
      inv.client?.name ||
      clients.find((c) => c.id === inv.client_id)?.name ||
      '';
    return (
      (inv.number || '').toLowerCase().includes(search.toLowerCase()) ||
      clientName.toLowerCase().includes(search.toLowerCase())
    );
  });

  const openCreateModal = () => {
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const addItem = () => {
    setForm({ ...form, items: [...form.items, { ...emptyItem }] });
  };

  const removeItem = (index) => {
    if (form.items.length === 1) return;
    setForm({
      ...form,
      items: form.items.filter((_, i) => i !== index),
    });
  };

  const updateItem = (index, field, value) => {
    const items = [...form.items];
    items[index][field] = value;
    setForm({ ...form, items });
  };

  const calculateTotal = () => {
    return form.items.reduce((sum, item) => {
      return (
        sum +
        (parseFloat(item.quantity) || 0) * (parseFloat(item.rate) || 0)
      );
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        client_id: form.client_id || null,
        issue_date: form.issue_date,
        due_date: form.due_date,
        notes: form.notes,
        items: form.items.map((item) => ({
          description: item.description,
          quantity: parseFloat(item.quantity) || 1,
          rate: parseFloat(item.rate) || 0,
        })),
      };

      const newInvoice = await invoicesApi.create(payload);
      setInvoices([newInvoice, ...invoices]);
      setIsModalOpen(false);
      setForm(emptyForm);
      toast.success('Invoice created');
    } catch (err) {
      console.error('Create error:', err.response?.data);
      const errors = err.response?.data?.errors;
      const message = errors
        ? Object.values(errors)[0][0]
        : err.response?.data?.message || 'Failed to create invoice';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (invoice) => {
    if (!confirm(`Delete invoice ${invoice.number}?`)) return;
    try {
      await invoicesApi.delete(invoice.id);
      setInvoices(invoices.filter((i) => i.id !== invoice.id));
      toast.success('Invoice deleted');
    } catch (err) {
      toast.error('Failed to delete invoice');
    }
  };

  const handleMarkPaid = async (invoice) => {
    try {
      const updated = await invoicesApi.markPaid(invoice.id);
      setInvoices(invoices.map((i) => (i.id === invoice.id ? updated : i)));
      toast.success('Marked as paid');
    } catch (err) {
      toast.error('Failed to mark as paid');
    }
  };

  const handleDownload = async (invoice) => {
    try {
      await invoicesApi.downloadPdf(invoice.id, invoice.number);
      toast.success('PDF downloaded');
    } catch (err) {
      console.error('PDF error:', err);
      toast.error('Failed to download PDF');
    }
  };

  const total = calculateTotal();

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-text-primary">
            Invoices
          </h2>
          <p className="text-sm text-text-muted mt-1">
            Create and track your invoices
          </p>
        </div>
        <button onClick={openCreateModal} className="btn-primary w-full sm:w-auto justify-center">
          <Plus size={16} strokeWidth={2} />
          New Invoice
        </button>
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
          placeholder="Search invoices..."
          className="input pl-9"
        />
      </div>

      {/* List */}
      {loading ? (
        <div className="card flex items-center justify-center py-12">
          <Loader2 size={20} className="text-text-muted animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={FileText}
            title={search ? 'No invoices found' : 'No invoices yet'}
            description={
              search
                ? 'Try a different search term.'
                : 'Create your first invoice to get started.'
            }
            action={
              !search && (
                <button onClick={openCreateModal} className="btn-primary">
                  <Plus size={16} strokeWidth={2} />
                  Create Invoice
                </button>
              )
            }
          />
        </div>
      ) : (
        <div className="card p-0 divide-y divide-border">
          {filtered.map((invoice) => (
            <InvoiceRow
              key={invoice.id}
              invoice={invoice}
              onDelete={handleDelete}
              onMarkPaid={handleMarkPaid}
              onDownload={handleDownload}
            />
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setForm(emptyForm);
        }}
        title="New Invoice"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Client</label>
            <select
              value={form.client_id}
              onChange={(e) =>
                setForm({ ...form, client_id: e.target.value })
              }
              className="input"
            >
              <option value="">— Select client —</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="label">Issue Date *</label>
              <input
                type="date"
                value={form.issue_date}
                onChange={(e) =>
                  setForm({ ...form, issue_date: e.target.value })
                }
                className="input"
                required
              />
            </div>
            <div>
              <label className="label">Due Date *</label>
              <input
                type="date"
                value={form.due_date}
                onChange={(e) =>
                  setForm({ ...form, due_date: e.target.value })
                }
                className="input"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="label mb-0">Items</label>
              <button
                type="button"
                onClick={addItem}
                className="text-xs text-accent hover:text-accent-hover font-medium"
              >
                + Add Item
              </button>
            </div>

            <div className="space-y-2">
              {form.items.map((item, index) => (
                <div key={index} className="flex flex-wrap items-start gap-2">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) =>
                      updateItem(index, 'description', e.target.value)
                    }
                    className="input flex-1 min-w-[120px] text-xs"
                    placeholder="Description"
                    required
                  />
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(index, 'quantity', e.target.value)
                    }
                    className="input w-16 text-xs"
                    placeholder="Qty"
                    required
                  />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.rate}
                    onChange={(e) =>
                      updateItem(index, 'rate', e.target.value)
                    }
                    className="input w-20 text-xs"
                    placeholder="Rate"
                    required
                  />
                  {form.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="p-2 text-text-muted hover:text-danger transition-colors"
                    >
                      <Trash2 size={14} strokeWidth={1.75} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
              <span className="text-sm text-text-muted">Total</span>
              <span className="text-lg font-semibold text-text-primary tabular-nums">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>

          <div>
            <label className="label">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="input min-h-[60px] resize-none text-xs"
              placeholder="Optional payment terms, bank details..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setForm(emptyForm);
              }}
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
              {submitting ? 'Creating...' : 'Create Invoice'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function InvoiceRow({ invoice, onDelete, onMarkPaid, onDownload }) {
  const formattedTotal = parseFloat(invoice.total || 0).toFixed(2);
  const formattedDue = invoice.due_date
    ? new Date(invoice.due_date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '—';

  return (
    <div className="p-3 sm:p-4 hover:bg-bg-hover transition-colors group">
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-accent-subtle flex items-center justify-center flex-shrink-0">
          <FileText size={16} strokeWidth={1.75} className="text-accent" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-text-primary whitespace-nowrap">
              {invoice.number}
            </span>
            <span className={statusStyles[invoice.status] || 'badge-neutral'}>
              {invoice.status}
            </span>
          </div>
          <p className="text-xs text-text-muted truncate">
            {invoice.client?.name || 'No client'} • Due {formattedDue}
          </p>
        </div>

        {/* Total + desktop actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <p className="text-sm font-semibold text-text-primary tabular-nums whitespace-nowrap">
            ${formattedTotal}
          </p>

          {/* Desktop hover actions */}
          <div className="hidden sm:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onDownload(invoice)}
              className="p-1.5 rounded-lg text-text-muted hover:text-accent hover:bg-accent/10 transition-colors"
              title="Download PDF"
            >
              <Download size={14} strokeWidth={1.75} />
            </button>

            {invoice.status !== 'paid' && (
              <button
                onClick={() => onMarkPaid(invoice)}
                className="p-1.5 rounded-lg text-text-muted hover:text-success hover:bg-success/10 transition-colors"
                title="Mark as paid"
              >
                <CheckCircle2 size={14} strokeWidth={1.75} />
              </button>
            )}

            <button
              onClick={() => onDelete(invoice)}
              className="p-1.5 rounded-lg text-text-muted hover:text-danger hover:bg-danger/10 transition-colors"
              title="Delete"
            >
              <Trash2 size={14} strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile actions — full width row below */}
      <div className="flex sm:hidden items-center gap-2 mt-3 pl-12">
        <button
          onClick={() => onDownload(invoice)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium text-text-muted border border-border hover:text-accent hover:border-accent/30 hover:bg-accent/5 transition-colors"
        >
          <Download size={13} strokeWidth={1.75} />
          PDF
        </button>

        {invoice.status !== 'paid' && (
          <button
            onClick={() => onMarkPaid(invoice)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium text-text-muted border border-border hover:text-success hover:border-success/30 hover:bg-success/5 transition-colors"
          >
            <CheckCircle2 size={13} strokeWidth={1.75} />
            Paid
          </button>
        )}

        <button
          onClick={() => onDelete(invoice)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium text-text-muted border border-border hover:text-danger hover:border-danger/30 hover:bg-danger/5 transition-colors"
        >
          <Trash2 size={13} strokeWidth={1.75} />
          Delete
        </button>
      </div>
    </div>
  );
}