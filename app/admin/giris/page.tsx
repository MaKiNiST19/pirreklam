"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      console.log("[LOGIN] Attempting sign in for:", email);
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      console.log("[LOGIN] signIn result:", JSON.stringify(res));
      if (res?.error) {
        console.error("[LOGIN] Error:", res.error, "Status:", res.status);
        setError("E-posta veya sifre hatali. (" + res.error + ")");
      } else if (res?.ok) {
        console.log("[LOGIN] Success, redirecting to /admin");
        router.push("/admin");
        router.refresh();
      } else {
        console.error("[LOGIN] Unexpected result:", res);
        setError("Beklenmeyen bir hata olustu.");
      }
    } catch (err) {
      console.error("[LOGIN] Exception:", err);
      setError("Bir hata olustu. Tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#25497f]">Pir Reklam</h1>
        <p className="text-gray-500 mt-2">Yonetim Paneli</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25497f] focus:border-transparent outline-none"
            placeholder="admin@pirreklam.com.tr"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sifre</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25497f] focus:border-transparent outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-[#cc0636] text-white rounded-lg font-medium hover:bg-[#a80530] disabled:opacity-50 transition-colors"
        >
          {loading ? "Giris yapiliyor..." : "Giris Yap"}
        </button>
      </form>
    </div>
  );
}
