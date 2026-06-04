/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import { Save, X, Info, HelpCircle, AlertTriangle, Cpu, DollarSign, User, Printer, FileText } from 'lucide-react';
import { RepairTicket, TicketStatus } from '../types';

// Crisp horizontal simulated barcode vector for labels and receipts
const BarcodeSvg = ({ value }: { value: string }) => {
  return (
    <svg viewBox="0 0 100 15" width="100%" height="15" className="block select-none pointer-events-none">
      {/* Starting guard pattern */}
      <rect x="0" y="0" width="1.5" height="15" fill="black" />
      <rect x="2" y="0" width="0.75" height="15" fill="black" />
      
      {/* Pseudo-random barcode pattern based on ID characters */}
      <rect x="4.5" y="0" width="1.5" height="15" fill="black" />
      <rect x="7.5" y="0" width="0.75" height="15" fill="black" />
      <rect x="9.5" y="0" width="2.25" height="15" fill="black" />
      <rect x="13.5" y="0" width="0.75" height="15" fill="black" />
      <rect x="15" y="0" width="1.5" height="15" fill="black" />
      <rect x="18" y="0" width="3" height="15" fill="black" />
      
      {/* Center guard pattern */}
      <rect x="23" y="0" width="0.75" height="15" fill="black" />
      <rect x="25.5" y="0" width="0.75" height="15" fill="black" />
      
      <rect x="28" y="0" width="1.5" height="15" fill="black" />
      <rect x="31" y="0" width="0.75" height="15" fill="black" />
      <rect x="34" y="0" width="2.25" height="15" fill="black" />
      <rect x="38" y="0" width="1.5" height="15" fill="black" />
      <rect x="41.5" y="0" width="0.75" height="15" fill="black" />
      <rect x="43" y="0" width="3" height="15" fill="black" />
      <rect x="48" y="0" width="1.5" height="15" fill="black" />
      <rect x="51.5" y="0" width="0.75" height="15" fill="black" />
      <rect x="54" y="0" width="2.25" height="15" fill="black" />
      
      {/* Ending guard pattern */}
      <rect x="58.5" y="0" width="1.5" height="15" fill="black" />
      <rect x="62" y="0" width="0.75" height="15" fill="black" />
      <rect x="64" y="0" width="3" height="15" fill="black" />
      <rect x="69" y="0" width="1.5" height="15" fill="black" />
      <rect x="72.5" y="0" width="0.75" height="15" fill="black" />
      <rect x="74" y="0" width="2.25" height="15" fill="black" />
      <rect x="78.5" y="0" width="1.5" height="15" fill="black" />
      <rect x="82" y="0" width="0.75" height="15" fill="black" />
      <rect x="84.5" y="0" width="3" height="15" fill="black" />
      
      {/* Stop guard */}
      <rect x="90" y="0" width="1.5" height="15" fill="black" />
      <rect x="93" y="0" width="0.75" height="15" fill="black" />
      <rect x="95.5" y="0" width="0.75" height="15" fill="black" />
      <rect x="98" y="0" width="1.5" height="15" fill="black" />
    </svg>
  );
};

// High-definition pixel-perfect standard vector QR Code tracker 
const QrCodeSvg = () => {
  return (
    <svg viewBox="0 0 29 29" width="32" height="32" className="block select-none pointer-events-none">
      <path d="M0 0h7v7H0zm1 1v5h5V1zm1 1h3v3H2zm6-2h1v1H8zm1 1h1v2H9zm1-1h2v1h-2zm2 1h1v1h-1zm-1 1h1v1h-1zm2-2h1v1h-1zm1 1h1v2h-1zm1-1h1v1h-1zm2 1h1v1h-1zm-1 1h1v1h-1zm2-2h3v1h-3zm1 1h1v1h-1zm1 0h1v1h-1zm1-1h1v1h-1zm-1 2h1v1h-1zm2-1h1v1h-1zm-2 1v1h-1v-1zm4-2h1v3h-1zm-2 2h1v1h-1zm2 1h1v1h-1zm-1 1h1v1h-1zm1-1h1v2h-1zm-1 1h-1v1h1zm-1 1h-1v1h1zm4-3v2h-1v-2zm-3 2v1h-1v-1zm1 1v1h-1v-1zm4-2h1v1h-1zm0 2h1v1h-1zm1-1v1h-1v-1zm-2-5h1v1h-1zm1 1h1v1h-1zm1-1h1v2h-1zm2-1v1h-1v-1zm-1 2v1h-1v-1zm2-2h1v2h-1zm0 2v1h-1v-1z" fill="black" />
      <path d="M22 0h7v7h-7zm1 1v5h5V1zm1 1h3v3H3zm-24 22h7v7H0zm1 1v5h5v-5zm1 1h3v3H2zm22 1v1h2v-1zm1 1v1h1v-1zm-1 1v1h2v-1z" fill="black" />
    </svg>
  );
};

