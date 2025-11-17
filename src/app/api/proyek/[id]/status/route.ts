import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{
    id: string;
  }> }
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
    const proyek = await prisma.proyekTani.update({
      where: { id },
      data: {
        status,
      },
      include: {
        petani: true,
        faseProyek: true,
      },
    });
    return NextResponse.json({ proyek }, { status: 200 });
  } catch (error) {
    console.error("Error updating proyek:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
