"use client";
import { useState, useEffect } from "react";
import { Plus, Tag, Percent, ArrowDown, ArrowUp, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Offer { id: string; name: string; originalPrice: number; promotionalPrice: number; discount: number; status: string; type: string; cta: string; description: string; createdAt: string; }

export default function OfertasPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", originalPrice: "", promotionalPrice: "", type: "standard", cta: "", description: "", status: "active" });

  useEffect(() => { fetch("/api/offers").then(r => r.json()).then(d => setOffers(d.data || [])); }, []);

  async function createOffer() {
    await fetch("/api/offers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, originalPrice: parseFloat(form.originalPrice) || 0, promotionalPrice: parseFloat(form.promotionalPrice) || 0 }) });
    setShowModal(false);
    fetch("/api/offers").then(r => r.json()).then(d => setOffers(d.data || []));
  }

  const typeIcons: Record<string, any> = { standard: Tag, upsell: ArrowUp, downsell: ArrowDown, bump: Package };
  const typeLabels: Record<string, string> = { standard: "Padrão", upsell: "Upsell", downsell: "Downsell", bump: "Order Bump", bundle: "Bundle" };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Ofertas</h1>
        <Button onClick={() => setShowModal(true)}><Plus className="w-4 h-4 mr-2" />Nova Oferta</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {offers.map(o => {
          const Icon = typeIcons[o.type] || Tag;
          return (
            <div key={o.id} className="glass-card p-5">
              <div className="flex items-center justify-between mb-3">
                <Badge variant="outline" className="bg-orange-500/10 text-orange-400 border-orange-500/20"><Icon className="w-3 h-3 mr-1" />{typeLabels[o.type] || o.type}</Badge>
                <Badge variant="outline" className={o.status === "active" ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-zinc-500/10 text-zinc-400"}>{o.status}</Badge>
              </div>
              <h3 className="font-bold mb-1">{o.name}</h3>
              {o.description && <p className="text-xs text-zinc-400 mb-3">{o.description}</p>}
              <div className="flex items-center gap-3">
                {o.originalPrice > 0 && <span className="text-sm text-zinc-500 line-through">R$ {o.originalPrice.toLocaleString("pt-BR")}</span>}
                {o.promotionalPrice > 0 && <span className="text-lg font-bold text-green-400">R$ {o.promotionalPrice.toLocaleString("pt-BR")}</span>}
                {o.discount > 0 && <Badge className="bg-red-500/10 text-red-400">-{o.discount.toFixed(0)}%</Badge>}
              </div>
              {o.cta && <p className="text-xs text-zinc-500 mt-2">CTA: {o.cta}</p>}
            </div>
          );
        })}
        {offers.length === 0 && <div className="col-span-full text-center py-12 text-zinc-500 glass-card">Nenhuma oferta criada</div>}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="glass-card p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-4">Nova Oferta</h2>
            <div className="space-y-3">
              <Input placeholder="Nome" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              <Input placeholder="Preço original" type="number" value={form.originalPrice} onChange={e => setForm({ ...form, originalPrice: e.target.value })} />
              <Input placeholder="Preço promocional" type="number" value={form.promotionalPrice} onChange={e => setForm({ ...form, promotionalPrice: e.target.value })} />
              <select className="w-full bg-zinc-900 border border-zinc-700 rounded-md p-2 text-sm" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                <option value="standard">Padrão</option><option value="upsell">Upsell</option><option value="downsell">Downsell</option><option value="bump">Order Bump</option><option value="bundle">Bundle</option>
              </select>
              <Input placeholder="CTA" value={form.cta} onChange={e => setForm({ ...form, cta: e.target.value })} />
              <Input placeholder="Descrição" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
                <Button onClick={createOffer}>Criar</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
