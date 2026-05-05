import Link from "next/link";
import { Zap, Smartphone, Clock } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-black">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div>
            <h1 className="text-5xl lg:text-6xl font-bold mb-4">
              <span className="text-blue-600">SMART</span>{" "}
              <span className="text-gray-900 dark:text-white">KANTIN</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed">
              Platform digital untuk memesan makanan kantin dengan cepat, mudah,
              dan tanpa antre.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-3 gap-6 mb-12">
              <div className="text-center">
                <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Cepat</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Pesan dalam hitungan detik
                </p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Mudah</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Interface mudah digunakan
                </p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                  Tanpa Antre
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Lebih efisien waktu
                </p>
              </div>
            </div>

            {/* Login Section */}
            <div>
              <p className="text-gray-700 dark:text-gray-300 mb-4 font-medium">
                Welcome to Smartkantin click button login here
              </p>
              <Link
                href="/pembeli/login"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300 w-full lg:w-auto text-center"
              >
                 Login
              </Link>
              <p className="text-gray-600 dark:text-gray-400 mt-4">
                atau{" "}
                <Link
                  href="/pembeli/register/"
                  className="text-blue-600 hover:text-blue-700 font-semibold dark:text-blue-400"
                >
                  Daftar di sini
                </Link>
              </p>
            </div>
          </div>

          {/* Right side - Phone Mockup */}
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative">
              {/* Phone Frame */}
              <div className="w-80 bg-black rounded-3xl border-8 border-gray-800 shadow-2xl overflow-hidden">
                {/* Phone Screen */}
                <div className="bg-white rounded-2xl m-2 overflow-hidden">
                  {/* Status Bar */}
                  <div className="bg-gradient-to-r from-blue-50 to-white px-6 py-3 flex justify-between items-center text-xs font-semibold text-gray-900 border-b">
                    <span>9:41</span>
                    <div className="flex gap-1">
                      <div className="w-4 h-3 border border-gray-900 rounded-sm flex items-center justify-center">
                        <div className="w-2 h-1 bg-gray-900"></div>
                      </div>
                      <span>📶</span>
                      <span>🔋</span>
                    </div>
                  </div>

                  {/* Screen Content */}
                  <div className="p-6 bg-gray-50 min-h-96">
                    <div className="mb-6">
                      <h2 className="text-xl font-bold text-gray-900">
                        Hai Stranger
                      </h2>
                      <p className="text-sm text-gray-600">
                        Mau makan apa hari ini?
                      </p>
                    </div>

                    {/* Search Bar */}
                    <div className="bg-white rounded-lg p-3 mb-6 border border-gray-200">
                      <p className="text-sm text-gray-500">
                        Cari makanan atau minuman...
                      </p>
                    </div>

                    {/* Promo Banner */}
                    <div className="bg-blue-600 text-white rounded-lg p-4 mb-6">
                      <h3 className="font-bold text-sm">Diskon Spesial Hari Ini!</h3>
                      <p className="text-xs">Diskon hingga 30% untuk semua menu</p>
                      <button className="mt-2 bg-white text-blue-600 px-3 py-1 rounded text-xs font-bold">
                        Lihat Promo
                      </button>
                    </div>

                    {/* Menu Items */}
                    <h3 className="font-bold text-gray-900 mb-3">Menu Populer</h3>
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <div className="w-12 h-12 bg-orange-200 rounded"></div>
                        <div className="flex-1">
                          <p className="text-xs font-bold text-gray-900">
                            Nasi Ayam Geprek
                          </p>
                          <p className="text-xs text-gray-600">Rp 15.000</p>
                        </div>
                        <button className="bg-blue-600 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center">
                          +
                        </button>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-12 h-12 bg-yellow-200 rounded"></div>
                        <div className="flex-1">
                          <p className="text-xs font-bold text-gray-900">
                            Mie Goreng Spesial
                          </p>
                          <p className="text-xs text-gray-600">Rp 12.000</p>
                        </div>
                        <button className="bg-blue-600 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center">
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Navigation */}
                  <div className="bg-white border-t border-gray-200 px-6 py-4 flex justify-around items-center text-center">
                    <div className="text-xs text-gray-600">
                      <span className="text-lg">🏠</span>
                      <p className="text-xs">Beranda</p>
                    </div>
                    <div className="text-xs text-gray-600">
                      <span className="text-lg">📋</span>
                      <p className="text-xs">Pesanan</p>
                    </div>
                    <div className="text-xs text-gray-600">
                      <span className="text-lg">🛒</span>
                      <p className="text-xs">Keranjang</p>
                    </div>
                    <div className="text-xs text-gray-600">
                      <span className="text-lg">👤</span>
                      <p className="text-xs">Profil</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
