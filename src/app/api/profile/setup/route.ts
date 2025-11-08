import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    const session = await auth.api.getSession({ headers: req.headers });
    const user = session?.user;

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { username, numberPhone, lokasi, image, bio } = await req.json();

    if (!username || !numberPhone || !lokasi) {
        return NextResponse.json(
            { error: "Nama pengguna, nomor telepon, dan lokasi wajib diisi" },
            { status: 400 }
        );
    }

    try {
        const updatedProfile = await prisma.user.update({
            where: { id: user.id },
            data: {
                username,
                numberPhone,
                lokasi,
                image,
                bio,
            },
        });
        return NextResponse.json(
            { message: "Profil berhasil diperbarui", user: updatedProfile },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating profile:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan server" },
            { status: 500 }
        );
    }
}