import Image from "next/image";
import Link from "next/link";

export interface SectorCardItem {
  bgImage: string;
  titles: string[];
  links: { name: string; href: string }[];
}

export default function SectorCard({ item }: { item: SectorCardItem }) {
  return (
    <div className="relative rounded-2xl overflow-hidden h-[260px] md:h-[300px] shadow-lg group">
      {/* Background image */}
      <Image
        src={item.bgImage}
        alt={item.titles.join(" — ")}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, 50vw"
      />

      {/* Subtle dark overlay for legibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/15 to-transparent" />

      {/* Content (top-left) */}
      <div className="relative h-full flex flex-col items-start justify-start p-4 md:p-6">
        {/* Blurred white plaque with red bullet titles */}
        <div className="bg-white/85 backdrop-blur-md rounded-xl px-4 py-3 shadow-sm">
          <ul className="space-y-0.5">
            {item.titles.map((t, i) => (
              <li
                key={i}
                className="flex items-start gap-1.5 text-[15px] md:text-base font-bold text-[#cc0636] leading-snug"
              >
                <span className="leading-none text-lg">•</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Sub-category links */}
        <div className="mt-3 ml-1 space-y-1">
          {item.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-white text-sm font-medium drop-shadow hover:text-white/80 hover:translate-x-0.5 transition-all"
              style={{ textShadow: "0 1px 3px rgba(0,0,0,0.6)" }}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
