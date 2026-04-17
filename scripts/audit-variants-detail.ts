/**
 * Per-product variant detail audit (v2 — per-product fetch)
 *
 * Store API's /products (list) endpoint returns empty `attributes` and
 * `variations` for variable products. The /products/{id} (single) endpoint
 * returns full data. We iterate over all WP products and fetch each one
 * individually to get real attribute options, then compare vs Neon.
 *
 * Read-only. Run:
 *   npx tsx scripts/audit-variants-detail.ts           # human report
 *   npx tsx scripts/audit-variants-detail.ts --json    # structured
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

const WP_BASE = "https://pirreklam.com.tr";
const WC_STORE_API = `${WP_BASE}/wp-json/wc/store/v1`;

const jsonMode = process.argv.includes("--json");
const log = (...args: unknown[]) => {
  if (!jsonMode) console.log(...args);
};

interface WpAttribute {
  id: number;
  name: string;
  taxonomy?: string;
  has_variations?: boolean;
  terms?: Array<{ id: number; name: string; slug: string }>;
}

interface WcProductDetail {
  id: number;
  name: string;
  slug: string;
  type: string;
  attributes: WpAttribute[];
  variations: Array<{ id: number; attributes: Array<{ name: string; value: string }> }> | number[];
  categories: Array<{ slug: string; name: string }>;
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

async function main() {
  log("🔎 WP → Neon PER-PRODUCT VARIANT DETAIL (v2)\n" + "=".repeat(70));

  log("\n📦 Fetching WP product list...");
  const wpList = await fetchAllPages<{ id: number; slug: string; name: string }>(
    `${WC_STORE_API}/products`
  );
  log(`   ${wpList.length} products — now fetching each in detail...`);

  // Fetch per-product detail in small concurrent batches (gentle on WP)
  const details: WcProductDetail[] = [];
  const BATCH = 5;
  for (let i = 0; i < wpList.length; i += BATCH) {
    const chunk = wpList.slice(i, i + BATCH);
    const results = await Promise.all(
      chunk.map((p) =>
        fetchJson<WcProductDetail>(`${WC_STORE_API}/products/${p.id}`).catch(
          (e) => {
            log(`   ⚠️ ${p.slug}: ${(e as Error).message}`);
            return null;
          }
        )
      )
    );
    for (const r of results) if (r) details.push(r);
    log(`   ... ${Math.min(i + BATCH, wpList.length)}/${wpList.length}`);
  }
  log(`   ✓ Fetched ${details.length} product detail payloads`);

  log("\n🗄️  Fetching Neon products with variants...");
  const dbProducts = await prisma.product.findMany({
    select: {
      slug: true,
      title: true,
      variants: {
        select: { baskiOption: true, renkOption: true, desenOption: true, adet: true },
      },
    },
  });
  log(`   ${dbProducts.length} Neon products`);

  const dbByNorm = new Map(dbProducts.map((p) => [normSlug(p.slug), p]));

  type OptionDiff = {
    wpOptions: string[];
    dbOptions: string[];
    missingInDb: string[];
    extraInDb: string[];
  };

  type ProductReport = {
    wpSlug: string;
    neonSlug: string;
    title: string;
    wpType: string;
    wpAttrNames: string[];
    baski?: OptionDiff;
    renk?: OptionDiff;
    desen?: OptionDiff;
    adet?: { wp: number[]; db: number[]; missingInDb: number[]; extraInDb: number[] };
    wpExpectedCount: number;
    wpActualVariationCount: number;
    dbActualCount: number;
    notes: string[];
  };

  const reports: ProductReport[] = [];
  const unmatched: Array<{ slug: string; title: string; attrCount: number; variationCount: number }> = [];

  for (const wp of details) {
    const norm = normSlug(wp.slug);
    const db = dbByNorm.get(norm);

    // Bucket WP attribute terms by our field
    const wpBaski: string[] = [];
    const wpRenk: string[] = [];
    const wpDesen: string[] = [];
    const wpAdet: number[] = [];
    const wpAttrNames: string[] = [];

    for (const attr of wp.attributes ?? []) {
      wpAttrNames.push(attr.name);
      const cls = classifyAttr(attr.name);
      const terms = attr.terms?.map((t) => t.name) ?? [];
      if (cls === "baski") wpBaski.push(...terms);
      else if (cls === "renk") wpRenk.push(...terms);
      else if (cls === "desen") wpDesen.push(...terms);
      else if (cls === "adet") {
        for (const o of terms) {
          const n = parseAdet(o);
          if (n != null) wpAdet.push(n);
        }
      }
    }

    const wpActualVariationCount = Array.isArray(wp.variations) ? wp.variations.length : 0;

    if (!db) {
      unmatched.push({
        slug: wp.slug,
        title: wp.name,
        attrCount: wp.attributes?.length ?? 0,
        variationCount: wpActualVariationCount,
      });
      continue;
    }

    // Neon distinct options
    const dbBaski = [
      ...new Set(db.variants.map((v) => v.baskiOption).filter(Boolean) as string[]),
    ];
    const dbRenk = [
      ...new Set(db.variants.map((v) => v.renkOption).filter(Boolean) as string[]),
    ];
    const dbDesen = [
      ...new Set(db.variants.map((v) => v.desenOption).filter(Boolean) as string[]),
    ];
    const dbAdet = [...new Set(db.variants.map((v) => v.adet))];

    const normOpt = (s: string) =>
      s
        .trim()
        .toLocaleLowerCase("tr")
        .replace(/\s+/g, " ");
    const diffStr = (wpArr: string[], dbArr: string[]) => {
      const dbNorm = new Set(dbArr.map(normOpt));
      const wpNorm = new Set(wpArr.map(normOpt));
      const missing = wpArr.filter((w) => !dbNorm.has(normOpt(w)));
      const extra = dbArr.filter((d) => !wpNorm.has(normOpt(d)));
      return { missing, extra };
    };
    const diffNum = (wpArr: number[], dbArr: number[]) => {
      const dbSet = new Set(dbArr);
      const wpSet = new Set(wpArr);
      const missing = wpArr.filter((w) => !dbSet.has(w));
      const extra = dbArr.filter((d) => !wpSet.has(d));
      return { missing, extra };
    };

    const baskiDiff = diffStr(wpBaski, dbBaski);
    const renkDiff = diffStr(wpRenk, dbRenk);
    const desenDiff = diffStr(wpDesen, dbDesen);
    const adetDiff = diffNum(wpAdet, dbAdet);

    const wpExpected = Math.max(
      1,
      Math.max(wpBaski.length, 1) *
        Math.max(wpRenk.length, 1) *
        Math.max(wpDesen.length, 1) *
        Math.max(wpAdet.length, 1)
    );

    const notes: string[] = [];
    if (wp.slug !== db.slug) {
      notes.push(`⚠️ slug drift: WP "${wp.slug}" vs Neon "${db.slug}"`);
    }
    if (db.variants.length === 0 && wp.attributes?.length) {
      notes.push(`❗ Neon has ZERO variants despite WP having ${wp.attributes.length} attributes`);
    }

    reports.push({
      wpSlug: wp.slug,
      neonSlug: db.slug,
      title: wp.name,
      wpType: wp.type,
      wpAttrNames,
      baski: wpBaski.length > 0 || dbBaski.length > 0
        ? { wpOptions: wpBaski, dbOptions: dbBaski, missingInDb: baskiDiff.missing, extraInDb: baskiDiff.extra }
        : undefined,
      renk: wpRenk.length > 0 || dbRenk.length > 0
        ? { wpOptions: wpRenk, dbOptions: dbRenk, missingInDb: renkDiff.missing, extraInDb: renkDiff.extra }
        : undefined,
      desen: wpDesen.length > 0 || dbDesen.length > 0
        ? { wpOptions: wpDesen, dbOptions: dbDesen, missingInDb: desenDiff.missing, extraInDb: desenDiff.extra }
        : undefined,
      adet: wpAdet.length > 0 || dbAdet.length > 0
        ? { wp: wpAdet, db: dbAdet, missingInDb: adetDiff.missing, extraInDb: adetDiff.extra }
        : undefined,
      wpExpectedCount: wpExpected,
      wpActualVariationCount,
      dbActualCount: db.variants.length,
      notes,
    });
  }

  const withIssues = reports.filter((r) => {
    if (r.notes.length > 0) return true;
    if (r.baski && (r.baski.missingInDb.length || r.baski.extraInDb.length)) return true;
    if (r.renk && (r.renk.missingInDb.length || r.renk.extraInDb.length)) return true;
    if (r.desen && (r.desen.missingInDb.length || r.desen.extraInDb.length)) return true;
    if (r.adet && (r.adet.missingInDb.length || r.adet.extraInDb.length)) return true;
    if (r.wpActualVariationCount > 0 && r.wpActualVariationCount !== r.dbActualCount) return true;
    return false;
  });

  if (jsonMode) {
    process.stdout.write(
      JSON.stringify(
        {
          summary: {
            wpProducts: wpList.length,
            wpDetailsFetched: details.length,
            neonProducts: dbProducts.length,
            matched: reports.length,
            unmatched: unmatched.length,
            withIssues: withIssues.length,
          },
          unmatchedOnWp: unmatched,
          reports: withIssues,
        },
        null,
        2
      )
    );
  } else {
    console.log("\n" + "=".repeat(70));
    console.log(`📊 ${withIssues.length} products with variant issues (of ${reports.length} matched)`);
    console.log(`🔴 ${unmatched.length} WP products did not match any Neon product`);
    console.log("=".repeat(70));

    if (unmatched.length > 0) {
      console.log("\n🔴 WP PRODUCTS NOT IN NEON AT ALL:");
      for (const u of unmatched) {
        console.log(`   - ${u.slug} → "${u.title}" [${u.attrCount} attrs, ${u.variationCount} variations]`);
      }
    }

    for (const r of withIssues) {
      console.log("\n" + "─".repeat(70));
      console.log(`📦 ${r.title}`);
      console.log(`   WP slug:   ${r.wpSlug}`);
      console.log(`   Neon slug: ${r.neonSlug}`);
      console.log(`   Variants:  WP=${r.wpActualVariationCount} (cartesian=${r.wpExpectedCount}), Neon=${r.dbActualCount}`);
      console.log(`   WP attrs:  ${r.wpAttrNames.join(", ") || "(none)"}`);
      for (const n of r.notes) console.log(`   ${n}`);

      const showDiff = (label: string, d?: OptionDiff) => {
        if (!d) return;
        console.log(`   ${label}:`);
        console.log(`     WP (${d.wpOptions.length}): ${d.wpOptions.join(", ") || "—"}`);
        console.log(`     DB (${d.dbOptions.length}): ${d.dbOptions.join(", ") || "—"}`);
        if (d.missingInDb.length) console.log(`     ❌ Missing in DB: ${d.missingInDb.join(", ")}`);
        if (d.extraInDb.length) console.log(`     ➕ Only in DB:   ${d.extraInDb.join(", ")}`);
      };
      showDiff("BASKI", r.baski);
      showDiff("RENK ", r.renk);
      showDiff("DESEN", r.desen);
      if (r.adet) {
        console.log(`   ADET:`);
        console.log(`     WP (${r.adet.wp.length}): ${r.adet.wp.join(", ") || "—"}`);
        console.log(`     DB (${r.adet.db.length}): ${r.adet.db.join(", ") || "—"}`);
        if (r.adet.missingInDb.length) console.log(`     ❌ Missing in DB: ${r.adet.missingInDb.join(", ")}`);
        if (r.adet.extraInDb.length) console.log(`     ➕ Only in DB:   ${r.adet.extraInDb.join(", ")}`);
      }
    }

    console.log("\n" + "=".repeat(70));
    console.log("Run with --json to save full report:");
    console.log("  npx tsx scripts/audit-variants-detail.ts --json > variants.json");
    console.log("=".repeat(70));
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("Detail audit failed:", e);
  process.exit(1);
});
