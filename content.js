/* ============================================================
   LE JARDIN DES VACANCES — Bibliothèque de contenu (thèmes)
   ------------------------------------------------------------
   Tout est embarqué : aucun appel réseau.
   Chaque item : { mot, emoji, l }  où l = première LETTRE du mot.
   Consonnes régulières utilisées par le jeu de lecture :
   B D F L M N P R S T V   (voyelles : A E I O U)
   ============================================================ */

const VOYELLES = ["A", "E", "I", "O", "U"];
const CONSONNES = ["B", "D", "F", "L", "M", "N", "P", "R", "S", "T", "V"];

const THEMES = {
  ferme: {
    nom: "LA FERME",
    emoji: "🚜",
    couleur: "#E8843C",
    decor: "🌾",
    scene: "🏡",
    items: [
      { mot: "VACHE", emoji: "🐄", l: "V" },
      { mot: "MOUTON", emoji: "🐑", l: "M" },
      { mot: "POULE", emoji: "🐔", l: "P" },
      { mot: "LAPIN", emoji: "🐰", l: "L" },
      { mot: "TRACTEUR", emoji: "🚜", l: "T" },
      { mot: "PONEY", emoji: "🐴", l: "P" },
      { mot: "BLÉ", emoji: "🌾", l: "B" },
      { mot: "BIQUE", emoji: "🐐", l: "B" },
      { mot: "OIE", emoji: "🦢", l: "O" },
      { mot: "PORC", emoji: "🐷", l: "P" }
    ]
  },
  sauvages: {
    nom: "LES ANIMAUX SAUVAGES",
    emoji: "🦁",
    couleur: "#D9642B",
    decor: "🌴",
    scene: "🌍",
    items: [
      { mot: "LION", emoji: "🦁", l: "L" },
      { mot: "TIGRE", emoji: "🐯", l: "T" },
      { mot: "SERPENT", emoji: "🐍", l: "S" },
      { mot: "RENARD", emoji: "🦊", l: "R" },
      { mot: "PANTHÈRE", emoji: "🐆", l: "P" },
      { mot: "SINGE", emoji: "🐒", l: "S" },
      { mot: "RHINO", emoji: "🦏", l: "R" },
      { mot: "PERROQUET", emoji: "🦜", l: "P" },
      { mot: "ÉLÉPHANT", emoji: "🐘", l: "E" },
      { mot: "OURS", emoji: "🐻", l: "O" }
    ]
  },
  mer: {
    nom: "LA MER",
    emoji: "🌊",
    couleur: "#2BA3A3",
    decor: "🐚",
    scene: "🏖️",
    items: [
      { mot: "POISSON", emoji: "🐟", l: "P" },
      { mot: "DAUPHIN", emoji: "🐬", l: "D" },
      { mot: "REQUIN", emoji: "🦈", l: "R" },
      { mot: "VAGUE", emoji: "🌊", l: "V" },
      { mot: "PIEUVRE", emoji: "🐙", l: "P" },
      { mot: "BALEINE", emoji: "🐳", l: "B" },
      { mot: "SABLE", emoji: "🏖️", l: "S" },
      { mot: "BULOT", emoji: "🐚", l: "B" },
      { mot: "ÉTOILE", emoji: "⭐", l: "E" },
      { mot: "OTARIE", emoji: "🦭", l: "O" }
    ]
  },
  jardin: {
    nom: "LE JARDIN",
    emoji: "🌻",
    couleur: "#7FB03C",
    decor: "🍃",
    scene: "🪴",
    items: [
      { mot: "TOURNESOL", emoji: "🌻", l: "T" },
      { mot: "ROSE", emoji: "🌹", l: "R" },
      { mot: "TULIPE", emoji: "🌷", l: "T" },
      { mot: "LIMACE", emoji: "🐌", l: "L" },
      { mot: "PAPILLON", emoji: "🦋", l: "P" },
      { mot: "VER", emoji: "🐛", l: "V" },
      { mot: "FEUILLE", emoji: "🍃", l: "F" },
      { mot: "BOURDON", emoji: "🐝", l: "B" },
      { mot: "POUSSE", emoji: "🌱", l: "P" },
      { mot: "POT", emoji: "🪴", l: "P" }
    ]
  },
  fruits: {
    nom: "LES FRUITS ET LÉGUMES",
    emoji: "🍓",
    couleur: "#E24C4C",
    decor: "🍏",
    scene: "🧺",
    items: [
      { mot: "BANANE", emoji: "🍌", l: "B" },
      { mot: "TOMATE", emoji: "🍅", l: "T" },
      { mot: "POIRE", emoji: "🍐", l: "P" },
      { mot: "FRAISE", emoji: "🍓", l: "F" },
      { mot: "MYRTILLE", emoji: "🫐", l: "M" },
      { mot: "PATATE", emoji: "🥔", l: "P" },
      { mot: "MAÏS", emoji: "🌽", l: "M" },
      { mot: "RAISIN", emoji: "🍇", l: "R" },
      { mot: "BROCOLI", emoji: "🥦", l: "B" },
      { mot: "POMME", emoji: "🍏", l: "P" }
    ]
  },
  transports: {
    nom: "LES TRANSPORTS",
    emoji: "🚗",
    couleur: "#3B7DD8",
    decor: "🛣️",
    scene: "🌆",
    items: [
      { mot: "BUS", emoji: "🚌", l: "B" },
      { mot: "VÉLO", emoji: "🚲", l: "V" },
      { mot: "TRAIN", emoji: "🚂", l: "T" },
      { mot: "TROTTINETTE", emoji: "🛴", l: "T" },
      { mot: "VOILIER", emoji: "⛵", l: "V" },
      { mot: "FUSÉE", emoji: "🚀", l: "F" },
      { mot: "MOTO", emoji: "🏍️", l: "M" },
      { mot: "VOITURE", emoji: "🚗", l: "V" },
      { mot: "BATEAU", emoji: "🚤", l: "B" },
      { mot: "AVION", emoji: "✈️", l: "A" }
    ]
  },
  cirque: {
    nom: "LE CIRQUE",
    emoji: "🎪",
    couleur: "#C0399B",
    decor: "🎈",
    scene: "🎪",
    items: [
      { mot: "TENTE", emoji: "🎪", l: "T" },
      { mot: "LION", emoji: "🦁", l: "L" },
      { mot: "BALLON", emoji: "🎈", l: "B" },
      { mot: "SINGE", emoji: "🐒", l: "S" },
      { mot: "MANÈGE", emoji: "🎠", l: "M" },
      { mot: "TAMBOUR", emoji: "🥁", l: "T" },
      { mot: "MASQUE", emoji: "🎭", l: "M" },
      { mot: "BAGUETTE", emoji: "🪄", l: "B" },
      { mot: "POPCORN", emoji: "🍿", l: "P" },
      { mot: "ÉLÉPHANT", emoji: "🐘", l: "E" }
    ]
  },
  espace: {
    nom: "L'ESPACE",
    emoji: "🚀",
    couleur: "#5B3FB8",
    decor: "⭐",
    scene: "🌌",
    items: [
      { mot: "FUSÉE", emoji: "🚀", l: "F" },
      { mot: "LUNE", emoji: "🌙", l: "L" },
      { mot: "SOLEIL", emoji: "☀️", l: "S" },
      { mot: "PLANÈTE", emoji: "🪐", l: "P" },
      { mot: "MARTIEN", emoji: "👽", l: "M" },
      { mot: "TERRE", emoji: "🌍", l: "T" },
      { mot: "SOUCOUPE", emoji: "🛸", l: "S" },
      { mot: "LUNETTE", emoji: "🔭", l: "L" },
      { mot: "ÉTOILE", emoji: "⭐", l: "E" },
      { mot: "ASTRONAUTE", emoji: "🧑‍🚀", l: "A" }
    ]
  },
  dinos: {
    nom: "LES DINOSAURES",
    emoji: "🦕",
    couleur: "#5FA84E",
    decor: "🌿",
    scene: "🌋",
    items: [
      { mot: "DIPLODOCUS", emoji: "🦕", l: "D" },
      { mot: "REX", emoji: "🦖", l: "R" },
      { mot: "VOLCAN", emoji: "🌋", l: "V" },
      { mot: "FOUGÈRE", emoji: "🌿", l: "F" },
      { mot: "LÉZARD", emoji: "🦎", l: "L" },
      { mot: "TRACE", emoji: "👣", l: "T" },
      { mot: "ROCHER", emoji: "🪨", l: "R" },
      { mot: "PALMIER", emoji: "🌴", l: "P" },
      { mot: "OEUF", emoji: "🥚", l: "O" },
      { mot: "OS", emoji: "🦴", l: "O" }
    ]
  },
  contes: {
    nom: "LES CONTES",
    emoji: "🏰",
    couleur: "#B8759B",
    decor: "🌟",
    scene: "🏰",
    items: [
      { mot: "TOUR", emoji: "🏰", l: "T" },
      { mot: "ROI", emoji: "👑", l: "R" },
      { mot: "DRAGON", emoji: "🐉", l: "D" },
      { mot: "FÉE", emoji: "🧚", l: "F" },
      { mot: "LOUP", emoji: "🐺", l: "L" },
      { mot: "POMME", emoji: "🍎", l: "P" },
      { mot: "PRINCESSE", emoji: "👸", l: "P" },
      { mot: "SORCIER", emoji: "🧙", l: "S" },
      { mot: "LICORNE", emoji: "🦄", l: "L" },
      { mot: "BAGUETTE", emoji: "🪄", l: "B" }
    ]
  },
  corps: {
    nom: "LE CORPS",
    emoji: "🖐️",
    couleur: "#E0776A",
    decor: "❤️",
    scene: "🧒",
    items: [
      { mot: "MAIN", emoji: "🖐️", l: "M" },
      { mot: "NEZ", emoji: "👃", l: "N" },
      { mot: "PIED", emoji: "🦶", l: "P" },
      { mot: "DENT", emoji: "🦷", l: "D" },
      { mot: "BRAS", emoji: "💪", l: "B" },
      { mot: "LANGUE", emoji: "👅", l: "L" },
      { mot: "MOLLET", emoji: "🦵", l: "M" },
      { mot: "OEIL", emoji: "👁️", l: "O" },
      { mot: "OREILLE", emoji: "👂", l: "O" },
      { mot: "DOIGT", emoji: "👆", l: "D" }
    ]
  },
  meteo: {
    nom: "LA MÉTÉO",
    emoji: "🌦️",
    couleur: "#4FA3D1",
    decor: "☁️",
    scene: "🌤️",
    items: [
      { mot: "SOLEIL", emoji: "☀️", l: "S" },
      { mot: "PLUIE", emoji: "🌧️", l: "P" },
      { mot: "NEIGE", emoji: "❄️", l: "N" },
      { mot: "NUAGE", emoji: "⛅", l: "N" },
      { mot: "VENT", emoji: "🌬️", l: "V" },
      { mot: "FOUDRE", emoji: "⚡", l: "F" },
      { mot: "PARAPLUIE", emoji: "☂️", l: "P" },
      { mot: "BROUILLARD", emoji: "🌫️", l: "B" },
      { mot: "TORNADE", emoji: "🌪️", l: "T" },
      { mot: "ARC-EN-CIEL", emoji: "🌈", l: "A" }
    ]
  },
  insectes: {
    nom: "LES INSECTES",
    emoji: "🐞",
    couleur: "#D14C4C",
    decor: "🍄",
    scene: "🌾",
    items: [
      { mot: "FOURMI", emoji: "🐜", l: "F" },
      { mot: "PAPILLON", emoji: "🦋", l: "P" },
      { mot: "VER", emoji: "🐛", l: "V" },
      { mot: "SAUTERELLE", emoji: "🦗", l: "S" },
      { mot: "LIMACE", emoji: "🐌", l: "L" },
      { mot: "MOUSTIQUE", emoji: "🦟", l: "M" },
      { mot: "SCARABÉE", emoji: "🪲", l: "S" },
      { mot: "BESTIOLE", emoji: "🐞", l: "B" },
      { mot: "ABEILLE", emoji: "🐝", l: "A" },
      { mot: "ARAIGNÉE", emoji: "🕷️", l: "A" }
    ]
  },
  musique: {
    nom: "LA MUSIQUE",
    emoji: "🎵",
    couleur: "#8E44AD",
    decor: "🎶",
    scene: "🎼",
    items: [
      { mot: "TAMBOUR", emoji: "🥁", l: "T" },
      { mot: "PIANO", emoji: "🎹", l: "P" },
      { mot: "TROMPETTE", emoji: "🎺", l: "T" },
      { mot: "VIOLON", emoji: "🎻", l: "V" },
      { mot: "SAXO", emoji: "🎷", l: "S" },
      { mot: "MICRO", emoji: "🎤", l: "M" },
      { mot: "NOTE", emoji: "🎶", l: "N" },
      { mot: "BONGO", emoji: "🪘", l: "B" },
      { mot: "ACCORDÉON", emoji: "🪗", l: "A" },
      { mot: "FLÛTE", emoji: "🎼", l: "F" }
    ]
  },
  couleurs: {
    nom: "LES COULEURS ET LES FORMES",
    emoji: "🔷",
    couleur: "#E8843C",
    decor: "🎨",
    scene: "🌈",
    items: [
      { mot: "ROND", emoji: "🔴", l: "R" },
      { mot: "TRIANGLE", emoji: "🔺", l: "T" },
      { mot: "LOSANGE", emoji: "🔶", l: "L" },
      { mot: "VIOLET", emoji: "🟪", l: "V" },
      { mot: "ROUGE", emoji: "🟥", l: "R" },
      { mot: "BLEU", emoji: "🟦", l: "B" },
      { mot: "VERT", emoji: "🟩", l: "V" },
      { mot: "NOIR", emoji: "⚫", l: "N" },
      { mot: "ÉTOILE", emoji: "⭐", l: "E" },
      { mot: "ORANGE", emoji: "🟧", l: "O" }
    ]
  }
};

