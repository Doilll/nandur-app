import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: req.headers });
  const user = session?.user;

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { status } = await req.json();
  if (!status) {
    return NextResponse.json(
      { error: "Status proyek wajib diisi" },
      { status: 400 }
    );
  }

  try {
    const updatedProyek = await prisma.proyekTani.update({
      where: { id },
      data: {
        status,
      },
    });
    return NextResponse.json(
      { message: "Proyek berhasil diperbarui", proyek: updatedProyek },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating proyek:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
