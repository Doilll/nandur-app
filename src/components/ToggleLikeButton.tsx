// src/app/feed/ToggleLikeButton.tsx
"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";

interface ToggleLikeButtonProps {
  feedId: string;
  initialLiked: boolean;
  initialCount: number;
  isAuthenticated: boolean;
}

export default function ToggleLikeButton({
  feedId,
  initialLiked,
  initialCount,
  isAuthenticated,
}: ToggleLikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [isPending, startTransition] = useTransition();

  const toggleLike = async () => {
    if (!isAuthenticated) {
      toast.error("Login Diperlukan",{
        description: "Silakan login untuk memberikan like",
      });
      return;
    }

    const newLiked = !liked;
    const newCount = newLiked ? count + 1 : count - 1;
    
    setLiked(newLiked);
    setCount(newCount);

    startTransition(async () => {
      try {
        const res = await fetch(`/api/feed/${feedId}/like`, {
          method: "POST",
        });

        if (!res.ok) {
          setLiked(!newLiked);
          setCount(newLiked ? newCount - 1 : newCount + 1);
          toast.error("Gagal terjadi kesalahan",{
            description: "Gagal memberikan like",
          });
        }
      } catch (error) {
        setLiked(!newLiked);
        setCount(newLiked ? newCount - 1 : newCount + 1);
        toast.error("Error",{
          description: "Terjadi kesalahan jaringan",
        });
      }
    });
  };

  return (
    <button
      onClick={toggleLike}
      disabled={isPending}
      className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
    >
      <Heart
        className={`w-5 h-5 transition ${
          liked 
            ? "fill-red-500 text-red-500" 
            : "text-gray-500 hover:text-red-500"
        }`}
      />
      <span className={`font-medium ${
        liked ? "text-red-600" : "text-gray-600"
      }`}>
        {count}
      </span>
    </button>
  );
}