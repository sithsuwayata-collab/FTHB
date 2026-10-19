import { 
  ApprovalProbability,
  CalculationFullResult, 
  ClosingCostsResult, 
  CMHCResult, 
  LTTResult, 
  MonthlyCashFlow, 
  MortgageInputs, 
  ProvinceCode, 
  StressTestResult 
} from '../types';
import { PROVINCES_DATA } from '../data/provinces';

/**
 * Format currency in CAD ($)
 */
export function formatCAD(val: number, hideDecimals = true): string {
  if (isNaN(val)) return '$0';
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    maximumFractionDigits: hideDecimals ? 0 : 2,
    minimumFractionDigits: hideDecimals ? 0 : 2,
  }).format(val);
}

/**
 * Canadian semi-annual compounding mortgage payment formula.
 */
export function calculateCanadianMonthlyPayment(
  principal: number,
  annualNominalRatePct: number,
  amortizationYears: number
): number {
  if (principal <= 0) return 0;
  if (annualNominalRatePct <= 0) {
    return principal / (amortizationYears * 12);
  }

  const i = annualNominalRatePct / 100;
  const r = Math.pow(1 + i / 2, 2 / 12) - 1;
  const n = amortizationYears * 12;

  return (principal * r) / (1 - Math.pow(1 + r, -n));
}

/**
 * Calculate Canadian Tiered Minimum Down Payment
 */
export function calculateMinimumDownPayment(price: number): {
  minDown: number;
  minPercent: number;
  bracketBreakdown: {
    first500kMin: number;
    nextTierMin: number;
    aboveTierMin: number;
  };
} {
  if (price <= 0) {
    return {
      minDown: 0,
      minPercent: 0,
      bracketBreakdown: { first500kMin: 0, nextTierMin: 0, aboveTierMin: 0 },
    };
  }

  let b1 = 0;
  let b2 = 0;
  let b3 = 0;

  if (price <= 500000) {
    b1 = price * 0.05;
  } else if (price <= 1500000) {
    b1 = 500000 * 0.05; // $25,000
    b2 = (price - 500000) * 0.10;
  } else {
    b1 = 500000 * 0.05;
    b2 = 1000000 * 0.10;
    b3 = (price - 1500000) * 0.20;
    const flat20 = price * 0.20;
    const tiered = b1 + b2 + b3;
    const finalMin = Math.max(flat20, tiered);
    return {
      minDown: finalMin,
      minPercent: (finalMin / price) * 100,
      bracketBreakdown: { first500kMin: 25000, nextTierMin: 100000, aboveTierMin: finalMin - 125000 },
    };
  }

  const totalMin = b1 + b2 + b3;
  return {
    minDown: totalMin,
    minPercent: (totalMin / price) * 100,
    bracketBreakdown: { first500kMin: b1, nextTierMin: b2, aboveTierMin: b3 },
  };
}

/**
 * CMHC / Sagen / Canada Guaranty Default Insurance Calculation
 */
export function calculateCMHCInsurance(
  price: number,
  downPayment: number,
  amortizationYears = 25
): CMHCResult {
  const { minDown, minPercent, bracketBreakdown } = calculateMinimumDownPayment(price);
  const downPaymentPercent = price > 0 ? (downPayment / price) * 100 : 0;
  const ltv = price > 0 ? ((price - downPayment) / price) * 100 : 0;

  if (downPaymentPercent >= 20 || ltv <= 80 || price > 1500000) {
    return {
      downPaymentTotal: downPayment,
      downPaymentPercent,
      minimumRequiredDown: minDown,
      minimumRequiredPercent: minPercent,
      isInsured: false,
      ltv,
      insuranceRate: 0,
      insurancePremium: 0,
      totalMortgagePrincipal: Math.max(0, price - downPayment),
      bracketBreakdown,
    };
  }

  let baseRate = 0.040;
  if (ltv <= 85.0) {
    baseRate = 0.028;
  } else if (ltv <= 90.0) {
    baseRate = 0.031;
  }

  if (amortizationYears > 25) {
    baseRate += 0.0020;
  }

  const loanAmount = Math.max(0, price - downPayment);
  const premium = loanAmount * baseRate;
  const totalPrincipal = loanAmount + premium;

  return {
    downPaymentTotal: downPayment,
    downPaymentPercent,
    minimumRequiredDown: minDown,
    minimumRequiredPercent: minPercent,
    isInsured: true,
    ltv,
    insuranceRate: baseRate,
    insurancePremium: premium,
    totalMortgagePrincipal: totalPrincipal,
    bracketBreakdown,
  };
}

