// components/PetaniCard.tsx
import Link from "next/link";
import { MapPin, Leaf, Sprout, Package } from "lucide-react";
import Image from "next/image";

interface PetaniCardProps {
  id: string;
  name: string;
  username?: string;
  lokasi?: string;
  image?: string;
  totalProyek?: number;
  totalProduk?: number;
}

export default function PetaniCard({
  id,
  name,
  username,
  lokasi = "Lokasi tidak diketahui",
  image = "/chicken.png",
  totalProyek = 0,
  totalProduk = 0
}: PetaniCardProps) {
  return (
    <Link 
      href={`/petani/${username}`}
      className="group block"
    >
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full">
        
        {/* Avatar & Basic Info */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-green-100 border-2 border-green-200 shrink-0">
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-gray-900 group-hover:text-green-700 transition-colors truncate">
              {name}
            </h3>
            <p className="text-gray-500 text-sm truncate">@{username}</p>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 mb-4 text-gray-600">
          <MapPin className="w-4 h-4 text-green-600 shrink-0" />
          <span className="text-sm truncate">{lokasi}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-1 text-green-600 mb-1">
              <Sprout className="w-4 h-4" />
              <span className="font-bold text-lg">{totalProyek}</span>
            </div>
            <span className="text-xs text-gray-500">Proyek</span>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-1 text-orange-600 mb-1">
              <Package className="w-4 h-4" />
              <span className="font-bold text-lg">{totalProduk}</span>
            </div>
            <span className="text-xs text-gray-500">Produk</span>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-1 text-blue-600 mb-1">
              <Leaf className="w-4 h-4" />
              <span className="font-bold text-lg">
                {totalProyek + totalProduk > 0 ? "Aktif" : "Baru"}
              </span>
            </div>
            <span className="text-xs text-gray-500">Status</span>
          </div>
        </div>

        {/* Hover Effect Indicator */}
        <div className="absolute bottom-0 left-0 w-0 h-1 bg-green-600 group-hover:w-full transition-all duration-300 rounded-b-2xl"></div>

      </div>
    </Link>
  );
}