"use client";
import { useState } from "react";
import { Settings, User, Shield, Bell, Palette, Puzzle, Lock, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const sections = [
  { key: "profile", label: "Perfil", icon: User },
  { key: "team", label: "Equipe", icon: Shield },
  { key: "notifications", label: "Notificações", icon: Bell },
  { key: "theme", label: "Tema", icon: Palette },
  { key: "integrations", label: "Integrações", icon: Puzzle },
  { key: "security", label: "Segurança", icon: Lock },
  { key: "plan", label: "Plano", icon: CreditCard },
];

export default function ConfiguracoesPage() {
  const [active, setActive] = useState("profile");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Configurações</h1>
      <div className="flex gap-6">
        <div className="w-48 shrink-0 space-y-1">
          {sections.map(s => (
            <button key={s.key} onClick={() => setActive(s.key)} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${active === s.key ? "bg-orange-500/10 text-orange-400" : "text-zinc-400 hover:bg-zinc-800"}`}>
              <s.icon className="w-4 h-4" />{s.label}
            </button>
          ))}
        </div>
        <div className="flex-1 glass-card p-6">
          {active === "profile" && (
            <div className="space-y-4">
              <h2 className="font-bold text-lg">Perfil</h2>
              <Input placeholder="Nome" defaultValue="Admin HOTFLOW" />
              <Input placeholder="Email" defaultValue="admin@hotflow.com" type="email" />
              <Input placeholder="Telefone" />
              <Button className="bg-orange-500 hover:bg-orange-600">Salvar</Button>
            </div>
          )}
          {active === "team" && (
            <div className="space-y-4">
              <h2 className="font-bold text-lg">Equipe</h2>
              <p className="text-sm text-zinc-400">Gerencie membros e permissões da equipe.</p>
              <Button variant="outline" onClick={() => window.location.href = '/dashboard/gestao/equipe'}>Ir para Equipe</Button>
            </div>
          )}
          {active === "notifications" && (
            <div className="space-y-4">
              <h2 className="font-bold text-lg">Notificações</h2>
              {["Vendas", "Campanhas", "Pagamentos", "Tarefas", "Sistema"].map(n => (
                <div key={n} className="flex items-center justify-between p-3 bg-zinc-900/50 rounded-lg">
                  <span className="text-sm">{n}</span>
                  <div className="w-10 h-5 bg-orange-500 rounded-full relative cursor-pointer">
                    <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition" />
                  </div>
                </div>
              ))}
            </div>
          )}
          {active === "theme" && (
            <div className="space-y-4">
              <h2 className="font-bold text-lg">Tema</h2>
              <div className="flex gap-4">
                <div className="w-24 h-24 rounded-xl bg-[#09090b] border-2 border-orange-500 flex items-center justify-center cursor-pointer">
                  <span className="text-xs text-zinc-400">Dark</span>
                </div>
                <div className="w-24 h-24 rounded-xl bg-white border-2 border-zinc-300 flex items-center justify-center cursor-pointer">
                  <span className="text-xs text-zinc-600">Light</span>
                </div>
              </div>
            </div>
          )}
          {active === "integrations" && (
            <div className="space-y-4">
              <h2 className="font-bold text-lg">Integrações</h2>
              {["Instagram", "Facebook", "TikTok", "Google", "Telegram"].map(i => (
                <div key={i} className="flex items-center justify-between p-3 bg-zinc-900/50 rounded-lg">
                  <span className="text-sm font-medium">{i}</span>
                  <Badge variant="outline" className="bg-zinc-500/10 text-zinc-400">Não conectado</Badge>
                </div>
              ))}
            </div>
          )}
          {active === "security" && (
            <div className="space-y-4">
              <h2 className="font-bold text-lg">Segurança</h2>
              <Input placeholder="Senha atual" type="password" />
              <Input placeholder="Nova senha" type="password" />
              <Input placeholder="Confirmar senha" type="password" />
              <Button className="bg-orange-500 hover:bg-orange-600">Alterar Senha</Button>
            </div>
          )}
          {active === "plan" && (
            <div className="space-y-4">
              <h2 className="font-bold text-lg">Plano</h2>
              <div className="glass-card p-4 border-orange-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold">Plano Atual: <span className="gradient-text">Free</span></p>
                    <p className="text-sm text-zinc-400">Funcionalidades básicas</p>
                  </div>
                  <Button className="bg-orange-500 hover:bg-orange-600">Fazer Upgrade</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
