"use client";

import { useState, useRef, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (q) {
      router.push(`/arama?q=${encodeURIComponent(q)}`);
      setExpanded(false);
    }
  }

  return (
    <>
      {/* Desktop */}
      <form
        onSubmit={handleSubmit}
        className="hidden md:flex items-center"
        style={{ width: 492 }}
      >
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ürün Ara..."
          className="w-full h-8 px-3 text-sm border-2 border-primary rounded-l-md outline-none focus:ring-1 focus:ring-primary"
        />
        <button
          type="submit"
          className="h-8 px-3 bg-primary text-white rounded-r-md hover:bg-primary-dark transition-colors"
          aria-label="Ara"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
            />
          </svg>
        </button>
      </form>

      {/* Mobile toggle */}
      <button
        type="button"
        className="md:hidden p-2 text-secondary"
        aria-label="Arama aç"
        onClick={() => {
          setExpanded((p) => !p);
          setTimeout(() => inputRef.current?.focus(), 100);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
          />
        </svg>
      </button>

      {/* Mobile expanded */}
      {expanded && (
        <form
          onSubmit={handleSubmit}
          className="md:hidden absolute left-0 top-full w-full bg-white px-4 py-2 shadow-md z-50 flex"
        >
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ürün Ara..."
            className="flex-1 h-8 px-3 text-sm border-2 border-primary rounded-l-md outline-none"
          />
          <button
            type="submit"
            className="h-8 px-3 bg-primary text-white rounded-r-md"
            aria-label="Ara"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
          </button>
        </form>
      )}
    </>
  );
}
