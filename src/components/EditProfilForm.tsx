"use client";

import { useState } from "react";
import { User, Phone, MapPin, Trash2, ImageIcon, Loader2 } from "lucide-react";
import FileDropzone from "@/components/FileDropZone";

interface UserData {
  id: string;
  name: string;
  bio: string;
  image: string;
  lokasi: string | null;
  numberPhone: string;
}

interface EditProfilFormProps {
  user: UserData; // dari server component
}

export default function EditProfilForm({ user }: EditProfilFormProps) {
  const [profileData, setProfileData] = useState({
    name: user.name || "",
    bio: user.bio || "",
    numberPhone: user.numberPhone || "",
    lokasi: user.lokasi || "",
    image: user.image || "",
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [notif, setNotif] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileDrop = (files: FileList) => {
    const file = files[0];
    if (!file.type.startsWith("image/")) {
      setNotif("File harus berupa gambar!");
      return;
    }

    if (previewImage) URL.revokeObjectURL(previewImage);

    setPendingFile(file);
    setPreviewImage(URL.createObjectURL(file));
    setNotif(null);
  };

  const handleRemoveImage = () => {
    if (previewImage) URL.revokeObjectURL(previewImage);
    setPendingFile(null);
    setPreviewImage(null);
    setProfileData((prev) => ({ ...prev, image: "" }));
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload-file", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();

    if (!res.ok || !data.url) {
      throw new Error("Gagal upload gambar");
    }

    return data.url;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setNotif(null);

    let finalImage = profileData.image;

    try {
      if (pendingFile) {
        finalImage = await uploadImage(pendingFile);
      }

      const payload = {
        ...profileData,
        image: finalImage,
      };

      const res = await fetch("/api/profile/edit", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Gagal update profil");

      setProfileData((prev) => ({ ...prev, image: finalImage }));
      setNotif("Profil berhasil diperbarui!");
    } catch (err: any) {
      setNotif(err.message || "Terjadi kesalahan server");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-lg p-8 rounded-3xl border shadow-xl">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Edit Profil Anda
      </h1>

      {notif && (
        <div
          className={`p-3 mb-6 text-sm rounded-lg border ${
            notif.includes("berhasil")
              ? "text-green-700 bg-green-50 border-green-200"
              : "text-red-700 bg-red-50 border-red-200"
          }`}
        >
          {notif}
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* NAME */}
        <div>
          <label className="block text-sm font-semibold">Nama</label>
          <div className="relative">
            <User
              className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600"
              size={18}
            />
            <input
              type="text"
              name="name"
              value={profileData.name}
              onChange={handleInputChange}
              className="w-full pl-10 pr-3 py-3 rounded-xl border bg-gray-50"
              required
            />
          </div>
        </div>

        {/* BIO */}
        <div>
          <label className="block text-sm font-semibold">Bio</label>
          <textarea
            name="bio"
            value={profileData.bio}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-3 rounded-xl border bg-gray-50 resize-none"
          ></textarea>
        </div>

        {/* NUMBERPHONE */}
        <div>
          <label className="block text-sm font-semibold">Nomor Telepon</label>
          <div className="relative">
            <Phone
              className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600"
              size={18}
            />
            <input
              name="numberPhone"
              value={profileData.numberPhone}
              onChange={handleInputChange}
              className="w-full pl-10 pr-3 py-3 rounded-xl border bg-gray-50"
            />
          </div>
        </div>

        {/* LOKASI */}
        <div>
          <label className="block text-sm font-semibold">Lokasi</label>
          <div className="relative">
            <MapPin
              className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600"
              size={18}
            />
            <input
              name="lokasi"
              value={profileData.lokasi}
              onChange={handleInputChange}
              className="w-full pl-10 pr-3 py-3 rounded-xl border bg-gray-50"
            />
          </div>
        </div>

        {/* IMAGE DROPZONE */}
        <div>
          <label className="block text-sm font-semibold">Foto Profil</label>
          <FileDropzone
            onFilesDrop={handleFileDrop}
            accept="image/*"
            multiple={false}
            id="profile-image"
            disabled={isLoading}
          />

          <div className="mt-6 relative w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-green-200 bg-gray-100 shadow-inner">
            {previewImage || profileData.image ? (
              <div className="relative w-full h-full">
                <img
                  src={previewImage || profileData.image}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-white p-1 rounded-full border shadow"
                >
                  <Trash2 size={16} className="text-red-600" />
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

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center gap-2 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Menyimpan...
            </>
          ) : (
            "Simpan"
          )}
        </button>
      </form>
    </div>
  );
}
