"use client";

import { useState } from "react";
import ProductGrid from "@/components/product/ProductGrid";
import type { ProductWithVariants } from "@/types/index";

export interface SectorTab {
  id: string;
  title: string;
  description?: string;
  products: ProductWithVariants[];
}

interface Props {
  tabs: SectorTab[];
}

export default function SectorTabs({ tabs }: Props) {
  const [activeId, setActiveId] = useState(tabs[0]?.id || "");
  if (tabs.length === 0) return null;

  const active = tabs.find((t) => t.id === activeId) || tabs[0];

  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-6">
      {/* Left tab list */}
      <aside className="md:w-72 flex-shrink-0">
        <div className="flex md:flex-col overflow-x-auto md:overflow-visible gap-1">
          {tabs.map((tab) => {
            const isActive = tab.id === active.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveId(tab.id)}
                className={`group relative text-left px-4 py-3 rounded-lg border transition-all whitespace-nowrap md:whitespace-normal flex items-center justify-between gap-2 ${
                  isActive
                    ? "bg-[#cc0636] border-[#cc0636] text-white shadow-md"
                    : "bg-white border-gray-200 text-gray-700 hover:border-[#cc0636] hover:text-[#cc0636]"
                }`}
              >
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold leading-tight">{tab.title}</span>
                  {tab.products.length > 0 && (
                    <span className={`text-[10px] mt-0.5 ${isActive ? "text-white/80" : "text-gray-400"}`}>
                      {tab.products.length} ürün
                    </span>
                  )}
                </div>
                <svg
                  className={`w-4 h-4 shrink-0 transition-transform ${isActive ? "translate-x-0" : "group-hover:translate-x-0.5"}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Right active content */}
      <div className="flex-1 min-w-0">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 md:p-6">
          <div className="mb-4">
            <p className="text-xs font-semibold text-[#cc0636] uppercase tracking-wide mb-1">
              Önerilen Ürünler
            </p>
            <h3 className="text-lg md:text-xl font-bold text-gray-900">{active.title}</h3>
            {active.description && (
              <p className="text-sm text-gray-600 mt-2">{active.description}</p>
            )}
          </div>
          {active.products.length > 0 ? (
            <ProductGrid products={active.products} />
          ) : (
            <p className="text-sm text-gray-400 py-6 text-center">Bu sektör için ürün bulunamadı.</p>
          )}
        </div>
      </div>
    </div>
  );
}
