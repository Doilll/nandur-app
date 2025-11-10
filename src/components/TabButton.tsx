import Link from 'next/link';

export default function TabButton({ 
  href, 
  icon, 
  label, 
  count, 
  isDefault = false 
}: { 
  href: string;
  icon: React.ReactNode;
  label: string;
  count: number;
  isDefault?: boolean;
}) {
  return (
    <Link
      href={href}
      className="flex items-center space-x-2 py-4 border-b-2 border-transparent text-slate-500 hover:border-green-300 hover:text-green-700 transition-all whitespace-nowrap"
    >
      {icon}
      <span className="font-medium">{label}</span>
      {count > 0 && (
        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
          {count}
        </span>
      )}
    </Link>
  );
}