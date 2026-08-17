"use client";

import { useEffect, useState, useCallback } from "react";
import { useToast } from "@/app/components/Toast";
import Pagination from "../components/Pagination";

interface Contact {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function AdminMensagensPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selected, setSelected] = useState<Contact | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const { showToast } = useToast();

  const fetchContacts = useCallback(async (p: number) => {
    const res = await fetch(`/api/admin/contacts?page=${p}&limit=10`);
    const json = await res.json();
    setContacts(json.data);
    setTotal(json.total);
    setTotalPages(json.totalPages);
  }, []);

  useEffect(() => {
    fetchContacts(page);
  }, [page, fetchContacts]);

  const handleView = async (contact: Contact) => {
    setSelected(contact);
    if (!contact.read) {
      await fetch(`/api/admin/contacts/${contact.id}`);
      setContacts(
        contacts.map((c) => (c.id === contact.id ? { ...c, read: true } : c))
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar esta mensagem?")) return;
    const res = await fetch(`/api/admin/contacts/${id}`, { method: "DELETE" });
    if (!res.ok) {
      showToast("Erro ao deletar mensagem", "error");
      return;
    }
    if (contacts.length === 1 && page > 1) setPage(page - 1);
    else await fetchContacts(page);
    if (selected?.id === id) setSelected(null);
    showToast("Mensagem deletada!");
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8" style={{ color: "var(--text-primary)" }}>Mensagens</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card overflow-hidden">
          <div className="px-6 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
            <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
              Inbox ({contacts.filter((c) => !c.read).length} nao lidas)
            </h2>
          </div>
          <div className="max-h-[600px] overflow-auto">
            {contacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => handleView(contact)}
                className="w-full text-left px-6 py-4 transition-colors"
                style={{
                  borderBottom: "1px solid var(--border)",
                  backgroundColor: selected?.id === contact.id ? "var(--accent-muted)" : "transparent",
                }}
                onMouseEnter={(e) => { if (selected?.id !== contact.id) e.currentTarget.style.backgroundColor = "var(--bg-tertiary)"; }}
                onMouseLeave={(e) => { if (selected?.id !== contact.id) e.currentTarget.style.backgroundColor = "transparent"; }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className="font-medium"
                    style={{ color: contact.read ? "var(--text-secondary)" : "var(--text-primary)" }}
                  >
                    {contact.name}
                  </span>
                  {!contact.read && (
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--accent)" }} />
                  )}
                </div>
                <div className="text-sm truncate" style={{ color: "var(--text-muted)" }}>
                  {contact.message}
                </div>
                <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                  {formatDate(contact.createdAt)}
                </div>
              </button>
            ))}
            {contacts.length === 0 && (
              <p className="text-center py-8" style={{ color: "var(--text-muted)" }}>
                Nenhuma mensagem encontrada.
              </p>
            )}
          </div>
        </div>

        <div className="card">
          {selected ? (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
                    {selected.name}
                  </h3>
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>{selected.email}</p>
                </div>
                <button
                  onClick={() => handleDelete(selected.id)}
                  className="text-sm transition-colors"
                  style={{ color: "var(--text-muted)" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "#ef4444"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}
                >
                  Deletar
                </button>
              </div>
              <div className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
                {formatDate(selected.createdAt)}
              </div>
              <div className="whitespace-pre-wrap leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {selected.message}
              </div>
              <div className="mt-6 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
                <a
                  href={`mailto:${selected.email}?subject=Re: Portfolio&body=Ola ${selected.name},`}
                  className="text-sm transition-colors"
                  style={{ color: "var(--accent)" }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = "0.8"}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
                >
                  Responder por email
                </a>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64" style={{ color: "var(--text-muted)" }}>
              Selecione uma mensagem para visualizar
            </div>
          )}
        </div>
      </div>

      <Pagination page={page} totalPages={totalPages} total={total} onPageChange={setPage} />
    </div>
  );
}
