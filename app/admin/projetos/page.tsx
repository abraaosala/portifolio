"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/app/components/Toast";
import AdminModal from "../components/AdminModal";
import MultiSelectTags from "../components/MultiSelectTags";

interface Skill {
  id: string;
  name: string;
  level: number;
}

interface Project {
  id: string;
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
  const [skills, setSkills] = useState<Skill[]>([]);
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
    fetch("/api/admin/projects").then((r) => r.json()).then(setProjects);
    fetch("/api/admin/skills").then((r) => r.json()).then(setSkills);
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

  const handleDelete = async (id: string) => {
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
        <h1 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>Projetos</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditing(null);
            setForm({ title: "", description: "", tags: "", liveUrl: "", githubUrl: "", featured: false, order: 0 });
          }}
          className="btn-primary"
        >
          + Novo Projeto
        </button>
      </div>

      <AdminModal
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditing(null); }}
        title={editing ? "Editar Projeto" : "Novo Projeto"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="proj-title" className="block text-sm mb-1" style={{ color: "var(--text-secondary)" }}>Titulo</label>
              <input
                id="proj-title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1" style={{ color: "var(--text-secondary)" }}>Tags</label>
              <MultiSelectTags
                skills={skills}
                selected={form.tags}
                onChange={(value) => setForm({ ...form, tags: value })}
              />
            </div>
          </div>
          <div>
            <label htmlFor="proj-desc" className="block text-sm mb-1" style={{ color: "var(--text-secondary)" }}>Descricao</label>
            <textarea
              id="proj-desc"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="input-field resize-none"
              required
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="proj-live" className="block text-sm mb-1" style={{ color: "var(--text-secondary)" }}>Live URL</label>
              <input
                id="proj-live"
                value={form.liveUrl}
                onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="proj-github" className="block text-sm mb-1" style={{ color: "var(--text-secondary)" }}>GitHub URL</label>
              <input
                id="proj-github"
                value={form.githubUrl}
                onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
                className="input-field"
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="rounded"
              />
              Destaque
            </label>
            <div className="flex items-center gap-2">
              <label htmlFor="proj-order" className="text-sm" style={{ color: "var(--text-secondary)" }}>Ordem:</label>
              <input
                id="proj-order"
                type="number"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                className="input-field w-20"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary">
              {editing ? "Salvar" : "Criar"}
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setEditing(null); }}
              className="btn-ghost"
            >
              Cancelar
            </button>
          </div>
        </form>
      </AdminModal>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                <th className="text-left px-6 py-4 font-medium" style={{ color: "var(--text-secondary)" }}>Titulo</th>
                <th className="text-left px-6 py-4 font-medium" style={{ color: "var(--text-secondary)" }}>Tags</th>
                <th className="text-left px-6 py-4 font-medium" style={{ color: "var(--text-secondary)" }}>Ordem</th>
                <th className="text-left px-6 py-4 font-medium" style={{ color: "var(--text-secondary)" }}>Acoes</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="last:border-0" style={{ borderBottom: "1px solid var(--border)" }}>
                  <td className="px-6 py-4" style={{ color: "var(--text-primary)" }}>{project.title}</td>
                  <td className="px-6 py-4 text-sm" style={{ color: "var(--text-muted)" }}>{project.tags}</td>
                  <td className="px-6 py-4" style={{ color: "var(--text-muted)" }}>{project.order}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(project)}
                        className="text-sm transition-colors"
                        style={{ color: "var(--text-muted)" }}
                        onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent)"}
                        onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="text-sm transition-colors"
                        style={{ color: "var(--text-muted)" }}
                        onMouseEnter={(e) => e.currentTarget.style.color = "#ef4444"}
                        onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}
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
          <p className="text-center py-8" style={{ color: "var(--text-muted)" }}>Nenhum projeto encontrado.</p>
        )}
      </div>
    </div>
  );
}
