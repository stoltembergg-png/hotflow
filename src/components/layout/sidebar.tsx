"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BarChart3,
  Users,
  UserPlus,
  ShoppingCart,
  Package,
  Tags,
  CreditCard,
  Megaphone,
  FileText,
  Calendar,
  Palette,
  TrendingUp,
  DollarSign,
  RotateCcw,
  CheckSquare,
  UsersIcon,
  Bell,
  FileBarChart,
  Settings,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Flame,
  Zap,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Analytics", href: "/analytics", icon: BarChart3 },
    ],
  },
  {
    title: "CRM",
    items: [
      { label: "Leads", href: "/crm/leads", icon: UserPlus },
      { label: "Clientes", href: "/crm/clientes", icon: Users },
      { label: "Vendas", href: "/crm/vendas", icon: ShoppingCart },
      { label: "Produtos", href: "/crm/produtos", icon: Package },
      { label: "Ofertas", href: "/crm/ofertas", icon: Tags },
      { label: "Assinaturas", href: "/crm/assinaturas", icon: CreditCard },
    ],
  },
  {
    title: "Marketing",
    items: [
      { label: "Campanhas", href: "/marketing/campanhas", icon: Megaphone },
      { label: "Trafego", href: "/marketing/trafego", icon: TrendingUp },
    ],
  },
  {
    title: "Conteudo",
    items: [
      { label: "Conteudo", href: "/conteudo/conteudo", icon: FileText },
      { label: "Calendario", href: "/conteudo/calendario", icon: Calendar },
      { label: "Criativos", href: "/conteudo/criativos", icon: Palette },
    ],
  },
  {
    title: "Financeiro",
    items: [
      { label: "Financeiro", href: "/financeiro/financeiro", icon: DollarSign },
      { label: "Recuperacao", href: "/financeiro/recuperacao", icon: RotateCcw },
    ],
  },
  {
    title: "Gestao",
    items: [
      { label: "Tarefas", href: "/gestao/tarefas", icon: CheckSquare },
      { label: "Equipe", href: "/gestao/equipe", icon: UsersIcon },
      { label: "Notificacoes", href: "/gestao/notificacoes", icon: Bell },
      { label: "Relatorios", href: "/gestao/relatorios", icon: FileBarChart },
    ],
  },
  {
    items: [
      { label: "Configuracoes", href: "/configuracoes", icon: Settings },
    ],
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["CRM", "Conteudo", "Financeiro", "Gestao", "Marketing"])
  );

  const toggleSection = (title: string) => {
    if (collapsed) return;
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(title)) {
        next.delete(title);
      } else {
        next.add(title);
      }
      return next;
    });
  };

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col h-full transition-all duration-300 ease-in-out",
        "glass border-r border-white/[0.08]",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-white/[0.06]">
        <Link href="/dashboard" className="flex items-center gap-2.5 overflow-hidden">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 shrink-0">
            <Flame className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <span className="text-lg font-bold tracking-tight gradient-text whitespace-nowrap">
              HOTFLOW
            </span>
          )}
        </Link>
        <button
          onClick={onToggle}
          className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.06] transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {navSections.map((section, sIdx) => (
          <div key={sIdx} className="mb-2">
            {section.title && !collapsed && (
              <button
                onClick={() => toggleSection(section.title!)}
                className="flex items-center justify-between w-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 hover:text-zinc-400 transition-colors"
              >
                <span>{section.title}</span>
                <ChevronDown
                  className={cn(
                    "w-3 h-3 transition-transform duration-200",
                    expandedSections.has(section.title) ? "rotate-0" : "-rotate-90"
                  )}
                />
              </button>
            )}
            {section.title && collapsed && (
              <div className="mx-auto my-2 w-8 h-px bg-white/[0.06]" />
            )}
            {(!section.title || expandedSections.has(section.title) || collapsed) && (
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                        isActive
                          ? "bg-orange-500/10 text-orange-400"
                          : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
                      )}
                      title={collapsed ? item.label : undefined}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-orange-500 rounded-r-full" />
                      )}
                      <Icon
                        className={cn(
                          "w-5 h-5 shrink-0 transition-colors",
                          isActive ? "text-orange-400" : "text-zinc-500 group-hover:text-zinc-300"
                        )}
                      />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Upgrade CTA */}
      {!collapsed && (
        <div className="p-3 mx-2 mb-3">
          <div className="rounded-xl bg-gradient-to-br from-orange-500/10 to-amber-500/5 border border-orange-500/20 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-orange-400" />
              <span className="text-xs font-semibold text-orange-300">Plano Pro</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed mb-3">
              Desbloqueie automacoes avancadas e relatorios premium.
            </p>
            <button className="w-full py-2 text-xs font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all">
              Upgrade Agora
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}