import React from 'react';
import { 
  CalculationFullResult, 
  MortgageInputs, 
  ProvinceCode 
} from '../types';
import { PROVINCES_DATA } from '../data/provinces';
import { formatCAD } from '../utils/mortgageEngine';
import { VisualAnalytics } from './VisualAnalytics';
import { 
  MapPin, 
  Wallet, 
  PiggyBank, 
  FileText, 
  Home, 
  ShieldCheck
} from 'lucide-react';

interface FinancialCalculatorProps {
  inputs: MortgageInputs;
  setInputs: React.Dispatch<React.SetStateAction<MortgageInputs>>;
  result: CalculationFullResult;
}

export const FinancialCalculator: React.FC<FinancialCalculatorProps> = ({
  inputs,
  setInputs,
  result,
}) => {
  const { cmhc, ltt, closing, stress } = result;
  const currentProv = PROVINCES_DATA[inputs.province];

  const handleProvinceChange = (prov: ProvinceCode) => {
    const provData = PROVINCES_DATA[prov];
    const estTax = Math.round(inputs.purchasePrice * (provData?.defaultPropTaxRate || 0.008));
    setInputs(prev => ({
      ...prev,
      province: prov,
      annualPropertyTax: estTax,
    }));
  };

  const handlePriceChange = (price: number) => {
    const estTax = Math.round(price * (currentProv?.defaultPropTaxRate || 0.008));
    setInputs(prev => ({
      ...prev,
      purchasePrice: price,
      annualPropertyTax: estTax,
    }));
  };

  const totalDownPayment = 
    inputs.downPaymentSources.fhsa + 
    inputs.downPaymentSources.hbp + 
    inputs.downPaymentSources.savings + 
    inputs.downPaymentSources.familyGift;

  const isDownSufficient = totalDownPayment >= cmhc.minimumRequiredDown;

  return (
    <div className="space-y-6">
      
      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Interactive Inputs & Sliders (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Section 1: Target Location & Property */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-md">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>1. Location & Property Price</span>
              </h2>
              <span className="text-[10px] text-slate-400 font-semibold px-2 py-0.5 rounded bg-slate-800">
                {inputs.province}
              </span>
            </div>

            <div className="space-y-3.5">
              {/* Province Selector */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Province / City Rules
                </label>
                <select
                  value={inputs.province}
                  onChange={(e) => handleProvinceChange(e.target.value as ProvinceCode)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-sky-500 focus:outline-none cursor-pointer"
                >
                  <option value="ON">Ontario (General / GTA Suburbs)</option>
                  <option value="ON-TOR">City of Toronto (Dual LTT)</option>
                  <option value="BC">British Columbia (PTT Scale)</option>
                  <option value="AB">Alberta (No LTT / Fixed Land Titles)</option>
                  <option value="QC">Quebec (Welcome Tax)</option>
                  <option value="MB">Manitoba</option>
                  <option value="SK">Saskatchewan</option>
                  <option value="NS">Nova Scotia</option>
                  <option value="NB">New Brunswick</option>
                  <option value="PE">Prince Edward Island</option>
                  <option value="NL">Newfoundland & Labrador</option>
                </select>
                <span className="text-[10px] text-sky-400/90 block mt-1">
                  {currentProv?.keyHighlight}
                </span>
              </div>

              {/* Purchase Price Slider */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-semibold text-slate-300">Target Purchase Price</span>
                  <span className="font-bold text-sky-400 text-sm">{formatCAD(inputs.purchasePrice)}</span>
                </div>
                <input
                  type="range"
                  min="200000"
                  max="2000000"
                  step="5000"
                  value={inputs.purchasePrice}
                  onChange={(e) => handlePriceChange(parseFloat(e.target.value) || 0)}
                  className="w-full accent-sky-500 bg-slate-800 h-2 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>$200k</span>
                  <span>$500k (5% Tier)</span>
                  <span>$1.5M (Insured Cap)</span>
                  <span>$2.0M</span>
                </div>

                {/* Quick Price Buttons */}
                <div className="flex gap-1.5 mt-2">
                  {[450000, 600000, 750000, 950000].map(p => (
                    <button
                      key={p}
                      onClick={() => handlePriceChange(p)}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold transition ${
                        inputs.purchasePrice === p
                          ? 'bg-sky-600 text-white'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      ${p / 1000}k
                    </button>
                  ))}
                </div>
              </div>

              {/* Property Tax & Condo Fees */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Property Tax ($/yr)
                  </label>
                  <input
                    type="number"
                    step="100"
                    value={inputs.annualPropertyTax}
                    onChange={(e) => setInputs(prev => ({ ...prev, annualPropertyTax: Math.max(0, parseFloat(e.target.value) || 0) }))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:border-sky-500 focus:outline-none"
                  />
                  <span className="text-[9px] text-slate-400">
                    ~{formatCAD(inputs.annualPropertyTax / 12)}/mo
                  </span>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Condo Fees ($/mo)
                  </label>
                  <input
                    type="number"
                    step="25"
                    value={inputs.monthlyCondoFee}
                    onChange={(e) => setInputs(prev => ({ ...prev, monthlyCondoFee: Math.max(0, parseFloat(e.target.value) || 0) }))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:border-sky-500 focus:outline-none"
                  />
                  <span className="text-[9px] text-slate-400">
                    50% added to debt test
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Section 2: Income & Existing Obligations */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-md">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                <Wallet className="w-4 h-4" />
                <span>2. Income & Debts</span>
              </h2>
              <span className="text-[10px] text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/10">
                Gross Household
              </span>
            </div>

            <div className="space-y-3.5">
              {/* Gross Annual Income */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-300">Gross Annual Income</span>
                  <span className="font-bold text-emerald-400 text-sm">{formatCAD(inputs.annualIncome)}</span>
                </div>
                <input
                  type="range"
                  min="40000"
                  max="350000"
                  step="2500"
                  value={inputs.annualIncome}
                  onChange={(e) => setInputs(prev => ({ ...prev, annualIncome: parseFloat(e.target.value) || 0 }))}
                  className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Combined gross income of all borrowers on application.
                </span>
              </div>

              {/* Monthly Consumer Debt Obligations */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-300">Monthly Debt Obligations</span>
                  <span className="font-bold text-rose-400">{formatCAD(inputs.monthlyDebt)}/mo</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="3000"
                  step="50"
                  value={inputs.monthlyDebt}
                  onChange={(e) => setInputs(prev => ({ ...prev, monthlyDebt: parseFloat(e.target.value) || 0 }))}
                  className="w-full accent-rose-500 bg-slate-800 h-2 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-[10px] text-slate-400">
                  Car loans, student loans, credit card minimums (TDS impact).
                </span>
              </div>

              {/* Monthly Living Expenses */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-300">Monthly Living Expenses</span>
                  <span className="font-bold text-amber-400">{formatCAD(inputs.monthlyLiving)}/mo</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="6000"
                  step="100"
                  value={inputs.monthlyLiving}
                  onChange={(e) => setInputs(prev => ({ ...prev, monthlyLiving: parseFloat(e.target.value) || 0 }))}
                  className="w-full accent-amber-500 bg-slate-800 h-2 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-[10px] text-slate-400">
                  Groceries, transport, insurance, family costs.
                </span>
              </div>

              {/* Optional Rental Suite Income */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Home className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Rental Suite Offset (Optional)</span>
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400">
                    {inputs.rentalIncome > 0 ? `+${formatCAD(inputs.rentalIncome)}/mo` : 'None'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">Rental Income ($/mo)</label>
                    <input
                      type="number"
                      step="100"
                      min="0"
                      max="4000"
                      value={inputs.rentalIncome}
                      onChange={(e) => setInputs(prev => ({ ...prev, rentalIncome: Math.max(0, parseFloat(e.target.value) || 0) }))}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                      placeholder="e.g. 1500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">Lender Offset %</label>
                    <select
                      value={inputs.rentalOffsetPct}
                      onChange={(e) => setInputs(prev => ({ ...prev, rentalOffsetPct: parseFloat(e.target.value) || 50 }))}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                    >
                      <option value="50">50% (Standard)</option>
                      <option value="75">75% (Select Lenders)</option>
                      <option value="100">100% (Subject Property)</option>
                    </select>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Section 3: Down Payment Breakdown */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-md">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <PiggyBank className="w-4 h-4" />
                <span>3. Down Payment Capital Sources</span>
              </h2>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                isDownSufficient ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
              }`}>
                {((totalDownPayment / inputs.purchasePrice) * 100).toFixed(1)}% Down
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  FHSA Savings ($)
                </label>
                <input
                  type="number"
                  step="1000"
                  value={inputs.downPaymentSources.fhsa}
                  onChange={(e) => {
                    const val = Math.max(0, parseFloat(e.target.value) || 0);
                    setInputs(prev => ({
                      ...prev,
                      downPaymentSources: { ...prev.downPaymentSources, fhsa: val }
                    }));
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
                <span className="text-[9px] text-slate-400">Max $40k/person</span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  RRSP HBP ($)
                </label>
                <input
                  type="number"
                  step="1000"
                  value={inputs.downPaymentSources.hbp}
                  onChange={(e) => {
                    const val = Math.max(0, parseFloat(e.target.value) || 0);
                    setInputs(prev => ({
                      ...prev,
                      downPaymentSources: { ...prev.downPaymentSources, hbp: val }
                    }));
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
                <span className="text-[9px] text-slate-400">Max $60k/person</span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  TFSA & Cash ($)
                </label>
                <input
                  type="number"
                  step="1000"
                  value={inputs.downPaymentSources.savings}
                  onChange={(e) => {
                    const val = Math.max(0, parseFloat(e.target.value) || 0);
                    setInputs(prev => ({
                      ...prev,
                      downPaymentSources: { ...prev.downPaymentSources, savings: val }
                    }));
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
                <span className="text-[9px] text-slate-400">Personal savings</span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Family Gift / Other ($)
                </label>
                <input
                  type="number"
                  step="1000"
                  value={inputs.downPaymentSources.familyGift}
                  onChange={(e) => {
                    const val = Math.max(0, parseFloat(e.target.value) || 0);
                    setInputs(prev => ({
                      ...prev,
                      downPaymentSources: { ...prev.downPaymentSources, familyGift: val }
                    }));
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
                <span className="text-[9px] text-slate-400">Gift letter funds</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-300">Total Down Payment:</span>
              <span className="text-sm font-black text-amber-400">
                {formatCAD(totalDownPayment)}
              </span>
            </div>
          </div>

          {/* Section 4: Mortgage Terms */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-md">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>4. Mortgage Terms</span>
              </h2>
              <span className="text-[10px] text-slate-400 font-semibold px-2 py-0.5 rounded bg-slate-800">
                Rate & Amortization
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Contract Interest Rate (%)
                </label>
                <input
                  type="number"
                  step="0.05"
                  min="1.0"
                  max="15.0"
                  value={inputs.contractRate}
                  onChange={(e) => setInputs(prev => ({ ...prev, contractRate: parseFloat(e.target.value) || 4.25 }))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:border-sky-500 focus:outline-none"
                />
                <span className="text-[9px] text-slate-400">
                  Stress rate: {stress.stressRate.toFixed(2)}%
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Amortization Period
                </label>
                <select
                  value={inputs.amortizationYears}
                  onChange={(e) => setInputs(prev => ({ ...prev, amortizationYears: parseInt(e.target.value) || 25 }))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:border-sky-500 focus:outline-none cursor-pointer"
                >
                  <option value="25">25 Years (Standard)</option>
                  <option value="30">30 Years (First-Time Buyer / New Build)</option>
                </select>
                <span className="text-[9px] text-sky-400/90">
                  30 yrs permitted for FTBs
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Visual Dashboard Analytics (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Key Metric Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex flex-col justify-between shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Required Min Down
              </span>
              <span className="text-base sm:text-lg font-black text-white mt-1">
                {formatCAD(cmhc.minimumRequiredDown)}
              </span>
              <span className="text-[10px] text-sky-400 font-semibold mt-0.5">
                {cmhc.minimumRequiredPercent.toFixed(1)}% Statutory Min
              </span>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex flex-col justify-between shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                CMHC Premium
              </span>
              <span className="text-base sm:text-lg font-black text-white mt-1">
                {cmhc.insurancePremium > 0 ? formatCAD(cmhc.insurancePremium) : '$0'}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold mt-0.5">
                {cmhc.insurancePremium > 0 ? `${(cmhc.insuranceRate * 100).toFixed(2)}% Rate` : 'Uninsured (≥20%)'}
              </span>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex flex-col justify-between shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Total Cash at Closing
              </span>
              <span className="text-base sm:text-lg font-black text-emerald-400 mt-1">
                {formatCAD(closing.totalCashRequired)}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold mt-0.5">
                Down + {formatCAD(closing.totalClosingFees)} Fees
              </span>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex flex-col justify-between shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Stress Rate (B-20)
              </span>
              <span className="text-base sm:text-lg font-black text-amber-400 mt-1">
                {stress.stressRate.toFixed(2)}%
              </span>
              <span className="text-[10px] text-slate-400 font-semibold mt-0.5">
                Max(Rate+2%, 5.25%)
              </span>
            </div>
          </div>

          {/* OSFI B-20 Stress Test Progress Gauges */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-md">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-sky-400" />
                  <span>OSFI Stress Test Debt Service Gauges</span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  Canadian lenders require GDS ≤ 39.0% and TDS ≤ 44.0% tested at {stress.stressRate.toFixed(2)}%.
                </p>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${
                  stress.overallApproved
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                }`}
              >
                {stress.overallApproved ? 'PASSING' : 'EXCEEDS CAP'}
              </span>
            </div>

            {/* GDS Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-300">
                  Gross Debt Service (GDS) Ratio
                </span>
                <span className="font-bold">
                  <span className={stress.passesGDS ? 'text-emerald-400' : 'text-rose-400'}>
                    {stress.gdsStress.toFixed(1)}%
                  </span>{' '}
                  <span className="text-slate-400 font-normal">(Max 39.0%)</span>
                </span>
              </div>
              <div className="h-3.5 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-700/80">
                <div
                  style={{ width: `${Math.min(100, (stress.gdsStress / 50) * 100)}%` }}
                  className={`h-full rounded-full transition-all duration-500 ${
                    stress.passesGDS ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' : 'bg-gradient-to-r from-rose-500 to-rose-400'
                  }`}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0%</span>
                <span className="text-amber-400 font-semibold">Regulatory Limit: 39%</span>
                <span>50%</span>
              </div>
            </div>

            {/* TDS Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-300">
                  Total Debt Service (TDS) Ratio
                </span>
                <span className="font-bold">
                  <span className={stress.passesTDS ? 'text-emerald-400' : 'text-rose-400'}>
                    {stress.tdsStress.toFixed(1)}%
                  </span>{' '}
                  <span className="text-slate-400 font-normal">(Max 44.0%)</span>
                </span>
              </div>
              <div className="h-3.5 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-700/80">
                <div
                  style={{ width: `${Math.min(100, (stress.tdsStress / 60) * 100)}%` }}
                  className={`h-full rounded-full transition-all duration-500 ${
                    stress.passesTDS ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' : 'bg-gradient-to-r from-rose-500 to-rose-400'
                  }`}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0%</span>
                <span className="text-amber-400 font-semibold">Regulatory Limit: 44%</span>
                <span>60%</span>
              </div>
            </div>
          </div>

          {/* Visual Analytics Component */}
          <VisualAnalytics result={result} />

          {/* Upfront Closing Cost Itemization Table */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-md">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2.5">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  Upfront Closing Cost Itemization
                </h3>
                <p className="text-[11px] text-slate-400">
                  Cash required at lawyer’s office on possession date.
                </p>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                {inputs.province} Rules
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="text-[10px] text-slate-400 uppercase bg-slate-950/70 border-b border-slate-800">
                  <tr>
                    <th className="py-2 px-3">Item Description</th>
                    <th className="py-2 px-3">Calculation Basis</th>
                    <th className="py-2 px-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  <tr>
                    <td className="py-2 px-3 font-semibold text-white">Down Payment Allocated</td>
                    <td className="py-2 px-3 text-slate-400">Direct Purchase Equity Contribution</td>
                    <td className="py-2 px-3 text-right font-medium text-amber-400">{formatCAD(closing.downPayment)}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-white">Land Transfer Tax (Gross LTT)</td>
                    <td className="py-2 px-3 text-slate-400">{ltt.description}</td>
                    <td className="py-2 px-3 text-right font-medium">{formatCAD(closing.grossLtt)}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-white">First-Time Buyer LTT Rebate</td>
                    <td className="py-2 px-3 text-slate-400">{ltt.rebateDescription}</td>
                    <td className="py-2 px-3 text-right font-medium text-emerald-400">
                      {closing.lttRebate > 0 ? `-${formatCAD(closing.lttRebate)}` : '$0'}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-white">PST on Default Insurance</td>
                    <td className="py-2 px-3 text-slate-400">Due at Closing (ON 8%, QC 9.975%, SK 6%)</td>
                    <td className="py-2 px-3 text-right font-medium">{formatCAD(closing.pstOnInsurance)}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-white">Legal Fees & Disbursements</td>
                    <td className="py-2 px-3 text-slate-400">Title transfer, searches & deed registration</td>
                    <td className="py-2 px-3 text-right font-medium">{formatCAD(closing.legalFees)}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-white">Home Inspection & Appraisal</td>
                    <td className="py-2 px-3 text-slate-400">Independent structural verification & appraisal</td>
                    <td className="py-2 px-3 text-right font-medium">{formatCAD(closing.homeInspection + closing.appraisalFee)}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-white">Title Insurance & Setup</td>
                    <td className="py-2 px-3 text-slate-400">Title policy & utility connections</td>
                    <td className="py-2 px-3 text-right font-medium">{formatCAD(closing.titleInsurance + closing.estMovingAndSetup)}</td>
                  </tr>
                  <tr className="bg-sky-500/10 font-bold border-t border-sky-500/30">
                    <td className="py-2.5 px-3 text-sky-300">TOTAL CASH OUTLAY AT CLOSING</td>
                    <td className="py-2.5 px-3 text-sky-400">Down Payment + All Closing Fees</td>
                    <td className="py-2.5 px-3 text-right text-sky-300 text-sm font-black">
                      {formatCAD(closing.totalCashRequired)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
