import Link from "next/link";
import Image from "next/image";
import type { ProductWithVariants } from "@/types/index";

interface ProductCardProps {
  product: ProductWithVariants;
}

export default function ProductCard({ product }: ProductCardProps) {
  const firstImage = product.images?.[0] || "/placeholder.png";

  const baskiOptions = [
    ...new Set(
      product.variants
        .map((v) => v.baskiOption)
        .filter(Boolean) as string[]
    ),
  ];

  const hasBaski = baskiOptions.length > 0;

  return (
    <Link
      href={`/urun/${product.slug}/`}
      className="group block w-full h-full hover:[box-shadow:0px_20px_15px_-3px_rgba(0,0,0,0.1)]"
      style={{
        border: "2px solid rgba(66,66,66,0.06)",
        borderRadius: "10px",
        padding: "8px",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#ffffff",
        overflow: "hidden",
        transition: "box-shadow 0.2s ease",
      }}
    >
      {/* Image — fixed height so all images align */}
      <div className="relative w-full shrink-0" style={{ height: "130px" }}>
        <Image
          src={firstImage}
          alt={product.title}
          fill
          className="object-contain group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 23vw, 15vw"
        />
      </div>

      {/* Product name — fixed 2-line area */}
      <h3
        className="font-bold leading-tight line-clamp-2 text-center shrink-0"
        style={{ fontSize: 11, color: "#cc0636", minHeight: "28px", marginTop: "4px" }}
      >
        {product.title}
      </h3>

      {/* BASKI SEÇENEKLERİ — always at same position, top-aligned */}
      {hasBaski && (
        <div className="shrink-0 mt-1">
          <p className="font-bold text-[#25497f] tracking-wide mb-0.5 text-center" style={{ fontSize: 9 }}>
            BASKI SEÇENEKLERİ
          </p>
          <ul className="flex flex-col items-center">
            {baskiOptions.map((opt) => (
              <li
                key={opt}
                className="flex items-start gap-0.5 text-gray-600 leading-tight"
                style={{ fontSize: 10 }}
              >
                <svg
                  className="w-2.5 h-2.5 text-green-600 shrink-0 mt-[1px]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                <span>{opt}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Link>
  );
}
