"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/users", label: "Utilisateurs", icon: "👥" },
  { href: "/admin/promo-codes", label: "Codes Promo", icon: "🎟️" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.replace("/");
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-sap-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 flex flex-col">
        <div className="px-4 py-5 border-b border-gray-100 dark:border-slate-700">
          <p className="text-xs font-bold uppercase tracking-widest text-sap-blue">Admin</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{user.email}</p>
        </div>
        <nav className="flex-1 p-2 space-y-0.5">
          {NAV.map(({ href, label, icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                  active
                    ? "bg-sap-blue/10 text-sap-blue font-semibold"
                    : "text-slate-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                }`}
              >
                <span>{icon}</span>
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="p-2 border-t border-gray-100 dark:border-slate-700">
          <Link
            href="/"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-500 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
          >
            ← Retour au site
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  );
}