/**
 * Land Transfer Tax (LTT) calculation by province
 */
export function calculateLTT(price: number, province: ProvinceCode): LTTResult {
  let grossLtt = 0;
  let rebate = 0;
  let torontoLtt = 0;
  let torontoRebate = 0;
  let description = '';
  let rebateDescription = '';

  if (province === 'ON' || province === 'ON-TOR') {
    if (price > 0) grossLtt += Math.min(price, 55000) * 0.005;
    if (price > 55000) grossLtt += (Math.min(price, 250000) - 55000) * 0.010;
    if (price > 250000) grossLtt += (Math.min(price, 400000) - 250000) * 0.015;
    if (price > 400000) grossLtt += (Math.min(price, 2000000) - 400000) * 0.020;
    if (price > 2000000) grossLtt += (price - 2000000) * 0.025;

    rebate = Math.min(grossLtt, 4000);
    description = 'Ontario Tiered LTT (0.5%–2.5%)';
    rebateDescription = 'ON First-Time Rebate (Max $4,000)';

    if (province === 'ON-TOR') {
      torontoLtt = grossLtt;
      torontoRebate = Math.min(torontoLtt, 4475);
      grossLtt += torontoLtt;
      rebate += torontoRebate;
      description = 'Dual Ontario + Toronto Municipal LTT';
      rebateDescription = 'Combined ON ($4k) + Toronto ($4.475k) Rebates';
    }
  } else if (province === 'BC') {
    if (price > 0) grossLtt += Math.min(price, 200000) * 0.01;
    if (price > 200000) grossLtt += (Math.min(price, 2000000) - 200000) * 0.02;
    if (price > 2000000) grossLtt += (Math.min(price, 3000000) - 2000000) * 0.03;
    if (price > 3000000) grossLtt += (price - 3000000) * 0.05;

    if (price <= 500000) {
      rebate = grossLtt;
    } else if (price <= 860000) {
      const phaseOutFactor = (860000 - price) / 360000;
      rebate = Math.max(0, grossLtt * Math.max(0, phaseOutFactor));
    }
    description = 'BC Property Transfer Tax (PTT)';
    rebateDescription = price <= 860000 ? 'BC First-Time Buyer Exemption' : 'Exceeds Exemption Limit';
  } else if (province === 'AB') {
    grossLtt = 50 + (price / 5000) * 2 + 50 + ((price * 0.8) / 5000) * 1.5;
    rebate = 0;
    description = 'Alberta Land Titles Registration Fee';
    rebateDescription = 'No Land Transfer Tax in Alberta';
  } else if (province === 'QC') {
    if (price > 0) grossLtt += Math.min(price, 58600) * 0.005;
    if (price > 58600) grossLtt += (Math.min(price, 292800) - 58600) * 0.010;
    if (price > 292800) grossLtt += (Math.min(price, 500000) - 292800) * 0.015;
    if (price > 500000) grossLtt += (price - 500000) * 0.020;
    rebate = 0;
    description = 'Quebec Welcome Tax (Droit de mutation)';
    rebateDescription = 'Standard Municipal Transfer Scale';
  } else if (province === 'MB') {
    if (price > 30000) grossLtt += (Math.min(price, 90000) - 30000) * 0.005;
    if (price > 90000) grossLtt += (Math.min(price, 150000) - 90000) * 0.010;
    if (price > 150000) grossLtt += (Math.min(price, 200000) - 150000) * 0.015;
    if (price > 200000) grossLtt += (price - 200000) * 0.020;
    rebate = 0;
    description = 'Manitoba Land Transfer Tax Scale';
    rebateDescription = 'Standard Provincial Scale';
  } else if (province === 'SK') {
    grossLtt = (price / 1000) * 3.0;
    rebate = 0;
    description = 'Saskatchewan Land Titles Fee';
    rebateDescription = 'Provincial Tax Credit on Return';
  } else {
    grossLtt = price * 0.012;
    rebate = 0;
    description = 'Provincial Transfer Fee (~1.2%)';
    rebateDescription = 'Standard Provincial Registration';
  }

  const netLtt = Math.max(0, grossLtt - rebate);

  return {
    grossLtt,
    rebate,
    netLtt,
    torontoLtt,
    torontoRebate,
    description,
    rebateDescription,
  };
}

