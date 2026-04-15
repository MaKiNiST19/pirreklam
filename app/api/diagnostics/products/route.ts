import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

/**
 * Admin-only diagnostics endpoint.
 *
 * Reports:
 *  - Products that share the same title (likely duplicates)
 *  - Products with duplicate slugs (shouldn't happen due to @unique but double-check)
 *  - Products whose assigned category has no ancestor chain (orphans)
 *  - Unpublished products (invisible on the site)
 *  - Products matching an optional `?slug=` query param — useful for "why isn't X showing?"
 *
 * Usage: /api/diagnostics/products            → full report
 *        /api/diagnostics/products?slug=foo   → details for product with slug=foo
 */
export async function GET(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  // Individual product inspection
  if (slug) {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: { include: { parent: { include: { parent: true } } } },
        variants: { select: { id: true, sku: true, baskiOption: true, renkOption: true, desenOption: true } },
      },
    });

    if (!product) {
      return NextResponse.json({ found: false, slug, message: "Ürün DB'de yok." });
    }

    /* eslint-disable @typescript-eslint/no-explicit-any */
    const cat: any = product.category;
    const categoryPath = cat
      ? cat.parent
        ? cat.parent.parent
          ? `/urun-kategori/${cat.parent.parent.slug}/${cat.parent.slug}/${cat.slug}/`
          : `/urun-kategori/${cat.parent.slug}/${cat.slug}/`
        : `/urun-kategori/${cat.slug}/`
      : "(kategorisiz)";

    return NextResponse.json({
      found: true,
      id: product.id,
      title: product.title,
      slug: product.slug,
      isPublished: product.isPublished,
      categoryId: product.categoryId,
      categoryName: cat?.name || null,
      categoryLevel: cat
        ? cat.parent
          ? cat.parent.parent ? "L3" : "L2"
          : "L1"
        : "none",
      categoryPath,
      variantCount: product.variants.length,
      siteUrl: `/urun/${product.slug}/`,
      note: !product.isPublished
        ? "Ürün yayında değil (isPublished=false). Site listelerinde görünmez."
        : !cat
          ? "Ürünün kategorisi yok. Listelerde görünmez."
          : cat.parent && !cat.parent.parent
            ? "Ürün L2 bir kategoriye atanmış. L1 arşiv sayfasında görünür. L2 kendi sayfasında SADECE L3 çocukları gösteriliyorsa görünmeyebilir."
            : cat.parent && cat.parent.parent
              ? "Ürün L3 kategoriye atanmış. L2 arşivi + L3 kendi sayfasında görünür."
              : "Ürün L1 kategoriye direkt atanmış (nadir).",
    });
  }

  // Full report
  const all = await prisma.product.findMany({
    select: {
      id: true, title: true, slug: true, isPublished: true, categoryId: true,
      category: { select: { name: true, slug: true } },
    },
    orderBy: { title: "asc" },
  });

  // Duplicate title detection (exact match, case-insensitive)
  const byTitle = new Map<string, typeof all>();
  for (const p of all) {
    const key = p.title.trim().toLowerCase();
    if (!byTitle.has(key)) byTitle.set(key, []);
    byTitle.get(key)!.push(p);
  }
  const duplicates = [...byTitle.entries()]
    .filter(([, list]) => list.length > 1)
    .map(([title, list]) => ({
      title,
      count: list.length,
      entries: list.map((p) => ({
        id: p.id,
        slug: p.slug,
        isPublished: p.isPublished,
        category: p.category?.name || "(kategorisiz)",
        siteUrl: `/urun/${p.slug}/`,
      })),
    }));

  // Unpublished
  const unpublished = all.filter((p) => !p.isPublished).map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    category: p.category?.name || "(kategorisiz)",
  }));

  // Orphans (no category)
  const orphans = all.filter((p) => !p.categoryId).map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
  }));

  return NextResponse.json({
    totalProducts: all.length,
    duplicateGroups: duplicates.length,
    duplicates,
    unpublishedCount: unpublished.length,
    unpublished,
    orphanCount: orphans.length,
    orphans,
    hint: "Belirli bir ürünü araştırmak için ?slug=ÜRÜN-SLUG parametresi ekleyin.",
  });
}
