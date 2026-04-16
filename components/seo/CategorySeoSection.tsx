"use client";

import { useState } from "react";
import type { SeoPackage } from "@/lib/seo/types";

interface Props {
  data: SeoPackage;
}

export default function CategorySeoSection({ data }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Top 4 FAQ items drive the AI Overview block (if FAQ list is large, we only
  // surface the most answer-ready ones; full FAQ list stays below for users).
  const aiOverviewFaq = data.faq.slice(0, 4);

  return (
    <section className="mt-10 border-t border-gray-200 pt-8">
      <div
        className={`relative overflow-hidden transition-[max-height] duration-500 ease-in-out ${
          expanded ? "max-h-[40000px]" : "max-h-[240px]"
        }`}
      >
        <div className="prose prose-sm md:prose-base max-w-none text-gray-700 leading-relaxed [&_h1]:text-[22px] md:[&_h1]:text-[26px] [&_h1]:font-bold [&_h1]:text-[#25497f] [&_h1]:mb-4 [&_h2]:text-[18px] md:[&_h2]:text-[20px] [&_h2]:font-bold [&_h2]:text-[#25497f] [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:text-[15px] md:[&_h3]:text-[17px] [&_h3]:font-semibold [&_h3]:text-[#cc0636] [&_h3]:mt-4 [&_h3]:mb-2 [&_h4]:text-[14px] md:[&_h4]:text-[15px] [&_h4]:font-semibold [&_h4]:text-gray-800 [&_h4]:mt-3 [&_h4]:mb-2 [&_p]:mb-3 [&_p]:text-[14px] [&_ul]:mb-3 [&_ul]:ml-5 [&_ul]:list-disc [&_ol]:mb-3 [&_ol]:ml-5 [&_ol]:list-decimal [&_li]:mb-1 [&_li]:text-[14px] [&_strong]:text-gray-900 [&_a]:text-[#cc0636] [&_a]:underline hover:[&_a]:text-[#a80530]">
          <h1>{data.h1}</h1>

          {/* ═════ FEATURED SNIPPET BOX (rendered when `definition` is set) ═════ */}
          {data.definition && (
            <div
              className="not-prose my-4 border-l-4 rounded-r-lg p-4"
              style={{ background: "#f8f9fb", borderColor: "#25497f" }}
            >
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#25497f] mb-2">
                FEATURED SNIPPET
              </p>
              <p className="text-[14px] text-gray-800 leading-relaxed m-0">
                {data.definition}
              </p>
            </div>
          )}

          {/* ═════ AI OVERVIEW BLOCK (uses the first 4 FAQ items for extraction) ═════ */}
          {aiOverviewFaq.length > 0 && (
            <div
              className="not-prose my-5 rounded-lg p-4 border"
              style={{ background: "#fff9e6", borderColor: "#ffc107" }}
            >
              <p
                className="text-[11px] font-bold uppercase tracking-wider mb-3"
                style={{ color: "#b38800" }}
              >
                AI OVERVIEW · HIZLI CEVAP BLOĞU
              </p>
              <div className="space-y-3 text-[13px] text-gray-800">
                {aiOverviewFaq.map((f, i) => (
                  <div key={i}>
                    <strong className="block text-gray-900 mb-1">{f.q}</strong>
                    <span>{f.a}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.content}

          {data.faq.length > 0 && (
            <>
              <h2>Sıkça Sorulan Sorular</h2>
              <div className="not-prose space-y-2 mt-3">
                {data.faq.map((f, i) => (
                  <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setOpenFaq((prev) => (prev === i ? null : i))}
                      aria-expanded={openFaq === i}
                      className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left bg-white hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <span className="text-[14px] font-semibold text-gray-900">{f.q}</span>
                      <svg
                        className={`w-4 h-4 shrink-0 text-[#cc0636] transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {openFaq === i && (
                      <div className="px-4 pb-3 pt-1 text-[13px] text-gray-700 leading-relaxed bg-white border-t border-gray-100">
                        {f.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {!expanded && (
          <div
            className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
            style={{
              background: "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 90%)",
            }}
          />
        )}
      </div>

      <div className="mt-4 flex justify-center">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="inline-flex items-center gap-2 px-5 py-2 text-[13px] font-semibold uppercase tracking-wide transition-colors cursor-pointer"
          style={{
            border: "1px solid #cc0636",
            color: "#cc0636",
            borderRadius: "2px",
          }}
        >
          {expanded ? "Daha Az Göster" : "Devamını Oku"}
          <svg
            className={`w-3.5 h-3.5 transition-transform ${expanded ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </section>
  );
}
