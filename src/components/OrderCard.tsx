// components/OrderCard.tsx
"use client";

import { Phone, Share2, Heart, MessageCircle } from "lucide-react";
import { useState } from "react";
import { StatusProduk } from "@prisma/client";


interface ProductInteractionProps {
  numberPhone: string | null;
  namaProduk: string;
  status: StatusProduk;
}

const OrderCard = ({
  numberPhone,
  namaProduk,
  status,
}: ProductInteractionProps) => {
  const [isSaved, setIsSaved] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: namaProduk,
      text: `Lihat produk ${namaProduk} di Nandur - Tempat Petani Kumpul`,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link produk telah disalin ke clipboard!");
      } catch (error) {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = window.location.href;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        alert("Link produk telah disalin ke clipboard!");
      }
    }
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    // TODO: Implement save to favorites functionality
  };

  const getWhatsAppMessage = () => {
    return `Halo! Saya tertarik dengan produk *${namaProduk}* yang Anda jual di Nandur. Bisa saya mendapatkan informasi lebih lanjut?`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-green-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Pesan Produk Ini
      </h2>

      <div className="space-y-4">
        {status === "TERSEDIA" ? (
          numberPhone ? (
            <>
              <a
                href={`https://wa.me/${numberPhone}?text=${encodeURIComponent(
                  getWhatsAppMessage()
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <MessageCircle className="w-6 h-6 mr-3" />
                Chat via WhatsApp
              </a>

              <a
                href={`tel:${numberPhone}`}
                className="w-full border border-green-600 text-green-600 hover:bg-green-50 py-4 px-6 rounded-xl font-semibold flex items-center justify-center transition-all duration-200"
              >
                <Phone className="w-6 h-6 mr-3" />
                Telepon Langsung
              </a>
            </>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
              <p className="text-yellow-800 font-medium">
                Kontak petani tidak tersedia
              </p>
              <p className="text-yellow-600 text-sm mt-1">
                Silakan cek kembali nanti atau lihat produk lainnya
              </p>
            </div>
          )
        ) : status === "TERJUAL" ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
            <p className="text-red-800 font-medium">Produk ini telah terjual</p>
            <p className="text-red-600 text-sm mt-1">
              Silakan lihat produk lainnya yang tersedia
            </p>
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
            <p className="text-blue-800 font-medium">
              Produk akan segera tersedia
            </p>
            <p className="text-blue-600 text-sm mt-1">
              Simpan produk ini untuk mendapatkan notifikasi ketika tersedia
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={handleSave}
            className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
              isSaved
                ? "bg-red-50 text-red-600 border border-red-200"
                : "border border-gray-300 hover:bg-gray-50 text-gray-700"
            }`}
          >
            <Heart className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
            {isSaved ? "Disimpan" : "Simpan"}
          </button>

          <button
            onClick={handleShare}
            className="flex-1 py-3 border border-gray-300 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-all text-gray-700"
          >
            <Share2 className="w-5 h-5" />
            Bagikan
          </button>
        </div>

        {/* Safety Tips */}
        <div className="bg-gray-50 rounded-xl p-4 mt-4">
          <h4 className="font-semibold text-gray-900 text-sm mb-2">
            Tips Aman Bertransaksi:
          </h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Selalu verifikasi produk sebelum membayar</li>
            <li>• Gunakan fitur chat WhatsApp untuk berkomunikasi</li>
            <li>• Simpan bukti transaksi dengan baik</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
