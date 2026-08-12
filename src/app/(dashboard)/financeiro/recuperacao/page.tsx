"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, ShoppingCart, UserX, Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface RecoveryItem {
  id: string;
  customer: string;
  product: string;
  value: number;
  date: string;
  status: "pix_pending" | "checkout_abandoned" | "inactive" | "subscription_expiring";
  lastActivity: string;
  priority: "high" | "medium" | "low";
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  pix_pending: { label: "PIX Pendente", color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20", icon: AlertTriangle },
  checkout_abandoned: { label: "Checkout Abandonado", color: "bg-orange-500/10 text-orange-400 border-orange-500/20", icon: ShoppingCart },
  inactive: { label: "Cliente Inativo", color: "bg-red-500/10 text-red-400 border-red-500/20", icon: UserX },
  subscription_expiring: { label: "Assinatura Vencendo", color: "bg-purple-500/10 text-purple-400 border-purple-500/20", icon: Clock },
};

const priorityColors: Record<string, string> = { high: "bg-red-500/10 text-red-400", medium: "bg-yellow-500/10 text-yellow-400", low: "bg-blue-500/10 text-blue-400" };
const priorityLabels: Record<string, string> = { high: "Alta", medium: "Média", low: "Baixa" };

export default function RecuperacaoPage() {
  const [recovery, setRecovery] = useState<RecoveryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [priorityFilter, setPriorityFilter] = useState("");
  const [stats, setStats] = useState({ pix_pending: 0, checkout_abandoned: 0, inactive: 0, subscription_expiring: 0 });

  useEffect(() => {
    fetch("/api/recovery")
      .then((res) => res.json())
      .then((json) => {
        setRecovery(json.data || []);
        const counts = { pix_pending: 0, checkout_abandoned: 0, inactive: 0, subscription_expiring: 0 };
        (json.data || []).forEach((r: RecoveryItem) => {
          counts[r.status as keyof typeof counts]++;
        });
        setStats(counts);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = priorityFilter ? recovery.filter((r) => r.priority === priorityFilter) : recovery;

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Recuperação de Vendas</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass-card p-4 animate-pulse">
              <div className="w-5 h-5 mb-2 bg-zinc-800 rounded" />
              <p className="text-xs text-zinc-500">Carregando...</p>
              <p className="text-lg font-bold">—</p>
            </div>
          ))}
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="glass-card p-4 animate-pulse flex items-center gap-4">
              <div className="w-5 h-5 bg-zinc-800 rounded shrink-0" />
              <div className="flex-1 space-y-1">
                <div className="h-4 w-1/4 bg-zinc-800 rounded" />
                <div className="h-3 w-1/2 bg-zinc-800 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Recuperação de Vendas</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(statusConfig).map(([key, config]) => (
          <div key={key} className="glass-card p-4">
            <config.icon className={`w-5 h-5 mb-2 ${config.color.split(" ")[1]}`} />
            <p className="text-xs text-zinc-500">{config.label}</p>
            <p className="text-lg font-bold">{stats[key as keyof typeof stats] || 0}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        {["", "high", "medium", "low"].map((p) => (
          <Button
            key={p}
            variant={priorityFilter === p ? "default" : "outline"}
            size="sm"
            onClick={() => setPriorityFilter(p)}
            className={priorityFilter === p ? "bg-orange-500 hover:bg-orange-600" : ""}
          >
            {p ? priorityLabels[p] : "Todas"}
          </Button>
        ))}
      </div>
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="glass-card p-8 text-center text-zinc-500">Nenhum item de recuperação encontrado</div>
        ) : (
          filtered.map((r) => {
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
          })
        )}
      </div>
    </div>
  );
}