export default function TaskItem({
  task,
  due,
  priority,
}: {
  task: string;
  due: string;
  priority: "high" | "medium" | "low";
}) {
  const priorityColor = {
    high: "bg-red-100 text-red-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-green-100 text-green-800",
  }[priority];

  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900 truncate">{task}</p>
        <p className="text-xs text-gray-500 mt-1">{due}</p>
      </div>
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColor}`}
      >
        {priority}
      </span>
    </div>
  );
}
