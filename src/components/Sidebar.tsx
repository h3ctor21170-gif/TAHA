/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LayoutDashboard, ClipboardList, PenTool, Smartphone, RefreshCw } from 'lucide-react';

interface SidebarProps {
  activeTab: 'statistiques' | 'liste' | 'nouveau';
  setActiveTab: (tab: 'statistiques' | 'liste' | 'nouveau') => void;
  resetAllTickets: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, resetAllTickets }: SidebarProps) {
  return (
    <aside className="w-64 bg-[#020617] text-[#94a3b8] flex flex-col justify-between border-r border-[#1e293b] h-screen sticky top-0" id="sidebar">
      {/* Brand Header */}
      <div>
        <div className="p-6 border-b border-[#1e293b] flex items-center space-x-3 bg-gradient-to-r from-sky-900/15 to-transparent" id="sidebar-header">
          <div className="p-2 bg-[#38bdf8]/10 rounded-lg text-[#38bdf8] shadow-lg shadow-[#38bdf8]/5" id="sidebar-logo">
            <Smartphone className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5" id="sidebar-title">
              BlueCom <span className="text-[#38bdf8] font-black text-xs px-1.5 py-0.5 bg-[#38bdf8]/10 rounded border border-[#38bdf8]/25">BATNA</span>
            </h1>
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold" id="sidebar-subtitle">Atelier de Réparations</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="p-4 space-y-1.5" id="sidebar-nav">
          <button
            id="nav-tab-nouveau"
            onClick={() => setActiveTab('nouveau')}
            className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-semibold transition-all duration-200 border-l-4 ${
              activeTab === 'nouveau'
                ? 'bg-[#1e293b] text-[#f8fafc] border-[#38bdf8]'
                : 'text-[#94a3b8] border-transparent hover:bg-[#1e293b]/50 hover:text-[#f8fafc]'
            }`}
          >
            <PenTool className="w-5 h-5 flex-shrink-0" />
            <span>Nouveau ticket</span>
          </button>

          <button
            id="nav-tab-liste"
            onClick={() => setActiveTab('liste')}
            className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-semibold transition-all duration-200 border-l-4 ${
              activeTab === 'liste'
                ? 'bg-[#1e293b] text-[#f8fafc] border-[#38bdf8]'
                : 'text-[#94a3b8] border-transparent hover:bg-[#1e293b]/50 hover:text-[#f8fafc]'
            }`}
          >
            <ClipboardList className="w-5 h-5 flex-shrink-0" />
            <span>Liste des réparations</span>
          </button>

          <button
            id="nav-tab-statistiques"
            onClick={() => setActiveTab('statistiques')}
            className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-semibold transition-all duration-200 border-l-4 ${
              activeTab === 'statistiques'
                ? 'bg-[#1e293b] text-[#f8fafc] border-[#38bdf8]'
                : 'text-[#94a3b8] border-transparent hover:bg-[#1e293b]/50 hover:text-[#f8fafc]'
            }`}
          >
            <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
            <span>Statistiques</span>
          </button>
        </nav>
      </div>

      {/* Footer Info / Local reset */}
      <div className="p-4 border-t border-[#1e293b] bg-[#020617] text-xs text-slate-500 flex flex-col space-y-2" id="sidebar-footer">
        <div className="flex items-center justify-between" id="sidebar-device-type">
          <span>Application Bureau</span>
          <span className="text-[10px] bg-[#1e293b] px-1.5 py-0.5 text-[#38bdf8] rounded-full border border-slate-800">DZD (dz)</span>
        </div>
        <button 
          id="btn-reinitialiser-demo"
          onClick={() => {
            if (confirm("Réinitialiser les données aux valeurs de démonstration ?")) {
              resetAllTickets();
            }
          }}
          className="flex items-center justify-start space-x-1 hover:text-red-400 transition-colors text-[10px] text-slate-400 pt-1"
        >
          <RefreshCw className="w-3 h-3 animate-spin hover:animate-none" />
          <span>Réinitialiser les données</span>
        </button>
        <div className="text-[10px] text-slate-500 flex justify-between" id="sidebar-version-tag">
          <span>© BlueCom Batna</span>
          <span>v1.0.0</span>
        </div>
      </div>
    </aside>
  );
}
