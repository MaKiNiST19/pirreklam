"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface FlatCategory {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  menuOrder: number;
}

interface CategoryNode extends FlatCategory {
  children: CategoryNode[];
}

function buildTree(flat: FlatCategory[]): CategoryNode[] {
  const map = new Map<string, CategoryNode>();
  flat.forEach((c) => map.set(c.id, { ...c, children: [] }));

  const roots: CategoryNode[] = [];
  map.forEach((node) => {
    if (node.parentId && map.has(node.parentId)) {
      map.get(node.parentId)!.children.push(node);
    } else if (!node.parentId) {
      roots.push(node);
    }
  });

  roots.sort((a, b) => a.menuOrder - b.menuOrder);
  roots.forEach((r) => r.children.sort((a, b) => a.menuOrder - b.menuOrder));
  return roots;
}

export default function CategoryBar() {
  const [topLevel, setTopLevel] = useState<CategoryNode[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data: FlatCategory[]) => {
        const tree = buildTree(data);
        setTopLevel(tree);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  // Split: first half left, second half right
  const midpoint = Math.ceil(topLevel.length / 2);
  const leftCats = topLevel.slice(0, midpoint);
  const rightCats = topLevel.slice(midpoint);

  // Categories with many children get 2-column mega menu
  // Categories with few children get simple dropdown
  const MEGA_THRESHOLD = 8; // Plastik(13) and Promosyon(10) get mega, Matbaa(6) and Çanta(4) get dropdown

  const renderCategoryItem = (category: CategoryNode) => {
    const hasChildren = category.children.length > 0;
    const isMega = category.children.length >= MEGA_THRESHOLD;

    return (
      <div
        key={category.id}
        className="relative"
        onMouseEnter={() => setHoveredId(category.id)}
        onMouseLeave={() => setHoveredId(null)}
      >
        <Link
          href={`/urun-kategori/${category.slug}/`}
          className={`flex items-center gap-1.5 py-3 px-5 text-[13px] font-bold uppercase tracking-wide whitespace-nowrap transition-colors ${
            hoveredId === category.id ? "bg-white/15 text-white" : "hover:bg-white/10"
          }`}
        >
          {category.name}
          {hasChildren && (
            <svg className="w-3 h-3 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </Link>

        {/* Dropdown */}
        {hoveredId === category.id && hasChildren && (
          isMega ? (
            /* ── MEGA MENU: 2-column, positioned below item ── */
            <div
              className="absolute left-0 bg-white text-gray-800 z-[100] rounded-b-lg"
              style={{
                boxShadow: "0 15px 50px 5px rgba(207,207,207,1)",
                top: "100%",
                width: "420px",
              }}
            >
              <div className="px-5 py-4">
                <div className="grid grid-cols-2 gap-x-6 gap-y-0.5">
                  {category.children.map((child) => (
                    <Link
                      key={child.id}
                      href={`/urun-kategori/${category.slug}/${child.slug}/`}
                      className="block text-[13px] text-gray-700 py-1.5 border-b border-gray-100 hover:text-[#cc0636] hover:pl-1 transition-all font-medium"
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* ── SIMPLE DROPDOWN ── */
            <div
              className="absolute left-0 bg-white text-gray-800 z-[100] min-w-[220px] rounded-b-lg"
              style={{
                boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                top: "100%",
              }}
            >
              <div className="py-2">
                {category.children.map((child) => (
                  <Link
                    key={child.id}
                    href={`/urun-kategori/${category.slug}/${child.slug}/`}
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
    <div ref={barRef} className="bg-[#25497f] text-white hidden md:block">
      <div className="max-w-[1320px] mx-auto px-4">
        {isLoading ? (
          <div className="py-2.5 text-sm opacity-60 text-center">Yükleniyor...</div>
        ) : (
          <div className="flex items-stretch justify-between">
            {/* LEFT categories */}
            <div className="flex items-stretch">
              {leftCats.map(renderCategoryItem)}
            </div>

            {/* CENTER spacer for logo overlap */}
            <div className="w-[140px] shrink-0" />

            {/* RIGHT categories */}
            <div className="flex items-stretch">
              {rightCats.map(renderCategoryItem)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
