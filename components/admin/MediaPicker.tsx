"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface MediaFile {
  id: string;
  url: string;
  filename: string;
  mimeType: string | null;
  createdAt: string;
}

interface Props {
  onSelect: (url: string) => void;
  onClose: () => void;
  currentUrl?: string;
}

export default function MediaPicker({ onSelect, onClose, currentUrl }: Props) {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState<string>(currentUrl || "");
  const [tab, setTab] = useState<"library" | "upload">("library");

  const loadFiles = useCallback(async () => {
    try {
      const res = await fetch("/api/media");
      const data = await res.json();
      setFiles(Array.isArray(data) ? data : []);
    } catch {
      setFiles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadFiles(); }, [loadFiles]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: "POST",
        body: file,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        await loadFiles();
        setSelected(data.url);
        setTab("library");
      } else {
        alert("Yükleme başarısız: " + (data.details || data.error || "Bilinmeyen hata"));
      }
    } catch {
      alert("Yükleme hatası.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleDelete(id: string, url: string) {
    if (!confirm("Bu görseli silmek istediğinize emin misiniz?")) return;
    await fetch(`/api/media/${id}`, { method: "DELETE" });
    if (selected === url) setSelected("");
    loadFiles();
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Medya Kütüphanesi</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-bold">×</button>
        </div>

        {/* Tabs */}
        <div className="flex border-b px-6">
          <button
            onClick={() => setTab("library")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === "library" ? "border-[#25497f] text-[#25497f]" : "border-transparent text-gray-500 hover:text-gray-700"}`}
          >
            Kütüphane
          </button>
          <button
            onClick={() => setTab("upload")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === "upload" ? "border-[#25497f] text-[#25497f]" : "border-transparent text-gray-500 hover:text-gray-700"}`}
          >
            Yeni Yükle
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {tab === "upload" ? (
            <div className="flex flex-col items-center justify-center min-h-[200px] border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
              {uploading ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#25497f]" />
                  <p className="text-sm text-gray-500">Yükleniyor...</p>
                </div>
              ) : (
                <>
                  <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm text-gray-600 mb-3">Görsel seçin veya sürükleyin</p>
                  <label className="cursor-pointer px-4 py-2 bg-[#25497f] text-white rounded-lg text-sm hover:bg-[#1d3a66]">
                    Bilgisayardan Seç
                    <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                  </label>
                  <p className="text-xs text-gray-400 mt-2">JPG, PNG, WEBP, GIF desteklenir</p>
                </>
              )}
            </div>
          ) : (
            <>
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#25497f]" />
                </div>
              ) : files.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <p>Henüz görsel yok.</p>
                  <button onClick={() => setTab("upload")} className="mt-2 text-sm text-[#25497f] underline">İlk görseli yükle</button>
                </div>
              ) : (
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      onClick={() => setSelected(file.url)}
                      className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all group ${selected === file.url ? "border-[#25497f] ring-2 ring-[#25497f]/30" : "border-transparent hover:border-gray-300"}`}
                    >
                      <Image src={file.url} alt={file.filename} fill className="object-cover" />
                      {selected === file.url && (
                        <div className="absolute inset-0 bg-[#25497f]/20 flex items-center justify-center">
                          <svg className="w-6 h-6 text-white drop-shadow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(file.id, file.url); }}
                        className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs hidden group-hover:flex items-center justify-center font-bold leading-none"
                      >×</button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50 rounded-b-xl">
          <p className="text-sm text-gray-500">
            {selected ? <span className="text-[#25497f] font-medium">Seçili: 1 görsel</span> : "Bir görsel seçin"}
          </p>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-100">
              İptal
            </button>
            <button
              onClick={() => { if (selected) { onSelect(selected); onClose(); } }}
              disabled={!selected}
              className="px-4 py-2 bg-[#25497f] text-white rounded-lg text-sm disabled:opacity-40 hover:bg-[#1d3a66]"
            >
              Seç
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
