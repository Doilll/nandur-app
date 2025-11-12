// src/app/api/fase

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request): Promise<NextResponse> {
  const session = await auth.api.getSession({ headers: req.headers });
  const user = session?.user;

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
    const newFaseProyek = await prisma.faseProyek.create({
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
        message: "Fase proyek berhasil ditambahkan",
        faseProyek: newFaseProyek,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding fase proyek:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
