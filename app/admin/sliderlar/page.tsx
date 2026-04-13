"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface Slider {
  id: string;
  title: string | null;
  imageUrl: string;
  mobileImageUrl: string | null;
  link: string | null;
  sortOrder: number;
  isActive: boolean;
}

export default function SlidersPage() {
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newSlider, setNewSlider] = useState({ title: "", link: "", isActive: true });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/sliders");
      const data = await res.json();
      setSliders((Array.isArray(data) ? data : []).sort((a: Slider, b: Slider) => a.sortOrder - b.sortOrder));
    } catch { setSliders([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleToggle(id: string, isActive: boolean) {
    await fetch(`/api/sliders/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isActive: !isActive }) });
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu slideri silmek istediginize emin misiniz?")) return;
    await fetch(`/api/sliders/${id}`, { method: "DELETE" });
    load();
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!imageFile) { alert("Gorsel secin."); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("file", imageFile);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: fd });
      const uploadData = await uploadRes.json();

      await fetch("/api/sliders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newSlider, imageUrl: uploadData.url, sortOrder: sliders.length }),
      });
      setModalOpen(false);
      setNewSlider({ title: "", link: "", isActive: true });
      setImageFile(null);
      setPreview("");
      load();
    } catch { alert("Ekleme hatasi."); }
    finally { setSaving(false); }
  }

  async function handleMove(id: string, direction: "up" | "down") {
    const idx = sliders.findIndex((s) => s.id === id);
    if (idx < 0) return;
    const newSliders = [...sliders];
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= newSliders.length) return;
    [newSliders[idx], newSliders[swapIdx]] = [newSliders[swapIdx], newSliders[idx]];
    setSliders(newSliders);
    // Save order
    for (let i = 0; i < newSliders.length; i++) {
      await fetch(`/api/sliders/${newSliders[i].id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sortOrder: i }),
      });
    }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#25497f]" /></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Slider / Banner</h1>
        <button onClick={() => setModalOpen(true)} className="px-4 py-2 bg-[#cc0636] text-white rounded-lg text-sm font-medium hover:bg-[#a80530]">+ Yeni Slider</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sliders.map((slider, idx) => (
          <div key={slider.id} className="bg-white rounded-xl shadow overflow-hidden">
            <div className="relative aspect-[16/6]">
              <Image src={slider.imageUrl} alt={slider.title || ""} fill className="object-cover" />
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium truncate">{slider.title || "Baslisiz"}</span>
                <button
                  onClick={() => handleToggle(slider.id, slider.isActive)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${slider.isActive ? "bg-green-500" : "bg-gray-300"}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${slider.isActive ? "translate-x-5" : ""}`} />
                </button>
              </div>
              {slider.link && <p className="text-xs text-gray-400 truncate">{slider.link}</p>}
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  <button onClick={() => handleMove(slider.id, "up")} disabled={idx === 0} className="text-gray-400 hover:text-gray-600 disabled:opacity-30 text-xs">&#9650;</button>
                  <button onClick={() => handleMove(slider.id, "down")} disabled={idx === sliders.length - 1} className="text-gray-400 hover:text-gray-600 disabled:opacity-30 text-xs">&#9660;</button>
                </div>
                <button onClick={() => handleDelete(slider.id)} className="text-red-500 hover:underline text-xs">Sil</button>
              </div>
            </div>
          </div>
        ))}
        {sliders.length === 0 && <p className="col-span-full text-center text-gray-500 py-8">Henuz slider yok.</p>}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
            <h2 className="text-lg font-semibold mb-4">Yeni Slider</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Baslik</label>
                <input value={newSlider.title} onChange={(e) => setNewSlider((p) => ({ ...p, title: e.target.value }))} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#25497f] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gorsel *</label>
                {preview && <img src={preview} alt="" className="w-full h-32 object-cover rounded-lg mb-2" />}
                <input type="file" accept="image/*" onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) { setImageFile(f); setPreview(URL.createObjectURL(f)); }
                }} className="text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link URL</label>
                <input value={newSlider.link} onChange={(e) => setNewSlider((p) => ({ ...p, link: e.target.value }))} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#25497f] outline-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="px-4 py-2 bg-[#cc0636] text-white rounded-lg text-sm font-medium hover:bg-[#a80530] disabled:opacity-50">{saving ? "Kaydediliyor..." : "Ekle"}</button>
                <button type="button" onClick={() => { setModalOpen(false); setPreview(""); }} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50">Iptal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
