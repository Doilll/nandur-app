import Image from 'next/image';


export default function ProductCard({ produk }: { produk: any }) {
  const mainImage = produk.gambarProduk?.[0] || '/placeholder-product.jpg';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 group">
      <div className="aspect-square bg-gray-100 relative overflow-hidden">
        <Image
          src={mainImage}
          alt={produk.namaProduk}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {produk.stok === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              Habis
            </span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-700 transition-colors">
          {produk.namaProduk}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {produk.deskripsi}
        </p>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-green-700">
              Rp {produk.harga.toLocaleString('id-ID')}
            </p>
            <p className="text-sm text-gray-500">
              Stok: {produk.stok} kg
            </p>
          </div>
          
          <button 
            disabled={produk.stok === 0}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            {produk.stok === 0 ? 'Habis' : 'Beli'}
          </button>
        </div>
      </div>
    </div>
  );
}