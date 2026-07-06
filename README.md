# 🐌 Le Jardin des Vacances — Grande Section 2026

Portail ludo-pédagogique **illustré et parlé** pour occuper et faire progresser
une enfant de grande section de maternelle pendant l'été, **jusqu'à la rentrée
le 1er septembre 2026**.

Le papier et le concret d'abord, l'écran en petite touche : le site est un
tableau de bord qui organise la journée, propose des jeux courts et sort de
belles fiches à imprimer. Tout reste utilisable **sans imprimante**.

- **En ligne :** https://jumbay.github.io/jardin-des-vacances/
- **Toutes les activités :** https://jumbay.github.io/jardin-des-vacances/apercu.html

## ✨ Ce que fait le site
- **Compte à rebours** « J-XX avant la rentrée » et **rituel de la date parlé** (synthèse vocale fr-FR).
- **Calendrier de l'été** (juillet + août) : aujourd'hui mis en évidence, jours passés grisés, **événements éditables** (➕ sur un jour → emoji + mot court, ex. « 🏖️ PLAGE »). Gardés d'une visite à l'autre (localStorage).
- **8 ateliers par jour**, un de chaque type, jamais deux fois le même : programme, jeu de lecture, graphisme, découpage, relier, numération, logique, phonologie.
- **Jeu de lecture « Le Jardin des Sons »** entièrement parlé (lettre, syllabe, mot).
- **Numération jusqu'à 20** avec **aide graduée** (bouton 💡).
- **Impression A4** par atelier et pour toute la journée ; toute l'interface est masquée à l'impression.
- **15 thèmes** qui tournent (ferme, mer, animaux sauvages, jardin, fruits/légumes, transports, cirque, espace, dinosaures, contes, corps, météo, insectes, musique, couleurs/formes) et **difficulté progressive** au fil de l'été.
- **Aperçu** (`apercu.html`) : la liste de toutes les activités de l'été, numérotées, pour relire et signaler précisément un souci.

Tout le texte enfant est en MAJUSCULES et chaque consigne est portée par un visuel.

## 📱 Installer sur tablette / téléphone (Chrome)
Ouvrir l'URL → menu ⋮ → **« Ajouter à l'écran d'accueil »**. L'appli s'ouvre en plein écran (icône 🐌).

## 🛠️ Développement
Stack : **React 19 + TypeScript + Vite 6 + Tailwind CSS 4** (aucun appel réseau à l'exécution, tout est embarqué).

```bash
npm install
npm run dev        # serveur de dev (http://localhost:3000)
npm run lint       # tsc --noEmit
npm run predeploy  # régénère public/days.json depuis src/data/days.ts
npm run build      # construit le site dans docs/
```

- `src/data/themes.ts` — bibliothèque des 15 thèmes (mots, syllabes pré-découpées, paires, suites…).
- `src/data/days.ts` — génère le programme jour par jour (déterministe, 8 ateliers/jour).
- `src/components/` — Dashboard (calendrier), DayView, ActivityRenderer (moteurs d'ateliers), LectureGame.
- `public/apercu.html` — page statique « toutes les activités ».

## 🚀 Déploiement (GitHub Pages)
Le site est **construit dans `docs/`** (base relative `./`) et servi par GitHub
Pages depuis **`main` / dossier `/docs`**. Pour publier une mise à jour :

```bash
npm run predeploy && npm run build   # met à jour docs/
git add -A && git commit -m "maj" && git push
```

## 🗓️ Ajouter un planning de vacances
Deux façons : le **➕** sur chaque jour dans l'appli, ou éditer `public/days.json`
n'est pas nécessaire — les événements vivent dans `localStorage`. Pour partir d'un
état « neuf » partagé, on peut préremplir `public/events.json` :

```json
{ "2026-07-20": [ { "emoji": "🏖️", "texte": "PLAGE" } ] }
```

> Colle-moi tes dates + activités et je remplis les événements pour toi.

## 📁 `legacy/`
Contient la première version **100 % vanilla** (HTML/CSS/JS sans build), conservée
comme référence et solution de repli.

Fait avec 💛 pour une rentrée en toute sérénité.
