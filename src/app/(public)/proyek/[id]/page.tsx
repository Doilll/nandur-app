// src/app/proyek/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  User,
  Sprout,
  Package,
  Rss,
  CheckCircle2,
  Clock,
  ArrowRight,
  Heart,
  BarChart3,
  ShoppingCart,
} from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import ShareButton from "@/components/ShareButton";
import FaseTimelineCard from "@/components/FaseTimelineCard";
import ProductCard from "@/components/ProductCard";
import StatItem from "@/components/StatItem";

interface DetailProyekPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: DetailProyekPageProps) {
  const { id } = await params;

  const proyek = await prisma.proyekTani.findUnique({
    where: { id },
    select: {
      namaProyek: true,
      deskripsi: true,
      image: true,
      petani: {
        select: { name: true }
      }
    }
  });

  if (!proyek) {
    return {
      title: "Proyek Tidak Ditemukan - Nandur",
    };
  }

  return {
    title: `${proyek.namaProyek} - ${proyek.petani.name} | Proyek Tani`,
    description: proyek.deskripsi,
    openGraph: {
      title: proyek.namaProyek,
      description: proyek.deskripsi,
      images: proyek.image ? [proyek.image] : [],
    },
  };
}


export default async function DetailProyekPage({
  params,
}: DetailProyekPageProps) {
  const { id } = await params;

  const proyek = await prisma.proyekTani.findUnique({
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
        },
      },
      faseProyek: {
        orderBy: {
          urutanFase: "asc",
        },
        select: {
          id: true,
          namaFase: true,
          deskripsi: true,
          status: true,
          gambarFase: true,
          urutanFase: true,
        },
      },
      produk: {
        where: {
          status: "TERSEDIA", // Hanya tampilkan produk yang tersedia
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 6,
      },
      _count: {
        select: {
          faseProyek: true,
          produk: true,
          feeds: true,
        },
      },
    },
  });

  if (!proyek) return notFound();

  const completedFases = proyek.faseProyek.filter(
    (fase) => fase.status === "SELESAI"
  ).length;
  const progress =
    proyek.faseProyek.length > 0
      ? (completedFases / proyek.faseProyek.length) * 100
      : 0;

  const getStatusColor = (status: string) => {
    const colors = {
      PERSIAPAN: "bg-yellow-500/10 text-yellow-600 border-yellow-200",
      PENANAMAN: "bg-blue-500/10 text-blue-600 border-blue-200",
      PEMELIHARAAN: "bg-orange-500/10 text-orange-600 border-orange-200",
      PANEN: "bg-green-500/10 text-green-600 border-green-200",
      SELESAI: "bg-gray-500/10 text-gray-600 border-gray-200",
    };
    return (
      colors[status as keyof typeof colors] || "bg-gray-500/10 text-gray-600"
    );
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      PERSIAPAN: Clock,
      PENANAMAN: Sprout,
      PEMELIHARAAN: BarChart3,
      PANEN: Package,
      SELESAI: CheckCircle2,
    };
    return icons[status as keyof typeof icons] || Clock;
  };

  const StatusIcon = getStatusIcon(proyek.status);

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-green-50">
      {/* Hero Section */}
      <section className="relative bg-linear-to-br from-green-600 via-emerald-600 to-teal-700 text-white overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex justify-between items-center py-5">
            <Link
              href={`/petani/${proyek.petani.username}`}
              className="flex items-center space-x-2 group"
            >
              <ArrowLeft className="h-5 w-5 text-green-100 group-hover:-translate-x-1 transition-transform" />
              <span className="text-lg font-semibold text-green-100">
                Kembali
              </span>
            </Link>

            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-red-500 rounded-lg transition-colors">
                <Heart className="h-5 w-5 text-green-100" />
              </button>
              <ShareButton 
                text="share projek ini" 
                className="text-green-100 hover:text-green-900" 
                title={proyek.namaProyek} 
              />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full backdrop-blur-sm bg-white/10 border border-white/20`}
                >
                  <StatusIcon className="h-4 w-4" />
                  <span className="font-medium capitalize text-sm">
                    {proyek.status.toLowerCase().replace("_", " ")}
                  </span>
                </div>
                <div className="text-green-100 text-sm">
                  {Math.round(progress)}% Selesai
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                {proyek.namaProyek}
              </h1>

              <p className="text-xl text-green-100 leading-relaxed max-w-2xl">
                {proyek.deskripsi}
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center space-x-2 text-green-100">
                  <MapPin className="h-5 w-5" />
                  <span>{proyek.lokasi}</span>
                </div>
                <div className="flex items-center space-x-2 text-green-100">
                  <Calendar className="h-5 w-5" />
                  <span>
                    Dibuat{" "}
                    {format(new Date(proyek.createdAt), "MMMM yyyy", {
                      locale: idLocale,
                    })}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-green-100">
                  <Sprout className="h-5 w-5" />
                  <span>{proyek._count.faseProyek} Fase</span>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">
                    {proyek._count.faseProyek}
                  </div>
                  <div className="text-green-100 text-sm">Total Fase</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">
                    {proyek._count.produk}
                  </div>
                  <div className="text-green-100 text-sm">Produk</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">
                    {completedFases}
                  </div>
                  <div className="text-green-100 text-sm">Fase Selesai</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">
                    {proyek._count.feeds}
                  </div>
                  <div className="text-green-100 text-sm">Update</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex justify-between text-sm text-green-100 mb-2">
                  <span>Progress Proyek</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3">
                  <div
                    className="bg-white h-3 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Farmer Info */}
              <div className="mt-6 pt-6 border-t border-white/20">
                <Link
                  href={`/petani/${proyek.petani.username}`}
                  className="flex items-center space-x-3 group"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    {proyek.petani.image ? (
                      <Image
                        src={proyek.petani.image}
                        alt={proyek.petani.name}
                        width={48}
                        height={48}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <User className="h-6 w-6 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-semibold group-hover:text-green-200 transition-colors">
                      {proyek.petani.name}
                    </div>
                    <div className="text-green-100 text-sm">
                      @{proyek.petani.username}
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-white group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Project Timeline */}
            <section className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  Timeline Proyek
                </h2>
                <div className="text-sm text-gray-500">
                  {completedFases} dari {proyek.faseProyek.length} fase selesai
                </div>
              </div>

              <div className="space-y-6">
                {proyek.faseProyek.map((fase, index) => (
                  <FaseTimelineCard
                    key={fase.id}
                    fase={fase}
                    index={index}
                    totalFases={proyek.faseProyek.length}
                  />
                ))}
              </div>
            </section>

            {/* Products Section */}
            {proyek.produk.length > 0 && (
              <section className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Hasil Panen
                  </h2>
                  <Link
                    href={`/petani/${proyek.petani.username}/produk`}
                    className="text-green-600 hover:text-green-700 font-medium flex items-center space-x-2"
                  >
                    <span>Lihat Semua</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {proyek.produk.map((produk) => (
                    <ProductCard key={produk.id} produk={produk} />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Farmer Profile */}
            <section className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Tentang Petani
              </h3>
              <Link
                href={`/petani/${proyek.petani.username}`}
                className="block group"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center border-2 border-green-200">
                    {proyek.petani.image ? (
                      <Image
                        src={proyek.petani.image}
                        alt={proyek.petani.name}
                        width={64}
                        height={64}
                        className="rounded-2xl object-cover w-16 h-16"
                      />
                    ) : (
                      <User className="h-8 w-8 text-green-600" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                      {proyek.petani.name}
                    </h4>
                    <p className="text-gray-500 text-sm">
                      @{proyek.petani.username}
                    </p>
                  </div>
                </div>
              </Link>

              {proyek.petani.bio && (
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {proyek.petani.bio}
                </p>
              )}

              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <MapPin className="h-4 w-4" />
                <span>{proyek.petani.lokasi}</span>
              </div>
            </section>

            {/* Project Stats */}
            <section className="bg-linear-to-br from-green-600 to-emerald-700 rounded-3xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">Statistik Proyek</h3>
              <div className="space-y-4">
                <StatItem
                  icon={<Sprout className="h-5 w-5" />}
                  label="Total Fase"
                  value={proyek._count.faseProyek.toString()}
                />
                <StatItem
                  icon={<CheckCircle2 className="h-5 w-5" />}
                  label="Fase Selesai"
                  value={completedFases.toString()}
                />
                <StatItem
                  icon={<Package className="h-5 w-5" />}
                  label="Produk Tersedia"
                  value={proyek._count.produk.toString()}
                />
                <StatItem
                  icon={<Rss className="h-5 w-5" />}
                  label="Update"
                  value={proyek._count.feeds.toString()}
                />
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}