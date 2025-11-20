import { prisma } from "@/lib/prisma";
import { Sprout, Plus } from "lucide-react";
import ProjectCard from "@/components/ProjectCard";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import EmptyState from "@/components/EmptyState";
import TambahProyekModal from "@/components/TambahProyekModal";


export default async function ProyekDashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return <div className="text-center mt-10">Anda belum login</div>;
  }

  const proyekTani = await prisma.proyekTani.findMany({
    where: { petaniId: session.user.id },
    select: {
      id: true,
      namaProyek: true,
      deskripsi: true,
      status: true,
      lokasi: true,
      image: true,
      createdAt: true,
      faseProyek: {
        select: { id: true, namaFase: true, status: true },
      },
    },
  });

  return (
    <div className="min-h-screen bg-green-50 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-green-800 flex items-center gap-2">
            <Sprout className="w-7 h-7" /> Proyek Tani Anda
          </h1>
          <TambahProyekModal />
        </div>

        {/* Daftar Proyek */}
        {proyekTani.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {proyekTani.map((proyek) => (
              <ProjectCard key={proyek.id} proyek={proyek} forDashboard={true} />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center min-h-[50vh]">
            <EmptyState
              icon={<Sprout className="h-12 w-12" />}
              title="Belum Ada Proyek"
              description="Buat proyek tani pertamamu sekarang!"
            />
          </div>
        )}
      </div>
    </div>
  );
}
