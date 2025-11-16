// src/app/petani/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Search, Users, BookCheck, BadgeCheck} from "lucide-react";
import PetaniCard from "@/components/PetaniCard";

interface Petani {
  id: string;
  name: string;
  username: string;
  lokasi: string | null;
  image: string | null;
  bio: string | null;
  _count: {
    proyekTani: number;
    produks: number;
  };
}

interface ApiResponse {
  success: boolean;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: Petani[];
}

export default function KatalogPetaniPage() {
  const [petani, setPetani] = useState<Petani[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const fetchPetani = async (pageNum: number = 1, searchQuery: string = "") => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: "12",
        ...(searchQuery && { search: searchQuery }),
      });

      const response = await fetch(`/api/petani?${params}`);
      const result: ApiResponse = await response.json();

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

  // Initial load
  useEffect(() => {
    fetchPetani();
  }, []);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchPetani(1, search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchPetani(newPage, search);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchPetani(1, search);
  };

  const handleReset = () => {
    setSearch("");
    setPage(1);
    fetchPetani(1, "");
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-green-50 to-white">
      {/* Hero Section */}
      <section className="bg-linear-to-br from-green-600 via-emerald-600 to-teal-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Jelajahi Petani
            </h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto leading-relaxed">
              Temukan petani-petani terbaik dengan produk berkualitas langsung
              dari sumbernya. Dukung pertanian lokal dan dapatkan hasil panen
              terbaik.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Stats Section */}
        <div className="mb-12">
          {/* Search Bar */}
          <div className="bg-white rounded-2xl shadow-lg border border-green-200 p-6">
            <form onSubmit={handleSearch} className="space-y-4">
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
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-xl font-semibold transition-colors flex items-center gap-2"
                  >
                    <Search className="w-5 h-5" />
                    Cari
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-4 rounded-xl font-semibold transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {search && (
                <div className="text-sm text-gray-600">
                  Menampilkan hasil pencarian untuk: <strong>"{search}"</strong>
                  <span className="ml-2 text-green-600">
                    ({total} petani ditemukan)
                  </span>
                </div>
              )}
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
              onClick={() => fetchPetani(page, search)}
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
                    username={p.username}
                    lokasi={p.lokasi || "Lokasi tidak diketahui"}
                    image={p.image || "/default-avatar.png"}
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
                {search && (
                  <button
                    onClick={handleReset}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                  >
                    Lihat Semua Petani
                  </button>
                )}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
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
                      className={`w-10 h-10 rounded-lg font-semibold transition-colors ${
                        page === pageNum
                          ? "bg-green-600 text-white"
                          : "border border-gray-300 hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Selanjutnya
                </button>
              </div>
            )}
          </>
        )}

        {/* Info Section */}

<section className="mt-16 bg-white rounded-2xl shadow-lg border border-green-200 p-8">
  <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
    Mengapa Bergabung di Katalog Petani Tandur?
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

    {/* 1. Portofolio Digital */}
    <div className="text-center">
      <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <BookCheck className="w-8 h-8 text-green-600" />
      </div>
      <h3 className="font-semibold text-gray-900 mb-2">Portofolio Bertani</h3>
      <p className="text-gray-600 text-sm">
        Tampilkan perjalanan menanam, hasil panen, dan pengalamanmu agar lebih dipercaya pembeli dan mitra.
      </p>
    </div>

    {/* 2. Komunitas Petani */}
    <div className="text-center">
      <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Users className="w-8 h-8 text-green-600" />
      </div>
      <h3 className="font-semibold text-gray-900 mb-2">Terhubung dengan Petani Lain</h3>
      <p className="text-gray-600 text-sm">
        Bangun relasi, tukar ilmu, dan belajar dari praktik terbaik petani lain di seluruh Indonesia.
      </p>
    </div>

    {/* 3. Kredibilitas Produk */}
    <div className="text-center">
      <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <BadgeCheck className="w-8 h-8 text-green-600" />
      </div>
      <h3 className="font-semibold text-gray-900 mb-2">Produk Lebih Kredibel</h3>
      <p className="text-gray-600 text-sm">
        Setiap proses menanam yang kamu dokumentasikan menambah nilai jual dan meningkatkan kepercayaan pembeli.
      </p>
    </div>

  </div>
</section>

      </div>
    </div>
  );
}
