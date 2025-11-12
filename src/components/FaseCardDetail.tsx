"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Trash, Edit } from "lucide-react";
import { toast } from "sonner";

interface FaseProyekDetail {
  id: string;
  namaFase: string;
  deskripsi: string;
  urutanFase: number;
  status: "BELUM_DIMULAI" | "BERJALAN" | "SELESAI";
  gambarFase: string[];
  createdAt: string;
}

export default function FaseCardDetail({ fase }: { fase: FaseProyekDetail }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = async () => {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/fase/${fase.id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Gagal hapus fase");

        toast.success("Fase berhasil dihapus");
        setIsOpen(false);
        router.refresh(); // re-fetch data server-side
      } catch (err) {
        toast.error("Gagal menghapus fase");
        console.error(err);
      }
    });
  };

  return (
    <>
      <Card className="shadow-sm border-green-200 hover:shadow-md transition-all duration-200">
        <CardHeader>
          <CardTitle className="text-green-800 font-semibold flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                #{fase.urutanFase}
              </span>
              <span>{fase.namaFase}</span>
            </div>
            <div className="flex gap-2">
              <Link href={`/dashboard/fase/${fase.id}`}>
                <Button variant="outline" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
              </Link>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => setIsOpen(true)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="w-24 h-16 bg-gray-100 rounded overflow-hidden shrink-0">
              {fase.gambarFase && fase.gambarFase[0] ? (
                // Use a simple img tag so no extra imports are needed
                <img
                  src={fase.gambarFase[0]}
                  alt={fase.namaFase}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                  Tidak ada gambar
                </div>
              )}
            </div>

            <div className="flex-1">
              <p className="text-sm text-gray-700">
                {fase.deskripsi || "Tidak ada deskripsi"}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Status: <span className="font-medium">{fase.status}</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Urutan Fase:{" "}
                <span className="font-medium">{fase.urutanFase}</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal konfirmasi */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Fase</DialogTitle>
            <DialogDescription>
              Yakin mau hapus fase <strong>{fase.namaFase}</strong>? Aksi ini
              tidak bisa dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Batal
            </Button>
            <Button
              variant="destructive"
              disabled={isPending}
              onClick={handleDelete}
            >
              {isPending ? "Menghapus..." : "Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
