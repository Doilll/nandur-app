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
import TambahProyekForm from "@/components/TambahProyekForm";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TambahProyekModal() {
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
          Tambah Proyek
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-green-800">
            Tambah Proyek Baru
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-[70vh] overflow-y-auto px-1">
          <TambahProyekForm
            onSuccess={() => {
              setOpen(false);
              startTransition(() => router.refresh()); // auto-refresh list proyek
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
