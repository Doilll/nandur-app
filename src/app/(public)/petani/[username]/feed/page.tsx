// src/app/petani/[username]/feed/page.tsx
import { prisma } from "@/lib/prisma";
import { Rss } from "lucide-react";
import FeedCard from "@/components/FeedCard";

export default async function FeedPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const petani = await prisma.user.findUnique({
    where: { username },
    select: {
      name: true,
      username: true,
      feeds: {
        select: {
          id: true,
          content: true,
          createdAt: true,
          imageFeed: true,
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!petani) {
    return <div>Petani tidak ditemukan</div>;
  }

  return (
    <div className="lg:col-span-2">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Feed Aktivitas</h2>
        <p className="text-gray-600 mt-2">Update terbaru dari {petani.name}</p>
      </div>

      <div className="space-y-6">
        {petani.feeds.map((feed) => (
          <FeedCard key={feed.id} feed={feed} />
        ))}
      </div>

      {petani.feeds.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
          <Rss className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Belum Ada Postingan
          </h3>
          <p className="text-gray-500">Petani ini belum membagikan update</p>
        </div>
      )}
    </div>
  );
}
