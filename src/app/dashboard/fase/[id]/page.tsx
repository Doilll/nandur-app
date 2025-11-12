import { prisma } from "@/lib/prisma";
import EditFaseForm from "@/components/EditFaseForm";
import { notFound } from "next/navigation";

export default async function EditFasePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const fase = await prisma.faseProyek.findUnique({
    where: { id },
    select: {
      id: true,
      namaFase: true,
      deskripsi: true,
      proyekTaniId: true,
      gambarFase: true,
      urutanFase: true,
      status: true,
    },
  });

  if (!fase) return notFound();

  return (
    <div className="min-h-screen bg-green-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-green-800 mb-6">
          Edit Fase Proyek
        </h1>
        <EditFaseForm fase={fase} />
      </div>
    </div>
  );
}
