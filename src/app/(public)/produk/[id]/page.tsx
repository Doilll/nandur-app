// src/app/produk/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Package,
  Ruler,
  BadgeCheck,
} from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import GaleryImages from "@/components/GaleryImages";
import OrderCard from "@/components/OrderCard";

interface ProdukDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProdukDetailPageProps): Promise<Metadata> {
  const { id } = await params;

  const produk = await prisma.produk.findUnique({
    where: { id },
    include: {
      petani: {
        select: {
          name: true,
          username: true,
        },
      },
      proyekTani: {
        select: {
          namaProyek: true,
        },
      },
    },
  });

  if (!produk) {
    return {
      title: "Produk Tidak Ditemukan - Nandur",
    };
  }

  return {
    title: `${produk.namaProduk} - ${produk.petani.name} | Nandur`,
    description: produk.deskripsi,
    openGraph: {
      title: produk.namaProduk,
      description: produk.deskripsi,
      images: produk.gambarProduk.length > 0 ? [produk.gambarProduk[0]] : [],
    },
  };
}

export default async function ProdukDetailPage({
  params,
}: ProdukDetailPageProps) {
  const { id } = await params;

  const produk = await prisma.produk.findUnique({
    where: { id },
    include: {
      petani: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
          bio: true,
          lokasi: true,
          numberPhone: true,
        },
      },
      proyekTani: {
        select: {
          id: true,
          namaProyek: true,
          lokasi: true,
          image: true,
        },
      },
    },
  });

  if (!produk) return notFound();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      TERSEDIA: "bg-green-100 text-green-800 border-green-200",
      TERJUAL: "bg-red-100 text-red-800 border-red-200",
      BELUM_TERSEDIA: "bg-yellow-100 text-yellow-800 border-yellow-200",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      TERSEDIA: "Tersedia",
      TERJUAL: "Terjual",
      BELUM_TERSEDIA: "Segera Tersedia",
    };
    return labels[status as keyof typeof labels] || status;
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Gallery */}
          <div className="space-y-6">
            <GaleryImages produk={produk} />

            {/* Project Info */}
            {produk.proyekTani && (
              <div className="bg-white rounded-2xl shadow-lg border border-green-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <BadgeCheck className="w-5 h-5 text-green-600" />
                  Dari Proyek Tani Terverifikasi
                </h3>
                <Link
                  href={`/proyek/${produk.proyekTani.id}`}
                  className="block group"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100">
                      {produk.proyekTani.image?.trim() ? (
                        <Image
                          src={produk.proyekTani.image}
                          alt={produk.proyekTani.namaProyek}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <Package className="w-10 h-10 text-green-600" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                        {produk.proyekTani.namaProyek}
                      </h4>
                      <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                        <MapPin className="w-4 h-4" />
                        <span>{produk.proyekTani.lokasi}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Status & Category */}
            <div className="flex items-center gap-3">
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(
                  produk.status
                )}`}
              >
                {getStatusLabel(produk.status)}
              </span>
              <span className="text-sm text-gray-500">
                Ditambahkan{" "}
                {format(new Date(produk.createdAt), "d MMMM yyyy", {
                  locale: idLocale,
                })}
              </span>
            </div>

            {/* Product Title */}
            <h1 className="text-4xl font-bold text-gray-900 leading-tight">
              {produk.namaProduk}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-green-600">
                {formatCurrency(produk.harga)}
              </span>
              <span className="text-lg text-gray-500">/ {produk.unit}</span>
            </div>

            {/* Description */}
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed text-lg">
                {produk.deskripsi}
              </p>
            </div>

            {/* Product Details */}
            <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
              <h3 className="font-semibold text-gray-900 text-lg">
                Detail Produk
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-green-600" />
                  <span className="text-gray-600">Status:</span>
                  <span className="font-semibold">
                    {getStatusLabel(produk.status)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Ruler className="w-5 h-5 text-green-600" />
                  <span className="text-gray-600">Satuan:</span>
                  <span className="font-semibold">{produk.unit}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-green-600" />
                  <span className="text-gray-600">Ditambahkan:</span>
                  <span className="font-semibold">
                    {format(new Date(produk.createdAt), "d MMM yyyy", {
                      locale: idLocale,
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <BadgeCheck className="w-5 h-5 text-green-600" />
                  <span className="text-gray-600">Kualitas:</span>
                  <span className="font-semibold">Premium</span>
                </div>
              </div>
            </div>

            {/* Farmer Info */}
            <div className="bg-white rounded-2xl shadow-lg border border-green-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Dijual Oleh</h3>
              <Link
                href={`/petani/${produk.petani.username}`}
                className="block group"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden bg-green-100 border-2 border-green-200">
                    {produk.petani.image ? (
                      <Image
                        src={produk.petani.image}
                        alt={produk.petani.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-green-500 text-white font-semibold text-xl">
                        {produk.petani.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                      {produk.petani.name}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      @{produk.petani.username}
                    </p>
                    {produk.petani.bio && (
                      <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                        {produk.petani.bio}
                      </p>
                    )}
                    <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {produk.petani.lokasi || "Lokasi tidak tersedia"}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Order Card */}
            <OrderCard
              numberPhone={produk.petani.numberPhone}
              namaProduk={produk.namaProduk}
              status={produk.status}
            />
          </div>
        </div>

        {/* Related Products */}
        <section className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Produk Lainnya</h2>
            <Link
              href={`/petani/${produk.petani.username}/produk`}
              className="text-green-600 hover:text-green-700 font-semibold"
            >
              Lihat Semua Produk →
            </Link>
          </div>

          <RelatedProducts
            petaniId={produk.petaniId}
            currentProductId={produk.id}
          />
        </section>
      </div>
    </div>
  );
}

// Related Products Component
async function RelatedProducts({
  petaniId,
  currentProductId,
}: {
  petaniId: string;
  currentProductId: string;
}) {
  const relatedProducts = await prisma.produk.findMany({
    where: {
      petaniId,
      id: {
        not: currentProductId,
      },
      status: "TERSEDIA",
    },
    take: 4,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      petani: {
        select: {
          name: true,
          username: true,
        },
      },
    },
  });

  if (relatedProducts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Tidak ada produk lainnya dari petani ini
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {relatedProducts.map((product) => (
        <Link
          key={product.id}
          href={`/produk/${product.id}`}
          className="block group"
        >
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300">
            {/* Product Image */}
            <div className="relative aspect-square bg-gray-100 overflow-hidden">
              {product.gambarProduk[0] ? (
                <Image
                  src={product.gambarProduk[0]}
                  alt={product.namaProduk}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-green-50">
                  <Package className="w-12 h-12 text-green-400" />
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1 group-hover:text-green-600 transition-colors">
                {product.namaProduk}
              </h3>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-green-600">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  }).format(product.harga)}
                </span>
                <span className="text-sm text-gray-500">/ {product.unit}</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
