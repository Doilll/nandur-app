"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Trash2,
  ImageIcon,
  ListOrdered,
  FilePlus2,
  PlayCircle,
  CheckCircle2,
  Clock,
  AlertCircle
} from "lucide-react";
import FileDropzone from "./FileDropZone";
import { toast } from "sonner";


interface Fase {
  id: string;
  namaFase: string;
  deskripsi: string;
  proyekTaniId: string;
  gambarFase: string[];
  urutanFase: number;
  status: "BELUM_DIMULAI" | "BERJALAN" | "SELESAI";
}

interface EditFaseFormProps {
  fase: Fase;
}

export default function EditFaseForm({ fase }: EditFaseFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    namaFase: fase.namaFase,
    deskripsi: fase.deskripsi,
    urutanFase: fase.urutanFase.toString(),
  });

  const [existingImages, setExistingImages] = useState<string[]>(fase.gambarFase);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<Fase["status"]>(fase.status);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    // Cleanup preview URLs on unmount
    return () => {
      previewImages.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewImages]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilesDrop = (files: FileList) => {
    const newFiles = Array.from(files);
    const imageFiles = newFiles.filter((f) => f.type.startsWith("image/"));

    if (imageFiles.length === 0) {
      setError("Hanya file gambar yang diizinkan.");
      return;
    }

    // Generate preview URLs
    const newPreviews = imageFiles.map((file) => URL.createObjectURL(file));
    setPendingFiles((prev) => [...prev, ...imageFiles]);
    setPreviewImages((prev) => [...prev, ...newPreviews]);
    setError(null);
  };

  const handleRemoveExistingImage = (index: number) => {
    const updatedImages = [...existingImages];
    updatedImages.splice(index, 1);
    setExistingImages(updatedImages);
  };

  const handleRemoveNewImage = (index: number) => {
    const updatedPreviews = [...previewImages];
    const updatedFiles = [...pendingFiles];
    
    // Revoke the object URL
    URL.revokeObjectURL(updatedPreviews[index]);
    
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
    setSuccess(null);
    setIsLoading(true);

    try {
      let allImageUrls = [...existingImages];

      // Upload new images if any
      if (pendingFiles.length > 0) {
        const uploadedUrls = await Promise.all(
          pendingFiles.map((file) => uploadImage(file))
        );
        allImageUrls = [...allImageUrls, ...uploadedUrls];
      }

      const payload = {
        namaFase: formData.namaFase,
        deskripsi: formData.deskripsi,
        proyekTaniId: fase.proyekTaniId,
        gambarFase: allImageUrls,
        urutanFase: Number(formData.urutanFase),
      };

      const res = await fetch(`/api/fase/${fase.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal memperbarui fase");

      setSuccess("✅ Fase berhasil diperbarui!");
      toast.success("✅ Fase berhasil diperbarui!");
      
      // Clear pending files and previews after successful upload
      setPendingFiles([]);
      previewImages.forEach(url => URL.revokeObjectURL(url));
      setPreviewImages([]);
      
      // Refresh the page to show updated data
      setTimeout(() => {
        router.refresh();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: Fase["status"]) => {
    setError(null);
    setSuccess(null);
    setIsUpdatingStatus(true);

    try {
      const res = await fetch(`/api/fase/${fase.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal memperbarui status");

      setStatus(newStatus);
      setSuccess(`✅ Status berhasil diubah menjadi ${getStatusLabel(newStatus)}`);
      
      // Refresh the page to show updated status
      setTimeout(() => {
        router.refresh();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const getStatusLabel = (status: Fase["status"]) => {
    const labels = {
      "BELUM_DIMULAI": "Belum Dimulai",
      "BERJALAN": "Berjalan",
      "SELESAI": "Selesai"
    };
    return labels[status];
  };

  const getStatusIcon = (status: Fase["status"]) => {
    const icons = {
      "BELUM_DIMULAI": Clock,
      "BERJALAN": PlayCircle,
      "SELESAI": CheckCircle2
    };
    return icons[status];
  };

  const getStatusColor = (status: Fase["status"]) => {
    const colors = {
      "BELUM_DIMULAI": "bg-gray-100 text-gray-800 border-gray-200",
      "BERJALAN": "bg-blue-100 text-blue-800 border-blue-200",
      "SELESAI": "bg-green-100 text-green-800 border-green-200"
    };
    return colors[status];
  };

  const StatusIcon = getStatusIcon(status);

  return (
    <div className="space-y-6 font-[Inter]">
      {/* Status Management */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Status Fase</h2>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-full border ${getStatusColor(status)}`}>
              <StatusIcon className="h-4 w-4" />
              <span className="font-medium">{getStatusLabel(status)}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {(["BELUM_DIMULAI", "BERJALAN", "SELESAI"] as Fase["status"][]).map((statusOption) => {
            const Icon = getStatusIcon(statusOption);
            return (
              <button
                key={statusOption}
                type="button"
                onClick={() => handleStatusUpdate(statusOption)}
                disabled={isUpdatingStatus || status === statusOption}
                className={`flex items-center justify-center space-x-2 p-3 rounded-lg border-2 transition-all ${
                  status === statusOption
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-200 bg-white text-gray-700 hover:border-green-300 hover:bg-green-50"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{getStatusLabel(statusOption)}</span>
              </button>
            );
          })}
        </div>

        {isUpdatingStatus && (
          <div className="flex items-center justify-center space-x-2 mt-4 text-sm text-gray-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Memperbarui status...</span>
          </div>
        )}
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Edit Detail Fase</h2>

        {error && (
          <div className="p-3 text-sm rounded-lg border text-red-700 bg-red-50 border-red-200 mb-4 flex items-center space-x-2">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 text-sm rounded-lg border text-green-700 bg-green-50 border-green-200 mb-4 flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>{success}</span>
          </div>
        )}

        <div className="space-y-6">
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
                value={formData.namaFase}
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
              value={formData.deskripsi}
              onChange={handleInputChange}
              rows={4}
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
                value={formData.urutanFase}
                onChange={handleInputChange}
                placeholder="1"
                min="1"
                required
                className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-800 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
              />
            </div>
          </div>

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Gambar Saat Ini
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {existingImages.map((src, i) => (
                  <div
                    key={i}
                    className="relative group rounded-xl overflow-hidden border border-green-200 shadow-sm"
                  >
                    <img
                      src={src}
                      alt={`Existing image ${i + 1}`}
                      className="w-full h-32 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(i)}
                      className="absolute top-2 right-2 bg-white/90 hover:bg-red-500 border border-gray-300 hover:border-red-600 p-1.5 rounded-full shadow-md transition-all"
                    >
                      <Trash2 className="w-4 h-4 text-red-500 hover:text-white" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Images Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tambah Gambar Baru
            </label>
            <FileDropzone
              onFilesDrop={handleFilesDrop}
              accept="image/*"
              multiple={true}
              id="fase-image-dropzone"
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
                      alt={`Preview ${i + 1}`}
                      className="w-full h-32 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveNewImage(i)}
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
                  Belum ada gambar baru
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
                Menyimpan Perubahan...
              </>
            ) : (
              "Simpan Perubahan"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}