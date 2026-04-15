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
      className="group block w-full h-full hover:[box-shadow:0_20px_15px_-3px_rgba(0,0,0,0.1)]"
      style={{
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        border: "2px solid rgba(66, 66, 66, 0.06)",
        borderRadius: "10px",
        padding: "4px 4px 5px 2px",
        background: "rgba(255, 255, 255, 0.05)",
        transition: "all 0.3s ease",
      }}
    >
      {/* Image area — white bg, 190px tall, image scaled 1.25x without quality loss (rendered at 2x width) */}
      <div
        className="relative w-full shrink-0 overflow-hidden rounded bg-white"
        style={{ height: "190px" }}
      >
        <div className="absolute inset-0 transition-transform duration-300 group-hover:scale-[1.05]" style={{ transform: "scale(1.25)" }}>
          <Image
            src={firstImage}
            alt={product.title}
            fill
            className="object-contain"
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
            quality={90}
          />
        </div>
        {/* Hover: black overlay + sharp-cornered bordered CTA */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <span
            className="text-white font-bold uppercase text-center tracking-wide"
            style={{
              fontSize: 11,
              lineHeight: "14px",
              padding: "4px 8px",
              border: "2px solid #ffffff",
              borderRadius: 0,
            }}
          >
            Fiyat Bilgisi<br />İçin Tıklayınız
          </span>
        </div>
      </div>

      {/* Product name — 3px top/bottom padding, no min-height */}
      <h3
        className="font-bold line-clamp-2 text-center shrink-0"
        style={{
          fontSize: 12,
          lineHeight: "15px",
          color: "#cc0636",
          margin: 0,
          padding: "3px 0",
        }}
      >
        {product.title}
      </h3>

      {/* BASKI SEÇENEKLERİ */}
      {hasBaski && (
        <div className="shrink-0" style={{ padding: 0, margin: 0 }}>
          <p
            className="font-bold text-[#25497f] tracking-wide text-center"
            style={{ fontSize: 10, lineHeight: "13px", margin: 0, padding: 0, marginBottom: "2px" }}
          >
            BASKI SEÇENEKLERİ
          </p>
          <ul
            className="flex flex-col items-start w-fit"
            style={{ marginLeft: "auto", marginRight: "auto", marginTop: 0, marginBottom: 0, padding: 0 }}
          >
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
