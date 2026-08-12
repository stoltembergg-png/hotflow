"use client";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Content { id: string; name: string; contentType: string; platform: string; status: string; publishDate: string; }

const statusColors: Record<string, string> = { idea: "bg-zinc-500/10 text-zinc-400", production: "bg-yellow-500/10 text-yellow-400", ready: "bg-blue-500/10 text-blue-400", scheduled: "bg-purple-500/10 text-purple-400", published: "bg-green-500/10 text-green-400" };

export default function CalendarioPage() {
  const [content, setContent] = useState<Content[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"month" | "week">("month");

  useEffect(() => { fetch("/api/content").then(r => r.json()).then(d => setContent(d.data || [])); }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

  function getContentForDay(day: number) {
    return content.filter(c => {
      if (!c.publishDate) return false;
      const d = new Date(c.publishDate);
      return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
    });
  }

  const prev = () => setCurrentDate(new Date(year, month - 1, 1));
  const next = () => setCurrentDate(new Date(year, month + 1, 1));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Calendário</h1>
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            <Button variant={view === "month" ? "default" : "outline"} size="sm" onClick={() => setView("month")} className={view === "month" ? "bg-orange-500 hover:bg-orange-600" : ""}>Mês</Button>
            <Button variant={view === "week" ? "default" : "outline"} size="sm" onClick={() => setView("week")} className={view === "week" ? "bg-orange-500 hover:bg-orange-600" : ""}>Semana</Button>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <button onClick={prev} className="p-2 hover:bg-zinc-800 rounded-lg"><ChevronLeft className="w-5 h-5" /></button>
        <h2 className="text-lg font-bold">{monthNames[month]} {year}</h2>
        <button onClick={next} className="p-2 hover:bg-zinc-800 rounded-lg"><ChevronRight className="w-5 h-5" /></button>
      </div>
      <div className="glass-card p-4">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(d => (
            <div key={d} className="text-center text-xs text-zinc-500 py-2">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const items = getContentForDay(day);
            const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
            return (
              <div key={day} className={`min-h-[80px] p-1.5 rounded-lg border ${isToday ? "border-orange-500/50 bg-orange-500/5" : "border-zinc-800/50 hover:bg-zinc-800/30"}`}>
                <span className={`text-xs font-medium ${isToday ? "text-orange-400" : "text-zinc-400"}`}>{day}</span>
                <div className="mt-1 space-y-0.5">
                  {items.slice(0, 3).map(item => (
                    <div key={item.id} className={`text-[10px] px-1 py-0.5 rounded truncate ${statusColors[item.status] || "bg-zinc-800"}`}>{item.name}</div>
                  ))}
                  {items.length > 3 && <div className="text-[10px] text-zinc-500">+{items.length - 3}</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
