"use client";

import { useState, useEffect } from "react";

interface Category { id: string; name: string; parentId: string | null }
interface Data { title?: string; mode?: "category" | "manual"; categoryId?: string; limit?: number }

export default function ProductListModuleForm({ data, onChange }: { data: Data; onChange: (d: Data) => void }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const mode = data.mode || "category";

  useEffect(() => {
    fetch("/api/categories").then(r => r.json()).then(d => setCategories(Array.isArray(d) ? d : []));
  }, []);

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs text-gray-500 mb-1">Başlık</label>
        <input value={data.title || ""} onChange={(e) => onChange({ ...data, title: e.target.value })} className="w-full px-2 py-1.5 text-sm border rounded focus:ring-1 focus:ring-[#25497f] outline-none" placeholder="Öne Çıkan Ürünler" />
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">Seçim Modu</label>
        <div className="flex gap-3">
          {(["category", "manual"] as const).map((m) => (
            <label key={m} className="flex items-center gap-1.5 text-sm cursor-pointer">
              <input type="radio" checked={mode === m} onChange={() => onChange({ ...data, mode: m })} />
              {m === "category" ? "Kategoriye Göre" : "Manuel Seçim"}
            </label>
          ))}
        </div>
      </div>
      {mode === "category" && (
        <div>
          <label className="block text-xs text-gray-500 mb-1">Kategori</label>
          <select value={data.categoryId || ""} onChange={(e) => onChange({ ...data, categoryId: e.target.value })} className="w-full px-2 py-1.5 text-sm border rounded focus:ring-1 focus:ring-[#25497f] outline-none">
            <option value="">Tüm Kategoriler</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      )}
      <div>
        <label className="block text-xs text-gray-500 mb-1">Gösterilecek Ürün Sayısı</label>
        <input type="number" min={2} max={24} value={data.limit || 8} onChange={(e) => onChange({ ...data, limit: parseInt(e.target.value) })} className="w-32 px-2 py-1.5 text-sm border rounded focus:ring-1 focus:ring-[#25497f] outline-none" />
      </div>
    </div>
  );
}
