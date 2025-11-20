// src/app/feed/[id]/CommentForm.tsx
"use client";

import { useState, useTransition } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface CommentFormProps {
  feedId: string;
}

export default function CommentForm({ feedId }: CommentFormProps) {
  const [comment, setComment] = useState("");
  const [isPending, startTransition] = useTransition();

  const submitComment = () => {
    if (!comment.trim()) {
      toast.error("komentare kosong", {
        description: "Silakan tulis komentar terlebih dahulu",
      });
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch(`/api/feed/${feedId}/comment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: comment }),
        });

        if (res.ok) {
          setComment("");
          toast.success("Komentar berhasil ditambahkan",{
            description: "Komentar Anda berhasil ditambahkan",
          });
          window.location.reload();
        } else {
          const error = await res.json();
          toast.error("Gagal mengirim komentar",{
            description: error.error || "Terjadi kesalahan",
          });
        }
      } catch (error) {
        toast("Error",{
          description: "Terjadi kesalahan jaringan",
        });
      }
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitComment();
    }
  };

  return (
    <div className="flex gap-3">
      <div className="flex-1">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Tulis komentar Anda..."
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
          disabled={isPending}
        />
      </div>
      
      <Button
        onClick={submitComment}
        disabled={isPending || !comment.trim()}
        className="self-start"
      >
        <Send className="w-4 h-4 mr-2" />
        {isPending ? "Mengirim..." : "Kirim"}
      </Button>
    </div>
  );
}