"use client";
import { useState, useEffect } from "react";
import { Plus, TrendingUp, DollarSign, Target, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Campaign { id: string; name: string; platform: string; objective: string; budget: number; investment: number; status: string; metrics: any[]; }

export default function CampanhasPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", platform: "instagram", objective: "", budget: "", investment: "", status: "active" });

  useEffect(() => { fetch("/api/campaigns").then(r => r.json()).then(d => setCampaigns(d.data || [])); }, []);

  async function createCampaign() {
    await fetch("/api/campaigns", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, budget: parseFloat(form.budget) || 0, investment: parseFloat(form.investment) || 0 }) });
    setShowModal(false);
    fetch("/api/campaigns").then(r => r.json()).then(d => setCampaigns(d.data || []));
  }

  const totalInvestment = campaigns.reduce((s, c) => s + (c.investment || 0), 0);
  const platforms = ["instagram", "facebook", "telegram", "tiktok", "google", "x", "outros"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Campanhas</h1>
        <Button onClick={() => setShowModal(true)}><Plus className="w-4 h-4 mr-2" />Nova Campanha</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Target, label: "Campanhas", value: campaigns.length, color: "text-blue-400" },
          { icon: DollarSign, label: "Investimento", value: `R$ ${totalInvestment.toLocaleString("pt-BR")}`, color: "text-orange-400" },
          { icon: TrendingUp, label: "Ativas", value: campaigns.filter(c => c.status === "active").length, color: "text-green-400" },
          { icon: BarChart3, label: "Pausadas", value: campaigns.filter(c => c.status === "paused").length, color: "text-yellow-400" },
        ].map((m, i) => (
          <div key={i} className="glass-card p-4"><m.icon className={`w-5 h-5 ${m.color} mb-2`} /><p className="text-xs text-zinc-500">{m.label}</p><p className="text-lg font-bold">{m.value}</p></div>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {campaigns.map(c => (
          <div key={c.id} className="glass-card p-5">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="outline" className="bg-orange-500/10 text-orange-400 border-orange-500/20 capitalize">{c.platform}</Badge>
              <Badge variant="outline" className={c.status === "active" ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"}>{c.status === "active" ? "Ativa" : "Pausada"}</Badge>
            </div>
            <h3 className="font-bold mb-1">{c.name}</h3>
            {c.objective && <p className="text-xs text-zinc-400 mb-3">{c.objective}</p>}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div><p className="text-zinc-500">Orçamento</p><p className="font-medium">R$ {(c.budget || 0).toLocaleString("pt-BR")}</p></div>
              <div><p className="text-zinc-500">Investido</p><p className="font-medium text-orange-400">R$ {(c.investment || 0).toLocaleString("pt-BR")}</p></div>
            </div>
          </div>
        ))}
        {campaigns.length === 0 && <div className="col-span-full text-center py-12 text-zinc-500 glass-card">Nenhuma campanha criada</div>}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="glass-card p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-4">Nova Campanha</h2>
            <div className="space-y-3">
              <Input placeholder="Nome" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              <select className="w-full bg-zinc-900 border border-zinc-700 rounded-md p-2 text-sm" value={form.platform} onChange={e => setForm({ ...form, platform: e.target.value })}>
                {platforms.map(p => <option key={p} value={p} className="capitalize">{p}</option>)}
              </select>
              <Input placeholder="Objetivo" value={form.objective} onChange={e => setForm({ ...form, objective: e.target.value })} />
              <Input placeholder="Orçamento" type="number" value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })} />
              <Input placeholder="Investimento" type="number" value={form.investment} onChange={e => setForm({ ...form, investment: e.target.value })} />
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
                <Button onClick={createCampaign}>Criar</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
