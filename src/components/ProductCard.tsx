// components/ProductCard.tsx
import Link from "next/link";
import Image from "next/image";
import { Package, ShoppingCart, Clock } from "lucide-react";
import { StatusProduk } from "@prisma/client";


interface Produk {
  id: string;
  namaProduk: string;
  deskripsi: string;
  harga: number;
  status: StatusProduk;
  unit: string;
  gambarProduk: string[];
  createdAt: any;
}

interface ProductCardProps {
  produk: Produk;
}

const statusConfig = {
  TERSEDIA: {
    label: "Tersedia",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: ShoppingCart,
  },
  TERJUAL: {
    label: "Terjual",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: Package,
  },
  BELUM_TERSEDIA: {
    label: "Segera Tersedia",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: Clock,
  },
};

export default function ProductCard({ produk }: ProductCardProps) {
  const StatusIcon = statusConfig[produk.status].icon;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Link href={`/produk/${produk.id}`}>
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group">
        {/* Product Image */}
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          {produk.gambarProduk[0] ? (
            <Image
              src={produk.gambarProduk[0]}
              alt={produk.namaProduk}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <Package className="w-12 h-12 text-gray-400" />
            </div>
          )}

          {/* Status Badge */}
          <div className="absolute top-4 left-4">
            <div
              className={`${
                statusConfig[produk.status].color
              } px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1`}
            >
              <StatusIcon className="w-3 h-3" />
              {statusConfig[produk.status].label}
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-6">
          <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-1">
            {produk.namaProduk}
          </h3>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-10">
            {produk.deskripsi || "Tidak ada deskripsi"}
          </p>

          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-2xl font-bold text-green-600">
                {formatCurrency(produk.harga)}
              </span>
              <span className="text-sm text-gray-500 ml-2">
                / {produk.unit}
              </span>
            </div>
          </div>

          <div className="text-xs text-gray-500 mb-4">
            Ditambahkan {formatDate(produk.createdAt)}
          </div>

          {/* Action Button */}
          {produk.status === "TERSEDIA" ? (
            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Beli Sekarang
            </button>
          ) : produk.status === "BELUM_TERSEDIA" ? (
            <button
              disabled
              className="w-full bg-gray-300 text-gray-500 py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-not-allowed"
            >
              <Clock className="w-4 h-4" />
              Segera Tersedia
            </button>
          ) : (
            <button
              disabled
              className="w-full bg-red-100 text-red-600 py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-not-allowed"
            >
              <Package className="w-4 h-4" />
              Terjual
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
