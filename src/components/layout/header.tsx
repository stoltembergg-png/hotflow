"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Search, Bell, Menu, ChevronDown, User, Settings, LogOut, Command } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { NotificationsPanel } from "./notifications-panel";

interface HeaderProps {
  onToggleSidebar: () => void;
  onOpenSearch: () => void;
}

export function Header({ onToggleSidebar, onOpenSearch }: HeaderProps) {
  const { user, logout } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const fetchUnread = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const json = await res.json();
        setUnreadCount(json.unread || 0);
      }
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, [fetchUnread]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-surface border-b border-white/[0.06] backdrop-blur-xl">
      {/* Left: Menu + Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="flex md:hidden items-center justify-center w-9 h-9 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Center: Search trigger */}
      <button
        onClick={onOpenSearch}
        className="hidden sm:flex items-center gap-3 px-4 py-2 w-80 max-w-[50vw] rounded-xl bg-white/[0.04] border border-white/[0.08] text-zinc-500 hover:border-white/[0.15] hover:text-zinc-400 transition-all text-sm"
      >
        <Search className="w-4 h-4" />
        <span className="flex-1 text-left">Buscar...</span>
        <kbd className="hidden md:flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium text-zinc-600 bg-white/[0.06] rounded-md border border-white/[0.08]">
          <Command className="w-3 h-3" />K
        </kbd>
      </button>

      {/* Right: Notifications + User */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex items-center justify-center w-9 h-9 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full ring-2 ring-zinc-900 animate-pulse" />
            )}
          </button>
          <NotificationsPanel
            open={showNotifications}
            onClose={() => setShowNotifications(false)}
            onUnreadChange={setUnreadCount}
          />
        </div>

        {/* User Menu */}
        <div ref={userMenuRef} className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-white/[0.06] transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-white text-sm font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <span className="hidden lg:block text-sm font-medium text-zinc-300 max-w-[120px] truncate">
              {user?.name || "Usuario"}
            </span>
            <ChevronDown className="hidden lg:block w-4 h-4 text-zinc-500" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-surface border border-white/[0.1] shadow-2xl shadow-black/50 py-2 animate-fadeIn">
              <div className="px-4 py-2 border-b border-white/[0.06]">
                <p className="text-sm font-medium text-zinc-200">{user?.name || "Usuario"}</p>
                <p className="text-xs text-zinc-500">{user?.email || "usuario@email.com"}</p>
              </div>
              <div className="py-1">
                <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-zinc-400 hover:text-white hover:bg-white/[0.04] transition-colors">
                  <User className="w-4 h-4" />
                  Meu Perfil
                </button>
                <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-zinc-400 hover:text-white hover:bg-white/[0.04] transition-colors">
                  <Settings className="w-4 h-4" />
                  Configuracoes
                </button>
              </div>
              <div className="border-t border-white/[0.06] pt-1">
                <button
                  onClick={logout}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/[0.06] transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}