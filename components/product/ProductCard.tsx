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

  return (
    <Link
      href={`/urun/${product.slug}/`}
      className="group block max-w-[206px] mx-auto w-full rounded-xl bg-white overflow-hidden transition-transform duration-300 hover:scale-[1.08]"
      style={{
        borderRadius: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      }}
    >
      <div className="relative w-full h-[200px] overflow-hidden">
        <Image
          src={firstImage}
          alt={product.title}
          fill
          className="object-cover"
          sizes="206px"
        />
        <div className="absolute inset-0 bg-black/[0.64] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center px-3">
          <span className="text-white text-center text-sm font-bold leading-tight">
            FİYAT BİLGİSİ İÇİN TIKLAYINIZ
          </span>
        </div>
      </div>

      <div className="p-2">
        <h3
          className="text-center font-bold leading-tight mb-1"
          style={{ fontSize: 13, color: "#cc0636" }}
        >
          {product.title}
        </h3>

        {baskiOptions.length > 0 && (
          <ul className="space-y-0.5">
            {baskiOptions.map((opt) => (
              <li
                key={opt}
                className="flex items-center gap-1 text-xs text-gray-600"
              >
                <svg
                  className="w-3 h-3 text-green-600 shrink-0"
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
                {opt}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Link>
  );
}
