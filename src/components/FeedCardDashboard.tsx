// src/app/dashboard/feed/FeedCard.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import Image from "next/image";
import { MessageSquare, Heart, Leaf, Calendar, Edit, Trash2 } from "lucide-react";

interface FeedCardProps {
  id: string;
  content: string;
  imageFeed: string[];
  projectName?: string | null;
  authorName: string;
  commentsCount: number;
  likesCount: number;
  createdAt: string;
}

export default function FeedCardDashboard({
  id,
  content,
  imageFeed,
  projectName,
  authorName,
  commentsCount,
  likesCount,
  createdAt,
}: FeedCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);

      const res = await fetch(`/api/feed/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Gagal menghapus feed");

      // Refresh the page to update the list
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus feed");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="overflow-hidden border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Gambar Feed */}
      {imageFeed.length > 0 && (
        <div className="relative w-full h-48 bg-gray-100">
          <Image
            src={imageFeed[0]}
            alt="Feed image"
            fill
            className="object-cover"
          />
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Calendar className="w-3 h-3" />
              {formatDate(createdAt)}
            </div>
          </div>
          
          {projectName && (
            <span className="text-xs text-green-600 flex items-center gap-1">
              <Leaf className="w-3 h-3" />
              Proyek: {projectName}
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-gray-700 text-sm mb-4 line-clamp-3">{content}</p>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4" />
            <span>{likesCount} Likes</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="w-4 h-4" />
            <span>{commentsCount} Komentar</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/feed/${id}`} className="flex-1">
            <Button 
              variant="outline" 
              className="w-full flex items-center gap-2 border-green-200 text-green-700 hover:bg-green-50"
              size="sm"
            >
              <Edit className="w-4 h-4" />
              Edit
            </Button>
          </Link>

          {/* Delete Dialog */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 border-red-200 text-red-700 hover:bg-red-50"
                size="sm"
                disabled={loading}
              >
                <Trash2 className="w-4 h-4" />
                Hapus
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Hapus Feed?</AlertDialogTitle>
                <AlertDialogDescription>
                  Feed ini akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel disabled={loading}>
                  Batal
                </AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  {loading ? "Menghapus..." : "Hapus"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}