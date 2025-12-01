"use client";

import { useState, useEffect } from "react";
import { User, Phone, MapPin, Trash2, ImageIcon, Loader2 } from "lucide-react";
import FileDropzone from "@/components/FileDropZone";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

interface ProfileData {
  username: string;
  bio: string;
  numberPhone: string;
  lokasi: string;
  image: string;
}

export default function App() {
  const [profileData, setProfileData] = useState<ProfileData>({
    username: "",
    bio: "",
    numberPhone: "",
    lokasi: "",
    image: "", // This will store the Vercel Blob URL
  });
  // Tipe untuk URL pratinjau, bisa string atau null
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  // Tipe untuk file yang menunggu diupload
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login");
    }
  }, [isPending, session, router]);

  if (isPending) {
    return null;
  }
  if (!session) {
    return null;
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let { name, value } = e.target;
    if (name === "username") {
      value = value
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, "") // hapus simbol aneh
        .replace(/-{2,}/g, "-") // ----- -> -
        .replace(/_{2,}/g, "_") // _____ -> _
        .replace(/^[-_]+/g, ""); // hapus _ atau - di AWAL saja
    }

    if (name === "numberPhone") {
      // hanya izinkan angka 0–9
      value = value.replace(/[^0-9]/g, "");
    }

    if (name === "bio") {
      value = value
        .replace(/<[^>]*>/g, "") // prevent HTML injection
        .trim()
        .slice(0, 250); // limit 250 chars
    }

    if (name === "lokasi") {
      value = value
        .replace(/[\u0000-\u001F\u007F]/g, "") // remove control chars
        .trim()
        .slice(0, 80);
    }

    setProfileData((prevData) => ({
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
    setProfileData((prev) => ({ ...prev, image: "" }));
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
    let submissionData: ProfileData = { ...profileData };
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
      const response = await fetch("/api/profile/setup", {
        method: "PUT",
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
        setProfileData((prev) => ({ ...prev, image: finalImageUrl }));
        if (previewImage) {
          URL.revokeObjectURL(previewImage); // Clean up preview object URL
        }
        setPendingFile(null);
        setError("Profil berhasil diperbarui!"); // Menggunakan error state untuk notifikasi sukses
        // Redirect to dashboard after successful profile setup
        await authClient.updateUser({
          image: finalImageUrl,
          username: submissionData.username,
        });
        router.push("/");
      } else {
        toast.error(result.error || "Gagal memperbarui profil.");
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
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mb-4">
            <Image
              src="/favicon.png"
              alt="Nandur Icon"
              width={32}
              height={32}
              className="rounded-2xl"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Silahkan lengkapi profil Anda
          </h1>
          <p className="text-gray-600"></p>
        </div>

        {/* Notifikasi Sukses/Error */}
        {error && (
          <div
            className={`p-3 mb-6 text-sm rounded-lg border ${
              error.startsWith("Profil berhasil")
                ? "text-green-700 bg-green-50 border-green-200"
                : "text-red-700 bg-red-50 border-red-200"
            }`}
            role="alert"
          >
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-semibold text-gray-800 mb-2"
            >
              Username<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500"
                size={18}
              />
              <input
                type="text"
                name="username"
                id="username"
                required
                value={profileData.username}
                onChange={handleInputChange}
                placeholder="Masukkan nama pengguna"
                className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label
              htmlFor="bio"
              className="block text-sm font-semibold text-gray-800 mb-2"
            >
              Bio
            </label>
            <textarea
              name="bio"
              id="bio"
              value={profileData.bio}
              onChange={handleInputChange}
              placeholder="Ceritakan tentang diri Anda"
              rows={3}
              className="w-full px-3 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all resize-none"
            ></textarea>
          </div>

          {/* Nomor Telepon */}
          <div>
            <label
              htmlFor="numberPhone"
              className="block text-sm font-semibold text-gray-800 mb-2"
            >
              Nomor Telepon
            </label>
            <div className="relative">
              <Phone
                className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500"
                size={18}
              />
              <input
                type="text"
                name="numberPhone"
                id="numberPhone"
                value={profileData.numberPhone}
                onChange={handleInputChange}
                placeholder="Masukkan nomor telepon"
                className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
              />
            </div>
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
                value={profileData.lokasi}
                onChange={handleInputChange}
                placeholder="Masukkan lokasi Anda"
                className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
              />
            </div>
          </div>

          {/* Foto Profil */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Foto Profil
            </label>
            <FileDropzone
              onFilesDrop={handleFileDrop}
              accept="image/*"
              multiple={false}
              id="profile-image-dropzone"
            />

            {/* Preview Image */}
            <div className="mt-6 relative w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-green-200 bg-gray-100 shadow-inner">
              {previewImage || profileData.image ? (
                <div className="relative w-full h-full">
                  <img
                    src={previewImage || profileData.image}
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
              "Simpan Profil"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
