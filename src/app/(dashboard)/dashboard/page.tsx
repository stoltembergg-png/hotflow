"use client";

import { useState, useEffect } from "react";
import { cn, formatCurrency, formatNumber, formatPercent, getGreeting } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  UserPlus,
  Target,
  BarChart3,
  Zap,
  CreditCard,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  Clock,
  Package,
  Megaphone,
  RotateCcw,
  FileText,
  Flame,
  Filter,
  PieChart as PieIcon,
  Trophy,
  Activity,
  Wallet,
  Sparkles,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Types
interface MetricCard {
  label: string;
  value: string;
  change: number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

interface DashboardData {
  metrics: MetricCard[];
  faturamentoChart: { name: string; value: number }[];
  vendasChart: { name: string; vendas: number; meta: number }[];
  lucroChart: { name: string; receita: number; custo: number }[];
  origemVendas: { name: string; value: number; color: string }[];
  produtosTop: { name: string; vendas: number }[];
  campanhasRoas: { name: string; roas: number }[];
  funnel: { stage: string; count: number; color: string }[];
  attention: AttentionItem[];
}

interface AttentionItem {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  count: number;
  severity: "warning" | "danger" | "info";
  action: string;
}

// Colors
const CHART_COLORS = {
  primary: "#f97316",
  primaryLight: "#fb923c",
  success: "#22c55e",
  danger: "#ef4444",
  blue: "#3b82f6",
  purple: "#a855f7",
  pink: "#ec4899",
  cyan: "#06b6d4",
};

const PIE_COLORS = [
  CHART_COLORS.primary,
  CHART_COLORS.blue,
  CHART_COLORS.purple,
  CHART_COLORS.success,
  CHART_COLORS.pink,
  CHART_COLORS.cyan,
];

// Funnel stage icons
const FUNNEL_ICONS: Record<string, React.ElementType> = {
  Leads: UserPlus,
  Checkout: ShoppingCart,
  Pagamento: CreditCard,
  Venda: CheckCircle2,
  "Cliente Recorrente": RotateCcw,
  Visitantes: BarChart3,
};

// Chart header icon config
function ChartHeader({ icon: Icon, title, subtitle }: { icon: React.ElementType; title: string; subtitle: string }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2.5">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.06]">
          <Icon className="w-4 h-4 text-orange-400" />
        </div>
        <h3 className="text-sm font-semibold text-zinc-200">{title}</h3>
      </div>
      <span className="text-xs text-zinc-500">{subtitle}</span>
    </div>
  );
}

// Skeleton components
function MetricSkeleton() {
  return (
    <div className="glass-card p-5 animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-white/[0.06]" />
        <div className="w-16 h-5 rounded bg-white/[0.04]" />
      </div>
      <div className="w-24 h-8 rounded bg-white/[0.06] mb-1" />
      <div className="w-32 h-4 rounded bg-white/[0.04]" />
    </div>
  );
}

function ChartSkeleton({ height = "h-[300px]" }: { height?: string }) {
  return (
    <div className={cn("glass-card p-5 animate-pulse", height)}>
      <div className="w-40 h-5 rounded bg-white/[0.06] mb-4" />
      <div className="flex-1 flex items-end gap-2 h-[calc(100%-2rem)]">
        {[40, 65, 55, 80, 45, 70, 60].map((h, i) => (
          <div key={i} className="flex-1 bg-white/[0.04] rounded-t" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  );
}

function FunnelSkeleton() {
  return (
    <div className="glass-card p-5 animate-pulse">
      <div className="w-48 h-5 rounded bg-white/[0.06] mb-6" />
      <div className="space-y-3">
        {[100, 80, 60, 40, 25, 15].map((w, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-24 h-4 rounded bg-white/[0.04]" />
            <div className="h-8 rounded bg-white/[0.06]" style={{ width: `${w}%` }} />
          </div>
        ))}
      </div>
    </div>
  );
}

// Custom Tooltip
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card px-3 py-2 shadow-xl border border-white/[0.1]">
      <p className="text-xs font-medium text-zinc-300 mb-1">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} className="text-xs text-zinc-400">
          <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: entry.color }} />
          {entry.name}: {typeof entry.value === "number" ? formatCurrency(entry.value) : entry.value}
        </p>
      ))}
    </div>
  );
}

