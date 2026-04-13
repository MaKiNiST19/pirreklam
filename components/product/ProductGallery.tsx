"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  images: string[];
  title: string;
}

export default function ProductGallery({ images, title }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const displayImages = images.length > 0 ? images : ["/placeholder.png"];

  return (
    <div className="w-full">
      <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100 group cursor-zoom-in">
        <Image
          src={displayImages[activeIndex]}
          alt={`${title} - ${activeIndex + 1}`}
          fill
          className="object-contain transition-transform duration-300 group-hover:scale-150"
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
  );
}
