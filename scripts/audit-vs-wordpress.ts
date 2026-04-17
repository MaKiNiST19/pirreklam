/**
 * WordPress vs Neon Audit
 *
 * Compares what currently exists on pirreklam.com.tr (WordPress/WooCommerce)
 * against what is in the Neon DB. Produces a gap report:
 *   - Categories on WP missing from Neon
 *   - Products on WP missing from Neon
 *   - Products whose variant count / variant options differ
 *   - Empty categories (exist on WP but no products)
 *
 * Read-only — does NOT write anything. Run:
 *   npx tsx scripts/audit-vs-wordpress.ts
 *
 * For a machine-readable report, pass --json:
 *   npx tsx scripts/audit-vs-wordpress.ts --json > audit.json
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

const WP_BASE = "https://pirreklam.com.tr";
const WC_STORE_API = `${WP_BASE}/wp-json/wc/store/v1`;
const WC_API_V3 = `${WP_BASE}/wp-json/wc/v3`;

const WP_USER = "pirreklam";
const WP_PASS = "E1#yMKy#B$nc*2&BPSdaCA*D";
const WP_AUTH = Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");

const jsonMode = process.argv.includes("--json");
const log = (...args: unknown[]) => {
  if (!jsonMode) console.log(...args);
};

interface WpCategory {
  id: number;
  name: string;
  slug: string;
  parent: number;
  count: number;
}

interface WpAttribute {
  id: number;
  name: string;
  slug?: string;
  options: string[];
  variation: boolean;
}

interface WcProduct {
  id: number;
  name: string;
  slug: string;
  type: string;
  status?: string;
  categories: Array<{ id: number; name: string; slug: string }>;
  attributes: WpAttribute[];
  // WC REST v3 returns variations as number[]; Store API omits this field
  // (we fetch /products/{id} for the count when missing).
  variations?: number[];
}

async function fetchJson<T>(url: string, useAuth = false): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (useAuth) headers["Authorization"] = `Basic ${WP_AUTH}`;
  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText} — ${url}`);
  }
  return res.json() as Promise<T>;
}

async function fetchAllPages<T>(baseUrl: string, useAuth = false): Promise<T[]> {
  const out: T[] = [];
  let page = 1;
  const perPage = 100;
  while (true) {
    const sep = baseUrl.includes("?") ? "&" : "?";
    const url = `${baseUrl}${sep}per_page=${perPage}&page=${page}`;
    try {
      const items = await fetchJson<T[]>(url, useAuth);
      if (!items || items.length === 0) break;
      out.push(...items);
      if (items.length < perPage) break;
      page++;
    } catch {
      break;
    }
  }
  return out;
}

async function main() {
  log("🔎 WordPress → Neon AUDIT\n" + "=".repeat(60));

  // --- Fetch WP state
  log("\n📁 Fetching WP categories...");
  const wpCats = await fetchAllPages<WpCategory>(
    `${WC_STORE_API}/products/categories`
  );
  log(`   WP categories (count, inc. empty): ${wpCats.length}`);

  log("\n📦 Fetching WP products...");
  // Try WC REST v3 (needs consumer key/secret — basic auth may return 0).
  // If <= 5 or fails, fall back to Store API which is public.
  let wpProducts: WcProduct[] = [];
  try {
    wpProducts = await fetchAllPages<WcProduct>(`${WC_API_V3}/products?status=publish`, true);
    log(`   WP products (WC REST v3): ${wpProducts.length}`);
  } catch (e) {
    log(`   ⚠️ WC REST v3 error: ${(e as Error).message}`);
  }
  if (wpProducts.length < 10) {
    log("   Falling back to public Store API...");
    wpProducts = await fetchAllPages<WcProduct>(`${WC_STORE_API}/products`);
    log(`   WP products (Store API): ${wpProducts.length}`);
  }

  // --- Fetch Neon state
  log("\n🗄️  Fetching Neon DB state...");
  const dbCats = await prisma.category.findMany({
    select: { slug: true, name: true, parentId: true, _count: { select: { products: true } } },
  });
  const dbProducts = await prisma.product.findMany({
    select: {
      slug: true,
      title: true,
      _count: { select: { variants: true } },
      variants: {
        select: { baskiOption: true, renkOption: true, desenOption: true, adet: true },
      },
    },
  });
  log(`   Neon categories: ${dbCats.length}`);
  log(`   Neon products: ${dbProducts.length}`);

  // --- Category diff
  const dbCatSlugs = new Set(dbCats.map((c) => c.slug));
  const wpCatSlugs = new Set(wpCats.map((c) => c.slug));

  const missingCats = wpCats.filter((c) => !dbCatSlugs.has(c.slug));
  const extraCats = [...dbCatSlugs].filter((s) => !wpCatSlugs.has(s));

  // Empty categories (exist but 0 products)
  const wpEmptyCats = wpCats.filter((c) => c.count === 0);
  const dbEmptyCats = dbCats.filter((c) => c._count.products === 0);

  // --- Product diff
  // Normalise slugs to absorb Turkish-character drift:
  //   WP   "ekonomik-ince-mat-biala-ruhsat-kabi"
  //   Neon "ekonomik-i-nce-mat-biala-ruhsat-kabi" (İ → "i-")
  // Also "0-25" vs "025" (decimal hyphenation).
  function normSlug(s: string): string {
    // Aggressive: strip every non-alphanumeric char and lowercase.
    // Absorbs:
    //   "18x24" vs "18-24" vs "1824"
    //   "0-25" vs "025"
    //   "is-makinasi" vs "i-s-makinasi" (İ→is vs İ→i-s)
    //   "ekonomik-ince" vs "ekonomik-i-nce"
    // Risk: two different products with near-identical letter sequences could
    // collide — extremely unlikely in this catalogue (all products are
    // distinct phrases). Review the "extraProductsInNeon" list to confirm.
    return s
      .toLowerCase()
      // Dimension separator: "10x15" vs "10-15" (×/-/x all mean the same)
      .replace(/(\d)[x×](\d)/g, "$1$2")
      // Drop all non-alphanumerics
      .replace(/[^a-z0-9]/g, "");
  }

  const dbProductSlugs = new Set(dbProducts.map((p) => p.slug));
  const wpProductSlugs = new Set(wpProducts.map((p) => p.slug));
  const dbNormSlugs = new Map(dbProducts.map((p) => [normSlug(p.slug), p.slug]));
  const wpNormSlugs = new Map(wpProducts.map((p) => [normSlug(p.slug), p.slug]));

  const missingProducts = wpProducts.filter((p) => !dbNormSlugs.has(normSlug(p.slug)));
  const extraProducts = [...dbProductSlugs].filter((s) => !wpNormSlugs.has(normSlug(s)));

  // Slug drift = exists on both sides under different string forms
  const slugDrifts: Array<{ wp: string; neon: string }> = [];
  for (const wp of wpProducts) {
    const norm = normSlug(wp.slug);
    const neonSlug = dbNormSlugs.get(norm);
    if (neonSlug && neonSlug !== wp.slug) {
      slugDrifts.push({ wp: wp.slug, neon: neonSlug });
    }
  }

  // --- Variant diff: for each product that exists on both sides,
  // compare variation count. WP `variations` array holds variation IDs.
  const variantMismatches: Array<{
    slug: string;
    title: string;
    wpVariationCount: number;
    dbVariantCount: number;
    wpAttributeNames: string[];
    dbVariantDims: {
      baski: number;
      renk: number;
      desen: number;
      adet: number;
    };
  }> = [];

  // Map by normalised slug so slug-drift products are matched across sides
  const dbByNormSlug = new Map(dbProducts.map((p) => [normSlug(p.slug), p]));
  const dbBySlug = dbByNormSlug; // used below for variant comparison

  // If WC REST v3 not available, Store API lacks `variations` field.
  // Fetch per-product attribute options to derive expected variant count.
  // A variable product's variant count equals the product of attribute option sizes (approximation).
  function estimateWpVariantCount(p: WcProduct): number {
    if (p.variations && p.variations.length > 0) return p.variations.length;
    if (!p.attributes || p.attributes.length === 0) return 0;
    const varAttrs = p.attributes.filter((a) => a.variation !== false);
    if (varAttrs.length === 0) return 0;
    return varAttrs.reduce((acc, a) => acc * Math.max(1, a.options?.length ?? 0), 1);
  }

  for (const wp of wpProducts) {
    const norm = normSlug(wp.slug);
    if (!dbBySlug.has(norm)) continue;
    const db = dbBySlug.get(norm)!;
    const wpCount = estimateWpVariantCount(wp);
    const dbCount = db._count.variants;
    // Only flag when both sides have variants and counts differ.
    // (Simple products with 0 variants on both sides are not a mismatch.)
    if (wpCount > 0 && wpCount !== dbCount) {
      const baski = new Set(db.variants.map((v) => v.baskiOption).filter(Boolean)).size;
      const renk = new Set(db.variants.map((v) => v.renkOption).filter(Boolean)).size;
      const desen = new Set(db.variants.map((v) => v.desenOption).filter(Boolean)).size;
      const adet = new Set(db.variants.map((v) => v.adet)).size;
      variantMismatches.push({
        slug: wp.slug,
        title: wp.name,
        wpVariationCount: wpCount,
        dbVariantCount: dbCount,
        wpAttributeNames: wp.attributes?.map((a) => a.name) ?? [],
        dbVariantDims: { baski, renk, desen, adet },
      });
    }
  }

  // --- Products with 0 variants in DB
  const dbZeroVariant = dbProducts.filter((p) => p._count.variants === 0);

  // --- Report
  const summary = {
    wp: {
      categories: wpCats.length,
      products: wpProducts.length,
      emptyCategories: wpEmptyCats.length,
    },
    neon: {
      categories: dbCats.length,
      products: dbProducts.length,
      emptyCategories: dbEmptyCats.length,
      productsWithZeroVariants: dbZeroVariant.length,
    },
    gaps: {
      missingCategoriesCount: missingCats.length,
      missingProductsCount: missingProducts.length,
      extraCategoriesCount: extraCats.length,
      extraProductsCount: extraProducts.length,
      variantMismatchCount: variantMismatches.length,
    },
    details: {
      missingCategories: missingCats.map((c) => ({
        slug: c.slug,
        name: c.name,
        parentId: c.parent,
        wpProductCount: c.count,
      })),
      extraCategoriesInNeon: extraCats,
      missingProducts: missingProducts.map((p) => ({
        slug: p.slug,
        title: p.name,
        category: p.categories?.[0]?.slug ?? null,
        variationCount: estimateWpVariantCount(p),
      })),
      extraProductsInNeon: extraProducts,
      variantMismatches,
      slugDrifts,
      productsWithZeroVariants: dbZeroVariant.map((p) => p.slug),
      wpEmptyCategories: wpEmptyCats.map((c) => c.slug),
      dbEmptyCategories: dbEmptyCats.map((c) => c.slug),
    },
  };

  if (jsonMode) {
    process.stdout.write(JSON.stringify(summary, null, 2));
  } else {
    console.log("\n" + "=".repeat(60));
    console.log("📊 SUMMARY");
    console.log("=".repeat(60));
    console.log(`WP site:   ${summary.wp.categories} categories, ${summary.wp.products} products, ${summary.wp.emptyCategories} empty categories`);
    console.log(`Neon DB:   ${summary.neon.categories} categories, ${summary.neon.products} products, ${summary.neon.emptyCategories} empty`);
    console.log(`           ${summary.neon.productsWithZeroVariants} products have ZERO variants in DB`);
    console.log("\n🚨 GAPS");
    console.log(`  Categories missing from Neon: ${summary.gaps.missingCategoriesCount}`);
    console.log(`  Products missing from Neon:   ${summary.gaps.missingProductsCount}`);
    console.log(`  Extra categories in Neon:     ${summary.gaps.extraCategoriesCount}`);
    console.log(`  Extra products in Neon:       ${summary.gaps.extraProductsCount}`);
    console.log(`  Variant count mismatches:     ${summary.gaps.variantMismatchCount}`);
    console.log(`  Slug drifts (same product, different slug): ${slugDrifts.length}`);

    if (slugDrifts.length > 0) {
      console.log(`\n🔀 SLUG DRIFT (same product, slug differs — old site uses first, Neon uses second):`);
      for (const d of slugDrifts) {
        console.log(`   WP: ${d.wp}`);
        console.log(`   ≈  ${d.neon}  ← Neon`);
      }
    }

    if (missingCats.length > 0) {
      console.log("\n❌ MISSING CATEGORIES (in WP but not Neon):");
      for (const c of missingCats) {
        console.log(`   - ${c.slug} (${c.name}) [${c.count} products on WP]`);
      }
    }

    if (missingProducts.length > 0) {
      console.log(`\n❌ MISSING PRODUCTS (in WP but not Neon): first 40 shown`);
      for (const p of missingProducts.slice(0, 40)) {
        console.log(`   - ${p.slug} → ${p.name} [${estimateWpVariantCount(p)} variants]`);
      }
      if (missingProducts.length > 40) {
        console.log(`   ... and ${missingProducts.length - 40} more`);
      }
    }

    if (variantMismatches.length > 0) {
      console.log(`\n⚠️  VARIANT MISMATCHES (first 30 shown):`);
      for (const m of variantMismatches.slice(0, 30)) {
        console.log(
          `   - ${m.slug}: WP=${m.wpVariationCount} vs DB=${m.dbVariantCount}  | attrs: ${m.wpAttributeNames.join(", ") || "(none)"}`
        );
      }
      if (variantMismatches.length > 30) {
        console.log(`   ... and ${variantMismatches.length - 30} more`);
      }
    }

    if (dbZeroVariant.length > 0) {
      console.log(`\n⚠️  PRODUCTS WITH ZERO VARIANTS IN DB (first 30):`);
      for (const p of dbZeroVariant.slice(0, 30)) {
        console.log(`   - ${p.slug}`);
      }
      if (dbZeroVariant.length > 30) {
        console.log(`   ... and ${dbZeroVariant.length - 30} more`);
      }
    }

    if (extraCats.length > 0) {
      console.log(`\nℹ️  Extra categories in Neon (NOT on WP anymore): ${extraCats.length}`);
      for (const s of extraCats.slice(0, 20)) console.log(`   - ${s}`);
    }

    if (extraProducts.length > 0) {
      console.log(`\nℹ️  Extra products in Neon (NOT on WP anymore): ${extraProducts.length}`);
      for (const s of extraProducts.slice(0, 20)) console.log(`   - ${s}`);
    }

    console.log("\n" + "=".repeat(60));
    console.log("Run with --json for a machine-readable report:");
    console.log("  npx tsx scripts/audit-vs-wordpress.ts --json > audit.json");
    console.log("=".repeat(60));
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("Audit failed:", e);
  process.exit(1);
});
