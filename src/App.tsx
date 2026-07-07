/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { DAYS_DATA, DayData } from "./data/days.ts";
import Dashboard from "./components/Dashboard.tsx";
import DayView from "./components/DayView.tsx";
import { Sparkles, Star, Trophy, RefreshCw, Music, Heart, Volume2, VolumeX, HelpCircle } from "lucide-react";
import { speak, registerSpeakListener } from "./components/LectureGame.tsx";

export default function App() {
  // Vraie date du jour (locale, pas UTC → évite le décalage d'un jour).
  const currentDateStr = (() => {
    const d = new Date();
    const p = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
  })();
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);
  const [autoLaunchType, setAutoLaunchType] = useState<string | null>(null);
  
  // Initialize state with LocalStorage for robust persistence
  const [completedAteliers, setCompletedAteliers] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("completed_ateliers");
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  const [events, setEvents] = useState<{ [key: string]: { emoji: string; texte: string }[] }>(() => {
    try {
      const stored = localStorage.getItem("summer_events");
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      return {};
    }
  });

  const [showCelebration, setShowCelebration] = useState(false);
  const [currentSpeech, setCurrentSpeech] = useState<string>("");
  const [showSoundGuide, setShowSoundGuide] = useState<boolean>(false);

  // Register speak listener and trigger audio context unlock on interaction
  useEffect(() => {
    registerSpeakListener((text) => {
      setCurrentSpeech(text);
    });

    const unlockAudio = () => {
      if ("speechSynthesis" in window) {
        try {
          const utterance = new SpeechSynthesisUtterance("");
          window.speechSynthesis.speak(utterance);
        } catch (e) {
          console.warn("Could not unlock speech synthesis:", e);
        }
      }
      document.removeEventListener("click", unlockAudio);
      document.removeEventListener("touchstart", unlockAudio);
    };
    document.addEventListener("click", unlockAudio);
    document.addEventListener("touchstart", unlockAudio);
    return () => {
      document.removeEventListener("click", unlockAudio);
      document.removeEventListener("touchstart", unlockAudio);
    };
  }, []);

  // Automatically dismiss speech subtitles after 12 seconds
  useEffect(() => {
    if (currentSpeech) {
      const timer = setTimeout(() => {
        setCurrentSpeech("");
      }, 12000);
      return () => clearTimeout(timer);
    }
  }, [currentSpeech]);

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem("completed_ateliers", JSON.stringify(completedAteliers));
    } catch (e) {
      console.warn("LocalStorage failed:", e);
    }
  }, [completedAteliers]);

  useEffect(() => {
    try {
      localStorage.setItem("summer_events", JSON.stringify(events));
    } catch (e) {
      console.warn("LocalStorage failed:", e);
    }
  }, [events]);

  // À chaque changement de vue (ouvrir un jour / revenir au calendrier),
  // on remonte en haut de la page.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedDay]);

  const handleToggleComplete = (id: string) => {
    const isCompleted = completedAteliers.includes(id);
    let updated: string[];
    
    if (isCompleted) {
      updated = completedAteliers.filter(item => item !== id);
    } else {
      updated = [...completedAteliers, id];
      // Trigger short encouraging voice and celebration overlay
      speak("EXCELLENT TRAVAIL ! TU AS GAGNÉ UNE ÉTOILE !");
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
    
    setCompletedAteliers(updated);
  };

  const handleAddEvent = (date: string, emoji: string, texte: string) => {
    const dayEvents = events[date] || [];
    setEvents({
      ...events,
      [date]: [...dayEvents, { emoji, texte }]
    });
  };

  const handleRemoveEvent = (date: string, index: number) => {
    const dayEvents = events[date] || [];
    const updated = dayEvents.filter((_, i) => i !== index);
    const newEvents = { ...events };
    
    if (updated.length === 0) {
      delete newEvents[date];
    } else {
      newEvents[date] = updated;
    }
    setEvents(newEvents);
  };

  const handleSelectDay = (day: DayData) => {
    setAutoLaunchType(null);
    setSelectedDay(day);
  };

  const handleBackToDashboard = () => {
    setSelectedDay(null);
    setAutoLaunchType(null);
    // Nettoie le deep-link éventuel pour ne pas ré-ouvrir l'atelier.
    if (window.location.hash) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  };

  // Deep-link depuis l'aperçu : #/jour/AAAA-MM-JJ[/type] ouvre le jour et,
  // si un type est donné, lance directement l'atelier correspondant.
  // On écoute aussi hashchange pour réagir sans rechargement complet.
  useEffect(() => {
    const applyHash = () => {
      const m = window.location.hash.match(/^#\/jour\/(\d{4}-\d{2}-\d{2})(?:\/([a-z]+))?/);
      if (!m) return;
      const day = DAYS_DATA.find((d) => d.date === m[1]);
      if (day) {
        setSelectedDay(day);
        setAutoLaunchType(m[2] || null);
      }
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  const totalStars = completedAteliers.length;

  const handleResetProgress = () => {
    if (window.confirm("VOULEZ-VOUS VRAIMENT RECOMMENCER TOUS LES JEUX À ZÉRO ?")) {
      setCompletedAteliers([]);
      speak("C'EST PARTI POUR DE NOUVELLES AVENTURES !");
    }
  };

  return (
    <div className="min-h-screen bg-brand-apricot text-neutral-800 flex flex-col justify-between font-sans relative">
      
      {/* 1. Header (no-print) */}
      <header className="bg-white/80 backdrop-blur-md border-b border-brand-apricot/40 px-4 py-4 sticky top-0 z-40 shadow-sm no-print">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo & title */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleBackToDashboard}>
            <span className="text-3xl animate-pulse">🐌</span>
            <div>
              <h1 className="font-display font-black text-xl md:text-2xl text-neutral-800 tracking-tight leading-none uppercase">
                LE JARDIN DES VACANCES
              </h1>
              <p className="text-[10px] font-mono text-brand-coral font-bold uppercase tracking-widest mt-0.5">
                PORTAIL GRANDE SECTION 2026
              </p>
            </div>
          </div>

          {/* Stats count panel */}
          <div className="flex items-center gap-3">
            <div className="bg-brand-yellow/30 border border-brand-yellow px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
              <Star className="w-5 h-5 text-neutral-800 fill-current animate-spin-slow" />
              <span className="font-mono font-bold text-base text-neutral-800">{totalStars}</span>
              <span className="text-[10px] font-bold text-neutral-500 uppercase hidden sm:inline">ÉTOILES</span>
            </div>

            {/* Lien : toutes les activités */}
            <a
              href="apercu.html"
              className="p-2 rounded-full transition flex items-center justify-center bg-neutral-100 hover:bg-neutral-200 text-neutral-600"
              title="Voir toutes les activités de l'été"
            >
              <span className="text-base leading-none">👀</span>
            </a>

            {/* Guide Audio Button */}
            <button
              onClick={() => setShowSoundGuide(!showSoundGuide)}
              className={`p-2 rounded-full transition flex items-center justify-center ${
                showSoundGuide ? "bg-brand-coral text-white shadow-md animate-pulse" : "bg-neutral-100 hover:bg-neutral-200 text-neutral-500"
              }`}
              title="Guide Audio / Aide Son"
            >
              {showSoundGuide ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button 
              onClick={handleResetProgress}
              className="p-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-500 rounded-full transition"
              title="Réinitialiser la progression"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* Parents' Sound troubleshooting guide */}
      {showSoundGuide && (
        <div className="bg-brand-cream border-b-2 border-brand-yellow/50 p-5 animate-slide-down no-print text-xs text-neutral-700 font-sans uppercase">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-brand-coral flex items-center gap-1.5">
                🔊 PROBLÈME DE SON SUR VOTRE TABLETTE / MOBILE ?
              </h4>
              <p className="font-mono text-[10px] text-neutral-500">SUIVEZ CES 3 ÉTAPES POUR ACTIVER LA PAROLE DE L'ESCARGOT :</p>
              <ul className="list-decimal list-inside space-y-1.5 mt-1.5 font-semibold text-neutral-600">
                <li>
                  CLIQUEZ SUR L'ICÔNE <strong className="bg-neutral-200 px-1.5 py-0.5 rounded text-[10px]">↗️ (OUVRIR EN PLEIN ÉCRAN)</strong> EN HAUT À DROITE DE VOTRE ÉCRAN POUR CHANGER D'ONGLET (L'APPERÇU INCORPORÉ BLOQUE SOUVENT LE SON).
                </li>
                <li>
                  DÉSACTIVEZ LE MODE <strong className="text-brand-coral">SILENCIEUX / VIBREUR</strong> DE VOTRE IPAD OU TABLETTE (LE PETIT BOUTON PHYSIQUE SUR LE CÔTÉ DE L'APPAREIL, OU L'ICÔNE CLOCHE DANS LE MENU DU CODE DE CONTRÔLE).
                </li>
                <li>
                  MONTEZ LE VOLUME AUDIO DE VOTRE APPAREIL AU MAXIMUM !
                </li>
              </ul>
            </div>
            <button 
              onClick={() => setShowSoundGuide(false)}
              className="bg-neutral-800 hover:bg-black text-white font-bold px-4 py-2 rounded-xl text-[10px] self-end md:self-auto cursor-pointer shadow transition"
            >
              COMPRIS !
            </button>
          </div>
        </div>
      )}

      {/* 2. Main content container */}
      <main className="flex-grow py-6 md:py-10">
        {/* Snail Speech Bubble subtitles */}
        {currentSpeech && (
          <div className="max-w-7xl mx-auto px-4 md:px-6 mb-6 animate-bounce-subtle no-print">
            <div className="bg-brand-yellow text-neutral-800 border-4 border-neutral-800 p-5 rounded-3xl shadow-lg flex items-start gap-4 relative">
              <span className="text-4xl md:text-5xl select-none animate-pulse">🐌</span>
              <div className="flex-1">
                <span className="text-[10px] font-mono font-black text-neutral-500 uppercase tracking-widest block mb-1">
                  L'ESCARGOT PARLE :
                </span>
                <p className="font-display font-extrabold text-lg md:text-xl uppercase tracking-wide leading-snug">
                  {currentSpeech}
                </p>
              </div>
              <button 
                onClick={() => setCurrentSpeech("")} 
                className="text-neutral-500 hover:text-neutral-800 font-bold text-xl bg-white/50 hover:bg-white w-8 h-8 rounded-full flex items-center justify-center transition cursor-pointer"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {selectedDay ? (
          <DayView
            day={selectedDay}
            completedAteliers={completedAteliers}
            onToggleComplete={handleToggleComplete}
            onBack={handleBackToDashboard}
            autoLaunchType={autoLaunchType}
          />
        ) : (
          <Dashboard
            days={DAYS_DATA}
            currentDateStr={currentDateStr}
            completedAteliers={completedAteliers}
            events={events}
            onAddEvent={handleAddEvent}
            onRemoveEvent={handleRemoveEvent}
            onSelectDay={handleSelectDay}
          />
        )}
      </main>

      {/* 3. Footer (no-print) */}
      <footer className="bg-white border-t border-brand-apricot/30 py-6 px-4 text-center text-xs text-neutral-400 no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 font-sans uppercase font-semibold">
          <p>© 2026 LE JARDIN DES VACANCES - POUR UNE RENTRÉE EN TOUTE SÉRÉNITÉ</p>
          <div className="flex items-center gap-2 text-[10px] text-brand-coral">
            <Heart className="w-3.5 h-3.5 fill-current animate-pulse" />
            <span>FABRIQUÉ POUR LA GRANDE SECTION</span>
          </div>
        </div>
      </footer>

      {/* 4. Interactive Mascot Celebration Overlay */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50 animate-fade-in no-print">
          <div className="bg-white border-4 border-brand-yellow p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-4 animate-scale">
            <span className="text-8xl block select-none animate-bounce">🐌</span>
            <div className="text-center">
              <h3 className="font-display font-extrabold text-3xl text-neutral-800 uppercase tracking-tight">
                MÉGA CHAMPIONNE !
              </h3>
              <p className="text-sm font-sans tracking-wide text-brand-coral font-bold uppercase mt-1">
                L'ESCARGOT TE FÉLICITE ! 🌟
              </p>
            </div>
            <div className="flex gap-1 text-2xl animate-pulse">
              <span>🎉</span>
              <span>⭐</span>
              <span>🎉</span>
              <span>⭐</span>
              <span>🎉</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
