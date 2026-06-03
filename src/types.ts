/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TicketStatus = 'En attente de diagnostic' | 'En réparation' | 'Réparation terminée';

export interface RepairTicket {
  id: string; // e.g. "BC-1001"
  dateEntree: string; // datetime-local format
  nomClient: string;
  telephoneClient: string;
  modele: string;
  piecePrix: number; // Cost of original spare part in DZD
  descriptionProbleme: string;
  prixFacture: number; // Final loaded price in DZD
  notes: string;
  datePriseEnCharge: string; // datetime-local format
  dateFin: string; // datetime-local format
  statut: TicketStatus;
}

export interface DashboardStats {
  totalTickets: number;
  totalRevenue: number;
  totalCost: number;
  grossProfit: number;
}
