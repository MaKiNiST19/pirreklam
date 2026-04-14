"use client";

interface Data { title?: string; body?: string; alignment?: string }

export default function TextModuleForm({ data, onChange }: { data: Data; onChange: (d: Data) => void }) {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs text-gray-500 mb-1">Başlık</label>
        <input value={data.title || ""} onChange={(e) => onChange({ ...data, title: e.target.value })} className="w-full px-2 py-1.5 text-sm border rounded focus:ring-1 focus:ring-[#25497f] outline-none" />
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">İçerik (HTML destekler)</label>
        <textarea value={data.body || ""} onChange={(e) => onChange({ ...data, body: e.target.value })} rows={8} className="w-full px-2 py-1.5 text-sm border rounded focus:ring-1 focus:ring-[#25497f] outline-none font-mono" />
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">Hizalama</label>
        <div className="flex gap-3">
          {(["left", "center", "right"] as const).map((a) => (
            <label key={a} className="flex items-center gap-1.5 text-sm cursor-pointer">
              <input type="radio" checked={(data.alignment || "left") === a} onChange={() => onChange({ ...data, alignment: a })} />
              {a === "left" ? "Sol" : a === "center" ? "Orta" : "Sağ"}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
