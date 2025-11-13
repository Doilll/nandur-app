// components/TambahProdukModal.tsx
"use client";

import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import TambahProdukForm from "./TambahProdukForm";

export default function TambahProdukModal({
  proyekId,
  onSuccess,
}: {
  proyekId?: string;
  onSuccess?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Tambah Produk
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-green-800">
            Tambah Produk Baru
          </DialogTitle>
        </DialogHeader>

        <TambahProdukForm
          proyekId={proyekId}
          onSuccess={() => {
            setOpen(false);
            startTransition(() => {
              router.refresh();
              onSuccess?.();
            });
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
