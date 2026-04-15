"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useCallback, useEffect, useRef } from "react";
import { getColorCss } from "@/lib/colors";

interface TopFilterProps {
  baskiOptions: string[];
  renkOptions: string[];
  desenOptions: string[];
}

export default function TopFilter({ baskiOptions, renkOptions, desenOptions }: TopFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenGroup(null);
      }
    }
    if (openGroup) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [openGroup]);

  const getSelected = (key: string): string[] => {
    const val = searchParams.get(key);
    return val ? val.split(",").filter(Boolean) : [];
  };

  const toggleOption = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const current = params.get(key)?.split(",").filter(Boolean) || [];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      if (next.length > 0) params.set(key, next.join(","));
      else params.delete(key);
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const clearAll = () => router.push(pathname, { scroll: false });

  const hasFilters = Array.from(searchParams.keys()).length > 0;

  const groups = [
    { label: "Baskı Seçeneği", key: "baski", options: baskiOptions },
    { label: "Renk", key: "renk", options: renkOptions },
    { label: "Desen", key: "desen", options: desenOptions },
  ].filter((g) => g.options.length > 0);

  if (groups.length === 0) return null;

  return (
    <div ref={containerRef} className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 p-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-semibold text-gray-700 uppercase tracking-wide">Filtrele:</span>

        {groups.map((group) => {
          const selected = getSelected(group.key);
          const isOpen = openGroup === group.key;
          return (
            <div key={group.key} className="relative">
              <button
                type="button"
                onClick={() => setOpenGroup(isOpen ? null : group.key)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors ${
                  selected.length > 0
                    ? "border-[#cc0636] bg-[#cc0636] text-white"
                    : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                }`}
              >
                {group.label}
                {selected.length > 0 && (
                  <span className="bg-white text-[#cc0636] text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {selected.length}
                  </span>
                )}
                <svg className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isOpen && (
                <div className="absolute top-full left-0 mt-1 z-20 bg-white border border-gray-200 rounded-xl shadow-lg p-3 min-w-[200px] max-h-64 overflow-y-auto">
                  <div className="space-y-1">
                    {group.options.map((opt) => {
                      const isSelected = selected.includes(opt);
                      const isColor = group.key === "renk";
                      const cssColor = isColor ? getColorCss(opt) : null;
                      return (
                        <label
                          key={opt}
                          className="flex items-center gap-2 text-[11px] text-gray-700 cursor-pointer hover:bg-gray-50 rounded px-1.5 py-1"
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleOption(group.key, opt)}
                            className="rounded border-gray-300 text-[#cc0636] focus:ring-[#cc0636] w-3.5 h-3.5"
                          />
                          {isColor && (
                            <span
                              className="w-4 h-4 rounded-sm border border-gray-300 shrink-0"
                              style={{ backgroundColor: cssColor! }}
                            />
                          )}
                          <span className={isSelected ? "text-[#cc0636] font-medium" : ""}>{opt}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {hasFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="text-[11px] text-gray-500 hover:text-[#cc0636] underline ml-1 transition-colors"
          >
            Temizle
          </button>
        )}
      </div>
    </div>
  );
}
