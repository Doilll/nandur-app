// app/page.tsx
import {
  Users,
  Sprout,
  Package,
  Home,
  FileText,
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import LandingPublic from "@/components/LandingPublic";
import { prisma } from "@/lib/prisma";

export default async function LandingPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session) {
    return <LandingPublic />
  }

  const [produkCount, feedCount, proyekCount] = await Promise.all([
    prisma.produk.count({
      where: { petaniId: session.user.id }
    }),
    prisma.feed.count({
      where: { authorId: session.user.id }
    }),
    prisma.proyekTani.count({
      where: { petaniId: session.user.id }
    }),
  ]);

  // Halaman landing untuk user yang sudah loginlogin
  return (
      <div className="min-h-screen bg-linear-to-br from-green-50 to-emerald-100">
        <Navbar />

        {/* Welcome Section for Logged In Users */}
        <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-green-100">
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-green-100 p-3 rounded-full">
                  <Sprout className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                    Selamat Datang Kembali, {session.user.name || "Petani"}! 👋
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Mari lanjutkan perjalanan pertanian Anda
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <Link
                  href="/dashboard"
                  className="bg-linear-to-br from-green-500 to-emerald-600 text-white p-6 rounded-2xl hover:shadow-lg transition-all transform hover:scale-105"
                >
                  <Home className="h-8 w-8 mb-3" />
                  <h3 className="text-xl font-semibold mb-2">Dashboard</h3>
                  <p className="text-green-50 text-sm">
                    Lihat semua proyek dan aktivitas Anda
                  </p>
                </Link>

                <Link
                  href="/dashboard/proyek"
                  className="bg-white border-2 border-green-200 p-6 rounded-2xl hover:border-green-400 hover:shadow-lg transition-all transform hover:scale-105"
                >
                  <Sprout className="h-8 w-8 text-green-600 mb-3" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Buat Proyek Baru
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Mulai dokumentasi penanaman baru
                  </p>
                </Link>

                <Link
                  href="/feed"
                  className="bg-white border-2 border-green-200 p-6 rounded-2xl hover:border-green-400 hover:shadow-lg transition-all transform hover:scale-105"
                >
                  <Users className="h-8 w-8 text-green-600 mb-3" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Komunitas
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Lihat update dari petani lain
                  </p>
                </Link>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-white rounded-2xl p-6 shadow-md border border-green-100">
                <Package className="h-8 w-8 text-green-600 mb-3" />
                <div className="text-2xl font-bold text-gray-900">{produkCount}</div>
                <div className="text-gray-600 text-sm">Produk Dibuat</div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-md border border-green-100">
                <FileText className="h-8 w-8 text-blue-600 mb-3" />
                <div className="text-2xl font-bold text-gray-900">{feedCount}</div>
                <div className="text-gray-600 text-sm">Total Postingan</div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-md border border-green-100">
                <Sprout className="h-8 w-8 text-purple-600 mb-3" />
                <div className="text-2xl font-bold text-gray-900">{proyekCount}</div>
                <div className="text-gray-600 text-sm">Proyek</div>
              </div>
            </div>

            {/* Tips Section */}
            <div className="mt-8 bg-linear-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                💡 Tips untuk Memulai
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </div>
                  <p className="text-gray-700">
                    Buat proyek pertama Anda dan dokumentasikan setiap fase penanaman
                  </p>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <p className="text-gray-700">
                    Bagikan progres melalui postingan untuk membangun kepercayaan
                  </p>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </div>
                  <p className="text-gray-700">
                    Terhubung dengan petani lain dan pelajari teknik terbaik
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    );
}