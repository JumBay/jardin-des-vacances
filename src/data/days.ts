/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { THEMES, Theme } from "./themes.ts";

export interface GeneratedAtelier {
  id: string;
  titre: string;
  type: "programme" | "lecture" | "graphisme" | "relier" | "decoupage" | "numeration" | "logique" | "phono";
  mode: "📱 SUR L'ÉCRAN" | "🖨️ À IMPRIMER" | "🏠 SANS RIEN";
  consigneEnfant: string;
  consigneParent: string;
  repli: string;
  params: any;
}

export interface DayData {
  date: string; // YYYY-MM-DD
  themeId: string;
  themeNom: string;
  themeEmoji: string;
  ateliers: GeneratedAtelier[];
}

// --- Constructeurs d'ateliers (contenu identique, 100% déterministe) ---

function atelierProgramme(dateStr: string): GeneratedAtelier {
  return {
    id: `${dateStr}_prog`,
    titre: "LE PROGRAMME DE MA JOURNÉE",
    type: "programme",
    mode: "📱 SUR L'ÉCRAN",
    consigneEnfant: "REGARDE TON PROGRAMME ET COCHE LES PARCOURS QUAND TU AS FINI !",
    consigneParent: "Lisez le programme avec l'enfant le matin et validez ensemble chaque étape de la journée.",
    repli: "DESSINE 4 GRANDES CASES SUR UNE FEUILLE POUR FAIRE TON PROGRAMME.",
    params: {
      steps: [
        { label: "🌅 RITUEL DE LA DATE", emoji: "📅" },
        { label: "📖 JEU DES SONS ET LECTURE", emoji: "🗣️" },
        { label: "✏️ GRAPHISME ET TRAVAIL PHYSIQUE", emoji: "✍️" },
        { label: "🧮 JEU DE COMPTAGE ET NOMBRES", emoji: "🔢" },
        { label: "🌙 BILAN DE LA JOURNÉE + HISTOIRE", emoji: "🛌" }
      ]
    }
  };
}

function atelierLecture(dateStr: string, theme: Theme): GeneratedAtelier {
  const readingLetter = theme.mots[0].mot[0];
  return {
    id: `${dateStr}_lect`,
    titre: `LE JARDIN DES SONS : LETTRE ${readingLetter}`,
    type: "lecture",
    mode: "📱 SUR L'ÉCRAN",
    consigneEnfant: `ÉCOUTE LE SON ET RETROUVE LA LETTRE ${readingLetter} PARMI LES PROPOSITIONS !`,
    consigneParent: "Ce jeu entraîne la conscience phonologique. Encouragez l'enfant à répéter les syllabes à haute voix.",
    repli: `DESSINE LA LETTRE ${readingLetter} DANS LE SABLE OU SUR UNE ARDOISE.`,
    params: {
      targetLetter: readingLetter,
      words: theme.mots,
      letterChoices: [readingLetter, "A", "O", "I", "U", "P", "M", "L"].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4)
    }
  };
}

function atelierGraphisme(dateStr: string, theme: Theme, weekIndex: number): GeneratedAtelier {
  let pathType = theme.graphisme.pathType;
  if (weekIndex > 5 && pathType === "horizontal") pathType = "boucles";
  else if (weekIndex > 3 && pathType === "vertical") pathType = "creneaux";
  return {
    id: `${dateStr}_graph`,
    titre: `GRAPHISME : ${theme.graphisme.titre}`,
    type: "graphisme",
    mode: "🖨️ À IMPRIMER",
    consigneEnfant: theme.graphisme.consigne,
    consigneParent: "Veillez à ce que l'enfant tienne correctement son stylo (pince du pouce et de l'index) et commence bien de gauche à droite.",
    repli: `AFFICHE LE MODÈLE À L'ÉCRAN ET RECOPIE ${theme.graphisme.titre} SUR UNE FEUILLE OU ARDOISE BLANCHE.`,
    params: { pathType, decor: theme.graphisme.decor, title: theme.graphisme.titre }
  };
}

function atelierRelier(dateStr: string, theme: Theme, weekIndex: number): GeneratedAtelier {
  const pairCount = weekIndex < 3 ? 3 : 4;
  return {
    id: `${dateStr}_relier`,
    titre: `RELIER : ${theme.relier.titre}`,
    type: "relier",
    mode: "🖨️ À IMPRIMER",
    consigneEnfant: theme.relier.consigne,
    consigneParent: "Aidez l'enfant à lire les dessins et à faire glisser son doigt (à l'écran) ou tracer une ligne droite (sur papier).",
    repli: "MONTRE DU DOIGT LES PAIRES QUI VONT ENSEMBLE SUR L'ÉCRAN ET DIS LEURS NOMS EN MAJUSCULES !",
    params: { pairs: theme.relier.pairs.slice(0, pairCount) }
  };
}

