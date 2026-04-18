/**
 * One-shot WP → Neon catalogue sync (additive, never deletes)
 *
 * Phases:
 *   1. Add 13 WP products that have no match in Neon at all
 *   2. For every matched product, add variants that exist on WP but not in
 *      DB. Never removes DB-only variants (admin can clean those later).
 *
 * Slug policy: use the WP slug verbatim for new products so existing
 * Google rankings on pirreklam.com.tr map cleanly.
 *
 * Pricing policy: new variants get `priceUsd` = average of the product's
 * existing DB variants (or 0.10 placeholder). Admin fixes in panel.
 *
 * Usage:
 *   npx tsx scripts/sync-from-wp.ts              # dry-run (default)
 *   npx tsx scripts/sync-from-wp.ts --apply      # actually write
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

const WP_BASE = "https://pirreklam.com.tr";
const WC_STORE_API = `${WP_BASE}/wp-json/wc/store/v1`;

const APPLY = process.argv.includes("--apply");
const mode = APPLY ? "🟢 APPLY" : "🟡 DRY-RUN (pass --apply to write)";

interface WpTerm {
  id: number;
  name: string;
  slug: string;
}

interface WpAttribute {
  id: number;
  name: string;
  taxonomy?: string;
  has_variations?: boolean;
  terms?: WpTerm[];
}

interface WpVariationInline {
  id: number;
  attributes: Array<{ name: string; value: string }>;
}

interface WpImage {
  id: number;
  src: string;
  name?: string;
  alt?: string;
}

interface WcProductDetail {
  id: number;
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  type: string;
  attributes: WpAttribute[];
  variations: WpVariationInline[];
  categories: Array<{ id: number; slug: string; name: string }>;
  images: WpImage[];
  prices?: { price?: string; regular_price?: string; currency_minor_unit?: number };
  menu_order?: number;
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: { "Content-Type": "application/json" } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${url}`);
  return res.json() as Promise<T>;
}

async function fetchAllPages<T>(baseUrl: string): Promise<T[]> {
  const out: T[] = [];
  let page = 1;
  const perPage = 100;
  while (true) {
    const sep = baseUrl.includes("?") ? "&" : "?";
    const url = `${baseUrl}${sep}per_page=${perPage}&page=${page}`;
    try {
      const items = await fetchJson<T[]>(url);
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

function normSlug(s: string): string {
  return s
    .toLowerCase()
    .replace(/(\d)[x×](\d)/g, "$1$2")
    .replace(/[^a-z0-9]/g, "");
}

function classifyAttr(name: string): "baski" | "renk" | "desen" | "adet" | null {
  const n = name.toLowerCase();
  if (n.includes("baski") || n.includes("baskı") || n.includes("print")) return "baski";
  if (n.includes("renk") || n.includes("color") || n.includes("biala")) return "renk";
  if (n.includes("desen") || n.includes("pattern")) return "desen";
  if (n.includes("adet") || n.includes("toplam") || n.includes("quantity")) return "adet";
  return null;
}

function parseAdet(s: string): number | null {
  const digits = s.replace(/\D/g, "");
  if (!digits) return null;
  const n = parseInt(digits);
  return isNaN(n) ? null : n;
}

function decodeHtml(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#8211;/g, "–")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, "\u201C")
    .replace(/&#8221;/g, "\u201D");
}

function detectProductType(name: string, categoryNames: string[]): string | null {
  const combined = `${name} ${categoryNames.join(" ")}`.toLowerCase();
  if (combined.includes("termo deri") || combined.includes("termo-deri")) return "termo_deri";
  if (combined.includes("lüx suni") || combined.includes("lux suni")) return "lux_suni_deri";
  if (combined.includes("mat biala") || combined.includes("biala") || combined.includes("pvc"))
    return "mat_biala";
  if (combined.includes("suni deri")) return "lux_suni_deri";
  return null;
}

/**
 * Decode a WP variation (attributes are slug form like "1-renk-boya") into
 * our schema fields using the product's attribute→term mapping.
 */
function decodeVariation(
  variation: WpVariationInline,
  productAttrs: WpAttribute[]
): { baski: string | null; renk: string | null; desen: string | null; adet: number } {
  let baski: string | null = null;
  let renk: string | null = null;
  let desen: string | null = null;
  let adet = 100;

  for (const va of variation.attributes) {
    const parent = productAttrs.find(
      (a) => a.name.toLowerCase() === va.name.toLowerCase() ||
             a.taxonomy?.replace(/^pa_/, "") === va.value
    );
    const cls = classifyAttr(va.name);
    const term = parent?.terms?.find((t) => t.slug === va.value);
    const display = term?.name ?? va.value;
    if (cls === "baski") baski = display;
    else if (cls === "renk") renk = display;
    else if (cls === "desen") desen = display;
    else if (cls === "adet") {
      const n = parseAdet(display);
      if (n != null) adet = n;
    }
  }

  return { baski, renk, desen, adet };
}

