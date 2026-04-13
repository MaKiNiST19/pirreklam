import Link from "next/link";
import Image from "next/image";
import type { ProductWithVariants } from "@/types/index";

interface ProductCardProps {
  product: ProductWithVariants;
}

export default function ProductCard({ product }: ProductCardProps) {
  const firstImage = product.images?.[0] || "/placeholder.png";

  // Collect unique baskı options (the actual printing/material choices)
  const baskiOptions = [
    ...new Set(
      product.variants
        .map((v) => v.baskiOption)
        .filter(Boolean) as string[]
    ),
  ];

  // Determine the label based on what options exist
  // WordPress uses "BASKI SEÇENEKLERİ" or "MALZEME KALİTE SEÇENEĞİ"
  const hasBaski = baskiOptions.length > 0;
  const label = hasBaski ? "BASKI SEÇENEKLERİ" : null;

  return (
    <Link
      href={`/urun/${product.slug}/`}
      className="group block mx-auto w-full bg-white overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-200"
    >
      {/* Image */}
      <div className="relative w-full aspect-square overflow-hidden bg-white p-3">
        <Image
          src={firstImage}
          alt={product.title}
          fill
          className="object-contain group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 50vw, 220px"
        />
      </div>

      {/* Info */}
      <div className="px-2 pb-3 pt-1 text-center">
        {/* Product name - red, bold, centered */}
        <h3
          className="font-bold leading-tight mb-1 line-clamp-2 min-h-[2.4em]"
          style={{ fontSize: 12, color: "#cc0636" }}
        >
          {product.title}
        </h3>

        {/* BASKI SEÇENEKLERİ label + options */}
        {label && (
          <>
            <p className="text-[10px] font-bold text-[#25497f] tracking-wide mb-0.5">
              {label}
            </p>
            <ul className="space-y-0">
              {baskiOptions.map((opt) => (
                <li
                  key={opt}
                  className="flex items-start gap-1 text-[11px] text-gray-600 leading-tight justify-center"
                >
                  <svg
                    className="w-3 h-3 text-green-600 shrink-0 mt-[1px]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>{opt}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </Link>
  );
}
