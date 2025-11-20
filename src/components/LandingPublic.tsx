import Navbar from "./Navbar";
import Footer from "./Footer";
import FeatureCard from "./FeatureCard";
import {
  ArrowRight,
  Leaf,
  Users,
  TrendingUp,
  Sprout,
  Package,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";

export default function LandingPublic() {
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
            <Link
              href="/tentang"
              className="border-2 border-green-700 text-green-800 px-8 py-4 rounded-full font-semibold text-lg hover:bg-green-50 transition-all"
            >
              Pelajari Lebih Lanjut
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
                <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <div className="text-xl font-bold text-gray-900">
                  Untuk Petani
                </div>
                <div className="text-gray-600">
                  Bangun portofolio digital dari lahan Anda
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
                <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <div className="text-xl font-bold text-gray-900">
                  Untuk Pembeli
                </div>
                <div className="text-gray-600">
                  Akses produk dengan asal-usul yang jelas
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
                <Leaf className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <div className="text-xl font-bold text-gray-900">
                  Untuk Investor
                </div>
                <div className="text-gray-600">
                  Pantau progres proyek secara transparan
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white px-4 sm:px-6 lg:px-8">
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
              color="green"
            />

            {/* FITUR 2: Social Feed & Komunitas */}
            <FeatureCard
              icon={<Users className="h-8 w-8" />}
              title="Agrisocial Community"
              description="Berbagi progres proyek melalui postingan dan belajar real-time dari sesama petani dan pakar melalui fitur post, komentar, dan like"
              color="blue"
            />

            {/* FITUR 3: Pemasaran & Marketplace */}
            <FeatureCard
              icon={<ShoppingCart className="h-8 w-8" />}
              title="Marketplace Hasil Panen"
              description="Pasarkan hasil panen dengan harga premium. Pembeli dapat melacak asal-usul produk dari Portofolio Proyek Anda."
              color="orange"
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