interface RepairFormProps {
  isDarkMode: boolean;
  editingTicket: RepairTicket | null;
  onSave: (ticket: RepairTicket) => void;
  onCancel: () => void;
  lastGeneratedId: string;
}

export default function RepairForm({ isDarkMode, editingTicket, onSave, onCancel, lastGeneratedId }: RepairFormProps) {
  // Input fields state hooks
  const [nomClient, setNomClient] = useState('');
  const [telephoneClient, setTelephoneClient] = useState('');
  const [modele, setModele] = useState('');
  const [piecePrix, setPiecePrix] = useState<number>(0);
  const [descriptionProbleme, setDescriptionProbleme] = useState('');
  const [dateEntree, setDateEntree] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [statut, setStatut] = useState<TicketStatus>('En attente de diagnostic');
  const [prixFacture, setPrixFacture] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [datePriseEnCharge, setDatePriseEnCharge] = useState('');

  // Validation state
  const [errors, setErrors] = useState<{ nomClient?: string }>({});

  // Trigger loading state if we are editing an existing item vs creating a new one
  useEffect(() => {
    if (editingTicket) {
      setNomClient(editingTicket.nomClient || '');
      setTelephoneClient(editingTicket.telephoneClient || '');
      setModele(editingTicket.modele || '');
      setPiecePrix(editingTicket.piecePrix || 0);
      setDescriptionProbleme(editingTicket.descriptionProbleme || '');
      setDateEntree(editingTicket.dateEntree || '');
      setDateFin(editingTicket.dateFin || '');
      setStatut(editingTicket.statut || 'En attente de diagnostic');
      setPrixFacture(editingTicket.prixFacture || 0);
      setNotes(editingTicket.notes || '');
      setDatePriseEnCharge(editingTicket.datePriseEnCharge || '');
      setErrors({});
    } else {
      // Create Mode: Set default current local ISO datetime string
      const now = new Date();
      // format to YYYY-MM-DDTHH:MM local time
      const offset = now.getTimezoneOffset();
      const localNow = new Date(now.getTime() - (offset * 60 * 1000));
      const defaultDateTime = localNow.toISOString().slice(0, 16);

      setNomClient('');
      setTelephoneClient('');
      setModele('');
      setPiecePrix(0);
      setDescriptionProbleme('');
      setDateEntree(defaultDateTime);
      setDateFin('');
      setStatut('En attente de diagnostic');
      setPrixFacture(0);
      setNotes('');
      setDatePriseEnCharge(defaultDateTime); // Prise en charge default
      setErrors({});
    }
  }, [editingTicket]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Primary validations
    if (!nomClient.trim()) {
      setErrors({ nomClient: "Le nom du client est requis pour l'enregistrement." });
      // Scroll to top or validation alert
      return;
    }

    // Prepare ticket representation
    const ticketToSave: RepairTicket = {
      id: editingTicket ? editingTicket.id : generateNextId(lastGeneratedId),
      dateEntree,
      nomClient: nomClient.trim(),
      telephoneClient: telephoneClient.trim(),
      modele: modele.trim(),
      piecePrix: Number(piecePrix) || 0,
      descriptionProbleme: descriptionProbleme.trim(),
      prixFacture: Number(prixFacture) || 0,
      notes: notes.trim(),
      datePriseEnCharge,
      dateFin,
      statut,
    };

    onSave(ticketToSave);
  };

  // Safe manual sequential generation helper incase last ID isn't formatted right
  const generateNextId = (lastId: string): string => {
    if (!lastId) return "BC-1007";
    try {
      const numericPart = parseInt(lastId.replace(/[^\d]/g, ''), 10);
      if (isNaN(numericPart)) {
        return "BC-1007";
      }
      return `BC-${numericPart + 1}`;
    } catch {
      return "BC-1007";
    }
  };

  // Dynamic currency formatting for Algérie Dinars (DZD)
  const formatDZD = (value: number) => {
    return new Intl.NumberFormat('fr-DZ', {
      style: 'currency',
      currency: 'DZD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Human-legible date & hour formater
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

  // Standard printing trigger supporting size adjustments
  const handlePrint = (type: 'etiquette' | 'bon') => {
    // 1. Create a dynamic style element in Head to inject physical dimension rules
    const style = document.createElement('style');
    style.id = 'print-page-size-style';
    style.innerHTML = type === 'etiquette' 
      ? '@page { size: 40mm 20mm; margin: 0; }' 
      : '@page { size: 148mm 105mm; margin: 0; }';
    document.head.appendChild(style);

    // 2. Add control classes onto parent HTML body
    document.body.classList.add(`print-${type}-active`);
    document.body.classList.add('print-mode-active');
    
    // 3. Fire local document print execution
    setTimeout(() => {
      window.print();
      
      // 4. Remove rules to clean up screens
      document.body.classList.remove(`print-${type}-active`);
      document.body.classList.remove('print-mode-active');
      const styleTag = document.getElementById('print-page-size-style');
      if (styleTag) styleTag.remove();
    }, 150);
  };

  // Instant calculated margin badge
  const liveMargin = (Number(prixFacture) || 0) - (Number(piecePrix) || 0);
  const liveMarginPercent = Number(prixFacture) > 0 ? Math.round((liveMargin / Number(prixFacture)) * 100) : 0;

  return (
    <>
    <form onSubmit={handleSubmit} className="p-8 space-y-6" id="repair-entry-form">
      {/* Title + Action Buttons Line */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-dashed border-slate-200 dark:border-slate-800 pb-5" id="form-header-row">
        <div>
          <h3 className={`text-xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-850'}`} id="form-screen-title">
            {editingTicket ? `Modifier le Ticket ${editingTicket.id}` : `Créer un Nouveau Ticket`}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5" id="form-screen-subtitle">
            {editingTicket 
              ? "Modification des renseignements de maintenance et mise à jour financière"
              : `Génération du ticket d'entrée ID : ${generateNextId(lastGeneratedId)}`
            }
          </p>
        </div>

        {/* Gray Annuler, Blue Enregistrer, and Print actions inside form header */}
        <div className="flex items-center flex-wrap gap-2.5" id="form-head-actions">
          {editingTicket && (
            <>
              <button
                id="btn-print-tag"
                type="button"
                onClick={() => handlePrint('etiquette')}
                className={`flex items-center space-x-1.5 font-bold text-xs px-4 py-2.5 rounded-lg border transition-all cursor-pointer shadow-sm ${
                  isDarkMode
                    ? 'bg-[#1e293b] border-[#334155] hover:bg-amber-500/10 hover:border-amber-500/30 text-amber-400'
                    : 'bg-amber-50 border-amber-200 hover:bg-amber-100/60 text-amber-800'
                }`}
                title="Imprimer l'étiquette de code-barres (40mm x 20mm)"
              >
                <Printer className="w-4 h-4 text-amber-500" />
                <span>Imprimer Étiquette</span>
              </button>

              <button
                id="btn-print-voucher"
                type="button"
                onClick={() => handlePrint('bon')}
                className={`flex items-center space-x-1.5 font-bold text-xs px-4 py-2.5 rounded-lg border transition-all cursor-pointer shadow-sm ${
                  isDarkMode
                    ? 'bg-[#1e293b] border-[#334155] hover:bg-emerald-500/10 hover:border-emerald-500/30 text-emerald-400'
                    : 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100/60 text-emerald-800'
                }`}
                title="Imprimer le bon de réparation (Demi-A5)"
              >
                <FileText className="w-4 h-4 text-emerald-500" />
                <span>Imprimer Bon</span>
              </button>
            </>
          )}

          <button
            id="btn-form-cancel"
            type="button"
            onClick={onCancel}
            className={`flex items-center space-x-1 font-bold text-xs px-4 py-2.5 rounded-lg border transition-all cursor-pointer ${
              isDarkMode 
                ? 'bg-[#1e293b] border-[#334155] hover:bg-slate-700 text-slate-300' 
                : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-650'
            }`}
          >
            <X className="w-4 h-4" />
            <span>Annuler</span>
          </button>
          
          <button
            id="btn-form-save"
            type="submit"
            className="flex items-center space-x-1.5 bg-[#0284c7] hover:bg-[#0284c7]/95 active:bg-[#0284c7]/90 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow cursor-pointer transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Enregistrer</span>
          </button>
        </div>
      </div>

      {/* Main Dual Column Content Fields */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" id="form-dual-columns">
        
        {/* LEFT COLUMN */}
        <div 
          id="col-form-left"
          className={`p-6 rounded-2xl border space-y-4 shadow-sm transition-all ${
            isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-slate-200'
          }`}
        >
          <div className="border-b dark:border-slate-800 pb-2 mb-2 flex items-center space-x-2 text-blue-505" id="left-col-header">
            <User className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-bold uppercase tracking-wider">Informations Client & Matériel</span>
          </div>

          {/* Nom du client */}
          <div className="space-y-1" id="field-client-name">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1" htmlFor="inp-client-name">
              <span>Nom du client</span>
              <span className="text-red-550">*</span>
            </label>
            <input
              id="inp-client-name"
              type="text"
              required
              placeholder="Ex: Mohamed Kacimi"
              value={nomClient}
              onChange={(e) => {
                setNomClient(e.target.value);
                if (e.target.value.trim()) setErrors({});
              }}
              className={`w-full text-xs px-3 py-2.5 rounded-lg border focus:outline-none focus:ring-1 transition-all ${
                errors.nomClient 
                  ? 'border-red-500 bg-red-500/5 focus:ring-red-500' 
                  : isDarkMode 
                    ? 'bg-[#0f172a] border-[#334155] text-slate-205 focus:ring-[#38bdf8] focus:border-[#38bdf8]' 
                    : 'bg-slate-50 border-slate-200 text-slate-800 focus:ring-blue-600 focus:border-blue-600'
              }`}
            />
            {errors.nomClient && (
              <p className="text-[10px] text-red-500 font-bold mt-1" id="err-client-name">{errors.nomClient}</p>
            )}
          </div>

          {/* Modèle de téléphone */}
          <div className="space-y-1" id="field-phone-model">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest" htmlFor="inp-phone-model">
              Modèle de téléphone
            </label>
            <input
              id="inp-phone-model"
              type="text"
              placeholder="Ex: iPhone 13 Pro, Samsung A52"
              value={modele}
              onChange={(e) => setModele(e.target.value)}
              className={`w-full text-xs px-3 py-2.5 rounded-lg border focus:outline-none focus:ring-1 transition-all ${
                isDarkMode 
                  ? 'bg-[#0f172a] border-[#334155] text-slate-200 focus:ring-[#38bdf8] focus:border-[#38bdf8]' 
                  : 'bg-slate-50 border-slate-200 text-slate-800 focus:ring-blue-600'
              }`}
            />
          </div>

          {/* Prix de la pièce d'origine (DZD) */}
          <div className="space-y-1" id="field-part-cost">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between" htmlFor="inp-part-cost">
              <span>Prix de la pièce d'origine (DZD)</span>
              <span className="text-[10px] text-amber-500 font-mono">Coût interne</span>
            </label>
            <div className="relative" id="part-cost-input-wrapper">
              <input
                id="inp-part-cost"
                type="number"
                min="0"
                placeholder="0"
                value={piecePrix === 0 ? '' : piecePrix}
                onChange={(e) => setPiecePrix(Number(e.target.value))}
                className={`w-full text-xs pl-3 pr-12 py-2.5 rounded-lg border focus:outline-none focus:ring-1 transition-all font-mono ${
                  isDarkMode 
                    ? 'bg-[#0f172a] border-[#334155] text-slate-250 focus:ring-[#38bdf8] focus:border-[#38bdf8]' 
                    : 'bg-slate-50 border-slate-200 text-slate-800 focus:ring-blue-600'
                }`}
              />
              <span className="absolute right-3.5 top-2.5 text-xs text-slate-500 font-bold font-mono">DZD</span>
            </div>
          </div>

          {/* Description du problème */}
          <div className="space-y-1" id="field-problem-desc">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest" htmlFor="txt-problem-desc">
              Description du problème (Panne signalée)
            </label>
            <textarea
              id="txt-problem-desc"
              rows={4}
              placeholder="Décrivez précisément le symptôme de la panne constaté par l'opérateur ou décrit par le client..."
              value={descriptionProbleme}
              onChange={(e) => setDescriptionProbleme(e.target.value)}
              className={`w-full text-xs px-3 py-2.5 rounded-lg border focus:outline-none focus:ring-1 transition-all ${
                isDarkMode 
                  ? 'bg-[#0f172a] border-[#334155] text-slate-200 focus:ring-[#38bdf8] focus:border-[#38bdf8]' 
                  : 'bg-slate-50 border-slate-200 text-slate-800 focus:ring-blue-600'
              }`}
            />
          </div>

          {/* Dates Sub-grid Left Side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="left-dates-grid">
            {/* Date d'entrée */}
            <div className="space-y-1" id="field-date-entry">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest" htmlFor="dt-entry-picker">
                Date d'entrée
              </label>
              <input
                id="dt-entry-picker"
                type="datetime-local"
                value={dateEntree}
                onChange={(e) => setDateEntree(e.target.value)}
                className={`w-full text-xs px-3 py-2.5 rounded-lg border focus:outline-none focus:ring-1 transition-all ${
                  isDarkMode 
                    ? 'bg-[#0f172a] border-[#334155] text-slate-200 focus:ring-[#38bdf8] focus:border-[#38bdf8]' 
                    : 'bg-slate-50 border-slate-200 text-slate-800 focus:ring-blue-500'
                }`}
              />
            </div>

            {/* Date de fin réparation */}
            <div className="space-y-1" id="field-date-end">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest" htmlFor="dt-end-picker">
                Date fin réparation
              </label>
              <input
                id="dt-end-picker"
                type="datetime-local"
                value={dateFin}
                onChange={(e) => setDateFin(e.target.value)}
                className={`w-full text-xs px-3 py-2.5 rounded-lg border focus:outline-none focus:ring-1 transition-all ${
                  isDarkMode 
                    ? 'bg-[#0f172a] border-[#334155] text-slate-200 focus:ring-[#38bdf8] focus:border-[#38bdf8]' 
                    : 'bg-slate-50 border-slate-200 text-slate-800 focus:ring-blue-500'
                }`}
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div 
          id="col-form-right"
          className={`p-6 rounded-2xl border space-y-4 shadow-sm transition-all ${
            isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-slate-200'
          }`}
        >
          <div className="border-b dark:border-slate-800 pb-2 mb-2 flex items-center space-x-2 text-emerald-505" id="right-col-header">
            <DollarSign className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold uppercase tracking-wider">Suivi Interne & Tarification</span>
          </div>

          {/* Téléphone du client */}
          <div className="space-y-1" id="field-client-phone">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest" htmlFor="inp-client-phone">
              Téléphone du client
            </label>
            <input
              id="inp-client-phone"
              type="text"
              placeholder="Ex: 0550123456"
              value={telephoneClient}
              onChange={(e) => setTelephoneClient(e.target.value)}
              className={`w-full text-xs px-3 py-2.5 rounded-lg border focus:outline-none focus:ring-1 transition-all font-mono ${
                isDarkMode 
                  ? 'bg-[#0f172a] border-[#334155] text-slate-200 focus:ring-[#38bdf8] focus:border-[#38bdf8]' 
                  : 'bg-slate-50 border-slate-200 text-slate-800 focus:ring-blue-600'
              }`}
            />
          </div>

          {/* Statut Dropdown: En attente de diagnostic, En réparation, Réparation terminée */}
          <div className="space-y-1" id="field-ticket-status">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest" htmlFor="sel-ticket-status">
              Statut du dossier
            </label>
            <select
              id="sel-ticket-status"
              value={statut}
              onChange={(e) => setStatut(e.target.value as TicketStatus)}
              className={`w-full text-xs px-3 py-2.5 rounded-lg border focus:outline-none focus:ring-1 transition-all ${
                isDarkMode 
                  ? 'bg-[#0f172a] border-[#334155] text-slate-200 focus:ring-[#38bdf8] focus:border-[#38bdf8]' 
                  : 'bg-slate-50 border-slate-200 text-slate-800 focus:ring-blue-600'
              }`}
            >
              <option value="En attente de diagnostic">En attente de diagnostic</option>
              <option value="En réparation">En réparation</option>
              <option value="Réparation terminée">Réparation terminée</option>
            </select>
          </div>

          {/* Prix final facturé (DZD) */}
          <div className="space-y-1" id="field-final-price">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between" htmlFor="inp-final-price">
              <span>Prix final facturé (DZD)</span>
              <span className="text-[10px] text-emerald-505 dark:text-emerald-400 font-bold font-mono">Montant client</span>
            </label>
            <div className="relative" id="final-price-wrapper">
              <input
                id="inp-final-price"
                type="number"
                min="0"
                placeholder="0"
                value={prixFacture === 0 ? '' : prixFacture}
                onChange={(e) => setPrixFacture(Number(e.target.value))}
                className={`w-full text-xs pl-3 pr-12 py-2.5 rounded-lg border focus:outline-none focus:ring-1 transition-all font-mono font-bold ${
                  isDarkMode 
                    ? 'bg-[#0f172a] border-[#334155] text-slate-250 focus:ring-[#38bdf8]' 
                    : 'bg-slate-50 border-slate-200 text-slate-800 focus:ring-blue-605'
                }`}
              />
              <span className="absolute right-3.5 top-2.5 text-xs text-slate-500 font-bold font-mono">DZD</span>
            </div>
          </div>

          {/* Notes supplémentaires */}
          <div className="space-y-1" id="field-extra-notes">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest" htmlFor="txt-extra-notes">
              Notes supplémentaires (Historique d'intervention)
            </label>
            <textarea
              id="txt-extra-notes"
              rows={4}
              placeholder="Indiquez ici les détails internes de la réparation, l'origine de la pièce, le travail effectué ou les remarques remises au client..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={`w-full text-xs px-3 py-2.5 rounded-lg border focus:outline-none focus:ring-1 transition-all ${
                isDarkMode 
                  ? 'bg-[#0f172a] border-[#334155] text-slate-200 focus:ring-[#38bdf8] focus:border-[#38bdf8]' 
                  : 'bg-slate-50 border-slate-200 text-slate-800 focus:ring-blue-600'
              }`}
            />
          </div>

          {/* Date de prise en charge (Datetime picker) */}
          <div className="space-y-1" id="field-date-takeover">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest" htmlFor="dt-takeover-picker">
              Date de prise en charge diagnostic/réparations
            </label>
            <input
              id="dt-takeover-picker"
              type="datetime-local"
              value={datePriseEnCharge}
              onChange={(e) => setDatePriseEnCharge(e.target.value)}
              className={`w-full text-xs px-3 py-2.5 rounded-lg border focus:outline-none focus:ring-1 transition-all ${
                isDarkMode 
                  ? 'bg-[#0f172a] border-[#334155] text-slate-200 focus:ring-[#38bdf8]' 
                  : 'bg-slate-50 border-slate-200 text-slate-800 focus:ring-blue-550'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Live Financial Margin Summary Card */}
      <div 
        id="financial-margin-preview-box"
        className={`p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
          isDarkMode ? 'bg-[#1e293b] border-[#334155] text-slate-300' : 'bg-slate-55 border-slate-200 text-slate-700'
        }`}
      >
        <div className="flex items-start space-x-3" id="margin-intro">
          <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <h5 className="text-xs font-bold">Aperçu financier instantané du ticket</h5>
            <p className="text-[10px] text-slate-400 mt-0.5">La marge brute est calculée automatiquement à partir de la différence entre la facturation finale et le coût des rechanges d'origine.</p>
          </div>
        </div>

        <div className="flex items-center space-x-6 sm:space-x-8" id="margin-vals">
          {/* Internal cost display */}
          <div className="text-left" id="lbl-margin-cost">
            <span className="text-[10px] uppercase font-bold text-slate-450 block">Coût interne</span>
            <span className="text-xs font-mono font-bold">{new Intl.NumberFormat('fr-DZ', { style: 'currency', currency: 'DZD', maximumFractionDigits:0 }).format(piecePrix || 0)}</span>
          </div>

          {/* Revenue display */}
          <div className="text-left" id="lbl-margin-revenue">
            <span className="text-[10px] uppercase font-bold text-slate-450 block">Facturé</span>
            <span className="text-xs font-mono font-bold text-emerald-505 dark:text-emerald-400">{new Intl.NumberFormat('fr-DZ', { style: 'currency', currency: 'DZD', maximumFractionDigits:0 }).format(prixFacture || 0)}</span>
          </div>

          {/* Marge Calculee inline row badge */}
          <div className="text-left py-1 px-3 bg-blue-500/10 rounded-xl border border-blue-500/20" id="lbl-margin-profit-calc">
            <span className="text-[9px] uppercase font-extrabold text-blue-500 block">Marge brute estimée</span>
            <span className={`text-sm font-extrabold font-mono ${liveMargin >= 0 ? 'text-blue-500' : 'text-red-500'}`}>
              {new Intl.NumberFormat('fr-DZ', { style: 'currency', currency: 'DZD', maximumFractionDigits:0 }).format(liveMargin || 0)} ({liveMarginPercent}%)
            </span>
          </div>
        </div>
      </div>
    </form>

      {/* PRINT SCHEMES - HIDDEN BY DEFAULT ON VIEWPORTS */}
      {editingTicket && (
        <div id="print-templates-container">
          {/* Etiquette Print Template */}
          <div className="print-only print-template-etiquette select-none">
            <div className="flex flex-col h-full justify-between leading-none text-black">
              <div className="flex justify-between items-center border-b border-black/30 pb-[0.2mm]">
                <span className="text-[6px] font-black uppercase font-mono tracking-tight">BlueCom</span>
                <span className="text-[8px] font-black font-mono tracking-tighter bg-black text-white px-1 leading-none rounded-[1px]">
                  {editingTicket.id}
                </span>
              </div>

              <div className="py-[0.3mm] flex items-center justify-center">
                <BarcodeSvg value={editingTicket.id} />
              </div>

              <div className="flex justify-between items-end border-t border-black/25 pt-[0.2mm] text-[5.5px] leading-tight">
                <span className="font-extrabold truncate max-w-[20mm] uppercase">
                  {editingTicket.modele || 'Modèle'}
                </span>
                <span className="font-black truncate max-w-[13mm] text-right">
                  {editingTicket.nomClient}
                </span>
              </div>
            </div>
          </div>

          {/* Bon de Réparation / Réception Print Template */}
          <div className="print-only print-template-bon select-none">
            <div className="h-full flex flex-col justify-between leading-tight text-white p-1 relative bg-white" style={{ color: 'black' }}>
              
              <div className="flex justify-between items-center border-b border-double border-black/40 pb-1">
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-black rounded flex items-center justify-center">
                    <span className="text-white font-black text-[9px] leading-none">BC</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black tracking-tight uppercase leading-none">BlueCom Batna</span>
                    <span className="text-[6px] text-black/60 tracking-wider uppercase leading-none font-bold">Spécialiste Maintenance</span>
                  </div>
                </div>
                <div className="text-right">
                  <h4 className="text-[9.5px] font-black tracking-wider uppercase leading-none text-black">
                    {editingTicket.statut === 'Réparation terminée' ? 'BON DE RETRAIT' : 'BON DE RÉCEPTION'}
                  </h4>
                  <span className="text-[6px] text-black/60 uppercase font-mono font-bold leading-none mt-0.5 block">
                    Document officiel d'intervention
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-2 my-0.5 py-0.5 border-b border-black/10 items-center">
                <div className="col-span-5 flex flex-col justify-center">
                  <span className="text-[6px] font-black uppercase text-black/60 tracking-wider font-mono">TRACKING ID / DOSSIER</span>
                  <span className="text-xs font-black tracking-tighter text-black select-all leading-none mt-0.5 font-mono">
                    N° {editingTicket.id}
                  </span>
                </div>
                <div className="col-span-7 flex flex-col">
                  <div className="h-4 overflow-hidden w-full flex items-center justify-center">
                    <BarcodeSvg value={editingTicket.id} />
                  </div>
                  <div className="text-[5.5px] font-mono text-center font-bold tracking-widest mt-0.5">
                    *{editingTicket.id}*
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pb-0.5">
                <div className="border-r border-black/10 pr-1">
                  <span className="text-[5.5px] font-black uppercase text-black/65 tracking-wider block border-b border-black/5 pb-0.5 mb-0.5 font-mono">
                    EXPÉDITEUR (Boutique)
                  </span>
                  <div className="text-[7.5px] space-y-0.5 leading-tight">
                    <p className="font-extrabold text-black">BlueCom Batna</p>
                    <p className="text-black/80 font-semibold truncate text-[7px]">Cité 1000 logts, Batna</p>
                    <p className="font-mono text-black/95 font-bold text-[7px]">Tél: 0555 456 789 / 0770 123 456</p>
                    <p className="text-black/80 font-semibold truncate text-[6.5px]">E-mail: contact@bluecom.dz</p>
                  </div>
                </div>

                <div className="pl-1">
                  <span className="text-[5.5px] font-black uppercase text-black/65 tracking-wider block border-b border-black/5 pb-0.5 mb-0.5 font-mono">
                    DESTINATAIRE (Client)
                  </span>
                  <div className="text-[7.5px] space-y-0.5 leading-tight">
                    <p className="font-extrabold text-black truncate">Nom: {editingTicket.nomClient}</p>
                    <p className="font-semibold text-black/95">Appareil: <span className="font-extrabold uppercase text-[7px]">{editingTicket.modele || 'Non renseigné'}</span></p>
                    <p className="font-mono text-black/95 font-bold">Tél: {editingTicket.telephoneClient || 'Non fourni'}</p>
                    <p className="text-black/75 text-[6.5px] font-semibold">Statut: <span className="underline font-bold uppercase">{editingTicket.statut}</span></p>
                  </div>
                </div>
              </div>

              <div className="bg-black/5 border border-black/10 rounded px-1 py-0.5 flex justify-between items-center text-[7px] font-bold my-0.5">
                <span className="tracking-wider">DATE DE PRISE EN CHARGE :</span>
                <span className="font-mono">{formatFrenchDateTime(editingTicket.datePriseEnCharge || editingTicket.dateEntree)}</span>
              </div>

              <div className="grid grid-cols-12 border border-black/20 rounded overflow-hidden my-0.5">
                <div className="col-span-8 p-1 border-r border-black/20 bg-white min-h-[9mm]">
                  <span className="text-[5.5px] font-black uppercase text-black/60 tracking-wider block mb-0.5">
                    DESCRIPTION DE LA PANNE ET RECOMMANDATIONS CONSTATED
                  </span>
                  <div className="text-[7.5px] font-medium leading-tight text-black italic line-clamp-2">
                    {editingTicket.descriptionProbleme || "Aucune description de panne."}
                  </div>
                </div>

                <div className="col-span-4 bg-black/5 p-1 flex flex-col justify-between text-right">
                  <span className="text-[5px] font-black uppercase text-black/65 tracking-wider block leading-none">
                    MONTANT TOTAL DU
                  </span>
                  <div className="flex flex-col items-end justify-center h-full">
                    <span className="text-[11.5px] font-black tracking-tight text-black font-mono leading-none">
                      {formatDZD(editingTicket.prixFacture)}
                    </span>
                    <span className="text-[5px] text-black/60 font-black uppercase tracking-wider leading-none mt-0.5">
                      Net à payer (DZD)
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 border-t border-black/15 pt-1 mt-0.5">
                <div className="shrink-0 flex items-center justify-center">
                  <QrCodeSvg />
                </div>
                <div className="flex-1">
                  <p className="text-[5.4px] font-semibold text-black/90 leading-tight text-justify uppercase tracking-tighter">
                    * conditions de prise en charge : les appareils doivent être récupérés sous 30 jours à dater de l'appel. passé ce délai, bluecom batna décline toute responsabilité en cas de perte de données ou de dysfonctionnements secondaires. aucun retrait possible sans ce bon d'intervention officiel.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
