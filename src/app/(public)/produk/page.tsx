// src/app/produk/page.tsx
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { Package, Leaf, Users, MapPin } from "lucide-react";
import ProdukSearchClient from "@/components/ProductSearchClient";

interface Petani {
  name: string;
  username: string;
  image: string | null;
  lokasi: string | null;
}

interface ProyekTani {
  id: string;
  namaProyek: string;
}

interface Produk {
  id: string;
  namaProduk: string;
  harga: number;
  unit: string;
  gambarProduk: string[];
  deskripsi: string;
  createdAt: string;
  status: "TERSEDIA" | "TERJUAL" | "BELUM_TERSEDIA";
  petani: Petani;
  proyekTani: ProyekTani | null;
}

interface SearchParams {
  search?: string;
  page?: string;
  lokasi?: string;
  harga_min?: string;
  harga_max?: string;
}

interface KatalogProdukPageProps {
  searchParams: Promise<SearchParams>;
}

export const metadata: Metadata = {
  title: "Katalog Produk - Tandur",
  description: "Temukan produk pertanian berkualitas langsung dari petani. Dapatkan hasil panen segar dengan harga terbaik.",
};

export default async function KatalogProdukPage({ searchParams }: KatalogProdukPageProps) {
  const params = await searchParams;
  const search = params.search || "";
  const lokasi = params.lokasi || "";
  const hargaMin = params.harga_min ? Number(params.harga_min) : undefined;
  const hargaMax = params.harga_max ? Number(params.harga_max) : undefined;
  const page = Number(params.page) || 1;
  const limit = 12;

  // Build where clause
  const whereClause: any = {
    status: "TERSEDIA", // Only show available products
  };

  // Search filter
  if (search) {
    whereClause.OR = [
      { namaProduk: { contains: search, mode: "insensitive" } },
      { deskripsi: { contains: search, mode: "insensitive" } },
    ];
  }

  // Location filter
  if (lokasi) {
    whereClause.petani = {
      lokasi: { contains: lokasi, mode: "insensitive" }
    };
  }

  // Price range filter
  if (hargaMin !== undefined || hargaMax !== undefined) {
    whereClause.harga = {};
    if (hargaMin !== undefined) {
      whereClause.harga.gte = hargaMin;
    }
    if (hargaMax !== undefined) {
      whereClause.harga.lte = hargaMax;
    }
  }

  // Fetch initial data on server
  const [produk, total] = await Promise.all([
    prisma.produk.findMany({
      where: whereClause,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        namaProduk: true,
        harga: true,
        unit: true,
        gambarProduk: true,
        deskripsi: true,
        createdAt: true,
        status: true,
        petani: {
          select: {
            name: true,
            username: true,
            image: true,
            lokasi: true,
          },
        },
        proyekTani: {
          select: {
            id: true,
            namaProyek: true,
          },
        },
      },
    }),
    prisma.produk.count({ where: whereClause }),
  ]);

  const totalPages = Math.ceil(total / limit);

  // Get unique locations for filter
  const uniqueLocations = await prisma.user.findMany({
    where: {
      produks: {
        some: {
          status: "TERSEDIA"
        }
      }
    },
    select: {
      lokasi: true,
    },
    distinct: ['lokasi'],
  }).then(users => 
    users
      .map(u => u.lokasi)
      .filter(Boolean)
      .sort()
  );

  return (
    <div className="min-h-screen bg-linear-to-b from-green-50 to-white">
      {/* Hero Section */}
      <section className="bg-linear-to-br from-green-600 via-emerald-600 to-teal-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Katalog Produk
            </h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto leading-relaxed">
              Temukan produk pertanian berkualitas langsung dari petani. 
              Dapatkan hasil panen segar dengan harga terbaik.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Pass initial data to client component */}
        <ProdukSearchClient 
          initialProduk={produk}
          initialTotal={total}
          initialPage={page}
          initialTotalPages={totalPages}
          initialSearch={search}
          initialLokasi={lokasi}
          initialHargaMin={hargaMin?.toString() || ""}
          initialHargaMax={hargaMax?.toString() || ""}
          availableLocations={uniqueLocations as string[]}
        />

        {/* Info Section - Static content */}
        <section className="mt-16 bg-white rounded-2xl shadow-lg border border-green-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Mengapa Berbelanja Langsung dari Petani?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Segar & Berkualitas</h3>
              <p className="text-gray-600 text-sm">
                Produk langsung dari kebun dengan kualitas terbaik dan kesegaran terjamin
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Dukung Lokal</h3>
              <p className="text-gray-600 text-sm">
                Bantu menggerakkan ekonomi lokal dan mendukung petani Indonesia
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Transparan</h3>
              <p className="text-gray-600 text-sm">
                Lihat langsung proses bertani dan bangun hubungan dengan petani
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}