"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import PageLayout from "@/components/PageLayout";

/* ── SVG Icons ── */
const LeafIcon     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>;
const BookOpenIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;
const SettingsIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
const AwardIcon    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>;
const DollarIcon   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
const BarChartIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
const MonitorIcon  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>;
const WrenchIcon   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>;
const TrendUpIcon  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>;
const GradCapIcon  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>;
const PackageIcon  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>;
const UsersIcon    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const GlobeIcon    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
const TargetIcon   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
const MedalIcon    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z"/><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12"/></svg>;
const ArrowUpIcon  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>;
const RefreshIcon  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>;
const ClipboardIcon= () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>;

// ═══════════════════════════════════════════════════════════════════
// DONNÉES DU FORMULAIRE
// ═══════════════════════════════════════════════════════════════════

const NIVEAUX_SAP = [
  { key: "aucun",         label: "Aucun",              desc: "Je n'ai jamais touché à SAP",                  icon: <LeafIcon /> },
  { key: "notions",       label: "Quelques notions",   desc: "J'ai vu SAP mais je ne maîtrise pas encore",   icon: <BookOpenIcon /> },
  { key: "intermediaire", label: "Intermédiaire",       desc: "Je connais 1-2 modules, j'ai pratiqué",        icon: <SettingsIcon /> },
  { key: "confirme",      label: "Confirmé",            desc: "J'ai participé à des projets SAP",             icon: <AwardIcon /> },
];

const EXPERIENCES = [
  { key: "etudiant",   label: "Étudiant(e)",         desc: "En cours de formation, pas encore en poste" },
  { key: "stage",      label: "Stage / Alternance",  desc: "J'ai une première expérience en entreprise" },
  { key: "moins3ans",  label: "1 à 3 ans",           desc: "Jeune professionnel avec quelques années" },
  { key: "3a5ans",     label: "3 à 5 ans",           desc: "Expérience professionnelle solide" },
  { key: "plus5ans",   label: "5 ans et +",          desc: "Professionnel confirmé, expert métier" },
];

const DOMAINES = [
  { key: "finance_compta", label: "Finance / Comptabilité", icon: <DollarIcon /> },
  { key: "gestion",        label: "Gestion / Management",   icon: <BarChartIcon /> },
  { key: "informatique",   label: "Informatique / Digital", icon: <MonitorIcon /> },
  { key: "ingenierie",     label: "Ingénierie / Industrie", icon: <WrenchIcon /> },
  { key: "commerce",       label: "Commerce / Marketing",   icon: <TrendUpIcon /> },
  { key: "autre",          label: "Autre domaine",          icon: <GradCapIcon /> },
];

const PROFILS_CIBLES = [
  { key: "finance",    label: "Finance / Contrôle de gestion", desc: "Modules FI, CO — comptabilité, reporting, clôture", icon: <DollarIcon />,   color: "blue" },
  { key: "supply",     label: "Supply Chain / Logistique",     desc: "Modules MM, SD, PP — achats, stocks, production",  icon: <PackageIcon />,  color: "amber" },
  { key: "sales",      label: "Sales / Relation client",       desc: "Modules SD, CX — ventes, O2C, relation client",    icon: <TrendUpIcon />,  color: "purple" },
  { key: "tech",       label: "IT / Data / IA",                desc: "ABAP, BTP, Fiori, intégrations, analytics SAP",    icon: <SettingsIcon />, color: "emerald" },
  { key: "hcm",        label: "RH / Paie",                     desc: "Module HCM — paie, gestion des talents, formation", icon: <UsersIcon />,   color: "rose" },
  { key: "consultant", label: "Consultant SAP généraliste",    desc: "Vision multi-modules pour du conseil end-to-end",  icon: <GlobeIcon />,    color: "indigo" },
];

const OBJECTIFS = [
  { key: "premier_emploi", label: "Trouver mon premier emploi SAP",        icon: <TargetIcon /> },
  { key: "certification",  label: "Obtenir une certification SAP",          icon: <MedalIcon /> },
  { key: "evolution",      label: "Évoluer dans mon poste actuel",          icon: <ArrowUpIcon /> },
  { key: "reconversion",   label: "Me reconvertir vers le conseil SAP",     icon: <RefreshIcon /> },
  { key: "projet",         label: "Réussir un projet S/4HANA en cours",     icon: <ClipboardIcon /> },
];

const DISPONIBILITES = [
  { key: "faible",   label: "< 5h / semaine",   desc: "Apprentissage en douceur, sur le long terme", weeks: 3.5 },
  { key: "moyen",    label: "5 à 10h / semaine", desc: "Progression régulière, rythme équilibré",    weeks: 2 },
  { key: "intensif", label: "> 10h / semaine",   desc: "Formation intensive, résultats rapides",      weeks: 1 },
];

const CONTEXTES = [
  { key: "etudiant",     label: "Étudiant(e)" },
  { key: "alternant",    label: "En alternance" },
  { key: "salarie",      label: "Salarié(e) en poste" },
  { key: "en_recherche", label: "En recherche d'emploi" },
  { key: "independant",  label: "Indépendant / Freelance" },
];

