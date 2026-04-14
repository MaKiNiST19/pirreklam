"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

interface SearchResult {
  id: string;
  slug: string;
  title: string;
  images: string[];
}

export default function LiveSearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (query.length < 3) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setIsLoading(true);
    setShowResults(true);

    timeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(query)}&limit=3`);
        if (!res.ok) throw new Error("Search failed");
        const data = await res.json();
        setResults(data || []);
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setShowResults(false);
      setQuery("");
    }
  };

  return (
    <div ref={dropdownRef} className="relative w-full">
      <div className="flex items-center">
        <input
          type="text"
          placeholder="Ürün Ara..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full px-4 py-2 rounded-lg border-2 border-[#cc0636] text-sm outline-none focus:ring-1 focus:ring-[#cc0636]"
        />
        <button
          type="button"
          className="absolute right-3 text-gray-400 hover:text-gray-600"
          aria-label="Ara"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>

      {/* Dropdown Results */}
      {showResults && query.length >= 3 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-gray-500">Aranıyor...</div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500">Sonuç bulunamadı</div>
          ) : (
            <div className="divide-y">
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/urun/${product.slug}/`}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    setShowResults(false);
                    setQuery("");
                  }}
                >
                  {product.images.length > 0 && (
                    <div className="relative w-12 h-12 shrink-0 rounded-md overflow-hidden bg-gray-100">
                      <Image
                        src={product.images[0]}
                        alt={product.title}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-900 line-clamp-2">
                    {product.title}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
