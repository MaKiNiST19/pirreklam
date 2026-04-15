"use client";

import { useState } from "react";
import Link from "next/link";
import type { CategoryTreeItem } from "./CategoryBar";

interface Props {
  tree?: CategoryTreeItem[];
}

export default function MobileNav({ tree = [] }: Props) {
  const [open, setOpen] = useState(false);
  const [expandedL1, setExpandedL1] = useState<string | null>(null);
  const [expandedL2, setExpandedL2] = useState<string | null>(null);

  const close = () => setOpen(false);

  const ChevronIcon = ({ rotated }: { rotated: boolean }) => (
    <svg
      className={`h-4 w-4 transition-transform ${rotated ? "rotate-180" : ""}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );

  return (
    <>
      <button
        type="button"
        className="md:hidden p-2 text-secondary"
        aria-label="Menüyü aç"
        onClick={() => setOpen(true)}
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] bg-white overflow-y-auto md:hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
            <span className="text-lg font-bold text-[#25497f]">Menü</span>
            <button type="button" onClick={close} aria-label="Kapat" className="p-2 text-gray-500">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav>
            {/* ANASAYFA — red */}
            <Link
              href="/"
              onClick={close}
              className="block px-4 py-3 text-sm font-bold uppercase tracking-wide text-white bg-[#cc0636]"
            >
              ANASAYFA
            </Link>

            {/* L1 categories from tree — gray */}
            {tree.map((l1) => {
              const hasChildren = l1.children.length > 0;
              const isExpanded = expandedL1 === l1.id;
              return (
                <div key={l1.id} className="border-b border-gray-300">
                  <button
                    type="button"
                    onClick={() => {
                      setExpandedL1(isExpanded ? null : l1.id);
                      setExpandedL2(null);
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm font-bold uppercase tracking-wide text-white bg-[#555]"
                  >
                    {l1.name}
                    {hasChildren && <ChevronIcon rotated={isExpanded} />}
                  </button>
                  {isExpanded && hasChildren && (
                    <div className="bg-[#4a4a4a]">
                      {l1.children.map((l2) => {
                        const hasGrand = (l2.children?.length ?? 0) > 0;
                        const isL2Expanded = expandedL2 === l2.id;
                        return (
                          <div key={l2.id} className="border-t border-[#3a3a3a]">
                            <div className="flex items-stretch">
                              <Link
                                href={`/urun-kategori/${l1.slug}/${l2.slug}/`}
                                onClick={close}
                                className="flex-1 px-4 py-2.5 text-sm text-white hover:bg-[#3a3a3a]"
                              >
                                {l2.name}
                              </Link>
                              {hasGrand && (
                                <button
                                  type="button"
                                  onClick={() => setExpandedL2(isL2Expanded ? null : l2.id)}
                                  aria-label="Alt menüyü aç"
                                  className="px-4 flex items-center text-white hover:bg-[#3a3a3a] border-l border-[#3a3a3a]"
                                >
                                  <ChevronIcon rotated={isL2Expanded} />
                                </button>
                              )}
                            </div>
                            {isL2Expanded && hasGrand && (
                              <div className="bg-[#3a3a3a]">
                                {l2.children!.map((l3) => (
                                  <Link
                                    key={l3.id}
                                    href={`/urun-kategori/${l1.slug}/${l2.slug}/${l3.slug}/`}
                                    onClick={close}
                                    className="block px-8 py-2 text-sm text-gray-200 border-t border-[#2a2a2a] hover:text-white"
                                  >
                                    {l3.name}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Static links */}
            <Link
              href="/iletisim/"
              onClick={close}
              className="block px-4 py-3 text-sm font-bold uppercase tracking-wide text-white bg-[#555] border-b border-gray-300"
            >
              İLETİŞİM
            </Link>
            <Link
              href="/banka-hesaplari/"
              onClick={close}
              className="block px-4 py-3 text-sm font-bold uppercase tracking-wide text-white bg-[#555] border-b border-gray-300"
            >
              BANKA HESAPLARI
            </Link>
            <Link
              href="/admin/giris/"
              onClick={close}
              className="flex items-center gap-2 px-4 py-3 text-sm font-bold uppercase tracking-wide text-white bg-[#555]"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              GİRİŞ YAP / KAYIT OL
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
