import Link from "next/link";
import Image from "next/image";

const popularProducts = [
  { name: "Ruhsat Kabı", href: "/urun-kategori/plastik-urunler/ruhsat-kabi/" },
  { name: "Plakalık", href: "/urun-kategori/plastik-urunler/plakalik/" },
  { name: "Pasaport Kılıfı", href: "/urun-kategori/plastik-urunler/pasaport-kilifi/" },
  { name: "Vesikalık Kabı", href: "/urun-kategori/plastik-urunler/vesikalik-kabi/" },
  { name: "Kredi Kartlık", href: "/urun-kategori/plastik-urunler/kredi-kartlik/" },
  { name: "Döviz Kabı", href: "/urun-kategori/plastik-urunler/doviz-kabi/" },
  { name: "Evlilik Cüzdanı Kılıfı", href: "/urun-kategori/plastik-urunler/evlilik-cuzdani-kilifi/" },
  { name: "Veteriner Aşı Karnesi Kabı", href: "/urun-kategori/plastik-urunler/veteriner-asi-karnesi-kabi/" },
  { name: "Anahtarlık", href: "/urun-kategori/promosyon-urunler/anahtarlik/" },
  { name: "Çakmak", href: "/urun-kategori/promosyon-urunler/cakmak/" },
];

const kurumsalLinks = [
  { name: "Anasayfa", href: "/" },
  { name: "Kurumsal", href: "/kurumsal/" },
  { name: "İletişim", href: "/iletisim/" },
  { name: "Banka Hesapları", href: "/banka-hesaplari/" },
];

const musteriLinks = [
  { name: "Üyelik Sözleşmesi", href: "/uyelik-sozlesmesi/" },
  { name: "Gizlilik Sözleşmesi", href: "/gizlilik-sozlesmesi/" },
  { name: "Kullanım Koşulları", href: "/kullanim-kosullari/" },
  { name: "Mesafeli Satış Sözleşmesi", href: "/mesafeli-satis-sozlesmesi/" },
  { name: "KVKK Aydınlatma Metni", href: "/kvkk-aydinlatma-metni/" },
];

const socialLinks = [
  {
    name: "Facebook",
    href: "http://www.facebook.com/pirreklampromosyon",
    icon: (
      <svg className="w-[14px] h-[14px]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "http://www.instagram.com/pirreklampromosyon",
    icon: (
      <svg className="w-[14px] h-[14px]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/pirreklampromosyon",
    icon: (
      <svg className="w-[14px] h-[14px]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: "Pinterest",
    href: "https://tr.pinterest.com/pirreklampromosyon/",
    icon: (
      <svg className="w-[14px] h-[14px]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.017 24c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641 0 12.017 0z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@pirreklampromosyon",
    icon: (
      <svg className="w-[14px] h-[14px]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.546 12 3.546 12 3.546s-7.505 0-9.377.504A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.504 9.376.504 9.376.504s7.505 0 9.377-.504a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    name: "WhatsApp",
    href: "https://wa.me/905442338003",
    icon: (
      <svg className="w-[14px] h-[14px]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer style={{ background: "#3a3a3a" }} className="mt-auto text-white">
      <div className="max-w-[1320px] mx-auto px-4 pt-10 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">

          {/* Col 1: Popüler Ürünler */}
          <div>
            <h3 className="text-[13px] font-bold text-white uppercase tracking-wider mb-4">
              Popüler Ürünler
            </h3>
            <ul className="space-y-2">
              {popularProducts.map((p) => (
                <li key={p.href}>
                  <Link
                    href={p.href}
                    className="text-[13px] text-gray-300 hover:text-white transition-colors"
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 2: Kurumsal */}
          <div>
            <h3 className="text-[13px] font-bold text-white uppercase tracking-wider mb-4">
              Kurumsal
            </h3>
            <ul className="space-y-2">
              {kurumsalLinks.map((p) => (
                <li key={p.href}>
                  <Link
                    href={p.href}
                    className="text-[13px] text-gray-300 hover:text-white transition-colors"
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Müşteri Hizmetleri */}
          <div>
            <h3 className="text-[13px] font-bold text-white uppercase tracking-wider mb-4">
              Müşteri Hizmetleri
            </h3>
            <ul className="space-y-2">
              {musteriLinks.map((p) => (
                <li key={p.href}>
                  <Link
                    href={p.href}
                    className="text-[13px] text-gray-300 hover:text-white transition-colors"
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: ETBİS */}
          <div className="flex flex-col items-center sm:items-start">
            <a
              href="https://www.eticaret.gov.tr/siteler/sorgulasiteler/pirreklam.com.tr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
              aria-label="ETBİS'e Kayıtlıdır"
            >
              <Image
                src="/etbis.webp"
                alt="ETBİS'e Kayıtlıdır"
                width={110}
                height={130}
                className="h-auto w-[110px] object-contain"
              />
            </a>
          </div>

          {/* Col 5: Social */}
          <div>
            <h3 className="text-[13px] font-semibold text-white mb-2">
              Bizi Sosyal Medyada Takip Edin
            </h3>
            <p className="text-[14px] font-semibold mb-3" style={{ color: "#cc0636" }}>
              pirreklampromosyon
            </p>
            <div className="flex items-center gap-1.5 flex-wrap mb-4">
              {socialLinks.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="w-[28px] h-[28px] rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  {s.icon}
                </a>
              ))}
            </div>
            <a
              href="https://g.page/pirreklam/review"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 text-[12px] font-bold uppercase tracking-wide transition-colors"
              style={{
                border: "1px solid #cc0636",
                color: "#cc0636",
                borderRadius: "2px",
                letterSpacing: "0.5px",
              }}
            >
              YORUM YAPABİLİRSİNİZ
            </a>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="max-w-[1320px] mx-auto px-4 py-5 text-center">
          <p className="text-[13px] text-gray-300">
            1961 & {new Date().getFullYear()} <strong className="text-white font-bold">Pir Reklam Ltd. Şti.</strong> Tüm Hakları Saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}
