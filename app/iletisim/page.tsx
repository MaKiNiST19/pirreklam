import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Iletisim - Pir Reklam",
  description:
    "Pir Reklam iletisim bilgileri. Adres, telefon ve iletisim formu.",
  alternates: { canonical: "/iletisim/" },
};

export default async function ContactPage() {
  const companyInfo = await prisma.companyInfo
    .findUnique({ where: { id: "singleton" } })
    .catch(() => null);

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
        Iletisim
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Contact Form */}
        <div>
          <ContactForm />
        </div>

        {/* Company Info + Map */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Iletisim Bilgileri
            </h2>

            <div className="space-y-3 text-gray-700">
              {companyInfo?.address && (
                <div className="flex gap-2">
                  <svg
                    className="h-5 w-5 text-[#cc0636] shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <p>{companyInfo.address}</p>
                </div>
              )}

              <div className="flex gap-2 items-center">
                <svg
                  className="h-5 w-5 text-[#cc0636] shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <p className="font-semibold">444 10 30</p>
              </div>

              {companyInfo?.email && (
                <div className="flex gap-2 items-center">
                  <svg
                    className="h-5 w-5 text-[#cc0636] shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <a
                    href={`mailto:${companyInfo.email}`}
                    className="text-[#cc0636] hover:underline"
                  >
                    {companyInfo.email}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Google Maps Placeholder */}
          <div className="rounded-xl overflow-hidden shadow">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3010.0!2d29.0!3d41.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDAwJzAwLjAiTiAyOcKwMDAnMDAuMCJF!5e0!3m2!1str!2str!4v1"
              width="100%"
              height="350"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Pir Reklam Konum"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
