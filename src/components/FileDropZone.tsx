"use client";

import { useCallback, useRef } from "react";

interface FileDropzoneProps {
  onFilesDrop: (files: FileList) => void;
  accept: string;
  multiple: boolean;
  id: string;
  disabled?: boolean; 
}

export default function FileDropzone({
  onFilesDrop,
  accept,
  multiple,
  id,
  disabled = false,
}: FileDropzoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      if (disabled) return; // ⛔ stop kalau lagi loading
      e.preventDefault();
      e.stopPropagation();
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        onFilesDrop(e.dataTransfer.files);
      }
    },
    [onFilesDrop, disabled]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      if (disabled) return;
      e.preventDefault();
      e.stopPropagation();
    },
    [disabled]
  );

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    if (e.target.files && e.target.files.length > 0) {
      onFilesDrop(e.target.files);
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
        disabled
          ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
          : "border-gray-300 hover:border-green-500 cursor-pointer text-gray-600"
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={handleClick}
      role="button"
      aria-labelledby={id}
    >
      <input
        ref={fileInputRef}
        type="file"
        id={id}
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={handleFileChange}
        className="hidden"
      />
      <p className="text-sm">
        {disabled
          ? "Tidak bisa upload foto saat ini"
          : "Tarik & lepas foto profil di sini, atau klik untuk memilih file."}
      </p>
    </div>
  );
}
