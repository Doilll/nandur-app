// src/app/api/produk

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { tr } from "date-fns/locale";
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


export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 12;
    const search = searchParams.get("search") || "";
    const lokasi = searchParams.get("lokasi") || "";
    const hargaMin = searchParams.get("harga_min");
    const hargaMax = searchParams.get("harga_max");

    const skip = (page - 1) * limit;

    const where: any = {
      status: "TERSEDIA", // Only show available products
    };

    // Search filter
    if (search) {
      where.OR = [
        { namaProduk: { contains: search, mode: "insensitive" } },
        { deskripsi: { contains: search, mode: "insensitive" } },
      ];
    }

    // Location filter
    if (lokasi) {
      where.petani = {
        lokasi: { contains: lokasi, mode: "insensitive" }
      };
    }

    // Price range filter
    if (hargaMin || hargaMax) {
      where.harga = {};
      if (hargaMin) {
        where.harga.gte = Number(hargaMin);
      }
      if (hargaMax) {
        where.harga.lte = Number(hargaMax);
      }
    }

    const [data, total] = await Promise.all([
      prisma.produk.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          namaProduk: true,
          harga: true,
          unit: true,
          gambarProduk: true,
          deskripsi: true,
          createdAt: true,
          status: true,
          petani: {
            select: {
              name: true,
              username: true,
              image: true,
              lokasi: true,
            },
          },
          proyekTani: {
            select: {
              id: true,
              namaProyek: true,
            },
          },
        },
      }),
      prisma.produk.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data,
    });
  } catch (error) {
    console.error("Error GET /api/produk:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
