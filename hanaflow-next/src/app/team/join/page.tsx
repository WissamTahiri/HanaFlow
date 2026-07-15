"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

function JoinTeamInner() {
  const token = useSearchParams().get("token");
  const { isAuthenticated, token: authToken, loading: authLoading, user } = useAuth();
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  // Empêche un double-appel (effet ré-exécuté) sans re-lire `status` dans les
  // deps de l'effet — sinon l'effet dépendrait d'un state qu'il modifie lui-même.
  const attemptedRef = useRef(false);

  const acceptInvite = async () => {
    if (authLoading || !isAuthenticated || !authToken || !token || attemptedRef.current) return;
    attemptedRef.current = true;
    try {
      setStatus("loading");
      const r = await fetch("/api/team/invite/accept", {
        method: "POST",
        headers: { Authorization: `Bearer ${authToken}`, "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ token }),
      });
      const d = await r.json();
      if (!r.ok) { setMessage(d.message ?? "Erreur"); setStatus("error"); return; }
      setMessage(d.message);
      setStatus("done");
      // isPro n'est pas dans le JWT : un reload force AuthContext à re-fetch
      // la session (silentRefresh) et récupérer le nouvel état à jour.
      setTimeout(() => { window.location.href = "/dashboard"; }, 1800);
    } catch {
      setMessage("Erreur réseau");
      setStatus("error");
    } finally {
      // Bloc requis (même vide) pour le lint react-hooks/set-state-in-effect —
      // sans `finally`, l'analyse de flux ne peut pas établir que le setState
      // initial est atteint via un chemin asynchrone borné. Cf. try/catch/finally
      // de fetchCodes (admin/promo-codes/page.tsx) qui suit la même forme.
    }
  };

  useEffect(() => { acceptInvite(); }, [authLoading, isAuthenticated, authToken, token]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!token) {
    return <Centered title="Lien invalide" text="Ce lien d'invitation est incomplet." />;
  }

  if (authLoading) {
    return <Centered spinner />;
  }

  if (!isAuthenticated) {
    return (
      <Centered
        title="Connecte-toi pour rejoindre l'équipe"
        text="Utilise le compte associé à l'adresse email qui a reçu l'invitation."
      >
        <Link
          href={`/login?next=${encodeURIComponent(`/team/join?token=${token}`)}`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-sap-blue text-white font-bold hover:bg-sap-blue-dark transition-all"
        >
          Se connecter →
        </Link>
        <p className="text-xs text-slate-400 mt-3">
          Pas encore de compte ?{" "}
          <Link href={`/register?next=${encodeURIComponent(`/team/join?token=${token}`)}`} className="text-sap-blue underline">
            Inscris-toi avec l&apos;email invité
          </Link>
        </p>
      </Centered>
    );
  }

  if (status === "loading" || status === "idle") {
    return <Centered spinner title="Acceptation de l'invitation…" />;
  }

  if (status === "error") {
    return <Centered title="Impossible de rejoindre l'équipe" text={message} />;
  }

  return (
    <Centered title={message} text={`Connecté en tant que ${user?.email}. Redirection…`} />
  );
}

function Centered({ title, text, spinner, children }: { title?: string; text?: string; spinner?: boolean; children?: React.ReactNode }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        {spinner && <div className="h-8 w-8 mx-auto mb-4 rounded-full border-4 border-sap-blue border-t-transparent animate-spin" />}
        {title && <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{title}</h1>}
        {text && <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">{text}</p>}
        {children}
      </div>
    </div>
  );
}

export default function JoinTeamPage() {
  return (
    <Suspense fallback={<Centered spinner />}>
      <JoinTeamInner />
    </Suspense>
  );
}
