/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface WordItem {
  mot: string;
  emoji: string;
  syllable: string; // pre-split, e.g. "VA-CHE"
}

export interface GraphismeItem {
  titre: string;
  consigne: string;
  pathType: "horizontal" | "vertical" | "vagues" | "ponts" | "boucles" | "creneaux" | "spirale" | "oblique";
  decor: string; // emoji decoration
}

export interface RelierPair {
  leftId: string;
  rightId: string;
  leftContent: string; // can be text or emoji
  rightContent: string; // can be text or emoji
  leftIsText: boolean;
  rightIsText: boolean;
}

export interface RelierItem {
  titre: string;
  consigne: string;
  pairs: RelierPair[];
}

export interface NumerationItem {
  titre: string;
  consigne: string;
  max: number;
  emoji: string;
  type: "count" | "missing" | "compare"; // compare: "un de plus / de moins"
}

export interface LogiqueItem {
  titre: string;
  consigne: string;
  pattern: string[]; // e.g. ["🔴", "🔵", "🔴"]
  choices: string[]; // choices for next item
  correctAnswer: string;
}

export interface PhonoItem {
  titre: string;
  consigneEnfant: string;
  consigneParent: string;
  syllablesCountWord: string; // word to clap syllables
  syllablesCount: number;
  rimeWord: string; // word that rhymes
}

export interface Theme {
  id: string;
  nom: string;
  emoji: string;
  mots: WordItem[];
  graphisme: GraphismeItem;
  relier: RelierItem;
  numeration: NumerationItem;
  logique: LogiqueItem;
  phono: PhonoItem;
}

