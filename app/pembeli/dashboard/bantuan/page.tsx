export default function HelpPage() {
  const faqs = [
    { q: "Bagaimana cara memesan?", a: "Pilih menu, tambah ke keranjang, lalu checkout." },
    { q: "Berapa lama pengiriman?", a: "30-45 menit dari konfirmasi pesanan." },
    { q: "Ada biaya pengiriman?", a: "Gratis untuk semua pesanan di area kampus." },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Pusat Bantuan</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center">
          <h3 className="font-bold text-gray-900 mb-2">Telepon</h3>
          <a href="tel:081234567890" className="text-blue-600 font-bold hover:underline">
            081234567890
          </a>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center">
          <h3 className="font-bold text-gray-900 mb-2">Email</h3>
          <a href="mailto:admin@kantinpintar.com" className="text-blue-600 font-bold hover:underline">
            admin@kantinpintar.com
          </a>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center">
          <h3 className="font-bold text-gray-900 mb-2">Chat</h3>
          <button className="text-blue-600 font-bold hover:underline">
            Buka Chat
          </button>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">FAQ</h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <details key={idx} className="border border-gray-200 rounded-lg p-4 cursor-pointer">
              <summary className="font-semibold text-gray-900">{faq.q}</summary>
              <p className="mt-2 text-gray-600 text-sm">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}