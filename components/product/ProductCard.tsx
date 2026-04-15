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
      className="group block w-full h-full"
      style={{
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        border: "2px solid rgba(66, 66, 66, 0.06)",
        borderRadius: "10px",
        padding: "4px 4px 5px 2px",
        boxShadow: "0px 20px 15px -3px rgba(0, 0, 0, 0.1)",
        background: "rgba(255, 255, 255, 0.05)",
        transition: "all 0.3s ease",
      }}
    >
      {/* Image area with hover price-CTA overlay */}
      <div className="relative w-full shrink-0 overflow-hidden rounded" style={{ height: "210px" }}>
        <Image
          src={firstImage}
          alt={product.title}
          fill
          className="object-contain transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 23vw, 15vw"
        />
        {/* Black opacity overlay with centered CTA text (appears on hover) */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <span
            className="text-white font-bold uppercase text-center leading-tight tracking-wide px-4"
            style={{ fontSize: 12, lineHeight: "15px" }}
          >
            Fiyat Bilgisi<br />İçin Tıklayınız
          </span>
        </div>
      </div>

      {/* Product name */}
      <h3
        className="font-bold line-clamp-2 text-center shrink-0"
        style={{
          fontSize: 12,
          lineHeight: "15px",
          color: "#cc0636",
          minHeight: "30px",
          margin: 0,
          padding: 0,
        }}
      >
        {product.title}
      </h3>

      {/* BASKI SEÇENEKLERİ — only 2px gap from title above */}
      {hasBaski && (
        <div className="shrink-0" style={{ marginTop: "2px", padding: 0 }}>
          <p
            className="font-bold text-[#25497f] tracking-wide text-center"
            style={{ fontSize: 10, lineHeight: "13px", margin: 0, padding: 0, marginBottom: "2px" }}
          >
            BASKI SEÇENEKLERİ
          </p>
          <ul className="flex flex-col items-start mx-auto w-fit" style={{ margin: 0, padding: 0, marginLeft: "auto", marginRight: "auto" }}>
            {baskiOptions.slice(0, 4).map((opt) => (
              <li
                key={opt}
                className="flex items-center gap-1 text-gray-600"
                style={{ fontSize: 11, lineHeight: "14px" }}
              >
                <svg
                  className="w-2.5 h-2.5 text-[#cc0636] shrink-0"
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
