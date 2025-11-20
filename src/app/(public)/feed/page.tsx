// src/app/feed/page.tsx
import { prisma } from "@/lib/prisma";
import { Rss, Users, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ToggleLikeButton from "@/components/ToggleLikeButton";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import type { Metadata } from "next";

interface PublicFeedListPageProps {
  searchParams: {
    page?: string;
  };
}

export const metadata: Metadata = {
  title: "Feed Komunitas - Nandur",
  description: "Bergabung dengan Nandur untuk saling berinteraksi dan berbagi informasi dengan para petani"
}

export default async function PublicFeedListPage({ searchParams }: PublicFeedListPageProps) {
  // Get session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const {page} = await searchParams;

  const currentPage = Number(page) || 1;
  const itemsPerPage = 10;
  const skip = (currentPage - 1) * itemsPerPage;

  // Fetch public feeds with pagination and like status for current user
  const [feeds, totalCount] = await Promise.all([
    prisma.feed.findMany({
      skip,
      take: itemsPerPage,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        content: true,
        createdAt: true,
        imageFeed: true,
        author: {
          select: { 
            name: true, 
            image: true 
          }
        },
        _count: {
          select: { 
            likes: true, 
            comments: true 
          }
        },
        likes: {
          where: {
            userId: session?.user?.id || "" // Filter likes by current user
          },
          select: {
            userId: true
          }
        }
      },
    }),
    prisma.feed.count()
  ]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const truncateContent = (content: string, maxLength: number = 200) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-green-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Rss className="w-8 h-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900">Update Petani</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Ikuti perkembangan terbaru dari petani-petani kami
          </p>
        </div>

        {/* Feed List */}
        <div className="space-y-6">
          {feeds.length > 0 ? (
            feeds.map((feed) => {
              const displayedImages = feed.imageFeed.slice(0, 3); // Max 3 images
              const hasMoreImages = feed.imageFeed.length > 3;
              const isLikedByCurrentUser = feed.likes.length > 0;

              return (
                <div key={feed.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
                  {/* Feed Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        {feed.author.image ? (
                          <Image
                            src={feed.author.image}
                            alt={feed.author.name}
                            width={40}
                            height={40}
                            className="rounded-full w-10 h-10"
                          />
                        ) : (
                          <Users className="w-5 h-5 text-green-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{feed.author.name}</h3>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatDate(feed.createdAt)}
                    </span>
                  </div>

                  {/* Feed Content */}
                  <div className="mb-4">
                    <p className="text-gray-700 leading-relaxed">
                      {truncateContent(feed.content)}
                    </p>
                  </div>

                  {/* Feed Images (Max 3) */}
                  {displayedImages.length > 0 && (
                    <div className="mb-4">
                      <div className={`grid gap-3 ${
                        displayedImages.length === 1 ? 'grid-cols-1' : 
                        displayedImages.length === 2 ? 'grid-cols-2' : 'grid-cols-3'
                      }`}>
                        {displayedImages.map((image, index) => (
                          <div key={index} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                            <Image
                              src={image}
                              alt={`Feed image ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                            {/* Overlay for more images indicator */}
                            {hasMoreImages && index === 2 && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <span className="text-white font-semibold text-sm">
                                  +{feed.imageFeed.length - 3}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Interaction Stats & CTA */}
                  <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <ToggleLikeButton
                        feedId={feed.id}
                        initialLiked={isLikedByCurrentUser}
                        initialCount={feed._count.likes}
                        isAuthenticated={!!session}
                      />
                      <Link href={`/feed/${feed.id}`} className="flex items-center gap-2">
                        
                        <MessageCircle className="w-4 h-4 text-blue-500" />
                        <span>{feed._count.comments}</span>
                      </Link>
                    </div>
                    
                    <Link href={`/feed/${feed.id}`}>
                      <Button variant="outline" size="sm">
                        Lihat Detail
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-green-200">
              <Rss className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Belum Ada Update
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Petani-petani kami belum membagikan update. Silakan kembali lagi nanti.
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <Link 
              href={`/feed?page=${currentPage - 1}`}
              className={`px-4 py-2 rounded-lg border ${
                currentPage <= 1 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              aria-disabled={currentPage <= 1}
              tabIndex={currentPage <= 1 ? -1 : undefined}
            >
              Sebelumnya
            </Link>
            
            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <Link
                    key={pageNum}
                    href={`/feed?page=${pageNum}`}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      currentPage === pageNum
                        ? 'bg-green-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border'
                    }`}
                  >
                    {pageNum}
                  </Link>
                );
              })}
            </div>

            <Link 
              href={`/feed?page=${currentPage + 1}`}
              className={`px-4 py-2 rounded-lg border ${
                currentPage >= totalPages 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              aria-disabled={currentPage >= totalPages}
              tabIndex={currentPage >= totalPages ? -1 : undefined}
            >
              Selanjutnya
            </Link>
          </div>
        )}

        {/* Page Info */}
        {feeds.length > 0 && (
          <div className="text-center mt-4 text-sm text-gray-600">
            Menampilkan {feeds.length} dari {totalCount} update
            {totalPages > 1 && ` • Halaman ${currentPage} dari ${totalPages}`}
          </div>
        )}
      </div>
    </div>
  );
}