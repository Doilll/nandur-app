import { format } from "date-fns";
import { id } from "date-fns/locale";
import Link from "next/link";

interface FaseProyek {
  id: string;
  namaFase: string;
  deskripsi: string;
  urutanFase: number;
  status: "BELUM_DIMULAI" | "BERJALAN" | "SELESAI";
  gambarFase: string[];
  createdAt: string;
  updatedAt: string;
}

export default function FaseCard({ fase }: { fase: FaseProyek }) {
  const getFaseStatusColor = (status: string) => {
    const colors = {
      BELUM_DIMULAI: "bg-gray-100 text-gray-800",
      BERJALAN: "bg-blue-100 text-blue-800",
      SELESAI: "bg-green-100 text-green-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };
  return (
    <Link href={`/dashboard/fase/${fase.id}`}>
      <div className="border border-gray-200 rounded-lg hover:shadow-md p-4 transition-all">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-gray-900">{fase.namaFase}</h4>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getFaseStatusColor(
              fase.status
            )}`}
          >
            {fase.status.replace("_", " ")}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {fase.deskripsi}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Urutan: {fase.urutanFase}</span>
          <span>
            {format(new Date(fase.createdAt), "dd MMM yyyy", { locale: id })}
          </span>
        </div>
      </div>
    </Link>
  );
}
