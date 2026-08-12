"use client";
import { useState, useEffect } from "react";
import { CreditCard, Users, TrendingUp, AlertTriangle, XCircle, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Sub { id: string; customer: { name: string }; plan: string; amount: number; status: string; startDate: string; nextBilling: string; }

export default function AssinaturasPage() {
  const [subs, setSubs] = useState<Sub[]>([]);
  const [stats, setStats] = useState({ mrr: 0, activeCount: 0, total: 0 });

  useEffect(() => { fetch("/api/subscriptions").then(r => r.json()).then(d => { setSubs(d.data || []); setStats({ mrr: d.mrr || 0, activeCount: d.activeCount || 0, total: d.total || 0 }); }); }, []);

  const statusColors: Record<string, string> = { active: "bg-green-500/10 text-green-400 border-green-500/20", cancelled: "bg-red-500/10 text-red-400 border-red-500/20", expired: "bg-zinc-500/10 text-zinc-400", payment_pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" };
  const statusLabels: Record<string, string> = { active: "Ativa", cancelled: "Cancelada", expired: "Expirada", payment_pending: "Pagamento Pendente" };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Assinaturas</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: CreditCard, label: "MRR", value: `R$ ${stats.mrr.toLocaleString("pt-BR")}`, color: "text-green-400" },
          { icon: Users, label: "Ativas", value: stats.activeCount, color: "text-blue-400" },
          { icon: TrendingUp, label: "Total", value: stats.total, color: "text-purple-400" },
          { icon: AlertTriangle, label: "Cancelamentos", value: subs.filter(s => s.status === "cancelled").length, color: "text-red-400" },
        ].map((m, i) => (
          <div key={i} className="glass-card p-4">
            <m.icon className={`w-5 h-5 ${m.color} mb-2`} />
            <p className="text-xs text-zinc-500">{m.label}</p>
            <p className="text-lg font-bold">{m.value}</p>
          </div>
        ))}
      </div>
      <div className="glass-card overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-zinc-800">
            <th className="text-left p-3 text-zinc-400 font-medium">Cliente</th>
            <th className="text-left p-3 text-zinc-400 font-medium">Plano</th>
            <th className="text-right p-3 text-zinc-400 font-medium">Valor</th>
            <th className="text-left p-3 text-zinc-400 font-medium">Início</th>
            <th className="text-left p-3 text-zinc-400 font-medium">Próx. Cobrança</th>
            <th className="text-left p-3 text-zinc-400 font-medium">Status</th>
          </tr></thead>
          <tbody>
            {subs.map(s => (
              <tr key={s.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                <td className="p-3 font-medium">{s.customer?.name || "—"}</td>
                <td className="p-3 text-zinc-400">{s.plan}</td>
                <td className="p-3 text-right text-green-400 font-medium">R$ {(s.amount || 0).toLocaleString("pt-BR")}</td>
                <td className="p-3 text-zinc-400">{s.startDate ? new Date(s.startDate).toLocaleDateString("pt-BR") : "—"}</td>
                <td className="p-3 text-zinc-400">{s.nextBilling ? new Date(s.nextBilling).toLocaleDateString("pt-BR") : "—"}</td>
                <td className="p-3"><Badge variant="outline" className={`${statusColors[s.status] || ""}`}>{statusLabels[s.status] || s.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
        {subs.length === 0 && <div className="text-center py-12 text-zinc-500">Nenhuma assinatura encontrada</div>}
      </div>
    </div>
  );
}
