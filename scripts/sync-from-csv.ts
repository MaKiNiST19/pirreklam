/**
 * Compare CSV (old WordPress export) with DB, remove duplicates, import missing.
 *
 * Usage:
 *   npx tsx scripts/sync-from-csv.ts                 # dry-run (report only)
 *   npx tsx scripts/sync-from-csv.ts --apply         # actually delete dupes + insert missing
 *
 * Logic:
 *   - CSV "variable" rows are the canonical product list.
 *   - DB duplicates: same normalized slug (after stripping trailing -N suffix)
 *     OR identical title (case-insensitive). Keep the oldest, delete the rest.
 *   - Missing: CSV product whose slugified name is not in DB.
 *   - Missing products are imported with their variations (SKUs, attributes, price)
 *     and images (parent images + variation images).
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { parse } from "csv-parse/sync";
import * as fs from "fs";
import "dotenv/config";

const adapter = new PrismaPg(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

const APPLY = process.argv.includes("--apply");
const CSV_PATH =
  "C:\\Users\\Alp Tek Bilişim\\Downloads\\wc-product-export-16-4-2026-1776289553614.csv";

interface CsvRow {
  [key: string]: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Normalize slug for duplicate detection: strip trailing -2, -3 suffix
function normalizeSlug(slug: string): string {
  return slug.replace(/-\d+$/, "");
}

function normalizeTitle(t: string): string {
  return t.toLowerCase().replace(/\s+/g, " ").trim();
}

function decodeHtml(html: string): string {
  if (!html) return "";
  return html
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#8211;/g, "–")
    .replace(/&#8217;/g, "'")
    .replace(/&#215;/g, "×")
    .replace(/\\n/g, "\n");
}

function detectProductType(name: string, categoryStr: string): string | null {
  const c = `${name} ${categoryStr}`.toLowerCase();
  if (c.includes("termo deri")) return "termo_deri";
  if (c.includes("lüx suni deri") || c.includes("lux suni deri"))
    return "lux_suni_deri";
  if (c.includes("biala") || c.includes("pvc") || c.includes("mat biala"))
    return "mat_biala";
  if (c.includes("suni deri") || c.includes("dikişli")) return "lux_suni_deri";
  return null;
}

function parsePrice(priceStr: string): number {
  if (!priceStr || priceStr.trim() === "") return 0;
  const tryPrice = parseFloat(priceStr.replace(",", ".").replace(/[^\d.]/g, ""));
  if (isNaN(tryPrice) || tryPrice === 0) return 0;
  return Math.round((tryPrice / 38) * 10000) / 10000;
}

function parseAdet(adetStr: string): number {
  if (!adetStr) return 100;
  const m = adetStr.match(/(\d+)/);
  return m ? parseInt(m[1]) : 100;
}

function getAttrByName(row: CsvRow, attrName: string): string {
  for (let i = 1; i <= 4; i++) {
    const nameKey = `Nitelik ${i} ismi`;
    const valueKey = `Nitelik ${i} değer(ler)i`;
    if (row[nameKey] && row[nameKey].trim().toUpperCase() === attrName.toUpperCase()) {
      return row[valueKey]?.trim() || "";
    }
  }
  return "";
}

async function resolveCategoryId(categoryStr: string): Promise<string | null> {
  if (!categoryStr) return null;
  const catParts = categoryStr.split(",").map((c) => c.trim());
  // Sort deepest → shallowest so we try the most specific category first
  const sorted = [...catParts].sort(
    (a, b) => b.split(">").length - a.split(">").length,
  );
  for (const part of sorted) {
    const leaf = part.split(">").pop()?.trim() || "";
    const s = slugify(leaf);
    if (!s) continue;
    const cat = await prisma.category.findUnique({ where: { slug: s } });
    if (cat) return cat.id;
  }
  return null;
}

async function importVariations(
  productId: string,
  variations: CsvRow[],
  productSlug: string,
): Promise<number> {
  // Clear any existing variants for this product
  await prisma.productVariant.deleteMany({ where: { productId } });

  let count = 0;
  const usedSkus = new Set<string>();

  for (let i = 0; i < variations.length; i++) {
    const v = variations[i];
    const sku = v["Stok kodu (SKU)"]?.trim() || `${productSlug}-VAR-${i + 1}`;
    const price = parsePrice(v["Normal fiyat"] || v["İndirimli satış fiyatı"]);

    const baski = getAttrByName(v, "BASKI SEÇENEKLERİ");
    const renk =
      getAttrByName(v, "MAT BİALA RENKLER") ||
      getAttrByName(v, "TERMO DERİ RENKLER") ||
      getAttrByName(v, "LÜX SUNİ DERİ RENKLER") ||
      getAttrByName(v, "RENKLER") ||
      getAttrByName(v, "RENKLER (PVC ŞEFFAF)");
    const desen =
      getAttrByName(v, "TERMO DERİ DESENLER") ||
      getAttrByName(v, "LÜX SUNİ DERİ DESENLER") ||
      getAttrByName(v, "DESENLER");
    const adet = parseAdet(getAttrByName(v, "TOPLAM ADET"));
    const sortOrder = parseInt(v["Konum"] || `${i}`) || i;
    const image =
      (v["Görseller"] || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)[0] || null;

    let finalSku = sku;
    if (usedSkus.has(finalSku)) finalSku = `${sku}-${i}`;
    usedSkus.add(finalSku);

    // Global SKU uniqueness — append suffix on collision
    const existing = await prisma.productVariant.findUnique({
      where: { sku: finalSku.slice(0, 100) },
    });
    if (existing) {
      finalSku = `${finalSku}-${Date.now()}-${i}`;
    }

    try {
      await prisma.productVariant.create({
        data: {
          productId,
          sku: finalSku.slice(0, 100),
          baskiOption: baski || null,
          renkOption: renk || null,
          desenOption: desen || null,
          adet,
          priceUsd: price > 0 ? price : 0.1,
          image,
          isCompatible: true,
          stockCode: sku.slice(0, 100),
          sortOrder,
        },
      });
      count++;
    } catch (e) {
      console.warn(`   ⚠ variant create failed sku=${finalSku}:`, (e as Error).message);
    }
  }

  return count;
}

async function main() {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`sync-from-csv.ts   mode=${APPLY ? "APPLY ⚠" : "DRY-RUN"}`);
  console.log("=".repeat(60));

  // 1. Parse CSV
  console.log("\n📂 Reading CSV...");
  const csvContent = fs.readFileSync(CSV_PATH, "utf-8");
  const rows: CsvRow[] = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    relax_column_count: true,
    bom: true,
  });

  const parentRows = rows.filter(
    (r) => r["Tür"] === "variable" || r["Tür"] === "simple",
  );
  const variationRows = rows.filter((r) => r["Tür"] === "variation");
  console.log(
    `   CSV rows: total=${rows.length}, parents=${parentRows.length}, variations=${variationRows.length}`,
  );

  const variationsByParentId = new Map<string, CsvRow[]>();
  for (const v of variationRows) {
    const pid = v["Ebeveyn"]?.replace("id:", "").trim() || "";
    if (!pid) continue;
    if (!variationsByParentId.has(pid)) variationsByParentId.set(pid, []);
    variationsByParentId.get(pid)!.push(v);
  }

  // Build CSV canonical map: normalized slug → first parent row
  const csvBySlug = new Map<string, CsvRow>();
  for (const p of parentRows) {
    const name = decodeHtml(p["İsim"]?.trim() || "");
    if (!name) continue;
    const slug = slugify(name);
    if (!csvBySlug.has(slug)) csvBySlug.set(slug, p);
  }
  console.log(`   CSV unique product slugs: ${csvBySlug.size}`);

  // 2. Load DB products (with variant counts)
  console.log("\n📥 Loading DB products...");
  const dbProducts = await prisma.product.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
      createdAt: true,
      images: true,
      _count: { select: { variants: true } },
    },
    orderBy: { createdAt: "asc" },
  });
  console.log(`   DB products: ${dbProducts.length}`);

  // 3. Detect duplicates
  console.log("\n🔍 Detecting duplicates...");
  // Group by normalized slug AND by normalized title
  const groupsBySlug = new Map<string, typeof dbProducts>();
  const groupsByTitle = new Map<string, typeof dbProducts>();
  for (const p of dbProducts) {
    const ns = normalizeSlug(p.slug);
    const nt = normalizeTitle(p.title);
    if (!groupsBySlug.has(ns)) groupsBySlug.set(ns, []);
    groupsBySlug.get(ns)!.push(p);
    if (!groupsByTitle.has(nt)) groupsByTitle.set(nt, []);
    groupsByTitle.get(nt)!.push(p);
  }

  const duplicatesToDelete = new Set<string>(); // product IDs
  const duplicateGroups: { keeper: string; drops: string[]; reason: string }[] = [];

  const processGroup = (group: typeof dbProducts, reason: string) => {
    if (group.length <= 1) return;
    // Selection order for keeper:
    //   1) Slug without trailing -N suffix is preferred (cleaner)
    //   2) More variants wins
    //   3) More images wins
    //   4) Older wins
    const sorted = [...group].sort((a, b) => {
      const aSuffix = /-\d+$/.test(a.slug) ? 1 : 0;
      const bSuffix = /-\d+$/.test(b.slug) ? 1 : 0;
      if (aSuffix !== bSuffix) return aSuffix - bSuffix;
      if (a._count.variants !== b._count.variants)
        return b._count.variants - a._count.variants;
      if (a.images.length !== b.images.length)
        return b.images.length - a.images.length;
      return a.createdAt.getTime() - b.createdAt.getTime();
    });
    const [keeper, ...drops] = sorted;
    duplicateGroups.push({
      keeper: `${keeper.title}  (${keeper.slug})  [v:${keeper._count.variants} i:${keeper.images.length}]`,
      drops: drops.map(
        (d) => `${d.title}  (${d.slug})  [v:${d._count.variants} i:${d.images.length}]`,
      ),
      reason,
    });
    drops.forEach((d) => duplicatesToDelete.add(d.id));
  };

  for (const [, g] of groupsBySlug) processGroup(g, "same normalized slug");
  // For title groups, skip if all items already in duplicatesToDelete from slug pass
  for (const [, g] of groupsByTitle) {
    const remaining = g.filter((p) => !duplicatesToDelete.has(p.id));
    if (remaining.length > 1) processGroup(remaining, "same title");
  }

  console.log(
    `   Duplicate groups: ${duplicateGroups.length}, products to delete: ${duplicatesToDelete.size}`,
  );
  if (duplicateGroups.length > 0) {
    console.log("\n   Sample duplicates (first 10):");
    duplicateGroups.slice(0, 10).forEach((g, i) => {
      console.log(`   ${i + 1}. [${g.reason}] KEEP: ${g.keeper}`);
      g.drops.forEach((d) => console.log(`      DROP: ${d}`));
    });
  }

  // 4. Detect missing
  console.log("\n🔍 Detecting missing products...");
  const dbSlugSet = new Set(
    dbProducts
      .filter((p) => !duplicatesToDelete.has(p.id))
      .map((p) => p.slug),
  );
  // Also include normalized slugs so "foo" and "foo-2" both block
  const dbNormSlugSet = new Set(
    Array.from(dbSlugSet).map((s) => normalizeSlug(s)),
  );
  const dbTitleSet = new Set(
    dbProducts
      .filter((p) => !duplicatesToDelete.has(p.id))
      .map((p) => normalizeTitle(p.title)),
  );

  const missing: { row: CsvRow; slug: string; name: string }[] = [];
  for (const [slug, row] of csvBySlug) {
    const name = decodeHtml(row["İsim"]?.trim() || "");
    const nt = normalizeTitle(name);
    if (dbSlugSet.has(slug)) continue;
    if (dbNormSlugSet.has(normalizeSlug(slug))) continue;
    if (dbTitleSet.has(nt)) continue;
    missing.push({ row, slug, name });
  }
  console.log(`   Missing products: ${missing.length}`);
  if (missing.length > 0) {
    console.log("\n   Sample missing (first 15):");
    missing.slice(0, 15).forEach((m, i) => {
      const vars = variationsByParentId.get(m.row["Kimlik"]?.trim() || "") || [];
      console.log(`   ${i + 1}. ${m.name}  (slug=${m.slug}, variants=${vars.length})`);
    });
  }

  // 5. Apply changes
  if (!APPLY) {
    console.log(`\n${"=".repeat(60)}`);
    console.log("DRY-RUN done. Re-run with --apply to execute changes.");
    console.log(`  will DELETE: ${duplicatesToDelete.size} products (+ cascade variants)`);
    console.log(`  will INSERT: ${missing.length} products (with variants & images)`);
    console.log("=".repeat(60));
    await prisma.$disconnect();
    return;
  }

  console.log(`\n⚠  APPLY mode — executing changes...`);

  // 5a. Delete duplicates (ProductVariant cascades via onDelete: Cascade)
  if (duplicatesToDelete.size > 0) {
    console.log(`\n🗑  Deleting ${duplicatesToDelete.size} duplicate products...`);
    const ids = Array.from(duplicatesToDelete);
    // Delete order items referencing these products first (no cascade defined)
    await prisma.orderItem.deleteMany({ where: { productId: { in: ids } } });
    const delResult = await prisma.product.deleteMany({
      where: { id: { in: ids } },
    });
    console.log(`   Deleted ${delResult.count} products`);
  }

  // 5b. Insert missing
  if (missing.length > 0) {
    console.log(`\n➕ Inserting ${missing.length} missing products...`);
    let insProd = 0;
    let insVar = 0;
    let failed = 0;

    for (const m of missing) {
      const row = m.row;
      const wpId = row["Kimlik"]?.trim();
      const name = m.name;
      const categoryStr = row["Kategoriler"]?.trim() || "";
      const images = (row["Görseller"] || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const published = row["Yayımlanmış"] !== "-1" && row["Yayımlanmış"] !== "0";
      const productType = detectProductType(name, categoryStr);
      const categoryId = await resolveCategoryId(categoryStr);

      // Ensure slug is unique in DB (append -N if needed)
      let finalSlug = m.slug;
      let n = 2;
      while (await prisma.product.findUnique({ where: { slug: finalSlug } })) {
        finalSlug = `${m.slug}-${n++}`;
        if (n > 20) break;
      }

      try {
        const product = await prisma.product.create({
          data: {
            title: name,
            slug: finalSlug,
            description: row["Açıklama"] ? decodeHtml(row["Açıklama"]) : null,
            shortDesc: row["Kısa açıklama"]
              ? decodeHtml(row["Kısa açıklama"])
              : null,
            images,
            categoryId,
            productType,
            isPublished: published,
            menuOrder: parseInt(row["Konum"] || "0") || 0,
          },
        });
        insProd++;

        const variations = variationsByParentId.get(wpId || "") || [];
        if (variations.length > 0) {
          const c = await importVariations(product.id, variations, finalSlug);
          insVar += c;
        } else {
          // Single-variant fallback from parent attrs
          const baski = getAttrByName(row, "BASKI SEÇENEKLERİ");
          const renk =
            getAttrByName(row, "MAT BİALA RENKLER") ||
            getAttrByName(row, "TERMO DERİ RENKLER") ||
            getAttrByName(row, "LÜX SUNİ DERİ RENKLER") ||
            getAttrByName(row, "RENKLER");
          const adetStr = getAttrByName(row, "TOPLAM ADET");
          if (adetStr) {
            const adetOptions = adetStr
              .split(",")
              .map((a) => a.trim())
              .filter(Boolean);
            for (let i = 0; i < adetOptions.length; i++) {
              const adet = parseAdet(adetOptions[i]);
              const sku = `${finalSlug}-${adet}`
                .toUpperCase()
                .replace(/[^A-Z0-9-]/g, "")
                .slice(0, 50);
              try {
                await prisma.productVariant.create({
                  data: {
                    productId: product.id,
                    sku:
                      (await prisma.productVariant.findUnique({ where: { sku } }))
                        ? `${sku}-${Date.now()}-${i}`.slice(0, 100)
                        : sku,
                    baskiOption: baski || null,
                    renkOption: renk || null,
                    adet,
                    priceUsd: 0.1,
                    isCompatible: true,
                    stockCode: sku,
                    sortOrder: i,
                  },
                });
                insVar++;
              } catch {}
            }
          }
        }
        process.stdout.write(`   ✅ ${insProd}/${missing.length}: ${name.substring(0, 55)}\n`);
      } catch (e) {
        failed++;
        console.warn(`   ❌ failed: ${name}:`, (e as Error).message);
      }
    }

    console.log(`\n   Inserted products: ${insProd}, variants: ${insVar}, failed: ${failed}`);
  }

  // Final summary
  const totalP = await prisma.product.count();
  const totalV = await prisma.productVariant.count();
  console.log(`\n${"=".repeat(60)}`);
  console.log("✅ Sync complete");
  console.log(`   Products in DB now: ${totalP}`);
  console.log(`   Variants in DB now: ${totalV}`);
  console.log("=".repeat(60));

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("❌ failed:", e);
  prisma.$disconnect();
  process.exit(1);
});
