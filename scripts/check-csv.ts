import { parse } from "csv-parse/sync";
import * as fs from "fs";
const rows = parse(
  fs.readFileSync(
    "C:\\Users\\Alp Tek Bilişim\\Downloads\\wc-product-export-16-4-2026-1776289553614.csv",
    "utf-8",
  ),
  { columns: true, skip_empty_lines: true, relax_column_count: true, bom: true },
) as Record<string, string>[];
const parents = rows.filter((r) => r["Tür"] === "variable" || r["Tür"] === "simple");
console.log("parents:", parents.length);
const byTitle = new Map<string, Record<string, string>[]>();
parents.forEach((p) => {
  const t = (p["İsim"] || "").trim();
  if (!byTitle.has(t)) byTitle.set(t, []);
  byTitle.get(t)!.push(p);
});
console.log("\nTitles with duplicates in CSV:");
let n = 0;
for (const [t, arr] of byTitle) {
  if (arr.length > 1) {
    n++;
    console.log(`${n}. "${t}" x${arr.length}  IDs=${arr.map((r) => r["Kimlik"]).join(",")}`);
  }
}
console.log("\ntotal duplicate-title groups in CSV:", n);
