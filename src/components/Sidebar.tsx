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
    <aside className="w-64 bg-slate-950 text-slate-400 flex flex-col justify-between border-r border-slate-900 h-screen sticky top-0 select-none shrink-0 z-20" id="sidebar">
      {/* Brand Header */}
      <div>
        <div className="p-6 border-b border-slate-900 flex items-center space-x-3 bg-gradient-to-b from-sky-950/20 to-transparent" id="sidebar-header">
          <div className="p-2.5 bg-gradient-to-tr from-sky-600 to-sky-400 text-slate-950 rounded-xl shadow-lg shadow-sky-500/10 shrink-0" id="sidebar-logo">
            <Smartphone className="w-5 h-5 font-bold" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-slate-100 flex items-center gap-1.5 font-display" id="sidebar-title">
              BlueCom <span className="text-[10px] uppercase font-black tracking-wider text-sky-400 bg-sky-950/85 px-1.5 py-0.5 rounded border border-sky-850">BATNA</span>
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-extrabold mt-0.5" id="sidebar-subtitle">Registre d'Atelier</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="p-4 space-y-2 font-sans" id="sidebar-nav">
          <button
            id="nav-tab-nouveau"
            onClick={() => setActiveTab('nouveau')}
            className={`w-full flex items-center space-x-3 px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 relative cursor-pointer group ${
              activeTab === 'nouveau'
                ? 'bg-slate-900 text-slate-50 shadow-inner'
                : 'text-slate-450 hover:bg-slate-900/40 hover:text-slate-200'
            }`}
          >
            {activeTab === 'nouveau' && (
              <span className="absolute left-1.5 top-3.5 bottom-3.5 w-1 bg-sky-400 rounded-full"></span>
            )}
            <PenTool className={`w-4 h-4 flex-shrink-0 transition-transform ${activeTab === 'nouveau' ? 'text-sky-400' : 'text-slate-550 group-hover:text-slate-300'}`} />
            <span>Nouveau ticket</span>
          </button>

          <button
            id="nav-tab-liste"
            onClick={() => setActiveTab('liste')}
            className={`w-full flex items-center space-x-3 px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 relative cursor-pointer group ${
              activeTab === 'liste'
                ? 'bg-slate-900 text-slate-50 shadow-inner'
                : 'text-slate-450 hover:bg-slate-900/40 hover:text-slate-200'
            }`}
          >
            {activeTab === 'liste' && (
              <span className="absolute left-1.5 top-3.5 bottom-3.5 w-1 bg-sky-400 rounded-full"></span>
            )}
            <ClipboardList className={`w-4 h-4 flex-shrink-0 transition-transform ${activeTab === 'liste' ? 'text-sky-400' : 'text-slate-550 group-hover:text-slate-300'}`} />
            <span>Liste de réparations</span>
          </button>

          <button
            id="nav-tab-statistiques"
            onClick={() => setActiveTab('statistiques')}
            className={`w-full flex items-center space-x-3 px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 relative cursor-pointer group ${
              activeTab === 'statistiques'
                ? 'bg-slate-900 text-slate-50 shadow-inner'
                : 'text-slate-450 hover:bg-slate-900/40 hover:text-slate-200'
            }`}
          >
            {activeTab === 'statistiques' && (
              <span className="absolute left-1.5 top-3.5 bottom-3.5 w-1 bg-sky-400 rounded-full"></span>
            )}
            <LayoutDashboard className={`w-4 h-4 flex-shrink-0 transition-transform ${activeTab === 'statistiques' ? 'text-sky-400' : 'text-slate-550 group-hover:text-slate-300'}`} />
            <span>Statistiques</span>
          </button>
        </nav>
      </div>

      {/* Footer Info / Local reset */}
      <div className="p-4 border-t border-slate-900 bg-slate-950 text-[10px] text-slate-500 flex flex-col space-y-3" id="sidebar-footer">
        <div className="flex items-center justify-between font-semibold" id="sidebar-device-type">
          <span className="text-slate-500">Bureau Local</span>
          <span className="text-[9px] bg-slate-900 px-2 py-0.5 text-sky-400 font-mono rounded-full border border-slate-800">DZD (dz)</span>
        </div>
        
        <button 
          id="btn-reinitialiser-demo"
          onClick={() => {
            if (confirm("Réinitialiser les données aux valeurs de démonstration ?")) {
              resetAllTickets();
            }
          }}
          className="flex items-center justify-start space-x-1.5 hover:text-rose-400 transition-colors text-[10px] text-slate-500 hover:bg-rose-950/25 px-2.5 py-1.5 rounded-lg border border-transparent hover:border-rose-950/40 cursor-pointer w-full"
        >
          <RefreshCw className="w-3 h-3 hover:rotate-180 transition-transform duration-300" />
          <span className="font-bold uppercase tracking-wider text-[9px]">Réinitialiser la Démo</span>
        </button>

        <div className="text-[10px] text-slate-600 font-medium flex justify-between" id="sidebar-version-tag">
          <span>© BlueCom Batna</span>
          <span className="font-mono">v1.1.0</span>
        </div>
      </div>
    </aside>
  );
}
