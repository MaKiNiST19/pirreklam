import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

/**
 * Manual revalidation endpoint.
 *
 * Usage:
 *   /api/revalidate?path=/urun/some-slug/&secret=XXX
 *   /api/revalidate?path=/urun-kategori/plastik-urunler/ruhsat-kabi/&secret=XXX
 *   /api/revalidate?all=1&secret=XXX      (revalidate home + category pages + products)
 *
 * Secret = REVALIDATE_SECRET env var (falls back to "pirreklam-revalidate" if unset).
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");
  const expected = process.env.REVALIDATE_SECRET || "pirreklam-revalidate";
  if (secret !== expected) {
    return NextResponse.json({ ok: false, error: "invalid secret" }, { status: 401 });
  }

  const all = searchParams.get("all");
  const path = searchParams.get("path");

  const revalidated: string[] = [];

  if (all) {
    revalidatePath("/", "page");
    revalidatePath("/urun/[slug]", "page");
    revalidatePath("/urun-kategori/[...slugs]", "page");
    revalidated.push("/", "/urun/[slug]", "/urun-kategori/[...slugs]");
  } else if (path) {
    revalidatePath(path);
    revalidated.push(path);
  } else {
    return NextResponse.json({ ok: false, error: "missing path or all" }, { status: 400 });
  }

  return NextResponse.json({ ok: true, revalidated, at: new Date().toISOString() });
}
