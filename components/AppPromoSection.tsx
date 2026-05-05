import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function AppPromoSection() {
  return (
    <section className="bg-gradient-to-r from-blue-500 to-blue-600 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div>
            <h2 className="text-4xl font-bold text-white mb-6">
              Pesan sekarang, ambil tanpa antre!
            </h2>
            <p className="text-blue-100 text-lg mb-8">
              Nikmati pengalaman baru memesan makanan di kantin. Lebih cepat,
              mudah, dan efisien.
            </p>

            {/* Features List */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4">
                <CheckCircle className="w-6 h-6 text-white flex-shrink-0" />
                <span className="text-white">Pesan melalui aplikasi mobile</span>
              </div>
              <div className="flex items-center gap-4">
                <CheckCircle className="w-6 h-6 text-white flex-shrink-0" />
                <span className="text-white">Bayar dengan berbagai metode</span>
              </div>
              <div className="flex items-center gap-4">
                <CheckCircle className="w-6 h-6 text-white flex-shrink-0" />
                <span className="text-white">Lacak status pesanan real-time</span>
              </div>
              <div className="flex items-center gap-4">
                <CheckCircle className="w-6 h-6 text-white flex-shrink-0" />
                <span className="text-white">Dapatkan poin reward setiap pemesanan</span>
              </div>
            </div>

            {/* CTA Button */}
            <Link
              href="/login"
              className="inline-block bg-white hover:bg-gray-100 text-blue-600 font-bold py-3 px-8 rounded-lg transition duration-300"
            >
              Mulai Sekarang
            </Link>
          </div>

          {/* Right side - Illustration */}
          <div className="flex justify-center items-center">
            <div className="relative">
              {/* Shopping Bag Icon */}
              <div className="w-48 h-48 bg-white rounded-full flex items-center justify-center shadow-2xl">
                <div className="text-7xl">
                  <span className="text-6xl">🛍️</span>
                </div>
              </div>
              {/* Floating elements */}
              <div className="absolute top-10 right-10 bg-yellow-300 rounded-full w-16 h-16 flex items-center justify-center text-3xl animate-bounce">
                ✓
              </div>
              <div className="absolute bottom-10 left-10 bg-green-300 rounded-full w-12 h-12 flex items-center justify-center text-2xl">
                ⭐
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
