/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { X, HardDrive, ShieldCheck, FileText, Download, Terminal, Settings } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  shopName: string;
  setShopName: (val: string) => void;
  onExportData: () => void;
}

export default function SettingsModal({ isOpen, onClose, isDarkMode, shopName, setShopName, onExportData }: SettingsModalProps) {
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

          {/* Section 2: Electron Compilation instructions - FULL EXPLANATION DE PROD */}
          <div className="p-4 rounded-xl border border-dashed border-slate-800/85 dark:bg-slate-950/30 space-y-3" id="settings-sec-compilation">
            <div className="flex items-center space-x-2 text-blue-500" id="compilation-header">
              <Terminal className="w-4 h-4" />
              <h4 className="text-xs font-bold uppercase tracking-wider">
                Compilation vers Bureau Windows (.exe)
              </h4>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Ce projet intègre tous les fichiers de configuration nécessaires pour être compilé en tant qu'application autonome locale via la technologie <strong className="text-slate-300">Electron</strong>.
            </p>

            <div className="space-y-2 bg-slate-950/80 p-3.5 rounded-lg border border-slate-850 font-mono text-[10.5px] text-slate-300 leading-relaxed" id="compilation-codeblock">
              <span className="text-slate-500 block mb-1"># Suivez ces étapes sur votre machine Windows locale :</span>
              <p>1. <span className="text-blue-400">git clone</span> / téléchargez l'archive zip exportée depuis AI Studio.</p>
              <p>2. Ouvrez un terminal dans le dossier racine de l'application.</p>
              <p>3. Installez les paquets : <span className="text-emerald-400">npm install</span></p>
              <p>4. Lancez en mode développement : <span className="text-emerald-400">npm run electron:dev</span></p>
              <p>5. Compilez l'installeur Windows .exe final de production : <span className="text-amber-400">npm run electron:build</span></p>
              <p className="text-slate-500 mt-2 block"># L'exécutable final sera généré dans le dossier `./dist_electron/`</p>
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
