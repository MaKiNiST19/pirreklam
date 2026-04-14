"use client";

import { useState, useEffect, useCallback } from "react";

interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  isPublished: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
}

const emptyForm = { title: "", slug: "", content: "", isPublished: true, seoTitle: "", seoDescription: "" };

export default function PagesPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/pages");
      const data = await res.json();
      setPages(Array.isArray(data) ? data : []);
    } catch { setPages([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  function openNew() {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(page: Page) {
    setEditingId(page.id);
    setForm({
      title: page.title,
      slug: page.slug,
      content: page.content,
      isPublished: page.isPublished,
      seoTitle: page.seoTitle || "",
      seoDescription: page.seoDescription || "",
    });
    setModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await fetch(`/api/pages/${editingId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      } else {
        await fetch("/api/pages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      }
      setModalOpen(false);
      load();
    } catch { alert("Kaydetme hatasi."); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu sayfayi silmek istediginize emin misiniz?")) return;
    await fetch(`/api/pages/${id}`, { method: "DELETE" });
    load();
  }

  function generateSlug(title: string) {
    return title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#25497f]" /></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Sayfalar</h1>
        <button onClick={openNew} className="px-4 py-2 bg-[#cc0636] text-white rounded-lg text-sm font-medium hover:bg-[#a80530]">+ Yeni Sayfa</button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500 bg-gray-50">
              <th className="px-4 py-3">Baslik</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3 w-24">Durum</th>
              <th className="px-4 py-3 w-32">Islemler</th>
            </tr>
          </thead>
          <tbody>
            {pages.map((page) => (
              <tr key={page.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="px-4 py-2 font-medium">{page.title}</td>
                <td className="px-4 py-2 text-gray-500">/{page.slug}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${page.isPublished ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {page.isPublished ? "Yayinda" : "Taslak"}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <div className="flex gap-2">
                    <a href={`/admin/sayfalar/${page.id}`} className="text-[#25497f] hover:underline text-xs font-medium">Modüller</a>
                    <button onClick={() => openEdit(page)} className="text-gray-600 hover:underline text-xs">Ayarlar</button>
                    <button onClick={() => handleDelete(page.id)} className="text-red-500 hover:underline text-xs">Sil</button>
                  </div>
                </td>
              </tr>
            ))}
            {pages.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-500">Henuz sayfa yok.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-lg font-semibold mb-4">{editingId ? "Sayfa Duzenle" : "Yeni Sayfa"}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Baslik *</label>
                <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value, slug: editingId ? p.slug : generateSlug(e.target.value) }))} required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#25497f] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#25497f] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icerik</label>
                <textarea value={form.content} onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))} rows={10} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#25497f] outline-none font-mono text-sm" />
              </div>
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-gray-700">Yayinda</label>
                <button type="button" onClick={() => setForm((p) => ({ ...p, isPublished: !p.isPublished }))} className={`relative w-11 h-6 rounded-full transition-colors ${form.isPublished ? "bg-green-500" : "bg-gray-300"}`}>
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${form.isPublished ? "translate-x-5" : ""}`} />
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SEO Baslik</label>
                <input value={form.seoTitle} onChange={(e) => setForm((p) => ({ ...p, seoTitle: e.target.value }))} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#25497f] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SEO Aciklama</label>
                <textarea value={form.seoDescription} onChange={(e) => setForm((p) => ({ ...p, seoDescription: e.target.value }))} rows={2} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#25497f] outline-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="px-4 py-2 bg-[#cc0636] text-white rounded-lg text-sm font-medium hover:bg-[#a80530] disabled:opacity-50">{saving ? "Kaydediliyor..." : "Kaydet"}</button>
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50">Iptal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
