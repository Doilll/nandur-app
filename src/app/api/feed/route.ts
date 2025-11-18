// src/app/api/feed/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request): Promise<NextResponse> {
  const session = await auth.api.getSession({ headers: req.headers });
  const user = session?.user;

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { content, imageFeed, projectId } = await req.json();

  if (!content) {
    return NextResponse.json({ error: "Content is required" }, { status: 400 });
  }

  try {
    const newFeed = await prisma.feed.create({
      data: {
        content,
        imageFeed: imageFeed || [],
        authorId: user.id,
        projectId: projectId || null,
      },
    });
    return NextResponse.json(
      { message: "Feed berhasil ditambahkan", feed: newFeed },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding feed:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