const MODULES_DISPOS = [
  { key: "fi",     label: "FI",      name: "Financial Accounting",   color: "blue" },
  { key: "co",     label: "CO",      name: "Controlling",            color: "indigo" },
  { key: "mm",     label: "MM",      name: "Materials Management",   color: "emerald" },
  { key: "sd",     label: "SD",      name: "Sales & Distribution",   color: "amber" },
  { key: "hcm",    label: "HCM",     name: "Human Capital Mgmt",     color: "purple" },
  { key: "pp",     label: "PP",      name: "Production Planning",    color: "rose" },
  { key: "s4hana", label: "S/4HANA", name: "Architecture S/4HANA",  color: "violet" },
  { key: "btp",    label: "BTP",     name: "Business Tech Platform", color: "cyan" },
];

// ═══════════════════════════════════════════════════════════════════
// GÉNÉRATEUR DE ROADMAP PERSONNALISÉE
// ═══════════════════════════════════════════════════════════════════

interface FormData {
  niveauSAP: string;
  experience: string;
  domaine: string;
  contexte: string;
  profilCible: string;
  objectif: string;
  disponibilite: string;
  modulesConnus: string[];
}

interface Phase {
  num: number;
  titre: string;
  durée: string;
  couleur: string;
  bullets: string[];
  ressources: { label: string; path: string }[];
  conseil?: string;
}

interface Certif {
  code: string;
  nom: string;
  dispo: boolean;
}

interface RoadmapData {
  intro: string;
  phases: Phase[];
  certif: Certif;
  careerTips: string[];
}

