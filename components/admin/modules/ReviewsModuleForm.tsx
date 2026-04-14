"use client";

import { useState } from "react";
import MediaPicker from "../MediaPicker";

interface Review { name: string; company?: string; rating?: number; text: string; avatarUrl?: string }
interface Data { title?: string; reviews: Review[] }

export default function ReviewsModuleForm({ data, onChange }: { data: Data; onChange: (d: Data) => void }) {
  const [pickerIdx, setPickerIdx] = useState<number | null>(null);
  const reviews: Review[] = data.reviews || [];

  function addReview() { onChange({ ...data, reviews: [...reviews, { name: "", text: "", rating: 5 }] }); }
  function removeReview(i: number) { onChange({ ...data, reviews: reviews.filter((_, idx) => idx !== i) }); }
  function update(i: number, patch: Partial<Review>) {
    onChange({ ...data, reviews: reviews.map((r, idx) => idx === i ? { ...r, ...patch } : r) });
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs text-gray-500 mb-1">Bölüm Başlığı</label>
        <input value={data.title || ""} onChange={(e) => onChange({ ...data, title: e.target.value })} className="w-full px-2 py-1.5 text-sm border rounded focus:ring-1 focus:ring-[#25497f] outline-none" placeholder="Müşteri Yorumları" />
      </div>
      {reviews.map((r, i) => (
        <div key={i} className="border rounded-lg p-3 space-y-2 bg-gray-50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-600">Yorum {i + 1}</span>
            <button onClick={() => removeReview(i)} className="text-red-500 text-xs hover:underline">Sil</button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input placeholder="Ad Soyad *" value={r.name} onChange={(e) => update(i, { name: e.target.value })} className="w-full px-2 py-1.5 text-sm border rounded focus:ring-1 focus:ring-[#25497f] outline-none" />
            <input placeholder="Şirket" value={r.company || ""} onChange={(e) => update(i, { company: e.target.value })} className="w-full px-2 py-1.5 text-sm border rounded focus:ring-1 focus:ring-[#25497f] outline-none" />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500">Puan:</label>
            <select value={r.rating || 5} onChange={(e) => update(i, { rating: parseInt(e.target.value) })} className="px-2 py-1 text-sm border rounded outline-none">
              {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} ★</option>)}
            </select>
            <button type="button" onClick={() => setPickerIdx(i)} className="ml-2 px-2 py-1 text-xs border rounded bg-white hover:bg-gray-50">
              {r.avatarUrl ? "Avatar Değiştir" : "Avatar Seç"}
            </button>
          </div>
          <textarea placeholder="Yorum metni *" value={r.text} onChange={(e) => update(i, { text: e.target.value })} rows={2} className="w-full px-2 py-1.5 text-sm border rounded focus:ring-1 focus:ring-[#25497f] outline-none" />
        </div>
      ))}
      <button onClick={addReview} className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-[#25497f] hover:text-[#25497f]">
        + Yorum Ekle
      </button>
      {pickerIdx !== null && (
        <MediaPicker
          currentUrl={reviews[pickerIdx]?.avatarUrl}
          onSelect={(url) => update(pickerIdx, { avatarUrl: url })}
          onClose={() => setPickerIdx(null)}
        />
      )}
    </div>
  );
}
