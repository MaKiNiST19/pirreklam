"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";

interface CategoryFilterProps {
  baskiOptions: string[];
  renkOptions: string[];
  desenOptions: string[];
}

export default function CategoryFilter({
  baskiOptions,
  renkOptions,
  desenOptions,
}: CategoryFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getSelected = (key: string): string[] => {
    const val = searchParams.get(key);
    return val ? val.split(",") : [];
  };

  const toggleOption = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const current = params.get(key)?.split(",").filter(Boolean) || [];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];

      if (next.length > 0) {
        params.set(key, next.join(","));
      } else {
        params.delete(key);
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const clearAll = () => {
    router.push(pathname, { scroll: false });
  };

  const renderGroup = (label: string, key: string, options: string[]) => {
    if (options.length === 0) return null;
    const selected = getSelected(key);
    return (
      <div className="mb-4">
        <h4 className="text-xs font-bold text-gray-700 mb-2">{label}</h4>
        <div className="space-y-1.5">
          {options.map((opt) => (
            <label
              key={opt}
              className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selected.includes(opt)}
                onChange={() => toggleOption(key, opt)}
                className="rounded border-gray-300 text-[#cc0636] focus:ring-[#cc0636]"
              />
              {opt}
            </label>
          ))}
        </div>
      </div>
    );
  };

  return (
    <aside className="w-full">
      {renderGroup("BASKI", "baski", baskiOptions)}
      {renderGroup("RENK", "renk", renkOptions)}
      {renderGroup("DESEN", "desen", desenOptions)}

      {searchParams.toString() && (
        <button
          type="button"
          onClick={clearAll}
          className="text-sm text-[#cc0636] hover:underline mt-2"
        >
          Filtreleri Temizle
        </button>
      )}
    </aside>
  );
}
