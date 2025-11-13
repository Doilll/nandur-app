import { prisma } from "@/lib/prisma";
import { Sprout, Plus } from "lucide-react";
import EmptyState from "@/components/EmptyState";
import TambahFaseModal from "@/components/TambahFaseModal";
import FaseCardDetail from "@/components/FaseCardDetail";

export default async function FasePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const fases = await prisma.faseProyek.findMany({
    where: {
      proyekTaniId: id,
    },
    select: {
      id: true,
      namaFase: true,
      deskripsi: true,
      urutanFase: true,
      status: true,
      gambarFase: true, // array of image
      createdAt: true,
    },
    orderBy: {
      urutanFase: "asc",
    },
  });

  return (
    <div className="min-h-screen bg-green-50 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header Section */}
        <div className="flex justify-between items-center md:mt-0 mt-5">
          <h1 className="text-3xl font-bold text-green-800 flex items-center gap-2">
            <Sprout className="w-7 h-7" /> Fase Proyek
          </h1>
          <TambahFaseModal proyekId={id} />
        </div>

        {/* Daftar Proyek */}
        {/* Daftar Proyek */}
        {fases.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {fases.map((fase) => {
              const faseData = {
                ...fase,
                createdAt: fase.createdAt.toISOString(),
              };
              return <FaseCardDetail key={fase.id} fase={faseData} />;
            })}
          </div>
        ) : (
          <div className="flex justify-center items-center min-h-[50vh]">
            <EmptyState
              icon={<Sprout className="h-12 w-12" />}
              title="Belum Ada Fase"
              description="Buat fase proyek pertamamu sekarang!"
            />
          </div>
        )}
      </div>
    </div>
  );
}
