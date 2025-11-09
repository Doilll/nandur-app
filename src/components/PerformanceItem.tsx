export default function PerformanceItem({
  label,
  value,
  change,
  trend,
}: {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
}) {
  const trendColor = trend === "up" ? "text-green-600" : "text-red-600";

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-600">{label}</span>
      <div className="flex items-center space-x-2">
        <span className="font-semibold text-gray-900">{value}</span>
        <span className={`text-xs ${trendColor}`}>{change}</span>
      </div>
    </div>
  );
}