function genererRoadmap(form: FormData): RoadmapData {
  const { niveauSAP, experience, domaine, profilCible, objectif, disponibilite, contexte, modulesConnus } = form;
  const mult = DISPONIBILITES.find(d => d.key === disponibilite)?.weeks ?? 2;
  const w = (n: number) => Math.round(n * mult);

  const estDebutant = niveauSAP === "aucun";
  const estNotion   = niveauSAP === "notions";
  const estConfirme = ["intermediaire", "confirme"].includes(niveauSAP);
  const expertMetier = experience === "plus5ans" || experience === "3a5ans";
  const domaineFi   = domaine === "finance_compta";
  const domaineIT   = domaine === "informatique";

  const modules = new Set(modulesConnus || []);

  // ── Intro personnalisée ──────────────────────────────────────────
  let intro = "";
  if (estDebutant && !expertMetier) {
    intro = `Tu pars de zéro sur SAP — c'est une bonne position pour construire des bases solides sans mauvaises habitudes. Avec ${disponibilite === "intensif" ? "un rythme intensif" : "une progression régulière"}, tu peux atteindre un niveau opérationnel en ${w(8)} à ${w(12)} semaines.`;
  } else if (estDebutant && expertMetier) {
    intro = `Tu as une vraie expérience métier — c'est un atout majeur ! Beaucoup de consultants SAP expérimentés affirment que le plus dur n'est pas SAP en soi, mais de comprendre les processus. Toi, c'est déjà fait. Tu apprendras beaucoup plus vite que la moyenne.`;
  } else if (estNotion && domaineFi) {
    intro = `Tu as des notions SAP et une formation en finance/comptabilité — c'est la combinaison idéale pour une spécialisation FI. Tu vas pouvoir progresser rapidement car tu comprends déjà les concepts métier que SAP modélise.`;
  } else if (estConfirme) {
    intro = `Avec ton niveau confirmé sur SAP, cette roadmap va t'aider à combler les lacunes ciblées, préparer une certification ou atteindre un rôle de référent. L'accent sera mis sur la valeur ajoutée : architecture, conseil et expertise.`;
  } else {
    intro = `Ta roadmap est construite sur la base de ton profil unique. Chaque phase est calibrée selon ta disponibilité et tes objectifs. Les ressources HanaFlow mentionnées sont directement accessibles depuis le menu.`;
  }

  // ── Construction des phases ──────────────────────────────────────
  const phases: Phase[] = [];

  // ─ PHASE 0 : Fondations (uniquement si débutant total) ──────────
  if (estDebutant) {
    phases.push({
      num: phases.length + 1,
      titre: "Fondations — Qu'est-ce que SAP et l'ERP ?",
      durée: `${w(2)}–${w(3)} semaines`,
      couleur: "slate",
      bullets: [
        "Comprendre ce qu'est un ERP et pourquoi les entreprises utilisent SAP : gestion intégrée des données financières, logistiques et RH.",
        "Découvrir l'architecture SAP S/4HANA : mandant, société, modules, Universal Journal (ACDOCA).",
        "Explorer la navigation SAP GUI et SAP Fiori — se familiariser avec les transactions courantes.",
        ...(domaineFi ? ["Tu as déjà les bases comptables (débit/crédit, bilan) — focus sur comment SAP les modélise, pas sur la comptabilité elle-même."] : []),
        ...(domaineIT ? ["Tu comprends les systèmes d'information — focus sur l'architecture fonctionnelle, la structure de données, les API."] : []),
      ],
      ressources: [
        { label: "Vue d'ensemble S/4HANA", path: "/s4hana" },
        { label: "IA & Joule", path: "/ai-joule" },
      ],
      conseil: contexte === "etudiant" ? "Profite de ton statut étudiant pour accéder aux ressources gratuites SAP (SAP Learning Hub for Students)." : "Cherche un accès sandbox SAP via ton entreprise ou un trial gratuit sur SAP BTP.",
    });
  }

  // ─ PHASE 1 : Modules cœur selon profil cible ────────────────────
  const phaseCorePath: Record<string, { titre: string; modules: string[]; durée: string }> = {
    finance:    { titre: "Maîtriser FI (Financial Accounting)",                   modules: ["FI"],                         durée: `${w(4)}–${w(6)} semaines` },
    supply:     { titre: "Maîtriser MM et le cycle P2P",                          modules: ["MM", "FI"],                   durée: `${w(4)}–${w(6)} semaines` },
    sales:      { titre: "Maîtriser SD et le cycle O2C",                          modules: ["SD", "FI"],                   durée: `${w(4)}–${w(6)} semaines` },
    tech:       { titre: "Comprendre les modules fonctionnels (vision globale)",   modules: ["FI", "MM", "SD"],             durée: `${w(3)}–${w(5)} semaines` },
    hcm:        { titre: "Maîtriser HCM (Paie et RH)",                            modules: ["HCM"],                        durée: `${w(4)}–${w(6)} semaines` },
    consultant: { titre: "Couvrir les 6 modules SAP (vision large)",              modules: ["FI", "CO", "MM", "SD", "HCM", "PP"], durée: `${w(6)}–${w(10)} semaines` },
  };

  const coreInfo = phaseCorePath[profilCible] || phaseCorePath.finance;
  const modsDejaConnus = coreInfo.modules.filter(m => modules.has(m.toLowerCase()));
  const skipCore = estConfirme && modsDejaConnus.length === coreInfo.modules.length;

  if (!skipCore) {
    const bullets: Record<string, string[]> = {
      finance: [
        modules.has("fi") ? "Tu connais déjà FI — consolide les points avancés : CO-PA, closing, interco." : "Étudier FI en profondeur : GL (comptes, pièces comptables), AP (factures/paiements fournisseurs), AR (facturation client), AA (immobilisations).",
        "Comprendre le Universal Journal : une seule table ACDOCA qui unifie FI, CO et AA.",
        domaineFi ? "Tu traduis facilement tes connaissances comptables en transactions SAP — avantage décisif." : "Apprendre les bases comptables indispensables : débit/crédit, bilan vs P&L, clôture mensuelle.",
        "Maîtriser les T-codes essentiels : FB50, FB60, FB70, F110, FBL3N, F.05, S_ALR_87012284.",
        "Utiliser le simulateur de certification FI sur HanaFlow pour tester tes connaissances.",
      ],
      supply: [
        modules.has("mm") ? "Tu connais MM — approfondi l'intégration avec FI (GR/IR, 3-way match)." : "Étudier MM : données maître articles/fournisseurs, cycle P2P complet (PR→PO→GR→IV→Paiement).",
        "Comprendre l'intégration MM-FI : comment chaque entrée marchandise génère une écriture comptable.",
        "Explorer les MRP (planification des besoins) et les stratégies d'approvisionnement.",
        "Pratiquer les scénarios P2P en sandbox : créer une commande, réceptionner, vérifier la facture.",
      ],
      sales: [
        modules.has("sd") ? "Tu connais SD — approfondi les intégrations SD-FI et les analytics O2C." : "Étudier SD : master data client, documents de vente, livraisons, facturation client.",
        "Maîtriser le cycle O2C complet (VA01→VL01N→VF01→F-28) et l'intégration SD-FI automatique.",
        "Comprendre le pricing SAP (conditions, remises, taxes) et les stratégies de distribution.",
        "Explorer les dashboards de performance commerciale via Fiori et CO-PA.",
      ],
      tech: [
        "Couvrir tous les modules HanaFlow pour avoir une vision fonctionnelle globale (FI, CO, MM, SD, HCM, PP).",
        "Comprendre les processus P2P, O2C et R2R — tu ne peux pas concevoir des solutions techniques sans comprendre les flux métier.",
        "Explorer SAP BTP : extensions, API, intégrations, events — la plateforme technique de S/4HANA.",
        domaineIT ? "Tes bases SI/dev te permettent d'aller vite — focus sur les spécificités SAP (ABAP, CDS views, RAP)." : "Acquérir les bases de programmation ABAP ou au moins comprendre les patterns d'extension.",
      ],
      hcm: [
        "Étudier HCM : gestion administrative, paie, temps et absences, formation.",
        "Comprendre l'intégration HCM-FI : comptabilisation des salaires, centres de coût RH.",
        "Explorer SuccessFactors (la solution cloud RH de SAP) et son intégration avec S/4HANA.",
        "Pratiquer les schémas de paie et les cycles de traitement HCM.",
      ],
      consultant: [
        "Commencer par FI + CO (finance) puis MM + SD (supply/sales) : les 4 modules les plus demandés.",
        "Comprendre les intégrations : P2P (MM-FI), O2C (SD-FI), et le contrôle de gestion (CO-FI).",
        "Développer une vision des processus end-to-end : savoir expliquer un flux complet à un client.",
        "Se différencier par une spécialisation secondaire (ex: FI + CO pour le conseil finance).",
      ],
    };

    phases.push({
      num: phases.length + 1,
      titre: coreInfo.titre,
      durée: estNotion ? `${w(2)}–${w(4)} semaines (consolidation)` : coreInfo.durée,
      couleur: "blue",
      bullets: bullets[profilCible] || bullets.finance,
      ressources: [
        ...(["finance", "consultant"].includes(profilCible) ? [{ label: "Module SAP FI", path: "/modules-sap/fi" }] : []),
        ...(["finance", "consultant"].includes(profilCible) ? [{ label: "Module SAP CO", path: "/modules-sap/co" }] : []),
        ...(["supply", "consultant"].includes(profilCible) ? [{ label: "Module SAP MM", path: "/modules-sap/mm" }] : []),
        ...(["sales", "consultant"].includes(profilCible) ? [{ label: "Module SAP SD", path: "/modules-sap/sd" }] : []),
        ...(["hcm", "consultant"].includes(profilCible) ? [{ label: "Module SAP HCM", path: "/modules-sap/hcm" }] : []),
        { label: "Processus métier P2P / O2C", path: "/processus-metier" },
      ],
      conseil: profilCible === "finance" ? "Le simulateur de certification FI sur HanaFlow te permet de tester tes connaissances dès maintenant." : "Crée un compte gratuit HanaFlow pour suivre ta progression sur chaque module.",
    });
  }

  // ─ PHASE 2 : Spécialisation & intégration ───────────────────────
  const phase2Bullets = (() => {
    if (profilCible === "finance") return [
      "Approfondir CO : centres de coût, centres de profit, CO-PA (comptabilité analytique).",
      "Maîtriser l'intégration FI-CO : comment chaque pièce FI impacte le controlling en temps réel.",
      "Comprendre la clôture mensuelle SAP : ordre des traitements (MMPV → AFAB → F.05 → OB52).",
      expertMetier ? "Avec ton expérience, tu peux rapidement prendre en charge des ateliers de design FI/CO." : "Travailler des cas pratiques : clôture mensuelle simulée, analyse de marge, reporting financier.",
    ];
    if (profilCible === "supply") return [
      "Étudier PP (Production Planning) : ordres de fabrication, BOM, routings, MRP.",
      "Maîtriser l'intégration MM-PP-CO : coûts de production, écarts de fabrication.",
      "Comprendre la gestion des stocks avancée : lots, FIFO/LIFO, inventaire tournant.",
      expertMetier ? "Capitalise sur ta connaissance des flux industriels pour challenger les paramétrages SAP." : "Pratiquer des scénarios end-to-end : de la commande d'achat à la livraison client.",
    ];
    if (profilCible === "sales") return [
      "Approfondir CO-PA : analyse de la rentabilité par client, produit, région.",
      "Maîtriser les intégrations SD-FI-CO : revenus, coûts de ventes, marges.",
      "Explorer SAP CX (Customer Experience) : Sales Cloud, Service Cloud.",
      "Comprendre les processus de retours et avoirs : garanties, SAV, gestion des litiges.",
    ];
    if (profilCible === "tech") return [
      "Se spécialiser sur SAP BTP : créer des applications Fiori, gérer des intégrations API.",
      "Comprendre ABAP Objects et le modèle RAP (Restful ABAP Programming).",
      "Explorer les CDS Views pour exposer les données S/4HANA à des outils analytics externes.",
      domaineIT ? "Construire un premier POC d'intégration SAP ↔ système externe (n8n, Python, REST API)." : "Obtenir un accès à un système de développement SAP (SAP BTP free trial).",
    ];
    if (profilCible === "hcm") return [
      "Approfondir la paie : schémas de calcul, règles de paie, déclarations sociales.",
      "Explorer SuccessFactors : recrutement, gestion des performances, learning.",
      "Comprendre l'intégration HCM-FI : comptabilisation des charges salariales.",
      "Se familiariser avec les spécificités légales (France) : DSN, URSSAF, DADS.",
    ];
    return [
      "Choisir 2 modules principaux à approfondir (ex: FI+CO ou MM+SD).",
      "Développer une compétence d'animateur d'ateliers : savoir animer un workshop de collecte de besoins.",
      "Pratiquer la rédaction de spécifications fonctionnelles et de cas de test UAT.",
      "Se différencier par une expertise sectorielle (industrie, retail, services publics).",
    ];
  })();

  phases.push({
    num: phases.length + 1,
    titre: "Spécialisation & intégrations inter-modules",
    durée: `${w(3)}–${w(5)} semaines`,
    couleur: "indigo",
    bullets: phase2Bullets,
    ressources: [
      { label: "S/4HANA — architecture et nouveautés", path: "/s4hana" },
      { label: "IA & Joule dans SAP", path: "/ai-joule" },
    ],
    conseil: objectif === "projet" ? "Si tu travailles sur un projet en cours, applique immédiatement chaque concept appris à ton contexte projet." : "Cherche des cas pratiques : forums SAP Community, contenus YouTube de consultants expérimentés.",
  });

  // ─ PHASE 3 : Projet réel / Expérience terrain ───────────────────
  if (!estConfirme || objectif !== "certification") {
    const phase3BaseBullets = [
      "Participer à un projet SAP réel (déploiement, migration S/4HANA, optimisation d'un processus).",
      "Si pas encore de projet : créer un cas d'usage fictif complet (ex: simuler une clôture mensuelle de bout en bout).",
    ];
    const phase3Bullets = (() => {
      if (contexte === "etudiant")    return [...phase3BaseBullets, "Rechercher activement un stage ou une alternance chez un intégrateur SAP (Capgemini, Accenture, Sopra, Atos, CGI, etc.).", "Mentionner HanaFlow sur ton CV comme démarche d'autoformation SAP."];
      if (contexte === "alternant")   return [...phase3BaseBullets, "Profiter de l'alternance pour demander à participer aux ateliers et tests UAT sur le projet SAP de ton entreprise.", "Documenter tes apprentissages : chaque paramétrage, chaque transaction maîtrisée."];
      if (contexte === "salarie")     return [...phase3BaseBullets, "Proposer d'intervenir sur le projet SAP interne (si existant) en tant que référent fonctionnel de ton équipe.", "Valoriser la certification en interne — c'est un argument pour une mobilité ou une revalorisation."];
      if (contexte === "en_recherche") return [...phase3BaseBullets, "Cibler les offres de consultant SAP junior / fonctionnel SAP sur LinkedIn, Indeed, APEC.", "Préparer des réponses précises aux questions d'entretien SAP : transactions, processus, projets simulés."];
      return phase3BaseBullets;
    })();

    phases.push({
      num: phases.length + 1,
      titre: "Mise en pratique — Projet réel ou simulation",
      durée: `${w(4)}–${w(8)} semaines (continu)`,
      couleur: "emerald",
      bullets: phase3Bullets,
      ressources: [
        { label: "Simulateur de certification FI", path: "/certifications/fi" },
        { label: "Roadmap consultant", path: "/roadmap" },
      ],
      conseil: experience === "etudiant" ? "Les intégrateurs SAP (Capgemini, Sopra Steria, Accenture...) recrutent régulièrement des profils juniors avec certification." : "La certification SAP multiplie ta visibilité sur LinkedIn — recruteurs et chasseurs de tête la recherchent.",
    });
  }

  // ─ PHASE 4 : Certification ───────────────────────────────────────
  const certifMap: Record<string, Certif> = {
    finance:    { code: "C_TS4FI_2023", nom: "SAP Certified Associate – Financial Accounting",                       dispo: true },
    supply:     { code: "C_TS4MM_2023", nom: "SAP Certified Associate – Materials Management",                       dispo: false },
    sales:      { code: "C_TS4SD_2023", nom: "SAP Certified Associate – Sales & Distribution",                       dispo: false },
    tech:       { code: "C_BTP_2408",   nom: "SAP Certified Associate – SAP BTP",                                    dispo: false },
    hcm:        { code: "C_THR12_2311", nom: "SAP Certified Associate – HCM",                                        dispo: false },
    consultant: { code: "C_TS4FI_2023", nom: "SAP Certified Associate – Financial Accounting (recommandé en 1er)",   dispo: true },
  };
  const certif = certifMap[profilCible] || certifMap.finance;

  phases.push({
    num: phases.length + 1,
    titre: `Certification officielle SAP — ${certif.code}`,
    durée: `${w(2)}–${w(4)} semaines de préparation`,
    couleur: "amber",
    bullets: [
      `Viser la certification ${certif.code} : ${certif.nom}.`,
      "Format de l'examen officiel : 80 questions à choix multiple, 180 minutes, seuil de réussite à 65%.",
      certif.dispo ? "Utiliser le simulateur HanaFlow : 40 questions avec explications détaillées, résultats par chapitre." : "Le simulateur pour cette certification sera bientôt disponible sur HanaFlow.",
      "S'inscrire à l'examen sur SAP Certification Hub (environ 500€ le voucher — sans formation obligatoire).",
      objectif === "premier_emploi" ? "La certification sur le CV + HanaFlow dans la section formations = profil qui sort du lot pour un recruteur SAP." : "La certification valide officiellement ton expertise auprès de tes clients et de ton employeur.",
    ],
    ressources: certif.dispo ? [
      { label: `Préparer ${certif.code} sur HanaFlow`, path: "/certifications/fi" },
      { label: "Liste des certifications SAP", path: "/certifications" },
    ] : [
      { label: "Liste des certifications SAP", path: "/certifications" },
    ],
    conseil: "Passe d'abord plusieurs fois le simulateur HanaFlow jusqu'à dépasser régulièrement 75%. C'est un indicateur fiable de ta préparation pour le vrai examen.",
  });

  // ─ Tips carrière selon contexte & objectif ──────────────────────
  const careerTips: string[] = [];
  if (objectif === "premier_emploi" || contexte === "en_recherche") {
    careerTips.push(
      "Mentionner HanaFlow et la certification SAP dans la section Formations de ton CV.",
      "Sur LinkedIn : ajouter les compétences SAP FI, SAP S/4HANA, ERP. Les recruteurs utilisent ces mots-clés.",
      "Cibler les intégrateurs SAP pour un premier poste : Capgemini, Accenture, Sopra Steria, Atos, CGI, IBM, Deloitte.",
      "Préparer 3 exemples concrets d'utilisation SAP à raconter en entretien (même fictifs via simulateur)."
    );
  }
  if (objectif === "reconversion") {
    careerTips.push(
      "Valorise ton expérience métier : un comptable qui apprend SAP FI est beaucoup plus crédible qu'un technicien.",
      "Les cabinets cherchent des profils avec 'double compétence' : métier + SAP — c'est exactement ton profil cible.",
      "Envisager une formation certifiante reconnue (RNCP) ou un parcours en bootcamp SAP (2-3 mois) pour accélérer."
    );
  }
  if (objectif === "evolution" && contexte === "salarie") {
    careerTips.push(
      "Propose-toi comme référent SAP de ton équipe — sans titre, juste en rendant service.",
      "La certification SAP est un argument concret pour une négociation salariale ou une promotion.",
      "Développe une deuxième expertise : FI + CO, ou FI + S/4HANA migration — double compétence = double valeur."
    );
  }

  return { intro, phases, certif, careerTips };
}

