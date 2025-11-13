import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import UpdateProyekForm from "@/components/UpdateProyekForm";

export default async function UpdateProyekPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const proyek = await prisma.proyekTani.findUnique({
    where: { id },
    select: {
      id: true,
      namaProyek: true,
      deskripsi: true,
      lokasi: true,
      image: true,
      status: true,
    },
  });

  if (!proyek) {
    // kalau gak ketemu proyek
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Proyek tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex space-x-3">
          <Link
            href={`/dashboard/proyek/${id}`}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors shrink-0"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <h1 className="text-2xl font-bold text-green-800 mb-6">
            Edit Fase Proyek
          </h1>
        </div>

        <UpdateProyekForm proyekData={proyek} />
      </div>
    </div>
  );
}
