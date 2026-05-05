import { ShoppingCart, Heart } from "lucide-react";

export default function MenuFavoritSection() {
  const menus = [
    {
      name: "Nasi Ayam Geprek",
      price: "Rp 15.000",
      color: "bg-orange-200",
      emoji: "",
    },
    {
      name: "Mie Goreng Spesial",
      price: "Rp 12.000",
      color: "bg-yellow-200",
      emoji: "",
    },
    {
      name: "Ayam Teriyaki",
      price: "Rp 16.000",
      color: "bg-orange-300",
      emoji: "",
    },
    {
      name: "Es Jeruk",
      price: "Rp 5.000",
      color: "bg-amber-100",
      emoji: "",
    },
  ];

  return (
    <section className="py-16 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Title */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Menu Favorit Minggu Ini 
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Menu paling populer yang diminati oleh pengguna Smart Kantin
          </p>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {menus.map((menu, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden hover:shadow-lg transition duration-300 transform hover:scale-105"
            >
              {/* Menu Image Placeholder */}
              <div className={`${menu.color} h-40 flex items-center justify-center text-5xl`}>
                {menu.emoji}
              </div>

              {/* Menu Info */}
              <div className="p-4">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                  {menu.name}
                </h3>
                <p className="text-blue-600 font-bold mb-4">{menu.price}</p>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center gap-2">
                    <ShoppingCart size={18} />
                    <span className="hidden sm:inline">Pesan</span>
                  </button>
                  <button className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center">
                    <Heart size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
