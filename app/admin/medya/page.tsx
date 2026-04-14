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

export default function MediaLibraryPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/media");
      const data = await res.json();
      setFiles(Array.isArray(data) ? data : []);
    } catch { setFiles([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const fileList = Array.from(e.target.files || []);
    if (!fileList.length) return;
    setUploading(true);
    for (const file of fileList) {
      try {
        await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
          method: "POST", body: file,
        });
      } catch { /* continue */ }
    }
    setUploading(false);
    e.target.value = "";
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu dosyayı silmek istediğinize emin misiniz?")) return;
    await fetch(`/api/media/${id}`, { method: "DELETE" });
    load();
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#25497f]" />
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Medya Kütüphanesi</h1>
          <p className="text-sm text-gray-500 mt-0.5">{files.length} dosya</p>
        </div>
        <label className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium text-white ${uploading ? "bg-gray-400" : "bg-[#cc0636] hover:bg-[#a80530]"}`}>
          {uploading ? "Yükleniyor..." : "↑ Dosya Yükle"}
          <input type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>

      {files.length === 0 ? (
        <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 py-20 text-center">
          <svg className="w-16 h-16 text-gray-200 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-400">Henüz dosya yüklenmedi</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
          {files.map((file) => (
            <div key={file.id} className="group relative bg-white rounded-xl border shadow-sm overflow-hidden">
              <div className="relative aspect-square">
                <Image src={file.url} alt={file.filename} fill className="object-cover" />
              </div>
              <div className="p-2">
                <p className="text-xs text-gray-500 truncate" title={file.filename}>{file.filename}</p>
              </div>
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                <button
                  onClick={() => copyUrl(file.url)}
                  className="px-3 py-1.5 bg-white text-gray-800 rounded-lg text-xs font-medium hover:bg-gray-100"
                >
                  {copied === file.url ? "✓ Kopyalandı" : "URL Kopyala"}
                </button>
                <button
                  onClick={() => handleDelete(file.id)}
                  className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600"
                >
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
