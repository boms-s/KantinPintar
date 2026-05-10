"use client";

import SideBar from "@/components/pembeli/SideBar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUserAction } from "@/app/api/actions";

type CurrentPembeliUser = {
  id: string;
  role: string;
  pembeli?: {
    id: string;
    fullName: string;
    phone: string;
    address?: string | null;
    city?: string | null;
  } | null;
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<CurrentPembeliUser | null>(null);

  useEffect(() => {
    const loadSession = async () => {
      const result = await getCurrentUserAction();
      if (!result.success || !result.data || result.data.role !== "PEMBELI") {
        router.push("/pembeli/login");
        return;
      }

      setUser(result.data as CurrentPembeliUser);
      setIsLoading(false);
    };

    loadSession();
  }, [router]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex bg-[#f6f8fb] min-h-screen">
      <SideBar user={user} />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
