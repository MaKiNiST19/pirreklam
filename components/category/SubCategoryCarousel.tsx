"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import ProductCard from "@/components/product/ProductCard";
import type { ProductWithVariants } from "@/types/index";

interface Props {
  products: ProductWithVariants[];
}

const VISIBLE = 5;
const GAP = 16; // gap-4 = 16px

export default function SubCategoryCarousel({ products }: Props) {
  const [offset, setOffset] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const measure = useCallback(() => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.offsetWidth;
    const w = (containerWidth - GAP * (VISIBLE - 1)) / VISIBLE;
    setCardWidth(w);
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  const maxOffset = Math.max(0, products.length - VISIBLE);
  const canPrev = offset > 0;
  const canNext = offset < maxOffset;
  const showArrows = products.length > VISIBLE;

  return (
    <div ref={containerRef} className="relative">
      {showArrows && canPrev && (
        <button
          onClick={() => setOffset((o) => Math.max(0, o - 1))}
          className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition"
          aria-label="Önceki"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{
            gap: `${GAP}px`,
            transform: cardWidth ? `translateX(-${offset * (cardWidth + GAP)}px)` : undefined,
          }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="shrink-0"
              style={{ width: cardWidth > 0 ? `${cardWidth}px` : `calc((100% - ${GAP * (VISIBLE - 1)}px) / ${VISIBLE})` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {showArrows && canNext && (
        <button
          onClick={() => setOffset((o) => Math.min(maxOffset, o + 1))}
          className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition"
          aria-label="Sonraki"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
}
