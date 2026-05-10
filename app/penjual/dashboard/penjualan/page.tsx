"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDownToLine, Banknote, CreditCard, FileSpreadsheet, FileText, RefreshCw, ReceiptText, TrendingUp } from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

import SalesChart from "@/components/penjual/SalesChart";
import { getCurrentUserAction, getSellerOrdersAction } from "@/app/api/actions";

type OrderItem = {
  menuId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  menu?: {
    id: string;
    name: string;
  };
};

type Order = {
  id: string;
  transactionCode?: string;
  items: OrderItem[];
  totalPrice: number;
  subtotal?: number;
  tax?: number;
  discountAmount?: number;
  shippingCost?: number;
  status: string;
  paymentMethod?: string;
  createdAt: string;
  completedAt?: string;
  pembeli?: {
    fullName?: string;
    phone?: string;
  };
};

type SellerSession = {
  id: string;
  role: string;
  fullName?: string;
  businessName?: string;
  penjual?: {
    id: string;
    businessName?: string;
  } | null;
};

const currency = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

function formatCurrency(value: number) {
  return currency.format(value || 0);
}

function formatShortDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
  }).format(new Date(value));
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function normalizeStatus(status: string) {
  return status.toUpperCase();
}

function statusBadge(status: string) {
  const normalized = normalizeStatus(status);
  if (normalized === "COMPLETED") {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }
  if (normalized === "READY") {
    return "bg-sky-50 text-sky-700 border-sky-200";
  }
  if (normalized === "CONFIRMED" || normalized === "PREPARING") {
    return "bg-amber-50 text-amber-700 border-amber-200";
  }
  if (normalized === "CANCELLED") {
    return "bg-rose-50 text-rose-700 border-rose-200";
  }
  return "bg-slate-50 text-slate-700 border-slate-200";
}

function statusLabel(status: string) {
  const normalized = normalizeStatus(status);
  if (normalized === "COMPLETED") return "Selesai";
  if (normalized === "READY") return "Siap";
  if (normalized === "CONFIRMED") return "Dikonfirmasi";
  if (normalized === "PREPARING") return "Disiapkan";
  if (normalized === "CANCELLED") return "Dibatalkan";
  return normalized;
}

