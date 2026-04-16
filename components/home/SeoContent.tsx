"use client";

import { useState } from "react";
import Link from "next/link";

export default function SeoContent() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="bg-white">
      <div className="max-w-[1200px] mx-auto px-4 py-8 md:py-10">
        <div
          id="seo-content"
          className={`relative overflow-hidden transition-[max-height] duration-500 ease-in-out ${
            expanded ? "max-h-[60000px]" : "max-h-[220px]"
          }`}
        >
          <div className="prose prose-sm md:prose-base max-w-none text-gray-700 leading-relaxed [&_h1]:text-[22px] md:[&_h1]:text-[26px] [&_h1]:font-bold [&_h1]:text-[#25497f] [&_h1]:mb-4 [&_h2]:text-[18px] md:[&_h2]:text-[20px] [&_h2]:font-bold [&_h2]:text-[#25497f] [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:text-[15px] md:[&_h3]:text-[17px] [&_h3]:font-semibold [&_h3]:text-[#cc0636] [&_h3]:mt-4 [&_h3]:mb-2 [&_h4]:text-[14px] md:[&_h4]:text-[15px] [&_h4]:font-semibold [&_h4]:text-gray-800 [&_h4]:mt-3 [&_h4]:mb-2 [&_p]:mb-3 [&_p]:text-[14px] [&_ul]:mb-3 [&_ul]:ml-5 [&_ul]:list-disc [&_ol]:mb-3 [&_ol]:ml-5 [&_ol]:list-decimal [&_li]:mb-1 [&_li]:text-[14px] [&_strong]:text-gray-900 [&_a]:text-[#cc0636] [&_a]:underline hover:[&_a]:text-[#a80530]">
            <h1>
              Ruhsat Kabı, Vesikalık Kabı, Döviz Kabı ve Promosyon Ürünleri — Toptan Üretici Rehberi
            </h1>

            {/* ═════ FEATURED SNIPPET ═════ */}
            <div
              className="not-prose my-4 border-l-4 rounded-r-lg p-4"
              style={{
                background: "#f8f9fb",
                borderColor: "#25497f",
              }}
            >
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#25497f] mb-2">
                FEATURED SNIPPET
              </p>
              <p className="text-[14px] text-gray-800 leading-relaxed m-0">
                <strong>Ruhsat kabı</strong>, araç ruhsatı ile sigorta poliçesi ve muayene belgelerini
                düzenli taşımak için üretilen PVC, biala veya deri tabanlı resmî belge kabıdır. Sigorta
                acenteleri, oto galeriler ve rent a car firmaları kurumsal logolu ruhsat kabı, poliçe
                kabı ve plakalık setlerini müşteri teslim paketinin parçası olarak kullanır. <Link href="/kurumsal/">Pir
                Reklam</Link> 1961&apos;den bu yana İstanbul&apos;daki kendi tesisinde biala PVC, suni deri, termo
                deri ve hakiki deri modellerini toptan üretir; 100 adetten başlayan siparişlerle
                Türkiye geneline 7–15 iş günü içinde teslim eder.
              </p>
            </div>

            {/* ═════ AI OVERVIEW OPTIMIZATION BLOCK ═════ */}
            <div
              className="not-prose my-5 rounded-lg p-4 border"
              style={{
                background: "#fff9e6",
                borderColor: "#ffc107",
              }}
            >
              <p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{ color: "#b38800" }}>
                AI OVERVIEW · HIZLI CEVAP BLOĞU
              </p>

              <div className="space-y-3 text-[13px] text-gray-800">
                <div>
                  <strong className="block text-gray-900 mb-1">Pir Reklam hangi ürünleri üretir?</strong>
                  <span>
                    Ruhsat kabı, vesikalık kabı, poliçe kabı, döviz kabı, pasaport kılıfı, fotoğraf
                    kabı, kredi kartlık, plakalık, evlilik cüzdanı kılıfı, veteriner aşı karnesi
                    kabı, sayısal loto kabı, anahtarlık, kalem, çakmak, oto kokusu, kartvizit,
                    ajanda, takvim, promosyon çantası ve benzeri kurumsal promosyon ürünleri.
                  </span>
                </div>
                <div>
                  <strong className="block text-gray-900 mb-1">Minimum sipariş adedi kaç?</strong>
                  <span>
                    Baskılı siparişlerde genel minimum 100 adettir. 500 ve üzerinde birim fiyat
                    avantajı belirginleşir; 1.000+ adet zincir ve kurumsal siparişler özel fiyatlandırmaya girer.
                  </span>
                </div>
                <div>
                  <strong className="block text-gray-900 mb-1">Teslim süresi ne kadar?</strong>
                  <span>
                    Serigrafi ve UV dijital baskı için grafik onayından sonra 7 iş günü, gofre
                    kabartma baskı için 15 iş günü üretim süresi gerekir. Kargo Türkiye geneline
                    1–3 gün içinde tamamlanır.
                  </span>
                </div>
                <div>
                  <strong className="block text-gray-900 mb-1">Hangi sektörler hangi ürünü kullanır?</strong>
                  <span>
                    Sigorta acenteleri → ruhsat kabı + poliçe kabı + plakalık. Oto galeri ve rent a
                    car → ruhsat kabı + plakalık + oto kokusu + anahtarlık. Fotoğraf stüdyosu →
                    vesikalık kabı + fotoğraf kabı. Döviz bürosu ve kuyumcu → döviz kabı. Turizm
                    acentesi ve hac-umre → pasaport kılıfı + bagaj etiketi. Veteriner kliniği → aşı
                    karnesi kabı. Nikâh salonu ve belediye → evlilik cüzdanı kılıfı.
                  </span>
                </div>
              </div>
            </div>

            {/* ═════ INTRODUCTION ═════ */}
            <p>
              <Link href="/kurumsal/">Pir Reklam</Link>, Türkiye&apos;nin köklü promosyon ürünleri
              üreticilerinden biridir. 1961&apos;den bu yana aynı aile yönetiminde faaliyet gösteren
              firmamız; sigorta acenteleri, oto galeriler, rent a car firmaları, fotoğraf
              stüdyoları, döviz büroları, turizm operatörleri, veteriner klinikleri ve belediyeler
              gibi geniş bir müşteri portföyüne <strong>biala PVC, suni deri, termo deri ve hakiki
              deri</strong> tabanlı resmî belge kabı ve promosyon ürünleri üretir. Aracı kâr
              eklemeden, doğrudan üreticiden alışveriş yapmanın fiyat avantajını müşterilerimize
              yansıtırız.
            </p>
            <p>
              Bu sayfada <strong>hangi ürünümüz hangi sektörde kullanılır, neden kullanılır, hangi
              faydayı sağlar, hangi baskı tekniğine uygundur ve ne kadar dayanıklıdır</strong>
              sorularının cevaplarını kategori bazında bulacaksınız. Her ürün başlığı ilgili
              kategori sayfasına bağlantılıdır; detaylı modeller, fiyatlandırma faktörleri ve sık
              sorulan sorular o sayfalarda yer alır.
            </p>

            {/* ═════ CLUSTER 1: BELGE KABI GRUBU ═════ */}
            <h2>Cluster 1: Resmî Belge Koruma Ürünleri</h2>
            <p>
              Türkiye&apos;de her gün milyonlarca resmî belge (ruhsat, pasaport, vesikalık, poliçe,
              döviz bordrosu, cüzdan) el değiştirir. Bu belgelerin ömrü boyunca düzenli, temiz ve
              tanınır bir ambalajda taşınması; hem belge sahibi için pratiklik, hem kurumsal
              firmalar için 3–24 ay süren bir marka görünürlük mecrası sağlar.
            </p>

            <h3>
              <Link href="/urun-kategori/plastik-urunler/ruhsat-kabi/">Ruhsat Kabı</Link>
            </h3>
            <h4>Nedir?</h4>
            <p>
              <strong>Ruhsat kabı</strong>, araç ruhsatı ile birlikte trafik poliçesi, kasko
              belgesi, muayene raporu ve vergi makbuzu gibi evrakları tek bir yerde taşımak için
              üretilen belge kabıdır.
            </p>
            <h4>Hangi Sektörlerde Kullanılır?</h4>
            <ul>
              <li>
                <strong>Sigorta acenteleri:</strong> Trafik ve kasko poliçe yenilemelerinde standart
                müşteri hediyeliği.
              </li>
              <li>
                <strong>Oto galeriler:</strong> Yeni araç tesliminde müşteriye verilen welcome kit
                içinde; <Link href="/urun-kategori/plastik-urunler/plakalik/">plakalık</Link>
                {" "}ve{" "}
                <Link href="/urun-kategori/promosyon-urunler/oto-kokusu/">oto kokusu</Link> ile set hâlinde.
              </li>
              <li>
                <strong>Rent a car firmaları:</strong> Kiralık araç donanımının standart parçası.
                Filo çok amaçlı modelde kart slotları da bulunur.
              </li>
              <li>
                <strong>Oto servisleri:</strong> Periyodik bakım sonrası müşteriye verilen sadakat
                hediyeliği.
              </li>
            </ul>
            <h4>Neden Kullanılır?</h4>
            <p>
              İnce kağıt yapısındaki araç ruhsatı 6–12 ay gibi kısa sürede nemden, UV&apos;den ve
              sürtünmeden okunamayacak hâle gelir. Ruhsat kabı bu hasarı önlerken, aynı zamanda
              trafik kazası gibi acil durumlarda sigorta acentesinin telefonunun kapak üzerinde
              yazılı olması sayesinde operasyonel bir fayda sağlar.
            </p>
            <h4>Dayanıklılık ve Malzeme</h4>
            <ul>
              <li>
                <strong>Biala PVC:</strong> Mat nubuk yüzey, 12–18 ay yoğun kullanım, 17 farklı renk,
                en ekonomik segment.
              </li>
              <li>
                <strong>Dikişli suni deri:</strong> Kenarları dikişli, 24–36 ay kullanım, premium
                hissiyat.
              </li>
              <li>
                <strong>Termo deri:</strong> Vintage görünüm kazanan dokulu deri, 3–5 yıl kullanım.
              </li>
              <li>
                <strong>Hakiki deri:</strong> VIP segment, 5+ yıl, sıcak varak ve lazer kazıma
                baskıya uygun.
              </li>
            </ul>

            <h3>
              <Link href="/urun-kategori/plastik-urunler/vesikalik-kabi/">Vesikalık Kabı</Link>
            </h3>
            <h4>Nedir?</h4>
            <p>
              <strong>Vesikalık kabı</strong>, 3,5×4,5 cm ve 5×6 cm standart biyometrik fotoğraf
              baskılarını düzgün, lekesiz ve kıvrılmadan taşımak için üretilen tekli veya çiftli
              bölmeli küçük PVC kabıdır.
            </p>
            <h4>Hangi Sektörlerde Kullanılır?</h4>
            <ul>
              <li>
                <strong>Fotoğraf stüdyoları:</strong> Nüfus müdürlüğü ve emniyet yakınındaki yoğun
                pasaport/ehliyet fotoğrafçıları.
              </li>
              <li>
                <strong>Zincir fotoğraf mağazaları:</strong> Merkezi sipariş + şube dağıtımıyla
                kurumsal bütünlük.
              </li>
              <li>
                <strong>Fotoğraf + fotokopi + kırtasiye dükkanları:</strong> Kısa süreli biyometrik
                fotoğraf basan çok işlevli noktalar.
              </li>
            </ul>
            <h4>Neden Kullanılır?</h4>
            <p>
              Zarfsız verilen vesikalık fotoğraflar birkaç gün içinde cüzdanda veya çantada kırılır;
              stüdyonun kalite algısı zedelenir. Baskılı vesikalık kabı hem bu sorunu çözer hem de
              üzerindeki stüdyo telefonu ile müşteriyi bir sonraki ihtiyaçta aynı stüdyoya yönlendirir.
            </p>
            <h4>Dayanıklılık ve Faydalar</h4>
            <ul>
              <li>Mat biala PVC küçük yüzeyde gofre kabartma ile prestij etkisi yaratır.</li>
              <li>Tekli ve çiftli modeller — tek fotoğraf ya da iki farklı boyut için.</li>
              <li>
                Paralel üründür:{" "}
                <Link href="/urun-kategori/plastik-urunler/fotograf-kabi/">fotoğraf kabı</Link>
                {" "}ile set hâlinde tüketilir.
              </li>
            </ul>

            <h3>
              <Link href="/urun-kategori/plastik-urunler/police-kabi/">Poliçe Kabı</Link>
            </h3>
            <h4>Nedir?</h4>
            <p>
              <strong>Poliçe kabı</strong>, sigorta acentelerinin trafik, kasko, DASK, sağlık ve
              hayat poliçelerini müşteriye profesyonel bir paket içinde teslim etmek için kullandığı
              A4 veya A5 belge kabıdır.
            </p>
            <h4>Kullanım Senaryosu</h4>
            <p>
              Sigorta sektöründe müşteri ile acente arasındaki yıllık temas sayısı 2–4&apos;tür. Bu
              temaslar arasındaki 3–6 aylık sessiz dönem, müşterinin poliçesini hangi acentede
              yenileyeceği kararını etkiler. Kapak üzerindeki acente telefonu ile çalışan bu sessiz
              reklam, poliçe yenileme oranını artırır. Çoğu sigorta acentesi{" "}
              <Link href="/urun-kategori/plastik-urunler/ruhsat-kabi/">ruhsat kabı</Link>,{" "}
              poliçe kabı ve{" "}
              <Link href="/urun-kategori/plastik-urunler/plakalik/">plakalık</Link> ürünlerini aynı
              siparişte birleştirir.
            </p>
            <h4>Dayanıklılık</h4>
            <p>
              A4 fermuarlı PVC modeller 18–24 ay aktif kullanıma dayanır. Dikişli suni deri
              versiyonları 3+ yıl dayanır; kurumsal broker firmaları ve özel bankacılık birimleri
              bu tipi tercih eder.
            </p>

            <h3>
              <Link href="/urun-kategori/plastik-urunler/doviz-kabi/">Döviz Kabı</Link>
            </h3>
            <h4>Nedir?</h4>
            <p>
              <strong>Döviz kabı</strong>, döviz bürolarının ve kuyumcuların nakit banknotları
              düzenli ve kurumsal şekilde müşteriye sunmak için kullandığı fermuarlı veya kapaklı
              PVC teslimat kabıdır.
            </p>
            <h4>Sektörel Kullanım</h4>
            <ul>
              <li>
                <strong>Döviz büroları:</strong> Günlük 50–500 işlem hacmine göre küçük boy PVC,
                kapaklı lüks veya extra büyük boy modeller.
              </li>
              <li>
                <strong>Para transferi firmaları:</strong> Western Union, Ria benzeri zincir
                yapılarda merkezi sipariş + şube dağıtımı.
              </li>
              <li>
                <strong>Kuyumcular:</strong> Altın satış karşılığı nakit teslimatında. Altın
                sertifikası ile birlikte prestijli paketleme.
              </li>
            </ul>
            <h4>Neden Önemli?</h4>
            <p>
              Nakit banknotun tezgah üzerinde saçık teslimi müşteride özensizlik algısı yaratır.
              Aynı işlem baskılı fermuarlı döviz kabı içinde sunulduğunda müşteri profesyonellik
              hisseder ve tekrar ziyaret etme olasılığı artar. Bu etki özellikle düzenli ticaret
              yapan kurumsal döviz müşterileri için belirleyicidir.
            </p>

            <h3>
              <Link href="/urun-kategori/plastik-urunler/pasaport-kilifi/">Pasaport Kılıfı</Link>
            </h3>
            <h4>Nedir?</h4>
            <p>
              <strong>Pasaport kılıfı</strong>, çipli Türkiye Cumhuriyeti pasaportunun fiziksel
              koruması ve turizm acentelerinin marka görünürlüğü için üretilen 88×125 mm uyumlu
              koruyucu kılıftır.
            </p>
            <h4>Kimler Kullanır?</h4>
            <ul>
              <li>
                <strong>Turizm ve seyahat acenteleri:</strong> Tur paketinin parçası; check-in
                kuyruğunda grup tanıma kolaylığı.
              </li>
              <li>
                <strong>Hac ve umre operatörleri:</strong> Sezonluk 1.000–5.000 adet toplu üretim.
                Grup aidiyetini vurgular.
              </li>
              <li>
                <strong>Kurumsal seyahat bölümleri:</strong> Yönetici seyahatlerinde şirket logolu
                premium model.
              </li>
              <li>
                <strong>Bankalar:</strong> VIP müşteri &quot;dünya seyahati paketi&quot; içinde{" "}
                <Link href="/urun-kategori/plastik-urunler/kredi-kartlik/">kredi kartlık</Link> ile
                birlikte.
              </li>
            </ul>
            <h4>Dayanıklılık</h4>
            <p>
              Biala PVC model bir yıl yoğun taşıma sonrası renk kaybı gösterir. Suni deri ve termo
              deri modeller pasaport süresince (10 yıl) kullanım sağlar.
            </p>

            <h3>
              <Link href="/urun-kategori/plastik-urunler/fotograf-kabi/">Fotoğraf Kabı</Link>
            </h3>
            <h4>Nedir?</h4>
            <p>
              <strong>Fotoğraf kabı</strong>, stüdyoların müşteriye teslim ettiği aile, okul, düğün
              ve nişan fotoğraf baskılarını koruyan PVC ambalaj ürünüdür. 6×9, 10×15, 13×18,
              15×21, 18×24, 20×25 cm olmak üzere 6 standart boyutta üretilir.
            </p>
            <h4>Sektörel Tercih</h4>
            <ul>
              <li>
                <strong>Mahalle fotoğrafçıları:</strong> Genellikle 10×15 ve 13×18.
              </li>
              <li>
                <strong>Okul fotoğrafçılığı firmaları:</strong> Sezon başında 5.000–20.000 adet
                10×15.
              </li>
              <li>
                <strong>Düğün fotoğrafçıları:</strong> Karma boyut (13×18, 15×21, 18×24) premium
                gofre baskılı.
              </li>
              <li>
                <strong>Bebek ve çocuk stüdyoları:</strong> Pastel renkli UV dijital baskı.
              </li>
            </ul>
            <h4>Neden Kullanılır?</h4>
            <p>
              Emekle basılan bir aile fotoğrafını naylon poşetle teslim etmek, stüdyo kalitesini
              anında düşürür. Fotoğraf kabı hem baskıyı korur hem de stüdyonun markasını 6–24 ay
              boyunca müşterinin gözünde tutar. Vesikalık kabı ile set hâlinde sipariş ekonomiktir.
            </p>

            <h3>
              <Link href="/urun-kategori/plastik-urunler/kredi-kartlik/">Kredi Kartlık</Link>
            </h3>
            <h4>Nedir?</h4>
            <p>
              <strong>Kredi kartlık</strong>, banka kartı, kimlik, ulaşım kartı ve sadakat
              kartlarını kompakt bir cüzdanda tutan çoklu kart kılıfıdır. 14 kartlı, çıt çıt
              kapaklı ve tekli U model olmak üzere 5 ürün tipimiz vardır.
            </p>
            <h4>Kullanım Alanları</h4>
            <ul>
              <li>
                <strong>Bankalar:</strong> Kart yenileme kampanyalarında welcome kit&apos;in ana
                unsuru.
              </li>
              <li>
                <strong>Özel bankacılık:</strong> Dikişli termo deri model VIP müşteri segmenti.
              </li>
              <li>
                <strong>Kurumsal hediye şirketleri:</strong> Yılbaşı paketlerinde{" "}
                <Link href="/urun-kategori/promosyon-urunler/kalem/">kalem</Link> ve{" "}
                <Link href="/urun-kategori/promosyon-urunler/ajanda/">ajanda</Link> ile üçlü set.
              </li>
              <li>
                <strong>Telekom ve e-ticaret:</strong> Sadakat programı hediyelikleri.
              </li>
            </ul>

            <h3>
              <Link href="/urun-kategori/plastik-urunler/evlilik-cuzdani-kilifi/">
                Evlilik Cüzdanı Kılıfı
              </Link>
            </h3>
            <p>
              Yeni evli çiftlere nikâh memurluğu tarafından verilen evlilik cüzdanının ömür boyu
              saklanması için üretilen özel belge kabıdır. <strong>Belediyeler ve ilçe nikâh
              daireleri</strong> yıllık 500–5.000 adet aralığında sipariş verir. Biala PVC
              ekonomik segment, dikişli suni deri orta segment, termo deri premium segment ürünlerdir.
            </p>

            <h3>
              <Link href="/urun-kategori/plastik-urunler/veteriner-asi-karnesi-kabi/">
                Veteriner Aşı Karnesi Kabı
              </Link>
            </h3>
            <p>
              Evcil hayvanların aşı takvimini ve sağlık kayıtlarını koruyan özel belge kabıdır.
              <strong> Veteriner klinikleri, hayvan hastaneleri, pet shop ve mama markaları</strong>{" "}
              yıllık 300–2.000 adet sipariş verir. Pastel renkler ve hayvan illüstrasyonlu
              tasarımlar tercih edilir.
            </p>

            <h3>
              <Link href="/urun-kategori/plastik-urunler/plakalik/">Plakalık</Link>
            </h3>
            <p>
              Araç plakasının etrafına monte edilen, galerinin veya sigorta acentesinin markasını
              trafiğin içinde görünür kılan PVC çerçeveleme. 52×11 cm çıtalı model otomobil için,
              kare motosiklet modeli motosiklet ve bisikletler için üretilir. 2–3 yıl UV
              stabilizatörlü dayanıklılık.
            </p>

            <h3>
              <Link href="/urun-kategori/plastik-urunler/sayisal-loto-kabi/">Sayısal Loto Kabı</Link>
            </h3>
            <p>
              Milli Piyango, iddaa ve ganyan bayilerinin müşteriye kupon teslimi yaparken
              kullandığı PVC kupon kabı. Tekli, çiftli kapaklı ve ganyan biala olmak üzere 4 farklı
              modelimiz vardır.
            </p>

            <h3>
              <Link href="/urun-kategori/plastik-urunler/bagaj-valiz-etiketligi/">
                Bagaj Valiz Etiketliği
              </Link>
            </h3>
            <p>
              Havalimanı transferlerinde ve uzun yolculuklarda bagajı tanımlayan etikettir. Turizm
              acenteleri ve hac-umre firmaları pasaport kılıfı ile birlikte set hâlinde tedarik eder.
            </p>

            {/* ═════ CLUSTER 2: MATBAA ═════ */}
            <h2>Cluster 2: Matbaa Ürünleri</h2>
            <p>
              <Link href="/urun-kategori/matbaa-urunleri/">Matbaa ürünleri</Link> kategorisi, bir
              markanın en düşük maliyetli ve en uzun ömürlü reklam mecrasıdır. 1.000 adet kartvizit
              baskısının tek tıklama Google reklamının yaklaşık %5&apos;i kadar maliyeti vardır ve
              etkisi 6–12 ay devam eder.
            </p>

            <h3>
              <Link href="/urun-kategori/matbaa-urunleri/kartvizit/">Kartvizit</Link>
            </h3>
            <p>
              Profesyonel temasın ilk kartı. 85×55 mm standart ebat. Ofset 4+4 renk, mat/parlak
              selefon, gofre kabartma, sıcak varak yaldız, spot UV ve özel kesim teknikleri.
              Kurumsal firmalar için 1.000+ adet ofset baskı en ekonomik çözümdür.
            </p>

            <h3>
              <Link href="/urun-kategori/matbaa-urunleri/el-ilani/">El İlanı</Link>
            </h3>
            <p>
              Mahalle dağıtımı, lansman duyurusu ve kampanya tanıtımı için A4, A5, A6 ebatlarında
              ofset/dijital baskı. Restoran menüsü, emlakçı tanıtımı ve seçim döneminde aday
              bildirimleri için ideal.
            </p>

            <h3>
              <Link href="/urun-kategori/matbaa-urunleri/magnet/">Magnet</Link>
            </h3>
            <p>
              Buzdolabı kapısında 6–36 ay görünür kalan uzun ömürlü reklam. Pizzacılar, nakliye
              firmaları, tesisatçı ve elektrikçi gibi acil servisler için standart hatırlatıcı.
              Kartvizit magnet, özel şekilli die-cut ve araç magneti çeşitleri.
            </p>

            <h3>
              <Link href="/urun-kategori/matbaa-urunleri/sticker/">Sticker</Link>
            </h3>
            <p>
              Ürün ambalajı, vitrin, araç branding ve etkinlik için yapışkanlı etiket. Şeffaf,
              mat, parlak vinyl, holografik ve metalik seçenekler.
            </p>

            <h3>
              <Link href="/urun-kategori/matbaa-urunleri/kup-blok-not/">Küp Blok Not</Link>
              {" · "}
              <Link href="/urun-kategori/matbaa-urunleri/takvimler/">Takvim</Link>
            </h3>
            <p>
              Ofis masa üstünün 6–12 ay sabit unsurları. Küp blok not her sayfada logo taşır;
              takvim yıl boyunca duvarda asılı kalır. <Link href="/urun-kategori/promosyon-urunler/ajanda/">Ajanda</Link>
              , kalem ve küp blok not kurumsal yılbaşı hediyelik setinin klasik üçlüsüdür.
            </p>

            {/* ═════ CLUSTER 3: PROMOSYON ═════ */}
            <h2>Cluster 3: Klasik Promosyon Kalemleri</h2>
            <p>
              <Link href="/urun-kategori/promosyon-urunler/">Promosyon ürünleri</Link>, günlük
              hayatın içine gömülerek markayı sessizce taşıyan kalemler: cepte çakmak, masada
              kalem, kolda anahtarlık, duvarda saat, araçta oto kokusu.
            </p>

            <h3>
              <Link href="/urun-kategori/promosyon-urunler/anahtarlik/">Anahtarlık</Link>
            </h3>
            <p>
              Sahibi tarafından her gün defalarca eline alınan, markayı sürekli görünür kılan
              ürün. 5 farklı modelimiz: metal, hakiki deri, suni deri, silikon kauçuk ve puf PVC.
              Lazer kazıma (metal + deri), gofre kabartma (PVC + deri) ve özel silikon kalıp
              (3D şekil) teknikleri.
            </p>

            <h3>
              <Link href="/urun-kategori/promosyon-urunler/kalem/">Kalem</Link>
            </h3>
            <p>
              İş toplantısının imza kalemi. Metal gövde lazer kazıma ile premium kurumsal segment,
              plastik gövde serigrafi ile yüksek hacimli dağıtım.
            </p>

            <h3>
              <Link href="/urun-kategori/promosyon-urunler/cakmak/">Çakmak</Link>
            </h3>
            <p>
              Cafe-restoran, benzin istasyonu ve tütün sektörü için klasik. Plastik ekonomik ve
              metal premium (Zippo tarzı) versiyonlar.
            </p>

            <h3>
              <Link href="/urun-kategori/promosyon-urunler/oto-kokusu/">Oto Kokusu</Link>
            </h3>
            <p>
              Oto galeri, rent a car ve oto yıkama müşterisinin aracının kokusunu tazelerken
              markanın 2 hafta ile 3 ay boyunca aracı içinde kalır. Yaprak askılı ve kapaklı
              reservoir modeller, 7+ koku seçeneği.
            </p>

            <h3>
              <Link href="/urun-kategori/promosyon-urunler/ajanda/">Ajanda</Link>
              {" · "}
              <Link href="/urun-kategori/promosyon-urunler/defterler/">Defter</Link>
            </h3>
            <p>
              Masa üstünde 12 ay kullanılan planlama araçları. Suni deri, termo deri ve PVC kapak
              seçenekleri. Yönetici hediyelik paketlerinin standart unsuru.
            </p>

            <h3>
              <Link href="/urun-kategori/promosyon-urunler/bardak-altligi/">Bardak Altlığı</Link>
              {" · "}
              <Link href="/urun-kategori/promosyon-urunler/mouse-pad/">Mouse Pad</Link>
              {" · "}
              <Link href="/urun-kategori/promosyon-urunler/duvar-saatleri/">Duvar Saati</Link>
            </h3>
            <p>
              Masaüstü ve ofis alanı reklam mecraları. Bardak altlığı cafe-restoran için, mouse pad
              teknoloji firması ofisleri için, duvar saati bekleme alanları için özel olarak
              üretilir.
            </p>

            {/* ═════ CLUSTER 4: ÇANTA ═════ */}
            <h2>Cluster 4: Kurumsal Çanta Yelpazesi</h2>
            <p>
              <Link href="/urun-kategori/canta/">Çanta</Link> kategorisi, müşterinin markayı
              günlerce yanında taşımasını sağlayan en dayanıklı promosyon ürünüdür. Fuar çantası
              etkinlik sonrası günlük hayatta kullanılmaya devam eder; laptop çantası çalışanın
              her iş gününde yanındadır.
            </p>

            <h3>
              <Link href="/urun-kategori/canta/promosyon-canta/">Promosyon Çanta</Link>
            </h3>
            <p>
              Pamuk bez, non-woven polipropilen, kraft kağıt ve polyester seçenekleri. Fuar,
              etkinlik ve butik mağaza dağıtımı için. En çevreci segment pamuk bez çantadır.
            </p>

            <h3>
              <Link href="/urun-kategori/canta/laptop-cantalari/">Laptop Çantaları</Link>
            </h3>
            <p>
              13–17 inç laptop boyutlarına uygun portföy, messenger, sırt çantası ve premium deri
              modeller. IT firmaları, danışmanlık şirketleri ve yönetici hediyelik paketleri için.
            </p>

            <h3>
              <Link href="/urun-kategori/canta/elbise-kiliflari/">Elbise Kılıfları</Link>
            </h3>
            <p>
              Kuru temizlemeciler, dikim atölyeleri ve butik mağazaların günlük teslim ambalajı.
              Standart ceket boyutundan gelinlik uzunluğuna kadar özel ebat üretim.
            </p>

            <h3>
              <Link href="/urun-kategori/canta/spor-ve-seyahat-cantalari/">
                Spor ve Seyahat Çantaları
              </Link>
            </h3>
            <p>
              Duffel bag, weekend bag, gym bag ve uzun mesafe seyahat çantası. Spor kulüpleri,
              fitness merkezleri, otel zincirleri ve kurumsal VIP hediye setleri.
            </p>

            {/* ═════ SECTOR CLUSTER ═════ */}
            <h2>Cluster 5: Sektörel Kullanım Kılavuzu</h2>
            <p>
              Her sektörün kendine özgü teslim ambalajı ve promosyon seti vardır. Aşağıda
              Türkiye&apos;nin 7 farklı sektörü için pratik tedarik listesini bulacaksınız.
            </p>

            <h3>Sigorta Acenteleri</h3>
            <ul>
              <li>
                <Link href="/urun-kategori/plastik-urunler/ruhsat-kabi/">Ruhsat kabı</Link> +{" "}
                <Link href="/urun-kategori/plastik-urunler/police-kabi/">poliçe kabı</Link>:
                yenileme teslim paketi.
              </li>
              <li>
                <Link href="/urun-kategori/plastik-urunler/plakalik/">Plakalık</Link>: araç üzeri
                sessiz reklam.
              </li>
              <li>
                <Link href="/urun-kategori/promosyon-urunler/anahtarlik/">Anahtarlık</Link> ve{" "}
                <Link href="/urun-kategori/promosyon-urunler/kalem/">kalem</Link>: poliçe imzası
                sırasında verilir.
              </li>
            </ul>

            <h3>Oto Galeriler ve Rent a Car</h3>
            <ul>
              <li>
                <Link href="/urun-kategori/plastik-urunler/ruhsat-kabi/">Filo çok amaçlı ruhsat
                kabı</Link> (kart slotlu).
              </li>
              <li>
                <Link href="/urun-kategori/plastik-urunler/plakalik/">Plakalık</Link>,{" "}
                <Link href="/urun-kategori/promosyon-urunler/oto-kokusu/">oto kokusu</Link>,{" "}
                <Link href="/urun-kategori/promosyon-urunler/anahtarlik/">metal anahtarlık</Link>.
              </li>
              <li>
                Teslim paketi her araç için standart set olarak hazırlanır.
              </li>
            </ul>

            <h3>Fotoğraf Stüdyoları</h3>
            <ul>
              <li>
                <Link href="/urun-kategori/plastik-urunler/vesikalik-kabi/">Vesikalık kabı</Link>{" "}
                (tekli/çiftli) + 6 farklı{" "}
                <Link href="/urun-kategori/plastik-urunler/fotograf-kabi/">fotoğraf kabı</Link>{" "}
                boyutu.
              </li>
              <li>
                Okul sezonu (eylül-ekim) için Haziran&apos;da erken rezervasyon önerilir.
              </li>
            </ul>

            <h3>Döviz Büroları ve Kuyumcular</h3>
            <ul>
              <li>
                <Link href="/urun-kategori/plastik-urunler/doviz-kabi/">Döviz kabı</Link>{" "}
                (fermuarlı, kapaklı, extra büyük boy).
              </li>
              <li>
                Kuyumcular için altın sertifikası paketinin parçası.
              </li>
              <li>
                <Link href="/urun-kategori/matbaa-urunleri/kartvizit/">Kartvizit</Link>: kasa
                yanında müşteriye sunulur.
              </li>
            </ul>

            <h3>Turizm ve Hac-Umre Acenteleri</h3>
            <ul>
              <li>
                <Link href="/urun-kategori/plastik-urunler/pasaport-kilifi/">Pasaport kılıfı</Link>
                {" "}(grup tanıma renkli).
              </li>
              <li>
                <Link href="/urun-kategori/plastik-urunler/bagaj-valiz-etiketligi/">Bagaj
                etiketi</Link>: havalimanı transferi için.
              </li>
              <li>
                <Link href="/urun-kategori/plastik-urunler/kredi-kartlik/">Kredi kartlık</Link>:
                yurt dışı seyahat kart organizatörü.
              </li>
              <li>Hac-umre sezonu öncesi 45 gün rezervasyon gerekir.</li>
            </ul>

            <h3>Veteriner Klinikleri</h3>
            <ul>
              <li>
                <Link href="/urun-kategori/plastik-urunler/veteriner-asi-karnesi-kabi/">
                  Aşı karnesi kabı
                </Link>{" "}
                — ilk muayenede hayvan sahibine verilir.
              </li>
            </ul>

            <h3>Belediye ve Nikâh Daireleri</h3>
            <ul>
              <li>
                <Link href="/urun-kategori/plastik-urunler/evlilik-cuzdani-kilifi/">
                  Evlilik cüzdanı kılıfı
                </Link>{" "}
                — her nikâhta teslim edilir.
              </li>
              <li>
                Merkezi sipariş + ilçe bazlı dağıtım mümkündür.
              </li>
            </ul>

            <h3>Milli Piyango ve Ganyan Bayileri</h3>
            <ul>
              <li>
                <Link href="/urun-kategori/plastik-urunler/sayisal-loto-kabi/">Sayısal loto
                kabı</Link>{" "}
                (tekli, çiftli, ganyan, ofset baskı 4 model).
              </li>
            </ul>

            <h3>Lojistik ve Nakliye Firmaları</h3>
            <ul>
              <li>
                <Link href="/urun-kategori/plastik-urunler/uzun-yuk-bayragi/">Uzun yük bayrağı</Link>
                {" "}(Karayolları yönetmeliği uyumlu, kırmızı, logolu).
              </li>
              <li>
                <Link href="/urun-kategori/matbaa-urunleri/magnet/">Araç magneti</Link>
                {" "}(20×30 cm ve üzeri).
              </li>
            </ul>

            {/* ═════ PRICE & PRODUCTION CLUSTER ═════ */}
            <h2>Cluster 6: Fiyatlandırma, Baskı Teknikleri ve Üretim Süreci</h2>

            <h3>Fiyatı Etkileyen 5 Faktör</h3>
            <ol>
              <li>
                <strong>Model:</strong> Biala PVC &lt; Suni deri &lt; Termo deri &lt; Hakiki deri
                sırasıyla yükselir.
              </li>
              <li>
                <strong>Baskı tekniği:</strong> Serigrafi &lt; UV dijital &lt; Gofre kabartma &lt;
                Sıcak varak yaldız &lt; Lazer kazıma.
              </li>
              <li>
                <strong>Adet:</strong> 100 → 500 → 1.000 → 5.000 basamaklarında birim fiyat düşer.
              </li>
              <li>
                <strong>Renk sayısı:</strong> Serigrafi&apos;de her ek renk ayrı kalıp gerektirir.
              </li>
              <li>
                <strong>Kargo ve KDV:</strong> Dahil değildir; %20 KDV ve kargo ücreti müşteriye aittir.
              </li>
            </ol>

            <h3>Baskı Teknikleri — Hangisi Ne Zaman?</h3>
            <ul>
              <li>
                <strong>Serigrafi (1–3 renk):</strong> 500+ adet yüksek hacimli siparişlerde en
                ekonomik.
              </li>
              <li>
                <strong>UV dijital:</strong> Düşük adet (50–500) + fotoğraf kalitesinde çok renkli
                tasarım.
              </li>
              <li>
                <strong>Gofre kabartma:</strong> Biala ve deri yüzeyde premium prestij. İlk seferlik
                metal klişe 1.300 ₺, sonraki siparişlerde ücretsiz.
              </li>
              <li>
                <strong>Sıcak varak yaldız:</strong> Gold/silver metalik logo vurgusu, VIP segment.
              </li>
              <li>
                <strong>Lazer kazıma:</strong> Metal ve hakiki deri yüzeyde kalıcı ve en prestijli
                sonuç.
              </li>
            </ul>

            <h3>Üretim Süreci — 7 Adım</h3>
            <ol>
              <li>
                <strong>İhtiyaç analizi ve numune:</strong> Sektör ve kullanım önerisi yapılır.
              </li>
              <li>
                <strong>Grafik tasarım:</strong> Logonuz yerleştirilir, PDF/PNG önizleme gönderilir.
              </li>
              <li>
                <strong>Ön ödeme:</strong> Bakiyenin en az %30&apos;u peşin.
              </li>
              <li>
                <strong>Klişe (gofre için):</strong> İlk seferde üretilir; sonraki siparişlerde
                ücretsiz.
              </li>
              <li>
                <strong>Seri üretim:</strong> Serigrafi 7 gün, UV dijital 7 gün, gofre 15 gün.
              </li>
              <li>
                <strong>Video kontrol:</strong> Paketlenmiş hâliyle video gönderilir.
              </li>
              <li>
                <strong>Bakiye tahsili + kargo:</strong> Türkiye geneline 1–3 gün içinde teslim.
              </li>
            </ol>

            {/* ═════ QUALITY & DURABILITY ═════ */}
            <h2>Kalite Standartları ve Dayanıklılık</h2>
            <p>
              <Link href="/kurumsal/">Pir Reklam</Link>&apos;ın ürettiği her kalem, aynı İstanbul
              tesisinde kalıp-baskı-kesim-ambalaj zinciriyle üretilir. Aracı firma yok, kalite
              kontrol tamamen bizdedir.
            </p>
            <ul>
              <li>
                <strong>Biala PVC:</strong> 17 renk seçeneği, UV stabilizatör katkılı; 12–18 ay
                yoğun kullanım.
              </li>
              <li>
                <strong>Dikişli suni deri:</strong> 24–36 ay kullanım; gofre kabartma ile 3 boyutlu
                prestij.
              </li>
              <li>
                <strong>Termo deri:</strong> 3–5 yıl; vintage patina oluşur.
              </li>
              <li>
                <strong>Hakiki deri:</strong> 5+ yıl; sıcak varak yaldız ve lazer kazıma ile premium.
              </li>
              <li>
                <strong>Metal (anahtarlık, kalem, çakmak):</strong> Paslanmaz çelik, pirinç veya
                çinko alaşımı; lazer kazıma kalıcı.
              </li>
            </ul>

            {/* ═════ WHY PIR REKLAM ═════ */}
            <h2>Neden Pir Reklam?</h2>
            <p>
              <Link href="/kurumsal/">Pir Reklam</Link>&apos;ı diğer tedarikçilerden ayıran 5 temel
              avantaj:
            </p>
            <ol>
              <li>
                <strong>Üretici firma:</strong> Aracı kâr eklenmiyor, doğrudan üreticiden fiyat.
              </li>
              <li>
                <strong>64 yıllık deneyim:</strong> 1961&apos;den beri aynı sektörde.
              </li>
              <li>
                <strong>Tescilli marka:</strong> &quot;Pir Reklam&quot; ve &quot;Pir Plastik&quot; Türk Patent
                Enstitüsü&apos;nde tescillidir.
              </li>
              <li>
                <strong>Yerli üretim:</strong> Her ürün İstanbul tesisimizde imal.
              </li>
              <li>
                <strong>Esnek minimum:</strong> 100 adetten başlayan toptan sipariş.
              </li>
            </ol>

            {/* ═════ CONCLUSION ═════ */}
            <h2>Sonuç: Sektörünüze Uygun Doğru Tedarikçi</h2>
            <p>
              İster sigorta acenteniz olsun, ister fotoğraf stüdyonuz, ister kuyumcu veya oto
              galeriniz — müşterinizin elinden çıkan teslim paketi, markanızın en uzun ömürlü
              reklamıdır. <Link href="/kurumsal/">Pir Reklam</Link> olarak sizin sektörünüze özel
              ürün kombinasyonlarını önerir, grafik tasarımdan seri üretime ve kargo sevkiyatına
              kadar tüm süreci tek elden yönetiriz. Toptan sipariş almak veya ücretsiz numune talep
              etmek için WhatsApp hattımızdan (0544 233 80 03) ya da sabit hattımızdan (444 10 30)
              bize ulaşabilirsiniz.
            </p>
            <p>
              Detaylı ürün bilgisi ve fiyat kademeleri için yukarıdaki kategori bağlantılarını
              takip edebilirsiniz; her kategori sayfasının altında o ürüne özel teknik detay, FAQ
              ve üretim bilgisi bulunur.
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
            className="inline-flex items-center gap-2 px-5 py-2 text-[13px] font-semibold uppercase tracking-wide transition-colors cursor-pointer"
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
