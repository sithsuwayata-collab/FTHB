import React from 'react';
import { READINESS_CHECKLIST, ChecklistItem } from '../data/newcomerGuide';
import { RotateCcw } from 'lucide-react';

export const ChecklistTab: React.FC = () => {
  const [checkedIds, setCheckedIds] = React.useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('firsthome_checklist');
      if (saved) return new Set(JSON.parse(saved));
    } catch (e) {}
    return new Set(['chk-credit', 'chk-probation']);
  });

  const toggleItem = (id: string) => {
    setCheckedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        localStorage.setItem('firsthome_checklist', JSON.stringify(Array.from(next)));
      } catch (e) {}
      return next;
    });
  };

  const resetChecklist = () => {
    setCheckedIds(new Set(['chk-credit']));
    try {
      localStorage.removeItem('firsthome_checklist');
    } catch (e) {}
  };

  const totalItems = READINESS_CHECKLIST.length;
  const completedCount = checkedIds.size;
  const progressPct = Math.round((completedCount / totalItems) * 100);

  const getStatusBadge = () => {
    if (progressPct >= 90) return { label: 'OFFER READY', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' };
    if (progressPct >= 60) return { label: 'ADVANCED PREPARATION', color: 'bg-sky-500/20 text-sky-400 border-sky-500/40' };
    if (progressPct >= 30) return { label: 'BUILDING FOUNDATION', color: 'bg-amber-500/20 text-amber-400 border-amber-500/40' };
    return { label: 'EARLY STAGES', color: 'bg-slate-700 text-slate-300 border-slate-600' };
  };

  const status = getStatusBadge();

  const STAGES = [
    { id: 'early-prep', title: 'Phase 1: Early Foundation (Months 1–12)', subtitle: 'Credit scores, banking, and tax accounts.' },
    { id: 'financial-readiness', title: 'Phase 2: Financial Pre-Approval', subtitle: 'Funds seasoning, rate hold, and stress test.' },
    { id: 'house-hunting', title: 'Phase 3: House Hunting & Offers', subtitle: 'Realtor selection, conditions, and status certificates.' },
    { id: 'closing-keys', title: 'Phase 4: Legal Closing & Moving In', subtitle: 'Lawyer adjustments, insurance, and key handover.' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Progress Overview Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
                Milestone Roadmap
              </span>
              <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${status.color}`}>
                {status.label}
              </span>
            </div>
            <h2 className="text-xl font-black text-white mt-1">
              First-Time Home Buyer Readiness Tracker
            </h2>
            <p className="text-xs text-slate-400">
              Check off each milestone as you progress through your Canadian home buying journey.
            </p>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <div className="text-right">
              <span className="text-2xl font-black text-white">{progressPct}%</span>
              <span className="text-[10px] text-slate-400 block font-medium">
                {completedCount} of {totalItems} completed
              </span>
            </div>
            <button
              onClick={resetChecklist}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition"
              title="Reset Checklist"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
          <div
            style={{ width: `${progressPct}%` }}
            className="h-full bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
          />
        </div>
      </div>

      {/* 4 Phases List */}
      <div className="space-y-6">
        {STAGES.map((stage, idx) => {
          const stageItems = READINESS_CHECKLIST.filter(item => item.stage === stage.id);
          const stageCompleted = stageItems.filter(item => checkedIds.has(item.id)).length;

          return (
            <div key={stage.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2.5">
                <div>
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 text-xs flex items-center justify-center font-bold">
                      {idx + 1}
                    </span>
                    <span>{stage.title}</span>
                  </h3>
                  <p className="text-xs text-slate-400 ml-7">
                    {stage.subtitle}
                  </p>
                </div>
                <span className="text-xs font-semibold text-slate-400">
                  {stageCompleted}/{stageItems.length} Done
                </span>
              </div>

              <div className="space-y-2.5 pt-1">
                {stageItems.map(item => {
                  const isChecked = checkedIds.has(item.id);

                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleItem(item.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                        isChecked
                          ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-200'
                          : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="mt-0.5 text-sky-400 shrink-0">
                        {isChecked ? (
                          <div className="w-5 h-5 rounded bg-emerald-500 flex items-center justify-center text-slate-950 font-bold text-xs">
                            ✓
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded border border-slate-600 bg-slate-900" />
                        )}
                      </div>

                      <div className="space-y-0.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className={`text-xs font-bold ${isChecked ? 'line-through text-slate-400' : 'text-white'}`}>
                            {item.title}
                          </h4>
                          {item.importance === 'critical' && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                              CRITICAL
                            </span>
                          )}
                          {item.importance === 'recommended' && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                              RECOMMENDED
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
