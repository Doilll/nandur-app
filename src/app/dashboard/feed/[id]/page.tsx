// src/app/dashboard/feed/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { ArrowLeft, Heart, MessageCircle, Calendar, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import UpdateFeedForm from "@/components/UpdateFeedForm";

export default async function FeedDetailDashboard({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = session?.user;

  if (!user?.id) {
    redirect("/login");
  }

  const { id } = await params;
  const feed = await prisma.feed.findUnique({
    where: { 
      id,
      authorId: user.id // Ensure user can only access their own feeds
    },
    include: {
      author: { 
        select: { 
          name: true,
          image: true 
        } 
      },
      project: { 
        select: { 
          id: true,
          namaProyek: true 
        } 
      },
      _count: {
        select: {
          comments: true
        }
      },
      likes: { 
        include: { 
          user: { 
            select: { 
              name: true,
              image: true
            } 
          } 
        } 
      },
    },
  });

  if (!feed) {
    notFound();
  }

  const userProjects = await prisma.proyekTani.findMany({
    where: { petaniId: user.id },
    select: {
      id: true,
      namaProyek: true,
    },
    orderBy: { createdAt: "desc" },
  });

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
    <div className="min-h-screen bg-green-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Navigation */}
        <div className="mb-8">
          <Link 
            href="/dashboard/feed"
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali ke Feed
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Feed Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Feed Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              {/* Author Info */}
              <div className="flex items-center gap-3 mb-4">
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
                    <User className="w-5 h-5 text-green-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{feed.author.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(feed.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Project Info */}
              {feed.project && (
                <div className="mb-4">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                    Proyek: {feed.project.namaProyek}
                  </span>
                </div>
              )}

              {/* Feed Content */}
              <div className="prose prose-green max-w-none mb-6">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {feed.content}
                </p>
              </div>

              {/* Feed Images */}
              {feed.imageFeed.length > 0 && (
                <div className="mb-6">
                  <div className="grid grid-cols-2 gap-3">
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

              {/* Stats */}
              <div className="flex items-center gap-6 text-sm text-gray-600 border-t border-gray-200 pt-4">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  <span>{feed.likes.length} Likes</span>
                </div>
                <Link href={`/feed/${feed.id}`} className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-blue-500" />
                  <span>{feed._count.comments} Komentar</span>
                </Link>
              </div>
            </div>

            {/* Likes Section */}
            {feed.likes.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  Disukai oleh ({feed.likes.length})
                </h3>
                <div className="space-y-3">
                  {feed.likes.map((like) => (
                    <div key={like.id} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        {like.user.image ? (
                          <Image
                            src={like.user.image}
                            alt={like.user.name}
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                        ) : (
                          <User className="w-4 h-4 text-gray-600" />
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {like.user.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Update Form */}
          <div className="space-y-6">
            <UpdateFeedForm 
              feed={feed}
              userProjects={userProjects}
            />
          </div>
        </div>
      </div>
    </div>
  );
}