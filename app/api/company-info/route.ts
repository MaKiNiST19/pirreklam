import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    let info = await prisma.companyInfo.findUnique({
      where: { id: "singleton" },
    });

    if (!info) {
      info = await prisma.companyInfo.create({
        data: { id: "singleton" },
      });
    }

    return NextResponse.json(info);
  } catch (error) {
    console.error("GET /api/company-info error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = session.user as { role?: string };
    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();

    const info = await prisma.companyInfo.upsert({
      where: { id: "singleton" },
      update: body,
      create: { id: "singleton", ...body },
    });

    return NextResponse.json(info);
  } catch (error) {
    console.error("PUT /api/company-info error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
