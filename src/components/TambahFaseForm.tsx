"use client";

import { useState } from "react";
import {
  Loader2,
  Trash2,
  ImageIcon,
  ListOrdered,
  FilePlus2,
} from "lucide-react";
import FileDropzone from "./FileDropZone";

export default function TambahFaseForm({
  proyekId,
  onSuccess,
}: {
  proyekId: string;
  onSuccess: () => void;
}) {
  const [faseData, setFaseData] = useState({
    namaFase: "",
    deskripsi: "",
    urutanFase: "",
  });

  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFaseData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilesDrop = (files: FileList) => {
    const newFiles = Array.from(files);
    const imageFiles = newFiles.filter((f) => f.type.startsWith("image/"));

    if (imageFiles.length === 0) {
      setError("Hanya file gambar yang diizinkan.");
      return;
    }

    // generate preview URLs
    const newPreviews = imageFiles.map((file) => URL.createObjectURL(file));
    setPendingFiles((prev) => [...prev, ...imageFiles]);
    setPreviewImages((prev) => [...prev, ...newPreviews]);
    setError(null);
  };

  const handleRemoveImage = (index: number) => {
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
    const res = await fetch("/api/upload-file", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (!res.ok || !data.url) throw new Error(data.error || "Upload gagal");
    return data.url;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Upload semua gambar paralel
      const uploadedUrls = await Promise.all(
        pendingFiles.map((file) => uploadImage(file))
      );

      const payload = {
        namaFase: faseData.namaFase,
        deskripsi: faseData.deskripsi,
        proyekTaniId: proyekId,
        gambarFase: uploadedUrls,
        urutanFase: Number(faseData.urutanFase),
      };

      const res = await fetch("/api/fase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menambah fase");

      setError("✅ Fase berhasil ditambahkan!");
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 font-[Inter]">
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

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Nama Fase <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <FilePlus2
            className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500"
            size={18}
          />
          <input
            type="text"
            name="namaFase"
            value={faseData.namaFase}
            onChange={handleInputChange}
            required
            placeholder="Contoh: Penanaman Bibit"
            className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Deskripsi Fase
        </label>
        <textarea
          name="deskripsi"
          value={faseData.deskripsi}
          onChange={handleInputChange}
          rows={3}
          placeholder="Jelaskan kegiatan dalam fase ini..."
          className="w-full px-3 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Urutan Fase
        </label>
        <div className="relative">
          <ListOrdered
            className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500"
            size={18}
          />
          <input
            type="number"
            name="urutanFase"
            value={faseData.urutanFase}
            onChange={handleInputChange}
            placeholder="1"
            min="1"
            className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-800 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Gambar Fase (bisa lebih dari 1)
        </label>
        <FileDropzone
          onFilesDrop={handleFilesDrop}
          accept="image/*"
          multiple={true}
          id="fase-image-dropzone"
          disabled={isLoading}
        />

        {previewImages.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
            {previewImages.map((src, i) => (
              <div
                key={i}
                className="relative group rounded-xl overflow-hidden border border-green-200 shadow-sm"
              >
                <img
                  src={src}
                  alt={`Preview ${i}`}
                  className="w-full h-32 object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(i)}
                  className="absolute top-2 right-2 bg-white/90 hover:bg-red-500 border border-gray-300 hover:border-red-600 p-1.5 rounded-full shadow-md transition-all"
                >
                  <Trash2 className="w-4 h-4 text-red-500 hover:text-white" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4 flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-500">
            <ImageIcon size={36} className="text-gray-400 mb-3" />
            <div className="font-medium text-gray-700">
              Belum ada gambar untuk fase ini
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Seret gambar ke area di atas atau klik untuk memilih file
            </div>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center items-center gap-2 bg-green-600 text-white py-3 px-4 rounded-xl font-semibold text-lg hover:bg-green-700 active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-green-400 disabled:opacity-60 transition-all shadow-md"
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            Menyimpan...
          </>
        ) : (
          "Simpan Fase"
        )}
      </button>
    </form>
  );
}
