import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
        404
      </h1>
      <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-4">
        Sayfa Bulunamadi
      </h2>
      <p className="text-gray-500 mb-8">
        Aradiginiz sayfa mevcut degil.
      </p>
      <Link
        href="/"
        className="inline-block px-8 py-3 rounded-lg text-white font-semibold text-lg transition-opacity hover:opacity-90"
        style={{ backgroundColor: "#cc0636" }}
      >
        Ana Sayfaya Don
      </Link>
    </div>
  );
}
