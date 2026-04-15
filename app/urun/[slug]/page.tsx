import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { prisma } from "@/lib/db";
import { getUsdTryRate } from "@/lib/exchange-rate";

export const revalidate = 300; // ISR: revalidate every 5 minutes
export const dynamicParams = true;
export const fetchCache = "force-cache";
import Breadcrumb from "@/components/category/Breadcrumb";
import JsonLd from "@/components/seo/JsonLd";
import ProductDetailClient from "./ProductDetailClient";
import SubCategoryCarousel from "@/components/category/SubCategoryCarousel";
import type { BreadcrumbItem, BankAccount, ProductWithVariants } from "@/types/index";
import type { VariantOption } from "@/lib/variants";

interface Props {
  params: Promise<{ slug: string }>;
}

// Pre-build first 500 products at deploy time, the rest use ISR
export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    where: { isPublished: true },
    select: { slug: true },
    take: 500,
  }).catch(() => []);
  return products.map((p) => ({ slug: p.slug }));
}

const getProduct = cache(async (slug: string) => {
  return prisma.product.findUnique({
    where: { slug, isPublished: true },
    include: {
      variants: { orderBy: { sortOrder: "asc" } },
      category: { include: { parent: true } },
    },
  });
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Urun Bulunamadi" };

  return {
    title: product.seoTitle || `${product.title} - Pir Reklam`,
    description:
      product.seoDescription ||
      product.shortDesc ||
      `${product.title} - Pir Reklam kurumsal promosyon urunleri.`,
    openGraph: {
      title: product.seoTitle || product.title,
      description: product.seoDescription || product.shortDesc || "",
      images: product.images[0]
        ? [{ url: product.images[0], width: 800, height: 800 }]
        : [],
    },
    alternates: { canonical: `/urun/${slug}/` },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;

  const [product, exchangeRate, companyInfo] = await Promise.all([
    getProduct(slug),
    getUsdTryRate(),
    prisma.companyInfo.findUnique({ where: { id: "singleton" } }).catch(() => null),
  ]);

  if (!product) notFound();

  const bankAccounts: BankAccount[] = companyInfo?.bankAccounts
    ? (companyInfo.bankAccounts as unknown as BankAccount[])
    : [];

  // Breadcrumb (L1 categories non-clickable)
  const breadcrumbItems: BreadcrumbItem[] = [
    { name: "Anasayfa", href: "/" },
  ];
  if (product.category) {
    if (product.category.parent) {
      // L1 parent — non-clickable
      breadcrumbItems.push({
        name: product.category.parent.name,
        href: `/urun-kategori/${product.category.parent.slug}/`,
        noLink: true,
      });
    }
    breadcrumbItems.push({
      name: product.category.name,
      href: product.category.parent
        ? `/urun-kategori/${product.category.parent.slug}/${product.category.slug}/`
        : `/urun-kategori/${product.category.slug}/`,
      // If category itself is L1 (no parent), it's also non-clickable
      noLink: !product.category.parent,
    });
  }
  breadcrumbItems.push({
    name: product.title,
    href: `/urun/${product.slug}/`,
  });

  // Variants as VariantOption[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const variants: VariantOption[] = product.variants.map((v: any) => ({
    id: v.id,
    sku: v.sku,
    baskiOption: v.baskiOption,
    renkOption: v.renkOption,
    desenOption: v.desenOption,
    adet: v.adet,
    priceUsd: Number(v.priceUsd),
    isCompatible: v.isCompatible,
    stockCode: v.stockCode,
    image: v.image ?? null,
  }));

  // Related products (lighter query)
  const relatedProducts = product.categoryId
    ? ((await prisma.product.findMany({
        where: {
          isPublished: true,
          categoryId: product.categoryId,
          id: { not: product.id },
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
        take: 6,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      })).map((p: any) => ({
        ...p,
        variants: p.variants.map((v: any) => ({ ...v, priceUsd: Number(v.priceUsd) })),
      })) as ProductWithVariants[])
    : [];

  // JSON-LD
  const lowestPrice = variants.length
    ? Math.min(...variants.map((v) => v.priceUsd))
    : 0;

  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.shortDesc || product.description || "",
    image: product.images,
    sku: variants[0]?.sku || product.slug,
    brand: { "@type": "Brand", name: "Pir Reklam" },
    url: `https://pirreklam.com.tr/urun/${product.slug}/`,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: lowestPrice,
      offerCount: variants.length,
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      <JsonLd data={productLd} />

      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb at the very top */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Two-column layout with title/sku moved inside (next to gallery at the top) */}
        <ProductDetailClient
          product={{
            id: product.id,
            title: product.title,
            slug: product.slug,
            images: product.images,
            productType: product.productType,
          }}
          variants={variants}
          exchangeRate={exchangeRate}
          bankAccounts={bankAccounts}
        />

        {/* Description */}
        {product.description && (
          <div className="mt-12 prose prose-lg max-w-none">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Urun Aciklamasi
            </h2>
            <div dangerouslySetInnerHTML={{ __html: product.description }} />
          </div>
        )}

        {/* Related Products — same carousel design as category page */}
        {relatedProducts.length > 0 && (
          <section className="mt-12">
            <h2 className="text-center font-bold text-lg md:text-xl" style={{ color: "#cc0636", marginBottom: "4px" }}>
              Benzer Ürünler
            </h2>
            <SubCategoryCarousel products={relatedProducts} />
          </section>
        )}
      </div>
    </>
  );
}
