"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

type JobListing = {
  id: number;
  title: string;
  companyName: string | null;
  moduleCode: string | null;
  seniority: string | null;
  location: string | null;
  workMode: string | null;
  contractType: string | null;
  description: string;
  externalUrl: string | null;
  isPublished: boolean;
  isFeatured: boolean;
  sortOrder: number;
  expiresAt: string | null;
  _count: { applications: number };
};

type Draft = Omit<JobListing, "id" | "_count">;

const EMPTY: Draft = {
  title: "", companyName: "", moduleCode: null, seniority: null, location: "",
  workMode: null, contractType: null, description: "", externalUrl: "",
  isPublished: true, isFeatured: false, sortOrder: 0, expiresAt: null,
};

const MODULES = ["FI", "CO", "MM", "SD", "PP", "AI"];
const SENIORITIES = ["junior", "confirmed", "senior"];
const WORK_MODES = ["remote", "hybrid", "onsite"];
const CONTRACT_TYPES = ["cdi", "cdd", "freelance"];

export default function AdminJobsPage() {
  const { getToken } = useAuth();
  const [items, setItems] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<JobListing | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const r = await fetch("/api/admin/jobs", {
        headers: { Authorization: `Bearer ${token ?? ""}` },
        credentials: "include",
      });
      const d = await r.json();
      if (r.ok) setItems(d.items ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const openCreate = () => { setDraft(EMPTY); setEditing(null); setShowForm(true); setError(""); };

  const openEdit = (j: JobListing) => {
    setDraft({
      title: j.title, companyName: j.companyName ?? "", moduleCode: j.moduleCode, seniority: j.seniority,
      location: j.location ?? "", workMode: j.workMode, contractType: j.contractType, description: j.description,
      externalUrl: j.externalUrl ?? "", isPublished: j.isPublished, isFeatured: j.isFeatured,
      sortOrder: j.sortOrder, expiresAt: j.expiresAt,
    });
    setEditing(j);
    setShowForm(true);
    setError("");
  };

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      const token = await getToken();
      // En édition (PATCH), un champ vidé doit être envoyé comme `null` pour
      // que l'API l'efface réellement — `undefined` est omis par
      // JSON.stringify, donc le champ existant en base ne serait jamais
      // touché. En création (POST), le schéma n'accepte pas `null`, donc on
      // omet (`undefined`) les champs vides comme avant.
      const emptyAs = editing ? null : undefined;
      const body = {
        ...draft,
        companyName: draft.companyName || emptyAs,
        location: draft.location || emptyAs,
        externalUrl: draft.externalUrl || emptyAs,
        moduleCode: draft.moduleCode || emptyAs,
        seniority: draft.seniority || emptyAs,
        workMode: draft.workMode || emptyAs,
        contractType: draft.contractType || emptyAs,
        expiresAt: draft.expiresAt || emptyAs,
      };
      const url = editing ? `/api/admin/jobs/${editing.id}` : "/api/admin/jobs";
      const method = editing ? "PATCH" : "POST";
      const r = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token ?? ""}` },
        credentials: "include",
        body: JSON.stringify(body),
      });
      const d = await r.json();
      if (!r.ok) { setError(d.message ?? "Erreur"); return; }
      setShowForm(false);
      await load();
    } finally {
      setSaving(false);
    }
  };

  const del = async (id: number) => {
    if (!confirm("Supprimer cette annonce définitivement ?")) return;
    const token = await getToken();
    await fetch(`/api/admin/jobs/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token ?? ""}` },
      credentials: "include",
    });
    await load();
  };

  const togglePublish = async (j: JobListing) => {
    const token = await getToken();
    await fetch(`/api/admin/jobs/${j.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token ?? ""}` },
      credentials: "include",
      body: JSON.stringify({ isPublished: !j.isPublished }),
    });
    await load();
  };

  return (
    <div className="max-w-5xl">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Offres d&apos;emploi</h1>
          <p className="text-sm text-slate-500 mt-1">Annonces saisies manuellement — visibles sur /emplois si publiées.</p>
        </div>
        <button onClick={openCreate} className="btn-primary px-5 py-2 text-sm">+ Ajouter</button>
      </div>

      {loading ? (
        <p className="text-sm text-slate-400">Chargement…</p>
      ) : items.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-10 text-center">
          <p className="text-sm text-slate-500 mb-4">Aucune annonce pour l&apos;instant.</p>
          <button onClick={openCreate} className="btn-primary px-5 py-2 text-sm">Ajouter la première</button>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((j) => (
            <div key={j.id} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="font-bold text-sm text-slate-900 dark:text-white">{j.title}</p>
                    {j.isFeatured && <Badge color="amber">Featured</Badge>}
                    {!j.isPublished && <Badge color="slate">Brouillon</Badge>}
                    {j.moduleCode && <Badge color="blue">{j.moduleCode}</Badge>}
                  </div>
                  <p className="text-xs text-slate-500 mb-2">
                    {j.companyName}{j.companyName && j.location ? " · " : ""}{j.location}
                  </p>
                  <Link href={`/admin/jobs/${j.id}/applications`} className="text-xs text-sap-blue hover:underline">
                    {j._count.applications} candidature{j._count.applications !== 1 ? "s" : ""} →
                  </Link>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <button onClick={() => openEdit(j)} className="text-xs px-3 py-1.5 rounded-md bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600">Éditer</button>
                  <button onClick={() => togglePublish(j)} className="text-xs px-3 py-1.5 rounded-md bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600">
                    {j.isPublished ? "Dépublier" : "Publier"}
                  </button>
                  <button onClick={() => del(j.id)} className="text-xs px-3 py-1.5 rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">Supprimer</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60" onClick={() => setShowForm(false)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">{editing ? "Éditer" : "Nouvelle"} annonce</h2>
            <div className="space-y-3">
              <FormField label="Titre *">
                <input className={inputCls} value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Consultant SAP FI junior" />
              </FormField>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Entreprise">
                  <input className={inputCls} value={draft.companyName ?? ""} onChange={(e) => setDraft({ ...draft, companyName: e.target.value })} />
                </FormField>
                <FormField label="Localisation">
                  <input className={inputCls} value={draft.location ?? ""} onChange={(e) => setDraft({ ...draft, location: e.target.value })} placeholder="Paris" />
                </FormField>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Module SAP">
                  <select className={inputCls} value={draft.moduleCode ?? ""} onChange={(e) => setDraft({ ...draft, moduleCode: e.target.value || null })}>
                    <option value="">—</option>
                    {MODULES.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </FormField>
                <FormField label="Séniorité">
                  <select className={inputCls} value={draft.seniority ?? ""} onChange={(e) => setDraft({ ...draft, seniority: e.target.value || null })}>
                    <option value="">—</option>
                    {SENIORITIES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </FormField>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Mode de travail">
                  <select className={inputCls} value={draft.workMode ?? ""} onChange={(e) => setDraft({ ...draft, workMode: e.target.value || null })}>
                    <option value="">—</option>
                    {WORK_MODES.map((w) => <option key={w} value={w}>{w}</option>)}
                  </select>
                </FormField>
                <FormField label="Type de contrat">
                  <select className={inputCls} value={draft.contractType ?? ""} onChange={(e) => setDraft({ ...draft, contractType: e.target.value || null })}>
                    <option value="">—</option>
                    {CONTRACT_TYPES.map((c) => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                  </select>
                </FormField>
              </div>
              <FormField label="Description *">
                <textarea className={`${inputCls} min-h-[120px]`} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} maxLength={5000} />
              </FormField>
              <FormField label="URL externe (optionnel)">
                <input className={inputCls} value={draft.externalUrl ?? ""} onChange={(e) => setDraft({ ...draft, externalUrl: e.target.value })} placeholder="https://..." />
              </FormField>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Ordre d'affichage">
                  <input className={inputCls} type="number" value={draft.sortOrder} onChange={(e) => setDraft({ ...draft, sortOrder: parseInt(e.target.value || "0", 10) })} />
                </FormField>
                <FormField label="Expire le (optionnel)">
                  <input className={inputCls} type="datetime-local" value={draft.expiresAt?.slice(0, 16) ?? ""} onChange={(e) => setDraft({ ...draft, expiresAt: e.target.value ? new Date(e.target.value).toISOString() : null })} />
                </FormField>
              </div>
              <div className="flex gap-4 text-xs">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={draft.isPublished} onChange={(e) => setDraft({ ...draft, isPublished: e.target.checked })} /> Publié
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={draft.isFeatured} onChange={(e) => setDraft({ ...draft, isFeatured: e.target.checked })} /> Featured
                </label>
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100 dark:border-slate-700">
                <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-slate-500">Annuler</button>
                <button onClick={save} disabled={saving} className="btn-primary px-5 py-2 text-sm">
                  {saving ? "Sauvegarde..." : editing ? "Mettre à jour" : "Créer"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inputCls = "w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white";

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">{label}</span>
      {children}
    </label>
  );
}

function Badge({ color, children }: { color: "amber" | "slate" | "blue"; children: React.ReactNode }) {
  const colors = {
    amber: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    slate: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
    blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  };
  return <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${colors[color]} uppercase tracking-wider`}>{children}</span>;
}
