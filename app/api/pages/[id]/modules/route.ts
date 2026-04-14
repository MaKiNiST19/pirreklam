import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const modules = await prisma.pageModule.findMany({
    where: { pageId: id },
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(modules);
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();

  const count = await prisma.pageModule.count({ where: { pageId: id } });
  const module = await prisma.pageModule.create({
    data: {
      pageId: id,
      type: body.type,
      label: body.label || null,
      sortOrder: count,
      isActive: true,
      data: body.data || {},
    },
  });
  return NextResponse.json(module, { status: 201 });
}
