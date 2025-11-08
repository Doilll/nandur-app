// app/page.tsx
import { ArrowRight, Leaf, Users, TrendingUp, Sprout, Shield, Calendar } from 'lucide-react';
import Link from 'next/link';
import FeatureCard from '@/components/FeatureCard';

export default function TentangPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-emerald-100">
      {/* Navigation */}
      <nav className="border-b border-green-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Leaf className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold text-green-800">Nandur</span>
            </div>
            
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="text-green-700 hover:text-green-600 font-medium transition-colors">
                Fitur
              </a>
              <a href="#how-it-works" className="text-green-700 hover:text-green-600 font-medium transition-colors">
                Cara Kerja
              </a>
              <a href="#testimonials" className="text-green-700 hover:text-green-600 font-medium transition-colors">
                Testimoni
              </a>
            </div>

            <div className="flex items-center space-x-4">
              <Link 
                href="/auth/login" 
                className="text-green-700 hover:text-green-600 font-medium transition-colors"
              >
                Masuk
              </Link>
              <Link 
                href="/auth/register"
                className="bg-green-600 text-white px-6 py-2 rounded-full font-medium hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl"
              >
                Daftar Gratis
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2">
              <Sprout className="h-4 w-4" />
              <span>Platform Agrikultur Modern</span>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Kelola Proyek Tani
            <span className="text-green-600 block">Dengan Mudah</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Nandur membantu petani modern dalam mengelola proyek pertanian, berbagi progres, 
            dan memasarkan hasil panen dalam satu platform terintegrasi.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/auth/register"
              className="bg-green-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-green-700 transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center space-x-2"
            >
              <span>Mulai Sekarang</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <button className="border-2 border-green-600 text-green-700 px-8 py-4 rounded-full font-semibold text-lg hover:bg-green-50 transition-all">
              Pelajari Lebih Lanjut
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-4xl mx-auto">
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
      <section id="features" className="py-20 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Fitur Unggulan Nandur
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Semua yang Anda butuhkan untuk mengelola pertanian modern dalam satu platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Calendar className="h-8 w-8" />}
              title="Manajemen Proyek"
              description="Kelola fase tanam dari persiapan hingga panen dengan timeline yang terstruktur"
            />
            <FeatureCard
              icon={<Users className="h-8 w-8" />}
              title="Komunitas Petani"
              description="Berbagi pengalaman dan belajar dari petani lainnya melalui feed sosial"
            />
            <FeatureCard
              icon={<TrendingUp className="h-8 w-8" />}
              title="Pemasaran Digital"
              description="Pasarkan hasil panen langsung ke konsumen melalui platform"
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8" />}
              title="Keamanan Data"
              description="Data proyek dan transaksi Anda terlindungi dengan sistem keamanan terbaik"
            />
            <FeatureCard
              icon={<Sprout className="h-8 w-8" />}
              title="Monitoring Progress"
              description="Pantau perkembangan proyek dengan update real-time dan dokumentasi visual"
            />
            <FeatureCard
              icon={<Leaf className="h-8 w-8" />}
              title="Ramah Lingkungan"
              description="Dukung praktik pertanian berkelanjutan dengan tools yang efisien"
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
            Bergabung dengan ribuan petani yang sudah merasakan kemudahan mengelola pertanian dengan Nandur
          </p>
          <Link 
            href="/auth/register"
            className="bg-white text-green-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-green-50 transition-all transform hover:scale-105 shadow-2xl inline-flex items-center space-x-2"
          >
            <span>Daftar Sekarang - Gratis!</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Leaf className="h-6 w-6 text-green-400" />
              <span className="text-xl font-bold">Nandur</span>
            </div>
            <div className="text-gray-400">
              © 2024 Nandur. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Feature Card Component
