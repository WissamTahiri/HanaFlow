"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

interface Member {
  userId: number;
  name: string;
  email: string;
  role: string;
  joinedAt: string;
  certificatesCount: number;
  avgExamScore: number;
  examAttempts: number;
  xp: number;
  lastActivityAt: string | null;
}

interface TeamData {
  organization: { id: number; name: string; seatLimit: number; isActive: boolean; seatsUsed: number };
  members: Member[];
  pendingInvites: Array<{ id: number; email: string; expiresAt: string; createdAt: string }>;
}

export default function TeamPage() {
  const { token, loading: authLoading } = useAuth();
  const [data, setData] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notOwner, setNotOwner] = useState(false);
  const [error, setError] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [removing, setRemoving] = useState<number | null>(null);

  const fetchTeam = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const r = await fetch("/api/team", {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      if (r.status === 403 || r.status === 404) { setNotOwner(true); return; }
      const d = await r.json();
      if (!r.ok) { setError(d.message ?? "Erreur"); return; }
      setData(d);
    } catch {
      setError("Erreur réseau");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (!authLoading) fetchTeam(); }, [token, authLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  const sendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !inviteEmail.trim()) return;
    setInviting(true);
    setError("");
    try {
      const r = await fetch("/api/team/invite", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: inviteEmail.trim() }),
      });
      const d = await r.json();
      if (!r.ok) { setError(d.message ?? "Erreur"); return; }
      setInviteEmail("");
      await fetchTeam();
    } catch {
      setError("Erreur réseau");
    } finally {
      setInviting(false);
    }
  };

  const removeMember = async (userId: number, name: string) => {
    if (!confirm(`Retirer ${name} de l'équipe ?`)) return;
    if (!token) return;
    setRemoving(userId);
    try {
      const r = await fetch(`/api/team/members/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      if (!r.ok) { const d = await r.json(); setError(d.message ?? "Erreur"); return; }
      await fetchTeam();
    } catch {
      setError("Erreur réseau");
    } finally {
      setRemoving(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-sap-blue border-t-transparent animate-spin" />
      </div>
    );
  }

  if (notOwner || !data) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Pas d&apos;équipe pour l&apos;instant</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Cette page est réservée aux propriétaires d&apos;un compte équipe HanaFlow.
            Intéressé par le plan Équipe pour ton entreprise ?
          </p>
          <Link href="/pricing" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-sap-blue text-white font-bold hover:bg-sap-blue-dark transition-all">
            Voir le plan Équipe →
          </Link>
        </div>
      </div>
    );
  }

  const { organization, members, pendingInvites } = data;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{organization.name}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {organization.seatsUsed} / {organization.seatLimit} sièges utilisés
          {!organization.isActive && (
            <span className="ml-2 text-red-500 font-semibold">— organisation désactivée, contacte le support</span>
          )}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Invitation */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5 mb-6">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Inviter un membre</h2>
        <form onSubmit={sendInvite} className="flex gap-2">
          <input
            type="email"
            required
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="collegue@entreprise.com"
            disabled={!organization.isActive}
            className="flex-1 px-3 py-2 text-sm border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sap-blue/50 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={inviting || !organization.isActive}
            className="px-5 py-2 bg-sap-blue text-white rounded-lg text-sm font-semibold hover:bg-sap-blue/90 transition-colors disabled:opacity-50"
          >
            {inviting ? "Envoi…" : "Inviter"}
          </button>
        </form>

        {pendingInvites.length > 0 && (
          <div className="mt-4 space-y-1.5">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Invitations en attente</p>
            {pendingInvites.map((inv) => (
              <div key={inv.id} className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> {inv.email}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Membres */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50">
                <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Membre</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Certificats</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Score moyen examen</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">XP</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Dernière activité</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.userId} className="border-b border-gray-50 dark:border-slate-700/50 last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-900 dark:text-white">{m.name}</p>
                    <p className="text-xs text-slate-400">{m.email}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{m.certificatesCount}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                    {m.examAttempts > 0 ? `${m.avgExamScore}%` : "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{m.xp}</td>
                  <td className="px-4 py-3 text-xs text-slate-400">
                    {m.lastActivityAt ? new Date(m.lastActivityAt).toLocaleDateString("fr-FR") : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {m.role === "owner" ? (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-sap-blue/10 text-sap-blue font-bold uppercase">Owner</span>
                    ) : removing === m.userId ? (
                      <div className="w-4 h-4 border-2 border-sap-blue border-t-transparent rounded-full animate-spin ml-auto" />
                    ) : (
                      <button
                        onClick={() => removeMember(m.userId, m.name)}
                        className="px-2.5 py-1 rounded-md text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 transition-colors"
                      >
                        Retirer
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
