"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SideBar from "@/components/penjual/SideBar";
import { getCurrentUserAction } from "@/app/api/actions";

type CurrentPenjualUser = {
  id: string;
  email: string;
  role: string;
  penjual?: {
    id: string;
    businessName: string;
    address: string;
    city: string;
    isOpen: boolean;
    operatingHours?: string | null;
  } | null;
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<CurrentPenjualUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      const result = await getCurrentUserAction();

      if (!result.success || !result.data || result.data.role !== "PENJUAL") {
        router.replace("/penjual/login");
        return;
      }

      setUser(result.data as CurrentPenjualUser);
      setIsLoading(false);
    };

    loadSession();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-violet-600"></div>
          <p className="mt-4 text-sm text-slate-600">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <SideBar user={user} />
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
