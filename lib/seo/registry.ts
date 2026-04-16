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

/**
 * Map: category slug → SeoPackage
 *
 * Add new entries as each category content file is created.
 * The category page will check this map and render <CategorySeoSection /> + JSON-LD if found.
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
};

export function getSeoForSlug(slug: string): SeoPackage | null {
  return seoRegistry[slug] ?? null;
}