/** Stable key for a variant tuple (for diff). */
function variantKey(baski: string | null, renk: string | null, desen: string | null, adet: number): string {
  const n = (s: string | null) => (s ?? "").trim().toLocaleLowerCase("tr").replace(/\s+/g, " ");
  return `${n(baski)}|${n(renk)}|${n(desen)}|${adet}`;
}

async function main() {
  console.log(`🚀 WP → Neon sync  [${mode}]\n` + "=".repeat(70));

  // ─── Fetch everything
  console.log("\n📦 Fetching WP product list...");
  const wpList = await fetchAllPages<{ id: number; slug: string; name: string }>(
    `${WC_STORE_API}/products`
  );
  console.log(`   ${wpList.length} products — fetching details...`);

  const details: WcProductDetail[] = [];
  const BATCH = 5;
  for (let i = 0; i < wpList.length; i += BATCH) {
    const chunk = wpList.slice(i, i + BATCH);
    const results = await Promise.all(
      chunk.map((p) =>
        fetchJson<WcProductDetail>(`${WC_STORE_API}/products/${p.id}`).catch(
          (e) => {
            console.log(`   ⚠️ ${p.slug}: ${(e as Error).message}`);
            return null;
          }
        )
      )
    );
    for (const r of results) if (r) details.push(r);
  }
  console.log(`   ✓ ${details.length} WP product details`);

  console.log("\n🗄️  Fetching Neon state...");
  const dbProducts = await prisma.product.findMany({
    include: { variants: true },
  });
  const dbCats = await prisma.category.findMany({ select: { id: true, slug: true } });
  const dbCatBySlug = new Map(dbCats.map((c) => [c.slug, c.id]));
  const dbByNorm = new Map(dbProducts.map((p) => [normSlug(p.slug), p]));
  console.log(`   ${dbProducts.length} products, ${dbCats.length} categories`);

  let phase1Count = 0;
  let phase1Variants = 0;
  let phase2Count = 0;
  let phase2Variants = 0;

  // ─── PHASE 1: missing products
  console.log("\n" + "=".repeat(70));
  console.log("PHASE 1 — Add missing products");
  console.log("=".repeat(70));

  const missingProducts = details.filter((wp) => !dbByNorm.has(normSlug(wp.slug)));
  console.log(`Found ${missingProducts.length} products on WP with no Neon match.\n`);

  for (const wp of missingProducts) {
    // Pick deepest (most specific) category that exists in our DB
    let categoryId: string | null = null;
    if (wp.categories && wp.categories.length > 0) {
      for (let i = wp.categories.length - 1; i >= 0; i--) {
        const slug = wp.categories[i].slug;
        if (dbCatBySlug.has(slug)) {
          categoryId = dbCatBySlug.get(slug)!;
          break;
        }
      }
    }
    const categoryNames = wp.categories?.map((c) => c.name) ?? [];
    const productType = detectProductType(wp.name, categoryNames);
    const images = wp.images?.map((img) => img.src) ?? [];
    const title = decodeHtml(wp.name);

    console.log(`+ ${wp.slug}`);
    console.log(`   → "${title}"  [${wp.variations.length} variations]`);
    console.log(`   → category: ${wp.categories?.[wp.categories.length - 1]?.slug ?? "(none)"}  mapped=${!!categoryId}`);
    console.log(`   → images: ${images.length}`);

    if (!APPLY) {
      phase1Count++;
      phase1Variants += wp.variations.length;
      continue;
    }

    try {
      const created = await prisma.product.create({
        data: {
          title,
          slug: wp.slug,
          description: wp.description || null,
          shortDesc: wp.short_description || null,
          images,
          categoryId,
          productType,
          menuOrder: wp.menu_order ?? 0,
          isPublished: true,
        },
      });

      // Create variants
      const seen = new Set<string>();
      let variantIndex = 0;
      for (const v of wp.variations) {
        const dec = decodeVariation(v, wp.attributes);
        const key = variantKey(dec.baski, dec.renk, dec.desen, dec.adet);
        if (seen.has(key)) continue; // dedupe
        seen.add(key);
        variantIndex++;
        const sku = `${wp.slug.toUpperCase().slice(0, 40)}-V${variantIndex}`;
        await prisma.productVariant.create({
          data: {
            productId: created.id,
            sku: `${sku}-${v.id}`,
            baskiOption: dec.baski,
            renkOption: dec.renk,
            desenOption: dec.desen,
            adet: dec.adet,
            priceUsd: 0.1, // placeholder; admin sets in panel
            isCompatible: true,
            stockCode: sku,
            sortOrder: variantIndex,
          },
        });
      }
      console.log(`   ✓ created with ${variantIndex} unique variants`);
      phase1Count++;
      phase1Variants += variantIndex;
    } catch (e) {
      console.log(`   ❌ FAILED: ${(e as Error).message}`);
    }
  }

  // ─── PHASE 2: add missing variants to existing products
  console.log("\n" + "=".repeat(70));
  console.log("PHASE 2 — Add missing variants to existing products");
  console.log("=".repeat(70));

  // Refresh if we wrote in phase 1
  const dbProducts2 = APPLY
    ? await prisma.product.findMany({ include: { variants: true } })
    : dbProducts;
  const dbByNorm2 = new Map(dbProducts2.map((p) => [normSlug(p.slug), p]));

  for (const wp of details) {
    const db = dbByNorm2.get(normSlug(wp.slug));
    if (!db) continue; // handled in phase 1
    if (!wp.variations || wp.variations.length === 0) continue;

    // Existing variant keys
    const existingKeys = new Set(
      db.variants.map((v) => variantKey(v.baskiOption, v.renkOption, v.desenOption, v.adet))
    );

    // Build list of variants to add
    const toAdd: Array<{
      baski: string | null;
      renk: string | null;
      desen: string | null;
      adet: number;
      wpId: number;
    }> = [];
    const seenNew = new Set<string>();
    for (const v of wp.variations) {
      const dec = decodeVariation(v, wp.attributes);
      const key = variantKey(dec.baski, dec.renk, dec.desen, dec.adet);
      if (existingKeys.has(key) || seenNew.has(key)) continue;
      seenNew.add(key);
      toAdd.push({ ...dec, wpId: v.id });
    }

    if (toAdd.length === 0) continue;

    // Average priceUsd from existing variants (or 0.10)
    const prices = db.variants
      .map((v) => Number(v.priceUsd))
      .filter((n) => Number.isFinite(n) && n > 0);
    const avgPrice =
      prices.length > 0
        ? Math.round((prices.reduce((a, b) => a + b, 0) / prices.length) * 10000) / 10000
        : 0.1;

    console.log(`* ${wp.slug}  [+${toAdd.length} variants, price=${avgPrice}]`);
    if (toAdd.length <= 5) {
      for (const t of toAdd) {
        console.log(`    + baski="${t.baski ?? "—"}" renk="${t.renk ?? "—"}" desen="${t.desen ?? "—"}" adet=${t.adet}`);
      }
    } else {
      for (const t of toAdd.slice(0, 3)) {
        console.log(`    + baski="${t.baski ?? "—"}" renk="${t.renk ?? "—"}" desen="${t.desen ?? "—"}" adet=${t.adet}`);
      }
      console.log(`    ... and ${toAdd.length - 3} more`);
    }

    phase2Count++;
    phase2Variants += toAdd.length;

    if (!APPLY) continue;

    // Existing max sortOrder so new variants sort after them
    const maxSort = db.variants.reduce((m, v) => (v.sortOrder > m ? v.sortOrder : m), 0);

    let sortIdx = maxSort;
    for (const t of toAdd) {
      sortIdx++;
      const baseSku = `${db.slug.toUpperCase().slice(0, 40)}-V${sortIdx}-${t.wpId}`;
      try {
        await prisma.productVariant.create({
          data: {
            productId: db.id,
            sku: baseSku,
            baskiOption: t.baski,
            renkOption: t.renk,
            desenOption: t.desen,
            adet: t.adet,
            priceUsd: avgPrice,
            isCompatible: true,
            stockCode: baseSku,
            sortOrder: sortIdx,
          },
        });
      } catch (e) {
        const msg = (e as Error).message;
        // SKU collision — add timestamp suffix
        try {
          await prisma.productVariant.create({
            data: {
              productId: db.id,
              sku: `${baseSku}-${Date.now()}`,
              baskiOption: t.baski,
              renkOption: t.renk,
              desenOption: t.desen,
              adet: t.adet,
              priceUsd: avgPrice,
              isCompatible: true,
              stockCode: baseSku,
              sortOrder: sortIdx,
            },
          });
        } catch (e2) {
          console.log(`    ❌ variant failed: ${msg} / ${(e2 as Error).message}`);
        }
      }
    }
  }

  // ─── Summary
  console.log("\n" + "=".repeat(70));
  console.log("📊 SUMMARY  " + mode);
  console.log("=".repeat(70));
  console.log(`Phase 1: ${phase1Count} products ${APPLY ? "created" : "would create"}  (${phase1Variants} variants)`);
  console.log(`Phase 2: ${phase2Count} products ${APPLY ? "got" : "would get"} new variants  (+${phase2Variants})`);
  console.log(`Total new variants: ${phase1Variants + phase2Variants}`);
  if (!APPLY) {
    console.log("\nDRY-RUN complete. Review above, then run with --apply to write.");
  }
  console.log("=".repeat(70));

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("Sync failed:", e);
  process.exit(1);
});
