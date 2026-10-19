import React from 'react';
import { 
  Printer, 
  CheckSquare, 
  BookOpen, 
  Home,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { PRESET_SCENARIOS } from '../data/newcomerGuide';

interface NavigationHeaderProps {
  activeTab: 'approval' | 'checklist' | 'glossary';
  setActiveTab: (tab: 'approval' | 'checklist' | 'glossary') => void;
  onApplyPreset: (preset: typeof PRESET_SCENARIOS[0]) => void;
  onPrint: () => void;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  activeTab,
  setActiveTab,
  onApplyPreset,
  onPrint,
}) => {
  return (
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50 px-4 lg:px-8 py-3 no-print">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-emerald-400 p-0.5 shadow-lg shadow-sky-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-sky-400">
                <Home className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white">
                  FirstHome <span className="text-sky-400">Canada</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Approval Engine
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Mortgage Approval Simulator for First-Time Buyers & Immigrants
              </p>
            </div>
          </div>

          {/* Mobile Print */}
          <button
            onClick={onPrint}
            className="sm:hidden p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 shadow-sm"
            title="Print Summary"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>

        {/* Action Controls & Navigation */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
          {/* Quick Scenario Preset Dropdown */}
          <select
            onChange={(e) => {
              const found = PRESET_SCENARIOS.find(s => s.name === e.target.value);
              if (found) onApplyPreset(found);
            }}
            className="bg-slate-800/90 border border-slate-700 hover:border-slate-600 text-xs text-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-sky-400 cursor-pointer"
          >
            <option value="">Load Sample Profile...</option>
            {PRESET_SCENARIOS.map((p) => (
              <option key={p.name} value={p.name}>
                {p.name} ({p.province} · ${(p.price / 1000).toFixed(0)}k)
              </option>
            ))}
          </select>

          {/* Desktop Print Button */}
          <button
            onClick={onPrint}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl text-xs font-bold transition shadow-sm active:scale-95"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Clean 3 Tabs Strip */}
      <div className="max-w-6xl mx-auto mt-2.5 pt-2 border-t border-slate-800 flex items-center gap-2 text-xs">
        <button
          onClick={() => setActiveTab('approval')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold transition ${
            activeTab === 'approval'
              ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Approval Calculator</span>
        </button>

        <button
          onClick={() => setActiveTab('checklist')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold transition ${
            activeTab === 'checklist'
              ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <CheckSquare className="w-3.5 h-3.5" />
          <span>Action Checklist</span>
        </button>

        <button
          onClick={() => setActiveTab('glossary')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold transition ${
            activeTab === 'glossary'
              ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Quick FAQ & Terms</span>
        </button>
      </div>
    </header>
  );
};
