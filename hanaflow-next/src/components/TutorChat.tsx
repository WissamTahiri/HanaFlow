"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

/**
 * TutorChat — widget floating qui appelle /api/tutor/chat pour discuter
 * d'un module SAP avec un tuteur IA (Gemini).
 *
 * Comportement :
 *  - Bouton rond en bas-droite qui ouvre/ferme le panel
 *  - History persistée en localStorage par moduleCode (`tutor:<code>`)
 *  - 10 derniers messages envoyés au backend (sliding window)
 *  - Markdown safe via react-markdown (pas de dangerouslySetInnerHTML)
 *  - Animation soft Framer Motion
 *  - Si user pas authentifié, on cache le widget (handled par parent ou via auth)
 */

type ChatMessage = { role: "user" | "model"; text: string };

type Props = {
  moduleCode: "fi" | "co" | "mm" | "sd" | "pp" | "ai";
  chapterId?: string;
  moduleName?: string;
};

const SLIDING_WINDOW = 10;

function storageKey(moduleCode: string) {
  return `tutor:${moduleCode}`;
}

function loadHistory(moduleCode: string): ChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(storageKey(moduleCode));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ChatMessage[];
    if (!Array.isArray(parsed)) return [];
    return parsed.slice(-SLIDING_WINDOW * 2);
  } catch {
    return [];
  }
}

function saveHistory(moduleCode: string, history: ChatMessage[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(storageKey(moduleCode), JSON.stringify(history));
  } catch {
    // localStorage plein ou désactivé — on accepte la perte silencieusement
  }
}

const SUGGESTED_QUESTIONS: Record<string, string[]> = {
  fi: [
    "Quelle est la différence entre BKPF et ACDOCA ?",
    "Comment fonctionne le matching trois-voies en FI ?",
    "Quel T-code pour saisir une facture fournisseur ?",
  ],
  co: [
    "Différence entre centre de coût et centre de profit ?",
    "Comment fonctionne le CO-PA ?",
    "Quel est le rôle d'un ordre interne ?",
  ],
  mm: [
    "Quelles sont les étapes du processus P2P ?",
    "Comment configurer une release strategy ?",
    "T-code pour créer une demande d'achat ?",
  ],
  sd: [
    "Quel est le flow d'un ordre OTC complet ?",
    "Comment fonctionne la condition technique de pricing ?",
    "T-code pour saisir une commande client ?",
  ],
  pp: [
    "C'est quoi MRP type PD vs VB ?",
    "Différence entre ordre de fabrication et ordre planifié ?",
    "Comment fonctionne le BOM explosion ?",
  ],
  ai: [
    "C'est quoi RAG en pratique ?",
    "Comment intégrer Joule avec SAP S/4HANA ?",
    "Différence entre fine-tuning et prompt engineering ?",
  ],
};

