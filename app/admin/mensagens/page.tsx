"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/app/components/Toast";

interface Contact {
  id: number;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function AdminMensagensPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selected, setSelected] = useState<Contact | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    fetch("/api/admin/contacts")
      .then((r) => r.json())
      .then(setContacts);
  }, []);

  const handleView = async (contact: Contact) => {
    setSelected(contact);
    if (!contact.read) {
      await fetch(`/api/admin/contacts/${contact.id}`);
      setContacts(
        contacts.map((c) => (c.id === contact.id ? { ...c, read: true } : c))
      );
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja deletar esta mensagem?")) return;
    const res = await fetch(`/api/admin/contacts/${id}`, { method: "DELETE" });
    if (!res.ok) {
      showToast("Erro ao deletar mensagem", "error");
      return;
    }
    setContacts(contacts.filter((c) => c.id !== id));
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
      <h1 className="text-3xl font-bold text-white mb-8">Mensagens</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-800">
            <h2 className="text-lg font-semibold text-white">
              Inbox ({contacts.filter((c) => !c.read).length} nao lidas)
            </h2>
          </div>
          <div className="divide-y divide-zinc-800 max-h-[600px] overflow-auto">
            {contacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => handleView(contact)}
                className={`w-full text-left px-6 py-4 hover:bg-zinc-800 transition-colors ${
                  selected?.id === contact.id ? "bg-zinc-800" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`font-medium ${
                      contact.read ? "text-zinc-300" : "text-white"
                    }`}
                  >
                    {contact.name}
                  </span>
                  {!contact.read && (
                    <span className="w-2 h-2 bg-emerald-400 rounded-full" />
                  )}
                </div>
                <div className="text-zinc-500 text-sm truncate">
                  {contact.message}
                </div>
                <div className="text-zinc-600 text-xs mt-1">
                  {formatDate(contact.createdAt)}
                </div>
              </button>
            ))}
            {contacts.length === 0 && (
              <p className="text-zinc-500 text-center py-8">
                Nenhuma mensagem encontrada.
              </p>
            )}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl">
          {selected ? (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {selected.name}
                  </h3>
                  <p className="text-zinc-500 text-sm">{selected.email}</p>
                </div>
                <button
                  onClick={() => handleDelete(selected.id)}
                  className="text-zinc-400 hover:text-red-400 transition-colors text-sm"
                >
                  Deletar
                </button>
              </div>
              <div className="text-zinc-400 text-sm mb-4">
                {formatDate(selected.createdAt)}
              </div>
              <div className="text-zinc-300 whitespace-pre-wrap leading-relaxed">
                {selected.message}
              </div>
              <div className="mt-6 pt-4 border-t border-zinc-800">
                <a
                  href={`mailto:${selected.email}?subject=Re: Portfolio&body=Ola ${selected.name},`}
                  className="text-emerald-400 hover:text-emerald-300 transition-colors text-sm"
                >
                  Responder por email
                </a>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-zinc-500">
              Selecione uma mensagem para visualizar
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
