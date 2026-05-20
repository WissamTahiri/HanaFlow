# scripts/

## `install-darwin-arm64-natives.sh`

Installe à la main les binaires natifs macOS arm64 manquants dans `node_modules`
(rollup, esbuild, sharp, lightningcss, oxide, swc) sans rerouler tout
`npm install`.

**Quand l'utiliser :**

- tu as cloné ou récupéré un `node_modules` figé sur une autre plateforme
  (typiquement Windows ou Linux) et tu es maintenant sur Mac Apple Silicon
- `npm install` échoue à cause de permissions (share root-owned, sticky bit
  sur le dossier `node_modules`, etc.)
- tu vois une erreur du genre :
    * `Cannot find module '@rollup/rollup-darwin-arm64'`
    * `You installed esbuild for another platform`
    * `Cannot find @img/sharp-darwin-arm64`

**Utilisation :**

```bash
npm run fix:natives
```

Pour reproduire sur un autre arch, copie le script et remplace `darwin-arm64`
par `linux-x64`, `linux-arm64`, `darwin-x64`, etc. — la structure des paquets
est la même.
