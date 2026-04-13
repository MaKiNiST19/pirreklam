"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useCallback } from "react";

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
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const clearAll = () => router.push(pathname, { scroll: false });

  const hasFilters = !!searchParams.toString();

  const groups = [
    { label: "Baskı Seçeneği", key: "baski", options: baskiOptions },
    { label: "Renk", key: "renk", options: renkOptions },
    { label: "Desen", key: "desen", options: desenOptions },
  ].filter((g) => g.options.length > 0);

  if (groups.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 p-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-semibold text-gray-700">Filtrele:</span>

        {groups.map((group) => {
          const selected = getSelected(group.key);
          const isOpen = openGroup === group.key;
          return (
            <div key={group.key} className="relative">
              <button
                type="button"
                onClick={() => setOpenGroup(isOpen ? null : group.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
                  selected.length > 0
                    ? "border-[#cc0636] bg-[#cc0636] text-white"
                    : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                }`}
              >
                {group.label}
                {selected.length > 0 && (
                  <span className="bg-white text-[#cc0636] text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {selected.length}
                  </span>
                )}
                <svg className={`w-3.5 h-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isOpen && (
                <div className="absolute top-full left-0 mt-1 z-20 bg-white border border-gray-200 rounded-xl shadow-lg p-3 min-w-[180px] max-h-64 overflow-y-auto">
                  <div className="space-y-1.5">
                    {group.options.map((opt) => (
                      <label key={opt} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-[#cc0636]">
                        <input
                          type="checkbox"
                          checked={selected.includes(opt)}
                          onChange={() => toggleOption(group.key, opt)}
                          className="rounded border-gray-300 text-[#cc0636] focus:ring-[#cc0636]"
                        />
                        {opt}
                      </label>
                    ))}
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
            className="text-sm text-gray-500 hover:text-[#cc0636] underline ml-2 transition-colors"
          >
            Temizle
          </button>
        )}
      </div>
    </div>
  );
}
