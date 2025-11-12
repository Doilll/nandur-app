// src/app/dashboard/projects/[id]/page.tsx
"use client";

import { useState, useEffect, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Sprout,
  Edit3,
  Save,
  X,
  Clock,
  CheckCircle2,
  PlayCircle,
  AlertCircle,
  Leaf,
  BarChart3,
  Users,
  Package,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import FaseCard from "@/components/FaseCard";
import StatItem from "@/components/StatItem";
import ActionButton from "@/components/ActionButton";
import TimelineItem from "@/components/TimelineItem";
import { id as idLocale } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import TambahFaseForm from "@/components/TambahFaseForm";

interface ProyekTani {
  id: string;
  namaProyek: string;
  deskripsi: string;
  lokasi: string;
  status: "PERSIAPAN" | "PENANAMAN" | "PEMELIHARAAN" | "PANEN" | "SELESAI";
  petaniId: string;
  createdAt: string;
  updatedAt: string;
  petani: {
    id: string;
    name: string;
    username: string;
  };
  faseProyek: FaseProyek[];
}

interface FaseProyek {
  id: string;
  namaFase: string;
  deskripsi: string;
  urutanFase: number;
  status: "BELUM_DIMULAI" | "BERJALAN" | "SELESAI";
  gambarFase: string[];
  createdAt: string;
  updatedAt: string;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [proyek, setProyek] = useState<ProyekTani | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editStatus, setEditStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);

  const [isTransitioning, startTransition] = useTransition();

  useEffect(() => {
    fetchProyek();
  }, [id]);

  const fetchProyek = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/proyek/${id}`);

      if (!response.ok) {
        throw new Error("Gagal memuat data proyek");
      }

      const data = await response.json();
      setProyek(data.proyek);
      setEditStatus(data.proyek.status);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!proyek) return;

    try {
      setSaving(true);
      const response = await fetch(`/api/proyek/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: editStatus }),
      });

      if (!response.ok) {
        throw new Error("Gagal memperbarui status");
      }

      const data = await response.json();
      setProyek(data.proyek);
      setIsEditing(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      PERSIAPAN: "bg-yellow-100 text-yellow-800 border-yellow-200",
      PENANAMAN: "bg-blue-100 text-blue-800 border-blue-200",
      PEMELIHARAAN: "bg-orange-100 text-orange-800 border-orange-200",
      PANEN: "bg-green-100 text-green-800 border-green-200",
      SELESAI: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      PERSIAPAN: Clock,
      PENANAMAN: PlayCircle,
      PEMELIHARAAN: BarChart3,
      PANEN: Package,
      SELESAI: CheckCircle2,
    };
    return icons[status as keyof typeof icons] || AlertCircle;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data proyek...</p>
        </div>
      </div>
    );
  }

  if (error || !proyek) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Terjadi Kesalahan
          </h1>
          <p className="text-gray-600 mb-4">
            {error || "Proyek tidak ditemukan"}
          </p>
          <Link
            href="/dashboard/proyek"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors inline-flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali ke Daftar Proyek</span>
          </Link>
        </div>
      </div>
    );
  }

  const completedFases =
    proyek?.faseProyek?.filter((fase) => fase.status === "SELESAI").length || 0;

  const totalFases = proyek.faseProyek.length;
  const progress = totalFases > 0 ? (completedFases / totalFases) * 100 : 0;

  const StatusIcon = getStatusIcon(proyek.status);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Kiri: Judul */}
            <div className="flex items-start sm:items-center space-x-3">
              <Link
                href="/dashboard/proyek"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors shrink-0"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 wrap-break-words">
                  {proyek.namaProyek}
                </h1>
                <p className="text-gray-600 text-sm sm:text-base">
                  Kelola dan pantau proyek tani Anda
                </p>
              </div>
            </div>

            {/* Kanan: Status & Tombol */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              {isEditing ? (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 w-full sm:w-auto"
                  >
                    <option value="PERSIAPAN">Persiapan</option>
                    <option value="PENANAMAN">Penanaman</option>
                    <option value="PEMELIHARAAN">Pemeliharaan</option>
                    <option value="PANEN">Panen</option>
                    <option value="SELESAI">Selesai</option>
                  </select>
                  <button
                    onClick={handleStatusUpdate}
                    disabled={saving}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>{saving ? "Menyimpan..." : "Simpan"}</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditStatus(proyek.status);
                    }}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2"
                  >
                    <X className="h-4 w-4" />
                    <span>Batal</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div
                    className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-full border text-sm ${getStatusColor(
                      proyek.status
                    )}`}
                  >
                    <StatusIcon className="h-4 w-4" />
                    <span className="font-medium capitalize">
                      {proyek.status.toLowerCase().replace("_", " ")}
                    </span>
                  </div>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Edit3 className="h-4 w-4" />
                    <span>Edit Status</span>
                  </button>
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="default"
                        className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Tambah Fase
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-green-800">
                          Tambah Fase Baru
                        </DialogTitle>
                      </DialogHeader>

                      <div className="max-h-[70vh] overflow-y-auto px-1">
                        <TambahFaseForm
                          proyekId={id}
                          onSuccess={() => {
                            setOpen(false);
                            startTransition(() => router.refresh());
                          }}
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Project Overview */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Deskripsi Proyek
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {proyek.deskripsi}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500">Lokasi</p>
                    <p className="font-medium text-gray-900">{proyek.lokasi}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500">Dibuat</p>
                    <p className="font-medium text-gray-900">
                      {format(new Date(proyek.createdAt), "dd MMMM yyyy", {
                        locale: idLocale,
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500">Petani</p>
                    <p className="font-medium text-gray-900">
                      {proyek.petani.name}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Progress Proyek
                </h2>
                <div className="text-sm text-gray-600">
                  {completedFases} dari {totalFases} fase selesai
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress Keseluruhan</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Fase Proyek */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Fase Proyek
                </h3>
                {proyek.faseProyek
                  .sort((a, b) => a.urutanFase - b.urutanFase)
                  .map((fase) => (
                    <FaseCard key={fase.id} fase={fase} />
                  ))}

                {proyek.faseProyek.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Sprout className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p>Belum ada fase yang ditambahkan</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Statistik Proyek
              </h3>
              <div className="space-y-4">
                <StatItem
                  label="Total Fase"
                  value={totalFases.toString()}
                  icon={<BarChart3 className="h-4 w-4" />}
                />
                <StatItem
                  label="Fase Selesai"
                  value={completedFases.toString()}
                  icon={<CheckCircle2 className="h-4 w-4" />}
                />
                <StatItem
                  label="Progress"
                  value={`${Math.round(progress)}%`}
                  icon={<Leaf className="h-4 w-4" />}
                />
                <StatItem
                  label="Durasi"
                  value={`${Math.ceil(
                    (new Date().getTime() -
                      new Date(proyek.createdAt).getTime()) /
                      (1000 * 60 * 60 * 24)
                  )} hari`}
                  icon={<Clock className="h-4 w-4" />}
                />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Aksi Cepat
              </h3>
              <div className="space-y-3">
                <ActionButton
                  href={`/dashboard/projects/${id}/fase`}
                  icon={<PlayCircle className="h-4 w-4" />}
                  text="Kelola Fase"
                  color="blue"
                />
                <ActionButton
                  href={`/dashboard/projects/${id}/update`}
                  icon={<Edit3 className="h-4 w-4" />}
                  text="Update Progress"
                  color="green"
                />
                <ActionButton
                  href={`/dashboard/projects/${id}/produk`}
                  icon={<Package className="h-4 w-4" />}
                  text="Tambah Produk"
                  color="purple"
                />
              </div>
            </div>

            {/* Project Timeline */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Timeline
              </h3>
              <div className="space-y-3">
                <TimelineItem
                  date={proyek.createdAt}
                  title="Proyek Dibuat"
                  isFirst
                />
                {proyek.faseProyek
                  .filter((fase) => fase.status === "SELESAI")
                  .sort((a, b) => a.urutanFase - b.urutanFase)
                  .map((fase, index) => (
                    <TimelineItem
                      key={fase.id}
                      date={fase.updatedAt}
                      title={`${fase.namaFase} Selesai`}
                      isLast={index === completedFases - 1}
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
