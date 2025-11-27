// src/app/api/feed/[id]/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { del } from "@vercel/blob";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function PUT(
  req: Request,
  { params }: RouteParams
): Promise<NextResponse> {
  const session = await auth.api.getSession({ headers: req.headers });
  const user = session?.user;

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const { content, imageFeed, projectId } = await req.json();

  if (!content) {
    return NextResponse.json({ error: "Content is required" }, { status: 400 });
  }

  try {
    // Verify that the feed belongs to the user
    const existingFeed = await prisma.feed.findFirst({
      where: {
        id: id,
        authorId: user.id
      }
    });

    if (!existingFeed) {
      return NextResponse.json({ error: "Feed not found" }, { status: 404 });
    }

    const updatedFeed = await prisma.feed.update({
      where: {
        id: id,
      },
      data: {
        content,
        imageFeed: imageFeed || [],
        projectId: projectId || null,
      },
    });
    return NextResponse.json({
      message: "Feed berhasil diupdate",
      feed: updatedFeed,
    });
  } catch (error) {
    console.error("Error updating feed:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

// Optional: Add DELETE method if needed
export async function DELETE(
  req: Request,
  { params }: RouteParams
): Promise<NextResponse> {
  const session = await auth.api.getSession({ headers: req.headers });
  const user = session?.user;

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const existingFeed = await prisma.feed.findFirst({
      where: {
        id: id,
        authorId: user.id
      }
    });

    if (!existingFeed) {
      return NextResponse.json({ error: "Feed not found" }, { status: 404 });
    }

    if (existingFeed.imageFeed?.length) {
      await Promise.all(
        existingFeed.imageFeed.map(async (imageUrl) => {
          try {
            await del(imageUrl);
          } catch (error) {
            console.error("Error deleting image:", error);
          }
        })
      )
    }

    await prisma.feed.delete({
      where: {
        id: id,
      },
    });
    return NextResponse.json({
      message: "Feed berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting feed:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}