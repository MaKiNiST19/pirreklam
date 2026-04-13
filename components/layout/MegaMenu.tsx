"use client";

import { useState } from "react";
import Link from "next/link";

interface Category {
  name: string;
  slug: string;
  children: { name: string; slug: string }[];
}

const categories: Category[] = [
  {
    name: "Plastik Ürünler",
    slug: "plastik-urunler",
    children: [
      { name: "Ruhsat Kabı", slug: "ruhsat-kabi" },
      { name: "Pasaport Kılıfı", slug: "pasaport-kilifi" },
      { name: "Vesikalık Kabı", slug: "vesikalik-kabi" },
      { name: "Fotoğraf Kabı", slug: "fotograf-kabi" },
      { name: "Döviz Kabı", slug: "doviz-kabi" },
      { name: "Kredi Kartlık", slug: "kredi-kartlik" },
      { name: "Veteriner Aşı Karnesi Kabı", slug: "veteriner-asi-karnesi-kabi" },
      { name: "Evlilik Cüzdanı Kılıfı", slug: "evlilik-cuzdani-kilifi" },
      { name: "Sayısal Loto Kabı", slug: "sayisal-loto-kabi" },
      { name: "Uzun Yük Bayrağı", slug: "uzun-yuk-bayragi" },
      { name: "Bagaj Valiz Etiketliği", slug: "bagaj-valiz-etiketligi" },
      { name: "Plakalık", slug: "plakalik" },
      { name: "Police Kabı", slug: "police-kabi" },
    ],
  },
  {
    name: "Promosyon Ürünler",
    slug: "promosyon-urunler",
    children: [
      { name: "Oto Kokusu", slug: "oto-kokusu" },
      { name: "Kalem", slug: "kalem" },
      { name: "Çakmak", slug: "cakmak" },
      { name: "Anahtarlık", slug: "anahtarlik" },
      { name: "Bardak Altlığı", slug: "bardak-altligi" },
      { name: "Ajanda", slug: "ajanda" },
      { name: "Defterler", slug: "defterler" },
      { name: "Mouse Pad", slug: "mouse-pad" },
      { name: "Duvar Saatleri", slug: "duvar-saatleri" },
      { name: "Bozuk Para Cüzdanı", slug: "bozuk-para-cuzdani" },
      { name: "Oto Güneşlik", slug: "oto-guneslik" },
      { name: "Toz Bezleri", slug: "toz-bezleri" },
      { name: "Kapak Acacakları", slug: "kapak-acacaklari" },
      { name: "Balon", slug: "balon" },
      { name: "Bardak", slug: "bardak" },
      { name: "Kartvizitlik", slug: "kartvizitlik" },
      { name: "Masa Sümen Takvimi Altlığı", slug: "masa-sumen-takvimi-altligi" },
    ],
  },
  {
    name: "Çanta",
    slug: "canta",
    children: [
      { name: "Promosyon Çanta", slug: "promosyon-canta" },
      { name: "Elbise Kılıfları", slug: "elbise-kiliflari" },
      { name: "Gelinlik Kılıfları", slug: "gelinlik-kiliflari" },
      { name: "Laptop Çantaları", slug: "laptop-cantalari" },
      { name: "Makyaj Çantaları", slug: "makyaj-cantalari" },
      { name: "Okul ve Sırt Çantaları", slug: "okul-ve-sirt-cantalari" },
      { name: "Özel Üretim Çantalar", slug: "ozel-uretim-cantalar" },
      { name: "Plaj Çantaları", slug: "plaj-cantalari" },
      { name: "Spor ve Seyahat Çantaları", slug: "spor-ve-seyahat-cantalari" },
    ],
  },
  {
    name: "Matbaa Ürünleri",
    slug: "matbaa-urunleri",
    children: [
      { name: "Kartvizit", slug: "kartvizit" },
      { name: "El İlanı", slug: "el-ilani" },
      { name: "Magnet", slug: "magnet" },
      { name: "Sticker", slug: "sticker" },
      { name: "Küp Blok Not", slug: "kup-blok-not" },
      { name: "Takvimler", slug: "takvimler" },
    ],
  },
];

export default function MegaMenu() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <nav className="hidden md:block bg-white border-t border-gray-border">
      <div className="max-w-[1200px] mx-auto flex items-center">
        {/* Anasayfa */}
        <Link
          href="/"
          className="px-4 py-2.5 text-sm font-semibold text-secondary hover:text-primary transition-colors"
        >
          Anasayfa
        </Link>

        {/* Category dropdowns */}
        {categories.map((cat, idx) => (
          <div
            key={cat.slug}
            className="relative"
            onMouseEnter={() => setOpenIdx(idx)}
            onMouseLeave={() => setOpenIdx(null)}
          >
            <Link
              href={`/urun-kategori/${cat.slug}/`}
              className="flex items-center gap-1 px-4 py-2.5 text-sm font-semibold text-secondary hover:text-primary transition-colors"
            >
              {cat.name}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </Link>

            {openIdx === idx && (
              <div
                className="absolute left-0 top-full min-w-[240px] bg-white z-50 py-2 rounded-b-md animate-[fadeIn_0.15s_ease-in-out]"
                style={{ boxShadow: "15px 15px 50px 5px #cfcfcf" }}
              >
                {cat.children.map((child) => (
                  <Link
                    key={child.slug}
                    href={`/urun-kategori/${cat.slug}/${child.slug}/`}
                    className="block px-5 py-1.5 text-sm text-gray-text hover:text-primary hover:bg-gray-light transition-colors"
                  >
                    {child.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* İletişim */}
        <Link
          href="/iletisim/"
          className="px-4 py-2.5 text-sm font-semibold text-secondary hover:text-primary transition-colors"
        >
          İletişim
        </Link>

        {/* Banka Hesapları */}
        <Link
          href="/banka-hesaplari/"
          className="px-4 py-2.5 text-sm font-semibold text-secondary hover:text-primary transition-colors"
        >
          Banka Hesapları
        </Link>
      </div>
    </nav>
  );
}

export { categories };
