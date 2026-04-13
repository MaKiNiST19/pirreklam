"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { formatPrice, convertToTry } from "@/lib/price";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, getCartTotal } =
    useCart();
  const [exchangeRate, setExchangeRate] = useState<number>(38.5);
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [step, setStep] = useState<"cart" | "contact">("cart");
  const [contact, setContact] = useState({
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    notes: "",
  });

  useEffect(() => {
    fetch("/api/exchange-rate")
      .then((r) => r.json())
      .then((d) => {
        if (d.rate) setExchangeRate(d.rate);
      })
      .catch(() => {});
  }, []);

  const handleOrder = async () => {
    if (!contact.contactName || !contact.contactPhone) {
      alert("Lütfen ad soyad ve telefon bilgilerinizi giriniz.");
      return;
    }
    setSubmitting(true);
    try {
      const totalUsd = getCartTotal();
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          totalUsd,
          contactName: contact.contactName,
          contactPhone: contact.contactPhone,
          contactEmail: contact.contactEmail || null,
          notes: contact.notes || null,
          items: items.map((i) => ({
            productId: String(i.productId),
            sku: i.sku,
            title: i.title,
            baskiOption: i.baskiOption || null,
            renkOption: i.renkOption || null,
            desenOption: i.desenOption || null,
            adet: i.adet || 0,
            priceUsd: i.priceUsd,
          })),
        }),
      });
      if (res.ok) {
        setOrderSuccess(true);
        clearCart();
      } else {
        alert("Sipariş oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.");
      }
    } catch {
      alert("Sipariş oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Siparişiniz Alındı!</h1>
          <p className="text-gray-600 mb-6">
            Siparişiniz başarıyla oluşturuldu. En kısa sürede sizinle iletişime geçeceğiz.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/banka-hesaplari/"
              className="inline-block px-6 py-3 rounded-lg text-white font-semibold"
              style={{ backgroundColor: "#cc0636" }}
            >
              Banka Hesapları
            </Link>
            <Link
              href="/"
              className="inline-block px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold"
            >
              Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Sepetiniz Boş</h1>
          <p className="text-gray-500 mb-6">Sepetinizde henüz ürün bulunmamaktadır.</p>
          <Link
            href="/"
            className="inline-block px-6 py-3 rounded-lg text-white font-semibold"
            style={{ backgroundColor: "#cc0636" }}
          >
            Alışverişe Devam Et
          </Link>
        </div>
      </div>
    );
  }

  const totalUsd = getCartTotal();
  const totalTry = convertToTry(totalUsd, exchangeRate);

  // Contact info step
  if (step === "contact") {
    return (
      <div className="container mx-auto px-4 py-8 max-w-lg">
        <button
          onClick={() => setStep("cart")}
          className="text-sm text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-1"
        >
          ← Sepete Dön
        </button>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">İletişim Bilgileri</h1>

        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ad Soyad <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={contact.contactName}
              onChange={(e) => setContact((p) => ({ ...p, contactName: e.target.value }))}
              placeholder="Ad Soyad"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25497f] outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telefon <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={contact.contactPhone}
              onChange={(e) => setContact((p) => ({ ...p, contactPhone: e.target.value }))}
              placeholder="05XX XXX XX XX"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25497f] outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
            <input
              type="email"
              value={contact.contactEmail}
              onChange={(e) => setContact((p) => ({ ...p, contactEmail: e.target.value }))}
              placeholder="ornek@mail.com"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25497f] outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sipariş Notu</label>
            <textarea
              value={contact.notes}
              onChange={(e) => setContact((p) => ({ ...p, notes: e.target.value }))}
              placeholder="Varsa eklemek istediğiniz notlar..."
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25497f] outline-none"
            />
          </div>

          <div className="bg-gray-50 rounded-lg p-4 space-y-1 text-sm">
            <p className="text-gray-600">{items.length} ürün</p>
            <p className="text-lg font-bold text-gray-900">
              Toplam: {formatPrice(totalTry)}
              <span className="text-xs text-gray-500 font-normal ml-1">KDV hariç</span>
            </p>
          </div>

          <button
            onClick={handleOrder}
            disabled={submitting || !contact.contactName || !contact.contactPhone}
            className="w-full py-3 rounded-lg text-white font-semibold text-lg disabled:opacity-50 transition-colors"
            style={{ backgroundColor: "#cc0636" }}
          >
            {submitting ? "Gönderiliyor..." : "Siparişi Tamamla"}
          </button>
        </div>
      </div>
    );
  }

  // Cart view
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Sepetim</h1>

      <div className="space-y-4">
        {items.map((item) => {
          const lineTry = convertToTry(item.priceUsd * item.quantity, exchangeRate);
          return (
            <div
              key={item.sku}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white rounded-xl p-4 shadow"
            >
              <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={item.image || "/placeholder.png"}
                  alt={item.title}
                  fill
                  className="object-contain"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{item.title}</h3>
                <div className="text-sm text-gray-500 space-x-2">
                  {item.baskiOption && <span>Baskı: {item.baskiOption}</span>}
                  {item.renkOption && <span>Renk: {item.renkOption}</span>}
                  {item.desenOption && <span>Desen: {item.desenOption}</span>}
                  {item.adet && <span>Adet: {item.adet}</span>}
                </div>
                <p className="text-xs text-gray-400 mt-1">SKU: {item.sku}</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center border rounded">
                  <button
                    onClick={() => updateQuantity(item.sku, item.quantity - 1)}
                    className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-sm font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.sku, item.quantity + 1)}
                    className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>

                <span className="text-sm font-semibold text-gray-900 w-24 text-right">
                  {formatPrice(lineTry)}
                </span>

                <button
                  onClick={() => removeFromCart(item.sku)}
                  className="text-red-500 hover:text-red-700 p-1"
                  aria-label="Ürün kaldır"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-xl p-6 shadow">
        <div>
          <p className="text-lg font-bold text-gray-900">Toplam: {formatPrice(totalTry)}</p>
          <p className="text-xs text-gray-500">KDV hariç</p>
        </div>
        <button
          onClick={() => setStep("contact")}
          className="px-8 py-3 rounded-lg text-white font-semibold text-lg"
          style={{ backgroundColor: "#cc0636" }}
        >
          Siparişe Devam Et
        </button>
      </div>
    </div>
  );
}
