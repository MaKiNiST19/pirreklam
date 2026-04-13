import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status");
    const skip = (page - 1) * limit;

    const where = status ? { status: status as never } : {};

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: true,
          dealer: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({
      orders,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("GET /api/orders error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const order = await prisma.order.create({
      data: {
        totalUsd: body.totalUsd,
        contactName: body.contactName,
        contactPhone: body.contactPhone,
        contactEmail: body.contactEmail,
        dealerId: body.dealerId,
        notes: body.notes,
        items: {
          create: body.items.map((item: {
            productId: string;
            sku: string;
            title: string;
            baskiOption?: string;
            renkOption?: string;
            desenOption?: string;
            adet: number;
            priceUsd: number;
          }) => ({
            productId: item.productId,
            sku: item.sku,
            title: item.title,
            baskiOption: item.baskiOption,
            renkOption: item.renkOption,
            desenOption: item.desenOption,
            adet: item.adet,
            priceUsd: item.priceUsd,
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("POST /api/orders error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
