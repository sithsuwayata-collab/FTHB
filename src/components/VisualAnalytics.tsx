import React from 'react';
import { CalculationFullResult } from '../types';
import { formatCAD } from '../utils/mortgageEngine';
import { TrendingUp, PieChart as PieIcon } from 'lucide-react';

interface VisualAnalyticsProps {
  result: CalculationFullResult;
}

export const VisualAnalytics: React.FC<VisualAnalyticsProps> = ({ result }) => {
  const { cashFlow, equitySchedule } = result;

  // Cash Flow Segments for Doughnut Chart
  const items = [
    { label: 'Mortgage (P+I)', value: Math.max(0, cashFlow.mortgagePayment), color: '#0284c7' }, // sky-600
    { label: 'Taxes, Heat & Ins.', value: Math.max(0, cashFlow.propertyTax + cashFlow.heatingUtilities + cashFlow.homeInsuranceEst), color: '#38bdf8' }, // sky-400
    { label: 'Condo & Maint. Res.', value: Math.max(0, cashFlow.condoFee + cashFlow.homeMaintenanceReserve), color: '#06b6d4' }, // cyan-500
    { label: 'Consumer Debts', value: Math.max(0, cashFlow.debtPayments), color: '#f43f5e' }, // rose-500
    { label: 'Living Expenses', value: Math.max(0, cashFlow.livingExpenses), color: '#f59e0b' }, // amber-500
    { label: 'Monthly Surplus', value: Math.max(0, cashFlow.netMonthlySurplus), color: '#10b981' }, // emerald-500
  ].filter(item => item.value > 0);

  const totalValue = items.reduce((sum, item) => sum + item.value, 0);

  // SVG doughnut calculations
  let accumulatedAngle = 0;
  const radius = 64;
  const strokeWidth = 24;
  const center = 80;
  const circumference = 2 * Math.PI * radius;

  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  return (
    <div className="space-y-6">
      {/* 1. Cash Flow Allocations & Detailed Itemization */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-md">
        
        {/* Left: SVG Doughnut Chart */}
        <div className="md:col-span-5 flex flex-col items-center justify-center">
          <div className="w-full flex justify-between items-center mb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <PieIcon className="w-3.5 h-3.5 text-sky-400" />
              <span>Monthly Budget Allocation</span>
            </h4>
          </div>

          <div className="relative w-44 h-44 my-2 flex items-center justify-center">
            <svg width="160" height="160" viewBox="0 0 160 160" className="transform -rotate-90">
              {totalValue > 0 ? (
                items.map((item, index) => {
                  const strokeDasharray = (item.value / totalValue) * circumference;
                  const strokeDashoffset = -accumulatedAngle;
                  accumulatedAngle += strokeDasharray;

                  return (
                    <circle
                      key={item.label}
                      cx={center}
                      cy={center}
                      r={radius}
                      fill="transparent"
                      stroke={item.color}
                      strokeWidth={hoveredIndex === index ? strokeWidth + 4 : strokeWidth}
                      strokeDasharray={`${strokeDasharray} ${circumference}`}
                      strokeDashoffset={strokeDashoffset}
                      className="transition-all duration-300 cursor-pointer"
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    />
                  );
                })
              ) : (
                <circle
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="transparent"
                  stroke="#334155"
                  strokeWidth={strokeWidth}
                />
              )}
            </svg>

            {/* Inner Doughnut Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
              {hoveredIndex !== null && items[hoveredIndex] ? (
                <>
                  <span className="text-[10px] text-slate-400 font-medium truncate max-w-[110px]">
                    {items[hoveredIndex].label}
                  </span>
                  <span className="text-xs font-bold text-white">
                    {formatCAD(items[hoveredIndex].value)}
                  </span>
                  <span className="text-[9px] text-amber-400 font-semibold">
                    {((items[hoveredIndex].value / totalValue) * 100).toFixed(0)}%
                  </span>
                </>
              ) : (
                <>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Net Income</span>
                  <span className="text-xs font-black text-white">
                    {formatCAD(cashFlow.estimatedNetTakeHome)}
                  </span>
                  <span className="text-[9px] text-emerald-400 font-semibold">Monthly Inflow</span>
                </>
              )}
            </div>
          </div>

          {/* Mini Legend */}
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 w-full text-[10px] mt-2">
            {items.map((item, idx) => (
              <div 
                key={item.label} 
                className={`flex items-center gap-1.5 cursor-pointer p-0.5 rounded transition ${
                  hoveredIndex === idx ? 'bg-slate-800' : ''
                }`}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-slate-300 truncate">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Itemized Monthly Budget Breakdown */}
        <div className="md:col-span-7 flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-5 space-y-2">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 border-b border-slate-800 pb-2 flex justify-between items-center">
              <span>Itemized Household Budget</span>
              <span className="text-[10px] font-normal text-slate-400">Monthly</span>
            </h4>
            
            <div className="space-y-1.5 text-xs mt-3">
              <div className="flex justify-between font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                <span>Estimated Net Take-Home Pay</span>
                <span>{formatCAD(cashFlow.estimatedNetTakeHome)}</span>
              </div>

              <div className="flex justify-between text-sky-300 pl-2">
                <span>• Mortgage Principal & Interest</span>
                <span className="font-semibold">{formatCAD(cashFlow.mortgagePayment)}</span>
              </div>

              <div className="flex justify-between text-slate-300 pl-2">
                <span>• Property Tax ({formatCAD(result.inputs.annualPropertyTax)}/yr)</span>
                <span>{formatCAD(cashFlow.propertyTax)}</span>
              </div>

              <div className="flex justify-between text-slate-300 pl-2">
                <span>• Heating & Utilities (Gas/Hydro)</span>
                <span>{formatCAD(cashFlow.heatingUtilities)}</span>
              </div>

              {cashFlow.condoFee > 0 && (
                <div className="flex justify-between text-cyan-300 pl-2">
                  <span>• Monthly Condo Fees</span>
                  <span className="font-semibold">{formatCAD(cashFlow.condoFee)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-400 pl-2">
                <span>• 1% Home Maintenance Reserve</span>
                <span>{formatCAD(cashFlow.homeMaintenanceReserve)}</span>
              </div>

              <div className="flex justify-between text-rose-300 pl-2">
                <span>• Consumer Debts (Car, Cards)</span>
                <span>{formatCAD(cashFlow.debtPayments)}</span>
              </div>

              <div className="flex justify-between text-amber-300 pl-2">
                <span>• Living Expenses (Food, Transit)</span>
                <span>{formatCAD(cashFlow.livingExpenses)}</span>
              </div>

              {cashFlow.rentalIncomeNet > 0 && (
                <div className="flex justify-between text-emerald-300 pl-2">
                  <span>+ Basement Rental Suite Income</span>
                  <span className="font-bold">+{formatCAD(cashFlow.rentalIncomeNet)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
            <span className="text-xs font-extrabold uppercase text-white">
              Net Monthly Surplus Buffer:
            </span>
            <span
              className={`text-sm md:text-base font-black px-2.5 py-0.5 rounded-lg ${
                cashFlow.netMonthlySurplus >= 0
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
              }`}
            >
              {formatCAD(cashFlow.netMonthlySurplus)} / mo
            </span>
          </div>
        </div>

      </div>

      {/* 2. 5-Year Equity Build-Up Schedule Visualizer */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800 pb-3">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>5-Year Mortgage Amortization & Equity Projection</span>
            </h4>
            <p className="text-[11px] text-slate-400">
              Based on {result.inputs.contractRate}% contract interest and conservative 2.5% annual home appreciation.
            </p>
          </div>
          <div className="flex items-center gap-2 text-[10px]">
            <span className="flex items-center gap-1 text-sky-400 font-semibold">
              <span className="w-2.5 h-2.5 bg-sky-500 rounded-sm inline-block"></span> Loan Balance
            </span>
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-sm inline-block"></span> Accumulated Equity
            </span>
          </div>
        </div>

        {/* Visual Stacked Progress Bars for Years 1 to 5 */}
        <div className="space-y-3">
          {equitySchedule.map((item) => {
            const equityPct = Math.min(100, (item.homeEquityEst / item.homeValueEst) * 100);
            const loanPct = Math.max(0, 100 - equityPct);

            return (
              <div key={item.year} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-200">
                    Year {item.year}{' '}
                    <span className="text-[10px] text-slate-400 font-normal">
                      (Principal paid: +{formatCAD(item.principalPaid)} · Interest: {formatCAD(item.interestPaid)})
                    </span>
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-400 font-mono">
                      Bal: {formatCAD(item.endBalance)}
                    </span>
                    <span className="text-xs font-bold text-emerald-400">
                      Equity: {formatCAD(item.homeEquityEst)} ({equityPct.toFixed(0)}%)
                    </span>
                  </div>
                </div>

                <div className="h-4 w-full bg-slate-950 rounded-lg overflow-hidden flex border border-slate-800 p-0.5">
                  <div
                    style={{ width: `${loanPct}%` }}
                    className="h-full bg-gradient-to-r from-sky-600 to-sky-500 rounded-l transition-all duration-500"
                    title={`Remaining Mortgage: ${formatCAD(item.endBalance)}`}
                  />
                  <div
                    style={{ width: `${equityPct}%` }}
                    className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-r transition-all duration-500"
                    title={`Home Equity: ${formatCAD(item.homeEquityEst)}`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-300 gap-2">
          <span>
            💡 <strong>5-Year Wealth Milestone:</strong> By Year 5, you will have paid down{' '}
            <strong className="text-white">
              {formatCAD(equitySchedule.reduce((sum, i) => sum + i.principalPaid, 0))}
            </strong>{' '}
            in principal debt, accumulating estimated total home equity of{' '}
            <strong className="text-emerald-400">
              {formatCAD(equitySchedule[4]?.homeEquityEst || 0)}
            </strong>.
          </span>
        </div>
      </div>
    </div>
  );
};
