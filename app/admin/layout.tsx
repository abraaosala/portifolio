"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ToastProvider } from "@/app/components/Toast";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: "◈" },
  { label: "Projetos", href: "/admin/projetos", icon: "◉" },
  { label: "Skills", href: "/admin/skills", icon: "◆" },
  { label: "Mensagens", href: "/admin/mensagens", icon: "◇" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );

  useEffect(() => {
    if (pathname === "/admin/login") return;

    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (!data.user) {
          router.push("/admin/login");
        } else {
          setUser(data.user);
        }
      });
  }, [router, pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  if (pathname === "/admin/login") {
    return <ToastProvider>{children}</ToastProvider>;
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-zinc-950 flex">
        <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col">
          <div className="p-6 border-b border-zinc-800">
            <Link href="/admin" className="text-xl font-bold text-white">
              <span className="text-emerald-400">A</span>XS Admin
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  pathname === item.href
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-zinc-800">
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <div className="text-zinc-300">{user?.name || "Admin"}</div>
                <div className="text-zinc-500 text-xs">{user?.email}</div>
              </div>
              <button
                onClick={handleLogout}
                className="text-zinc-500 hover:text-red-400 transition-colors text-sm"
              >
                Sair
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1 p-8 overflow-auto">{children}</main>
      </div>
    </ToastProvider>
  );
}
