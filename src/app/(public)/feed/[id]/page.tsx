// src/app/feed/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { ArrowLeft, Users, MessageCircle, Heart, Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import CommentForm from "@/components/CommentForm";
import ToggleLikeButton from "@/components/ToggleLikeButton";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

interface FeedDetailPageProps {
  params: Promise<{ id: string }>;
}


export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { id } = await params;

  // Fetch minimal data for metadata
  const feed = await prisma.feed.findUnique({
    where: { id },
    select: {
      content: true,
      author: {
        select: {
          name: true,
          username: true,
        },
      },
      imageFeed: true,
    },
  });

  if (!feed) {
    return {
      title: "Feed tidak ditemukan",
      description: "Feed yang kamu cari tidak tersedia.",
    };
  }

  const previewContent =
    feed.content.length > 120
      ? feed.content.slice(0, 120) + "..."
      : feed.content;

  const ogImage =
    feed.imageFeed.length > 0
      ? feed.imageFeed[0]
      : "/chicken.png";

  return {
    title: `${feed.author.name} - Feed`,
    description: previewContent,
    openGraph: {
      title: `${feed.author.name} - Feed`,
      description: previewContent,
      type: "article",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${feed.author.name} - Feed`,
      description: previewContent,
      images: [ogImage],
    },
  };
}


export default async function FeedDetailPage({ params }: FeedDetailPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = session?.user;

  const { id } = await params;

  // Fetch full feed data with all relations
  const feed = await prisma.feed.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          name: true,
          username: true,
          image: true
        }
      },
      project: {
        select: {
          id: true,
          namaProyek: true
        }
      },
      comments: {
        include: {
          author: {
            select: {
              name: true,
              image: true
            }
          }
        },
        orderBy: { createdAt: 'asc' }
      },
      likes: {
        include: {
          user: {
            select: {
              id: true
            }
          }
        }
      },
    },
  });

  if (!feed) {
    notFound();
  }

  const userLiked = user ? feed.likes.some(like => like.user.id === user.id) : false;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-green-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          {/* Feed Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                {feed.author.image ? (
                  <Image
                    src={feed.author.image}
                    alt={feed.author.name}
                    width={48}
                    height={48}
                    className="rounded-full w-12 h-12"
                  />
                ) : (
                  <Users className="w-6 h-6 text-green-600" />
                )}
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{feed.author.name}</h1>
                <p className="text-gray-500">@{feed.author.username}</p>
                <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(feed.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Project Info */}
          {feed.project && (
            <div className="mb-6">
              <Link 
                href={`/proyek/${feed.project.id}`}
                className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-green-100 text-green-800 font-medium hover:bg-green-200 transition-colors"
              >
                Proyek: {feed.project.namaProyek}
              </Link>
            </div>
          )}

          {/* Feed Content */}
          <div className="prose prose-green max-w-none mb-6">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
              {feed.content}
            </p>
          </div>

          {/* Feed Images */}
          {feed.imageFeed.length > 0 && (
            <div className="mb-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {feed.imageFeed.map((image, index) => (
                  <div key={index} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                    <Image
                      src={image}
                      alt={`Feed image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interaction Stats */}
          <div className="flex items-center gap-6 mb-6 border-t border-gray-200 pt-6">
            <ToggleLikeButton
              feedId={feed.id}
              initialLiked={userLiked}
              initialCount={feed.likes.length}
              isAuthenticated={!!user}
            />
            <div className="flex items-center gap-2 text-gray-600">
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium">{feed.comments.length} Komentar</span>
            </div>
          </div>

          {/* Comments Section */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Komentar ({feed.comments.length})
            </h3>
            
            {/* Comments List */}
            {feed.comments.length > 0 ? (
              <div className="space-y-4 mb-6">
                {feed.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-4">
                    <div className="shrink-0">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        {comment.author.image ? (
                          <Image
                            src={comment.author.image}
                            alt={comment.author.name}
                            width={40}
                            height={40}
                            className="rounded-full w-10 h-10"
                          />
                        ) : (
                          <Users className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="bg-gray-50 rounded-2xl px-4 py-3">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-gray-900">
                            {comment.author.name}
                          </span>
                          <span className="text-sm text-gray-500">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-gray-700">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 mb-6">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>Belum ada komentar</p>
              </div>
            )}

            {/* Comment Form */}
            {user ? (
              <CommentForm feedId={feed.id} />
            ) : (
              <div className="text-center py-4 border border-dashed border-gray-300 rounded-2xl">
                <p className="text-gray-600 mb-3">Login untuk menambahkan komentar</p>
                <Link href="/login">
                  <Button variant="outline">
                    Login Sekarang
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}