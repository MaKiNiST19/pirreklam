import Link from "next/link";
import type { BreadcrumbItem } from "@/types/index";
import JsonLd from "@/components/seo/JsonLd";

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `https://pirreklam.com.tr${item.href}`,
    })),
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 rounded-lg px-4 py-2">
        {/* KATEGORİLER prefix with menu icon */}
        <span className="flex items-center gap-1.5 font-semibold text-[#25497f]">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          KATEGORİLER
        </span>

        <ol className="flex flex-wrap items-center gap-1">
          {items.map((item, i) => {
            const isLast = i === items.length - 1;
            return (
              <li key={item.href} className="flex items-center gap-1">
                <span className="text-gray-300">&gt;</span>
                {isLast ? (
                  <span className="text-gray-700 font-medium">{item.name}</span>
                ) : (
                  <Link href={item.href} className="hover:text-[#cc0636] transition-colors">
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
