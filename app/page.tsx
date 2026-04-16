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
        <div className="relative w-full h-[360px] md:h-[520px] lg:h-[580px]">
          <Image
            src="/ruhsat-kabi-heroimg.jpg"
            alt="Pir Reklam — Kurumsal Promosyon Ürünleri"
            fill
            className="object-cover"
            priority
            fetchPriority="high"
            quality={72}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 1200px"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/20" />

          {/* Hero content: H1 + paragraph + CTA buttons */}
          <div className="relative z-10 h-full flex items-center">
            <div className="max-w-[1200px] mx-auto w-full px-4 md:px-6">
              <div className="max-w-[720px]">
                <h1
                  className="text-white font-bold leading-tight"
                  style={{
                    fontSize: "clamp(22px, 4vw, 38px)",
                    textShadow: "0 2px 6px rgba(0,0,0,0.55)",
                    marginBottom: "14px",
                  }}
                >
                  Ruhsat Kabı, Vesikalık Kabı, Döviz Kabı ve Promosyon Ürünlerinde Toptan Üretici
                </h1>
                <p
                  className="text-white/95 leading-relaxed"
                  style={{
                    fontSize: "clamp(13px, 1.6vw, 16px)",
                    textShadow: "0 1px 3px rgba(0,0,0,0.6)",
                    marginBottom: "22px",
                    maxWidth: "640px",
                  }}
                >
                  Sigorta, turizm acenteleri, galeriler, rent a car işletmeleri, kuyumcular ve
                  döviz büroları, fotoğraf stüdyoları ve birçok işletme için uygun fiyatlı, kaliteli
                  baskılı üretim çözümleri.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="#sektorel-urunler"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-[#cc0636] text-white text-[13px] md:text-[14px] font-bold uppercase tracking-wide hover:bg-[#a80530] transition-colors shadow-lg"
                  >
                    Sektörel Ürünler
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </a>
                  <a
                    href="https://wa.me/905442338003?text=Merhaba%2C%20toptan%20sipari%C5%9F%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-white text-[#25497f] text-[13px] md:text-[14px] font-bold uppercase tracking-wide hover:bg-gray-100 transition-colors shadow-lg"
                  >
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Toptan Sipariş Ver
                  </a>
                </div>
              </div>
            </div>
          </div>
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
      <section id="sektorel-urunler" className="container mx-auto px-4 pt-10 md:pt-14 pb-12 md:pb-16 scroll-mt-24">
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
