import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Users,
  Pencil,
  Trash2,
  Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import { clientsApi } from '../api/clients';

const emptyForm = { name: '', email: '', company: '', phone: '' };

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const data = await clientsApi.list();
      setClients(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Fetch clients error:', err.response?.data);
      toast.error('Failed to load clients');
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  const clientsArray = Array.isArray(clients) ? clients : [];
  const filteredClients = clientsArray.filter(
    (c) =>
      (c.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.email || '').toLowerCase().includes(search.toLowerCase())
  );

  const openCreateModal = () => {
    setEditingClient(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (client) => {
    setEditingClient(client);
    setForm({
      name: client.name || '',
      email: client.email || '',
      company: client.company || '',
      phone: client.phone || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingClient) {
        const updated = await clientsApi.update(editingClient.id, form);
        setClients(
          clientsArray.map((c) =>
            c.id === editingClient.id ? { ...c, ...updated } : c
          )
        );
        toast.success('Client updated');
      } else {
        const newClient = await clientsApi.create(form);
        setClients([newClient, ...clientsArray]);
        toast.success('Client created');
      }
      setIsModalOpen(false);
      setForm(emptyForm);
      setEditingClient(null);
    } catch (err) {
      console.error('Submit error:', err.response?.data);
      const errors = err.response?.data?.errors;
      const message = errors
        ? Object.values(errors)[0][0]
        : err.response?.data?.message || 'Something went wrong';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (client) => {
    if (!confirm(`Delete "${client.name}"? This cannot be undone.`)) return;
    try {
      await clientsApi.delete(client.id);
      setClients(clientsArray.filter((c) => c.id !== client.id));
      toast.success('Client deleted');
    } catch (err) {
      console.error('Delete error:', err.response?.data);
      toast.error('Failed to delete client');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-text-primary">Clients</h2>
          <p className="text-sm text-text-muted mt-1">
            Manage your client relationships
          </p>
        </div>
        <button onClick={openCreateModal} className="btn-primary">
          <Plus size={16} strokeWidth={2} />
          New Client
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
          placeholder="Search clients..."
          className="input pl-9"
        />
      </div>

      {/* Loading */}
      {loading ? (
        <div className="card flex items-center justify-center py-12">
          <Loader2 size={20} className="text-text-muted animate-spin" />
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={Users}
            title={search ? 'No clients found' : 'No clients yet'}
            description={
              search
                ? 'Try a different search term.'
                : 'Add your first client to get started.'
            }
            action={
              !search && (
                <button onClick={openCreateModal} className="btn-primary">
                  <Plus size={16} strokeWidth={2} />
                  Add Client
                </button>
              )
            }
          />
        </div>
      ) : (
        <div className="card p-0 divide-y divide-border">
          {filteredClients.map((client) => (
            <ClientRow
              key={client.id}
              client={client}
              onEdit={openEditModal}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingClient(null);
          setForm(emptyForm);
        }}
        title={editingClient ? 'Edit Client' : 'New Client'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input"
              placeholder="Ali Furniture"
              required
            />
          </div>

          <div>
            <label className="label">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="input"
              placeholder="ali@furniture.com"
            />
          </div>

          <div>
            <label className="label">Company</label>
            <input
              type="text"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              className="input"
              placeholder="Ali Furniture Co."
            />
          </div>

          <div>
            <label className="label">Phone</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="input"
              placeholder="+92 300 1234567"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setEditingClient(null);
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
              {submitting
                ? editingClient
                  ? 'Saving...'
                  : 'Creating...'
                : editingClient
                ? 'Save Changes'
                : 'Create Client'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function ClientRow({ client, onEdit, onDelete }) {
  const initials = (client.name || '?')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex items-center gap-4 p-4 hover:bg-bg-hover transition-colors group">
      <Link
        to={`/clients/${client.id}`}
        className="flex items-center gap-4 flex-1 min-w-0 cursor-pointer"
      >
        <div className="w-10 h-10 rounded-full bg-accent-subtle flex items-center justify-center text-accent text-xs font-semibold flex-shrink-0">
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text-primary truncate">
            {client.name}
          </p>
          <p className="text-xs text-text-muted truncate">
            {client.email || client.company || '—'}
          </p>
        </div>
      </Link>

      {/* Actions — visible on hover */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(client)}
          className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-card transition-colors"
          title="Edit"
        >
          <Pencil size={14} strokeWidth={1.75} />
        </button>
        <button
          onClick={() => onDelete(client)}
          className="p-1.5 rounded-lg text-text-muted hover:text-danger hover:bg-danger/10 transition-colors"
          title="Delete"
        >
          <Trash2 size={14} strokeWidth={1.75} />
        </button>
      </div>
    </div>
  );
}