export default function TutorChat({ moduleCode, chapterId, moduleName }: Props) {
  const { getToken, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const scrollRef = useRef<HTMLDivElement>(null);

  // Charge l'history au mount
  useEffect(() => {
    setHistory(loadHistory(moduleCode));
  }, [moduleCode]);

  // Auto-scroll au bas à chaque nouveau message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, pending]);

  // Sauvegarde l'history à chaque modif
  useEffect(() => {
    if (history.length > 0) saveHistory(moduleCode, history);
  }, [history, moduleCode]);

  const send = async (text: string) => {
    if (!text.trim() || pending) return;
    setError("");

    const userMsg: ChatMessage = { role: "user", text: text.trim() };
    const newHistory = [...history, userMsg];
    setHistory(newHistory);
    setInput("");
    setPending(true);

    try {
      const fresh = await getToken();
      if (!fresh) {
        setError("Session expirée — reconnecte-toi.");
        setHistory(history);
        return;
      }
      const r = await fetch("/api/tutor/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${fresh}`,
        },
        credentials: "include",
        body: JSON.stringify({
          moduleCode,
          chapterId,
          message: text.trim(),
          // On envoie les N derniers messages sans le user qui vient d'être ajouté
          // (le backend l'ajoute lui-même via `message`)
          history: history.slice(-SLIDING_WINDOW * 2),
        }),
      });
      const d = await r.json();
      if (!r.ok) {
        setError(d.message ?? "Erreur du tuteur");
        // Retire le message user en cas d'erreur pour permettre de réessayer
        setHistory(history);
        return;
      }
      setHistory([...newHistory, { role: "model", text: d.reply }]);
    } catch {
      setError("Erreur réseau, réessaie.");
      setHistory(history);
    } finally {
      setPending(false);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    saveHistory(moduleCode, []);
    setError("");
  };

  const suggestions = SUGGESTED_QUESTIONS[moduleCode] ?? [];
  const loginHref = `/login?next=${encodeURIComponent(pathname ?? "/")}`;

  return (
    <>
      {/* Floating trigger button */}
      <motion.button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 px-4 py-3 rounded-full bg-sap-blue text-white shadow-[0_8px_24px_rgba(37,99,235,0.30)] hover:bg-sap-blue-dark active:scale-[0.97] transition-all"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        aria-expanded={open}
        aria-label={open ? "Fermer le tuteur" : "Ouvrir le tuteur IA"}
      >
        <SparkleIcon />
        <span className="hidden sm:inline text-sm font-semibold">Tuteur IA</span>
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] max-w-md h-[min(70vh,640px)] flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-[0_20px_60px_rgba(15,23,42,0.20)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-sap-blue/10 dark:bg-sap-blue/20 text-sap-blue flex items-center justify-center">
                  <SparkleIcon />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    Tuteur {moduleName ?? moduleCode.toUpperCase()}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    Powered by Gemini · 10 messages/h
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {history.length > 0 && (
                  <button
                    onClick={clearHistory}
                    className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white px-2 py-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Effacer la conversation"
                  >
                    Vider
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Fermer"
                  className="h-7 w-7 inline-flex items-center justify-center rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400 dark:hover:text-white"
                >
                  <CloseIcon />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
            >
              {history.length === 0 && (
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-3 leading-relaxed">
                    Pose une question sur le module {moduleName ?? moduleCode.toUpperCase()}.
                    Je connais le contenu du cours et les T-codes SAP officiels.
                  </p>
                  {suggestions.length > 0 && (
                    <>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                        Idées de questions
                      </p>
                      <div className="space-y-1.5">
                        {suggestions.map((q) => (
                          <button
                            key={q}
                            onClick={() => (isAuthenticated ? send(q) : undefined)}
                            disabled={pending || !isAuthenticated}
                            title={isAuthenticated ? undefined : "Connecte-toi pour discuter avec le tuteur"}
                            className="block w-full text-left text-xs px-3 py-2 rounded-lg bg-gray-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-sap-blue/5 dark:hover:bg-sap-blue/15 hover:text-sap-blue dark:hover:text-sap-accent transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {history.map((m, i) => (
                <Bubble key={i} role={m.role}>
                  {m.role === "model" ? (
                    <Markdown text={m.text} />
                  ) : (
                    <span>{m.text}</span>
                  )}
                </Bubble>
              ))}

              {pending && (
                <Bubble role="model">
                  <span className="inline-flex items-center gap-1.5 text-slate-400">
                    <Dot delay={0} />
                    <Dot delay={0.15} />
                    <Dot delay={0.3} />
                  </span>
                </Bubble>
              )}

              {error && (
                <p className="text-xs text-red-600 dark:text-red-400 px-3 py-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  {error}
                </p>
              )}
            </div>

            {/* Input ou CTA login */}
            {isAuthenticated ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
                className="border-t border-gray-100 dark:border-slate-800 p-3 flex gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Ta question sur ${moduleCode.toUpperCase()}...`}
                  disabled={pending}
                  maxLength={4000}
                  className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sap-blue/40"
                />
                <button
                  type="submit"
                  disabled={pending || !input.trim()}
                  className="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-sap-blue text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-sap-blue-dark transition-colors"
                  aria-label="Envoyer"
                >
                  <SendIcon />
                </button>
              </form>
            ) : (
              <div className="border-t border-gray-100 dark:border-slate-800 p-3 bg-gradient-to-r from-sap-blue/5 to-sap-blue/10 dark:from-sap-blue/10 dark:to-sap-blue/15">
                <p className="text-xs text-slate-600 dark:text-slate-300 mb-2 text-center">
                  Crée ton compte gratuit pour discuter avec le tuteur IA
                </p>
                <div className="flex gap-2">
                  <Link
                    href={loginHref}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 text-xs font-semibold rounded-lg border border-sap-blue/40 text-sap-blue dark:text-sap-accent hover:bg-sap-blue/10 transition-colors"
                  >
                    Se connecter
                  </Link>
                  <Link
                    href={`/register?next=${encodeURIComponent(pathname ?? "/")}`}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 text-xs font-semibold rounded-lg bg-sap-blue text-white hover:bg-sap-blue-dark transition-colors"
                  >
                    S&apos;inscrire (gratuit)
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Bubble({ role, children }: { role: "user" | "model"; children: ReactNode }) {
  return (
    <div className={`flex ${role === "user" ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
          role === "user"
            ? "bg-sap-blue text-white rounded-br-md"
            : "bg-gray-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-md"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

function Markdown({ text }: { text: string }) {
  return (
    <ReactMarkdown
      components={{
        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
        ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-0.5">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-0.5">{children}</ol>,
        code: ({ children }) => (
          <code className="px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-mono text-[0.85em]">
            {children}
          </code>
        ),
        strong: ({ children }) => <strong className="font-bold text-sap-blue dark:text-sap-accent">{children}</strong>,
        a: ({ href, children }) => (
          <a href={href} target="_blank" rel="noopener noreferrer" className="underline text-sap-blue dark:text-sap-accent">
            {children}
          </a>
        ),
      }}
    >
      {text}
    </ReactMarkdown>
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <motion.span
      className="inline-block w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500"
      animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
      transition={{ duration: 1, repeat: Infinity, delay }}
    />
  );
}

function SparkleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l1.4 4.6L18 8l-4.6 1.4L12 14l-1.4-4.6L6 8l4.6-1.4L12 2zM5 14l.84 2.76L8.5 17.5l-2.76.84L5 21l-.84-2.76L1.5 17.5l2.76-.84L5 14zm14 0l.84 2.76L22.5 17.5l-2.76.84L19 21l-.84-2.76L15.5 17.5l2.76-.84L19 14z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}
