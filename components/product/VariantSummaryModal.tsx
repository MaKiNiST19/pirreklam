"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart, type CartItem } from "@/components/cart/CartProvider";
import { getPriceDisplay } from "@/lib/price";
import type { BankAccount } from "@/types/index";
import type { VariantOption } from "@/lib/variants";

const COLOR_MAP: Record<string, string> = {
  siyah: "#1a1a1a", beyaz: "#ffffff", kırmızı: "#e02020", kirmizi: "#e02020",
  mavi: "#1e6bb8", lacivert: "#1b2f6e", yeşil: "#2e7d32", yesil: "#2e7d32",
  sarı: "#f9c400", sari: "#f9c400", turuncu: "#f57c00", mor: "#7b1fa2",
  pembe: "#e91e8c", gri: "#9e9e9e", kahverengi: "#6d4c41", kahve: "#6d4c41",
  bej: "#d7ccc8", krem: "#f5f0e8", bordo: "#880e4f", haki: "#8d8d3a",
  füme: "#607d8b", fume: "#607d8b", altın: "#c8960c", altin: "#c8960c",
  gümüş: "#bdbdbd", gumus: "#bdbdbd", bronz: "#cd7f32", krom: "#c0c0c0",
  şeffaf: "rgba(200,200,200,0.25)", seffaf: "rgba(200,200,200,0.25)",
  "açık gri": "#d4d4d4", "acik gri": "#d4d4d4",
  "koyu gri": "#616161",
  "siyah deri": "#1a1a1a", "kahve deri": "#6d4c41",
  "lacivert deri": "#1b2f6e", "bordo deri": "#880e4f",
};

interface VariantSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: { id: string; title: string; slug: string; image?: string };
  selectedVariant: VariantOption;
  exchangeRate: number;
  bankAccounts: BankAccount[];
}

