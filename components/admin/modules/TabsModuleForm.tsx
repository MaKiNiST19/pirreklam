"use client";

interface Tab { title: string; content: string }
interface Data { tabs: Tab[] }

export default function TabsModuleForm({ data, onChange }: { data: Data; onChange: (d: Data) => void }) {
  const tabs: Tab[] = data.tabs || [];

  function addTab() { onChange({ tabs: [...tabs, { title: "", content: "" }] }); }
  function removeTab(i: number) { onChange({ tabs: tabs.filter((_, idx) => idx !== i) }); }
  function update(i: number, patch: Partial<Tab>) {
    onChange({ tabs: tabs.map((t, idx) => idx === i ? { ...t, ...patch } : t) });
  }

  return (
    <div className="space-y-3">
      {tabs.map((tab, i) => (
        <div key={i} className="border rounded-lg p-3 space-y-2 bg-gray-50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-600">Tab {i + 1}</span>
            <button onClick={() => removeTab(i)} className="text-red-500 text-xs hover:underline">Sil</button>
          </div>
          <input placeholder="Tab başlığı" value={tab.title} onChange={(e) => update(i, { title: e.target.value })} className="w-full px-2 py-1.5 text-sm border rounded focus:ring-1 focus:ring-[#25497f] outline-none" />
          <textarea placeholder="Tab içeriği (HTML destekler)" value={tab.content} onChange={(e) => update(i, { content: e.target.value })} rows={4} className="w-full px-2 py-1.5 text-sm border rounded focus:ring-1 focus:ring-[#25497f] outline-none font-mono" />
        </div>
      ))}
      <button onClick={addTab} className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-[#25497f] hover:text-[#25497f]">
        + Tab Ekle
      </button>
    </div>
  );
}
