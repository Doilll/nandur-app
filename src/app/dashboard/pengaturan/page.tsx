import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Edit } from "lucide-react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import EditProfilForm from "@/components/EditProfilForm";

export default async function UpdateProyekPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  const clientUser = {
    id: user!.id,
    name: user!.name,
    bio: user?.bio ?? "",
    numberPhone: user?.numberPhone ?? "" ,
    lokasi: user?.lokasi ?? "",
    image: user?.image ?? "" ,
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">User tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex space-x-3">
          <Link
            href="/dashboard"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors shrink-0"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <h1 className="text-2xl font-bold text-green-800 mb-6">
            Edit Profil
          </h1>
        </div>

        {/* edit profil komponen */}
        <EditProfilForm user={clientUser} />
      </div>
    </div>
  );
}
