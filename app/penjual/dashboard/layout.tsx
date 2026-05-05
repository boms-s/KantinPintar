"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import SideBar from "@/components/penjual/SideBar";
import { penjualSession } from "@/lib/storage";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const s = penjualSession.get();
    if (!s) {
      router.replace("/penjual/login");
    }
  }, []);

  return (
    <div className="min-h-screen flex bg-gray-50">
      <SideBar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
