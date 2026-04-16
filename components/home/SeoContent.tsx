"use client";

import { useState } from "react";

export default function SeoContent() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="bg-white">
      <div className="max-w-[1200px] mx-auto px-4 py-8 md:py-10">
        <div
          id="seo-content"
          className={`relative overflow-hidden transition-[max-height] duration-500 ease-in-out ${
            expanded ? "max-h-[8000px]" : "max-h-[180px]"
          }`}
        >
          <div className="prose prose-sm md:prose-base max-w-none text-gray-700 leading-relaxed [&_h1]:text-[22px] md:[&_h1]:text-[26px] [&_h1]:font-bold [&_h1]:text-[#25497f] [&_h1]:mb-4 [&_h2]:text-[18px] md:[&_h2]:text-[20px] [&_h2]:font-bold [&_h2]:text-[#25497f] [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:text-[15px] md:[&_h3]:text-[17px] [&_h3]:font-semibold [&_h3]:text-[#cc0636] [&_h3]:mt-4 [&_h3]:mb-2 [&_p]:mb-3 [&_p]:text-[14px] [&_ul]:mb-3 [&_ul]:ml-5 [&_ul]:list-disc [&_ol]:mb-3 [&_ol]:ml-5 [&_ol]:list-decimal [&_li]:mb-1 [&_li]:text-[14px] [&_strong]:text-gray-900">
            <h1>Pir Reklam | Ruhsat Kabı, Vesikalık Kabı ve Promosyon Ürünlerinde Toptan Üretici</h1>

            <p>
              Pir Reklam, Türkiye genelinde <strong>ruhsat kabı, vesikalık kabı, poliçe kabı, döviz kabı</strong> ve özel promosyon ürünleri üretiminde uzmanlaşmış bir üreticidir. Sigorta acentelerinden oto galerilere, fotoğraf stüdyolarından döviz bürolarına kadar farklı sektörlerin ihtiyaçlarına yönelik <strong>toptan sipariş, uygun fiyat ve özel üretim çözümleri</strong> sunar.
            </p>

            <h2>Ruhsat Kabı Nedir ve Neden Kullanılır?</h2>
            <p>
              <strong>Ruhsat kabı</strong>, araç sahiplerinin ruhsat belgelerini düzenli, güvenli ve uzun ömürlü şekilde saklamasını sağlayan özel bir promosyon ürünüdür. Özellikle sigorta acenteleri, oto galeriler ve rent a car firmaları için hem kurumsal kimlik hem de müşteri sadakati açısından vazgeçilmez bir araçtır.
            </p>

            <ul>
              <li>Dayanıklı PVC ve deri görünümlü malzeme</li>
              <li>Kurumsal logo baskı imkanı</li>
              <li>Toptan üretim ve hızlı teslimat</li>
              <li>Uygun fiyatlı promosyon çözümü</li>
            </ul>

            <h2>En Çok Tercih Edilen Promosyon Ürünlerimiz</h2>

            <h3>Ruhsat Kabı</h3>
            <p>
              En çok tercih edilen ürünlerimizden biri olan <strong>ruhsat kabı</strong>, özellikle oto galeriler ve sigorta firmaları için yüksek hacimli toptan siparişlerde avantajlı fiyatlarla sunulmaktadır.
            </p>

            <h3>Vesikalık Kabı</h3>
            <p>
              <strong>Vesikalık kabı</strong>, fotoğraf stüdyoları için müşteriye teslim edilen baskıların korunmasını sağlar ve marka görünürlüğünü artırır.
            </p>

            <h3>Poliçe Kabı</h3>
            <p>
              <strong>Poliçe kabı</strong>, sigorta belgelerinin düzenli şekilde sunulmasını sağlar ve müşteri güvenini artırır.
            </p>

            <h3>Döviz Kabı</h3>
            <p>
              <strong>Döviz kabı</strong>, döviz büroları ve finans sektöründe hem düzen hem de kurumsal prestij için tercih edilir.
            </p>

            <h2>Toptan Sipariş ve Üretim Sürecimiz</h2>
            <p>
              Pir Reklam olarak üretim sürecimizi tamamen müşteri odaklı planlıyoruz. Toptan siparişlerinizde minimum adetlerden başlayarak yüksek hacimli üretimlere kadar esnek çözümler sunuyoruz.
            </p>

            <ol>
              <li>İhtiyaç analizi ve ürün seçimi</li>
              <li>Logo ve baskı tasarımı</li>
              <li>Numune onayı</li>
              <li>Seri üretim</li>
              <li>Hızlı teslimat</li>
            </ol>

            <h2>Neden Pir Reklam En İyi Üretici?</h2>
            <ul>
              <li>Yüksek kalite üretim standartları</li>
              <li>Rekabetçi fiyat politikası</li>
              <li>Sektöre özel çözümler</li>
              <li>Uzun yıllara dayanan üretim deneyimi</li>
              <li>Türkiye geneline hızlı sevkiyat</li>
            </ul>

            <h2>Sektörlere Özel Promosyon Çözümleri</h2>

            <h3>Sigorta Acenteleri ve Oto Galeriler</h3>
            <p>
              Ruhsat kabı ve poliçe kabı çözümlerimiz ile müşterilerinize profesyonel bir teslim deneyimi sunabilirsiniz.
            </p>

            <h3>Turizm ve Seyahat Acenteleri</h3>
            <p>
              Pasaport kılıfı ve belge koruyucu ürünler ile markanızı müşterilerinizle birlikte seyahate çıkarın.
            </p>

            <h3>Fotoğraf Stüdyoları</h3>
            <p>
              Vesikalık kabı ve fotoğraf kabı çözümleri ile müşterilerinize kaliteli bir sunum sağlayın.
            </p>

            <h3>Döviz Büroları ve Kuyumcular</h3>
            <p>
              Döviz kabı ve özel promosyon ürünleri ile kurumsal prestijinizi güçlendirin.
            </p>

            <h2>Ruhsat Kabı Fiyatları ve Toptan Sipariş Bilgisi</h2>
            <p>
              <strong>Ruhsat kabı fiyatları</strong>, sipariş adedi, baskı türü ve malzeme kalitesine göre değişiklik göstermektedir. Toptan siparişleriniz için en uygun fiyat teklifini almak için bizimle iletişime geçebilirsiniz.
            </p>

            <h2>Sonuç: Promosyon Ürünlerinde Doğru Adres</h2>
            <p>
              Pir Reklam, promosyon ürünleri üretiminde kalite, uygun fiyat ve hızlı teslimat avantajlarını bir araya getirerek işletmenizin ihtiyaçlarına özel çözümler sunar. <strong>Ruhsat kabı, vesikalık kabı ve diğer promosyon ürünlerinde</strong> güvenilir üretici arıyorsanız doğru yerdesiniz.
            </p>
          </div>

          {/* Fade overlay when collapsed */}
          {!expanded && (
            <div
              className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 90%)",
              }}
            />
          )}
        </div>

        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="inline-flex items-center gap-2 px-5 py-2 text-[13px] font-semibold uppercase tracking-wide transition-colors"
            style={{
              border: "1px solid #cc0636",
              color: "#cc0636",
              borderRadius: "2px",
            }}
          >
            {expanded ? "Daha Az Göster" : "Devamını Oku"}
            <svg
              className={`w-3.5 h-3.5 transition-transform ${expanded ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