function atelierDecoupage(dateStr: string, theme: Theme, weekIndex: number): GeneratedAtelier {
  return {
    id: `${dateStr}_decoup`,
    titre: `DÉCOUPAGE DE L'ÉTÉ : ${theme.nom}`,
    type: "decoupage",
    mode: "🖨️ À IMPRIMER",
    consigneEnfant: "DÉCOUPE PROPREMENT LE LONG DE LA LIGNE EN POINTILLÉS POUR LIBÉRER LE DESSIN !",
    consigneParent: "Apprenez à l'enfant à tenir les ciseaux bien droits devant soi et à tourner la feuille, pas les ciseaux.",
    repli: "PRENDS UN ANCIEN PROSPECTUS ET DÉCOUPE LE LONG D'UNE LIGNE QUE PAPA OU MAMAN T'A TRACÉE AU FEUTRE !",
    params: { lineType: weekIndex < 3 ? "straight" : "curved", decorEmoji: theme.emoji }
  };
}

function atelierNumeration(dateStr: string, theme: Theme, weekIndex: number, index: number): GeneratedAtelier {
  let maxCount = 10;
  if (weekIndex > 5) maxCount = 20;
  else if (weekIndex > 2) maxCount = 15;
  // déterministe : au moins 3, jusqu'à maxCount
  const count = ((index * 7 + 3) % Math.max(1, maxCount - 3)) + 3;
  return {
    id: `${dateStr}_num`,
    titre: `NUMÉRATION : ${theme.numeration.titre}`,
    type: "numeration",
    mode: "📱 SUR L'ÉCRAN",
    consigneEnfant: theme.numeration.consigne,
    consigneParent: "Utilisez l'aide graduée (bouton 💡) si l'enfant bloque. L'aide affiche d'abord la bande numérique pour situer le nombre.",
    repli: `COMPTE ${maxCount} GRAINS DE RIZ OU PETITS CAILLOUX ET FAIS DES PAQUETS DE 5.`,
    params: { max: maxCount, emoji: theme.numeration.emoji, type: theme.numeration.type, count }
  };
}

function atelierLogique(dateStr: string, theme: Theme): GeneratedAtelier {
  return {
    id: `${dateStr}_logic`,
    titre: `LOGIQUE : ${theme.logique.titre}`,
    type: "logique",
    mode: "📱 SUR L'ÉCRAN",
    consigneEnfant: theme.logique.consigne,
    consigneParent: "Encouragez l'enfant à verbaliser le rythme en disant les noms à voix haute (ex: COCCINELLE, PAPILLON, COCCINELLE...).",
    repli: "UTILISE DES LEGO OU DES JETONS DE COULEUR POUR FAIRE DES RYTHMES : BLEU, ROUGE, BLEU, ROUGE !",
    params: { pattern: theme.logique.pattern, choices: theme.logique.choices, correctAnswer: theme.logique.correctAnswer }
  };
}

function atelierPhono(dateStr: string, theme: Theme): GeneratedAtelier {
  return {
    id: `${dateStr}_phono`,
    titre: `PHONOLOGIE : ${theme.phono.titre}`,
    type: "phono",
    mode: "🏠 SANS RIEN",
    consigneEnfant: theme.phono.consigneEnfant,
    consigneParent: theme.phono.consigneParent,
    repli: "UN JEU COMPLÈTEMENT SANS ÉCRAN NI IMPRIMANTE ! JUSTE À L'ORAL AVEC PAPA OU MAMAN.",
    params: {
      wordToClap: theme.phono.syllablesCountWord,
      expectedClaps: theme.phono.syllablesCount,
      rimeWord: theme.phono.rimeWord,
      themeEmoji: theme.emoji
    }
  };
}

/**
 * Génère la liste des jours du 2026-07-06 au 2026-08-31.
 * Chaque jour propose UN atelier de CHAQUE type (8 au total) : un vrai menu
 * riche et varié — jamais deux fois la même activité dans la journée.
 * La variété vient du thème du jour et de la difficulté croissante.
 */
export function generateDaysData(): DayData[] {
  const start = new Date("2026-07-06T12:00:00");
  const end = new Date("2026-08-31T12:00:00");
  const days: DayData[] = [];

  let current = new Date(start);
  let index = 0;

  while (current <= end) {
    const year = current.getFullYear();
    const month = String(current.getMonth() + 1).padStart(2, "0");
    const dayVal = String(current.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${dayVal}`;

    const theme = THEMES[index % THEMES.length];
    const weekIndex = Math.floor(index / 7);

    const ateliers: GeneratedAtelier[] = [
      atelierProgramme(dateStr),
      atelierLecture(dateStr, theme),
      atelierGraphisme(dateStr, theme, weekIndex),
      atelierDecoupage(dateStr, theme, weekIndex),
      atelierRelier(dateStr, theme, weekIndex),
      atelierNumeration(dateStr, theme, weekIndex, index),
      atelierLogique(dateStr, theme),
      atelierPhono(dateStr, theme)
    ];

    days.push({
      date: dateStr,
      themeId: theme.id,
      themeNom: theme.nom,
      themeEmoji: theme.emoji,
      ateliers
    });

    current.setDate(current.getDate() + 1);
    index++;
  }

  return days;
}

// Liste pré-calculée pour usage statique
export const DAYS_DATA: DayData[] = generateDaysData();
