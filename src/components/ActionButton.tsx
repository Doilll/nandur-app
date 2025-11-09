import Link from 'next/link';

export default function ActionButton({ icon, text, href, color }: {
  icon: React.ReactNode;
  text: string;
  href: string;
  color: string;
}) {
  const colorClasses = {
    green: 'bg-green-50 text-green-700 hover:bg-green-100',
    blue: 'bg-blue-50 text-blue-700 hover:bg-blue-100',
    purple: 'bg-purple-50 text-purple-700 hover:bg-purple-100',
    orange: 'bg-orange-50 text-orange-700 hover:bg-orange-100'
  }[color];

  return (
    <Link 
      href={href}
      className={`flex items-center space-x-3 p-3 rounded-lg font-medium transition-colors ${colorClasses}`}
    >
      <div className="p-1">
        {icon}
      </div>
      <span className="text-sm">{text}</span>
    </Link>
  );
}