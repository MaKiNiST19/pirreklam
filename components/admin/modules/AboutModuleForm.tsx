"use client";

import { useState } from "react";
import Image from "next/image";
import MediaPicker from "../MediaPicker";

interface Counter { value: string; label: string }
interface Data { title?: string; subtitle?: string; body?: string; imageUrl?: string; mobileImageUrl?: string; counters?: Counter[] }

export default function AboutModuleForm({ data, onChange }: { data: Data; onChange: (d: Data) => void }) {
  const [picker, setPicker] = useState<"imageUrl" | "mobileImageUrl" | null>(null);
  const counters: Counter[] = data.counters || [{ value: "", label: "" }, { value: "", label: "" }, { value: "", label: "" }, { value: "", label: "" }];

  function updateCounter(i: number, patch: Partial<Counter>) {
    const next = counters.map((c, idx) => idx === i ? { ...c, ...patch } : c);
    onChange({ ...data, counters: next });
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Başlık</label>
          <input value={data.title || ""} onChange={(e) => onChange({ ...data, title: e.target.value })} className="w-full px-2 py-1.5 text-sm border rounded focus:ring-1 focus:ring-[#25497f] outline-none" />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Alt Başlık</label>
          <input value={data.subtitle || ""} onChange={(e) => onChange({ ...data, subtitle: e.target.value })} className="w-full px-2 py-1.5 text-sm border rounded focus:ring-1 focus:ring-[#25497f] outline-none" />
        </div>
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">Metin</label>
        <textarea value={data.body || ""} onChange={(e) => onChange({ ...data, body: e.target.value })} rows={4} className="w-full px-2 py-1.5 text-sm border rounded focus:ring-1 focus:ring-[#25497f] outline-none" />
      </div>
      {/* Images */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Masaüstü Görsel</label>
          <div className="flex gap-2 items-center flex-wrap">
            {data.imageUrl && <div className="relative w-20 h-14 rounded overflow-hidden"><Image src={data.imageUrl} alt="" fill className="object-cover" /></div>}
            <button type="button" onClick={() => setPicker("imageUrl")} className="px-3 py-1.5 text-xs bg-white border rounded hover:bg-gray-50">{data.imageUrl ? "Değiştir" : "Seç"}</button>
          </div>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Mobil Görsel</label>
          <div className="flex gap-2 items-center flex-wrap">
            {data.mobileImageUrl && <div className="relative w-12 h-14 rounded overflow-hidden"><Image src={data.mobileImageUrl} alt="" fill className="object-cover" /></div>}
            <button type="button" onClick={() => setPicker("mobileImageUrl")} className="px-3 py-1.5 text-xs bg-white border rounded hover:bg-gray-50">{data.mobileImageUrl ? "Değiştir" : "Seç"}</button>
          </div>
        </div>
      </div>
      {/* Counters */}
      <div>
        <p className="text-xs font-medium text-gray-600 mb-2">Sayaçlar (4 adet)</p>
        <div className="grid grid-cols-4 gap-2">
          {counters.slice(0, 4).map((c, i) => (
            <div key={i} className="space-y-1.5">
              <input placeholder="Değer (ör: 500+)" value={c.value} onChange={(e) => updateCounter(i, { value: e.target.value })} className="w-full px-2 py-1 text-xs border rounded focus:ring-1 focus:ring-[#25497f] outline-none" />
              <input placeholder="Etiket (ör: Müşteri)" value={c.label} onChange={(e) => updateCounter(i, { label: e.target.value })} className="w-full px-2 py-1 text-xs border rounded focus:ring-1 focus:ring-[#25497f] outline-none" />
            </div>
          ))}
        </div>
      </div>
      {picker && (
        <MediaPicker
          currentUrl={picker === "imageUrl" ? data.imageUrl : data.mobileImageUrl}
          onSelect={(url) => onChange({ ...data, [picker]: url })}
          onClose={() => setPicker(null)}
        />
      )}
    </div>
  );
}
