"use client";
import { useState, useEffect } from "react";
import { Plus, TrendingUp, DollarSign, MousePointerClick, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Traffic { id: string; campaign: string; platform: string; investment: number; impressions: number; clicks: number; ctr: number; cpc: number; leads: number; conversions: number; revenue: number; roas: number; cpa: number; cpl: number; roi: number; }

export default function TrafegoPage() {
  const [traffic, setTraffic] = useState<Traffic[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ campaign: "", platform: "instagram", investment: "", impressions: "", clicks: "", leads: "", conversions: "", revenue: "" });

  useEffect(() => { fetch("/api/traffic").then(r => r.json()).then(d => setTraffic(d.data || [])); }, []);

  async function createTraffic() {
    await fetch("/api/traffic", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, investment: parseFloat(form.investment) || 0, impressions: parseInt(form.impressions) || 0, clicks: parseInt(form.clicks) || 0, leads: parseInt(form.leads) || 0, conversions: parseInt(form.conversions) || 0, revenue: parseFloat(form.revenue) || 0 }) });
    setShowModal(false);
    fetch("/api/traffic").then(r => r.json()).then(d => setTraffic(d.data || []));
  }

  const totalInvestment = traffic.reduce((s, t) => s + (t.investment || 0), 0);
  const totalRevenue = traffic.reduce((s, t) => s + (t.revenue || 0), 0);
  const avgRoas = totalInvestment > 0 ? totalRevenue / totalInvestment : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tráfego</h1>
        <Button onClick={() => setShowModal(true)}><Plus className="w-4 h-4 mr-2" />Novo Registro</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: DollarSign, label: "Investimento", value: `R$ ${totalInvestment.toLocaleString("pt-BR")}`, color: "text-orange-400" },
          { icon: TrendingUp, label: "Receita", value: `R$ ${totalRevenue.toLocaleString("pt-BR")}`, color: "text-green-400" },
          { icon: MousePointerClick, label: "ROAS Médio", value: `${avgRoas.toFixed(2)}x`, color: "text-blue-400" },
          { icon: Eye, label: "Registros", value: traffic.length, color: "text-purple-400" },
        ].map((m, i) => (
          <div key={i} className="glass-card p-4"><m.icon className={`w-5 h-5 ${m.color} mb-2`} /><p className="text-xs text-zinc-500">{m.label}</p><p className="text-lg font-bold">{m.value}</p></div>
        ))}
      </div>
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-white/[0.08]">
              <th className="text-left p-3 text-zinc-400 font-medium">Campanha</th>
              <th className="text-left p-3 text-zinc-400 font-medium">Plataforma</th>
              <th className="text-right p-3 text-zinc-400 font-medium">Investimento</th>
              <th className="text-right p-3 text-zinc-400 font-medium">Cliques</th>
              <th className="text-right p-3 text-zinc-400 font-medium">CTR</th>
              <th className="text-right p-3 text-zinc-400 font-medium">CPC</th>
              <th className="text-right p-3 text-zinc-400 font-medium">Conversões</th>
              <th className="text-right p-3 text-zinc-400 font-medium">Receita</th>
              <th className="text-right p-3 text-zinc-400 font-medium">ROAS</th>
            </tr></thead>
            <tbody>
              {traffic.map(t => (
                <tr key={t.id} className="border-b border-white/[0.06] hover:bg-white/5">
                  <td className="p-3 font-medium">{t.campaign || "—"}</td>
                  <td className="p-3 text-zinc-400 capitalize">{t.platform || "—"}</td>
                  <td className="p-3 text-right">R$ {(t.investment || 0).toLocaleString("pt-BR")}</td>
                  <td className="p-3 text-right">{t.clicks || 0}</td>
                  <td className="p-3 text-right">{(t.ctr || 0).toFixed(2)}%</td>
                  <td className="p-3 text-right">R$ {(t.cpc || 0).toFixed(2)}</td>
                  <td className="p-3 text-right">{t.conversions || 0}</td>
                  <td className="p-3 text-right text-green-400">R$ {(t.revenue || 0).toLocaleString("pt-BR")}</td>
                  <td className="p-3 text-right"><span className={t.roas >= 1 ? "text-green-400" : "text-red-400"}>{(t.roas || 0).toFixed(2)}x</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {traffic.length === 0 && <div className="text-center py-12 text-zinc-500">Nenhum registro de tráfego</div>}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="glass-card p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-4">Novo Registro de Tráfego</h2>
            <div className="space-y-3">
              <Input placeholder="Campanha" value={form.campaign} onChange={e => setForm({ ...form, campaign: e.target.value })} />
              <select className="w-full bg-white/[0.02] border border-white/[0.1] rounded-md p-2 text-sm" value={form.platform} onChange={e => setForm({ ...form, platform: e.target.value })}>
                <option value="instagram">Instagram</option><option value="facebook">Facebook</option><option value="tiktok">TikTok</option><option value="google">Google</option><option value="telegram">Telegram</option>
              </select>
              <Input placeholder="Investimento" type="number" value={form.investment} onChange={e => setForm({ ...form, investment: e.target.value })} />
              <Input placeholder="Impressões" type="number" value={form.impressions} onChange={e => setForm({ ...form, impressions: e.target.value })} />
              <Input placeholder="Cliques" type="number" value={form.clicks} onChange={e => setForm({ ...form, clicks: e.target.value })} />
              <Input placeholder="Leads" type="number" value={form.leads} onChange={e => setForm({ ...form, leads: e.target.value })} />
              <Input placeholder="Conversões" type="number" value={form.conversions} onChange={e => setForm({ ...form, conversions: e.target.value })} />
              <Input placeholder="Receita" type="number" value={form.revenue} onChange={e => setForm({ ...form, revenue: e.target.value })} />
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
                <Button onClick={createTraffic}>Criar</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
