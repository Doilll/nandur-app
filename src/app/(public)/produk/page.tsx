// src/app/produk/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Package, Leaf, Users, MapPin } from "lucide-react";
import ProductCardKatalog from "@/components/ProductCardKatalog";


interface Petani {
  name: string;
  username: string;
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
  createdAt: string;
  status: "TERSEDIA" | "TERJUAL" | "BELUM_TERSEDIA";
  petani: Petani;
  proyekTani: ProyekTani | null;
}

interface ApiResponse {
  success: boolean;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: Produk[];
}

export default function KatalogProdukPage() {
  const [produk, setProduk] = useState<Produk[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedPetani, setSelectedPetani] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const fetchProduk = async (
    pageNum: number = 1, 
    searchQuery: string = "", 
    petaniFilter: string = "", 
  ) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: "12",
        ...(searchQuery && { search: searchQuery }),
        ...(petaniFilter && { petani: petaniFilter }),
      });

      const response = await fetch(`/api/produk?${params}`);
      const result: ApiResponse = await response.json();

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

  // Initial load
  useEffect(() => {
    fetchProduk();
  }, []);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchProduk(1, search, selectedPetani);
    }, 500);

    return () => clearTimeout(timer);
  }, [search, selectedPetani]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchProduk(newPage, search, selectedPetani);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProduk(1, search, selectedPetani);
  };

  const handleReset = () => {
    setSearch("");
    setSelectedPetani("");
    setPage(1);
    fetchProduk(1, "", "");
  };

  const getUniquePetani = () => {
    const petaniSet = new Set();
    return produk
      .filter(p => {
        if (petaniSet.has(p.petani.username)) return false;
        petaniSet.add(p.petani.username);
        return true;
      })
      .map(p => p.petani);
  };


  return (
    <div className="min-h-screen bg-linear-to-b from-green-50 to-white">
      {/* Hero Section */}
      <section className="bg-linear-to-br from-green-600 via-emerald-600 to-teal-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Katalog Produk
            </h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto leading-relaxed">
              Temukan produk pertanian berkualitas langsung dari petani. 
              Dapatkan hasil panen segar dengan harga terbaik.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Stats Section */}
        <div className="mb-12">

          {/* Search and Filters */}
          <div className="bg-white rounded-2xl shadow-lg border border-green-200 p-6">
            <form onSubmit={handleSearch} className="space-y-4">
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

              {/* Filters */}
              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Filter Petani
                    </label>
                    <input
                      type="text"
                      placeholder="Username petani..."
                      value={selectedPetani}
                      onChange={(e) => setSelectedPetani(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    />
                  </div>
                </div>
              )}
              
              {/* Search Info */}
              {(search || selectedPetani) && (
                <div className="text-sm text-gray-600">
                  Menampilkan hasil untuk: 
                  {search && <strong> "{search}"</strong>}
                  {selectedPetani && <span> • Petani: <strong>{selectedPetani}</strong></span>}
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
              onClick={() => fetchProduk(page, search, selectedPetani)}
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
                  <ProductCardKatalog
                    key={p.id}
                    produk={p}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Produk tidak ditemukan
                </h3>
                <p className="text-gray-600 mb-6">
                  {search || selectedPetani
                    ? `Tidak ada produk yang sesuai dengan pencarian`
                    : "Belum ada produk yang tersedia"}
                </p>
                {(search || selectedPetani) && (
                  <button
                    onClick={handleReset}
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
            Mengapa Berbelanja Langsung dari Petani?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Segar & Berkualitas</h3>
              <p className="text-gray-600 text-sm">
                Produk langsung dari kebun dengan kualitas terbaik dan kesegaran terjamin
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Dukung Lokal</h3>
              <p className="text-gray-600 text-sm">
                Bantu menggerakkan ekonomi lokal dan mendukung petani Indonesia
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Transparan</h3>
              <p className="text-gray-600 text-sm">
                Lihat langsung proses bertani dan bangun hubungan dengan petani
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}