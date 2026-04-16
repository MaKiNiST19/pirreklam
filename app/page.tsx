import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import Image from "next/image";
import FeatureBadge from "@/components/home/FeatureBadge";
import SectorCard, { type SectorCardItem } from "@/components/home/SectorCard";
import SeoContent from "@/components/home/SeoContent";

export const revalidate = 300;

export const metadata: Metadata = {
  title:
    "Pir Reklam – 444 10 30 | Ruhsat Kabi | Pasaport Kilifi | Vesikalik Kabi",
  description:
    "Pir Reklam | Kurumsal Promosyon Urunleri, Ruhsat Kabi, Plakalik, Oto Kokusu, Anahtarlik, Pasaport Kilifi, Doviz Kabi, Fotograf Kabi ve daha fazlasi.",
  alternates: { canonical: "/" },
};

/* ───────────────────────── SECTOR CARD DATA ───────────────────────── */
const SECTOR_CARDS: SectorCardItem[] = [
  {
    bgImage: "/oto-galeri-ruhsat-kabi.jpg",
    titles: [
      "Sigorta Acenteleri",
      "Oto Galeri ve Servisler",
      "Rent a Car Firmaları",
    ],
    links: [
      { name: "Ruhsat Kabı", href: "/urun-kategori/plastik-urunler/ruhsat-kabi/" },
      { name: "Plakalık", href: "/urun-kategori/plastik-urunler/plakalik/" },
      { name: "Poliçe Kabı", href: "/urun-kategori/plastik-urunler/police-kabi/" },
      { name: "Oto Kokusu", href: "/urun-kategori/promosyon-urunleri/oto-kokusu/" },
      { name: "Kartvizit", href: "/urun-kategori/matbaa-urunleri/kartvizit/" },
      { name: "Anahtarlık", href: "/urun-kategori/promosyon-urunleri/anahtarlik/" },
      { name: "Çakmak", href: "/urun-kategori/promosyon-urunleri/cakmak/" },
    ],
  },
  {
    bgImage: "/turizm-seyahat-acente-pasaport-kilifi.jpg",
    titles: [
      "Turizm ve Seyahat Acenteleri",
      "Hac ve Umre Turizm Acenteleri",
    ],
    links: [
      { name: "Pasaport Kılıfı", href: "/urun-kategori/plastik-urunler/pasaport-kilifi/" },
      { name: "Bagaj Valiz Etiketliği", href: "/urun-kategori/plastik-urunler/bagaj-etiketi/" },
      { name: "Şeffaf Pvc Kart Kılıfı", href: "/urun-kategori/plastik-urunler/kart-kilifi/" },
      { name: "Şeffaf Pvc İpli Yaka Kartı Kılıfı", href: "/urun-kategori/plastik-urunler/yaka-karti/" },
      { name: "Kredi Kartlık", href: "/urun-kategori/plastik-urunler/kredi-kartlik/" },
      { name: "Kartvizit", href: "/urun-kategori/matbaa-urunleri/kartvizit/" },
    ],
  },
  {
    bgImage: "/fotograf-studyosu-vesikalik-kabi.jpg",
    titles: ["Fotoğraf Stüdyoları"],
    links: [
      { name: "Vesikalık Kabı", href: "/urun-kategori/plastik-urunler/vesikalik-kabi/" },
      { name: "6×9 Fotoğraf Kabı", href: "/urun-kategori/plastik-urunler/fotograf-kabi/" },
      { name: "10x15 Fotoğraf Kabı", href: "/urun-kategori/plastik-urunler/fotograf-kabi/" },
      { name: "13x18 Fotoğraf Kabı", href: "/urun-kategori/plastik-urunler/fotograf-kabi/" },
      { name: "15x21 Fotoğraf Kabı", href: "/urun-kategori/plastik-urunler/fotograf-kabi/" },
      { name: "18x24 Fotoğraf Kabı", href: "/urun-kategori/plastik-urunler/fotograf-kabi/" },
      { name: "20x25 Fotoğraf Kabı", href: "/urun-kategori/plastik-urunler/fotograf-kabi/" },
      { name: "Kartvizit", href: "/urun-kategori/matbaa-urunleri/kartvizit/" },
    ],
  },
  {
    bgImage: "/doviz-burosu-doviz-kabi.jpg",
    titles: [
      "Döviz Büroları",
      "Para Transferi Büroları",
      "Kuyumcular",
    ],
    links: [
      { name: "Döviz Kabı", href: "/urun-kategori/plastik-urunler/doviz-kabi/" },
      { name: "Kartvizit", href: "/urun-kategori/matbaa-urunleri/kartvizit/" },
    ],
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

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Pir Reklam",
    url: "https://pirreklam.com.tr",
    logo: "https://pirreklam.com.tr/pirreklam-logo.jpg",
    description:
      "Ruhsat kabı, vesikalık kabı, poliçe kabı ve promosyon ürünlerinde toptan üretim ve uygun fiyat çözümleri sunan üretici firma.",
    sameAs: [],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Promosyon Ürünleri",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Product", name: "Ruhsat Kabı", category: "Promosyon Ürünleri" } },
        { "@type": "Offer", itemOffered: { "@type": "Product", name: "Vesikalık Kabı" } },
        { "@type": "Offer", itemOffered: { "@type": "Product", name: "Poliçe Kabı" } },
        { "@type": "Offer", itemOffered: { "@type": "Product", name: "Döviz Kabı" } },
      ],
    },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={organizationJsonLd} />

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

      {/* ═════ 2x2 SECTOR GRID ═════ */}
      <section className="container mx-auto px-4 pt-10 md:pt-14 pb-12 md:pb-16">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide" style={{ color: "#ffc107" }}>
            Sektörel Ürünler
          </h2>
          <div className="w-16 h-0.5 rounded-full mx-auto mt-2" style={{ backgroundColor: "#ffc107" }} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {SECTOR_CARDS.map((item, i) => (
            <SectorCard key={i} item={item} />
          ))}
        </div>
      </section>

      {/* ═════ SEO CONTENT (collapsible, above footer) ═════ */}
      <SeoContent />
    </>
  );
}
