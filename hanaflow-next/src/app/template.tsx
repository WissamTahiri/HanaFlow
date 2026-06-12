/**
 * Template racine : remonté à CHAQUE navigation (contrairement au layout),
 * ce qui rejoue l'animation d'entrée .page-transition (fade + slide 300 ms,
 * désactivée par prefers-reduced-motion dans globals.css).
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-transition">{children}</div>;
}
