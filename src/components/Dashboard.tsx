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
    <div className="p-6 md:p-8 space-y-6 md:space-y-8 font-sans" id="dashboard-view">
      {/* 4 KPI Counter Cards Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="kpi-container">
        {/* KPI 1: Total des tickets */}
        <motion.div
          id="kpi-card-total-tickets"
          whileHover={{ y: -4, scale: 1.01 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className={`p-6 rounded-2xl border flex items-center justify-between transition-all duration-300 ${
            isDarkMode 
              ? 'bg-slate-900/40 border-slate-900/90 shadow-2xl shadow-slate-950/40 text-slate-100 hover:border-sky-500/20 hover:shadow-glow-blue' 
              : 'bg-white border-slate-200/60 shadow-md shadow-slate-100/50 text-slate-800 hover:border-sky-500/35 hover:shadow-sky-500/5'
          }`}
        >
          <div className="space-y-2">
            <p className={`text-[10px] uppercase tracking-widest font-extrabold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Volume de charge
            </p>
            <h3 className="text-3xl font-black font-display tracking-tight leading-none" id="kpi-val-total-tickets">
              {totalTickets}
            </h3>
            <p className="text-[10px] text-sky-450 dark:text-sky-400 font-bold uppercase tracking-wider">
              Tickets Actifs & Historique
            </p>
          </div>
          <div className="p-3 bg-sky-500/10 dark:bg-sky-500/5 rounded-xl text-sky-550 dark:text-sky-400 border border-sky-500/10" id="kpi-icon-total-tickets">
            <Ticket className="w-5 h-5" />
          </div>
        </motion.div>

        {/* KPI 2: Somme des prix facturés */}
        <motion.div
          id="kpi-card-revenue"
          whileHover={{ y: -4, scale: 1.01 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className={`p-6 rounded-2xl border flex items-center justify-between transition-all duration-300 ${
            isDarkMode 
              ? 'bg-slate-900/40 border-slate-900/90 shadow-2xl shadow-slate-950/40 text-slate-100 hover:border-amber-500/20 hover:shadow-glow-amber' 
              : 'bg-white border-slate-200/60 shadow-md shadow-slate-100/50 text-slate-800 hover:border-amber-500/35 hover:shadow-amber-500/5'
          }`}
        >
          <div className="space-y-2">
            <p className={`text-[10px] uppercase tracking-widest font-extrabold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Prix global facturé
            </p>
            <h3 className="text-2.5xl font-black font-mono tracking-tight leading-none text-amber-500 dark:text-amber-450" id="kpi-val-revenue">
              {totalRevenue > 0 ? formatDZD(totalRevenue).replace("DZD", "").trim() : "0"}<span className="text-[10px] text-slate-500 ml-1 font-sans font-bold">DZD</span>
            </h3>
            <p className="text-[10px] text-emerald-500 dark:text-emerald-400 font-bold uppercase tracking-wider">
              Total Chiffre d'affaires
            </p>
          </div>
          <div className="p-3 bg-amber-500/10 dark:bg-amber-500/5 rounded-xl text-amber-550 dark:text-amber-450 border border-amber-500/10" id="kpi-icon-revenue">
            <DollarSign className="w-5 h-5" />
          </div>
        </motion.div>

        {/* KPI 3: Total pièces d'origine */}
        <motion.div
          id="kpi-card-parts-cost"
          whileHover={{ y: -4, scale: 1.01 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className={`p-6 rounded-2xl border flex items-center justify-between transition-all duration-300 ${
            isDarkMode 
              ? 'bg-slate-900/40 border-slate-900/90 shadow-2xl shadow-slate-950/40 text-slate-100 hover:border-purple-500/20 hover:shadow-glow-purple' 
              : 'bg-white border-slate-200/60 shadow-md shadow-slate-100/50 text-slate-800 hover:border-purple-500/35 hover:shadow-purple-500/5'
          }`}
        >
          <div className="space-y-2">
            <p className={`text-[10px] uppercase tracking-widest font-extrabold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Pièces investies
            </p>
            <h3 className="text-2.5xl font-black font-mono tracking-tight leading-none text-purple-500 dark:text-purple-400" id="kpi-val-parts-cost">
              {totalCost > 0 ? formatDZD(totalCost).replace("DZD", "").trim() : "0"}<span className="text-[10px] text-slate-500 ml-1 font-sans font-bold">DZD</span>
            </h3>
            <p className="text-[10px] text-purple-600 dark:text-purple-300 font-bold uppercase tracking-wider">
              Coût total du stock
            </p>
          </div>
          <div className="p-3 bg-purple-500/10 dark:bg-purple-500/5 rounded-xl text-purple-550 dark:text-purple-400 border border-purple-500/10" id="kpi-icon-parts-cost">
            <Cpu className="w-5 h-5" />
          </div>
        </motion.div>

        {/* KPI 4: Marge brute */}
        <motion.div
          id="kpi-card-profit"
          whileHover={{ y: -4, scale: 1.01 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className={`p-6 rounded-2xl border flex items-center justify-between transition-all duration-300 ${
            isDarkMode 
              ? 'bg-slate-900/40 border-slate-900/90 shadow-2xl shadow-slate-950/40 text-slate-100 hover:border-emerald-500/20 hover:shadow-glow-emerald' 
              : 'bg-white border-slate-200/60 shadow-md shadow-slate-100/50 text-slate-800 hover:border-emerald-500/35 hover:shadow-emerald-500/5'
          }`}
        >
          <div className="space-y-2">
            <p className={`text-[10px] uppercase tracking-widest font-extrabold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Bénéfice Réel Net
            </p>
            <h3 className="text-2.5xl font-black font-mono tracking-tight leading-none text-emerald-500 dark:text-emerald-400" id="kpi-val-profit">
              {grossProfit > 0 ? '+' : ''}{formatDZD(grossProfit).replace("DZD", "").trim()}<span className="text-[10px] text-slate-500 ml-1 font-sans font-bold">DZD</span>
            </h3>
            <p className="text-[10px] text-sky-450 dark:text-sky-400 font-bold uppercase tracking-wider">
              {marginPercentage}% de rentabilité
            </p>
          </div>
          <div className="p-3 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-xl text-emerald-550 dark:text-emerald-400 border border-emerald-500/10" id="kpi-icon-profit">
            <TrendingUp className="w-5 h-5" />
          </div>
        </motion.div>
      </div>

      {/* Main Charts & Analytics Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="dashboard-grids">
        
        {/* Real-time Status Breakdown Section */}
        <div 
          id="section-breakdown" 
          className={`p-6 rounded-2xl border shadow-xl transition-all duration-300 lg:col-span-2 ${
            isDarkMode ? 'bg-slate-900/40 border-slate-900/90' : 'bg-white border-slate-200/60'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-dashed border-slate-200 dark:border-slate-850 gap-2" id="section-breakdown-header">
            <div>
              <h4 className={`text-base font-bold font-display tracking-tight ${isDarkMode ? 'text-slate-50' : 'text-slate-900'}`}>
                Statut de Production
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">Analytique physique des téléphones en atelier</p>
            </div>
            <span className="text-xs font-bold text-sky-450 bg-sky-500/5 dark:bg-sky-500/10 px-3.5 py-1.5 rounded-full border border-sky-500/10 uppercase tracking-wide">
              {totalTickets} Dossiers Enregistrés
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 py-6" id="status-card-grid">
            {/* Status: En attente */}
            <div className={`p-4.5 rounded-2xl border transition-all ${isDarkMode ? 'bg-slate-950/40 border-slate-900/80 hover:border-amber-500/30' : 'bg-slate-50/70 border-slate-200/40 hover:border-amber-500/30'}`} id="status-card-attente">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase tracking-widest font-black px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-550/10">Diagnostic</span>
                <span className={`text-base font-black font-mono ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{countAttente}</span>
              </div>
              <p className={`text-xs mt-3 font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>En attente de diagnostic</p>
              <div className="w-full bg-slate-700/20 dark:bg-slate-800/50 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-gradient-to-r from-amber-500 to-amber-400 h-full rounded-full transition-all duration-500" style={{ width: `${percentAttente}%` }}></div>
              </div>
              <span className="text-[10px] text-slate-400 mt-2 block font-semibold">{percentAttente}% de la charge client</span>
            </div>

            {/* Status: En réparation */}
            <div className={`p-4.5 rounded-2xl border transition-all ${isDarkMode ? 'bg-slate-950/40 border-slate-900/80 hover:border-purple-500/30' : 'bg-slate-50/70 border-slate-200/40 hover:border-purple-500/30'}`} id="status-card-reparation">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase tracking-widest font-black px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-550/10">En cours</span>
                <span className={`text-base font-black font-mono ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{countReparation}</span>
              </div>
              <p className={`text-xs mt-3 font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>En cours de travail</p>
              <div className="w-full bg-slate-700/20 dark:bg-slate-800/50 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-purple-400 h-full rounded-full transition-all duration-500" style={{ width: `${percentReparation}%` }}></div>
              </div>
              <span className="text-[10px] text-slate-400 mt-2 block font-semibold">{percentReparation}% de la charge client</span>
            </div>

            {/* Status: Réparation terminée */}
            <div className={`p-4.5 rounded-2xl border transition-all ${isDarkMode ? 'bg-slate-950/40 border-slate-900/80 hover:border-emerald-500/30' : 'bg-slate-50/70 border-slate-200/40 hover:border-emerald-500/30'}`} id="status-card-terminee">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase tracking-widest font-black px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-550/10">Terminée</span>
                <span className={`text-base font-black font-mono ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{countTerminee}</span>
              </div>
              <p className={`text-xs mt-3 font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Prêt à être récupéré</p>
              <div className="w-full bg-slate-700/20 dark:bg-slate-800/50 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: `${percentTerminee}%` }}></div>
              </div>
              <span className="text-[10px] text-slate-400 mt-2 block font-semibold">{percentTerminee}% de la charge client</span>
            </div>
          </div>

          {/* Quick Graph of brand breakdown */}
          <div className="mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-850 space-y-4" id="brand-breakdown-sub">
            <h5 className={`text-[10px] font-black tracking-widest uppercase ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Marques phares en cours d'intervention
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id="brand-bars">
              {formattedBrands.length > 0 ? (
                formattedBrands.map((brand, idx) => (
                  <div key={idx} className="flex flex-col space-y-2 bg-slate-950/20 dark:bg-slate-900/20 p-3 rounded-xl border border-slate-200/10" id={`brand-bar-${idx}`}>
                    <div className="flex justify-between text-xs font-bold leading-none" id={`brand-lbl-${idx}`}>
                      <span className={isDarkMode ? 'text-slate-200' : 'text-slate-705'}>{brand.name}</span>
                      <span className="text-slate-400">{brand.count} {brand.count > 1 ? 'mobiles' : 'mobile'} ({brand.percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-700/15 dark:bg-slate-850 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-sky-500 to-sky-400 h-full rounded-full transition-all duration-500" 
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
          className={`p-6 rounded-2xl border shadow-xl flex flex-col justify-between transition-all duration-300 ${
            isDarkMode ? 'bg-slate-900/40 border-slate-900/90' : 'bg-white border-slate-200/60'
          }`}
        >
          <div className="space-y-4" id="timeline-top">
            <h4 id="recent-tickets-title" className={`text-base font-bold font-display tracking-tight ${isDarkMode ? 'text-slate-50' : 'text-slate-900'}`}>
              Derniers Enregistrements
            </h4>
            
            <div className="space-y-3.5 pt-1" id="timeline-list">
              {recentRepairs.length > 0 ? (
                recentRepairs.map((ticket) => (
                  <div 
                    key={ticket.id} 
                    id={`timeline-item-${ticket.id}`}
                    onClick={() => onNavigateToTab('liste')}
                    className={`flex items-start space-x-3 p-3.5 rounded-xl border text-left cursor-pointer transition-all duration-300 ${
                      isDarkMode 
                        ? 'bg-slate-950/30 border-slate-900/70 hover:bg-slate-900/70 hover:border-sky-500/20' 
                        : 'bg-slate-50/50 border-slate-100 hover:bg-slate-100/50 hover:border-slate-250'
                    }`}
                  >
                    <div className="p-2 bg-sky-500/10 dark:bg-sky-500/5 rounded-xl text-sky-550 dark:text-sky-400 mt-0.5 shrink-0" id={`timeline-avatar-${ticket.id}`}>
                      <Smartphone className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0 font-sans" id={`timeline-info-${ticket.id}`}>
                      <div className="flex items-center justify-between" id={`timeline-meta-${ticket.id}`}>
                        <h5 className={`text-xs font-extrabold truncate ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                          {ticket.nomClient}
                        </h5>
                        <span className="text-[9px] text-sky-450 dark:text-sky-400 font-black font-mono bg-sky-500/10 dark:bg-sky-550/15 px-1.5 py-0.5 rounded border border-sky-500/10 whitespace-nowrap">
                          {ticket.id}
                        </span>
                      </div>
                      <p className={`text-[11px] font-semibold truncate mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        {ticket.modele}
                      </p>
                      <p className={`text-[10px] truncate italic mt-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`} id={`timeline-problem-${ticket.id}`}>
                        {ticket.descriptionProbleme}
                      </p>
                      
                      {/* Date details and badge */}
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-dashed border-slate-200/60 dark:border-slate-900/60">
                        <span className="text-[9px] font-bold text-slate-400">
                          {new Date(ticket.dateEntree).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                        </span>
                        
                        <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg ${
                          ticket.statut === 'Réparation terminée' 
                            ? 'text-emerald-500 bg-emerald-500/10 dark:bg-emerald-550/10'
                            : ticket.statut === 'En réparation'
                            ? 'text-purple-400 bg-purple-500/10 dark:bg-purple-550/10'
                            : 'text-amber-500 bg-amber-550/10 dark:bg-amber-550/10'
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

          <div className="pt-4 border-t border-slate-200 dark:border-slate-900 mt-4" id="timeline-bottom">
            <button
              id="btn-all-repairs-nav"
              onClick={() => onNavigateToTab('liste')}
              className="w-full py-2.5 text-xs font-black uppercase tracking-widest text-center bg-sky-600 hover:bg-sky-555 active:bg-sky-700 text-white rounded-xl shadow-md cursor-pointer shadow-sky-600/10 transition-transform hover:-translate-y-0.5 active:translate-y-0 duration-200"
            >
              Consulter tout le Registre
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
