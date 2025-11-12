// src/app/api/upload-file/route.ts

import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { auth } from "@/lib/auth";


export async function POST(request: Request): Promise<NextResponse> {
  const session = await auth.api.getSession({ headers: request.headers });
  const user = session?.user;
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  try {
    const formData = await request.formData();

    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Tidak ada file yang diupload." },
        { status: 400 }
      );
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error: `File terlalu besar. Maksimal 5MB. Ukuran file: ${Math.round(
            file.size / 1024 / 1024
          )}MB`,
        },
        { status: 400 }
      );
    }

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/pdf",
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Tipe file tidak didukung. Hanya JPG, PNG, dan PDF yang diizinkan.",
        },
        { status: 400 }
      );
    }
    const fileExtension = file.name.split(".").pop();
    const fileNameWithoutExt = file.name.split(".").slice(0, -1).join(".");
    const uniqueFilename = `${fileNameWithoutExt}-${nanoid(
      8
    )}.${fileExtension}`;

    const blob = await put(uniqueFilename, file, {
      access: "public",
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error("Error uploading file to Vercel Blob:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengupload file." },
      { status: 500 }
    );
  }
}