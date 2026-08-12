"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Bell,
  CheckCheck,
  AlertTriangle,
  DollarSign,
  TrendingDown,
  X,
  Trash2,
  Clock,
  ShoppingCart,
  UserPlus,
  CreditCard,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

const typeStyles: Record<string, { bg: string; icon: string }> = {
  warning: { bg: "bg-yellow-500/10", icon: "text-yellow-400" },
  danger: { bg: "bg-red-500/10", icon: "text-red-400" },
  info: { bg: "bg-blue-500/10", icon: "text-blue-400" },
  success: { bg: "bg-green-500/10", icon: "text-green-400" },
  payment: { bg: "bg-yellow-500/10", icon: "text-yellow-400" },
  sale: { bg: "bg-green-500/10", icon: "text-green-400" },
  lead: { bg: "bg-blue-500/10", icon: "text-blue-400" },
  campaign: { bg: "bg-orange-500/10", icon: "text-orange-400" },
  subscription: { bg: "bg-purple-500/10", icon: "text-purple-400" },
  task: { bg: "bg-cyan-500/10", icon: "text-cyan-400" },
};

const typeIcons: Record<string, React.ElementType> = {
  warning: AlertTriangle,
  danger: TrendingDown,
  info: Bell,
  success: CheckCircle2,
  payment: DollarSign,
  sale: ShoppingCart,
  lead: UserPlus,
  campaign: TrendingDown,
  subscription: CreditCard,
  task: Clock,
};

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return "agora";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

export function NotificationsPanel({ onClose }: { onClose: () => void }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => onClose(), 150);
  };

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const json = await res.json();
        setNotifications(json.data || []);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  };

  const dismissNotification = async (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    await fetch(`/api/notifications?id=${id}`, { method: "DELETE" });
  };

  const markAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAllRead: true }),
    });
  };

  return (
    <div
      className={cn(
        "absolute right-0 top-full mt-2 w-96 max-w-[calc(100vw-2rem)] rounded-2xl overflow-hidden z-50",
        "bg-zinc-900 border border-white/[0.1] shadow-2xl shadow-black/50",
        "transition-all duration-150 ease-out origin-top-right",
        isClosing
          ? "opacity-0 scale-95 translate-y-[-4px]"
          : "opacity-100 scale-100 translate-y-0"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] bg-zinc-900">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-zinc-400" />
          <h3 className="text-sm font-semibold text-zinc-200">Notificacoes</h3>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 text-[10px] font-bold bg-orange-500 text-white rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1 px-2 py-1 text-[11px] text-zinc-500 hover:text-orange-400 transition-colors rounded-lg hover:bg-white/[0.04]"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Marcar tudo
            </button>
          )}
          <button
            onClick={handleClose}
            className="flex items-center justify-center w-7 h-7 rounded-lg text-zinc-500 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Notifications list */}
      <div className="max-h-[400px] overflow-y-auto bg-zinc-900">
        {loading ? (
          <div className="px-5 py-10 text-center">
            <div className="w-6 h-6 border-2 border-zinc-700 border-t-orange-500 rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-zinc-500">Carregando...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <Bell className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
            <p className="text-sm text-zinc-500">Nenhuma notificacao</p>
          </div>
        ) : (
          notifications.map((notif, i) => {
            const Icon = typeIcons[notif.type] || Bell;
            const styles = typeStyles[notif.type] || typeStyles.info;
            return (
              <div
                key={notif.id}
                className={cn(
                  "flex items-start gap-3 px-5 py-3.5 border-b border-white/[0.04] last:border-0 group transition-all duration-200 bg-zinc-900",
                  !notif.read && "bg-orange-500/[0.05]"
                )}
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <div
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-lg shrink-0 mt-0.5",
                    styles.bg
                  )}
                >
                  <Icon className={cn("w-4 h-4", styles.icon)} />
                </div>
                <button
                  onClick={() => markAsRead(notif.id)}
                  className="flex-1 min-w-0 text-left"
                >
                  <div className="flex items-center gap-2">
                    <p
                      className={cn(
                        "text-sm font-medium",
                        notif.read ? "text-zinc-400" : "text-zinc-200"
                      )}
                    >
                      {notif.title}
                    </p>
                    {!notif.read && (
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2">
                    {notif.message}
                  </p>
                  <p className="text-[11px] text-zinc-600 mt-1">
                    {timeAgo(notif.createdAt)}
                  </p>
                </button>
                <button
                  onClick={() => dismissNotification(notif.id)}
                  className="shrink-0 mt-1 w-6 h-6 flex items-center justify-center rounded-md text-zinc-600 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all duration-200"
                  title="Dispensar"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="px-5 py-3 border-t border-white/[0.06] bg-zinc-900">
          <button
            onClick={handleClose}
            className="w-full py-2 text-xs font-medium text-orange-400 hover:text-orange-300 transition-colors"
          >
            Ver todas as notificacoes
          </button>
        </div>
      )}
    </div>
  );
}