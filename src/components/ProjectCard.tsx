import { MapPin, Calendar } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default function ProjectCard({ proyek }: { proyek: any }) {
  const statusColors = {
    'PERSIAPAN': 'bg-yellow-100 text-yellow-800',
    'PENANAMAN': 'bg-blue-100 text-blue-800',
    'PEMELIHARAAN': 'bg-orange-100 text-orange-800',
    'PANEN': 'bg-green-100 text-green-800',
    'SELESAI': 'bg-gray-100 text-gray-800'
  };

  const completedPhases = proyek.faseProyek.filter((fase: any) => 
    fase.status === 'SELESAI'
  ).length;

  const totalPhases = proyek.faseProyek.length;
  const progress = totalPhases > 0 ? (completedPhases / totalPhases) * 100 : 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {proyek.namaProyek}
          </h3>
          <p className="text-gray-600 mb-4 line-clamp-2">
            {proyek.deskripsi}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[proyek.status as keyof typeof statusColors]}`}>
          {proyek.status}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <div className="flex items-center space-x-2 text-gray-600">
          <MapPin className="h-4 w-4" />
          <span className="text-sm">{proyek.lokasi}</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-600">
          <Calendar className="h-4 w-4" />
          <span className="text-sm">
            {format(new Date(proyek.createdAt), 'dd MMMM yyyy', { locale: id })}
          </span>
        </div>
      </div>

      {/* Progress Section */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress Proyek</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{completedPhases} dari {totalPhases} fase selesai</span>
        </div>
      </div>

      {/* Fase Proyek */}
      <div className="border-t border-gray-100 pt-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Fase Proyek</h4>
        <div className="space-y-2">
          {proyek.faseProyek
            .sort((a: any, b: any) => a.urutanFase - b.urutanFase)
            .map((fase: any) => (
              <div key={fase.id} className="flex items-center justify-between text-sm">
                <span className="text-gray-700">{fase.namaFase}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  fase.status === 'SELESAI' 
                    ? 'bg-green-100 text-green-800' 
                    : fase.status === 'BERJALAN'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {fase.status}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}