/**
 * Calculate total closing costs
 */
export function calculateClosingCosts(
  price: number,
  downPayment: number,
  province: ProvinceCode,
  cmhcPremium: number
): ClosingCostsResult {
  const lttData = calculateLTT(price, province);
  const provInfo = PROVINCES_DATA[province];

  const pstOnInsurance = cmhcPremium * (provInfo?.pstOnCMHC || 0);
  const legalFees = 1800;
  const homeInspection = 500;
  const appraisalFee = 400;
  const titleInsurance = 350;
  const estMovingAndSetup = 650;

  const totalClosingFees = 
    lttData.netLtt + 
    pstOnInsurance + 
    legalFees + 
    homeInspection + 
    appraisalFee + 
    titleInsurance + 
    estMovingAndSetup;

  const totalCashRequired = downPayment + totalClosingFees;

  return {
    downPayment,
    netLtt: lttData.netLtt,
    grossLtt: lttData.grossLtt,
    lttRebate: lttData.rebate,
    pstOnInsurance,
    legalFees,
    homeInspection,
    appraisalFee,
    titleInsurance,
    estMovingAndSetup,
    totalClosingFees,
    totalCashRequired,
  };
}

/**
 * OSFI B-20 Stress Test calculation
 */
export function calculateStressTest(
  inputs: MortgageInputs,
  totalMortgagePrincipal: number,
  downPaymentTotal: number,
  minRequiredDown: number,
  contractualDebts: number
): StressTestResult {
  const {
    contractRate,
    amortizationYears,
    annualIncome,
    annualPropertyTax,
    monthlyHeating,
    monthlyCondoFee,
    rentalIncome,
    rentalOffsetPct,
    purchasePrice,
  } = inputs;

  const stressRate = Math.max(contractRate + 2.00, 5.25);

  const monthlyPaymentContract = calculateCanadianMonthlyPayment(
    totalMortgagePrincipal,
    contractRate,
    amortizationYears
  );

  const monthlyPaymentStress = calculateCanadianMonthlyPayment(
    totalMortgagePrincipal,
    stressRate,
    amortizationYears
  );

  const monthlyRentalAdd = rentalIncome * (rentalOffsetPct / 100);
  const grossMonthlyIncome = (annualIncome / 12) + monthlyRentalAdd;

  const monthlyPropertyTax = annualPropertyTax / 12;
  const condoFiftyPct = monthlyCondoFee * 0.5;

  const shelterCostStress = monthlyPaymentStress + monthlyPropertyTax + monthlyHeating + condoFiftyPct;
  const shelterCostContract = monthlyPaymentContract + monthlyPropertyTax + monthlyHeating + condoFiftyPct;

  const gdsStress = grossMonthlyIncome > 0 ? (shelterCostStress / grossMonthlyIncome) * 100 : 0;
  const tdsStress = grossMonthlyIncome > 0 ? ((shelterCostStress + contractualDebts) / grossMonthlyIncome) * 100 : 0;

  const gdsContract = grossMonthlyIncome > 0 ? (shelterCostContract / grossMonthlyIncome) * 100 : 0;
  const tdsContract = grossMonthlyIncome > 0 ? ((shelterCostContract + contractualDebts) / grossMonthlyIncome) * 100 : 0;

  const passesGDS = gdsStress <= 39.0;
  const passesTDS = tdsStress <= 44.0;
  const passesDownPayment = downPaymentTotal >= minRequiredDown;
  const overallApproved = passesGDS && passesTDS && passesDownPayment;

  // Max purchasing limit
  const maxShelterGDS = Math.max(0, (grossMonthlyIncome * 0.39) - monthlyPropertyTax - monthlyHeating - condoFiftyPct);
  const maxShelterTDS = Math.max(0, (grossMonthlyIncome * 0.44) - contractualDebts - monthlyPropertyTax - monthlyHeating - condoFiftyPct);
  const maxAllowablePayment = Math.min(maxShelterGDS, maxShelterTDS);

  const iStress = stressRate / 100;
  const rStress = Math.pow(1 + iStress / 2, 2 / 12) - 1;
  const n = amortizationYears * 12;

  let maxAffordableLoan = 0;
  if (rStress > 0 && maxAllowablePayment > 0) {
    maxAffordableLoan = (maxAllowablePayment * (1 - Math.pow(1 + rStress, -n))) / rStress;
  }

  const maxAffordablePrice = maxAffordableLoan + downPaymentTotal;
  const headroom = maxAffordablePrice - purchasePrice;

  return {
    contractRate,
    stressRate,
    monthlyPaymentContract,
    monthlyPaymentStress,
    grossMonthlyIncome,
    gdsContract,
    tdsContract,
    gdsStress,
    tdsStress,
    passesGDS,
    passesTDS,
    passesDownPayment,
    overallApproved,
    maxAffordablePrice,
    headroom,
  };
}

