import React from 'react';
import { GLOSSARY_TERMS, GlossaryItem } from '../data/newcomerGuide';
import { BookOpen, Search, AlertTriangle } from 'lucide-react';

export const GlossaryTab: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('All');

  const categories = ['All', 'Mortgage', 'Taxes', 'Legal', 'Ownership'];

  const filtered = GLOSSARY_TERMS.filter(item => {
    const q = searchQuery.toLowerCase();
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = 
      item.term.toLowerCase().includes(q) ||
      item.shortDefinition.toLowerCase().includes(q) ||
      item.explanation.toLowerCase().includes(q) ||
      item.pitfallToAvoid.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-400 bg-sky-500/10 px-2.5 py-0.5 rounded-full border border-sky-500/30 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Plain-English Dictionary</span>
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Demystifying Canadian Mortgage & Real Estate Jargon
              </span>
            </div>
            <h2 className="text-xl font-black text-white tracking-tight mt-1">
              Canadian Home Buyer Glossary
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl">
              Clear, practical explanations of the terms lenders, realtors, and lawyers use every day.
            </p>
          </div>

          <div className="relative min-w-[260px] w-full md:w-auto">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search GDS, CMHC, Amortization, LTT..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-1.5 pt-2 border-t border-slate-800">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                selectedCategory === cat
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Terms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(item => (
          <div
            key={item.term}
            className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3 hover:border-slate-700 transition shadow-sm"
          >
            {/* Header */}
            <div className="flex justify-between items-start gap-2 border-b border-slate-800 pb-2.5">
              <h3 className="font-extrabold text-sm md:text-base text-sky-300">
                {item.term}
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                {item.category}
              </span>
            </div>

            {/* Definitions */}
            <p className="text-xs font-semibold text-slate-200">
              {item.shortDefinition}
            </p>

            <p className="text-xs text-slate-400 leading-relaxed">
              {item.explanation}
            </p>

            {/* Pitfall to Avoid Callout */}
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 text-[11px] text-amber-200/90 leading-relaxed flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span><strong>Pitfall to Avoid:</strong> {item.pitfallToAvoid}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
