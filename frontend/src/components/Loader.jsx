const Loader = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${sizes[size]} border-gray-200 border-t-primary-500 rounded-full animate-spin`} />
    </div>
  );
};

export const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <Loader size="lg" className="mb-4" />
      <p className="text-gray-500 text-sm">Loading...</p>
    </div>
  </div>
);

export const SkeletonCard = () => (
  <div className="card p-0 overflow-hidden">
    <div className="skeleton h-48 w-full rounded-none" />
    <div className="p-4 space-y-3">
      <div className="skeleton h-5 w-3/4 rounded-lg" />
      <div className="skeleton h-4 w-1/2 rounded-lg" />
      <div className="flex gap-3">
        <div className="skeleton h-4 w-16 rounded-lg" />
        <div className="skeleton h-4 w-16 rounded-lg" />
      </div>
    </div>
  </div>
);

export const EmptyState = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
    <div className="text-6xl mb-4">{icon || '🍽️'}</div>
    <h3 className="text-xl font-bold text-dark-900 mb-2">{title}</h3>
    <p className="text-gray-500 max-w-sm mb-6">{description}</p>
    {action}
  </div>
);

export default Loader;
