// src/app/tentang/page.tsx
import {
  Sprout,
  Users,
  BarChart3,
  Shield,
  TrendingUp,
  ArrowRight,
  Image as ImageIcon,
  Globe,
} from "lucide-react";
import Link from "next/link";
import FeatureCard from "@/components/FeatureCard";
import ValueCard from "@/components/ValueCard";
import StepCard from "@/components/StepCard";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Tentang Nandur",
  description: "Informasi tentang platform Nandur",
};

export default async function TentangPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <div className="min-h-screen bg-linear-to-b from-green-50 to-white">
      {/* Why Section */}
      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Kenapa Nandur Ada?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Karena kami tau ada yang harus dibenahi di dunia pertanian modern
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-6">
                <TrendingUp className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Harga Naik Turun Nggak Jelas
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Petani sering rugi karena harga hasil panen berubah-ubah tiap
                minggu. Tanpa data dan akses pasar yang jelas, semuanya kayak
                judi nasib.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Tengkulak Masih Pegang Kendali
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Banyak petani cuma bisa jual lewat tengkulak karena nggak punya
                akses langsung ke pembeli. Akhirnya harga ditekan, petani yang
                capek tapi untungnya tipis.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-6">
                <BarChart3 className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Panen Banyak, Pasar Nggak Nyerap
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Kadang panen bagus, tapi pasar sepi. Banyak hasil panen akhirnya
                dibuang atau dijual murah karena nggak tahu harus pasarin
                kemana.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Pemasaran Jadul
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Petani jualan cuma ke lingkaran sempit. Tanpa branding dan tanpa
                digital, harga susah naik karena pembeli nggak lihat value
                sebenarnya.
              </p>
            </div>
          </div>

          {/* Problem Visual */}
          <div className="bg-linear-to-r from-red-500 to-orange-500 rounded-3xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">
              Masalahnya Complex, Solusinya Simple
            </h3>
            <p className="text-xl opacity-90">
              Kami bikin jembatan yang nggak cuma connect, tapi juga build trust
            </p>
          </div>
        </div>
      </section>

      {/* What Section */}
      <section className="py-20 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Apa Itu Nandur?
            </h2>
            <p className="text-xl text-gray-600">
              Bayangin ada platform yang ngegabungin fitur-fitur keren ini:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            <FeatureCard
              icon={<Users className="h-8 w-8" />}
              title="Agri-Social Platform"
              description="Tempat para petani pemula, petani mahir dan pembeli ketemu, interaksi, dan kolaborasi. Kayak Instagram tapi khusus buat urusan tani-menani."
              color="blue"
            />
            <FeatureCard
              icon={<BarChart3 className="h-8 w-8" />}
              title="Project Documentation"
              description="Semua aktivitas tanam menanam dari A sampai Z bisa didokumentasikan. Dari persiapan lahan sampe panen, ada track record-nya."
              color="green"
            />
            <FeatureCard
              icon={<ImageIcon className="h-8 w-8" />}
              title="Social Feed"
              description="Feed sosial khusus petani. Share progress, tanya-tanya, atau sekadar pamer hasil panen. Komunitas yang supportif!"
              color="purple"
            />
            <FeatureCard
              icon={<Globe className="h-8 w-8" />}
              title="Transparent Marketplace"
              description="Marketplace dimana setiap produk bisa ditelusuri asal-usulnya. Pembeli tau persis dari proyek mana barangnya datang."
              color="orange"
            />
          </div>
        </div>
      </section>

      {/* How Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Gimana Cara Kerjanya?
            </h2>
            <p className="text-xl text-gray-600">
              Simple banget, cuma butuh 4 langkah buat mulai
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <StepCard
              step={1}
              icon={<Users className="h-6 w-6" />}
              title="Daftar & Buat Profil"
              description="Registrasi sebagai petani, lengkapi profil, dan siap-siap bikin proyek pertama"
            />
            <StepCard
              step={2}
              icon={<Sprout className="h-6 w-6" />}
              title="Buat Proyek Tani"
              description="Setup proyek baru, tentukan fase-fase (persiapan, tanam, rawat, panen)"
            />
            <StepCard
              step={3}
              icon={<ImageIcon className="h-6 w-6" />}
              title="Dokumentasi & Update (opsional)"
              description="Upload progress tiap fase, post di feed, bangun cerita dibalik proyek kamu"
            />
            <StepCard
              step={4}
              icon={<TrendingUp className="h-6 w-6" />}
              title="Jual & Bangun Trust"
              description="Pasarkan hasil panen, tunjukin portofolio ke pembeli, transaksi lancar"
            />
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Kenapa Petani Harus Pakai Nandur?
            </h2>
            <p className="text-xl text-gray-600">
              Karena kami kasih value yang bener-bener beda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            <ValueCard
              icon={<Shield className="h-8 w-8" />}
              title="Transparansi Total"
              description="Tunjukin semua proses ke pembeli. Dari bibit sampe panen, mereka bisa liat langsung. Trust auto terbangun!"
              benefits={[
                "Pembeli percaya",
                "Nilai jual meningkat",
                "Repeat order",
              ]}
            />
            <ValueCard
              icon={<TrendingUp className="h-8 w-8" />}
              title="Portofolio Digital"
              description="Proyek kamu jadi CV hidup. Investor dan pembeli bisa liat track record, bukan janji doang."
              benefits={["Attract investor", "Harga lebih baik", "Reputation"]}
            />
            <ValueCard
              icon={<Globe className="h-8 w-8" />}
              title="Promosi Gampang"
              description="Marketplace built-in. Jualan nggak perlu keluar platform. Pembeli udah ada yang tertarik sama cerita proyek kamu."
              benefits={["Jangkauan luas", "Minimal effort", "Target tepat"]}
            />
            <ValueCard
              icon={<Users className="h-8 w-8" />}
              title="Komunitas Supportif"
              description="Belajar dari petani lain, share pengalaman, dapatin tips. You're not alone in this journey!"
              benefits={["Networking", "Knowledge sharing", "Support system"]}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!session && (
        <section className="py-20 bg-linear-to-br from-green-600 to-emerald-700 text-white">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Join the Revolution?
            </h2>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Gabung dengan petani yang udah transformasi cara bertani
              mereka. Dari traditional farming ke smart farming dengan Nandur.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/register"
                className="bg-white text-green-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-green-50 transition-all transform hover:scale-105 shadow-2xl flex items-center space-x-2"
              >
                <span>Daftar Sekarang</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/petani"
                className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-green-600 transition-all"
              >
                Lihat Katalog Petani
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
