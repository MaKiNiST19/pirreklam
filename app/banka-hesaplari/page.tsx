import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import type { BankAccount } from "@/types/index";
import CopyIbanButton from "./CopyIbanButton";

export const metadata: Metadata = {
  title: "Banka Hesaplari - Pir Reklam",
  description: "Pir Reklam banka hesap bilgileri ve IBAN numaralari.",
  alternates: { canonical: "/banka-hesaplari/" },
};

export default async function BankAccountsPage() {
  const companyInfo = await prisma.companyInfo
    .findUnique({ where: { id: "singleton" } })
    .catch(() => null);

  const bankAccounts: BankAccount[] = companyInfo?.bankAccounts
    ? (companyInfo.bankAccounts as unknown as BankAccount[])
    : [];

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
        Banka Hesaplari
      </h1>

      {bankAccounts.length === 0 ? (
        <p className="text-gray-500">Banka hesap bilgisi bulunamadi.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bankAccounts.map((account, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-6 shadow border-l-4"
              style={{ borderLeftColor: "#cc0636" }}
            >
              <h2 className="text-lg font-bold text-gray-900 mb-3">
                {account.bankName}
              </h2>
              <div className="space-y-2 text-sm text-gray-700">
                <p>
                  <span className="font-medium text-gray-500">
                    Hesap Sahibi:
                  </span>{" "}
                  {account.accountHolder}
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <span className="font-medium text-gray-500">IBAN:</span>{" "}
                    <span className="font-mono text-xs">{account.iban}</span>
                  </div>
                  <CopyIbanButton iban={account.iban} />
                </div>
                <p>
                  <span className="font-medium text-gray-500">
                    Para Birimi:
                  </span>{" "}
                  {account.currency}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
