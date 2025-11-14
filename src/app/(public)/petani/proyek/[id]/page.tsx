// src/app/petani/[username]/proyek/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { 
  Calendar, 
  MapPin, 
  Sprout, 
  Clock, 
  ArrowLeft, 
  Share2, 
  Heart,
  CheckCircle,
  PlayCircle,
  PauseCircle
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface DetailProyekPageProps {
  params: Promise<{ 
    id: string; 
  }>;
}

const statusConfig = {
  PERSIAPAN: { label: "Persiapan", color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Clock },
  PENANAMAN: { label: "Penanaman", color: "bg-blue-100 text-blue-800 border-blue-200", icon: PlayCircle },
  PEMELIHARAAN: { label: "Pemeliharaan", color: "bg-green-100 text-green-800 border-green-200", icon: Sprout },
  PANEN: { label: "Panen", color: "bg-orange-100 text-orange-800 border-orange-200", icon: CheckCircle },
  SELESAI: { label: "Selesai", color: "bg-gray-100 text-gray-800 border-gray-200", icon: CheckCircle },
};

export default async function DetailProyekPage({ params }: DetailProyekPageProps) {
  const {  id } = await params;
  
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
        }
      },
      faseProyek: {
        orderBy: {
          urutanFase: 'asc'
        },
        select: {
            id: true,
            namaFase: true,
            deskripsi: true,
            status: true,
            gambarFase: true,
        }
      },
      produk: {
        where: {
          stok: {
            gt: 0
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 6
      },
      _count: {
        select: {
          faseProyek: true,
          produk: true,
          feeds: true
        }
      }
    },
  });

  if (!proyek) return notFound();

  const StatusIcon = statusConfig[proyek.status].icon;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-emerald-100">
      {/* Header Navigation */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-green-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link 
              href={`/petani/${proyek.petani.username}`}
              className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Kembali ke Profil</span>
            </Link>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                <span>Simpan</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                <span>Bagikan</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Project Image */}
          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl bg-white">
              <Image
                src={proyek.image}
                alt={proyek.namaProyek}
                fill
                className="object-cover"
                priority
              />
            </div>
            
            {/* Status Badge */}
            <div className="absolute top-6 left-6">
              <Badge className={`${statusConfig[proyek.status].color} border-2 px-4 py-2 text-sm font-semibold flex items-center gap-2`}>
                <StatusIcon className="w-4 h-4" />
                {statusConfig[proyek.status].label}
              </Badge>
            </div>
          </div>

          {/* Project Info */}
          <div className="flex flex-col justify-center space-y-6">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                {proyek.namaProyek}
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                {proyek.deskripsi}
              </p>
            </div>

            {/* Project Stats */}
            <div className="grid grid-cols-3 gap-4 py-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{proyek._count.faseProyek}</div>
                <div className="text-sm text-gray-600">Fase</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{proyek._count.produk}</div>
                <div className="text-sm text-gray-600">Produk</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{proyek._count.feeds}</div>
                <div className="text-sm text-gray-600">Update</div>
              </div>
            </div>

            {/* Location & Date */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-600">
                <MapPin className="w-5 h-5 text-green-500" />
                <span>{proyek.lokasi}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Calendar className="w-5 h-5 text-green-500" />
                <span>Dimulai {formatDate(proyek.createdAt)}</span>
              </div>
            </div>

            {/* Petani Info */}
            <div className="flex items-center gap-4 p-4 bg-white/50 rounded-2xl border border-green-200">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-green-100">
                {proyek.petani.image ? (
                  <Image
                    src={proyek.petani.image}
                    alt={proyek.petani.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-green-500 text-white font-semibold">
                    {proyek.petani.name.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{proyek.petani.name}</h3>
                <p className="text-sm text-gray-600">@{proyek.petani.username}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Fase Proyek Section */}
        {proyek.faseProyek.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Tahapan Proyek</h2>
              <div className="text-sm text-gray-500">
                {proyek.faseProyek.length} fase terselesaikan
              </div>
            </div>

            <div className="grid gap-6">
              {proyek.faseProyek.map((fase, index) => (
                <div 
                  key={fase.id}
                  className="bg-white rounded-2xl shadow-lg border border-green-200 overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 font-bold text-lg">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{fase.namaFase}</h3>
                          <p className="text-gray-600 mt-1">{fase.deskripsi}</p>
                        </div>
                      </div>
                      <Badge className={
                        fase.status === 'SELESAI' 
                          ? "bg-green-100 text-green-800 border-green-200" 
                          : fase.status === 'BERJALAN'
                          ? "bg-blue-100 text-blue-800 border-blue-200"
                          : "bg-gray-100 text-gray-800 border-gray-200"
                      }>
                        {fase.status === 'SELESAI' ? 'Selesai' : 
                         fase.status === 'BERJALAN' ? 'Berjalan' : 'Belum Dimulai'}
                      </Badge>
                    </div>

                    {/* Gallery Images */}
                    {fase.gambarFase.length > 0 && (
                      <div className="mt-4">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                          {fase.gambarFase.slice(0, 4).map((gambar, imgIndex) => (
                            <div 
                              key={imgIndex}
                              className="aspect-square rounded-xl overflow-hidden bg-gray-100 relative group cursor-pointer"
                            >
                              <Image
                                src={gambar}
                                alt={`${fase.namaFase} ${imgIndex + 1}`}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              {imgIndex === 3 && fase.gambarFase.length > 4 && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-semibold">
                                  +{fase.gambarFase.length - 4} lagi
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Produk Section */}
        {proyek.produk.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Hasil Produk</h2>
              <Link 
                href={`/petani/${proyek.petani.username}/produk`}
                className="text-green-600 hover:text-green-700 font-semibold"
              >
                Lihat Semua →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {proyek.produk.map((produk) => (
                <div 
                  key={produk.id}
                  className="bg-white rounded-2xl shadow-lg border border-green-200 overflow-hidden hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="relative aspect-square bg-gray-100 overflow-hidden">
                    {produk.gambarProduk[0] && (
                      <Image
                        src={produk.gambarProduk[0]}
                        alt={produk.namaProduk}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-white/90 text-gray-800 border-0 font-semibold">
                        Stok: {produk.stok}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-1">
                      {produk.namaProduk}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {produk.deskripsi}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-green-600">
                        {formatCurrency(produk.harga)}
                      </span>
                      <Button className="bg-green-600 hover:bg-green-700 text-white">
                        Beli Sekarang
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* About Petani Section */}
        <section className="bg-white rounded-2xl shadow-lg border border-green-200 p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Tentang Petani</h2>
          <div className="flex items-start gap-6">
            <div className="relative w-20 h-20 rounded-full overflow-hidden bg-green-100 shrink-0">
              {proyek.petani.image ? (
                <Image
                  src={proyek.petani.image}
                  alt={proyek.petani.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-green-500 text-white font-bold text-xl">
                  {proyek.petani.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{proyek.petani.name}</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                {proyek.petani.bio || "Petani yang berdedikasi untuk menghasilkan produk pertanian berkualitas dengan metode yang berkelanjutan."}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                {proyek.petani.lokasi && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{proyek.petani.lokasi}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Sprout className="w-4 h-4" />
                  <span>Bergabung {formatDate(proyek.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}