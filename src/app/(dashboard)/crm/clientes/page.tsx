"use client";
import { useState, useEffect } from "react";
import { Search, Plus, Eye, Trash2, Mail, Phone, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Customer {
  id: string; name: string; email: string; phone: string; telegram: string;
  status: string; source: string; totalSpent: number; orderCount: number;
  createdAt: string; tags: any[];
}

const statusColors: Record<string, string> = {
  active: "bg-green-500/10 text-green-400 border-green-500/20",
  vip: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  inactive: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  recovery: "bg-red-500/10 text-red-400 border-red-500/20",
  subscriber: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  new: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

export default function ClientesPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState<Customer | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", telegram: "", source: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchCustomers(); }, [statusFilter]);
  useEffect(() => { const t = setTimeout(fetchCustomers, 300); return () => clearTimeout(t); }, [search]);

  async function fetchCustomers() {
    setLoading(true);
    const res = await fetch(`/api/customers?search=${search}&status=${statusFilter}`);
    const data = await res.json();
    setCustomers(data.data || []);
    setLoading(false);
  }

  async function createCustomer() {
    await fetch("/api/customers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setShowModal(false);
    setForm({ name: "", email: "", phone: "", telegram: "", source: "" });
    fetchCustomers();
  }

  const filters = ["", "new", "active", "vip", "inactive", "recovery", "subscriber"];
  const filterLabels: Record<string, string> = { "": "Todos", new: "Novo", active: "Ativo", vip: "VIP", inactive: "Inativo", recovery: "Recuperação", subscriber: "Assinante" };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Clientes</h1>
        <Button onClick={() => setShowModal(true)}><Plus className="w-4 h-4 mr-2" />Novo Cliente</Button>
      </div>
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input className="pl-9" placeholder="Buscar clientes..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {filters.map(f => (
          <Button key={f} variant={statusFilter === f ? "default" : "outline"} size="sm" onClick={() => setStatusFilter(f)} className={statusFilter === f ? "bg-orange-500 hover:bg-orange-600" : ""}>{filterLabels[f]}</Button>
        ))}
      </div>
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-zinc-800">
              <th className="text-left p-3 text-zinc-400 font-medium">Nome</th>
              <th className="text-left p-3 text-zinc-400 font-medium">Email</th>
              <th className="text-left p-3 text-zinc-400 font-medium">Status</th>
              <th className="text-left p-3 text-zinc-400 font-medium">Compras</th>
              <th className="text-left p-3 text-zinc-400 font-medium">Total Gasto</th>
              <th className="text-left p-3 text-zinc-400 font-medium">Origem</th>
              <th className="text-left p-3 text-zinc-400 font-medium">Ações</th>
            </tr></thead>
            <tbody>
              {customers.map(c => (
                <tr key={c.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 cursor-pointer" onClick={() => setShowDetail(c)}>
                  <td className="p-3 font-medium">{c.name}</td>
                  <td className="p-3 text-zinc-400">{c.email}</td>
                  <td className="p-3"><Badge variant="outline" className={`${statusColors[c.status] || statusColors.active}`}>{c.status}</Badge></td>
                  <td className="p-3 text-zinc-400">{c.orderCount}</td>
                  <td className="p-3 text-green-400 font-medium">R$ {(c.totalSpent || 0).toLocaleString("pt-BR")}</td>
                  <td className="p-3 text-zinc-400">{c.source || "—"}</td>
                  <td className="p-3"><Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {customers.length === 0 && <div className="text-center py-12 text-zinc-500">Nenhum cliente encontrado</div>}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="glass-card p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-4">Novo Cliente</h2>
            <div className="space-y-3">
              <Input placeholder="Nome" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              <Input placeholder="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              <Input placeholder="Telefone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              <Input placeholder="Telegram" value={form.telegram} onChange={e => setForm({ ...form, telegram: e.target.value })} />
              <Input placeholder="Origem" value={form.source} onChange={e => setForm({ ...form, source: e.target.value })} />
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
                <Button onClick={createCustomer}>Criar</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDetail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowDetail(null)}>
          <div className="glass-card p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">{showDetail.name}</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowDetail(null)}>✕</Button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-card p-3"><p className="text-xs text-zinc-500">Email</p><p className="text-sm">{showDetail.email || "—"}</p></div>
                <div className="glass-card p-3"><p className="text-xs text-zinc-500">Telefone</p><p className="text-sm">{showDetail.phone || "—"}</p></div>
                <div className="glass-card p-3"><p className="text-xs text-zinc-500">Telegram</p><p className="text-sm">{showDetail.telegram || "—"}</p></div>
                <div className="glass-card p-3"><p className="text-xs text-zinc-500">Status</p><Badge variant="outline" className={`${statusColors[showDetail.status] || statusColors.active}`}>{showDetail.status}</Badge></div>
                <div className="glass-card p-3"><p className="text-xs text-zinc-500">Total Gasto</p><p className="text-sm text-green-400 font-bold">R$ {(showDetail.totalSpent || 0).toLocaleString("pt-BR")}</p></div>
                <div className="glass-card p-3"><p className="text-xs text-zinc-500">Compras</p><p className="text-sm font-bold">{showDetail.orderCount}</p></div>
              </div>
              <div className="glass-card p-3"><p className="text-xs text-zinc-500 mb-1">Origem</p><p className="text-sm">{showDetail.source || "—"}</p></div>
              <div className="glass-card p-3">
                <p className="text-xs text-zinc-500 mb-1">Tags</p>
                <div className="flex gap-1 flex-wrap">
                  {showDetail.tags?.length > 0 ? showDetail.tags.map((t: any, i: number) => <Badge key={i} variant="secondary">{t.name || t}</Badge>) : <span className="text-sm text-zinc-500">Sem tags</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
