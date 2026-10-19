import React from 'react';
import { MortgageInputs, ProvinceCode, CreditTier } from '../types';
import { PROVINCES_DATA } from '../data/provinces';
import { formatCAD } from '../utils/mortgageEngine';
import { 
  DollarSign, 
  Car, 
  CreditCard, 
  ShoppingBag, 
  Baby, 
  Smartphone, 
  Coffee, 
  MapPin, 
  PiggyBank, 
  Home, 
  Building,
  HelpCircle,
  Shield
} from 'lucide-react';

interface PracticalQuestionsPanelProps {
  inputs: MortgageInputs;
  setInputs: React.Dispatch<React.SetStateAction<MortgageInputs>>;
}

export const PracticalQuestionsPanel: React.FC<PracticalQuestionsPanelProps> = ({
  inputs,
  setInputs,
}) => {
  const currentProv = PROVINCES_DATA[inputs.province];

  // Practical expense helpers
  const handleExpenseChange = (field: keyof typeof inputs.expenses, value: number) => {
    setInputs(prev => ({
      ...prev,
      expenses: {
        ...prev.expenses,
        [field]: Math.max(0, value),
      },
    }));
  };

  const totalContractualDebts = inputs.expenses.carPayment + inputs.expenses.creditCardsLoans;
  const totalLivingExpenses = 
    inputs.expenses.groceriesFood + 
    inputs.expenses.childcareFamily + 
    inputs.expenses.phoneInternet + 
    inputs.expenses.personalMisc;

  const totalDownPayment = 
    inputs.downPaymentSources.fhsa + 
    inputs.downPaymentSources.hbp + 
    inputs.downPaymentSources.savings + 
    inputs.downPaymentSources.familyGift;

  const handlePriceChange = (price: number) => {
    const estTax = Math.round(price * (currentProv?.defaultPropTaxRate || 0.008));
    setInputs(prev => ({
      ...prev,
      purchasePrice: price,
      annualPropertyTax: estTax,
    }));
  };

  return (
    <div className="space-y-6">
      
      {/* 3 Simple Visual Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* CARD 1: Income, Credit & Location */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-md flex flex-col justify-between">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Income & Credit</h3>
                <p className="text-[11px] text-slate-400">Your household earning power</p>
              </div>
            </div>

            {/* Income Slider */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-semibold text-slate-300">Annual Household Income</span>
                <span className="font-extrabold text-emerald-400 text-sm">
                  {formatCAD(inputs.annualIncome)}
                </span>
              </div>
              <input
                type="range"
                min="45000"
                max="300000"
                step="2500"
                value={inputs.annualIncome}
                onChange={(e) => setInputs(prev => ({ ...prev, annualIncome: parseFloat(e.target.value) || 0 }))}
                className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1.5">
                <span>Gross: ~{formatCAD(inputs.annualIncome / 12)}/mo</span>
                <span className="text-emerald-400/90 font-medium">
                  Take-Home: ~{formatCAD((inputs.annualIncome * 0.74) / 12)}/mo
                </span>
              </div>

              {/* Quick buttons */}
              <div className="flex gap-1.5 mt-2">
                {[80000, 110000, 140000, 180000].map(inc => (
                  <button
                    key={inc}
                    onClick={() => setInputs(prev => ({ ...prev, annualIncome: inc }))}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold transition ${
                      inputs.annualIncome === inc
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    ${inc / 1000}k
                  </button>
                ))}
              </div>
            </div>

            {/* Credit Score Tier Selection */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Credit Score Tier
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { tier: 'excellent' as CreditTier, label: 'Excellent (720+)', icon: '🌟' },
                  { tier: 'good' as CreditTier, label: 'Good (680–719)', icon: '👍' },
                  { tier: 'fair' as CreditTier, label: 'Fair (600–679)', icon: '⚠️' },
                  { tier: 'poor' as CreditTier, label: 'Under 600', icon: '⏳' },
                ].map(c => (
                  <button
                    key={c.tier}
                    type="button"
                    onClick={() => setInputs(prev => ({ ...prev, creditTier: c.tier }))}
                    className={`p-2 rounded-xl text-xs font-bold text-left border transition flex items-center gap-1.5 ${
                      inputs.creditTier === c.tier
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                        : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <span>{c.icon}</span>
                    <span className="truncate">{c.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Location Selector */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Where are you buying?
              </label>
              <select
                value={inputs.province}
                onChange={(e) => {
                  const prov = e.target.value as ProvinceCode;
                  const provData = PROVINCES_DATA[prov];
                  setInputs(prev => ({
                    ...prev,
                    province: prov,
                    annualPropertyTax: Math.round(prev.purchasePrice * (provData?.defaultPropTaxRate || 0.008)),
                  }));
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-sky-500 focus:outline-none"
              >
                <option value="ON">Ontario (General / Suburbs)</option>
                <option value="ON-TOR">City of Toronto (Dual LTT)</option>
                <option value="BC">British Columbia</option>
                <option value="AB">Alberta (No Land Transfer Tax)</option>
                <option value="QC">Quebec (Welcome Tax)</option>
                <option value="MB">Manitoba</option>
                <option value="SK">Saskatchewan</option>
                <option value="NS">Nova Scotia</option>
                <option value="NB">New Brunswick</option>
                <option value="PE">Prince Edward Island</option>
                <option value="NL">Newfoundland & Labrador</option>
              </select>
            </div>
          </div>
        </div>

        {/* CARD 2: Practical Everyday Expenses */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-md flex flex-col justify-between">
          <div className="space-y-3.5">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Practical Expenses</h3>
                  <p className="text-[11px] text-slate-400">Actual monthly outlays</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                {formatCAD(totalContractualDebts + totalLivingExpenses)}/mo Total
              </span>
            </div>

            {/* Debts (Lenders Care) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-rose-400 uppercase tracking-wider">
                  Debts (Lenders strictly test these)
                </span>
                <span className="font-semibold text-rose-300">{formatCAD(totalContractualDebts)}/mo</span>
              </div>

              {/* Car Payment */}
              <div className="flex items-center justify-between gap-2 bg-slate-950/70 p-2 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <Car className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>Car Loans / Leases</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-slate-400">$</span>
                  <input
                    type="number"
                    step="50"
                    min="0"
                    value={inputs.expenses.carPayment}
                    onChange={(e) => handleExpenseChange('carPayment', parseFloat(e.target.value) || 0)}
                    className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white text-right font-bold"
                  />
                </div>
              </div>

              {/* Credit Card / Student Loans */}
              <div className="flex items-center justify-between gap-2 bg-slate-950/70 p-2 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <CreditCard className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Credit Cards / Loans</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-slate-400">$</span>
                  <input
                    type="number"
                    step="25"
                    min="0"
                    value={inputs.expenses.creditCardsLoans}
                    onChange={(e) => handleExpenseChange('creditCardsLoans', parseFloat(e.target.value) || 0)}
                    className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white text-right font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Living Expenses (Your Real Budget) */}
            <div className="space-y-2 pt-1 border-t border-slate-800/80">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-amber-400 uppercase tracking-wider">
                  Real Living Costs (Your lifestyle)
                </span>
                <span className="font-semibold text-amber-300">{formatCAD(totalLivingExpenses)}/mo</span>
              </div>

              {/* Groceries */}
              <div className="flex items-center justify-between gap-2 bg-slate-950/70 p-2 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <ShoppingBag className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Groceries & Food</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-slate-400">$</span>
                  <input
                    type="number"
                    step="50"
                    min="0"
                    value={inputs.expenses.groceriesFood}
                    onChange={(e) => handleExpenseChange('groceriesFood', parseFloat(e.target.value) || 0)}
                    className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white text-right font-bold"
                  />
                </div>
              </div>

              {/* Childcare & Family */}
              <div className="flex items-center justify-between gap-2 bg-slate-950/70 p-2 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <Baby className="w-4 h-4 text-pink-400 shrink-0" />
                  <span>Childcare / Kids</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-slate-400">$</span>
                  <input
                    type="number"
                    step="50"
                    min="0"
                    value={inputs.expenses.childcareFamily}
                    onChange={(e) => handleExpenseChange('childcareFamily', parseFloat(e.target.value) || 0)}
                    className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white text-right font-bold"
                  />
                </div>
              </div>

              {/* Phone, Net & Fun */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-950/70 p-2 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block mb-1">Phone & Internet</span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-slate-400">$</span>
                    <input
                      type="number"
                      step="20"
                      min="0"
                      value={inputs.expenses.phoneInternet}
                      onChange={(e) => handleExpenseChange('phoneInternet', parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white text-right font-bold"
                    />
                  </div>
                </div>

                <div className="bg-slate-950/70 p-2 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block mb-1">Personal / Misc</span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-slate-400">$</span>
                    <input
                      type="number"
                      step="25"
                      min="0"
                      value={inputs.expenses.personalMisc}
                      onChange={(e) => handleExpenseChange('personalMisc', parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white text-right font-bold"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* CARD 3: Down Payment & Target Home */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-md flex flex-col justify-between">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Down Payment & Home</h3>
                <p className="text-[11px] text-slate-400">Target purchase parameters</p>
              </div>
            </div>

            {/* Target Purchase Price */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-semibold text-slate-300">Target Home Price</span>
                <span className="font-extrabold text-sky-400 text-sm">
                  {formatCAD(inputs.purchasePrice)}
                </span>
              </div>
              <input
                type="range"
                min="250000"
                max="1800000"
                step="5000"
                value={inputs.purchasePrice}
                onChange={(e) => handlePriceChange(parseFloat(e.target.value) || 0)}
                className="w-full accent-sky-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex gap-1.5 mt-2">
                {[500000, 650000, 800000, 1000000].map(p => (
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

            {/* Down Payment Total */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-semibold text-slate-300">Down Payment Savings</span>
                <span className="font-extrabold text-amber-400 text-sm">
                  {formatCAD(totalDownPayment)}
                  <span className="text-[10px] text-slate-400 font-normal ml-1">
                    ({((totalDownPayment / inputs.purchasePrice) * 100).toFixed(1)}%)
                  </span>
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">FHSA / HBP</label>
                  <input
                    type="number"
                    step="1000"
                    value={inputs.downPaymentSources.fhsa + inputs.downPaymentSources.hbp}
                    onChange={(e) => {
                      const val = Math.max(0, parseFloat(e.target.value) || 0);
                      setInputs(prev => ({
                        ...prev,
                        downPaymentSources: {
                          ...prev.downPaymentSources,
                          fhsa: Math.min(val, 40000),
                          hbp: Math.max(0, val - 40000),
                        }
                      }));
                    }}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">Cash / Gift</label>
                  <input
                    type="number"
                    step="1000"
                    value={inputs.downPaymentSources.savings + inputs.downPaymentSources.familyGift}
                    onChange={(e) => {
                      const val = Math.max(0, parseFloat(e.target.value) || 0);
                      setInputs(prev => ({
                        ...prev,
                        downPaymentSources: {
                          ...prev.downPaymentSources,
                          savings: val,
                        }
                      }));
                    }}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white"
                  />
                </div>
              </div>
            </div>

            {/* Property Type / Condo Fees Toggle */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-2.5 space-y-2">
              <span className="text-xs font-semibold text-slate-300 block">
                Property Structure
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setInputs(prev => ({ ...prev, monthlyCondoFee: 0 }))}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition ${
                    inputs.monthlyCondoFee === 0
                      ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  🏡 Freehold House
                </button>
                <button
                  type="button"
                  onClick={() => setInputs(prev => ({ ...prev, monthlyCondoFee: prev.monthlyCondoFee || 450 }))}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition ${
                    inputs.monthlyCondoFee > 0
                      ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  🏢 Condo / Fees
                </button>
              </div>

              {inputs.monthlyCondoFee > 0 && (
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-slate-400">Monthly Condo Fee:</span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-slate-400">$</span>
                    <input
                      type="number"
                      step="25"
                      value={inputs.monthlyCondoFee}
                      onChange={(e) => setInputs(prev => ({ ...prev, monthlyCondoFee: Math.max(0, parseFloat(e.target.value) || 0) }))}
                      className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-xs text-white text-right font-bold"
                    />
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
