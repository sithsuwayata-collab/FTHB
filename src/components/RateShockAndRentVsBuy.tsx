import React from 'react';
import { CalculationFullResult } from '../types';
import { formatCAD, calculateCanadianMonthlyPayment } from '../utils/mortgageEngine';
import { 
  TrendingUp, 
  Scale, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  HelpCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface RateShockAndRentVsBuyProps {
  result: CalculationFullResult;
  currentRent: number;
  onRentChange: (newRent: number) => void;
}

export const RateShockAndRentVsBuy: React.FC<RateShockAndRentVsBuyProps> = ({
  result,
  currentRent,
  onRentChange,
}) => {
  const { inputs, cmhc, cashFlow, rateShockScenarios, rentVsBuySchedule, breakEvenYear } = result;

  // Interactive Rate Shock Custom Slider State (+0% to +3.5%)
  const [customRateBump, setCustomRateBump] = React.useState<number>(1.5);

  const customRenewalRate = inputs.contractRate + customRateBump;
  const customRenewalPayment = calculateCanadianMonthlyPayment(
    cmhc.totalMortgagePrincipal,
    customRenewalRate,
    Math.max(1, inputs.amortizationYears - 5)
  );
  const paymentDelta = customRenewalPayment - cashFlow.mortgagePayment;
  const newSurplus = cashFlow.netMonthlySurplus - paymentDelta;
  const canAbsorb = newSurplus >= 0;

  return (
    <div className="space-y-6">
      
      {/* Intro Hero */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Decision Lab</span>
          </span>
          <span className="text-xs text-slate-400 font-medium">
            Test renewal risks & compare long-term wealth vs renting
          </span>
        </div>
        <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
          Mortgage Renewal Stress Test & Rent vs Buy Crossover
        </h2>
        <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
          Smart buyers prepare for interest rate changes at renewal and evaluate the true crossover point where owning builds more wealth than renting.
        </p>
      </div>

      {/* Grid of 2 Simulators */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Simulator 1: Renewal Rate Shock (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-md flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                  <span>5-Year Renewal Rate Shock Simulator</span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  Simulate what happens if Bank of Canada rates rise by term renewal.
                </p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                canAbsorb
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
              }`}>
                {canAbsorb ? 'BUDGET SAFE' : 'BUDGET STRAIN'}
              </span>
            </div>

            {/* Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-300">Simulate Rate Increase at Renewal:</span>
                <span className="font-extrabold text-amber-400">+{customRateBump.toFixed(2)}%</span>
              </div>
              <input
                type="range"
                min="0.25"
                max="3.50"
                step="0.25"
                value={customRateBump}
                onChange={(e) => setCustomRateBump(parseFloat(e.target.value) || 1.5)}
                className="w-full accent-amber-500 bg-slate-800 h-2 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>+0.25% (Mild)</span>
                <span>+1.50% (Moderate)</span>
                <span>+3.50% (Severe)</span>
              </div>
            </div>

            {/* Live Reaction Card */}
            <div className={`p-4 rounded-xl border space-y-3 ${
              canAbsorb
                ? 'bg-emerald-950/20 border-emerald-500/30'
                : 'bg-rose-950/20 border-rose-500/30'
            }`}>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-semibold">Today's Contract Rate</span>
                  <span className="font-bold text-slate-200">{inputs.contractRate.toFixed(2)}%</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Payment: {formatCAD(cashFlow.mortgagePayment)}/mo
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-amber-400 block uppercase font-bold">Simulated Renewal Rate</span>
                  <span className="font-black text-amber-300 text-sm">{customRenewalRate.toFixed(2)}%</span>
                  <span className="text-[10px] text-white block mt-0.5 font-bold">
                    Payment: {formatCAD(customRenewalPayment)}/mo
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-2 flex justify-between items-center text-xs">
                <span className="text-slate-300">Monthly Payment Increase:</span>
                <span className="font-bold text-rose-300">
                  +{formatCAD(paymentDelta)} / mo
                </span>
              </div>

              <div className="border-t border-slate-800 pt-2 flex justify-between items-center text-xs">
                <span className="text-slate-300">Remaining Monthly Cash Buffer:</span>
                <span className={`font-black ${newSurplus >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {formatCAD(newSurplus)} / mo
                </span>
              </div>
            </div>

            {/* Rate Shock Scenario Table */}
            <div className="space-y-1 pt-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
                Scenario Sensitivity Matrix:
              </span>
              <div className="overflow-x-auto">
                <table className="w-full text-[11px] text-left border-collapse">
                  <thead className="text-[9px] uppercase text-slate-400 bg-slate-950 border-b border-slate-800">
                    <tr>
                      <th className="py-1 px-2">Rate Hike</th>
                      <th className="py-1 px-2">New Rate</th>
                      <th className="py-1 px-2">New Payment</th>
                      <th className="py-1 px-2 text-right">Extra Cost/mo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {rateShockScenarios.map((sc) => (
                      <tr key={sc.rateBump} className={sc.rateBump === customRateBump ? 'bg-amber-500/10 font-bold' : ''}>
                        <td className="py-1 px-2">+{sc.rateBump.toFixed(1)}%</td>
                        <td className="py-1 px-2 text-amber-400">{sc.newRate.toFixed(2)}%</td>
                        <td className="py-1 px-2">{formatCAD(sc.newMonthlyPayment)}</td>
                        <td className="py-1 px-2 text-right text-rose-400 font-medium">+{formatCAD(sc.paymentDifference)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 leading-snug pt-2 border-t border-slate-800">
            💡 <strong>Protection Tip:</strong> Making extra lump-sum payments during your first 5 years reduces principal early, significantly cushioning the blow of any renewal rate hikes.
          </p>
        </div>

        {/* Simulator 2: Rent vs Buy Crossover (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-md flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Scale className="w-4 h-4 text-sky-400" />
                  <span>Rent vs Buy 10-Year Wealth Engine</span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  Evaluates unrecoverable rent vs unrecoverable home costs + home equity.
                </p>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/30">
                BREAKEVEN: YR {breakEvenYear}
              </span>
            </div>

            {/* Current Rent Input Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-300">Your Current Monthly Rent:</span>
                <span className="font-extrabold text-sky-400">{formatCAD(currentRent)}/mo</span>
              </div>
              <input
                type="range"
                min="1200"
                max="4500"
                step="50"
                value={currentRent}
                onChange={(e) => onRentChange(parseFloat(e.target.value) || 2400)}
                className="w-full accent-sky-500 bg-slate-800 h-2 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>$1,200/mo</span>
                <span>$2,500/mo</span>
                <span>$4,500/mo</span>
              </div>
            </div>

            {/* Breakeven Summary Strip */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">
                  Breakeven Horizon
                </span>
                <span className="text-base font-black text-sky-400">
                  Year {breakEvenYear} of Ownership
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Overcomes closing fees & interest
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">
                  10-Year Wealth Advantage
                </span>
                <span className="text-base font-black text-emerald-400">
                  +{formatCAD(rentVsBuySchedule[9]?.netWealthAdvantageBuy || 0)}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Equity built minus ownership costs
                </span>
              </div>
            </div>

            {/* Year Comparison Progress Visualizer */}
            <div className="space-y-2 pt-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
                10-Year Net Wealth Trajectory:
              </span>
              <div className="space-y-1.5 text-xs">
                {[1, 3, 5, 7, 10].map((yr) => {
                  const item = rentVsBuySchedule[yr - 1];
                  if (!item) return null;
                  const isPositive = item.netWealthAdvantageBuy > 0;

                  return (
                    <div key={yr} className="flex justify-between items-center bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800/80">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-200">Year {yr}:</span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          Rent Cost: {formatCAD(item.cumulativeCostRent)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-300">
                          Equity: {formatCAD(item.homeEquityBuilt)}
                        </span>
                        <span className={`text-[11px] font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {isPositive ? `+${formatCAD(item.netWealthAdvantageBuy)}` : `-${formatCAD(Math.abs(item.netWealthAdvantageBuy))}`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 leading-snug pt-2 border-t border-slate-800">
            📊 <strong>The 5-Year Stay Principle:</strong> Because buying and selling incur significant legal, inspection, and Realtor transaction costs, staying in a home for at least 4 to 6 years is where ownership clearly outperforms renting.
          </p>
        </div>

      </div>

    </div>
  );
};
