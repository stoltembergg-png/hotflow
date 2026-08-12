"use client";
import { useState } from "react";
import { AlertTriangle, ShoppingCart, UserX, Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const mockRecovery = [
  { id: "1", customer: "Ana S.", product: "Curso Avançado", value: 497, date: "2026-08-10", status: "pix_pending", lastActivity: "2026-08-10", priority: "high" },
  { id: "2", customer: "Carlos M.", product: "Mentoria VIP", value: 1997, date: "2026-08-09", status: "checkout_abandoned", lastActivity: "2026-08-09", priority: "high" },
  { id: "3", customer: "Juliana R.", product: "E-book Digital", value: 47, date: "2026-08-08", status: "inactive", lastActivity: "2026-07-15", priority: "medium" },
  { id: "4", customer: "Pedro L.", product: "Assinatura Pro", value: 97, date: "2026-08-07", status: "subscription_expiring", lastActivity: "2026-08-07", priority: "medium" },
  { id: "5", customer: "Maria F.", product: "Pack Completo", value: 297, date: "2026-08-06", status: "pix_pending", lastActivity: "2026-08-06", priority: "low" },
  { id: "6", customer: "Lucas A.", product: "Curso Básico", value: 197, date: "2026-08-05", status: "checkout_abandoned", lastActivity: "2026-08-05", priority: "medium" },
  { id: "7", customer: "Fernanda C.", product: "Mentoria", value: 997, date: "2026-08-04", status: "inactive", lastActivity: "2026-06-20", priority: "high" },
];

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  pix_pending: { label: "PIX Pendente", color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20", icon: AlertTriangle },
  checkout_abandoned: { label: "Checkout Abandonado", color: "bg-orange-500/10 text-orange-400 border-orange-500/20", icon: ShoppingCart },
  inactive: { label: "Cliente Inativo", color: "bg-red-500/10 text-red-400 border-red-500/20", icon: UserX },
  subscription_expiring: { label: "Assinatura Vencendo", color: "bg-purple-500/10 text-purple-400 border-purple-500/20", icon: Clock },
};

const priorityColors: Record<string, string> = { high: "bg-red-500/10 text-red-400", medium: "bg-yellow-500/10 text-yellow-400", low: "bg-blue-500/10 text-blue-400" };
const priorityLabels: Record<string, string> = { high: "Alta", medium: "Média", low: "Baixa" };

export default function RecuperacaoPage() {
  const [priorityFilter, setPriorityFilter] = useState("");
  const filtered = priorityFilter ? mockRecovery.filter(r => r.priority === priorityFilter) : mockRecovery;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Recuperação de Vendas</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(statusConfig).map(([key, config]) => {
          const count = mockRecovery.filter(r => r.status === key).length;
          return (
            <div key={key} className="glass-card p-4">
              <config.icon className={`w-5 h-5 mb-2 ${config.color.split(" ")[1]}`} />
              <p className="text-xs text-zinc-500">{config.label}</p>
              <p className="text-lg font-bold">{count}</p>
            </div>
          );
        })}
      </div>
      <div className="flex gap-2">
        {["", "high", "medium", "low"].map(p => (
          <Button key={p} variant={priorityFilter === p ? "default" : "outline"} size="sm" onClick={() => setPriorityFilter(p)} className={priorityFilter === p ? "bg-orange-500 hover:bg-orange-600" : ""}>{p ? priorityLabels[p] : "Todas"}</Button>
        ))}
      </div>
      <div className="space-y-3">
        {filtered.map(r => {
          const status = statusConfig[r.status] || statusConfig.pix_pending;
          return (
            <div key={r.id} className="glass-card p-4 flex items-center gap-4">
              <status.icon className="w-5 h-5 shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium">{r.customer}</p>
                  <Badge variant="outline" className={`${status.color}`}>{status.label}</Badge>
                  <Badge variant="outline" className={`${priorityColors[r.priority]}`}>{priorityLabels[r.priority]}</Badge>
                </div>
                <p className="text-sm text-zinc-400">{r.product} • R$ {r.value.toLocaleString("pt-BR")}</p>
                <p className="text-xs text-zinc-600 mt-1">Última atividade: {new Date(r.lastActivity).toLocaleDateString("pt-BR")}</p>
              </div>
              <Button variant="outline" size="sm"><ArrowRight className="w-4 h-4" /></Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
