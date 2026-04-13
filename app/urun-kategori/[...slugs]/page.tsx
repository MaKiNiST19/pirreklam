import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import Breadcrumb from "@/components/category/Breadcrumb";
import TopFilter from "@/components/category/TopFilter";
import ProductGrid from "@/components/product/ProductGrid";
import SubCategoryCarousel from "@/components/category/SubCategoryCarousel";
import JsonLd from "@/components/seo/JsonLd";
import type { BreadcrumbItem, ProductWithVariants } from "@/types/index";

interface Props {
  params: Promise<{ slugs: string[] }>;
  searchParams: Promise<{ baski?: string; renk?: string; desen?: string }>;
}

async function resolveCategory(slugs: string[]) {
  if (slugs.length === 1) {
    return prisma.category.findUnique({
      where: { slug: slugs[0] },
      include: {
        children: { orderBy: { menuOrder: "asc" } },
        parent: true,
      },
    });
  }

  if (slugs.length === 2) {
    const child = await prisma.category.findUnique({
      where: { slug: slugs[1] },
      include: {
        children: { orderBy: { menuOrder: "asc" } },
        parent: true,
      },
    });
    if (child && child.parent?.slug === slugs[0]) return child;
    return null;
  }

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

  const isParent = !category.parentId;

  // Breadcrumb
  const breadcrumbItems: BreadcrumbItem[] = [{ name: "Anasayfa", href: "/" }];
  if (isParent) {
    breadcrumbItems.push({ name: category.name, href: `/urun-kategori/${category.slug}/` });
  } else {
    if (category.parent) {
      breadcrumbItems.push({ name: category.parent.name, href: `/urun-kategori/${category.parent.slug}/` });
    }
    breadcrumbItems.push({ name: category.name, href: `/urun-kategori/${slugs.join("/")}/` });
  }

  // JSON-LD
  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.name,
    url: `https://pirreklam.com.tr/urun-kategori/${slugs.join("/")}/`,
    description: category.description || category.name,
  };

  // ===== PARENT CATEGORY VIEW =====
  if (isParent && category.children.length > 0) {
    const childIds = category.children.map((c) => c.id);
    const allCategoryIds = [category.id, ...childIds];

    const allProducts = (await prisma.product.findMany({
      where: { isPublished: true, categoryId: { in: allCategoryIds } },
      include: {
        variants: { orderBy: { sortOrder: "asc" } },
        category: { include: { parent: true } },
      },
      orderBy: { menuOrder: "asc" },
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
    const sectionsWithProducts = category.children.filter(
      (c) => (byCategory.get(c.id)?.length ?? 0) > 0
    );

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

          {/* Anchor navigation for sub-categories */}
          {sectionsWithProducts.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {sectionsWithProducts.map((child) => (
                <a
                  key={child.id}
                  href={`#cat-${child.slug}`}
                  className="px-3 py-1.5 rounded-md border border-[#cc0636] text-[#cc0636] text-sm font-medium hover:bg-[#cc0636] hover:text-white transition-colors"
                >
                  {child.name}
                </a>
              ))}
            </div>
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
            {/* Products directly assigned to parent category */}
            {parentDirectProducts.length > 0 && (
              <section>
                <h2 className="text-center font-bold text-lg md:text-xl mb-3" style={{ color: "#cc0636" }}>
                  {category.name}
                </h2>
                <div className="border border-gray-200 rounded-lg bg-gray-50 px-6 py-5">
                  <SubCategoryCarousel products={parentDirectProducts} />
                </div>
              </section>
            )}

            {sectionsWithProducts.map((child) => {
              const products = byCategory.get(child.id) || [];
              return (
                <section key={child.id} id={`cat-${child.slug}`} className="scroll-mt-24">
                  {/* Red centered title */}
                  <h2
                    className="text-center font-bold text-lg md:text-xl mb-3"
                    style={{ color: "#cc0636" }}
                  >
                    {child.name}
                  </h2>

                  {/* Gray bordered box with products */}
                  <div className="border border-gray-200 rounded-lg bg-gray-50 px-6 py-5">
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
  const variantWhere: Record<string, unknown> = {};
  if (filters.baski) variantWhere.baskiOption = filters.baski;
  if (filters.renk) variantWhere.renkOption = filters.renk;
  if (filters.desen) variantWhere.desenOption = filters.desen;
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
