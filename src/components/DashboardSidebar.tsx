"use client";

import {
  LayoutDashboard,
  Sprout,
  Package,
  MessageSquare,
  Settings,
  LogOut,
  User,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import type { User as AuthUser } from "@/lib/auth";

export default function DashboardSidebar({ user }: { user: AuthUser }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { signOut } = authClient;
  const router = useRouter();

  const navigation = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Proyek Tani", href: "/dashboard/proyek", icon: Sprout },
    { name: "Produk", href: "/dashboard/produk", icon: Package },
    { name: "Feed", href: "/dashboard/feed", icon: MessageSquare },
    { name: "Pengaturan", href: "/dashboard/pengaturan", icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg text-slate-800 bg-white shadow-lg border border-gray-200"
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

     { /* Backdrop for mobile */}
        {isMobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-transparent bg-opacity-50 z-30"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-xl border-r border-gray-200 transform transition-transform duration-300 ease-in-out
        ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }
      `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <Image
                src="/favicon.png"
                alt="Nandur Logo"
                width={24}
                height={24}
                className="rounded-sm"
              />
            </div>
            <span className="text-xl font-bold text-gray-900">Nandur</span>
          </Link>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <User className="h-5 w-5 text-green-600" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`
                  flex items-center space-x-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200
                  ${
                    active
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }
                `}
              >
                <Icon
                  className={`h-5 w-5 ${
                    active ? "text-green-600" : "text-gray-400"
                  }`}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <button
            onClick={() => {
              signOut({
                fetchOptions: {
                  cache: "no-store",
                  onSuccess: () => router.push("/login"),
                },
              });
            }}
            className="flex items-center space-x-3 px-3 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-700 w-full transition-colors"
          >
            <LogOut className="h-5 w-5 text-gray-400" />
            <span>Keluar</span>
          </button>
        </div>
      </div>
    </>
  );
}
