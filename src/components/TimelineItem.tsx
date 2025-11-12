import { format } from "date-fns";
import { id } from "date-fns/locale";


export default function TimelineItem({
  date,
  title,
  isFirst = false,
  isLast = false,
}: {
  date: string;
  title: string;
  isFirst?: boolean;
  isLast?: boolean;
}) {
  return (
    <div className="flex items-start space-x-3">
      <div className="flex flex-col items-center">
        <div
          className={`w-2 h-2 bg-green-500 rounded-full ${
            !isFirst ? "mt-1" : ""
          }`}
        ></div>
        {!isLast && <div className="w-0.5 h-8 bg-green-200 flex-1 mt-1"></div>}
      </div>
      <div className="flex-1 pb-4">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-xs text-gray-500">
          {format(new Date(date), "dd MMM yyyy • HH:mm", { locale: id })}
        </p>
      </div>
    </div>
  );
}