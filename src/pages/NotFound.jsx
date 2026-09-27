import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-7xl sm:text-9xl font-bold text-accent mb-4 tabular-nums">
          404
        </h1>

        <h2 className="text-lg font-semibold text-text-primary mb-2">
          Page not found
        </h2>

        <p className="text-sm text-text-muted mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/dashboard" className="btn-primary justify-center">
            <Home size={16} strokeWidth={2} />
            Go to Dashboard
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn-secondary justify-center"
          >
            <ArrowLeft size={16} strokeWidth={2} />
            Go Back
          </button>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-xs text-text-subtle mb-3">
            Looking for something specific?
          </p>
          <div className="flex items-center gap-2 justify-center text-xs text-text-muted">
            <Search size={12} strokeWidth={1.75} />
            <span>Try the search on your dashboard</span>
          </div>
        </div>
      </div>
    </div>
  );
}