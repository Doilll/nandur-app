import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth"; // sesuaikan ke auth lu

export async function POST(req: Request, { params }: {params: Promise<{id: string}>}): Promise<NextResponse> {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    const user = session?.user;

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const {id} = await params;

    

    // cek sudah like atau belum
    const existing = await prisma.like.findUnique({
      where: {
        userId_feedId: {
          userId: user.id,
          feedId: id,
        },
      },
    });

    if (existing) {
      // UNLIKE
      await prisma.like.delete({
        where: {
          id: existing.id,
        },
      });

      return NextResponse.json({
        ok: true,
        message: "unliked",
      });
    } else {
      // LIKE
      await prisma.like.create({
        data: {
          userId: user.id,
          feedId: id,
        },
      });

      return NextResponse.json({
        ok: true,
        message: "liked",
      });
    }
  } catch (err) {
    console.error("Like API error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
