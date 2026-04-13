"use client";

import { useState, useEffect } from "react";

export default function SettingsPage() {
  const [exchangeRate, setExchangeRate] = useState<string>("");
  const [rateLoading, setRateLoading] = useState(false);
  const [newUser, setNewUser] = useState({ email: "", password: "", name: "", role: "EDITOR" });
  const [userSaving, setUserSaving] = useState(false);
  const [userMessage, setUserMessage] = useState("");

  useEffect(() => {
    fetchRate();
  }, []);

  async function fetchRate() {
    setRateLoading(true);
    try {
      const res = await fetch("/api/exchange-rate");
      const data = await res.json();
      setExchangeRate(data.rate || data.value || "-");
    } catch {
      setExchangeRate("Hata");
    } finally {
      setRateLoading(false);
    }
  }

  async function refreshRate() {
    setRateLoading(true);
    try {
      const res = await fetch("/api/exchange-rate", { method: "POST" });
      const data = await res.json();
      setExchangeRate(data.rate || data.value || "-");
    } catch {
      setExchangeRate("Hata");
    } finally {
      setRateLoading(false);
    }
  }

  async function createUser(e: React.FormEvent) {
    e.preventDefault();
    setUserSaving(true);
    setUserMessage("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      if (res.ok) {
        setUserMessage("Kullanici olusturuldu.");
        setNewUser({ email: "", password: "", name: "", role: "EDITOR" });
      } else {
        const data = await res.json();
        setUserMessage(data.error || "Hata olustu.");
      }
    } catch {
      setUserMessage("Hata olustu.");
    } finally {
      setUserSaving(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Ayarlar</h1>

      <div className="max-w-4xl space-y-6">
        {/* Exchange Rate */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Doviz Kuru</h2>
          <div className="flex items-center gap-4">
            <div>
              <span className="text-sm text-gray-500">USD/TRY:</span>
              <span className="ml-2 text-2xl font-bold text-gray-800">
                {rateLoading ? "..." : exchangeRate}
              </span>
            </div>
            <button
              onClick={refreshRate}
              disabled={rateLoading}
              className="px-4 py-2 bg-[#25497f] text-white rounded-lg text-sm hover:bg-[#1d3a66] disabled:opacity-50"
            >
              {rateLoading ? "Yukleniyor..." : "Guncelle"}
            </button>
          </div>
        </div>

        {/* Admin User Management */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Yeni Kullanici Olustur</h2>
          {userMessage && (
            <div className={`mb-4 px-4 py-2 rounded-lg text-sm ${userMessage.includes("Hata") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
              {userMessage}
            </div>
          )}
          <form onSubmit={createUser} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ad</label>
                <input value={newUser.name} onChange={(e) => setNewUser((p) => ({ ...p, name: e.target.value }))} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#25497f] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-posta *</label>
                <input type="email" value={newUser.email} onChange={(e) => setNewUser((p) => ({ ...p, email: e.target.value }))} required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#25497f] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sifre *</label>
                <input type="password" value={newUser.password} onChange={(e) => setNewUser((p) => ({ ...p, password: e.target.value }))} required minLength={6} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#25497f] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                <select value={newUser.role} onChange={(e) => setNewUser((p) => ({ ...p, role: e.target.value }))} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#25497f] outline-none">
                  <option value="EDITOR">Editor</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
            </div>
            <button type="submit" disabled={userSaving} className="px-4 py-2 bg-[#cc0636] text-white rounded-lg text-sm font-medium hover:bg-[#a80530] disabled:opacity-50">
              {userSaving ? "Olusturuluyor..." : "Kullanici Olustur"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
