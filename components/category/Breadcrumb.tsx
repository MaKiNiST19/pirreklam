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
      <nav aria-label="Breadcrumb" className="text-[12px] text-gray-700 font-medium">
        <ol className="flex flex-wrap items-center gap-1">
          {items.map((item, i) => {
            const isLast = i === items.length - 1;
            return (
              <li key={`${item.href}-${i}`} className="flex items-center gap-1">
                {i > 0 && <span className="text-gray-500">&gt;</span>}
                {isLast ? (
                  <span className="text-gray-900 font-semibold">{item.name}</span>
                ) : item.noLink ? (
                  <span className="text-gray-700">{item.name}</span>
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
