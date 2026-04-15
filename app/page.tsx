import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import JsonLd from "@/components/seo/JsonLd";
import Image from "next/image";
import FeatureBadge from "@/components/home/FeatureBadge";
import SectorTabs, { type SectorTab } from "@/components/home/SectorTabs";
import type { ProductWithVariants } from "@/types/index";

export const revalidate = 60;

export const metadata: Metadata = {
  title:
    "Pir Reklam – 444 10 30 | Ruhsat Kabi | Pasaport Kilifi | Vesikalik Kabi",
  description:
    "Pir Reklam | Kurumsal Promosyon Urunleri, Ruhsat Kabi, Plakalik, Oto Kokusu, Anahtarlik, Pasaport Kilifi, Doviz Kabi, Fotograf Kabi ve daha fazlasi.",
  alternates: { canonical: "/" },
};

/* ───────────────────────── SECTOR DEFINITIONS ───────────────────────── */
interface SectorDef {
  id: string;
  title: string;
  description?: string;
  keywords: string[];
}

const SECTORS: SectorDef[] = [
  {
    id: "sigorta-oto",
    title: "Sigorta Acenteleri, Oto Galeri ve Servisler, Rent a Car Firmaları",
    description:
      "Sigorta, oto galeri, servis ve rent a car firmalarınız için ruhsat kabı, plakalık, oto kokusu ve anahtarlık gibi müşteri memnuniyetini artıran promosyon ürünleri.",
    keywords: ["Ruhsat Kabı", "Ruhsat Kabi", "Plakalık", "Plakalik", "Oto Kokusu", "Anahtarlık", "Anahtarlik"],
  },
  {
    id: "turizm",
    title: "Turizm ve Seyahat Acenteleri",
    description:
      "Otel, tur ve seyahat acenteleriniz için pasaport kılıfı, bagaj valiz etiketliği ve konaklama promosyonları.",
    keywords: ["Pasaport Kılıfı", "Pasaport Kilifi", "Bagaj", "Valiz Etiketliği", "Valiz Etiketligi"],
  },
  {
    id: "fotograf",
    title: "Fotoğraf Stüdyoları",
    description:
      "Vesikalık ve portre stüdyolarınız için 6x9, 10x15, 13x18, 15x21, 18x24, 20x25 standart ebatlarda fotoğraf kabı üretimi.",
    keywords: ["Fotoğraf Kabı", "Fotograf Kabi", "6x9", "10x15", "13x18", "15x21", "18x24", "20x25"],
  },
  {
    id: "doviz",
    title: "Döviz Büroları",
    description:
      "Döviz büroları için özel tasarımlı, kurumsal kimliğinize uygun döviz kabı modelleri.",
    keywords: ["Döviz Kabı", "Doviz Kabi"],
  },
  {
    id: "kuyumcu",
    title: "Kuyumcular",
    description:
      "Kuyumcularımız için gramajlı ürün teslimi, altın sertifikası ve müşteri takdimi amacıyla özel kutular.",
    keywords: ["Kuyumcu", "Altın", "Altin", "Sertifika"],
  },
];

/* ───────────────────────── BADGE DEFINITIONS ───────────────────────── */
const BADGES = [
  { title: "Yerli Üretim", subtitle: "Türkiye'de kendi tesislerimizde imal edilmektedir" },
  { title: "Tescilli Marka", subtitle: "Pir Reklam ve Pir Plastik Türk Patent Enstitüsü tescillidir" },
  { title: "Uzman Kadro", subtitle: "Alanında deneyimli ekibimizle hizmet sunuyoruz" },
  { title: "Sektör Lideri", subtitle: "Plastik promosyon segmentinde Türkiye'nin öncülerinden" },
];

/* ───────────────────────── COMPONENT ───────────────────────── */
export default async function HomePage() {
  const allProductsRaw = await prisma.product
    .findMany({
      where: { isPublished: true },
      include: {
        variants: { orderBy: { sortOrder: "asc" } },
        category: { include: { parent: true } },
      },
      orderBy: { menuOrder: "asc" },
    })
    .catch(() => []);

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const allProducts = (allProductsRaw as any[]).map((p) => ({
    ...p,
    variants: p.variants.map((v: any) => ({ ...v, priceUsd: Number(v.priceUsd) })),
  })) as ProductWithVariants[];

  function productsForKeywords(keywords: string[]): ProductWithVariants[] {
    return allProducts.filter((p) =>
      keywords.some(
        (kw) =>
          p.title.toLowerCase().includes(kw.toLowerCase()) ||
          p.category?.name.toLowerCase().includes(kw.toLowerCase())
      )
    );
  }

  const sectorTabs: SectorTab[] = SECTORS.map((s) => ({
    id: s.id,
    title: s.title,
    description: s.description,
    products: productsForKeywords(s.keywords).slice(0, 10),
  })).filter((t) => t.products.length > 0);

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

      {/* ═════ HERO ═════ */}
      <section className="relative w-full">
        <div className="relative w-full h-[320px] md:h-[520px] lg:h-[580px]">
          <Image
            src="/ruhsat-kabi-heroimg.jpg"
            alt="Pir Reklam — Kurumsal Promosyon Ürünleri"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>
      </section>

      {/* ═════ OVERLAPPING 4-BADGE ROW ═════ */}
      <section className="relative -mt-12 md:-mt-16 z-10 px-4">
        <div className="max-w-[1200px] mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 py-5 md:py-7 px-4 md:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:divide-x lg:divide-gray-100">
            {BADGES.map((badge, i) => (
              <div key={i} className="lg:px-4">
                <FeatureBadge title={badge.title} subtitle={badge.subtitle} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════ TABBED SECTOR SECTION ═════ */}
      {sectorTabs.length > 0 && (
        <section className="container mx-auto px-4 pt-10 md:pt-14 pb-12 md:pb-16">
          <div className="mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Sektörel Ürünler</h2>
            <div className="w-16 h-1 bg-[#cc0636] rounded-full" />
          </div>
          <SectorTabs tabs={sectorTabs} />
        </section>
      )}

      {/* Empty state */}
      {allProducts.length === 0 && (
        <section className="container mx-auto px-4 py-20 text-center">
          <p className="text-gray-500 text-lg">
            Henüz ürün eklenmemiş. Yakında burada ürünlerimizi görebileceksiniz.
          </p>
        </section>
      )}
    </>
  );
}
