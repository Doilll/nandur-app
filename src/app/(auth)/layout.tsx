// app/(auth)/layout.tsx
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // If user is already authenticated, redirect to dashboard
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <header className="border-b border-green-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <Image
                src="/favicon.png"
                alt="Nandur Logo"
                width={32}
                height={32}
                className="rounded-full group-hover:scale-105 transition-transform"
              />
              <span className="text-2xl font-bold text-green-800">Nandur</span>
            </Link>

            {/* Auth Switch */}
            <div className="flex items-center space-x-4">
              <Link
                href="/auth/login"
                className="text-green-700 hover:text-green-600 font-medium transition-colors"
              >
                Masuk
              </Link>
              <Link
                href="/auth/register"
                className="bg-green-600 text-white px-6 py-2 rounded-full font-medium hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl"
              >
                Daftar
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Auth Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-green-100 p-8">
            {/* Auth Header */}
            <div className="text-center mb-8">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mb-4">
                <Image
                    src="/favicon.png"
                    alt="Nandur Icon"
                    width={32}
                    height={32}
                    className="rounded-2xl"
                  />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Selamat Datang di Nandur
              </h1>
              <p className="text-gray-600">
                Tempatnya Petani Tampil
              </p>
            </div>

            {/* Auth Content */}
            {children}

            {/* Additional Auth Options */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Dengan melanjutkan, Anda menyetujui{" "}
                  <Link
                    href="/terms"
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    Syarat & Ketentuan
                  </Link>{" "}
                  dan{" "}
                  <Link
                    href="/privacy"
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    Kebijakan Privasi
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Support Section */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Butuh bantuan?{" "}
              <Link
                href="/support"
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Hubungi Tim Support
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
