# CA Code App

Application mobile de projets citoyens pour le Credit Agricole Provence Cote d'Azur. Les habitants peuvent decouvrir, suivre et soutenir des initiatives locales dans les departements 04, 06 et 83.

## Architecture

Le projet est compose de deux parties :

- **`webapp/`** — Interface web (React + TypeScript + SCSS + Webpack 5)
- **`mobapp/`** — Application native (Expo + React Native) qui embarque la webapp dans une WebView

La webapp tourne dans une WebView et communique avec le natif via un bridge (`postMessage` / `injectJavaScript`). Les donnees persistantes (projets suivis, etc.) sont stockees cote natif avec `expo-sqlite`, avec un fallback `localStorage` quand la webapp tourne en standalone (navigateur).

## Pre-requis

- **Node.js** >= 18
- **Android Studio** avec un emulateur configure (API 34+ recommande)
  - Ou un appareil Android connecte en USB avec le debogage USB active
- **Java JDK** 17 (requis par le build Android natif)

## Lancement en mode dev

Le mode dev necessite deux terminaux : un pour la webapp (serveur Webpack) et un pour l'app native (Expo).

### 1. Installer les dependances

```bash
cd webapp && npm install
cd ../mobapp && npm install
```

### 2. Lancer la webapp

```bash
cd webapp
npm start
```

Le serveur Webpack demarre sur `http://localhost:3000`. La webapp est accessible dans un navigateur pour du dev rapide, mais l'experience complete passe par l'app native.

### 3. Lancer l'app native sur l'emulateur Android

Dans un second terminal :

```bash
cd mobapp
npx expo run:android
```

> **Important :** On utilise `expo run:android` (dev build natif) et non `expo start` (Expo Go), car l'app utilise des modules natifs (`expo-sqlite`, `react-native-webview`) qui ne sont pas inclus dans Expo Go.

L'app native charge la webapp depuis `http://10.0.2.2:3000` (l'adresse de la machine hote vue depuis l'emulateur Android).

### En cas de probleme

- **Port 3000 occupe** : Fermer les processus node existants
- **L'emulateur n'affiche rien** : Verifier que le serveur webpack tourne bien sur le port 3000
- **Erreur ADB** : Relancer l'emulateur ou `adb kill-server && adb start-server`

## Tests

```bash
cd webapp
npm test
```

Les tests couvrent les contrastes WCAG (light/dark), le rendu des images projet et le comportement du bouton follow.

## Build production

### Webapp seule

```bash
cd webapp
npm run build
```

Genere un bundle optimise dans `webapp/dist/` (~180KB JS + ~24KB CSS).

### APK Android

Pour generer un APK installable, on peut utiliser EAS Build (service cloud Expo) ou un build local :

```bash
cd mobapp
eas build --platform android --profile preview
```

Cela genere un `.apk` installable directement sur un appareil. Mais pour le dev quotidien, le mode emulateur decrit plus haut est beaucoup plus rapide.

## Structure des dossiers

```
webapp/
  src/
    components/     # Composants React (projects, forum, region, suivis, ui)
    config/         # Constantes et configuration
    data/           # Donnees mock (projets, posts, regions)
    hooks/          # Hooks custom (follow, storage)
    services/       # Couche d'abstraction donnees
    styles/         # Variables SCSS, reset, mixins, global
    types/          # Types TypeScript
    __tests__/      # Tests Jest
mobapp/
  bridge/           # Communication WebView <-> natif
  db/               # SQLite (persistence native)
  assets/           # Icones et splash screen
```
