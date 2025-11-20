import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth"; // sesuaikan

export async function POST(req: Request, {params}: {params: Promise<{id: string}>}): Promise<NextResponse> {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    const user = session?.user;

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id: feedId } = await params;

    const { content } = await req.json();

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "feedId and content are required" },
        { status: 400 }
      );
    }

    const comment = await prisma.comment.create({
      data: {
        feedId,
        authorId: user.id,
        content,
      },
      include: {
        author: true,
      },
    });

    return NextResponse.json({
      ok: true,
      comment,
    });
  } catch (err) {
    console.error("Comment API error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
