// src/app/dashboard/feed/TambahFeedModal.tsx
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
import TambahFeedForm from "./TambahFeedForm";

interface Project {
  id: string;
  namaProyek: string;
}

interface TambahFeedModalProps {
  userProjects: Project[];
}

export default function TambahFeedModal({ userProjects }: TambahFeedModalProps) {
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
          Buat Postingan
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-green-800">
            Buat Postingan Baru
          </DialogTitle>
        </DialogHeader>

        <TambahFeedForm
          userProjects={userProjects}
          onSuccess={() => {
            setOpen(false);
            startTransition(() => router.refresh());
          }}
        />
      </DialogContent>
    </Dialog>
  );
}