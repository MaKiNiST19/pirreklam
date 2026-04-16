import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { prisma } from "@/lib/db";

export const revalidate = 300; // ISR: revalidate every 5 minutes
export const dynamicParams = true;
export const fetchCache = "force-cache";
import Breadcrumb from "@/components/category/Breadcrumb";
import SubCategoryCarousel from "@/components/category/SubCategoryCarousel";
import JsonLd from "@/components/seo/JsonLd";
import CategorySeoSection from "@/components/seo/CategorySeoSection";
import { getSeoForSlug } from "@/lib/seo/registry";
import type { SeoPackage } from "@/lib/seo/types";
import type { BreadcrumbItem, ProductWithVariants } from "@/types/index";

function buildSeoJsonLd(
  seo: SeoPackage,
  breadcrumbItems: BreadcrumbItem[],
  slugs: string[],
) {
  const schemas: Record<string, unknown>[] = [];

  if (seo.product) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Product",
      name: seo.product.name,
      description: seo.product.description,
      category: seo.product.category,
      brand: seo.product.brand
        ? { "@type": "Brand", name: seo.product.brand }
        : undefined,
      url: `https://pirreklam.com.tr/urun-kategori/${slugs.join("/")}/`,
    });
  }

  if (seo.faq.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: seo.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }

  schemas.push({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: b.name,
      item: `https://pirreklam.com.tr${b.href}`,
    })),
  });

  return schemas;
}

interface Props {
  params: Promise<{ slugs: string[] }>;
}

// Pre-build all known category slug paths at deploy time
export async function generateStaticParams() {
  const cats = await prisma.category.findMany({
    select: { slug: true, parentId: true, parent: { select: { slug: true, parent: { select: { slug: true } } } } },
  }).catch(() => []);

  const paths: { slugs: string[] }[] = [];
  /* eslint-disable @typescript-eslint/no-explicit-any */
  for (const c of cats as any[]) {
    if (!c.parentId) {
      paths.push({ slugs: [c.slug] });
    } else if (c.parent && !c.parent.parent) {
      paths.push({ slugs: [c.parent.slug, c.slug] });
    } else if (c.parent && c.parent.parent) {
      paths.push({ slugs: [c.parent.parent.slug, c.parent.slug, c.slug] });
    }
  }
  return paths;
}

