"use client";

import { useState } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  AlertTriangle,
  DollarSign,
  ShoppingCart,
  TrendingDown,
  Clock,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "warning" | "danger" | "info" | "success";
  read: boolean;
  time: string;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Pagamento pendente",
    message: "3 pagamentos aguardando confirmação - R$ 2.450,00",
    type: "warning",
    read: false,
    time: "5 min atrás",
  },
  {
    id: "2",
    title: "Campanha com queda",
    message: "ROAS da campanha 'Black Friday' caiu 15%",
    type: "danger",
    read: false,
    time: "20 min atrás",
  },
  {
    id: "3",
    title: "Nova venda",
    message: "Plano Anual - R$ 1.997,00 via Pix",
    type: "success",
    read: true,
    time: "1h atrás",
  },
  {
    id: "4",
    title: "Estoque baixo",
    message: "E-book 'Marketing Digital' com apenas 5 unidades",
    type: "warning",
    read: false,
    time: "2h atrás",
  },
  {
    id: "5",
    title: "Tarefa atrasada",
    message: "Revisão do conteúdo 'Landing Page Q4' está atrasada",
    type: "danger",
    read: false,
    time: "3h atrás",
  },
];

const typeStyles: Record<string, { bg: string; icon: string }> = {
  warning: { bg: "bg-yellow-500/10", icon: "text-yellow-400" },
  danger: { bg: "bg-red-500/10", icon: "text-red-400" },
  info: { bg: "bg-blue-500/10", icon: "text-blue-400" },
  success: { bg: "bg-green-500/10", icon: "text-green-400" },
};

const typeIcons: Record<string, React.ElementType> = {
  warning: AlertTriangle,
  danger: TrendingDown,
  info: Bell,
  success: DollarSign,
};

export function NotificationsPanel({ onClose }: { onClose: () => void }) {
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="absolute right-0 top-full mt-2 w-96 max-w-[calc(100vw-2rem)] glass-card shadow-2xl shadow-black/40 rounded-2xl overflow-hidden animate-fadeIn z-50">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-zinc-200">Notificações</h3>
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
            onClick={onClose}
            className="flex items-center justify-center w-7 h-7 rounded-lg text-zinc-500 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Notifications list */}
      <div className="max-h-[400px] overflow-y-auto">
        {notifications.length === 0 && (
          <div className="px-5 py-10 text-center">
            <Bell className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
            <p className="text-sm text-zinc-500">Nenhuma notificação</p>
          </div>
        )}
        {notifications.map((notif) => {
          const Icon = typeIcons[notif.type] || Bell;
          const styles = typeStyles[notif.type] || typeStyles.info;
          return (
            <button
              key={notif.id}
              onClick={() => markAsRead(notif.id)}
              className={cn(
                "flex items-start gap-3 w-full px-5 py-3.5 text-left transition-colors hover:bg-white/[0.03] border-b border-white/[0.04] last:border-0",
                !notif.read && "bg-orange-500/[0.03]"
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-lg shrink-0 mt-0.5",
                  styles.bg
                )}
              >
                <Icon className={cn("w-4 h-4", styles.icon)} />
              </div>
              <div className="flex-1 min-w-0">
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
                <p className="text-[11px] text-zinc-600 mt-1">{notif.time}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-white/[0.06]">
        <button className="w-full py-2 text-xs font-medium text-orange-400 hover:text-orange-300 transition-colors">
          Ver todas as notificações
        </button>
      </div>
    </div>
  );
}