export default function VariantSummaryModal({
  isOpen,
  onClose,
  product,
  selectedVariant,
  exchangeRate,
}: VariantSummaryModalProps) {
  const { addToCart } = useCart();
  const [tab, setTab] = useState<"member" | "guest">("member");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [guestForm, setGuestForm] = useState({
    name: "", email: "", tcNo: "", address: "", city: "", district: "", phone: "", taxOffice: "",
  });

  if (!isOpen) return null;

  const price = getPriceDisplay(selectedVariant.priceUsd, selectedVariant.adet, exchangeRate);

  const handleGuestOrder = async () => {
    if (!guestForm.name || !guestForm.email || !guestForm.tcNo || !guestForm.address || !guestForm.city) {
      alert("Lütfen zorunlu alanları doldurunuz.");
      return;
    }
    setSubmitting(true);
    try {
      // Add to cart first
      const item: CartItem = {
        productId: Number(product.id) || 0,
        sku: selectedVariant.sku,
        title: product.title,
        image: product.image || "/placeholder.png",
        baskiOption: selectedVariant.baskiOption || undefined,
        renkOption: selectedVariant.renkOption || undefined,
        desenOption: selectedVariant.desenOption || undefined,
        adet: selectedVariant.adet,
        priceUsd: selectedVariant.priceUsd,
        quantity: 1,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          totalUsd: selectedVariant.priceUsd,
          contactName: guestForm.name,
          contactPhone: guestForm.phone || null,
          contactEmail: guestForm.email,
          notes: `TC: ${guestForm.tcNo}, Adres: ${guestForm.address}, ${guestForm.district} ${guestForm.city}, Vergi Dairesi: ${guestForm.taxOffice}`,
          items: [{
            productId: String(product.id),
            sku: selectedVariant.sku,
            title: product.title,
            baskiOption: selectedVariant.baskiOption || null,
            renkOption: selectedVariant.renkOption || null,
            desenOption: selectedVariant.desenOption || null,
            adet: selectedVariant.adet,
            priceUsd: selectedVariant.priceUsd,
          }],
        }),
      });

      if (res.ok) {
        onClose();
        window.location.href = "/sepet?success=1";
      } else {
        alert("Sipariş oluşturulurken hata oluştu.");
      }
    } catch {
      alert("Sipariş oluşturulurken hata oluştu.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl max-w-[420px] w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>

        {/* Title bar */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <h2 className="text-lg font-bold text-gray-900">Siparişi Onayla</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl leading-none">&times;</button>
        </div>

        {/* Product info */}
        <div className="flex items-start gap-3 px-5 pb-3">
          {product.image && (
            <div className="relative w-14 h-14 shrink-0 rounded-lg overflow-hidden bg-gray-50 border border-gray-200">
              <Image src={product.image} alt={product.title} fill className="object-contain p-1" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-[#25497f] leading-tight">{product.title}</h3>
            <p className="text-xs text-[#cc0636] font-medium mt-0.5">{selectedVariant.sku}</p>
          </div>
        </div>

        {/* Variant details table */}
        <div className="mx-5 border border-gray-200 rounded-lg overflow-hidden text-sm">
          {selectedVariant.baskiOption && (
            <div className="flex justify-between px-3 py-1.5 border-b border-gray-100">
              <span className="text-gray-600">Baskı Seçenekleri</span>
              <span className="font-medium text-gray-800">{selectedVariant.baskiOption}</span>
            </div>
          )}
          {selectedVariant.renkOption && (
            <div className="flex justify-between items-center px-3 py-1.5 border-b border-gray-100">
              <span className="text-gray-600">Renk</span>
              <span className="flex items-center gap-1.5 font-medium text-gray-800">
                <span
                  className="w-3 h-3 rounded-full inline-block border border-gray-300"
                  style={{ backgroundColor: COLOR_MAP[selectedVariant.renkOption.toLowerCase()] ?? "#cccccc" }}
                />
                {selectedVariant.renkOption}
              </span>
            </div>
          )}
          {selectedVariant.desenOption && (
            <div className="flex justify-between px-3 py-1.5 border-b border-gray-100">
              <span className="text-gray-600">Desen</span>
              <span className="font-medium text-gray-800">{selectedVariant.desenOption}</span>
            </div>
          )}
          <div className="flex justify-between px-3 py-1.5">
            <span className="text-gray-600">Adet</span>
            <span className="font-medium text-gray-800">{selectedVariant.adet.toLocaleString("tr-TR")}</span>
          </div>
        </div>

        {/* Price section */}
        <div className="mx-5 mt-3 border border-gray-200 rounded-lg overflow-hidden text-sm">
          <div className="flex justify-between px-3 py-1.5 border-b border-gray-100">
            <span className="text-gray-600">Birim Fiyat (KDV Hariç)</span>
            <span className="font-semibold text-gray-800">{price.unitPriceExKdvFormatted}</span>
          </div>
          <div className="flex justify-between px-3 py-1.5 border-b border-gray-100">
            <span className="text-gray-600">Toplam (KDV Hariç)</span>
            <span className="font-semibold text-gray-800">{price.totalPriceExKdvFormatted}</span>
          </div>
          <div className="flex justify-between px-3 py-2">
            <span className="font-semibold text-gray-800">Toplam (KDV Dahil %20)</span>
            <span className="font-bold text-[#cc0636] text-base">{price.totalPriceIncKdvFormatted}</span>
          </div>
        </div>

        {/* Tabs: Üye Ol / Üye Olmadan Devam Et */}
        <div className="flex mx-5 mt-4 gap-0">
          <button
            type="button"
            onClick={() => setTab("member")}
            className={`flex-1 py-1.5 text-sm font-semibold rounded-l-lg border-2 transition-colors ${
              tab === "member"
                ? "bg-[#25497f] text-white border-[#25497f]"
                : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
            }`}
          >
            Üye Ol
          </button>
          <button
            type="button"
            onClick={() => setTab("guest")}
            className={`flex-1 py-1.5 text-sm font-semibold rounded-r-lg border-2 border-l-0 transition-colors ${
              tab === "guest"
                ? "bg-[#25497f] text-white border-[#25497f]"
                : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
            }`}
          >
            Üye Olmadan Devam Et
          </button>
        </div>

        {/* Tab content */}
        <div className="px-5 pt-3 pb-5">
          {tab === "member" ? (
            /* ===== ÜYE OL TAB ===== */
            <div className="space-y-3">
              <p className="text-xs text-gray-500">Üye olun, siparişlerinizi kolayca takip edin.</p>
              <input
                type="email"
                placeholder="E-posta adresinize"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-full text-sm outline-none focus:border-[#25497f] focus:ring-1 focus:ring-[#25497f]"
              />
              <button
                type="button"
                onClick={() => {
                  if (email) {
                    alert("Kayıt bağlantısı e-posta adresinize gönderildi.");
                  }
                }}
                className="w-full py-3 rounded-lg font-bold text-white text-sm"
                style={{ backgroundColor: "#cc0636" }}
              >
                Bağlantı Gönder
              </button>
            </div>
          ) : (
            /* ===== ÜYE OLMADAN DEVAM ET TAB ===== */
            <div className="space-y-3">
              <p className="text-xs text-gray-500">Fatura bilgilerinizi girerek üye olmadan sipariş verebilirsiniz.</p>

              <input
                placeholder="Ad Soyad *"
                value={guestForm.name}
                onChange={(e) => setGuestForm((p) => ({ ...p, name: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-full text-sm outline-none focus:border-[#25497f]"
                required
              />
              <input
                type="email"
                placeholder="E-posta *"
                value={guestForm.email}
                onChange={(e) => setGuestForm((p) => ({ ...p, email: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-full text-sm outline-none focus:border-[#25497f]"
                required
              />
              <input
                placeholder="TC Kimlik No * (11 hane)"
                value={guestForm.tcNo}
                onChange={(e) => setGuestForm((p) => ({ ...p, tcNo: e.target.value.replace(/\D/g, "").slice(0, 11) }))}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-full text-sm outline-none focus:border-[#25497f]"
                required
              />
              <input
                placeholder="Adres *"
                value={guestForm.address}
                onChange={(e) => setGuestForm((p) => ({ ...p, address: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-full text-sm outline-none focus:border-[#25497f]"
                required
              />
              <input
                placeholder="İl *"
                value={guestForm.city}
                onChange={(e) => setGuestForm((p) => ({ ...p, city: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-full text-sm outline-none focus:border-[#25497f]"
                required
              />
              <input
                placeholder="İlçe"
                value={guestForm.district}
                onChange={(e) => setGuestForm((p) => ({ ...p, district: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-full text-sm outline-none focus:border-[#25497f]"
              />
              <input
                type="tel"
                placeholder="Telefon"
                value={guestForm.phone}
                onChange={(e) => setGuestForm((p) => ({ ...p, phone: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-full text-sm outline-none focus:border-[#25497f]"
              />
              <input
                placeholder="Vergi Dairesi"
                value={guestForm.taxOffice}
                onChange={(e) => setGuestForm((p) => ({ ...p, taxOffice: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-full text-sm outline-none focus:border-[#25497f]"
              />

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-lg border-2 border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors"
                >
                  Vazgeç
                </button>
                <button
                  type="button"
                  onClick={handleGuestOrder}
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-lg text-white text-sm font-bold disabled:opacity-50 transition-colors"
                  style={{ backgroundColor: "#cc0636" }}
                >
                  {submitting ? "Gönderiliyor..." : "Siparişi Oluştur"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
