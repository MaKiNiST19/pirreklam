"use client";

import { useState, useEffect, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  parentId: string | null;
  menuOrder: number;
  seoTitle: string | null;
  seoDescription: string | null;
  children?: Category[];
  _count?: { products: number };
}

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  parentId: "",
  image: "",
  seoTitle: "",
  seoDescription: "",
};

/* ── Sortable Row ── */
function SortableRow({
  cat,
  depth,
  categories,
  onEdit,
  onDelete,
}: {
  cat: Category;
  depth: number;
  categories: Category[];
  onEdit: (c: Category) => void;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: cat.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    paddingLeft: `${16 + depth * 24}px`,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} className={`flex items-center justify-between py-2 px-4 hover:bg-gray-50 border-b bg-white`}>
      <div className="flex items-center gap-3">
        {/* Drag handle */}
        <button {...listeners} className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 touch-none" title="Sürükle">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
          </svg>
        </button>
        <span className="text-sm font-medium">{cat.name}</span>
        <span className="text-xs text-gray-400">/{cat.slug}</span>
        <span className="text-xs text-gray-400">({cat._count?.products ?? 0} urun)</span>
      </div>
      <div className="flex gap-2">
        <a
          href={cat.parentId
            ? `/urun-kategori/${categories.find((c) => c.id === cat.parentId)?.slug || ""}/${cat.slug}/`
            : `/urun-kategori/${cat.slug}/`
          }
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-600 hover:underline text-xs"
          title="Kategoriyi yeni sekmede görüntüle"
        >
          Gör
        </a>
        <button onClick={() => onEdit(cat)} className="text-[#25497f] hover:underline text-xs">Düzenle</button>
        <button onClick={() => onDelete(cat.id)} className="text-red-500 hover:underline text-xs">Sil</button>
      </div>
    </div>
  );
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch {
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  function buildTree(cats: Category[]): Category[] {
    const map = new Map<string, Category>();
    const roots: Category[] = [];
    cats.forEach((c) => map.set(c.id, { ...c, children: [] }));
    map.forEach((c) => {
      if (c.parentId && map.has(c.parentId)) {
        map.get(c.parentId)!.children!.push(c);
      } else {
        roots.push(c);
      }
    });
    roots.sort((a, b) => a.menuOrder - b.menuOrder);
    roots.forEach((r) => r.children!.sort((a, b) => a.menuOrder - b.menuOrder));
    return roots;
  }

  /* ── Get siblings (same parentId), sorted ── */
  function getSiblings(parentId: string | null): Category[] {
    return categories
      .filter((c) => c.parentId === parentId)
      .sort((a, b) => a.menuOrder - b.menuOrder);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const draggedCat = categories.find((c) => c.id === active.id);
    if (!draggedCat) return;

    const siblings = getSiblings(draggedCat.parentId);
    const oldIndex = siblings.findIndex((c) => c.id === active.id);
    const newIndex = siblings.findIndex((c) => c.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(siblings, oldIndex, newIndex);
    const updates = reordered.map((c, i) => ({ id: c.id, menuOrder: i }));

    // Optimistic update
    setCategories((prev) =>
      prev.map((c) => {
        const upd = updates.find((u) => u.id === c.id);
        return upd ? { ...c, menuOrder: upd.menuOrder } : c;
      })
    );

    // Save to server
    try {
      await fetch("/api/categories/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: updates }),
      });
    } catch {
      load(); // rollback
    }
  }

  function openNew() {
    setEditingId(null);
    setForm(emptyForm);
    setImageFile(null);
    setModalOpen(true);
  }

  function openEdit(cat: Category) {
    setEditingId(cat.id);
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
      parentId: cat.parentId || "",
      image: cat.image || "",
      seoTitle: cat.seoTitle || "",
      seoDescription: cat.seoDescription || "",
    });
    setImageFile(null);
    setModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      let imageUrl = form.image;
      if (imageFile) {
        const fd = new FormData();
        fd.append("file", imageFile);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (data.url) imageUrl = data.url;
      }

      const body = { ...form, image: imageUrl, parentId: form.parentId || null };
      if (editingId) {
        await fetch(`/api/categories/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }
      setModalOpen(false);
      load();
    } catch {
      alert("Kaydetme hatasi.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu kategoriyi silmek istediginize emin misiniz?")) return;
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    load();
  }

  function generateSlug(name: string) {
    return name.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
  }

  function renderSortableGroup(nodes: Category[], depth = 0): React.ReactNode {
    const ids = nodes.map((n) => n.id);
    return (
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        {nodes.map((cat) => (
          <div key={cat.id}>
            <SortableRow
              cat={cat}
              depth={depth}
              categories={categories}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
            {cat.children && cat.children.length > 0 && renderSortableGroup(
              cat.children.sort((a, b) => a.menuOrder - b.menuOrder),
              depth + 1
            )}
          </div>
        ))}
      </SortableContext>
    );
  }

  if (loading)
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#25497f]" /></div>;

  const tree = buildTree(categories);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Kategoriler</h1>
        <button onClick={openNew} className="px-4 py-2 bg-[#cc0636] text-white rounded-lg text-sm font-medium hover:bg-[#a80530]">
          + Yeni Kategori
        </button>
      </div>

      <p className="text-xs text-gray-500 mb-2">Sıralamayı değiştirmek için kategorileri sürükleyip bırakın.</p>

      <div className="bg-white rounded-xl shadow">
        {tree.length === 0 ? (
          <p className="p-8 text-center text-gray-500">Henuz kategori yok.</p>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            {renderSortableGroup(tree)}
          </DndContext>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-lg font-semibold mb-4">{editingId ? "Kategori Duzenle" : "Yeni Kategori"}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ad *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value, slug: editingId ? p.slug : generateSlug(e.target.value) }))}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#25497f] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#25497f] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ust Kategori</label>
                <select value={form.parentId} onChange={(e) => setForm((p) => ({ ...p, parentId: e.target.value }))} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#25497f] outline-none">
                  <option value="">Yok (Ana Kategori)</option>
                  {categories.filter((c) => c.id !== editingId).map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Aciklama</label>
                <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={3} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#25497f] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gorsel</label>
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="text-sm" />
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
                <button type="submit" disabled={saving} className="px-4 py-2 bg-[#cc0636] text-white rounded-lg text-sm font-medium hover:bg-[#a80530] disabled:opacity-50">
                  {saving ? "Kaydediliyor..." : "Kaydet"}
                </button>
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50">
                  Iptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
