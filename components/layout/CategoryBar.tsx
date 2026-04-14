"use client";

import { useState, useEffect } from "react";
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

  // Sort by menuOrder
  roots.sort((a, b) => a.menuOrder - b.menuOrder);
  roots.forEach((r) => r.children.sort((a, b) => a.menuOrder - b.menuOrder));

  return roots;
}

export default function CategoryBar() {
  const [topLevel, setTopLevel] = useState<CategoryNode[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <div className="bg-[#25497f] text-white hidden md:block">
      <div className="max-w-[1320px] mx-auto px-4">
        {isLoading ? (
          <div className="py-2.5 text-sm opacity-60">Kategoriler yükleniyor...</div>
        ) : (
          <div className="flex items-stretch">
            {topLevel.map((category) => (
              <div
                key={category.id}
                className="relative"
                onMouseEnter={() => setHoveredId(category.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Top-level label */}
                <Link
                  href={`/urun-kategori/${category.slug}/`}
                  className={`flex items-center gap-1 py-3 px-4 text-sm font-semibold whitespace-nowrap transition-colors ${
                    hoveredId === category.id ? "bg-white/15" : "hover:bg-white/10"
                  }`}
                >
                  {category.name}
                  {category.children.length > 0 && (
                    <svg className="w-3 h-3 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </Link>

                {/* Mega dropdown */}
                {hoveredId === category.id && category.children.length > 0 && (
                  <div
                    className="absolute left-0 top-full bg-white text-gray-800 rounded-b-lg overflow-hidden z-[100]"
                    style={{ boxShadow: "0 12px 40px rgba(0,0,0,0.18)", minWidth: "260px" }}
                  >
                    {/* Column grid — 2 cols when many items, 1 col when few */}
                    <div
                      className={`grid ${category.children.length > 6 ? "grid-cols-2" : "grid-cols-1"}`}
                    >
                      {category.children.map((child) => (
                        <Link
                          key={child.id}
                          href={`/urun-kategori/${category.slug}/${child.slug}/`}
                          className="flex items-center gap-2 px-5 py-2.5 text-sm border-b border-gray-100 hover:bg-[#cc0636] hover:text-white transition-colors"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#cc0636] shrink-0 group-hover:bg-white" />
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
