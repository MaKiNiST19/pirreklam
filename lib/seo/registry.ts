import type { SeoPackage } from "./types";

// L1 categories
import { plastikUrunlerSeo } from "./content/plastik-urunler";
import { matbaaUrunleriSeo } from "./content/matbaa-urunleri";
import { promosyonUrunlerSeo } from "./content/promosyon-urunler";
import { cantaSeo } from "./content/canta";

// L2 — Plastik Ürünler
import { ruhsatKabiSeo } from "./content/ruhsat-kabi";
import { vesikalikKabiSeo } from "./content/vesikalik-kabi";
import { policeKabiSeo } from "./content/police-kabi";
import { dovizKabiSeo } from "./content/doviz-kabi";
import { pasaportKilifiSeo } from "./content/pasaport-kilifi";
import { fotografKabiSeo } from "./content/fotograf-kabi";
import { bagajValizEtiketligiSeo } from "./content/bagaj-valiz-etiketligi";
import { evlilikCuzdaniKilifiSeo } from "./content/evlilik-cuzdani-kilifi";
import { krediKartlikSeo } from "./content/kredi-kartlik";
import { plakalikSeo } from "./content/plakalik";
import { sayisalLotoKabiSeo } from "./content/sayisal-loto-kabi";
import { uzunYukBayragiSeo } from "./content/uzun-yuk-bayragi";
import { veterinerAsiKarnesiKabiSeo } from "./content/veteriner-asi-karnesi-kabi";

// L2 — Matbaa Ürünleri
import { kartvizitSeo } from "./content/kartvizit";
import { elIlaniSeo } from "./content/el-ilani";
import { magnetSeo } from "./content/magnet";
import { stickerSeo } from "./content/sticker";
import { kupBlokNotSeo } from "./content/kup-blok-not";
import { takvimlerSeo } from "./content/takvimler";

// L2 — Promosyon Ürünler
import { anahtarlikSeo } from "./content/anahtarlik";
import { kalemSeo } from "./content/kalem";
import { cakmakSeo } from "./content/cakmak";
import { otoKokusuSeo } from "./content/oto-kokusu";
import { ajandaSeo } from "./content/ajanda";
import { defterlerSeo } from "./content/defterler";
import { bardakAltligiSeo } from "./content/bardak-altligi";
import { mousePadSeo } from "./content/mouse-pad";
import { duvarSaatleriSeo } from "./content/duvar-saatleri";
import { bozukParaCuzdaniSeo } from "./content/bozuk-para-cuzdani";

// L2 — Çanta
import { promosyonCantaSeo } from "./content/promosyon-canta";
import { elbiseKiliflariSeo } from "./content/elbise-kiliflari";
import { laptopCantalariSeo } from "./content/laptop-cantalari";
import { sporVeSeyahatCantalariSeo } from "./content/spor-ve-seyahat-cantalari";

/**
 * Map: category slug → SeoPackage
 *
 * The category page checks this map and renders <CategorySeoSection />
 * with auto-injected Product + FAQPage + BreadcrumbList JSON-LD
 * when a match is found.
 */
export const seoRegistry: Record<string, SeoPackage> = {
  // L1
  [plastikUrunlerSeo.slug]: plastikUrunlerSeo,
  [matbaaUrunleriSeo.slug]: matbaaUrunleriSeo,
  [promosyonUrunlerSeo.slug]: promosyonUrunlerSeo,
  [cantaSeo.slug]: cantaSeo,

  // L2 — Plastik Ürünler
  [ruhsatKabiSeo.slug]: ruhsatKabiSeo,
  [vesikalikKabiSeo.slug]: vesikalikKabiSeo,
  [policeKabiSeo.slug]: policeKabiSeo,
  [dovizKabiSeo.slug]: dovizKabiSeo,
  [pasaportKilifiSeo.slug]: pasaportKilifiSeo,
  [fotografKabiSeo.slug]: fotografKabiSeo,
  [bagajValizEtiketligiSeo.slug]: bagajValizEtiketligiSeo,
  [evlilikCuzdaniKilifiSeo.slug]: evlilikCuzdaniKilifiSeo,
  [krediKartlikSeo.slug]: krediKartlikSeo,
  [plakalikSeo.slug]: plakalikSeo,
  [sayisalLotoKabiSeo.slug]: sayisalLotoKabiSeo,
  [uzunYukBayragiSeo.slug]: uzunYukBayragiSeo,
  [veterinerAsiKarnesiKabiSeo.slug]: veterinerAsiKarnesiKabiSeo,

  // L2 — Matbaa Ürünleri
  [kartvizitSeo.slug]: kartvizitSeo,
  [elIlaniSeo.slug]: elIlaniSeo,
  [magnetSeo.slug]: magnetSeo,
  [stickerSeo.slug]: stickerSeo,
  [kupBlokNotSeo.slug]: kupBlokNotSeo,
  [takvimlerSeo.slug]: takvimlerSeo,

  // L2 — Promosyon Ürünler
  [anahtarlikSeo.slug]: anahtarlikSeo,
  [kalemSeo.slug]: kalemSeo,
  [cakmakSeo.slug]: cakmakSeo,
  [otoKokusuSeo.slug]: otoKokusuSeo,
  [ajandaSeo.slug]: ajandaSeo,
  [defterlerSeo.slug]: defterlerSeo,
  [bardakAltligiSeo.slug]: bardakAltligiSeo,
  [mousePadSeo.slug]: mousePadSeo,
  [duvarSaatleriSeo.slug]: duvarSaatleriSeo,
  [bozukParaCuzdaniSeo.slug]: bozukParaCuzdaniSeo,

  // L2 — Çanta
  [promosyonCantaSeo.slug]: promosyonCantaSeo,
  [elbiseKiliflariSeo.slug]: elbiseKiliflariSeo,
  [laptopCantalariSeo.slug]: laptopCantalariSeo,
  [sporVeSeyahatCantalariSeo.slug]: sporVeSeyahatCantalariSeo,
};

export function getSeoForSlug(slug: string): SeoPackage | null {
  return seoRegistry[slug] ?? null;
}
