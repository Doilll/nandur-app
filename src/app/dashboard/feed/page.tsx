// src/app/dashboard/feed/page.tsx
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Rss } from "lucide-react";
import TambahFeedModal from "@/components/TambahFeedModal";
import FeedCardDashboard from "@/components/FeedCardDashboard";

export default async function FeedDashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  if (!user?.id) {
    redirect("/login");
  }

  const feeds = await prisma.feed.findMany({
    where: { authorId: user.id },
    include: {
      author: { select: { name: true } },
      project: { select: { namaProyek: true } },
      comments: true,
      likes: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const userProjects = await prisma.proyekTani.findMany({
    where: { petaniId: user.id },
    select: {
      id: true,
      namaProyek: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-green-50 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Rss className="w-8 h-8 text-green-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Feed & Update
              </h1>
              <p className="text-gray-600 mt-1">
                Bagikan perkembangan proyek dan aktivitas bertani Anda
              </p>
            </div>
          </div>
          <TambahFeedModal userProjects={userProjects} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-lg border border-green-200 p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {feeds.length}
            </div>
            <div className="text-gray-600">Total Postingan</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-green-200 p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {feeds.reduce((sum, feed) => sum + feed.likes.length, 0)}
            </div>
            <div className="text-gray-600">Total Likes</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-green-200 p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {feeds.reduce((sum, feed) => sum + feed.comments.length, 0)}
            </div>
            <div className="text-gray-600">Total Komentar</div>
          </div>
        </div>

        {/* Feed Grid */}
        {feeds.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {feeds.map((feed) => (
              <FeedCardDashboard
                key={feed.id}
                id={feed.id}
                content={feed.content}
                imageFeed={feed.imageFeed}
                projectName={feed.project?.namaProyek}
                authorName={feed.author.name}
                commentsCount={feed.comments.length}
                likesCount={feed.likes.length}
                createdAt={feed.createdAt.toISOString()}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-green-200">
            <Rss className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Belum Ada Postingan
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Mulai berbagi perkembangan proyek dan aktivitas bertani Anda untuk
              terhubung dengan komunitas.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
