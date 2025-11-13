// components/TambahProdukForm.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Loader2,
  Trash2,
  ImageIcon,
  DollarSign,
  Package,
  Sprout,
} from "lucide-react";
import FileDropzone from "./FileDropZone";

interface ProyekTani {
  id: string;
  namaProyek: string;
}

interface TambahProdukFormProps {
  proyekId?: string;
  onSuccess: () => void;
}

export default function TambahProdukForm({
  onSuccess,
  proyekId,
}: TambahProdukFormProps) {
  const [produkData, setProdukData] = useState({
    namaProduk: "",
    deskripsi: "",
    harga: "",
    stok: "",
    proyekTaniId: proyekId || "",
  });

  const isFixedProyek = Boolean(proyekId); // kalau proyekId dikasih, artinya fix

  const [proyekTaniList, setProyekTaniList] = useState<ProyekTani[]>([]);
  const [isLoadingProyek, setIsLoadingProyek] = useState(true);

  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load proyek tani user
  useEffect(() => {
    const loadProyekTani = async () => {
      try {
        const response = await fetch("/api/proyek");
        const result = await response.json();

        if (response.ok) {
          setProyekTaniList(result.proyekTani || []);
        } else {
          setError(result.error || "Gagal memuat daftar proyek");
        }
      } catch (err) {
        console.error("Error loading proyek:", err);
        setError("Terjadi kesalahan saat memuat daftar proyek");
      } finally {
        setIsLoadingProyek(false);
      }
    };

    loadProyekTani();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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
    const oversizedFiles = imageFiles.filter(
      (file) => file.size > 5 * 1024 * 1024
    );
    if (oversizedFiles.length > 0) {
      setError("Ukuran file maksimal 5MB per gambar.");
      return;
    }

    // Generate preview URLs
    const newPreviews = imageFiles.map((file) => URL.createObjectURL(file));
    setPendingFiles((prev) => [...prev, ...imageFiles]);
    setPreviewImages((prev) => [...prev, ...newPreviews]);
    setError(null);
  };

  const handleRemoveImage = (index: number) => {
    // Clean up URL object
    if (previewImages[index] && previewImages[index].startsWith("blob:")) {
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
      const errorData = await response
        .json()
        .catch(() => ({ error: "Gagal mengunggah gambar." }));
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
    setIsLoading(true);

    // Validasi form
    if (!produkData.namaProduk.trim()) {
      setError("Nama produk wajib diisi.");
      setIsLoading(false);
      return;
    }

    if (!produkData.proyekTaniId) {
      setError("Pilih proyek tani terlebih dahulu.");
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

    if (pendingFiles.length === 0) {
      setError("Minimal satu gambar produk wajib diupload.");
      setIsLoading(false);
      return;
    }

    try {
      // Upload semua gambar paralel
      const gambarProduk = await Promise.all(
        pendingFiles.map((file) => uploadImage(file))
      );

      // Siapkan payload
      const payload = {
        namaProduk: produkData.namaProduk,
        deskripsi: produkData.deskripsi,
        harga: Number(produkData.harga),
        stok: Number(produkData.stok),
        gambarProduk,
        proyekTaniId: produkData.proyekTaniId,
      };

      // Submit data produk
      const response = await fetch("/api/produk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal menambahkan produk.");
      }

      // Reset form
      setProdukData({
        namaProduk: "",
        deskripsi: "",
        harga: "",
        stok: "",
        proyekTaniId: "",
      });

      // Clean up preview URLs
      previewImages.forEach((preview) => {
        if (preview.startsWith("blob:")) {
          URL.revokeObjectURL(preview);
        }
      });
      setPendingFiles([]);
      setPreviewImages([]);

      setError("✅ Produk berhasil ditambahkan!");
      setTimeout(() => {
        onSuccess();
      }, 1000);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat menambahkan produk.";
      console.error("Error adding product:", errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 font-[Inter] p-1">
      {error && (
        <div
          className={`p-3 text-sm rounded-lg border ${
            error.startsWith("✅")
              ? "text-green-700 bg-green-50 border-green-200"
              : "text-red-700 bg-red-50 border-red-200"
          }`}
        >
          {error}
        </div>
      )}

      {/* Select Proyek Tani */}
      {!isFixedProyek && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Pilih Proyek Tani <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Sprout
              className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500"
              size={18}
            />
            <select
              name="proyekTaniId"
              value={produkData.proyekTaniId}
              onChange={handleInputChange}
              required
              disabled={isLoadingProyek || isLoading}
              className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 bg-white text-gray-800 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all appearance-none"
            >
              <option value="">Pilih Proyek Tani</option>
              {proyekTaniList.map((proyek) => (
                <option key={proyek.id} value={proyek.id}>
                  {proyek.namaProyek}
                </option>
              ))}
            </select>
            {isLoadingProyek && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Nama Produk */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Nama Produk <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Package
            className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500"
            size={18}
          />
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
          rows={3}
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
            <DollarSign
              className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500"
              size={18}
            />
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
            <Package
              className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500"
              size={18}
            />
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
            (Bisa upload multiple gambar)
          </span>
        </label>
        <FileDropzone
          onFilesDrop={handleFileDrop}
          accept="image/*"
          multiple={true}
          id="produk-image-dropzone"
          disabled={isLoading || !produkData.proyekTaniId}
        />

        {/* Preview Images */}
        <div className="mt-4">
          {previewImages.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {previewImages.map((src, index) => (
                <div
                  key={index}
                  className="relative group rounded-xl overflow-hidden border border-green-200 shadow-sm"
                >
                  <img
                    src={src}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 bg-white/90 hover:bg-red-500 border border-gray-300 hover:border-red-600 p-1.5 rounded-full shadow-md transition-all"
                    disabled={isLoading}
                  >
                    <Trash2 className="w-4 h-4 text-red-500 hover:text-white" />
                  </button>
                  <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-500">
              <ImageIcon size={36} className="text-gray-400 mb-3" />
              <div className="font-medium text-gray-700">
                {produkData.proyekTaniId
                  ? "Belum ada gambar produk"
                  : "Pilih proyek tani terlebih dahulu"}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {produkData.proyekTaniId
                  ? "Upload minimal satu gambar produk"
                  : "Pilih proyek tani untuk mengupload gambar"}
              </div>
            </div>
          )}

          {pendingFiles.length > 0 && (
            <div className="mt-2 text-sm text-green-600">
              {pendingFiles.length} gambar siap diupload
            </div>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={
          isLoading || !produkData.proyekTaniId || proyekTaniList.length === 0
        }
        className="w-full flex justify-center items-center gap-2 bg-green-600 text-white py-3 px-4 rounded-xl font-semibold text-lg hover:bg-green-700 active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-green-400 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-md"
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            Menambahkan Produk...
          </>
        ) : (
          "Tambah Produk"
        )}
      </button>
    </form>
  );
}
