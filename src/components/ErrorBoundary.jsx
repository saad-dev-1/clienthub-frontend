import { Component } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-bg-base flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center">
            <div className="w-12 h-12 rounded-xl bg-danger/10 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={22} className="text-danger" />
            </div>

            <h1 className="text-lg font-semibold text-text-primary mb-2">
              Something went wrong
            </h1>

            <p className="text-sm text-text-muted mb-6">
              An unexpected error occurred. Try reloading the page.
            </p>

            {this.state.error && (
              <div className="mb-6 p-3 rounded-lg bg-bg-card border border-border text-left">
                <p className="text-xs text-text-subtle uppercase tracking-wide mb-1">
                  Error
                </p>
                <p className="text-xs text-text-muted font-mono break-all">
                  {this.state.error.message || 'Unknown error'}
                </p>
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <button onClick={this.handleReload} className="btn-primary">
                <RefreshCw size={16} strokeWidth={2} />
                Reload Page
              </button>
              <button onClick={this.handleGoHome} className="btn-secondary">
                <Home size={16} strokeWidth={2} />
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}