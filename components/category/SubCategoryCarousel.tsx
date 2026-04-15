"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import ProductCard from "@/components/product/ProductCard";
import type { ProductWithVariants } from "@/types/index";

interface Props {
  products: ProductWithVariants[];
}

const VISIBLE_DESKTOP = 5;
const VISIBLE_TABLET = 3;
const VISIBLE_MOBILE = 2;
const GAP = 4;

export default function SubCategoryCarousel({ products }: Props) {
  const [offset, setOffset] = useState(0);
  const [cols, setCols] = useState(VISIBLE_DESKTOP);
  const [cardWidth, setCardWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const measure = useCallback(() => {
    const w = window.innerWidth;
    const c = w < 640 ? VISIBLE_MOBILE : w < 1024 ? VISIBLE_TABLET : VISIBLE_DESKTOP;
    setCols(c);
    if (containerRef.current) {
      const totalWidth = containerRef.current.offsetWidth;
      // card width = (container - padding*2 - gaps) / cols
      // container has 4px padding each side = 8px total
      const innerWidth = totalWidth - GAP * 2;
      setCardWidth((innerWidth - GAP * (c - 1)) / c);
    }
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  const maxOffset = Math.max(0, products.length - cols);
  const canPrev = offset > 0;
  const canNext = offset < maxOffset;
  const showArrows = products.length > cols;

  return (
    <div ref={containerRef} className="relative">
      {showArrows && canPrev && (
        <button
          onClick={() => setOffset((o) => Math.max(0, o - 1))}
          className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#cc0636] hover:border-[#cc0636] transition"
          aria-label="Önceki"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* WP-matching container: bg #f1f1f1, 288px tall, 4px padding, 10px radius */}
      <div
        style={{
          backgroundColor: "#f1f1f1",
          height: "288px",
          padding: `${GAP}px`,
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: `${GAP}px`,
            height: "100%",
            transition: "transform 0.35s ease-in-out",
            transform: cardWidth ? `translateX(-${offset * (cardWidth + GAP)}px)` : undefined,
          }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              style={{
                flex: `0 0 ${cardWidth > 0 ? `${cardWidth}px` : `calc((100% - ${(cols - 1) * GAP}px) / ${cols})`}`,
                height: "100%",
              }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {showArrows && canNext && (
        <button
          onClick={() => setOffset((o) => Math.min(maxOffset, o + 1))}
          className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#cc0636] hover:border-[#cc0636] transition"
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
