"use client";

import { useEffect, useState, useRef } from "react";

interface AnchorNavProps {
  sections: { id: string; name: string; slug: string }[];
}

export default function AnchorNav({ sections }: AnchorNavProps) {
  const [headerHeight, setHeaderHeight] = useState(0);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const scrollingRef = useRef(false);

  // Measure header height dynamically
  useEffect(() => {
    function measure() {
      const header = document.querySelector("header");
      if (header) setHeaderHeight(header.offsetHeight);
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Track active section on scroll
  useEffect(() => {
    if (!sections.length) return;

    function onScroll() {
      if (scrollingRef.current) return;
      const offset = headerHeight + 80;
      let current: string | null = null;
      for (const s of sections) {
        const el = document.getElementById(`cat-${s.slug}`);
        if (el) {
          const top = el.getBoundingClientRect().top;
          if (top <= offset) current = s.slug;
        }
      }
      setActiveSlug(current);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [sections, headerHeight]);

  if (sections.length <= 1) return null;

  function scrollTo(slug: string) {
    const el = document.getElementById(`cat-${slug}`);
    if (!el) return;
    scrollingRef.current = true;
    const y = el.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
    window.scrollTo({ top: y, behavior: "smooth" });
    setActiveSlug(slug);
    setTimeout(() => { scrollingRef.current = false; }, 800);
  }

  return (
    <div
      className="sticky z-40 bg-[#25497f] text-white -mx-4 mb-3 shadow-md"
      style={{ top: headerHeight ? `${headerHeight}px` : "0" }}
    >
      <div className="max-w-[1320px] mx-auto px-4 py-2 overflow-x-auto">
        <div className="flex flex-wrap gap-1.5">
          {sections.map((section) => {
            const isActive = activeSlug === section.slug;
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => scrollTo(section.slug)}
                className={`px-3 py-1 rounded text-[11px] font-semibold transition-colors whitespace-nowrap ${
                  isActive
                    ? "bg-white text-[#25497f]"
                    : "bg-white/10 text-white hover:bg-white/25"
                }`}
              >
                {section.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