/**
 * Net Monthly Cash Flow & Real Surplus Analysis
 */
export function calculateMonthlyCashFlow(
  inputs: MortgageInputs,
  monthlyPaymentContract: number,
  contractualDebts: number,
  livingExpenses: number
): MonthlyCashFlow {
  const {
    annualIncome,
    annualPropertyTax,
    monthlyHeating,
    monthlyCondoFee,
    purchasePrice,
    rentalIncome,
  } = inputs;

  const grossIncome = annualIncome / 12;

  let effectiveTaxRate = 0.22;
  if (annualIncome > 180000) effectiveTaxRate = 0.32;
  else if (annualIncome > 120000) effectiveTaxRate = 0.27;
  else if (annualIncome > 75000) effectiveTaxRate = 0.23;
  else effectiveTaxRate = 0.17;

  const estimatedNetTakeHome = grossIncome * (1 - effectiveTaxRate) + (rentalIncome * 0.75);

  const propertyTax = annualPropertyTax / 12;
  const heatingUtilities = monthlyHeating;
  const condoFee = monthlyCondoFee;
  const homeMaintenanceReserve = (purchasePrice * 0.01) / 12;
  const homeInsuranceEst = 120;

  const totalHousingOutlay = 
    monthlyPaymentContract + 
    propertyTax + 
    heatingUtilities + 
    condoFee + 
    homeMaintenanceReserve + 
    homeInsuranceEst;

  const totalMonthlyOutflow = totalHousingOutlay + contractualDebts + livingExpenses;
  const netMonthlySurplus = estimatedNetTakeHome - totalMonthlyOutflow;

  return {
    grossIncome,
    estimatedNetTakeHome,
    mortgagePayment: monthlyPaymentContract,
    propertyTax,
    heatingUtilities,
    condoFee,
    homeMaintenanceReserve,
    homeInsuranceEst,
    totalContractualDebts: contractualDebts,
    totalLivingExpenses: livingExpenses,
    rentalIncomeNet: rentalIncome,
    totalHousingOutlay,
    totalMonthlyOutflow,
    netMonthlySurplus,
  };
}

/**
 * Intelligent Mortgage Approval Probability Scorer
 * Evaluates the real probability of obtaining an A-lender mortgage approval.
 */
