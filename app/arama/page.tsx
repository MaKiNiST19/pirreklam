import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import ProductGrid from "@/components/product/ProductGrid";
import type { ProductWithVariants } from "@/types/index";

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Arama: ${q} - Pir Reklam` : "Arama - Pir Reklam",
    description: q
      ? `"${q}" icin arama sonuclari - Pir Reklam`
      : "Pir Reklam urun arama",
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q?.trim() || "";

  let products: ProductWithVariants[] = [];

  if (query) {
    products = (await prisma.product.findMany({
      where: {
        isPublished: true,
        title: { contains: query, mode: "insensitive" },
      },
      include: {
        variants: { orderBy: { sortOrder: "asc" } },
        category: { include: { parent: true } },
      },
      orderBy: { menuOrder: "asc" },
    })) as ProductWithVariants[];
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
        Arama Sonuclari
      </h1>

      {query ? (
        <p className="text-gray-600 mb-6">
          <span className="font-semibold">&quot;{query}&quot;</span> icin{" "}
          <span className="font-semibold">{products.length}</span> sonuc
          bulundu.
        </p>
      ) : (
        <p className="text-gray-500 mb-6">
          Arama yapmak icin bir kelime girin.
        </p>
      )}

      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : query ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            Aradiginiz kriterlere uygun urun bulunamadi.
          </p>
        </div>
      ) : null}
    </div>
  );
}
