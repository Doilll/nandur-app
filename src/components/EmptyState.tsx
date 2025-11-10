// Empty State Component
export default function EmptyState({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
      <div className="flex justify-center mb-4">
        <div className="text-gray-300">
          {icon}
        </div>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500">{description}</p>
    </div>
  );
}