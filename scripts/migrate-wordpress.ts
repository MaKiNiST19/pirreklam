/**
 * WordPress → Neon PostgreSQL Migration Script
 *
 * Uses WordPress REST API + WooCommerce Store API to fetch all data
 * and imports into Neon PostgreSQL via Prisma.
 *
 * Usage: npx tsx scripts/migrate-wordpress.ts
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import * as fs from "fs";
import * as path from "path";

const adapter = new PrismaPg(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

const WP_BASE = "https://pirreklam.com.tr";
const WP_API = `${WP_BASE}/wp-json/wp/v2`;
const WC_STORE_API = `${WP_BASE}/wp-json/wc/store/v1`;
// WooCommerce REST API v3 requires auth — we'll use consumer key/secret or Store API
const WC_API_V3 = `${WP_BASE}/wp-json/wc/v3`;

// WP credentials for authenticated endpoints
const WP_USER = "pirreklam";
const WP_PASS = "E1#yMKy#B$nc*2&BPSdaCA*D";
const WP_AUTH = Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");

interface WpPage {
  id: number;
  title: { rendered: string };
  slug: string;
  content: { rendered: string };
  status: string;
  yoast_head_json?: {
    title?: string;
    description?: string;
  };
}

interface WpCategory {
  id: number;
  name: string;
  slug: string;
  parent: number;
  description: string;
  image?: { src: string } | null;
  count: number;
  menu_order?: number;
}

interface WcProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  description: string;
  short_description: string;
  images: Array<{ id: number; src: string; name: string; alt: string }>;
  categories: Array<{ id: number; name: string; slug: string }>;
  attributes: Array<{
    id: number;
    name: string;
    slug: string;
    options: string[];
    variation: boolean;
  }>;
  variations: number[];
  type: string;
  status: string;
  menu_order: number;
  meta_data?: Array<{ key: string; value: string }>;
  yoast_head_json?: { title?: string; description?: string };
}

interface WcVariation {
  id: number;
  sku: string;
  price: string;
  regular_price: string;
  attributes: Array<{ id: number; name: string; option: string }>;
  menu_order: number;
  stock_status: string;
}

// Fetch with auth and pagination
async function fetchWpApi<T>(url: string, useAuth = false): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (useAuth) {
    headers["Authorization"] = `Basic ${WP_AUTH}`;
  }
  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

async function fetchAllPages<T>(baseUrl: string, useAuth = false): Promise<T[]> {
  const allItems: T[] = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const separator = baseUrl.includes("?") ? "&" : "?";
    const url = `${baseUrl}${separator}per_page=${perPage}&page=${page}`;
    try {
      const items = await fetchWpApi<T[]>(url, useAuth);
      if (!items || items.length === 0) break;
      allItems.push(...items);
      if (items.length < perPage) break;
      page++;
    } catch (e) {
      // If page doesn't exist, stop
      break;
    }
  }

  return allItems;
}

// ============ PAGES ============
async function migratePages() {
  console.log("\n📄 Migrating pages...");

  const wpPages = await fetchAllPages<WpPage>(`${WP_API}/pages?status=publish`);
  console.log(`  Found ${wpPages.length} pages`);

  // Skip utility pages (shop, basket, checkout, login)
  const skipSlugs = ["shop", "basket", "checkout", "giris-yap-kayit-ol", "anasayfa"];

  for (const wp of wpPages) {
    if (skipSlugs.includes(wp.slug)) continue;
    if (!wp.content.rendered || wp.content.rendered.trim() === "") continue;

    await prisma.page.upsert({
      where: { slug: wp.slug },
      update: {
        title: wp.title.rendered,
        content: wp.content.rendered,
        seoTitle: wp.yoast_head_json?.title || null,
        seoDescription: wp.yoast_head_json?.description || null,
      },
      create: {
        title: wp.title.rendered,
        slug: wp.slug,
        content: wp.content.rendered,
        isPublished: true,
        seoTitle: wp.yoast_head_json?.title || null,
        seoDescription: wp.yoast_head_json?.description || null,
      },
    });
    console.log(`  ✅ Page: ${wp.title.rendered} (${wp.slug})`);
  }
}

// ============ CATEGORIES ============
async function migrateCategories() {
  console.log("\n📁 Migrating categories...");

  const wpCats = await fetchAllPages<WpCategory>(
    `${WP_BASE}/wp-json/wc/store/v1/products/categories`
  );
  console.log(`  Found ${wpCats.length} categories`);

  // Also try WP product_cat taxonomy
  let wpTaxCats: WpCategory[] = [];
  try {
    wpTaxCats = await fetchAllPages<WpCategory>(
      `${WP_API}/product_cat`
    );
  } catch {
    // product_cat endpoint may not be exposed
  }

  // Merge data - store API categories have more reliable data
  const allCats = wpCats.length > 0 ? wpCats : wpTaxCats;

  // Build parent map
  const catMap = new Map<number, WpCategory>();
  for (const cat of allCats) {
    catMap.set(cat.id, cat);
  }

  // First pass: create/update parent categories (parent=0)
  const parentCats = allCats.filter((c) => c.parent === 0);
  const parentIdMap = new Map<number, string>(); // WP id -> Prisma id

  for (let i = 0; i < parentCats.length; i++) {
    const cat = parentCats[i];
    const result = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: decodeHtml(cat.name),
        description: cat.description || null,
        image: cat.image?.src || null,
        menuOrder: i + 1,
      },
      create: {
        name: decodeHtml(cat.name),
        slug: cat.slug,
        description: cat.description || null,
        image: cat.image?.src || null,
        menuOrder: i + 1,
      },
    });
    parentIdMap.set(cat.id, result.id);
    console.log(`  ✅ Parent Category: ${cat.name} (${cat.slug})`);
  }

  // Second pass: create/update child categories
  const childCats = allCats.filter((c) => c.parent !== 0);
  for (let i = 0; i < childCats.length; i++) {
    const cat = childCats[i];
    const parentPrismaId = parentIdMap.get(cat.parent);

    // If parent isn't a direct parent (deeper nesting), try to find it
    let resolvedParentId = parentPrismaId;
    if (!resolvedParentId) {
      // This might be a grandchild — find the immediate parent
      const parentCat = catMap.get(cat.parent);
      if (parentCat) {
        const existingParent = await prisma.category.findUnique({
          where: { slug: parentCat.slug },
        });
        resolvedParentId = existingParent?.id ?? undefined;
      }
    }

    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: decodeHtml(cat.name),
        description: cat.description || null,
        image: cat.image?.src || null,
        parentId: resolvedParentId || null,
        menuOrder: i + 1,
      },
      create: {
        name: decodeHtml(cat.name),
        slug: cat.slug,
        description: cat.description || null,
        image: cat.image?.src || null,
        parentId: resolvedParentId || null,
        menuOrder: i + 1,
      },
    });
    console.log(`  ✅ Child Category: ${cat.name} (${cat.slug}) → parent=${cat.parent}`);
  }
}

// ============ PRODUCTS ============
async function migrateProducts() {
  console.log("\n📦 Migrating products...");

  // Use WooCommerce Store API to get products
  const products = await fetchAllPages<WcProduct>(`${WC_STORE_API}/products`);
  console.log(`  Found ${products.length} products from Store API`);

  // Also try authenticated WC REST API for more products
  let wcProducts: WcProduct[] = [];
  try {
    wcProducts = await fetchAllPages<WcProduct>(
      `${WC_API_V3}/products`,
      true
    );
    console.log(`  Found ${wcProducts.length} products from WC REST API`);
  } catch (e) {
    console.log(`  WC REST API not available, using Store API only`);
  }

  // Merge - prefer WC REST API data as it has more details
  const allProducts = wcProducts.length > products.length ? wcProducts : products;
  console.log(`  Processing ${allProducts.length} products total`);

  for (let i = 0; i < allProducts.length; i++) {
    const wp = allProducts[i];

    // Find category in our DB
    let categoryId: string | null = null;
    if (wp.categories && wp.categories.length > 0) {
      // Use the most specific (deepest) category
      const deepestCat = wp.categories[wp.categories.length - 1];
      const dbCat = await prisma.category.findUnique({
        where: { slug: deepestCat.slug },
      });
      categoryId = dbCat?.id || null;

      // If not found, try first category
      if (!categoryId && wp.categories[0]) {
        const dbCat2 = await prisma.category.findUnique({
          where: { slug: wp.categories[0].slug },
        });
        categoryId = dbCat2?.id || null;
      }
    }

    // Determine product type from name/categories
    const productType = detectProductType(wp.name, wp.categories?.map(c => c.name) || []);

    // Extract images
    const images = wp.images?.map((img) => img.src) || [];

    // Get SEO data
    const seoTitle = wp.yoast_head_json?.title || null;
    const seoDescription = wp.yoast_head_json?.description || null;

    const product = await prisma.product.upsert({
      where: { slug: wp.slug },
      update: {
        title: decodeHtml(wp.name),
        description: wp.description || null,
        shortDesc: wp.short_description || null,
        images,
        categoryId,
        productType,
        menuOrder: wp.menu_order || i + 1,
        seoTitle,
        seoDescription,
        isPublished: true,
      },
      create: {
        title: decodeHtml(wp.name),
        slug: wp.slug,
        description: wp.description || null,
        shortDesc: wp.short_description || null,
        images,
        categoryId,
        productType,
        menuOrder: wp.menu_order || i + 1,
        seoTitle,
        seoDescription,
        isPublished: true,
      },
    });

    console.log(`  ✅ Product ${i + 1}/${allProducts.length}: ${wp.name} (${wp.slug})`);

    // Migrate variations
    if (wp.variations && wp.variations.length > 0) {
      await migrateVariations(product.id, wp.id, wp.attributes || []);
    } else if (wp.attributes && wp.attributes.length > 0) {
      // Create basic variants from attributes
      await createVariantsFromAttributes(product.id, wp.attributes, wp.slug);
    }
  }
}

async function migrateVariations(
  productId: string,
  wpProductId: number,
  attributes: WcProduct["attributes"]
) {
  try {
    // Try WC REST API first for variations
    const variations = await fetchAllPages<WcVariation>(
      `${WC_API_V3}/products/${wpProductId}/variations`,
      true
    );

    if (variations.length === 0) return;

    // Delete existing variants for this product
    await prisma.productVariant.deleteMany({ where: { productId } });

    for (let i = 0; i < variations.length; i++) {
      const v = variations[i];
      const attrs = v.attributes || [];

      // Map attributes to our fields
      let baskiOption: string | null = null;
      let renkOption: string | null = null;
      let desenOption: string | null = null;
      let adet = 100; // default

      for (const attr of attrs) {
        const attrName = attr.name.toLowerCase();
        if (attrName.includes("baskı") || attrName.includes("baski") || attrName.includes("print")) {
          baskiOption = attr.option;
        } else if (attrName.includes("desen") || attrName.includes("pattern")) {
          desenOption = attr.option;
        } else if (attrName.includes("renk") || attrName.includes("color") || attrName.includes("biala")) {
          renkOption = attr.option;
        } else if (attrName.includes("adet") || attrName.includes("quantity") || attrName.includes("toplam")) {
          const parsed = parseInt(attr.option.replace(/\D/g, ""));
          if (!isNaN(parsed)) adet = parsed;
        }
      }

      const sku = v.sku || `VAR-${wpProductId}-${i + 1}`;
      const price = parseFloat(v.regular_price || v.price || "0");
      // Convert TRY price to approximate USD (will be corrected later by admin)
      const priceUsd = price > 0 ? Math.round((price / 38) * 10000) / 10000 : 0.10;

      try {
        await prisma.productVariant.create({
          data: {
            productId,
            sku,
            baskiOption,
            renkOption,
            desenOption,
            adet,
            priceUsd,
            isCompatible: true,
            stockCode: sku,
            sortOrder: v.menu_order || i,
          },
        });
      } catch (e) {
        // SKU conflict — append index
        await prisma.productVariant.create({
          data: {
            productId,
            sku: `${sku}-${Date.now()}-${i}`,
            baskiOption,
            renkOption,
            desenOption,
            adet,
            priceUsd,
            isCompatible: true,
            stockCode: sku,
            sortOrder: v.menu_order || i,
          },
        });
      }
    }

    console.log(`    📋 ${variations.length} variations imported`);
  } catch (e) {
    console.log(`    ⚠️ Could not fetch variations for product ${wpProductId}: ${(e as Error).message}`);
  }
}

async function createVariantsFromAttributes(
  productId: string,
  attributes: WcProduct["attributes"],
  productSlug: string
) {
  // Generate variant combinations from attributes
  let baskiOptions: string[] = [];
  let renkOptions: string[] = [];
  let desenOptions: string[] = [];
  let adetOptions: number[] = [100];

  for (const attr of attributes) {
    const name = attr.name.toLowerCase();
    if (name.includes("baskı") || name.includes("baski") || name.includes("print")) {
      baskiOptions = attr.options;
    } else if (name.includes("desen") || name.includes("pattern")) {
      desenOptions = attr.options;
    } else if (name.includes("renk") || name.includes("color") || name.includes("biala")) {
      renkOptions = attr.options;
    } else if (name.includes("adet") || name.includes("quantity") || name.includes("toplam")) {
      adetOptions = attr.options
        .map((o) => parseInt(o.replace(/\D/g, "")))
        .filter((n) => !isNaN(n));
    }
  }

  // If no valid options, skip
  if (baskiOptions.length === 0 && renkOptions.length === 0 && adetOptions.length <= 1) {
    return;
  }

  // Delete existing variants
  await prisma.productVariant.deleteMany({ where: { productId } });

  let count = 0;
  const baskis = baskiOptions.length > 0 ? baskiOptions : [null];
  const renks = renkOptions.length > 0 ? renkOptions : [null];
  const desens = desenOptions.length > 0 ? desenOptions : [null];

  for (const baski of baskis) {
    for (const renk of renks) {
      for (const desen of desens) {
        for (const adet of adetOptions) {
          count++;
          const sku = `${productSlug}-${count}`.toUpperCase().slice(0, 50);
          await prisma.productVariant.create({
            data: {
              productId,
              sku,
              baskiOption: baski,
              renkOption: renk,
              desenOption: desen,
              adet,
              priceUsd: 0.10, // Placeholder — admin will set real prices
              isCompatible: true,
              stockCode: sku,
              sortOrder: count,
            },
          });
        }
      }
    }
  }

  if (count > 0) {
    console.log(`    📋 ${count} variant combinations generated from attributes`);
  }
}

// ============ SLIDERS ============
async function migrateSliders() {
  console.log("\n🖼️ Migrating slider images from homepage...");

  // We'll extract slider images from the homepage HTML
  try {
    const res = await fetch(WP_BASE);
    const html = await res.text();

    // Extract slider image URLs from Swiper/Bricks builder
    const imgRegex = /data-src=["']([^"']*?slider[^"']*?)["']|src=["']([^"']*?slider[^"']*?)["']|background-image:\s*url\(["']?([^"')]*?slider[^"')]*?)["']?\)/gi;
    const sliderImages: string[] = [];
    let match;
    while ((match = imgRegex.exec(html)) !== null) {
      const url = match[1] || match[2] || match[3];
      if (url && !sliderImages.includes(url)) {
        sliderImages.push(url);
      }
    }

    // Also look for banner images in wp-content/uploads
    const bannerRegex = /(?:src|data-src|background-image[^)]*url\()=?["'(]*(https?:\/\/pirreklam\.com\.tr\/wp-content\/uploads\/[^"')]*?(?:banner|slide|hero)[^"')]*?)["')]/gi;
    while ((match = bannerRegex.exec(html)) !== null) {
      if (match[1] && !sliderImages.includes(match[1])) {
        sliderImages.push(match[1]);
      }
    }

    // General approach: get all large images from Bricks sections
    const bricksImgRegex = /https?:\/\/pirreklam\.com\.tr\/wp-content\/uploads\/\d{4}\/\d{2}\/[^"'\s)]+\.(?:jpg|jpeg|png|webp)/gi;
    const allImages: string[] = [];
    while ((match = bricksImgRegex.exec(html)) !== null) {
      if (!allImages.includes(match[0])) {
        allImages.push(match[0]);
      }
    }

    console.log(`  Found ${allImages.length} images in homepage HTML`);

    // Take first few as potential sliders
    const potentialSliders = allImages.slice(0, 5);
    for (let i = 0; i < potentialSliders.length; i++) {
      await prisma.slider.upsert({
        where: { id: `slider-${i + 1}` },
        update: { imageUrl: potentialSliders[i], sortOrder: i + 1 },
        create: {
          id: `slider-${i + 1}`,
          imageUrl: potentialSliders[i],
          sortOrder: i + 1,
          isActive: true,
        },
      });
      console.log(`  ✅ Slider ${i + 1}: ${potentialSliders[i].split("/").pop()}`);
    }
  } catch (e) {
    console.log(`  ⚠️ Could not extract sliders: ${(e as Error).message}`);
  }
}

// ============ HELPERS ============
function decodeHtml(html: string): string {
  return html
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

function detectProductType(
  name: string,
  categoryNames: string[]
): string | null {
  const combined = `${name} ${categoryNames.join(" ")}`.toLowerCase();

  if (combined.includes("termo deri") || combined.includes("termo-deri")) {
    return "termo_deri";
  }
  if (
    combined.includes("lüx suni deri") ||
    combined.includes("lux suni deri") ||
    combined.includes("lüx-suni-deri") ||
    combined.includes("lux-suni-deri")
  ) {
    return "lux_suni_deri";
  }
  if (
    combined.includes("mat biala") ||
    combined.includes("biala") ||
    combined.includes("pvc")
  ) {
    return "mat_biala";
  }
  if (combined.includes("suni deri") || combined.includes("dikişli")) {
    return "lux_suni_deri";
  }

  return null;
}

// ============ MAIN ============
async function main() {
  console.log("🚀 Starting WordPress → Neon PostgreSQL migration...\n");
  console.log("=".repeat(60));

  try {
    await migratePages();
    await migrateCategories();
    await migrateProducts();
    await migrateSliders();

    // Print summary
    const productCount = await prisma.product.count();
    const categoryCount = await prisma.category.count();
    const variantCount = await prisma.productVariant.count();
    const pageCount = await prisma.page.count();
    const sliderCount = await prisma.slider.count();

    console.log("\n" + "=".repeat(60));
    console.log("✅ Migration complete!");
    console.log(`  📦 Products: ${productCount}`);
    console.log(`  📋 Variants: ${variantCount}`);
    console.log(`  📁 Categories: ${categoryCount}`);
    console.log(`  📄 Pages: ${pageCount}`);
    console.log(`  🖼️ Sliders: ${sliderCount}`);
    console.log("=".repeat(60));
  } catch (e) {
    console.error("\n❌ Migration failed:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
