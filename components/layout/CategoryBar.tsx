"use client";

import Link from "next/link";

/* These match the WordPress bottom category bar exactly */
const categories = [
  { name: "Ruhsat Kabı", slug: "ruhsat-kabi" },
  { name: "Plakalık", slug: "plakalik" },
  { name: "Pasaport Kılıfı", slug: "pasaport-kilifi" },
  { name: "Vesikalık Kabı", slug: "vesikalik-kabi" },
  { name: "Kredi Kartlık", slug: "kredi-kartlik" },
  { name: "Döviz Kabı", slug: "doviz-kabi" },
  { name: "Evlilik Cüzdanı Kılıfı", slug: "evlilik-cuzdani-kilifi" },
  { name: "Veteriner Aşı Karnesi Kabı", slug: "veteriner-asi-karnesi-kabi" },
];

export default function CategoryBar() {
  return (
    <nav className="hidden md:block bg-[#25497f]">
      <div className="max-w-[1320px] mx-auto flex items-center justify-center">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/urun-kategori/${cat.slug}/`}
            className="px-3 lg:px-4 py-2 text-[12px] lg:text-[13px] font-semibold text-white hover:bg-white/10 transition-colors whitespace-nowrap"
          >
            {cat.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}
