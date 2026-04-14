import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: Request): Promise<NextResponse> {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename");

  if (!filename) {
    return NextResponse.json({ error: "Filename required" }, { status: 400 });
  }

  try {
    if (!request.body) {
      return NextResponse.json({ error: "Empty body" }, { status: 400 });
    }

    const blob = await put(filename, request.body as ReadableStream, {
      access: "public",
    });

    // Save to media library
    await prisma.mediaFile.create({
      data: {
        url: blob.url,
        pathname: blob.pathname,
        filename,
        mimeType: blob.contentType,
      },
    }).catch(() => {}); // non-blocking

    return NextResponse.json(blob);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("POST /api/upload error:", msg);
    return NextResponse.json({ error: "Upload failed", details: msg }, { status: 500 });
  }
}
