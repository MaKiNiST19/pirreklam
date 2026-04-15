"use client";

import { useState } from "react";
import Link from "next/link";

interface ChildCat {
  id: string;
  name: string;
  slug: string;
}

interface ParentCat {
  id: string;
  name: string;
  slug: string;
  children: ChildCat[];
}

const MEGA_THRESHOLD = 8;

export default function CategoryBarClient({ tree }: { tree: ParentCat[] }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const midpoint = Math.ceil(tree.length / 2);
  const leftCats = tree.slice(0, midpoint);
  const rightCats = tree.slice(midpoint);

  const renderItem = (cat: ParentCat, options: { isFirst?: boolean; isLast?: boolean } = {}) => {
    const hasChildren = cat.children.length > 0;
    const isMega = cat.children.length >= MEGA_THRESHOLD;

    // First item: no left padding. Last item: no right padding. Otherwise normal px-5.
    const padL = options.isFirst ? "pl-0" : "pl-5";
    const padR = options.isLast ? "pr-0" : "pr-5";

    return (
      <div
        key={cat.id}
        className="relative"
        onMouseEnter={() => setHoveredId(cat.id)}
        onMouseLeave={() => setHoveredId(null)}
      >
        {/* L1 categories are NOT clickable — just hover trigger. Height fixed to 32px to match top bar. */}
        <button
          type="button"
          tabIndex={0}
          className={`flex items-center gap-1.5 h-[32px] ${padL} ${padR} text-[12px] font-bold uppercase tracking-wide whitespace-nowrap cursor-default text-white`}
        >
          {cat.name}
          {hasChildren && (
            <svg className="w-3 h-3 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </button>

        {hoveredId === cat.id && hasChildren && (
          isMega ? (
            <div
              className="absolute left-0 bg-white text-gray-800 z-[100] rounded-b-lg"
              style={{ boxShadow: "0 15px 50px 5px rgba(207,207,207,1)", top: "100%", width: "420px" }}
            >
              <div className="px-5 py-4">
                <div className="grid grid-cols-2 gap-x-6 gap-y-0.5">
                  {cat.children.map((child) => (
                    <Link
                      key={child.id}
                      href={`/urun-kategori/${cat.slug}/${child.slug}/`}
                      className="block text-[13px] text-gray-700 py-1.5 border-b border-gray-100 hover:text-[#cc0636] hover:pl-1 transition-all font-medium"
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div
              className="absolute left-0 bg-white text-gray-800 z-[100] min-w-[220px] rounded-b-lg"
              style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.15)", top: "100%" }}
            >
              <div className="py-2">
                {cat.children.map((child) => (
                  <Link
                    key={child.id}
                    href={`/urun-kategori/${cat.slug}/${child.slug}/`}
                    className="block text-[13px] text-gray-700 px-5 py-2 hover:text-[#cc0636] hover:bg-gray-50 transition-all font-medium"
                  >
                    {child.name}
                  </Link>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    );
  };

  return (
    <div className="bg-[#cc0636] text-white hidden md:block">
      <div className="max-w-[1320px] mx-auto px-4">
        <div className="flex items-stretch justify-between">
          {/* First item has no left padding → text flush with container left edge */}
          <div className="flex items-stretch">
            {leftCats.map((c, i) => renderItem(c, { isFirst: i === 0 }))}
          </div>
          {/* Last item has no right padding → arrow flush with container right edge */}
          <div className="flex items-stretch">
            {rightCats.map((c, i) => renderItem(c, { isLast: i === rightCats.length - 1 }))}
          </div>
        </div>
      </div>
    </div>
  );
}
