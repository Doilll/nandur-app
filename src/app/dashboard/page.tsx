// src/app/dashboard/page.tsx
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowUpRight,
  Package,
  Sprout,
  Users,
  TrendingUp,
  MapPin,
  BarChart3,
  Eye,
  ShoppingCart,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import CurrentDate from "@/components/CurrentDate";

export default async function DashboardOverview() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Fetch user data with related counts
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      _count: {
        select: {
          proyekTani: true,
          produks: true,
          feeds: true,
        },
      },
      proyekTani: {
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          namaProyek: true,
          status: true,
          lokasi: true,
          image: true,
          createdAt: true,
          _count: {
            select: {
              faseProyek: true,
              produk: true,
            },
          },
        },
      },
      produks: {
        take: 6,
        orderBy: { createdAt: "desc" },
        where: {
          status: "TERSEDIA",
        },
        select: {
          id: true,
          namaProduk: true,
          harga: true,
          unit: true,
          gambarProduk: true,
          status: true,
          createdAt: true,
        },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  // Calculate additional stats
  const totalProyek = user._count.proyekTani;
  const totalProduk = user._count.produks;
  const totalFeeds = user._count.feeds;

  // Calculate produk stats by status
  const produkStats = await prisma.produk.groupBy({
    by: ["status"],
    where: { petaniId: user.id },
    _count: { id: true },
  });

  const produkTersedia =
    produkStats.find((p) => p.status === "TERSEDIA")?._count.id || 0;
  const produkTerjual =
    produkStats.find((p) => p.status === "TERJUAL")?._count.id || 0;

  // Calculate proyek stats by status
  const proyekStats = await prisma.proyekTani.groupBy({
    by: ["status"],
    where: { petaniId: user.id },
    _count: { id: true },
  });

  const proyekAktif = proyekStats
    .filter((p) =>
      ["PERSIAPAN", "PENANAMAN", "PEMELIHARAAN", "PANEN"].includes(p.status)
    )
    .reduce((sum, p) => sum + p._count.id, 0);

  const proyekSelesai =
    proyekStats.find((p) => p.status === "SELESAI")?._count.id || 0;

  // Recent activity (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const recentProduk = await prisma.produk.count({
    where: {
      petaniId: user.id,
      createdAt: { gte: sevenDaysAgo },
    },
  });

  const recentProyek = await prisma.proyekTani.count({
    where: {
      petaniId: user.id,
      createdAt: { gte: sevenDaysAgo },
    },
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      PERSIAPAN: "bg-yellow-100 text-yellow-800 border-yellow-200",
      PENANAMAN: "bg-blue-100 text-blue-800 border-blue-200",
      PEMELIHARAAN: "bg-orange-100 text-orange-800 border-orange-200",
      PANEN: "bg-green-100 text-green-800 border-green-200",
      SELESAI: "bg-gray-100 text-gray-800 border-gray-200",
      TERSEDIA: "bg-green-100 text-green-800 border-green-200",
      TERJUAL: "bg-red-100 text-red-800 border-red-200",
      BELUM_TERSEDIA: "bg-yellow-100 text-yellow-800 border-yellow-200",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      PERSIAPAN: Clock,
      PENANAMAN: Sprout,
      PEMELIHARAAN: BarChart3,
      PANEN: Package,
      SELESAI: CheckCircle2,
      TERSEDIA: CheckCircle2,
      TERJUAL: ShoppingCart,
      BELUM_TERSEDIA: Clock,
    };
    return icons[status as keyof typeof icons] || BarChart3;
  };

  return (
    <div className="min-h-screen bg-green-50 md:mt-0 mt-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Selamat Datang, {user.name}!
          </h1>
          <CurrentDate className="text-gray-600 mt-2" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Proyek Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Proyek
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {totalProyek}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      proyekAktif > 0
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {proyekAktif} Aktif
                  </div>
                  <div className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {proyekSelesai} Selesai
                  </div>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                <Sprout className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <Link
              href="/dashboard/proyek"
              className="inline-flex items-center gap-1 text-sm text-green-600 hover:text-green-700 mt-4 font-medium"
            >
              Kelola Proyek
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Total Produk Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Produk
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {totalProduk}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      produkTersedia > 0
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {produkTersedia} Tersedia
                  </div>
                  <div className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    {produkTerjual} Terjual
                  </div>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <Link
              href="/dashboard/produk"
              className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 mt-4 font-medium"
            >
              Kelola Produk
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Aktivitas Terbaru Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Aktivitas 7 Hari
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {recentProduk + recentProyek}
                </p>
                <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                  <span>{recentProyek} proyek</span>
                  <span>•</span>
                  <span>{recentProduk} produk</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="text-sm text-gray-500 mt-4">
              Postingan terbaru minggu ini
            </div>
          </div>

          {/* Total Update Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Postingan
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {totalFeeds}
                </p>
                <div className="flex items-center gap-1 mt-2 text-sm text-gray-600">
                  <Eye className="w-4 h-4" />
                  <span>Dilihat pengunjung</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <Link
              href="/dashboard/feeds"
              className="inline-flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700 mt-4 font-medium"
            >
              Lihat Postingan
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Projects Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Proyek Terbaru
              </h2>
              <Link
                href="/dashboard/proyek"
                className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center gap-1"
              >
                Lihat Semua
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-4">
              {user.proyekTani.length > 0 ? (
                user.proyekTani.map((proyek) => {
                  const StatusIcon = getStatusIcon(proyek.status);
                  return (
                    <Link
                      key={proyek.id}
                      href={`/dashboard/proyek/${proyek.id}`}
                      className="block group"
                    >
                      <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-green-300 hover:bg-green-50/50 transition-all duration-200">
                        <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                          {proyek.image ? (
                            <img
                              src={proyek.image}
                              alt={proyek.namaProyek}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-green-100">
                              <Sprout className="w-6 h-6 text-green-600" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors truncate">
                            {proyek.namaProyek}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <div
                              className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                proyek.status
                              )} flex items-center gap-1`}
                            >
                              <StatusIcon className="w-3 h-3" />
                              {proyek.status.toLowerCase().replace("_", " ")}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <MapPin className="w-3 h-3" />
                              {proyek.lokasi}
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-sm font-medium text-gray-900">
                            {proyek._count.faseProyek} fase
                          </div>
                          <div className="text-xs text-gray-500">
                            {proyek._count.produk} produk
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <Sprout className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 mb-4">Belum ada proyek</p>
                  <Link
                    href="/dashboard/proyek"
                    className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-medium transition-colors"
                  >
                    <Sprout className="w-4 h-4" />
                    Buat Proyek Pertama
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Recent Products Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Produk Tersedia
              </h2>
              <Link
                href="/dashboard/produk"
                className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center gap-1"
              >
                Lihat Semua
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-4">
              {user.produks.length > 0 ? (
                user.produks.map((produk) => {
                  const StatusIcon = getStatusIcon(produk.status);
                  return (
                    <Link
                      key={produk.id}
                      href={`/dashboard/produk/${produk.id}`}
                      className="block group"
                    >
                      <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-green-300 hover:bg-green-50/50 transition-all duration-200">
                        <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                          {produk.gambarProduk[0] ? (
                            <img
                              src={produk.gambarProduk[0]}
                              alt={produk.namaProduk}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-blue-100">
                              <Package className="w-6 h-6 text-blue-600" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors truncate">
                            {produk.namaProduk}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <div
                              className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                produk.status
                              )} flex items-center gap-1`}
                            >
                              <StatusIcon className="w-3 h-3" />
                              {produk.status.toLowerCase().replace("_", " ")}
                            </div>
                            <div className="text-sm font-bold text-green-600">
                              {formatCurrency(produk.harga)}
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-xs text-gray-500">
                            {format(new Date(produk.createdAt), "d MMM", {
                              locale: idLocale,
                            })}
                          </div>
                          <div className="text-xs text-gray-500">
                            / {produk.unit}
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 mb-4">Belum ada produk</p>
                  <Link
                    href="/dashboard/produk"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium transition-colors"
                  >
                    <Package className="w-4 h-4" />
                    Tambah Produk
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Aksi Cepat</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/dashboard/proyek"
              className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-green-300 hover:bg-green-50/50 transition-all duration-200 group"
            >
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <Sprout className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Buat Proyek Baru
                </h3>
                <p className="text-sm text-gray-600">Mulai proyek tani baru</p>
              </div>
            </Link>

            <Link
              href="/dashboard/produk"
              className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200 group"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Tambah Produk</h3>
                <p className="text-sm text-gray-600">Jual hasil panen Anda</p>
              </div>
            </Link>

            <Link
              href="/dashboard/feed"
              className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-orange-300 hover:bg-orange-50/50 transition-all duration-200 group"
            >
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Buat Postingan</h3>
                <p className="text-sm text-gray-600">Bagikan perkembangan</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
