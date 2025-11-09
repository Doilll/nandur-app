export default function ActivityItem({
  icon,
  title,
  description,
  time,
  type,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  time: string;
  type: string;
}) {
  const typeColor =
    {
      comment: "bg-blue-50 text-blue-600",
      sale: "bg-green-50 text-green-600",
      view: "bg-purple-50 text-purple-600",
    }[type] || "bg-gray-50 text-gray-600";

  return (
    <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className={`p-2 rounded-lg ${typeColor}`}>{icon}</div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-900">{title}</h4>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
        <p className="text-xs text-gray-500 mt-1">{time}</p>
      </div>
    </div>
  );
}
