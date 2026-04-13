"use client";

import { useState, useEffect, useCallback } from "react";

interface OrderItem {
  id: string;
  title: string;
  sku: string;
  baskiOption: string | null;
  renkOption: string | null;
  desenOption: string | null;
  adet: number;
  priceUsd: string;
}

interface Order {
  id: string;
  contactName: string | null;
  contactPhone: string | null;
  contactEmail: string | null;
  totalUsd: string;
  status: string;
  notes: string | null;
  createdAt: string;
  items?: OrderItem[];
  dealer?: { name: string; company: string | null } | null;
  _count?: { items: number };
}

const statusLabels: Record<string, string> = {
  PENDING: "Bekliyor",
  CONFIRMED: "Onaylandi",
  SHIPPED: "Kargoda",
  COMPLETED: "Tamamlandi",
  CANCELLED: "Iptal",
};

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-purple-100 text-purple-700",
  COMPLETED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

const tabs = [
  { key: "", label: "Tumu" },
  { key: "PENDING", label: "Bekliyor" },
  { key: "CONFIRMED", label: "Onaylandi" },
  { key: "COMPLETED", label: "Tamamlandi" },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch { setOrders([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = filter ? orders.filter((o) => o.status === filter) : orders;

  async function viewDetail(orderId: string) {
    setDetailLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      const data = await res.json();
      setSelectedOrder(data);
    } catch { alert("Siparis detayi yuklenemedi."); }
    finally { setDetailLoading(false); }
  }

  async function updateStatus(orderId: string, status: string) {
    await fetch(`/api/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
    if (selectedOrder?.id === orderId) {
      setSelectedOrder((prev) => prev ? { ...prev, status } : null);
    }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#25497f]" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Siparisler</h1>

      <div className="flex gap-2 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === tab.key ? "bg-[#25497f] text-white" : "bg-white text-gray-600 border hover:bg-gray-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500 bg-gray-50">
              <th className="px-4 py-3">Siparis No</th>
              <th className="px-4 py-3">Tarih</th>
              <th className="px-4 py-3">Kisi</th>
              <th className="px-4 py-3">Kalem</th>
              <th className="px-4 py-3">Toplam (USD)</th>
              <th className="px-4 py-3">Durum</th>
              <th className="px-4 py-3 w-40">Islem</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => (
              <tr key={order.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="px-4 py-2 font-mono text-xs">{order.id.slice(0, 8)}</td>
                <td className="px-4 py-2 text-gray-500">{new Date(order.createdAt).toLocaleDateString("tr-TR")}</td>
                <td className="px-4 py-2">{order.contactName || "-"}</td>
                <td className="px-4 py-2">{order._count?.items ?? order.items?.length ?? 0}</td>
                <td className="px-4 py-2 font-medium">${order.totalUsd}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${statusColors[order.status] || "bg-gray-100"}`}>
                    {statusLabels[order.status] || order.status}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <div className="flex gap-2 items-center">
                    <button onClick={() => viewDetail(order.id)} className="text-[#25497f] hover:underline text-xs">Detay</button>
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className="text-xs border rounded px-1 py-0.5"
                    >
                      {Object.entries(statusLabels).map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                      ))}
                    </select>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-500">Siparis bulunamadi.</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {(selectedOrder || detailLoading) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            {detailLoading ? (
              <div className="flex items-center justify-center h-32"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#25497f]" /></div>
            ) : selectedOrder && (
              <>
                <h2 className="text-lg font-semibold mb-4">Siparis Detayi</h2>
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div><span className="text-gray-500">Siparis No:</span> <span className="font-mono">{selectedOrder.id.slice(0, 8)}</span></div>
                  <div><span className="text-gray-500">Tarih:</span> {new Date(selectedOrder.createdAt).toLocaleDateString("tr-TR")}</div>
                  <div><span className="text-gray-500">Kisi:</span> {selectedOrder.contactName || "-"}</div>
                  <div><span className="text-gray-500">Telefon:</span> {selectedOrder.contactPhone || "-"}</div>
                  <div><span className="text-gray-500">E-posta:</span> {selectedOrder.contactEmail || "-"}</div>
                  <div><span className="text-gray-500">Toplam:</span> <span className="font-bold">${selectedOrder.totalUsd}</span></div>
                  <div><span className="text-gray-500">Durum:</span> <span className={`px-2 py-1 rounded-full text-xs ${statusColors[selectedOrder.status]}`}>{statusLabels[selectedOrder.status]}</span></div>
                  {selectedOrder.dealer && <div><span className="text-gray-500">Bayi:</span> {selectedOrder.dealer.name}</div>}
                </div>
                {selectedOrder.notes && <p className="text-sm text-gray-500 mb-4">Not: {selectedOrder.notes}</p>}
                <h3 className="font-medium mb-2">Urunler</h3>
                <table className="w-full text-sm">
                  <thead><tr className="border-b text-left text-gray-500"><th className="pb-2">Urun</th><th className="pb-2">SKU</th><th className="pb-2">Baski</th><th className="pb-2">Renk</th><th className="pb-2">Adet</th><th className="pb-2">Fiyat</th></tr></thead>
                  <tbody>
                    {selectedOrder.items?.map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="py-1">{item.title}</td>
                        <td className="py-1 font-mono text-xs">{item.sku}</td>
                        <td className="py-1">{item.baskiOption || "-"}</td>
                        <td className="py-1">{item.renkOption || "-"}</td>
                        <td className="py-1">{item.adet}</td>
                        <td className="py-1">${item.priceUsd}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
            <button onClick={() => setSelectedOrder(null)} className="mt-4 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50">Kapat</button>
          </div>
        </div>
      )}
    </div>
  );
}
