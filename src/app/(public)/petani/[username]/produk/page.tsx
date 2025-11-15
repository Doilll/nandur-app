// src/app/petani/[username]/produk/page.tsx
import { prisma } from "@/lib/prisma";
import { Package } from 'lucide-react';
import ProductCard from "@/components/ProductCard";


export default async function ProdukPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const petani = await prisma.user.findUnique({
    where: { username },
    select: {
      name: true,
      username: true,
      produks: {
        select: {
          id: true,
          namaProduk: true,
          deskripsi: true,
          harga: true,
          gambarProduk: true,
          status: true,
          unit: true,
          createdAt: true,
        },
      },
    },
  });

  if (!petani) {
    return <div>Petani tidak ditemukan</div>;
  }

  return (
    <div className="lg:col-span-2">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Produk Tersedia</h2>
        <p className="text-gray-600 mt-2">
          {petani.produks.length} produk dari {petani.name}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {petani.produks.map((produk) => (
          <ProductCard key={produk.id} produk={produk} />
        ))}
      </div>

      {petani.produks.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
          <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Produk</h3>
          <p className="text-gray-500">Petani ini belum menambahkan produk</p>
        </div>
      )}
    </div>
  );
}

