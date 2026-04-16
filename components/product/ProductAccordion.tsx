"use client";

import { useState, type ReactNode } from "react";

interface AccordionItemProps {
  icon?: ReactNode;
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

function AccordionItem({ icon, title, defaultOpen = false, children }: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center gap-1.5 py-1.5 px-2 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="inline-flex items-center justify-center w-4 h-4 text-[#25497f] shrink-0">
          {open ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="w-3 h-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="w-3 h-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12M6 12h12" />
            </svg>
          )}
        </span>
        {icon && <span className="text-[#25497f] shrink-0">{icon}</span>}
        <h3 className="text-[13px] font-semibold text-gray-800 flex-1">{title}</h3>
      </button>
      {open && (
        <div className="pb-2.5 px-6 text-[12px] text-gray-700 leading-snug">{children}</div>
      )}
    </div>
  );
}

export default function ProductAccordion() {
  return (
    <div className="rounded-lg bg-white border border-gray-200 divide-y divide-gray-100">
      <AccordionItem title="Baskı Seçenekleri Açıklaması">
        <ul className="space-y-1.5">
          <li>
            – Gofre kabartmalı ürünlerde <strong>ilk siparişinizde</strong> toplam bakiyeye{" "}
            <strong>bir sefere mahsus metal klişe bedeli 1300 ₺ ilave edilir,</strong> sonraki siparişlerde
            klişe üzerinde bir <strong>değişiklik, revize yoksa bu ücret talep edilmez.</strong>
          </li>
          <li>
            – Gofre kabartma baskı, ürün üzerinde{" "}
            <strong>reklam logonuzun vs. basılmasını istediğiniz bölgelerin metal klişe ile</strong> uygun
            ısı ve basınçla (Kabartma, Embos, Klişe sıcak baskı){" "}
            <strong>kabartılması ya da ezilmesi</strong> için <strong>yapılan işlemin adıdır.</strong>
          </li>
          <li>
            – Bu modelde <strong>ekonomik modellerden, %20 daha kalın tok ve dayanıklıdır.</strong> En çok
            tercih edilen üründür.
          </li>
          <li>
            – Görsel olarak{" "}
            <strong>mat biala nubuk görünümlü süngerimsi yumuşak dokuya sahiptir.</strong>
          </li>
          <li>
            – Gofre kabartma baskı{" "}
            <strong>görsel olarak ürünün kalitesini arttırır ve kalıcıdır.</strong>
          </li>
        </ul>
      </AccordionItem>

      <AccordionItem title="Genel Sipariş Detayları">
        <ul className="space-y-1.5">
          <li>
            – Sepet dışındaki sipariş aşamasında; grafik çalışmasından önce, minimum{" "}
            <strong>%30 ön ödeme alınır.</strong>
          </li>
          <li>
            – Siparişinizin hazır olduğunu belgeleyen video gönderilir,{" "}
            <strong>kalan bakiye tahsil sonrası sevk edilir.</strong>
          </li>
          <li>
            – Siparişin hazırlanması süreci; <strong>grafik onayından sonra</strong>, serigrafi boya baskılı
            ürünlerde <strong>7 gün</strong>, gofre kabartmalı ürünlerde <strong>15 gündür.</strong>
          </li>
          <li>
            – Ürün, desen ve renk tonlarında ± <strong>%10 farklılıklar olabilir.</strong>
          </li>
          <li>– <strong>Kargo ücreti müşteriye aittir.</strong></li>
          <li>
            – Fiyatlarımıza <strong>%20 KDV dahil değildir.</strong>
          </li>
        </ul>
      </AccordionItem>

      <AccordionItem
        title="Ürün Tanıtım Videosu"
        icon={
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        }
      >
        <a
          href="https://www.youtube.com/watch?v=Ov0Swhez-r8"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#cc0636] hover:underline font-medium"
        >
          Ürün Tanıtım Videomuz
        </a>
      </AccordionItem>

      <AccordionItem
        title="Yorum Yapabilirsiniz!"
        icon={
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        }
      >
        <a
          href="https://search.google.com/local/writereview?placeid=ChIJFyzBiP7fuxQRQMOL7OE4N6w"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#cc0636] hover:underline font-medium"
        >
          Google İşletmemiz hakkında olumlu yorumlarınızı bekliyoruz.
        </a>
      </AccordionItem>
    </div>
  );
}
