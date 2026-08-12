"use client";
import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, DollarSign, Users, Target, BarChart3, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AnalyticsData {
  revenue: number; expenses: number; profit: number; orders: number;
  paidOrders: number; conversion: number; avgTicket: number;
  customers: number; leads: number; period: string;
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("30d");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/analytics?period=${period}`).then(r => r.json()).then(d => { setData(d); setLoading(false); });
  }, [period]);

  const metrics = data ? [
    { label: "Receita", value: `R$ ${data.revenue.toLocaleString("pt-BR")}`, icon: DollarSign, color: "text-green-400" },
    { label: "Despesas", value: `R$ ${data.expenses.toLocaleString("pt-BR")}`, icon: TrendingDown, color: "text-red-400" },
    { label: "Lucro", value: `R$ ${data.profit.toLocaleString("pt-BR")}`, icon: data.profit >= 0 ? TrendingUp : TrendingDown, color: data.profit >= 0 ? "text-green-400" : "text-red-400" },
    { label: "Conversão", value: `${data.conversion.toFixed(1)}%`, icon: Target, color: "text-orange-400" },
    { label: "Ticket Médio", value: `R$ ${data.avgTicket.toLocaleString("pt-BR")}`, icon: BarChart3, color: "text-blue-400" },
    { label: "Clientes", value: data.customers, icon: Users, color: "text-purple-400" },
    { label: "Leads", value: data.leads, icon: Users, color: "text-cyan-400" },
    { label: "Vendas", value: data.paidOrders, icon: TrendingUp, color: "text-green-400" },
  ] : [];

  const periods = [
    { key: "7d", label: "7 dias" },
    { key: "30d", label: "30 dias" },
    { key: "90d", label: "90 dias" },
    { key: "12m", label: "12 meses" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <div className="flex gap-2">
          {periods.map(p => (
            <Button key={p.key} variant={period === p.key ? "default" : "outline"} size="sm" onClick={() => setPeriod(p.key)} className={period === p.key ? "bg-orange-500 hover:bg-orange-600" : ""}>{p.label}</Button>
          ))}
        </div>
      </div>
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="glass-card p-4 animate-pulse"><div className="h-4 bg-zinc-800 rounded w-20 mb-2" /><div className="h-6 bg-zinc-800 rounded w-24" /></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((m, i) => (
            <div key={i} className="glass-card p-4">
              <m.icon className={`w-5 h-5 ${m.color} mb-2`} />
              <p className="text-xs text-zinc-500">{m.label}</p>
              <p className="text-lg font-bold">{m.value}</p>
            </div>
          ))}
        </div>
      )}
      <div className="glass-card p-6">
        <h2 className="font-bold mb-4">Insights</h2>
        <div className="space-y-3">
          {data && data.revenue > 0 && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/5 border border-green-500/10">
              <ArrowUpRight className="w-4 h-4 text-green-400" />
              <p className="text-sm">Sua receita no período é de R$ {data.revenue.toLocaleString("pt-BR")} com {data.paidOrders} vendas pagas.</p>
            </div>
          )}
          {data && data.conversion > 0 && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-orange-500/5 border border-orange-500/10">
              <Target className="w-4 h-4 text-orange-400" />
              <p className="text-sm">Taxa de conversão de {data.conversion.toFixed(1)}% entre {data.orders} pedidos totais.</p>
            </div>
          )}
          {data && data.avgTicket > 0 && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-500/5 border border-blue-500/10">
              <BarChart3 className="w-4 h-4 text-blue-400" />
              <p className="text-sm">Ticket médio de R$ {data.avgTicket.toLocaleString("pt-BR")} por venda.</p>
            </div>
          )}
          {!data || (data.revenue === 0 && data.orders === 0) && (
            <div className="text-center py-8 text-zinc-500">Registre vendas e despesas para ver insights detalhados.</div>
          )}
        </div>
      </div>
    </div>
  );
}
