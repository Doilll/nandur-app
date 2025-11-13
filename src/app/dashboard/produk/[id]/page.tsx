// src/app/dashboard/produk/edit/[id]/page.tsx
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import EditProdukForm from "@/components/EditProdukForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

interface EditProdukPageProps {
  params: {
    id: string;
  };
}

export default async function EditProdukPage({ params }: EditProdukPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    redirect("/login");
  }

  const {id} = await params;
  const produk = await prisma.produk.findUnique({
    where: {
      id: id,
    },
  });
  if (!produk) {
    notFound();
  }


  return (
    <div className="min-h-screen bg-green-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/dashboard/produk"
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali ke Daftar Produk
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Edit Produk</h1>
          <p className="text-gray-600 mt-2">Perbarui informasi produk Anda</p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <EditProdukForm 
            produkId={id}
          />
        </div>
      </div>
    </div>
  );
}