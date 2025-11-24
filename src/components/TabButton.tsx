// components/TabButton.tsx
import Link from "next/link";

export default function TabButton({
  href,
  icon,
  label,
  count,
  isActive,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  count?: number;
  isActive?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors
        ${
          isActive
            ? "border-green-600 text-green-600 font-semibold"
            : "border-transparent text-gray-600 hover:text-green-600"
        }
      `}
    >
      {icon}
      <span>{label}</span>
      {typeof count === "number" && (
        <span className="text-sm text-gray-500">({count})</span>
      )}
    </Link>
  );
}
