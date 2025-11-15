// src/app/api/produk

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request): Promise<NextResponse> {
  const session = await auth.api.getSession({ headers: req.headers });
  const user = session?.user;

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { namaProduk, deskripsi, harga, gambarProduk, proyekTaniId, unit } =
    await req.json();
  if (
    !namaProduk ||
    !deskripsi ||
    !harga ||
    !unit ||
    !gambarProduk ||
    !proyekTaniId
  ) {
    return NextResponse.json(
      {
        error:
          "Nama produk, deskripsi, harga, stok, gambar produk, dan proyek tani wajib diisi",
      },
      { status: 400 }
    );
  }

  try {
    const newProduct = await prisma.produk.create({
      data: {
        namaProduk,
        deskripsi,
        harga,
        gambarProduk,
        proyekTaniId,
        unit,
        petaniId: user.id,
      },
    });
    return NextResponse.json(
      { message: "Produk berhasil ditambahkan", product: newProduct },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding product:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
