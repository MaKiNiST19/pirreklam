"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import HierarchicalCategorySelect from "@/components/admin/HierarchicalCategorySelect";

interface Category {
  id: string;
  name: string;
  parentId?: string | null;
}

interface Variant {
  id?: string;
  sku: string;
  baskiOption: string;
  renkOption: string;
  desenOption: string;
  adet: number;
  priceUsd: string;
  isCompatible: boolean;
  stockCode: string;
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    shortDesc: "",
    categoryId: "",
    productType: "",
    isPublished: true,
    seoTitle: "",
    seoDescription: "",
    images: [] as string[],
  });
  const [variants, setVariants] = useState<Variant[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [savingVariants, setSavingVariants] = useState(false);

  const loadProduct = useCallback(async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch(`/api/products/${id}`),
        fetch("/api/categories"),
      ]);
      const product = await prodRes.json();
      const cats = await catRes.json();
      setCategories(Array.isArray(cats) ? cats : []);
      setForm({
        title: product.title || "",
        slug: product.slug || "",
        description: product.description || "",
        shortDesc: product.shortDesc || "",
        categoryId: product.categoryId || "",
        productType: product.productType || "",
        isPublished: product.isPublished ?? true,
        seoTitle: product.seoTitle || "",
        seoDescription: product.seoDescription || "",
        images: product.images || [],
      });
      setVariants(
        (product.variants || []).map((v: Record<string, unknown>) => ({
          id: v.id as string,
          sku: (v.sku as string) || "",
          baskiOption: (v.baskiOption as string) || "",
          renkOption: (v.renkOption as string) || "",
          desenOption: (v.desenOption as string) || "",
          adet: (v.adet as number) || 0,
          priceUsd: String(v.priceUsd || "0"),
          isCompatible: v.isCompatible !== false,
          stockCode: (v.stockCode as string) || "",
        }))
      );
    } catch {
      alert("Urun yuklenemedi.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    setNewImages((prev) => [...prev, ...files]);
    setNewPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  }

  function removeExistingImage(idx: number) {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
    }));
  }

  function removeNewImage(idx: number) {
    setNewImages((prev) => prev.filter((_, i) => i !== idx));
    setNewPreviews((prev) => {
      URL.revokeObjectURL(prev[idx]);
      return prev.filter((_, i) => i !== idx);
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const uploadedUrls: string[] = [];
      for (const file of newImages) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (data.url) uploadedUrls.push(data.url);
      }

      const body = { ...form, images: [...form.images, ...uploadedUrls] };
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setNewImages([]);
        setNewPreviews([]);
        loadProduct();
        alert("Urun kaydedildi.");
      }
    } catch {
      alert("Kaydetme hatasi.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Bu urunu silmek istediginize emin misiniz?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    router.push("/admin/urunler");
  }

  // Variant handlers
  function addVariant() {
    setVariants((prev) => [
      ...prev,
      { sku: "", baskiOption: "", renkOption: "", desenOption: "", adet: 0, priceUsd: "0", isCompatible: true, stockCode: "" },
    ]);
  }

  function updateVariant(idx: number, field: string, value: string | number | boolean) {
    setVariants((prev) => prev.map((v, i) => (i === idx ? { ...v, [field]: value } : v)));
  }

  function removeVariant(idx: number) {
    setVariants((prev) => prev.filter((_, i) => i !== idx));
  }

  async function saveVariants() {
    setSavingVariants(true);
    try {
      await fetch(`/api/products/${id}/variants`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variants }),
      });
      alert("Varyantlar kaydedildi.");
      loadProduct();
    } catch {
      alert("Varyant kaydetme hatasi.");
    } finally {
      setSavingVariants(false);
    }
  }

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#25497f]" />
      </div>
    );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Urun Duzenle</h1>
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
        >
          Urunu Sil
        </button>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-700">Temel Bilgiler</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Baslik *</label>
              <input name="title" value={form.title} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25497f] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <input name="slug" value={form.slug} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25497f] outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Aciklama</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={5} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25497f] outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kisa Aciklama</label>
            <textarea name="shortDesc" value={form.shortDesc} onChange={handleChange} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25497f] outline-none" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
              <HierarchicalCategorySelect
                categories={categories}
                value={form.categoryId}
                onChange={(id) => setForm((prev) => ({ ...prev, categoryId: id }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Urun Tipi</label>
              <select name="productType" value={form.productType} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25497f] outline-none">
                <option value="">Varsayilan</option>
                <option value="Mat Biala">Mat Biala</option>
                <option value="Termo Deri">Termo Deri</option>
                <option value="Lux Suni Deri">Lux Suni Deri</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">Yayinda</label>
            <button
              type="button"
              onClick={() => setForm((p) => ({ ...p, isPublished: !p.isPublished }))}
              className={`relative w-11 h-6 rounded-full transition-colors ${form.isPublished ? "bg-green-500" : "bg-gray-300"}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${form.isPublished ? "translate-x-5" : ""}`} />
            </button>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-700">Gorseller</h2>
          <div className="flex flex-wrap gap-3">
            {form.images.map((src, i) => (
              <div key={i} className="relative w-24 h-24">
                <Image src={src} alt="" width={96} height={96} className="w-full h-full object-cover rounded-lg" />
                <button type="button" onClick={() => removeExistingImage(i)} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">x</button>
              </div>
            ))}
            {newPreviews.map((src, i) => (
              <div key={`new-${i}`} className="relative w-24 h-24">
                <img src={src} alt="" className="w-full h-full object-cover rounded-lg border-2 border-blue-300" />
                <button type="button" onClick={() => removeNewImage(i)} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">x</button>
              </div>
            ))}
            <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-[#25497f]">
              <span className="text-gray-400 text-2xl">+</span>
              <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* SEO */}
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-700">SEO</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SEO Baslik</label>
            <input name="seoTitle" value={form.seoTitle} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25497f] outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SEO Aciklama</label>
            <textarea name="seoDescription" value={form.seoDescription} onChange={handleChange} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25497f] outline-none" />
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="px-6 py-2.5 bg-[#cc0636] text-white rounded-lg font-medium hover:bg-[#a80530] disabled:opacity-50 transition-colors">
            {saving ? "Kaydediliyor..." : "Urunu Kaydet"}
          </button>
          <button type="button" onClick={() => router.back()} className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            Geri
          </button>
        </div>
      </form>

      {/* Variants */}
      <div className="max-w-4xl mt-8 bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-700">Varyantlar</h2>
          <button type="button" onClick={addVariant} className="px-3 py-1.5 bg-[#25497f] text-white rounded-lg text-sm hover:bg-[#1d3a66]">
            + Varyant Ekle
          </button>
        </div>

        {variants.length === 0 ? (
          <p className="text-gray-500 text-sm">Henuz varyant eklenmemis.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="pb-2 pr-2">SKU</th>
                  <th className="pb-2 pr-2">Baski</th>
                  <th className="pb-2 pr-2">Renk</th>
                  <th className="pb-2 pr-2">Desen</th>
                  <th className="pb-2 pr-2">Adet</th>
                  <th className="pb-2 pr-2">Fiyat (USD)</th>
                  <th className="pb-2 pr-2">Uyumlu</th>
                  <th className="pb-2 pr-2">Stok Kodu</th>
                  <th className="pb-2"></th>
                </tr>
              </thead>
              <tbody>
                {variants.map((v, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="py-1 pr-2">
                      <input value={v.sku} onChange={(e) => updateVariant(i, "sku", e.target.value)} className="w-24 px-2 py-1 border rounded text-xs" />
                    </td>
                    <td className="py-1 pr-2">
                      <input value={v.baskiOption} onChange={(e) => updateVariant(i, "baskiOption", e.target.value)} className="w-20 px-2 py-1 border rounded text-xs" />
                    </td>
                    <td className="py-1 pr-2">
                      <input value={v.renkOption} onChange={(e) => updateVariant(i, "renkOption", e.target.value)} className="w-20 px-2 py-1 border rounded text-xs" />
                    </td>
                    <td className="py-1 pr-2">
                      <input value={v.desenOption} onChange={(e) => updateVariant(i, "desenOption", e.target.value)} className="w-20 px-2 py-1 border rounded text-xs" />
                    </td>
                    <td className="py-1 pr-2">
                      <input type="number" value={v.adet} onChange={(e) => updateVariant(i, "adet", parseInt(e.target.value) || 0)} className="w-16 px-2 py-1 border rounded text-xs" />
                    </td>
                    <td className="py-1 pr-2">
                      <input value={v.priceUsd} onChange={(e) => updateVariant(i, "priceUsd", e.target.value)} className="w-20 px-2 py-1 border rounded text-xs" />
                    </td>
                    <td className="py-1 pr-2">
                      <input type="checkbox" checked={v.isCompatible} onChange={(e) => updateVariant(i, "isCompatible", e.target.checked)} />
                    </td>
                    <td className="py-1 pr-2">
                      <input value={v.stockCode} onChange={(e) => updateVariant(i, "stockCode", e.target.value)} className="w-20 px-2 py-1 border rounded text-xs" />
                    </td>
                    <td className="py-1">
                      <button onClick={() => removeVariant(i)} className="text-red-500 hover:underline text-xs">Sil</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {variants.length > 0 && (
          <button
            type="button"
            onClick={saveVariants}
            disabled={savingVariants}
            className="mt-4 px-4 py-2 bg-[#cc0636] text-white rounded-lg text-sm font-medium hover:bg-[#a80530] disabled:opacity-50"
          >
            {savingVariants ? "Kaydediliyor..." : "Varyantlari Kaydet"}
          </button>
        )}
      </div>
    </div>
  );
}
