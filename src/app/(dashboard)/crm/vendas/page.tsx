"use client";
import { useState, useEffect } from "react";
import { Search, Plus, Download, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Order {
  id: string; customer: { name: string }; product: { name: string };
  totalAmount: number; discount: number; fees: number; netAmount: number;
  paymentMethod: string; status: string; source: string; createdAt: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  paid: "bg-green-500/10 text-green-400 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
  refunded: "bg-purple-500/10 text-purple-400 border-purple-500/20",
};

const statusLabels: Record<string, string> = {
  pending: "Pendente", paid: "Pago", cancelled: "Cancelado", refunded: "Reembolsado",
};

export default function VendasPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ customerId: "", productId: "", totalAmount: "", discount: "", fees: "", paymentMethod: "pix", source: "" });

  useEffect(() => { fetchOrders(); }, [statusFilter, page]);

  async function fetchOrders() {
    const res = await fetch(`/api/orders?search=${search}&status=${statusFilter}&page=${page}&limit=15`);
    const data = await res.json();
    setOrders(data.data || []);
    setTotalPages(data.totalPages || 1);
    setTotal(data.total || 0);
  }

  useEffect(() => { const t = setTimeout(fetchOrders, 300); return () => clearTimeout(t); }, [search]);

  async function createOrder() {
    await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
      ...form, totalAmount: parseFloat(form.totalAmount) || 0, discount: parseFloat(form.discount) || 0, fees: parseFloat(form.fees) || 0, status: "paid",
    }) });
    setShowModal(false);
    fetchOrders();
  }

  function exportCSV() {
    const headers = ["ID","Cliente","Produto","Bruto","Desconto","Taxa","Líquido","Método","Status","Data"];
    const rows = orders.map(o => [o.id.slice(0,8), o.customer?.name, o.product?.name, o.totalAmount, o.discount, o.fees, o.netAmount, o.paymentMethod, o.status, new Date(o.createdAt).toLocaleDateString("pt-BR")]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "vendas.csv"; a.click();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Vendas</h1>
          <p className="text-sm text-zinc-400">{total} vendas encontradas</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={exportCSV}><Download className="w-4 h-4 mr-2" />CSV</Button>
          <Button onClick={() => setShowModal(true)}><Plus className="w-4 h-4 mr-2" />Nova Venda</Button>
        </div>
      </div>
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input className="pl-9" placeholder="Buscar vendas..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {["", "pending", "paid", "cancelled", "refunded"].map(s => (
          <Button key={s} variant={statusFilter === s ? "default" : "outline"} size="sm" onClick={() => { setStatusFilter(s); setPage(1); }} className={statusFilter === s ? "bg-orange-500 hover:bg-orange-600" : ""}>{s ? statusLabels[s] : "Todos"}</Button>
        ))}
      </div>
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-zinc-800">
              <th className="text-left p-3 text-zinc-400 font-medium">ID</th>
              <th className="text-left p-3 text-zinc-400 font-medium">Cliente</th>
              <th className="text-left p-3 text-zinc-400 font-medium">Produto</th>
              <th className="text-right p-3 text-zinc-400 font-medium">Bruto</th>
              <th className="text-right p-3 text-zinc-400 font-medium">Líquido</th>
              <th className="text-left p-3 text-zinc-400 font-medium">Método</th>
              <th className="text-left p-3 text-zinc-400 font-medium">Status</th>
              <th className="text-left p-3 text-zinc-400 font-medium">Data</th>
            </tr></thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                  <td className="p-3 text-zinc-400 font-mono text-xs">#{o.id.slice(0, 8)}</td>
                  <td className="p-3 font-medium">{o.customer?.name || "—"}</td>
                  <td className="p-3 text-zinc-400">{o.product?.name || "—"}</td>
                  <td className="p-3 text-right">R$ {(o.totalAmount || 0).toLocaleString("pt-BR")}</td>
                  <td className="p-3 text-right text-green-400 font-medium">R$ {(o.netAmount || 0).toLocaleString("pt-BR")}</td>
                  <td className="p-3 text-zinc-400 capitalize">{o.paymentMethod || "—"}</td>
                  <td className="p-3"><Badge variant="outline" className={`${statusColors[o.status] || ""}`}>{statusLabels[o.status] || o.status}</Badge></td>
                  <td className="p-3 text-zinc-400">{new Date(o.createdAt).toLocaleDateString("pt-BR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {orders.length === 0 && <div className="text-center py-12 text-zinc-500">Nenhuma venda encontrada</div>}
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Anterior</Button>
          <span className="text-sm text-zinc-400">{page} / {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Próxima</Button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="glass-card p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-4">Nova Venda</h2>
            <div className="space-y-3">
              <Input placeholder="ID do Cliente" value={form.customerId} onChange={e => setForm({ ...form, customerId: e.target.value })} />
              <Input placeholder="ID do Produto" value={form.productId} onChange={e => setForm({ ...form, productId: e.target.value })} />
              <Input placeholder="Valor bruto" type="number" value={form.totalAmount} onChange={e => setForm({ ...form, totalAmount: e.target.value })} />
              <Input placeholder="Desconto" type="number" value={form.discount} onChange={e => setForm({ ...form, discount: e.target.value })} />
              <Input placeholder="Taxas" type="number" value={form.fees} onChange={e => setForm({ ...form, fees: e.target.value })} />
              <select className="w-full bg-zinc-900 border border-zinc-700 rounded-md p-2 text-sm" value={form.paymentMethod} onChange={e => setForm({ ...form, paymentMethod: e.target.value })}>
                <option value="pix">PIX</option><option value="credit_card">Cartão</option><option value="boleto">Boleto</option><option value="crypto">Crypto</option>
              </select>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
                <Button onClick={createOrder}>Criar</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
