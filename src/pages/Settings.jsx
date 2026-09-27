import { useState } from 'react';
import { User, Lock, Loader2, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/useAuth';
import { settingsApi } from '../api/settings';

export default function Settings() {
  const { user } = useAuth();

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl font-semibold text-text-primary">
          Settings
        </h2>
        <p className="text-sm text-text-muted mt-1">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="space-y-4 sm:space-y-6 max-w-2xl">
        <ProfileSection user={user} />
        <PasswordSection />
      </div>
    </div>
  );
}

function ProfileSection({ user }) {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await settingsApi.updateProfile({ name, email });
      toast.success('Profile updated');

      const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem(
        'user',
        JSON.stringify({ ...savedUser, name, email })
      );

      window.location.reload();
    } catch (err) {
      const errors = err.response?.data?.errors;
      const message = errors
        ? Object.values(errors)[0][0]
        : 'Failed to update profile';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="flex items-start gap-3 mb-6">
        <div className="w-9 h-9 rounded-lg bg-accent-subtle flex items-center justify-center flex-shrink-0">
          <User size={18} strokeWidth={1.75} className="text-accent" />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-text-primary">
            Profile Information
          </h3>
          <p className="text-xs text-text-muted mt-0.5">
            Update your name and email address.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
            placeholder="Saad Ahmed"
            required
          />
        </div>

        <div>
          <label className="label">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            placeholder="saad@test.com"
            required
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full sm:w-auto justify-center"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} strokeWidth={2} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

function PasswordSection() {
  const [form, setForm] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await settingsApi.updatePassword(form);
      toast.success('Password updated');
      setForm({
        current_password: '',
        password: '',
        password_confirmation: '',
      });
    } catch (err) {
      const errors = err.response?.data?.errors;
      const message = errors
        ? Object.values(errors)[0][0]
        : 'Failed to update password';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="flex items-start gap-3 mb-6">
        <div className="w-9 h-9 rounded-lg bg-accent-subtle flex items-center justify-center flex-shrink-0">
          <Lock size={18} strokeWidth={1.75} className="text-accent" />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-text-primary">
            Change Password
          </h3>
          <p className="text-xs text-text-muted mt-0.5">
            Choose a strong password with at least 8 characters.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Current Password</label>
          <input
            type="password"
            name="current_password"
            value={form.current_password}
            onChange={handleChange}
            className="input"
            placeholder="••••••••"
            required
          />
        </div>

        <div>
          <label className="label">New Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="input"
            placeholder="Minimum 8 characters"
            required
          />
        </div>

        <div>
          <label className="label">Confirm New Password</label>
          <input
            type="password"
            name="password_confirmation"
            value={form.password_confirmation}
            onChange={handleChange}
            className="input"
            placeholder="Re-enter password"
            required
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full sm:w-auto justify-center"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Lock size={16} strokeWidth={2} />
                Update Password
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}