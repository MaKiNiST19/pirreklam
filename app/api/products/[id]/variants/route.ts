import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const variants = await prisma.productVariant.findMany({
      where: { productId: id },
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json(variants);
  } catch (error) {
    console.error("GET /api/products/[id]/variants error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await request.json();

    const variant = await prisma.productVariant.create({
      data: {
        productId: id,
        sku: body.sku,
        baskiOption: body.baskiOption,
        renkOption: body.renkOption,
        desenOption: body.desenOption,
        adet: body.adet,
        priceUsd: body.priceUsd,
        isCompatible: body.isCompatible ?? true,
        stockCode: body.stockCode,
        sortOrder: body.sortOrder || 0,
      },
    });

    return NextResponse.json(variant, { status: 201 });
  } catch (error) {
    console.error("POST /api/products/[id]/variants error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const variants: Array<{ id: string; [key: string]: unknown }> = await request.json();

    const updates = variants.map((v) =>
      prisma.productVariant.update({
        where: { id: v.id },
        data: {
          ...v,
          productId: id,
        },
      })
    );

    const result = await prisma.$transaction(updates);
    return NextResponse.json(result);
  } catch (error) {
    console.error("PUT /api/products/[id]/variants error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
