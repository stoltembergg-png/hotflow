"use client";
import { useState, useEffect } from "react";
import { Plus, AlertTriangle, Clock, CheckCircle, ListTodo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Task { id: string; title: string; description: string; assignee: string; priority: string; dueDate: string; status: string; project: string; }

const priorities = [
  { key: "low", label: "Baixa", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  { key: "medium", label: "Média", color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
  { key: "high", label: "Alta", color: "bg-orange-500/10 text-orange-400 border-orange-500/20" },
  { key: "urgent", label: "Urgente", color: "bg-red-500/10 text-red-400 border-red-500/20" },
];

const taskStages = [
  { key: "todo", label: "A Fazer", icon: ListTodo },
  { key: "in_progress", label: "Em Andamento", icon: Clock },
  { key: "review", label: "Revisão", icon: AlertTriangle },
  { key: "done", label: "Concluído", icon: CheckCircle },
];

export default function TarefasPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", assignee: "", priority: "medium", dueDate: "", project: "" });

  useEffect(() => { fetchTasks(); }, []);

  async function fetchTasks() {
    const res = await fetch("/api/tasks");
    const data = await res.json();
    setTasks(data.data || []);
  }

  async function createTask() {
    await fetch("/api/tasks", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, status: "todo" }) });
    setShowModal(false); fetchTasks();
  }

  async function moveTask(id: string, newStatus: string) {
    await fetch(`/api/tasks/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: newStatus }) });
    fetchTasks();
  }

  const getTasksByStatus = (status: string) => tasks.filter(t => t.status === status);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tarefas</h1>
        <Button onClick={() => setShowModal(true)}><Plus className="w-4 h-4 mr-2" />Nova Tarefa</Button>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {taskStages.map(stage => {
          const Icon = stage.icon;
          const stageTasks = getTasksByStatus(stage.key);
          return (
            <div key={stage.key} className="min-w-[280px] flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Icon className="w-4 h-4 text-zinc-400" />
                <h3 className="text-sm font-medium text-zinc-400">{stage.label}</h3>
                <span className="text-xs text-zinc-600 bg-zinc-800 px-2 py-0.5 rounded-full">{stageTasks.length}</span>
              </div>
              <div className="space-y-2">
                {stageTasks.map(task => {
                  const priority = priorities.find(p => p.key === task.priority) || priorities[1];
                  return (
                    <div key={task.id} className="glass-card p-3">
                      <div className="flex items-start justify-between mb-1">
                        <p className="font-medium text-sm">{task.title}</p>
                        <Badge variant="outline" className={`text-[10px] ${priority.color}`}>{priority.label}</Badge>
                      </div>
                      {task.description && <p className="text-xs text-zinc-500 mb-2 line-clamp-2">{task.description}</p>}
                      <div className="flex items-center justify-between text-xs text-zinc-500">
                        <span>{task.assignee || "Sem responsável"}</span>
                        {task.dueDate && <span>{new Date(task.dueDate).toLocaleDateString("pt-BR")}</span>}
                      </div>
                      {stage.key !== "done" && (
                        <div className="flex gap-1 mt-2">
                          {taskStages.filter(s => s.key !== stage.key).map(s => (
                            <button key={s.key} onClick={() => moveTask(task.id, s.key)} className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400">→{s.label.slice(0, 4)}</button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
                {stageTasks.length === 0 && <div className="text-xs text-zinc-600 text-center py-8 glass-card">Nenhuma tarefa</div>}
              </div>
            </div>
          );
        })}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="glass-card p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-4">Nova Tarefa</h2>
            <div className="space-y-3">
              <Input placeholder="Título" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              <textarea className="w-full bg-zinc-900 border border-zinc-700 rounded-md p-2 text-sm h-20" placeholder="Descrição" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              <Input placeholder="Responsável" value={form.assignee} onChange={e => setForm({ ...form, assignee: e.target.value })} />
              <select className="w-full bg-zinc-900 border border-zinc-700 rounded-md p-2 text-sm" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                {priorities.map(p => <option key={p.key} value={p.key}>{p.label}</option>)}
              </select>
              <Input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
              <Input placeholder="Projeto" value={form.project} onChange={e => setForm({ ...form, project: e.target.value })} />
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
                <Button onClick={createTask}>Criar</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
