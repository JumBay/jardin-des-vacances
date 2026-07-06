/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Volume2, Star, CheckCircle, ArrowRight, Play, Award, HelpCircle } from "lucide-react";
import { WordItem } from "../data/themes.ts";

interface LectureGameProps {
  targetLetter: string;
  words: WordItem[];
  letterChoices: string[];
  onComplete: () => void;
}

let globalSpeakListener: ((text: string) => void) | null = null;

export function registerSpeakListener(listener: (text: string) => void) {
  globalSpeakListener = listener;
}

export function speak(text: string) {
  if (globalSpeakListener) {
    try {
      globalSpeakListener(text);
    } catch (e) {
      console.warn("Speak listener failed:", e);
    }
  }

  if ("speechSynthesis" in window) {
    try {
      // Avoid cancel() on iOS as it freezes synthesis
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      if (!isIOS) {
        window.speechSynthesis.cancel();
      }
    } catch (e) {
      console.warn("Cancel speech failed:", e);
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "fr-FR";
    utterance.rate = 0.85; // slightly slower for young kids
    
    // Get voices safely
    let voices: SpeechSynthesisVoice[] = [];
    try {
      voices = window.speechSynthesis.getVoices();
    } catch (e) {
      console.warn("Could not retrieve voices list:", e);
    }
    
    const frVoice = voices.find(v => v.lang.startsWith("fr-FR") || v.lang.startsWith("fr") || v.lang === "fr");
    if (frVoice) {
      utterance.voice = frVoice;
    }
    
    try {
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis speak call failed:", e);
    }
  }
}

export default function LectureGame({ targetLetter, words, letterChoices, onComplete }: LectureGameProps) {
  const [step, setStep] = useState<"intro" | "letter" | "syllable" | "word" | "victory">("intro");
  const [score, setScore] = useState(0);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [letterFeedback, setLetterFeedback] = useState<"success" | "error" | null>(null);
  
  // Syllable building state
  const [consonant, setConsonant] = useState("M");
  const [vowel, setVowel] = useState("A");
  
  // Word state
  const [wordIndex, setWordIndex] = useState(0);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [wordFeedback, setWordFeedback] = useState<"success" | "error" | null>(null);

  // Trigger speech on voice load or step change
  useEffect(() => {
    // Ensure voices are loaded
    if ("speechSynthesis" in window) {
      window.speechSynthesis.onvoiceschanged = () => {};
    }
  }, []);

  const playIntro = () => {
    speak("BIENVENUE AU JARDIN DES SONS ! ENTRAÎNONS-NOUS À LIRE ENSEMBLE ! CLIQUE SUR LE BOUTON VERT POUR COMMENCER !");
  };

  const startLetterGame = () => {
    setStep("letter");
    setSelectedLetter(null);
    setLetterFeedback(null);
    speak(`PREMIER JEU : TROUVE LA LETTRE ${targetLetter}. CLIQUE SUR LA LETTRE ${targetLetter} !`);
  };

  const handleLetterClick = (letter: string) => {
    setSelectedLetter(letter);
    if (letter === targetLetter) {
      setLetterFeedback("success");
      setScore(s => s + 1);
      speak(`BRAVO ! C'EST BIEN LA LETTRE ${targetLetter} !`);
    } else {
      setLetterFeedback("error");
      speak(`NON, ÇA C'EST LA LETTRE ${letter}. RÉESSAIE DE TROUVER LA LETTRE ${targetLetter} !`);
    }
  };

  const startSyllableGame = () => {
    setStep("syllable");
    speak("DEUXIÈME JEU : FABRIQUE DES SYLLABES ! ASSOCIE UNE LETTRE BLEUE ET UNE LETTRE ROUGE, PUIS ÉCOUTE LE SON !");
  };

  const playSyllableSound = (c: string, v: string) => {
    let pronunciation = c + v;
    // Special spelling pronunciation for French phonetics
    if (c === "M" && v === "A") pronunciation = "MA";
    if (c === "M" && v === "O") pronunciation = "MO";
    if (c === "M" && v === "I") pronunciation = "MI";
    if (c === "M" && v === "U") pronunciation = "MU";
    if (c === "M" && v === "E") pronunciation = "ME";
    
    if (c === "L" && v === "A") pronunciation = "LA";
    if (c === "L" && v === "O") pronunciation = "LO";
    if (c === "L" && v === "I") pronunciation = "LI";
    if (c === "L" && v === "U") pronunciation = "LU";
    if (c === "L" && v === "E") pronunciation = "LE";

    if (c === "P" && v === "A") pronunciation = "PA";
    if (c === "P" && v === "O") pronunciation = "PO";
    if (c === "P" && v === "I") pronunciation = "PI";
    if (c === "P" && v === "U") pronunciation = "PU";
    if (c === "P" && v === "E") pronunciation = "PE";

    if (c === "F" && v === "A") pronunciation = "FA";
    if (c === "F" && v === "O") pronunciation = "FO";
    if (c === "F" && v === "I") pronunciation = "FI";
    if (c === "F" && v === "U") pronunciation = "FU";
    if (c === "F" && v === "E") pronunciation = "FE";

    if (c === "T" && v === "A") pronunciation = "TA";
    if (c === "T" && v === "O") pronunciation = "TO";
    if (c === "T" && v === "I") pronunciation = "TI";
    if (c === "T" && v === "U") pronunciation = "TU";
    if (c === "T" && v === "E") pronunciation = "TE";

    speak(`${c} PLUS ${v} ÉGAL ${pronunciation} !`);
  };

  const startWordGame = () => {
    setStep("word");
    setWordIndex(0);
    setSelectedWord(null);
    setWordFeedback(null);
    speak(`TROISIÈME JEU : RECONNAÎTRE LE MOT. REGARDE LE DESSIN ET RETROUVE LE BON MOT EN MAJUSCULES !`);
    const targetWord = words[0].mot;
    speak(`OÙ EST ÉCRIT LE MOT ${targetWord} ?`);
  };

  const handleWordClick = (word: string) => {
    setSelectedWord(word);
    const targetWord = words[wordIndex].mot;
    if (word === targetWord) {
      setWordFeedback("success");
      setScore(s => s + 1);
      speak(`C'EST SUPER ! TU AS RETROUVÉ LE MOT ${targetWord} !`);
    } else {
      setWordFeedback("error");
      speak(`RÉESSAIE ! REGARDE BIEN LES LETTRES DU MOT ${targetWord}.`);
    }
  };

  const nextWord = () => {
    if (wordIndex < Math.min(words.length - 1, 2)) {
      const nextIdx = wordIndex + 1;
      setWordIndex(nextIdx);
      setSelectedWord(null);
      setWordFeedback(null);
      const nextTarget = words[nextIdx].mot;
      speak(`OÙ EST ÉCRIT LE MOT ${nextTarget} ?`);
    } else {
      setStep("victory");
      speak("FÉLICITATIONS ! TU AS TERMINÉ TOUS LES ATELIERS DU JARDIN DES SONS ! TU AS GAGNÉ UNE ÉTOILE !");
    }
  };

  const consonants = ["B", "D", "F", "L", "M", "N", "P", "R", "S", "T", "V"].filter(c => c === targetLetter || ["M", "L", "P", "F", "T"].includes(c)).slice(0, 5);
  const vowels = ["A", "O", "I", "U", "E"];

  return (
    <div className="bg-brand-cream border-4 border-brand-coral/30 rounded-3xl p-6 md:p-8 max-w-2xl mx-auto shadow-xl text-center relative overflow-hidden">
      {/* Decorative Snail Mascotte */}
      <div className="absolute -top-3 -right-3 text-5xl opacity-20 transform rotate-12 select-none">🐌</div>
      
      {/* Step Header */}
      <div className="flex justify-between items-center mb-6 border-b-2 border-brand-apricot pb-4 no-print">
        <span className="font-sans font-bold text-lg text-brand-coral tracking-tight">🗣️ LE JARDIN DES SONS</span>
        <div className="flex gap-2 text-brand-yellow drop-shadow-sm text-xl">
          {Array.from({ length: 3 }).map((_, i) => (
            <Star key={i} className={`w-6 h-6 fill-current ${score > i ? "text-brand-yellow" : "text-neutral-200"}`} />
          ))}
        </div>
      </div>

      {step === "intro" && (
        <div className="py-8">
          <div className="text-7xl mb-6 transform hover:scale-110 transition duration-300">🐌</div>
          <h2 className="font-display font-bold text-3xl text-neutral-800 mb-4 tracking-tight">
            BIENVENUE AU JARDIN DES SONS
          </h2>
          <p className="text-lg text-neutral-600 mb-8 max-w-md mx-auto">
            UN JEU TOUT PARLÉ POUR APPRENDRE À RECONNAÎTRE LES LETTRES, LES SYLLABES ET LES MOTS EN MAJUSCULES.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={playIntro}
              className="flex items-center gap-2 bg-brand-yellow hover:bg-yellow-400 text-neutral-800 font-bold px-6 py-4 rounded-full shadow-lg transition transform hover:-translate-y-1 active:translate-y-0 text-lg w-full sm:w-auto justify-center cursor-pointer"
            >
              <Volume2 className="w-6 h-6" /> ÉCOUTER LA CONSIGNE
            </button>
            <button
              onClick={startLetterGame}
              className="flex items-center gap-2 bg-brand-turquoise hover:bg-teal-400 text-white font-bold px-8 py-4 rounded-full shadow-lg transition transform hover:-translate-y-1 active:translate-y-0 text-lg w-full sm:w-auto justify-center cursor-pointer"
            >
              C'EST PARTI ! <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {step === "letter" && (
        <div>
          <span className="bg-brand-coral/10 text-brand-coral font-bold px-4 py-1.5 rounded-full text-sm inline-block mb-4">
            JEU 1 : TROUVE LA LETTRE !
          </span>
          <h3 className="font-display font-bold text-4xl text-neutral-800 mb-8 tracking-wide">
            CLIQUE SUR LA LETTRE : <span className="text-brand-coral underline decoration-wavy decoration-brand-yellow">{targetLetter}</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-md mx-auto mb-8">
            {letterChoices.map((letter) => {
              const isSelected = selectedLetter === letter;
              let btnClass = "bg-white hover:bg-brand-apricot border-4 border-neutral-200 text-neutral-700";
              
              if (isSelected) {
                if (letterFeedback === "success") {
                  btnClass = "bg-green-100 border-green-500 text-green-700 scale-105 shadow-green-200";
                } else {
                  btnClass = "bg-red-100 border-red-400 text-red-600 animate-shake";
                }
              }

              return (
                <button
                  key={letter}
                  onClick={() => handleLetterClick(letter)}
                  disabled={letterFeedback === "success"}
                  className={`w-24 h-24 rounded-2xl flex items-center justify-center font-display font-bold text-5xl transition-all duration-300 shadow-md cursor-pointer ${btnClass}`}
                >
                  {letter}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => speak(`CLIQUE SUR LA LETTRE ${targetLetter} !`)}
              className="flex items-center gap-2 bg-brand-yellow hover:bg-yellow-400 text-neutral-800 font-bold px-6 py-3 rounded-full shadow transition text-base cursor-pointer"
            >
              <Volume2 className="w-5 h-5" /> RÉPÉTER
            </button>
            {letterFeedback === "success" && (
              <button
                onClick={startSyllableGame}
                className="flex items-center gap-2 bg-brand-turquoise hover:bg-teal-400 text-white font-bold px-8 py-3.5 rounded-full shadow-lg transition transform hover:scale-105 text-base cursor-pointer"
              >
                JEU SUIVANT <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      )}

      {step === "syllable" && (
        <div>
          <span className="bg-brand-coral/10 text-brand-coral font-bold px-4 py-1.5 rounded-full text-sm inline-block mb-4">
            JEU 2 : FABRIQUE DES SYLLABES !
          </span>
          <h3 className="font-display font-bold text-2xl text-neutral-800 mb-6 tracking-tight">
            CLIQUE SUR UNE CONSONNE (BLEU) ET UNE VOYELLE (ROUGE) !
          </h3>

          <div className="bg-white border-2 border-brand-apricot rounded-2xl p-6 max-w-md mx-auto mb-8 shadow-sm">
            <div className="flex justify-center items-center gap-4 text-6xl font-display font-bold mb-6">
              <span className="text-blue-500 bg-blue-50 w-20 h-20 flex items-center justify-center rounded-2xl border-4 border-blue-200 shadow-inner">
                {consonant}
              </span>
              <span className="text-neutral-400">+</span>
              <span className="text-red-500 bg-red-50 w-20 h-20 flex items-center justify-center rounded-2xl border-4 border-red-200 shadow-inner">
                {vowel}
              </span>
              <span className="text-neutral-400">=</span>
              <span className="text-neutral-800 bg-brand-yellow/30 w-24 h-20 flex items-center justify-center rounded-2xl border-4 border-brand-yellow shadow">
                {consonant}{vowel}
              </span>
            </div>

            <button
              onClick={() => playSyllableSound(consonant, vowel)}
              className="flex items-center gap-2 bg-brand-coral hover:bg-red-500 text-white font-bold px-6 py-3 rounded-full shadow mx-auto transition cursor-pointer mb-6"
            >
              <Volume2 className="w-5 h-5" /> ÉCOUTER LA SYLLABE
            </button>

            {/* Consonants list */}
            <div className="mb-4">
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">1. CHOISIS UNE LETTRE BLEUE</p>
              <div className="flex gap-2 justify-center flex-wrap">
                {consonants.map(c => (
                  <button
                    key={c}
                    onClick={() => { setConsonant(c); playSyllableSound(c, vowel); }}
                    className={`w-11 h-11 font-display font-bold text-xl rounded-lg border-2 transition-all cursor-pointer ${
                      consonant === c 
                        ? "bg-blue-500 border-blue-600 text-white scale-110 shadow" 
                        : "bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Vowels list */}
            <div>
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">2. CHOISIS UNE LETTRE ROUGE</p>
              <div className="flex gap-2 justify-center flex-wrap">
                {vowels.map(v => (
                  <button
                    key={v}
                    onClick={() => { setVowel(v); playSyllableSound(consonant, v); }}
                    className={`w-11 h-11 font-display font-bold text-xl rounded-lg border-2 transition-all cursor-pointer ${
                      vowel === v 
                        ? "bg-red-500 border-red-600 text-white scale-110 shadow" 
                        : "bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => speak("BRAVO ! TU AS COMPRIS COMMENT ON ASSEMBLLE LES SONS ! CLIQUE SUR LE BOUTON TURQUOISE POUR LE JEU SUIVANT.")}
              className="text-xs text-neutral-400 underline decoration-dotted hover:text-neutral-600 transition"
            >
              BESOIN D'AIDE ?
            </button>
            <button
              onClick={startWordGame}
              className="flex items-center gap-2 bg-brand-turquoise hover:bg-teal-400 text-white font-bold px-8 py-3.5 rounded-full shadow-lg transition transform hover:scale-105 text-base cursor-pointer"
            >
              JEU SUIVANT <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {step === "word" && (
        <div>
          <span className="bg-brand-coral/10 text-brand-coral font-bold px-4 py-1.5 rounded-full text-sm inline-block mb-4">
            JEU 3 : RECONNAÎTRE LE MOT !
          </span>
          
          {/* Large Emoji / Clue */}
          <div className="bg-white border-2 border-brand-apricot rounded-3xl p-6 max-w-sm mx-auto mb-6 shadow-sm">
            <span className="text-8xl block mb-2 animate-bounce">{words[wordIndex].emoji}</span>
            <span className="text-xs font-mono font-bold text-neutral-400 tracking-widest uppercase">SYLLABES : {words[wordIndex].syllable}</span>
          </div>

          <h3 className="font-display font-bold text-2xl text-neutral-800 mb-6 tracking-tight">
            CLIQUE SUR LE BON MOT EN CAPITALES :
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-md mx-auto mb-6">
            {words.map((item) => {
              const word = item.mot;
              const isSelected = selectedWord === word;
              let btnClass = "bg-white hover:bg-brand-apricot border-2 border-neutral-200 text-neutral-700";
              
              if (isSelected) {
                if (wordFeedback === "success") {
                  btnClass = "bg-green-100 border-green-500 text-green-700 scale-105 font-bold";
                } else {
                  btnClass = "bg-red-100 border-red-400 text-red-600 animate-shake";
                }
              }

              return (
                <button
                  key={word}
                  onClick={() => handleWordClick(word)}
                  disabled={wordFeedback === "success"}
                  className={`py-4 px-3 rounded-xl font-display font-bold text-2xl transition-all duration-200 shadow cursor-pointer ${btnClass}`}
                >
                  {word}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => speak(`OÙ EST ÉCRIT LE MOT ${words[wordIndex].mot} ?`)}
              className="flex items-center gap-2 bg-brand-yellow hover:bg-yellow-400 text-neutral-800 font-bold px-5 py-2.5 rounded-full shadow transition text-sm cursor-pointer"
            >
              <Volume2 className="w-4 h-4" /> RÉPÉTER
            </button>
            {wordFeedback === "success" && (
              <button
                onClick={nextWord}
                className="flex items-center gap-2 bg-brand-turquoise hover:bg-teal-400 text-white font-bold px-7 py-3 rounded-full shadow transition transform hover:scale-105 text-sm cursor-pointer"
              >
                CONTINUER <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {step === "victory" && (
        <div className="py-8">
          <div className="w-24 h-24 bg-brand-yellow/20 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-brand-yellow text-brand-yellow animate-pulse">
            <Award className="w-14 h-14" />
          </div>
          
          <h2 className="font-display font-bold text-4xl text-neutral-800 mb-4 tracking-tight animate-bounce">
            SUPER ! TU AS GAGNÉ !
          </h2>
          <p className="text-xl text-neutral-600 mb-8 max-w-md mx-auto font-sans">
            TU AS TRÈS BIEN APPRIS LES SONS ET LES MOTS DE LA JOURNÉE ! 🌟
          </p>
          
          <button
            onClick={onComplete}
            className="bg-brand-coral hover:bg-red-500 text-white font-bold px-10 py-4.5 rounded-full shadow-lg transition transform hover:-translate-y-1 text-lg cursor-pointer"
          >
            VALIDER ET TERMINER L'ATELIER
          </button>
        </div>
      )}
    </div>
  );
}
