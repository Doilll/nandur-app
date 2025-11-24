// src/app/petani/PetaniSearchClient.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Users } from "lucide-react";
import PetaniCard from "./PetaniCard";

interface Petani {
  id: string;
  name: string;
  username: string | null;
  lokasi: string | null;
  image: string | null;
  bio: string | null;
  _count: {
    proyekTani: number;
    produks: number;
  };
}

interface PetaniSearchClientProps {
  initialPetani: Petani[];
  initialTotal: number;
  initialPage: number;
  initialTotalPages: number;
  initialSearch: string;
}

export default function PetaniSearchClient({
  initialPetani,
  initialTotal,
  initialPage,
  initialTotalPages,
  initialSearch,
}: PetaniSearchClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [petani, setPetani] = useState<Petani[]>(initialPetani);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(initialSearch);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [total, setTotal] = useState(initialTotal);
  const [error, setError] = useState<string | null>(null);

  // Update state when initial props change (from server)
  useEffect(() => {
    setPetani(initialPetani);
    setTotal(initialTotal);
    setPage(initialPage);
    setTotalPages(initialTotalPages);
    setSearch(initialSearch);
  }, [
    initialPetani,
    initialTotal,
    initialPage,
    initialTotalPages,
    initialSearch,
  ]);

  // Handle search with debounce

  const handleSearch = async (newPage: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams(searchParams.toString());

      if (search) {
        params.set("search", search);
      } else {
        params.delete("search");
      }

      if (newPage > 1) {
        params.set("page", newPage.toString());
      } else {
        params.delete("page");
      }

      // Update URL without page reload
      router.push(`/petani?${params.toString()}`, { scroll: false });

      // Fetch new data
      const response = await fetch(`/api/petani?${params.toString()}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error("Gagal memuat data petani");
      }

      if (result.success) {
        setPetani(result.data);
        setPage(result.page);
        setTotalPages(result.totalPages);
        setTotal(result.total);
      }
    } catch (err) {
      console.error("Error fetching petani:", err);
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    handleSearch(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(1);
  };
  

  return (
    <>
      {/* Search and Stats Section */}
      <div className="mb-12">
        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-lg border border-green-200 p-6">
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Cari petani berdasarkan nama, username, atau lokasi..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-4 rounded-xl font-semibold transition-colors flex items-center gap-2"
                >
                  <Search className="w-5 h-5" />
                  {loading ? "Mencari..." : "Cari"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <span className="ml-3 text-gray-600">Memuat data petani...</span>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <div className="text-red-600 text-lg font-semibold mb-2">
            Gagal memuat data
          </div>
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => handleSearch(page)}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* Results */}
      {!loading && !error && (
        <>
          {/* Petani Grid */}
          {petani.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {petani.map((p) => (
                <PetaniCard
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  username={p.username || "Username tidak diketahui"}
                  lokasi={p.lokasi || "Lokasi tidak diketahui"}
                  image={p.image || "/chicken.png"}
                  totalProyek={p._count.proyekTani}
                  totalProduk={p._count.produks}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Petani tidak ditemukan
              </h3>
              <p className="text-gray-600 mb-6">
                {search
                  ? `Tidak ada petani yang sesuai dengan pencarian "${search}"`
                  : "Belum ada petani yang terdaftar"}
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1 || loading}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Sebelumnya
              </button>

              {/* Page Numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    disabled={loading}
                    className={`w-10 h-10 rounded-lg font-semibold transition-colors ${
                      page === pageNum
                        ? "bg-green-600 text-white"
                        : "border border-gray-300 hover:bg-gray-50 text-gray-700"
                    } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages || loading}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Selanjutnya
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}
