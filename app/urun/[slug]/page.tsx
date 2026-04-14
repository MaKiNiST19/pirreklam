import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getUsdTryRate } from "@/lib/exchange-rate";
import Breadcrumb from "@/components/category/Breadcrumb";
import ProductGrid from "@/components/product/ProductGrid";
import JsonLd from "@/components/seo/JsonLd";
import ProductDetailClient from "./ProductDetailClient";
import type { BreadcrumbItem, BankAccount, ProductWithVariants } from "@/types/index";
import type { VariantOption } from "@/lib/variants";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string) {
  return prisma.product.findUnique({
    where: { slug, isPublished: true },
    include: {
      variants: { orderBy: { sortOrder: "asc" } },
      category: { include: { parent: true } },
    },
  });
}

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

  // Breadcrumb
  const breadcrumbItems: BreadcrumbItem[] = [
    { name: "Anasayfa", href: "/" },
  ];
  if (product.category) {
    if (product.category.parent) {
      breadcrumbItems.push({
        name: product.category.parent.name,
        href: `/urun-kategori/${product.category.parent.slug}/`,
      });
    }
    breadcrumbItems.push({
      name: product.category.name,
      href: product.category.parent
        ? `/urun-kategori/${product.category.parent.slug}/${product.category.slug}/`
        : `/urun-kategori/${product.category.slug}/`,
    });
  }
  breadcrumbItems.push({
    name: product.title,
    href: `/urun/${product.slug}/`,
  });

  // Variants as VariantOption[]
  const variants: VariantOption[] = product.variants.map((v) => ({
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

  // Related products
  const relatedProducts = product.categoryId
    ? ((await prisma.product.findMany({
        where: {
          isPublished: true,
          categoryId: product.categoryId,
          id: { not: product.id },
        },
        include: {
          variants: { orderBy: { sortOrder: "asc" } },
          category: { include: { parent: true } },
        },
        orderBy: { menuOrder: "asc" },
        take: 6,
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
        <Breadcrumb items={breadcrumbItems} />

        {/* Title + SKU above the two-column layout */}
        <div className="mt-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {product.title}
          </h1>
          {variants.length > 0 && (
            <div className="mb-4 inline-flex items-center gap-1.5 bg-gray-100 rounded px-2.5 py-1">
              <span className="text-[11px] font-semibold text-gray-600">Stok Kodu :</span>
              <span className="text-xs font-bold text-[#cc0636]">{variants[0].sku}</span>
            </div>
          )}
        </div>

        {/* Two-column layout (gallery + variants) is now managed inside ProductDetailClient */}
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

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Benzer Urunler
            </h2>
            <ProductGrid products={relatedProducts} />
          </section>
        )}
      </div>
    </>
  );
}
