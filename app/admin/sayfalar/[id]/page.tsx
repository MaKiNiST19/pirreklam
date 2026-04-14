"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  DndContext, closestCenter, PointerSensor, KeyboardSensor,
  useSensor, useSensors, type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext, sortableKeyboardCoordinates, useSortable,
  verticalListSortingStrategy, arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import SliderModuleForm from "@/components/admin/modules/SliderModuleForm";
import Banner4ModuleForm from "@/components/admin/modules/Banner4ModuleForm";
import ProductListModuleForm from "@/components/admin/modules/ProductListModuleForm";
import AboutModuleForm from "@/components/admin/modules/AboutModuleForm";
import TextModuleForm from "@/components/admin/modules/TextModuleForm";
import TabsModuleForm from "@/components/admin/modules/TabsModuleForm";
import AccordionModuleForm from "@/components/admin/modules/AccordionModuleForm";
import ReviewsModuleForm from "@/components/admin/modules/ReviewsModuleForm";

/* ── Types ── */
interface Page { id: string; title: string; slug: string; isPublished: boolean; seoTitle?: string; seoDescription?: string }
interface Module { id: string; type: string; label: string | null; sortOrder: number; isActive: boolean; data: Record<string, unknown> }

/* ── Module metadata ── */
const MODULE_TYPES = [
  { type: "slider",           label: "Slider / Banner",       icon: "🖼️",  desc: "Tam genişlik resim kaydırıcı" },
  { type: "banner4",          label: "4'lü Banner",           icon: "⊞",   desc: "2×2 banner grid" },
  { type: "product-carousel", label: "Ürün Carousel",         icon: "↔️",  desc: "Yatay kayan ürünler" },
  { type: "product-grid",     label: "Ürün Grid",             icon: "⊡",   desc: "Izgara düzeni ürünler" },
  { type: "about",            label: "Hakkımızda",            icon: "🏢",  desc: "Metin + görsel + sayaçlar" },
  { type: "text",             label: "Metin Bloğu",           icon: "T",   desc: "Başlık ve metin içeriği" },
  { type: "tabs",             label: "Sekmeler",              icon: "⊟",   desc: "Sekmeli içerik bölümü" },
  { type: "accordion",        label: "Accordion / SSS",       icon: "☰",   desc: "Açılır-kapanır madde listesi" },
  { type: "reviews",          label: "Yorumlar",              icon: "★",   desc: "Müşteri yorumları" },
];

function getTypeLabel(type: string) { return MODULE_TYPES.find(m => m.type === type)?.label || type; }
function getTypeIcon(type: string) { return MODULE_TYPES.find(m => m.type === type)?.icon || "□"; }

/* ── Default data per module type ── */
function defaultData(type: string): Record<string, unknown> {
  switch (type) {
    case "slider": return { slides: [] };
    case "banner4": return { items: [{}, {}, {}, {}] };
    case "product-carousel": return { title: "", mode: "category", limit: 8 };
    case "product-grid": return { title: "", mode: "category", limit: 12 };
    case "about": return { title: "", subtitle: "", body: "", counters: [{ value: "", label: "" }, { value: "", label: "" }, { value: "", label: "" }, { value: "", label: "" }] };
    case "text": return { title: "", body: "", alignment: "left" };
    case "tabs": return { tabs: [] };
    case "accordion": return { items: [] };
    case "reviews": return { title: "", reviews: [] };
    default: return {};
  }
}

