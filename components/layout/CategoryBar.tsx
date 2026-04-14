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

  roots.sort((a, b) => a.menuOrder - b.menuOrder);
  roots.forEach((r) => {
    r.children.sort((a, b) => a.menuOrder - b.menuOrder);
    // Also sort grandchildren
    r.children.forEach((c) => c.children.sort((a, b) => a.menuOrder - b.menuOrder));
  });

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

  // Split categories: first half left, second half right
  const midpoint = Math.ceil(topLevel.length / 2);
  const leftCats = topLevel.slice(0, midpoint);
  const rightCats = topLevel.slice(midpoint);

  const renderCategoryItem = (category: CategoryNode) => {
    // Flatten all children + grandchildren for mega menu
    const allChildren: { name: string; slug: string; parentSlug: string }[] = [];

    // Direct children (second-level)
    category.children.forEach((child) => {
      if (child.children.length > 0) {
        // This child has its own children (third-level) — show them
        child.children.forEach((grandchild) => {
          allChildren.push({
            name: grandchild.name,
            slug: grandchild.slug,
            parentSlug: `${category.slug}/${child.slug}`,
          });
        });
      } else {
        // Leaf child
        allChildren.push({
          name: child.name,
          slug: child.slug,
          parentSlug: category.slug,
        });
      }
    });

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
          {allChildren.length > 0 && (
            <svg className="w-3 h-3 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </Link>

        {/* Full-width mega dropdown */}
        {hoveredId === category.id && allChildren.length > 0 && (
          <div
            className="fixed left-0 right-0 bg-white text-gray-800 z-[100]"
            style={{ boxShadow: "0 15px 50px 5px rgba(207,207,207,1)", top: "auto" }}
          >
            <div className="max-w-[1320px] mx-auto px-6 py-5">
              {/* Show children grouped by second-level parent */}
              {category.children.length > 0 && (
                <div
                  className="grid gap-x-8 gap-y-1"
                  style={{
                    gridTemplateColumns: `repeat(${Math.min(category.children.length, 4)}, minmax(0, 1fr))`,
                  }}
                >
                  {category.children.map((child) => (
                    <div key={child.id}>
                      {/* Second-level heading */}
                      <Link
                        href={`/urun-kategori/${category.slug}/${child.slug}/`}
                        className="block text-[13px] font-bold text-[#cc0636] mb-2 pb-1.5 border-b border-gray-200 hover:text-[#a9042d] transition-colors"
                      >
                        {child.name}
                      </Link>
                      {/* Third-level items */}
                      {child.children.length > 0 ? (
                        <ul className="space-y-0.5">
                          {child.children.map((gc) => (
                            <li key={gc.id}>
                              <Link
                                href={`/urun-kategori/${category.slug}/${child.slug}/${gc.slug}/`}
                                className="block text-[12px] text-gray-600 py-1 hover:text-[#cc0636] hover:pl-1 transition-all"
                              >
                                {gc.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <Link
                          href={`/urun-kategori/${category.slug}/${child.slug}/`}
                          className="block text-[12px] text-gray-600 py-1 hover:text-[#cc0636] hover:pl-1 transition-all"
                        >
                          Tüm Ürünler →
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-[#25497f] text-white hidden md:block">
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
