import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

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
      { error: "Status fase wajib diisi" },
      { status: 400 }
    );
  }

  try {
    const updatedFase = await prisma.faseProyek.update({
      where: { id },
      data: {
        status,
      },
    });
    return NextResponse.json(
      { message: "Fase berhasil diperbarui", fase: updatedFase },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating fase:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
