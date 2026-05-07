"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";

interface Setting {
  key: string;
  value: string;
  category: string;
  updatedAt?: string;
  updatedBy?: string | null;
}

const DEFAULT_SETTINGS: Omit<Setting, "updatedAt" | "updatedBy">[] = [
  { key: "contact_email",         value: "wisstahiri91@gmail.com",  category: "contact" },
  { key: "support_email",         value: "wisstahiri91@gmail.com",  category: "contact" },
  { key: "linkedin_url",          value: "https://www.linkedin.com/in/wissam-tahiri-730a47326", category: "contact" },
  { key: "github_url",            value: "https://github.com/WissamTahiri", category: "contact" },
  { key: "banner_enabled",        value: "false",                    category: "banner" },
  { key: "banner_message",        value: "",                         category: "banner" },
  { key: "banner_link",           value: "",                         category: "banner" },
  { key: "maintenance_enabled",   value: "false",                    category: "maintenance" },
  { key: "maintenance_message",   value: "Maintenance en cours, retour rapide.", category: "maintenance" },
  { key: "registration_enabled",  value: "true",                     category: "feature_flags" },
  { key: "promo_codes_enabled",   value: "true",                     category: "feature_flags" },
];

const CATEGORY_LABELS: Record<string, string> = {
  contact:       "Contact & réseaux",
  banner:        "Bannière promotionnelle",
  maintenance:   "Mode maintenance",
  feature_flags: "Activation de fonctionnalités",
  general:       "Général",
};

const KEY_LABELS: Record<string, { label: string; description?: string; type?: "boolean" | "url" | "email" | "text" }> = {
  contact_email:         { label: "E-mail de contact", description: "Affiché sur les pages publiques (mentions légales, contact)", type: "email" },
  support_email:         { label: "E-mail support", description: "Pour les demandes utilisateurs", type: "email" },
  linkedin_url:          { label: "URL LinkedIn", type: "url" },
  github_url:            { label: "URL GitHub", type: "url" },
  banner_enabled:        { label: "Activer la bannière", description: "Affiche une bannière en haut de toutes les pages", type: "boolean" },
  banner_message:        { label: "Message de la bannière" },
  banner_link:           { label: "Lien (optionnel)", description: "URL vers laquelle pointe la bannière", type: "url" },
  maintenance_enabled:   { label: "Mode maintenance", description: "Bloque l'accès au site pour les non-admins", type: "boolean" },
  maintenance_message:   { label: "Message de maintenance" },
  registration_enabled:  { label: "Inscriptions ouvertes", description: "Si désactivé, /register affiche un message", type: "boolean" },
  promo_codes_enabled:   { label: "Codes promo actifs", description: "Désactive globalement le rachat de codes promo", type: "boolean" },
};

export default function AdminSettingsPage() {
  const { token } = useAuth();
  const [settings, setSettings] = useState<Setting[]>([]);
  const [dirty, setDirty] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const fetchSettings = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const r = await fetch("/api/admin/settings", {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      const d = await r.json();
      if (!r.ok) { setError(d.message ?? "Erreur"); return; }
      // Merge with defaults to ensure all keys are present
      const fromDb: Setting[] = d.settings;
      const merged = DEFAULT_SETTINGS.map((def) => {
        const existing = fromDb.find((s) => s.key === def.key);
        return existing ?? def;
      });
      // Add any DB-only keys not in defaults
      fromDb.forEach((s) => {
        if (!merged.find((m) => m.key === s.key)) merged.push(s);
      });
      setSettings(merged);
    } catch {
      setError("Erreur réseau");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const setValue = (key: string, value: string) => {
    setDirty((prev) => ({ ...prev, [key]: value }));
  };

  const getValue = (s: Setting) => dirty[s.key] ?? s.value;

  const save = async () => {
    if (!token || Object.keys(dirty).length === 0) return;
    setSaving(true);
    setError("");
    setInfo("");
    try {
      const updates = Object.entries(dirty).map(([key, value]) => {
        const setting = settings.find((s) => s.key === key);
        return { key, value, category: setting?.category ?? "general" };
      });
      const r = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ settings: updates }),
      });
      const d = await r.json();
      if (!r.ok) { setError(d.message ?? "Erreur"); return; }
      setInfo(`${d.count} paramètre${d.count > 1 ? "s" : ""} mis à jour`);
      setDirty({});
      await fetchSettings();
    } catch {
      setError("Erreur réseau");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-slate-500">
        <div className="w-4 h-4 border-2 border-sap-blue border-t-transparent rounded-full animate-spin" />
        Chargement…
      </div>
    );
  }

  // Group by category
  const grouped = settings.reduce<Record<string, Setting[]>>((acc, s) => {
    acc[s.category] = acc[s.category] ?? [];
    acc[s.category].push(s);
    return acc;
  }, {});

  const dirtyCount = Object.keys(dirty).length;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Paramètres du site</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Configuration globale stockée en base — les changements sont immédiats
          </p>
        </div>
        <button
          onClick={save}
          disabled={dirtyCount === 0 || saving}
          className="px-4 py-2 bg-sap-blue text-white text-sm font-semibold rounded-lg hover:bg-sap-blue-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {saving ? "Enregistrement…" : `Enregistrer${dirtyCount > 0 ? ` (${dirtyCount})` : ""}`}
        </button>
      </div>

      {error && <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">{error}</div>}
      {info && <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm">{info}</div>}

      {Object.entries(grouped).map(([category, items]) => (
        <section key={category} className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">
            {CATEGORY_LABELS[category] ?? category}
          </h2>
          <div className="space-y-4">
            {items.map((s) => {
              const meta = KEY_LABELS[s.key] ?? { label: s.key };
              const value = getValue(s);
              const isDirty = dirty[s.key] !== undefined;
              return (
                <div key={s.key} className={`pl-3 -ml-3 border-l-2 ${isDirty ? "border-sap-blue" : "border-transparent"}`}>
                  <label className="block">
                    <div className="flex items-baseline justify-between gap-3 mb-1.5">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{meta.label}</span>
                      <span className="text-[10px] font-mono text-slate-400">{s.key}</span>
                    </div>
                    {meta.description && <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{meta.description}</p>}
                    {meta.type === "boolean" ? (
                      <select
                        value={value}
                        onChange={(e) => setValue(s.key, e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sap-blue/40"
                      >
                        <option value="true">Activé (true)</option>
                        <option value="false">Désactivé (false)</option>
                      </select>
                    ) : (
                      <input
                        type={meta.type === "email" ? "email" : meta.type === "url" ? "url" : "text"}
                        value={value}
                        onChange={(e) => setValue(s.key, e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sap-blue/40"
                      />
                    )}
                    {s.updatedAt && s.updatedBy && (
                      <p className="text-[10px] text-slate-400 mt-1">
                        Modifié le {new Date(s.updatedAt).toLocaleDateString("fr-FR")} par {s.updatedBy}
                      </p>
                    )}
                  </label>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
