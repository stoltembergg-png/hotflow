"use client";
import { useState, useEffect } from "react";
import { Search, Plus, Package, DollarSign, TrendingUp, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: string; name: string; description: string; category: string; price: number;
  promotionalPrice: number; status: string; type: string; totalSales: number;
  totalRevenue: number; avgTicket: number; createdAt: string;
}

const typeLabels: Record<string, string> = { product: "Produto", subscription: "Assinatura", bundle: "Bundle", special: "Oferta Especial" };

export default function ProdutosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", category: "", price: "", promotionalPrice: "", type: "product", checkoutUrl: "" });

  useEffect(() => { fetchProducts(); }, []);
  useEffect(() => { const t = setTimeout(fetchProducts, 300); return () => clearTimeout(t); }, [search]);

  async function fetchProducts() {
    const res = await fetch(`/api/products?search=${search}`);
    const data = await res.json();
    setProducts(data.data || []);
  }

  async function createProduct() {
    await fetch("/api/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, price: parseFloat(form.price) || 0, promotionalPrice: parseFloat(form.promotionalPrice) || 0 }) });
    setShowModal(false); fetchProducts();
  }

  const totalRevenue = products.reduce((s, p) => s + (p.totalRevenue || 0), 0);
  const totalSales = products.reduce((s, p) => s + (p.totalSales || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Produtos</h1>
        <Button onClick={() => setShowModal(true)}><Plus className="w-4 h-4 mr-2" />Novo Produto</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Package, label: "Produtos", value: products.length, color: "text-blue-400" },
          { icon: DollarSign, label: "Receita Total", value: `R$ ${totalRevenue.toLocaleString("pt-BR")}`, color: "text-green-400" },
          { icon: TrendingUp, label: "Vendas", value: totalSales, color: "text-purple-400" },
          { icon: BarChart3, label: "Ticket Médio", value: `R$ ${totalSales > 0 ? (totalRevenue / totalSales).toLocaleString("pt-BR") : "0"}`, color: "text-orange-400" },
        ].map((m, i) => (
          <div key={i} className="glass-card p-4">
            <m.icon className={`w-5 h-5 ${m.color} mb-2`} />
            <p className="text-xs text-zinc-500">{m.label}</p>
            <p className="text-lg font-bold">{m.value}</p>
          </div>
        ))}
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <Input className="pl-9" placeholder="Buscar produtos..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div className="glass-card overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-white/[0.08]">
            <th className="text-left p-3 text-zinc-400 font-medium">Nome</th>
            <th className="text-left p-3 text-zinc-400 font-medium">Tipo</th>
            <th className="text-left p-3 text-zinc-400 font-medium">Categoria</th>
            <th className="text-right p-3 text-zinc-400 font-medium">Preço</th>
            <th className="text-right p-3 text-zinc-400 font-medium">Vendas</th>
            <th className="text-right p-3 text-zinc-400 font-medium">Receita</th>
            <th className="text-left p-3 text-zinc-400 font-medium">Status</th>
          </tr></thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-b border-white/[0.06] hover:bg-white/5">
                <td className="p-3 font-medium">{p.name}</td>
                <td className="p-3 text-zinc-400">{typeLabels[p.type] || p.type}</td>
                <td className="p-3 text-zinc-400">{p.category || "—"}</td>
                <td className="p-3 text-right font-medium">R$ {(p.price || 0).toLocaleString("pt-BR")}</td>
                <td className="p-3 text-right text-zinc-400">{p.totalSales}</td>
                <td className="p-3 text-right text-green-400">R$ {(p.totalRevenue || 0).toLocaleString("pt-BR")}</td>
                <td className="p-3"><Badge variant="outline" className={p.status === "active" ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-zinc-500/10 text-zinc-400"}>{p.status === "active" ? "Ativo" : "Inativo"}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && <div className="text-center py-12 text-zinc-500">Nenhum produto encontrado</div>}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="glass-card p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-4">Novo Produto</h2>
            <div className="space-y-3">
              <Input placeholder="Nome" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              <Input placeholder="Descrição" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              <Input placeholder="Categoria" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
              <Input placeholder="Preço" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
              <Input placeholder="Preço promocional" type="number" value={form.promotionalPrice} onChange={e => setForm({ ...form, promotionalPrice: e.target.value })} />
              <select className="w-full bg-white/[0.02] border border-white/[0.1] rounded-md p-2 text-sm" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                <option value="product">Produto</option><option value="subscription">Assinatura</option><option value="bundle">Bundle</option><option value="special">Oferta Especial</option>
              </select>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
                <Button onClick={createProduct}>Criar</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