// Ordre de rotation des thèmes sur l'été (15 thèmes)
const THEME_ORDER = [
  "ferme", "mer", "sauvages", "jardin", "fruits",
  "transports", "cirque", "espace", "dinos", "contes",
  "corps", "meteo", "insectes", "musique", "couleurs"
];

// Types de graphisme par niveau de difficulté (0 = facile -> 2 = difficile)
const GRAPHISME_NIVEAUX = {
  0: ["traits", "ronds", "ponts"],
  1: ["vagues", "creneaux", "ponts"],
  2: ["boucles", "spirales", "vagues"]
};

// Phrases d'encouragement de la mascotte 🐌
const ENCOURAGEMENTS = [
  "BRAVO ! TU AVANCES DOUCEMENT MAIS SÛREMENT !",
  "SUPER ! LA MAISON EST DE PLUS EN PLUS PROCHE !",
  "TU ES UN CHAMPION DE L'ÉTÉ !",
  "OH LÀ LÀ, QUE C'EST BIEN JOUÉ !",
  "ENCORE UNE BELLE JOURNÉE D'APPRENTISSAGE !",
  "TU GRANDIS CHAQUE JOUR, BRAVO !"
];

if (typeof module !== "undefined" && module.exports) {
  module.exports = { THEMES, THEME_ORDER, GRAPHISME_NIVEAUX, VOYELLES, CONSONNES, ENCOURAGEMENTS };
}
