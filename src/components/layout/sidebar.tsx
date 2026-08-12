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

  const EASE = "cubic-bezier(0.22,1,0.36,1)";

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col h-full bg-surface border-r border-white/[0.08] overflow-hidden",
        "transition-[width] duration-300 ease-[var(--ease)]",
        collapsed ? "w-[64px]" : "w-[240px]"
      )}
      style={{ "--ease": EASE } as React.CSSProperties}
    >
      {/* Logo + Toggle — always vertical, logo always centered */}
      <div className="flex flex-col items-center shrink-0 border-b border-white/[0.06] py-3 gap-2">
        <Link
          href="/dashboard"
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 shrink-0 hover:scale-105 transition-transform duration-200"
        >
          <Flame className="w-5 h-5 text-white" />
        </Link>
        <button
          onClick={onToggle}
          className={cn(
            "flex items-center justify-center w-7 h-7 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.06] shrink-0",
            "transition-all duration-200 hover:scale-110 active:scale-90"
          )}
          title={collapsed ? "Expandir menu" : "Recolher menu"}
        >
          <div className="transition-transform duration-300" style={{ transitionTimingFunction: EASE }}>
            {collapsed ? (
              <ChevronRight className="w-3.5 h-3.5" />
            ) : (
              <ChevronLeft className="w-3.5 h-3.5" />
            )}
          </div>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-1.5 space-y-0.5">
        {navSections.map((section, sIdx) => (
          <div key={sIdx} className="mb-1.5">
            {/* Section header */}
            <div
              className={cn(
                "overflow-hidden transition-all duration-300",
                collapsed ? "max-h-0 opacity-0" : "max-h-[40px] opacity-100"
              )}
              style={{ transitionTimingFunction: EASE }}
            >
              {section.title && (
                <button
                  onClick={() => toggleSection(section.title!)}
                  className="flex items-center justify-between w-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-600 hover:text-zinc-400 transition-colors"
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
            </div>

            {/* Collapsed divider */}
            {section.title && collapsed && (
              <div className="mx-auto my-1.5 w-6 h-px bg-white/[0.06]" />
            )}

            {/* Nav items */}
            {(!section.title || expandedSections.has(section.title) || collapsed) && (
              <div>
                {section.items.map((item, iIdx) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "relative flex items-center rounded-lg text-sm font-medium group",
                        "transition-all duration-200",
                        collapsed ? "justify-center mx-auto px-0 py-2 my-0.5 w-10 h-10" : "gap-2.5 px-2.5 py-2",
                        isActive
                          ? "bg-orange-500/10 text-orange-400"
                          : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
                      )}
                      style={{
                        transitionTimingFunction: EASE,
                        transitionDelay: `${iIdx * 15}ms`,
                      }}
                      title={collapsed ? item.label : undefined}
                    >
                      {/* Active indicator */}
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-orange-500 rounded-r-full" />
                      )}
                      <Icon
                        className={cn(
                          "w-[18px] h-[18px] shrink-0 transition-colors duration-200",
                          isActive ? "text-orange-400" : "text-zinc-500 group-hover:text-zinc-300"
                        )}
                      />
                      <span
                        className={cn(
                          "truncate overflow-hidden transition-all duration-300",
                          collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                        )}
                        style={{ transitionTimingFunction: EASE }}
                      >
                        {item.label}
                      </span>
                      {/* Tooltip when collapsed */}
                      {collapsed && (
                        <div className="absolute left-full ml-2 px-2 py-1 rounded-md bg-zinc-800 border border-zinc-700 text-[11px] font-medium text-zinc-200 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 z-50 shadow-lg">
                          {item.label}
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Upgrade CTA */}
      <div
        className={cn(
          "shrink-0 overflow-hidden transition-all duration-300",
          collapsed ? "max-h-0 opacity-0 p-0 mx-0 mb-0" : "p-2.5 mx-1.5 mb-2.5 max-h-[200px] opacity-100"
        )}
        style={{ transitionTimingFunction: EASE }}
      >
        <div className="rounded-xl bg-gradient-to-br from-orange-500/10 to-amber-500/5 border border-orange-500/20 p-3">
          <div className="flex items-center gap-2 mb-1.5">
            <Zap className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-[11px] font-semibold text-orange-300">Plano Pro</span>
          </div>
          <p className="text-[10px] text-zinc-400 leading-relaxed mb-2">
            Desbloqueie automacoes avancadas e relatorios premium.
          </p>
          <button className="w-full py-1.5 text-[11px] font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all">
            Upgrade Agora
          </button>
        </div>
      </div>
    </aside>
  );
}