// app/page.tsx
import {
  ArrowRight,
  Leaf,
  Users,
  TrendingUp,
  Sprout,
  Package,
  ShoppingCart,
  Home,
  FileText,
} from "lucide-react";
import Link from "next/link";
import FeatureCard from "@/components/FeatureCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function LandingPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  // Jika user sudah login, tampilkan halaman dashboard overview
  
  if (session) {
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
                <div className="text-2xl font-bold text-gray-900">0</div>
                <div className="text-gray-600 text-sm">Produk Dibuat</div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-md border border-green-100">
                <FileText className="h-8 w-8 text-blue-600 mb-3" />
                <div className="text-2xl font-bold text-gray-900">0</div>
                <div className="text-gray-600 text-sm">Total Postingan</div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-md border border-green-100">
                <Sprout className="h-8 w-8 text-purple-600 mb-3" />
                <div className="text-2xl font-bold text-gray-900">0</div>
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

  // Halaman landing untuk user yang belum login
  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-emerald-100">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-10 pb-32 px-4 sm:px-6 lg:px-8 bg-[url('/hero-background.jpg')] bg-cover bg-center bg-no-repeat">
        {/* overlay biar teks tetap kebaca */}
        <div className="absolute inset-0 bg-linear-to-br from-green-50/60 to-emerald-100/60" />

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-green-200 text-green-700 px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2">
              <Sprout className="h-4 w-4" />
              <span> First Agrisocial Platform</span>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-green-800 mb-6">
            Tempat Petani Tampil
            <span className="bg-linear-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent block">
              Dari Menanam Jadi Cerita
            </span>
          </h1>

          <p className="text-xl text-gray-900 mb-10 max-w-3xl mx-auto leading-relaxed ">
            Ubah proses menanam jadi portofolio digital. Bagikan perjalanan
            tanam Anda, bangun kepercayaan lewat cerita, dan pasarkan hasil
            panen dengan integritas.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/register"
              className="bg-green-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-green-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
            >
              <span>Mulai Sekarang</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <button className="border-2 border-green-700 text-green-800 px-8 py-4 rounded-full font-semibold text-lg hover:bg-green-50 transition-all">
              Pelajari Lebih Lanjut
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
                <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-gray-900">500+</div>
                <div className="text-gray-600">Petani Bergabung</div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
                <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-gray-900">1.2K+</div>
                <div className="text-gray-600">Proyek Aktif</div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
                <Leaf className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-gray-900">85%</div>
                <div className="text-gray-600">Peningkatan Hasil</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-20 bg-white px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Fitur Unggulan Nandur
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Semua yang Anda butuhkan untuk mengelola pertanian modern dalam
              satu platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* FITUR 1: Transparansi Proyek & Portofolio */}
            <FeatureCard
              icon={<Package className="h-8 w-8" />}
              title="Portofolio Proyek Transparan"
              description="Ubah setiap fase tanam (FaseProyek) menjadi story yang indah. Bangun kepercayaan pembeli dengan bukti nyata dari lahan Anda."
            />

            {/* FITUR 2: Social Feed & Komunitas */}
            <FeatureCard
              icon={<Users className="h-8 w-8" />}
              title="Agrisocial Community"
              description="Berbagi progres proyek melalui postingan dan belajar real-time dari sesama petani dan pakar melalui fitur post, komentar, dan like"
            />

            {/* FITUR 3: Pemasaran & Marketplace */}
            <FeatureCard
              icon={<ShoppingCart className="h-8 w-8" />}
              title="Marketplace Hasil Panen"
              description="Pasarkan hasil panen dengan harga premium. Pembeli dapat melacak asal-usul produk dari Portofolio Proyek Anda."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Siap Mengubah Cara Bertani Anda?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Bergabung dengan ribuan petani yang sudah merasakan Terhubung,
            Berkembang, dan Sukses bersama Nandur.
          </p>
          <Link
            href="/register"
            className="bg-white text-green-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-green-50 transition-all transform hover:scale-105 shadow-2xl inline-flex items-center space-x-2"
          >
            <span>Daftar Sekarang - Gratis!</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}