import Link from "next/link";
import Image from "next/image";
import type { ProductWithVariants } from "@/types/index";

interface ProductCardProps {
  product: ProductWithVariants;
}

export default function ProductCard({ product }: ProductCardProps) {
  const firstImage = product.images?.[0] || "/placeholder.png";

  // Collect unique baskı options
  const baskiOptions = [
    ...new Set(
      product.variants
        .map((v) => v.baskiOption)
        .filter(Boolean) as string[]
    ),
  ];

  // Collect unique renk options
  const renkOptions = [
    ...new Set(
      product.variants
        .map((v) => v.renkOption)
        .filter(Boolean) as string[]
    ),
  ];

  // Build summary lines like WordPress: "1 Renk Boyu", "Gofre Kabartma", etc.
  const summaryLines: string[] = [];
  if (renkOptions.length > 0) {
    summaryLines.push(`${renkOptions.length} Renk Boyu`);
  }
  // Show first few baskı options
  baskiOptions.slice(0, 4).forEach((opt) => summaryLines.push(opt));

  return (
    <Link
      href={`/urun/${product.slug}/`}
      className="group block mx-auto w-full rounded-sm bg-white overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-200"
    >
      {/* Image */}
      <div className="relative w-full aspect-square overflow-hidden bg-white p-2">
        <Image
          src={firstImage}
          alt={product.title}
          fill
          className="object-contain group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 50vw, 200px"
        />
      </div>

      {/* Info */}
      <div className="px-2 pb-3 pt-1 text-center">
        {/* Product name - red, bold */}
        <h3
          className="font-bold leading-tight mb-1.5 line-clamp-2 min-h-[2.5em]"
          style={{ fontSize: 12, color: "#cc0636" }}
        >
          {product.title}
        </h3>

        {/* BASKI SEÇENEKLERİ label */}
        {(baskiOptions.length > 0 || renkOptions.length > 0) && (
          <>
            <p className="text-[10px] font-bold text-[#25497f] tracking-wide mb-1">
              BASKI SEÇENEKLERİ
            </p>

            {/* Options with green checkmarks */}
            <ul className="space-y-0 text-left">
              {summaryLines.map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-1 text-[11px] text-gray-600 leading-tight"
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
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </Link>
  );
}