// Cached so generateMetadata + Page share the same query.
// For L1 categories, we also need grandchildren (L3) to build carousels per L2 with
// products that live under L3.
const resolveCategory = cache(async (slugs: string[]) => {
  const targetSlug = slugs[slugs.length - 1];

  const category = await prisma.category.findUnique({
    where: { slug: targetSlug },
    include: {
      // Direct children + their children (grandchildren) for L1 archive carousels
      children: {
        orderBy: { menuOrder: "asc" },
        select: {
          id: true, name: true, slug: true, menuOrder: true,
          children: {
            orderBy: { menuOrder: "asc" },
            select: { id: true, name: true, slug: true, menuOrder: true },
          },
        },
      },
      parent: { include: { parent: true } },
    },
  });

  if (!category) return null;

  if (slugs.length === 1 && !category.parentId) return category;
  if (slugs.length === 2 && category.parent?.slug === slugs[0]) return category;
  if (slugs.length === 3 && category.parent?.slug === slugs[1] && category.parent?.parent?.slug === slugs[0]) return category;

  return null;
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slugs } = await params;
  const category = await resolveCategory(slugs);
  if (!category) return { title: "Kategori Bulunamadi" };

  const seo = getSeoForSlug(slugs[slugs.length - 1]);

  return {
    title:
      seo?.meta?.title ||
      category.seoTitle ||
      `${category.name} - Pir Reklam`,
    description:
      seo?.meta?.description ||
      category.seoDescription ||
      `${category.name} ürünleri. Pir Reklam kurumsal promosyon ürünleri.`,
    alternates: {
      canonical: `/urun-kategori/${slugs.join("/")}/`,
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slugs } = await params;
  const category = await resolveCategory(slugs);

  if (!category) notFound();

  type GrandChild = { id: string; name: string; slug: string; menuOrder: number };
  type ChildCategory = { id: string; name: string; slug: string; menuOrder: number; children?: GrandChild[] };
  const children: ChildCategory[] = (category.children || []) as ChildCategory[];
  const hasChildren = children.length > 0;

  // Breadcrumb — only the top-level (L1) ancestor is non-clickable; all deeper levels are links
  const breadcrumbItems: BreadcrumbItem[] = [{ name: "Anasayfa", href: "/" }];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chain: { name: string; slug: string }[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let cur: any = category;
  while (cur) {
    chain.unshift({ name: cur.name, slug: cur.slug });
    cur = cur.parent;
  }
  chain.forEach((node, i) => {
    const pathSlugs = chain.slice(0, i + 1).map((n) => n.slug).join("/");
    breadcrumbItems.push({
      name: node.name,
      href: `/urun-kategori/${pathSlugs}/`,
      noLink: i === 0, // only top-level L1 is non-clickable
    });
  });

  // JSON-LD
  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.name,
    url: `https://pirreklam.com.tr/urun-kategori/${slugs.join("/")}/`,
    description: category.description || category.name,
  };

  const seoPackage = getSeoForSlug(slugs[slugs.length - 1]);
  const seoJsonLdList = seoPackage
    ? buildSeoJsonLd(seoPackage, breadcrumbItems, slugs)
    : [];

  // ===== CATEGORY WITH CHILDREN VIEW (sections with carousels) =====
  if (hasChildren) {
    // Collect IDs of the current category, its direct children (L2) AND grandchildren (L3)
    const grandChildIds: string[] = [];
    children.forEach((c) => (c.children || []).forEach((gc) => grandChildIds.push(gc.id)));
    const allCategoryIds = [category.id, ...children.map((c) => c.id), ...grandChildIds];

    const allProducts = (await prisma.product.findMany({
      where: { isPublished: true, categoryId: { in: allCategoryIds } },
      select: {
        id: true, title: true, slug: true, images: true, categoryId: true,
        productType: true, menuOrder: true,
        variants: {
          orderBy: { sortOrder: "asc" },
          select: { id: true, sku: true, baskiOption: true, renkOption: true, desenOption: true, adet: true, priceUsd: true, image: true, isCompatible: true, stockCode: true },
        },
      },
      orderBy: { menuOrder: "asc" },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    })).map((p: any) => ({
      ...p,
      variants: p.variants.map((v: any) => ({
        ...v,
        priceUsd: Number(v.priceUsd),
      })),
    })) as ProductWithVariants[];

    // Build a map: grandchild.id -> its parent child.id, so we can bucket L3 products under their L2
    const grandChildToChild = new Map<string, string>();
    children.forEach((c) => (c.children || []).forEach((gc) => grandChildToChild.set(gc.id, c.id)));

    // Group products by the L2 child bucket
    const byChild = new Map<string, ProductWithVariants[]>();
    for (const p of allProducts) {
      const cid = p.categoryId || "";
      // If product is directly under a child (L2), use cid. If under a grandchild (L3), remap to its L2.
      const bucket = grandChildToChild.get(cid) || cid;
      if (!byChild.has(bucket)) byChild.set(bucket, []);
      byChild.get(bucket)!.push(p);
    }

    // Only show sections that have products
    const sectionsWithProducts = children.filter(
      (c) => (byChild.get(c.id)?.length ?? 0) > 0
    );

    return (
      <>
        <JsonLd data={collectionLd} />
        {seoJsonLdList.map((ld, i) => (
          <JsonLd key={i} data={ld} />
        ))}
        <div className="container mx-auto px-4 pt-2 pb-6">
          <Breadcrumb items={breadcrumbItems} />

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-4 mb-4">
            {category.name}
          </h1>

          {category.description && (
            <p className="text-gray-600 mb-4">{category.description}</p>
          )}

          {/* Sub-category sections: red title + gray bordered box + carousel */}
          <div className="space-y-8">
            {sectionsWithProducts.map((child) => {
              const products = byChild.get(child.id) || [];
              return (
                <section key={child.id} id={`cat-${child.slug}`} className="scroll-mt-24">
                  {/* Red centered title — links to child category page */}
                  <h2 className="text-center font-bold text-lg md:text-xl" style={{ marginBottom: "4px" }}>
                    <Link
                      href={`/urun-kategori/${slugs.join("/")}/${child.slug}/`}
                      className="hover:underline"
                      style={{ color: "#cc0636" }}
                    >
                      {child.name}
                    </Link>
                  </h2>

                  {/* Gray bordered box with products */}
                  <div className="border-0 bg-transparent p-0">
                    <SubCategoryCarousel products={products} />
                  </div>
                </section>
              );
            })}
          </div>

          {seoPackage && <CategorySeoSection data={seoPackage} />}
        </div>
      </>
    );
  }

  // ===== CHILD CATEGORY VIEW =====
  const products = (await prisma.product.findMany({
    where: {
      isPublished: true,
      categoryId: category.id,
    },
    select: {
      id: true, title: true, slug: true, images: true, categoryId: true,
      productType: true, menuOrder: true,
      variants: {
        orderBy: { sortOrder: "asc" },
        select: { id: true, sku: true, baskiOption: true, renkOption: true, desenOption: true, adet: true, priceUsd: true, image: true, isCompatible: true, stockCode: true },
      },
    },
    orderBy: { menuOrder: "asc" },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  })).map((p: any) => ({
    ...p,
    variants: p.variants.map((v: any) => ({
      ...v,
      priceUsd: Number(v.priceUsd),
    })),
  })) as ProductWithVariants[];

  return (
    <>
      <JsonLd data={collectionLd} />
      {seoJsonLdList.map((ld, i) => (
        <JsonLd key={i} data={ld} />
      ))}
      <div className="container mx-auto px-4 pt-2 pb-6">
        <Breadcrumb items={breadcrumbItems} />

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-4 mb-4">
          {category.name}
        </h1>

        {category.description && (
          <p className="text-gray-600 mb-4">{category.description}</p>
        )}

        {products.length > 0 ? (
          <SubCategoryCarousel products={products} />
        ) : (
          <p className="text-gray-500 text-center py-12">
            Bu kategoride ürün bulunamadı.
          </p>
        )}

        {seoPackage && <CategorySeoSection data={seoPackage} />}
      </div>
    </>
  );
}
