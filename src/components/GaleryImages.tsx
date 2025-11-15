// components/GaleryImages.tsx
"use client";
import { useState } from "react";
import { Leaf, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import Image from "next/image";

interface Produk {
  gambarProduk: string[];
  namaProduk: string;
}

export default function GaleryImages({ produk }: { produk: Produk }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === produk.gambarProduk.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? produk.gambarProduk.length - 1 : prev - 1
    );
  };

  const openZoom = () => {
    setIsZoomed(true);
  };

  const closeZoom = () => {
    setIsZoomed(false);
  };

  return (
    <>
      <div className="relative">
        <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden relative group">
          {produk.gambarProduk.length > 0 ? (
            <>
              <Image
                src={produk.gambarProduk[currentImageIndex]}
                alt={produk.namaProduk}
                fill
                className="object-cover cursor-zoom-in"
                onClick={openZoom}
                priority
              />
              
              {/* Zoom Button */}
              <button
                onClick={openZoom}
                className="absolute top-4 right-4 bg-white/90 rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ZoomIn className="w-5 h-5 text-gray-800" />
              </button>

              {/* Navigation Arrows */}
              {produk.gambarProduk.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-3 shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-800" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-3 shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-800" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              {produk.gambarProduk.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {produk.gambarProduk.length}
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-green-50">
              <Leaf className="w-16 h-16 text-green-400" />
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {produk.gambarProduk.length > 1 && (
          <div className="flex gap-3 mt-4 overflow-x-auto py-2 px-1">
            {produk.gambarProduk.map((foto, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                  currentImageIndex === index
                    ? "border-green-500 shadow-md"
                    : "border-transparent hover:border-gray-300"
                }`}
              >
                <Image
                  src={foto}
                  alt={`Thumbnail ${index + 1}`}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Zoom Modal */}
      {isZoomed && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeZoom}
        >
          <div className="relative max-w-4xl max-h-full">
            <Image
              src={produk.gambarProduk[currentImageIndex]}
              alt={produk.namaProduk}
              width={800}
              height={800}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            
            {/* Close Button */}
            <button
              onClick={closeZoom}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Navigation in Zoom */}
            {produk.gambarProduk.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}