import React from 'react';
import { CheckCircle2, AlertTriangle } from 'lucide-react';
import { CalculationFullResult } from '../types';
import { formatCAD } from '../utils/mortgageEngine';

interface StressStatusBannerProps {
  result: CalculationFullResult;
}

export const StressStatusBanner: React.FC<StressStatusBannerProps> = ({ result }) => {
  const { stress, cmhc, cashFlow } = result;
  const isApproved = stress.overallApproved;
  const downShortfall = Math.max(0, cmhc.minimumRequiredDown - cmhc.downPaymentTotal);

  return (
    <div
      className={`p-4 md:p-5 rounded-2xl border transition-all duration-300 shadow-lg no-print ${
        isApproved
          ? 'bg-gradient-to-r from-emerald-950/70 via-slate-900 to-slate-900 border-emerald-500/40 shadow-emerald-950/30'
          : 'bg-gradient-to-r from-rose-950/70 via-slate-900 to-slate-900 border-rose-500/40 shadow-rose-950/30'
      }`}
    >
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        {/* Left: Status Message */}
        <div className="flex items-start gap-3.5 max-w-2xl">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0 border ${
              isApproved
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-md shadow-emerald-500/10'
                : 'bg-rose-500/20 text-rose-400 border-rose-500/40 shadow-md shadow-rose-500/10'
            }`}
          >
            {isApproved ? (
              <CheckCircle2 className="w-6 h-6" />
            ) : (
              <AlertTriangle className="w-6 h-6" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2
                className={`font-black text-base md:text-lg tracking-tight ${
                  isApproved ? 'text-emerald-300' : 'text-rose-300'
                }`}
              >
                {isApproved
                  ? 'Pre-Approved Within OSFI B-20 Stress-Test Parameters'
                  : 'Action Needed: Exceeds Stress Test or Down Payment Minimum'}
              </h2>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  isApproved
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                }`}
              >
                {isApproved ? 'A-LENDER ELIGIBLE' : 'ADJUST INPUTS'}
              </span>
            </div>

            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {isApproved ? (
                <>
                  Your household debt ratios (GDS <strong className="text-emerald-400">{stress.gdsStress.toFixed(1)}%</strong> ≤ 39% and TDS <strong className="text-emerald-400">{stress.tdsStress.toFixed(1)}%</strong> ≤ 44%) pass Canadian mortgage underwriting at the stress-tested rate of{' '}
                  <strong className="text-amber-300">{stress.stressRate.toFixed(2)}%</strong>.
                </>
              ) : downShortfall > 0 ? (
                <>
                  <strong className="text-rose-300">Down Payment Shortfall:</strong> You need an additional{' '}
                  <span className="font-bold text-amber-300">{formatCAD(downShortfall)}</span> to reach Canada’s statutory minimum down payment of {formatCAD(cmhc.minimumRequiredDown)} ({cmhc.minimumRequiredPercent.toFixed(1)}%).
                </>
              ) : (
                <>
                  Your debt ratios exceed qualifying caps (
                  {!stress.passesGDS && <span>GDS is {stress.gdsStress.toFixed(1)}% &gt; 39.0%</span>}
                  {!stress.passesGDS && !stress.passesTDS && <span> and </span>}
                  {!stress.passesTDS && <span>TDS is {stress.tdsStress.toFixed(1)}% &gt; 44.0%</span>}
                  ). Consider a slightly lower home price, paying off consumer debt, or adding down payment capital.
                </>
              )}
            </p>
          </div>
        </div>

        {/* Right: Key Figures */}
        <div className="flex items-center gap-4 sm:gap-6 self-stretch lg:self-auto justify-between lg:justify-end border-t lg:border-t-0 border-slate-800 pt-3 lg:pt-0">
          <div className="text-left lg:text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              Max Affordable Home
            </span>
            <span className="text-lg md:text-xl font-black text-white block">
              {formatCAD(Math.max(0, stress.maxAffordablePrice))}
            </span>
            <span className="text-[10px] text-sky-400 font-medium">
              {stress.headroom >= 0
                ? `+${formatCAD(stress.headroom)} headroom`
                : `-${formatCAD(Math.abs(stress.headroom))} shortfall`}
            </span>
          </div>

          <div className="h-10 w-px bg-slate-800 hidden sm:block"></div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              Net Monthly Surplus
            </span>
            <span
              className={`text-lg md:text-xl font-black block ${
                cashFlow.netMonthlySurplus >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {formatCAD(cashFlow.netMonthlySurplus)}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              After shelter, debts & living
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
