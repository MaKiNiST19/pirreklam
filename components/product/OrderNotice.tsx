export default function OrderNotice() {
  return (
    <div className="mt-3 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2.5 text-[12px] leading-relaxed text-gray-700">
      <p className="font-bold text-[#cc0636] mb-0.5">Sepete Eklemeden Önce !</p>
      <p>
        Sipariş detayı, Faturalandırma, Ödeme vb. farklı talepleriniz için;{" "}
        <a href="tel:+905442338003" className="font-bold text-[#25497f] hover:underline">
          0544 233 80 03
        </a>{" "}
        arayınız.
      </p>
    </div>
  );
}
