#!/bin/bash
# Installe les binaires natifs macOS arm64 (esbuild, sharp, oxide, swc, rollup,
# lightningcss, …) sans passer par `npm install`.
#
# Quand utiliser ce script :
#  - tu clones le repo sur Mac alors qu'un `node_modules` était figé sur Windows
#    (ou Linux, ou simplement un autre archi)
#  - `npm install` plante à cause de perms (share root-owned, sticky bit, etc.)
#  - tu veux juste réparer les binaires manquants sans reconstruire tout
#    node_modules
#
# Comment ça marche : pour chaque paquet, on télécharge le `.tgz` via `npm pack`
# (pas besoin de mutate node_modules) et on l'extrait dans le bon sous-dossier.
# Les autres dépendances JS pures restent inchangées.
#
# Le script lit les versions depuis package.json + les .package-lock pour ne
# jamais sortir des versions installées.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
NM="$ROOT/node_modules"

if [ ! -d "$NM" ]; then
  echo "✗ node_modules absent — fais d'abord 'npm install'"
  exit 1
fi

read_version() {
  local pkg="$1"
  if [ -f "$NM/$pkg/package.json" ]; then
    node -p "require('$NM/$pkg/package.json').version" 2>/dev/null
  fi
}

install_native() {
  local spec="$1"
  local target_subdir="$2"
  local work
  work=$(mktemp -d)
  (
    cd "$work"
    npm pack "$spec" --silent >/dev/null
    local tgz
    tgz=$(ls *.tgz | head -1)
    mkdir -p pkg
    tar -xzf "$tgz" -C pkg
    mkdir -p "$NM/$target_subdir"
    cp -R pkg/package/. "$NM/$target_subdir/"
  )
  rm -rf "$work"
  echo "  ✓ $spec"
}

ROLLUP_VER=$(read_version rollup || echo "")
ESBUILD_VER=$(read_version esbuild || echo "")
SHARP_VER=$(read_version sharp || echo "")
LIBVIPS_VER=$(read_version @img/sharp-libvips-darwin-arm64 || echo "1.2.3")
OXIDE_VER=$(read_version @tailwindcss/oxide-win32-x64-msvc || read_version @tailwindcss/oxide || echo "")
NEXT_VER=$(read_version next || echo "")
LIGHTNINGCSS_VER=$(read_version lightningcss || echo "")

echo "→ Installation des binaires natifs darwin-arm64…"
[ -n "$ROLLUP_VER" ]       && install_native "@rollup/rollup-darwin-arm64@$ROLLUP_VER"       "@rollup/rollup-darwin-arm64"
[ -n "$ESBUILD_VER" ]      && install_native "@esbuild/darwin-arm64@$ESBUILD_VER"           "@esbuild/darwin-arm64"
[ -n "$SHARP_VER" ]        && install_native "@img/sharp-darwin-arm64@$SHARP_VER"           "@img/sharp-darwin-arm64"
[ -n "$LIBVIPS_VER" ]      && install_native "@img/sharp-libvips-darwin-arm64@$LIBVIPS_VER" "@img/sharp-libvips-darwin-arm64"
[ -n "$OXIDE_VER" ]        && install_native "@tailwindcss/oxide-darwin-arm64@$OXIDE_VER"   "@tailwindcss/oxide-darwin-arm64"
[ -n "$NEXT_VER" ]         && install_native "@next/swc-darwin-arm64@$NEXT_VER"             "@next/swc-darwin-arm64"
[ -n "$LIGHTNINGCSS_VER" ] && install_native "lightningcss-darwin-arm64@$LIGHTNINGCSS_VER"  "lightningcss-darwin-arm64"

echo "✓ Natives installées. Tu peux maintenant lancer 'npm test' / 'npm run dev'."
