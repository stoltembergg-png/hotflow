"use client";
import { useState, useEffect } from "react";
import { Plus, Filter, FileText, Image, Video, Music, Layout, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Content { id: string; name: string; contentType: string; platform: string; status: string; publishDate: string; caption: string; }

const statusColors: Record<string, string> = { idea: "bg-zinc-500/10 text-zinc-400", production: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20", ready: "bg-blue-500/10 text-blue-400 border-blue-500/20", scheduled: "bg-purple-500/10 text-purple-400 border-purple-500/20", published: "bg-green-500/10 text-green-400 border-green-500/20", archived: "bg-zinc-500/10 text-zinc-500" };
const statusLabels: Record<string, string> = { idea: "Ideia", production: "Em Produção", ready: "Pronto", scheduled: "Agendado", published: "Publicado", archived: "Arquivado" };
const typeIcons: Record<string, any> = { photo: Image, video: Video, reels: Video, story: Image, post: FileText, banner: Layout, text: FileText, audio: Music };

export default function ConteudoPage() {
  const [content, setContent] = useState<Content[]>([]);
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", contentType: "post", platform: "", status: "idea", caption: "" });

  useEffect(() => { fetchContent(); }, [filter, statusFilter]);

  async function fetchContent() {
    const res = await fetch(`/api/content?type=${filter}&status=${statusFilter}`);
    const data = await res.json();
    setContent(data.data || []);
  }

  async function createContent() {
    await fetch("/api/content", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setShowModal(false); fetchContent();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Conteúdo</h1>
        <Button onClick={() => setShowModal(true)}><Plus className="w-4 h-4 mr-2" />Novo Conteúdo</Button>
      </div>
      <div className="flex gap-3 flex-wrap">
        <div className="flex gap-2">
          {["", "photo", "video", "reels", "story", "post", "banner", "text", "audio"].map(t => (
            <Button key={t} variant={filter === t ? "default" : "outline"} size="sm" onClick={() => setFilter(t)} className={filter === t ? "bg-orange-500 hover:bg-orange-600" : ""}>{t || "Todos"}</Button>
          ))}
        </div>
        <div className="flex gap-2">
          {["", "idea", "production", "ready", "scheduled", "published", "archived"].map(s => (
            <Button key={s} variant={statusFilter === s ? "default" : "outline"} size="sm" onClick={() => setStatusFilter(s)} className={statusFilter === s ? "bg-orange-500 hover:bg-orange-600" : ""}>{s ? statusLabels[s] : "Status"}</Button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {content.map(c => {
          const Icon = typeIcons[c.contentType] || FileText;
          return (
            <div key={c.id} className="glass-card p-4">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="capitalize">{c.contentType}</Badge>
                <Badge variant="outline" className={`${statusColors[c.status] || ""}`}>{statusLabels[c.status] || c.status}</Badge>
              </div>
              <h3 className="font-medium mb-1">{c.name}</h3>
              {c.platform && <p className="text-xs text-zinc-500 capitalize">{c.platform}</p>}
              {c.caption && <p className="text-xs text-zinc-400 mt-2 line-clamp-2">{c.caption}</p>}
              {c.publishDate && <p className="text-xs text-zinc-600 mt-2">{new Date(c.publishDate).toLocaleDateString("pt-BR")}</p>}
            </div>
          );
        })}
        {content.length === 0 && <div className="col-span-full text-center py-12 text-zinc-500 glass-card">Nenhum conteúdo criado</div>}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="glass-card p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-4">Novo Conteúdo</h2>
            <div className="space-y-3">
              <Input placeholder="Nome" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              <select className="w-full bg-zinc-900 border border-zinc-700 rounded-md p-2 text-sm" value={form.contentType} onChange={e => setForm({ ...form, contentType: e.target.value })}>
                <option value="photo">Foto</option><option value="video">Vídeo</option><option value="reels">Reels</option><option value="story">Story</option><option value="post">Post</option><option value="banner">Banner</option><option value="text">Texto</option><option value="audio">Áudio</option>
              </select>
              <Input placeholder="Plataforma" value={form.platform} onChange={e => setForm({ ...form, platform: e.target.value })} />
              <select className="w-full bg-zinc-900 border border-zinc-700 rounded-md p-2 text-sm" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="idea">Ideia</option><option value="production">Em Produção</option><option value="ready">Pronto</option><option value="scheduled">Agendado</option><option value="published">Publicado</option>
              </select>
              <textarea className="w-full bg-zinc-900 border border-zinc-700 rounded-md p-2 text-sm h-20" placeholder="Legenda" value={form.caption} onChange={e => setForm({ ...form, caption: e.target.value })} />
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
                <Button onClick={createContent}>Criar</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
