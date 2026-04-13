"use client";

import { useState, useRef, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (q) {
      router.push(`/arama?q=${encodeURIComponent(q)}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center">
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="ürün ara ..."
        className="w-[140px] md:w-[160px] h-[30px] px-2 text-[12px] border-2 border-[#ffc107] rounded-l outline-none focus:border-[#e6ac00] bg-white placeholder:text-gray-400"
      />
      <button
        type="submit"
        className="h-[30px] w-[30px] flex items-center justify-center bg-[#cc0636] text-white rounded-r hover:bg-[#a80530] transition-colors"
        aria-label="Ara"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
        </svg>
      </button>
    </form>
  );
}
