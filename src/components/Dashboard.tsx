/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Calendar as CalendarIcon, Clock, Plus, Trash2, Printer, Star, Heart } from "lucide-react";
import { DayData } from "../data/days.ts";

interface DashboardProps {
  days: DayData[];
  currentDateStr: string;
  completedAteliers: string[];
  events: { [key: string]: { emoji: string; texte: string }[] };
  onAddEvent: (date: string, emoji: string, texte: string) => void;
  onRemoveEvent: (date: string, index: number) => void;
  onSelectDay: (day: DayData) => void;
}

export default function Dashboard({
  days,
  currentDateStr,
  completedAteliers,
  events,
  onAddEvent,
  onRemoveEvent,
  onSelectDay,
}: DashboardProps) {
  const [selectedEventDate, setSelectedEventDate] = useState<string | null>(null);
  const [eventEmoji, setEventEmoji] = useState("🏖️");
  const [eventText, setEventText] = useState("");

  const rentreeDate = new Date("2026-09-01T00:00:00");
  const today = new Date(currentDateStr);
  
  // Calculate countdown days
  const timeDiff = rentreeDate.getTime() - today.getTime();
  const countdownDays = Math.max(0, Math.ceil(timeDiff / (1000 * 3600 * 24)));

  const emojiPalette = [
    "🏖️", "👵", "👴", "🏕️", "✈️", "🚗", "🚲", "🍦", 
    "🍕", "🎈", "🌊", "🌳", "🎒", "🎨", "⚽", "🦄", "🐶", "🐱"
  ];

  // Group days by month (Juillet vs Août)
  const getDaysInMonthGrid = (year: number, monthIndex: number) => {
    const firstDay = new Date(year, monthIndex, 1);
    const startDayOfWeek = (firstDay.getDay() + 6) % 7; // Monday = 0, Sunday = 6
    const totalDays = new Date(year, monthIndex + 1, 0).getDate();
    
    const grid: (DayData | null)[] = Array(startDayOfWeek).fill(null);
    
    for (let d = 1; d <= totalDays; d++) {
      const monthStr = String(monthIndex + 1).padStart(2, "0");
      const dayStr = String(d).padStart(2, "0");
      const fullDateStr = `${year}-${monthStr}-${dayStr}`;
      
      const foundDay = days.find(day => day.date === fullDateStr);
      if (foundDay) {
        grid.push(foundDay);
      } else {
        // Fallback placeholder DayData if not inside days range (e.g., July 1-5)
        grid.push({
          date: fullDateStr,
          themeId: "placeholder",
          themeNom: "HORS PARCOURS",
          themeEmoji: "🗓️",
          ateliers: []
        });
      }
    }
    
    return grid;
  };

  const julyGrid = getDaysInMonthGrid(2026, 6); // index 6 is July
  const augustGrid = getDaysInMonthGrid(2026, 7); // index 7 is August

  const handleOpenEventModal = (e: React.MouseEvent, date: string) => {
    e.stopPropagation(); // prevent opening the day view
    setSelectedEventDate(date);
    setEventText("");
    setEventEmoji("🏖️");
  };

  const handleSaveEvent = () => {
    if (selectedEventDate && eventText.trim()) {
      onAddEvent(selectedEventDate, eventEmoji, eventText.toUpperCase().trim());
      setSelectedEventDate(null);
    }
  };

  const isDayCompleted = (day: DayData) => {
    if (day.ateliers.length === 0) return false;
    return day.ateliers.every(a => completedAteliers.includes(a.id));
  };

  const renderMonthTable = (grid: (DayData | null)[], monthTitle: string) => {
    const weekdays = ["LUN", "MAR", "MER", "JEU", "VEN", "SAM", "DIM"];
    
    return (
      <div className="bg-white rounded-3xl p-4 md:p-6 shadow-md border-2 border-brand-apricot/60">
        <h3 className="font-display font-bold text-2xl text-neutral-800 text-center mb-6 uppercase tracking-tight">
          📅 {monthTitle} 2026
        </h3>
        
        <div className="grid grid-cols-7 gap-1.5 md:gap-3">
          {weekdays.map(w => (
            <span key={w} className="text-center font-display font-bold text-xs text-neutral-400 py-1 uppercase tracking-wider">
              {w}
            </span>
          ))}

          {grid.map((day, idx) => {
            if (!day) {
              return <div key={`empty-${idx}`} className="bg-neutral-50/20 rounded-2xl border-2 border-transparent" />;
            }

            const isToday = day.date === currentDateStr;
            const isPast = day.date < currentDateStr;
            const completed = isDayCompleted(day);
            const dayEvents = events[day.date] || [];
            
            // Format single digit days for display
            const dayNum = parseInt(day.date.split("-")[2]);

            return (
              <div
                key={day.date}
                onClick={() => day.themeId !== "placeholder" && onSelectDay(day)}
                className={`min-h-[90px] md:min-h-[110px] rounded-2xl p-2 border-2 transition-all duration-300 relative cursor-pointer select-none flex flex-col justify-between ${
                  isToday 
                    ? "bg-brand-cream border-brand-coral ring-4 ring-brand-coral/20 scale-102 shadow-lg" 
                    : isPast 
                    ? "bg-neutral-50 border-neutral-100 opacity-70" 
                    : "bg-white border-neutral-100 hover:border-brand-apricot hover:bg-brand-apricot/10"
                }`}
              >
                {/* Cell Header */}
                <div className="flex justify-between items-start">
                  <span className={`font-mono font-bold text-base md:text-lg ${
                    isToday ? "text-brand-coral font-black" : "text-neutral-700"
                  }`}>
                    {dayNum}
                  </span>
                  
                  {/* Status Indicator */}
                  {completed ? (
                    <span className="text-xs text-green-500 animate-pulse font-bold">⭐</span>
                  ) : day.themeId !== "placeholder" && !isPast ? (
                    <span className="text-xs text-neutral-300 transform hover:scale-110">{day.themeEmoji}</span>
                  ) : null}
                </div>

                {/* Event Display */}
                <div className="flex-1 my-1.5 overflow-hidden flex flex-col gap-1">
                  {dayEvents.map((evt, eIdx) => (
                    <div 
                      key={eIdx} 
                      className="bg-brand-yellow/30 text-[9px] md:text-[10px] font-bold text-neutral-800 rounded px-1.5 py-0.5 flex items-center justify-between gap-1 overflow-hidden truncate font-sans tracking-wide uppercase"
                    >
                      <span className="truncate">{evt.emoji} {evt.texte}</span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); onRemoveEvent(day.date, eIdx); }}
                        className="text-neutral-400 hover:text-brand-coral font-bold px-0.5 no-print"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Event Trigger */}
                {day.themeId !== "placeholder" && (
                  <button
                    onClick={(e) => handleOpenEventModal(e, day.date)}
                    className="opacity-0 hover:opacity-100 absolute bottom-1.5 right-1.5 bg-brand-apricot hover:bg-brand-yellow text-neutral-700 w-5 h-5 rounded-full flex items-center justify-center text-xs transition border border-neutral-200 no-print"
                    title="Ajouter un événement"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 md:p-6">
      
      {/* 1. Countdown Ribbon (Compte à rebours) */}
      <div className="bg-gradient-to-r from-brand-coral to-red-400 text-white rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between shadow-xl relative overflow-hidden no-print">
        <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 text-9xl opacity-10 font-black select-none">🎒</div>
        <div className="flex items-center gap-4 mb-4 sm:mb-0">
          <div className="bg-white/20 p-4 rounded-2xl border border-white/30 backdrop-blur-md">
            <Clock className="w-8 h-8 text-white animate-pulse" />
          </div>
          <div>
            <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight uppercase">
              J-{countdownDays} AVANT LA RENTRÉE 🏫
            </h2>
            <p className="text-sm font-sans tracking-widest text-brand-yellow font-bold uppercase mt-1">
              CHAMPIONNE EN ROUTE POUR LA GRANDE SECTION !
            </p>
          </div>
        </div>
        
        {/* Visual Progress Row of icons */}
        <div className="flex gap-2 text-3xl select-none bg-white/10 px-4 py-2.5 rounded-2xl border border-white/20">
          <span title="Juillet" className="opacity-100 filter drop-shadow">🏖️</span>
          <span className="text-white/40">➔</span>
          <span title="Août" className="opacity-100 filter drop-shadow">🏕️</span>
          <span className="text-white/40">➔</span>
          <span title="Rentrée" className="animate-bounce">🎒</span>
        </div>
      </div>

      {/* 2. Interactive Calendar months grids */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 no-print">
        {renderMonthTable(julyGrid, "JUILLET")}
        {renderMonthTable(augustGrid, "AOÛT")}
      </div>

      {/* 3. Tablet Help & Print triggers */}
      <div className="bg-brand-cream border-4 border-dashed border-brand-apricot rounded-3xl p-6 max-w-4xl mx-auto text-center space-y-4 no-print shadow-sm">
        <h4 className="font-display font-extrabold text-lg text-brand-coral uppercase tracking-tight">
          📱 EN VACANCES SUR TABLETTE OU MOBILE ?
        </h4>
        <p className="font-sans font-bold text-sm text-neutral-600 uppercase leading-relaxed max-w-2xl mx-auto">
          TOUT PEUT SE FAIRE SUR L'ÉCRAN SANS IMPRIMANTE ! TU PEUX COLORIER, TRACER, RELIER AVEC TON DOIGT, ET MARQUER LES JOURS COMPLÉTÉS EN DIRECT.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2">
          <button
            onClick={() => {
              try {
                window.print();
              } catch (e) {
                console.warn("Print error", e);
              }
            }}
            className="inline-flex items-center gap-2 bg-neutral-800 hover:bg-black text-white font-bold py-3.5 px-6 rounded-2xl text-xs transition shadow-md transform hover:-translate-y-0.5 cursor-pointer uppercase w-full sm:w-auto justify-center"
          >
            <Printer className="w-4 h-4" /> IMPRIMER LE CALENDRIER DE L'ÉTÉ
          </button>
          
          <div className="text-xs font-mono font-bold text-neutral-400 uppercase">
            OU
          </div>
          
          <div className="text-brand-coral font-bold text-xs uppercase bg-white px-4 py-2.5 border-2 border-brand-apricot rounded-xl w-full sm:w-auto">
            🐌 TRACE, RECOPIE ET JOUE SUR L'ÉCRAN !
          </div>
        </div>
      </div>

      {/* 4. Event Editing Popup (no-print) */}
      {selectedEventDate && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 no-print">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border-4 border-brand-apricot shadow-2xl relative">
            <h4 className="font-display font-bold text-lg text-neutral-800 uppercase tracking-tight mb-4">
              📝 AJOUTER UN ÉVÉNEMENT
            </h4>
            
            {/* Emoji Selector Grid */}
            <div className="grid grid-cols-6 gap-2 mb-4">
              {emojiPalette.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => setEventEmoji(emoji)}
                  className={`text-2xl p-1.5 rounded-xl transition transform hover:scale-110 cursor-pointer ${
                    eventEmoji === emoji ? "bg-brand-yellow" : "bg-neutral-50"
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>

            {/* Event Name Input */}
            <input
              type="text"
              placeholder="EX : PLAGE, MAMIE, VELO..."
              value={eventText}
              onChange={(e) => setEventText(e.target.value.toUpperCase())}
              className="w-full border-2 border-neutral-200 rounded-xl px-4 py-3 font-display text-base font-bold text-neutral-700 tracking-wide uppercase placeholder-neutral-400 mb-6 focus:border-brand-coral focus:outline-none"
            />

            {/* Footer triggers */}
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedEventDate(null)}
                className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 font-bold py-2.5 rounded-xl text-xs transition cursor-pointer"
              >
                ANNULER
              </button>
              <button
                onClick={handleSaveEvent}
                className="flex-1 bg-brand-coral hover:bg-red-500 text-white font-bold py-2.5 rounded-xl text-xs transition shadow cursor-pointer"
              >
                ENREGISTRER
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          5. PRINTABLE FULL A4 LANDSCAPE CALENDARS
          ========================================== */}
      <div className="hidden print:block space-y-12">
        {/* July Print Month */}
        <PrintMonthLayout monthTitle="JUILLET" grid={julyGrid} events={events} />
        {/* August Print Month */}
        <PrintMonthLayout monthTitle="AOÛT" grid={augustGrid} events={events} />
      </div>

    </div>
  );
}

// Separate print month layout component to keep printable outcomes stunningly clear
function PrintMonthLayout({ monthTitle, grid, events }: { monthTitle: string; grid: (any | null)[]; events: any }) {
  const weekdays = ["LUN", "MAR", "MER", "JEU", "VEN", "SAM", "DIM"];
  
  return (
    <div className="print-container border-4 border-neutral-300 p-8 m-4 rounded-3xl min-h-[29cm] flex flex-col justify-between bg-white text-black page-break-after">
      <div>
        <div className="flex justify-between items-center border-b-4 border-neutral-300 pb-4 mb-6">
          <div>
            <h1 className="text-4xl font-bold uppercase tracking-tight">{monthTitle} 2026</h1>
            <p className="text-sm text-neutral-500 uppercase font-semibold tracking-wider">MON CALENDRIER DE L'ÉTÉ À COLORIER ET REMPLIR</p>
          </div>
          <span className="text-5xl">📅</span>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {weekdays.map(w => (
            <span key={w} className="text-center font-bold text-sm text-neutral-600 py-1 border-b border-neutral-300">
              {w}
            </span>
          ))}

          {grid.map((day: any, idx: number) => {
            if (!day) {
              return <div key={`print-empty-${idx}`} className="border border-neutral-200 h-[120px] bg-neutral-50/10" />;
            }

            const dayNum = parseInt(day.date.split("-")[2]);
            const dayEvents = events[day.date] || [];

            return (
              <div key={`print-${day.date}`} className="border-2 border-neutral-300 h-[120px] p-2 flex flex-col justify-between bg-white">
                <span className="font-bold text-lg">{dayNum}</span>
                
                {/* Embedded printed events */}
                <div className="flex-1 mt-1 space-y-1 overflow-hidden">
                  {dayEvents.map((evt: any, eIdx: number) => (
                    <div key={eIdx} className="bg-neutral-100 border border-neutral-200 rounded px-1 py-0.5 text-[9px] font-bold uppercase tracking-wide truncate">
                      {evt.emoji} {evt.texte}
                    </div>
                  ))}
                </div>

                <div className="text-[10px] text-right font-bold text-neutral-400 uppercase">
                  {day.themeId !== "placeholder" ? day.themeEmoji : ""}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-t-2 border-neutral-300 pt-4 flex justify-between items-center text-xs text-neutral-400 font-mono">
        <span>☀️ CALENDRIER DE L'ÉTÉ GRANDE SECTION</span>
        <span>PRÉNOM : _________________</span>
      </div>
    </div>
  );
}
