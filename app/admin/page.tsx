"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Stats {
  projects: number;
  skills: number;
  contacts: number;
  unreadContacts: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/stats").then((r) => r.json()),
    ]).then(([data]) => {
      setStats(data);
    });
  }, []);

  const cards = [
    {
      label: "Projetos",
      value: stats?.projects ?? 0,
      href: "/admin/projetos",
      color: "emerald",
    },
    {
      label: "Skills",
      value: stats?.skills ?? 0,
      href: "/admin/skills",
      color: "blue",
    },
    {
      label: "Mensagens",
      value: stats?.contacts ?? 0,
      href: "/admin/mensagens",
      color: "purple",
      badge: stats?.unreadContacts,
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors relative"
          >
            {card.badge && card.badge > 0 && (
              <span className="absolute top-4 right-4 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {card.badge} novas
              </span>
            )}
            <div className="text-zinc-500 text-sm mb-2">{card.label}</div>
            <div className="text-4xl font-bold text-white">{card.value}</div>
          </Link>
        ))}
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Ações Rápidas</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/admin/projetos"
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors"
          >
            + Novo Projeto
          </Link>
          <Link
            href="/admin/skills"
            className="px-4 py-2 bg-zinc-700 text-white rounded-lg text-sm font-medium hover:bg-zinc-600 transition-colors"
          >
            + Nova Skill
          </Link>
          <Link
            href="/"
            target="_blank"
            className="px-4 py-2 border border-zinc-700 text-zinc-300 rounded-lg text-sm font-medium hover:border-zinc-500 transition-colors"
          >
            Ver Portfólio ↗
          </Link>
        </div>
      </div>
    </div>
  );
}
