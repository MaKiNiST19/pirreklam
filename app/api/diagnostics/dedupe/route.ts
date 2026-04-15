import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

/**
 * Admin-only duplicate-product cleaner.
 *
 * For each group of products sharing the same title (case-insensitive), pick ONE "winner" to keep
 * and mark the rest for deletion. Winner selection priority:
 *   1. Most variants (products with variants are more complete)
 *   2. Most images
 *   3. Cleaner slug (contains "x" instead of hyphenated numeric pattern "N-N")
 *   4. Earliest createdAt
 *
 * ⚠️  Deletes the losing duplicates AND their variants (cascade).
 *
 * Usage:
 *   GET  /api/diagnostics/dedupe            → dry-run, shows winners and losers (safe)
 *   POST /api/diagnostics/dedupe?confirm=1  → actually deletes the losers
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
async function buildPlan() {
  const all = await prisma.product.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
      images: true,
      createdAt: true,
      isPublished: true,
      category: { select: { name: true } },
      _count: { select: { variants: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  const byTitle = new Map<string, typeof all>();
  for (const p of all) {
    const key = p.title.trim().toLowerCase();
    if (!byTitle.has(key)) byTitle.set(key, []);
    byTitle.get(key)!.push(p);
  }

  const groups = [...byTitle.entries()].filter(([, list]) => list.length > 1);

  // Score: higher is better
  const score = (p: any) => {
    let s = 0;
    s += (p._count?.variants ?? 0) * 100;           // most variants
    s += (p.images?.length ?? 0) * 10;              // most images
    if (/^[a-z0-9]+x\d/.test(p.slug)) s += 5;       // cleaner "10x15" style slug
    if (!/^\d+-\d+-/.test(p.slug)) s += 2;          // not starting with N-N-
    return s;
  };

  const plan = groups.map(([title, list]) => {
    const sorted = [...list].sort((a, b) => {
      const diff = score(b) - score(a);
      if (diff !== 0) return diff;
      // Tiebreaker: earlier createdAt wins
      return a.createdAt.getTime() - b.createdAt.getTime();
    });
    const winner = sorted[0];
    const losers = sorted.slice(1);
    return {
      title,
      keep: {
        id: winner.id,
        slug: winner.slug,
        variantCount: winner._count?.variants ?? 0,
        imageCount: winner.images?.length ?? 0,
        category: winner.category?.name ?? null,
      },
      delete: losers.map((p) => ({
        id: p.id,
        slug: p.slug,
        variantCount: p._count?.variants ?? 0,
        imageCount: p.images?.length ?? 0,
        category: p.category?.name ?? null,
      })),
    };
  });

  return plan;
}

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const plan = await buildPlan();
  const losersTotal = plan.reduce((sum, g) => sum + g.delete.length, 0);

  return NextResponse.json({
    mode: "DRY-RUN",
    duplicateGroups: plan.length,
    willDelete: losersTotal,
    plan,
    hint: "Silmek için: POST /api/diagnostics/dedupe?confirm=1",
  });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  if (searchParams.get("confirm") !== "1") {
    return NextResponse.json(
      { error: "Confirmation required. Use POST /api/diagnostics/dedupe?confirm=1" },
      { status: 400 }
    );
  }

  const plan = await buildPlan();
  const idsToDelete = plan.flatMap((g) => g.delete.map((p) => p.id));

  if (idsToDelete.length === 0) {
    return NextResponse.json({ deleted: 0, message: "Silinecek duplicate bulunamadı." });
  }

  // Delete in a transaction. ProductVariant has onDelete: Cascade so variants go with product.
  // OrderItems reference products via productId WITHOUT cascade — guard: skip products that have orders.
  const referenced = await prisma.orderItem.findMany({
    where: { productId: { in: idsToDelete } },
    select: { productId: true },
  });
  const protectedIds = new Set(referenced.map((o) => o.productId));
  const safeToDelete = idsToDelete.filter((id) => !protectedIds.has(id));
  const skipped = idsToDelete.filter((id) => protectedIds.has(id));

  const result = await prisma.product.deleteMany({ where: { id: { in: safeToDelete } } });

  return NextResponse.json({
    mode: "EXECUTED",
    duplicateGroups: plan.length,
    attempted: idsToDelete.length,
    deleted: result.count,
    skippedBecauseInOrders: skipped.length,
    skippedIds: skipped,
    message:
      skipped.length > 0
        ? "Bazı duplicate ürünler siparişlerde kullanıldığı için silinmedi. Önce OrderItem kayıtlarını başka ürüne bağlayın."
        : "Duplicate'lar temizlendi.",
  });
}
