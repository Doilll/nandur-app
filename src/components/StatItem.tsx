export default function StatItem({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
      <div className="flex items-center space-x-3">
        <div className="bg-green-100 text-green-600 p-2 rounded-lg">
          {icon}
        </div>
        <span className="text-gray-700">{label}</span>
      </div>
      <span className="font-semibold text-gray-900">{value}</span>
    </div>
  );
}