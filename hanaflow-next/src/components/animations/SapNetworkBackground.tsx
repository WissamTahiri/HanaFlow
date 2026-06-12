"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Fond animé du hero : les 6 modules SAP en nœuds interconnectés, avec des
 * impulsions lumineuses qui circulent le long des intégrations réelles
 * (FI↔CO Universal Journal, MM→FI facture MIRO, SD→FI facturation, etc.).
 *
 * Canvas 2D + requestAnimationFrame, ~0 allocation par frame. Désactivé si
 * prefers-reduced-motion. pointer-events: none — ne bloque jamais les CTA.
 */

const MODULES = [
  { label: "FI", color: "#60a5fa" }, // blue-400 (lisible sur fond sombre)
  { label: "CO", color: "#a78bfa" }, // violet-400
  { label: "MM", color: "#34d399" }, // emerald-400
  { label: "SD", color: "#fbbf24" }, // amber-400
  { label: "PP", color: "#f87171" }, // red-400
  { label: "AI", color: "#22d3ee" }, // cyan-400
];

// Intégrations SAP réelles (indices dans MODULES)
const CONNECTIONS: Array<[number, number]> = [
  [0, 1], // FI ↔ CO — Universal Journal
  [0, 2], // FI ↔ MM — P2P (MIRO → FI-AP)
  [0, 3], // FI ↔ SD — O2C (facturation → FI-AR)
  [2, 3], // MM ↔ SD — stock
  [2, 4], // MM ↔ PP — MRP
  [1, 4], // CO ↔ PP — ordres de fabrication
  [5, 0], // AI ↔ FI — Joule Finance
  [5, 3], // AI ↔ SD — Joule ventes
];

type Node = { x: number; y: number; vx: number; vy: number; pulse: number };
type Beam = { conn: number; progress: number; speed: number };

export default function SapNetworkBackground({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Positions initiales en fraction du canvas (déployées, pas alignées)
    const SEEDS: Array<[number, number]> = [
      [0.18, 0.30], [0.42, 0.16], [0.14, 0.72],
      [0.62, 0.62], [0.40, 0.84], [0.80, 0.30],
    ];
    const nodes: Node[] = SEEDS.map(([fx, fy], i) => ({
      x: fx, y: fy,
      vx: (i % 2 === 0 ? 1 : -1) * 0.00006,
      vy: (i % 3 === 0 ? -1 : 1) * 0.00005,
      pulse: i * 1.1,
    }));
    const beams: Beam[] = CONNECTIONS.map((_, i) => ({
      conn: i,
      progress: (i * 0.37) % 1,
      speed: 0.0018 + (i % 3) * 0.0007,
    }));

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const FONT = "bold 11px ui-sans-serif, system-ui, sans-serif";

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);

      // Dérive lente + rebond aux bords (en coordonnées fractionnaires)
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0.06 || n.x > 0.94) n.vx *= -1;
        if (n.y < 0.10 || n.y > 0.90) n.vy *= -1;
      }

      // Connexions
      ctx.lineWidth = 1;
      for (const [a, b] of CONNECTIONS) {
        ctx.strokeStyle = "rgba(148, 197, 253, 0.16)";
        ctx.beginPath();
        ctx.moveTo(nodes[a].x * width, nodes[a].y * height);
        ctx.lineTo(nodes[b].x * width, nodes[b].y * height);
        ctx.stroke();
      }

      // Impulsions lumineuses le long des connexions
      for (const beam of beams) {
        beam.progress += beam.speed;
        if (beam.progress > 1) beam.progress = 0;
        const [a, b] = CONNECTIONS[beam.conn];
        const x = nodes[a].x * width + (nodes[b].x - nodes[a].x) * width * beam.progress;
        const y = nodes[a].y * height + (nodes[b].y - nodes[a].y) * height * beam.progress;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, 7);
        grad.addColorStop(0, "rgba(125, 211, 252, 0.85)");
        grad.addColorStop(1, "rgba(125, 211, 252, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, 7, 0, Math.PI * 2);
        ctx.fill();
      }

      // Nœuds modules
      ctx.font = FONT;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const m = MODULES[i];
        const x = n.x * width;
        const y = n.y * height;
        const pulse = 1 + 0.05 * Math.sin(t / 900 + n.pulse);
        const r = 16 * pulse;

        // halo
        const halo = ctx.createRadialGradient(x, y, r * 0.4, x, y, r * 2.2);
        halo.addColorStop(0, `${m.color}33`);
        halo.addColorStop(1, `${m.color}00`);
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(x, y, r * 2.2, 0, Math.PI * 2);
        ctx.fill();

        // disque
        ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
        ctx.strokeStyle = m.color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // label
        ctx.fillStyle = m.color;
        ctx.fillText(m.label, x, y + 0.5);
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`absolute inset-0 w-full h-full pointer-events-none opacity-60 ${className}`}
    />
  );
}