export const THEMES: Theme[] = [
  {
    id: "ferme",
    nom: "LA FERME",
    emoji: "🚜",
    mots: [
      { mot: "VACHE", emoji: "🐄", syllable: "VA-CHE" },
      { mot: "POULE", emoji: "🐔", syllable: "POU-LE" },
      { mot: "COCHON", emoji: "🐖", syllable: "CO-CHON" },
      { mot: "MOUTON", emoji: "🐑", syllable: "MOU-TON" },
      { mot: "TRACTEUR", emoji: "🚜", syllable: "TRAC-TEUR" },
      { mot: "LAPIN", emoji: "🐇", syllable: "LA-PIN" }
    ],
    graphisme: {
      titre: "LE CHEMIN DU TRACTEUR",
      consigne: "TRACE UNE LIGNE TOUTE DROITE POUR AIDER LE TRACTEUR À RENTRER À LA FERME.",
      pathType: "horizontal",
      decor: "🌾"
    },
    relier: {
      titre: "LES CRIS DES ANIMAUX",
      consigne: "RELIER CHAQUE ANIMAL À SON CRI !",
      pairs: [
        { leftId: "vache", rightId: "meuh", leftContent: "🐄 VACHE", rightContent: "MEUH !", leftIsText: true, rightIsText: true },
        { leftId: "poule", rightId: "cot", leftContent: "🐔 POULE", rightContent: "COT COT !", leftIsText: true, rightIsText: true },
        { leftId: "cochon", rightId: "groin", leftContent: "🐖 COCHON", rightContent: "GROIN !", leftIsText: true, rightIsText: true },
        { leftId: "mouton", rightId: "bee", leftContent: "🐑 MOUTON", rightContent: "BÊÊ !", leftIsText: true, rightIsText: true }
      ]
    },
    numeration: {
      titre: "COMPTE LES POUSSINS",
      consigne: "COMPTE COMBIEN IL Y A DE POUSSINS ET TROUVE LE BON NOMBRE.",
      max: 10,
      emoji: "🐥",
      type: "count"
    },
    logique: {
      titre: "LA SUITE DE LA FERME",
      consigne: "REGARDE BIEN LE MODÈLE ET TROUVE L'IMAGE QUI MANQUE.",
      pattern: ["🐄", "🐖", "🐄", "🐖", "🐄"],
      choices: ["🐄", "🐖", "🐑"],
      correctAnswer: "🐖"
    },
    phono: {
      titre: "LES SYLLABES DE LA FERME",
      consigneEnfant: "TAPE DANS TES MAINS EN DISANT LES MOTS DE LA FERME !",
      consigneParent: "Prononcez les mots en insistant sur chaque syllabe. Faites frapper dans les mains : MO-U-TON (2 syllabes réelles à l'oral: MOU-TON).",
      syllablesCountWord: "MOUTON",
      syllablesCount: 2,
      rimeWord: "LAPIN" // rime avec FIN
    }
  },
  {
    id: "sauvages",
    nom: "LES ANIMAUX SAUVAGES",
    emoji: "🦁",
    mots: [
      { mot: "LION", emoji: "🦁", syllable: "LI-ON" },
      { mot: "TIGRE", emoji: "🐯", syllable: "TI-GRE" },
      { mot: "SINGE", emoji: "🐒", syllable: "SIN-GE" },
      { mot: "GIRAFE", emoji: "🦒", syllable: "GI-RA-FE" },
      { mot: "ZEBRE", emoji: "🦓", syllable: "ZÈ-BRE" },
      { mot: "ELEPHANT", emoji: "🐘", syllable: "É-LÉ-PHANT" }
    ],
    graphisme: {
      titre: "LES RAYURES DU ZÈBRE",
      consigne: "TRACE DES LIGNES VERTICALES POUR FAIRE LES JOLIES RAYURES DU ZÈBRE.",
      pathType: "vertical",
      decor: "🌿"
    },
    relier: {
      titre: "QUI MANGE QUOI ?",
      consigne: "RELIER CHAQUE ANIMAL À SA NOURRITURE PRÉFÉRÉE !",
      pairs: [
        { leftId: "singe", rightId: "banane", leftContent: "🐒 SINGE", rightContent: "🍌 BANANE", leftIsText: true, rightIsText: true },
        { leftId: "lion", rightId: "viande", leftContent: "🦁 LION", rightContent: "🥩 VIANDE", leftIsText: true, rightIsText: true },
        { leftId: "panda", rightId: "bambou", leftContent: "🐼 PANDA", rightContent: "🎋 BAMBOU", leftIsText: true, rightIsText: true },
        { leftId: "ecureuil", rightId: "noisette", leftContent: "🐿️ ÉCUREUIL", rightContent: "🌰 NOISETTE", leftIsText: true, rightIsText: true }
      ]
    },
    numeration: {
      titre: "LES BANANES DU SINGE",
      consigne: "LE SINGE A TRÈS FAIM. COMPTE SES BANANES !",
      max: 12,
      emoji: "🍌",
      type: "count"
    },
    logique: {
      titre: "LA SUITE DE LA JUNGLE",
      consigne: "QUEL ANIMAL REJOINT LA CHENILLE ?",
      pattern: ["🦁", "🐒", "🦁", "🐒", "🦁"],
      choices: ["🦁", "🐒", "🦒"],
      correctAnswer: "🐒"
    },
    phono: {
      titre: "L'INITIALE DU LION",
      consigneEnfant: "TROUVE LE PREMIER SON DU MOT LION. C'EST LE LLLL !",
      consigneParent: "Demandez à l'enfant d'insister sur le son L: 'LLLL-ION'. Demandez-lui s'il entend ce son dans 'LUNE' ou 'BALLE'.",
      syllablesCountWord: "GIRAFE",
      syllablesCount: 3,
      rimeWord: "SINGE"
    }
  },
  {
    id: "mer",
    nom: "LA MER",
    emoji: "🐟",
    mots: [
      { mot: "POISSON", emoji: "🐟", syllable: "POIS-SON" },
      { mot: "CRABE", emoji: "🦀", syllable: "CRA-BE" },
      { mot: "REQUIN", emoji: "🦈", syllable: "RE-QUIN" },
      { mot: "BALEINE", emoji: "🐋", syllable: "BA-LEI-NE" },
      { mot: "PIEUVRE", emoji: "🐙", syllable: "PIEU-VRE" },
      { mot: "TORTUE", emoji: "🐢", syllable: "TOR-TUE" }
    ],
    graphisme: {
      titre: "LES VAGUES DE LA MER",
      consigne: "SUIS LES VAGUES DE L'EAU POUR FAIRE VOYAGER LE PETIT BATEAU.",
      pathType: "vagues",
      decor: "⛵"
    },
    relier: {
      titre: "L'HABITAT DES ANIMAUX",
      consigne: "RELIER CHAQUE ANIMAL À SON LIEU DE VIE.",
      pairs: [
        { leftId: "poisson", rightId: "mer", leftContent: "🐟 POISSON", rightContent: "🌊 LA MER", leftIsText: true, rightIsText: true },
        { leftId: "oiseau", rightId: "nid", leftContent: "🐦 OISEAU", rightContent: "🪺 LE NID", leftIsText: true, rightIsText: true },
        { leftId: "ours", rightId: "grotte", leftContent: "🐻 OURS", rightContent: "🪨 LA GROTTE", leftIsText: true, rightIsText: true },
        { leftId: "abeille", rightId: "ruche", leftContent: "🐝 ABEILLE", rightContent: "🪹 LA RUCHE", leftIsText: true, rightIsText: true }
      ]
    },
    numeration: {
      titre: "COMPTE LES CRABES",
      consigne: "IL Y A PLEIN DE PETITS CRABES SUR LA PLAGE. COMPTE-LES !",
      max: 14,
      emoji: "🦀",
      type: "count"
    },
    logique: {
      titre: "LA SUITE DES POISSONS",
      consigne: "TROUVE LE BON POISSON POUR CONTINUER.",
      pattern: ["🐟", "🐙", "🐟", "🐙", "🐟"],
      choices: ["🐟", "🐙", "🦀"],
      correctAnswer: "🐙"
    },
    phono: {
      titre: "LE SON DE LA MER",
      consigneEnfant: "TROUVE DES MOTS QUI FINISSENT COMME 'MER' !",
      consigneParent: "Travaillez sur la rime en 'ER'. Proposez: 'FER', 'TERRE', 'CHAIR'. Faites rimer les mots.",
      syllablesCountWord: "BALEINE",
      syllablesCount: 2,
      rimeWord: "CRABE"
    }
  },
  {
    id: "jardin",
    nom: "LE JARDIN",
    emoji: "🌻",
    mots: [
      { mot: "FLEUR", emoji: "🌻", syllable: "FLEUR" },
      { mot: "ARBRE", emoji: "🌳", syllable: "AR-BRE" },
      { mot: "ARROSOIR", emoji: "🚿", syllable: "AR-RO-SOIR" },
      { mot: "ESCARGOT", emoji: "🐌", syllable: "ES-CAR-GOT" },
      { mot: "PAPILLON", emoji: "🦋", syllable: "PA-PIL-LON" },
      { mot: "OUTIL", emoji: "🛠️", syllable: "OU-TIL" }
    ],
    graphisme: {
      titre: "LA COQUILLE DE L'ESCARGOT",
      consigne: "TOURNE TOURNE LE FEUTRE POUR DESSINER UNE BELLE COQUILLE D'ESCARGOT EN SPIRALE.",
      pathType: "spirale",
      decor: "🐌"
    },
    relier: {
      titre: "ASSOCIE L'OUTIL AU JARDINIER",
      consigne: "RELIER L'OBJET À CE QU'IL PERMET DE FAIRE !",
      pairs: [
        { leftId: "arrosoir", rightId: "eau", leftContent: "🚿 ARROSOIR", rightContent: "💧 ARROSER LES FLEURS", leftIsText: true, rightIsText: true },
        { leftId: "rateau", rightId: "feuilles", leftContent: "🧹 RÂTEAU", rightContent: "🍂 RAMASSER LES FEUILLES", leftIsText: true, rightIsText: true },
        { leftId: "brouette", rightId: "terre", leftContent: "🛒 BROUETTE", rightContent: "🪨 PORTER LA TERRE", leftIsText: true, rightIsText: true },
        { leftId: "graines", rightId: "planter", leftContent: "🌱 GRAINES", rightContent: "🌻 FAIRE POUSSER", leftIsText: true, rightIsText: true }
      ]
    },
    numeration: {
      titre: "COMPTE LES FLEURS",
      consigne: "COMPTE LES BELLES FLEURS DU JARDIN.",
      max: 15,
      emoji: "🌻",
      type: "count"
    },
    logique: {
      titre: "LA SUITE DU JARDIN",
      consigne: "TERMINE LA CHENILLE DU JARDIN.",
      pattern: ["🌻", "🐌", "🌻", "🐌", "🌻"],
      choices: ["🌻", "🐌", "🦋"],
      correctAnswer: "🐌"
    },
    phono: {
      titre: "L'INITIALE DE ESCARGOT",
      consigneEnfant: "QUEL EST LE PREMIER SON D'ESCARGOT ? C'EST LE ÉÉÉ !",
      consigneParent: "Prononcez lentement : ÉÉÉ-SCARGOT. Demandez s'il commence comme ÉCOLE, ÉTOILE ou ANANAS.",
      syllablesCountWord: "ESCARGOT",
      syllablesCount: 3,
      rimeWord: "FLEUR"
    }
  },
  {
    id: "fruits",
    nom: "LES FRUITS ET LÉGUMES",
    emoji: "🍎",
    mots: [
      { mot: "FRAISE", emoji: "🍓", syllable: "FRAI-SE" },
      { mot: "BANANE", emoji: "🍌", syllable: "BA-NA-NE" },
      { mot: "CERISE", emoji: "🍒", syllable: "CE-RI-SE" },
      { mot: "ORANGE", emoji: "🍊", syllable: "O-RAN-GE" },
      { mot: "POIRE", emoji: "🍐", syllable: "POI-RE" },
      { mot: "CAROTTE", emoji: "🥕", syllable: "CA-ROT-TE" }
    ],
    graphisme: {
      titre: "LES REBONDIS DE LA PÊCHE",
      consigne: "FAIS DES PONTS TOUT RONDS POUR FAIRE SAUTER LA PÊCHE.",
      pathType: "ponts",
      decor: "🍑"
    },
    relier: {
      titre: "LES COULEURS DES FRUITS",
      consigne: "RELIER CHAQUE FRUIT À SA COULEUR.",
      pairs: [
        { leftId: "fraise", rightId: "rouge", leftContent: "🍓 FRAISE", rightContent: "🔴 ROUGE", leftIsText: true, rightIsText: true },
        { leftId: "banane", rightId: "jaune", leftContent: "🍌 BANANE", rightContent: "🟡 JAUNE", leftIsText: true, rightIsText: true },
        { leftId: "poire", rightId: "vert", leftContent: "🍐 POIRE", rightContent: "🟢 VERT", leftIsText: true, rightIsText: true },
        { leftId: "orange", rightId: "orange_col", leftContent: "🍊 ORANGE", rightContent: "🟠 ORANGE", leftIsText: true, rightIsText: true }
      ]
    },
    numeration: {
      titre: "LES PETITES CERISES",
      consigne: "COMPTE LES DOUCES CERISES SUR LA BRANCHE.",
      max: 16,
      emoji: "🍒",
      type: "count"
    },
    logique: {
      titre: "TRI DE FRUITS",
      consigne: "TROUVE LE FRUIT MANQUANT À LA FIN.",
      pattern: ["🍎", "🍌", "🍎", "🍌", "🍎"],
      choices: ["🍎", "🍌", "🥕"],
      correctAnswer: "🍌"
    },
    phono: {
      titre: "LA CHUTE DE LA FRAISE",
      consigneEnfant: "EST-CE QUE FRAISE COMPORTE LE SON 'ZE' À LA FIN ?",
      consigneParent: "Demandez à l'enfant d'exagérer la fin : FRAI-ZZZZ. Est-ce que ça rime avec VALISE, CERISE, CHEMISE ?",
      syllablesCountWord: "BANANE",
      syllablesCount: 3,
      rimeWord: "POIRE"
    }
  },
  {
    id: "transports",
    nom: "LES TRANSPORTS",
    emoji: "🚀",
    mots: [
      { mot: "TRAIN", emoji: "🚆", syllable: "TRAIN" },
      { mot: "AVION", emoji: "✈️", syllable: "A-VION" },
      { mot: "VELO", emoji: "🚲", syllable: "VÉ-LO" },
      { mot: "CAMION", emoji: "🚚", syllable: "CA-MION" },
      { mot: "FUSEE", emoji: "🚀", syllable: "FU-SÉE" },
      { mot: "VOITURE", emoji: "🚗", syllable: "VOI-TU-RE" }
    ],
    graphisme: {
      titre: "LA FUMÉE DU TRAIN",
      consigne: "TRACE DE BELLES BOUCLES POUR FAIRE LA FUMÉE QUI S'ÉCHAPPE DE LA CHEMINÉE.",
      pathType: "boucles",
      decor: "💨"
    },
    relier: {
      titre: "SUR LA ROUTE OU DANS LE CIEL ?",
      consigne: "RELIER LE VÉHICULE À L'ENDROIT OÙ IL SE DÉPLACE.",
      pairs: [
        { leftId: "avion", rightId: "ciel", leftContent: "✈️ AVION", rightContent: "☁️ CIEL", leftIsText: true, rightIsText: true },
        { leftId: "train", rightId: "rails", leftContent: "🚆 TRAIN", rightContent: "🛤️ RAILS", leftIsText: true, rightIsText: true },
        { leftId: "bateau", rightId: "eau", leftContent: "🚢 BATEAU", rightContent: "🌊 EAU", leftIsText: true, rightIsText: true },
        { leftId: "voiture", rightId: "route", leftContent: "🚗 VOITURE", rightContent: "🛣️ ROUTE", leftIsText: true, rightIsText: true }
      ]
    },
    numeration: {
      titre: "COMPTE LES PETITES VOITURES",
      consigne: "COMPTE COMBIEN DE VOITURES SONT GARÉES DANS LE PARKING.",
      max: 18,
      emoji: "🚗",
      type: "count"
    },
    logique: {
      titre: "LA SUITE DES TRANSPORTS",
      consigne: "QUEL VÉHICULE REJOINT LE CONVOI ?",
      pattern: ["🚀", "🚗", "🚀", "🚗", "🚀"],
      choices: ["🚀", "🚗", "✈️"],
      correctAnswer: "🚗"
    },
    phono: {
      titre: "LE SON DE VELO",
      consigneEnfant: "DANS VELO, ON ENTEND LE SON VVV OU BBB ?",
      consigneParent: "Faites vibrer les lèvres : VVVVV-ÉLO. Comparez avec 'BÉBÉ' pour montrer la différence entre le V et le B.",
      syllablesCountWord: "VOITURE",
      syllablesCount: 3,
      rimeWord: "TRAIN"
    }
  },
  {
    id: "cirque",
    nom: "LE CIRQUE",
    emoji: "🎪",
    mots: [
      { mot: "CLOWN", emoji: "🤡", syllable: "CLOWN" },
      { mot: "BALLON", emoji: "🎈", syllable: "BAL-LON" },
      { mot: "CHAPITEAU", emoji: "🎪", syllable: "CHA-PI-TEAU" },
      { mot: "LION", emoji: "🦁", syllable: "LI-ON" },
      { mot: "CHAPEAU", emoji: "🎩", syllable: "CHA-PEAU" },
      { mot: "SINGE", emoji: "🐒", syllable: "SIN-GE" }
    ],
    graphisme: {
      titre: "LES BALLONS DU JONGLEUR",
      consigne: "TRACE DE JOLIS RONDS BIEN FERMÉS POUR DESSINER LES BALLONS DU CLOWN.",
      pathType: "spirale",
      decor: "🎈"
    },
    relier: {
      titre: "L'ACCESSOIRE DU CIRQUE",
      consigne: "RELIER L'ARTISTE À SON ACCESSOIRE DU CIRQUE.",
      pairs: [
        { leftId: "clown", rightId: "nez", leftContent: "🤡 CLOWN", rightContent: "🔴 NEZ ROUGE", leftIsText: true, rightIsText: true },
        { leftId: "magicien", rightId: "baguette", leftContent: "🎩 MAGICIEN", rightContent: "🪄 BAGUETTE MAGIQUE", leftIsText: true, rightIsText: true },
        { leftId: "jongleur", rightId: "quilles", leftContent: "🤹 JONGLEUR", rightContent: "🪀 QUILLES COLOREES", leftIsText: true, rightIsText: true },
        { leftId: "lion_c", rightId: "cerceau", leftContent: "🦁 LION", rightContent: "⭕ CERCEAU DE FEU", leftIsText: true, rightIsText: true }
      ]
    },
    numeration: {
      titre: "COMPTE LES BALLONS",
      consigne: "COMPTE LES BALLONS VOLANTS DU CLOWN.",
      max: 15,
      emoji: "🎈",
      type: "count"
    },
    logique: {
      titre: "LA SUITE DU CIRQUE",
      consigne: "TROUVE CE QUI MANQUE SUR LA PISTE.",
      pattern: ["🎪", "🤡", "🎪", "🤡", "🎪"],
      choices: ["🎪", "🤡", "🎈"],
      correctAnswer: "🤡"
    },
    phono: {
      titre: "LE SON INITIAL DE CLOWN",
      consigneEnfant: "LE MOT CLOWN COMMENCE PAR LE SON KKK. TU L'ENTENDS ?",
      consigneParent: "Prononcez 'K-K-CLOWN'. Demandez d'autres mots commençant par ce son, comme 'CRABE' ou 'CAROTTE'.",
      syllablesCountWord: "CHAPITEAU",
      syllablesCount: 3,
      rimeWord: "BALLON"
    }
  },
  {
    id: "espace",
    nom: "L'ESPACE",
    emoji: "🚀",
    mots: [
      { mot: "FUSEE", emoji: "🚀", syllable: "FU-SÉE" },
      { mot: "PLANETE", emoji: "🪐", syllable: "PLA-NÈ-TE" },
      { mot: "ETOILE", emoji: "⭐", syllable: "É-TOI-LE" },
      { mot: "LUNE", emoji: "🌙", syllable: "LU-NE" },
      { mot: "SOLEIL", emoji: "☀️", syllable: "SO-LEIL" },
      { mot: "ROBOT", emoji: "🤖", syllable: "RO-BOT" }
    ],
    graphisme: {
      titre: "LE VOL DE LA FUSÉE",
      consigne: "TRACE UNE LIGNE OBLIQUE VERS LE HAUT POUR ENVOYER LA FUSÉE DANS LES ÉTOILES.",
      pathType: "oblique",
      decor: "⭐"
    },
    relier: {
      titre: "JOUR OU NUIT ?",
      consigne: "RELIER CHAQUE ÉLÉMENT À LA PÉRIODE OÙ ON PEUT L'OBSERVER.",
      pairs: [
        { leftId: "soleil", rightId: "jour", leftContent: "☀️ SOLEIL", rightContent: "☀️ LE JOUR", leftIsText: true, rightIsText: true },
        { leftId: "lune", rightId: "nuit", leftContent: "🌙 LUNE", rightContent: "🌙 LA NUIT", leftIsText: true, rightIsText: true },
        { leftId: "etoile", rightId: "nuit_e", leftContent: "⭐ ÉTOILE", rightContent: "🌙 LA NUIT", leftIsText: true, rightIsText: true },
        { leftId: "nuage", rightId: "jour_e", leftContent: "☁️ NUAGE", rightContent: "☀️ LE JOUR", leftIsText: true, rightIsText: true }
      ]
    },
    numeration: {
      titre: "COMPTE LES ÉTOILES",
      consigne: "COMPTE LES ÉTOILES QUI BRILLENT DANS L'ESPACE !",
      max: 20,
      emoji: "⭐",
      type: "count"
    },
    logique: {
      titre: "LA SUITE SPATIALE",
      consigne: "QUEL ASTRE SUIT ?",
      pattern: ["🚀", "⭐", "🚀", "⭐", "🚀"],
      choices: ["🚀", "⭐", "🌙"],
      correctAnswer: "⭐"
    },
    phono: {
      titre: "LES SYLLABES DE LA LUNE",
      consigneEnfant: "DANS 'LUNE', COMBIEN DE SYLLABES EN PARLANT ? LU-NE (2 SYLLABES) !",
      consigneParent: "Faites scander : LU-NE. C'est idéal pour la conscience phonologique. Demandez si ça rime avec 'DUNE'.",
      syllablesCountWord: "PLANETE",
      syllablesCount: 3,
      rimeWord: "LUNE"
    }
  },
  {
    id: "dinosaures",
    nom: "LES DINOSAURES",
    emoji: "🦖",
    mots: [
      { mot: "DINO", emoji: "🦖", syllable: "DI-NO" },
      { mot: "OEUF", emoji: "🥚", syllable: "OEUF" },
      { mot: "VOLCAN", emoji: "🌋", syllable: "VOL-CAN" },
      { mot: "FORET", emoji: "🌳", syllable: "FO-RÊT" },
      { mot: "FOSSILE", emoji: "🦴", syllable: "FOS-SI-LE" },
      { mot: "HERBE", emoji: "🌿", syllable: "HER-BE" }
    ],
    graphisme: {
      titre: "LES PICOTS DU DINOSAURE",
      consigne: "DESSINE DES CRÉNEAUX ET DES TRIANGLES POUR TRACER LES PICOTS DU DINOSAURE.",
      pathType: "creneaux",
      decor: "🦕"
    },
    relier: {
      titre: "GRANDS OU PETITS ?",
      consigne: "RELIER LE DINOSAURE À SA TAILLE ESTIMÉE.",
      pairs: [
        { leftId: "diplodocus", rightId: "geant", leftContent: "🦕 DIPLODOCUS", rightContent: "🏢 GÉANT !", leftIsText: true, rightIsText: true },
        { leftId: "tyrannosaure", rightId: "carnivore", leftContent: "🦖 TYRANNOSHAURE", rightContent: "🥩 CARNIVORE !", leftIsText: true, rightIsText: true },
        { leftId: "triceratops", rightId: "herbe_c", leftContent: "🦕 TRICÉRATOPS", rightContent: "🌿 MANGE DE L'HERBE", leftIsText: true, rightIsText: true },
        { leftId: "oeuf_d", rightId: "nid_d", leftContent: "🥚 OEUF", rightContent: "🪺 DANS LE NID", leftIsText: true, rightIsText: true }
      ]
    },
    numeration: {
      titre: "LES OEUFS DE DINOSAURE",
      consigne: "COMPTE LES GROS OEUFS PRÊTS À ÉCLORE.",
      max: 12,
      emoji: "🥚",
      type: "count"
    },
    logique: {
      titre: "LA SUITE DES DINOS",
      consigne: "REMETS DE L'ORDRE DANS LA PRÉHISTOIRE.",
      pattern: ["🦖", "🥚", "🦖", "🥚", "🦖"],
      choices: ["🦖", "🥚", "🌋"],
      correctAnswer: "🥚"
    },
    phono: {
      titre: "LE PREMIER SON DE DINO",
      consigneEnfant: "ENTENDS-TU LE SON DDD AU DÉBUT DE DINO ?",
      consigneParent: "Prononcez : DDD-INO. Demandez-lui s'il commence comme 'DOUCHE' ou 'DORLOTER'.",
      syllablesCountWord: "VOLCAN",
      syllablesCount: 2,
      rimeWord: "OEUF"
    }
  },
  {
    id: "contes",
    nom: "LES CONTES",
    emoji: "👑",
    mots: [
      { mot: "CHATEAU", emoji: "🏰", syllable: "CHÂ-TEAU" },
      { mot: "PRINCE", emoji: "🤴", syllable: "PRIN-CE" },
      { mot: "REINE", emoji: "👸", syllable: "REI-NE" },
      { mot: "ROI", emoji: "👑", syllable: "ROI" },
      { mot: "DRAGON", emoji: "🐉", syllable: "DRA-GON" },
      { mot: "LOUP", emoji: "🐺", syllable: "LOUP" }
    ],
    graphisme: {
      titre: "LES TOURS DU CHÂTEAU",
      consigne: "TRACE DES CRÉNEAUX POUR DESSINER LES HAUTES TOURS DU CHÂTEAU DE LA REINE.",
      pathType: "creneaux",
      decor: "🏰"
    },
    relier: {
      titre: "ASSOCIE LES PERSONNAGES DE CONTES",
      consigne: "RELIER L'ÉLÉMENT MAGIQUE À SON HÉROS.",
      pairs: [
        { leftId: "reine", rightId: "couronne", leftContent: "👸 REINE", rightContent: "👑 COURONNE", leftIsText: true, rightIsText: true },
        { leftId: "chaperon", rightId: "loup", leftContent: "👧 CHAPERON ROUGE", rightContent: "🐺 LOUP", leftIsText: true, rightIsText: true },
        { leftId: "dragon_c", rightId: "feu", leftContent: "🐉 DRAGON", rightContent: "🔥 FEU", leftIsText: true, rightIsText: true },
        { leftId: "fee", rightId: "baguette_f", leftContent: "🧚 FÉE", rightContent: "🪄 BAGUETTE", leftIsText: true, rightIsText: true }
      ]
    },
    numeration: {
      titre: "LES COURONNES DU ROI",
      consigne: "LE ROI A CACHÉ SES COURONNES. COMPTE-LES !",
      max: 10,
      emoji: "👑",
      type: "count"
    },
    logique: {
      titre: "LA SUITE MAJESTUEUSE",
      consigne: "TROUVE CE QUI TERMINE CE CONTE DE FÉES.",
      pattern: ["🏰", "👑", "🏰", "👑", "🏰"],
      choices: ["🏰", "👑", "👸"],
      correctAnswer: "👑"
    },
    phono: {
      titre: "LES SYLLABES DE CHATEAU",
      consigneEnfant: "TAPE DANS TES MAINS : CHÂ-TEAU (2 SYLLABES) !",
      consigneParent: "Faites taper : CHÂ-TEAU. Demandez s'il entend le son 'O' à la fin du mot.",
      syllablesCountWord: "COURONNE",
      syllablesCount: 3,
      rimeWord: "ROI"
    }
  },
  {
    id: "corps",
    nom: "LE CORPS HUMAIN",
    emoji: "👣",
    mots: [
      { mot: "TETE", emoji: "🧑", syllable: "TÊ-TE" },
      { mot: "BRAS", emoji: "💪", syllable: "BRAS" },
      { mot: "MAIN", emoji: "✋", syllable: "MAIN" },
      { mot: "JAMBE", emoji: "🦵", syllable: "JAM-BE" },
      { mot: "PIED", emoji: "👣", syllable: "PIED" },
      { mot: "NEZ", emoji: "👃", syllable: "NEZ" }
    ],
    graphisme: {
      titre: "LE TOUT ROND DU VISAGE",
      consigne: "TRACE DES GRANDS CERCLES POUR FAIRE LES PETITES TÊTES DES AMIS.",
      pathType: "spirale",
      decor: "🧑"
    },
    relier: {
      titre: "LES CINQ SENS",
      consigne: "RELIER L'ORGANE DU CORPS AU SENS CORRESPONDANT.",
      pairs: [
        { leftId: "yeux", rightId: "vue", leftContent: "👁️ YEUX", rightContent: "🖼️ VOIR LA COULEUR", leftIsText: true, rightIsText: true },
        { leftId: "oreille", rightId: "ouie", leftContent: "👂 OREILLE", rightContent: "🎵 ENTENDRE LE CHANT", leftIsText: true, rightIsText: true },
        { leftId: "nez_s", rightId: "odorat", leftContent: "👃 NEZ", rightContent: "🌹 SENTIR LA FLEUR", leftIsText: true, rightIsText: true },
        { leftId: "main_s", rightId: "toucher", leftContent: "✋ MAIN", rightContent: "🧸 TOUCHER LE NOUNOURS", leftIsText: true, rightIsText: true }
      ]
    },
    numeration: {
      titre: "LES COMPTES DES DOIGTS",
      consigne: "COMPTE LES PETITES MAINS QUI FONT COUCOU ET CALCULE LES DOIGTS.",
      max: 15,
      emoji: "🖐️",
      type: "count"
    },
    logique: {
      titre: "LA SUITE DU CORPS",
      consigne: "DESSINE L'IMAGE QUI MANQUE.",
      pattern: ["✋", "👣", "✋", "👣", "✋"],
      choices: ["✋", "👣", "💪"],
      correctAnswer: "👣"
    },
    phono: {
      titre: "LE SON INITIAL DE MAIN",
      consigneEnfant: "LE MOT MAIN COMMENCE PAR LE SON MMM. FAIS COMME SI C'ÉTAIT BON !",
      consigneParent: "Faites le son 'MMMMM' avec la bouche fermée. Cherchez ensemble d'autres mots comme 'MAMAN' ou 'MOUTON'.",
      syllablesCountWord: "BOUCHE",
      syllablesCount: 1,
      rimeWord: "NEZ"
    }
  },
  {
    id: "meteo",
    nom: "LA MÉTÉO ET LES SAISONS",
    emoji: "☀️",
    mots: [
      { mot: "SOLEIL", emoji: "☀️", syllable: "SO-LEIL" },
      { mot: "PLUIE", emoji: "🌧️", syllable: "PLUIE" },
      { mot: "NUAGE", emoji: "☁️", syllable: "NUA-GE" },
      { mot: "VENT", emoji: "💨", syllable: "VENT" },
      { mot: "NEIGE", emoji: "❄️", syllable: "NEI-GE" },
      { mot: "ORAGE", emoji: "⚡", syllable: "O-RA-GE" }
    ],
    graphisme: {
      titre: "LA PLUIE QUI TOMBE",
      consigne: "TRACE DES PETITS TRAITS EN PENTE DE HAUT EN BAS POUR FAIRE TOMBER LA DOUCE PLUIE SUR LE NUAGE.",
      pathType: "oblique",
      decor: "💧"
    },
    relier: {
      titre: "QUE FAUT-IL METTRE QUAND... ?",
      consigne: "RELIER LA MÉTÉO AUX BONS VÊTEMENTS.",
      pairs: [
        { leftId: "soleil_m", rightId: "casquette", leftContent: "☀️ GRAND SOLEIL", rightContent: "🧢 CASQUETTE + LUNETTES", leftIsText: true, rightIsText: true },
        { leftId: "pluie_m", rightId: "parapluie", leftContent: "🌧️ GROSSE PLUIE", rightContent: "🌂 PARAPLUIE + BOTTES", leftIsText: true, rightIsText: true },
        { leftId: "neige_m", rightId: "bonnet", leftContent: "❄️ FROID ET NEIGE", rightContent: "🧣 BONNET + ÉCHARPE", leftIsText: true, rightIsText: true },
        { leftId: "vent_m", rightId: "coupevent", leftContent: "💨 BEAUCOUP DE VENT", rightContent: "🧥 COUPE-VENT", leftIsText: true, rightIsText: true }
      ]
    },
    numeration: {
      titre: "COMPTE LES NUAGES",
      consigne: "LES NUAGES JOUENT DANS LE CIEL. COMPTE-LES !",
      max: 10,
      emoji: "☁️",
      type: "count"
    },
    logique: {
      titre: "LA SUITE DE LA MÉTÉO",
      consigne: "REGARDE LA SUITE DU CIEL.",
      pattern: ["☀️", "☁️", "☀️", "☁️", "☀️"],
      choices: ["☀️", "☁️", "❄️"],
      correctAnswer: "☁️"
    },
    phono: {
      titre: "L'INITIALE DE SOLEIL",
      consigneEnfant: "LE PREMIER SON DE SOLEIL EST LE SSSS. COMME UN SERPENT !",
      consigneParent: "Faites le son du serpent : SSSSS. Demandez si ça commence comme 'SABLE', 'SINGE' ou 'TRACTEUR'.",
      syllablesCountWord: "NUAGE",
      syllablesCount: 2,
      rimeWord: "VENT"
    }
  },
  {
    id: "insectes",
    nom: "LES INSECTES",
    emoji: "🐞",
    mots: [
      { mot: "FOURMI", emoji: "🐜", syllable: "FOUR-MI" },
      { mot: "ABEILLE", emoji: "🐝", syllable: "A-BEIL-LE" },
      { mot: "MOUCHE", emoji: "🪰", syllable: "MOU-CHE" },
      { mot: "CHENILLE", emoji: "🐛", syllable: "CHE-NIL-LE" },
      { mot: "PAPILLON", emoji: "🦋", syllable: "PA-PIL-LON" },
      { mot: "COCCINELLE", emoji: "🐞", syllable: "COC-CI-NEL-LE" }
    ],
    graphisme: {
      titre: "LE VOL DE L'ABEILLE",
      consigne: "DESSINE DES BELLES BOUCLES POUR SUIVRE L'ABEILLE QUI VA DE FLEUR EN FLEUR.",
      pathType: "boucles",
      decor: "🌸"
    },
    relier: {
      titre: "LES POINTS DE LA COCCINELLE",
      consigne: "RELIER LE CHIFFRE AU BON NOMBRE DE POINTS !",
      pairs: [
        { leftId: "deux", rightId: "p2", leftContent: "2", rightContent: "⚫⚫ COCCINELLE AVEC 2 POINTS", leftIsText: true, rightIsText: true },
        { leftId: "trois", rightId: "p3", leftContent: "3", rightContent: "⚫⚫⚫ COCCINELLE AVEC 3 POINTS", leftIsText: true, rightIsText: true },
        { leftId: "quatre", rightId: "p4", leftContent: "4", rightContent: "⚫⚫⚫⚫ COCCINELLE AVEC 4 POINTS", leftIsText: true, rightIsText: true },
        { leftId: "cinq", rightId: "p5", leftContent: "5", rightContent: "⚫⚫⚫⚫⚫ COCCINELLE AVEC 5 POINTS", leftIsText: true, rightIsText: true }
      ]
    },
    numeration: {
      titre: "COMPTE LES FOURMIS",
      consigne: "LES PETITES FOURMIS TRAVAILLENT EN RANG. COMPTE-LES !",
      max: 18,
      emoji: "🐜",
      type: "count"
    },
    logique: {
      titre: "LA SUITE DE L'HERBE",
      consigne: "TROUVE CE QUI MANQUE PARMI LES INSECTES.",
      pattern: ["🐞", "🦋", "🐞", "🦋", "🐞"],
      choices: ["🐞", "🦋", "🐜"],
      correctAnswer: "🦋"
    },
    phono: {
      titre: "LES SYLLABES DE PAPILLON",
      consigneEnfant: "TAPE PAPILLON EN SYLLABES : PA-PIL-LON (3 SYLLABES) !",
      consigneParent: "Faites scander : PA-PIL-LON. Demandez de trouver d'autres mots avec 3 syllabes (ex. ARROSOIR).",
      syllablesCountWord: "FOURMI",
      syllablesCount: 2,
      rimeWord: "MOUCHE"
    }
  },
  {
    id: "musique",
    nom: "LA MUSIQUE",
    emoji: "🎵",
    mots: [
      { mot: "PIANO", emoji: "🎹", syllable: "PIA-NO" },
      { mot: "GUITARE", emoji: "🎸", syllable: "GUI-TA-RE" },
      { mot: "FLUTE", emoji: "🪈", syllable: "FLÛ-TE" },
      { mot: "TAMBOUR", emoji: "🥁", syllable: "TAM-BOUR" },
      { mot: "TROMPETTE", emoji: "🎺", syllable: "TROM-PET-TE" },
      { mot: "NOTE", emoji: "🎵", syllable: "NO-TE" }
    ],
    graphisme: {
      titre: "LA PORTÉE MUSICALE",
      consigne: "TRACE DES LIGNES PARALLÈLES ET DROITES POUR ACCOMPAGNER LES JOLIES NOTES.",
      pathType: "horizontal",
      decor: "🎼"
    },
    relier: {
      titre: "COMMENT FAIT-ON DU SON ?",
      consigne: "RELIER L'INSTRUMENT AU GESTE QUI PRODUIT LE SON.",
      pairs: [
        { leftId: "tambour", rightId: "taper", leftContent: "🥁 TAMBOUR", rightContent: "🔨 TAPER AVEC DES BAGUETTES", leftIsText: true, rightIsText: true },
        { leftId: "piano", rightId: "appuyer", leftContent: "🎹 PIANO", rightContent: "👉 APPUYER SUR DES TOUCHES", leftIsText: true, rightIsText: true },
        { leftId: "guitare", rightId: "gratter", leftContent: "🎸 GUITARE", rightContent: "🖐️ GRATTER LES CORDES", leftIsText: true, rightIsText: true },
        { leftId: "flute", rightId: "souffler", leftContent: "🪈 FLÛTE", rightContent: "😗 SOUFFLER DANS LE TROU", leftIsText: true, rightIsText: true }
      ]
    },
    numeration: {
      titre: "COMPTE LES NOTES",
      consigne: "COMPTE LES PETITES NOTES DE MUSIQUE DE LA CHANSON.",
      max: 14,
      emoji: "🎵",
      type: "count"
    },
    logique: {
      titre: "LA SUITE DE LA MÉLODIE",
      consigne: "TROUVE LA NOTE COMPLÉMENTAIRE.",
      pattern: ["🎵", "🥁", "🎵", "🥁", "🎵"],
      choices: ["🎵", "🥁", "🎹"],
      correctAnswer: "🥁"
    },
    phono: {
      titre: "LE SON INITIAL DE TAMBOUR",
      consigneEnfant: "LE PREMIER SON DE TAMBOUR EST LE TTT !",
      consigneParent: "Prononcez : TTT-AMBOUR. Entend-on le même son dans 'TRACTEUR' ou dans 'MOUTON' (au début) ?",
      syllablesCountWord: "GUITARE",
      syllablesCount: 3,
      rimeWord: "CHANT"
    }
  },
  {
    id: "couleurs",
    nom: "LES COULEURS ET LES FORMES",
    emoji: "🎨",
    mots: [
      { mot: "ROND", emoji: "🔴", syllable: "ROND" },
      { mot: "CARRE", emoji: "🟦", syllable: "CAR-RÉ" },
      { mot: "TRIANGLE", emoji: "🔺", syllable: "TRI-AN-GLE" },
      { mot: "COEUR", emoji: "❤️", syllable: "COEUR" },
      { mot: "ETOILE", emoji: "⭐", syllable: "É-TOI-LE" },
      { mot: "PINCEAU", emoji: "🖌️", syllable: "PIN-CEAU" }
    ],
    graphisme: {
      titre: "LES FORMES DÉCORATIVES",
      consigne: "TRACE DES CERCLES ET DES CARRES BIEN DÉFINIS.",
      pathType: "vagues",
      decor: "🎨"
    },
    relier: {
      titre: "LES FORMES DE LA MAISON",
      consigne: "RELIER L'OBJET RÉEL À SA FORME GÉOMÉTRIQUE.",
      pairs: [
        { leftId: "ballon", rightId: "rond", leftContent: "⚽ BALLON DE FOOT", rightContent: "🔴 ROND", leftIsText: true, rightIsText: true },
        { leftId: "livre", rightId: "rectangle", leftContent: "📖 LIVRE D'IMAGES", rightContent: "🟦 RECTANGLE", leftIsText: true, rightIsText: true },
        { leftId: "panneau", rightId: "triangle", leftContent: "⚠️ PANNEAU ROUTIER", rightContent: "🔺 TRIANGLE", leftIsText: true, rightIsText: true },
        { leftId: "de", rightId: "carre", leftContent: "🎲 DÉ À JOUER", rightContent: "⬜ CARRÉ", leftIsText: true, rightIsText: true }
      ]
    },
    numeration: {
      titre: "COMPTE LES FORMES ROUGES",
      consigne: "COMPTE LES PETITS COEURS QUI S'AFFICHENT.",
      max: 12,
      emoji: "❤️",
      type: "count"
    },
    logique: {
      titre: "LA SUITE DES FORMES",
      consigne: "TERMINE LE DESSIN GÉOMÉTRIQUE.",
      pattern: ["🔴", "🟦", "🔴", "🟦", "🔴"],
      choices: ["🔴", "🟦", "🔺"],
      correctAnswer: "🟦"
    },
    phono: {
      titre: "LE SON INITIAL DE ROND",
      consigneEnfant: "LE PREMIER SON DE ROND EST LE RRRR. COMME LE MOTEUR !",
      consigneParent: "Faites gratter la gorge : RRRR-OND. Comparez avec 'REINE' ou 'ROSE' pour renforcer.",
      syllablesCountWord: "TRIANGLE",
      syllablesCount: 3,
      rimeWord: "COEUR"
    }
  }
];
