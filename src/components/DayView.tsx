/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { ArrowLeft, CheckSquare, Square, Printer, Play, Volume2, Award } from "lucide-react";
import LectureGame, { speak } from "./LectureGame.tsx";
import ActivityRenderer from "./ActivityRenderer.tsx";
import { DayData, GeneratedAtelier } from "../data/days.ts";

interface DayViewProps {
  day: DayData;
  completedAteliers: string[]; // List of completed atelier IDs
  onToggleComplete: (id: string) => void;
  onBack: () => void;
}

export default function DayView({ day, completedAteliers, onToggleComplete, onBack }: DayViewProps) {
  const [activeAtelier, setActiveAtelier] = useState<GeneratedAtelier | null>(null);
  // Fiche à imprimer : un id d'atelier, "all", ou null (rien).
  // Le son ne se déclenche JAMAIS tout seul : uniquement sur action (boutons 🔊).
  const [printId, setPrintId] = useState<string | "all" | null>(null);

  // Lance l'impression une fois que la bonne fiche est rendue, puis réinitialise.
  // On active body.printing-fiche pendant toute l'impression pour ne montrer QUE
  // la fiche (le CSS d'impression est sinon inactif → Ctrl+P normal fonctionne).
  useEffect(() => {
    if (!printId) return;
    document.body.classList.add("printing-fiche");
    const cleanup = () => {
      document.body.classList.remove("printing-fiche");
      window.removeEventListener("afterprint", cleanup);
      setPrintId(null);
    };
    window.addEventListener("afterprint", cleanup);
    const t = setTimeout(() => {
      try { window.print(); } catch (e) { console.warn("Print failed", e); }
    }, 80);
    return () => {
      clearTimeout(t);
      window.removeEventListener("afterprint", cleanup);
      document.body.classList.remove("printing-fiche");
    };
  }, [printId]);

  const speakDate = () => {
    const parts = day.date.split("-");
    const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    const dayName = d.toLocaleDateString("fr-FR", { weekday: "long" }).toUpperCase();
    const dayNum = d.getDate();
    const monthName = d.toLocaleDateString("fr-FR", { month: "long" }).toUpperCase();
    speak(`AUJOURD'HUI, C'EST ${dayName} ${dayNum} ${monthName} !`);
  };

  const printAtelier = (atelierId: string) => {
    setPrintId(atelierId);
  };

  const handleLaunchAtelier = (atelier: GeneratedAtelier) => {
    setActiveAtelier(atelier);
  };

  const handleCompleteAtelier = () => {
    if (activeAtelier) {
      onToggleComplete(activeAtelier.id);
      setActiveAtelier(null);
    }
  };

  // Check if all ateliers are complete
  const allComplete = day.ateliers.every(a => completedAteliers.includes(a.id));

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 font-sans">
      
      {/* Back button and Rituel Trigger */}
      <div className="flex justify-between items-center mb-6 no-print">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 px-4 py-2.5 rounded-full text-sm font-bold transition cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" /> RETOUR AU CALENDRIER
        </button>

        <button
          onClick={speakDate}
          className="flex items-center gap-1.5 bg-brand-yellow hover:bg-yellow-400 text-neutral-800 px-5 py-2.5 rounded-full text-sm font-bold shadow-md transition cursor-pointer"
        >
          <Volume2 className="w-5 h-5" /> RITUEL DE LA DATE 🗣️
        </button>
      </div>

      {/* active overlay play mode */}
      {activeAtelier ? (
        <div className="no-print">
          <button
            onClick={() => setActiveAtelier(null)}
            className="mb-4 flex items-center gap-1 text-sm font-bold text-neutral-500 hover:text-neutral-700 cursor-pointer"
          >
            ◀ QUITTER L'ATELIER ET REVENIR AU PROGRAMME
          </button>
          
          {activeAtelier.type === "lecture" ? (
            <LectureGame
              targetLetter={activeAtelier.params.targetLetter}
              words={activeAtelier.params.words}
              letterChoices={activeAtelier.params.letterChoices}
              onComplete={handleCompleteAtelier}
            />
          ) : (
            <ActivityRenderer
              activity={activeAtelier}
              themeEmoji={day.themeEmoji}
              onComplete={handleCompleteAtelier}
            />
          )}
        </div>
      ) : (
        <div className="no-print">
          {/* Day Title and Theme Card */}
          <div className="bg-brand-apricot border-4 border-brand-coral/10 rounded-3xl p-6 md:p-8 mb-8 text-center shadow-md relative overflow-hidden">
            <span className="text-7xl block mb-3 animate-bounce">{day.themeEmoji}</span>
            <h1 className="font-display font-bold text-3xl md:text-4xl text-neutral-800 uppercase tracking-tight mb-2">
              {day.themeNom}
            </h1>
            <p className="text-sm font-mono text-neutral-500 tracking-widest uppercase">
              PROGRAMME DU JOUER : {day.date.split("-").reverse().join(" / ")}
            </p>
            {allComplete && (
              <div className="mt-4 inline-flex items-center gap-2 bg-green-100 border-2 border-green-300 text-green-700 font-bold px-4 py-2 rounded-full text-xs uppercase animate-pulse">
                <Award className="w-4 h-4" /> COMPLÈTEMENT TERMINÉ ! GRAND BRAVO !
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* List of Day's Ateliers */}
            <div className="space-y-4">
              <h3 className="font-display font-bold text-xl text-neutral-700 uppercase tracking-tight mb-2 flex items-center gap-2">
                📂 MES PARCOURS DU JOUR
              </h3>

              {day.ateliers.map((atelier) => {
                const isCompleted = completedAteliers.includes(atelier.id);
                return (
                  <div
                    key={atelier.id}
                    className={`border-2 rounded-2xl p-5 transition-all duration-300 relative shadow-sm hover:shadow-md ${
                      isCompleted 
                        ? "bg-green-50/70 border-green-200" 
                        : "bg-white border-neutral-100 hover:border-brand-apricot"
                    }`}
                  >
                    {/* Mode badge */}
                    <div className="flex justify-between items-start mb-3">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        atelier.mode === "📱 SUR L'ÉCRAN" ? "bg-blue-100 text-blue-700" :
                        atelier.mode === "🖨️ À IMPRIMER" ? "bg-orange-100 text-orange-700" :
                        "bg-teal-100 text-teal-700"
                      }`}>
                        {atelier.mode}
                      </span>
                      
                      {/* Checkbox */}
                      <button
                        onClick={() => onToggleComplete(atelier.id)}
                        className={`text-2xl transition-transform active:scale-95 cursor-pointer ${
                          isCompleted ? "text-green-500" : "text-neutral-300 hover:text-brand-coral"
                        }`}
                      >
                        {isCompleted ? <CheckSquare className="w-7 h-7" /> : <Square className="w-7 h-7" />}
                      </button>
                    </div>

                    <h4 className="font-display font-bold text-lg text-neutral-800 uppercase tracking-tight mb-2">
                      {atelier.titre}
                    </h4>
                    
                    <p className="text-xs text-neutral-500 font-sans leading-relaxed mb-4">
                      {atelier.consigneEnfant}
                    </p>

                    {/* Action buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleLaunchAtelier(atelier)}
                        className="flex-1 flex items-center justify-center gap-1 bg-brand-coral hover:bg-red-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition shadow-sm cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5" /> JOUER SUR L'ÉCRAN
                      </button>
                      
                      <button
                        onClick={() => printAtelier(atelier.id)}
                        className="flex items-center justify-center bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold p-2.5 rounded-xl text-xs transition border border-neutral-200 cursor-pointer"
                        title="Imprimer seulement cette fiche"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Program overview & print instructions */}
            <div className="flex flex-col gap-6 justify-between">
              
              {/* Routine Checklist illustration */}
              <div className="bg-brand-cream border-2 border-brand-yellow/30 rounded-3xl p-6 shadow-sm">
                <span className="text-4xl block mb-2">🐚</span>
                <h4 className="font-display font-bold text-lg text-neutral-800 uppercase tracking-tight mb-4">
                  MON RITUEL DES COCHAGES
                </h4>
                <ul className="space-y-3 font-sans text-xs text-neutral-600 uppercase">
                  <li className="flex items-center gap-2">
                    <span className="bg-brand-yellow w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-neutral-800">1</span>
                    FAIS TON ATELIER DU JOUR EN S'AMUSANT.
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="bg-brand-yellow w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-neutral-800">2</span>
                    CLIQUE SUR LE BOUTON CARRÉ POUR COCHER LA CASE.
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="bg-brand-yellow w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-neutral-800">3</span>
                    GAGNE DES ÉTOILES ET DES FÉLICITATIONS DE L'ESCARGOT 🐌 !
                  </li>
                </ul>
              </div>

              {/* Print entire day button */}
              <div className="bg-white border border-neutral-200 p-6 rounded-3xl text-center shadow-sm">
                <h4 className="font-display font-bold text-sm text-neutral-700 uppercase tracking-tight mb-2">
                  🖨️ VERSION PAPIER DE L'ÉTÉ
                </h4>
                <p className="text-xs text-neutral-400 font-sans mb-4 uppercase leading-relaxed">
                  IMPRIMEZ TOUTES LES FICHES DU THÈME POUR APPRENDRE SUR TABLE !
                </p>
                <button
                  onClick={() => setPrintId("all")}
                  className="w-full flex items-center justify-center gap-2 bg-neutral-800 hover:bg-black text-white font-bold py-3.5 px-6 rounded-2xl text-xs transition shadow cursor-pointer uppercase mb-3"
                >
                  <Printer className="w-4 h-4" /> IMPRIMER TOUT LE PROGRAMME
                </button>
                <p className="text-[10px] font-mono font-bold text-neutral-400 uppercase leading-snug">
                  💡 TABLETTE : OUVRIR EN PLEIN ÉCRAN (ICÔNE ↗️ EN HAUT) POUR IMPRIMER.
                </p>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Zone d'impression : uniquement la (les) fiche(s) demandée(s). */}
      <div id="print-area">
        {(printId === "all" ? day.ateliers : day.ateliers.filter((a) => a.id === printId)).map((atelier) => (
          <div key={atelier.id} className="print-container">
            <div className="border-8 border-double border-neutral-300 p-8 m-4 rounded-3xl min-h-[29cm] flex flex-col justify-between bg-white">
              <div>
                {/* Header */}
                <div className="flex justify-between items-center border-b-4 border-neutral-300 pb-4 mb-6">
                  <div>
                    <h1 className="text-3xl font-bold uppercase tracking-tight font-sans">{atelier.titre}</h1>
                    <p className="text-sm font-semibold text-neutral-500 uppercase tracking-widest mt-1">THEME : {day.themeEmoji} {day.themeNom}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-4xl">{day.themeEmoji}</span>
                    <p className="text-xs font-bold text-neutral-400 mt-1 uppercase">LE JARDIN DES VACANCES</p>
                  </div>
                </div>

                {/* Consigne */}
                <div className="bg-neutral-100 border-l-4 border-neutral-600 p-4 mb-8 rounded-r-lg">
                  <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">CONSIGNE ENFANT :</p>
                  <p className="text-xl font-bold text-neutral-800 uppercase leading-snug">{atelier.consigneEnfant}</p>
                </div>

                {/* Interactive / static content generator */}
                <PrintContentRenderer type={atelier.type} params={atelier.params} themeEmoji={day.themeEmoji} />
              </div>

              {/* Footer */}
              <div className="border-t-4 border-neutral-200 pt-4 flex justify-between items-center text-neutral-400">
                <p className="text-sm font-bold uppercase">🧠 PARCOURS GRANDE SECTION - VACANCES 2026</p>
                <div className="flex gap-1">
                  <span className="border border-neutral-300 px-3 py-1.5 rounded-md text-xs font-bold uppercase">DATE : {day.date.split("-").reverse().join("/")}</span>
                  <span className="border border-neutral-300 px-3 py-1.5 rounded-md text-xs font-bold uppercase">PRÉNOM : _________________</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

// Print Renderer helper
function PrintContentRenderer({ type, params, themeEmoji }: { type: string; params: any; themeEmoji: string }) {
  if (type === "programme") {
    return (
      <div className="py-8 text-center flex-1">
        <h2 className="text-2xl font-bold uppercase text-center mb-8">MON PROGRAMME D'AUJOURD'HUI</h2>
        <div className="max-w-md mx-auto border-4 border-neutral-300 rounded-3xl p-6 bg-white space-y-6">
          {params.steps.map((step: any, idx: number) => (
            <div key={idx} className="flex items-center gap-4 justify-between border-b-2 border-neutral-100 pb-4 last:border-0 last:pb-0">
              <div className="flex items-center gap-4">
                <span className="text-4xl">{step.emoji}</span>
                <span className="font-display font-bold text-xl uppercase">{step.label}</span>
              </div>
              <div className="w-8 h-8 rounded-md border-4 border-neutral-400 flex items-center justify-center font-bold" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Reuse drawing sheets
  if (type === "graphisme") {
    return (
      <div className="py-8 text-center flex-1">
        <h2 className="text-2xl font-bold uppercase mb-1">{params.title}</h2>
        <p className="text-sm text-neutral-400 uppercase tracking-widest mb-12">REPASSE EN POINTILLÉS DU DÉBUT JUSQU'À LA FIN AU FEUTRE COULEUR</p>
        
        <div className="border-4 border-dashed border-neutral-300 rounded-3xl p-8 max-w-xl mx-auto h-[350px] flex items-center justify-center relative bg-white">
          <span className="absolute top-4 left-4 text-5xl">{themeEmoji}</span>
          <span className="absolute bottom-4 right-4 text-5xl">{params.decor}</span>
          
          <svg className="w-full h-[250px]" viewBox="0 0 500 200">
            {params.pathType === "horizontal" && (
              <path d="M 40,100 L 460,100" fill="none" stroke="#b5b5b5" strokeWidth="6" strokeDasharray="10 10" />
            )}
            {params.pathType === "vertical" && (
              <>
                <path d="M 100,20 L 100,180" fill="none" stroke="#b5b5b5" strokeWidth="6" strokeDasharray="10 10" />
                <path d="M 200,20 L 200,180" fill="none" stroke="#b5b5b5" strokeWidth="6" strokeDasharray="10 10" />
                <path d="M 300,20 L 300,180" fill="none" stroke="#b5b5b5" strokeWidth="6" strokeDasharray="10 10" />
                <path d="M 400,20 L 400,180" fill="none" stroke="#b5b5b5" strokeWidth="6" strokeDasharray="10 10" />
              </>
            )}
            {params.pathType === "vagues" && (
              <path d="M 30,100 Q 80,40 130,100 T 230,100 T 330,100 T 430,100 T 470,100" fill="none" stroke="#b5b5b5" strokeWidth="6" strokeDasharray="10 10" />
            )}
            {params.pathType === "ponts" && (
              <path d="M 20,130 Q 60,40 100,130 Q 140,40 180,130 Q 220,40 260,130 Q 300,40 340,130 Q 380,40 420,130" fill="none" stroke="#b5b5b5" strokeWidth="6" strokeDasharray="10 10" />
            )}
            {params.pathType === "boucles" && (
              <path d="M 30,100 C 60,40 90,40 80,100 C 70,160 100,160 130,100 C 160,40 190,40 180,100 C 170,160 200,160 230,100 C 260,40 290,40 280,100 C 270,160 300,160 330,100 C 360,40 390,40 380,100 C 370,160 400,160 430,100" fill="none" stroke="#b5b5b5" strokeWidth="6" strokeDasharray="10 10" />
            )}
            {params.pathType === "creneaux" && (
              <path d="M 20,130 L 20,50 L 80,50 L 80,130 L 140,130 L 140,50 L 200,50 L 200,130 L 260,130 L 260,50 L 320,50 L 320,130 L 380,130 L 380,50 L 440,50 L 440,130" fill="none" stroke="#b5b5b5" strokeWidth="6" strokeDasharray="10 10" />
            )}
            {params.pathType === "spirale" && (
              <path d="M 250,100 C 220,70 180,100 200,130 C 240,160 290,110 260,70 C 220,30 150,80 180,140 C 220,200 310,150 280,80 C 240,10 130,50 160,150" fill="none" stroke="#b5b5b5" strokeWidth="6" strokeDasharray="10 10" />
            )}
            {params.pathType === "oblique" && (
              <path d="M 50,170 L 450,30" fill="none" stroke="#b5b5b5" strokeWidth="6" strokeDasharray="10 10" />
            )}
          </svg>
        </div>
      </div>
    );
  }

  if (type === "relier") {
    return (
      <div className="py-8 flex-1">
        <h2 className="text-2xl font-bold uppercase text-center mb-8">DESSINE DES TRAITS AU CRAYON DE PAPIER</h2>
        <div className="grid grid-cols-2 gap-24 max-w-xl mx-auto border-4 border-double border-neutral-300 p-12 rounded-3xl bg-white">
          <div className="flex flex-col justify-around gap-12">
            {params.pairs.map((p: any) => (
              <div key={p.leftId} className="flex items-center gap-4">
                <span className="w-5 h-5 rounded-full border-4 border-neutral-800 bg-neutral-800 flex-shrink-0" />
                <span className="font-display font-bold text-2xl uppercase border border-neutral-300 px-4 py-2.5 rounded-xl bg-neutral-50 block w-full">{p.leftContent}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col justify-around gap-12">
            {params.pairs.map((p: any, idx: number) => {
              const rotIdx = (idx + 1) % params.pairs.length;
              const displayPair = params.pairs[rotIdx];
              return (
                <div key={displayPair.rightId} className="flex items-center gap-4 flex-row-reverse">
                  <span className="w-5 h-5 rounded-full border-4 border-neutral-800 bg-white flex-shrink-0" />
                  <span className="font-display font-bold text-2xl uppercase border border-neutral-300 px-4 py-2.5 rounded-xl bg-neutral-50 block w-full text-right">{displayPair.rightContent}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (type === "decoupage") {
    return (
      <div className="py-8 text-center flex-1">
        <h2 className="text-2xl font-bold uppercase mb-1">MON ATELIER CISEAUX</h2>
        <p className="text-sm text-neutral-400 uppercase tracking-widest mb-12">DECOUPE PROPREMENT LE LONG DE LA LIGNE EN POINTILLÉS POUR DETACHER LES BANDES</p>
        <div className="border-4 border-dashed border-neutral-400 rounded-3xl p-12 max-w-xl mx-auto h-[400px] flex flex-col justify-around bg-white relative">
          <span className="absolute top-4 left-4 text-5xl">✂️</span>
          <span className="absolute bottom-4 right-4 text-5xl">{themeEmoji}</span>
          <div className="flex justify-between items-center w-full border-b-2 border-dashed border-neutral-400 pb-8">
            <span className="text-3xl font-bold font-mono">🏁 DEBUT ✂</span>
            <div className="w-full h-1 border-t-4 border-dashed border-neutral-400 mx-4" />
            <span className="text-3xl font-bold">🏁 FIN {themeEmoji}</span>
          </div>
          <div className="flex justify-between items-center w-full pb-2">
            <span className="text-3xl font-bold font-mono">🏁 DEBUT ✂</span>
            <div className="w-full h-1 border-t-4 border-dashed border-neutral-400 mx-4" />
            <span className="text-3xl font-bold">🏁 FIN {themeEmoji}</span>
          </div>
        </div>
      </div>
    );
  }

  if (type === "numeration") {
    return (
      <div className="py-8 flex-1">
        <h2 className="text-2xl font-bold uppercase text-center mb-2">COMPTE ET ÉCRIS LE CHIFFRE DANS LE ROND</h2>
        <p className="text-sm text-neutral-400 uppercase tracking-widest text-center mb-8">COMPTE CHAQUE {params.emoji} UN PAR UN EN METTANT UN CHIFFRE DESSUS</p>
        <div className="grid grid-cols-2 gap-12 max-w-2xl mx-auto">
          <div className="border-4 border-neutral-300 rounded-3xl p-6 bg-white flex flex-col justify-between items-center min-h-[250px]">
            <div className="flex flex-wrap justify-center gap-4 my-auto">
              {Array.from({ length: params.count }).map((_, idx) => (
                <span key={idx} className="text-5xl select-none">{params.emoji}</span>
              ))}
            </div>
            <div className="w-16 h-16 rounded-full border-4 border-neutral-800 flex items-center justify-center font-bold text-xl mt-4 bg-neutral-100">
              ?
            </div>
          </div>
          <div className="border-4 border-neutral-300 rounded-3xl p-6 bg-white flex flex-col justify-between items-center min-h-[250px]">
            <div className="flex flex-wrap justify-center gap-4 my-auto">
              {Array.from({ length: Math.max(2, params.count - 3) }).map((_, idx) => (
                <span key={idx} className="text-5xl select-none">{params.emoji}</span>
              ))}
            </div>
            <div className="w-16 h-16 rounded-full border-4 border-neutral-800 flex items-center justify-center font-bold text-xl mt-4 bg-neutral-100">
              ?
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "logique") {
    return (
      <div className="py-8 flex-1">
        <h2 className="text-2xl font-bold uppercase text-center mb-2">QUEL DESSIN VIENT JUSTE APRÈS ?</h2>
        <p className="text-sm text-neutral-400 uppercase tracking-widest text-center mb-12">REGARDE LE RYTHME ET TERMINE LA LIGNE GÉOMÉTRIQUE EN DESSINANT</p>
        <div className="border-4 border-double border-neutral-300 rounded-3xl p-12 max-w-xl mx-auto bg-white flex flex-col gap-12">
          <div className="flex items-center gap-6 justify-center">
            {params.pattern.map((emoji: string, idx: number) => (
              <span key={idx} className="text-5xl">{emoji}</span>
            ))}
            <span className="w-16 h-16 rounded-2xl border-4 border-dashed border-neutral-400 bg-neutral-100 flex items-center justify-center font-bold text-3xl">
              ?
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (type === "lecture") {
    return (
      <div className="py-8 flex-1 text-center">
        <h2 className="text-2xl font-bold uppercase mb-2">MON PORTFOLIO DE LECTURE : LETTRE {params.targetLetter}</h2>
        <p className="text-sm text-neutral-400 uppercase tracking-widest mb-12">RECONNAIS ET ASSOCIE LES MOTS DE L'ÉTÉ AU CRAYON DE COULEUR</p>
        <div className="grid grid-cols-3 gap-6 max-w-xl mx-auto">
          {params.words.map((item: any, idx: number) => (
            <div key={idx} className="border-4 border-neutral-300 rounded-3xl p-6 bg-white flex flex-col justify-between items-center h-[200px]">
              <span className="text-6xl">{item.emoji}</span>
              <span className="font-display font-bold text-2xl uppercase tracking-wide border-t-2 border-neutral-100 pt-4 w-full text-center mt-2">{item.mot}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Phono
  return (
    <div className="py-8 flex-1 text-center">
      <h2 className="text-2xl font-bold uppercase mb-2">ATELIER DU JARDIN DES PHONÈMES</h2>
      <p className="text-sm text-neutral-400 uppercase tracking-widest mb-12">ATELIER COMPLÈTEMENT ORAL À FAIRE EN CONVERSANT EN FAMILLE</p>
      <div className="border-4 border-neutral-300 rounded-3xl p-8 max-w-xl mx-auto bg-neutral-50 text-left">
        <h3 className="text-xl font-bold text-neutral-800 uppercase mb-4">🏠 CONSIGNES POUR LE RITUEL ORAL :</h3>
        <p className="font-display font-bold text-xl uppercase leading-snug">Répétez lentement : {params.wordToClap} et faites frapper dans ses mains {params.expectedClaps} fois en rythme !</p>
      </div>
    </div>
  );
}
