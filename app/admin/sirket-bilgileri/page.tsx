"use client";

import { useState, useEffect } from "react";

interface BankAccount {
  bankName: string;
  accountHolder: string;
  iban: string;
  currency: string;
}

interface CompanyForm {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  bankAccounts: BankAccount[];
  socialLinks: {
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
    youtube: string;
  };
  footerText: string;
}

const emptyBank: BankAccount = { bankName: "", accountHolder: "", iban: "", currency: "TRY" };

export default function CompanyInfoPage() {
  const [form, setForm] = useState<CompanyForm>({
    phone: "",
    whatsapp: "",
    email: "",
    address: "",
    bankAccounts: [],
    socialLinks: { facebook: "", instagram: "", twitter: "", linkedin: "", youtube: "" },
    footerText: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/company-info")
      .then((r) => r.json())
      .then((data) => {
        if (data) {
          setForm({
            phone: data.phone || "",
            whatsapp: data.whatsapp || "",
            email: data.email || "",
            address: data.address || "",
            bankAccounts: Array.isArray(data.bankAccounts) ? data.bankAccounts : [],
            socialLinks: {
              facebook: data.socialLinks?.facebook || "",
              instagram: data.socialLinks?.instagram || "",
              twitter: data.socialLinks?.twitter || "",
              linkedin: data.socialLinks?.linkedin || "",
              youtube: data.socialLinks?.youtube || "",
            },
            footerText: data.footerText || "",
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function addBank() {
    setForm((p) => ({ ...p, bankAccounts: [...p.bankAccounts, { ...emptyBank }] }));
  }

  function removeBank(idx: number) {
    setForm((p) => ({ ...p, bankAccounts: p.bankAccounts.filter((_, i) => i !== idx) }));
  }

  function updateBank(idx: number, field: keyof BankAccount, value: string) {
    setForm((p) => ({
      ...p,
      bankAccounts: p.bankAccounts.map((b, i) => (i === idx ? { ...b, [field]: value } : b)),
    }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch("/api/company-info", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      alert("Kaydedildi.");
    } catch {
      alert("Kaydetme hatasi.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#25497f]" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Firma Bilgileri</h1>
      <form onSubmit={handleSave} className="max-w-4xl space-y-6">
        {/* Contact */}
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-700">Iletisim</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label><input value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#25497f] outline-none" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label><input value={form.whatsapp} onChange={(e) => setForm((p) => ({ ...p, whatsapp: e.target.value }))} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#25497f] outline-none" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label><input value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#25497f] outline-none" /></div>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Adres</label><textarea value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} rows={3} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#25497f] outline-none" /></div>
        </div>

        {/* Bank Accounts */}
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-700">Banka Hesaplari</h2>
            <button type="button" onClick={addBank} className="px-3 py-1.5 bg-[#25497f] text-white rounded-lg text-sm hover:bg-[#1d3a66]">+ Hesap Ekle</button>
          </div>
          {form.bankAccounts.map((bank, i) => (
            <div key={i} className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Hesap {i + 1}</span>
                <button type="button" onClick={() => removeBank(i)} className="text-red-500 text-xs hover:underline">Kaldir</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input placeholder="Banka Adi" value={bank.bankName} onChange={(e) => updateBank(i, "bankName", e.target.value)} className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#25497f] outline-none" />
                <input placeholder="Hesap Sahibi" value={bank.accountHolder} onChange={(e) => updateBank(i, "accountHolder", e.target.value)} className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#25497f] outline-none" />
                <input placeholder="IBAN" value={bank.iban} onChange={(e) => updateBank(i, "iban", e.target.value)} className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#25497f] outline-none" />
                <select value={bank.currency} onChange={(e) => updateBank(i, "currency", e.target.value)} className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#25497f] outline-none">
                  <option value="TRY">TRY</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            </div>
          ))}
          {form.bankAccounts.length === 0 && <p className="text-gray-500 text-sm">Henuz hesap eklenmemis.</p>}
        </div>

        {/* Social Links */}
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-700">Sosyal Medya</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(["facebook", "instagram", "twitter", "linkedin", "youtube"] as const).map((key) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{key}</label>
                <input value={form.socialLinks[key]} onChange={(e) => setForm((p) => ({ ...p, socialLinks: { ...p.socialLinks, [key]: e.target.value } }))} placeholder={`https://${key}.com/...`} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#25497f] outline-none" />
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-700">Footer</h2>
          <textarea value={form.footerText} onChange={(e) => setForm((p) => ({ ...p, footerText: e.target.value }))} rows={3} placeholder="Footer metni..." className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#25497f] outline-none" />
        </div>

        <button type="submit" disabled={saving} className="px-6 py-2.5 bg-[#cc0636] text-white rounded-lg font-medium hover:bg-[#a80530] disabled:opacity-50 transition-colors">
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </form>
    </div>
  );
}
