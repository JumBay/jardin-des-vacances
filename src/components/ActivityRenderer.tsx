/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { 
  Scissors, Edit2, Link2, Trash2, HelpCircle, 
  Sparkles, Check, ChevronRight, Volume2, Music, Drum, HelpCircle as HelpIcon 
} from "lucide-react";
import { speak } from "./LectureGame.tsx";

interface ActivityRendererProps {
  activity: {
    id: string;
    titre: string;
    type: string;
    mode: string;
    consigneEnfant: string;
    consigneParent: string;
    repli: string;
    params: any;
  };
  themeEmoji: string;
  onComplete: () => void;
}

export default function ActivityRenderer({ activity, themeEmoji, onComplete }: ActivityRendererProps) {
  const { type, consigneEnfant, consigneParent, repli, params, titre } = activity;

  // Render wrapper with unified structure
  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg border-2 border-brand-apricot relative">
      {/* Printable Sheet Wrapper (for @media print) */}
      <div className="print-container hidden print:block">
        <div className="border-8 border-double border-neutral-300 p-8 m-4 rounded-3xl min-h-[29cm] flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex justify-between items-center border-b-4 border-neutral-300 pb-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold uppercase tracking-tight font-sans">{titre}</h1>
                <p className="text-sm font-semibold text-neutral-500 uppercase tracking-widest mt-1">THEME : {themeEmoji} {titre.includes(":") ? titre.split(":")[0] : ""}</p>
              </div>
              <div className="text-right">
                <span className="text-4xl">{themeEmoji}</span>
                <p className="text-xs font-bold text-neutral-400 mt-1 uppercase">LE JARDIN DES VACANCES</p>
              </div>
            </div>

            {/* Consigne Enfant */}
            <div className="bg-neutral-100 border-l-4 border-neutral-600 p-4 mb-8 rounded-r-lg">
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">CONSIGNE ENFANT :</p>
              <p className="text-xl font-bold text-neutral-800 uppercase leading-snug">{consigneEnfant}</p>
            </div>

            {/* Print Specific Content Renderers */}
            <PrintContentRenderer type={type} params={params} themeEmoji={themeEmoji} />
          </div>

          {/* Footer */}
          <div className="border-t-4 border-neutral-200 pt-4 flex justify-between items-center text-neutral-400">
            <p className="text-sm font-bold uppercase">🧠 PARCOURS GRANDE SECTION - VACANCES 2026</p>
            <div className="flex gap-1">
              <span className="border border-neutral-300 px-3 py-1.5 rounded-md text-xs font-bold uppercase">DATE : ____/____/2026</span>
              <span className="border border-neutral-300 px-3 py-1.5 rounded-md text-xs font-bold uppercase">PRÉNOM : _________________</span>
            </div>
          </div>
        </div>
      </div>

      {/* Screen Interactive UI (no-print) */}
      <div className="no-print">
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-neutral-100">
          <span className="text-xs font-bold text-neutral-400 tracking-wider uppercase">ATELIER INTERACTIF</span>
          <button 
            onClick={() => speak(consigneEnfant)}
            className="flex items-center gap-1.5 bg-brand-yellow/30 hover:bg-brand-yellow text-neutral-700 px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer"
          >
            <Volume2 className="w-4 h-4" /> ÉCOUTER LA CONSIGNE
          </button>
        </div>

        <h2 className="font-display font-bold text-2xl text-neutral-800 uppercase tracking-tight mb-2">
          {themeEmoji} {titre}
        </h2>
        
        <p className="font-sans font-bold text-lg text-brand-coral uppercase leading-snug mb-5">
          {consigneEnfant}
        </p>

        {/* Screen Interactive Viewports */}
        <div className="my-6">
          <InteractiveContentRenderer type={type} params={params} themeEmoji={themeEmoji} onComplete={onComplete} />
        </div>

        {/* Parent Guide & Alternate fallback */}
        <div className="mt-8 bg-brand-apricot/40 rounded-2xl p-5 border border-brand-apricot">
          <h4 className="font-sans font-bold text-xs text-neutral-400 tracking-widest uppercase mb-2">💡 COIN DES PARENTS</h4>
          <p className="text-sm text-neutral-600 mb-3 font-sans leading-relaxed">
            {consigneParent}
          </p>
          <div className="border-t border-brand-apricot/60 pt-3">
            <span className="inline-block bg-brand-coral/10 text-brand-coral font-bold px-2 py-0.5 rounded text-[10px] tracking-wider uppercase mb-1">
              SANS IMPRIMANTE ?
            </span>
            <p className="text-xs font-mono text-neutral-500 uppercase leading-snug">
              {repli}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// SCREEN INTERACTIVE VIEWPORTS
// ==========================================
function InteractiveContentRenderer({ type, params, themeEmoji, onComplete }: { type: string; params: any; themeEmoji: string; onComplete: () => void }) {
  
  // RENDER GRAPHISME (Drawing Canvas)
  if (type === "graphisme") {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [brushColor, setBrushColor] = useState("#FF6B6B");

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw tracing templates in grey
      ctx.strokeStyle = "#e5e5e5";
      ctx.lineWidth = 4;
      ctx.setLineDash([8, 8]);
      
      const width = canvas.width;
      const height = canvas.height;
      
      if (params.pathType === "horizontal") {
        ctx.beginPath();
        ctx.moveTo(30, height / 2);
        ctx.lineTo(width - 30, height / 2);
        ctx.stroke();
      } else if (params.pathType === "vertical") {
        for (let x = 60; x < width; x += 80) {
          ctx.beginPath();
          ctx.moveTo(x, 20);
          ctx.lineTo(x, height - 20);
          ctx.stroke();
        }
      } else if (params.pathType === "vagues") {
        ctx.beginPath();
        ctx.moveTo(30, height / 2);
        for (let x = 30; x < width - 30; x += 10) {
          const y = height / 2 + Math.sin(x * 0.05) * 30;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      } else if (params.pathType === "ponts") {
        ctx.beginPath();
        ctx.moveTo(20, height / 2 + 20);
        for (let x = 20; x < width - 20; x += 40) {
          ctx.quadraticCurveTo(x + 20, height / 2 - 30, x + 40, height / 2 + 20);
        }
        ctx.stroke();
      } else if (params.pathType === "boucles") {
        ctx.beginPath();
        ctx.moveTo(20, height / 2);
        for (let x = 20; x < width - 40; x += 50) {
          ctx.bezierCurveTo(x + 20, height / 2 - 40, x + 40, height / 2 - 40, x + 30, height / 2);
          ctx.bezierCurveTo(x + 20, height / 2 + 40, x + 40, height / 2 + 40, x + 50, height / 2);
        }
        ctx.stroke();
      } else if (params.pathType === "creneaux") {
        ctx.beginPath();
        ctx.moveTo(20, height / 2 + 20);
        let up = true;
        for (let x = 20; x < width - 40; x += 40) {
          if (up) {
            ctx.lineTo(x, height / 2 - 30);
            ctx.lineTo(x + 40, height / 2 - 30);
          } else {
            ctx.lineTo(x, height / 2 + 20);
            ctx.lineTo(x + 40, height / 2 + 20);
          }
          up = !up;
        }
        ctx.stroke();
      } else if (params.pathType === "spirale") {
        ctx.beginPath();
        let angle = 0;
        let x = width / 2;
        let y = height / 2;
        ctx.moveTo(x, y);
        for (let i = 0; i < 150; i++) {
          angle = 0.1 * i;
          const rx = (1 + 1.2 * angle) * Math.cos(angle);
          const ry = (1 + 1.2 * angle) * Math.sin(angle);
          ctx.lineTo(width / 2 + rx * 2.5, height / 2 + ry * 2.5);
        }
        ctx.stroke();
      } else { // oblique
        ctx.beginPath();
        ctx.moveTo(40, height - 30);
        ctx.lineTo(width - 40, 30);
        ctx.stroke();
      }
    }, [params]);

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
      setIsDrawing(true);
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      let clientX, clientY;
      
      if ("touches" in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      ctx.beginPath();
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = 6;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.setLineDash([]);
      ctx.moveTo(clientX - rect.left, clientY - rect.top);
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
      if (!isDrawing) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      let clientX, clientY;
      
      if ("touches" in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      ctx.lineTo(clientX - rect.left, clientY - rect.top);
      ctx.stroke();
    };

    const stopDrawing = () => {
      setIsDrawing(false);
    };

    const clearCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Re-trigger layout draw by slightly toggling a state or simply forcing reload
      setBrushColor(c => c);
    };

    return (
      <div className="text-center">
        <div className="flex gap-2 justify-center mb-4">
          {["#FF6B6B", "#4ECDC4", "#FFE66D", "#4A90E2", "#39b54a"].map((color) => (
            <button
              key={color}
              onClick={() => setBrushColor(color)}
              style={{ backgroundColor: color }}
              className={`w-10 h-10 rounded-full border-4 transition transform hover:scale-110 cursor-pointer ${
                brushColor === color ? "border-neutral-800" : "border-transparent"
              }`}
            />
          ))}
          <button 
            onClick={clearCanvas}
            className="ml-4 flex items-center gap-1.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            <Trash2 className="w-4 h-4" /> EFFACER
          </button>
        </div>

        <div className="bg-neutral-50 border-4 border-dashed border-neutral-200 rounded-2xl relative inline-block overflow-hidden max-w-full shadow-inner">
          <canvas
            ref={canvasRef}
            width={450}
            height={250}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="cursor-crosshair bg-white canvas-container max-w-full"
          />
          {/* Decor visual backgrounds */}
          <div className="absolute top-2 left-2 text-3xl select-none">{themeEmoji}</div>
          <div className="absolute bottom-2 right-2 text-3xl select-none">{params.decor}</div>
        </div>

        <button
          onClick={() => { speak("MÉGA SENSATIONNEL ! TON DESSIN EST TRÈS JOLI !"); onComplete(); }}
          className="mt-6 flex items-center gap-2 bg-brand-turquoise hover:bg-teal-400 text-white font-bold px-8 py-3.5 rounded-full shadow-lg transition transform hover:-translate-y-0.5 mx-auto cursor-pointer"
        >
          J'AI TRACÉ TOUT LE CHEMIN ! <Sparkles className="w-5 h-5" />
        </button>
      </div>
    );
  }

  // RENDER RELIER (Interactive Association)
  if (type === "relier") {
    const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
    const [connections, setConnections] = useState<{ [key: string]: string }>({});
    const [feedback, setFeedback] = useState<"success" | "error" | null>(null);

    const handleLeftClick = (id: string) => {
      setSelectedLeft(id);
      setFeedback(null);
    };

    const handleRightClick = (id: string) => {
      if (!selectedLeft) return;
      
      // Find correct pair
      const correctPair = params.pairs.find((p: any) => p.leftId === selectedLeft);
      if (correctPair && correctPair.rightId === id) {
        setConnections(prev => ({ ...prev, [selectedLeft]: id }));
        speak("BRAVO ! EXCELLENTE ASSOCIATION !");
        setSelectedLeft(null);
        
        // Check if finished
        const totalConns = Object.keys({ ...connections, [selectedLeft]: id }).length;
        if (totalConns === params.pairs.length) {
          setFeedback("success");
          speak("GENIAL ! TU AS ASSOCIÉ TOUTES LES PAIRES DE L'ÉTÉ !");
        }
      } else {
        setFeedback("error");
        speak("OH, CE N'EST PAS LA BONNE PAIRE. RÉESSAIE !");
        setSelectedLeft(null);
      }
    };

    return (
      <div className="max-w-md mx-auto">
        <div className="grid grid-cols-2 gap-8 mb-6 relative">
          
          {/* Left Column */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest text-center">ÉLÉMENT 1</span>
            {params.pairs.map((p: any) => {
              const isMatched = !!connections[p.leftId];
              const isSelected = selectedLeft === p.leftId;
              
              return (
                <button
                  key={p.leftId}
                  onClick={() => handleLeftClick(p.leftId)}
                  disabled={isMatched}
                  className={`py-3.5 px-3 rounded-2xl font-display font-bold text-lg text-neutral-700 shadow-md border-2 text-center transition cursor-pointer ${
                    isMatched ? "bg-green-50 border-green-200 opacity-60 line-through" : 
                    isSelected ? "bg-brand-coral/20 border-brand-coral scale-105" : 
                    "bg-white border-neutral-100 hover:border-brand-apricot hover:bg-brand-cream"
                  }`}
                >
                  {p.leftContent}
                </button>
              );
            })}
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest text-center">ÉLÉMENT 2</span>
            {/* Display right elements, randomized or sorted to check pairing */}
            {params.pairs.map((p: any) => {
              const leftKey = Object.keys(connections).find(key => connections[key] === p.rightId);
              const isMatched = !!leftKey;
              
              return (
                <button
                  key={p.rightId}
                  onClick={() => handleRightClick(p.rightId)}
                  disabled={isMatched || !selectedLeft}
                  className={`py-3.5 px-3 rounded-2xl font-display font-bold text-lg text-neutral-700 shadow-md border-2 text-center transition cursor-pointer ${
                    isMatched ? "bg-green-50 border-green-200 opacity-60" : 
                    selectedLeft ? "bg-brand-yellow/10 border-brand-yellow hover:bg-brand-yellow/30" :
                    "bg-white border-neutral-100"
                  }`}
                >
                  {p.rightContent}
                </button>
              );
            })}
          </div>
        </div>

        {feedback === "success" ? (
          <div className="text-center">
            <button
              onClick={onComplete}
              className="flex items-center gap-2 bg-brand-turquoise hover:bg-teal-400 text-white font-bold px-8 py-3.5 rounded-full shadow-lg transition transform hover:-translate-y-0.5 mx-auto cursor-pointer"
            >
              TERMINER ET ENREGISTRER <Check className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <p className="text-center text-xs text-neutral-400 font-mono uppercase">
            {selectedLeft ? "CLIQUE SUR LA BONNE PAIRE À DROITE !" : "CHOISIS UN BOUTON À GAUCHE POUR COMMENCER !"}
          </p>
        )}
      </div>
    );
  }

  // RENDER DÉCOUPAGE (Swipe along dotted line)
  if (type === "decoupage") {
    const [sliderPos, setSliderPos] = useState(0);
    const [isCut, setIsCut] = useState(false);

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = parseInt(e.target.value);
      setSliderPos(val);
      if (val >= 98 && !isCut) {
        setIsCut(true);
        speak("CRAC ! DÉCOUPÉ ! SUPERBE COUP DE CISEAUX !");
      }
    };

    return (
      <div className="max-w-md mx-auto text-center py-4 bg-brand-apricot/10 border-2 border-neutral-100 rounded-3xl p-6 shadow-sm">
        <span className="text-7xl mb-4 block animate-pulse">{isCut ? "✂️" : themeEmoji}</span>
        
        <h3 className="font-display font-bold text-lg text-neutral-800 uppercase tracking-tight mb-4">
          GLISSE LES CISEAUX DU DÉBUT JUSQU'À LA FIN POUR TOUT DÉCOUPER !
        </h3>

        {/* Tracing cut track */}
        <div className="bg-white p-6 rounded-2xl border-2 border-neutral-200 shadow-inner relative overflow-hidden mb-6">
          <div className="h-2.5 bg-neutral-100 rounded-full w-full relative mb-1 flex items-center justify-between border border-neutral-200">
            {/* Dotted cutting path */}
            <div className="absolute inset-x-0 h-0.5 border-t-2 border-dashed border-neutral-400" />
            <div 
              style={{ width: `${sliderPos}%` }} 
              className="h-full bg-brand-coral transition-all duration-75 rounded-full z-10" 
            />
          </div>
          
          <div className="flex justify-between text-xs text-neutral-400 font-mono font-bold mt-2">
            <span>DÉBUT ▶</span>
            <span>🏁 RIVE</span>
          </div>

          {/* Scissor Slider */}
          <div className="mt-6 flex items-center gap-3">
            <span className="text-xl">🟢</span>
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPos}
              onChange={handleSliderChange}
              disabled={isCut}
              className="w-full accent-brand-coral h-3 rounded-lg cursor-pointer"
            />
            <span className="text-xl">🏁</span>
          </div>
        </div>

        {isCut ? (
          <button
            onClick={onComplete}
            className="flex items-center gap-2 bg-brand-turquoise hover:bg-teal-400 text-white font-bold px-8 py-3.5 rounded-full shadow-lg transition transform hover:-translate-y-0.5 mx-auto cursor-pointer"
          >
            VALIDER L'ATELIER <Check className="w-5 h-5" />
          </button>
        ) : (
          <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">
            PRENDS BIEN TON TEMPS POUR COUPE DROIT !
          </p>
        )}
      </div>
    );
  }

  // RENDER NUMÉRATION (Counting with Graded Help)
  if (type === "numeration") {
    const targetCount = params.count;
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [helpLevel, setHelpLevel] = useState(0); // 0: none, 1: scale, 2: dots with numbers, 3: reveal
    const [feedback, setFeedback] = useState<"success" | "error" | null>(null);

    // Create 3 choices: targetCount, and 2 random values nearby
    const choices = [
      targetCount,
      targetCount + (targetCount > 5 ? -2 : 2),
      targetCount + (targetCount > 8 ? -3 : 3)
    ].filter((v, i, a) => a.indexOf(v) === i).sort((a, b) => a - b).slice(0, 3);

    // Ensure we always have 3 distinct choices
    while (choices.length < 3) {
      const r = Math.max(1, targetCount + Math.floor(Math.random() * 5) - 2);
      if (!choices.includes(r)) choices.push(r);
      choices.sort((a, b) => a - b);
    }

    const handleAnswer = (num: number) => {
      setSelectedAnswer(num);
      if (num === targetCount) {
        setFeedback("success");
        speak(`PARFAIT ! IL Y A EXACTEMENT ${targetCount} ${params.emoji} !`);
      } else {
        setFeedback("error");
        speak(`NON, CE N'EST PAS ${num}. UTILISE L'AIDE SI TU EN AS BESOIN !`);
      }
    };

    const triggerHelp = () => {
      const nextLevel = Math.min(helpLevel + 1, 3);
      setHelpLevel(nextLevel);
      if (nextLevel === 1) {
        speak(`VOICI L'AIDE ÉTAPE 1 : REGARDE LA BANDE DES NOMBRES CI-DESSOUS POUR SITUER LE CHIFFRE.`);
      } else if (nextLevel === 2) {
        speak(`AIDE ÉTAPE 2 : NOUS AVONS COMPTÉ POUR TOI EN ÉCRIVANT LES NUMÉROS SUR CHAQUE OBJET.`);
      } else if (nextLevel === 3) {
        speak(`AIDE ÉTAPE 3 : LA RÉPONSE EST LE NOMBRE ${targetCount}. CLIQUE SUR LE BOUTON ${targetCount}.`);
      }
    };

    return (
      <div className="max-w-md mx-auto text-center">
        
        {/* Help button */}
        <div className="flex justify-end mb-3">
          <button
            onClick={triggerHelp}
            className="flex items-center gap-1 bg-brand-yellow hover:bg-yellow-400 text-neutral-800 font-bold px-3 py-1.5 rounded-full text-xs shadow-sm cursor-pointer transition transform active:scale-95"
          >
            <HelpIcon className="w-3.5 h-3.5" /> AIDE GRADUÉE 💡 {helpLevel > 0 && `(NIV ${helpLevel})`}
          </button>
        </div>

        {/* Dynamic item grid */}
        <div className="bg-neutral-50 rounded-3xl p-6 border-2 border-neutral-100 shadow-inner flex flex-wrap justify-center gap-4 max-w-sm mx-auto mb-6 relative">
          {Array.from({ length: targetCount }).map((_, idx) => (
            <div key={idx} className="relative transform hover:scale-110 transition duration-200">
              <span className="text-5xl block select-none">{params.emoji}</span>
              {/* Help level 2 overlay numbers */}
              {helpLevel >= 2 && (
                <span className="absolute -top-1 -right-1 bg-brand-coral text-white font-mono font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border border-white shadow-sm z-10 animate-bounce">
                  {idx + 1}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Help level 1: Number Track / Line */}
        {helpLevel >= 1 && (
          <div className="bg-white border-2 border-brand-yellow rounded-2xl p-4 mb-6 max-w-sm mx-auto shadow-sm">
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">💡 BANDE NUMÉRIQUE DE L'ÉTÉ</p>
            <div className="flex justify-between items-center gap-1 font-mono text-xs overflow-x-auto py-1">
              {Array.from({ length: params.max }).map((_, idx) => {
                const num = idx + 1;
                const isTarget = num === targetCount;
                return (
                  <span
                    key={num}
                    className={`w-7 h-7 flex items-center justify-center rounded-lg border-2 ${
                      isTarget && helpLevel >= 3
                        ? "bg-brand-coral border-brand-coral text-white font-bold scale-110"
                        : isTarget && helpLevel >= 1
                        ? "bg-brand-yellow border-brand-yellow text-neutral-800 font-bold"
                        : "bg-neutral-50 border-neutral-100 text-neutral-500"
                    }`}
                  >
                    {num}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Multiple choice options */}
        <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto mb-6">
          {choices.map((num) => {
            const isCorrect = num === targetCount;
            const isSelected = selectedAnswer === num;
            
            let btnClass = "bg-white border-2 border-neutral-200 text-neutral-700 hover:border-brand-apricot hover:bg-brand-cream";
            
            if (isSelected) {
              if (isCorrect) {
                btnClass = "bg-green-100 border-green-500 text-green-700 font-bold scale-105 shadow-md shadow-green-100";
              } else {
                btnClass = "bg-red-100 border-red-400 text-red-600 font-bold";
              }
            } else if (isCorrect && helpLevel >= 3) {
              btnClass = "bg-brand-yellow/30 border-brand-yellow text-neutral-800 font-bold animate-pulse";
            }

            return (
              <button
                key={num}
                onClick={() => handleAnswer(num)}
                disabled={feedback === "success"}
                className={`py-4 px-2 rounded-2xl font-display font-bold text-3xl transition-all duration-200 cursor-pointer shadow-sm ${btnClass}`}
              >
                {num}
              </button>
            );
          })}
        </div>

        {feedback === "success" && (
          <button
            onClick={onComplete}
            className="flex items-center gap-2 bg-brand-turquoise hover:bg-teal-400 text-white font-bold px-8 py-3.5 rounded-full shadow-lg transition transform hover:-translate-y-0.5 mx-auto cursor-pointer"
          >
            VALIDER ET CONTINUER <Check className="w-5 h-5" />
          </button>
        )}
      </div>
    );
  }

  // RENDER LOGIQUE (Interactive Pattern completion)
  if (type === "logique") {
    const [completedPattern, setCompletedPattern] = useState<string[]>([...params.pattern]);
    const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<"success" | "error" | null>(null);

    const handleChoice = (emoji: string) => {
      setSelectedChoice(emoji);
      if (emoji === params.correctAnswer) {
        setCompletedPattern([...params.pattern, emoji]);
        setFeedback("success");
        speak("MAGNIFIQUE ! LE RYTHME EST PARFAIT !");
      } else {
        setFeedback("error");
        speak("ZUT ! CE N'EST PAS LA BONNE IMAGE. CHANTE LES DESSINS POUR TROUVER LE RYTHME !");
      }
    };

    return (
      <div className="max-w-md mx-auto text-center">
        
        {/* Dynamic Row */}
        <div className="bg-white border-2 border-neutral-100 p-6 rounded-3xl shadow-inner inline-flex justify-center items-center gap-3 max-w-sm mx-auto mb-6">
          {completedPattern.map((emoji, idx) => (
            <span key={idx} className="text-4xl block select-none animate-scale">
              {emoji}
            </span>
          ))}
          {feedback !== "success" && (
            <span className="w-12 h-12 rounded-xl border-4 border-dashed border-brand-coral bg-brand-apricot/20 flex items-center justify-center font-bold text-2xl text-brand-coral animate-pulse">
              ?
            </span>
          )}
        </div>

        <h3 className="font-display font-bold text-lg text-neutral-800 uppercase tracking-tight mb-4">
          QUELLE IMAGE REMPLACE LE POINT D'INTERROGATION ?
        </h3>

        {/* choices */}
        <div className="flex gap-4 justify-center mb-6">
          {params.choices.map((emoji: string) => {
            const isSelected = selectedChoice === emoji;
            const isCorrect = emoji === params.correctAnswer;
            
            let btnClass = "bg-neutral-50 border-2 border-neutral-100 hover:bg-white hover:border-brand-yellow";
            if (isSelected) {
              if (isCorrect) {
                btnClass = "bg-green-100 border-green-500 scale-110";
              } else {
                btnClass = "bg-red-100 border-red-400";
              }
            }

            return (
              <button
                key={emoji}
                onClick={() => handleChoice(emoji)}
                disabled={feedback === "success"}
                className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow transition-all duration-200 cursor-pointer ${btnClass}`}
              >
                {emoji}
              </button>
            );
          })}
        </div>

        {feedback === "success" && (
          <button
            onClick={onComplete}
            className="flex items-center gap-2 bg-brand-turquoise hover:bg-teal-400 text-white font-bold px-8 py-3.5 rounded-full shadow-lg transition transform hover:-translate-y-0.5 mx-auto cursor-pointer"
          >
            ATELIER SUIVANT <Check className="w-5 h-5" />
          </button>
        )}
      </div>
    );
  }

  // RENDER PHONO (Oral and Tambour clapping assistant)
  if (type === "phono") {
    const [tapCount, setTapCount] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    
    const handleDrumTap = () => {
      const nextCount = tapCount + 1;
      setTapCount(nextCount);
      speak(`TAP !`);
      
      if (nextCount === params.expectedClaps) {
        setIsFinished(true);
        speak(`SUPER ! TU AS BIEN TAPÉ ${params.expectedClaps} FOIS POUR LE MOT ${params.wordToClap} !`);
      }
    };

    const resetClaps = () => {
      setTapCount(0);
      setIsFinished(false);
    };

    return (
      <div className="max-w-md mx-auto text-center py-4 bg-brand-cream border border-brand-apricot rounded-3xl p-6 shadow-sm">
        <span className="text-6xl block mb-2">{params.themeEmoji}</span>
        <h3 className="font-display font-bold text-2xl text-neutral-800 mb-2 uppercase">
          MOT À SCANDER : <span className="text-brand-coral underline">{params.wordToClap}</span>
        </h3>
        <p className="text-xs text-neutral-500 font-mono uppercase tracking-widest mb-6">
          IL Y A EN TOUT : {params.expectedClaps} SYLLABES DANS CE MOT.
        </p>

        {/* Clapping Tambour */}
        <div className="bg-white rounded-3xl p-6 border-2 border-dashed border-neutral-200 shadow-inner max-w-sm mx-auto mb-6">
          <button
            onClick={handleDrumTap}
            disabled={isFinished}
            className={`w-32 h-32 rounded-full bg-gradient-to-tr from-brand-yellow to-yellow-300 border-8 border-neutral-800 flex flex-col items-center justify-center shadow-lg transform active:scale-95 transition cursor-pointer mx-auto ${
              isFinished ? "opacity-70 cursor-not-allowed animate-none" : "animate-pulse"
            }`}
          >
            <Drum className="w-12 h-12 text-neutral-800 mb-1" />
            <span className="text-xs font-bold text-neutral-800 font-mono">TAPE ICI 🥁</span>
          </button>

          {/* Scander tracker lights */}
          <div className="flex justify-center gap-3 mt-6">
            {Array.from({ length: params.expectedClaps }).map((_, idx) => (
              <span
                key={idx}
                className={`w-6 h-6 rounded-full border-2 border-neutral-800 transition duration-300 ${
                  tapCount > idx ? "bg-brand-coral scale-110 shadow" : "bg-neutral-100"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={resetClaps}
            className="bg-neutral-200 hover:bg-neutral-300 text-neutral-700 text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer"
          >
            RECOMMENCER
          </button>
          
          {isFinished && (
            <button
              onClick={onComplete}
              className="flex items-center gap-1.5 bg-brand-turquoise hover:bg-teal-400 text-white font-bold px-6 py-2 rounded-xl shadow transition text-xs cursor-pointer"
            >
              VALIDER <Check className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // RENDER PROGRAMME (emploi du temps illustré de la journée)
  if (type === "programme") {
    const steps = params.steps || [];
    return (
      <div className="max-w-md mx-auto text-center">
        <div className="flex flex-col gap-3 mb-6">
          {steps.map((step: any, idx: number) => (
            <button
              key={idx}
              onClick={() => speak(step.label)}
              className="flex items-center gap-3 bg-neutral-50 rounded-2xl px-4 py-3 shadow-sm border-2 border-neutral-200 text-left cursor-pointer hover:border-brand-turquoise transition"
            >
              <span className="w-8 h-8 rounded-full bg-brand-turquoise text-white font-bold flex items-center justify-center flex-shrink-0">{idx + 1}</span>
              <span className="text-3xl">{step.emoji}</span>
              <span className="font-bold text-neutral-700">{step.label}</span>
            </button>
          ))}
        </div>
        <button
          onClick={() => { speak("SUPER ! ON EST PRÊT POUR UNE BELLE JOURNÉE !"); onComplete(); }}
          className="flex items-center gap-2 bg-brand-turquoise hover:bg-teal-400 text-white font-bold px-8 py-3.5 rounded-full shadow-lg transition transform hover:-translate-y-0.5 mx-auto cursor-pointer"
        >
          C'EST PARTI POUR LA JOURNÉE ! <Sparkles className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return <div>Moteur non configuré pour le type : {type}</div>;
}


// ==========================================
// PRINT EMBEDDED SHEET RENDERERS (A4 MOCKUP)
// ==========================================
function PrintContentRenderer({ type, params, themeEmoji }: { type: string; params: any; themeEmoji: string }) {
  
  // PRINT GRAPHISME (Tracing outlines)
  if (type === "graphisme") {
    return (
      <div className="py-8 text-center flex-1">
        <h2 className="text-2xl font-bold uppercase mb-1">{params.title}</h2>
        <p className="text-sm text-neutral-400 uppercase tracking-widest mb-12">REPASSE EN POINTILLÉS DU DÉBUT JUSQU'À LA FIN AU FEUTRE COULEUR</p>
        
        {/* Large SVG outline printable */}
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

        <div className="mt-8 text-neutral-400 font-mono text-sm uppercase">
          ✍️ NOTE PARENT : ENCOURAGEZ L'ENFANT À NE PAS LEVER LE FEUTRE DU TRAJET !
        </div>
      </div>
    );
  }

  // PRINT RELIER (Linking sheet with crayons)
  if (type === "relier") {
    return (
      <div className="py-8 flex-1">
        <h2 className="text-2xl font-bold uppercase text-center mb-8">DESSINE DES TRAITS AU CRAYON DE PAPIER</h2>
        
        <div className="grid grid-cols-2 gap-24 max-w-xl mx-auto border-4 border-double border-neutral-300 p-12 rounded-3xl bg-white relative">
          
          {/* Left Columns items */}
          <div className="flex flex-col justify-around gap-12">
            {params.pairs.map((p: any) => (
              <div key={p.leftId} className="flex items-center gap-4">
                <span className="w-5 h-5 rounded-full border-4 border-neutral-800 bg-neutral-800 flex-shrink-0" />
                <span className="font-display font-bold text-2xl uppercase border border-neutral-300 px-4 py-2.5 rounded-xl bg-neutral-50 block w-full">{p.leftContent}</span>
              </div>
            ))}
          </div>

          {/* Right Columns items - rearranged so child must think */}
          <div className="flex flex-col justify-around gap-12">
            {params.pairs.map((p: any, idx: number) => {
              // Rotate right side slightly so print layouts don't connect in direct lines
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

  // PRINT DÉCOUPAGE
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

  // PRINT NUMERATION (Counting Worksheet)
  if (type === "numeration") {
    return (
      <div className="py-8 flex-1">
        <h2 className="text-2xl font-bold uppercase text-center mb-2">COMPTE ET ÉCRIS LE CHIFFRE DANS LE ROND</h2>
        <p className="text-sm text-neutral-400 uppercase tracking-widest text-center mb-8">COMPTE CHAQUE {params.emoji} UN PAR UN EN METTANT UN CHIFFRE DESSUS</p>
        
        <div className="grid grid-cols-2 gap-12 max-w-2xl mx-auto">
          {/* Box 1: Target Count */}
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

          {/* Box 2: Different Count (rotated/shuffled) */}
          <div className="border-4 border-neutral-300 rounded-3xl p-6 bg-white flex flex-col justify-between items-center min-h-[250px]">
            <div className="flex flex-wrap justify-center gap-4 my-auto">
              {Array.from({ length: Math.max(3, params.count - 3) }).map((_, idx) => (
                <span key={idx} className="text-5xl select-none">{params.emoji}</span>
              ))}
            </div>
            <div className="w-16 h-16 rounded-full border-4 border-neutral-800 flex items-center justify-center font-bold text-xl mt-4 bg-neutral-100">
              ?
            </div>
          </div>
        </div>

        {/* Number scale to help child write */}
        <div className="border-2 border-neutral-300 rounded-2xl p-4 mt-12 max-w-xl mx-auto text-center">
          <p className="text-xs font-mono font-bold uppercase tracking-wider mb-2">💡 BANDE D'AIDE POUR DESSINER LES CHIFFRES</p>
          <div className="flex justify-between font-mono text-xl">
            {Array.from({ length: 15 }).map((_, idx) => (
              <span key={idx} className="border border-neutral-200 w-8 h-8 flex items-center justify-center rounded bg-neutral-50">{idx + 1}</span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // PRINT LOGIQUE
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

          <div className="flex items-center gap-6 justify-center">
            {params.pattern.map((emoji: string, idx: number) => (
              <span key={idx} className="text-5xl">{idx % 2 === 0 ? "🔵" : "🔴"}</span>
            ))}
            <span className="w-16 h-16 rounded-2xl border-4 border-dashed border-neutral-400 bg-neutral-100 flex items-center justify-center font-bold text-3xl">
              ?
            </span>
          </div>
        </div>

        <div className="mt-12 text-center text-neutral-400 font-mono text-xs uppercase">
          💡 CONSEIL : INCITEZ L'ENFANT À COCHONNER EN CHANTANT : 'ROND, CARRÉ, ROND, CARRÉ, ROND...'
        </div>
      </div>
    );
  }

  // PRINT PHONOLOGY
  if (type === "phono") {
    return (
      <div className="py-8 flex-1 text-center">
        <h2 className="text-2xl font-bold uppercase mb-2">ATELIER DU JARDIN DES PHONÈMES</h2>
        <p className="text-sm text-neutral-400 uppercase tracking-widest mb-12">ATELIER COMPLÈTEMENT ORAL À FAIRE EN CONVERSANT EN FAMILLE</p>
        
        <div className="border-4 border-neutral-300 rounded-3xl p-8 max-w-xl mx-auto bg-neutral-50 text-left">
          <h3 className="text-xl font-bold text-neutral-800 uppercase mb-4">🏠 CONSIGNES POUR LE RITUEL ORAL :</h3>
          
          <div className="space-y-6">
            <div>
              <p className="text-xs font-bold text-neutral-400 uppercase">1. LE SCANDAGE DES MOTS :</p>
              <p className="text-base font-bold text-neutral-700 uppercase">Dites le mot '{params.wordToClap}' à voix haute. Demandez à l'enfant de frapper dans ses mains pour scander les {params.expectedClaps} syllabes. (ex : {params.wordToClap.split("").join("-")})</p>
            </div>
            
            <div>
              <p className="text-xs font-bold text-neutral-400 uppercase">2. LA CHASSE AUX RIMES :</p>
              <p className="text-base font-bold text-neutral-700 uppercase">Trouvez ensemble des mots qui finissent par la même rime que '{params.rimeWord}'. (ex : SAPIN - COPIN - JARDIN - FIN)</p>
            </div>

            <div>
              <p className="text-xs font-bold text-neutral-400 uppercase">3. DESSIN DU COMPTAGE :</p>
              <p className="text-base font-bold text-neutral-700 uppercase">Dessinez {params.expectedClaps} ronds sur une feuille et faites-y poser {params.expectedClaps} haricots secs ou Lego en rythme.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <div>Document non disponible à l'impression.</div>;
}
