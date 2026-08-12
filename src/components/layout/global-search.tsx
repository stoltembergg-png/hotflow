"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  Users,
  UserPlus,
  ShoppingCart,
  Package,
  Megaphone,
  FileText,
  CheckSquare,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  type: "customer" | "lead" | "product" | "order" | "campaign" | "content" | "task";
  href: string;
}

const typeConfig: Record<SearchResult["type"], { icon: React.ElementType; label: string; color: string }> = {
  customer: { icon: Users, label: "Clientes", color: "text-blue-400" },
  lead: { icon: UserPlus, label: "Leads", color: "text-green-400" },
  product: { icon: Package, label: "Produtos", color: "text-purple-400" },
  order: { icon: ShoppingCart, label: "Vendas", color: "text-orange-400" },
  campaign: { icon: Megaphone, label: "Campanhas", color: "text-pink-400" },
  content: { icon: FileText, label: "Conteúdo", color: "text-cyan-400" },
  task: { icon: CheckSquare, label: "Tarefas", color: "text-yellow-400" },
};

export function GlobalSearch({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.results || []);
      }
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setResults([]);
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) search(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, search]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      router.push(results[selectedIndex].href);
      onClose();
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  // Group results by type
  const grouped = results.reduce<Record<string, SearchResult[]>>((acc, r) => {
    (acc[r.type] = acc[r.type] || []).push(r);
    return acc;
  }, {});

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Search Dialog */}
      <div className="relative w-full max-w-xl mx-4 glass-card shadow-2xl shadow-black/50 rounded-2xl overflow-hidden animate-fadeIn">
        {/* Input */}
        <div className="flex items-center gap-3 px-5 h-14 border-b border-white/[0.06]">
          {loading ? (
            <Loader2 className="w-5 h-5 text-orange-400 animate-spin" />
          ) : (
            <Search className="w-5 h-5 text-zinc-500" />
          )}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Buscar clientes, leads, produtos, campanhas..."
            className="flex-1 bg-transparent text-sm text-zinc-200 placeholder:text-zinc-600 outline-none"
          />
          <button
            onClick={onClose}
            className="flex items-center justify-center w-7 h-7 rounded-lg text-zinc-500 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[400px] overflow-y-auto p-2">
          {!query.trim() && (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-zinc-500">
                Digite para buscar em todo o sistema
              </p>
              <p className="text-xs text-zinc-600 mt-1">
                Clientes, leads, produtos, vendas, campanhas, conteúdo, tarefas
              </p>
            </div>
          )}

          {query.trim() && !loading && results.length === 0 && (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-zinc-500">
                Nenhum resultado para &ldquo;{query}&rdquo;
              </p>
            </div>
          )}

          {Object.entries(grouped).map(([type, items]) => {
            const config = typeConfig[type as SearchResult["type"]];
            if (!config) return null;
            const Icon = config.icon;
            return (
              <div key={type} className="mb-2">
                <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-600">
                  {config.label}
                </div>
                {items.map((item) => {
                  const globalIdx = results.indexOf(item);
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        router.push(item.href);
                        onClose();
                      }}
                      className={cn(
                        "flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left transition-colors",
                        globalIdx === selectedIndex
                          ? "bg-orange-500/10 text-orange-300"
                          : "text-zinc-300 hover:bg-white/[0.04]"
                      )}
                    >
                      <Icon className={cn("w-4 h-4 shrink-0", config.color)} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.title}</p>
                        <p className="text-xs text-zinc-500 truncate">{item.subtitle}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-zinc-600 shrink-0" />
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-white/[0.06] text-[11px] text-zinc-600">
          <div className="flex items-center gap-3">
            <span>↑↓ navegar</span>
            <span>↵ selecionar</span>
            <span>esc fechar</span>
          </div>
          <span>{results.length} resultado{results.length !== 1 ? "s" : ""}</span>
        </div>
      </div>
    </div>
  );
}
