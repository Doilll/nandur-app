// app/dashboard/page.tsx
import { 
  BarChart3, 
  Package, 
  MessageSquare, 
  ArrowUpRight, 
  Sprout,
  Users,
  Eye,
  ShoppingCart
} from 'lucide-react';
import Link from 'next/link';
import StatCard from '@/components/StatCard';
import ProjectItem from '@/components/ProjectItem';
import ActivityItem from '@/components/ActivityItem';
import ActionButton from '@/components/ActionButton';
import PerformanceItem from '@/components/PerformanceItem';
import TaskItem from '@/components/TaskItem';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-2">Selamat datang kembali! Ini ringkasan aktivitas Anda.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Sprout className="h-6 w-6" />}
            title="Proyek Aktif"
            value="12"
            change="+2"
            trend="up"
            href="/dashboard/projects"
          />
          <StatCard
            icon={<Package className="h-6 w-6" />}
            title="Produk Dijual"
            value="45"
            change="+5"
            trend="up"
            href="/dashboard/products"
          />
          <StatCard
            icon={<MessageSquare className="h-6 w-6" />}
            title="Interaksi"
            value="128"
            change="+12"
            trend="up"
            href="/dashboard/feed"
          />
          <StatCard
            icon={<Users className="h-6 w-6" />}
            title="Pengikut"
            value="356"
            change="+23"
            trend="up"
            href="/dashboard/analytics"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Projects & Activity */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Projects */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Proyek Terkini</h2>
                <Link 
                  href="/dashboard/projects"
                  className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center space-x-1"
                >
                  <span>Lihat Semua</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
              
              <div className="space-y-4">
                <ProjectItem
                  name="Padi Organik Sawah Luas"
                  progress={75}
                  status="PANEN"
                  date="15 Nov 2024"
                  members={3}
                />
                <ProjectItem
                  name="Cabai Rawit Greenhouse"
                  progress={30}
                  status="PEMELIHARAAN"
                  date="20 Des 2024"
                  members={2}
                />
                <ProjectItem
                  name="Tomat Hidroponik"
                  progress={90}
                  status="PANEN"
                  date="10 Nov 2024"
                  members={4}
                />
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Aktivitas Terbaru</h2>
              <div className="space-y-4">
                <ActivityItem
                  icon={<MessageSquare className="h-4 w-4" />}
                  title="Komentar Baru"
                  description="5 komentar baru pada update proyek Padi Organik"
                  time="2 jam lalu"
                  type="comment"
                />
                <ActivityItem
                  icon={<ShoppingCart className="h-4 w-4" />}
                  title="Penjualan Baru"
                  description="Produk Tomat Cherry terjual 5kg"
                  time="5 jam lalu"
                  type="sale"
                />
                <ActivityItem
                  icon={<Eye className="h-4 w-4" />}
                  title="Peningkatan Pengunjung"
                  description="Proyek Cabai Rawit dilihat 45 kali hari ini"
                  time="1 hari lalu"
                  type="view"
                />
              </div>
            </div>
          </div>

          {/* Right Sidebar - Quick Actions & Stats */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Aksi Cepat</h3>
              <div className="space-y-3">
                <ActionButton
                  icon={<Sprout className="h-4 w-4" />}
                  text="Buat Proyek Baru"
                  href="/dashboard/projects/new"
                  color="green"
                />
                <ActionButton
                  icon={<Package className="h-4 w-4" />}
                  text="Tambah Produk"
                  href="/dashboard/products/new"
                  color="blue"
                />
                <ActionButton
                  icon={<MessageSquare className="h-4 w-4" />}
                  text="Buat Postingan"
                  href="/dashboard/feed/new"
                  color="purple"
                />
                <ActionButton
                  icon={<BarChart3 className="h-4 w-4" />}
                  text="Lihat Analitik"
                  href="/dashboard/analytics"
                  color="orange"
                />
              </div>
            </div>

            {/* Performance Stats */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistik Performa</h3>
              <div className="space-y-4">
                <PerformanceItem
                  label="Engagement Rate"
                  value="68%"
                  change="+12%"
                  trend="up"
                />
                <PerformanceItem
                  label="Conversion Rate"
                  value="24%"
                  change="+5%"
                  trend="up"
                />
                <PerformanceItem
                  label="Project Completion"
                  value="85%"
                  change="+8%"
                  trend="up"
                />
              </div>
            </div>

            {/* Upcoming Tasks */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tugas Mendatang</h3>
              <div className="space-y-3">
                <TaskItem
                  task="Pemupukan proyek Cabai Rawit"
                  due="Besok"
                  priority="high"
                />
                <TaskItem
                  task="Update progress Tomat Hidroponik"
                  due="2 hari lagi"
                  priority="medium"
                />
                <TaskItem
                  task="Panen Padi Organik"
                  due="Minggu ini"
                  priority="high"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
