"use client";

import { useState } from "react";

export default function CopyIbanButton({ iban }: { iban: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(iban);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const el = document.createElement("textarea");
      el.value = iban;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="shrink-0 px-3 py-1 text-xs rounded border border-gray-300 hover:bg-gray-100 transition-colors"
      title="IBAN Kopyala"
    >
      {copied ? "Kopyalandi!" : "Kopyala"}
    </button>
  );
}
