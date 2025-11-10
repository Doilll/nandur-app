export default function ContactItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center space-x-3 py-2">
      <div className="bg-gray-100 text-gray-600 p-2 rounded-lg">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-gray-900 font-medium">{value}</p>
      </div>
    </div>
  );
}