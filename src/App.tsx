/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { MortgageInputs } from './types';
import { runFullEngine } from './utils/mortgageEngine';
import { PRESET_SCENARIOS } from './data/newcomerGuide';
import { NavigationHeader } from './components/NavigationHeader';
import { StressStatusBanner } from './components/StressStatusBanner';
import { FinancialCalculator } from './components/FinancialCalculator';
import { RateShockAndRentVsBuy } from './components/RateShockAndRentVsBuy';
import { GuidePillarsTab } from './components/GuidePillarsTab';
import { ChecklistTab } from './components/ChecklistTab';
import { GlossaryTab } from './components/GlossaryTab';
import { PrintReportView } from './components/PrintReportView';

export default function App() {
  const [activeTab, setActiveTab] = useState<'calculator' | 'simulators' | 'guide' | 'checklist' | 'glossary'>('calculator');

  const [inputs, setInputs] = useState<MortgageInputs>({
    purchasePrice: 650000,
    downPaymentSources: {
      fhsa: 16000,
      hbp: 35000,
      savings: 25000,
      familyGift: 0,
    },
    annualIncome: 140000,
    monthlyDebt: 400,
    monthlyLiving: 2200,
    contractRate: 4.25,
    amortizationYears: 25,
    province: 'ON',
    annualPropertyTax: 4600,
    monthlyCondoFee: 0,
    monthlyHeating: 175,
    rentalIncome: 0,
    rentalOffsetPct: 50,
    currentMonthlyRent: 2400,
  });

  // Master real-time calculation engine
  const calculationResult = useMemo(() => {
    return runFullEngine(inputs);
  }, [inputs]);

  // Apply preset scenario
  const handleApplyPreset = (preset: typeof PRESET_SCENARIOS[0]) => {
    setInputs(prev => ({
      ...prev,
      province: preset.province,
      purchasePrice: preset.price,
      annualIncome: preset.income,
      monthlyDebt: preset.debt,
      monthlyLiving: preset.living,
      downPaymentSources: {
        fhsa: preset.fhsa,
        hbp: preset.hbp,
        savings: preset.savings,
        familyGift: preset.gift,
      },
      contractRate: preset.rate,
      amortizationYears: preset.amort,
      annualPropertyTax: preset.tax,
      monthlyCondoFee: preset.condo,
      rentalIncome: preset.rental,
      currentMonthlyRent: preset.rent || 2400,
    }));
    setActiveTab('calculator');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Interactive App Shell (Hidden when printing) */}
      <div className="no-print flex-1 flex flex-col">
        {/* Navigation Header */}
        <NavigationHeader
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onApplyPreset={handleApplyPreset}
          onPrint={handlePrint}
        />

        {/* Main Workspace Container */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 space-y-6">
          
          {/* Top Real-Time Affordability & Stress Status Banner */}
          <StressStatusBanner result={calculationResult} />

          {/* Active Tab View Rendering */}
          {activeTab === 'calculator' && (
            <FinancialCalculator
              inputs={inputs}
              setInputs={setInputs}
              result={calculationResult}
            />
          )}

          {activeTab === 'simulators' && (
            <RateShockAndRentVsBuy
              result={calculationResult}
              currentRent={inputs.currentMonthlyRent}
              onRentChange={(newRent) => setInputs(prev => ({ ...prev, currentMonthlyRent: newRent }))}
            />
          )}

          {activeTab === 'guide' && (
            <GuidePillarsTab />
          )}

          {activeTab === 'checklist' && (
            <ChecklistTab />
          )}

          {activeTab === 'glossary' && (
            <GlossaryTab />
          )}

        </main>

        {/* Informative Footer */}
        <footer className="mt-12 border-t border-slate-800/80 bg-slate-900/60 py-6 px-4 text-center text-xs text-slate-400 space-y-2">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-200">FirstHome Canada</span>
              <span>·</span>
              <span>OSFI B-20 Compliant Engine</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-slate-400">
              <span>Updated for 2025/2026 Canadian Lending Rules</span>
              <span>·</span>
              <span>$1.5M Insured Cap</span>
              <span>·</span>
              <span>30-Yr FTB Amortization</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-500 max-w-3xl mx-auto">
            Disclaimer: This application is for financial modeling, stress-testing, and educational decision-making for first-time home buyers. Calculations reflect standard OSFI B-20 guidelines, CMHC tiered insurance premiums, and provincial land transfer taxes. Always consult a licensed mortgage broker, real estate lawyer, and financial planner for formal underwriting approvals.
          </p>
        </footer>
      </div>

      {/* PRINT-ONLY DEDICATED 2-PAGE BLUEPRINT (Visible only during window.print()) */}
      <PrintReportView result={calculationResult} />

    </div>
  );
}
