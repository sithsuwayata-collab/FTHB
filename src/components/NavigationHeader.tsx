import React from 'react';
import { 
  Printer, 
  HelpCircle, 
  Calculator, 
  CheckSquare, 
  BookOpen, 
  SlidersHorizontal,
  TrendingUp,
  Home
} from 'lucide-react';
import { PRESET_SCENARIOS } from '../data/newcomerGuide';

interface NavigationHeaderProps {
  activeTab: 'calculator' | 'simulators' | 'guide' | 'checklist' | 'glossary';
  setActiveTab: (tab: 'calculator' | 'simulators' | 'guide' | 'checklist' | 'glossary') => void;
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
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-emerald-400 p-0.5 shadow-lg shadow-sky-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-sky-400">
                <Home className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white">
                  FirstHome <span className="text-sky-400">Canada</span>
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/30">
                  OSFI B-20 Compliant
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                The Smart First-Time Home Buyer OS & Affordability Engine
              </p>
            </div>
          </div>

          {/* Mobile Print Trigger */}
          <button
            onClick={onPrint}
            className="md:hidden p-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-1 shadow-md"
            title="Print Executive Blueprint"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {/* Preset Selector */}
          <div className="flex items-center">
            <select
              onChange={(e) => {
                const found = PRESET_SCENARIOS.find(s => s.name === e.target.value);
                if (found) onApplyPreset(found);
              }}
              className="bg-slate-800 border border-slate-700 hover:border-slate-600 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-sky-400 cursor-pointer"
            >
              <option value="">Sample Canadian Scenarios...</option>
              {PRESET_SCENARIOS.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name} ({p.province} · ${(p.price / 1000).toFixed(0)}k)
                </option>
              ))}
            </select>
          </div>

          {/* Print Report Button */}
          <button
            onClick={onPrint}
            className="hidden md:flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white rounded-lg text-xs font-bold transition shadow-md shadow-sky-600/20 active:scale-95"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print 2-Page Blueprint</span>
          </button>
        </div>
      </div>

      {/* Simplified Navigation Tabs Bar */}
      <div className="max-w-7xl mx-auto mt-2.5 pt-2 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
        <button
          onClick={() => setActiveTab('calculator')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-semibold transition whitespace-nowrap ${
            activeTab === 'calculator'
              ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>Affordability Calculator</span>
        </button>

        <button
          onClick={() => setActiveTab('simulators')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-semibold transition whitespace-nowrap ${
            activeTab === 'simulators'
              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Rate Shock & Rent vs Buy</span>
        </button>

        <button
          onClick={() => setActiveTab('guide')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-semibold transition whitespace-nowrap ${
            activeTab === 'guide'
              ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>5-Pillar Buyer Guide</span>
        </button>

        <button
          onClick={() => setActiveTab('checklist')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-semibold transition whitespace-nowrap ${
            activeTab === 'checklist'
              ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <CheckSquare className="w-3.5 h-3.5" />
          <span>Milestone Checklist</span>
        </button>

        <button
          onClick={() => setActiveTab('glossary')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-semibold transition whitespace-nowrap ${
            activeTab === 'glossary'
              ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Mortgage Glossary</span>
        </button>
      </div>
    </header>
  );
};
