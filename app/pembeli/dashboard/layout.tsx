"use client";

import SideBar from "@/components/pembeli/SideBar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { userStorage } from "@/lib/storage";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const user = userStorage.get();
    if (!user) {
      router.push("/pembeli/login");
    } else {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex bg-[#f6f8fb] min-h-screen">
      <SideBar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
