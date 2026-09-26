export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && (
        <div className="w-12 h-12 rounded-xl bg-bg-hover flex items-center justify-center mb-4">
          <Icon size={22} strokeWidth={1.5} className="text-text-subtle" />
        </div>
      )}
      <h3 className="text-sm font-semibold text-text-primary mb-1">
        {title}
      </h3>
      <p className="text-sm text-text-muted max-w-xs mb-4">
        {description}
      </p>
      {action}
    </div>
  );
}