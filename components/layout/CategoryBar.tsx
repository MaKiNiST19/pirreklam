"use client";

import { useState } from "react";
import Link from "next/link";

interface CategoryItem {
  name: string;
  slug: string;
  children?: { name: string; slug: string }[];
}

const categories: CategoryItem[] = [
  {
    name: "Ruhsat Kabı", slug: "ruhsat-kabi",
    children: [
      { name: "Biala Pvc Ruhsat Kabı", slug: "biala-pvc-ruhsat-kabi" },
      { name: "Dikişli Suni Deri Ruhsat Kabı", slug: "dikisli-suni-deri-ruhsat-kabi" },
      { name: "Dikişli Termo Deri Ruhsat Kabı", slug: "dikisli-termo-deri-ruhsat-kabi" },
      { name: "Dikişli Oval Kenar Ruhsat Kabı", slug: "dikisli-oval-kenar-ruhsat-kabi" },
      { name: "Kapaklı Ruhsat Kabı", slug: "kapakli-ruhsat-kabi" },
      { name: "Ofset Baskılı Ruhsat Kabı", slug: "ofset-baskili-ruhsat-kabi" },
      { name: "İş Makinası Ruhsat Kabı (Kartonsuz)", slug: "is-makinasi-ruhsat-kabi" },
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
  { name: "Kredi Kartlık", slug: "kredi-kartlik" },
  { name: "Döviz Kabı", slug: "doviz-kabi" },
  { name: "Evlilik Cüzdanı Kılıfı", slug: "evlilik-cuzdani-kilifi" },
  { name: "Veteriner Aşı Karnesi Kabı", slug: "veteriner-asi-karnesi-kabi" },
];

export default function CategoryBar() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <nav className="hidden md:block bg-[#25497f]">
      <div className="max-w-[1320px] mx-auto flex items-center justify-center">
        {categories.map((cat, idx) => (
          <div
            key={cat.slug}
            className="relative"
            onMouseEnter={() => cat.children && cat.children.length > 0 ? setOpenIdx(idx) : setOpenIdx(null)}
            onMouseLeave={() => setOpenIdx(null)}
          >
            <Link
              href={`/urun-kategori/${cat.slug}/`}
              className="flex items-center gap-1 px-3 lg:px-4 py-2.5 text-[12px] lg:text-[13px] font-semibold text-white hover:bg-white/10 transition-colors whitespace-nowrap"
            >
              {cat.name}
              {cat.children && cat.children.length > 0 && (
                <svg className="w-2.5 h-2.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </Link>

            {/* Dropdown */}
            {openIdx === idx && cat.children && cat.children.length > 0 && (
              <div className="absolute left-0 top-full min-w-[260px] bg-white z-50 py-1 rounded-b shadow-xl border border-gray-100">
                {cat.children.map((child) => (
                  <Link
                    key={child.slug}
                    href={`/urun-kategori/${cat.slug}/${child.slug}/`}
                    className="block px-4 py-2 text-[13px] text-gray-700 hover:text-[#cc0636] hover:bg-gray-50 transition-colors"
                  >
                    {child.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}
