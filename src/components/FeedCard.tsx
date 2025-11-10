import { Rss } from 'lucide-react';
import Image from 'next/image';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';


export default function FeedCard({ feed }: { feed: any }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
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

      <div className="flex items-center space-x-4 text-sm text-gray-500 border-t border-gray-100 pt-4">
        <button className="flex items-center space-x-1 hover:text-green-600 transition-colors">
          <span>❤️</span>
          <span>Suka</span>
        </button>
        <button className="flex items-center space-x-1 hover:text-green-600 transition-colors">
          <span>💬</span>
          <span>Komentar</span>
        </button>
        <button className="flex items-center space-x-1 hover:text-green-600 transition-colors">
          <span>🔄</span>
          <span>Bagikan</span>
        </button>
      </div>
    </div>
  );
}