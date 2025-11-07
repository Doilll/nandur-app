// src/app/api/proyek/route.ts
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[..nextauth]";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {namaProyek, deskripsi, lokasi} = await req.json();
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
                petaniId: (session.user as any).id,
            },
        })
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

