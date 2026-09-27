import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { authApi } from '../api/auth';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [form, setForm] = useState({
    password: '',
    password_confirmation: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const t = searchParams.get('token');
    const e = searchParams.get('email');

    if (!t || !e) {
      setError('Invalid reset link. Please request a new one.');
    } else {
      setToken(t);
      setEmail(e);
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.resetPassword({
        email,
        token,
        password: form.password,
        password_confirmation: form.password_confirmation,
      });
      setSuccess(true);
      toast.success('Password reset successfully');

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      const errors = err.response?.data?.errors;
      const message = errors
        ? Object.values(errors)[0][0]
        : err.response?.data?.message || 'Failed to reset password';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <span className="text-white font-semibold text-sm">K</span>
          </div>
          <span className="text-lg font-semibold text-text-primary">
            Klient
          </span>
        </div>

        <div className="card">
          {error ? (
            <div className="text-center py-2">
              <div className="w-12 h-12 rounded-xl bg-danger/10 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={22} className="text-danger" />
              </div>
              <h1 className="text-lg font-semibold text-text-primary mb-2">
                Link not valid
              </h1>
              <p className="text-sm text-text-muted mb-6">{error}</p>
              <Link
                to="/forgot-password"
                className="btn-primary w-full justify-center"
              >
                Request New Link
              </Link>
            </div>
          ) : success ? (
            <div className="text-center py-2">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={22} className="text-success" />
              </div>
              <h1 className="text-lg font-semibold text-text-primary mb-2">
                Password updated
              </h1>
              <p className="text-sm text-text-muted">
                Redirecting you to sign in...
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h1 className="text-xl font-semibold text-text-primary mb-1">
                  Reset your password
                </h1>
                <p className="text-sm text-text-muted">
                  Choose a strong new password for{' '}
                  <strong className="break-all">{email}</strong>.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
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
                    minLength={8}
                    autoFocus
                  />
                </div>

                <div>
                  <label className="label">Confirm Password</label>
                  <input
                    type="password"
                    name="password_confirmation"
                    value={form.password_confirmation}
                    onChange={handleChange}
                    className="input"
                    placeholder="Re-enter password"
                    required
                    minLength={8}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full justify-center"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Resetting...
                    </>
                  ) : (
                    <>
                      <Lock size={16} strokeWidth={2} />
                      Reset Password
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}