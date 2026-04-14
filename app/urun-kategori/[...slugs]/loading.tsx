export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="h-4 w-48 bg-gray-200 rounded animate-pulse mb-4" />
      <div className="h-8 w-72 bg-gray-200 rounded animate-pulse mb-6" />
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg p-3 animate-pulse">
            <div className="h-32 bg-gray-200 rounded mb-2" />
            <div className="h-3 bg-gray-200 rounded w-3/4 mx-auto mb-1" />
            <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}
