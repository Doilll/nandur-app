// src/app/api/proyek/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });

  const user = session?.user;
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { namaProyek, deskripsi, lokasi, image } = await req.json();
  if (!namaProyek || !deskripsi || !lokasi) {
    return NextResponse.json(
      { error: "Nama proyek, deskripsi, dan lokasi wajib diisi" },
      { status: 400 }
    );
  }

  try {
    const newProyek = await prisma.proyekTani.create({
      data: {
        namaProyek,
        deskripsi,
        lokasi,
        petaniId: user.id,
        image,
      },
    });
    return NextResponse.json(
      { message: "Proyek berhasil dibuat", proyek: newProyek },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating proyek:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
