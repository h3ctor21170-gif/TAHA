/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Ticket, DollarSign, Cpu, TrendingUp, AlertCircle, Hammer, CheckCircle, Smartphone } from 'lucide-react';
import { RepairTicket } from '../types';
import { motion } from 'motion/react';

interface DashboardProps {
  tickets: RepairTicket[];
  isDarkMode: boolean;
  onNavigateToTab: (tab: 'statistiques' | 'liste' | 'nouveau') => void;
}

export default function Dashboard({ tickets, isDarkMode, onNavigateToTab }: DashboardProps) {
  // Safe DZD formatter helper
  const formatDZD = (value: number) => {
    return new Intl.NumberFormat('fr-DZ', {
      style: 'currency',
      currency: 'DZD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Perform KPI calculations
  const totalTickets = tickets.length;
  const totalRevenue = tickets.reduce((acc, ticket) => acc + (ticket.prixFacture || 0), 0);
  const totalCost = tickets.reduce((acc, ticket) => acc + (ticket.piecePrix || 0), 0);
  const grossProfit = totalRevenue - totalCost;
  const marginPercentage = totalRevenue > 0 ? Math.round((grossProfit / totalRevenue) * 100) : 0;

  // Status breakdown calculations
  const countAttente = tickets.filter(t => t.statut === 'En attente de diagnostic').length;
  const countReparation = tickets.filter(t => t.statut === 'En réparation').length;
  const countTerminee = tickets.filter(t => t.statut === 'Réparation terminée').length;

  // Percentage calculations
  const percentAttente = totalTickets > 0 ? Math.round((countAttente / totalTickets) * 100) : 0;
  const percentReparation = totalTickets > 0 ? Math.round((countReparation / totalTickets) * 100) : 0;
  const percentTerminee = totalTickets > 0 ? Math.round((countTerminee / totalTickets) * 100) : 0;

  // Model and brand breakdown
  const phoneBrands: { [key: string]: number } = {};
  tickets.forEach(t => {
    const brand = t.modele.split(' ')[0] || 'Inconnu';
    phoneBrands[brand] = (phoneBrands[brand] || 0) + 1;
  });

  const formattedBrands = Object.entries(phoneBrands)
    .map(([name, count]) => ({ name, count, percentage: totalTickets > 0 ? Math.round((count / totalTickets) * 100) : 0 }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  // Recent 3 repairs
  const recentRepairs = [...tickets]
    .sort((a, b) => new Date(b.dateEntree).getTime() - new Date(a.dateEntree).getTime())
    .slice(0, 3);

  return (
    <div className="p-8 space-y-8" id="dashboard-view">
      {/* 4 KPI Counter Cards Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" id="kpi-container">
        {/* KPI 1: Total des tickets */}
        <motion.div
          id="kpi-card-total-tickets"
          whileHover={{ y: -4, scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={`p-5 rounded-xl border flex items-center justify-between shadow-lg transition-all ${
            isDarkMode 
              ? 'bg-[#1e293b] border-[#334155] shadow-slate-950/40 text-white' 
              : 'bg-white border-slate-150 shadow-slate-200/50 text-slate-800'
          }`}
        >
          <div className="space-y-1">
            <p className={`text-xs uppercase tracking-wider font-bold ${isDarkMode ? 'text-[#94a3b8]' : 'text-slate-500'}`}>
              Total des tickets
            </p>
            <h3 className={`text-2xl font-extrabold tracking-tight ${isDarkMode ? 'text-[#f8fafc]' : ''}`} id="kpi-val-total-tickets">
              {totalTickets}
            </h3>
            <p className="text-[10px] text-[#38bdf8] font-bold">
              Active et Historique
            </p>
          </div>
          <div className="p-3 bg-[#38bdf8]/10 rounded-lg text-[#38bdf8]" id="kpi-icon-total-tickets">
            <Ticket className="w-5 h-5" />
          </div>
        </motion.div>

        {/* KPI 2: Somme des prix facturés */}
        <motion.div
          id="kpi-card-revenue"
          whileHover={{ y: -4, scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={`p-5 rounded-xl border flex items-center justify-between shadow-lg transition-all ${
            isDarkMode 
              ? 'bg-[#1e293b] border-[#334155] shadow-slate-950/40 text-white' 
              : 'bg-white border-slate-150 shadow-slate-200/50 text-slate-800'
          }`}
        >
          <div className="space-y-1">
            <p className={`text-xs uppercase tracking-wider font-bold ${isDarkMode ? 'text-[#94a3b8]' : 'text-slate-500'}`}>
              Somme des prix facturés
            </p>
            <h3 className="text-2xl font-extrabold tracking-tight text-[#f8fafc] font-mono" id="kpi-val-revenue">
              {totalRevenue > 0 ? formatDZD(totalRevenue).replace("DZD", "").trim() : "0"}<span className="text-xs text-slate-500 ml-1 font-sans">DZD</span>
            </h3>
            <p className="text-[10px] text-emerald-400 font-bold">
              Chiffre d'affaires brut
            </p>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400" id="kpi-icon-revenue">
            <DollarSign className="w-5 h-5" />
          </div>
        </motion.div>

        {/* KPI 3: Total pièces d'origine */}
        <motion.div
          id="kpi-card-parts-cost"
          whileHover={{ y: -4, scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={`p-5 rounded-xl border flex items-center justify-between shadow-lg transition-all ${
            isDarkMode 
              ? 'bg-[#1e293b] border-[#334155] shadow-slate-950/40 text-white' 
              : 'bg-white border-slate-150 shadow-slate-200/50 text-slate-800'
          }`}
        >
          <div className="space-y-1">
            <p className={`text-xs uppercase tracking-wider font-bold ${isDarkMode ? 'text-[#94a3b8]' : 'text-slate-500'}`}>
              Pièces d'origine investies
            </p>
            <h3 className="text-2xl font-extrabold tracking-tight text-[#f8fafc] font-mono" id="kpi-val-parts-cost">
              {totalCost > 0 ? formatDZD(totalCost).replace("DZD", "").trim() : "0"}<span className="text-xs text-slate-500 ml-1 font-sans">DZD</span>
            </h3>
            <p className="text-[10px] text-amber-500 font-bold">
              Coût total du stock utilisé
            </p>
          </div>
          <div className="p-3 bg-amber-500/10 rounded-lg text-amber-400" id="kpi-icon-parts-cost">
            <Cpu className="w-5 h-5" />
          </div>
        </motion.div>

        {/* KPI 4: Marge brute */}
        <motion.div
          id="kpi-card-profit"
          whileHover={{ y: -4, scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={`p-5 rounded-xl border flex items-center justify-between shadow-lg transition-all ${
            isDarkMode 
              ? 'bg-[#1e293b] border-[#334155] shadow-slate-950/40 text-white' 
              : 'bg-white border-slate-150 shadow-slate-200/50 text-slate-800'
          }`}
        >
          <div className="space-y-1">
            <p className={`text-xs uppercase tracking-wider font-bold ${isDarkMode ? 'text-[#94a3b8]' : 'text-slate-500'}`}>
              Marge brute
            </p>
            <h3 className="text-2xl font-extrabold tracking-tight text-emerald-400 font-mono" id="kpi-val-profit">
              {grossProfit > 0 ? '+' : ''}{formatDZD(grossProfit).replace("DZD", "").trim()}<span className="text-xs text-slate-500 ml-1 font-sans">DZD</span>
            </h3>
            <p className="text-[10px] text-[#38bdf8] font-bold">
              + {marginPercentage}% de rentabilité brut
            </p>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400" id="kpi-icon-profit">
            <TrendingUp className="w-5 h-5" />
          </div>
        </motion.div>
      </div>

      {/* Main Charts & Analytics Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="dashboard-grids">
        
        {/* Real-time Status Breakdown Section */}
        <div 
          id="section-breakdown" 
          className={`p-6 rounded-2xl border lg:col-span-2 shadow-lg transition-all ${
            isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between pb-5 border-b border-dashed border-slate-200 dark:border-slate-800" id="section-breakdown-header">
            <div>
              <h4 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                Répartition par Statut
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">Pourcentage et volume physique des tickets en cours d'atelier</p>
            </div>
            <span className="text-xs font-semibold text-[#38bdf8] px-2.5 py-1 bg-[#38bdf8]/10 rounded-full">
              {totalTickets} Tickets au total
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8" id="status-card-grid">
            {/* Status: En attente */}
            <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-[#0f172a] border-[#334155]' : 'bg-slate-50 border-slate-100'}`} id="status-card-attente">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#713f12] text-[#fde047]">Diagnostic</span>
                <span className={`text-sm font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-700'}`}>{countAttente}</span>
              </div>
              <p className={`text-xs mt-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>En attente de diagnostic</p>
              <div className="w-full bg-slate-700/30 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-[#fde047] h-full rounded-full transition-all duration-350" style={{ width: `${percentAttente}%` }}></div>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block font-semibold">{percentAttente}% du volume</span>
            </div>

            {/* Status: En réparation */}
            <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-[#0f172a] border-[#334155]' : 'bg-slate-50 border-slate-100'}`} id="status-card-reparation">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#581c87] text-[#d8b4fe]">En réparation</span>
                <span className={`text-sm font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-700'}`}>{countReparation}</span>
              </div>
              <p className={`text-xs mt-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>En cours de travail</p>
              <div className="w-full bg-slate-700/30 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-[#d8b4fe] h-full rounded-full transition-all duration-350" style={{ width: `${percentReparation}%` }}></div>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block font-semibold">{percentReparation}% du volume</span>
            </div>

            {/* Status: Réparation terminée */}
            <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-[#0f172a] border-[#334155]' : 'bg-slate-50 border-slate-100'}`} id="status-card-terminee">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#064e3b] text-[#6ee7b7]">Terminée</span>
                <span className={`text-sm font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-700'}`}>{countTerminee}</span>
              </div>
              <p className={`text-xs mt-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Prêt à être récupéré</p>
              <div className="w-full bg-slate-700/30 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-[#6ee7b7] h-full rounded-full transition-all duration-350" style={{ width: `${percentTerminee}%` }}></div>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block font-semibold">{percentTerminee}% du volume</span>
            </div>
          </div>

          {/* Quick Graph of brand breakdown */}
          <div className="mt-2 space-y-4" id="brand-breakdown-sub">
            <h5 className={`text-xs font-bold tracking-wider uppercase ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Marques de téléphones en atelier
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="brand-bars">
              {formattedBrands.length > 0 ? (
                formattedBrands.map((brand, idx) => (
                  <div key={idx} className="flex flex-col space-y-1.5" id={`brand-bar-${idx}`}>
                    <div className="flex justify-between text-xs" id={`brand-lbl-${idx}`}>
                      <span className={`font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{brand.name}</span>
                      <span className="text-slate-400 font-semibold">{brand.count} {brand.count > 1 ? 'appareils' : 'appareil'} ({brand.percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-700/20 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-[#38bdf8] h-full rounded-full transition-all duration-500" 
                        style={{ width: `${brand.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center text-xs text-slate-500 py-4" id="brand-no-data">
                  Aucun appareil enregistré dans votre système pour l'instant.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent timeline sidebar inside statistics (right-hand column) */}
        <div 
          id="section-timeline" 
          className={`p-6 rounded-2xl border shadow-lg flex flex-col justify-between transition-all ${
            isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-slate-200'
          }`}
        >
          <div className="space-y-4" id="timeline-top">
            <h4 id="recent-tickets-title" className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
              Dernières entrées
            </h4>
            
            <div className="space-y-4 pt-2" id="timeline-list">
              {recentRepairs.length > 0 ? (
                recentRepairs.map((ticket) => (
                  <div 
                    key={ticket.id} 
                    id={`timeline-item-${ticket.id}`}
                    onClick={() => onNavigateToTab('liste')}
                    className={`flex items-start space-x-3 p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      isDarkMode 
                        ? 'bg-[#0f172a] border-[#334155] hover:bg-slate-800' 
                        : 'bg-slate-50 border-slate-100 hover:bg-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <div className="p-2 bg-[#38bdf8]/10 rounded-lg text-[#38bdf8] mt-1" id={`timeline-avatar-${ticket.id}`}>
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0" id={`timeline-info-${ticket.id}`}>
                      <div className="flex items-center justify-between" id={`timeline-meta-${ticket.id}`}>
                        <h5 className={`text-xs font-bold truncate ${isDarkMode ? 'text-slate-205' : 'text-slate-800'}`}>
                          {ticket.nomClient}
                        </h5>
                        <span className="text-[10px] text-[#38bdf8] font-bold font-mono bg-[#38bdf8]/10 px-1 py-0.5 rounded">
                          {ticket.id}
                        </span>
                      </div>
                      <p className={`text-[11px] truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        {ticket.modele}
                      </p>
                      <p className="text-[10px] text-slate-550 truncate italic mt-1" id={`timeline-problem-${ticket.id}`}>
                        {ticket.descriptionProbleme}
                      </p>
                      
                      {/* Date details and badge */}
                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-dashed border-[#334155]/50">
                        <span className="text-[9px] text-slate-400">
                          {new Date(ticket.dateEntree).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                        </span>
                        
                        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                          ticket.statut === 'Réparation terminée' 
                            ? 'text-[#6ee7b7] bg-[#064e3b]'
                            : ticket.statut === 'En réparation'
                            ? 'text-[#d8b4fe] bg-[#581c87]'
                            : 'text-[#fde047] bg-[#713f12]'
                        }`} id={`timeline-badge-${ticket.id}`}>
                          {ticket.statut === 'Réparation terminée' ? 'Terminée' : ticket.statut === 'En réparation' ? 'En cours' : 'Diagnostic'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-xs text-slate-500 py-8" id="recent-no-data">
                  Aucun ticket de réparation disponible.
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-[#334155] mt-4" id="timeline-bottom">
            <button
              id="btn-all-repairs-nav"
              onClick={() => onNavigateToTab('liste')}
              className="w-full py-2.5 text-xs font-bold text-center bg-[#0284c7] hover:bg-[#0284c7]/95 active:bg-[#0284c7]/90 text-white rounded-lg transition-all duration-200"
            >
              Consulter tout le registre
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
