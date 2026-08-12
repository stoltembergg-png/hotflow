"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/ui/mobile-nav";
import { GlobalSearch } from "@/components/layout/global-search";
import { useAuthStore } from "@/store/auth-store";
import { Loader2, Flame } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user, loading, setLoading } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  // Simulate auth check
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("hotflow-token") : null;
    if (token) {
      useAuthStore.getState().login(
        {
          id: "1",
          name: "Arthur",
          email: "arthur@hotflow.com",
          role: "admin",
          orgId: "org-1",
        },
        token
      );
    } else {
      useAuthStore.getState().login(
        {
          id: "1",
          name: "Arthur",
          email: "arthur@hotflow.com",
          role: "admin",
          orgId: "org-1",
        },
        "dev-token"
      );
    }
    setLoading(false);
  }, [setLoading]);

  // Keyboard shortcut for search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarCollapsed(false);
  }, [pathname]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#09090b]">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400">
            <Flame className="w-8 h-8 text-white" />
          </div>
          <Loader2 className="w-6 h-6 text-orange-400 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#09090b]">
      {/* Desktop Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          onOpenSearch={() => setSearchOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-6">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <MobileNav />

      {/* Global Search */}
      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
