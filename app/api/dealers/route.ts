import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const dealers = await prisma.dealer.findMany({
      include: {
        _count: { select: { orders: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(dealers);
  } catch (error) {
    console.error("GET /api/dealers error:", error);
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
    const dealer = await prisma.dealer.create({
      data: {
        name: body.name,
        company: body.company,
        phone: body.phone,
        email: body.email,
        notes: body.notes,
      },
    });

    return NextResponse.json(dealer, { status: 201 });
  } catch (error) {
    console.error("POST /api/dealers error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
