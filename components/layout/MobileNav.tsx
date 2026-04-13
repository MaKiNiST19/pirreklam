"use client";

import { useState } from "react";
import Link from "next/link";

const categories = [
  {
    name: "Ruhsat Kabı", slug: "ruhsat-kabi",
    children: [
      { name: "Biala Pvc Ruhsat Kabı", slug: "biala-pvc-ruhsat-kabi" },
      { name: "Dikişli Suni Deri Ruhsat Kabı", slug: "dikisli-suni-deri-ruhsat-kabi" },
      { name: "Dikişli Termo Deri Ruhsat Kabı", slug: "dikisli-termo-deri-ruhsat-kabi" },
      { name: "Dikişli Oval Kenar Ruhsat Kabı", slug: "dikisli-oval-kenar-ruhsat-kabi" },
      { name: "Kapaklı Ruhsat Kabı", slug: "kapakli-ruhsat-kabi" },
      { name: "Ofset Baskılı Ruhsat Kabı", slug: "ofset-baskili-ruhsat-kabi" },
      { name: "İş Makinası Ruhsat Kabı", slug: "is-makinasi-ruhsat-kabi" },
      { name: "Filo Çok Amaçlı Ruhsat Kabı", slug: "filo-cok-amacli-ruhsat-kabi" },
      { name: "Hakiki Deri Ruhsat Kabı", slug: "hakiki-deri-ruhsat-kabi" },
      { name: "Kişiye Özel Ruhsat Kabı", slug: "kisiye-ozel-ruhsat-kabi" },
    ],
  },
  {
    name: "Plakalık", slug: "plakalik",
    children: [
      { name: "Plastik Plakalık", slug: "plastik-plakalik" },
      { name: "Metal Plakalık", slug: "metal-plakalik" },
      { name: "Krom Plakalık", slug: "krom-plakalik" },
    ],
  },
  {
    name: "Pasaport Kılıfı", slug: "pasaport-kilifi",
    children: [
      { name: "Şeffaf Pvc Pasaport Kılıfı", slug: "seffaf-pvc-pasaport-kilifi" },
      { name: "Biala Pvc Pasaport Kılıfı", slug: "biala-pvc-pasaport-kilifi" },
      { name: "Dikişli Suni Deri Pasaport Kılıfı", slug: "dikisli-suni-deri-pasaport-kilifi" },
      { name: "Dikişli Termo Deri Pasaport Kılıfı", slug: "dikisli-termo-deri-pasaport-kilifi" },
    ],
  },
  {
    name: "Vesikalık Kabı", slug: "vesikalik-kabi",
    children: [
      { name: "Tekli Vesikalık Kabı", slug: "tekli-vesikalik-kabi" },
      { name: "Çiftli Vesikalık Kabı", slug: "ciftli-vesikalik-kabi" },
    ],
  },
  { name: "Kredi Kartlık", slug: "kredi-kartlik", children: [] },
  { name: "Döviz Kabı", slug: "doviz-kabi", children: [] },
  { name: "Evlilik Cüzdanı Kılıfı", slug: "evlilik-cuzdani-kilifi", children: [] },
  { name: "Veteriner Aşı Karnesi Kabı", slug: "veteriner-asi-karnesi-kabi", children: [] },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);

  return (
    <>
      <button
        type="button"
        className="md:hidden p-2 text-secondary"
        aria-label="Menüyü aç"
        onClick={() => setOpen(true)}
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] bg-white overflow-y-auto md:hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
            <span className="text-lg font-bold text-[#25497f]">Menü</span>
            <button type="button" onClick={() => setOpen(false)} aria-label="Kapat" className="p-2 text-gray-500">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="px-4 py-2">
            <Link href="/" onClick={() => setOpen(false)} className="block py-3 text-sm font-semibold text-[#25497f] border-b border-gray-100">
              Anasayfa
            </Link>

            {categories.map((cat) => (
              <div key={cat.slug} className="border-b border-gray-100">
                {cat.children.length > 0 ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setExpandedSlug(expandedSlug === cat.slug ? null : cat.slug)}
                      className="w-full flex items-center justify-between py-3 text-sm font-semibold text-[#25497f]"
                    >
                      {cat.name}
                      <svg className={`h-4 w-4 transition-transform ${expandedSlug === cat.slug ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {expandedSlug === cat.slug && (
                      <div className="pl-4 pb-2">
                        <Link
                          href={`/urun-kategori/${cat.slug}/`}
                          onClick={() => setOpen(false)}
                          className="block py-2 text-sm text-[#cc0636] font-medium"
                        >
                          Tümünü Gör
                        </Link>
                        {cat.children.map((child) => (
                          <Link
                            key={child.slug}
                            href={`/urun-kategori/${cat.slug}/${child.slug}/`}
                            onClick={() => setOpen(false)}
                            className="block py-2 text-sm text-gray-600 hover:text-[#cc0636]"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={`/urun-kategori/${cat.slug}/`}
                    onClick={() => setOpen(false)}
                    className="block py-3 text-sm font-semibold text-[#25497f]"
                  >
                    {cat.name}
                  </Link>
                )}
              </div>
            ))}

            <Link href="/iletisim/" onClick={() => setOpen(false)} className="block py-3 text-sm font-semibold text-[#25497f] border-b border-gray-100">
              İletişim
            </Link>
            <Link href="/banka-hesaplari/" onClick={() => setOpen(false)} className="block py-3 text-sm font-semibold text-[#25497f] border-b border-gray-100">
              Banka Hesapları
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
