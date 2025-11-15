import Image from "next/image";
import { Clock, PlayCircle, CheckCircle2 } from "lucide-react";


export default function FaseTimelineCard({ fase, index, totalFases }: { 
  fase: any; 
  index: number; 
  totalFases: number;
}) {
  const getFaseStatusColor = (status: string) => {
    const colors = {
      'BELUM_DIMULAI': 'bg-gray-100 text-gray-600',
      'BERJALAN': 'bg-blue-100 text-blue-600',
      'SELESAI': 'bg-green-100 text-green-600'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-600';
  };

  const getFaseStatusIcon = (status: string) => {
    const icons = {
      'BELUM_DIMULAI': Clock,
      'BERJALAN': PlayCircle,
      'SELESAI': CheckCircle2
    };
    return icons[status as keyof typeof icons] || Clock;
  };

  const StatusIcon = getFaseStatusIcon(fase.status);

  return (
    <div className="flex group">
      {/* Timeline Line */}
      <div className="flex flex-col items-center mr-6">
        <div className={`w-3 h-3 rounded-full ${
          fase.status === 'SELESAI' ? 'bg-green-500' : 
          fase.status === 'BERJALAN' ? 'bg-blue-500' : 'bg-gray-300'
        }`}></div>
        {index < totalFases - 1 && (
          <div className={`w-0.5 h-full ${
            fase.status === 'SELESAI' ? 'bg-green-500' : 'bg-gray-200'
          }`}></div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pb-8 group-last:pb-0">
        <div className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 border border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-xl ${getFaseStatusColor(fase.status)}`}>
                <StatusIcon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{fase.namaFase}</h3>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getFaseStatusColor(fase.status)}`}>
              {fase.status.toLowerCase().replace('_', ' ')}
            </span>
          </div>

          <p className="text-gray-600 mb-4 leading-relaxed">
            {fase.deskripsi}
          </p>

          {fase.gambarFase && fase.gambarFase.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              {fase.gambarFase.slice(0, 2).map((image: string, imgIndex: number) => (
                <div key={imgIndex} className="aspect-video bg-gray-200 rounded-xl overflow-hidden">
                  <Image
                    src={image}
                    alt={`${fase.namaFase} ${imgIndex + 1}`}
                    width={200}
                    height={150}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}