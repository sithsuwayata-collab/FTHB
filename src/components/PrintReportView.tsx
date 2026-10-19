import React from 'react';
import { CalculationFullResult } from '../types';
import { formatCAD } from '../utils/mortgageEngine';

interface PrintReportViewProps {
  result: CalculationFullResult;
}

export const PrintReportView: React.FC<PrintReportViewProps> = ({ result }) => {
  const { inputs, cmhc, ltt, closing, stress, cashFlow } = result;

  const currentDate = new Date().toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const isApproved = stress.overallApproved;
  const headroom = stress.headroom;

  // Bracket allocations
  const b1Min = cmhc.bracketBreakdown.first500kMin;
  const b2Min = cmhc.bracketBreakdown.nextTierMin;
  const b3Min = cmhc.bracketBreakdown.aboveTierMin;

  const userDown = cmhc.downPaymentTotal;
  const b1Alloc = Math.min(userDown, b1Min);
  const b2Alloc = Math.min(Math.max(0, userDown - b1Min), b2Min);
  const b3Alloc = Math.max(0, userDown - b1Min - b2Min);

  return (
    <div className="print-only">
      
      {/* PAGE 1 OF PRINT REPORT */}
      <div className="print-page page-break flex flex-col justify-between">
        <div className="space-y-5">
          
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-3 flex justify-between items-end">
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                CANADIAN HOME BUYER FINANCIAL BLUEPRINT
              </h1>
              <p className="text-[10px] font-bold text-sky-800 tracking-wider uppercase">
                OSFI B-20 Mortgage Stress Test · CMHC Tiering · Closing Cost Analysis
              </p>
            </div>
            <div className="text-right">
              <span className="text-[9px] text-slate-500 block">Generated on: {currentDate}</span>
              <span className="text-[10px] font-bold text-slate-800">Confidential Client Assessment</span>
            </div>
          </div>

          {/* Metric Summary Strip */}
          <div className="grid grid-cols-4 gap-2 bg-slate-100 p-2.5 rounded-lg border border-slate-300 text-center">
            <div>
              <span className="text-[8px] font-bold text-slate-500 uppercase block">Target Purchase Price</span>
              <span className="text-sm font-extrabold text-slate-900">{formatCAD(inputs.purchasePrice)}</span>
            </div>
            <div>
              <span className="text-[8px] font-bold text-slate-500 uppercase block">Total Mortgage Loan</span>
              <span className="text-sm font-extrabold text-slate-900">{formatCAD(cmhc.totalMortgagePrincipal)}</span>
            </div>
            <div>
              <span className="text-[8px] font-bold text-slate-500 uppercase block">Stress Ratios (GDS/TDS)</span>
              <span className="text-sm font-extrabold text-slate-900">
                {stress.gdsStress.toFixed(1)}% / {stress.tdsStress.toFixed(1)}%
              </span>
            </div>
            <div>
              <span className="text-[8px] font-bold text-slate-500 uppercase block">Total Cash at Closing</span>
              <span className="text-sm font-extrabold text-slate-900">{formatCAD(closing.totalCashRequired)}</span>
            </div>
          </div>

          {/* Section 1: Qualification & Stress Test */}
          <div className="space-y-1.5">
            <div className="border-b border-slate-300 pb-1 flex justify-between items-center">
              <h2 className="text-[11px] font-bold text-slate-900 uppercase">
                1. OSFI B-20 Stress Test & Qualification Ratios
              </h2>
              <span
                className={`text-[9px] font-extrabold px-2 py-0.5 rounded border ${
                  isApproved
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-rose-100 text-rose-800 border-rose-300'
                }`}
              >
                {isApproved ? 'QUALIFIES WITH A-LENDERS' : 'EXCEEDS STATUTORY LIMITS'}
              </span>
            </div>

            <p className="text-[10px] text-slate-700 leading-relaxed">
              Under federal OSFI B-20 regulations, mortgage borrowers must qualify at the greater of their contract interest rate plus 2.00% or 5.25%. Below is your comparative stress evaluation.
            </p>

            <table className="w-full text-[10px] text-left border border-slate-300 border-collapse">
              <thead className="bg-slate-200 text-slate-800 uppercase font-bold text-[9px]">
                <tr>
                  <th className="p-1 border border-slate-300">Metric / Parameter</th>
                  <th className="p-1 border border-slate-300">Contract Rate ({inputs.contractRate.toFixed(2)}%)</th>
                  <th className="p-1 border border-slate-300">Stress Test Rate ({stress.stressRate.toFixed(2)}%)</th>
                  <th className="p-1 border border-slate-300">Statutory Maximum</th>
                  <th className="p-1 border border-slate-300">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300 text-slate-800">
                <tr>
                  <td className="p-1 border border-slate-300 font-semibold">Monthly Payment (P+I)</td>
                  <td className="p-1 border border-slate-300">{formatCAD(stress.monthlyPaymentContract)} / mo</td>
                  <td className="p-1 border border-slate-300 font-bold">{formatCAD(stress.monthlyPaymentStress)} / mo</td>
                  <td className="p-1 border border-slate-300">{inputs.amortizationYears}-Year Amortization</td>
                  <td className="p-1 border border-slate-300 font-bold text-slate-700">Tested</td>
                </tr>
                <tr>
                  <td className="p-1 border border-slate-300 font-semibold">Gross Debt Service (GDS)</td>
                  <td className="p-1 border border-slate-300">{stress.gdsContract.toFixed(1)}%</td>
                  <td className="p-1 border border-slate-300 font-bold">{stress.gdsStress.toFixed(1)}%</td>
                  <td className="p-1 border border-slate-300">Max 39.0%</td>
                  <td className={`p-1 border border-slate-300 font-bold ${stress.passesGDS ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {stress.passesGDS ? 'PASS' : 'EXCEEDS'}
                  </td>
                </tr>
                <tr>
                  <td className="p-1 border border-slate-300 font-semibold">Total Debt Service (TDS)</td>
                  <td className="p-1 border border-slate-300">{stress.tdsContract.toFixed(1)}%</td>
                  <td className="p-1 border border-slate-300 font-bold">{stress.tdsStress.toFixed(1)}%</td>
                  <td className="p-1 border border-slate-300">Max 44.0%</td>
                  <td className={`p-1 border border-slate-300 font-bold ${stress.passesTDS ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {stress.passesTDS ? 'PASS' : 'EXCEEDS'}
                  </td>
                </tr>
                <tr className="bg-slate-100 font-bold">
                  <td className="p-1 border border-slate-300">Maximum Purchasing Limit</td>
                  <td colSpan={2} className="p-1 border border-slate-300 text-sky-900">
                    {formatCAD(Math.max(0, stress.maxAffordablePrice))} Limit
                  </td>
                  <td className="p-1 border border-slate-300">GDS/TDS Constrained</td>
                  <td className={`p-1 border border-slate-300 ${headroom >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {headroom >= 0 ? `+${formatCAD(headroom)} Headroom` : `-${formatCAD(Math.abs(headroom))} Shortfall`}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section 2: Down Payment Tiering & CMHC Insurance */}
          <div className="space-y-1.5">
            <h2 className="text-[11px] font-bold text-slate-900 uppercase border-b border-slate-300 pb-1">
              2. Tiered Down Payment & Default Insurance (CMHC / Sagen)
            </h2>

            <table className="w-full text-[10px] text-left border border-slate-300 border-collapse">
              <thead className="bg-slate-200 text-slate-800 uppercase font-bold text-[9px]">
                <tr>
                  <th className="p-1 border border-slate-300">Purchase Price Tier</th>
                  <th className="p-1 border border-slate-300">Statutory Min %</th>
                  <th className="p-1 border border-slate-300">Required Min ($)</th>
                  <th className="p-1 border border-slate-300">Your Allocation ($)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300 text-slate-800">
                <tr>
                  <td className="p-1 border border-slate-300">First $500,000 Portion</td>
                  <td className="p-1 border border-slate-300">5.0%</td>
                  <td className="p-1 border border-slate-300">{formatCAD(b1Min)}</td>
                  <td className="p-1 border border-slate-300">{formatCAD(b1Alloc)}</td>
                </tr>
                <tr>
                  <td className="p-1 border border-slate-300">Portion $500,001 to $1,500,000</td>
                  <td className="p-1 border border-slate-300">10.0%</td>
                  <td className="p-1 border border-slate-300">{formatCAD(b2Min)}</td>
                  <td className="p-1 border border-slate-300">{formatCAD(b2Alloc)}</td>
                </tr>
                <tr>
                  <td className="p-1 border border-slate-300">Portion $1,500,000+</td>
                  <td className="p-1 border border-slate-300">20.0% (Uninsured)</td>
                  <td className="p-1 border border-slate-300">{formatCAD(b3Min)}</td>
                  <td className="p-1 border border-slate-300">{formatCAD(b3Alloc)}</td>
                </tr>
                <tr className="bg-slate-100 font-bold">
                  <td className="p-1 border border-slate-300">Total Down Payment Capital</td>
                  <td className="p-1 border border-slate-300">{cmhc.downPaymentPercent.toFixed(1)}%</td>
                  <td className="p-1 border border-slate-300">{formatCAD(cmhc.minimumRequiredDown)}</td>
                  <td className="p-1 border border-slate-300 text-sky-900">{formatCAD(userDown)}</td>
                </tr>
              </tbody>
            </table>

            <div className="bg-slate-100 p-2 rounded border border-slate-300 text-[10px] text-slate-800 space-y-0.5">
              <span className="font-bold block">CMHC Mortgage Default Insurance Assessment:</span>
              <p className="leading-snug">
                {cmhc.isInsured
                  ? `Loan-to-Value (LTV) is ${cmhc.ltv.toFixed(1)}%. Insurance premium rate is ${(cmhc.insuranceRate * 100).toFixed(2)}%. The premium of ${formatCAD(cmhc.insurancePremium)} is added directly to principal, making total mortgage ${formatCAD(cmhc.totalMortgagePrincipal)}.`
                  : `Uninsured loan (≥20.0% down payment). Loan-to-Value is ${cmhc.ltv.toFixed(1)}%. Zero mortgage default insurance required.`}
              </p>
            </div>
          </div>

        </div>

        {/* Page 1 Footer */}
        <div className="border-t border-slate-300 pt-1.5 flex justify-between text-[9px] text-slate-500">
          <span>FirstHome Canada · First-Time Buyer Financial Blueprint</span>
          <span>Page 1 of 2</span>
        </div>
      </div>

      {/* PAGE 2 OF PRINT REPORT */}
      <div className="print-page flex flex-col justify-between">
        <div className="space-y-5">
          
          {/* Section 3: Closing Costs Itemization */}
          <div className="space-y-1.5">
            <div className="border-b border-slate-300 pb-1 flex justify-between items-center">
              <h2 className="text-[11px] font-bold text-slate-900 uppercase">
                3. Provincial Closing Costs & Total Cash Required at Closing
              </h2>
              <span className="text-[9px] font-bold text-slate-700">
                PROVINCE: {inputs.province}
              </span>
            </div>

            <table className="w-full text-[10px] text-left border border-slate-300 border-collapse">
              <thead className="bg-slate-200 text-slate-800 uppercase font-bold text-[9px]">
                <tr>
                  <th className="p-1 border border-slate-300">Cost Item Description</th>
                  <th className="p-1 border border-slate-300">Calculation Basis / Statutory Rule</th>
                  <th className="p-1 border border-slate-300 text-right">Outlay ($)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300 text-slate-800">
                <tr>
                  <td className="p-1 border border-slate-300 font-semibold">Down Payment Savings Applied</td>
                  <td className="p-1 border border-slate-300">Direct Purchase Equity Contribution</td>
                  <td className="p-1 border border-slate-300 text-right font-medium">{formatCAD(closing.downPayment)}</td>
                </tr>
                <tr>
                  <td className="p-1 border border-slate-300 font-semibold">Land Transfer Tax (Gross LTT)</td>
                  <td className="p-1 border border-slate-300">{ltt.description}</td>
                  <td className="p-1 border border-slate-300 text-right font-medium">{formatCAD(closing.grossLtt)}</td>
                </tr>
                <tr>
                  <td className="p-1 border border-slate-300 font-semibold">First-Time Buyer LTT Rebate</td>
                  <td className="p-1 border border-slate-300">{ltt.rebateDescription}</td>
                  <td className="p-1 border border-slate-300 text-right font-medium text-emerald-700">
                    {closing.lttRebate > 0 ? `-${formatCAD(closing.lttRebate)}` : '$0'}
                  </td>
                </tr>
                <tr>
                  <td className="p-1 border border-slate-300 font-semibold">PST on Default Insurance</td>
                  <td className="p-1 border border-slate-300">ON (8%), QC (9.975%), SK (6%) Due in Cash at Closing</td>
                  <td className="p-1 border border-slate-300 text-right font-medium">{formatCAD(closing.pstOnInsurance)}</td>
                </tr>
                <tr>
                  <td className="p-1 border border-slate-300 font-semibold">Legal Fees & Disbursements</td>
                  <td className="p-1 border border-slate-300">Title search, registration, statement of adjustments</td>
                  <td className="p-1 border border-slate-300 text-right font-medium">{formatCAD(closing.legalFees)}</td>
                </tr>
                <tr>
                  <td className="p-1 border border-slate-300 font-semibold">Inspection & Valuation</td>
                  <td className="p-1 border border-slate-300">Certified home inspection & bank appraisal</td>
                  <td className="p-1 border border-slate-300 text-right font-medium">
                    {formatCAD(closing.homeInspection + closing.appraisalFee)}
                  </td>
                </tr>
                <tr>
                  <td className="p-1 border border-slate-300 font-semibold">Title Insurance & Setup</td>
                  <td className="p-1 border border-slate-300">Lender/Homeowner title policy & utility transfer</td>
                  <td className="p-1 border border-slate-300 text-right font-medium">
                    {formatCAD(closing.titleInsurance + closing.estMovingAndSetup)}
                  </td>
                </tr>
                <tr className="bg-slate-100 font-bold">
                  <td className="p-1 border border-slate-300">TOTAL CASH OUTLAY AT CLOSING</td>
                  <td className="p-1 border border-slate-300">Down Payment + Total Closing Fees</td>
                  <td className="p-1 border border-slate-300 text-right text-sky-900 font-black">
                    {formatCAD(closing.totalCashRequired)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section 4: Monthly Cash Flow Analysis */}
          <div className="space-y-1.5">
            <h2 className="text-[11px] font-bold text-slate-900 uppercase border-b border-slate-300 pb-1">
              4. Monthly Household Cash Flow & Surplus Analysis
            </h2>

            <table className="w-full text-[10px] text-left border border-slate-300 border-collapse">
              <thead className="bg-slate-200 text-slate-800 uppercase font-bold text-[9px]">
                <tr>
                  <th className="p-1 border border-slate-300">Income / Outflow Category</th>
                  <th className="p-1 border border-slate-300">Monthly Amount ($)</th>
                  <th className="p-1 border border-slate-300">% of Estimated Take-Home</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300 text-slate-800">
                <tr className="bg-emerald-50 font-semibold">
                  <td className="p-1 border border-slate-300">Estimated Net Take-Home Pay</td>
                  <td className="p-1 border border-slate-300">{formatCAD(cashFlow.estimatedNetTakeHome)}</td>
                  <td className="p-1 border border-slate-300">100.0%</td>
                </tr>
                <tr>
                  <td className="p-1 border border-slate-300">• Mortgage Payment (P+I)</td>
                  <td className="p-1 border border-slate-300">{formatCAD(cashFlow.mortgagePayment)}</td>
                  <td className="p-1 border border-slate-300">
                    {((cashFlow.mortgagePayment / cashFlow.estimatedNetTakeHome) * 100).toFixed(1)}%
                  </td>
                </tr>
                <tr>
                  <td className="p-1 border border-slate-300">• Property Tax, Heating & Insurance</td>
                  <td className="p-1 border border-slate-300">
                    {formatCAD(cashFlow.propertyTax + cashFlow.heatingUtilities + cashFlow.homeInsuranceEst)}
                  </td>
                  <td className="p-1 border border-slate-300">
                    {(((cashFlow.propertyTax + cashFlow.heatingUtilities + cashFlow.homeInsuranceEst) / cashFlow.estimatedNetTakeHome) * 100).toFixed(1)}%
                  </td>
                </tr>
                <tr>
                  <td className="p-1 border border-slate-300">• Condo Fees & Maintenance Reserve</td>
                  <td className="p-1 border border-slate-300">
                    {formatCAD(cashFlow.condoFee + cashFlow.homeMaintenanceReserve)}
                  </td>
                  <td className="p-1 border border-slate-300">
                    {(((cashFlow.condoFee + cashFlow.homeMaintenanceReserve) / cashFlow.estimatedNetTakeHome) * 100).toFixed(1)}%
                  </td>
                </tr>
                <tr>
                  <td className="p-1 border border-slate-300">• Existing Monthly Debts</td>
                  <td className="p-1 border border-slate-300">{formatCAD(cashFlow.debtPayments)}</td>
                  <td className="p-1 border border-slate-300">
                    {((cashFlow.debtPayments / cashFlow.estimatedNetTakeHome) * 100).toFixed(1)}%
                  </td>
                </tr>
                <tr>
                  <td className="p-1 border border-slate-300">• Monthly Living Expenses</td>
                  <td className="p-1 border border-slate-300">{formatCAD(cashFlow.livingExpenses)}</td>
                  <td className="p-1 border border-slate-300">
                    {((cashFlow.livingExpenses / cashFlow.estimatedNetTakeHome) * 100).toFixed(1)}%
                  </td>
                </tr>
                <tr className="bg-sky-50 font-bold">
                  <td className="p-1 border border-slate-300">NET MONTHLY SURPLUS / SAVINGS</td>
                  <td className="p-1 border border-slate-300 text-emerald-800">{formatCAD(cashFlow.netMonthlySurplus)}</td>
                  <td className="p-1 border border-slate-300 text-emerald-800">
                    {((cashFlow.netMonthlySurplus / cashFlow.estimatedNetTakeHome) * 100).toFixed(1)}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section 5: Government Tax Accounts & Checklist Summary */}
          <div className="bg-slate-100 p-2.5 rounded border border-slate-300 space-y-1 text-[10px] text-slate-800">
            <h3 className="font-bold text-slate-900 uppercase text-[10px]">
              5. Canadian First-Time Buyer Tax Programs & Pre-Closing Checklist
            </h3>
            <p className="leading-snug">
              • <strong>First Home Savings Account (FHSA):</strong> Up to $8,000/yr per person ($40,000 lifetime). Tax-deductible contributions with 100% tax-free home withdrawal.<br/>
              • <strong>RRSP Home Buyers' Plan (HBP):</strong> Withdraw up to $60,000 tax-free per person ($120,000 couple) with 15-year repayment window.<br/>
              • <strong>Conditions & Team:</strong> Never waive financing or home inspection conditions. Ensure your independent team (broker, realtor, lawyer, inspector) reviews all contracts before removing conditions.
            </p>
          </div>

        </div>

        {/* Page 2 Footer */}
        <div className="border-t border-slate-300 pt-1.5 flex justify-between text-[9px] text-slate-500">
          <span>FirstHome Canada · First-Time Buyer Financial Blueprint</span>
          <span>Page 2 of 2</span>
        </div>
      </div>

    </div>
  );
};
