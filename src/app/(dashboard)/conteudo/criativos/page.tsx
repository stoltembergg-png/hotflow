"use client";

import { useState, useEffect } from "react";
import { Image, Video, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Creative {
  id: string;
  name: string;
  type: "image" | "video";
  platform: string;
  ctr: number;
  clicks: number;
  conversions: number;
  revenue: number;
  roas: number;
  status: string;
}

export default function CriativosPage() {
  const [creatives, setCreatives] = useState<Creative[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"ctr" | "conversions" | "revenue" | "roas">("roas");

  useEffect(() => {
    fetch("/api/creatives")
      .then((res) => res.json())
      .then((json) => {
        setCreatives(json.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const sorted = [...creatives].sort((a, b) => b[sortBy] - a[sortBy]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Criativos</h1>
        </div>
        <div className="glass-card p-4 animate-pulse">
          <div className="h-5 w-48 bg-zinc-800 rounded mb-4" />
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/50">
                <div className="w-8 h-6 bg-zinc-800 rounded" />
                <div className="w-10 h-10 rounded-lg bg-zinc-800" />
                <div className="flex-1">
                  <div className="h-4 w-1/3 bg-zinc-800 rounded mb-1" />
                  <div className="h-3 w-1/6 bg-zinc-800 rounded" />
                </div>
                <div className="grid grid-cols-4 gap-6">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="text-right">
                      <div className="h-3 w-8 bg-zinc-800 rounded mb-1 ml-auto" />
                      <div className="h-4 w-12 bg-zinc-800 rounded ml-auto" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Criativos</h1>
        <div className="flex gap-2">
          {(["ctr", "conversions", "revenue", "roas"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className={`px-3 py-1.5 text-xs rounded-lg border transition ${
                sortBy === s ? "bg-orange-500/10 border-orange-500/30 text-orange-400" : "border-zinc-700 text-zinc-400 hover:border-zinc-600"
              }`}
            >
              {s === "ctr" ? "Maior CTR" : s === "conversions" ? "Maior Conversão" : s === "revenue" ? "Maior Receita" : "Maior ROAS"}
            </button>
          ))}
        </div>
      </div>
      <div className="glass-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <Trophy className="w-5 h-5 text-yellow-400" />
          <h2 className="font-bold">Ranking de Criativos</h2>
        </div>
        <div className="space-y-2">
          {sorted.length === 0 ? (
            <div className="p-8 text-center text-zinc-500">Nenhum criativo encontrado. Crie conteúdos na aba Conteúdo.</div>
          ) : (
            sorted.map((c, i) => (
              <div key={c.id} className="flex items-center gap-4 p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/50">
                <span className="text-lg font-bold text-zinc-500 w-8">#{i + 1}</span>
                <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                  {c.type === "video" ? <Video className="w-5 h-5 text-zinc-400" /> : <Image className="w-5 h-5 text-zinc-400" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{c.name}</p>
                  <p className="text-xs text-zinc-500 capitalize">{c.platform}</p>
                </div>
                <div className="grid grid-cols-4 gap-6 text-right">
                  <div>
                    <p className="text-xs text-zinc-500">CTR</p>
                    <p className="text-sm font-medium">{c.ctr}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Cliques</p>
                    <p className="text-sm font-medium">{c.clicks.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Conversões</p>
                    <p className="text-sm font-medium text-green-400">{c.conversions}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Receita</p>
                    <p className="text-sm font-medium text-green-400">R$ {c.revenue.toLocaleString("pt-BR")}</p>
                  </div>
                </div>
                <Badge className={`${c.roas >= 4 ? "bg-green-500/10 text-green-400 border-green-500/20" : c.roas >= 3 ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>
                  {c.roas}x ROAS
                </Badge>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}