import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { del } from "@vercel/blob";


export async function GET(
  req: Request,
  { params }:  { params: Promise<{
    id: string;
  }> }
): Promise<NextResponse> {
  const { id } = await params;

  try {
    const proyek = await prisma.proyekTani.findUnique({
      where: {
        id,
      },
      include: {
        petani: true,
        faseProyek: true,
        produk: true,
      },
    });
    if (!proyek) {
      return NextResponse.json(
        { error: "Proyek tidak ditemukan" },
        { status: 404 }
      );
    }
    return NextResponse.json({ proyek }, { status: 200 });
  } catch (error) {
    console.error("Error fetching proyek:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

export async function PUT(
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
  const { namaProyek, deskripsi, lokasi, image } = await req.json();
  if (!namaProyek || !deskripsi || !lokasi) {
    return NextResponse.json(
      { error: "Nama proyek, deskripsi, dan lokasi wajib diisi" },
      { status: 400 }
    );
  }

  try {
    const updatedProyek = await prisma.proyekTani.update({
      where: { id },
      data: {
        namaProyek,
        deskripsi,
        lokasi,
        image,
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

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;

  const session = await auth.api.getSession({ headers: req.headers });
  const user = session?.user;

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. Ambil semua relasi yang punya gambar
    const proyek = await prisma.proyekTani.findUnique({
      where: { id },
      select: {
        image: true,
        faseProyek: { select: { gambarFase: true } },
        produk: { select: { gambarProduk: true } },
        feeds: { select: { imageFeed: true } },
      },
    });

    if (!proyek) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // 2. Kumpulkan SEMUA URL gambar
    const allImages: string[] = [];

    if (proyek.image) allImages.push(proyek.image);

    proyek.faseProyek.forEach(f => {
      if (f.gambarFase.length) allImages.push(...f.gambarFase);
    });

    proyek.produk.forEach(p => {
      if (p.gambarProduk.length) allImages.push(...p.gambarProduk);
    });

    proyek.feeds.forEach(f => {
      if (f.imageFeed.length) allImages.push(...f.imageFeed);
    });

    // 3. Hapus proyek (cascade akan hapus fase, produk, feed)
    const deleted = await prisma.proyekTani.delete({
      where: { id },
    });

    // 4. Hapus file2 di Vercel Blob
    await Promise.all(
      allImages.map(async (url) => {
        try {
          await del(url);
        } catch (err) {
          console.error("Gagal hapus file blob:", err);
        }
      })
    );

    return NextResponse.json({
      message: "Proyek & semua file terkait berhasil dihapus",
      proyek: deleted,
    });
  } catch (error) {
    console.error("Error deleting proyek:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

