"use client";
import { useState, useEffect } from "react";
import { Plus, Shield, User, Mail, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Member { id: string; name: string; email: string; role: string; createdAt: string; }

const roleLabels: Record<string, string> = { owner: "Owner", admin: "Admin", manager: "Manager", editor: "Editor", finance: "Finance", viewer: "Viewer" };
const roleColors: Record<string, string> = { owner: "bg-orange-500/10 text-orange-400 border-orange-500/20", admin: "bg-purple-500/10 text-purple-400 border-purple-500/20", manager: "bg-blue-500/10 text-blue-400 border-blue-500/20", editor: "bg-green-500/10 text-green-400 border-green-500/20", finance: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20", viewer: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" };

export default function EquipePage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "viewer" });

  useEffect(() => { fetch("/api/team").then(r => r.json()).then(d => setMembers(d.data || [])); }, []);

  async function createMember() {
    await fetch("/api/team", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setShowModal(false);
    fetch("/api/team").then(r => r.json()).then(d => setMembers(d.data || []));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Equipe</h1>
        <Button onClick={() => setShowModal(true)}><Plus className="w-4 h-4 mr-2" />Adicionar Membro</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map(m => (
          <div key={m.id} className="glass-card p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                <User className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <p className="font-medium">{m.name}</p>
                <p className="text-xs text-zinc-500">{m.email}</p>
              </div>
            </div>
            <Badge variant="outline" className={`${roleColors[m.role] || roleColors.viewer}`}>{roleLabels[m.role] || m.role}</Badge>
            <p className="text-xs text-zinc-600 mt-2">Desde {new Date(m.createdAt).toLocaleDateString("pt-BR")}</p>
          </div>
        ))}
        {members.length === 0 && <div className="col-span-full text-center py-12 text-zinc-500 glass-card">Nenhum membro na equipe</div>}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="glass-card p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-4">Adicionar Membro</h2>
            <div className="space-y-3">
              <Input placeholder="Nome" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              <Input placeholder="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              <select className="w-full bg-zinc-900 border border-zinc-700 rounded-md p-2 text-sm" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                {Object.entries(roleLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
                <Button onClick={createMember}>Adicionar</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
