/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Search, Plus, Filter, Trash2, AlertCircle, Smartphone, Check, HelpCircle, Eye, RefreshCcw } from 'lucide-react';
import { RepairTicket, TicketStatus } from '../types';

interface RepairsListProps {
  tickets: RepairTicket[];
  isDarkMode: boolean;
  onNavigateToTab: (tab: 'statistiques' | 'liste' | 'nouveau') => void;
  onEditTicket: (ticket: RepairTicket) => void;
  onDeleteTicket: (ticketId: string) => void;
}

export default function RepairsList({ tickets, isDarkMode, onNavigateToTab, onEditTicket, onDeleteTicket }: RepairsListProps) {
  // Search state query parameter structures
  const [filterClientName, setFilterClientName] = useState('');
  const [filterPhone, setFilterPhone] = useState('');
  const [filterProblem, setFilterProblem] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('Tous');

  // Trigger filters only when clicking "Filtrer" or live query
  // Let's implement full manual "Filtrer" submission, but we'll store active filters applied
  const [activeFilters, setActiveFilters] = useState({
    clientName: '',
    phone: '',
    problem: '',
    status: 'Tous',
  });

  const handleApplyFilters = () => {
    setActiveFilters({
      clientName: filterClientName,
      phone: filterPhone,
      problem: filterProblem,
      status: filterStatus,
    });
  };

  const handleResetFilters = () => {
    setFilterClientName('');
    setFilterPhone('');
    setFilterProblem('');
    setFilterStatus('Tous');
    setActiveFilters({
      clientName: '',
      phone: '',
      problem: '',
      status: 'Tous',
    });
  };

  // Compute filtered ticket array
  const filteredTickets = tickets.filter((ticket) => {
    const matchName = !activeFilters.clientName || ticket.nomClient.toLowerCase().includes(activeFilters.clientName.toLowerCase());
    const matchPhone = !activeFilters.phone || ticket.telephoneClient.includes(activeFilters.phone);
    const matchProblem = !activeFilters.problem || 
      ticket.descriptionProbleme.toLowerCase().includes(activeFilters.problem.toLowerCase()) ||
      ticket.modele.toLowerCase().includes(activeFilters.problem.toLowerCase());
    const matchStatus = activeFilters.status === 'Tous' || ticket.statut === activeFilters.status;

    return matchName && matchPhone && matchProblem && matchStatus;
  });

  // Safe currency DZD formatter
  const formatDZD = (value: number) => {
    return new Intl.NumberFormat('fr-DZ', {
      style: 'currency',
      currency: 'DZD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Format date helper
  const formatFrenchDateTime = (dateTimeString: string) => {
    if (!dateTimeString) return '-';
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateTimeString;
    }
  };

  // Status Badge Builder
  const renderStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case 'En attente de diagnostic':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#713f12] text-[#fde047] border border-[#713f12]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#fde047] mr-1.5 animate-pulse"></span>
            Diagnostic
          </span>
        );
      case 'En réparation':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#581c87] text-[#d8b4fe] border border-[#581c87]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d8b4fe] mr-1.5 animate-pulse"></span>
            En cours
          </span>
        );
      case 'Réparation terminée':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#064e3b] text-[#6ee7b7] border border-[#064e3b]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6ee7b7] mr-1.5"></span>
            Terminé
          </span>
        );
    }
  };

  return (
    <div className="p-8 space-y-6" id="tickets-registry-view">
      {/* Search Header and navigation prompt */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4" id="view-action-header">
        <div>
          <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`} id="summary-lbl-active">
            {filteredTickets.length} ticket{filteredTickets.length > 1 ? 's' : ''} enregistré{filteredTickets.length > 1 ? 's' : ''} trouvé{filteredTickets.length > 1 ? 's' : ''}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5" id="summary-lbl-total">
            Sur un total de {tickets.length} ticket(s) dans la base de données BlueCom Batna
          </p>
        </div>
        <button
          id="btn-nav-create-ticket"
          onClick={() => onNavigateToTab('nouveau')}
          className="flex items-center justify-center space-x-2 bg-[#0284c7] hover:bg-[#0284c7]/90 active:bg-[#0284c7]/80 text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New ticket</span>
        </button>
      </div>

      {/* Filter Utility Card bar */}
      <div 
        id="filters-bar-card"
        className={`p-6 rounded-2xl border shadow-xl space-y-5 transition-all duration-300 ${
          isDarkMode ? 'bg-slate-900/40 border-slate-900/90' : 'bg-white border-slate-200/60'
        }`}
      >
        <div className="flex items-center space-x-2 text-sky-450 dark:text-sky-400" id="filter-header-sub">
          <Filter className="w-4 h-4" />
          <span className="text-[11px] font-black uppercase tracking-widest font-display">Critères de recherche client</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5" id="filter-inputs">
          {/* Nom du client */}
          <div className="space-y-1.5" id="field-filter-client">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest" htmlFor="inp-filter-name">
              Nom du client
            </label>
            <input
              id="inp-filter-name"
              type="text"
              placeholder="Ex: Amine Merah..."
              value={filterClientName}
              onChange={(e) => setFilterClientName(e.target.value)}
              className={`w-full text-xs px-3.5 py-2.5 rounded-xl border focus:outline-none focus:ring-1 transition-all ${
                isDarkMode 
                  ? 'bg-slate-950/40 border-slate-900 text-slate-200 focus:ring-sky-500 focus:border-sky-500' 
                  : 'bg-slate-50 border-slate-200 text-slate-800 focus:ring-sky-655 focus:border-sky-655'
              }`}
            />
          </div>

          {/* Téléphone */}
          <div className="space-y-1.5" id="field-filter-phone">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest" htmlFor="inp-filter-phone">
              Numéro de téléphone
            </label>
            <input
              id="inp-filter-phone"
              type="text"
              placeholder="Ex: 0550..."
              value={filterPhone}
              onChange={(e) => setFilterPhone(e.target.value)}
              className={`w-full text-xs px-3.5 py-2.5 rounded-xl border focus:outline-none focus:ring-1 transition-all font-mono ${
                isDarkMode 
                  ? 'bg-slate-950/40 border-slate-900 text-slate-200 focus:ring-sky-500 focus:border-sky-500' 
                  : 'bg-slate-50 border-slate-200 text-slate-800 focus:ring-sky-655 focus:border-sky-655'
              }`}
            />
          </div>

          {/* Mot-clé problème */}
          <div className="space-y-1.5" id="field-filter-issue">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest" htmlFor="inp-filter-problem">
              Modèle ou panne
            </label>
            <input
              id="inp-filter-problem"
              type="text"
              placeholder="Ex: Écran, Batterie, iPhone..."
              value={filterProblem}
              onChange={(e) => setFilterProblem(e.target.value)}
              className={`w-full text-xs px-3.5 py-2.5 rounded-xl border focus:outline-none focus:ring-1 transition-all ${
                isDarkMode 
                  ? 'bg-slate-950/40 border-slate-900 text-slate-200 focus:ring-sky-500 focus:border-sky-500' 
                  : 'bg-slate-50 border-slate-200 text-slate-800 focus:ring-sky-655 focus:border-sky-655'
              }`}
            />
          </div>

          {/* Status filter selection */}
          <div className="space-y-1.5" id="field-filter-status">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest" htmlFor="sel-filter-status">
              Statut réparation
            </label>
            <select
              id="sel-filter-status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`w-full text-xs px-3.5 py-2.5 rounded-xl border focus:outline-none focus:ring-1 transition-all ${
                isDarkMode 
                  ? 'bg-slate-950/40 border-slate-900 text-slate-200 focus:ring-sky-500 focus:border-sky-500' 
                  : 'bg-slate-50 border-slate-200 text-slate-800 focus:ring-sky-655 focus:border-sky-655'
              }`}
            >
              <option value="Tous">Tous les statuts</option>
              <option value="En attente de diagnostic">En attente de diagnostic</option>
              <option value="En réparation">En réparation</option>
              <option value="Réparation terminée">Réparation terminée</option>
            </select>
          </div>
        </div>

        {/* Filter triggers */}
        <div className="flex justify-end space-x-2.5 pt-1" id="filter-buttons">
          <button
            id="btn-reinitialiser"
            type="button"
            onClick={handleResetFilters}
            className={`flex items-center space-x-2 font-bold text-xs px-4 py-2.5 rounded-xl border transition-all cursor-pointer ${
              isDarkMode 
                ? 'border-slate-855 bg-slate-950/30 text-slate-350 hover:bg-slate-900 hover:text-white' 
                : 'border-slate-200 text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
            }`}
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            <span>Réinitialiser</span>
          </button>
          <button
            id="btn-filtrer-valider"
            type="button"
            onClick={handleApplyFilters}
            className="flex items-center space-x-2 bg-gradient-to-r from-sky-600 to-sky-550 hover:from-sky-550 hover:to-sky-500 active:scale-[0.98] text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-lg hover:shadow-sky-500/10 cursor-pointer transition-transform duration-100"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filtrer</span>
          </button>
        </div>
      </div>

      {/* Repairs Master Data Table */}
      <div 
        id="tickets-table-card"
        className={`border rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${
          isDarkMode ? 'bg-slate-900/40 border-slate-900/95' : 'bg-white border-slate-200/60'
        }`}
      >
        <div className="overflow-x-auto" id="table-scroll-container">
          <table className="w-full text-left border-collapse" id="tickets-table">
            <thead>
              <tr className={`border-b text-[10px] font-black tracking-widest uppercase transition-colors ${
                isDarkMode ? 'bg-slate-950/80 border-slate-900 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}>
                <th className="py-4.5 px-6 w-18 text-center text-slate-400 font-bold">N°</th>
                <th className="py-4.5 px-5 text-slate-400 font-bold">Date d'entrée</th>
                <th className="py-4.5 px-5 text-slate-400 font-bold">Nom du client</th>
                <th className="py-4.5 px-5 text-slate-400 font-bold">Modèle de téléphone</th>
                <th className="py-4.5 px-5 text-zinc-400 font-bold">Description panne</th>
                <th className="py-4.5 px-5 text-zinc-400 font-bold">Prix final</th>
                <th className="py-4.5 px-5 text-center text-slate-400 font-bold">Statut</th>
                <th className="py-4.5 px-6 text-center w-28 text-slate-400 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-900" id="table-tbody">
              {filteredTickets.length > 0 ? (
                filteredTickets.map((ticket) => (
                  <tr 
                    key={ticket.id}
                    id={`row-${ticket.id}`}
                    className={`transition-all group ${
                      isDarkMode 
                        ? 'hover:bg-slate-900/40 text-slate-350 border-b border-slate-900/40' 
                        : 'hover:bg-slate-50/60 text-slate-705 border-b border-slate-100'
                    }`}
                  >
                    {/* Ticket ID Format */}
                    <td id={`cell-id-${ticket.id}`} className="py-4 px-6 text-center text-xs font-black font-mono text-sky-500 bg-sky-500/5 select-all border-r border-[#334155]/10 group-hover:bg-sky-500/10 transition-colors">
                      {ticket.id}
                    </td>

                    {/* Entry Date */}
                    <td id={`cell-date-${ticket.id}`} className="py-4 px-5 text-xs text-slate-400 font-medium whitespace-nowrap">
                      {formatFrenchDateTime(ticket.dateEntree)}
                    </td>

                    {/* Client name and telephone */}
                    <td id={`cell-client-${ticket.id}`} className="py-4 px-5 text-xs font-semibold">
                      <div className="flex flex-col" id={`client-cell-wrap-${ticket.id}`}>
                        <span className={`text-xs font-extrabold ${isDarkMode ? 'text-slate-150' : 'text-slate-805'}`}>{ticket.nomClient}</span>
                        {ticket.telephoneClient && (
                          <span className="text-[10px] text-slate-400 font-mono mt-0.5">{ticket.telephoneClient}</span>
                        )}
                      </div>
                    </td>

                    {/* Phone model */}
                    <td id={`cell-model-${ticket.id}`} className="py-4 px-5 text-xs">
                      <div className="flex items-center space-x-1.5" id={`model-cell-wrap-${ticket.id}`}>
                        <Smartphone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="font-extrabold">{ticket.modele}</span>
                      </div>
                    </td>

                    {/* Problem summary */}
                    <td id={`cell-prob-${ticket.id}`} className="py-4 px-5 text-xs max-w-xs truncate">
                      <span className="italic text-slate-400" title={ticket.descriptionProbleme}>
                        {ticket.descriptionProbleme || "Aucune description fournie"}
                      </span>
                    </td>

                    {/* Price in DZD */}
                    <td id={`cell-price-${ticket.id}`} className="py-4 px-5 text-xs font-black font-mono text-emerald-500 dark:text-emerald-450 select-all whitespace-nowrap">
                      {formatDZD(ticket.prixFacture)}
                    </td>

                    {/* Colorful Status Badges */}
                    <td id={`cell-status-${ticket.id}`} className="py-4 px-5 text-center whitespace-nowrap">
                      {renderStatusBadge(ticket.statut)}
                    </td>

                               <td id={`cell-actions-${ticket.id}`} className="py-4 px-6 text-center">
                      <div className="flex justify-center items-center space-x-2" id={`actions-wrap-${ticket.id}`}>
                        {/* Edit Button */}
                        <button
                          id={`btn-edit-${ticket.id}`}
                          onClick={() => onEditTicket(ticket)}
                          className={`p-2 rounded-xl transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                            isDarkMode 
                              ? 'bg-slate-900 border border-slate-800 text-sky-450 hover:bg-slate-850 hover:text-sky-300' 
                              : 'bg-slate-50 border border-slate-200 text-sky-655 hover:bg-slate-100 hover:text-sky-700'
                          }`}
                          title="Modifier ou Mettre à jour"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Button */}
                        <button
                          id={`btn-delete-${ticket.id}`}
                          onClick={() => {
                            if (confirm(`Voulez-vous vraiment désactiver ou archiver définitivement le ticket ${ticket.id} de ${ticket.nomClient} ?`)) {
                              onDeleteTicket(ticket.id);
                            }
                          }}
                          className={`p-2 rounded-xl transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                            isDarkMode 
                              ? 'bg-slate-900 border border-slate-800 text-rose-450 hover:bg-rose-950/20 hover:text-rose-300 hover:border-rose-900/30' 
                              : 'bg-slate-50 border border-slate-200 text-rose-600 hover:bg-rose-100/50 hover:text-rose-700'
                          }`}
                          title="Supprimer le ticket"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr id="table-row-no-records">
                  <td colSpan={8} className="py-16 px-6 text-center text-sm text-slate-500 font-medium whitespace-normal" id="table-empty-notice">
                    <div className="flex flex-col items-center justify-center space-y-3" id="empty-subwrap">
                      <HelpCircle className="w-10 h-10 text-slate-500 mr-1 animate-pulse" />
                      <p className="font-extrabold text-base py-1 text-slate-400">Aucun ticket de réparation ne correspond à vos filtres</p>
                      <button
                        id="btn-clear-criteria-empty"
                        onClick={handleResetFilters}
                        className="text-xs bg-sky-500/10 border border-sky-500/20 text-sky-450 dark:text-sky-400 font-black tracking-wide uppercase px-4 py-2 rounded-xl hover:bg-sky-500/15 cursor-pointer transition-all"
                      >
                        Réinitialiser la recherche
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Custom Data Status Footer summary informational banner */}
        <div id="table-metadata-footer" className={`px-6 py-4.5 border-t flex flex-col md:flex-row gap-4 justify-between items-center text-[10px] text-slate-550 font-black uppercase tracking-widest ${
          isDarkMode ? 'bg-slate-950/80 border-slate-900 text-slate-400' : 'bg-slate-50 border-slate-200/60 text-slate-500'
        }`}>
          <span>Registre Actif : Batna, Algérie (DZD)</span>
          <div className="flex flex-wrap gap-4" id="footer-status-pills">
            <span className="text-amber-500 font-bold bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/10">A Diagnostic : {tickets.filter(t => t.statut === "En attente de diagnostic").length}</span>
            <span className="text-purple-400 font-bold bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/10">En cours : {tickets.filter(t => t.statut === "En réparation").length}</span>
            <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-555/10">Terminés : {tickets.filter(t => t.statut === "Réparation terminée").length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
