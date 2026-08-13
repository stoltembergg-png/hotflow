"use client";
import { useState, useEffect } from "react";
import { Search, Plus, MoreHorizontal, Eye, Trash2, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Lead {
  id: string; name: string; contact: string; source: string; campaign: string;
  productInterest: string; stage: string; potentialValue: number; createdAt: string;
}

const stages = [
  { key: "new", label: "Novo", color: "bg-blue-500" },
  { key: "contacted", label: "Contato Iniciado", color: "bg-yellow-500" },
  { key: "interested", label: "Interessado", color: "bg-purple-500" },
  { key: "checkout", label: "Checkout", color: "bg-orange-500" },
  { key: "payment_pending", label: "Pagamento Pendente", color: "bg-amber-500" },
  { key: "converted", label: "Convertido", color: "bg-green-500" },
];

const stageColors: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  contacted: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  interested: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  checkout: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  payment_pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  converted: "bg-green-500/10 text-green-400 border-green-500/20",
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState("");
  const [showKanban, setShowKanban] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", contact: "", source: "", campaign: "", productInterest: "", potentialValue: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchLeads(); }, []);

  async function fetchLeads() {
    setLoading(true);
    const res = await fetch(`/api/leads?search=${search}`);
    const data = await res.json();
    setLeads(data.data || []);
    setLoading(false);
  }

  useEffect(() => { const t = setTimeout(fetchLeads, 300); return () => clearTimeout(t); }, [search]);

  async function createLead() {
    await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, potentialValue: parseFloat(form.potentialValue) || 0, stage: "new" }) });
    setShowModal(false);
    setForm({ name: "", contact: "", source: "", campaign: "", productInterest: "", potentialValue: "" });
    fetchLeads();
  }

  async function moveStage(id: string, newStage: string) {
    await fetch(`/api/leads/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ stage: newStage }) });
    fetchLeads();
  }

  const getLeadsByStage = (stage: string) => leads.filter(l => l.stage === stage);

  if (showKanban) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Leads</h1>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => setShowKanban(false)}>Lista</Button>
            <Button onClick={() => setShowModal(true)}><Plus className="w-4 h-4 mr-2" />Novo Lead</Button>
          </div>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {stages.map(stage => (
            <div key={stage.key} className="min-w-[280px] flex-1">
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-2 h-2 rounded-full ${stage.color}`} />
                <h3 className="text-sm font-medium text-zinc-400">{stage.label}</h3>
                <span className="text-xs text-white/40 bg-white/5 px-2 py-0.5 rounded-full">{getLeadsByStage(stage.key).length}</span>
              </div>
              <div className="space-y-2">
                {getLeadsByStage(stage.key).map(lead => (
                  <div key={lead.id} className="glass-card p-3 cursor-grab active:cursor-grabbing">
                    <p className="font-medium text-sm">{lead.name}</p>
                    <p className="text-xs text-zinc-500 mt-1">{lead.contact || "Sem contato"}</p>
                    <div className="flex items-center justify-between mt-2">
                      <Badge variant="outline" className={`text-[10px] ${stageColors[lead.stage] || ""}`}>{lead.source || "—"}</Badge>
                      {lead.potentialValue > 0 && <span className="text-xs text-green-400">R$ {lead.potentialValue.toLocaleString("pt-BR")}</span>}
                    </div>
                    {stage.key !== "converted" && (
                      <div className="flex gap-1 mt-2">
                        {stages.filter(s => s.key !== stage.key).map(s => (
                          <button key={s.key} onClick={() => moveStage(lead.id, s.key)} className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 hover:bg-zinc-700 text-zinc-400" title={`Mover para ${s.label}`}>→{s.label.slice(0, 3)}</button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {getLeadsByStage(stage.key).length === 0 && <div className="text-xs text-white/40 text-center py-8">Nenhum lead</div>}
              </div>
            </div>
          ))}
        </div>
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
            <div className="glass-card p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
              <h2 className="text-lg font-bold mb-4">Novo Lead</h2>
              <div className="space-y-3">
                <Input placeholder="Nome" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                <Input placeholder="Contato" value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} />
                <Input placeholder="Origem" value={form.source} onChange={e => setForm({ ...form, source: e.target.value })} />
                <Input placeholder="Campanha" value={form.campaign} onChange={e => setForm({ ...form, campaign: e.target.value })} />
                <Input placeholder="Produto de interesse" value={form.productInterest} onChange={e => setForm({ ...form, productInterest: e.target.value })} />
                <Input placeholder="Valor potencial" type="number" value={form.potentialValue} onChange={e => setForm({ ...form, potentialValue: e.target.value })} />
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
                  <Button onClick={createLead}>Criar</Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Leads</h1>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setShowKanban(true)}>Kanban</Button>
          <Button onClick={() => setShowModal(true)}><Plus className="w-4 h-4 mr-2" />Novo Lead</Button>
        </div>
      </div>
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input className="pl-9" placeholder="Buscar leads..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>
      <div className="glass-card overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-white/[0.08]">
            <th className="text-left p-3 text-zinc-400 font-medium">Nome</th>
            <th className="text-left p-3 text-zinc-400 font-medium">Contato</th>
            <th className="text-left p-3 text-zinc-400 font-medium">Origem</th>
            <th className="text-left p-3 text-zinc-400 font-medium">Estágio</th>
            <th className="text-left p-3 text-zinc-400 font-medium">Valor</th>
          </tr></thead>
          <tbody>
            {leads.map(lead => (
              <tr key={lead.id} className="border-b border-white/[0.06] hover:bg-white/5">
                <td className="p-3 font-medium">{lead.name}</td>
                <td className="p-3 text-zinc-400">{lead.contact || "—"}</td>
                <td className="p-3 text-zinc-400">{lead.source || "—"}</td>
                <td className="p-3"><Badge variant="outline" className={`${stageColors[lead.stage] || ""}`}>{stages.find(s => s.key === lead.stage)?.label || lead.stage}</Badge></td>
                <td className="p-3 text-green-400">{lead.potentialValue > 0 ? `R$ ${lead.potentialValue.toLocaleString("pt-BR")}` : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {leads.length === 0 && <div className="text-center py-12 text-zinc-500">Nenhum lead encontrado</div>}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="glass-card p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-4">Novo Lead</h2>
            <div className="space-y-3">
              <Input placeholder="Nome" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              <Input placeholder="Contato" value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} />
              <Input placeholder="Origem" value={form.source} onChange={e => setForm({ ...form, source: e.target.value })} />
              <Input placeholder="Campanha" value={form.campaign} onChange={e => setForm({ ...form, campaign: e.target.value })} />
              <Input placeholder="Produto de interesse" value={form.productInterest} onChange={e => setForm({ ...form, productInterest: e.target.value })} />
              <Input placeholder="Valor potencial" type="number" value={form.potentialValue} onChange={e => setForm({ ...form, potentialValue: e.target.value })} />
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
                <Button onClick={createLead}>Criar</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