// Empty default data to avoid hydration issues
const defaultData: DashboardData = {
  metrics: [],
  faturamentoChart: [],
  vendasChart: [],
  lucroChart: [],
  origemVendas: [],
  produtosTop: [],
  campanhasRoas: [],
  funnel: [],
  attention: [],
};

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [data, setData] = useState<DashboardData>(defaultData);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<"7d" | "30d" | "90d">("30d");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/dashboard?period=${period}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [period]);

  const greeting = getGreeting();

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-slideUp">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">
            {greeting}, <span className="gradient-text">{user?.name || "Usuario"}</span>
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Aqui esta o resumo do seu negocio hoje
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex glass-card rounded-xl overflow-hidden p-0.5">
            {(["7d", "30d", "90d"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-lg transition-all",
                  period === p
                    ? "bg-orange-500/20 text-orange-400"
                    : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                {p === "7d" ? "7 dias" : p === "30d" ? "30 dias" : "90 dias"}
              </button>
            ))}
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-zinc-400 hover:text-white glass-card rounded-xl transition-colors card-hover"
          >
            <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
            Atualizar
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <MetricSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 stagger">
          {data.metrics.map((metric, i) => {
            const Icon = metric.icon;
            const isPositive = metric.change >= 0;
            return (
              <div
                key={i}
                className="glass-card p-5 group card-hover hover:border-orange-500/20 relative overflow-hidden"
              >
                {/* Gradient glow on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className={cn("absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl", metric.bgColor)} />
                </div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className={cn("flex items-center justify-center w-10 h-10 rounded-xl", metric.bgColor)}>
                      <Icon className={cn("w-5 h-5", metric.color)} />
                    </div>
                    <div
                      className={cn(
                        "flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold",
                        isPositive
                          ? "bg-green-500/10 text-green-400"
                          : "bg-red-500/10 text-red-400"
                      )}
                    >
                      {isPositive ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {formatPercent(Math.abs(metric.change))}
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-zinc-100 mb-0.5 animate-countUp">
                    {metric.value}
                  </p>
                  <p className="text-xs text-zinc-500">{metric.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Charts Row 1: Faturamento + Vendas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 stagger">
        {loading ? (
          <>
            <ChartSkeleton />
            <ChartSkeleton />
          </>
        ) : (
          <>
            {/* Faturamento Chart */}
            <div className="glass-card p-5 card-hover">
              <ChartHeader icon={Wallet} title="Faturamento" subtitle="Ultimos 30 dias" />
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.faturamentoChart}>
                    <defs>
                      <linearGradient id="gradFaturamento" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(63,63,70,0.3)" />
                    <XAxis dataKey="name" tick={{ fill: "#71717a", fontSize: 11 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fill: "#71717a", fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={CHART_COLORS.primary}
                      strokeWidth={2}
                      fill="url(#gradFaturamento)"
                      name="Faturamento"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Vendas Chart */}
            <div className="glass-card p-5 card-hover">
              <ChartHeader icon={ShoppingCart} title="Vendas vs Meta" subtitle="Ultimos 30 dias" />
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.vendasChart}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(63,63,70,0.3)" />
                    <XAxis dataKey="name" tick={{ fill: "#71717a", fontSize: 11 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fill: "#71717a", fontSize: 11 }} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      wrapperStyle={{ fontSize: "11px" }}
                      iconType="circle"
                      iconSize={8}
                    />
                    <Bar dataKey="vendas" fill={CHART_COLORS.primary} radius={[4, 4, 0, 0]} name="Vendas" />
                    <Bar dataKey="meta" fill="rgba(113,113,122,0.3)" radius={[4, 4, 0, 0]} name="Meta" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Charts Row 2: Lucro + Origem */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 stagger">
        {loading ? (
          <>
            <ChartSkeleton />
            <ChartSkeleton />
          </>
        ) : (
          <>
            {/* Lucro Chart */}
            <div className="glass-card p-5 card-hover">
              <ChartHeader icon={Activity} title="Lucro vs Custos" subtitle="Ultimos 30 dias" />
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.lucroChart}>
                    <defs>
                      <linearGradient id="gradReceita" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={CHART_COLORS.success} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={CHART_COLORS.success} stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gradCusto" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={CHART_COLORS.danger} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={CHART_COLORS.danger} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(63,63,70,0.3)" />
                    <XAxis dataKey="name" tick={{ fill: "#71717a", fontSize: 11 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fill: "#71717a", fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: "11px" }} iconType="circle" iconSize={8} />
                    <Area type="monotone" dataKey="receita" stroke={CHART_COLORS.success} strokeWidth={2} fill="url(#gradReceita)" name="Receita" />
                    <Area type="monotone" dataKey="custo" stroke={CHART_COLORS.danger} strokeWidth={2} fill="url(#gradCusto)" name="Custo" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Origem das Vendas (Donut) */}
            <div className="glass-card p-5 card-hover">
              <ChartHeader icon={PieIcon} title="Origem das Vendas" subtitle="Distribuicao" />
              <div className="h-[280px] flex items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.origemVendas}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="value"
                      nameKey="name"
                    >
                      {data.origemVendas.map((_, index) => (
                        <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      wrapperStyle={{ fontSize: "11px" }}
                      iconType="circle"
                      iconSize={8}
                      formatter={(value: string) => <span className="text-zinc-400">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Charts Row 3: Produtos Top + Campanhas ROAS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 stagger">
        {loading ? (
          <>
            <ChartSkeleton />
            <ChartSkeleton />
          </>
        ) : (
          <>
            {/* Produtos mais vendidos */}
            <div className="glass-card p-5 card-hover">
              <ChartHeader icon={Package} title="Produtos Mais Vendidos" subtitle="Top 6" />
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.produtosTop} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(63,63,70,0.3)" />
                    <XAxis type="number" tick={{ fill: "#71717a", fontSize: 11 }} tickLine={false} axisLine={false} />
                    <YAxis type="category" dataKey="name" tick={{ fill: "#a1a1aa", fontSize: 11 }} tickLine={false} axisLine={false} width={100} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="vendas" fill={CHART_COLORS.primary} radius={[0, 4, 4, 0]} name="Vendas" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Campanhas por ROAS */}
            <div className="glass-card p-5 card-hover">
              <ChartHeader icon={Trophy} title="Campanhas por ROAS" subtitle="Performance" />
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.campanhasRoas}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(63,63,70,0.3)" />
                    <XAxis dataKey="name" tick={{ fill: "#71717a", fontSize: 11 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fill: "#71717a", fontSize: 11 }} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="roas" name="ROAS" radius={[4, 4, 0, 0]}>
                      {data.campanhasRoas.map((entry, index) => (
                        <Cell
                          key={index}
                          fill={
                            entry.roas >= 4
                              ? CHART_COLORS.success
                              : entry.roas >= 2
                              ? CHART_COLORS.primary
                              : CHART_COLORS.danger
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Funnel */}
      {loading ? (
        <FunnelSkeleton />
      ) : (
        <div className="glass-card p-5 animate-slideUp card-hover">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.06]">
              <Filter className="w-4 h-4 text-orange-400" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-200">Funil de Conversao</h3>
          </div>
          <div className="space-y-3">
            {data.funnel.map((stage, i) => {
              const maxCount = data.funnel[0]?.count || 1;
              const widthPercent = (stage.count / maxCount) * 100;
              const funnelIcon = FUNNEL_ICONS[stage.stage] || Activity;
              const FunnelIcon = funnelIcon;
              return (
                <div key={i} className="flex items-center gap-4 animate-slideUp" style={{ animationDelay: `${i * 80}ms` }}>
                  <div className="flex items-center gap-2 w-36 text-xs text-zinc-400 text-right shrink-0 justify-end">
                    <FunnelIcon className="w-3.5 h-3.5" style={{ color: stage.color }} />
                    {stage.stage}
                  </div>
                  <div className="flex-1 relative">
                    <div className="h-9 rounded-lg bg-white/[0.03] overflow-hidden">
                      <div
                        className="h-full rounded-lg transition-all duration-700 ease-out flex items-center px-3"
                        style={{
                          width: `${widthPercent}%`,
                          background: `linear-gradient(90deg, ${stage.color}33, ${stage.color}11)`,
                          borderLeft: `3px solid ${stage.color}`,
                        }}
                      >
                        <span className="text-xs font-semibold text-zinc-200">
                          {formatNumber(stage.count)}
                        </span>
                      </div>
                    </div>
                  </div>
                  {i < data.funnel.length - 1 && (
                    <span className="text-[10px] text-zinc-600 shrink-0 w-12 text-right">
                      {data.funnel[i + 1]?.count
                        ? `${((data.funnel[i + 1].count / stage.count) * 100).toFixed(1)}%`
                        : "--"}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Attention Section */}
      {loading ? (
        <div className="glass-card p-5 animate-pulse">
          <div className="w-64 h-5 rounded bg-white/[0.06] mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="p-4 rounded-xl bg-white/[0.03]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-white/[0.06]" />
                  <div className="w-24 h-4 rounded bg-white/[0.04]" />
                </div>
                <div className="w-full h-3 rounded bg-white/[0.04]" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="glass-card p-5 animate-slideUp">
          <div className="flex items-center gap-2 mb-5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-500/10">
              <AlertTriangle className="w-4 h-4 text-red-400" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-200">
              O Que Precisa de Atencao
            </h3>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-red-500/10 text-red-400 rounded-full ml-1">
              {data.attention.length}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 stagger">
            {data.attention.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  className={cn(
                    "flex items-start gap-3 p-4 rounded-xl text-left transition-all hover:bg-white/[0.04] border card-hover",
                    item.severity === "danger"
                      ? "border-red-500/10 hover:border-red-500/20"
                      : item.severity === "warning"
                      ? "border-yellow-500/10 hover:border-yellow-500/20"
                      : "border-white/[0.06] hover:border-white/[0.12]"
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center justify-center w-9 h-9 rounded-lg shrink-0",
                      item.severity === "danger"
                        ? "bg-red-500/10"
                        : item.severity === "warning"
                        ? "bg-yellow-500/10"
                        : "bg-blue-500/10"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-4 h-4",
                        item.severity === "danger"
                          ? "text-red-400"
                          : item.severity === "warning"
                          ? "text-yellow-400"
                          : "text-blue-400"
                      )}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-zinc-200">{item.title}</p>
                      <span className="px-1.5 py-0.5 text-[10px] font-bold bg-white/[0.06] text-zinc-400 rounded">
                        {item.count}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-1 line-clamp-2">
                      {item.description}
                    </p>
                    <p className="text-[11px] text-orange-400 mt-2 flex items-center gap-1">
                      {item.action}
                      <ArrowRight className="w-3 h-3" />
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}