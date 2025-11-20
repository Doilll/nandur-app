"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Menu,
  X,
  User,
  LayoutDashboard,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  const { signOut } = authClient;
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showDropdown &&
        !(event.target as Element).closest(".dropdown-container")
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  useEffect(() => {
    if (!isHomePage) return;
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  const navTextColor = "text-slate-900";

  const AuthButton = ({ mobile = false }: { mobile?: boolean }) => {
    if (isPending) {
      <div className="h-10 w-24 rounded-md bg-slate-200 animate-pulse"></div>;
    }
    if (session?.user) {
      const user = session.user;
      const name = user?.name?.charAt(0).toUpperCase() || "U";

      if (mobile) {
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || "User"}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center text-slate-600">
                  {name}
                </div>
              )}
              <div>
                <p className="font-medium text-slate-900">{user.name}</p>
                <p className="text-sm text-slate-500">{user.email}</p>
              </div>
            </div>
            <Link
              href="/dashboard"
              className="flex items-center w-full p-3 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <LayoutDashboard className="mr-3 h-5 w-5" />
              Dashboard
            </Link>

            <Link
              href={`/petani/${user.username}`}
              className="flex items-center w-full p-3 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <User className="mr-3 h-5 w-5" />
              Profil Saya
            </Link>

            <button
              onClick={() => {
                signOut({
                  fetchOptions: {
                    cache: "no-store",
                    onSuccess: () => router.push("/login"),
                  },
                });
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center justify-center w-full p-3 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md mt-2"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign Out
            </button>
          </div>
        );
      }

      return (
        <div className="relative dropdown-container">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className={`flex items-center gap-2 px-4 py-2 border border-transparent rounded-md hover:bg-slate-100 transition-colors ${navTextColor}`}
          >
            {user.image ? (
              <img
                src={user.image}
                alt={user.name || "User"}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center text-slate-600">
                {name}
              </div>
            )}
            <ChevronDown className="h-4 w-4" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 top-12 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-20 p-2 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="pb-3 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name || "User"}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center text-slate-600">
                      {name}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-slate-900">{user.name}</p>
                    <p className="text-sm text-slate-500">{user.email}</p>
                  </div>
                </div>
              </div>
              <Link
                href="/dashboard"
                className="flex items-center text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md px-3 py-2 mt-2"
                onClick={() => setShowDropdown(false)}
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Link>

              <Link
                href={`/petani/${user.username}`}
                className="flex items-center text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md px-3 py-2"
                onClick={() => setShowDropdown(false)}
              >
                <User className="mr-2 h-4 w-4" />
                Profil Saya
              </Link>
              <button
                onClick={() => {
                  signOut({
                    fetchOptions: {
                      cache: "no-store",
                      onSuccess: () => router.push("/login"),
                    },
                  });
                  setShowDropdown(false);
                }}
                className="flex items-center justify-center w-full p-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md mt-2"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      );
    }
    if (mobile) {
      return (
        <div className="flex flex-col space-y-3">
          <Link
            href="/login"
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-full text-center px-4 py-2 bg-white text-green-600 border border-green-600 rounded-md hover:bg-green-50"
            >
            Masuk
          </Link>
          <Link
            className="w-full text-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            href="/register"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Daftar Gratis
          </Link>
        </div>
      );
    } else {
      return (
        <div className="flex items-center space-x-3 ${navTextColor}">
          <Link
            href="/login"
            className="px-4 py-2 rounded-4xl font-medium transition-colors bg-transparent bg-opacity-20 text-black hover:bg-opacity-40 border-2 border-green-600 hover:border-green-700"
          >
            Masuk
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 rounded-full font-medium transition-colors bg-green-600 bg-opacity-20 hover:bg-opacity-40 hover:bg-green-800 text-white"
          >
            Daftar Gratis
          </Link>
        </div>
      );
    }
  };

  return (
    <nav className="border-b border-green-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center space-x-2 group">
            <Image
              src="/favicon.png"
              alt="Nandur Logo"
              width={32}
              height={32}
              className="rounded-full group-hover:scale-105 transition-transform"
            />
            <span className="text-2xl font-bold text-black group-hover:text-green-700 transition-colors">
              Nandur
            </span>
          </Link>
          <div className="hidden md:flex items-center justify-center space-x-8">
            <Link
              href="/tentang"
              className={`hover:text-green-600 transition-colors ${navTextColor}`}
            >
              Tentang
            </Link>
            <Link
              href="/produk"
              className={`hover:text-green-600 transition-colors ${navTextColor}`}
            >
              Produk
            </Link>
            <Link
              href="/petani"
              className={`hover:text-green-600 transition-colors ${navTextColor}`}
            >
              Petani
            </Link>
            <Link
              href="/feed"
              className={`hover:text-green-600 transition-colors ${navTextColor}`}
            >
              Komunitas
            </Link>
          </div>
          <div className="hidden md:block">
            <AuthButton />
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-full ${navTextColor} hover:bg-black/10 transition-colors`}
            aria-label={isMobileMenuOpen ? "Tutup menu" : "Buka menu"}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-5 pt-4 pb-6 space-y-6">
            <div className="grid gap-4">
              <Link
                href="/tentang"
                className="block py-2 px-3 text-slate-700 hover:text-green-600 hover:bg-slate-50 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Tentang
              </Link>
              <Link
                href="/produk"
                className="block py-2 px-3 text-slate-700 hover:text-green-600 hover:bg-slate-50 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Produk
              </Link>
              <Link
                href="/petani"
                className="block py-2 px-3 text-slate-700 hover:text-green-600 hover:bg-slate-50 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Petani
              </Link>
              <Link
                href="/feed"
                className="block py-2 px-3 text-slate-700 hover:text-green-600 hover:bg-slate-50 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Komunitas
              </Link>
            </div>

            <div className="pt-4 border-t">
              <AuthButton mobile={true} />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
