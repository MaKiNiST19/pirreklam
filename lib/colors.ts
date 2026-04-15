/**
 * Centralized color name → CSS color mapping (Turkish color names).
 * Used by VariantSelector, VariantSummaryModal, TopFilter, etc.
 */
export const COLOR_MAP: Record<string, string> = {
  // Basic
  siyah: "#1a1a1a",
  beyaz: "#ffffff",
  kırmızı: "#e02020",
  kirmizi: "#e02020",
  kırmizı: "#e02020",
  kirmızi: "#e02020",
  mavi: "#1e6bb8",
  "açık mavi": "#62b1ff",
  "acik mavi": "#62b1ff",
  "koyu mavi": "#0d3a78",
  lacivert: "#1b2f6e",
  yeşil: "#2e7d32",
  yesil: "#2e7d32",
  "açık yeşil": "#7cb342",
  "acik yesil": "#7cb342",
  "koyu yeşil": "#1b5e20",
  "koyu yesil": "#1b5e20",
  sarı: "#f9c400",
  sari: "#f9c400",
  turuncu: "#f57c00",
  mor: "#7b1fa2",
  pembe: "#e91e8c",
  fuşya: "#d72660",
  fusya: "#d72660",
  fuchsia: "#d72660",
  magenta: "#d72660",

  // Greys
  gri: "#9e9e9e",
  "açık gri": "#d4d4d4",
  "acik gri": "#d4d4d4",
  açık_gri: "#d4d4d4",
  acik_gri: "#d4d4d4",
  "koyu gri": "#616161",
  koyu_gri: "#616161",
  koyu: "#424242",

  // Browns
  kahverengi: "#6d4c41",
  kahve: "#6d4c41",
  "açık kahve": "#a87c5f",
  "koyu kahve": "#3e2723",
  bej: "#d7ccc8",
  krem: "#f5f0e8",
  bordo: "#880e4f",
  haki: "#8d8d3a",

  // Metals
  füme: "#607d8b",
  fume: "#607d8b",
  altın: "#c8960c",
  altin: "#c8960c",
  gold: "#c8960c",
  gümüş: "#bdbdbd",
  gumus: "#bdbdbd",
  silver: "#bdbdbd",
  bronz: "#cd7f32",
  bronze: "#cd7f32",
  krom: "#c0c0c0",

  // Special
  şeffaf: "rgba(200,200,200,0.25)",
  seffaf: "rgba(200,200,200,0.25)",
  transparan: "rgba(200,200,200,0.25)",

  // Leather tones
  "siyah deri": "#1a1a1a",
  "kahve deri": "#6d4c41",
  "lacivert deri": "#1b2f6e",
  "bordo deri": "#880e4f",
};

/**
 * Get the CSS color for a Turkish color name. Falls back to neutral grey.
 */
export function getColorCss(name?: string | null): string {
  if (!name) return "#cccccc";
  return COLOR_MAP[name.toLowerCase().trim()] ?? "#cccccc";
}
