
import { prisma } from "@/lib/prisma";
import { Sprout } from "lucide-react";
import ProjectCard from "@/components/ProjectCard";
import EmptyState from "@/components/EmptyState";

export default async function PetaniPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const petani = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      proyekTani: {
        select: {
          id: true,
          namaProyek: true,
          deskripsi: true,
          status: true,
          lokasi: true,
          createdAt: true,
          image: true,
          faseProyek: {
            select: {
              id: true,
              namaFase: true,
              status: true,
            },
          },
        },
      },
    },
  });

  return (
    <div className="lg:col-span-2 max-w-2xl w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Proyek Tani</h2>
        <p className="text-gray-600 mt-2">
          {petani?.proyekTani?.length || 0} proyek yang sedang dikelola
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-2 grid-cols-1">
        {petani?.proyekTani?.map((proyek) => (
          <ProjectCard key={proyek.id} proyek={proyek} />
        ))}
      </div>

      {petani?.proyekTani?.length === 0 && (
        <EmptyState
          icon={<Sprout className="h-12 w-12" />}
          title="Belum Ada Proyek"
          description="Petani ini belum membuat proyek tani"
        />
      )}
    </div>
  );
}
