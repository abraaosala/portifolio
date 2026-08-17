"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/app/components/Toast";

interface Project {
  id: number;
  title: string;
  description: string;
  tags: string;
  liveUrl: string | null;
  githubUrl: string | null;
  featured: boolean;
  order: number;
}

export default function AdminProjetosPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    tags: "",
    liveUrl: "",
    githubUrl: "",
    featured: false,
    order: 0,
  });
  const { showToast } = useToast();

  useEffect(() => {
    fetch("/api/admin/projects")
      .then((r) => r.json())
      .then(setProjects);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editing ? "PUT" : "POST";
    const url = editing
      ? `/api/admin/projects/${editing.id}`
      : "/api/admin/projects";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      showToast("Erro ao salvar projeto", "error");
      return;
    }

    const updated = await fetch("/api/admin/projects").then((r) => r.json());
    setProjects(updated);
    setShowForm(false);
    setEditing(null);
    setForm({ title: "", description: "", tags: "", liveUrl: "", githubUrl: "", featured: false, order: 0 });
    showToast(editing ? "Projeto atualizado!" : "Projeto criado!");
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja deletar este projeto?")) return;
    const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
    if (!res.ok) {
      showToast("Erro ao deletar projeto", "error");
      return;
    }
    setProjects(projects.filter((p) => p.id !== id));
    showToast("Projeto deletado!");
  };

  const handleEdit = (project: Project) => {
    setForm({
      title: project.title,
      description: project.description,
      tags: project.tags,
      liveUrl: project.liveUrl || "",
      githubUrl: project.githubUrl || "",
      featured: project.featured,
      order: project.order,
    });
    setEditing(project);
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Projetos</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditing(null);
            setForm({ title: "", description: "", tags: "", liveUrl: "", githubUrl: "", featured: false, order: 0 });
          }}
          className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors"
        >
          + Novo Projeto
        </button>
      </div>

      {showForm && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            {editing ? "Editar Projeto" : "Novo Projeto"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="proj-title" className="block text-zinc-400 text-sm mb-1">Titulo</label>
                <input
                  id="proj-title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-emerald-400 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label htmlFor="proj-tags" className="block text-zinc-400 text-sm mb-1">Tags</label>
                <input
                  id="proj-tags"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  placeholder="React,Next.js,TypeScript"
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-emerald-400 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label htmlFor="proj-desc" className="block text-zinc-400 text-sm mb-1">Descricao</label>
              <textarea
                id="proj-desc"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-emerald-400 focus:outline-none resize-none"
                required
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="proj-live" className="block text-zinc-400 text-sm mb-1">Live URL</label>
                <input
                  id="proj-live"
                  value={form.liveUrl}
                  onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-emerald-400 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="proj-github" className="block text-zinc-400 text-sm mb-1">GitHub URL</label>
                <input
                  id="proj-github"
                  value={form.githubUrl}
                  onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-emerald-400 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-zinc-300">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="rounded border-zinc-600"
                />
                Destaque
              </label>
              <div className="flex items-center gap-2">
                <label htmlFor="proj-order" className="text-zinc-400 text-sm">Ordem:</label>
                <input
                  id="proj-order"
                  type="number"
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                  className="w-20 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-emerald-400 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors"
              >
                {editing ? "Salvar" : "Criar"}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditing(null); }}
                className="px-4 py-2 bg-zinc-700 text-white rounded-lg font-medium hover:bg-zinc-600 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left px-6 py-4 text-zinc-400 font-medium">Titulo</th>
                <th className="text-left px-6 py-4 text-zinc-400 font-medium">Tags</th>
                <th className="text-left px-6 py-4 text-zinc-400 font-medium">Ordem</th>
                <th className="text-left px-6 py-4 text-zinc-400 font-medium">Acoes</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="border-b border-zinc-800 last:border-0">
                  <td className="px-6 py-4 text-white">{project.title}</td>
                  <td className="px-6 py-4 text-zinc-400 text-sm">{project.tags}</td>
                  <td className="px-6 py-4 text-zinc-400">{project.order}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(project)}
                        className="text-zinc-400 hover:text-emerald-400 transition-colors text-sm"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="text-zinc-400 hover:text-red-400 transition-colors text-sm"
                      >
                        Deletar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {projects.length === 0 && (
          <p className="text-zinc-500 text-center py-8">Nenhum projeto encontrado.</p>
        )}
      </div>
    </div>
  );
}