// ═══════════════════════════════════════════════════════════════════
// COMPOSANTS UI
// ═══════════════════════════════════════════════════════════════════

const colorClasses: Record<string, { card: string; badge: string; dot: string; num: string }> = {
  blue:    { card: "border-blue-400 bg-blue-50 dark:bg-blue-900/20",       badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",       dot: "bg-blue-500",    num: "bg-blue-600 text-white" },
  indigo:  { card: "border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20", badge: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300", dot: "bg-indigo-500",  num: "bg-indigo-600 text-white" },
  emerald: { card: "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20", badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300", dot: "bg-emerald-500", num: "bg-emerald-600 text-white" },
  amber:   { card: "border-amber-400 bg-amber-50 dark:bg-amber-900/20",    badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",    dot: "bg-amber-500",   num: "bg-amber-600 text-white" },
  slate:   { card: "border-slate-400 bg-slate-50 dark:bg-slate-800",       badge: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300",       dot: "bg-slate-500",   num: "bg-slate-600 text-white" },
};

const profilColorMap: Record<string, string> = {
  blue:    "border-blue-400 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700",
  amber:   "border-amber-400 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-700",
  purple:  "border-purple-400 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-700",
  emerald: "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-700",
  rose:    "border-rose-400 bg-rose-50 dark:bg-rose-900/20 dark:border-rose-700",
  indigo:  "border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 dark:border-indigo-700",
};

function SelectCard({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all text-sm ${
        selected
          ? "border-sap-blue bg-sap-blue/10 dark:bg-sap-blue/20 text-sap-blue dark:text-sap-accent"
          : "border-gray-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-sap-blue/50 hover:bg-gray-50 dark:hover:bg-slate-700/50"
      }`}
    >
      {children}
    </button>
  );
}

function Step1({ form, setForm }: { form: FormData; setForm: React.Dispatch<React.SetStateAction<FormData>> }) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-bold text-slate-800 dark:text-white mb-3">Quel est ton niveau actuel en SAP ?</p>
        <div className="grid sm:grid-cols-2 gap-2">
          {NIVEAUX_SAP.map((n) => (
            <SelectCard key={n.key} selected={form.niveauSAP === n.key} onClick={() => setForm(f => ({ ...f, niveauSAP: n.key }))}>
              <span className="flex items-center gap-2 mb-0.5">
                <span className="h-5 w-5 flex items-center justify-center flex-shrink-0">{n.icon}</span>
                <span className="font-semibold">{n.label}</span>
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 ml-6">{n.desc}</p>
            </SelectCard>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-bold text-slate-800 dark:text-white mb-3">Quelle est ton expérience professionnelle ?</p>
        <div className="grid sm:grid-cols-2 gap-2">
          {EXPERIENCES.map((e) => (
            <SelectCard key={e.key} selected={form.experience === e.key} onClick={() => setForm(f => ({ ...f, experience: e.key }))}>
              <span className="font-semibold block">{e.label}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">{e.desc}</span>
            </SelectCard>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-bold text-slate-800 dark:text-white mb-3">Ton domaine de formation / expertise :</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {DOMAINES.map((d) => (
            <SelectCard key={d.key} selected={form.domaine === d.key} onClick={() => setForm(f => ({ ...f, domaine: d.key }))}>
              <span className="h-8 w-8 rounded-lg bg-sap-blue/10 text-sap-blue dark:text-blue-300 flex items-center justify-center mb-2">{d.icon}</span>
              <span className="font-medium text-xs">{d.label}</span>
            </SelectCard>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-bold text-slate-800 dark:text-white mb-3">Ta situation actuelle :</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {CONTEXTES.map((c) => (
            <SelectCard key={c.key} selected={form.contexte === c.key} onClick={() => setForm(f => ({ ...f, contexte: c.key }))}>
              <span className="font-medium text-xs">{c.label}</span>
            </SelectCard>
          ))}
        </div>
      </div>
    </div>
  );
}

function Step2({ form, setForm }: { form: FormData; setForm: React.Dispatch<React.SetStateAction<FormData>> }) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-bold text-slate-800 dark:text-white mb-3">Dans quel domaine SAP veux-tu évoluer ?</p>
        <div className="grid sm:grid-cols-2 gap-2">
          {PROFILS_CIBLES.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => setForm(f => ({ ...f, profilCible: p.key }))}
              className={`text-left p-4 rounded-xl border-2 transition-all ${
                form.profilCible === p.key
                  ? profilColorMap[p.color] + " border-opacity-100"
                  : "border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:bg-slate-700/50"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="h-6 w-6 flex items-center justify-center flex-shrink-0 text-slate-600 dark:text-slate-300">{p.icon}</span>
                <span className="font-semibold text-sm text-slate-900 dark:text-white">{p.label}</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 ml-8">{p.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-bold text-slate-800 dark:text-white mb-3">Quel est ton objectif principal ?</p>
        <div className="grid sm:grid-cols-2 gap-2">
          {OBJECTIFS.map((o) => (
            <SelectCard key={o.key} selected={form.objectif === o.key} onClick={() => setForm(f => ({ ...f, objectif: o.key }))}>
              <span className="flex items-center gap-2">
                <span className="h-5 w-5 flex items-center justify-center flex-shrink-0">{o.icon}</span>
                <span className="font-semibold text-sm">{o.label}</span>
              </span>
            </SelectCard>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-bold text-slate-800 dark:text-white mb-3">Combien de temps peux-tu consacrer à la formation ?</p>
        <div className="grid sm:grid-cols-3 gap-2">
          {DISPONIBILITES.map((d) => (
            <SelectCard key={d.key} selected={form.disponibilite === d.key} onClick={() => setForm(f => ({ ...f, disponibilite: d.key }))}>
              <span className="font-bold block text-sm">{d.label}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">{d.desc}</span>
            </SelectCard>
          ))}
        </div>
      </div>
    </div>
  );
}

function Step3({ form, setForm }: { form: FormData; setForm: React.Dispatch<React.SetStateAction<FormData>> }) {
  const toggle = (key: string) => {
    const set = new Set(form.modulesConnus);
    set.has(key) ? set.delete(key) : set.add(key);
    setForm(f => ({ ...f, modulesConnus: [...set] }));
  };

  const modColors: Record<string, string> = {
    blue: "text-blue-600", indigo: "text-indigo-500", emerald: "text-emerald-600",
    amber: "text-amber-500", purple: "text-purple-600", rose: "text-rose-500",
    violet: "text-violet-600", cyan: "text-cyan-600",
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-bold text-slate-800 dark:text-white mb-1">Quels modules SAP connais-tu déjà ?</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Sélectionne ceux que tu maîtrises (même partiellement). Laisse vide si tu démarres de zéro.</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {MODULES_DISPOS.map((m) => {
            const isSelected = form.modulesConnus.includes(m.key);
            return (
              <button
                key={m.key}
                type="button"
                onClick={() => toggle(m.key)}
                className={`px-3 py-3 rounded-xl border-2 transition-all text-center ${
                  isSelected
                    ? "border-sap-blue bg-sap-blue/10 dark:bg-sap-blue/20"
                    : "border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:bg-slate-700/50"
                }`}
              >
                <span className={`text-lg font-black block ${isSelected ? "text-sap-blue dark:text-sap-accent" : modColors[m.color]}`}>{m.label}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5 leading-tight">{m.name}</span>
                {isSelected && <span className="text-xs text-sap-blue dark:text-sap-accent font-semibold">✓ Connu</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-slate-700/30 rounded-xl p-4 border border-gray-200 dark:border-slate-700">
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Récapitulatif de ton profil</p>
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
          {[
            { label: "Niveau SAP",      val: NIVEAUX_SAP.find(n => n.key === form.niveauSAP)?.label },
            { label: "Expérience",      val: EXPERIENCES.find(e => e.key === form.experience)?.label },
            { label: "Domaine",         val: DOMAINES.find(d => d.key === form.domaine)?.label },
            { label: "Situation",       val: CONTEXTES.find(c => c.key === form.contexte)?.label },
            { label: "Profil cible",    val: PROFILS_CIBLES.find(p => p.key === form.profilCible)?.label },
            { label: "Objectif",        val: OBJECTIFS.find(o => o.key === form.objectif)?.label },
            { label: "Dispo",           val: DISPONIBILITES.find(d => d.key === form.disponibilite)?.label },
            { label: "Modules connus",  val: form.modulesConnus.length > 0 ? form.modulesConnus.map(m => m.toUpperCase()).join(", ") : "Aucun" },
          ].map(({ label, val }) => val ? (
            <div key={label} className="flex flex-col">
              <span className="text-slate-400 dark:text-slate-500">{label}</span>
              <span className="font-semibold">{val}</span>
            </div>
          ) : null)}
        </div>
      </div>
    </div>
  );
}

function RoadmapResult({ roadmap }: { roadmap: RoadmapData }) {
  const { intro, phases, certif, careerTips } = roadmap;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="bg-linear-to-r from-sap-blue to-blue-600 text-white rounded-2xl p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-white/70 mb-2">Ta roadmap personnalisée</p>
        <p className="text-base leading-relaxed">{intro}</p>
      </div>

      <div className="space-y-4">
        {phases.map((phase, i) => {
          const col = colorClasses[phase.couleur] || colorClasses.slate;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.08 }}
              className={`rounded-2xl border-2 p-5 ${col.card}`}
            >
              <div className="flex items-start gap-4">
                <div className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0 mt-0.5 shadow-sm ${col.num}`}>
                  {phase.num}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">{phase.titre}</h3>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${col.badge}`}>
                      ⏱ {phase.durée}
                    </span>
                  </div>
                  <ul className="space-y-2 mb-3">
                    {phase.bullets.map((b, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-200">
                        <span className={`h-1.5 w-1.5 rounded-full flex-shrink-0 mt-2 ${col.dot}`} />
                        {b}
                      </li>
                    ))}
                  </ul>
                  {phase.ressources?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {phase.ressources.map((r) => (
                        <Link key={r.path} href={r.path} className="inline-flex items-center gap-1 text-xs font-semibold text-sap-blue dark:text-sap-accent bg-white dark:bg-slate-800 border border-sap-blue/30 dark:border-sap-accent/30 px-2.5 py-1 rounded-lg hover:bg-sap-blue/10 transition-colors">
                          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                          {r.label}
                        </Link>
                      ))}
                    </div>
                  )}
                  {phase.conseil && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 italic border-l-2 border-current pl-2 mt-2">
                      {phase.conseil}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {careerTips.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-5">
          <h3 className="font-bold text-slate-900 dark:text-white mb-3">Conseils pour ta carrière SAP</h3>
          <ul className="space-y-2">
            {careerTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-200">
                <span className="text-sap-blue flex-shrink-0 mt-0.5">→</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {certif.dispo && (
        <div className="bg-linear-to-r from-sap-blue-dark to-sap-blue rounded-2xl p-5 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="font-bold">{certif.code} disponible sur HanaFlow</p>
            <p className="text-sm text-white/80 mt-0.5">7 chapitres, 40 questions de simulateur, format examen officiel</p>
          </div>
          <Link href="/certifications/fi" className="flex-shrink-0 px-5 py-2.5 bg-white text-sap-blue rounded-xl font-bold text-sm hover:bg-white/90 transition-colors">
            Commencer la préparation →
          </Link>
        </div>
      )}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// PAGE PRINCIPALE
// ═══════════════════════════════════════════════════════════════════

const FORM_INIT: FormData = {
  niveauSAP:     "",
  experience:    "",
  domaine:       "",
  contexte:      "",
  profilCible:   "",
  objectif:      "",
  disponibilite: "",
  modulesConnus: [],
};

const STEPS = [
  { label: "Ton profil",      short: "Profil" },
  { label: "Tes objectifs",   short: "Objectifs" },
  { label: "Ce que tu sais",  short: "Connaissances" },
];

function stepIsValid(step: number, form: FormData): boolean {
  if (step === 0) return !!(form.niveauSAP && form.experience && form.domaine && form.contexte);
  if (step === 1) return !!(form.profilCible && form.objectif && form.disponibilite);
  return true;
}

export default function RoadmapPage() {
  const [step, setStep]       = useState(0);
  const [form, setForm]       = useState<FormData>(FORM_INIT);
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);

  const handleGenerate = () => {
    setStep(3);
    setTimeout(() => {
      const result = genererRoadmap(form);
      setRoadmap(result);
      setStep(4);
    }, 1400);
  };

  const handleReset = () => {
    setStep(0);
    setForm(FORM_INIT);
    setRoadmap(null);
  };

  return (
    <PageLayout
      label="Roadmap"
      title="Roadmap consultant SAP personnalisée"
      description="Réponds à quelques questions sur ton profil et obtiens une roadmap sur-mesure — adaptée à ton niveau, tes objectifs et ta disponibilité."
      gradient="from-slate-900 via-sap-blue-dark to-sap-blue"
      badge="Personnalisée · Tous niveaux · Tous profils"
    >
      {step < 4 ? (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-200 dark:border-slate-700 overflow-hidden">
          {step < 3 && (
            <div className="px-6 pt-6 pb-4 border-b border-gray-100 dark:border-slate-700">
              <div className="flex items-center gap-0">
                {STEPS.map((s, i) => (
                  <div key={i} className="flex items-center flex-1 last:flex-none">
                    <div className={`flex items-center gap-2 ${i <= step ? "text-sap-blue dark:text-sap-accent" : "text-slate-400 dark:text-slate-500"}`}>
                      <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        i < step  ? "bg-sap-blue text-white" :
                        i === step ? "bg-sap-blue/20 text-sap-blue border-2 border-sap-blue" :
                        "bg-gray-100 dark:bg-slate-700 text-slate-400"
                      }`}>
                        {i < step ? "✓" : i + 1}
                      </div>
                      <span className={`text-xs font-semibold hidden sm:block ${i === step ? "" : "opacity-60"}`}>{s.label}</span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-2 rounded-full ${i < step ? "bg-sap-blue" : "bg-gray-100 dark:bg-slate-700"}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="p-6">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Étape 1 — Qui es-tu ?</p>
                  <Step1 form={form} setForm={setForm} />
                </motion.div>
              )}
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Étape 2 — Où veux-tu aller ?</p>
                  <Step2 form={form} setForm={setForm} />
                </motion.div>
              )}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Étape 3 — Ce que tu maîtrises déjà</p>
                  <Step3 form={form} setForm={setForm} />
                </motion.div>
              )}
              {step === 3 && (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-16 text-center">
                  <div className="flex justify-center mb-6">
                    <div className="h-16 w-16 rounded-full border-4 border-sap-blue/20 border-t-sap-blue animate-spin" />
                  </div>
                  <p className="text-lg font-bold text-slate-900 dark:text-white mb-2">Génération de ta roadmap…</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Analyse de ton profil et personnalisation des étapes</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {step < 3 && (
            <div className="px-6 pb-6 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(s => Math.max(0, s - 1))}
                disabled={step === 0}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-40 transition-colors"
              >
                ← Retour
              </button>
              <span className="text-xs text-slate-400">{step + 1} / {STEPS.length}</span>
              {step < 2 ? (
                <button
                  type="button"
                  onClick={() => setStep(s => s + 1)}
                  disabled={!stepIsValid(step, form)}
                  className="px-5 py-2 rounded-xl text-sm font-bold bg-sap-blue text-white hover:bg-sap-blue-dark disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Suivant →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={!stepIsValid(0, form) || !stepIsValid(1, form)}
                  className="px-5 py-2 rounded-xl text-sm font-bold bg-sap-blue text-white hover:bg-sap-blue-dark disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Générer ma roadmap
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Ta roadmap personnalisée</h2>
            <button
              onClick={handleReset}
              className="text-sm text-sap-blue dark:text-sap-accent hover:underline font-semibold"
            >
              ↺ Recommencer
            </button>
          </div>
          {roadmap && <RoadmapResult roadmap={roadmap} />}
        </div>
      )}
    </PageLayout>
  );
}
