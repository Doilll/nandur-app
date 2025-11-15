// components/ProductCard.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Edit2, Trash2, Package, Images } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { StatusProduk } from "@prisma/client";


interface Produk {
  id: string;
  namaProduk: string;
  deskripsi: string;
  harga: number;
  unit: string; // menggantikan stok
  status: StatusProduk;
  gambarProduk: string[];
  createdAt: Date;
}

interface ProductCardProps {
  produk: Produk;
}

export default function ProductCardDashboard({ produk }: ProductCardProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/produk/${produk.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Gagal menghapus produk");
      }

      // Refresh halaman setelah penghapusan berhasil
      window.location.reload();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Gagal menghapus produk. Silakan coba lagi.");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const getFaseStatusColor = (status: StatusProduk) => {
    const colors: Record<StatusProduk, string> = {
      [StatusProduk.BELUM_TERSEDIA]: "bg-gray-100 text-gray-800",
      [StatusProduk.TERSEDIA]: "bg-blue-100 text-blue-800",
      [StatusProduk.TERJUAL]: "bg-green-100 text-green-800",
    };
    return colors[status] ?? "bg-gray-100 text-gray-800";
  };

  // Ambil gambar pertama untuk thumbnail
  const mainImage = produk.gambarProduk?.[0];

  const statusLabel = {
    [StatusProduk.TERSEDIA]: "Tersedia",
    [StatusProduk.TERJUAL]: "Terjual",
    [StatusProduk.BELUM_TERSEDIA]: "Habis",
  }[produk.status];

  return (
    <>
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300">
        {/* Gambar Produk */}
        <div className="relative h-48 bg-gray-100">
          {mainImage ? (
            <img
              src={mainImage}
              alt={produk.namaProduk}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <Package className="w-12 h-12 text-gray-400" />
            </div>
          )}

          {/* Badge Status */}
          <div
            className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-semibold ${getFaseStatusColor(
              produk.status
            )}`}
          >
            {statusLabel}
          </div>

          {/* Badge Jumlah Gambar */}
          {produk.gambarProduk && produk.gambarProduk.length > 1 && (
            <div className="absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 flex items-center gap-1">
              <Images className="w-3 h-3" />
              {produk.gambarProduk.length}
            </div>
          )}
        </div>

        {/* Konten Card */}
        <div className="p-4">
          <h3 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-1">
            {produk.namaProduk}
          </h3>

          <p className="text-gray-600 text-sm mb-3 line-clamp-2 min-h-10">
            {produk.deskripsi || "Tidak ada deskripsi"}
          </p>

          <div className="flex items-center justify-between mb-3">
            <span className="text-lg font-bold text-green-700">
              {formatCurrency(produk.harga)}
            </span>

            <span className="text-sm text-gray-600">{produk.unit}</span>
          </div>

          <div className="text-xs text-gray-500 mb-4">
            Ditambahkan pada {formatDate(produk.createdAt)}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Link href={`/dashboard/produk/${produk.id}`} className="flex-1">
              <Button
                variant="outline"
                className="w-full flex items-center gap-2 border-green-200 text-green-700 hover:bg-green-50"
                size="sm"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </Button>
            </Link>

            <Button
              variant="outline"
              className="flex items-center gap-2 border-red-200 text-red-700 hover:bg-red-50"
              size="sm"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-800">
              Hapus Produk
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Apakah Anda yakin ingin menghapus produk{" "}
              <strong>"{produk.namaProduk}"</strong>? Tindakan ini tidak dapat
              dibatalkan.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Menghapus...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Hapus
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
