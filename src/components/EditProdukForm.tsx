// components/EditProdukForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2, ImageIcon, DollarSign, Package } from "lucide-react";
import FileDropzone from "./FileDropZone";

interface Produk {
  id: string;
  namaProduk: string;
  deskripsi: string;
  harga: number;
  stok: number;
  gambarProduk: string[];
}

interface EditProdukFormProps {
  produkId: string;
  onSuccess?: () => void;
}

export default function EditProdukForm({ produkId, onSuccess }: EditProdukFormProps) {
  const router = useRouter();
  const [produkData, setProdukData] = useState({
    namaProduk: "",
    deskripsi: "",
    harga: "",
    stok: "",
  });

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load produk data
  useEffect(() => {
    const loadProdukData = async () => {
      try {
        const response = await fetch(`/api/produk/${produkId}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Gagal memuat data produk");
        }

        const produk: Produk = result.produk;
        setProdukData({
          namaProduk: produk.namaProduk,
          deskripsi: produk.deskripsi,
          harga: produk.harga.toString(),
          stok: produk.stok.toString(),
        });
        setExistingImages(produk.gambarProduk || []);
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Terjadi kesalahan saat memuat data produk";
        setError(errorMessage);
        console.error("Error loading product:", err);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadProdukData();
  }, [produkId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProdukData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileDrop = (files: FileList) => {
    const newFiles = Array.from(files);
    const imageFiles = newFiles.filter((f) => f.type.startsWith("image/"));

    if (imageFiles.length === 0) {
      setError("Hanya file gambar yang diizinkan.");
      return;
    }

    // Validasi ukuran file (max 5MB per file)
    const oversizedFiles = imageFiles.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setError("Ukuran file maksimal 5MB per gambar.");
      return;
    }

    // Generate preview URLs
    const newPreviews = imageFiles.map((file) => URL.createObjectURL(file));
    setPendingFiles((prev) => [...prev, ...imageFiles]);
    setPreviewImages((prev) => [...prev, ...newPreviews]);
    setError(null);
    setSuccess(null);
  };

  const handleRemoveExistingImage = (index: number) => {
    const updatedImages = [...existingImages];
    updatedImages.splice(index, 1);
    setExistingImages(updatedImages);
  };

  const handleRemoveNewImage = (index: number) => {
    // Clean up URL object
    if (previewImages[index] && previewImages[index].startsWith('blob:')) {
      URL.revokeObjectURL(previewImages[index]);
    }

    const updatedPreviews = [...previewImages];
    const updatedFiles = [...pendingFiles];
    updatedPreviews.splice(index, 1);
    updatedFiles.splice(index, 1);
    setPreviewImages(updatedPreviews);
    setPendingFiles(updatedFiles);
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload-file", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Gagal mengunggah gambar." }));
      throw new Error(errorData.error || "Gagal mengunggah gambar.");
    }

    const result = await response.json();
    
    if (!result.url) {
      throw new Error("URL gambar tidak diterima dari server.");
    }

    return result.url;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    // Validasi form
    if (!produkData.namaProduk.trim()) {
      setError("Nama produk wajib diisi.");
      setIsLoading(false);
      return;
    }

    if (!produkData.harga || Number(produkData.harga) <= 0) {
      setError("Harga harus lebih dari 0.");
      setIsLoading(false);
      return;
    }

    if (!produkData.stok || Number(produkData.stok) < 0) {
      setError("Stok tidak boleh negatif.");
      setIsLoading(false);
      return;
    }

    const allImages = [...existingImages];
    if (allImages.length === 0 && pendingFiles.length === 0) {
      setError("Minimal satu gambar produk wajib diupload.");
      setIsLoading(false);
      return;
    }

    try {
      let finalGambarProduk = [...existingImages];

      // Upload gambar baru jika ada
      if (pendingFiles.length > 0) {
        const newImageUrls = await Promise.all(
          pendingFiles.map((file) => uploadImage(file))
        );
        finalGambarProduk = [...finalGambarProduk, ...newImageUrls];
      }

      // Siapkan payload
      const payload = {
        namaProduk: produkData.namaProduk,
        deskripsi: produkData.deskripsi,
        harga: Number(produkData.harga),
        stok: Number(produkData.stok),
        gambarProduk: finalGambarProduk,
      };

      // Update data produk
      const response = await fetch(`/api/produk/${produkId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal mengupdate produk.");
      }

      // Clean up preview URLs
      previewImages.forEach(preview => {
        if (preview.startsWith('blob:')) {
          URL.revokeObjectURL(preview);
        }
      });

      setPendingFiles([]);
      setPreviewImages([]);
      
      setSuccess("✅ Produk berhasil diupdate!");
      
      // Redirect atau panggil callback sukses
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          router.push("/dashboard/produk");
          router.refresh();
        }
      }, 1500);

    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat mengupdate produk.";
      console.error("Error updating product:", errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
        <span className="ml-2 text-gray-600">Memuat data produk...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 font-[Inter] p-1">
      {/* Notifikasi */}
      {error && (
        <div className="p-3 text-sm rounded-lg border text-red-700 bg-red-50 border-red-200">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 text-sm rounded-lg border text-green-700 bg-green-50 border-green-200">
          {success}
        </div>
      )}

      {/* Nama Produk */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Nama Produk <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500" size={18} />
          <input
            type="text"
            name="namaProduk"
            value={produkData.namaProduk}
            onChange={handleInputChange}
            required
            placeholder="Contoh: Beras Organik Premium"
            className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 bg-white text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Deskripsi */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Deskripsi Produk
        </label>
        <textarea
          name="deskripsi"
          value={produkData.deskripsi}
          onChange={handleInputChange}
          rows={4}
          placeholder="Jelaskan detail produk, keunggulan, dan manfaatnya..."
          className="w-full px-3 py-3 rounded-xl border border-gray-300 bg-white text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
          disabled={isLoading}
        />
      </div>

      {/* Harga dan Stok */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Harga (Rp) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500" size={18} />
            <input
              type="number"
              name="harga"
              value={produkData.harga}
              onChange={handleInputChange}
              required
              min="1"
              placeholder="50000"
              className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 bg-white text-gray-800 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Stok <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500" size={18} />
            <input
              type="number"
              name="stok"
              value={produkData.stok}
              onChange={handleInputChange}
              required
              min="0"
              placeholder="100"
              className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 bg-white text-gray-800 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      {/* Gambar Produk */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Gambar Produk <span className="text-red-500">*</span>
          <span className="text-xs text-gray-500 font-normal ml-2">
            (Gambar yang sudah diupload dan gambar baru akan digabungkan)
          </span>
        </label>

        {/* Existing Images */}
        {existingImages.length > 0 && (
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-2">
              Gambar Saat Ini:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {existingImages.map((src, index) => (
                <div
                  key={`existing-${index}`}
                  className="relative group rounded-xl overflow-hidden border border-blue-200 shadow-sm"
                >
                  <img
                    src={src}
                    alt={`Existing ${index + 1}`}
                    className="w-full h-32 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingImage(index)}
                    className="absolute top-2 right-2 bg-white/90 hover:bg-red-500 border border-gray-300 hover:border-red-600 p-1.5 rounded-full shadow-md transition-all"
                    disabled={isLoading}
                  >
                    <Trash2 className="w-4 h-4 text-red-500 hover:text-white" />
                  </button>
                  <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* File Dropzone untuk gambar baru */}
        <FileDropzone
          onFilesDrop={handleFileDrop}
          accept="image/*"
          multiple={true}
          id="produk-image-dropzone"
          disabled={isLoading}
        />

        {/* Preview New Images */}
        {previewImages.length > 0 && (
          <div className="mt-4">
            <label className="block text-sm text-gray-600 mb-2">
              Gambar Baru:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {previewImages.map((src, index) => (
                <div
                  key={`new-${index}`}
                  className="relative group rounded-xl overflow-hidden border border-green-200 shadow-sm"
                >
                  <img
                    src={src}
                    alt={`New ${index + 1}`}
                    className="w-full h-32 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveNewImage(index)}
                    className="absolute top-2 right-2 bg-white/90 hover:bg-red-500 border border-gray-300 hover:border-red-600 p-1.5 rounded-full shadow-md transition-all"
                    disabled={isLoading}
                  >
                    <Trash2 className="w-4 h-4 text-red-500 hover:text-white" />
                  </button>
                  <div className="absolute bottom-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                    Baru {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {existingImages.length === 0 && previewImages.length === 0 && (
          <div className="mt-4 flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-500">
            <ImageIcon size={36} className="text-gray-400 mb-3" />
            <div className="font-medium text-gray-700">
              Belum ada gambar produk
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Upload minimal satu gambar produk
            </div>
          </div>
        )}

        {/* Info Jumlah Gambar */}
        {(pendingFiles.length > 0 || existingImages.length > 0) && (
          <div className="mt-2 text-sm text-green-600">
            Total gambar: {existingImages.length} existing + {pendingFiles.length} baru = {existingImages.length + pendingFiles.length}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isLoading}
          className="flex-1 py-3 px-4 rounded-xl font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-60 transition-all"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 flex justify-center items-center gap-2 bg-green-600 text-white py-3 px-4 rounded-xl font-semibold text-lg hover:bg-green-700 active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-green-400 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-md"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Mengupdate...
            </>
          ) : (
            "Update Produk"
          )}
        </button>
      </div>
    </form>
  );
}