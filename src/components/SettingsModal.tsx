/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { X, HardDrive, ShieldCheck, FileText, Download, Settings, MapPin, Phone, Mail, Image } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  shopName: string;
  setShopName: (val: string) => void;
  shopAddress: string;
  setShopAddress: (val: string) => void;
  shopPhone: string;
  setShopPhone: (val: string) => void;
  shopEmail: string;
  setShopEmail: (val: string) => void;
  shopLogo: string;
  setShopLogo: (val: string) => void;
  onExportData: () => void;
}

export default function SettingsModal({ 
  isOpen, 
  onClose, 
  isDarkMode, 
  shopName, 
  setShopName,
  shopAddress,
  setShopAddress,
  shopPhone,
  setShopPhone,
  shopEmail,
  setShopEmail,
  shopLogo,
  setShopLogo,
  onExportData 
}: SettingsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4" id="settings-modal-overlay">
      <div 
        id="settings-modal-container"
        className={`w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-all duration-350 ${
          isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        {/* Modal Header */}
        <div className={`p-5 border-b flex items-center justify-between ${isDarkMode ? 'border-slate-800 bg-slate-950/20' : 'border-slate-100 bg-slate-50'}`} id="settings-header">
          <div className="flex items-center space-x-2.5" id="settings-title-wrap">
            <Settings className="w-5 h-5 text-blue-500 animate-spin hover:animate-none" />
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider">Paramètres de l'Atelier</h3>
              <p className="text-[10px] text-slate-400 font-medium">Configuration locale et tutoriel d'export de compilation Bureau</p>
            </div>
          </div>
          <button 
            id="settings-close-btn"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-700/20 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Scroll Container */}
        <div className="p-6 overflow-y-auto space-y-6 text-left" id="settings-body-scroll">
          
          {/* Section 1: Nom de l'atelier */}
          <div className="space-y-2.5" id="settings-sec-branding">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-500 flex items-center gap-1.5">
              <HardDrive className="w-4 h-4" />
              <span>Personnalisation Identité</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="branding-opts">
              <div className="space-y-1" id="field-shop-name-sett">
                <label className="text-[11px] font-bold text-slate-400" htmlFor="inp-shop-name-sett">
                  Nom d'atelier affilié
                </label>
                <input 
                  type="text"
                  id="inp-shop-name-sett"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  placeholder="BlueCom Batna"
                  className={`w-full text-xs px-3 py-2 rounded-lg border focus:outline-none focus:ring-1 ${
                    isDarkMode 
                      ? 'bg-slate-950 border-slate-800 text-slate-100 focus:ring-blue-500' 
                      : 'bg-slate-50 border-slate-200 text-slate-800 focus:ring-blue-600'
                  }`}
                />
              </div>
              <div className="space-y-1" id="field-currency-sett">
                <label className="text-[11px] font-bold text-slate-400">
                  Devise Monétaire
                </label>
                <div className={`p-2.5 rounded-lg border text-xs font-mono font-bold ${isDarkMode ? 'bg-slate-950/60 border-slate-800 text-slate-350' : 'bg-slate-50 text-slate-600'}`}>
                  DZD - Dinar Algérien (Fixé)
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Coordonnées de l'Atelier / Boutique & Photo de Profil */}
          <div className="p-5 rounded-2xl border dark:bg-slate-950/30 space-y-5 border-dashed border-slate-800" id="settings-sec-coordonnees">
            <div className="flex items-center space-x-2 text-blue-500" id="coordonnees-header">
              <Settings className="w-4 h-4" />
              <h4 className="text-xs font-bold uppercase tracking-wider">
                Coordonnées de l'Atelier (Expéditeur)
              </h4>
            </div>

            {/* Logo/PFP Section */}
            <div className="flex flex-col sm:flex-row gap-5 items-center pb-4 border-b border-dashed dark:border-slate-800/80" id="pfp-upload-section">
              <div className="relative group shrink-0" id="pfp-preview-container">
                {shopLogo ? (
                  <img 
                    src={shopLogo} 
                    alt="Logo Aperçu" 
                    className="w-16 h-16 rounded-full object-cover border-2 border-blue-500 shadow-md"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center border-2 border-dashed border-slate-705 text-slate-400 text-sm font-black select-none">
                    BC
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-2 text-center sm:text-left" id="pfp-upload-actions">
                <span className="text-[11px] font-bold text-slate-400 block">Photo de profil / Logo de boutique</span>
                <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                  <label 
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 shadow"
                    htmlFor="logo-file-input"
                  >
                    <span>Choisir une image</span>
                    <input 
                      type="file"
                      id="logo-file-input"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            if (typeof reader.result === 'string') {
                              setShopLogo(reader.result);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                  {shopLogo && (
                    <button
                      type="button"
                      onClick={() => setShopLogo('')}
                      className="px-3.5 py-1.5 bg-rose-600/20 hover:bg-rose-500 hover:text-white text-rose-500 rounded-lg text-xs font-bold transition-all"
                    >
                      Supprimer
                    </button>
                  )}
                </div>
                <p className="text-[9.5px] text-slate-500">Sera imprimée directement sur vos bons d'intervention et étiquettes.</p>
              </div>
            </div>

            {/* Inputs grid */}
            <div className="grid grid-cols-1 gap-4" id="atelier-coordonnees-inputs">
              <div className="space-y-1" id="field-shop-address">
                <label className="text-[11px] font-bold text-slate-400" htmlFor="inp-shop-address">
                  Adresse de la boutique
                </label>
                <input 
                  type="text"
                  id="inp-shop-address"
                  value={shopAddress}
                  onChange={(e) => setShopAddress(e.target.value)}
                  placeholder="Cité 1000 logts, Batna"
                  className={`w-full text-xs px-3 py-2 rounded-lg border focus:outline-none focus:ring-1 ${
                    isDarkMode 
                      ? 'bg-slate-950 border-slate-800 text-slate-100 focus:ring-blue-500' 
                      : 'bg-slate-50 border-slate-200 text-slate-800 focus:ring-blue-600'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1" id="field-shop-phone">
                  <label className="text-[11px] font-bold text-slate-400" htmlFor="inp-shop-phone">
                    Téléphones de contact
                  </label>
                  <input 
                    type="text"
                    id="inp-shop-phone"
                    value={shopPhone}
                    onChange={(e) => setShopPhone(e.target.value)}
                    placeholder="0555 456 789 / 0770 123 456"
                    className={`w-full text-xs px-3 py-2 rounded-lg border focus:outline-none focus:ring-1 ${
                      isDarkMode 
                        ? 'bg-slate-950 border-slate-800 text-slate-100 focus:ring-blue-500' 
                        : 'bg-slate-50 border-slate-200 text-slate-800 focus:ring-blue-600'
                    }`}
                  />
                </div>

                <div className="space-y-1" id="field-shop-email">
                  <label className="text-[11px] font-bold text-slate-400" htmlFor="inp-shop-email">
                    Adresse e-mail
                  </label>
                  <input 
                    type="email"
                    id="inp-shop-email"
                    value={shopEmail}
                    onChange={(e) => setShopEmail(e.target.value)}
                    placeholder="contact@bluecom.dz"
                    className={`w-full text-xs px-3 py-2 rounded-lg border focus:outline-none focus:ring-1 ${
                      isDarkMode 
                        ? 'bg-slate-950 border-slate-800 text-slate-100 focus:ring-blue-500' 
                        : 'bg-slate-50 border-slate-200 text-slate-800 focus:ring-blue-600'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Data Integrity & Backup */}
          <div className="space-y-2.5" id="settings-sec-backup">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-500 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Sécurité & Exportation</span>
            </h4>
            
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 rounded-xl bg-slate-900/40 border dark:border-slate-800" id="backup-actions">
              <div id="backup-desc">
                <p className="text-xs font-bold">Sauvegarde locale instantanée</p>
                <p className="text-[10px] text-slate-400">Prenez une copie complète de sécurité de vos tickets de réparation au format JSON.</p>
              </div>
              <button
                id="btn-export-json-all"
                type="button"
                onClick={onExportData}
                className="flex items-center space-x-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-2.5 rounded-lg shadow transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Exporter vers JSON</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className={`p-4 border-t flex justify-end ${isDarkMode ? 'border-slate-800 bg-slate-950/10' : 'border-slate-100 bg-slate-50'}`} id="settings-footer">
          <button
            id="settings-close-foot-btn"
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-505 text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer shadow-md transition-all"
          >
            Fermer les paramètres
          </button>
        </div>
      </div>
    </div>
  );
}
