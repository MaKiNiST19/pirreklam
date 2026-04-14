"use client";

import { useState, useRef } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  images: string[];
  title: string;
}

export default function ProductGallery({ images, title }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomOrigin, setZoomOrigin] = useState("center");
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const displayImages = images.length > 0 ? images : ["/placeholder.png"];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !isHovering) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setZoomOrigin(`${x}% ${y}%`);
  };

  return (
    <div className="w-full">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div
          ref={containerRef}
          className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-zoom-in"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => {
          setIsHovering(false);
          setZoomOrigin("center");
        }}
      >
        <Image
          src={displayImages[activeIndex]}
          alt={`${title} - ${activeIndex + 1}`}
          fill
          className="object-contain transition-transform duration-300"
          style={{
            transformOrigin: zoomOrigin,
            transform: isHovering ? "scale(1.5)" : "scale(1)",
          }}
          sizes="(max-width: 768px) 100vw, 500px"
          priority
        />
      </div>

      {displayImages.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
          {displayImages.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`relative shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${
                i === activeIndex
                  ? "border-[#cc0636]"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <Image
                src={img}
                alt={`${title} - ${i + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
