import Link from "next/link";
import { TrendingUp } from "lucide-react";

export default function StatCard({
  icon,
  title,
  value,
  change,
  trend,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  href: string;
}) {
  const trendColor = trend === "up" ? "text-green-600" : "text-red-600";

  return (
    <Link href={href} className="block group">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 group-hover:shadow-md group-hover:border-green-200 transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          </div>
          <div className="bg-green-50 text-green-600 p-3 rounded-xl group-hover:bg-green-100 transition-colors">
            {icon}
          </div>
        </div>
        <div
          className={`flex items-center space-x-1 mt-3 text-sm ${trendColor}`}
        >
          <TrendingUp className="h-4 w-4" />
          <span>{change} dari bulan lalu</span>
        </div>
      </div>
    </Link>
  );
}
