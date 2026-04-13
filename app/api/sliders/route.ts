import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const sliders = await prisma.slider.findMany({
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json(sliders);
  } catch (error) {
    console.error("GET /api/sliders error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const slider = await prisma.slider.create({
      data: {
        title: body.title,
        imageUrl: body.imageUrl,
        mobileImageUrl: body.mobileImageUrl,
        link: body.link,
        sortOrder: body.sortOrder || 0,
        isActive: body.isActive ?? true,
      },
    });

    return NextResponse.json(slider, { status: 201 });
  } catch (error) {
    console.error("POST /api/sliders error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
