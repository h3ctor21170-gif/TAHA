/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RepairTicket } from './types';

export const INITIAL_REPAIR_TICKETS: RepairTicket[] = [
  {
    id: "BC-1001",
    dateEntree: "2026-05-18T09:30",
    nomClient: "Amine Merah",
    telephoneClient: "0550123456",
    modele: "Samsung Galaxy S23 Ultra",
    piecePrix: 18000,
    descriptionProbleme: "Écran fissuré après chute, le tactile ne répond plus sur la partie inférieure.",
    prixFacture: 28000,
    notes: "Remplacement d'écran original avec châssis. Garantie de 3 mois offerte au client.",
    datePriseEnCharge: "2026-05-18T11:00",
    dateFin: "2026-05-18T16:30",
    statut: "Réparation terminée"
  },
  {
    id: "BC-1002",
    dateEntree: "2026-05-20T14:15",
    nomClient: "Fatiha Bouhidel",
    telephoneClient: "0661987654",
    modele: "iPhone 14 Pro Max",
    piecePrix: 12000,
    descriptionProbleme: "Remplacement de batterie. Capacité maximale à 74%, surchauffe importante lors de la charge.",
    prixFacture: 19500,
    notes: "Utiliser une batterie originale certifiée. Attention à ne pas endommager le joint d'étanchéité.",
    datePriseEnCharge: "2026-05-20T15:00",
    dateFin: "2026-05-20T17:45",
    statut: "Réparation terminée"
  },
  {
    id: "BC-1003",
    dateEntree: "2026-06-01T10:00",
    nomClient: "Yacine Chaoua",
    telephoneClient: "0772456789",
    modele: "Xiaomi Redmi Note 12",
    piecePrix: 3500,
    descriptionProbleme: "Ne charge plus du tout. Le port USB-C semble lâche et encrassé.",
    prixFacture: 6500,
    notes: "Nettoyage d'abord, puis remplacement de la nappe connecteur de charge si nécessaire.",
    datePriseEnCharge: "2026-06-01T11:30",
    dateFin: "2026-06-02T12:00",
    statut: "En réparation"
  },
  {
    id: "BC-1004",
    dateEntree: "2026-06-02T08:45",
    nomClient: "Karim Benani",
    telephoneClient: "0541334455",
    modele: "Oppo Reno 8T",
    piecePrix: 0,
    descriptionProbleme: "Problème logiciel. Bloqué sur le logo de démarrage (Bootloop) après une mise à jour manquée.",
    prixFacture: 4500,
    notes: "Flasher la ROM d'origine pour corriger le firmware. Sauvegarder les données si possible.",
    datePriseEnCharge: "2026-06-02T09:30",
    dateFin: "2026-06-03T15:00",
    statut: "En réparation"
  },
  {
    id: "BC-1005",
    dateEntree: "2026-06-03T11:20",
    nomClient: "Sarah Medjkouh",
    telephoneClient: "0659112233",
    modele: "iPhone 15 Pro",
    piecePrix: 25000,
    descriptionProbleme: "Vitre arrière fissurée et caméra ultra-grand-angle cassée suite à un choc thermique.",
    prixFacture: 38000,
    notes: "Pièces commandées. En attente de remplacement du capteur de caméra et de la face arrière.",
    datePriseEnCharge: "2026-06-03T11:30",
    dateFin: "",
    statut: "En attente de diagnostic"
  },
  {
    id: "BC-1006",
    dateEntree: "2026-06-03T12:00",
    nomClient: "Ramzi Zellal",
    telephoneClient: "0793776655",
    modele: "Samsung Galaxy A54",
    descriptionProbleme: "Haut-parleur interne inaudible, son grésillant très faible lors des appels.",
    piecePrix: 1500,
    prixFacture: 4000,
    notes: "Remplacer l'écouteur interne.",
    datePriseEnCharge: "2026-06-03T13:00",
    dateFin: "",
    statut: "En attente de diagnostic"
  }
];
