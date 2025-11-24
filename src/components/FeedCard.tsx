import { Rss, Heart, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import Link from 'next/link';

export default function FeedCard({ feed }: { feed: any }) {
  return (
    <Link href={`/feed/${feed.id}`}>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <Rss className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">
              {format(new Date(feed.createdAt), 'dd MMMM yyyy • HH:mm', { locale: id })}
            </p>
          </div>
        </div>

        <p className="text-gray-700 mb-4 whitespace-pre-line">{feed.content}</p>

        {feed.imageFeed && feed.imageFeed.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {feed.imageFeed.map((image: string, index: number) => (
              <div key={index} className="aspect-video bg-gray-100 rounded-lg overflow-hidden relative">
                <Image
                  src={image}
                  alt={`Feed image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* LIKE & COMMENT BAR */}
        <div className="flex items-center justify-start space-x-6 pt-3 border-t border-gray-200">
          <div className="flex items-center space-x-2 text-gray-600">
            <Heart className="h-5 w-5" />
            <span>{feed._count?.likes ?? 0}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <MessageCircle className="h-5 w-5" />
            <span>{feed._count?.comments ?? 0}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