/* ── Sortable Module Card ── */
function ModuleCard({ module, pageId, onUpdate, onDelete }: {
  module: Module; pageId: string;
  onUpdate: (id: string, patch: Partial<Module>) => void;
  onDelete: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [localData, setLocalData] = useState<Record<string, unknown>>(module.data);
  const [saving, setSaving] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: module.id });

  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  async function saveData() {
    setSaving(true);
    await fetch(`/api/pages/${pageId}/modules/${module.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: localData }),
    });
    onUpdate(module.id, { data: localData });
    setSaving(false);
  }

  async function toggleActive() {
    const next = !module.isActive;
    await fetch(`/api/pages/${pageId}/modules/${module.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: next }),
    });
    onUpdate(module.id, { isActive: next });
  }

  function renderForm() {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const d = localData as any;
    switch (module.type) {
      case "slider": return <SliderModuleForm data={d} onChange={setLocalData as any} />;
      case "banner4": return <Banner4ModuleForm data={d} onChange={setLocalData as any} />;
      case "product-carousel": return <ProductListModuleForm data={d} onChange={setLocalData as any} />;
      case "product-grid": return <ProductListModuleForm data={d} onChange={setLocalData as any} />;
      case "about": return <AboutModuleForm data={d} onChange={setLocalData as any} />;
      case "text": return <TextModuleForm data={d} onChange={setLocalData as any} />;
      case "tabs": return <TabsModuleForm data={d} onChange={setLocalData as any} />;
      case "accordion": return <AccordionModuleForm data={d} onChange={setLocalData as any} />;
      case "reviews": return <ReviewsModuleForm data={d} onChange={setLocalData as any} />;
      default: return <p className="text-sm text-gray-400">Bu modül tipi için form yok.</p>;
    }
  }

  return (
    <div ref={setNodeRef} style={style} className="bg-white border rounded-xl shadow-sm overflow-hidden">
      {/* Card header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border-b">
        {/* Drag handle */}
        <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 touch-none flex-shrink-0">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
          </svg>
        </button>
        {/* Icon + label */}
        <span className="text-base leading-none">{getTypeIcon(module.type)}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-800 truncate">{module.label || getTypeLabel(module.type)}</p>
          <p className="text-xs text-gray-400">{getTypeLabel(module.type)}</p>
        </div>
        {/* Active toggle */}
        <button onClick={toggleActive} className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${module.isActive ? "bg-green-500" : "bg-gray-300"}`}>
          <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${module.isActive ? "translate-x-5" : ""}`} />
        </button>
        {/* Expand */}
        <button onClick={() => setExpanded(e => !e)} className="text-gray-400 hover:text-gray-600 text-xs px-2 py-1 border rounded bg-white">
          {expanded ? "Kapat ▲" : "Düzenle ▼"}
        </button>
        {/* Delete */}
        <button onClick={() => onDelete(module.id)} className="text-red-400 hover:text-red-600 flex-shrink-0">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
      {/* Expanded form */}
      {expanded && (
        <div className="p-5">
          {/* Custom label */}
          <div className="mb-4">
            <label className="block text-xs text-gray-500 mb-1">Modül Etiketi (admin için)</label>
            <input
              value={module.label || ""}
              onChange={async (e) => {
                await fetch(`/api/pages/${pageId}/modules/${module.id}`, {
                  method: "PUT", headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ label: e.target.value || null }),
                });
                onUpdate(module.id, { label: e.target.value || null });
              }}
              placeholder={getTypeLabel(module.type)}
              className="w-full px-2 py-1.5 text-sm border rounded focus:ring-1 focus:ring-[#25497f] outline-none"
            />
          </div>
          <hr className="mb-4" />
          {renderForm()}
          <div className="mt-4 flex justify-end">
            <button onClick={saveData} disabled={saving} className="px-4 py-2 bg-[#25497f] text-white rounded-lg text-sm hover:bg-[#1d3a66] disabled:opacity-50">
              {saving ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Add Module Modal ── */
function AddModuleModal({ onAdd, onClose }: { onAdd: (type: string) => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold">Modül Ekle</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-bold">×</button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {MODULE_TYPES.map((m) => (
            <button
              key={m.type}
              onClick={() => { onAdd(m.type); onClose(); }}
              className="flex flex-col items-center gap-2 p-4 border-2 border-transparent rounded-xl hover:border-[#25497f] hover:bg-blue-50 text-center transition-all"
            >
              <span className="text-2xl">{m.icon}</span>
              <span className="text-sm font-medium text-gray-800">{m.label}</span>
              <span className="text-xs text-gray-400">{m.desc}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Main Page Editor ── */
export default function PageEditor() {
  const params = useParams();
  const router = useRouter();
  const pageId = params.id as string;

  const [page, setPage] = useState<Page | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [pageForm, setPageForm] = useState({ title: "", slug: "", isPublished: true, seoTitle: "", seoDescription: "" });
  const [savingPage, setSavingPage] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const load = useCallback(async () => {
    try {
      const [pageRes, modulesRes] = await Promise.all([
        fetch(`/api/pages/${pageId}`),
        fetch(`/api/pages/${pageId}/modules`),
      ]);
      const pageData = await pageRes.json();
      const modulesData = await modulesRes.json();
      setPage(pageData);
      setPageForm({
        title: pageData.title || "",
        slug: pageData.slug || "",
        isPublished: pageData.isPublished ?? true,
        seoTitle: pageData.seoTitle || "",
        seoDescription: pageData.seoDescription || "",
      });
      setModules((Array.isArray(modulesData) ? modulesData : []).sort((a: Module, b: Module) => a.sortOrder - b.sortOrder));
    } catch {
      alert("Sayfa yüklenemedi.");
    } finally {
      setLoading(false);
    }
  }, [pageId]);

  useEffect(() => { load(); }, [load]);

  async function savePage(e: React.FormEvent) {
    e.preventDefault();
    setSavingPage(true);
    await fetch(`/api/pages/${pageId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pageForm),
    });
    setSavingPage(false);
    alert("Sayfa ayarları kaydedildi.");
  }

  async function addModule(type: string) {
    const res = await fetch(`/api/pages/${pageId}/modules`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, data: defaultData(type) }),
    });
    const newModule = await res.json();
    setModules(prev => [...prev, newModule]);
  }

  async function deleteModule(id: string) {
    if (!confirm("Bu modülü silmek istediğinize emin misiniz?")) return;
    await fetch(`/api/pages/${pageId}/modules/${id}`, { method: "DELETE" });
    setModules(prev => prev.filter(m => m.id !== id));
  }

  function updateModuleLocal(id: string, patch: Partial<Module>) {
    setModules(prev => prev.map(m => m.id === id ? { ...m, ...patch } : m));
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIdx = modules.findIndex(m => m.id === active.id);
    const newIdx = modules.findIndex(m => m.id === over.id);
    const reordered = arrayMove(modules, oldIdx, newIdx);
    setModules(reordered);

    await fetch(`/api/pages/${pageId}/modules/reorder`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: reordered.map((m, i) => ({ id: m.id, sortOrder: i })) }),
    });
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#25497f]" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <button onClick={() => router.push("/admin/sayfalar")} className="hover:text-[#25497f]">Sayfalar</button>
        <span>/</span>
        <span className="text-gray-800 font-medium">{page?.title || "Sayfa Editörü"}</span>
      </div>

      {/* Page settings */}
      <details className="bg-white rounded-xl shadow-sm border mb-6">
        <summary className="px-5 py-4 cursor-pointer font-medium text-gray-800 hover:bg-gray-50 rounded-xl list-none flex items-center justify-between">
          <span>⚙️ Sayfa Ayarları</span>
          <span className="text-xs text-gray-400">Genişlet</span>
        </summary>
        <form onSubmit={savePage} className="px-5 pb-5 pt-2 space-y-3 border-t">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Başlık</label>
              <input value={pageForm.title} onChange={(e) => setPageForm(p => ({ ...p, title: e.target.value }))} className="w-full px-2 py-1.5 text-sm border rounded focus:ring-1 focus:ring-[#25497f] outline-none" required />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Slug</label>
              <input value={pageForm.slug} onChange={(e) => setPageForm(p => ({ ...p, slug: e.target.value }))} className="w-full px-2 py-1.5 text-sm border rounded focus:ring-1 focus:ring-[#25497f] outline-none" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">SEO Başlık</label>
              <input value={pageForm.seoTitle} onChange={(e) => setPageForm(p => ({ ...p, seoTitle: e.target.value }))} className="w-full px-2 py-1.5 text-sm border rounded focus:ring-1 focus:ring-[#25497f] outline-none" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">SEO Açıklama</label>
              <input value={pageForm.seoDescription} onChange={(e) => setPageForm(p => ({ ...p, seoDescription: e.target.value }))} className="w-full px-2 py-1.5 text-sm border rounded focus:ring-1 focus:ring-[#25497f] outline-none" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-700">Yayında</label>
            <button type="button" onClick={() => setPageForm(p => ({ ...p, isPublished: !p.isPublished }))} className={`relative w-10 h-5 rounded-full transition-colors ${pageForm.isPublished ? "bg-green-500" : "bg-gray-300"}`}>
              <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${pageForm.isPublished ? "translate-x-5" : ""}`} />
            </button>
          </div>
          <button type="submit" disabled={savingPage} className="px-4 py-2 bg-[#25497f] text-white rounded-lg text-sm hover:bg-[#1d3a66] disabled:opacity-50">
            {savingPage ? "Kaydediliyor..." : "Sayfa Ayarlarını Kaydet"}
          </button>
        </form>
      </details>

      {/* Modules */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Modüller <span className="text-sm font-normal text-gray-400">({modules.length})</span></h2>
        <button onClick={() => setAddModalOpen(true)} className="px-4 py-2 bg-[#cc0636] text-white rounded-lg text-sm font-medium hover:bg-[#a80530]">
          + Modül Ekle
        </button>
      </div>

      {modules.length === 0 ? (
        <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 py-16 text-center">
          <p className="text-gray-400 text-sm mb-3">Bu sayfada henüz modül yok</p>
          <button onClick={() => setAddModalOpen(true)} className="px-4 py-2 bg-[#25497f] text-white rounded-lg text-sm hover:bg-[#1d3a66]">
            İlk Modülü Ekle
          </button>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={modules.map(m => m.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {modules.map((module) => (
                <ModuleCard
                  key={module.id}
                  module={module}
                  pageId={pageId}
                  onUpdate={updateModuleLocal}
                  onDelete={deleteModule}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {addModalOpen && <AddModuleModal onAdd={addModule} onClose={() => setAddModalOpen(false)} />}
    </div>
  );
}
