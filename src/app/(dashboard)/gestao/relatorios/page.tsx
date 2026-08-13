"use client";
import { useState, useEffect } from "react";
import { FileText, Download, ShoppingCart, DollarSign, Users, Target, Package, Image, CreditCard, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

const reportTypes = [
  { key: "sales", label: "Vendas", icon: ShoppingCart, color: "text-green-400" },
  { key: "financial", label: "Financeiro", icon: DollarSign, color: "text-orange-400" },
  { key: "customers", label: "Clientes", icon: Users, color: "text-blue-400" },
  { key: "campaigns", label: "Campanhas", icon: Target, color: "text-purple-400" },
  { key: "products", label: "Produtos", icon: Package, color: "text-yellow-400" },
  { key: "content", label: "Conteúdo", icon: Image, color: "text-pink-400" },
  { key: "subscriptions", label: "Assinaturas", icon: CreditCard, color: "text-cyan-400" },
];

export default function RelatoriosPage() {
  const [selected, setSelected] = useState("sales");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/reports?type=${selected}`).then(r => r.json()).then(d => { setData(d); setLoading(false); });
  }, [selected]);

  function exportCSV() {
    if (!data?.data) return;
    const items = Array.isArray(data.data) ? data.data : [];
    if (items.length === 0) return;
    const headers = Object.keys(items[0]).filter(k => typeof items[0][k] !== 'object');
    const rows = items.map((item: any) => headers.map(h => String(item[h] || '')));
    const csv = [headers.join(','), ...rows.map((r: string[]) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `relatorio-${selected}.csv`; a.click();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Relatórios</h1>
        <Button variant="outline" onClick={exportCSV}><Download className="w-4 h-4 mr-2" />Exportar CSV</Button>
      </div>
      <div className="flex gap-2 flex-wrap">
        {reportTypes.map(r => (
          <Button key={r.key} variant={selected === r.key ? "default" : "outline"} size="sm" onClick={() => setSelected(r.key)} className={selected === r.key ? "bg-orange-500 hover:bg-orange-600" : ""}>
            <r.icon className="w-4 h-4 mr-1" />{r.label}
          </Button>
        ))}
      </div>
      <div className="glass-card p-6">
        {loading ? (
          <div className="text-center py-12 text-zinc-500">Carregando...</div>
        ) : data ? (
          <div>
            {selected === "financial" ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: "Receitas", value: `R$ ${(data.revenue || 0).toLocaleString("pt-BR")}`, color: "text-green-400" },
                  { label: "Despesas", value: `R$ ${(data.expenses || 0).toLocaleString("pt-BR")}`, color: "text-red-400" },
                  { label: "Lucro", value: `R$ ${(data.profit || 0).toLocaleString("pt-BR")}`, color: data.profit >= 0 ? "text-green-400" : "text-red-400" },
                ].map((m, i) => (
                  <div key={i} className="glass-card p-4"><p className="text-xs text-zinc-500">{m.label}</p><p className={`text-2xl font-bold ${m.color}`}>{m.value}</p></div>
                ))}
              </div>
            ) : data.data?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-white/[0.08]">
                    {Object.keys(data.data[0]).filter(k => typeof data.data[0][k] !== 'object').map(key => (
                      <th key={key} className="text-left p-2 text-zinc-400 font-medium capitalize">{key}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {data.data.slice(0, 50).map((item: any, i: number) => (
                      <tr key={i} className="border-b border-white/[0.06] hover:bg-white/5">
                        {Object.keys(item).filter(k => typeof item[k] !== 'object').map(key => (
                          <td key={key} className="p-2 text-zinc-300">{String(item[key] || '—')}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-zinc-500">Sem dados disponíveis</div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
