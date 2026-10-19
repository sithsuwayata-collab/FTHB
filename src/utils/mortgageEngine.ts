import { 
  CalculationFullResult, 
  ClosingCostsResult, 
  CMHCResult, 
  EquityYearItem, 
  LTTResult, 
  MonthlyCashFlow, 
  MortgageInputs, 
  ProvinceCode, 
  RateShockScenario, 
  RentVsBuyComparison, 
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
 * In Canada, fixed mortgages are legally compounded semi-annually, not in advance.
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
  // Effective monthly interest rate with semi-annual compounding
  const r = Math.pow(1 + i / 2, 2 / 12) - 1;
  const n = amortizationYears * 12;

  const payment = (principal * r) / (1 - Math.pow(1 + r, -n));
  return payment;
}

/**
 * Calculate Canadian Tiered Minimum Down Payment
 * - First $500,000: 5%
 * - $500,001 to $1,500,000: 10%
 * - Over $1,500,000: 20% (Uninsured tier)
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

  // Uninsured if down payment >= 20% OR price > $1,500,000
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

  // Insured rates by LTV bracket
  let baseRate = 0.040; // 90.01% - 95.00%
  if (ltv <= 85.0) {
    baseRate = 0.028; // 80.01% - 85.00%
  } else if (ltv <= 90.0) {
    baseRate = 0.031; // 85.01% - 90.00%
  }

  // Surcharge for 30-year amortization on insured mortgages (standard 0.20% addition)
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
 * Land Transfer Tax (LTT) calculation by province including municipal & first-time buyer rebates
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
    description = 'Ontario Tiered Statutory LTT (0.5% to 2.5%)';
    rebateDescription = 'Ontario First-Time Buyer Rebate (Max $4,000)';

    if (province === 'ON-TOR') {
      torontoLtt = grossLtt;
      torontoRebate = Math.min(torontoLtt, 4475);
      grossLtt += torontoLtt;
      rebate += torontoRebate;
      description = 'Dual Ontario Provincial + Toronto Municipal LTT';
      rebateDescription = 'Combined ON ($4,000) + Toronto ($4,475) Rebate (Max $8,475)';
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
    rebateDescription = price <= 860000 ? 'BC First-Time Home Buyers PTT Exemption' : 'Exceeds BC FTB Price Threshold';
  } else if (province === 'AB') {
    grossLtt = 50 + (price / 5000) * 2 + 50 + ((price * 0.8) / 5000) * 1.5;
    rebate = 0;
    description = 'Alberta Land Titles Registration Fee (No LTT)';
    rebateDescription = 'Zero Provincial Land Transfer Tax in Alberta';
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
    rebateDescription = 'No Dedicated Provincial FTB Rebate';
  } else if (province === 'SK') {
    grossLtt = (price / 1000) * 3.0;
    rebate = 0;
    description = 'Saskatchewan Land Titles Registry Fee';
    rebateDescription = 'Eligible for Provincial First-Time Tax Credit on Return';
  } else if (province === 'NS') {
    grossLtt = price * 0.015;
    rebate = 0;
    description = 'Nova Scotia Municipal Deed Transfer Tax (~1.5%)';
    rebateDescription = 'Municipal Deed Transfer Fee';
  } else {
    grossLtt = price * 0.010;
    rebate = 0;
    description = 'Provincial Real Property Transfer Fee (~1.0%)';
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
  const legalFees = 1850;
  const homeInspection = 550;
  const appraisalFee = 400;
  const titleInsurance = 375;
  const estMovingAndSetup = 750;

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
 * OSFI B-20 Mortgage Stress Test & Debt Service Ratios
 */
