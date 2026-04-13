"use client";

interface AnchorNavProps {
  sections: { id: string; name: string; slug: string }[];
}

export default function AnchorNav({ sections }: AnchorNavProps) {
  if (sections.length <= 1) return null;

  return (
    <div className="flex flex-wrap gap-1.5 mb-4">
      {sections.map((section) => (
        <button
          key={section.id}
          type="button"
          onClick={() => {
            const el = document.getElementById(`cat-${section.slug}`);
            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          className="px-2.5 py-1 rounded text-[11px] font-medium border border-[#cc0636] text-[#cc0636] hover:bg-[#cc0636] hover:text-white transition-colors whitespace-nowrap"
        >
          {section.name}
        </button>
      ))}
    </div>
  );
}
