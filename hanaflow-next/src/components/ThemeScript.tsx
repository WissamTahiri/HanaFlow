// Script injecté dans <head> avant le premier rendu pour éviter le flash de mauvais thème
export function ThemeScript() {
  const script = `
    (function() {
      try {
        var pref = localStorage.getItem('hanaflow-theme');
        var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (pref === 'dark' || (!pref && prefersDark)) {
          document.documentElement.classList.add('dark');
        }
      } catch(e) {}
    })();
  `;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
