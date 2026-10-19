import React, { useState } from 'react';
import { CalculationFullResult } from '../types';
import { formatCAD } from '../utils/mortgageEngine';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Lightbulb, 
  PieChart, 
  Receipt, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle,
  ShieldCheck,
  Percent
} from 'lucide-react';

interface ApprovalInsightsAndBreakdownProps {
  result: CalculationFullResult;
}

export const ApprovalInsightsAndBreakdown: React.FC<ApprovalInsightsAndBreakdownProps> = ({ result }) => {
  const { approval, cashFlow, closing, cmhc, ltt, stress, inputs } = result;
  const [showFullClosing, setShowFullClosing] = useState(false);

  return (
    <div className="space-y-5">
      
      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Strengths & What To Fix (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-md flex flex-col justify-between">
          <div className="space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2 border-b border-slate-800 pb-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Underwriting Assessment</span>
            </h3>

            {/* Strengths */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                What’s Helping Your Approval:
              </span>
              <div className="space-y-1.5">
                {approval.strengths.slice(0, 3).map((s, idx) => (
                  <div key={idx} className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5 flex items-start gap-2 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Blockers or Warnings (if any) */}
            {approval.blockers.length > 0 && (
              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider block">
                  Items Needing Attention:
                </span>
                <div className="space-y-1.5">
                  {approval.blockers.map((b, idx) => (
                    <div key={idx} className="bg-rose-950/20 border border-rose-500/30 rounded-xl p-2.5 flex items-start gap-2 text-xs text-rose-200">
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actionable Advice */}
          {approval.smartTips.length > 0 && (
            <div className="mt-3 bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-200 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-300">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Next Best Step:</span>
              </div>
              <p className="leading-relaxed">
                {approval.smartTips[0]}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Visual Cash Flow & Closing Cash (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-md flex flex-col justify-between">
          <div className="space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center justify-between border-b border-slate-800 pb-2.5">
              <span className="flex items-center gap-2">
                <PieChart className="w-4 h-4 text-sky-400" />
                <span>Real Monthly Cash Flow</span>
              </span>
              <span className="text-[11px] font-bold text-emerald-400">
                Take-Home: {formatCAD(cashFlow.estimatedNetTakeHome)}
              </span>
            </h3>

            {/* Visual stacked allocation bar */}
            <div className="space-y-2">
              <div className="h-4 w-full bg-slate-950 rounded-lg overflow-hidden flex border border-slate-800">
                <div 
                  style={{ width: `${Math.min(100, (cashFlow.totalHousingOutlay / cashFlow.estimatedNetTakeHome) * 100)}%` }} 
                  className="bg-sky-500 transition-all" 
                  title="Housing"
                />
                <div 
                  style={{ width: `${Math.min(100, (cashFlow.totalContractualDebts / cashFlow.estimatedNetTakeHome) * 100)}%` }} 
                  className="bg-rose-500 transition-all" 
                  title="Debts"
                />
                <div 
                  style={{ width: `${Math.min(100, (cashFlow.totalLivingExpenses / cashFlow.estimatedNetTakeHome) * 100)}%` }} 
                  className="bg-amber-500 transition-all" 
                  title="Living"
                />
                <div 
                  style={{ width: `${Math.max(0, Math.min(100, (cashFlow.netMonthlySurplus / cashFlow.estimatedNetTakeHome) * 100))}%` }} 
                  className="bg-emerald-500 transition-all" 
                  title="Surplus"
                />
              </div>

              {/* Legend with numbers */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center justify-between bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-500 shrink-0" />
                    Housing
                  </span>
                  <span className="font-bold text-white">{formatCAD(cashFlow.totalHousingOutlay)}</span>
                </div>

                <div className="flex items-center justify-between bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                    Debts
                  </span>
                  <span className="font-bold text-white">{formatCAD(cashFlow.totalContractualDebts)}</span>
                </div>

                <div className="flex items-center justify-between bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                    Living
                  </span>
                  <span className="font-bold text-white">{formatCAD(cashFlow.totalLivingExpenses)}</span>
                </div>

                <div className="flex items-center justify-between bg-emerald-950/20 p-2 rounded-lg border border-emerald-500/30">
                  <span className="flex items-center gap-1.5 text-emerald-300 font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                    Surplus
                  </span>
                  <span className="font-black text-emerald-400">{formatCAD(cashFlow.netMonthlySurplus)}</span>
                </div>
              </div>
            </div>

            {/* Total Cash Required on Closing Day */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-200 flex items-center gap-1.5">
                  <Receipt className="w-3.5 h-3.5 text-amber-400" />
                  <span>Total Cash Required on Closing Day:</span>
                </span>
                <span className="text-sm font-black text-amber-300">
                  {formatCAD(closing.totalCashRequired)}
                </span>
              </div>

              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Down payment: {formatCAD(closing.downPayment)}</span>
                <span>Closing fees/taxes: {formatCAD(closing.totalClosingFees)}</span>
              </div>

              {/* Collapsible closing cost breakdown to prevent character overload */}
              <button
                type="button"
                onClick={() => setShowFullClosing(!showFullClosing)}
                className="text-[11px] text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1 pt-1"
              >
                {showFullClosing ? 'Hide fee itemization ▲' : 'View legal, tax & inspection breakdown ▼'}
              </button>

              {showFullClosing && (
                <div className="pt-2 border-t border-slate-800 text-[11px] space-y-1 text-slate-300">
                  <div className="flex justify-between">
                    <span>• Land Transfer Tax (after rebates)</span>
                    <span className="font-medium text-white">{formatCAD(closing.netLtt)}</span>
                  </div>
                  {closing.pstOnInsurance > 0 && (
                    <div className="flex justify-between">
                      <span>• PST on Default Insurance ({inputs.province})</span>
                      <span className="font-medium text-white">{formatCAD(closing.pstOnInsurance)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>• Lawyer / Notary & Disbursements</span>
                    <span className="font-medium text-white">{formatCAD(closing.legalFees)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>• Home Inspection & Appraisal</span>
                    <span className="font-medium text-white">{formatCAD(closing.homeInspection + closing.appraisalFee)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>• Title Insurance & Setup</span>
                    <span className="font-medium text-white">{formatCAD(closing.titleInsurance + closing.estMovingAndSetup)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
