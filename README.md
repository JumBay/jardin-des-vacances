# 🐌 Le Jardin des Vacances

Un site **100 % statique** (HTML/CSS/JS pur, sans build ni dépendance) pour
occuper et faire progresser une enfant de grande section de maternelle
pendant l'été, **jusqu'à la rentrée le 1er septembre 2026**.

Le principe : **le papier et le concret d'abord, l'écran en petite touche.**
Le site est un tableau de bord qui organise la journée, sort les fiches à
imprimer et propose **un seul atelier « écran » court par jour** (le jeu de
lecture *Le Jardin des Sons*). Tout reste utilisable **sans imprimante**.

Tout ce que l'enfant doit lire est **en MAJUSCULES**, et chaque consigne est
**portée par un visuel** (emoji / picto / tracé) : une enfant qui ne lit pas
encore peut deviner quoi faire rien qu'en regardant.

## 🌐 Ouvrir le site

- **En ligne :** l'URL GitHub Pages est indiquée à la fin de l'installation
  (de la forme `https://<compte>.github.io/jardin-des-vacances/`).
- **En local :** ne pas double-cliquer `index.html` (le chargement des
  fichiers `.json` échouerait). Lancer un petit serveur :
  ```bash
  python3 -m http.server 8000
  # puis ouvrir http://localhost:8000
  ```

## 📱 Sur la tablette (Android / Chrome)

1. Ouvrir l'URL du site dans Chrome.
2. Menu ⋮ → **« Ajouter à l'écran d'accueil »**.
3. L'icône 🐌 apparaît ; l'appli s'ouvre en plein écran, comme une vraie appli.

## 🗓️ Le calendrier & les événements

- Le calendrier de l'été (juillet + août) est au centre. **Aujourd'hui** est
  entouré et pulse ; les jours passés sont grisés/barrés (mais restent
  rejouables).
- **Taper un jour** ouvre son programme (thème + 3-4 ateliers).
- **Ajouter un événement :** taper le petit **➕** dans une case → choisir une
  image dans la palette + écrire un mot court (ex. « PLAGE », « MAMIE »).
  Les événements apparaissent dans le calendrier **et** sur la version
  imprimée.
- **Persistance :** les événements et les cases cochées sont gardés dans le
  `localStorage` du navigateur (ils restent d'une visite à l'autre, sur le
  même appareil). Pour repartir de zéro : vider les données du site dans Chrome.

## 🖨️ Impression (A4)

- **Par atelier :** bouton `🖨️ IMPRIMER` sur chaque fiche imprimable.
- **Toute la journée :** `🖨️ IMPRIMER TOUT LE PROGRAMME DU JOUR`.
- **Le calendrier mural :** `🖨️ IMPRIMER LE CALENDRIER DE L'ÉTÉ` (grosses cases
  vides pour écrire les événements à la main ; les événements déjà saisis sont
  pré-imprimés). Idéal à afficher au mur, l'enfant barre les jours au feutre.

Seule la fiche s'imprime : toute l'interface est masquée à l'impression.

## 🧩 Les ateliers (chacun : écran + version imprimable + repli sans imprimante)

| Type | Mode | Ce que fait l'enfant |
|------|------|----------------------|
| 📅 Programme | écran / papier | Emploi du temps illustré, cases à cocher |
| 📖 Le Jardin des Sons | écran (parlé) | Trouver la lettre par son son, fabriquer une syllabe, reconnaître le mot |
| ✏️ Graphisme | à imprimer | Repasser des tracés (traits → ponts/vagues → boucles/spirales) |
| 🔗 Relier | papier / écran | Associer des paires (mot↔image, nombre↔points, image↔ombre) |
| ✂️ Découpage | à imprimer | Découper le long des pointillés |
| 🔢 Numération | écran / papier | Compter **jusqu'à 20**, avec **aide graduée** (bouton 💡) |
| 🧩 Logique | écran / papier | Suites à compléter, intrus à trouver |
| 👂 Jeux de sons | sans rien | À l'oral : syllabes, 1er son, rimes |

La difficulté augmente progressivement au fil des semaines. 15 thèmes tournent
(ferme, mer, animaux sauvages, jardin, fruits/légumes, transports, cirque,
espace, dinosaures, contes, corps, météo, insectes, musique, couleurs/formes).

## 🔧 Remplir le calendrier à partir d'un planning

Deux façons d'ajouter des événements :

1. **Dans l'appli** (le plus simple) : bouton ➕ sur chaque jour.
2. **En éditant `events.json`** (état « neuf » du site) :
   ```json
   {
     "2026-07-20": [ { "emoji": "🏖️", "texte": "PLAGE" } ],
     "2026-07-25": [ { "emoji": "👵", "texte": "MAMIE" }, { "emoji": "🎂", "texte": "ANNIV" } ]
   }
   ```
   > Colle-moi ton planning de vacances (dates + activités) et je remplis
   > `events.json` pour toi. Note : si tu as déjà ajouté des événements dans
   > l'appli, ceux du `localStorage` ont la priorité sur `events.json` — vide
   > les données du site pour repartir de `events.json`.

## 🛠️ Régénérer le contenu

```bash
node tools/generate-days.js    # régénère days.json (2026-07-06 → 2026-08-31)
node tools/generate-icon.js    # régénère icon.png
```

- `content.js` — bibliothèque des 15 thèmes (mots + emojis).
- `days.json` — un descripteur léger par jour (thème + ateliers + difficulté).
- `app.js` — moteur de rendu et d'impression par type d'atelier.

## 📁 Fichiers

```
index.html      tableau de bord (calendrier + compte à rebours + vue du jour)
app.js          logique + moteurs de jeux + impression
content.js      bibliothèque des thèmes
style.css       style enfantin + règles @media print (A4)
days.json       programme jour par jour
events.json     événements de l'été (éditable)
manifest.json   PWA (ajout à l'écran d'accueil)
icon.png        icône 🐌 (512×512, générée)
tools/          générateurs (days.json, icon.png)
```

Fait avec 💛 pour bien s'amuser et grandir cet été.
