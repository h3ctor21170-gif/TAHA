/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Sun, Moon, Settings, UserCheck, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

interface HeaderProps {
  activeTab: 'statistiques' | 'liste' | 'nouveau';
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  onOpenSettings: () => void;
}

export default function Header({ activeTab, isDarkMode, setIsDarkMode, onOpenSettings }: HeaderProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getTitle = () => {
    switch (activeTab) {
      case 'statistiques':
        return {
          title: "Tableau de Bord & Statistiques",
          subtitle: "Analyse d'activité en temps réel pour BlueCom Batna"
        };
      case 'liste':
        return {
          title: "Registre des réparations",
          subtitle: "Recherchez, gérez et suivez l'évolution des commandes"
        };
      case 'nouveau':
        return {
          title: "Nouveau Ticket d'Intervention",
          subtitle: "Enregistrement d'un nouvel équipement en panne"
        };
    }
  };

  const { title, subtitle } = getTitle();

  const formatFrenchDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('fr-FR', options);
  };

  return (
    <header 
      className={`px-8 py-4.5 border-b flex flex-col md:flex-row justify-between items-center gap-4 transition-all duration-300 ${
        isDarkMode 
          ? 'bg-slate-950/80 border-slate-900/80 backdrop-blur-md' 
          : 'bg-white/90 border-slate-200/80 backdrop-blur-md'
      }`}
      id="app-header"
    >
      {/* Dynamic Screen Title & Subtitle */}
      <div>
        <h2 
          className={`text-lg md:text-xl font-extrabold font-display tracking-tight transition-colors ${
            isDarkMode ? 'text-slate-50' : 'text-slate-900'
          }`} 
          id="header-tab-title"
        >
          {title}
        </h2>
        <p className={`text-xs mt-0.5 font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} id="header-tab-subtitle">
          {subtitle}
        </p>
      </div>

      {/* Utility Actions & Time */}
      <div className="flex flex-wrap items-center gap-4 md:gap-6" id="header-utils">
        {/* Local time and date display in French */}
        <div 
          className={`flex items-center space-x-2 text-[11px] font-bold px-3.5 py-2 rounded-xl border transition-all shadow-sm ${
            isDarkMode 
              ? 'bg-slate-900/50 border-slate-800/85 text-slate-300 shadow-slate-950/20' 
              : 'bg-slate-50/85 border-slate-200/60 text-slate-650'
          }`}
          id="header-clock"
        >
          <Clock className="w-3.5 h-3.5 text-sky-400 shrink-0" />
          <span className="capitalize tracking-tight">{formatFrenchDate(time)}</span>
          <span className="text-slate-700 font-light">|</span>
          <span className="font-mono text-sky-450 dark:text-sky-400 leading-none">
            {time.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2" id="header-controls">
          {/* Theme Toggle */}
          <button
            id="theme-toggle-btn"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2.5 rounded-xl border transition-all hover:scale-[1.05] active:scale-[0.95] cursor-pointer ${
              isDarkMode 
                ? 'bg-slate-900/60 border-slate-850 text-amber-400 hover:bg-slate-900 hover:border-slate-800 hover:shadow-glow-amber hover:text-amber-300' 
                : 'bg-slate-50 border-slate-200 text-slate-650 hover:bg-slate-100 hover:text-slate-800 hover:shadow-sm'
            }`}
            title="Basculer le thème"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Settings Trigger */}
          <button
            id="settings-trigger-btn"
            onClick={onOpenSettings}
            className={`p-2.5 rounded-xl border transition-all hover:scale-[1.05] active:scale-[0.95] cursor-pointer ${
              isDarkMode 
                ? 'bg-slate-900/60 border-slate-850 text-slate-350 hover:bg-slate-900 hover:border-slate-800 hover:shadow-glow-blue hover:text-sky-400' 
                : 'bg-slate-50 border-slate-200 text-slate-650 hover:bg-slate-100 hover:text-slate-800 hover:shadow-sm'
            }`}
            title="Paramètres de l'Atelier"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* Active operator indicator for repair shop */}
        <div className={`flex items-center space-x-2.5 pl-4 border-l ${isDarkMode ? 'border-slate-900' : 'border-slate-200'}`} id="header-operator">
          <div className="relative group shrink-0" id="operator-avatar-wrapper">
            <div className="w-8.5 h-8.5 rounded-full bg-gradient-to-tr from-sky-500 to-sky-400 flex items-center justify-center text-slate-950 font-black text-xs shadow-md shadow-sky-500/10 border-2 dark:border-slate-950 border-white" id="operator-avatar">
              OP
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 dark:border-slate-950 border-white rounded-full animate-pulse"></span>
          </div>
          <div className="text-left hidden md:block select-none" id="operator-info">
            <p className={`text-xs font-extrabold leading-none ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>Opérateur Batna</p>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-wider">Atelier Chef</p>
          </div>
        </div>
      </div>
    </header>
  );
}
