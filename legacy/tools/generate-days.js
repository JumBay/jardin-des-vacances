/* Génère days.json : une entrée par jour du 2026-07-06 au 2026-08-31 inclus.
   Descripteurs légers (type + paramètres) — l'appli a le moteur de rendu.
   node tools/generate-days.js  */
const fs = require("fs");
const path = require("path");
const { THEME_ORDER, GRAPHISME_NIVEAUX } = require("../content.js");

const START = "2026-07-06";
const END = "2026-08-31";

function iso(d) {
  return d.toISOString().slice(0, 10);
}

// Pool des ateliers "secondaires" (hors programme + lecture).
// Chaque jour on prend SEC_PER_DAY types DISTINCTS via une fenêtre glissante :
// aucune répétition dans une même journée, et tous les types reviennent souvent.
const SECONDARY = ["graphisme", "numeration", "relier", "logique", "decoupage", "phono"];
const SEC_PER_DAY = 4; // 4 distincts + programme + lecture = 6 ateliers / jour
const RELIER_VARIANTES = ["mot-image", "nombre-points", "image-ombre", "forme-objet"];
const LOGIQUE_VARIANTES = ["suite", "intrus", "suite", "tri"];

function phaseOf(i) {
  if (i < 14) return 0; // semaines 1-2 : facile
  if (i < 35) return 1; // semaines 3-5 : moyen
  return 2;             // semaines 6+ : plus difficile
}

function buildAtelier(type, i, phase) {
  switch (type) {
    case "graphisme": {
      const pool = GRAPHISME_NIVEAUX[phase];
      return { type, motif: pool[i % pool.length], niveau: phase };
    }
    case "relier":
      return { type, variante: RELIER_VARIANTES[i % RELIER_VARIANTES.length], paires: phase === 0 ? 3 : phase === 1 ? 4 : 6 };
    case "decoupage":
      return { type, forme: phase === 0 ? "droite" : "courbe" };
    case "numeration":
      return { type, max: phase === 0 ? 10 : phase === 1 ? 15 : 20 };
    case "logique":
      return { type, variante: LOGIQUE_VARIANTES[i % LOGIQUE_VARIANTES.length], longueur: phase === 0 ? 5 : phase === 1 ? 6 : 8 };
    case "phono":
      return { type };
    default:
      return { type };
  }
}

const days = {};
let i = 0;
for (let d = new Date(START + "T00:00:00Z"); iso(d) <= END; d.setUTCDate(d.getUTCDate() + 1)) {
  const date = iso(d);
  const phase = phaseOf(i);
  const theme = THEME_ORDER[i % THEME_ORDER.length];

  // fenêtre glissante de 4 types distincts dans le pool des 6 secondaires
  const offset = i % SECONDARY.length;
  const secTypes = [];
  for (let k = 0; k < SEC_PER_DAY; k++) secTypes.push(SECONDARY[(offset + k) % SECONDARY.length]);

  const ateliers = [
    { type: "programme" },
    { type: "lecture" },
    ...secTypes.map(t => buildAtelier(t, i, phase))
  ];

  // garde-fou : aucun type en double dans la journée
  const seen = new Set();
  for (const a of ateliers) {
    if (seen.has(a.type)) throw new Error("Doublon " + a.type + " le " + date);
    seen.add(a.type);
  }

  days[date] = { date, theme, phase, ateliers };
  i++;
}

const out = path.join(__dirname, "..", "days.json");
fs.writeFileSync(out, JSON.stringify(days, null, 2) + "\n");
console.log("days.json écrit :", Object.keys(days).length, "jours (" + START + " → " + END + ")");
