// src/app/produk/ProdukSearchClient.tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Filter, Package } from "lucide-react";
import ProductCardKatalog from "./ProductCardKatalog";

interface Petani {
  name: string;
  username: string | null;
  image: string | null;
  lokasi: string | null;
}

interface ProyekTani {
  id: string;
  namaProyek: string;
}

interface Produk {
  id: string;
  namaProduk: string;
  harga: number;
  unit: string;
  gambarProduk: string[];
  deskripsi: string;
  createdAt: any;
  status: "TERSEDIA" | "TERJUAL" | "BELUM_TERSEDIA";
  petani: Petani;
  proyekTani: ProyekTani | null;
}

interface ProdukSearchClientProps {
  initialProduk: Produk[];
  initialTotal: number;
  initialPage: number;
  initialTotalPages: number;
  initialSearch: string;
  initialLokasi: string;
  initialHargaMin: string;
  initialHargaMax: string;
  availableLocations: string[];
}

export default function ProdukSearchClient({
  initialProduk,
  initialTotal,
  initialPage,
  initialTotalPages,
  initialSearch,
  initialLokasi,
  initialHargaMin,
  initialHargaMax,
  availableLocations,
}: ProdukSearchClientProps) {
  const router = useRouter();

  const [produk, setProduk] = useState<Produk[]>(initialProduk);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(initialSearch);
  const [lokasi, setLokasi] = useState(initialLokasi);
  const [hargaMin, setHargaMin] = useState(initialHargaMin);
  const [hargaMax, setHargaMax] = useState(initialHargaMax);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [total, setTotal] = useState(initialTotal);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = async (newPage: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();

      if (search) params.set("search", search);
      if (lokasi) params.set("lokasi", lokasi);
      if (hargaMin) params.set("harga_min", hargaMin);
      if (hargaMax) params.set("harga_max", hargaMax);
      if (newPage > 1) params.set("page", newPage.toString());

      // Update URL without page reload
      const queryString = params.toString();
      router.push(`/produk${queryString ? `?${queryString}` : ""}`, {
        scroll: false,
      });

      // Fetch new data
      const response = await fetch(`/api/produk?${queryString}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error("Gagal memuat data produk");
      }

      if (result.success) {
        setProduk(result.data);
        setPage(result.page);
        setTotalPages(result.totalPages);
        setTotal(result.total);
      }
    } catch (err) {
      console.error("Error fetching produk:", err);
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
    setPage(1);
    handleSearch(1);
  };

  const handleReset = () => {
    setSearch("");
    setLokasi("");
    setHargaMin("");
    setHargaMax("");
    setShowFilters(false);
    // Reset will trigger new search
  };

  const handleResetAndSearch = () => {
    handleReset();
    // Use setTimeout to ensure state is updated before search
    setTimeout(() => {
      setPage(1);
      handleSearch(1);
    }, 0);
  };

  const formatCurrency = (amount: string) => {
    if (!amount) return "";
    return new Intl.NumberFormat("id-ID").format(Number(amount));
  };

  const parseCurrency = (value: string) => {
    return value.replace(/\D/g, "");
  };

  const handleHargaMinChange = (value: string) => {
    const numericValue = parseCurrency(value);
    setHargaMin(numericValue);
  };

  const handleHargaMaxChange = (value: string) => {
    const numericValue = parseCurrency(value);
    setHargaMax(numericValue);
  };

  return (
    <>
      {/* Search and Stats Section */}
      <div className="mb-12">
        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-green-200 p-6">
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Cari produk berdasarkan nama atau deskripsi..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-4 rounded-xl font-semibold transition-colors flex items-center gap-2"
                >
                  <Filter className="w-5 h-5" />
                  Filter
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-4 rounded-xl font-semibold transition-colors flex items-center gap-2"
                >
                  <Search className="w-5 h-5" />
                  {loading ? "Mencari..." : "Cari"}
                </button>
                <button
                  type="button"
                  onClick={handleResetAndSearch}
                  disabled={loading}
                  className="border border-gray-300 hover:bg-gray-50 disabled:opacity-50 text-gray-700 px-6 py-4 rounded-xl font-semibold transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Lokasi Petani
                  </label>
                  <select
                    value={lokasi}
                    onChange={(e) => setLokasi(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  >
                    <option value="">Semua Lokasi</option>
                    {availableLocations.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Minimum Price Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Harga Minimum
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      Rp
                    </span>
                    <input
                      type="text"
                      placeholder="0"
                      value={formatCurrency(hargaMin)}
                      onChange={(e) => handleHargaMinChange(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    />
                  </div>
                </div>

                {/* Maximum Price Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Harga Maksimum
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      Rp
                    </span>
                    <input
                      type="text"
                      placeholder="9999999"
                      value={formatCurrency(hargaMax)}
                      onChange={(e) => handleHargaMaxChange(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Search Info */}
            {(search || lokasi || hargaMin || hargaMax) && (
              <div className="text-sm text-gray-600">
                Menampilkan hasil untuk:
                {search && <strong> "{search}"</strong>}
                {lokasi && (
                  <span>
                    {" "}
                    • Lokasi: <strong>{lokasi}</strong>
                  </span>
                )}
                {hargaMin && (
                  <span>
                    {" "}
                    • Harga min: <strong>Rp {formatCurrency(hargaMin)}</strong>
                  </span>
                )}
                {hargaMax && (
                  <span>
                    {" "}
                    • Harga max: <strong>Rp {formatCurrency(hargaMax)}</strong>
                  </span>
                )}
                <span className="ml-2 text-green-600">
                  ({total} produk ditemukan)
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
          <span className="ml-3 text-gray-600">Memuat data produk...</span>
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
          {/* Products Grid */}
          {produk.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {produk.map((p) => (
                <ProductCardKatalog key={p.id} produk={p} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Produk tidak ditemukan
              </h3>
              <p className="text-gray-600 mb-6">
                {search || lokasi || hargaMin || hargaMax
                  ? `Tidak ada produk yang sesuai dengan pencarian`
                  : "Belum ada produk yang tersedia"}
              </p>
              {(search || lokasi || hargaMin || hargaMax) && (
                <button
                  onClick={handleResetAndSearch}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                >
                  Lihat Semua Produk
                </button>
              )}
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
