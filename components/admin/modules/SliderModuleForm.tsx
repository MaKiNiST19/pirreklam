"use client";

import { useState } from "react";
import Image from "next/image";
import MediaPicker from "../MediaPicker";

interface Slide {
  imageUrl: string;
  mobileImageUrl?: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  link?: string;
}
interface Data { slides: Slide[] }

export default function SliderModuleForm({ data, onChange }: { data: Data; onChange: (d: Data) => void }) {
  const [picker, setPicker] = useState<{ slideIdx: number; field: "imageUrl" | "mobileImageUrl" } | null>(null);

  function addSlide() {
    onChange({ slides: [...(data.slides || []), { imageUrl: "" }] });
  }
  function removeSlide(i: number) {
    onChange({ slides: data.slides.filter((_, idx) => idx !== i) });
  }
  function updateSlide(i: number, patch: Partial<Slide>) {
    const slides = data.slides.map((s, idx) => idx === i ? { ...s, ...patch } : s);
    onChange({ slides });
  }

  return (
    <div className="space-y-4">
      {(data.slides || []).map((slide, i) => (
        <div key={i} className="border rounded-lg p-4 space-y-3 bg-gray-50">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Slide {i + 1}</span>
            <button onClick={() => removeSlide(i)} className="text-red-500 text-xs hover:underline">Sil</button>
          </div>
          {/* Desktop image */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">Masaüstü Görsel *</label>
            <div className="flex gap-2 items-start">
              {slide.imageUrl && <div className="relative w-24 h-14 rounded overflow-hidden flex-shrink-0"><Image src={slide.imageUrl} alt="" fill className="object-cover" /></div>}
              <button type="button" onClick={() => setPicker({ slideIdx: i, field: "imageUrl" })} className="px-3 py-1.5 text-xs bg-white border rounded hover:bg-gray-50">
                {slide.imageUrl ? "Değiştir" : "Görsel Seç"}
              </button>
            </div>
          </div>
          {/* Mobile image */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">Mobil Görsel (opsiyonel)</label>
            <div className="flex gap-2 items-start">
              {slide.mobileImageUrl && <div className="relative w-12 h-14 rounded overflow-hidden flex-shrink-0"><Image src={slide.mobileImageUrl} alt="" fill className="object-cover" /></div>}
              <button type="button" onClick={() => setPicker({ slideIdx: i, field: "mobileImageUrl" })} className="px-3 py-1.5 text-xs bg-white border rounded hover:bg-gray-50">
                {slide.mobileImageUrl ? "Değiştir" : "Mobil Görsel Seç"}
              </button>
              {slide.mobileImageUrl && <button type="button" onClick={() => updateSlide(i, { mobileImageUrl: "" })} className="text-xs text-red-400 hover:underline">Kaldır</button>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Başlık</label>
              <input value={slide.title || ""} onChange={(e) => updateSlide(i, { title: e.target.value })} className="w-full px-2 py-1.5 text-sm border rounded focus:ring-1 focus:ring-[#25497f] outline-none" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Alt Başlık</label>
              <input value={slide.subtitle || ""} onChange={(e) => updateSlide(i, { subtitle: e.target.value })} className="w-full px-2 py-1.5 text-sm border rounded focus:ring-1 focus:ring-[#25497f] outline-none" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Buton Metni</label>
              <input value={slide.buttonText || ""} onChange={(e) => updateSlide(i, { buttonText: e.target.value })} className="w-full px-2 py-1.5 text-sm border rounded focus:ring-1 focus:ring-[#25497f] outline-none" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Link URL</label>
              <input value={slide.link || ""} onChange={(e) => updateSlide(i, { link: e.target.value })} className="w-full px-2 py-1.5 text-sm border rounded focus:ring-1 focus:ring-[#25497f] outline-none" />
            </div>
          </div>
        </div>
      ))}
      <button onClick={addSlide} className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-[#25497f] hover:text-[#25497f]">
        + Slide Ekle
      </button>
      {picker && (
        <MediaPicker
          currentUrl={picker.field === "imageUrl" ? data.slides[picker.slideIdx]?.imageUrl : data.slides[picker.slideIdx]?.mobileImageUrl}
          onSelect={(url) => updateSlide(picker.slideIdx, { [picker.field]: url })}
          onClose={() => setPicker(null)}
        />
      )}
    </div>
  );
}