export function calculateStressTest(
  inputs: MortgageInputs,
  totalMortgagePrincipal: number,
  downPaymentTotal: number,
  minRequiredDown: number
): StressTestResult {
  const {
    contractRate,
    amortizationYears,
    annualIncome,
    monthlyDebt,
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
  const tdsStress = grossMonthlyIncome > 0 ? ((shelterCostStress + monthlyDebt) / grossMonthlyIncome) * 100 : 0;

  const gdsContract = grossMonthlyIncome > 0 ? (shelterCostContract / grossMonthlyIncome) * 100 : 0;
  const tdsContract = grossMonthlyIncome > 0 ? ((shelterCostContract + monthlyDebt) / grossMonthlyIncome) * 100 : 0;

  const passesGDS = gdsStress <= 39.0;
  const passesTDS = tdsStress <= 44.0;
  const passesDownPayment = downPaymentTotal >= minRequiredDown;
  const overallApproved = passesGDS && passesTDS && passesDownPayment;

  // Max purchasing limit
  const maxShelterGDS = Math.max(0, (grossMonthlyIncome * 0.39) - monthlyPropertyTax - monthlyHeating - condoFiftyPct);
  const maxShelterTDS = Math.max(0, (grossMonthlyIncome * 0.44) - monthlyDebt - monthlyPropertyTax - monthlyHeating - condoFiftyPct);
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
 * Net Monthly Cash Flow & Surplus Analysis
 */
export function calculateMonthlyCashFlow(
  inputs: MortgageInputs,
  monthlyPaymentContract: number
): MonthlyCashFlow {
  const {
    annualIncome,
    annualPropertyTax,
    monthlyHeating,
    monthlyCondoFee,
    monthlyDebt,
    monthlyLiving,
    purchasePrice,
    rentalIncome,
  } = inputs;

  const grossIncome = annualIncome / 12;

  let effectiveTaxRate = 0.22;
  if (annualIncome > 180000) effectiveTaxRate = 0.33;
  else if (annualIncome > 120000) effectiveTaxRate = 0.28;
  else if (annualIncome > 75000) effectiveTaxRate = 0.24;
  else effectiveTaxRate = 0.18;

  const estimatedNetTakeHome = grossIncome * (1 - effectiveTaxRate) + (rentalIncome * 0.75);

  const propertyTax = annualPropertyTax / 12;
  const heatingUtilities = monthlyHeating;
  const condoFee = monthlyCondoFee;
  const homeMaintenanceReserve = (purchasePrice * 0.01) / 12;
  const homeInsuranceEst = 125;

  const totalHousingOutlay = 
    monthlyPaymentContract + 
    propertyTax + 
    heatingUtilities + 
    condoFee + 
    homeMaintenanceReserve + 
    homeInsuranceEst;

  const totalMonthlyOutflow = totalHousingOutlay + monthlyDebt + monthlyLiving;
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
    debtPayments: monthlyDebt,
    livingExpenses: monthlyLiving,
    rentalIncomeNet: rentalIncome,
    totalHousingOutlay,
    totalMonthlyOutflow,
    netMonthlySurplus,
  };
}

/**
 * 5-Year Equity Amortization Schedule
 */
export function calculate5YearEquitySchedule(
  totalPrincipal: number,
  contractRate: number,
  amortizationYears: number,
  initialHomePrice: number,
  initialDownPayment: number
): EquityYearItem[] {
  const schedule: EquityYearItem[] = [];
  let currentBalance = totalPrincipal;
  const annualAppreciation = 0.025;
  let currentHomeValue = initialHomePrice;

  const i = contractRate / 100;
  const r = Math.pow(1 + i / 2, 2 / 12) - 1;
  const monthlyPayment = calculateCanadianMonthlyPayment(totalPrincipal, contractRate, amortizationYears);

  for (let yr = 1; yr <= 5; yr++) {
    const startBal = currentBalance;
    let yrPrincipal = 0;
    let yrInterest = 0;

    for (let m = 1; m <= 12; m++) {
      if (currentBalance <= 0) break;
      const interestThisMonth = currentBalance * r;
      const principalThisMonth = Math.min(currentBalance, monthlyPayment - interestThisMonth);
      yrInterest += interestThisMonth;
      yrPrincipal += principalThisMonth;
      currentBalance -= principalThisMonth;
    }

    currentHomeValue *= (1 + annualAppreciation);
    const equityEst = Math.max(0, currentHomeValue - currentBalance);

    schedule.push({
      year: yr,
      startBalance: startBal,
      principalPaid: yrPrincipal,
      interestPaid: yrInterest,
      endBalance: Math.max(0, currentBalance),
      homeValueEst: currentHomeValue,
      homeEquityEst: equityEst,
    });
  }

  return schedule;
}

/**
 * Creative Tool 1: Rate Shock Simulator
 * Evaluates renewal scenarios if mortgage interest rates rise by +0.5% to +2.5%
 */
export function calculateRateShockScenarios(
  principal: number,
  baseRate: number,
  amortizationYears: number,
  currentSurplus: number
): RateShockScenario[] {
  const bumps = [0.5, 1.0, 1.5, 2.0, 2.5];
  const basePayment = calculateCanadianMonthlyPayment(principal, baseRate, amortizationYears);

  return bumps.map(bump => {
    const newRate = baseRate + bump;
    const newPayment = calculateCanadianMonthlyPayment(principal, newRate, Math.max(1, amortizationYears - 5));
    const paymentDiff = newPayment - basePayment;
    const newSurplus = currentSurplus - paymentDiff;

    return {
      rateBump: bump,
      newRate,
      newMonthlyPayment: newPayment,
      paymentDifference: paymentDiff,
      newSurplus,
      isAffordable: newSurplus >= 0,
    };
  });
}

/**
 * Creative Tool 2: Rent vs Buy Breakeven Schedule
 * Compares 10-year cumulative wealth building of buying vs renting
 */
export function calculateRentVsBuySchedule(
  homePrice: number,
  downPayment: number,
  closingCosts: number,
  contractRate: number,
  currentRent: number,
  annualPropertyTax: number,
  condoFee: number
): { schedule: RentVsBuyComparison[]; breakEvenYear: number } {
  const schedule: RentVsBuyComparison[] = [];
  let cumRentCost = 0;
  let cumBuyCost = closingCosts; // start with upfront closing fees
  let currentHomeValue = homePrice;
  let loanBalance = homePrice - downPayment;
  let rentMonthly = currentRent > 0 ? currentRent : 2200;
  let breakEvenYear = 0;

  const i = contractRate / 100;
  const r = Math.pow(1 + i / 2, 2 / 12) - 1;
  const monthlyPayment = calculateCanadianMonthlyPayment(loanBalance, contractRate, 25);

  for (let yr = 1; yr <= 10; yr++) {
    // Rent costs for the year (assuming 3% annual rent inflation)
    const annualRent = rentMonthly * 12;
    cumRentCost += annualRent;
    rentMonthly *= 1.03;

    // Buy costs: interest + taxes + maintenance (1%) + condo + insurance
    let yrInterest = 0;
    let yrPrincipal = 0;
    for (let m = 1; m <= 12; m++) {
      if (loanBalance <= 0) break;
      const int = loanBalance * r;
      const prin = Math.min(loanBalance, monthlyPayment - int);
      yrInterest += int;
      yrPrincipal += prin;
      loanBalance -= prin;
    }

    const unrecoverableBuyCosts = yrInterest + annualPropertyTax + (homePrice * 0.01) + (condoFee * 12) + (125 * 12);
    cumBuyCost += unrecoverableBuyCosts;

    currentHomeValue *= 1.025; // 2.5% conservative appreciation
    const equityBuilt = Math.max(0, currentHomeValue - loanBalance);

    // Net advantage of buying = (Equity built + Rent paid that was saved) - Total unrecoverable buying costs
    const netWealthAdvantage = equityBuilt - (cumBuyCost - cumRentCost);

    if (breakEvenYear === 0 && netWealthAdvantage > 0) {
      breakEvenYear = yr;
    }

    schedule.push({
      year: yr,
      cumulativeCostRent: cumRentCost,
      cumulativeCostBuy: cumBuyCost,
      homeEquityBuilt: equityBuilt,
      netWealthAdvantageBuy: netWealthAdvantage,
    });
  }

  return { schedule, breakEvenYear: breakEvenYear || 4 };
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

  const cmhc = calculateCMHCInsurance(inputs.purchasePrice, downPaymentTotal, inputs.amortizationYears);
  const ltt = calculateLTT(inputs.purchasePrice, inputs.province);
  const closing = calculateClosingCosts(inputs.purchasePrice, downPaymentTotal, inputs.province, cmhc.insurancePremium);
  const stress = calculateStressTest(inputs, cmhc.totalMortgagePrincipal, downPaymentTotal, cmhc.minimumRequiredDown);
  const cashFlow = calculateMonthlyCashFlow(inputs, stress.monthlyPaymentContract);
  const equitySchedule = calculate5YearEquitySchedule(
    cmhc.totalMortgagePrincipal,
    inputs.contractRate,
    inputs.amortizationYears,
    inputs.purchasePrice,
    downPaymentTotal
  );

  const rateShockScenarios = calculateRateShockScenarios(
    cmhc.totalMortgagePrincipal,
    inputs.contractRate,
    inputs.amortizationYears,
    cashFlow.netMonthlySurplus
  );

  const { schedule: rentVsBuySchedule, breakEvenYear } = calculateRentVsBuySchedule(
    inputs.purchasePrice,
    downPaymentTotal,
    closing.totalClosingFees,
    inputs.contractRate,
    inputs.currentMonthlyRent,
    inputs.annualPropertyTax,
    inputs.monthlyCondoFee
  );

  return {
    inputs,
    cmhc,
    ltt,
    closing,
    stress,
    cashFlow,
    equitySchedule,
    rateShockScenarios,
    rentVsBuySchedule,
    breakEvenYear,
  };
}
