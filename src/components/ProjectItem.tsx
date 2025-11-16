import { Users } from "lucide-react";

export default function ProjectItem({
  name,
  progress,
  status,
  date,
}: {
  name: string;
  progress: number;
  status: string;
  date: string;
}) {
  const statusColor =
    {
      PERSIAPAN: "bg-yellow-100 text-yellow-800",
      PENANAMAN: "bg-blue-100 text-blue-800",
      PEMELIHARAAN: "bg-orange-100 text-orange-800",
      PANEN: "bg-green-100 text-green-800",
      SELESAI: "bg-gray-100 text-gray-800",
    }[status] || "bg-gray-100 text-gray-800";

  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors group">
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 group-hover:text-green-700 transition-colors truncate">
          {name}
        </h4>
        <div className="flex items-center space-x-4 mt-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[200px]">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="text-sm text-gray-600 whitespace-nowrap">
            {progress}%
          </span>
        </div>
        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
          <span className={`px-2 py-1 rounded-full font-medium ${statusColor}`}>
            {status}
          </span>
          <span>{date}</span>
        </div>
      </div>
    </div>
  );
}
