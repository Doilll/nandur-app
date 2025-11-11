"use client";

import { useState } from "react";
import { Leaf, MapPin, Trash2, ImageIcon, Loader2 } from "lucide-react";
import FileDropzone from "./FileDropZone";

interface ProyekData {
 namaProyek: string;
  deskripsi: string;
  lokasi: string;
  image: string;
}

export default function TambahProyekForm({onSuccess}: {onSuccess: () => void}) {
  const [proyekData, setProyekData] = useState<ProyekData>({
    namaProyek: "",
    deskripsi: "",
    lokasi: "",
    image: "", // This will store the Vercel Blob URL
  });
  // Tipe untuk URL pratinjau, bisa string atau null
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  // Tipe untuk file yang menunggu diupload
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    // Pengetikan memastikan 'name' sesuai dengan key di ProfileData
    setProyekData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileDrop = (files: FileList) => {
    const selectedFile = files[0];

    if (!selectedFile.type.startsWith("image/")) {
      // Mengganti alert() dengan mekanisme error UI yang lebih baik
      setError("Hanya file gambar yang diizinkan untuk pratinjau.");
      return;
    }

    // Membersihkan URL objek sebelumnya jika ada untuk menghindari kebocoran memori
    if (previewImage) {
      URL.revokeObjectURL(previewImage);
    }

    setPendingFile(selectedFile);
    setPreviewImage(URL.createObjectURL(selectedFile));
    setError(null);
  };

  const handleRemoveImage = () => {
    if (previewImage) {
      URL.revokeObjectURL(previewImage);
    }
    setPendingFile(null);
    setPreviewImage(null);
    setProyekData((prev) => ({ ...prev, image: "" }));
  };

  // Function to handle the image upload to /api/upload-file
  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload-file", {
      method: "POST",
      body: formData,
    });

    const result = (await response.json()) as { url?: string; error?: string };

    if (!response.ok || !result.url) {
      throw new Error(result.error || "Gagal mengunggah gambar.");
    }

    // Return the Vercel Blob URL
    return result.url;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // 1. Prepare data with current text inputs
    let submissionData: ProyekData = { ...proyekData };
    let finalImageUrl: string = submissionData.image; // Start with existing image URL (if any)

    try {
      // 2. Handle Image Upload (if a pending file exists)
      if (pendingFile) {
        const imageUrl = await uploadImage(pendingFile);
        finalImageUrl = imageUrl;
      }

      // 3. Update the data payload with the final image URL
      submissionData = {
        ...submissionData,
        image: finalImageUrl,
      };

      // 4. Submit the complete profile data
      const response = await fetch("/api/proyek", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      const result = (await response.json()) as {
        message?: string;
        error?: string;
      };

      if (response.ok) {
        // Update state with new URL and clear pending file on successful submission
        setProyekData((prev) => ({ ...prev, image: finalImageUrl }));
        if (previewImage) {
          URL.revokeObjectURL(previewImage); // Clean up preview object URL
        }
        setPendingFile(null);
        setError("Profil berhasil diperbarui!"); // Menggunakan error state untuk notifikasi sukses
        // Redirect to dashboard after successful profile setup
        onSuccess();
      } else {
        throw new Error(result.error || "Gagal memperbarui profil.");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat memperbarui profil.";
      console.error("Error submitting profile data:", errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className=" bg-green-100">
    <div className="max-w-2xl mx-auto p-8 bg-white/90 backdrop-blur-lg shadow-2xl rounded-3xl font-[Inter] border border-gray-100">
      {/* Notifikasi Sukses/Error */}
      {error && (
        <div
          className={`p-3 mb-6 text-sm rounded-lg border ${
            error.startsWith("Proyek berhasil")
              ? "text-green-700 bg-green-50 border-green-200"
              : "text-red-700 bg-red-50 border-red-200"
          }`}
          role="alert"
        >
          {error}
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
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
              value={proyekData.namaProyek}
              onChange={handleInputChange}
              placeholder="Masukkan nama proyek"
              className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
            />
          </div>
        </div>

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
            value={proyekData.deskripsi}
            onChange={handleInputChange}
            placeholder="Masukkan deskripsi proyek"
            rows={3}
            className="w-full px-3 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all resize-none"
          ></textarea>
        </div>

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
              value={proyekData.lokasi}
              onChange={handleInputChange}
              placeholder="Masukkan lokasi proyek Anda"
              className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Foto Proyek
          </label>
          <FileDropzone
            onFilesDrop={handleFileDrop}
            accept="image/*"
            multiple={false}
            id="proyek-image-dropzone"
          />

            {/* Preview Image */}
            <div className="mt-6 relative w-full h-64 mx-auto rounded-xl overflow-hidden border-4 border-green-200 bg-gray-100 shadow-inner">
            {previewImage || proyekData.image ? (
              <div className="relative w-full h-full">
              <img
                src={previewImage || proyekData.image}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-3 right-3 bg-white/90 hover:bg-red-500 rounded-full p-1.5 shadow-lg border border-gray-200 hover:border-red-600 transition-all group"
                aria-label="Hapus gambar"
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
              <span className="text-xs mt-1">Tidak ada gambar</span>
              </div>
            )}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center gap-2 bg-green-600 text-white py-3 px-4 rounded-xl font-semibold text-lg hover:bg-green-700 active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-green-400 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-md"
          >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Menyimpan...
            </>
          ) : (
            "Simpan Proyek"
          )}
        </button>
      </form>
    </div>
    </div>
  );
}