export default function PenjualanPage() {
  const router = useRouter();
  const [seller, setSeller] = useState<SellerSession | null>(null);
  const [penjualId, setPenjualId] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [month, setMonth] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [exportingExcel, setExportingExcel] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [error, setError] = useState("");
  const [costRate, setCostRate] = useState(35);

  const loadData = useCallback(
    async (showInitialLoading = false) => {
      if (showInitialLoading) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setError("");

      try {
        const userRes = await getCurrentUserAction();
        const sellerProfileId = userRes.data?.penjual?.id;

        if (!userRes.success || userRes.data?.role !== "PENJUAL" || !sellerProfileId) {
          router.push("/penjual/login");
          return;
        }

        setSeller(userRes.data as SellerSession);
        setPenjualId(sellerProfileId);

        const ordersRes = await getSellerOrdersAction(sellerProfileId);
        if (ordersRes.success) {
          setOrders((ordersRes.data || []) as Order[]);
        } else {
          setError(ordersRes.message || "Gagal memuat reporting penjualan");
        }
      } catch (err) {
        console.error(err);
        setError("Gagal memuat reporting penjualan");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [router],
  );

  useEffect(() => {
    loadData(true);
    const timer = window.setInterval(() => {
      loadData(false);
    }, 30000);

    return () => window.clearInterval(timer);
  }, [loadData]);

  const completedOrders = useMemo(
    () => orders.filter((order) => normalizeStatus(order.status) === "COMPLETED"),
    [orders],
  );
  const pendingOrders = useMemo(
    () => orders.filter((order) => normalizeStatus(order.status) === "PENDING"),
    [orders],
  );
  const processingOrders = useMemo(
    () => orders.filter((order) => ["CONFIRMED", "PREPARING", "READY"].includes(normalizeStatus(order.status))),
    [orders],
  );

  const totalRevenue = useMemo(
    () => completedOrders.reduce((accumulator, order) => accumulator + (order.totalPrice || 0), 0),
    [completedOrders],
  );
  const totalCashFlow = useMemo(
    () => orders.reduce((accumulator, order) => accumulator + (normalizeStatus(order.status) === "CANCELLED" ? 0 : order.totalPrice || 0), 0),
    [orders],
  );
  const totalTickets = completedOrders.length;
  const averageOrderValue = totalTickets > 0 ? totalRevenue / totalTickets : 0;
  // Compute real cost using menu.cost when available; fallback to costRate percentage
  const totalItemCost = useMemo(() => {
    const source = completedOrders;
    return source.reduce((sum, order) => {
      const itemsCost = (order.items || []).reduce((s, item: any) => {
        const unitCost = item.menu?.cost ?? (item.unitPrice * (costRate / 100));
        return s + (unitCost * (item.quantity || 0));
      }, 0);
      return sum + itemsCost;
    }, 0);
  }, [completedOrders, costRate]);

  const estimatedCost = totalItemCost;
  const estimatedProfit = totalRevenue - estimatedCost;
  const cashOrdersValue = useMemo(
    () => completedOrders.filter((order) => (order.paymentMethod || "").toUpperCase() === "CASH").reduce((accumulator, order) => accumulator + (order.totalPrice || 0), 0),
    [completedOrders],
  );
  const nonCashOrdersValue = totalRevenue - cashOrdersValue;

  const revenueTrend = useMemo(() => {
    const today = new Date();
    const days: Date[] = [];

    for (let index = 6; index >= 0; index -= 1) {
      const date = new Date(today);
      date.setDate(today.getDate() - index);
      date.setHours(0, 0, 0, 0);
      days.push(date);
    }

    return days.map((date) => {
      const value = completedOrders
        .filter((order) => {
          const orderDate = new Date(order.completedAt || order.createdAt);
          orderDate.setHours(0, 0, 0, 0);
          return orderDate.getTime() === date.getTime();
        })
        .reduce((accumulator, order) => accumulator + (order.totalPrice || 0), 0);

      return {
        label: new Intl.DateTimeFormat("id-ID", { weekday: "short" }).format(date),
        value,
      };
    });
  }, [completedOrders]);

  

  // Apply client-side filters (date range, month, search)
  const filteredOrders = useMemo(() => {
    let list = orders.slice();

    if (month) {
      // month format YYYY-MM
      const [y, m] = month.split("-").map(Number);
      const start = new Date(y, m - 1, 1);
      const end = new Date(y, m, 0, 23, 59, 59, 999);
      list = list.filter((o) => {
        const d = new Date(o.completedAt || o.createdAt || "");
        return d >= start && d <= end;
      });
    }

    if (startDate) {
      const s = new Date(startDate);
      s.setHours(0, 0, 0, 0);
      list = list.filter((o) => new Date(o.completedAt || o.createdAt) >= s);
    }

    if (endDate) {
      const e = new Date(endDate);
      e.setHours(23, 59, 59, 999);
      list = list.filter((o) => new Date(o.completedAt || o.createdAt) <= e);
    }

    if (searchTerm && searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      list = list.filter((o) => {
        return (
          (o.transactionCode || o.id || "").toLowerCase().includes(term) ||
          (o.pembeli?.fullName || "").toLowerCase().includes(term) ||
          String(o.totalPrice || "").toLowerCase().includes(term)
        );
      });
    }

    return list;
  }, [orders, month, startDate, endDate, searchTerm]);

  // Derive filtered completed orders for metrics
  const filteredCompletedOrders = useMemo(() => filteredOrders.filter((o) => normalizeStatus(o.status) === "COMPLETED"), [filteredOrders]);

  // Recompute metrics based on filtered lists
  const filteredTotalRevenue = useMemo(() => filteredCompletedOrders.reduce((acc, o) => acc + (o.totalPrice || 0), 0), [filteredCompletedOrders]);
  const filteredTotalCashFlow = useMemo(() => filteredOrders.reduce((acc, o) => acc + (normalizeStatus(o.status) === "CANCELLED" ? 0 : o.totalPrice || 0), 0), [filteredOrders]);
  const filteredTotalTickets = filteredCompletedOrders.length;
  const filteredAverageOrderValue = filteredTotalTickets > 0 ? filteredTotalRevenue / filteredTotalTickets : 0;

  // totalItemCost should be recomputed for filteredCompletedOrders
  const filteredTotalItemCost = useMemo(() => {
    return filteredCompletedOrders.reduce((sum, order) => {
      const itemsCost = (order.items || []).reduce((s, item: any) => {
        const unitCost = item.menu?.cost ?? (item.unitPrice * (costRate / 100));
        return s + (unitCost * (item.quantity || 0));
      }, 0);
      return sum + itemsCost;
    }, 0);
  }, [filteredCompletedOrders, costRate]);

  const filteredEstimatedCost = filteredTotalItemCost;
  const filteredEstimatedProfit = filteredTotalRevenue - filteredEstimatedCost;

  const filteredRevenueTrend = useMemo(() => {
    const today = new Date();
    const days: Date[] = [];
    for (let index = 6; index >= 0; index -= 1) {
      const date = new Date(today);
      date.setDate(today.getDate() - index);
      date.setHours(0, 0, 0, 0);
      days.push(date);
    }

    return days.map((date) => {
      const value = filteredCompletedOrders
        .filter((order) => {
          const orderDate = new Date(order.completedAt || order.createdAt);
          orderDate.setHours(0, 0, 0, 0);
          return orderDate.getTime() === date.getTime();
        })
        .reduce((accumulator, order) => accumulator + (order.totalPrice || 0), 0);

      return {
        label: new Intl.DateTimeFormat("id-ID", { weekday: "short" }).format(date),
        value,
      };
    });
  }, [filteredCompletedOrders]);

  const statusBreakdown = useMemo(() => {
    const statuses = ["PENDING", "CONFIRMED", "PREPARING", "READY", "COMPLETED", "CANCELLED"];
    return statuses.map((status) => ({
      status,
      label: statusLabel(status),
      value: orders.filter((order) => normalizeStatus(order.status) === status).length,
    }));
  }, [orders]);

  const paymentBreakdown = useMemo(() => {
    const counts = orders.reduce<Map<string, number>>((map, order) => {
      const method = (order.paymentMethod || "LAINNYA").toUpperCase();
      map.set(method, (map.get(method) || 0) + 1);
      return map;
    }, new Map());

    return Array.from(counts.entries())
      .map(([method, value]) => ({
        method,
        value,
      }))
      .sort((left, right) => right.value - left.value);
  }, [orders]);

  const recentOrders = useMemo(() => completedOrders.slice(0, 8), [completedOrders]);
  const lastUpdated = useMemo(() => new Date().toLocaleString("id-ID"), [orders, loading, refreshing]);

  async function exportExcel() {
    if (!seller) return;

    setExportingExcel(true);
    try {
      const workbook = XLSX.utils.book_new();
        const summaryRows = [
          ["Laporan Penjualan", seller.penjual?.businessName || seller.businessName || "Penjual"],
          ["Dibuat pada", new Date().toLocaleString("id-ID")],
          ["Total order", filteredOrders.length],
          ["Order selesai", filteredCompletedOrders.length],
          ["Omzet selesai", filteredTotalRevenue],
          ["Kas masuk", filteredTotalCashFlow],
          ["Estimasi biaya (riil)", filteredEstimatedCost],
          ["Estimasi laba (riil)", filteredEstimatedProfit],
          ["Rata-rata order", filteredAverageOrderValue],
        ];

      const summarySheet = XLSX.utils.aoa_to_sheet(["Ringkasan"].map((title) => [title]));
      XLSX.utils.sheet_add_aoa(summarySheet, summaryRows, { origin: "A3" });
      XLSX.utils.book_append_sheet(workbook, summarySheet, "Ringkasan");

      const transactionSheet = XLSX.utils.json_to_sheet(
        filteredCompletedOrders.map((order) => ({
          Kode: order.transactionCode || order.id,
          Tanggal: formatDateTime(order.completedAt || order.createdAt),
          Pembeli: order.pembeli?.fullName || "-",
          Metode: order.paymentMethod || "-",
          Status: statusLabel(order.status),
          Total: order.totalPrice || 0,
          Item: order.items?.length || 0,
        })),
      );
      XLSX.utils.book_append_sheet(workbook, transactionSheet, "Transaksi Selesai");

      const trendSheet = XLSX.utils.json_to_sheet(
        filteredRevenueTrend.map((point) => ({
          Hari: point.label,
          Omzet: point.value,
        })),
      );
      XLSX.utils.book_append_sheet(workbook, trendSheet, "Tren 7 Hari");

      const statusSheet = XLSX.utils.json_to_sheet(
        statusBreakdown.map((item) => ({
          Status: item.label,
          Jumlah: item.value,
        })),
      );
      XLSX.utils.book_append_sheet(workbook, statusSheet, "Status Order");

      XLSX.writeFile(workbook, `laporan-penjualan-${seller.penjual?.businessName || "penjual"}-${Date.now()}.xlsx`);
    } finally {
      setExportingExcel(false);
    }
  }

  async function exportPdf() {
    if (!seller) return;

    setExportingPdf(true);
    try {
      const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      const title = "Laporan Penjualan";
      const subtitle = seller.penjual?.businessName || seller.businessName || "Penjual";

      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text(title, 14, 16);
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text(subtitle, 14, 23);
      doc.text(`Dicetak: ${new Date().toLocaleString("id-ID")}`, 14, 29);

      const summaryBlocks = [
        ["Omzet", formatCurrency(filteredTotalRevenue)],
        ["Kas Masuk", formatCurrency(filteredTotalCashFlow)],
        ["Estimasi Laba", formatCurrency(filteredEstimatedProfit)],
        ["Order Selesai", String(filteredCompletedOrders.length)],
        ["Order Pending", String(filteredOrders.filter((o) => normalizeStatus(o.status) === "PENDING").length)],
        ["Order Proses", String(filteredOrders.filter((o) => ["CONFIRMED", "PREPARING", "READY"].includes(normalizeStatus(o.status))).length)],
      ];

      let x = 14;
      summaryBlocks.forEach(([label, value], index) => {
        const blockX = x + (index % 3) * 92;
        const blockY = 38 + Math.floor(index / 3) * 20;
        doc.setDrawColor(226, 232, 240);
        doc.roundedRect(blockX, blockY, 84, 16, 3, 3);
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text(label, blockX + 4, blockY + 6);
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(15, 23, 42);
        doc.text(value, blockX + 4, blockY + 12);
      });

      autoTable(doc, {
        startY: 78,
        head: [["Kode", "Tanggal", "Pembeli", "Metode", "Status", "Total"]],
        body: filteredCompletedOrders.map((order) => [
          order.transactionCode || order.id,
          formatDateTime(order.completedAt || order.createdAt),
          order.pembeli?.fullName || "-",
          order.paymentMethod || "-",
          statusLabel(order.status),
          formatCurrency(order.totalPrice || 0),
        ]),
        styles: {
          fontSize: 8,
          cellPadding: 3,
          textColor: [15, 23, 42],
          lineColor: [226, 232, 240],
          lineWidth: 0.2,
        },
        headStyles: {
          fillColor: [15, 23, 42],
          textColor: [255, 255, 255],
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252],
        },
        margin: { left: 14, right: 14 },
      });

      doc.save(`laporan-penjualan-${seller.penjual?.businessName || "penjual"}-${Date.now()}.pdf`);
    } finally {
      setExportingPdf(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center px-4">
        <div className="rounded-3xl border border-slate-200 bg-white px-8 py-10 text-center shadow-[0_24px_80px_-48px_rgba(15,23,42,0.55)]">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
          <p className="text-sm font-medium text-slate-600">Memuat reporting penjualan...</p>
        </div>
      </div>
    );
  }

  if (!seller) {
    return <div className="p-6">Silakan login sebagai penjual.</div>;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.55)] backdrop-blur">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
                <TrendingUp className="h-4 w-4" />
                Reporting penjualan real-time
              </div>
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                  Laporan Penjualan {seller.penjual?.businessName || seller.businessName || "Penjual"}
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                  Dashboard ini menampilkan omzet, cashflow masuk, status order, estimasi laba, dan data transaksi yang siap diexport ke Excel atau PDF.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <input type="month" value={month} onChange={(e) => { setMonth(e.target.value); setStartDate(""); setEndDate(""); }} className="h-10 rounded-lg border border-slate-200 px-3 text-sm" />
                <input type="date" value={startDate} onChange={(e) => { setStartDate(e.target.value); setMonth(""); }} className="h-10 rounded-lg border border-slate-200 px-3 text-sm" />
                <input type="date" value={endDate} onChange={(e) => { setEndDate(e.target.value); setMonth(""); }} className="h-10 rounded-lg border border-slate-200 px-3 text-sm" />
                <input type="search" placeholder="Cari kode/pembeli/nominal" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="h-10 rounded-lg border border-slate-200 px-3 text-sm" />
                <button type="button" onClick={() => { setMonth(""); setStartDate(""); setEndDate(""); setSearchTerm(""); }} className="h-10 rounded-lg border border-slate-200 px-3 text-sm">Reset</button>
              </div>
              <button
                type="button"
                onClick={() => loadData(false)}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                {refreshing ? "Memperbarui..." : "Refresh data"}
              </button>
              <button
                type="button"
                onClick={exportExcel}
                disabled={exportingExcel}
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FileSpreadsheet className="h-4 w-4" />
                {exportingExcel ? "Mengekspor..." : "Export Excel"}
              </button>
              <button
                type="button"
                onClick={exportPdf}
                disabled={exportingPdf}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FileText className="h-4 w-4" />
                {exportingPdf ? "Mengekspor..." : "Export PDF"}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Omzet selesai",
              value: formatCurrency(filteredTotalRevenue),
              icon: ReceiptText,
              tone: "from-blue-600 to-cyan-500",
              note: `${filteredCompletedOrders.length} order selesai`,
            },
            {
              label: "Kas masuk",
              value: formatCurrency(filteredTotalCashFlow),
              icon: Banknote,
              tone: "from-emerald-600 to-emerald-500",
              note: "Semua order non-cancel",
            },
            {
              label: "Estimasi laba",
              value: formatCurrency(filteredEstimatedProfit),
              icon: TrendingUp,
              tone: "from-violet-600 to-fuchsia-500",
              note: `Biaya riil menggunakan HPP/Asumsi`,
            },
            {
              label: "Rata-rata order",
              value: formatCurrency(filteredAverageOrderValue),
              icon: CreditCard,
              tone: "from-amber-600 to-orange-500",
              note: `${filteredOrders.length} transaksi total`,
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_-32px_rgba(15,23,42,0.45)]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500">{item.label}</p>
                    <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{item.value}</p>
                    <p className="mt-2 text-xs text-slate-500">{item.note}</p>
                  </div>
                  <div className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br ${item.tone} text-white shadow-lg`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
          <div className="space-y-6">
            <SalesChart data={filteredRevenueTrend} />

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_16px_50px_-30px_rgba(15,23,42,0.35)]">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-slate-950">Status Order</h3>
                    <p className="text-sm text-slate-500">Distribusi order yang masuk ke sistem.</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">Live</span>
                </div>

                <div className="space-y-4">
                  {statusBreakdown.map((item) => {
                    const maxValue = Math.max(...statusBreakdown.map((row) => row.value), 1);
                    const widthValue = (item.value / maxValue) * 100;
                    return (
                      <div key={item.status}>
                        <div className="mb-2 flex items-center justify-between text-sm">
                          <span className="font-medium text-slate-700">{item.label}</span>
                          <span className="text-slate-500">{item.value} order</span>
                        </div>
                        <div className="h-3 rounded-full bg-slate-100">
                          <div className="h-3 rounded-full bg-linear-to-r from-blue-600 to-cyan-500" style={{ width: `${widthValue}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_16px_50px_-30px_rgba(15,23,42,0.35)]">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-slate-950">Metode Pembayaran</h3>
                    <p className="text-sm text-slate-500">Komposisi kas dan non-kas.</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">Audit</span>
                </div>

                <div className="space-y-4">
                  {paymentBreakdown.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                      Belum ada transaksi untuk dianalisis.
                    </div>
                  ) : (
                    paymentBreakdown.map((item) => {
                      const maxValue = Math.max(...paymentBreakdown.map((row) => row.value), 1);
                      const widthValue = (item.value / maxValue) * 100;
                      const label = item.method.replace(/_/g, " ");
                      return (
                        <div key={item.method}>
                          <div className="mb-2 flex items-center justify-between text-sm">
                            <span className="font-medium text-slate-700">{label}</span>
                            <span className="text-slate-500">{item.value} order</span>
                          </div>
                          <div className="h-3 rounded-full bg-slate-100">
                            <div className="h-3 rounded-full bg-linear-to-r from-emerald-600 to-teal-500" style={{ width: `${widthValue}%` }} />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_16px_50px_-30px_rgba(15,23,42,0.35)]">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-base font-semibold text-slate-950">Transaksi Selesai</h3>
                  <p className="text-sm text-slate-500">Detail order yang menjadi dasar omzet dan laba.</p>
                </div>
                <p className="text-xs text-slate-500">Terakhir diperbarui {lastUpdated}</p>
              </div>

              {recentOrders.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
                  Belum ada transaksi selesai.
                </div>
              ) : (
                <div className="overflow-hidden rounded-2xl border border-slate-200">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 text-sm">
                      <thead className="bg-slate-50">
                        <tr className="text-left text-slate-500">
                          <th className="px-4 py-3 font-medium">Kode</th>
                          <th className="px-4 py-3 font-medium">Pembeli</th>
                          <th className="px-4 py-3 font-medium">Tanggal</th>
                          <th className="px-4 py-3 font-medium">Metode</th>
                          <th className="px-4 py-3 font-medium">Total</th>
                          <th className="px-4 py-3 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {recentOrders.map((order) => (
                          <tr key={order.id}>
                            <td className="px-4 py-3 font-medium text-slate-900">{order.transactionCode || order.id}</td>
                            <td className="px-4 py-3 text-slate-600">{order.pembeli?.fullName || "-"}</td>
                            <td className="px-4 py-3 text-slate-600">{formatDateTime(order.completedAt || order.createdAt)}</td>
                            <td className="px-4 py-3 text-slate-600">{(order.paymentMethod || "-").replace(/_/g, " ")}</td>
                            <td className="px-4 py-3 font-semibold text-slate-900">{formatCurrency(order.totalPrice || 0)}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusBadge(order.status)}`}>
                                {statusLabel(order.status)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_16px_50px_-30px_rgba(15,23,42,0.35)]">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-slate-950">Estimasi Keuntungan</h3>
                  <p className="text-sm text-slate-500">Gunakan asumsi biaya untuk simulasi laba.</p>
                </div>
                <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">Simulasi</span>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="mb-3 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">Biaya operasional</span>
                  <span className="font-semibold text-slate-950">{costRate}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="70"
                  step="1"
                  value={costRate}
                  onChange={(event) => setCostRate(Number(event.target.value))}
                  className="w-full accent-slate-950"
                />
                <p className="mt-3 text-xs leading-6 text-slate-500">
                  Angka ini membantu menghitung estimasi laba bersih. Jika nanti ada data HPP per menu, nilai ini bisa diganti dengan angka riil.
                </p>
              </div>

              <div className="mt-4 grid gap-3">
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  <p className="text-xs text-slate-500">Estimasi biaya</p>
                  <p className="mt-1 text-lg font-semibold text-slate-950">{formatCurrency(estimatedCost)}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  <p className="text-xs text-slate-500">Estimasi laba bersih</p>
                  <p className="mt-1 text-lg font-semibold text-emerald-600">{formatCurrency(estimatedProfit)}</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_16px_50px_-30px_rgba(15,23,42,0.35)]">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-slate-950">Cashflow Ringkas</h3>
                  <p className="text-sm text-slate-500">Kas masuk dan distribusi order aktif.</p>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Aktif</span>
              </div>

              <div className="space-y-3">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Banknote className="h-4 w-4 text-emerald-600" />
                    Kas masuk
                  </div>
                  <p className="mt-2 text-xl font-semibold text-slate-950">{formatCurrency(totalCashFlow)}</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  <div className="rounded-2xl border border-slate-200 p-4">
                    <p className="text-xs text-slate-500">Pending</p>
                    <p className="mt-1 text-lg font-semibold text-slate-950">{pendingOrders.length}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 p-4">
                    <p className="text-xs text-slate-500">Proses</p>
                    <p className="mt-1 text-lg font-semibold text-slate-950">{processingOrders.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
