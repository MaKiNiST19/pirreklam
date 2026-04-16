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
        quality={72}
        loading="lazy"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, 50vw"
      />

      {/* Dark overlay anchored at bottom-left for link legibility */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.55) 35%, rgba(0,0,0,0.25) 70%, rgba(0,0,0,0.05) 100%)",
        }}
      />

      {/* Content (top-left) */}
      <div className="relative h-full flex flex-col items-start justify-start p-4 md:p-6">
        {/* More transparent blurred plaque with yellow bullet titles */}
        <div className="bg-white/40 backdrop-blur-md rounded-xl px-4 py-3 shadow-sm border border-white/30">
          <ul className="space-y-0.5">
            {item.titles.map((t, i) => (
              <li
                key={i}
                className="flex items-start gap-1.5 text-[15px] md:text-base font-bold leading-snug"
                style={{ color: "#ffc107", textShadow: "0 1px 2px rgba(0,0,0,0.45)" }}
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
              style={{ textShadow: "0 1px 3px rgba(0,0,0,0.85)" }}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
