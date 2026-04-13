import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const pages = await prisma.page.findMany({
      orderBy: { menuOrder: "asc" },
    });

    return NextResponse.json(pages);
  } catch (error) {
    console.error("GET /api/pages error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = session.user as { role?: string };
    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const page = await prisma.page.create({
      data: {
        title: body.title,
        slug: body.slug,
        content: body.content,
        isPublished: body.isPublished ?? true,
        menuOrder: body.menuOrder || 0,
        seoTitle: body.seoTitle,
        seoDescription: body.seoDescription,
      },
    });

    return NextResponse.json(page, { status: 201 });
  } catch (error) {
    console.error("POST /api/pages error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
