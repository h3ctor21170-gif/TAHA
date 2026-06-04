/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { INITIAL_REPAIR_TICKETS } from './data';
import { RepairTicket } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import RepairsList from './components/RepairsList';
import RepairForm from './components/RepairForm';
import SettingsModal from './components/SettingsModal';

export default function App() {
  // Theme state: dark-themed by default as specified in requirements
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  
  // Navigation tabs state
  const [activeTab, setActiveTab] = useState<'statistiques' | 'liste' | 'nouveau'>('nouveau');
  
  // Repair tickets master state
  const [tickets, setTickets] = useState<RepairTicket[]>([]);

  // Selected ticket for editing workflow state
  const [editingTicket, setEditingTicket] = useState<RepairTicket | null>(null);

  // Settings Modal state
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [shopName, setShopName] = useState<string>('BlueCom Batna');
  const [shopAddress, setShopAddress] = useState<string>('Cité 1000 logts, Batna');
  const [shopPhone, setShopPhone] = useState<string>('0555 456 789 / 0770 123 456');
  const [shopEmail, setShopEmail] = useState<string>('contact@bluecom.dz');
  const [shopLogo, setShopLogo] = useState<string>('');

  // Load initial data on mount
  useEffect(() => {
    try {
      const storedTickets = localStorage.getItem('bluecom_batna_tickets');
      if (storedTickets) {
        setTickets(JSON.parse(storedTickets));
      } else {
        setTickets(INITIAL_REPAIR_TICKETS);
        localStorage.setItem('bluecom_batna_tickets', JSON.stringify(INITIAL_REPAIR_TICKETS));
      }
    } catch (e) {
      console.error("Erreur lors de la lecture des tickets depuis localStorage :", e);
      setTickets(INITIAL_REPAIR_TICKETS);
    }

    try {
      const storedTheme = localStorage.getItem('bluecom_batna_theme');
      if (storedTheme) {
        setIsDarkMode(storedTheme === 'dark');
      }
    } catch (e) {
      console.error(e);
    }

    try {
      const storedShop = localStorage.getItem('bluecom_batna_shopname');
      if (storedShop) {
        setShopName(storedShop);
      }
      const storedAddress = localStorage.getItem('bluecom_batna_shopaddress');
      if (storedAddress) {
        setShopAddress(storedAddress);
      }
      const storedPhone = localStorage.getItem('bluecom_batna_shopphone');
      if (storedPhone) {
        setShopPhone(storedPhone);
      }
      const storedEmail = localStorage.getItem('bluecom_batna_shopemail');
      if (storedEmail) {
        setShopEmail(storedEmail);
      }
      const storedLogo = localStorage.getItem('bluecom_batna_shoplogo');
      if (storedLogo) {
        setShopLogo(storedLogo);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Sync theme with system and body class list for smooth CSS transitions
  useEffect(() => {
    try {
      localStorage.setItem('bluecom_batna_theme', isDarkMode ? 'dark' : 'light');
    } catch (e) {
      console.error(e);
    }
  }, [isDarkMode]);

  // Save shop identity changes to localStorage
  useEffect(() => {
    if (shopName) {
      try {
        localStorage.setItem('bluecom_batna_shopname', shopName);
      } catch (e) {
        console.error(e);
      }
    }
  }, [shopName]);

  useEffect(() => {
    if (shopAddress) {
      try {
        localStorage.setItem('bluecom_batna_shopaddress', shopAddress);
      } catch (e) {
        console.error(e);
      }
    }
  }, [shopAddress]);

  useEffect(() => {
    if (shopPhone) {
      try {
        localStorage.setItem('bluecom_batna_shopphone', shopPhone);
      } catch (e) {
        console.error(e);
      }
    }
  }, [shopPhone]);

  useEffect(() => {
    if (shopEmail) {
      try {
        localStorage.setItem('bluecom_batna_shopemail', shopEmail);
      } catch (e) {
        console.error(e);
      }
    }
  }, [shopEmail]);

  useEffect(() => {
    try {
      localStorage.setItem('bluecom_batna_shoplogo', shopLogo);
    } catch (e) {
      console.error(e);
    }
  }, [shopLogo]);

  // Core callback: Reset to initial demonstration data
  const handleResetAllTickets = () => {
    try {
      setTickets(INITIAL_REPAIR_TICKETS);
      localStorage.setItem('bluecom_batna_tickets', JSON.stringify(INITIAL_REPAIR_TICKETS));
      setActiveTab('nouveau');
      setEditingTicket(null);
    } catch (e) {
      console.error(e);
    }
  };

  // Core callback: Create or Update an entry details
  const handleSaveTicket = (savedTicket: RepairTicket) => {
    let updatedTickets: RepairTicket[];

    const exists = tickets.some(t => t.id === savedTicket.id);
    if (exists) {
      updatedTickets = tickets.map(t => t.id === savedTicket.id ? savedTicket : t);
    } else {
      updatedTickets = [savedTicket, ...tickets];
    }

    setTickets(updatedTickets);
    try {
      localStorage.setItem('bluecom_batna_tickets', JSON.stringify(updatedTickets));
    } catch (e) {
      console.error(e);
    }

    // Reset workflow details and route back to Liste des repairs
    setEditingTicket(null);
    setActiveTab('liste');
  };

  // Core callback: Delete a ticket
  const handleDeleteTicket = (ticketId: string) => {
    const updatedTickets = tickets.filter(t => t.id !== ticketId);
    setTickets(updatedTickets);
    try {
      localStorage.setItem('bluecom_batna_tickets', JSON.stringify(updatedTickets));
    } catch (e) {
      console.error(e);
    }
  };

  // Switch to editing trigger
  const handleEditTicket = (ticket: RepairTicket) => {
    setEditingTicket(ticket);
    setActiveTab('nouveau');
  };

  // Switch tabs and reset active editing object if we navigate away
  const handleNavigateTab = (tab: 'statistiques' | 'liste' | 'nouveau') => {
    if (tab !== 'nouveau') {
      setEditingTicket(null);
    }
    setActiveTab(tab);
  };

  // Download entire dataset helper
  const handleExportDataAsJSON = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tickets, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `bluecom_batna_tickets_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (e) {
      alert("Erreur d'exportation de données.");
    }
  };

  // Get Last generated Ticket ID globally
  const lastGeneratedId = tickets.length > 0 
    ? [...tickets].sort((a, b) => {
        const aNum = parseInt(a.id.replace(/[^\d]/g, ''), 10) || 0;
        const bNum = parseInt(b.id.replace(/[^\d]/g, ''), 10) || 0;
        return bNum - aNum;
      })[0]?.id || "BC-1006"
    : "BC-1006";

  return (
    <div 
      className={`min-h-screen flex text-slate-100 transition-colors duration-250 select-none ${
        isDarkMode 
          ? 'bg-slate-950 font-sans' 
          : 'bg-slate-50 font-sans'
      }`} 
      id="app-container"
    >
      {/* 1. Left Fixed Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={handleNavigateTab} 
        resetAllTickets={handleResetAllTickets}
      />

      {/* 2. Main Work Content Column Area */}
      <div className="flex-1 flex flex-col min-w-0" id="main-workbench">
        {/* Top Header Bar */}
        <Header 
          activeTab={activeTab} 
          isDarkMode={isDarkMode} 
          setIsDarkMode={setIsDarkMode} 
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* Dynamic Display Panel Body based on Tab Selection */}
        <main className="flex-1 overflow-y-auto" id="active-workbench-tab">
          {activeTab === 'statistiques' && (
            <Dashboard 
              tickets={tickets} 
              isDarkMode={isDarkMode}
              onNavigateToTab={handleNavigateTab}
            />
          )}

          {activeTab === 'liste' && (
            <RepairsList 
              tickets={tickets} 
              isDarkMode={isDarkMode}
              onNavigateToTab={handleNavigateTab}
              onEditTicket={handleEditTicket}
              onDeleteTicket={handleDeleteTicket}
            />
          )}

          {activeTab === 'nouveau' && (
            <RepairForm 
              isDarkMode={isDarkMode}
              editingTicket={editingTicket}
              onSave={handleSaveTicket}
              onCancel={() => handleNavigateTab('liste')}
              lastGeneratedId={lastGeneratedId}
            />
          )}
        </main>
      </div>

      {/* 3. Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        isDarkMode={isDarkMode}
        shopName={shopName}
        setShopName={setShopName}
        shopAddress={shopAddress}
        setShopAddress={setShopAddress}
        shopPhone={shopPhone}
        setShopPhone={setShopPhone}
        shopEmail={shopEmail}
        setShopEmail={setShopEmail}
        shopLogo={shopLogo}
        setShopLogo={setShopLogo}
        onExportData={handleExportDataAsJSON}
      />
    </div>
  );
}
