/* ============================================================
   LE JARDIN DES VACANCES — Moteur de l'application
   100% statique. Persistance : localStorage (événements + cases
   cochées) pour garder l'état d'une visite à l'autre.
   ============================================================ */

"use strict";

/* ---------------- Constantes ---------------- */
const RENTREE = "2026-09-01";
const ETE_DEBUT = "2026-07-06";
const JOURS_LONG = ["DIMANCHE", "LUNDI", "MARDI", "MERCREDI", "JEUDI", "VENDREDI", "SAMEDI"];
const JOURS_COURT = ["DIM", "LUN", "MAR", "MER", "JEU", "VEN", "SAM"];
const MOIS_NOM = ["JANVIER", "FÉVRIER", "MARS", "AVRIL", "MAI", "JUIN", "JUILLET", "AOÛT", "SEPTEMBRE", "OCTOBRE", "NOVEMBRE", "DÉCEMBRE"];
const PALETTE_EVT = ["🏖️","👵","👴","🎂","🚗","✈️","🏊","🎡","🍦","🎉","🐶","🎨","⚽","🏕️","🚂","🎪","🍉","🌳","🎣","🩰","🎬","🏰","👫","🎁","🦑","☀️","🚌","🛝"];

const MOTIF_LABEL = {
  traits: "LES TRAITS", ronds: "LES RONDS", ponts: "LES PONTS",
  vagues: "LES VAGUES", creneaux: "LES CRÉNEAUX", boucles: "LES BOUCLES", spirales: "LES SPIRALES"
};

/* ---------------- État ---------------- */
let DAYS = {};
let EVENTS = {};
let openedDate = null;

/* ---------------- Utilitaires date ---------------- */
function todayISO() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
function parseISO(s) { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); }
function diffJours(a, b) { return Math.round((parseISO(b) - parseISO(a)) / 86400000); }
const TODAY = todayISO();

/* ---------------- Parole (fr-FR) ---------------- */
let voixFR = null;
function chargerVoix() {
  if (!("speechSynthesis" in window)) return;
  const vs = speechSynthesis.getVoices();
  voixFR = vs.find(v => /fr(-|_)FR/i.test(v.lang)) || vs.find(v => /^fr/i.test(v.lang)) || null;
}
if ("speechSynthesis" in window) {
  chargerVoix();
  speechSynthesis.onvoiceschanged = chargerVoix;
}
function parler(txt, rate) {
  if (!("speechSynthesis" in window)) return;
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(txt);
    u.lang = "fr-FR";
    u.rate = rate || 0.9;
    if (voixFR) u.voice = voixFR;
    speechSynthesis.speak(u);
  } catch (e) { /* silencieux */ }
}

