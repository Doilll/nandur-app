// src/app/dashboard/proyek

import { prisma } from "@/lib/prisma";
import { Sprout } from "lucide-react";
import ProjectCard from "@/components/ProjectCard";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import EmptyState from "@/components/EmptyState";

export default async function ProyekDashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const proyekTani = await prisma.proyekTani.findMany({
    where: {
      petaniId: session?.user.id,
    },
    select: {
      id: true,
      namaProyek: true,
      deskripsi: true,
      status: true,
      lokasi: true,
      faseProyek: {
        select: {
          id: true,
          namaFase: true,
          status: true,
        },
      },
    },
  });

  return (
    
  )
}
