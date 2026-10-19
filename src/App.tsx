/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { MortgageInputs } from './types';
import { runFullEngine } from './utils/mortgageEngine';
import { PRESET_SCENARIOS } from './data/newcomerGuide';
import { NavigationHeader } from './components/NavigationHeader';
import { ApprovalVisualizer } from './components/ApprovalVisualizer';
import { PracticalQuestionsPanel } from './components/PracticalQuestionsPanel';
import { ApprovalInsightsAndBreakdown } from './components/ApprovalInsightsAndBreakdown';
import { ChecklistTab } from './components/ChecklistTab';
import { GlossaryTab } from './components/GlossaryTab';
import { PrintReportView } from './components/PrintReportView';

export default function App() {
  const [activeTab, setActiveTab] = useState<'approval' | 'checklist' | 'glossary'>('approval');

  const [inputs, setInputs] = useState<MortgageInputs>({
    purchasePrice: 650000,
    downPaymentSources: {
      fhsa: 16000,
      hbp: 35000,
      savings: 25000,
      familyGift: 0,
    },
    annualIncome: 140000,
    creditTier: 'good',
    expenses: {
      carPayment: 400,
      creditCardsLoans: 150,
      groceriesFood: 800,
      childcareFamily: 250,
      phoneInternet: 160,
      personalMisc: 300,
    },
    contractRate: 4.25,
    amortizationYears: 25,
    province: 'ON',
    annualPropertyTax: 4600,
    monthlyCondoFee: 0,
    monthlyHeating: 175,
    rentalIncome: 0,
    rentalOffsetPct: 50,
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
      creditTier: preset.creditTier || 'good',
      expenses: { ...preset.expenses },
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
    }));
    setActiveTab('approval');
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
        <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6 lg:p-8 space-y-6">
          
          {/* TAB 1: VISUAL APPROVAL SIMULATOR */}
          {activeTab === 'approval' && (
            <div className="space-y-6">
              {/* Visual Approval Probability Ring & Key Numbers */}
              <ApprovalVisualizer result={calculationResult} />

              {/* Practical Questions Panel (Income, Everyday Expenses, Down Payment) */}
              <PracticalQuestionsPanel
                inputs={inputs}
                setInputs={setInputs}
              />

              {/* Assessment Breakdown (Strengths, Blockers, Cash Flow, Closing Day Cash) */}
              <ApprovalInsightsAndBreakdown result={calculationResult} />
            </div>
          )}

          {/* TAB 2: ACTION CHECKLIST */}
          {activeTab === 'checklist' && (
            <ChecklistTab />
          )}

          {/* TAB 3: GLOSSARY & FAQ */}
          {activeTab === 'glossary' && (
            <GlossaryTab />
          )}

        </main>

        {/* Minimal Fatigue-Free Footer */}
        <footer className="mt-12 border-t border-slate-800/80 bg-slate-900/60 py-5 px-4 text-center text-xs text-slate-400">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-200">FirstHome Canada</span>
              <span>·</span>
              <span>OSFI B-20 Stress Test Compliant</span>
            </div>
            <div className="text-[11px] text-slate-500">
              For planning and educational purposes. Consult a licensed mortgage broker for formal approval.
            </div>
          </div>
        </footer>
      </div>

      {/* PRINT-ONLY DEDICATED 2-PAGE BLUEPRINT */}
      <PrintReportView result={calculationResult} />

    </div>
  );
}
