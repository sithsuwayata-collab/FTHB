import React from 'react';
import { CalculationFullResult } from '../types';
import { formatCAD } from '../utils/mortgageEngine';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  DollarSign, 
  Home, 
  TrendingUp, 
  ShieldCheck, 
  ArrowUpRight 
} from 'lucide-react';

interface ApprovalVisualizerProps {
  result: CalculationFullResult;
}

export const ApprovalVisualizer: React.FC<ApprovalVisualizerProps> = ({ result }) => {
  const { approval, stress, cmhc, cashFlow, inputs } = result;

  // SVG circular progress calculation
  const radius = 52;
  const stroke = 10;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (approval.score / 100) * circumference;

  const isApproved = stress.overallApproved;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 md:p-6 shadow-2xl relative overflow-hidden">
      {/* Background glow decoration */}
      <div 
        className={`absolute -right-20 -top-20 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none ${
          approval.score >= 70 ? 'bg-emerald-500' : approval.score >= 50 ? 'bg-amber-500' : 'bg-rose-500'
        }`}
      />

      {/* Main Approval Probability Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left: The Circular Gauge */}
        <div className="lg:col-span-4 flex items-center justify-center sm:justify-start gap-4">
          <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
            <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
              {/* Background circle */}
              <circle
                stroke="#1e293b"
                fill="transparent"
                strokeWidth={stroke}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
              {/* Animated Progress circle */}
              <circle
                stroke={approval.score >= 75 ? '#10b981' : approval.score >= 50 ? '#f59e0b' : '#f43f5e'}
                fill="transparent"
                strokeWidth={stroke}
                strokeDasharray={`${circumference} ${circumference}`}
                style={{ strokeDashoffset }}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-white tracking-tight">
                {approval.score}%
              </span>
              <span className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">
                Approval
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${approval.colorClass}`}>
                {approval.rating} Probability
              </span>
            </div>
            <h2 className="text-base font-extrabold text-white leading-tight">
              {approval.headline}
            </h2>
            <p className="text-xs text-slate-400">
              Tested at Canadian OSFI B-20 rate of{' '}
              <span className="font-semibold text-slate-200">{stress.stressRate.toFixed(2)}%</span>
            </p>
          </div>
        </div>

        {/* Center/Right: The 3 Critical Numbers */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* 1. Max Affordable Home */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 flex flex-col justify-between">
            <div className="flex justify-between items-center text-slate-400 text-xs">
              <span className="font-medium">Max Home Price</span>
              <Home className="w-3.5 h-3.5 text-sky-400" />
            </div>
            <div className="my-1">
              <span className="text-lg sm:text-xl font-black text-white">
                {formatCAD(Math.max(0, stress.maxAffordablePrice))}
              </span>
            </div>
            <div className="text-[11px] font-medium">
              {stress.headroom >= 0 ? (
                <span className="text-emerald-400 flex items-center gap-0.5">
                  <ArrowUpRight className="w-3 h-3" />
                  +{formatCAD(stress.headroom)} headroom
                </span>
              ) : (
                <span className="text-rose-400">
                  -{formatCAD(Math.abs(stress.headroom))} over target
                </span>
              )}
            </div>
          </div>

          {/* 2. Monthly Mortgage Payment */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 flex flex-col justify-between">
            <div className="flex justify-between items-center text-slate-400 text-xs">
              <span className="font-medium">Mortgage (P+I)</span>
              <DollarSign className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="my-1">
              <span className="text-lg sm:text-xl font-black text-amber-300">
                {formatCAD(cashFlow.mortgagePayment)}
                <span className="text-xs font-normal text-slate-400">/mo</span>
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              At {inputs.contractRate}% · {inputs.amortizationYears} yrs
            </div>
          </div>

          {/* 3. Real Monthly Cash Left */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 flex flex-col justify-between">
            <div className="flex justify-between items-center text-slate-400 text-xs">
              <span className="font-medium">Cash Left After Bills</span>
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="my-1">
              <span className={`text-lg sm:text-xl font-black ${
                cashFlow.netMonthlySurplus >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {formatCAD(cashFlow.netMonthlySurplus)}
                <span className="text-xs font-normal text-slate-400">/mo</span>
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              After shelter, debts & groceries
            </div>
          </div>

        </div>

      </div>

      {/* Quick Visual Status Strip */}
      <div className="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
        
        {/* Down payment status */}
        <div className={`px-3 py-2 rounded-xl border flex items-center gap-2 ${
          stress.passesDownPayment
            ? 'bg-slate-950/60 border-slate-800 text-slate-300'
            : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
        }`}>
          {stress.passesDownPayment ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span className="truncate">
            Down Payment: <strong>{formatCAD(cmhc.downPaymentTotal)}</strong> ({cmhc.downPaymentPercent.toFixed(1)}%)
          </span>
        </div>

        {/* GDS Ratio status */}
        <div className={`px-3 py-2 rounded-xl border flex items-center gap-2 ${
          stress.passesGDS
            ? 'bg-slate-950/60 border-slate-800 text-slate-300'
            : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
        }`}>
          {stress.passesGDS ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span className="truncate">
            Shelter Ratio (GDS): <strong>{stress.gdsStress.toFixed(1)}%</strong> <span className="text-slate-500">(max 39%)</span>
          </span>
        </div>

        {/* TDS Ratio status */}
        <div className={`px-3 py-2 rounded-xl border flex items-center gap-2 ${
          stress.passesTDS
            ? 'bg-slate-950/60 border-slate-800 text-slate-300'
            : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
        }`}>
          {stress.passesTDS ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span className="truncate">
            Total Debt (TDS): <strong>{stress.tdsStress.toFixed(1)}%</strong> <span className="text-slate-500">(max 44%)</span>
          </span>
        </div>

      </div>

      {/* Smart Pro Tip (Only 1 high-impact tip to avoid user fatigue) */}
      {approval.smartTips.length > 0 && (
        <div className="mt-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3.5 py-2 text-xs text-amber-200 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Smart Tip:</strong> {approval.smartTips[0]}
          </span>
        </div>
      )}

    </div>
  );
};
