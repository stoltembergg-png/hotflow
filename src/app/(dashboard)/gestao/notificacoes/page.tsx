"use client";
import { useState, useEffect } from "react";
import { Bell, Check, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Notification { id: string; title: string; message: string; type: string; read: boolean; createdAt: string; }

const typeColors: Record<string, string> = { sale: "text-green-400", campaign: "text-orange-400", payment: "text-yellow-400", task: "text-blue-400", system: "text-purple-400" };

export default function NotificacoesPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);

  useEffect(() => { fetchNotifications(); }, []);

  async function fetchNotifications() {
    const res = await fetch("/api/notifications");
    const data = await res.json();
    setNotifications(data.data || []);
    setUnread(data.unread || 0);
  }

  async function markAsRead(id: string) {
    await fetch("/api/notifications", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    fetchNotifications();
  }

  async function markAllRead() {
    await fetch("/api/notifications", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ markAllRead: true }) });
    fetchNotifications();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notificações</h1>
          <p className="text-sm text-zinc-400">{unread} não lidas</p>
        </div>
        {unread > 0 && (
          <Button variant="outline" onClick={markAllRead}><CheckCheck className="w-4 h-4 mr-2" />Marcar todas como lidas</Button>
        )}
      </div>
      <div className="space-y-2">
        {notifications.map(n => (
          <div key={n.id} className={`glass-card p-4 flex items-start gap-3 ${!n.read ? "border-orange-500/20" : ""}`}>
            <Bell className={`w-5 h-5 mt-0.5 shrink-0 ${typeColors[n.type] || "text-zinc-400"}`} />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-medium text-sm">{n.title}</p>
                {!n.read && <div className="w-2 h-2 rounded-full bg-orange-500" />}
              </div>
              <p className="text-xs text-zinc-400">{n.message}</p>
              <p className="text-xs text-zinc-600 mt-1">{new Date(n.createdAt).toLocaleString("pt-BR")}</p>
            </div>
            {!n.read && (
              <Button variant="ghost" size="sm" onClick={() => markAsRead(n.id)}><Check className="w-4 h-4" /></Button>
            )}
          </div>
        ))}
        {notifications.length === 0 && <div className="text-center py-12 text-zinc-500 glass-card">Nenhuma notificação</div>}
      </div>
    </div>
  );
}
