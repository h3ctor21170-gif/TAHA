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
      className={`px-8 py-5 border-b flex justify-between items-center transition-colors duration-250 ${
        isDarkMode 
          ? 'bg-[#0f172a] border-[#1e293b]' 
          : 'bg-white border-slate-200'
      }`}
      id="app-header"
    >
      {/* Dynamic Screen Title & Subtitle */}
      <div>
        <h2 
          className={`text-xl font-bold tracking-tight transition-colors ${
            isDarkMode ? 'text-[#f8fafc]' : 'text-slate-900'
          }`} 
          id="header-tab-title"
        >
          {title}
        </h2>
        <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-[#94a3b8]' : 'text-slate-500'}`} id="header-tab-subtitle">
          {subtitle}
        </p>
      </div>

      {/* Utility Actions & Time */}
      <div className="flex items-center space-x-6" id="header-utils">
        {/* Local time and date display in French */}
        <div 
          className={`flex items-center space-x-2 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
            isDarkMode 
              ? 'bg-[#1e293b] border-[#334155] text-slate-350' 
              : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}
          id="header-clock"
        >
          <Clock className="w-4 h-4 text-[#38bdf8]" />
          <span className="capitalize">{formatFrenchDate(time)}</span>
          <span className="text-slate-500">|</span>
          <span className="font-mono text-[#38bdf8]">
            {time.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2" id="header-controls">
          {/* Theme Toggle */}
          <button
            id="theme-toggle-btn"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2.5 rounded-lg border transition-all hover:scale-105 active:scale-95 ${
              isDarkMode 
                ? 'bg-[#1e293b] border-[#334155] text-amber-400 hover:bg-slate-800' 
                : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
            }`}
            title="Basculer le thème"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Settings Trigger */}
          <button
            id="settings-trigger-btn"
            onClick={onOpenSettings}
            className={`p-2.5 rounded-lg border transition-all hover:scale-105 active:scale-95 ${
              isDarkMode 
                ? 'bg-[#1e293b] border-[#334155] text-slate-300 hover:bg-slate-800' 
                : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
            }`}
            title="Paramètres de l'Atelier"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* Active operator indicator for repair shop */}
        <div className="flex items-center space-x-2.5" id="header-operator">
          <div className="relative" id="operator-avatar-wrapper">
            <div className="w-8 h-8 rounded-full bg-[#38bdf8] flex items-center justify-center text-slate-950 font-bold text-xs" id="operator-avatar">
              OP
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#0f172a] rounded-full"></span>
          </div>
          <div className="text-left hidden md:block" id="operator-info">
            <p className={`text-xs font-bold leading-none ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Opérateur Batna</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Administrateur</p>
          </div>
        </div>
      </div>
    </header>
  );
}
