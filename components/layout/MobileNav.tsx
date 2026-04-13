"use client";

import { useState } from "react";
import Link from "next/link";
import { categories } from "@/components/layout/MegaMenu";

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  function toggle(idx: number) {
    setExpandedIdx((prev) => (prev === idx ? null : idx));
  }

  return (
    <>
      {/* Hamburger button */}
      <button
        type="button"
        className="md:hidden p-2 text-secondary"
        aria-label="Menüyü aç"
        onClick={() => setOpen(true)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 z-[100] bg-white overflow-y-auto md:hidden">
          {/* Close */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-border">
            <span className="text-lg font-bold text-secondary">Menü</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Menüyü kapat"
              className="p-2 text-secondary"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="px-4 py-2">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="block py-3 text-sm font-semibold text-secondary border-b border-gray-border"
            >
              Anasayfa
            </Link>

            {categories.map((cat, idx) => (
              <div key={cat.slug} className="border-b border-gray-border">
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between py-3 text-sm font-semibold text-secondary"
                >
                  {cat.name}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 transition-transform ${expandedIdx === idx ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {expandedIdx === idx && (
                  <div className="pl-4 pb-2">
                    {cat.children.map((child) => (
                      <Link
                        key={child.slug}
                        href={`/urun-kategori/${cat.slug}/${child.slug}/`}
                        onClick={() => setOpen(false)}
                        className="block py-2 text-sm text-gray-text hover:text-primary"
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <Link
              href="/iletisim/"
              onClick={() => setOpen(false)}
              className="block py-3 text-sm font-semibold text-secondary border-b border-gray-border"
            >
              İletişim
            </Link>

            <Link
              href="/banka-hesaplari/"
              onClick={() => setOpen(false)}
              className="block py-3 text-sm font-semibold text-secondary border-b border-gray-border"
            >
              Banka Hesapları
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
