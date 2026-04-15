import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";

export const revalidate = 60; // ISR: revalidate every 60 seconds
import Breadcrumb from "@/components/category/Breadcrumb";
import TopFilter from "@/components/category/TopFilter";
import ProductGrid from "@/components/product/ProductGrid";
import SubCategoryCarousel from "@/components/category/SubCategoryCarousel";
import AnchorNav from "@/components/category/AnchorNav";
import JsonLd from "@/components/seo/JsonLd";
import type { BreadcrumbItem, ProductWithVariants } from "@/types/index";

interface Props {
  params: Promise<{ slugs: string[] }>;
  searchParams: Promise<{ baski?: string; renk?: string; desen?: string }>;
}

async function resolveCategory(slugs: string[]) {
  // Last slug is the category we want to resolve
  const targetSlug = slugs[slugs.length - 1];

  const category = await prisma.category.findUnique({
    where: { slug: targetSlug },
    include: {
      children: { orderBy: { menuOrder: "asc" } },
      parent: { include: { parent: true } },
    },
  });

  if (!category) return null;

  // Validate slug path matches parent chain
  if (slugs.length === 1 && !category.parentId) return category;
  if (slugs.length === 2 && category.parent?.slug === slugs[0]) return category;
  if (slugs.length === 3 && category.parent?.slug === slugs[1] && category.parent?.parent?.slug === slugs[0]) return category;

  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slugs } = await params;
  const category = await resolveCategory(slugs);
  if (!category) return { title: "Kategori Bulunamadi" };

  return {
    title: category.seoTitle || `${category.name} - Pir Reklam`,
    description:
      category.seoDescription ||
      `${category.name} ürünleri. Pir Reklam kurumsal promosyon ürünleri.`,
    alternates: {
      canonical: `/urun-kategori/${slugs.join("/")}/`,
    },
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slugs } = await params;
  const filters = await searchParams;
  const category = await resolveCategory(slugs);

  if (!category) notFound();

  type ChildCategory = { id: string; name: string; slug: string; menuOrder: number };
  const children: ChildCategory[] = (category.children || []) as ChildCategory[];
  const hasChildren = children.length > 0;

  // Breadcrumb
  const breadcrumbItems: BreadcrumbItem[] = [{ name: "Anasayfa", href: "/" }];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parentCat = category.parent as any;
  if (parentCat?.parent) {
    breadcrumbItems.push({ name: parentCat.parent.name, href: `/urun-kategori/${parentCat.parent.slug}/` });
  }
  if (parentCat) {
    const parentPath = parentCat.parent
      ? `/urun-kategori/${parentCat.parent.slug}/${parentCat.slug}/`
      : `/urun-kategori/${parentCat.slug}/`;
    breadcrumbItems.push({ name: parentCat.name, href: parentPath });
  }
  breadcrumbItems.push({ name: category.name, href: `/urun-kategori/${slugs.join("/")}/` });

  // JSON-LD
  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.name,
    url: `https://pirreklam.com.tr/urun-kategori/${slugs.join("/")}/`,
    description: category.description || category.name,
  };

  // ===== CATEGORY WITH CHILDREN VIEW (sections with carousels) =====
  if (hasChildren) {
    const childIds = children.map((c) => c.id);
    const allCategoryIds = [category.id, ...childIds];

    const allProducts = (await prisma.product.findMany({
      where: { isPublished: true, categoryId: { in: allCategoryIds } },
      include: {
        variants: { orderBy: { sortOrder: "asc" } },
        category: { include: { parent: true } },
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

    // Group by categoryId
    const byCategory = new Map<string, ProductWithVariants[]>();
    for (const p of allProducts) {
      const cid = p.categoryId || "";
      if (!byCategory.has(cid)) byCategory.set(cid, []);
      byCategory.get(cid)!.push(p);
    }

    // Collect filter options from ALL products
    const allVariants = allProducts.flatMap((p) => p.variants);
    const baskiOptions = [...new Set(allVariants.map((v) => v.baskiOption).filter(Boolean))] as string[];
    const renkOptions = [...new Set(allVariants.map((v) => v.renkOption).filter(Boolean))] as string[];
    const desenOptions = [...new Set(allVariants.map((v) => v.desenOption).filter(Boolean))] as string[];

    // Products directly on parent (not in any child)
    const parentDirectProducts = byCategory.get(category.id) || [];

    // Only show sections that have products
    const sectionsWithProducts = children.filter(
      (c) => (byCategory.get(c.id)?.length ?? 0) > 0
    );

    return (
      <>
        <JsonLd data={collectionLd} />
        <div className="container mx-auto px-4 py-6">
          {/* Sticky navy anchor strip (above breadcrumb) */}
          <AnchorNav
            sections={sectionsWithProducts.map((c) => ({ id: c.id, name: c.name, slug: c.slug }))}
          />

          <Breadcrumb items={breadcrumbItems} />

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-4 mb-4">
            {category.name}
          </h1>

          {category.description && (
            <p className="text-gray-600 mb-4">{category.description}</p>
          )}

          {/* Top filters */}
          {(baskiOptions.length > 0 || renkOptions.length > 0 || desenOptions.length > 0) && (
            <TopFilter
              baskiOptions={baskiOptions}
              renkOptions={renkOptions}
              desenOptions={desenOptions}
            />
          )}

          {/* Sub-category sections: red title + gray bordered box + carousel */}
          <div className="space-y-8">
            {sectionsWithProducts.map((child) => {
              const products = byCategory.get(child.id) || [];
              return (
                <section key={child.id} id={`cat-${child.slug}`} className="scroll-mt-24">
                  {/* Red centered title — links to child category page */}
                  <h2 className="text-center font-bold text-lg md:text-xl mb-3">
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
        </div>
      </>
    );
  }

  // ===== CHILD CATEGORY VIEW =====
  const parseMulti = (v?: string) => v ? v.split(",").filter(Boolean) : [];
  const baskiFilter = parseMulti(filters.baski);
  const renkFilter = parseMulti(filters.renk);
  const desenFilter = parseMulti(filters.desen);

  const variantWhere: Record<string, unknown> = {};
  if (baskiFilter.length > 0) variantWhere.baskiOption = { in: baskiFilter };
  if (renkFilter.length > 0) variantWhere.renkOption = { in: renkFilter };
  if (desenFilter.length > 0) variantWhere.desenOption = { in: desenFilter };
  const hasFilters = Object.keys(variantWhere).length > 0;

  const products = (await prisma.product.findMany({
    where: {
      isPublished: true,
      categoryId: category.id,
      ...(hasFilters ? { variants: { some: variantWhere } } : {}),
    },
    include: {
      variants: { orderBy: { sortOrder: "asc" } },
      category: { include: { parent: true } },
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

  const allVariants = products.flatMap((p) => p.variants);
  const baskiOptions = [...new Set(allVariants.map((v) => v.baskiOption).filter(Boolean))] as string[];
  const renkOptions = [...new Set(allVariants.map((v) => v.renkOption).filter(Boolean))] as string[];
  const desenOptions = [...new Set(allVariants.map((v) => v.desenOption).filter(Boolean))] as string[];

  return (
    <>
      <JsonLd data={collectionLd} />
      <div className="container mx-auto px-4 py-6">
        <Breadcrumb items={breadcrumbItems} />

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-4 mb-4">
          {category.name}
        </h1>

        {category.description && (
          <p className="text-gray-600 mb-4">{category.description}</p>
        )}

        {/* Top collapsible filters */}
        {(baskiOptions.length > 0 || renkOptions.length > 0 || desenOptions.length > 0) && (
          <TopFilter
            baskiOptions={baskiOptions}
            renkOptions={renkOptions}
            desenOptions={desenOptions}
          />
        )}

        {products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <p className="text-gray-500 text-center py-12">
            Bu kategoride ürün bulunamadı.
          </p>
        )}
      </div>
    </>
  );
}