export function calculateApprovalProbability(
  stress: StressTestResult,
  cmhc: CMHCResult,
  cashFlow: MonthlyCashFlow,
  inputs: MortgageInputs
): ApprovalProbability {
  const strengths: string[] = [];
  const blockers: string[] = [];
  const smartTips: string[] = [];

  // 1. Down Payment Score (25 pts)
  let downPaymentScore = 0;
  const downPayment = cmhc.downPaymentTotal;
  const minDown = cmhc.minimumRequiredDown;

  if (downPayment >= minDown) {
    if (cmhc.downPaymentPercent >= 20) {
      downPaymentScore = 25;
      strengths.push(`20%+ down payment (${cmhc.downPaymentPercent.toFixed(1)}%) waives CMHC insurance and saves thousands.`);
    } else {
      downPaymentScore = 22;
      strengths.push(`Meets statutory minimum down payment (${cmhc.downPaymentPercent.toFixed(1)}% vs ${cmhc.minimumRequiredPercent.toFixed(1)}% req).`);
    }
  } else {
    const shortfall = minDown - downPayment;
    downPaymentScore = Math.max(0, Math.round((downPayment / minDown) * 20));
    blockers.push(`Down payment shortfall of ${formatCAD(shortfall)} to reach minimum statutory 5% tier.`);
    smartTips.push(`Add ${formatCAD(shortfall)} from FHSA, RRSP, or family gift to unlock basic eligibility.`);
  }

  // 2. GDS Score (25 pts)
  let gdsScore = 0;
  if (stress.gdsStress <= 32.0) {
    gdsScore = 25;
    strengths.push(`Exceptional GDS ratio (${stress.gdsStress.toFixed(1)}% vs 39.0% cap) gives generous borrowing room.`);
  } else if (stress.gdsStress <= 39.0) {
    gdsScore = Math.round(25 - ((stress.gdsStress - 32.0) / 7.0) * 8);
    strengths.push(`GDS ratio is within legal Canadian limit (${stress.gdsStress.toFixed(1)}% ≤ 39.0%).`);
  } else {
    gdsScore = Math.max(0, Math.round(15 - (stress.gdsStress - 39.0) * 2));
    blockers.push(`GDS ratio (${stress.gdsStress.toFixed(1)}%) exceeds the 39.0% legal OSFI stress ceiling.`);
    smartTips.push(`Consider a home priced around ${formatCAD(Math.max(0, stress.maxAffordablePrice))} to bring GDS under 39%.`);
  }

  // 3. TDS Score (25 pts)
  let tdsScore = 0;
  if (stress.tdsStress <= 36.0) {
    tdsScore = 25;
    strengths.push(`Low consumer debts keep your TDS at an impressive ${stress.tdsStress.toFixed(1)}% (max 44.0%).`);
  } else if (stress.tdsStress <= 44.0) {
    tdsScore = Math.round(25 - ((stress.tdsStress - 36.0) / 8.0) * 8);
    strengths.push(`TDS ratio clears underwriting standards (${stress.tdsStress.toFixed(1)}% ≤ 44.0%).`);
  } else {
    tdsScore = Math.max(0, Math.round(15 - (stress.tdsStress - 44.0) * 2));
    blockers.push(`TDS ratio (${stress.tdsStress.toFixed(1)}%) exceeds the 44.0% legal cap due to debts.`);
    if (inputs.expenses.carPayment > 0) {
      smartTips.push(`Paying off or refinancing your ${formatCAD(inputs.expenses.carPayment)}/mo car loan adds ~$${Math.round(inputs.expenses.carPayment * 160 / 1000)}k to borrowing power.`);
    }
  }

  // 4. Practical Cash Flow Score (15 pts)
  let cashFlowScore = 0;
  if (cashFlow.netMonthlySurplus >= 1000) {
    cashFlowScore = 15;
    strengths.push(`Healthy monthly buffer of ${formatCAD(cashFlow.netMonthlySurplus)} remaining after groceries, bills & living.`);
  } else if (cashFlow.netMonthlySurplus >= 250) {
    cashFlowScore = 11;
    strengths.push(`Positive monthly cash cushion of ${formatCAD(cashFlow.netMonthlySurplus)}/mo.`);
  } else if (cashFlow.netMonthlySurplus >= 0) {
    cashFlowScore = 7;
    smartTips.push(`Budget is tight (${formatCAD(cashFlow.netMonthlySurplus)}/mo surplus). Keep 3 months of emergency funds ready.`);
  } else {
    cashFlowScore = 2;
    blockers.push(`Negative cash flow (${formatCAD(cashFlow.netMonthlySurplus)}/mo). Total real monthly expenses exceed net income.`);
    smartTips.push(`Review non-essential groceries and lifestyle costs to prevent becoming house-poor.`);
  }

  // 5. Credit Tier Score (10 pts)
  let creditScore = 0;
  if (inputs.creditTier === 'excellent') {
    creditScore = 10;
    strengths.push('Excellent credit score (720+) qualifies you for lowest A-lender interest rates.');
  } else if (inputs.creditTier === 'good') {
    creditScore = 8;
    strengths.push('Good credit score (680–719) readily approved by major Canadian chartered banks.');
  } else if (inputs.creditTier === 'fair') {
    creditScore = 5;
    blockers.push('Fair credit (600–679) may require higher down payment or B-lender rate surcharges.');
    smartTips.push('Keep credit card balances under 30% of limit for 60 days to boost your score above 680.');
  } else {
    creditScore = 2;
    blockers.push('Credit score below 600 will require a co-signer or specialized alternative lender.');
  }

  // Total Score (0-100)
  const totalRaw = downPaymentScore + gdsScore + tdsScore + cashFlowScore + creditScore;
  let finalScore = Math.min(99, Math.max(10, totalRaw));

  // Hard caps if failing critical statutory criteria
  if (downPayment < minDown) {
    finalScore = Math.min(38, finalScore);
  } else if (!stress.passesGDS || !stress.passesTDS) {
    finalScore = Math.min(54, finalScore);
  }

  let rating: ApprovalProbability['rating'] = 'Very High';
  let headline = 'Excellent Approval Probability';
  let colorClass = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
  let barColor = 'from-emerald-500 to-teal-400';

  if (finalScore >= 85) {
    rating = 'Very High';
    headline = 'Strong Pre-Approval Probability';
    colorClass = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    barColor = 'from-emerald-500 to-emerald-400';
  } else if (finalScore >= 70) {
    rating = 'High';
    headline = 'Solid Approval Odds with Tier-1 Lenders';
    colorClass = 'text-sky-400 bg-sky-500/10 border-sky-500/30';
    barColor = 'from-sky-500 to-teal-400';
  } else if (finalScore >= 50) {
    rating = 'Moderate';
    headline = 'Conditional Approval (Minor Adjustments Recommended)';
    colorClass = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    barColor = 'from-amber-500 to-amber-400';
  } else {
    rating = downPayment < minDown ? 'Critical Shortfall' : 'Low';
    headline = 'Approval Blocked: Immediate Adjustments Needed';
    colorClass = 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    barColor = 'from-rose-500 to-rose-400';
  }

  return {
    score: finalScore,
    rating,
    headline,
    colorClass,
    barColor,
    gdsScore,
    tdsScore,
    downPaymentScore,
    cashFlowScore,
    creditScore,
    strengths,
    blockers,
    smartTips,
  };
}

