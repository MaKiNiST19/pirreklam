/**
 * WooCommerce CSV → Neon PostgreSQL Import Script
 *
 * Parses WooCommerce product export CSV and imports:
 * - Parent products (type: variable)
 * - Variations with SKU, attributes (baski, renk, desen, adet), price
 *
 * Usage: npx tsx scripts/import-csv.ts
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { parse } from "csv-parse/sync";
import * as fs from "fs";
import "dotenv/config";

const adapter = new PrismaPg(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

// CSV column mapping (Turkish WooCommerce export)
const COL = {
  ID: "Kimlik",
  TYPE: "Tür",
  SKU: "Stok kodu (SKU)",
  NAME: "İsim",
  PUBLISHED: "Yayımlanmış",
  SHORT_DESC: "Kısa açıklama",
  DESC: "Açıklama",
  PRICE_SALE: "İndirimli satış fiyatı",
  PRICE_REGULAR: "Normal fiyat",
  CATEGORIES: "Kategoriler",
  IMAGES: "Görseller",
  PARENT: "Ebeveyn",
  SORT_ORDER: "Konum",
  ATTR1_NAME: "Nitelik 1 ismi",
  ATTR1_VALUE: "Nitelik 1 değer(ler)i",
  ATTR1_DEFAULT: "Nitelik 1 varsayılan",
  ATTR2_NAME: "Nitelik 2 ismi",
  ATTR2_VALUE: "Nitelik 2 değer(ler)i",
  ATTR2_DEFAULT: "Nitelik 2 varsayılan",
  ATTR3_NAME: "Nitelik 3 ismi",
  ATTR3_VALUE: "Nitelik 3 değer(ler)i",
  ATTR3_DEFAULT: "Nitelik 3 varsayılan",
  ATTR4_NAME: "Nitelik 4 ismi",
  ATTR4_VALUE: "Nitelik 4 değer(ler)i",
  ATTR4_DEFAULT: "Nitelik 4 varsayılan",
};

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

function detectProductType(name: string, categoryStr: string): string | null {
  const combined = `${name} ${categoryStr}`.toLowerCase();
  if (combined.includes("termo deri")) return "termo_deri";
  if (combined.includes("lüx suni deri") || combined.includes("lux suni deri")) return "lux_suni_deri";
  if (combined.includes("biala") || combined.includes("pvc") || combined.includes("mat biala")) return "mat_biala";
  if (combined.includes("suni deri") || combined.includes("dikişli")) return "lux_suni_deri";
  return null;
}

function parsePrice(priceStr: string): number {
  if (!priceStr || priceStr.trim() === "") return 0;
  // Price is in TRY from WooCommerce, convert to USD approx (admin will correct)
  const tryPrice = parseFloat(priceStr.replace(",", ".").replace(/[^\d.]/g, ""));
  if (isNaN(tryPrice) || tryPrice === 0) return 0;
  // Approximate USD (1 USD ≈ 38 TRY as baseline)
  return Math.round((tryPrice / 38) * 10000) / 10000;
}

function parseAdet(adetStr: string): number {
  if (!adetStr) return 100;
  const match = adetStr.match(/(\d+)/);
  return match ? parseInt(match[1]) : 100;
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

async function main() {
  const csvPath = "C:\\Users\\Alp Tek Bilişim\\Downloads\\products.csv";

  console.log("📂 Reading CSV file...");
  const csvContent = fs.readFileSync(csvPath, "utf-8");

  const rows: CsvRow[] = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    relax_column_count: true,
    bom: true,
  });

  console.log(`  Found ${rows.length} rows\n`);

  // Separate parents and variations
  const parentRows = rows.filter((r) => r["Tür"] === "variable");
  const variationRows = rows.filter((r) => r["Tür"] === "variation");

  console.log(`  📦 Parent products: ${parentRows.length}`);
  console.log(`  🔧 Variations: ${variationRows.length}\n`);

  // Build parent ID → variation rows map
  const variationsByParent = new Map<string, CsvRow[]>();
  for (const vRow of variationRows) {
    const parentRef = vRow["Ebeveyn"]?.replace("id:", "").trim() || "";
    if (!variationsByParent.has(parentRef)) {
      variationsByParent.set(parentRef, []);
    }
    variationsByParent.get(parentRef)!.push(vRow);
  }

  let productCount = 0;
  let variantCount = 0;
  let skippedCount = 0;

  // ===== IMPORT PARENTS =====
  for (const row of parentRows) {
    const wpId = row["Kimlik"]?.trim();
    const name = decodeHtml(row["İsim"]?.trim() || "");
    if (!name) { skippedCount++; continue; }

    const categoryStr = row["Kategoriler"]?.trim() || "";
    const images = row["Görseller"]
      ? row["Görseller"].split(",").map((s) => s.trim()).filter(Boolean)
      : [];
    const published = row["Yayımlanmış"] !== "-1" && row["Yayımlanmış"] !== "0";
    const productType = detectProductType(name, categoryStr);

    // Get deepest category slug
    let categoryId: string | null = null;
    if (categoryStr) {
      // e.g. "Plastik Ürünler > Ruhsat Kabı > Biala Pvc Ruhsat Kabı"
      const catParts = categoryStr.split(",");
      // Find deepest (longest path)
      const deepestCat = catParts
        .map((c) => c.trim())
        .sort((a, b) => b.split(">").length - a.split(">").length)[0];

      const leafCatName = deepestCat.split(">").pop()?.trim() || "";
      const leafSlug = slugify(leafCatName);

      const dbCat = await prisma.category.findUnique({ where: { slug: leafSlug } });
      categoryId = dbCat?.id || null;

      // Try parent categories if leaf not found
      if (!categoryId) {
        for (const catPart of catParts.reverse()) {
          const leafName = catPart.trim().split(">").pop()?.trim() || "";
          const s = slugify(leafName);
          const c = await prisma.category.findUnique({ where: { slug: s } });
          if (c) { categoryId = c.id; break; }
        }
      }
    }

    // Generate slug from name
    let slug = slugify(name);
    // Check for slug collision and append if needed
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing && existing.id) {
      // If same WP content (same name), update it
      const product = await prisma.product.update({
        where: { slug },
        data: {
          title: name,
          images: images.length > 0 ? images : existing.images,
          categoryId: categoryId || existing.categoryId,
          productType: productType || existing.productType,
          isPublished: published,
          menuOrder: parseInt(row["Konum"] || "0") || 0,
        },
      });

      // Import variations for this product
      const variations = variationsByParent.get(wpId) || [];
      if (variations.length > 0) {
        const imported = await importVariations(product.id, variations, slug);
        variantCount += imported;
      }
      productCount++;
      process.stdout.write(`  ✅ Updated: ${name.substring(0, 60)}\n`);
      continue;
    }

    const product = await prisma.product.create({
      data: {
        title: name,
        slug,
        description: row["Açıklama"] ? decodeHtml(row["Açıklama"]) : null,
        shortDesc: row["Kısa açıklama"] ? decodeHtml(row["Kısa açıklama"]) : null,
        images,
        categoryId,
        productType,
        isPublished: published,
        menuOrder: parseInt(row["Konum"] || "0") || 0,
      },
    });

    // Import variations
    const variations = variationsByParent.get(wpId) || [];
    if (variations.length > 0) {
      const imported = await importVariations(product.id, variations, slug);
      variantCount += imported;
    } else {
      // No variations — create one from parent attributes
      const baski = getAttrByName(row, "BASKI SEÇENEKLERİ");
      const renk = getAttrByName(row, "MAT BİALA RENKLER") ||
                   getAttrByName(row, "TERMO DERİ RENKLER") ||
                   getAttrByName(row, "LÜX SUNİ DERİ RENKLER") ||
                   getAttrByName(row, "RENKLER");
      const adetStr = getAttrByName(row, "TOPLAM ADET");

      if (adetStr) {
        const adetOptions = adetStr.split(",").map((a) => a.trim()).filter(Boolean);
        for (let i = 0; i < adetOptions.length; i++) {
          const adet = parseAdet(adetOptions[i]);
          const sku = `${slug}-${adet}`.toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 50);
          try {
            await prisma.productVariant.create({
              data: {
                productId: product.id,
                sku,
                baskiOption: baski || null,
                renkOption: renk || null,
                adet,
                priceUsd: 0.10,
                isCompatible: true,
                stockCode: sku,
                sortOrder: i,
              },
            });
            variantCount++;
          } catch {}
        }
      }
    }

    productCount++;
    process.stdout.write(`  ✅ Product ${productCount}: ${name.substring(0, 60)}\n`);
  }

  // Final summary
  const totalProducts = await prisma.product.count();
  const totalVariants = await prisma.productVariant.count();
  const totalCategories = await prisma.category.count();

  console.log("\n" + "=".repeat(60));
  console.log("✅ CSV Import complete!");
  console.log(`  📦 Products in CSV: ${productCount} (${skippedCount} skipped)`);
  console.log(`  🔧 Variants imported: ${variantCount}`);
  console.log(`  📦 Total products in DB: ${totalProducts}`);
  console.log(`  🔧 Total variants in DB: ${totalVariants}`);
  console.log(`  📁 Total categories in DB: ${totalCategories}`);
  console.log("=".repeat(60));

  await prisma.$disconnect();
}

async function importVariations(
  productId: string,
  variations: CsvRow[],
  productSlug: string
): Promise<number> {
  // Delete existing variants for clean import
  await prisma.productVariant.deleteMany({ where: { productId } });

  let count = 0;
  const usedSkus = new Set<string>();

  for (let i = 0; i < variations.length; i++) {
    const v = variations[i];

    const sku = v["Stok kodu (SKU)"]?.trim() || `${productSlug}-VAR-${i + 1}`;
    const price = parsePrice(v["Normal fiyat"] || v["İndirimli satış fiyatı"]);

    // Parse attributes
    const baski = getAttrByName(v, "BASKI SEÇENEKLERİ");
    const renk = getAttrByName(v, "MAT BİALA RENKLER") ||
                 getAttrByName(v, "TERMO DERİ RENKLER") ||
                 getAttrByName(v, "LÜX SUNİ DERİ RENKLER") ||
                 getAttrByName(v, "RENKLER") ||
                 getAttrByName(v, "RENKLER (PVC ŞEFFAF)");
    const desen = getAttrByName(v, "TERMO DERİ DESENLER") ||
                  getAttrByName(v, "LÜX SUNİ DERİ DESENLER") ||
                  getAttrByName(v, "DESENLER");
    const adetStr = getAttrByName(v, "TOPLAM ADET");
    const adet = parseAdet(adetStr);
    const sortOrder = parseInt(v["Konum"] || `${i}`) || i;

    // Handle SKU collision
    let finalSku = sku;
    if (usedSkus.has(finalSku)) {
      finalSku = `${sku}-${i}`;
    }
    usedSkus.add(finalSku);

    try {
      await prisma.productVariant.create({
        data: {
          productId,
          sku: finalSku.slice(0, 100),
          baskiOption: baski || null,
          renkOption: renk || null,
          desenOption: desen || null,
          adet,
          priceUsd: price > 0 ? price : 0.10,
          isCompatible: true,
          stockCode: sku.slice(0, 100),
          sortOrder,
        },
      });
      count++;
    } catch (e) {
      // Try with unique suffix
      try {
        await prisma.productVariant.create({
          data: {
            productId,
            sku: `${finalSku}-${Date.now()}-${i}`.slice(0, 100),
            baskiOption: baski || null,
            renkOption: renk || null,
            desenOption: desen || null,
            adet,
            priceUsd: price > 0 ? price : 0.10,
            isCompatible: true,
            stockCode: sku.slice(0, 100),
            sortOrder,
          },
        });
        count++;
      } catch {}
    }
  }

  return count;
}

main().catch((e) => {
  console.error("❌ Import failed:", e);
  prisma.$disconnect();
  process.exit(1);
});
