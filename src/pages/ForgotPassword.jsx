import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Loader2, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { authApi } from '../api/auth';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      setSent(true);
      toast.success('Reset link sent');
    } catch (err) {
      const message =
        err.response?.data?.message || 'Failed to send reset link';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <img src="/src/assets/logo.svg" alt="Klient" className="w-8 h-8 rounded-lg" />
          <span className="text-lg font-semibold text-text-primary">
            Klient
          </span>
        </div>

        <div className="card">
          {sent ? (
            <div className="text-center py-2">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={22} className="text-success" />
              </div>
              <h1 className="text-lg font-semibold text-text-primary mb-2">
                Check your email
              </h1>
              <p className="text-sm text-text-muted mb-6">
                We've sent a password reset link to <strong>{email}</strong>.
                It will expire in 60 minutes.
              </p>
              <Link
                to="/login"
                className="btn-secondary w-full justify-center"
              >
                <ArrowLeft size={14} strokeWidth={2} />
                Back to Sign in
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h1 className="text-xl font-semibold text-text-primary mb-1">
                  Forgot password?
                </h1>
                <p className="text-sm text-text-muted">
                  Enter your email and we'll send you a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="label">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input"
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                    autoFocus
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
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail size={16} strokeWidth={2} />
                      Send Reset Link
                    </>
                  )}
                </button>
              </form>

              <Link
                to="/login"
                className="text-sm text-text-muted hover:text-text-primary transition-colors text-center mt-6 inline-flex items-center gap-1.5 w-full justify-center"
              >
                <ArrowLeft size={12} strokeWidth={2} />
                Back to Sign in
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}