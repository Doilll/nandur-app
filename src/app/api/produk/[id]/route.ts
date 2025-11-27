import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
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
    const produk = await prisma.produk.findUnique({
      where: {
        id: id,
      },
    });
    return NextResponse.json(produk);
  } catch (error) {
    console.error("Error fetching produk:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const session = await auth.api.getSession({ headers: req.headers });
  const user = session?.user;

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    // 1. Ambil produk dulu sebelum dihapus
    const existing = await prisma.produk.findUnique({
      where: { id },
      select: { gambarProduk: true }
    });

    if (!existing) {
      return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 404 });
    }

    // 2. Hapus produk dari database
    const deleted = await prisma.produk.delete({
      where: { id },
    });

    // 3. Hapus gambar-gambar (kalau ada)
    if (existing.gambarProduk?.length) {
      await Promise.all(
        existing.gambarProduk.map(async (imageUrl) => {
          try {
            await del(imageUrl);
          } catch (error) {
            console.error("Error deleting image:", error);
          }
        })
      );
    }

    return NextResponse.json({
      message: "Produk berhasil dihapus",
      produk: deleted,
    });

  } catch (error) {
    console.error("Error deleting produk:", error);
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
  const session = await auth.api.getSession({ headers: req.headers });
  const user = session?.user;

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  const { namaProduk, deskripsi, harga, unit, gambarProduk, status } =
    await req.json();
  if (
    !namaProduk ||
    !deskripsi ||
    !harga ||
    !unit ||
    !gambarProduk ||
    !status
  ) {
    return NextResponse.json(
      {
        error:
          "Nama produk, deskripsi, harga, status, unit, gambar produk, dan proyek tani wajib diisi",
      },
      { status: 400 }
    );
  }

  try {
    const produk = await prisma.produk.update({
      where: {
        id: id,
      },
      data: {
        namaProduk,
        deskripsi,
        harga,
        unit,
        gambarProduk,
        status,
      },
    });
    return NextResponse.json({ message: "Produk berhasil diupdate", produk });
  } catch (error) {
    console.error("Error updating produk:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
