// src/app/petani/page.tsx
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { Metadata } from "next";
import { Users, BookCheck, BadgeCheck } from "lucide-react";
import PetaniSearchClient from "@/components/PetaniSearchClient";

interface Petani {
  id: string;
  name: string;
  username: string;
  lokasi: string | null;
  image: string | null;
  bio: string | null;
  _count: {
    proyekTani: number;
    produks: number;
  };
}

interface SearchParams {
  search?: string;
  page?: string;
}

interface KatalogPetaniPageProps {
  searchParams: Promise<SearchParams>;
}

export const metadata: Metadata = {
  title: "Katalog Petani - Nandur",
  description: "Temukan petani-petani terbaik dengan produk berkualitas langsung dari sumbernya. Dukung pertanian lokal dan dapatkan hasil panen terbaik.",
};

export default async function KatalogPetaniPage({ searchParams }: KatalogPetaniPageProps) {
  const params = await searchParams;
  const search = params.search || "";
  const page = Number(params.page) || 1;
  const limit = 12;
  // Fetch initial data on server
  const whereClause: Prisma.UserWhereInput = {
  username: { not: null, notIn: [""] }, // hide user tanpa username
  ...(search
    ? {
        OR: [
          { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
          { username: { contains: search, mode: Prisma.QueryMode.insensitive } },
          { lokasi: { contains: search, mode: Prisma.QueryMode.insensitive } },
        ],
      }
    : {}),
};


  const [petani, total] = await Promise.all([
    prisma.user.findMany({
      where: whereClause,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        username: true,
        lokasi: true,
        image: true,
        bio: true,
        _count: {
          select: {
            proyekTani: true,
            produks: true,
          },
        },
      },
    }),
    prisma.user.count({ where: whereClause }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-linear-to-b from-green-50 to-white">
      {/* Hero Section */}
      <section className="bg-linear-to-br from-green-600 via-emerald-600 to-teal-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Jelajahi Petani
            </h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto leading-relaxed">
              Temukan petani-petani terbaik dengan produk berkualitas langsung
              dari sumbernya. Dukung pertanian lokal dan dapatkan hasil panen
              terbaik.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Pass initial data to client component */}
        <PetaniSearchClient 
          initialPetani={petani}
          initialTotal={total}
          initialPage={page}
          initialTotalPages={totalPages}
          initialSearch={search}
        />

        {/* Info Section - Static content */}
        <section className="mt-16 bg-white rounded-2xl shadow-lg border border-green-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Mengapa Bergabung di Katalog Petani Nandur?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 1. Portofolio Digital */}
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BookCheck className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Portofolio Bertani</h3>
              <p className="text-gray-600 text-sm">
                Tampilkan perjalanan menanam, hasil panen, dan pengalamanmu agar lebih dipercaya pembeli dan mitra.
              </p>
            </div>

            {/* 2. Komunitas Petani */}
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Terhubung dengan Petani Lain</h3>
              <p className="text-gray-600 text-sm">
                Bangun relasi, tukar ilmu, dan belajar dari praktik terbaik petani lain di seluruh Indonesia.
              </p>
            </div>

            {/* 3. Kredibilitas Produk */}
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BadgeCheck className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Produk Lebih Kredibel</h3>
              <p className="text-gray-600 text-sm">
                Setiap proses menanam yang kamu dokumentasikan menambah nilai jual dan meningkatkan kepercayaan pembeli.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}