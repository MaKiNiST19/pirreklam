"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

interface Product {
  id: string;
  title: string;
  slug: string;
  images: string[];
  isPublished: boolean;
  menuOrder: number;
  category?: { name: string; slug: string } | null;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const loadProducts = useCallback(async () => {
    try {
      const res = await fetch("/api/products?limit=200");
      const data = await res.json();
      // API returns { products, total, page, totalPages }
      const list = Array.isArray(data) ? data : (data.products || []);
      const sorted = list.sort((a: Product, b: Product) => a.menuOrder - b.menuOrder);
      setProducts(sorted);
      setFiltered(sorted);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    if (!search) {
      setFiltered(products);
    } else {
      const q = search.toLowerCase();
      setFiltered(products.filter((p) => p.title.toLowerCase().includes(q)));
    }
  }, [search, products]);

  async function handleDelete(id: string) {
    if (!confirm("Bu urunu silmek istediginize emin misiniz?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    loadProducts();
  }

  async function handleMove(id: string, direction: "up" | "down") {
    const idx = products.findIndex((p) => p.id === id);
    if (idx < 0) return;
    const newProducts = [...products];
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= newProducts.length) return;
    [newProducts[idx], newProducts[swapIdx]] = [newProducts[swapIdx], newProducts[idx]];
    const reordered = newProducts.map((p, i) => ({ id: p.id, menuOrder: i }));
    setProducts(newProducts);
    setFiltered(newProducts);
    await fetch("/api/products/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: reordered }),
    });
  }

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#25497f]" />
      </div>
    );

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Urunler</h1>
        <Link
          href="/admin/urunler/yeni"
          className="px-4 py-2 bg-[#cc0636] text-white rounded-lg text-sm font-medium hover:bg-[#a80530] transition-colors"
        >
          + Yeni Urun
        </Link>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Urun ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25497f] focus:border-transparent outline-none"
        />
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500 bg-gray-50">
              <th className="px-4 py-3 w-16">Sira</th>
              <th className="px-4 py-3 w-16">Gorsel</th>
              <th className="px-4 py-3">Baslik</th>
              <th className="px-4 py-3">Kategori</th>
              <th className="px-4 py-3 w-24">Durum</th>
              <th className="px-4 py-3 w-32">Islemler</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product, idx) => (
              <tr key={product.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="px-4 py-2">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => handleMove(product.id, "up")}
                      disabled={idx === 0}
                      className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    >
                      &#9650;
                    </button>
                    <button
                      onClick={() => handleMove(product.id, "down")}
                      disabled={idx === filtered.length - 1}
                      className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    >
                      &#9660;
                    </button>
                  </div>
                </td>
                <td className="px-4 py-2">
                  {product.images?.[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.title}
                      width={40}
                      height={40}
                      className="rounded object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                      Yok
                    </div>
                  )}
                </td>
                <td className="px-4 py-2 font-medium">
                  <Link href={`/admin/urunler/${product.id}`} className="text-[#25497f] hover:underline">
                    {product.title}
                  </Link>
                </td>
                <td className="px-4 py-2 text-gray-500">{product.category?.name || "-"}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      product.isPublished
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {product.isPublished ? "Yayinda" : "Taslak"}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <div className="flex gap-2">
                    <a
                      href={`/urun/${product.slug}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:underline text-xs"
                      title="Ürünü yeni sekmede görüntüle"
                    >
                      Gör
                    </a>
                    <Link
                      href={`/admin/urunler/${product.id}`}
                      className="text-[#25497f] hover:underline text-xs"
                    >
                      Düzenle
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-500 hover:underline text-xs"
                    >
                      Sil
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  Urun bulunamadi.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
