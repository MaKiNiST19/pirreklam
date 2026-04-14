import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { items } = await request.json() as { items: { id: string; sortOrder: number }[] };

  await Promise.all(
    items.map(({ id, sortOrder }) =>
      prisma.pageModule.update({ where: { id }, data: { sortOrder } })
    )
  );

  return NextResponse.json({ ok: true });
}
