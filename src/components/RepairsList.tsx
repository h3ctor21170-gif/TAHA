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
        className={`p-6 rounded-2xl border shadow-md space-y-4 transition-all ${
          isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex items-center space-x-2 text-[#38bdf8]" id="filter-header-sub">
          <Filter className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Critères de recherche</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" id="filter-inputs">
          {/* Nom du client */}
          <div className="space-y-1" id="field-filter-client">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest" htmlFor="inp-filter-name">
              Nom du client
            </label>
            <input
              id="inp-filter-name"
              type="text"
              placeholder="Ex: Amine Merah..."
              value={filterClientName}
              onChange={(e) => setFilterClientName(e.target.value)}
              className={`w-full text-xs px-3 py-2.5 rounded-lg border focus:outline-none focus:ring-1 transition-all ${
                isDarkMode 
                  ? 'bg-[#0f172a] border-[#334155] text-slate-200 focus:ring-[#38bdf8] focus:border-[#38bdf8]' 
                  : 'bg-slate-50 border-slate-200 text-slate-800 focus:ring-blue-600 focus:border-blue-600'
              }`}
            />
          </div>

          {/* Téléphone */}
          <div className="space-y-1" id="field-filter-phone">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest" htmlFor="inp-filter-phone">
              Numéro de téléphone
            </label>
            <input
              id="inp-filter-phone"
              type="text"
              placeholder="Ex: 0550..."
              value={filterPhone}
              onChange={(e) => setFilterPhone(e.target.value)}
              className={`w-full text-xs px-3 py-2.5 rounded-lg border focus:outline-none focus:ring-1 transition-all ${
                isDarkMode 
                  ? 'bg-[#0f172a] border-[#334155] text-slate-200 focus:ring-[#38bdf8] focus:border-[#38bdf8]' 
                  : 'bg-slate-50 border-slate-200 text-slate-800 focus:ring-blue-600 focus:border-blue-600'
              }`}
            />
          </div>

          {/* Mot-clé problème */}
          <div className="space-y-1" id="field-filter-issue">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest" htmlFor="inp-filter-problem">
              Modèle ou panne
            </label>
            <input
              id="inp-filter-problem"
              type="text"
              placeholder="Ex: Écran, Batterie, iPhone..."
              value={filterProblem}
              onChange={(e) => setFilterProblem(e.target.value)}
              className={`w-full text-xs px-3 py-2.5 rounded-lg border focus:outline-none focus:ring-1 transition-all ${
                isDarkMode 
                  ? 'bg-[#0f172a] border-[#334155] text-slate-200 focus:ring-[#38bdf8] focus:border-[#38bdf8]' 
                  : 'bg-slate-50 border-slate-200 text-slate-800 focus:ring-blue-600 focus:border-blue-600'
              }`}
            />
          </div>

          {/* Status filter selection */}
          <div className="space-y-1" id="field-filter-status">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest" htmlFor="sel-filter-status">
              Statut réparation
            </label>
            <select
              id="sel-filter-status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`w-full text-xs px-3 py-2.5 rounded-lg border focus:outline-none focus:ring-1 transition-all ${
                isDarkMode 
                  ? 'bg-[#0f172a] border-[#334155] text-slate-200 focus:ring-[#38bdf8] focus:border-[#38bdf8]' 
                  : 'bg-slate-50 border-slate-200 text-slate-800 focus:ring-blue-600 focus:border-blue-600'
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
        <div className="flex justify-end space-x-2 pt-2" id="filter-buttons">
          <button
            id="btn-reinitialiser"
            type="button"
            onClick={handleResetFilters}
            className={`flex items-center space-x-1 font-bold text-xs px-3 py-2.5 rounded-lg border transition-all hover:bg-slate-100 dark:hover:bg-[#0f172a] cursor-pointer ${
              isDarkMode ? 'border-[#334155] text-slate-350' : 'border-slate-200 text-slate-600'
            }`}
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            <span>Réinitialiser</span>
          </button>
          <button
            id="btn-filtrer-valider"
            type="button"
            onClick={handleApplyFilters}
            className="flex items-center space-x-1.5 bg-[#0284c7] hover:bg-[#0284c7]/95 active:bg-[#0284c7]/90 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow cursor-pointer transition-all"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filtrer</span>
          </button>
        </div>
      </div>

      {/* Repairs Master Data Table */}
      <div 
        id="tickets-table-card"
        className={`border rounded-2xl overflow-hidden shadow-lg transition-all ${
          isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-slate-200'
        }`}
      >
        <div className="overflow-x-auto" id="table-scroll-container">
          <table className="w-full text-left border-collapse" id="tickets-table">
            <thead>
              <tr className={`border-b text-[11px] font-bold tracking-wider uppercase transition-colors ${
                isDarkMode ? 'bg-[#0f172a] border-[#334155] text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-550'
              }`}>
                <th className="py-4 px-6 w-16 text-center">N°</th>
                <th className="py-4 px-5">Date d'entrée</th>
                <th className="py-4 px-5">Nom du client</th>
                <th className="py-4 px-5">Modele de téléphone</th>
                <th className="py-4 px-5">Description panne</th>
                <th className="py-4 px-5">Prix final</th>
                <th className="py-4 px-5 text-center">Statut</th>
                <th className="py-4 px-6 text-center w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80" id="table-tbody">
              {filteredTickets.length > 0 ? (
                filteredTickets.map((ticket) => (
                  <tr 
                    key={ticket.id}
                    id={`row-${ticket.id}`}
                    className={`transition-all ${
                      isDarkMode 
                        ? 'hover:bg-slate-800 text-slate-350 border-b border-[#334155]/40' 
                        : 'hover:bg-slate-50/80 text-slate-705 border-b border-slate-100'
                    }`}
                  >
                    {/* Ticket ID Format */}
                    <td id={`cell-id-${ticket.id}`} className="py-4 px-6 text-center text-xs font-bold font-mono text-blue-500 bg-blue-500/5 select-all border-r border-[#334155]/20">
                      {ticket.id}
                    </td>

                    {/* Entry Date */}
                    <td id={`cell-date-${ticket.id}`} className="py-4 px-5 text-xs font-medium whitespace-nowrap">
                      {formatFrenchDateTime(ticket.dateEntree)}
                    </td>

                    {/* Client name and telephone */}
                    <td id={`cell-client-${ticket.id}`} className="py-4 px-5 text-xs font-bold">
                      <div className="flex flex-col" id={`client-cell-wrap-${ticket.id}`}>
                        <span className={isDarkMode ? 'text-white' : 'text-slate-900'}>{ticket.nomClient}</span>
                        {ticket.telephoneClient && (
                          <span className="text-[10px] text-slate-400 font-mono mt-0.5">{ticket.telephoneClient}</span>
                        )}
                      </div>
                    </td>

                    {/* Phone model */}
                    <td id={`cell-model-${ticket.id}`} className="py-4 px-5 text-xs">
                      <div className="flex items-center space-x-1.5" id={`model-cell-wrap-${ticket.id}`}>
                        <Smartphone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="font-semibold">{ticket.modele}</span>
                      </div>
                    </td>

                    {/* Problem summary */}
                    <td id={`cell-prob-${ticket.id}`} className="py-4 px-5 text-xs max-w-xs truncate">
                      <span className="italic" title={ticket.descriptionProbleme}>
                        {ticket.descriptionProbleme || "Aucune description fournie"}
                      </span>
                    </td>

                    {/* Price in DZD */}
                    <td id={`cell-price-${ticket.id}`} className="py-4 px-5 text-xs font-extrabold font-mono text-emerald-505 dark:text-emerald-400 select-all">
                      {formatDZD(ticket.prixFacture)}
                    </td>

                    {/* Colorful Status Badges */}
                    <td id={`cell-status-${ticket.id}`} className="py-4 px-5 text-center whitespace-nowrap">
                      {renderStatusBadge(ticket.statut)}
                    </td>

                    {/* CRUD Actions */}
                    <td id={`cell-actions-${ticket.id}`} className="py-4 px-6 text-center">
                      <div className="flex justify-center items-center space-x-1.5" id={`actions-wrap-${ticket.id}`}>
                        {/* Edit Button */}
                        <button
                          id={`btn-edit-${ticket.id}`}
                          onClick={() => onEditTicket(ticket)}
                          className={`p-2 rounded-lg transition-all hover:scale-110 active:scale-90 ${
                            isDarkMode 
                              ? 'bg-slate-800 text-blue-400 hover:bg-slate-700 hover:text-blue-300' 
                              : 'bg-slate-100 text-blue-600 hover:bg-blue-50 hover:text-blue-700'
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
                          className={`p-2 rounded-lg transition-all hover:scale-110 active:scale-90 ${
                            isDarkMode 
                              ? 'bg-slate-800 text-rose-400 hover:bg-red-500/10 hover:text-rose-300' 
                              : 'bg-slate-100 text-rose-600 hover:bg-rose-50 hover:text-rose-700'
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
                  <td colSpan={8} className="py-12 px-6 text-center text-sm text-slate-500 font-medium whitespace-normal" id="table-empty-notice">
                    <div className="flex flex-col items-center justify-center space-y-2" id="empty-subwrap">
                      <HelpCircle className="w-10 h-10 text-slate-500 mr-1 animate-bounce" />
                      <p className="font-semibold text-base py-1">Aucun ticket correspondant à vos filtres</p>
                      <button
                        id="btn-clear-criteria-empty"
                        onClick={handleResetFilters}
                        className="text-xs text-blue-500 font-bold hover:underline"
                      >
                        Cliquez ici pour réinitialiser la recherche
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Custom Data Status Footer summary informational banner */}
        <div id="table-metadata-footer" className={`px-6 py-4 border-t flex flex-col md:flex-row gap-2 justify-between items-center text-xs text-slate-450 font-bold uppercase tracking-wider ${
          isDarkMode ? 'bg-[#0f172a] border-[#334155]' : 'bg-slate-50'
        }`}>
          <span>Monnaie active : Algerie Dinars (DZD)</span>
          <div className="flex gap-4">
            <span className="text-[#fde047]">A diagnostic : {tickets.filter(t => t.statut === "En attente de diagnostic").length}</span>
            <span className="text-[#d8b4fe]">En cours : {tickets.filter(t => t.statut === "En réparation").length}</span>
            <span className="text-[#6ee7b7]">Terminés : {tickets.filter(t => t.statut === "Réparation terminée").length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
