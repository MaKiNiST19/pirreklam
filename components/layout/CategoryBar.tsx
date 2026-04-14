"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  children: CategoryItem[];
}

export default function CategoryBar() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [topLevel, setTopLevel] = useState<CategoryItem[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(data);
        // Filter for top-level categories only (parentId === null)
        const topLevelCats = data.filter((c: CategoryItem) => !c.parentId && c.children.length > 0);
        setTopLevel(topLevelCats);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-[#25497f] text-white">
        <div className="max-w-[1320px] mx-auto px-4 py-2 text-sm">Kategoriler yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#25497f] text-white sticky top-16 z-40 hidden md:block">
      <div className="max-w-[1320px] mx-auto px-4">
        <div className="flex items-center gap-0">
          {topLevel.map((category) => (
            <div
              key={category.id}
              className="relative group"
              onMouseEnter={() => setHoveredId(category.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Main category button */}
              <Link
                href={`/urun-kategori/${category.slug}/`}
                className="block py-3 px-4 font-medium text-sm hover:bg-white/10 transition-colors"
              >
                {category.name}
              </Link>

              {/* Mega dropdown - shows on hover */}
              {hoveredId === category.id && category.children.length > 0 && (
                <div className="absolute left-0 top-full w-max bg-white text-gray-900 shadow-lg rounded-lg overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                  {/* 2-column layout for children */}
                  <div className="grid grid-cols-2 gap-0">
                    {category.children.map((child) => (
                      <Link
                        key={child.id}
                        href={`/urun-kategori/${category.slug}/${child.slug}/`}
                        className="block px-6 py-3 text-sm hover:bg-gray-50 border-r border-b border-gray-200 last:border-r-0 hover:text-[#cc0636] transition-colors"
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
