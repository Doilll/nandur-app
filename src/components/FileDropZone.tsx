"use client";

import { useCallback, useRef } from "react";

interface FileDropzoneProps {
  onFilesDrop: (files: FileList) => void;
  accept: string;
  multiple: boolean;
  id: string;
}

export default function FileDropzone({
  onFilesDrop,
  accept,
  multiple,
  id,
}: FileDropzoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        onFilesDrop(e.dataTransfer.files);
      }
    },
    [onFilesDrop]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesDrop(e.target.files);
    }
  };

  return (
    <div
      className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-green-500 transition-colors"
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
        onChange={handleFileChange}
        className="hidden"
      />
      <p className="text-gray-500 text-sm">
        Tarik & lepas foto profil di sini, atau klik untuk memilih file.
      </p>
    </div>
  );
}
