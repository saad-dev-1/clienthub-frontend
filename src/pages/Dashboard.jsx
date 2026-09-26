import { useAuth } from '../context/useAuth';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-text-primary mb-1">
          Good morning, {user?.name?.split(' ')[0]} 👋
        </h2>
        <p className="text-sm text-text-muted">
          Here's what's happening today.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Active Projects', value: '0' },
          { label: 'Clients', value: '0' },
          { label: 'Pending Tasks', value: '0' },
          { label: 'Revenue', value: '$0' },
        ].map((stat) => (
          <div key={stat.label} className="card">
            <p className="text-xs font-medium uppercase tracking-wide text-text-subtle mb-2">
              {stat.label}
            </p>
            <p className="text-2xl font-semibold text-text-primary tabular-nums">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="card">
        <p className="text-text-muted text-sm">
          Projects, activity, and charts coming soon...
        </p>
      </div>
    </div>
  );
}