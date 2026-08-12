"use client";

import { useState, useEffect } from "react";
import {
  Settings,
  User,
  Shield,
  Bell,
  Palette,
  Puzzle,
  Lock,
  CreditCard,
  Save,
  CheckCircle2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/auth-store";
import { cn } from "@/lib/utils";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl: string | null;
  organization: { name: string; plan: string } | null;
}

interface NotificationPrefs {
  vendas: boolean;
  campanhas: boolean;
  pagamentos: boolean;
  tarefas: boolean;
  sistema: boolean;
}

const sections = [
  { key: "profile", label: "Perfil", icon: User },
  { key: "security", label: "Seguranca", icon: Lock },
  { key: "notifications", label: "Notificacoes", icon: Bell },
  { key: "theme", label: "Tema", icon: Palette },
  { key: "integrations", label: "Integracoes", icon: Puzzle },
  { key: "plan", label: "Plano", icon: CreditCard },
];

export default function ConfiguracoesPage() {
  const { user: authUser } = useAuthStore();
  const [active, setActive] = useState("profile");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Profile form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Notification prefs (stored in localStorage)
  const [notifPrefs, setNotifPrefs] = useState<NotificationPrefs>({
    vendas: true,
    campanhas: true,
    pagamentos: true,
    tarefas: true,
    sistema: true,
  });

  // Theme
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((json) => {
        if (json.user) {
          setProfile(json.user);
          setName(json.user.name || "");
          setEmail(json.user.email || "");
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    // Load notification prefs from localStorage
    const saved = localStorage.getItem("hotflow_notif_prefs");
    if (saved) setNotifPrefs(JSON.parse(saved));

    const savedTheme = localStorage.getItem("hotflow_theme") as "dark" | "light";
    if (savedTheme) setTheme(savedTheme);
  }, []);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const json = await res.json();
      if (res.ok) {
        showToast("success", "Perfil atualizado com sucesso");
        if (json.user) {
          setProfile((prev) => prev ? { ...prev, ...json.user } : prev);
        }
      } else {
        showToast("error", json.error || "Erro ao salvar");
      }
    } catch {
      showToast("error", "Erro de conexao");
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    if (newPassword !== confirmPassword) {
      showToast("error", "As senhas nao conferem");
      return;
    }
    if (newPassword.length < 6) {
      showToast("error", "A nova senha deve ter pelo menos 6 caracteres");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const json = await res.json();
      if (res.ok) {
        showToast("success", "Senha alterada com sucesso");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        showToast("error", json.error || "Erro ao alterar senha");
      }
    } catch {
      showToast("error", "Erro de conexao");
    } finally {
      setSaving(false);
    }
  };

  const saveNotifPrefs = (prefs: NotificationPrefs) => {
    setNotifPrefs(prefs);
    localStorage.setItem("hotflow_notif_prefs", JSON.stringify(prefs));
    showToast("success", "Preferencias de notificacao salvas");
  };

  const toggleTheme = (t: "dark" | "light") => {
    setTheme(t);
    localStorage.setItem("hotflow_theme", t);
    showToast("success", `Tema alterado para ${t === "dark" ? "Escuro" : "Claro"}`);
  };

  return (
    <div className="space-y-6 animate-fadeIn relative">
      {/* Toast */}
      {toast && (
        <div
          className={cn(
            "fixed top-6 right-6 z-[100] flex items-center gap-2 px-4 py-3 rounded-xl shadow-2xl border transition-all duration-300",
            toast.type === "success"
              ? "bg-green-500/10 border-green-500/20 text-green-400"
              : "bg-red-500/10 border-red-500/20 text-red-400"
          )}
        >
          {toast.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <X className="w-4 h-4" />}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      <h1 className="text-2xl font-bold">Configuracoes</h1>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-48 shrink-0 space-y-1">
          {sections.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.key}
                onClick={() => setActive(s.key)}
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200",
                  active === s.key
                    ? "bg-orange-500/10 text-orange-400"
                    : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-300"
                )}
              >
                <Icon className="w-4 h-4" />
                {s.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 glass-card p-6">
          {loading ? (
            <div className="space-y-4">
              <div className="h-6 w-32 bg-zinc-800 rounded animate-pulse" />
              <div className="h-10 w-full bg-zinc-800 rounded animate-pulse" />
              <div className="h-10 w-full bg-zinc-800 rounded animate-pulse" />
            </div>
          ) : (
            <>
              {/* Profile */}
              {active === "profile" && (
                <div className="space-y-4 animate-fadeIn">
                  <h2 className="font-bold text-lg">Perfil</h2>
                  <p className="text-sm text-zinc-500">Atualize suas informacoes pessoais.</p>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-zinc-500 mb-1 block">Nome</label>
                      <Input placeholder="Seu nome" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-500 mb-1 block">Email</label>
                      <Input placeholder="Seu email" value={email} type="email" onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-500 mb-1 block">Funcao</label>
                      <Input value={profile?.role || "owner"} disabled className="opacity-50" />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-500 mb-1 block">Organizacao</label>
                      <Input value={profile?.organization?.name || "-"} disabled className="opacity-50" />
                    </div>
                  </div>
                  <Button
                    className="bg-orange-500 hover:bg-orange-600"
                    onClick={saveProfile}
                    disabled={saving}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? "Salvando..." : "Salvar"}
                  </Button>
                </div>
              )}

              {/* Security */}
              {active === "security" && (
                <div className="space-y-4 animate-fadeIn">
                  <h2 className="font-bold text-lg">Seguranca</h2>
                  <p className="text-sm text-zinc-500">Altere sua senha de acesso.</p>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-zinc-500 mb-1 block">Senha atual</label>
                      <Input placeholder="Digite sua senha atual" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-500 mb-1 block">Nova senha</label>
                      <Input placeholder="Digite a nova senha" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-500 mb-1 block">Confirmar senha</label>
                      <Input placeholder="Confirme a nova senha" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    </div>
                  </div>
                  <Button
                    className="bg-orange-500 hover:bg-orange-600"
                    onClick={changePassword}
                    disabled={saving || !currentPassword || !newPassword || !confirmPassword}
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    {saving ? "Alterando..." : "Alterar Senha"}
                  </Button>
                </div>
              )}

              {/* Notifications */}
              {active === "notifications" && (
                <div className="space-y-4 animate-fadeIn">
                  <h2 className="font-bold text-lg">Notificacoes</h2>
                  <p className="text-sm text-zinc-500">Configure quais notificacoes deseja receber.</p>
                  {Object.entries({
                    vendas: "Vendas",
                    campanhas: "Campanhas",
                    pagamentos: "Pagamentos",
                    tarefas: "Tarefas",
                    sistema: "Sistema",
                  }).map(([key, label]) => (
                    <div key={key} className="flex items-center justify-between p-3 bg-zinc-900/50 rounded-lg">
                      <span className="text-sm">{label}</span>
                      <button
                        onClick={() =>
                          saveNotifPrefs({
                            ...notifPrefs,
                            [key]: !notifPrefs[key as keyof NotificationPrefs],
                          })
                        }
                        className={cn(
                          "w-10 h-5 rounded-full relative transition-colors duration-200",
                          notifPrefs[key as keyof NotificationPrefs]
                            ? "bg-orange-500"
                            : "bg-zinc-700"
                        )}
                      >
                        <div
                          className={cn(
                            "absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-200",
                            notifPrefs[key as keyof NotificationPrefs]
                              ? "right-0.5"
                              : "left-0.5"
                          )}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Theme */}
              {active === "theme" && (
                <div className="space-y-4 animate-fadeIn">
                  <h2 className="font-bold text-lg">Tema</h2>
                  <p className="text-sm text-zinc-500">Escolha a aparencia da aplicacao.</p>
                  <div className="flex gap-4">
                    <button
                      onClick={() => toggleTheme("dark")}
                      className={cn(
                        "w-28 h-28 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-200 border-2",
                        theme === "dark"
                          ? "bg-[#09090b] border-orange-500"
                          : "bg-zinc-800 border-zinc-700 hover:border-zinc-600"
                      )}
                    >
                      <div className="text-center">
                        <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700 mx-auto mb-2" />
                        <span className="text-xs text-zinc-400">Escuro</span>
                      </div>
                    </button>
                    <button
                      onClick={() => toggleTheme("light")}
                      className={cn(
                        "w-28 h-28 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-200 border-2",
                        theme === "light"
                          ? "bg-white border-orange-500"
                          : "bg-zinc-800 border-zinc-700 hover:border-zinc-600"
                      )}
                    >
                      <div className="text-center">
                        <div className="w-8 h-8 rounded-lg bg-zinc-100 border border-zinc-300 mx-auto mb-2" />
                        <span className="text-xs text-zinc-600">Claro</span>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* Integrations */}
              {active === "integrations" && (
                <div className="space-y-4 animate-fadeIn">
                  <h2 className="font-bold text-lg">Integracoes</h2>
                  <p className="text-sm text-zinc-500">Conecte suas plataformas de marketing.</p>
                  {["Instagram", "Facebook", "TikTok", "Google Ads", "Telegram"].map((i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-zinc-900/50 rounded-lg">
                      <span className="text-sm font-medium">{i}</span>
                      <Badge variant="outline" className="bg-zinc-500/10 text-zinc-400">
                        Nao conectado
                      </Badge>
                    </div>
                  ))}
                </div>
              )}

              {/* Plan */}
              {active === "plan" && (
                <div className="space-y-4 animate-fadeIn">
                  <h2 className="font-bold text-lg">Plano</h2>
                  <div className="glass-card p-4 border-orange-500/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold">
                          Plano Atual:{" "}
                          <span className="gradient-text">
                            {profile?.organization?.plan || "Free"}
                          </span>
                        </p>
                        <p className="text-sm text-zinc-400">Funcionalidades basicas</p>
                      </div>
                      <Button className="bg-orange-500 hover:bg-orange-600">Fazer Upgrade</Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}