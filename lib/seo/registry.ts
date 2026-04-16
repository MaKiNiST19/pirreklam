import type { SeoPackage } from "./types";
import { ruhsatKabiSeo } from "./content/ruhsat-kabi";
import { vesikalikKabiSeo } from "./content/vesikalik-kabi";
import { policeKabiSeo } from "./content/police-kabi";
import { dovizKabiSeo } from "./content/doviz-kabi";
import { pasaportKilifiSeo } from "./content/pasaport-kilifi";
import { fotografKabiSeo } from "./content/fotograf-kabi";

/**
 * Map: category slug → SeoPackage
 *
 * Add new entries as each category content file is created.
 * The category page will check this map and render <CategorySeoSection /> + JSON-LD if found.
 */
export const seoRegistry: Record<string, SeoPackage> = {
  [ruhsatKabiSeo.slug]: ruhsatKabiSeo,
  [vesikalikKabiSeo.slug]: vesikalikKabiSeo,
  [policeKabiSeo.slug]: policeKabiSeo,
  [dovizKabiSeo.slug]: dovizKabiSeo,
  [pasaportKilifiSeo.slug]: pasaportKilifiSeo,
  [fotografKabiSeo.slug]: fotografKabiSeo,
};

export function getSeoForSlug(slug: string): SeoPackage | null {
  return seoRegistry[slug] ?? null;
}
