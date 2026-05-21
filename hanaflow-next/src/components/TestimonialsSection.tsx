"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

/**
 * TestimonialsSection — bloc public affiché sur la home (et potentiellement
 * la pricing). Charge les témoignages via /api/testimonials.
 *
 * Si aucun témoignage publié, le composant ne rend rien — pas de placeholder
 * "Loading…" qui pollue la home avant qu'on ait des contenus à montrer.
 */

type Testimonial = {
  id: number;
  authorName: string;
  authorRole: string | null;
  authorCompany: string | null;
  authorPhotoUrl: string | null;
  authorLinkedInUrl: string | null;
  quote: string;
  rating: number | null;
  isFeatured: boolean;
};

export default function TestimonialsSection() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch("/api/testimonials");
        if (r.ok && !cancelled) {
          const d = await r.json();
          setItems(d.testimonials ?? []);
        }
      } catch {
        /* silent */
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Pas de section si aucun témoignage — évite d'afficher du vide
  if (!loaded || items.length === 0) return null;

  return (
    <section className="py-20 bg-sap-gray-light dark:bg-sap-dark border-y border-gray-100 dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-sap-blue mb-3">
            Ils en parlent
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white text-balance">
            Ce que disent les consultants formés sur HanaFlow
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((t, i) => (
            <motion.figure
              key={t.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className={`card p-6 flex flex-col ${t.isFeatured ? "ring-2 ring-sap-blue/30" : ""}`}
            >
              {t.rating && (
                <div className="flex gap-0.5 mb-3" aria-label={`${t.rating} sur 5 étoiles`}>
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <StarIcon key={idx} filled={idx < (t.rating ?? 0)} />
                  ))}
                </div>
              )}

              <blockquote className="flex-1 text-sm text-slate-700 dark:text-slate-200 leading-relaxed mb-5">
                <span className="text-sap-blue dark:text-sap-accent text-2xl leading-none mr-1">&ldquo;</span>
                {t.quote}
                <span className="text-sap-blue dark:text-sap-accent text-2xl leading-none ml-0.5">&rdquo;</span>
              </blockquote>

              <figcaption className="flex items-center gap-3 mt-auto pt-3 border-t border-gray-100 dark:border-slate-800">
                {t.authorPhotoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={t.authorPhotoUrl}
                    alt={t.authorName}
                    className="h-10 w-10 rounded-full object-cover shrink-0"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-linear-to-br from-sap-blue to-sap-blue-dark text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {t.authorName.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {t.authorName}
                  </p>
                  {(t.authorRole || t.authorCompany) && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {t.authorRole}
                      {t.authorRole && t.authorCompany ? " · " : ""}
                      {t.authorCompany}
                    </p>
                  )}
                </div>
                {t.authorLinkedInUrl && (
                  <a
                    href={t.authorLinkedInUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Profil LinkedIn de ${t.authorName}`}
                    className="text-slate-400 hover:text-sap-blue dark:hover:text-sap-accent shrink-0"
                  >
                    <LinkedInIcon />
                  </a>
                )}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={filled ? "text-amber-400" : "text-gray-300 dark:text-slate-600"}
      aria-hidden="true"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}
