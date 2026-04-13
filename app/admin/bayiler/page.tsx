"use client";

import { useState, useEffect, useCallback } from "react";

interface Dealer {
  id: string;
  name: string;
  company: string | null;
  phone: string | null;
  email: string | null;
  notes: string | null;
  _count?: { orders: number };
}

const emptyForm = { name: "", company: "", phone: "", email: "", notes: "" };

export default function DealersPage() {
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [selectedDealer, setSelectedDealer] = useState<string | null>(null);
  const [dealerOrders, setDealerOrders] = useState<Array<{ id: string; totalUsd: string; status: string; createdAt: string }>>([]);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/dealers");
      const data = await res.json();
      setDealers(Array.isArray(data) ? data : []);
    } catch { setDealers([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  function openNew() { setEditingId(null); setForm(emptyForm); setModalOpen(true); }

  function openEdit(d: Dealer) {
    setEditingId(d.id);
    setForm({ name: d.name, company: d.company || "", phone: d.phone || "", email: d.email || "", notes: d.notes || "" });
    setModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await fetch(`/api/dealers/${editingId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      } else {
        await fetch("/api/dealers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      }
      setModalOpen(false);
      load();
    } catch { alert("Kaydetme hatasi."); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu bayiyi silmek istediginize emin misiniz?")) return;
    await fetch(`/api/dealers/${id}`, { method: "DELETE" });
    load();
  }

  async function viewOrders(dealerId: string) {
    setSelectedDealer(dealerId);
    try {
      const res = await fetch(`/api/dealers/${dealerId}`);
      const data = await res.json();
      setDealerOrders(data.orders || []);
    } catch { setDealerOrders([]); }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#25497f]" /></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Bayiler</h1>
        <button onClick={openNew} className="px-4 py-2 bg-[#cc0636] text-white rounded-lg text-sm font-medium hover:bg-[#a80530]">+ Yeni Bayi</button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500 bg-gray-50">
              <th className="px-4 py-3">Ad</th>
              <th className="px-4 py-3">Firma</th>
              <th className="px-4 py-3">Telefon</th>
              <th className="px-4 py-3">E-posta</th>
              <th className="px-4 py-3 w-20">Siparis</th>
              <th className="px-4 py-3 w-40">Islemler</th>
            </tr>
          </thead>
          <tbody>
            {dealers.map((d) => (
              <tr key={d.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="px-4 py-2 font-medium">{d.name}</td>
                <td className="px-4 py-2 text-gray-500">{d.company || "-"}</td>
                <td className="px-4 py-2">{d.phone || "-"}</td>
                <td className="px-4 py-2">{d.email || "-"}</td>
                <td className="px-4 py-2">{d._count?.orders ?? 0}</td>
                <td className="px-4 py-2">
                  <div className="flex gap-2">
                    <button onClick={() => viewOrders(d.id)} className="text-[#25497f] hover:underline text-xs">Siparisler</button>
                    <button onClick={() => openEdit(d)} className="text-[#25497f] hover:underline text-xs">Duzenle</button>
                    <button onClick={() => handleDelete(d.id)} className="text-red-500 hover:underline text-xs">Sil</button>
                  </div>
                </td>
              </tr>
            ))}
            {dealers.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">Henuz bayi yok.</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Dealer Orders Modal */}
      {selectedDealer && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
            <h2 className="text-lg font-semibold mb-4">Bayi Siparisleri</h2>
            {dealerOrders.length === 0 ? (
              <p className="text-gray-500">Siparis yok.</p>
            ) : (
              <table className="w-full text-sm">
                <thead><tr className="border-b text-left text-gray-500"><th className="pb-2">ID</th><th className="pb-2">Tutar</th><th className="pb-2">Durum</th><th className="pb-2">Tarih</th></tr></thead>
                <tbody>
                  {dealerOrders.map((o) => (
                    <tr key={o.id} className="border-b"><td className="py-1 font-mono text-xs">{o.id.slice(0, 8)}</td><td className="py-1">${o.totalUsd}</td><td className="py-1">{o.status}</td><td className="py-1">{new Date(o.createdAt).toLocaleDateString("tr-TR")}</td></tr>
                  ))}
                </tbody>
              </table>
            )}
            <button onClick={() => setSelectedDealer(null)} className="mt-4 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50">Kapat</button>
          </div>
        </div>
      )}

      {/* New/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
            <h2 className="text-lg font-semibold mb-4">{editingId ? "Bayi Duzenle" : "Yeni Bayi"}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Ad *</label><input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#25497f] outline-none" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Firma</label><input value={form.company} onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#25497f] outline-none" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label><input value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#25497f] outline-none" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label><input value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#25497f] outline-none" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Notlar</label><textarea value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} rows={3} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#25497f] outline-none" /></div>
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
