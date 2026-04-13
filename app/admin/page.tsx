"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface DashboardData {
  totalProducts: number;
  totalCategories: number;
  totalOrders: number;
  totalDealers: number;
  recentOrders: Array<{
    id: string;
    contactName: string | null;
    totalUsd: string;
    status: string;
    createdAt: string;
    _count?: { items: number };
  }>;
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [productsData, categories, ordersData, dealersData] = await Promise.all([
          fetch("/api/products?limit=1").then((r) => r.json()),
          fetch("/api/categories").then((r) => r.json()),
          fetch("/api/orders?limit=5").then((r) => r.json()),
          fetch("/api/dealers").then((r) => r.json()),
        ]);
        // Products API: { products, total, page, totalPages }
        const totalProducts = productsData?.total ?? (Array.isArray(productsData) ? productsData.length : 0);
        const totalCategories = Array.isArray(categories) ? categories.length : 0;
        const ordersArr = Array.isArray(ordersData) ? ordersData : (ordersData?.orders || []);
        const totalOrders = ordersData?.total ?? ordersArr.length;
        const dealersArr = Array.isArray(dealersData) ? dealersData : (dealersData?.dealers || []);
        setData({
          totalProducts,
          totalCategories,
          totalOrders,
          totalDealers: dealersArr.length,
          recentOrders: ordersArr.slice(0, 5),
        });
      } catch {
        setData({
          totalProducts: 0,
          totalCategories: 0,
          totalOrders: 0,
          totalDealers: 0,
          recentOrders: [],
        });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#25497f]" />
      </div>
    );

  const cards = [
    { label: "Toplam Urun", value: data?.totalProducts ?? 0, href: "/admin/urunler", color: "bg-blue-500" },
    { label: "Kategoriler", value: data?.totalCategories ?? 0, href: "/admin/kategoriler", color: "bg-green-500" },
    { label: "Siparisler", value: data?.totalOrders ?? 0, href: "/admin/siparisler", color: "bg-orange-500" },
    { label: "Bayiler", value: data?.totalDealers ?? 0, href: "/admin/bayiler", color: "bg-purple-500" },
  ];

  const statusLabels: Record<string, string> = {
    PENDING: "Bekliyor",
    CONFIRMED: "Onaylandi",
    SHIPPED: "Kargoda",
    COMPLETED: "Tamamlandi",
    CANCELLED: "Iptal",
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="bg-white rounded-xl shadow p-6 hover:shadow-md transition-shadow"
          >
            <div className={`w-10 h-10 ${card.color} rounded-lg flex items-center justify-center text-white text-lg font-bold mb-3`}>
              {card.value}
            </div>
            <p className="text-gray-600 text-sm">{card.label}</p>
            <p className="text-2xl font-bold text-gray-800">{card.value}</p>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Son Siparisler</h2>
        {data?.recentOrders.length === 0 ? (
          <p className="text-gray-500">Henuz siparis yok.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="pb-2">Siparis No</th>
                  <th className="pb-2">Kisi</th>
                  <th className="pb-2">Tutar (USD)</th>
                  <th className="pb-2">Durum</th>
                  <th className="pb-2">Tarih</th>
                </tr>
              </thead>
              <tbody>
                {data?.recentOrders.map((order) => (
                  <tr key={order.id} className="border-b last:border-0">
                    <td className="py-2 font-mono text-xs">{order.id.slice(0, 8)}</td>
                    <td className="py-2">{order.contactName || "-"}</td>
                    <td className="py-2">${order.totalUsd}</td>
                    <td className="py-2">
                      <span className="px-2 py-1 rounded-full text-xs bg-gray-100">
                        {statusLabels[order.status] || order.status}
                      </span>
                    </td>
                    <td className="py-2 text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString("tr-TR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Hizli Islemler</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/urunler/yeni" className="px-4 py-2 bg-[#cc0636] text-white rounded-lg text-sm hover:bg-[#a80530] transition-colors">
            Yeni Urun Ekle
          </Link>
          <Link href="/admin/kategoriler" className="px-4 py-2 bg-[#25497f] text-white rounded-lg text-sm hover:bg-[#1d3a66] transition-colors">
            Kategorileri Duzenle
          </Link>
          <Link href="/admin/sliderlar" className="px-4 py-2 bg-[#25497f] text-white rounded-lg text-sm hover:bg-[#1d3a66] transition-colors">
            Slider Yonet
          </Link>
          <Link href="/admin/sirket-bilgileri" className="px-4 py-2 bg-[#25497f] text-white rounded-lg text-sm hover:bg-[#1d3a66] transition-colors">
            Firma Bilgileri
          </Link>
        </div>
      </div>
    </div>
  );
}
