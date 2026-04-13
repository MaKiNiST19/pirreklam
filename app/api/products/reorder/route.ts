import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { items }: { items: { id: string; menuOrder: number }[] } = await request.json();

    const updates = items.map((item) =>
      prisma.product.update({
        where: { id: item.id },
        data: { menuOrder: item.menuOrder },
      })
    );

    await prisma.$transaction(updates);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/products/reorder error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
