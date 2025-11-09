// Pastikan Anda mengimpor ikon dari library seperti 'lucide-react' atau lainnya
// Contoh props: icon, title, description
const FeatureCard = ({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    // Struktur Card Utama
    <div className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-green-100/70">
      
      {/* Container Ikon */}
      <div className="flex items-center justify-center h-16 w-16 mb-6 rounded-xl bg-green-100 text-green-600 shadow-inner">
        {icon}
      </div>
      
      {/* Judul */}
      <h3 className="text-2xl font-bold text-gray-900 mb-3">
        {title}
      </h3>
      
      {/* Deskripsi */}
      <p className="text-gray-600 leading-relaxed">
        {description}
      </p>
    </div>
  );
};

// Jangan lupa untuk melakukan export di file Anda
// export default FeatureCard;
export default FeatureCard;