// src/app/dashboard/produk/page.tsx
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import EmptyState from "@/components/EmptyState";
import { Sprout } from "lucide-react";
import TambahProdukModal from "@/components/TambahProdukModal";
import ProductCardDashboard from "@/components/ProductCardDashboard";

export default async function ProdukDashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return <div className="text-center mt-10">Anda belum login</div>;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      proyekTani: {
        select: {
          id: true,
          namaProyek: true,
        },
      },
      produks: {
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          proyekTani: {
            select: {
              namaProyek: true
            }
          }
        }
      }
    },
  });

  const hasProyek = user?.proyekTani && user.proyekTani.length > 0;

  return (
    <div className="min-h-screen bg-green-50 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-green-800 flex items-center gap-2">
            <Sprout className="w-7 h-7" /> Produk Tani Anda
          </h1>
          <TambahProdukModal />
        </div>

        {/* Info Proyek */}
        {hasProyek && (
          <div className="bg-white rounded-lg p-4 shadow-sm border border-green-200">
            <p className="text-gray-600">
              Anda memiliki {user.proyekTani.length} proyek tani
            </p>
          </div>
        )}

        {/* Daftar Produk */}
        {user?.produks && user.produks.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {user.produks.map((produk) => (
              <ProductCardDashboard key={produk.id} produk={produk} />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center min-h-[50vh]">
            <EmptyState
              icon={<Sprout className="h-12 w-12" />}
              title="Belum Ada Produk"
              description={
                hasProyek 
                  ? "Buat produk tani pertamamu sekarang!" 
                  : "Anda perlu membuat proyek tani terlebih dahulu sebelum menambahkan produk."
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}