// components/PetaniTabs.tsx
"use client";

import { Sprout, Package, Rss } from "lucide-react";
import TabButton from "./TabButton";
import { usePathname } from "next/navigation";

export default function PetaniTabs({ username }: { username: string }) {
  const pathname = usePathname();

  // Fungsi untuk cek apakah sebuah URL tab adalah yang aktif
  const isActive = (url: string) => pathname === url;

  return (
    <div className="flex space-x-8 overflow-x-auto">
      <TabButton
        href={`/petani/${username}`}
        icon={<Sprout className="h-5 w-5" />}
        label="Proyek"
        count={undefined}
        isActive={isActive(`/petani/${username}`)}
      />

      <TabButton
        href={`/petani/${username}/produk`}
        icon={<Package className="h-5 w-5" />}
        label="Produk"
        count={undefined}
        isActive={isActive(`/petani/${username}/produk`)}
      />

      <TabButton
        href={`/petani/${username}/feed`}
        icon={<Rss className="h-5 w-5" />}
        label="Feed"
        count={undefined}
        isActive={isActive(`/petani/${username}/feed`)}
      />
    </div>
  );
}
