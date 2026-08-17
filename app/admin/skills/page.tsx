"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/app/components/Toast";
import AdminModal from "../components/AdminModal";

interface Skill {
  id: string;
  name: string;
  level: number;
  icon: string | null;
}

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", level: 3, icon: "" });
  const { showToast } = useToast();

  useEffect(() => {
    fetch("/api/admin/skills")
      .then((r) => r.json())
      .then(setSkills);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editing ? "PUT" : "POST";
    const url = editing
      ? `/api/admin/skills/${editing.id}`
      : "/api/admin/skills";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      showToast("Erro ao salvar skill", "error");
      return;
    }

    const updated = await fetch("/api/admin/skills").then((r) => r.json());
    setSkills(updated);
    setShowForm(false);
    setEditing(null);
    setForm({ name: "", level: 3, icon: "" });
    showToast(editing ? "Skill atualizada!" : "Skill criada!");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar esta skill?")) return;
    const res = await fetch(`/api/admin/skills/${id}`, { method: "DELETE" });
    if (!res.ok) {
      showToast("Erro ao deletar skill", "error");
      return;
    }
    setSkills(skills.filter((s) => s.id !== id));
    showToast("Skill deletada!");
  };

  const handleEdit = (skill: Skill) => {
    setForm({ name: skill.name, level: skill.level, icon: skill.icon || "" });
    setEditing(skill);
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>Skills</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditing(null);
            setForm({ name: "", level: 3, icon: "" });
          }}
          className="btn-primary"
        >
          + Nova Skill
        </button>
      </div>

      <AdminModal
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditing(null); }}
        title={editing ? "Editar Skill" : "Nova Skill"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="skill-name" className="block text-sm mb-1" style={{ color: "var(--text-secondary)" }}>Nome</label>
              <input
                id="skill-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label htmlFor="skill-level" className="block text-sm mb-1" style={{ color: "var(--text-secondary)" }}>
                Nivel (1-5)
              </label>
              <input
                id="skill-level"
                type="number"
                min="1"
                max="5"
                value={form.level}
                onChange={(e) => setForm({ ...form, level: parseInt(e.target.value) || 1 })}
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="skill-icon" className="block text-sm mb-1" style={{ color: "var(--text-secondary)" }}>Icone</label>
              <input
                id="skill-icon"
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                placeholder="Opcional"
                className="input-field"
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
          <table className="w-full min-w-[500px]">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                <th className="text-left px-6 py-4 font-medium" style={{ color: "var(--text-secondary)" }}>Nome</th>
                <th className="text-left px-6 py-4 font-medium" style={{ color: "var(--text-secondary)" }}>Nivel</th>
                <th className="text-left px-6 py-4 font-medium" style={{ color: "var(--text-secondary)" }}>Acoes</th>
              </tr>
            </thead>
            <tbody>
              {skills.map((skill) => (
                <tr key={skill.id} className="last:border-0" style={{ borderBottom: "1px solid var(--border)" }}>
                  <td className="px-6 py-4" style={{ color: "var(--text-primary)" }}>{skill.name}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor: i <= skill.level ? "var(--accent)" : "var(--bg-tertiary)",
                            }}
                          />
                        ))}
                      </div>
                      <span className="text-sm" style={{ color: "var(--text-muted)" }}>{skill.level}/5</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(skill)}
                        className="text-sm transition-colors"
                        style={{ color: "var(--text-muted)" }}
                        onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent)"}
                        onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(skill.id)}
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
        {skills.length === 0 && (
          <p className="text-center py-8" style={{ color: "var(--text-muted)" }}>Nenhuma skill encontrada.</p>
        )}
      </div>
    </div>
  );
}
