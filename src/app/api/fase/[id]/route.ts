import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { del } from "@vercel/blob";

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
): Promise<NextResponse> {
  const { id } = await params;
  try {
    const faseProyek = await prisma.faseProyek.findMany({
      where: {
        proyekTaniId: id,
      },
      orderBy: {
        urutanFase: "asc",
      },
    });
    return NextResponse.json({ faseProyek }, { status: 200 });
  } catch (error) {
    console.log("Error fetching fase proyek:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
): Promise<NextResponse> {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: req.headers });
  const user = session?.user;

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 400 });
  }

  const { namaFase, deskripsi, proyekTaniId, gambarFase, urutanFase } =
    await req.json();
  if (!namaFase || !deskripsi || !proyekTaniId || !gambarFase || !urutanFase) {
    return NextResponse.json(
      {
        error:
          "Nama fase, deskripsi, proyekTaniId, gambarFase, dan urutanFase wajib diisi",
      },
      { status: 400 }
    );
  }

  try {
    const updatedFaseProyek = await prisma.faseProyek.update({
      where: { id },
      data: {
        namaFase,
        deskripsi,
        proyekTaniId,
        gambarFase,
        urutanFase,
      },
    });
    return NextResponse.json(
      {
        message: "Fase proyek berhasil diperbarui",
        faseProyek: updatedFaseProyek,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating fase proyek:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
): Promise<NextResponse> {
  const { id } = await params;

  const session = await auth.api.getSession({ headers: req.headers });
  const user = session?.user;
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const existingFaseProyek = await prisma.faseProyek.findUnique({
      where: { id },
      select: { gambarFase: true },
    });
    if (!existingFaseProyek) {
      return NextResponse.json(
        { error: "Fase proyek tidak ditemukan" },
        { status: 404 }
      );
    }

    const deletedFaseProyek = await prisma.faseProyek.delete({
      where: { id },
    });
    if (existingFaseProyek.gambarFase?.length) {
      await Promise.all(
        deletedFaseProyek.gambarFase.map(async (imageUrl) => {
          try {
            await del(imageUrl);
          } catch (error) {
            console.error("Error deleting image:", error);
          }
        })
      );
    }
    return NextResponse.json(
      {
        message: "Fase proyek berhasil dihapus",
        faseProyek: deletedFaseProyek,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting fase proyek:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
