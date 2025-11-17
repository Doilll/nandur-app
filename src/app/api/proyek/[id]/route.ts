import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
  if (!namaProyek || !deskripsi || !lokasi || !image) {
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
  try {
    const deletedProyek = await prisma.proyekTani.delete({
      where: { id },
    });
    return NextResponse.json(
      { message: "Proyek berhasil dihapus", proyek: deletedProyek },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting proyek:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
