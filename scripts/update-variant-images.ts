/**
 * Update variant images from CSV + WordPress XML
 * - Variants with gallery IDs: resolve from XML attachment map
 * - Variants with direct image URLs in CSV Görseller column: use directly
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as csv from "csv-parse/sync";
import * as fs from "fs";
import * as xml2js from "xml2js";
import "dotenv/config";

const adapter = new PrismaPg(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

async function buildAttachmentMap(xmlPath: string): Promise<Map<string, string>> {
  const content = fs.readFileSync(xmlPath, "utf8");
  const parsed = await xml2js.parseStringPromise(content);
  const items = parsed?.rss?.channel?.[0]?.item ?? [];

  const map = new Map<string, string>();
  for (const item of items) {
    const postType = item?.["wp:post_type"]?.[0];
    if (postType === "attachment") {
      const id = item?.["wp:post_id"]?.[0];
      const url = item?.["wp:attachment_url"]?.[0];
      if (id && url) map.set(String(id), url);
    }
  }
  return map;
}

async function main() {
  const xmlPath = "C:\\Users\\Alp Tek Bilişim\\Downloads\\pirreklam.WordPress.2026-04-14.xml";
  const csvPath = "C:\\Users\\Alp Tek Bilişim\\Downloads\\products.csv";

  console.log("Building attachment ID → URL map from XML...");
  const attachmentMap = await buildAttachmentMap(xmlPath);
  console.log(`  ${attachmentMap.size} attachments found`);

  console.log("Reading CSV...");
  const rawCsv = fs.readFileSync(csvPath, "utf8");
  const rows = csv.parse(rawCsv, { columns: true, bom: true, relax_column_count: true }) as Record<string, string>[];

  // Build SKU → image URL mapping
  const skuImageMap = new Map<string, string>();

  for (const row of rows) {
    if (row["Tür"] !== "variation") continue;
    const sku = row["Stok kodu (SKU)"]?.trim();
    if (!sku) continue;

    // Priority 1: gallery IDs from meta
    const galleryIds = row["Meta: _my_variation_gallery_ids"]?.trim();
    if (galleryIds) {
      const firstId = galleryIds.split(",")[0].trim();
      const url = attachmentMap.get(firstId);
      if (url) {
        skuImageMap.set(sku, url);
        continue;
      }
    }

    // Priority 2: direct image URL from Görseller column
    const images = row["Görseller"]?.trim();
    if (images) {
      const firstUrl = images.split(",")[0].trim();
      if (firstUrl.startsWith("http")) {
        skuImageMap.set(sku, firstUrl);
      }
    }
  }

  console.log(`  ${skuImageMap.size} SKUs have image URLs`);

  // Update database
  console.log("Updating database variants...");
  let updated = 0;
  let notFound = 0;

  for (const [sku, imageUrl] of skuImageMap) {
    const result = await prisma.productVariant.updateMany({
      where: { sku },
      data: { image: imageUrl },
    });
    if (result.count > 0) {
      updated++;
    } else {
      notFound++;
    }
  }

  console.log(`\n✅ Done!`);
  console.log(`  Updated: ${updated} variants`);
  console.log(`  Not found in DB: ${notFound} SKUs`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
