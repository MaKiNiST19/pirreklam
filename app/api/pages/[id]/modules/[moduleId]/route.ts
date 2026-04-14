import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

type RouteParams = { params: Promise<{ id: string; moduleId: string }> };

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { moduleId } = await params;
  const body = await request.json();

  const updated = await prisma.pageModule.update({
    where: { id: moduleId },
    data: {
      label: body.label ?? undefined,
      isActive: body.isActive ?? undefined,
      data: body.data ?? undefined,
    },
  });
  return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { moduleId } = await params;
  await prisma.pageModule.delete({ where: { id: moduleId } });
  return NextResponse.json({ ok: true });
}
