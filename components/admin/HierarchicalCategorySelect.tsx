"use client";

import { useState, useRef, useEffect } from "react";

interface Category {
  id: string;
  name: string;
  parentId?: string | null;
}

interface TreeNode {
  id: string;
  name: string;
  children: TreeNode[];
  depth: number;
}

interface Props {
  categories: Category[];
  value: string;
  onChange: (id: string) => void;
}

function buildTree(categories: Category[]): TreeNode[] {
  const map = new Map<string, TreeNode>();
  const roots: TreeNode[] = [];

  for (const cat of categories) {
    map.set(cat.id, { id: cat.id, name: cat.name, children: [], depth: 0 });
  }

  for (const cat of categories) {
    const node = map.get(cat.id)!;
    if (cat.parentId && map.has(cat.parentId)) {
      const parent = map.get(cat.parentId)!;
      node.depth = parent.depth + 1;
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

function flatten(nodes: TreeNode[]): TreeNode[] {
  const result: TreeNode[] = [];
  function walk(list: TreeNode[]) {
    for (const n of list) {
      result.push(n);
      walk(n.children);
    }
  }
  walk(nodes);
  return result;
}

export default function HierarchicalCategorySelect({ categories, value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const tree = buildTree(categories);
  const flat = flatten(tree);

  const filtered = search
    ? flat.filter((n) => n.name.toLowerCase().includes(search.toLowerCase()))
    : flat;

  const selectedName = categories.find((c) => c.id === value)?.name || "Kategori Seçin";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-left text-sm bg-white hover:border-gray-400 focus:ring-2 focus:ring-[#25497f] outline-none flex items-center justify-between"
      >
        <span className={value ? "text-gray-900" : "text-gray-400"}>
          {selectedName}
        </span>
        <svg className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 z-30 bg-white border border-gray-200 rounded-lg shadow-lg max-h-72 flex flex-col">
          <div className="p-2 border-b border-gray-100">
            <input
              type="text"
              placeholder="Kategori ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-1.5 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-[#25497f] outline-none"
              autoFocus
            />
          </div>
          <div className="overflow-y-auto flex-1">
            <button
              type="button"
              onClick={() => { onChange(""); setOpen(false); setSearch(""); }}
              className={`w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50 ${!value ? "bg-blue-50 text-[#25497f] font-medium" : "text-gray-500"}`}
            >
              Kategori Seçin
            </button>
            {filtered.map((node) => (
              <button
                key={node.id}
                type="button"
                onClick={() => { onChange(node.id); setOpen(false); setSearch(""); }}
                className={`w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50 ${value === node.id ? "bg-blue-50 text-[#25497f] font-medium" : "text-gray-700"}`}
                style={{ paddingLeft: `${12 + node.depth * 20}px` }}
              >
                {node.depth > 0 && <span className="text-gray-300 mr-1">{"└ "}</span>}
                {node.name}
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="px-3 py-2 text-sm text-gray-400">Sonuç bulunamadı</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
