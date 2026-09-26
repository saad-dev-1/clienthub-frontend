import { useState, useEffect } from 'react';
import { Plus, Search, Users, MoreHorizontal, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import { clientsApi } from '../api/clients';

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const data = await clientsApi.list();
      setClients(data);
    } catch (err) {
      console.error('Fetch clients error:', err.response?.data);
      toast.error('Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.email && c.email.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const newClient = await clientsApi.create(form);
      setClients([newClient, ...clients]);
      setForm({ name: '', email: '', company: '', phone: '' });
      setIsModalOpen(false);
      toast.success('Client created');
    } catch (err) {
      console.error('Create client error:', err.response?.data);
      const errors = err.response?.data?.errors;
      const message = errors
        ? Object.values(errors)[0][0]
        : err.response?.data?.message || 'Failed to create client';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-text-primary">
            Clients
          </h2>
          <p className="text-sm text-text-muted mt-1">
            Manage your client relationships
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary"
        >
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
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="btn-primary"
                >
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
            <ClientRow key={client.id} client={client} />
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="New Client"
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
              onClick={() => setIsModalOpen(false)}
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
              {submitting ? 'Creating...' : 'Create Client'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function ClientRow({ client }) {
  const initials = client.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex items-center gap-4 p-4 hover:bg-bg-hover transition-colors cursor-pointer">
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

      <button className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-card transition-colors">
        <MoreHorizontal size={16} strokeWidth={1.75} />
      </button>
    </div>
  );
}