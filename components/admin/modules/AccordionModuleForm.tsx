"use client";

interface Item { question: string; answer: string }
interface Data { items: Item[] }

export default function AccordionModuleForm({ data, onChange }: { data: Data; onChange: (d: Data) => void }) {
  const items: Item[] = data.items || [];

  function addItem() { onChange({ items: [...items, { question: "", answer: "" }] }); }
  function removeItem(i: number) { onChange({ items: items.filter((_, idx) => idx !== i) }); }
  function update(i: number, patch: Partial<Item>) {
    onChange({ items: items.map((item, idx) => idx === i ? { ...item, ...patch } : item) });
  }

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="border rounded-lg p-3 space-y-2 bg-gray-50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-600">Madde {i + 1}</span>
            <button onClick={() => removeItem(i)} className="text-red-500 text-xs hover:underline">Sil</button>
          </div>
          <input placeholder="Soru / Başlık" value={item.question} onChange={(e) => update(i, { question: e.target.value })} className="w-full px-2 py-1.5 text-sm border rounded focus:ring-1 focus:ring-[#25497f] outline-none" />
          <textarea placeholder="Cevap / İçerik" value={item.answer} onChange={(e) => update(i, { answer: e.target.value })} rows={3} className="w-full px-2 py-1.5 text-sm border rounded focus:ring-1 focus:ring-[#25497f] outline-none" />
        </div>
      ))}
      <button onClick={addItem} className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-[#25497f] hover:text-[#25497f]">
        + Madde Ekle
      </button>
    </div>
  );
}
