import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import ProductGrid from "@/components/product/ProductGrid";
import JsonLd from "@/components/seo/JsonLd";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "Pir Reklam – 444 10 30 | Ruhsat Kabi | Pasaport Kilifi | Vesikalik Kabi",
  description:
    "Pir Reklam | Kurumsal Promosyon Urunleri, Ruhsat Kabi, Plakalik, Oto Kokusu, Anahtarlik, Pasaport Kilifi, Doviz Kabi, Fotograf Kabi ve daha fazlasi.",
  alternates: { canonical: "/" },
};

interface SectorSection {
  title: string;
  keywords: string[];
}

const SECTORS: SectorSection[] = [
  {
    title: "Oto Galeri ve Servisler",
    keywords: ["Ruhsat Kabi", "Plakalik", "Oto Kokusu", "Anahtarlik"],
  },
  {
    title: "Rent a Car Firmalari",
    keywords: ["Ruhsat Kabi", "Plakalik", "Oto Kokusu", "Kartvizit"],
  },
  {
    title: "Turizm ve Seyahat Acenteleri",
    keywords: ["Pasaport Kilifi", "Bagaj Valiz Etiketligi"],
  },
  {
    title: "Fotograf Studyolari",
    keywords: [
      "Fotograf Kabi",
      "6x9",
      "10x15",
      "13x18",
      "15x21",
      "18x24",
      "20x25",
    ],
  },
  {
    title: "Doviz Burolari",
    keywords: ["Doviz Kabi"],
  },
  {
    title: "Kuyumcular",
    keywords: ["Doviz Kabi"],
  },
];

export default async function HomePage() {
  const [sliders, allProducts, categories] = await Promise.all([
    prisma.slider
      .findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } })
      .catch(() => []),
    prisma.product
      .findMany({
        where: { isPublished: true },
        include: {
          variants: { orderBy: { sortOrder: "asc" } },
          category: { include: { parent: true } },
        },
        orderBy: { menuOrder: "asc" },
      })
      .catch(() => []),
    prisma.category
      .findMany({
        where: { parentId: null },
        include: { children: true },
        orderBy: { menuOrder: "asc" },
      })
      .catch(() => []),
  ]);

  function getProductsForKeywords(keywords: string[]) {
    return allProducts.filter((p) =>
      keywords.some(
        (kw) =>
          p.title.toLowerCase().includes(kw.toLowerCase()) ||
          p.category?.name.toLowerCase().includes(kw.toLowerCase())
      )
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Pir Reklam",
    url: "https://pirreklam.com.tr",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://pirreklam.com.tr/arama?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* Hero Slider */}
      {sliders.length > 0 ? (
        <section className="relative w-full overflow-hidden">
          <div className="relative w-full h-[300px] md:h-[450px]">
            <Image
              src={sliders[0].imageUrl}
              alt={sliders[0].title || "Pir Reklam"}
              fill
              className="object-cover"
              priority
            />
            {sliders[0].link && (
              <Link
                href={sliders[0].link}
                className="absolute inset-0"
                aria-label={sliders[0].title || "Slider"}
              />
            )}
          </div>
        </section>
      ) : (
        <section className="bg-gradient-to-r from-gray-900 to-gray-700 text-white py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Pir Reklam
            </h1>
            <p className="text-lg md:text-xl text-gray-300">
              Kurumsal Promosyon Urunleri
            </p>
            <p className="mt-2 text-2xl font-semibold">444 10 30</p>
          </div>
        </section>
      )}

      {/* Featured Categories */}
      {categories.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Urun Kategorileri
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/urun-kategori/${cat.slug}/`}
                className="group block rounded-xl bg-white p-4 text-center shadow hover:shadow-md transition-shadow"
              >
                {cat.image && (
                  <div className="relative w-full h-24 mb-2">
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
                <span className="text-sm font-semibold text-gray-800 group-hover:text-[#cc0636] transition-colors">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Sector Sections */}
      {SECTORS.map((sector) => {
        const products = getProductsForKeywords(sector.keywords);
        if (products.length === 0) return null;
        return (
          <section
            key={sector.title}
            className="container mx-auto px-4 py-10"
          >
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 border-l-4 border-[#cc0636] pl-3">
              {sector.title}
            </h2>
            <ProductGrid products={products} />
          </section>
        );
      })}

      {/* Empty state fallback */}
      {allProducts.length === 0 && (
        <section className="container mx-auto px-4 py-20 text-center">
          <p className="text-gray-500 text-lg">
            Henuz urun eklenmemis. Yakinda burada urunlerimizi gorebileceksiniz.
          </p>
        </section>
      )}
    </>
  );
}
