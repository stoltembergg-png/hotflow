"use client";
import { useState } from "react";
import { Image, Video, Eye, MousePointerClick, TrendingUp, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const mockCreatives = [
  { id: "1", name: "Carrossel Lançamento", type: "image", platform: "instagram", ctr: 3.2, clicks: 1250, conversions: 45, revenue: 8900, roas: 4.5 },
  { id: "2", name: "Vídeo Depoimento", type: "video", platform: "instagram", ctr: 4.1, clicks: 2100, conversions: 78, revenue: 15600, roas: 5.2 },
  { id: "3", name: "Story Promocional", type: "image", platform: "instagram", ctr: 2.8, clicks: 890, conversions: 22, revenue: 4400, roas: 3.1 },
  { id: "4", name: "Reels Tutorial", type: "video", platform: "tiktok", ctr: 5.2, clicks: 3400, conversions: 95, revenue: 19000, roas: 6.1 },
  { id: "5", name: "Post Estático", type: "image", platform: "facebook", ctr: 1.9, clicks: 560, conversions: 12, revenue: 2400, roas: 2.3 },
  { id: "6", name: "Vídeo Curto", type: "video", platform: "tiktok", ctr: 4.8, clicks: 2800, conversions: 67, revenue: 13400, roas: 4.8 },
];

export default function CriativosPage() {
  const [sortBy, setSortBy] = useState<"ctr" | "conversions" | "revenue" | "roas">("roas");
  const sorted = [...mockCreatives].sort((a, b) => b[sortBy] - a[sortBy]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Criativos</h1>
        <div className="flex gap-2">
          {(["ctr", "conversions", "revenue", "roas"] as const).map(s => (
            <button key={s} onClick={() => setSortBy(s)} className={`px-3 py-1.5 text-xs rounded-lg border transition ${sortBy === s ? "bg-orange-500/10 border-orange-500/30 text-orange-400" : "border-zinc-700 text-zinc-400 hover:border-zinc-600"}`}>
              {s === "ctr" ? "Maior CTR" : s === "conversions" ? "Maior Conversão" : s === "revenue" ? "Maior Receita" : "Maior ROAS"}
            </button>
          ))}
        </div>
      </div>
      <div className="glass-card p-4">
        <div className="flex items-center gap-2 mb-3"><Trophy className="w-5 h-5 text-yellow-400" /><h2 className="font-bold">Ranking de Criativos</h2></div>
        <div className="space-y-2">
          {sorted.map((c, i) => (
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
                <div><p className="text-xs text-zinc-500">CTR</p><p className="text-sm font-medium">{c.ctr}%</p></div>
                <div><p className="text-xs text-zinc-500">Cliques</p><p className="text-sm font-medium">{c.clicks.toLocaleString()}</p></div>
                <div><p className="text-xs text-zinc-500">Conversões</p><p className="text-sm font-medium text-green-400">{c.conversions}</p></div>
                <div><p className="text-xs text-zinc-500">Receita</p><p className="text-sm font-medium text-green-400">R$ {c.revenue.toLocaleString("pt-BR")}</p></div>
              </div>
              <Badge className={`${c.roas >= 4 ? "bg-green-500/10 text-green-400 border-green-500/20" : c.roas >= 3 ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>{c.roas}x ROAS</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