/* ---------------- PRNG déterministe (stable par jour+type) ---------------- */
function seedFrom(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function rngFor(date, type) { return mulberry32(seedFrom(date + "|" + type)); }
function pick(arr, rng) { return arr[Math.floor(rng() * arr.length)]; }
function shuffle(arr, rng) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
function sample(arr, n, rng) { return shuffle(arr, rng).slice(0, n); }

/* ---------------- Persistance ---------------- */
function saveEvents() { try { localStorage.setItem("jdv-events", JSON.stringify(EVENTS)); } catch (e) {} }
function getChecks(date) { try { return JSON.parse(localStorage.getItem("jdv-check-" + date) || "[]"); } catch (e) { return []; } }
function setChecks(date, arr) { try { localStorage.setItem("jdv-check-" + date, JSON.stringify(arr)); } catch (e) {} }

/* ---------------- Chargement ---------------- */
async function boot() {
  try {
    const [dRes, eRes] = await Promise.all([fetch("days.json"), fetch("events.json")]);
    DAYS = await dRes.json();
    const baseEvents = await eRes.json();
    const stored = localStorage.getItem("jdv-events");
    EVENTS = stored ? JSON.parse(stored) : baseEvents;
  } catch (e) {
    document.getElementById("app").innerHTML =
      '<div style="text-align:center;padding:40px;font-weight:800;color:#E9503F">😕 IMPOSSIBLE DE CHARGER LES DONNÉES.<br><br>' +
      'Ouvre le site via un serveur web (ou GitHub Pages), pas en double-cliquant le fichier.</div>';
    return;
  }
  renderCompte();
  renderCalendrier();
  bindGlobal();
}

/* ============================================================
   COMPTE À REBOURS
   ============================================================ */
function renderCompte() {
  const jours = Math.max(0, diffJours(TODAY, RENTREE));
  const totalSem = Math.ceil((diffJours(ETE_DEBUT, RENTREE)) / 7);
  const semRest = Math.min(totalSem, Math.ceil(jours / 7));
  let phrase;
  if (jours <= 0) phrase = "🎒 C'EST LA RENTRÉE ! BRAVO POUR TOUT CE TRAVAIL !";
  else if (jours <= 7) phrase = "🎒 BIENTÔT LA GRANDE SECTION ! ENCORE UN PETIT EFFORT !";
  else if (jours <= 30) phrase = "🌞 CONTINUE À T'ENTRAÎNER, TU ES SUPER FORT !";
  else phrase = "😎 PROFITE BIEN DE L'ÉTÉ ET APPRENDS EN T'AMUSANT !";

  let jauge = "";
  for (let i = 0; i < totalSem; i++) jauge += `<span class="${i < totalSem - semRest ? "vide" : ""}">☀️</span>`;

  document.getElementById("compte").innerHTML =
    `<div><div class="jrs">J-${jours}</div></div>` +
    `<div class="lbl">AVANT LA RENTRÉE</div>` +
    `<div class="phrase">${phrase}</div>` +
    `<div class="jauge" aria-hidden="true">${jauge}</div>`;
}

/* ============================================================
   CALENDRIER
   ============================================================ */
function moisData(annee, mois) {
  // mois : 0-index. Retourne 42 cases (grille lun->dim)
  const premier = new Date(annee, mois, 1);
  let start = premier.getDay(); // 0=dim
  start = (start === 0) ? 6 : start - 1; // lundi = 0
  const nbJours = new Date(annee, mois + 1, 0).getDate();
  const cases = [];
  for (let i = 0; i < start; i++) cases.push(null);
  for (let d = 1; d <= nbJours; d++) cases.push(d);
  while (cases.length % 7 !== 0) cases.push(null);
  return cases;
}

function renderCalendrier() {
  const cont = document.getElementById("calendrier");
  const mois = [{ a: 2026, m: 6 }, { a: 2026, m: 7 }]; // juillet, août 2026
  let html = "";
  const noms = JOURS_COURT.slice(1).concat(JOURS_COURT[0]); // LUN..DIM
  for (const { a, m } of mois) {
    html += `<div class="mois"><h3>${MOIS_NOM[m]} ${a}</h3><div class="grille">`;
    for (const n of noms) html += `<div class="jour-nom">${n}</div>`;
    for (const d of moisData(a, m)) {
      if (d === null) { html += `<div class="case vide"></div>`; continue; }
      const iso = `${a}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const existe = !!DAYS[iso];
      const passe = iso < TODAY;
      const auj = iso === TODAY;
      const dow = JOURS_COURT[new Date(a, m, d).getDay()];
      const evts = EVENTS[iso] || [];
      const evtHtml = evts.slice(0, 2).map(e =>
        `<div class="evt"><span class="em">${e.emoji}</span>${escapeHtml(e.texte)}</div>`).join("");
      const cls = ["case"];
      if (existe) cls.push("jour");
      if (passe) cls.push("passe");
      if (auj) cls.push("aujourdhui");
      html += `<div class="${cls.join(" ")}" data-date="${iso}">
        <button class="plus" data-plus="${iso}" title="Ajouter un événement">+</button>
        <div class="num">${d}</div><div class="dow">${dow}</div>
        <div class="evts">${evtHtml}</div></div>`;
    }
    html += `</div></div>`;
  }
  cont.innerHTML = html;

  cont.querySelectorAll(".case.jour").forEach(el => {
    el.addEventListener("click", (ev) => {
      if (ev.target.closest("[data-plus]")) return;
      ouvrirJour(el.dataset.date);
    });
  });
  cont.querySelectorAll("[data-plus]").forEach(b => {
    b.addEventListener("click", (ev) => { ev.stopPropagation(); ouvrirEditeurEvenements(b.dataset.plus); });
  });
}

/* ============================================================
   VUE DU JOUR
   ============================================================ */
const ATELIER_META = {
  programme: { emoji: "📅", badge: "ecran", print: true, jouer: true },
  lecture:   { emoji: "📖", badge: "ecran", print: false, jouer: true },
  graphisme: { emoji: "✏️", badge: "imprimer", print: true, jouer: true },
  relier:    { emoji: "🔗", badge: "imprimer", print: true, jouer: true },
  decoupage: { emoji: "✂️", badge: "imprimer", print: true, jouer: false },
  numeration:{ emoji: "🔢", badge: "ecran", print: true, jouer: true },
  logique:   { emoji: "🧩", badge: "ecran", print: true, jouer: true },
  phono:     { emoji: "👂", badge: "sansrien", print: true, jouer: true }
};
const BADGE_TXT = { imprimer: "🖨️ À IMPRIMER", ecran: "📱 SUR L'ÉCRAN", sansrien: "🏠 SANS RIEN" };

function atelierTexte(at, theme) {
  const t = THEMES[theme];
  switch (at.type) {
    case "programme": return {
      titre: "MON PROGRAMME DU JOUR",
      consigne: "REGARDE CE QU'ON VA FAIRE ET COCHE QUAND C'EST FINI !",
      parent: "Passez la journée en revue ensemble, cochez au fil de l'eau.",
      repli: "Pas besoin d'imprimante : on coche directement à l'écran."
    };
    case "lecture": return {
      titre: "LE JARDIN DES SONS",
      consigne: "ÉCOUTE ET TROUVE LES LETTRES, LES SYLLABES ET LES MOTS !",
      parent: "10-15 min d'écran. Tout est parlé. Consonnes B D F L M N P R S T V.",
      repli: "Se joue à l'écran — aucune impression nécessaire."
    };
    case "graphisme": return {
      titre: "JE TRACE : " + (MOTIF_LABEL[at.motif] || "LE GRAPHISME"),
      consigne: "REPASSE SUR LES POINTILLÉS AVEC TON CRAYON !",
      parent: "Motif « " + (MOTIF_LABEL[at.motif] || at.motif).toLowerCase() + " ». Tenue du crayon, gauche → droite.",
      repli: "SANS IMPRIMANTE ? Trace le modèle en GRAND sur une feuille, ou repasse au doigt sur l'écran."
    };
    case "relier": return {
      titre: "JE RELIE LES PAIRES",
      consigne: "RELIE CHAQUE IMAGE À CE QUI VA AVEC !",
      parent: "Associer " + at.paires + " paires (" + reliereLabel(at.variante) + ").",
      repli: "SANS IMPRIMANTE ? Joue à l'écran, ou montre les paires du doigt à l'oral."
    };
    case "decoupage": return {
      titre: "JE DÉCOUPE",
      consigne: "DÉCOUPE EN SUIVANT LES POINTILLÉS ✂️",
      parent: "Ligne " + (at.forme === "droite" ? "droite" : "courbe") + ". Ciseaux à bouts ronds, adulte à côté.",
      repli: "SANS IMPRIMANTE ? Découpe un vieux prospectus le long d'un trait tracé au feutre."
    };
    case "numeration": return {
      titre: "JE COMPTE JUSQU'À " + at.max,
      consigne: "COMPTE LES IMAGES ET TROUVE LE BON NOMBRE ! APPUIE SUR 💡 SI BESOIN.",
      parent: "Dénombrement jusqu'à " + at.max + ". Aide graduée avec le bouton 💡 (bande, points, réponse).",
      repli: "Se joue à l'écran, ou imprime la fiche à compter."
    };
    case "logique": return {
      titre: "JE RÉFLÉCHIS",
      consigne: at.variante === "suite" ? "TROUVE CE QUI VIENT APRÈS DANS LA SUITE !" : "TROUVE L'INTRUS QUI N'A RIEN À FAIRE LÀ !",
      parent: at.variante === "suite" ? "Compléter une suite logique d'images." : "Trouver l'intrus (tri par catégorie).",
      repli: "Se joue à l'écran, ou imprime la fiche."
    };
    case "phono": return {
      titre: "JEUX DE SONS",
      consigne: "ON JOUE AVEC LES SONS, RIEN QU'AVEC NOS OREILLES !",
      parent: "À l'oral (voiture, table…). Taper les syllabes, trouver le 1er son, l'intrus sonore.",
      repli: "Aucun matériel — juste vos oreilles ! Idéal les jours sans imprimante."
    };
  }
  return { titre: at.type, consigne: "", parent: "", repli: "" };
}
function reliereLabel(v) {
  return { "mot-image": "mot ↔ image", "nombre-points": "nombre ↔ points", "image-ombre": "image ↔ ombre", "forme-objet": "mot ↔ image" }[v] || v;
}

function ouvrirJour(date) {
  const jour = DAYS[date];
  if (!jour) return;
  openedDate = date;
  const t = THEMES[jour.theme];
  const dObj = parseISO(date);
  const dateTxt = `${JOURS_LONG[dObj.getDay()]} ${dObj.getDate()} ${MOIS_NOM[dObj.getMonth()]}`;

  document.getElementById("accueil").style.display = "none";
  const vue = document.getElementById("jour-vue");
  vue.classList.add("actif");

  const checks = getChecks(date);
  let ateliersHtml = "";
  jour.ateliers.forEach((at, idx) => {
    const meta = ATELIER_META[at.type];
    const txt = atelierTexte(at, jour.theme);
    const coche = checks.includes(idx);
    ateliersHtml += `<div class="atelier" style="border-top-color:${t.couleur}">
      <div class="haut">
        <span class="a-emoji">${meta.emoji}</span>
        <h3>${txt.titre}</h3>
        <span class="badge ${meta.badge}">${BADGE_TXT[meta.badge]}</span>
      </div>
      <div class="consigne">${txt.consigne}</div>
      <div class="parent">👩‍🏫 ${txt.parent}</div>
      <div class="repli">${txt.repli}</div>
      <div class="actions">
        ${meta.jouer ? `<button class="btn corail" data-jouer="${idx}">▶️ COMMENCER</button>` : ""}
        ${meta.print ? `<button class="btn jaune" data-print-at="${idx}">🖨️ IMPRIMER</button>` : ""}
        <label class="check ${coche ? "ok" : ""}" data-check="${idx}"><span class="box">${coche ? "✓" : ""}</span> FAIT</label>
      </div>
    </div>`;
  });

  vue.innerHTML = `
    <button class="btn gris no-print" id="retour">⬅️ LE CALENDRIER</button>
    <div class="jour-entete">
      <div class="theme-emoji">${t.emoji}</div>
      <h2>THÈME : ${t.nom}</h2>
      <div class="date-txt">${dateTxt}</div>
    </div>
    <div class="barre no-print">
      <button class="btn violet" id="imprimer-jour">🖨️ IMPRIMER TOUT LE PROGRAMME DU JOUR</button>
    </div>
    <div class="ateliers">${ateliersHtml}</div>
    <div class="mascotte">🐌<span class="bulle">${pick(ENCOURAGEMENTS, rngFor(date, "masc"))}</span></div>`;

  vue.querySelector("#retour").addEventListener("click", fermerJour);
  vue.querySelector("#imprimer-jour").addEventListener("click", () => imprimerJournee(date));
  vue.querySelectorAll("[data-jouer]").forEach(b => b.addEventListener("click", () => lancerAtelier(date, +b.dataset.jouer)));
  vue.querySelectorAll("[data-print-at]").forEach(b => b.addEventListener("click", () => imprimerAtelier(date, +b.dataset.printAt)));
  vue.querySelectorAll("[data-check]").forEach(l => l.addEventListener("click", () => toggleCheck(date, +l.dataset.check, l)));

  window.scrollTo(0, 0);
  if (date === TODAY) {
    setTimeout(() => parler("AUJOURD'HUI, C'EST " + JOURS_LONG[dObj.getDay()] + ". LE THÈME DU JOUR, C'EST " + t.nom.replace(/^(LE |LA |L'|LES )/, "")), 350);
  }
}

function fermerJour() {
  document.getElementById("jour-vue").classList.remove("actif");
  document.getElementById("accueil").style.display = "block";
  renderCalendrier();
}

function toggleCheck(date, idx, el) {
  const checks = getChecks(date);
  const i = checks.indexOf(idx);
  if (i >= 0) { checks.splice(i, 1); el.classList.remove("ok"); el.querySelector(".box").textContent = ""; }
  else {
    checks.push(idx); el.classList.add("ok"); el.querySelector(".box").textContent = "✓";
    parler(pick(["BRAVO !", "SUPER !", "TROP BIEN !", "GÉNIAL !"], mulberry32(Date.now() >>> 0)));
  }
  setChecks(date, checks);
}

/* ============================================================
   ÉDITEUR D'ÉVÉNEMENTS
   ============================================================ */
let evtEmojiSel = PALETTE_EVT[0];
function ouvrirEditeurEvenements(date) {
  const dObj = parseISO(date);
  const dateTxt = `${JOURS_LONG[dObj.getDay()]} ${dObj.getDate()} ${MOIS_NOM[dObj.getMonth()]}`;
  evtEmojiSel = PALETTE_EVT[0];
  const liste = EVENTS[date] || [];

  const html = `
    <h2>📌 ${dateTxt}</h2>
    <div class="instruction">CHOISIS UNE IMAGE ET ÉCRIS UN PETIT MOT</div>
    <div class="palette" id="palette">
      ${PALETTE_EVT.map((e, i) => `<button data-emoji="${e}" class="${i === 0 ? "sel" : ""}">${e}</button>`).join("")}
    </div>
    <input class="champ-txt" id="evt-txt" maxlength="16" placeholder="EX : PLAGE, MAMIE…" autocomplete="off">
    <div style="text-align:center"><button class="btn vert grand" id="evt-ajouter">➕ AJOUTER</button></div>
    <h3 style="text-align:center;color:#8A7358;margin-top:18px">CE JOUR-LÀ</h3>
    <div class="evt-liste" id="evt-liste">
      ${liste.length ? liste.map((e, i) => `<div class="evt-ligne"><span class="em">${e.emoji}</span><span class="tx">${escapeHtml(e.texte)}</span><button data-suppr="${i}">🗑️</button></div>`).join("") : '<div style="text-align:center;color:#8A7358">AUCUN ÉVÉNEMENT POUR L\'INSTANT.</div>'}
    </div>`;
  openModal(html);

  const modal = document.getElementById("modale-corps");
  modal.querySelectorAll("#palette button").forEach(b => b.addEventListener("click", () => {
    modal.querySelectorAll("#palette button").forEach(x => x.classList.remove("sel"));
    b.classList.add("sel"); evtEmojiSel = b.dataset.emoji;
  }));
  modal.querySelector("#evt-ajouter").addEventListener("click", () => {
    const v = modal.querySelector("#evt-txt").value.trim().toUpperCase();
    if (!v) { modal.querySelector("#evt-txt").focus(); return; }
    if (!EVENTS[date]) EVENTS[date] = [];
    EVENTS[date].push({ emoji: evtEmojiSel, texte: v });
    saveEvents();
    ouvrirEditeurEvenements(date);
  });
  modal.querySelectorAll("[data-suppr]").forEach(b => b.addEventListener("click", () => {
    EVENTS[date].splice(+b.dataset.suppr, 1);
    if (EVENTS[date].length === 0) delete EVENTS[date];
    saveEvents();
    ouvrirEditeurEvenements(date);
  }));
}

/* ============================================================
   MODALE
   ============================================================ */
function openModal(html) {
  const m = document.getElementById("modale");
  document.getElementById("modale-corps").innerHTML = html;
  m.classList.add("actif");
}
function closeModal() {
  document.getElementById("modale").classList.remove("actif");
  document.getElementById("modale-corps").innerHTML = "";
  if ("speechSynthesis" in window) speechSynthesis.cancel();
  if (openedDate) renderCalendrier();
}

/* ============================================================
   LANCEUR D'ATELIERS (écran)
   ============================================================ */
function lancerAtelier(date, idx) {
  const jour = DAYS[date];
  const at = jour.ateliers[idx];
  const theme = jour.theme;
  switch (at.type) {
    case "programme": jeuProgramme(date, jour); break;
    case "lecture": jeuLecture(date, theme); break;
    case "graphisme": jeuGraphisme(date, theme, at); break;
    case "relier": jeuRelier(date, theme, at); break;
    case "numeration": jeuNumeration(date, theme, at); break;
    case "logique": jeuLogique(date, theme, at); break;
    case "phono": jeuPhono(date, theme); break;
  }
}

/* ---------- PROGRAMME (écran) ---------- */
function jeuProgramme(date, jour) {
  const t = THEMES[jour.theme];
  const etapes = [
    { em: "📅", tx: "DIRE LA DATE DU JOUR" },
    { em: "📖", tx: "LE JARDIN DES SONS (LECTURE)" },
    { em: "✏️", tx: "L'ATELIER DU JOUR" },
    { em: "🧩", tx: "UN JEU MALIN OU DES SONS" },
    { em: "🌙", tx: "UNE HISTOIRE DU SOIR" }
  ];
  const key = "jdv-prog-" + date;
  let done = [];
  try { done = JSON.parse(localStorage.getItem(key) || "[]"); } catch (e) {}
  const html = `<h2>${t.emoji} MON PROGRAMME</h2>
    <div class="instruction">COCHE CHAQUE MOMENT QUAND C'EST FINI !</div>
    <div id="prog-liste">${etapes.map((e, i) => `
      <label class="check ${done.includes(i) ? "ok" : ""}" data-p="${i}" style="width:100%;max-width:520px;margin:8px auto;justify-content:flex-start;background:#fff;padding:12px 16px;border-radius:18px;box-shadow:var(--ombre)">
        <span class="box">${done.includes(i) ? "✓" : ""}</span>
        <span style="font-size:2rem">${e.em}</span>
        <span style="font-size:1.1rem;color:#4A3B2E">${e.tx}</span>
      </label>`).join("")}</div>
    <div class="mascotte">🐌</div>`;
  openModal(html);
  document.querySelectorAll("#prog-liste [data-p]").forEach(l => l.addEventListener("click", () => {
    const i = +l.dataset.p; const k = done.indexOf(i);
    if (k >= 0) { done.splice(k, 1); l.classList.remove("ok"); l.querySelector(".box").textContent = ""; }
    else { done.push(i); l.classList.add("ok"); l.querySelector(".box").textContent = "✓"; parler("BRAVO !"); }
    localStorage.setItem(key, JSON.stringify(done));
  }));
}

/* ---------- LECTURE : LE JARDIN DES SONS ---------- */
function jeuLecture(date, theme) {
  const rng = rngFor(date, "lecture");
  const items = THEMES[theme].items;
  const consonnes = items.filter(i => CONSONNES.includes(i.l));
  const etapes = [];
  // Round 1 : la lettre (3)
  sample(consonnes, Math.min(3, consonnes.length), rng).forEach(it => etapes.push({ jeu: "lettre", it }));
  // Round 2 : la syllabe (2)
  sample(consonnes, Math.min(2, consonnes.length), rng).forEach(it => etapes.push({ jeu: "syllabe", it }));
  // Round 3 : le mot (3)
  sample(items, Math.min(3, items.length), rng).forEach(it => etapes.push({ jeu: "mot", it }));

  let pos = 0;
  function rendre() {
    if (pos >= etapes.length) { finLecture(theme); return; }
    const e = etapes[pos];
    const prog = `<div class="progres-jeu">${"⭐".repeat(pos)}${"◽".repeat(etapes.length - pos)}</div>`;
    if (e.jeu === "lettre") return roundLettre(e.it, prog, rng, items);
    if (e.jeu === "syllabe") return roundSyllabe(e.it, prog, rng);
    return roundMot(e.it, prog, rng, items);
  }
  function suivant() { pos++; rendre(); }

  function roundLettre(it, prog, rng2, all) {
    const autres = CONSONNES.filter(c => c !== it.l);
    const choix = shuffle([it.l, ...sample(autres, 2, rng2)], rng2);
    openModal(`${prog}<h2>QUELLE LETTRE ?</h2>
      <span class="grand-emoji">${it.emoji}</span>
      <div class="instruction">🔊 « ${it.l} » COMME ${it.mot}</div>
      <div class="choix-lettres">${choix.map(c => `<button class="choix-lettre" data-l="${c}">${c}</button>`).join("")}</div>
      <div style="text-align:center"><button class="btn turquoise" id="reecoute">🔊 RÉÉCOUTER</button></div>`);
    parler(it.l + " COMME " + it.mot);
    document.getElementById("reecoute").addEventListener("click", () => parler(it.l + " COMME " + it.mot));
    document.querySelectorAll(".choix-lettre").forEach(b => b.addEventListener("click", () => {
      if (b.dataset.l === it.l) { b.classList.add("bon"); parler("OUI ! " + it.l + " COMME " + it.mot); setTimeout(suivant, 900); }
      else { b.classList.add("faux"); parler("ESSAIE ENCORE"); setTimeout(() => b.classList.remove("faux"), 500); }
    }));
  }

  function roundSyllabe(it, prog, rng2) {
    const voy = shuffle(VOYELLES.slice(), rng2).slice(0, 3);
    openModal(`${prog}<h2>FABRIQUE UNE SYLLABE</h2>
      <span class="grand-emoji">${it.emoji}</span>
      <div class="instruction">APPUIE SUR UNE VOYELLE POUR ENTENDRE LA SYLLABE</div>
      <div class="syllabe-zone">
        <div class="syllabe-bloc plein">${it.l}</div>
        <div class="syllabe-bloc" id="voy">?</div>
        <div style="font-size:2rem">=</div>
        <div class="syllabe-bloc" id="res">?</div>
      </div>
      <div class="choix-lettres">${voy.map(v => `<button class="choix-lettre" data-v="${v}">${v}</button>`).join("")}</div>
      <div style="text-align:center"><button class="btn vert grand" id="ok-syl">✅ C'EST BON</button></div>`);
    let choisi = false;
    document.querySelectorAll("[data-v]").forEach(b => b.addEventListener("click", () => {
      choisi = true;
      const syl = it.l + b.dataset.v;
      document.getElementById("voy").textContent = b.dataset.v;
      document.getElementById("res").textContent = syl;
      document.getElementById("res").classList.add("plein");
      document.querySelectorAll("[data-v]").forEach(x => x.classList.remove("bon"));
      b.classList.add("bon");
      parler(syl, 0.75);
    }));
    document.getElementById("ok-syl").addEventListener("click", () => { if (choisi) suivant(); else parler("CHOISIS UNE VOYELLE"); });
  }

  function roundMot(it, prog, rng2, all) {
    const autres = all.filter(x => x.emoji !== it.emoji);
    const choix = shuffle([it, ...sample(autres, 2, rng2)], rng2);
    openModal(`${prog}<h2>TROUVE LE MOT</h2>
      <div class="mot-affiche">${surlignePremiere(it.mot)}</div>
      <div class="instruction">🔊 QUELLE IMAGE VA AVEC CE MOT ?</div>
      <div class="choix-images">${choix.map(c => `<button class="choix-image" data-m="${c.mot}">${c.emoji}</button>`).join("")}</div>
      <div style="text-align:center"><button class="btn turquoise" id="reecoute2">🔊 RÉÉCOUTER</button></div>`);
    parler(it.mot);
    document.getElementById("reecoute2").addEventListener("click", () => parler(it.mot));
    document.querySelectorAll(".choix-image").forEach(b => b.addEventListener("click", () => {
      if (b.dataset.m === it.mot) { b.classList.add("bon"); parler("BRAVO ! " + it.mot); setTimeout(suivant, 900); }
      else { b.classList.add("faux"); parler("NON, CHERCHE ENCORE"); setTimeout(() => b.classList.remove("faux"), 500); }
    }));
  }
  rendre();
}
function surlignePremiere(mot) { return `<span class="surligne">${mot[0]}</span>${mot.slice(1)}`; }
function finLecture(theme) {
  openModal(`<h2>🎉 SUPER TRAVAIL !</h2>
    <span class="grand-emoji">🐌</span>
    <div class="instruction">TU AS FINI LE JARDIN DES SONS !<br>BRAVO CHAMPION !</div>
    <div style="text-align:center"><button class="btn corail grand" onclick="closeModal()">👍 TERMINER</button></div>`);
  parler("BRAVO ! TU AS FINI LE JARDIN DES SONS !");
}

/* ---------- GRAPHISME (écran : tracé au doigt) ---------- */
function jeuGraphisme(date, theme, at) {
  const t = THEMES[theme];
  const svg = graphismeSVG(at.motif, t, 3);
  openModal(`<h2>✏️ JE TRACE ${MOTIF_LABEL[at.motif] || ""}</h2>
    <div class="instruction">REPASSE SUR LES POINTILLÉS AVEC TON DOIGT !</div>
    <div class="trace-wrap" id="tw">${svg}<canvas id="trace-canvas"></canvas></div>
    <div class="barre"><button class="btn jaune" id="effacer">🧽 EFFACER</button>
      <button class="btn violet" onclick="window.print()">🖨️ IMPRIMER LA FICHE</button></div>`);
  setupTrace(t.couleur, date, at);
}
function setupTrace(couleur, date, at) {
  const wrap = document.getElementById("tw");
  const canvas = document.getElementById("trace-canvas");
  const svg = wrap.querySelector("svg");
  function resize() {
    const r = svg.getBoundingClientRect();
    canvas.width = r.width; canvas.height = r.height;
    canvas.style.width = r.width + "px"; canvas.style.height = r.height + "px";
  }
  setTimeout(resize, 50);
  window.addEventListener("resize", resize);
  const ctx = canvas.getContext("2d");
  ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.lineWidth = 10; ctx.strokeStyle = couleur;
  let dessine = false;
  function pos(e) {
    const r = canvas.getBoundingClientRect();
    const p = e.touches ? e.touches[0] : e;
    return { x: p.clientX - r.left, y: p.clientY - r.top };
  }
  function down(e) { dessine = true; const { x, y } = pos(e); ctx.beginPath(); ctx.moveTo(x, y); e.preventDefault(); }
  function move(e) { if (!dessine) return; const { x, y } = pos(e); ctx.lineTo(x, y); ctx.stroke(); e.preventDefault(); }
  function up() { dessine = false; }
  canvas.addEventListener("pointerdown", down); canvas.addEventListener("pointermove", move);
  window.addEventListener("pointerup", up);
  document.getElementById("effacer").addEventListener("click", () => ctx.clearRect(0, 0, canvas.width, canvas.height));
  // impression : construit la fiche graphisme
  window.__printFiche = ficheGraphisme(date, at);
}

/* ---------- RELIER (écran) ---------- */
function jeuRelier(date, theme, at) {
  const rng = rngFor(date, "relier" + at.variante);
  const paires = construireePaires(theme, at, rng);
  const gauche = paires.map(p => p.g);
  const droite = shuffle(paires.map((p, i) => ({ ...p.d, id: i })), rng);

  const html = `<h2>🔗 JE RELIE</h2>
    <div class="instruction">TAPE UNE IMAGE À GAUCHE, PUIS SA PAIRE À DROITE !</div>
    <div class="relier-zone" id="rz">
      <svg class="relier-svg" id="rsvg"></svg>
      <div class="relier-col" id="colG">${gauche.map((g, i) => tuileHtml(g, i, "g")).join("")}</div>
      <div class="relier-col" id="colD">${droite.map((d) => tuileHtml(d, d.id, "d")).join("")}</div>
    </div>
    <div class="progres-jeu" id="rprog"></div>`;
  openModal(html);

  let selG = null, faits = 0;
  const svg = document.getElementById("rsvg");
  const zone = document.getElementById("rz");
  function trace(elA, elB, ok) {
    const rz = zone.getBoundingClientRect();
    const a = elA.getBoundingClientRect(), b = elB.getBoundingClientRect();
    const l = document.createElementNS("http://www.w3.org/2000/svg", "line");
    l.setAttribute("x1", a.right - rz.left); l.setAttribute("y1", a.top + a.height / 2 - rz.top);
    l.setAttribute("x2", b.left - rz.left); l.setAttribute("y2", b.top + b.height / 2 - rz.top);
    l.setAttribute("stroke", ok ? "#7FB03C" : "#FF6F5E"); l.setAttribute("stroke-width", "6"); l.setAttribute("stroke-linecap", "round");
    svg.appendChild(l);
  }
  document.querySelectorAll('#colG .relier-tuile').forEach(el => el.addEventListener("click", () => {
    if (el.classList.contains("lie")) return;
    document.querySelectorAll('#colG .relier-tuile').forEach(x => x.classList.remove("selection"));
    el.classList.add("selection"); selG = el;
  }));
  document.querySelectorAll('#colD .relier-tuile').forEach(el => el.addEventListener("click", () => {
    if (!selG || el.classList.contains("lie")) return;
    if (selG.dataset.id === el.dataset.id) {
      selG.classList.remove("selection"); selG.classList.add("lie"); el.classList.add("lie");
      trace(selG, el, true); faits++; parler("BRAVO !");
      document.getElementById("rprog").textContent = "⭐".repeat(faits) + "◽".repeat(paires.length - faits);
      selG = null;
      if (faits === paires.length) { parler("SUPER ! TU AS TOUT RELIÉ !"); setTimeout(() => finGeneric("TU AS TOUT RELIÉ !"), 700); }
    } else { el.classList.add("faux"); parler("NON, ESSAIE ENCORE"); setTimeout(() => el.classList.remove("faux"), 450); }
  }));
}
function tuileHtml(o, id, cote) {
  const cls = o.ombre ? "relier-tuile ombre" : "relier-tuile";
  const contenu = o.mot ? `<span class="mot-txt">${o.mot}</span>` : (o.dots !== undefined ? dotsHtml(o.dots) : (o.chiffre !== undefined ? o.chiffre : o.emoji));
  return `<div class="${cls}" data-id="${id}">${contenu}</div>`;
}
function dotsHtml(n) { return `<span style="font-size:1.4rem">${"🔵".repeat(n)}</span>`; }
function construireePaires(theme, at, rng) {
  const items = THEMES[theme].items;
  const n = at.paires;
  if (at.variante === "nombre-points") {
    const nums = sample([...Array(9).keys()].map(x => x + 1), n, rng);
    return nums.map(x => ({ g: { chiffre: x }, d: { dots: x } }));
  }
  if (at.variante === "image-ombre") {
    return sample(items, n, rng).map(it => ({ g: { emoji: it.emoji }, d: { emoji: it.emoji, ombre: true } }));
  }
  // mot-image (et forme-objet)
  return sample(items, n, rng).map(it => ({ g: { mot: it.mot }, d: { emoji: it.emoji } }));
}

/* ---------- NUMÉRATION (écran, aide graduée) ---------- */
function jeuNumeration(date, theme, at) {
  const rng = rngFor(date, "num");
  const items = THEMES[theme].items;
  const emoji = pick(items, rng).emoji;
  const max = at.max;
  const questions = [];
  // Q1 dénombrer
  const k1 = 3 + Math.floor(rng() * (max - 3));
  questions.push({ type: "denombrer", n: k1 });
  // Q2 chiffre -> quantité
  const k2 = 2 + Math.floor(rng() * (max - 2));
  questions.push({ type: "chiffre", n: k2 });
  // Q3 bande (nombre manquant)
  const debut = 1 + Math.floor(rng() * Math.max(1, max - 6));
  questions.push({ type: "bande", debut, trou: debut + 2 + Math.floor(rng() * 3) });
  // Q4 un de plus / un de moins
  const k4 = 2 + Math.floor(rng() * (max - 2));
  questions.push({ type: "plusmoins", n: k4, plus: rng() > 0.5 });

  let pos = 0;
  function suivant() { pos++; pos < questions.length ? rendre() : finGeneric("TU AS TOUT COMPTÉ, BRAVO !"); }
  function choixNb(bon, rng2) {
    const set = new Set([bon]);
    while (set.size < 3) { const c = Math.max(1, bon + (Math.floor(rng2() * 5) - 2)); if (c !== bon && c <= max + 2) set.add(c); }
    return shuffle([...set], rng2);
  }
  function rendre() {
    const q = questions[pos];
    const prog = `<div class="progres-jeu">${"⭐".repeat(pos)}${"◽".repeat(questions.length - pos)}</div>`;
    if (q.type === "denombrer") {
      const objs = `<div class="num-objets" id="objs">${Array.from({ length: q.n }, () => `<span>${emoji}</span>`).join("")}</div>`;
      const choix = choixNb(q.n, rng);
      openModal(`${prog}<h2>COMBIEN Y EN A-T-IL ?</h2>${objs}
        <div class="num-choix">${choix.map(c => `<button class="num-btn" data-n="${c}">${c}</button>`).join("")}</div>
        ${aideBtn()}`);
      brancherChoix(q.n);
      brancherAide(() => aideDenombrer(q.n));
    } else if (q.type === "chiffre") {
      const bonnes = q.n;
      const groupes = shuffle([bonnes, Math.max(1, bonnes + 1), Math.max(1, bonnes - 1)], rng);
      openModal(`${prog}<h2>MONTRE LE NOMBRE : <span style="color:#FF6F5E">${bonnes}</span></h2>
        <div class="instruction">QUEL GROUPE A ${bonnes} IMAGES ?</div>
        <div class="num-choix">${groupes.map(g => `<button class="num-btn" data-n="${g}" style="width:auto;height:auto;padding:10px;font-size:1.5rem;max-width:220px">${emoji.repeat(g)}</button>`).join("")}</div>
        ${aideBtn()}`);
      brancherChoix(bonnes);
      brancherAide(() => parler("COMPTE LES IMAGES DE CHAQUE GROUPE : 1, 2, 3…"));
    } else if (q.type === "bande") {
      let cells = "";
      for (let x = q.debut; x < q.debut + 6; x++) cells += x === q.trou ? `<div class="cell trou">?</div>` : `<div class="cell">${x}</div>`;
      const choix = choixNb(q.trou, rng);
      openModal(`${prog}<h2>QUEL NOMBRE MANQUE ?</h2>
        <div class="bande">${cells}</div>
        <div class="num-choix">${choix.map(c => `<button class="num-btn" data-n="${c}">${c}</button>`).join("")}</div>
        ${aideBtn()}`);
      brancherChoix(q.trou);
      brancherAide(() => parler("RÉCITE LA SUITE DES NOMBRES : " + q.debut + ", " + (q.debut + 1) + "… QUEL NOMBRE MANQUE ?"));
    } else {
      const bon = q.plus ? q.n + 1 : q.n - 1;
      const choix = choixNb(bon, rng);
      openModal(`${prog}<h2>${q.plus ? "UN DE PLUS" : "UN DE MOINS"} QUE ${q.n} ?</h2>
        <div class="num-objets">${Array.from({ length: q.n }, () => `<span>${emoji}</span>`).join("")}</div>
        <div class="num-choix">${choix.map(c => `<button class="num-btn" data-n="${c}">${c}</button>`).join("")}</div>
        ${aideBtn()}`);
      brancherChoix(bon);
      brancherAide(() => parler(q.plus ? "UN DE PLUS, C'EST LE NOMBRE JUSTE APRÈS." : "UN DE MOINS, C'EST LE NOMBRE JUSTE AVANT."));
    }
  }
  function brancherChoix(bon) {
    document.querySelectorAll(".num-btn").forEach(b => b.addEventListener("click", () => {
      if (+b.dataset.n === bon) { b.classList.add("bon"); parler("BRAVO ! " + bon); setTimeout(suivant, 850); }
      else { b.classList.add("faux"); parler("ESSAIE ENCORE"); setTimeout(() => b.classList.remove("faux"), 450); }
    }));
  }
  let aideNiv = 0;
  function aideBtn() { return `<div class="aide-zone"><button class="btn jaune grand" id="aide">💡 AIDE</button><div id="aide-box"></div></div>`; }
  function brancherAide(extra) {
    aideNiv = 0;
    document.getElementById("aide").addEventListener("click", () => {
      aideNiv++;
      const box = document.getElementById("aide-box");
      if (aideNiv === 1) {
        let bande = '<div class="bande" style="margin-top:10px">';
        for (let x = 1; x <= max; x++) bande += `<div class="cell" style="min-width:32px;height:40px;font-size:1.1rem">${x}</div>`;
        bande += "</div>";
        box.innerHTML = "<div style='font-weight:800;color:#8A7358'>VOICI LA BANDE DES NOMBRES :</div>" + bande;
        parler("VOICI LA BANDE DES NOMBRES. TU PEUX T'AIDER.");
      } else if (aideNiv === 2) {
        if (extra) extra();
        aideCompter();
      } else {
        box.innerHTML += "<div style='font-weight:800;color:#E9503F;margin-top:8px'>APPUIE SUR LA BONNE RÉPONSE (ELLE CLIGNOTE) 👇</div>";
        const bon = document.querySelector(".num-btn");
        document.querySelectorAll(".num-btn").forEach(b => { if (b.dataset.n && +b.dataset.n === trouverBon()) b.style.animation = "halo 1s infinite"; });
      }
    });
  }
  function trouverBon() {
    const q = questions[pos];
    if (q.type === "denombrer") return q.n;
    if (q.type === "chiffre") return q.n;
    if (q.type === "bande") return q.trou;
    return q.plus ? q.n + 1 : q.n - 1;
  }
  function aideDenombrer(n) {
    const objs = document.querySelectorAll("#objs span");
    let i = 0;
    const timer = setInterval(() => {
      if (i > 0) objs[i - 1].classList.remove("compte");
      if (i >= objs.length) { clearInterval(timer); return; }
      objs[i].classList.add("compte"); parler(String(i + 1)); i++;
    }, 650);
  }
  function aideCompter() {
    const box = document.getElementById("aide-box");
    box.innerHTML += "<div style='font-weight:800;color:#8A7358;margin-top:8px'>ON COMPTE ENSEMBLE, UN PAR UN 👆</div>";
    const objs = document.querySelectorAll(".num-objets span, #objs span");
    let i = 0;
    const timer = setInterval(() => {
      if (i > 0 && objs[i - 1]) objs[i - 1].classList.remove("compte");
      if (i >= objs.length) { clearInterval(timer); return; }
      objs[i].classList.add("compte"); parler(String(i + 1)); i++;
    }, 650);
  }
  rendre();
}

/* ---------- LOGIQUE (écran) ---------- */
function jeuLogique(date, theme, at) {
  const rng = rngFor(date, "logique");
  const items = THEMES[theme].items;
  const variante = at.variante === "suite" ? "suite" : "intrus";
  if (variante === "suite") {
    const deux = sample(items, 2, rng);
    const motif = at.longueur >= 8 && rng() > 0.5 ? [deux[0], deux[1], deux[0]] : [deux[0], deux[1]];
    const seq = [];
    for (let i = 0; i < at.longueur; i++) seq.push(motif[i % motif.length]);
    const bon = seq[seq.length - 1];
    const affiche = seq.slice(0, -1);
    const choix = shuffle([bon, ...sample(items.filter(x => x !== bon), 2, rng)], rng);
    openModal(`<h2>🧩 QU'EST-CE QUI VIENT APRÈS ?</h2>
      <div class="suite-zone">${affiche.map(e => `<span class="el">${e.emoji}</span>`).join("")}<div class="trou">?</div></div>
      <div class="instruction">CONTINUE LA SUITE !</div>
      <div class="choix-images">${choix.map(c => `<button class="choix-image" data-e="${c.emoji}">${c.emoji}</button>`).join("")}</div>`);
    parler("QU'EST-CE QUI VIENT APRÈS DANS LA SUITE ?");
    document.querySelectorAll(".choix-image").forEach(b => b.addEventListener("click", () => {
      if (b.dataset.e === bon.emoji) { b.classList.add("bon"); parler("BRAVO !"); setTimeout(() => finGeneric("TU AS TROUVÉ LA SUITE !"), 700); }
      else { b.classList.add("faux"); parler("REGARDE BIEN LA SUITE"); setTimeout(() => b.classList.remove("faux"), 450); }
    }));
  } else {
    // intrus : 3 du thème + 1 d'un autre thème
    const autresThemes = Object.keys(THEMES).filter(k => k !== theme);
    const autreTheme = pick(autresThemes, rng);
    const bons = sample(items, 3, rng);
    const intrus = pick(THEMES[autreTheme].items, rng);
    const grille = shuffle([...bons.map(b => ({ e: b.emoji, intrus: false })), { e: intrus.emoji, intrus: true }], rng);
    openModal(`<h2>🧩 TROUVE L'INTRUS</h2>
      <div class="instruction">QUELLE IMAGE N'EST PAS COMME LES AUTRES ?</div>
      <div class="choix-images">${grille.map(g => `<button class="choix-image" data-i="${g.intrus}">${g.e}</button>`).join("")}</div>`);
    parler("TROUVE L'INTRUS. QUELLE IMAGE N'EST PAS COMME LES AUTRES ?");
    document.querySelectorAll(".choix-image").forEach(b => b.addEventListener("click", () => {
      if (b.dataset.i === "true") { b.classList.add("bon"); parler("BRAVO ! C'ÉTAIT L'INTRUS !"); setTimeout(() => finGeneric("TU AS TROUVÉ L'INTRUS !"), 700); }
      else { b.classList.add("faux"); parler("NON, CELUI-LÀ VA AVEC LES AUTRES"); setTimeout(() => b.classList.remove("faux"), 450); }
    }));
  }
}

/* ---------- PHONO (écran, oral) ---------- */
function jeuPhono(date, theme) {
  const rng = rngFor(date, "phono");
  const items = THEMES[theme].items;
  const mots = sample(items, 5, rng);
  const html = `<h2>👂 JEUX DE SONS</h2>
    <div class="instruction">TAPE UNE IMAGE POUR ENTENDRE ET COMPTER LES SYLLABES 👏</div>
    <div class="choix-images">${mots.map(m => `<button class="choix-image" data-mot="${m.mot}" data-em="${m.emoji}">${m.emoji}</button>`).join("")}</div>
    <div id="phono-res" style="text-align:center;min-height:120px"></div>
    <div class="instruction" style="color:#8A7358;font-size:.95rem">🔊 Écoute, tape dans tes mains pour chaque morceau, puis trouve le 1er son !</div>`;
  openModal(html);
  document.querySelectorAll("[data-mot]").forEach(b => b.addEventListener("click", () => {
    const mot = b.dataset.mot, em = b.dataset.em;
    const nb = compterSyllabes(mot);
    const res = document.getElementById("phono-res");
    res.innerHTML = `<div style="font-size:4rem">${em}</div>
      <div class="mot-affiche">${surlignePremiere(mot)}</div>
      <div style="font-size:2.2rem">${"👏".repeat(nb)}</div>
      <div style="font-weight:800;color:#7FB03C">${nb} SYLLABE${nb > 1 ? "S" : ""}</div>
      <div style="font-weight:800;color:#FF6F5E">1ER SON : « ${mot[0]} »</div>`;
    parler(mot, 0.7);
    setTimeout(() => parler(mot[0] + " comme " + mot), 900);
  }));
}
function compterSyllabes(mot) {
  const v = mot.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  let groupes = (v.match(/[aeiouy]+/g) || []).length;
  if (v.length > 2 && /e$/.test(v) && groupes > 1) groupes--; // e final muet
  return Math.max(1, groupes);
}

/* ---------- Fin générique ---------- */
function finGeneric(msg) {
  openModal(`<h2>🎉 BRAVO !</h2><span class="grand-emoji">🐌</span>
    <div class="instruction">${msg}</div>
    <div style="text-align:center"><button class="btn corail grand" onclick="closeModal()">👍 TERMINER</button></div>`);
  parler("BRAVO !");
}

/* ============================================================
   GRAPHISME — Génération SVG (écran + impression)
   ============================================================ */
function graphismeSVG(motif, theme, rows) {
  const W = 700, H = 190, top = 60;
  let inner = "";
  for (let r = 0; r < rows; r++) {
    const y = top + r * ((H - 40));
    inner += `<text x="14" y="${y + 8}" font-size="34">${theme.decor}</text>`;
    inner += `<circle cx="52" cy="${y}" r="8" fill="#FF6F5E"/>`; // point de départ
    const d = motifPath(motif, y, W);
    if (motif === "ronds") inner += rondsRow(y, W);
    else if (motif === "spirales") inner += spiralesRow(y, W);
    else inner += `<path d="${d}" fill="none" stroke="#2FBFB3" stroke-width="5" stroke-dasharray="3 12" stroke-linecap="round"/>`;
    inner += `<text x="${W - 44}" y="${y + 10}" font-size="30">${theme.emoji}</text>`;
  }
  const totalH = top + rows * (H - 40);
  return `<svg viewBox="0 0 ${W} ${totalH + 20}" xmlns="http://www.w3.org/2000/svg" role="img">${inner}</svg>`;
}
function motifPath(motif, y, W) {
  const x0 = 66, x1 = W - 60;
  if (motif === "traits") return `M${x0} ${y} H${x1}`;
  if (motif === "ponts") { let d = `M${x0} ${y}`; for (let x = x0; x <= x1; x += 3) { const t = (x - x0) / 60 * Math.PI; d += ` L${x.toFixed(1)} ${(y - 34 * Math.abs(Math.sin(t))).toFixed(1)}`; } return d; }
  if (motif === "vagues") { let d = `M${x0} ${y}`; for (let x = x0; x <= x1; x += 3) { const t = (x - x0) / 70 * Math.PI * 2; d += ` L${x.toFixed(1)} ${(y - 26 * Math.sin(t)).toFixed(1)}`; } return d; }
  if (motif === "creneaux") { let d = `M${x0} ${y}`; for (let x = x0; x <= x1; x += 3) { const t = Math.sin((x - x0) / 46 * Math.PI * 2); d += ` L${x.toFixed(1)} ${(y - 30 * (t > 0 ? 1 : 0)).toFixed(1)}`; } return d; }
  if (motif === "boucles") { let d = `M${x0} ${y}`; const w = 70; for (let x = x0; x < x1; x += w) { d += ` C${x + w * 0.85} ${y - 46}, ${x - w * 0.15} ${y - 46}, ${x + w} ${y}`; } return d; }
  return `M${x0} ${y} H${x1}`;
}
function rondsRow(y, W) {
  let s = ""; for (let cx = 90; cx < W - 60; cx += 84) s += `<circle cx="${cx}" cy="${y - 14}" r="28" fill="none" stroke="#2FBFB3" stroke-width="5" stroke-dasharray="3 12"/>`; return s;
}
function spiralesRow(y, W) {
  let s = "";
  for (let cx = 100; cx < W - 70; cx += 130) {
    let d = ""; const cy = y - 14, turns = 2.4, maxR = 30;
    for (let a = 0; a <= turns * 2 * Math.PI; a += 0.25) { const r = maxR * a / (turns * 2 * Math.PI); const x = cx + r * Math.cos(a); const yy = cy + r * Math.sin(a); d += (d ? " L" : "M") + x.toFixed(1) + " " + yy.toFixed(1); }
    s += `<path d="${d}" fill="none" stroke="#2FBFB3" stroke-width="5" stroke-dasharray="3 11" stroke-linecap="round"/>`;
  }
  return s;
}

/* ============================================================
   DÉCOUPAGE — SVG
   ============================================================ */
function decoupageSVG(theme, forme) {
  const t = THEMES[theme];
  const W = 620, H = 420;
  let cut;
  if (forme === "droite") {
    cut = `<rect x="90" y="70" width="440" height="280" rx="14" fill="none" stroke="#4A3B2E" stroke-width="4" stroke-dasharray="14 10"/>`;
  } else {
    let d = "M310 60 "; for (let a = 0; a <= 360; a += 6) { const rad = (a) * Math.PI / 180; const rr = 150 + 16 * Math.sin(a / 30); const x = 310 + rr * Math.cos(rad); const y = 210 + rr * 0.62 * Math.sin(rad); d += `L${x.toFixed(0)} ${y.toFixed(0)} `; }
    cut = `<path d="${d}Z" fill="none" stroke="#4A3B2E" stroke-width="4" stroke-dasharray="14 10"/>`;
  }
  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img">
    <text x="${W / 2}" y="255" font-size="150" text-anchor="middle">${t.emoji}</text>
    ${cut}
    <text x="76" y="70" font-size="34">✂️</text>
  </svg>`;
}

/* ============================================================
   IMPRESSION — construction des fiches
   ============================================================ */
function enteteFiche(date, titre) {
  const jour = DAYS[date]; const t = THEMES[jour.theme];
  const dObj = parseISO(date);
  return `<h1>${titre}</h1><div class="theme-line">${t.emoji} ${t.nom} — ${JOURS_LONG[dObj.getDay()]} ${dObj.getDate()} ${MOIS_NOM[dObj.getMonth()]}</div>`;
}

function ficheGraphisme(date, at) {
  const jour = DAYS[date]; const t = THEMES[jour.theme];
  return `<div class="fiche">${enteteFiche(date, "JE TRACE " + (MOTIF_LABEL[at.motif] || ""))}
    <div class="consigne-print"><span class="em">✏️</span> REPASSE SUR LES POINTILLÉS</div>
    ${graphismeSVG(at.motif, t, 5)}</div>`;
}
function ficheDecoupage(date, at) {
  return `<div class="fiche">${enteteFiche(date, "JE DÉCOUPE")}
    <div class="consigne-print"><span class="em">✂️</span> DÉCOUPE EN SUIVANT LES POINTILLÉS</div>
    ${decoupageSVG(DAYS[date].theme, at.forme)}</div>`;
}
function ficheRelier(date, at) {
  const rng = rngFor(date, "relier" + at.variante);
  const paires = construireePaires(DAYS[date].theme, at, rng);
  const gauche = paires.map(p => p.g);
  const droite = shuffle(paires.map(p => p.d), rng);
  const cellu = (o) => o.mot ? `<span class="mt">${o.mot}</span>` : (o.dots !== undefined ? "🔵".repeat(o.dots) : (o.chiffre !== undefined ? o.chiffre : (o.ombre ? `<span style="filter:brightness(0)">${o.emoji}</span>` : o.emoji)));
  return `<div class="fiche">${enteteFiche(date, "JE RELIE")}
    <div class="consigne-print"><span class="em">🔗</span> RELIE CHAQUE PAIRE AVEC UN TRAIT</div>
    <div class="fiche-relier">
      <div class="col">${gauche.map(g => `<div class="tuile">${cellu(g)}</div>`).join("")}</div>
      <div class="col">${droite.map(d => `<div class="tuile">${cellu(d)}</div>`).join("")}</div>
    </div></div>`;
}
function ficheNumeration(date, at) {
  const rng = rngFor(date, "num-print");
  const emoji = pick(THEMES[DAYS[date].theme].items, rng).emoji;
  const lignes = sample([...Array(at.max).keys()].map(x => x + 1).filter(x => x >= 3), 3, rng);
  let blocs = lignes.map(n => `<div style="margin:12pt 0"><div class="fiche-num-objets">${emoji.repeat(n)}</div>
    <div style="font-size:18pt;font-weight:bold">COMBIEN ? <span style="display:inline-block;width:60pt;height:44pt;border:3pt solid #000;border-radius:8pt"></span></div></div>`).join("");
  // bande à trous
  const debut = 1;
  let bande = "";
  for (let x = debut; x <= at.max; x++) { const trou = (x % 3 === 0); bande += `<span style="display:inline-block;min-width:40pt;height:44pt;line-height:44pt;border:2.5pt solid #000;margin:2pt;font-size:18pt;font-weight:bold">${trou ? "" : x}</span>`; }
  return `<div class="fiche">${enteteFiche(date, "JE COMPTE JUSQU'À " + at.max)}
    <div class="consigne-print"><span class="em">🔢</span> COMPTE ET ÉCRIS LE NOMBRE</div>
    ${blocs}
    <div class="consigne-print" style="margin-top:16pt">COMPLÈTE LA BANDE DES NOMBRES</div>
    <div style="line-height:2.4">${bande}</div></div>`;
}
function ficheLogique(date, at) {
  const rng = rngFor(date, "logique-print");
  const items = THEMES[DAYS[date].theme].items;
  if (at.variante === "suite") {
    const deux = sample(items, 2, rng);
    let seq = ""; for (let i = 0; i < at.longueur - 1; i++) seq += `<span class="print-emoji">${[deux[0], deux[1]][i % 2].emoji}</span>`;
    return `<div class="fiche">${enteteFiche(date, "JE CONTINUE LA SUITE")}
      <div class="consigne-print"><span class="em">🧩</span> DESSINE CE QUI VIENT APRÈS</div>
      <div>${seq}<span style="display:inline-block;width:80pt;height:80pt;border:3pt dashed #000;border-radius:12pt;vertical-align:middle"></span></div></div>`;
  }
  const autre = pick(Object.keys(THEMES).filter(k => k !== DAYS[date].theme), rng);
  const grille = shuffle([...sample(items, 3, rng).map(x => x.emoji), pick(THEMES[autre].items, rng).emoji], rng);
  return `<div class="fiche">${enteteFiche(date, "JE TROUVE L'INTRUS")}
    <div class="consigne-print"><span class="em">🧩</span> ENTOURE L'INTRUS</div>
    <div>${grille.map(e => `<span class="print-emoji" style="margin:20pt">${e}</span>`).join("")}</div></div>`;
}
function fichePhono(date) {
  const rng = rngFor(date, "phono-print");
  const mots = sample(THEMES[DAYS[date].theme].items, 5, rng);
  return `<div class="fiche">${enteteFiche(date, "JEUX DE SONS (PARENT)")}
    <div class="consigne-print"><span class="em">👂</span> À FAIRE À L'ORAL, SANS RIEN</div>
    <div class="fiche-prog">
      <div class="ligne"><span class="em">👏</span> TAPE LES SYLLABES DE CHAQUE MOT</div>
      <div class="ligne"><span class="em">🔤</span> QUEL EST LE PREMIER SON ?</div>
      <div class="ligne"><span class="em">🎵</span> TROUVE DEUX MOTS QUI RIMENT</div>
    </div>
    <div style="margin-top:14pt;font-size:34pt">${mots.map(m => m.emoji).join("  ")}</div>
    <div style="font-size:16pt;margin-top:8pt">${mots.map(m => m.mot).join(" · ")}</div></div>`;
}
function ficheProgramme(date) {
  const jour = DAYS[date];
  const etapes = [
    { em: "📅", tx: "DIRE LA DATE" }, { em: "📖", tx: "LE JARDIN DES SONS" },
    { em: "✏️", tx: "L'ATELIER DU JOUR" }, { em: "🧩", tx: "UN JEU MALIN / DES SONS" }, { em: "🌙", tx: "L'HISTOIRE DU SOIR" }
  ];
  const evts = (EVENTS[date] || []).map(e => `${e.emoji} ${e.texte}`).join("   ");
  return `<div class="fiche">${enteteFiche(date, "MON PROGRAMME DU JOUR")}
    ${evts ? `<div class="consigne-print">📌 ${evts}</div>` : ""}
    <div class="fiche-prog">${etapes.map(e => `<div class="ligne"><span class="em">${e.em}</span> ${e.tx}<span class="cc"></span></div>`).join("")}</div></div>`;
}

function ficheDe(date, at) {
  switch (at.type) {
    case "programme": return ficheProgramme(date);
    case "graphisme": return ficheGraphisme(date, at);
    case "decoupage": return ficheDecoupage(date, at);
    case "relier": return ficheRelier(date, at);
    case "numeration": return ficheNumeration(date, at);
    case "logique": return ficheLogique(date, at);
    case "phono": return fichePhono(date);
    default: return "";
  }
}

function imprimerAtelier(date, idx) {
  const at = DAYS[date].ateliers[idx];
  document.getElementById("zone-print").innerHTML = ficheDe(date, at);
  window.print();
}
function imprimerJournee(date) {
  const jour = DAYS[date];
  const fiches = jour.ateliers.filter(a => ATELIER_META[a.type].print).map(a => ficheDe(date, a)).join("");
  document.getElementById("zone-print").innerHTML = fiches;
  window.print();
}

/* ---------- Impression du CALENDRIER de l'été ---------- */
function imprimerCalendrier() {
  const mois = [{ a: 2026, m: 6 }, { a: 2026, m: 7 }];
  let html = "";
  const noms = JOURS_COURT.slice(1).concat(JOURS_COURT[0]);
  for (const { a, m } of mois) {
    html += `<div class="cal-print"><h1>🗓️ ${MOIS_NOM[m]} ${a}</h1><table><thead><tr>${noms.map(n => `<th>${n}</th>`).join("")}</tr></thead><tbody>`;
    const cases = moisData(a, m);
    for (let i = 0; i < cases.length; i += 7) {
      html += "<tr>";
      for (let j = 0; j < 7; j++) {
        const d = cases[i + j];
        if (d === null) { html += `<td class="off"></td>`; continue; }
        const iso = `${a}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
        const evts = (EVENTS[iso] || []).map(e => `<span class="e">${e.emoji} ${escapeHtml(e.texte)}</span>`).join("");
        html += `<td><span class="n">${d}</span>${evts}</td>`;
      }
      html += "</tr>";
    }
    html += "</tbody></table></div>";
  }
  document.getElementById("zone-print").innerHTML = html;
  window.print();
}

/* ============================================================
   Divers
   ============================================================ */
function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }

function bindGlobal() {
  document.getElementById("btn-cal-print").addEventListener("click", imprimerCalendrier);
  document.getElementById("modale-fermer").addEventListener("click", closeModal);
  document.getElementById("modale").addEventListener("click", (e) => { if (e.target.id === "modale") closeModal(); });
  // graphisme : impression depuis la modale
  window.addEventListener("beforeprint", () => {
    if (document.getElementById("modale").classList.contains("actif") && window.__printFiche) {
      document.getElementById("zone-print").innerHTML = window.__printFiche;
    }
  });
}
window.closeModal = closeModal;

document.addEventListener("DOMContentLoaded", boot);
