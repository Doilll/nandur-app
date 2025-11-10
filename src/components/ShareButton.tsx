"use client";

import { Share2 } from "lucide-react";
import { ReactNode } from "react";

interface ShareButtonProps {
  title?: string;
  text?: string;
  url?: string;
  label?: string;
  icon?: ReactNode;
  fallbackMessage?: string;
  className?: string;
}

export default function ShareButton({
  title = document.title,
  text = "",
  url = typeof window !== "undefined" ? window.location.href : "",
  label = "Bagikan",
  icon = <Share2 className="w-5 h-5" />,
  fallbackMessage = "Link telah disalin ke clipboard",
  className = "",
}: ShareButtonProps) {
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({ title, text, url })
        .catch((err) => console.error("Share failed:", err));
    } else {
      navigator.clipboard.writeText(url).then(() => {
        alert(fallbackMessage);
      });
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label={label}
      className={`flex items-center gap-1 p-2 text-gray-500 hover:text-green-600 rounded-full transition-colors ${className}`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
