"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Clock3, ShoppingBag, ShoppingCart, TrendingUp, Wallet } from "lucide-react";

import { getBuyerOrdersAction, getCartAction, getCurrentUserAction } from "@/app/api/actions";

type DashboardOrder = {
  id: string;
  status: string;
  totalPrice: number;
  createdAt: string;
  items: Array<{ id: string; quantity: number; menu?: { name?: string } }>;
};

type CurrentUser = {
  id: string;
  role: string;
  pembeli?: {
    id: string;
    fullName: string;
    phone: string;
    address?: string | null;
  } | null;
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [orders, setOrders] = useState<DashboardOrder[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      const session = await getCurrentUserAction();

      if (!session.success || !session.data || session.data.role !== "PEMBELI") {
        router.replace("/pembeli/login");
        return;
      }

      const currentUser = session.data as CurrentUser;
      setUser(currentUser);

      const pembeliId = currentUser.pembeli?.id;
      if (!pembeliId) {
        router.replace("/pembeli/login");
        return;
      }

      const [ordersResult, cartResult] = await Promise.all([
        getBuyerOrdersAction(pembeliId),
        getCartAction(pembeliId),
      ]);

      setOrders((ordersResult.success ? (ordersResult.data as DashboardOrder[]) : []).slice(0, 3));
      setCartCount(cartResult.success && cartResult.data ? cartResult.data.totalQuantity || 0 : 0);
      setIsLoading(false);
    };

    loadDashboard();
  }, [router]);

  const { stats, recentOrders } = useMemo(() => {
    if (!user) {
      return {
        stats: {
          totalOrders: 0,
          completedOrders: 0,
          pendingOrders: 0,
          totalSpent: 0,
        },
        recentOrders: [] as DashboardOrder[],
      };
    }

    const completedOrders = orders.filter((order) => order.status === "COMPLETED" || order.status === "completed");
    const pendingOrders = orders.filter(
      (order) => order.status === "PENDING" || order.status === "CONFIRMED" || order.status === "PREPARING" || order.status === "pending" || order.status === "confirmed" || order.status === "preparing",
    );

    const totalSpent = completedOrders.reduce((accumulator, order) => accumulator + order.totalPrice, 0);

    return {
      stats: {
        totalOrders: orders.length,
        completedOrders: completedOrders.length,
        pendingOrders: pendingOrders.length,
        totalSpent,
      },
      recentOrders: [...orders].reverse(),
    };
  }, [orders, user]);

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  const statCards = [
    { label: "Total Pesanan", value: stats.totalOrders, icon: ShoppingBag, tone: "bg-blue-600" },
    { label: "Menunggu", value: stats.pendingOrders, icon: Clock3, tone: "bg-amber-500" },
    { label: "Selesai", value: stats.completedOrders, icon: TrendingUp, tone: "bg-emerald-600" },
    { label: "Total Pengeluaran", value: `Rp ${stats.totalSpent.toLocaleString("id-ID")}`, icon: Wallet, tone: "bg-slate-900" },
  ];

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-8 px-4 py-6 sm:px-6 lg:px-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/90 p-6 shadow-[0_18px_60px_-36px_rgba(15,23,42,0.55)] backdrop-blur dark:border-slate-800 dark:bg-slate-950/85">
        <div className="absolute inset-y-0 right-0 w-1/3 bg-linear-to-l from-blue-500/10 to-transparent" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <p className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-200">
              Dashboard pembeli
            </p>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white md:text-4xl">
                Selamat datang, {user.pembeli?.fullName}! 👋
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
                Ringkasan pesanan, pengeluaran, dan akses cepat ke menu favorit Anda ada di sini.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => router.push("/pembeli/dashboard/menu")}
              className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
            >
              Lihat menu <ArrowRight className="h-4 w-4" />
            </button>
            {cartCount > 0 && (
              <button
                onClick={() => router.push("/pembeli/dashboard/keranjang")}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition duration-300 hover:border-blue-300 hover:text-blue-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              >
                <ShoppingCart className="h-4 w-4" /> Keranjang {cartCount}
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-[0_18px_52px_-32px_rgba(15,23,42,0.45)] dark:border-slate-800 dark:bg-slate-950/80">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
                <p className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">{value}</p>
              </div>
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${tone} text-white shadow-lg`}>
                <Icon size={22} />
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[2rem] border border-slate-200/80 bg-white/90 p-6 shadow-[0_18px_52px_-32px_rgba(15,23,42,0.45)] dark:border-slate-800 dark:bg-slate-950/80">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Aksi cepat</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Masuk ke area yang paling sering dipakai.</p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <button
              onClick={() => router.push("/pembeli/dashboard/menu")}
              className="group rounded-3xl border border-blue-200/60 bg-linear-to-br from-blue-600 to-blue-700 p-5 text-left text-white shadow-[0_18px_48px_-30px_rgba(37,99,235,0.7)] transition duration-300 hover:-translate-y-1"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-100">Menu makanan</p>
              <h3 className="mt-3 text-lg font-semibold">Jelajahi menu</h3>
              <p className="mt-2 text-sm leading-6 text-blue-100">Lihat pilihan makanan dari penjual yang tersedia.</p>
            </button>

            {cartCount > 0 && (
              <button
                onClick={() => router.push("/pembeli/dashboard/keranjang")}
                className="group rounded-3xl border border-emerald-200/60 bg-linear-to-br from-emerald-600 to-emerald-700 p-5 text-left text-white shadow-[0_18px_48px_-30px_rgba(16,185,129,0.55)] transition duration-300 hover:-translate-y-1"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-100">Keranjang</p>
                <h3 className="mt-3 text-lg font-semibold">Lanjutkan pesanan</h3>
                <p className="mt-2 text-sm leading-6 text-emerald-100">Ada {cartCount} item yang siap diproses.</p>
              </button>
            )}
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200/80 bg-white/90 p-6 shadow-[0_18px_52px_-32px_rgba(15,23,42,0.45)] dark:border-slate-800 dark:bg-slate-950/80">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Pesanan terbaru</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Tiga transaksi terakhir Anda.</p>
            </div>
          </div>

          {recentOrders.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 text-center dark:border-slate-800 dark:bg-slate-900">
              <ShoppingBag className="h-10 w-10 text-slate-400" />
              <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Belum ada pesanan. Mulai pesan sekarang.</p>
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-blue-200 hover:shadow-sm dark:border-slate-800 dark:bg-slate-950">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-950 dark:text-white">Pesanan #{order.id.slice(0, 8)}</p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {order.items.length} item • {new Date(order.createdAt).toLocaleDateString("id-ID")}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        order.status === "COMPLETED" || order.status === "completed"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200"
                          : order.status === "CANCELLED" || order.status === "cancelled"
                            ? "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-200"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-200"
                      }`}
                    >
                      {order.status === "COMPLETED" || order.status === "completed"
                        ? "Selesai"
                        : order.status === "PENDING" || order.status === "pending"
                          ? "Menunggu"
                          : order.status === "CONFIRMED" || order.status === "confirmed"
                            ? "Dikonfirmasi"
                            : order.status === "PREPARING" || order.status === "preparing"
                              ? "Disiapkan"
                              : order.status === "READY" || order.status === "ready"
                                ? "Siap diambil"
                                : "Dibatalkan"}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Total</p>
                    <p className="text-sm font-semibold text-slate-950 dark:text-white">Rp {order.totalPrice.toLocaleString("id-ID")}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => router.push("/pembeli/dashboard/pesanan")}
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-300"
          >
            Lihat semua pesanan <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
}