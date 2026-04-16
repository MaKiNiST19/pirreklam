/**
 * SKU-based sync: match DB products to CSV parents using variant SKU overlap.
 * This correctly handles CSV products that share the same title (different WP IDs).
 *
 * Usage:
 *   npx tsx scripts/sync-by-sku.ts           # dry-run
 *   npx tsx scripts/sync-by-sku.ts --apply   # insert missing
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
  if (c.includes("lüx suni deri") || c.includes("lux suni deri")) return "lux_suni_deri";
  if (c.includes("biala") || c.includes("pvc") || c.includes("mat biala")) return "mat_biala";
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

async function main() {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`sync-by-sku.ts   mode=${APPLY ? "APPLY ⚠" : "DRY-RUN"}`);
  console.log("=".repeat(60));

  // 1. Parse CSV
  console.log("\n📂 Reading CSV...");
  const rows: CsvRow[] = parse(fs.readFileSync(CSV_PATH, "utf-8"), {
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
    `   CSV parents=${parentRows.length}, variations=${variationRows.length}`,
  );

  // Map parent WP_ID → variations
  const varsByParentWpId = new Map<string, CsvRow[]>();
  for (const v of variationRows) {
    const pid = v["Ebeveyn"]?.replace("id:", "").trim() || "";
    if (!pid) continue;
    if (!varsByParentWpId.has(pid)) varsByParentWpId.set(pid, []);
    varsByParentWpId.get(pid)!.push(v);
  }

  // Map variation SKU → parent WP_ID
  const skuToParentId = new Map<string, string>();
  for (const v of variationRows) {
    const pid = v["Ebeveyn"]?.replace("id:", "").trim() || "";
    const sku = v["Stok kodu (SKU)"]?.trim() || "";
    if (pid && sku) skuToParentId.set(sku, pid);
  }

  // 2. Load DB
  console.log("\n📥 Loading DB products & variants...");
  const dbProducts = await prisma.product.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
      variants: { select: { sku: true, stockCode: true } },
    },
  });
  console.log(`   DB products: ${dbProducts.length}`);
  const totalDbVars = dbProducts.reduce((s, p) => s + p.variants.length, 0);
  console.log(`   DB variants: ${totalDbVars}`);

  // 3. For each DB product, find matching CSV parent WP_ID by SKU overlap
  const dbToWpId = new Map<string, string>(); // dbProductId → wpId
  const wpIdToDbProducts = new Map<string, string[]>(); // wpId → dbProductIds

  for (const p of dbProducts) {
    const votes = new Map<string, number>();
    for (const v of p.variants) {
      const candidates = [v.sku, v.stockCode].filter(Boolean) as string[];
      for (const s of candidates) {
        const wp = skuToParentId.get(s);
        if (wp) votes.set(wp, (votes.get(wp) || 0) + 1);
      }
    }
    let best: string | null = null;
    let bestCount = 0;
    for (const [wp, c] of votes) {
      if (c > bestCount) { best = wp; bestCount = c; }
    }
    if (best) {
      dbToWpId.set(p.id, best);
      if (!wpIdToDbProducts.has(best)) wpIdToDbProducts.set(best, []);
      wpIdToDbProducts.get(best)!.push(p.id);
    }
  }

  const matchedBySku = dbToWpId.size;
  console.log(`   Matched by SKU: ${matchedBySku}/${dbProducts.length}`);

  // Fallback: title + variant count matching for unmatched DB products
  const unclaimedParents = parentRows.filter((p) => {
    const wp = p["Kimlik"]?.trim() || "";
    return !wpIdToDbProducts.has(wp);
  });
  let matchedByTitle = 0;
  for (const dbP of dbProducts) {
    if (dbToWpId.has(dbP.id)) continue;
    const normTitle = dbP.title.toLowerCase().replace(/\s+/g, " ").trim();
    const candidates = unclaimedParents.filter((p) => {
      const pn = decodeHtml(p["İsim"] || "").toLowerCase().replace(/\s+/g, " ").trim();
      return pn === normTitle;
    });
    if (candidates.length === 0) continue;
    // Prefer candidate with same variation count
    const withVar = candidates.find((p) => {
      const wp = p["Kimlik"]?.trim() || "";
      const varCount = varsByParentWpId.get(wp)?.length ?? 0;
      return varCount === dbP.variants.length;
    });
    const pick = withVar || candidates[0];
    const wp = pick["Kimlik"]?.trim() || "";
    dbToWpId.set(dbP.id, wp);
    if (!wpIdToDbProducts.has(wp)) wpIdToDbProducts.set(wp, []);
    wpIdToDbProducts.get(wp)!.push(dbP.id);
    // Remove from unclaimed
    const idx = unclaimedParents.indexOf(pick);
    if (idx >= 0) unclaimedParents.splice(idx, 1);
    matchedByTitle++;
  }
  console.log(`   Matched by title+count fallback: ${matchedByTitle}`);
  const unmatched = dbProducts.length - dbToWpId.size;
  console.log(`   Still unmatched: ${unmatched}`);

  // 4. Find missing CSV parents (no DB product maps to their WP_ID)
  const missing: CsvRow[] = [];
  for (const p of parentRows) {
    const wpId = p["Kimlik"]?.trim();
    if (!wpId) continue;
    if (!wpIdToDbProducts.has(wpId)) missing.push(p);
  }
  console.log(`\n🔍 Missing CSV parents (not in DB): ${missing.length}`);
  missing.forEach((m, i) => {
    const name = decodeHtml(m["İsim"]?.trim() || "");
    const wpId = m["Kimlik"]?.trim() || "";
    const varCount = varsByParentWpId.get(wpId)?.length ?? 0;
    console.log(`   ${i + 1}. [WP:${wpId}] ${name}  (variations=${varCount})`);
  });

  // 5. Also note unmatched DB products (may be admin-created, no CSV)
  if (unmatched > 0) {
    console.log(`\nℹ  DB products not matching any CSV WP_ID:`);
    dbProducts
      .filter((p) => !dbToWpId.has(p.id))
      .forEach((p, i) => console.log(`   ${i + 1}. ${p.title}  (${p.slug})  [variants=${p.variants.length}]`));
  }

  if (!APPLY) {
    console.log(`\n${"=".repeat(60)}`);
    console.log("DRY-RUN. Re-run with --apply to insert missing products.");
    console.log(`  will INSERT: ${missing.length} products (with variants + images)`);
    console.log("=".repeat(60));
    await prisma.$disconnect();
    return;
  }

  // 6. Insert missing
  if (missing.length === 0) {
    console.log("\nNothing to do.");
    await prisma.$disconnect();
    return;
  }

  console.log(`\n➕ Inserting ${missing.length} missing products...`);
  let insProd = 0;
  let insVar = 0;

  for (const row of missing) {
    const wpId = row["Kimlik"]?.trim() || "";
    const name = decodeHtml(row["İsim"]?.trim() || "");
    if (!name) continue;
    const categoryStr = row["Kategoriler"]?.trim() || "";
    const images = (row["Görseller"] || "")
      .split(",").map((s) => s.trim()).filter(Boolean);
    const published = row["Yayımlanmış"] !== "-1" && row["Yayımlanmış"] !== "0";
    const productType = detectProductType(name, categoryStr);
    const categoryId = await resolveCategoryId(categoryStr);

    // Unique slug (append -N if base is taken)
    const baseSlug = slugify(name);
    let finalSlug = baseSlug;
    let n = 2;
    while (await prisma.product.findUnique({ where: { slug: finalSlug } })) {
      finalSlug = `${baseSlug}-${n++}`;
      if (n > 50) break;
    }

    try {
      const product = await prisma.product.create({
        data: {
          title: name,
          slug: finalSlug,
          description: row["Açıklama"] ? decodeHtml(row["Açıklama"]) : null,
          shortDesc: row["Kısa açıklama"] ? decodeHtml(row["Kısa açıklama"]) : null,
          images,
          categoryId,
          productType,
          isPublished: published,
          menuOrder: parseInt(row["Konum"] || "0") || 0,
        },
      });
      insProd++;

      const variations = varsByParentWpId.get(wpId) || [];
      for (let i = 0; i < variations.length; i++) {
        const v = variations[i];
        const skuRaw = v["Stok kodu (SKU)"]?.trim() || `${finalSlug}-VAR-${i + 1}`;
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
        const image = (v["Görseller"] || "")
          .split(",").map((s) => s.trim()).filter(Boolean)[0] || null;

        // Ensure unique SKU
        let sku = skuRaw.slice(0, 100);
        const exists = await prisma.productVariant.findUnique({ where: { sku } });
        if (exists) sku = `${skuRaw}-${wpId}-${i}`.slice(0, 100);

        try {
          await prisma.productVariant.create({
            data: {
              productId: product.id,
              sku,
              baskiOption: baski || null,
              renkOption: renk || null,
              desenOption: desen || null,
              adet,
              priceUsd: price > 0 ? price : 0.1,
              image,
              isCompatible: true,
              stockCode: skuRaw.slice(0, 100),
              sortOrder,
            },
          });
          insVar++;
        } catch (e) {
          console.warn(`   ⚠ variant failed sku=${sku}: ${(e as Error).message}`);
        }
      }
      process.stdout.write(`   ✅ ${insProd}/${missing.length}: ${name.substring(0, 55)}  (vars=${variations.length})\n`);
    } catch (e) {
      console.warn(`   ❌ failed "${name}":`, (e as Error).message);
    }
  }

  // Summary
  const totalP = await prisma.product.count();
  const totalV = await prisma.productVariant.count();
  console.log(`\n${"=".repeat(60)}`);
  console.log(`✅ Inserted products: ${insProd}, variants: ${insVar}`);
  console.log(`   DB total: ${totalP} products, ${totalV} variants`);
  console.log("=".repeat(60));

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("❌ failed:", e);
  prisma.$disconnect();
  process.exit(1);
});
