"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

type Testimonial = {
  id: number;
  authorName: string;
  authorRole: string | null;
  authorCompany: string | null;
  authorPhotoUrl: string | null;
  authorLinkedInUrl: string | null;
  quote: string;
  rating: number | null;
  isPublished: boolean;
  isFeatured: boolean;
  sortOrder: number;
};

const EMPTY: Omit<Testimonial, "id"> = {
  authorName: "",
  authorRole: "",
  authorCompany: "",
  authorPhotoUrl: "",
  authorLinkedInUrl: "",
  quote: "",
  rating: null,
  isPublished: true,
  isFeatured: false,
  sortOrder: 0,
};

export default function AdminTestimonialsPage() {
  const { getToken } = useAuth();
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState<typeof EMPTY>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const r = await fetch("/api/admin/testimonials", {
        headers: { Authorization: `Bearer ${token ?? ""}` },
        credentials: "include",
      });
      const d = await r.json();
      if (r.ok) setItems(d.items ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCreate = () => {
    setDraft(EMPTY);
    setEditing(null);
    setShowForm(true);
    setError("");
  };

  const openEdit = (t: Testimonial) => {
    setDraft({
      authorName: t.authorName,
      authorRole: t.authorRole ?? "",
      authorCompany: t.authorCompany ?? "",
      authorPhotoUrl: t.authorPhotoUrl ?? "",
      authorLinkedInUrl: t.authorLinkedInUrl ?? "",
      quote: t.quote,
      rating: t.rating,
      isPublished: t.isPublished,
      isFeatured: t.isFeatured,
      sortOrder: t.sortOrder,
    });
    setEditing(t);
    setShowForm(true);
    setError("");
  };

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      const token = await getToken();
      const body = {
        ...draft,
        authorRole: draft.authorRole || undefined,
        authorCompany: draft.authorCompany || undefined,
        authorPhotoUrl: draft.authorPhotoUrl || undefined,
        authorLinkedInUrl: draft.authorLinkedInUrl || undefined,
        rating: draft.rating ?? undefined,
      };
      const url = editing ? `/api/admin/testimonials/${editing.id}` : "/api/admin/testimonials";
      const method = editing ? "PATCH" : "POST";
      const r = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token ?? ""}` },
        credentials: "include",
        body: JSON.stringify(body),
      });
      const d = await r.json();
      if (!r.ok) {
        setError(d.message ?? "Erreur");
        return;
      }
      setShowForm(false);
      await load();
    } finally {
      setSaving(false);
    }
  };

  const del = async (id: number) => {
    if (!confirm("Supprimer ce témoignage définitivement ?")) return;
    const token = await getToken();
    await fetch(`/api/admin/testimonials/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token ?? ""}` },
      credentials: "include",
    });
    await load();
  };

  const togglePublish = async (t: Testimonial) => {
    const token = await getToken();
    await fetch(`/api/admin/testimonials/${t.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token ?? ""}` },
      credentials: "include",
      body: JSON.stringify({ isPublished: !t.isPublished }),
    });
    await load();
  };

  return (
    <div className="max-w-5xl">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Témoignages</h1>
          <p className="text-sm text-slate-500 mt-1">Apparaissent sur la home publique si publiés.</p>
        </div>
        <button onClick={openCreate} className="btn-primary px-5 py-2 text-sm">
          + Ajouter
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-slate-400">Chargement…</p>
      ) : items.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-10 text-center">
          <p className="text-sm text-slate-500 mb-4">Aucun témoignage pour l&apos;instant.</p>
          <button onClick={openCreate} className="btn-primary px-5 py-2 text-sm">
            Ajouter le premier
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((t) => (
            <div key={t.id} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-sm text-slate-900 dark:text-white">{t.authorName}</p>
                    {t.isFeatured && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 uppercase tracking-wider">
                        Featured
                      </span>
                    )}
                    {!t.isPublished && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Brouillon
                      </span>
                    )}
                    {t.rating && (
                      <span className="text-[10px] text-amber-500">{"★".repeat(t.rating)}</span>
                    )}
                  </div>
                  {(t.authorRole || t.authorCompany) && (
                    <p className="text-xs text-slate-500 mb-2">
                      {t.authorRole}{t.authorRole && t.authorCompany ? " · " : ""}{t.authorCompany}
                    </p>
                  )}
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-3">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <button onClick={() => openEdit(t)} className="text-xs px-3 py-1.5 rounded-md bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600">
                    Éditer
                  </button>
                  <button onClick={() => togglePublish(t)} className="text-xs px-3 py-1.5 rounded-md bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600">
                    {t.isPublished ? "Dépublier" : "Publier"}
                  </button>
                  <button onClick={() => del(t.id)} className="text-xs px-3 py-1.5 rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60" onClick={() => setShowForm(false)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">{editing ? "Éditer" : "Nouveau"} témoignage</h2>
            <div className="space-y-3">
              <FormField label="Nom *">
                <input className={inputCls} value={draft.authorName} onChange={(e) => setDraft({ ...draft, authorName: e.target.value })} />
              </FormField>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Rôle">
                  <input className={inputCls} value={draft.authorRole ?? ""} onChange={(e) => setDraft({ ...draft, authorRole: e.target.value })} placeholder="Consultant SAP FI junior" />
                </FormField>
                <FormField label="Entreprise">
                  <input className={inputCls} value={draft.authorCompany ?? ""} onChange={(e) => setDraft({ ...draft, authorCompany: e.target.value })} placeholder="Capgemini" />
                </FormField>
              </div>
              <FormField label="Photo URL (optionnel)">
                <input className={inputCls} value={draft.authorPhotoUrl ?? ""} onChange={(e) => setDraft({ ...draft, authorPhotoUrl: e.target.value })} placeholder="https://..." />
              </FormField>
              <FormField label="LinkedIn URL (optionnel)">
                <input className={inputCls} value={draft.authorLinkedInUrl ?? ""} onChange={(e) => setDraft({ ...draft, authorLinkedInUrl: e.target.value })} placeholder="https://linkedin.com/in/..." />
              </FormField>
              <FormField label="Témoignage *">
                <textarea className={`${inputCls} min-h-[120px]`} value={draft.quote} onChange={(e) => setDraft({ ...draft, quote: e.target.value })} maxLength={2000} />
              </FormField>
              <div className="grid grid-cols-3 gap-3">
                <FormField label="Note /5">
                  <select className={inputCls} value={draft.rating ?? ""} onChange={(e) => setDraft({ ...draft, rating: e.target.value ? parseInt(e.target.value, 10) : null })}>
                    <option value="">—</option>
                    {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                </FormField>
                <FormField label="Ordre">
                  <input className={inputCls} type="number" value={draft.sortOrder} onChange={(e) => setDraft({ ...draft, sortOrder: parseInt(e.target.value || "0", 10) })} />
                </FormField>
              </div>
              <div className="flex gap-4 text-xs">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={draft.isPublished} onChange={(e) => setDraft({ ...draft, isPublished: e.target.checked })} />
                  Publié
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={draft.isFeatured} onChange={(e) => setDraft({ ...draft, isFeatured: e.target.checked })} />
                  Featured (highlight)
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
