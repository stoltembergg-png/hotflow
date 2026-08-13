"use client";
import { useState, useEffect } from "react";
import { DollarSign, TrendingUp, TrendingDown, Wallet, PieChart, Plus, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Expense { id: string; description: string; amount: number; category: string; date: string; recurring: boolean; }

const categoryLabels: Record<string, string> = { traffic: "Tráfego", tools: "Ferramentas", team: "Equipe", platform: "Plataforma", production: "Produção", outros: "Outros" };
const categoryColors: Record<string, string> = { traffic: "text-orange-400", tools: "text-blue-400", team: "text-purple-400", platform: "text-green-400", production: "text-yellow-400", outros: "text-zinc-400" };

export default function FinanceiroPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ description: "", amount: "", category: "outros", notes: "" });
  const [stats, setStats] = useState({ revenue: 0, totalExpenses: 0, profit: 0 });

  useEffect(() => {
    Promise.all([
      fetch("/api/expenses").then(r => r.json()),
      fetch("/api/reports?type=financial").then(r => r.json()),
    ]).then(([expData, finData]) => {
      setExpenses(expData.data || []);
      setStats({ revenue: finData.revenue || 0, totalExpenses: finData.expenses || 0, profit: finData.profit || 0 });
    });
  }, []);

  async function createExpense() {
    await fetch("/api/expenses", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, amount: parseFloat(form.amount) || 0 }) });
    setShowModal(false);
    fetch("/api/expenses").then(r => r.json()).then(d => setExpenses(d.data || []));
  }

  const expensesByCategory = expenses.reduce((acc: Record<string, number>, e) => { acc[e.category] = (acc[e.category] || 0) + (e.amount || 0); return acc; }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Financeiro</h1>
        <Button onClick={() => setShowModal(true)}><Plus className="w-4 h-4 mr-2" />Nova Despesa</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: TrendingUp, label: "Receitas", value: `R$ ${stats.revenue.toLocaleString("pt-BR")}`, color: "text-green-400" },
          { icon: TrendingDown, label: "Despesas", value: `R$ ${stats.totalExpenses.toLocaleString("pt-BR")}`, color: "text-red-400" },
          { icon: DollarSign, label: "Lucro Líquido", value: `R$ ${stats.profit.toLocaleString("pt-BR")}`, color: stats.profit >= 0 ? "text-green-400" : "text-red-400" },
          { icon: PieChart, label: "Margem", value: stats.revenue > 0 ? `${((stats.profit / stats.revenue) * 100).toFixed(1)}%` : "—", color: "text-orange-400" },
        ].map((m, i) => (
          <div key={i} className="glass-card p-4"><m.icon className={`w-5 h-5 ${m.color} mb-2`} /><p className="text-xs text-zinc-500">{m.label}</p><p className="text-lg font-bold">{m.value}</p></div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card p-5">
          <h3 className="font-bold mb-4">Despesas por Categoria</h3>
          <div className="space-y-3">
            {Object.entries(expensesByCategory).sort((a, b) => b[1] - a[1]).map(([cat, amount]) => {
              const total = Object.values(expensesByCategory).reduce((s, v) => s + v, 0);
              const pct = total > 0 ? (amount / total) * 100 : 0;
              return (
                <div key={cat}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">{categoryLabels[cat] || cat}</span>
                    <span className={`text-sm font-medium ${categoryColors[cat] || "text-zinc-400"}`}>R$ {amount.toLocaleString("pt-BR")}</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1.5">
                    <div className="bg-orange-500 h-1.5 rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
            {Object.keys(expensesByCategory).length === 0 && <p className="text-sm text-zinc-500 text-center py-4">Sem despesas registradas</p>}
          </div>
        </div>
        <div className="glass-card p-5">
          <h3 className="font-bold mb-4">Últimas Despesas</h3>
          <div className="space-y-2">
            {expenses.slice(0, 10).map(e => (
              <div key={e.id} className="flex items-center justify-between p-2 rounded-lg bg-white/[0.03]">
                <div>
                  <p className="text-sm font-medium">{e.description}</p>
                  <p className="text-xs text-zinc-500">{categoryLabels[e.category] || e.category} • {new Date(e.date || '').toLocaleDateString("pt-BR")}</p>
                </div>
                <span className="text-sm font-medium text-red-400">- R$ {(e.amount || 0).toLocaleString("pt-BR")}</span>
              </div>
            ))}
            {expenses.length === 0 && <p className="text-sm text-zinc-500 text-center py-4">Sem despesas</p>}
          </div>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="glass-card p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-4">Nova Despesa</h2>
            <div className="space-y-3">
              <Input placeholder="Descrição" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              <Input placeholder="Valor" type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
              <select className="w-full bg-white/[0.02] border border-white/[0.1] rounded-md p-2 text-sm" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                {Object.entries(categoryLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
                <Button onClick={createExpense}>Criar</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
