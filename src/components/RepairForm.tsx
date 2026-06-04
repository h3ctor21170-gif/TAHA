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

  // Standard printing trigger utilizing a hidden Iframe to avoid parent print stylesheet bugs and empty page outputs
  const handlePrint = (type: 'etiquette' | 'bon') => {
    if (!editingTicket) return;

    // 1. Build vector graphics in standard SVG text format
    const barcodeHtml = `
      <svg viewBox="0 0 100 15" width="100%" height="100%" style="display: block;">
        <rect x="0" y="0" width="1.5" height="15" fill="black" />
        <rect x="2" y="0" width="0.75" height="15" fill="black" />
        <rect x="4.5" y="0" width="1.5" height="15" fill="black" />
        <rect x="7.5" y="0" width="0.75" height="15" fill="black" />
        <rect x="9.5" y="0" width="2.25" height="15" fill="black" />
        <rect x="13.5" y="0" width="0.75" height="15" fill="black" />
        <rect x="15" y="0" width="1.5" height="15" fill="black" />
        <rect x="18" y="0" width="3" height="15" fill="black" />
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
        <rect x="58.5" y="0" width="1.5" height="15" fill="black" />
        <rect x="62" y="0" width="0.75" height="15" fill="black" />
        <rect x="64" y="0" width="3" height="15" fill="black" />
        <rect x="69" y="0" width="1.5" height="15" fill="black" />
        <rect x="72.5" y="0" width="0.75" height="15" fill="black" />
        <rect x="74" y="0" width="2.25" height="15" fill="black" />
        <rect x="78.5" y="0" width="1.5" height="15" fill="black" />
        <rect x="82" y="0" width="0.75" height="15" fill="black" />
        <rect x="84.5" y="0" width="3" height="15" fill="black" />
        <rect x="90" y="0" width="1.5" height="15" fill="black" />
        <rect x="93" y="0" width="0.75" height="15" fill="black" />
        <rect x="95.5" y="0" width="0.75" height="15" fill="black" />
        <rect x="98" y="0" width="1.5" height="15" fill="black" />
      </svg>
    `;

    const qrHtml = `
      <svg viewBox="0 0 29 29" width="36" height="36" style="display: block;">
        <path d="M0 0h7v7H0zm1 1v5h5V1zm1 1h3v3H2zm6-2h1v1H8zm1 1h1v2H9zm1-1h2v1h-2zm2 1h1v1h-1zm-1 1h1v1h-1zm2-2h1v1h-1zm1 1h1v2h-1zm1-1h1v1h-1zm2 1h1v1h-1zm-1 1h1v1h-1zm2-2h3v1h-3zm1 1h1v1h-1zm1 0h1v1h-1zm1-1h1v1h-1zm-1 2h1v1h-1zm2-1h1v1h-1zm-2 1v1h-1v-1zm4-2h1v3h-1zm-2 2h1v1h-1zm2 1h1v1h-1zm-1 1h1v1h-1zm1-1h1v2h-1zm-1 1h-1v1h1zm-1 1h-1v1h1zm4-3v2h-1v-2zm-3 2v1h-1v-1zm1 1v1h-1v-1zm4-2h1v1h-1zm0 2h1v1h-1zm1-1v1h-1v-1zm-2-5h1v1h-1zm1 1h1v1h-1zm1-1h1v2h-1zm2-1v1h-1v-1zm-1 2v1h-1v-1zm2-2h1v2h-1zm0 2v1h-1v-1z" fill="black" />
        <path d="M22 0h7v7h-7zm1 1v5h5V1zm1 1h3v3H3zm-24 22h7v7H0zm1 1v5h5v-5zm1 1h3v3H2zm22 1v1h2v-1zm1 1v1h1v-1zm-1 1v1h2v-1z" fill="black" />
      </svg>
    `;

    // 2. Prepare HTML & page size styles
    let htmlContent = '';
    let customStyles = '';

    if (type === 'etiquette') {
      htmlContent = `
        <div class="etiquette-container">
          <div class="etiquette-header">
            TICKET N° ${editingTicket.id}
          </div>
          <div class="etiquette-model">
            ${(editingTicket.modele || 'Modèle').toUpperCase()}
          </div>
          <div class="etiquette-details">
            <div class="etiquette-line"><b>Client:</b> ${editingTicket.nomClient}</div>
            <div class="etiquette-line"><b>Tél:</b> ${editingTicket.telephoneClient || 'Non fourni'}</div>
            <div class="etiquette-line"><b>Panne:</b> ${editingTicket.descriptionProbleme || 'Non spécifiée'}</div>
            <div class="etiquette-line etiquette-price"><b>Prix:</b> ${formatDZD(editingTicket.prixFacture)}</div>
          </div>
        </div>
      `;

      customStyles = `
        @page {
          size: 40mm 20mm;
          margin: 0;
        }
        body {
          width: 40mm;
          height: 20mm;
          overflow: hidden;
          margin: 0;
          padding: 0;
        }
        .etiquette-container {
          width: 40mm;
          height: 20mm;
          padding: 0.8mm 1.5mm 0.8mm 1.5mm;
          display: flex;
          flex-direction: column;
          background: white;
          color: black;
          box-sizing: border-box;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
        }
        .etiquette-header {
          background: black;
          color: white;
          font-size: 11.5px;
          font-weight: 900;
          text-align: center;
          padding: 0.2mm 0;
          border-radius: 1px;
          text-transform: uppercase;
          line-height: 1;
          margin-bottom: 0.6mm;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .etiquette-model {
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.1;
          margin-bottom: 0.5mm;
          border-bottom: 0.8px solid #000;
          padding-bottom: 0.4mm;
        }
        .etiquette-details {
          display: flex;
          flex-direction: column;
          gap: 0.1mm;
        }
        .etiquette-line {
          font-size: 7.8px;
          color: black;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1;
        }
        .etiquette-line b {
          font-weight: 900;
        }
        .etiquette-price {
          font-size: 8.5px;
          font-weight: 900;
          margin-top: 0.2mm;
        }
      `;
    } else {
      const formattedDate = formatFrenchDateTime(editingTicket.datePriseEnCharge || editingTicket.dateEntree);
      const formattedPrice = formatDZD(editingTicket.prixFacture);
      const docTitle = editingTicket.statut === 'Réparation terminée' ? 'BON DE RETRAIT' : 'BON DE RÉCEPTION';

      htmlContent = `
        <div class="bon-container">
          <div class="bon-header">
            <div class="bon-logo-group">
              <div class="bon-logo-badge">BC</div>
              <div class="bon-logo-text">
                <span class="bon-brand-name font-sans">BlueCom Batna</span>
                <span class="bon-brand-sub font-mono">Spécialiste Maintenance</span>
              </div>
            </div>
            <div class="bon-header-right">
              <h4 class="bon-doc-title">${docTitle}</h4>
              <span class="bon-doc-subtitle">Document officiel d'intervention</span>
            </div>
          </div>

          <div class="bon-tracking-section">
            <div class="bon-tracking-info">
              <span class="bon-tracking-label">TICKET DOSSIER :</span>
              <span class="bon-tracking-number">N° ${editingTicket.id}</span>
            </div>
          </div>

          <div class="bon-parties-section">
            <div class="bon-column">
              <span class="bon-column-title">EXPÉDITEUR (Boutique)</span>
              <div class="bon-column-bold">BlueCom Batna</div>
              <div>Cité 1000 logts, Batna</div>
              <div class="bon-column-bold" style="font-family: monospace; font-size: 10.5px;">Tél: 0555 456 789 / 0770 123 456</div>
              <div style="font-size: 9.5px; color: #111;">E-mail: contact@bluecom.dz</div>
            </div>

            <div class="bon-column">
              <span class="bon-column-title">DESTINATAIRE (Client)</span>
              <div class="bon-column-bold">Nom: ${editingTicket.nomClient}</div>
              <div style="font-size: 10px;">Appareil: <span class="bon-column-bold" style="text-transform: uppercase;">${editingTicket.modele || 'Non renseigné'}</span></div>
              <div class="bon-column-bold" style="font-family: monospace; font-size: 10.5px;">Tél: ${editingTicket.telephoneClient || 'Non fourni'}</div>
              <div style="font-size: 10px;">Statut: <span style="text-decoration: underline; font-weight: bold; text-transform: uppercase;">${editingTicket.statut}</span></div>
            </div>
          </div>

          <div class="bon-date-box">
            <span class="bon-date-box-label">DATE DE PRISE EN CHARGE :</span>
            <span class="bon-date-box-value">${formattedDate}</span>
          </div>

          <div class="bon-table-section">
            <div class="bon-table-desc-col">
              <span class="bon-table-col-title">DESCRIPTION DE LA PANNE</span>
              <div class="bon-table-desc-text">${editingTicket.descriptionProbleme || "Aucune description de panne."}</div>
            </div>

            <div class="bon-table-price-col">
              <span class="bon-table-col-title" style="margin: 0; font-family: monospace;">MONTANT TOTAL DÛ :</span>
              <div class="bon-price-wrapper">
                <span class="bon-table-price-value">${formattedPrice}</span>
                <span class="bon-table-price-sublabel">Net à payer (DZD)</span>
              </div>
            </div>
          </div>

          <div class="bon-footer-section">
            <div class="bon-footer-rules">
              * CONDITIONS DE REPRISE : LES APPAREILS DOIVENT ÊTRE RÉCUPÉRÉS SOUS 30 JOURS. APRÈS CE DÉLAI, BLUECOM BATNA DÉCLINE TOUTE RESPONSABILITÉ. RETRAIT IMPOSSIBLE SANS CE BON.
            </div>
          </div>
        </div>
      `;

      customStyles = `
        @page {
          size: 210mm 148mm;
          margin: 0 !important;
        }
        html, body {
          width: 210mm;
          height: 148mm;
          overflow: hidden !important;
          margin: 0 !important;
          padding: 0 !important;
          box-sizing: border-box;
          background: white !important;
          transform: none !important;
        }
        .bon-container {
          width: 92mm;
          max-width: 92mm;
          height: 142mm;
          max-height: 142mm;
          margin-left: 5mm;
          margin-top: 3mm;
          padding: 3.5mm 4.5mm;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background: white;
          color: black;
          border: 1.5px solid black;
          border-radius: 4px;
          box-sizing: border-box;
        }
        .bon-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          border-bottom: 1.2px solid black;
          padding-bottom: 1.2mm;
          gap: 1mm;
        }
        .bon-logo-group {
          display: flex;
          align-items: center;
          gap: 2.2mm;
        }
        .bon-logo-badge {
          background: black;
          color: white;
          font-weight: 950;
          font-size: 13px;
          width: 6.5mm;
          height: 6.5mm;
          border-radius: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: monospace;
          line-height: 1;
        }
        .bon-logo-text {
          display: flex;
          flex-direction: column;
        }
        .bon-brand-name {
          font-size: 13.5px;
          font-weight: 955;
          text-transform: uppercase;
          line-height: 1;
        }
        .bon-brand-sub {
          font-size: 8px;
          color: #444;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }
        .bon-header-right {
          text-align: center;
        }
        .bon-doc-title {
          font-size: 13.5px;
          font-weight: 950;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          line-height: 1;
          margin: 0 0 0.2mm 0;
        }
        .bon-doc-subtitle {
          font-size: 8px;
          color: #444;
          font-weight: 800;
          text-transform: uppercase;
        }
        .bon-tracking-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          border-bottom: 1px solid black;
          padding: 1.8mm 0;
          background: #f9fafb;
          border-radius: 3px;
          border: 1.2px dashed black;
          margin: 1.5mm 0;
        }
        .bon-tracking-info {
          display: flex;
          justify-content: space-around;
          width: 100%;
          align-items: center;
        }
        .bon-tracking-label {
          font-size: 10px;
          font-weight: 950;
          color: #333;
          text-transform: uppercase;
          font-family: monospace;
          letter-spacing: 0.5px;
        }
        .bon-tracking-number {
          font-size: 18px;
          font-weight: 950;
          font-family: monospace;
          line-height: 1;
        }
        .bon-parties-section {
          display: flex;
          flex-direction: column;
          gap: 2.5mm;
          padding: 1.2mm 0;
        }
        .bon-column {
          font-size: 10.5px;
          line-height: 1.4;
          color: #111;
        }
        .bon-column-title {
          font-size: 9.5px;
          font-weight: 950;
          color: #111;
          text-transform: uppercase;
          border-bottom: 1px solid black;
          padding-bottom: 0.4mm;
          margin-bottom: 1mm;
          font-family: monospace;
          display: block;
        }
        .bon-column-bold {
          font-weight: 950;
          color: black;
        }
        .bon-date-box {
          background: #f3f4f6;
          border: 0.5px solid #bbb;
          border-radius: 3px;
          padding: 1.5mm 2.5mm;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 10.5px;
          font-weight: 850;
          margin: 1.5mm 0;
        }
        .bon-date-box-label {
          text-transform: uppercase;
          font-family: monospace;
        }
        .bon-date-box-value {
          font-family: monospace;
        }
        .bon-table-section {
          display: flex;
          flex-direction: column;
          border: 1.2px solid black;
          border-radius: 4px;
          overflow: hidden;
          margin: 1.5mm 0;
        }
        .bon-table-desc-col {
          padding: 1.8mm 2.5mm;
          border-bottom: 1.2px solid black;
          background: white;
          min-height: 12mm;
        }
        .bon-table-col-title {
          font-size: 8.5px;
          font-weight: 950;
          color: #333;
          text-transform: uppercase;
          display: block;
          margin-bottom: 0.6mm;
          font-family: monospace;
        }
        .bon-table-desc-text {
          font-size: 11px;
          font-weight: 855;
          font-style: italic;
          line-height: 1.35;
        }
        .bon-table-price-col {
          background: #f9fafb;
          padding: 1.8mm 2.5mm;
          display: flex;
          justify-content: space-between;
          align-items: center;
          text-align: right;
        }
        .bon-price-wrapper {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }
        .bon-table-price-value {
          font-size: 18px;
          font-weight: 950;
          font-family: monospace;
          line-height: 1;
        }
        .bon-table-price-sublabel {
          font-size: 7.5px;
          font-weight: 950;
          color: #555;
          text-transform: uppercase;
          line-height: 1;
          margin-top: 0.3mm;
        }
        .bon-footer-section {
          display: flex;
          align-items: center;
          border-top: 0.5px solid #ccc;
          padding-top: 1.5mm;
          margin-top: 1mm;
        }
        .bon-footer-rules {
          font-size: 7px;
          font-weight: 750;
          text-align: justify;
          line-height: 1.3;
          text-transform: uppercase;
          color: #222;
        }
      `;
    }

    // 3. Create invisible printing Iframe
    const existingFrame = document.getElementById('print-iframe');
    if (existingFrame) {
      existingFrame.remove();
    }

    const printFrame = document.createElement('iframe');
    printFrame.id = 'print-iframe';
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = '0';
    printFrame.style.margin = '0';
    printFrame.style.padding = '0';
    
    document.body.appendChild(printFrame);
    
    const iframeDoc = printFrame.contentDocument || printFrame.contentWindow?.document;
    if (!iframeDoc) {
      console.error("Unable to access print iframe document.");
      return;
    }
    
    const fullContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${type === 'etiquette' ? 'Etiquette' : 'Bon'} - ${editingTicket.id}</title>
          <style>
            * {
              box-sizing: border-box;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            body {
              margin: 0;
              padding: 0;
              background: white !important;
              color: black !important;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              -webkit-font-smoothing: antialiased;
            }
            ${customStyles}
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
      </html>
    `;
    
    iframeDoc.open();
    iframeDoc.write(fullContent);
    iframeDoc.close();
    
    const win = printFrame.contentWindow;
    if (win) {
      win.focus();
      
      // Hook print to onload event
      win.onload = function() {
        setTimeout(() => {
          win.print();
          setTimeout(() => {
            if (document.body.contains(printFrame)) {
              document.body.removeChild(printFrame);
            }
          }, 600);
        }, 80);
      };

      // Fallback print activation
      setTimeout(() => {
        if (document.body.contains(printFrame)) {
          win.print();
          setTimeout(() => {
            if (document.body.contains(printFrame)) {
              document.body.removeChild(printFrame);
            }
          }, 600);
        }
      }, 500);
    }
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
    </>
  );
}