/**
 * Master calculation runner
 */
export function runFullEngine(inputs: MortgageInputs): CalculationFullResult {
  const downPaymentTotal = 
    inputs.downPaymentSources.fhsa + 
    inputs.downPaymentSources.hbp + 
    inputs.downPaymentSources.savings + 
    inputs.downPaymentSources.familyGift;

  const contractualDebts = inputs.expenses.carPayment + inputs.expenses.creditCardsLoans;
  const livingExpenses = 
    inputs.expenses.groceriesFood + 
    inputs.expenses.childcareFamily + 
    inputs.expenses.phoneInternet + 
    inputs.expenses.personalMisc;

  const cmhc = calculateCMHCInsurance(inputs.purchasePrice, downPaymentTotal, inputs.amortizationYears);
  const ltt = calculateLTT(inputs.purchasePrice, inputs.province);
  const closing = calculateClosingCosts(inputs.purchasePrice, downPaymentTotal, inputs.province, cmhc.insurancePremium);
  const stress = calculateStressTest(inputs, cmhc.totalMortgagePrincipal, downPaymentTotal, cmhc.minimumRequiredDown, contractualDebts);
  const cashFlow = calculateMonthlyCashFlow(inputs, stress.monthlyPaymentContract, contractualDebts, livingExpenses);
  const approval = calculateApprovalProbability(stress, cmhc, cashFlow, inputs);

  return {
    inputs,
    cmhc,
    ltt,
    closing,
    stress,
    cashFlow,
    approval,
  };
}
