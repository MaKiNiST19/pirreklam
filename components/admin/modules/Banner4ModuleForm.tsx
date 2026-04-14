"use client";

import { useState } from "react";
import Image from "next/image";
import MediaPicker from "../MediaPicker";

interface BannerItem { imageUrl: string; mobileImageUrl?: string; title?: string; link?: string }
interface Data { items: BannerItem[] }

export default function Banner4ModuleForm({ data, onChange }: { data: Data; onChange: (d: Data) => void }) {
  const [picker, setPicker] = useState<{ idx: number; field: "imageUrl" | "mobileImageUrl" } | null>(null);
  const items: BannerItem[] = data.items || [{}, {}, {}, {}];

  function update(i: number, patch: Partial<BannerItem>) {
    const next = items.map((item, idx) => idx === i ? { ...item, ...patch } : item);
    onChange({ items: next });
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {[0, 1, 2, 3].map((i) => {
        const item = items[i] || {};
        return (
          <div key={i} className="border rounded-lg p-3 space-y-2 bg-gray-50">
            <p className="text-xs font-medium text-gray-600">Banner {i + 1}</p>
            {/* Desktop image */}
            <div>
              <label className="block text-xs text-gray-400 mb-1">Masaüstü Görsel</label>
              <div className="flex gap-2 items-center">
                {item.imageUrl && <div className="relative w-16 h-10 rounded overflow-hidden flex-shrink-0"><Image src={item.imageUrl} alt="" fill className="object-cover" /></div>}
                <button type="button" onClick={() => setPicker({ idx: i, field: "imageUrl" })} className="px-2 py-1 text-xs bg-white border rounded hover:bg-gray-50">
                  {item.imageUrl ? "Değiştir" : "Seç"}
                </button>
              </div>
            </div>
            {/* Mobile image */}
            <div>
              <label className="block text-xs text-gray-400 mb-1">Mobil Görsel</label>
              <div className="flex gap-2 items-center">
                {item.mobileImageUrl && <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0"><Image src={item.mobileImageUrl} alt="" fill className="object-cover" /></div>}
                <button type="button" onClick={() => setPicker({ idx: i, field: "mobileImageUrl" })} className="px-2 py-1 text-xs bg-white border rounded hover:bg-gray-50">
                  {item.mobileImageUrl ? "Değiştir" : "Seç"}
                </button>
              </div>
            </div>
            <input placeholder="Başlık" value={item.title || ""} onChange={(e) => update(i, { title: e.target.value })} className="w-full px-2 py-1.5 text-xs border rounded focus:ring-1 focus:ring-[#25497f] outline-none" />
            <input placeholder="Link URL" value={item.link || ""} onChange={(e) => update(i, { link: e.target.value })} className="w-full px-2 py-1.5 text-xs border rounded focus:ring-1 focus:ring-[#25497f] outline-none" />
          </div>
        );
      })}
      {picker && (
        <MediaPicker
          currentUrl={picker.field === "imageUrl" ? items[picker.idx]?.imageUrl : items[picker.idx]?.mobileImageUrl}
          onSelect={(url) => update(picker.idx, { [picker.field]: url })}
          onClose={() => setPicker(null)}
        />
      )}
    </div>
  );
}
