"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/app/components/Toast";

interface Skill {
  id: number;
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

  const handleDelete = async (id: number) => {
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
        <h1 className="text-3xl font-bold text-white">Skills</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditing(null);
            setForm({ name: "", level: 3, icon: "" });
          }}
          className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors"
        >
          + Nova Skill
        </button>
      </div>

      {showForm && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            {editing ? "Editar Skill" : "Nova Skill"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="skill-name" className="block text-zinc-400 text-sm mb-1">Nome</label>
                <input
                  id="skill-name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-emerald-400 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label htmlFor="skill-level" className="block text-zinc-400 text-sm mb-1">
                  Nivel (1-5)
                </label>
                <input
                  id="skill-level"
                  type="number"
                  min="1"
                  max="5"
                  value={form.level}
                  onChange={(e) => setForm({ ...form, level: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-emerald-400 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="skill-icon" className="block text-zinc-400 text-sm mb-1">Icone</label>
                <input
                  id="skill-icon"
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                  placeholder="Opcional"
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-emerald-400 focus:outline-none"
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
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left px-6 py-4 text-zinc-400 font-medium">Nome</th>
                <th className="text-left px-6 py-4 text-zinc-400 font-medium">Nivel</th>
                <th className="text-left px-6 py-4 text-zinc-400 font-medium">Acoes</th>
              </tr>
            </thead>
            <tbody>
              {skills.map((skill) => (
                <tr key={skill.id} className="border-b border-zinc-800 last:border-0">
                  <td className="px-6 py-4 text-white">{skill.name}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            className={`w-3 h-3 rounded-full ${
                              i <= skill.level ? "bg-emerald-400" : "bg-zinc-700"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-zinc-500 text-sm">{skill.level}/5</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(skill)}
                        className="text-zinc-400 hover:text-emerald-400 transition-colors text-sm"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(skill.id)}
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
        {skills.length === 0 && (
          <p className="text-zinc-500 text-center py-8">Nenhuma skill encontrada.</p>
        )}
      </div>
    </div>
  );
}
