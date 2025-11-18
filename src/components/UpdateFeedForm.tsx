"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, ImageIcon, Loader2, FileText, MapPin } from "lucide-react";
import FileDropzone from "@/components/FileDropZone";

interface Project {
  id: string;
  namaProyek: string;
}

interface Feed {
  id: string;
  content: string;
  imageFeed: string[];
  projectId: string | null;
  project?: {
    id: string;
    namaProyek: string;
  } | null;
}

interface UpdateFeedFormProps {
  feed: Feed;
  userProjects: Project[];
}

export default function UpdateFeedForm({ feed, userProjects }: UpdateFeedFormProps) {
  const router = useRouter();
  const [feedData, setFeedData] = useState({
    content: feed.content,
    projectId: feed.projectId || "",
  });

  const [existingImages, setExistingImages] = useState<string[]>(feed.imageFeed || []);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFeedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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
    if (previewImages[index]) {
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

    const result = await response.json();

    if (!response.ok || !result.url) {
      throw new Error(result.error || "Gagal mengunggah gambar.");
    }

    return result.url;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    // Validasi form
    if (!feedData.content.trim()) {
      setError("Konten update wajib diisi.");
      setIsLoading(false);
      return;
    }

    try {
      let finalImageFeed = [...existingImages];

      // Upload gambar baru jika ada
      if (pendingFiles.length > 0) {
        const newImageUrls = await Promise.all(
          pendingFiles.map((file) => uploadImage(file))
        );
        finalImageFeed = [...finalImageFeed, ...newImageUrls];
      }

      // Siapkan payload
      const payload = {
        content: feedData.content,
        imageFeed: finalImageFeed,
        projectId: feedData.projectId || null,
      };

      // Update data feed
      const response = await fetch(`/api/feed/${feed.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal mengupdate feed.");
      }

      // Clean up preview URLs
      previewImages.forEach(preview => {
        URL.revokeObjectURL(preview);
      });
      setPendingFiles([]);
      setPreviewImages([]);
      
      setSuccess("✅ Feed berhasil diupdate!");
      
      // Refresh page after success
      setTimeout(() => {
        router.refresh();
      }, 1000);

    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat mengupdate feed.";
      console.error("Error updating feed:", errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Edit Update</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
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

        {/* Konten Update */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Konten Update <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 text-green-500" size={18} />
            <textarea
              name="content"
              value={feedData.content}
              onChange={handleInputChange}
              required
              rows={6}
              placeholder="Bagikan perkembangan proyek, aktivitas bertani, atau tips bercocok tanam..."
              className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 bg-white text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all resize-none"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Pilih Proyek (Opsional) */}
        {userProjects.length > 0 && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tautkan ke Proyek (Opsional)
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500" size={18} />
              <select
                name="projectId"
                value={feedData.projectId}
                onChange={handleInputChange}
                className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 bg-white text-gray-800 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                disabled={isLoading}
              >
                <option value="">Pilih Proyek</option>
                {userProjects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.namaProyek}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Upload Gambar */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Gambar Update
          </label>

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-2">
                Gambar Saat Ini:
              </label>
              <div className="grid grid-cols-2 gap-3">
                {existingImages.map((src, index) => (
                  <div
                    key={`existing-${index}`}
                    className="relative group rounded-xl overflow-hidden border border-blue-200 shadow-sm"
                  >
                    <img
                      src={src}
                      alt={`Existing ${index + 1}`}
                      className="w-full h-24 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(index)}
                      className="absolute top-1 right-1 bg-white/90 hover:bg-red-500 border border-gray-300 hover:border-red-600 p-1 rounded-full shadow-md transition-all"
                      disabled={isLoading}
                    >
                      <Trash2 className="w-3 h-3 text-red-500 hover:text-white" />
                    </button>
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
            id="feed-image-dropzone"
            disabled={isLoading}
          />

          {/* Preview New Images */}
          {previewImages.length > 0 && (
            <div className="mt-4">
              <label className="block text-sm text-gray-600 mb-2">
                Gambar Baru:
              </label>
              <div className="grid grid-cols-2 gap-3">
                {previewImages.map((src, index) => (
                  <div
                    key={`new-${index}`}
                    className="relative group rounded-xl overflow-hidden border border-green-200 shadow-sm"
                  >
                    <img
                      src={src}
                      alt={`New ${index + 1}`}
                      className="w-full h-24 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveNewImage(index)}
                      className="absolute top-1 right-1 bg-white/90 hover:bg-red-500 border border-gray-300 hover:border-red-600 p-1 rounded-full shadow-md transition-all"
                      disabled={isLoading}
                    >
                      <Trash2 className="w-3 h-3 text-red-500 hover:text-white" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {existingImages.length === 0 && previewImages.length === 0 && (
            <div className="mt-4 flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 text-center text-sm text-gray-500">
              <ImageIcon size={24} className="text-gray-400 mb-2" />
              <div className="font-medium text-gray-700">
                Belum ada gambar
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center gap-2 bg-green-600 text-white py-3 px-4 rounded-xl font-semibold text-lg hover:bg-green-700 active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-green-400 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-md"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Mengupdate...
            </>
          ) : (
            "Update Postingan"
          )}
        </button>
      </form>
    </div>
  );
}