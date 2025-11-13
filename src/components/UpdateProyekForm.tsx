"use client";

import { useState, useEffect } from "react";
import { Leaf, MapPin, Trash2, ImageIcon, Loader2 } from "lucide-react";
import FileDropzone from "./FileDropZone";
import { useRouter } from "next/navigation";

interface ProyekData {
  id: string;
  namaProyek: string;
  deskripsi: string;
  lokasi: string;
  image: string;
}

interface TambahProyekFormProps {
  proyekData: ProyekData;
  onSuccess?: () => void;
}

export default function UpdateProyekForm({
  proyekData,
  onSuccess,
}: TambahProyekFormProps) {
  const router = useRouter();
  
  const [dataForm, setDataForm] = useState<ProyekData>({
    id: proyekData.id,
    namaProyek: proyekData.namaProyek || "",
    deskripsi: proyekData.deskripsi || "",
    lokasi: proyekData.lokasi || "",
    image: proyekData.image || "",
  });

  const [previewImage, setPreviewImage] = useState<string | null>(proyekData.image || null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Update form data when proyekData prop changes
  useEffect(() => {
    setDataForm({
      id: proyekData.id,
      namaProyek: proyekData.namaProyek || "",
      deskripsi: proyekData.deskripsi || "",
      lokasi: proyekData.lokasi || "",
      image: proyekData.image || "",
    });
    setPreviewImage(proyekData.image || null);
  }, [proyekData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setDataForm((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileDrop = (files: FileList) => {
    const selectedFile = files[0];

    if (!selectedFile) return;

    // Validasi tipe file
    if (!selectedFile.type.startsWith("image/")) {
      setError("Hanya file gambar yang diizinkan untuk pratinjau.");
      return;
    }

    // Validasi ukuran file (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("Ukuran file maksimal 5MB.");
      return;
    }

    // Membersihkan URL objek sebelumnya jika ada
    if (previewImage && previewImage.startsWith('blob:')) {
      URL.revokeObjectURL(previewImage);
    }

    setPendingFile(selectedFile);
    setPreviewImage(URL.createObjectURL(selectedFile));
    setError(null);
    setSuccess(null);
  };

  const handleRemoveImage = () => {
    if (previewImage && previewImage.startsWith('blob:')) {
      URL.revokeObjectURL(previewImage);
    }
    setPendingFile(null);
    setPreviewImage(null);
    setDataForm((prev) => ({ ...prev, image: "" }));
    setError(null);
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

    // Validasi form dasar
    if (!dataForm.namaProyek.trim()) {
      setError("Nama proyek wajib diisi.");
      setIsLoading(false);
      return;
    }

    try {
      let finalImageUrl = dataForm.image;

      // Handle upload gambar baru jika ada
      if (pendingFile) {
        finalImageUrl = await uploadImage(pendingFile);
        
        // Clean up preview URL setelah upload sukses
        if (previewImage && previewImage.startsWith('blob:')) {
          URL.revokeObjectURL(previewImage);
        }
      }

      // Siapkan data untuk dikirim
      const submissionData: ProyekData = {
        ...dataForm,
        image: finalImageUrl,
      };

      // Submit data proyek
      const response = await fetch(`/api/proyek/${proyekData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal memperbarui proyek.");
      }

      // Update state dengan data terbaru
      setDataForm(submissionData);
      setPreviewImage(finalImageUrl);
      setPendingFile(null);
      setSuccess("Proyek berhasil diperbarui!");
      
      // Redirect atau panggil callback sukses
      setTimeout(() => {
        if (onSuccess) {
          try {
            onSuccess();
          } catch (e) {
            console.error("onSuccess callback error:", e);
          }
        }
        // always refresh UI after successful update
        router.refresh();
      }, 1500);

    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat memperbarui proyek.";
      console.error("Error updating project:", errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-green-50 min-h-screen py-8">
      <div className="max-w-2xl mx-auto p-6 bg-white/90 backdrop-blur-lg shadow-xl rounded-2xl font-[Inter] border border-gray-100">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Edit Proyek</h1>
          <p className="text-gray-600 mt-2">Perbarui informasi proyek Anda</p>
        </div>

        {/* Notifikasi */}
        {error && (
          <div
            className="p-3 mb-6 text-sm rounded-lg border text-red-700 bg-red-50 border-red-200"
            role="alert"
          >
            {error}
          </div>
        )}

        {success && (
          <div
            className="p-3 mb-6 text-sm rounded-lg border text-green-700 bg-green-50 border-green-200"
            role="alert"
          >
            {success}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Nama Proyek */}
          <div>
            <label
              htmlFor="namaProyek"
              className="block text-sm font-semibold text-gray-800 mb-2"
            >
              Nama Proyek<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Leaf
                className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500"
                size={18}
              />
              <input
                type="text"
                name="namaProyek"
                id="namaProyek"
                required
                value={dataForm.namaProyek}
                onChange={handleInputChange}
                placeholder="Masukkan nama proyek"
                className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 bg-white text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Deskripsi */}
          <div>
            <label
              htmlFor="deskripsi"
              className="block text-sm font-semibold text-gray-800 mb-2"
            >
              Deskripsi Proyek
            </label>
            <textarea
              name="deskripsi"
              id="deskripsi"
              value={dataForm.deskripsi}
              onChange={handleInputChange}
              placeholder="Masukkan deskripsi proyek"
              rows={4}
              className="w-full px-3 py-3 rounded-xl border border-gray-300 bg-white text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all resize-none"
              disabled={isLoading}
            />
          </div>

          {/* Lokasi */}
          <div>
            <label
              htmlFor="lokasi"
              className="block text-sm font-semibold text-gray-800 mb-2"
            >
              Lokasi
            </label>
            <div className="relative">
              <MapPin
                className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500"
                size={18}
              />
              <input
                type="text"
                name="lokasi"
                id="lokasi"
                value={dataForm.lokasi}
                onChange={handleInputChange}
                placeholder="Masukkan lokasi proyek Anda"
                className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 bg-white text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Foto Proyek */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Foto Proyek
            </label>
            <FileDropzone
              onFilesDrop={handleFileDrop}
              accept="image/*"
              multiple={false}
              id="proyek-image-dropzone"
              disabled={isLoading}
            />

            {/* Preview Image */}
            <div className="mt-4">
              <label className="block text-sm text-gray-600 mb-2">
                Pratinjau Gambar:
              </label>
              <div className="relative w-full h-64 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 bg-gray-50">
                {previewImage ? (
                  <div className="relative w-full h-full">
                    <img
                      src={previewImage}
                      alt="Preview proyek"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-3 right-3 bg-white/90 hover:bg-red-500 rounded-full p-2 shadow-lg border border-gray-200 hover:border-red-600 transition-all group"
                      aria-label="Hapus gambar"
                      disabled={isLoading}
                    >
                      <Trash2
                        className="text-red-500 group-hover:text-white"
                        size={16}
                      />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <ImageIcon size={36} />
                    <span className="text-sm mt-2">Tidak ada gambar</span>
                    <span className="text-xs text-gray-500 mt-1">
                      Upload gambar untuk pratinjau
                    </span>
                  </div>
                )}
              </div>
              
              {/* Info gambar yang sedang diproses */}
              {pendingFile && (
                <div className="mt-2 text-sm text-green-600">
                  Gambar baru siap diupload: {pendingFile.name}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 bg-green-600 text-white py-3 px-4 rounded-xl font-semibold text-lg hover:bg-green-700 active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-green-400 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-md"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Menyimpan Perubahan...
                </>
              ) : (
                "Perbarui Proyek"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}