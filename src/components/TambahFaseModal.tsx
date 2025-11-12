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
import TambahFaseForm from "./TambahFaseForm";

export default function TambahFaseModal({proyekId}: {proyekId:string}) {
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
          Tambah Fase
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-green-800">
            Tambah Fase Baru
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-[70vh] overflow-y-auto px-1">
          <TambahFaseForm
          proyekId={proyekId}
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
