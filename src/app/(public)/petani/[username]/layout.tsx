// src/app/petani/[username]/layout.tsx
import { prisma } from "@/lib/prisma";
import {
  MapPin,
  Phone,
  Leaf,
  Package,
  Sprout,
  MessageCircle,
  Share2,
  Calendar,
  CheckCircle2,
  Rss,
} from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import TabButton from "@/components/TabButton";
import StatItem from "@/components/StatItem";
import ContactItem from "@/components/ContactItem";
import ShareButton from "@/components/ShareButton";
import PetaniTabs from "@/components/PetaniTabs";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      name: true,
      username: true,
      bio: true,
      image: true,
    },
  });

  if (!user) {
    return {
      title: "Petani Tidak Ditemukan - Tandur",
    };
  }

  return {
    title: `${user.name} (@${user.username}) - Profil Petani | Nandur`,
    description: user.bio ?? `Profil petani ${user.name} di Nandur.`,
    openGraph: {
      title: user.name,
      description: user.bio ?? "",
      images: user.image ? [user.image] : [],
    },
  };
}

export default async function ProfilLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const petani = await prisma.user.findUnique({
    where: { username },
    select: {
      name: true,
      username: true,
      email: true,
      image: true,
      bio: true,
      numberPhone: true,
      lokasi: true,
      createdAt: true,
      produks: {
        select: { id: true },
      },
      feeds: {
        select: { id: true },
        orderBy: { createdAt: "desc" },
      },
      proyekTani: {
        select: { id: true, status: true },
      },
    },
  });

  if (!petani) {
    throw new Error("Petani not found");
  }

  // Calculate completed projects
  const completedProjects = petani.proyekTani.filter(
    (proyek) => proyek.status === "SELESAI" || proyek.status === "PANEN"
  ).length;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-linear-to-br from-green-600 to-emerald-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="flex items-center space-x-6 mb-6 md:mb-0">
              <div className="relative">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-4 border-white/30">
                  {petani.image ? (
                    <Image
                      src={petani.image}
                      alt={petani.name}
                      width={128}
                      height={128}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <Leaf className="h-12 w-12 text-white/80" />
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2 border-4 border-white">
                  <CheckCircle2 className="h-5 w-5 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  {petani.name}
                </h1>
                <p className="text-green-100 text-lg">@{petani.username}</p>
                {petani.bio && (
                  <p className="text-green-50 mt-3 max-w-2xl leading-relaxed">
                    {petani.bio}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <ShareButton
                title="Tombol share profil"
                text="Cek Profil petani ini!"
                className="bg-green-500 text-white hover:bg-white/30 backdrop-blur-sm px-6 py-3 rounded-full font-medium transition-all flex items-center space-x-2"
                icon={<Share2 className="h-5 w-5" />}
                label="Bagikan"
              />

              <button className="bg-white text-green-700 hover:bg-green-50 px-6 py-3 rounded-full font-medium transition-all flex items-center space-x-2">
                <MessageCircle className="h-5 w-5" />
                <span>Hubungi</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3 text-gray-700">
              <MapPin className="h-5 w-5 text-green-600" />
              <span>{petani.lokasi || "Lokasi belum diisi"}</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-700">
              <Phone className="h-5 w-5 text-green-600" />
              <span>{petani.numberPhone || "Telepon belum diisi"}</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-700">
              <Calendar className="h-5 w-5 text-green-600" />
              <span>
                Bergabung{" "}
                {format(new Date(petani.createdAt), "MMMM yyyy", {
                  locale: id,
                })}
              </span>
            </div>
            <div className="flex items-center space-x-3 text-gray-700">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span>{completedProjects} Proyek Selesai</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PetaniTabs username={username} />
        </div>
      </section>

      {/* Main Content - Default: Projects */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {children}

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Statistik
              </h3>
              <div className="space-y-4">
                <StatItem
                  label="Total Proyek"
                  value={petani.proyekTani.length.toString()}
                  icon={<Sprout className="h-4 w-4" />}
                />
                <StatItem
                  label="Produk Tersedia"
                  value={petani.produks.length.toString()}
                  icon={<Package className="h-4 w-4" />}
                />
                <StatItem
                  label="Postingan Feed"
                  value={petani.feeds.length.toString()}
                  icon={<Rss className="h-4 w-4" />}
                />
                <StatItem
                  label="Proyek Selesai"
                  value={completedProjects.toString()}
                  icon={<CheckCircle2 className="h-4 w-4" />}
                />
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Kontak
              </h3>
              <div className="space-y-3">
                {petani.email && (
                  <ContactItem
                    icon={<MessageCircle className="h-4 w-4" />}
                    label="Email"
                    value={petani.email}
                  />
                )}
                {petani.lokasi && (
                  <ContactItem
                    icon={<MapPin className="h-4 w-4" />}
                    label="Lokasi"
                    value={petani.lokasi}
                  />
                )}
                {petani.numberPhone && (
                  <ContactItem
                    icon={<Phone className="h-4 w-4" />}
                    label="Telepon"
                    value={petani.numberPhone}
                  />
                )}
              </div>
              <button className="w-full mt-4 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors">
                Kirim Pesan
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
