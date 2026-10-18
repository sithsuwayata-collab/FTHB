export type ProvinceCode = 
  | 'ON' 
  | 'ON-TOR' 
  | 'BC' 
  | 'AB' 
  | 'QC' 
  | 'MB' 
  | 'SK' 
  | 'NS' 
  | 'NB' 
  | 'PE' 
  | 'NL';

export interface ProvinceInfo {
  code: ProvinceCode;
  name: string;
  shortName: string;
  hasLTT: boolean;
  lttName: string;
  firstTimeRebateName: string;
  defaultPropTaxRate: number;
  pstOnCMHC: number;
  popularCities: string[];
  keyHighlight: string;
}

export interface DownPaymentSources {
  fhsa: number;
  hbp: number;
  savings: number;
  familyGift: number;
}

export interface MortgageInputs {
  purchasePrice: number;
  downPaymentSources: DownPaymentSources;
  annualIncome: number;
  monthlyDebt: number;
  monthlyLiving: number;
  contractRate: number;
  amortizationYears: number; // 25 or 30
  province: ProvinceCode;
  annualPropertyTax: number;
  monthlyCondoFee: number;
  monthlyHeating: number;
  rentalIncome: number;
  rentalOffsetPct: number;
  // Rent vs Buy comparison input
  currentMonthlyRent: number;
}

export interface CMHCResult {
  downPaymentTotal: number;
  downPaymentPercent: number;
  minimumRequiredDown: number;
  minimumRequiredPercent: number;
  isInsured: boolean;
  ltv: number;
  insuranceRate: number;
  insurancePremium: number;
  totalMortgagePrincipal: number;
  bracketBreakdown: {
    first500kMin: number;
    nextTierMin: number;
    aboveTierMin: number;
  };
}

export interface LTTResult {
  grossLtt: number;
  rebate: number;
  netLtt: number;
  torontoLtt?: number;
  torontoRebate?: number;
  description: string;
  rebateDescription: string;
}

export interface ClosingCostsResult {
  downPayment: number;
  netLtt: number;
  grossLtt: number;
  lttRebate: number;
  pstOnInsurance: number;
  legalFees: number;
  homeInspection: number;
  appraisalFee: number;
  titleInsurance: number;
  estMovingAndSetup: number;
  totalClosingFees: number;
  totalCashRequired: number;
}

export interface StressTestResult {
  contractRate: number;
  stressRate: number;
  monthlyPaymentContract: number;
  monthlyPaymentStress: number;
  grossMonthlyIncome: number;
  gdsContract: number;
  tdsContract: number;
  gdsStress: number;
  tdsStress: number;
  passesGDS: boolean;
  passesTDS: boolean;
  passesDownPayment: boolean;
  overallApproved: boolean;
  maxAffordablePrice: number;
  headroom: number;
}

export interface MonthlyCashFlow {
  grossIncome: number;
  estimatedNetTakeHome: number;
  mortgagePayment: number;
  propertyTax: number;
  heatingUtilities: number;
  condoFee: number;
  homeMaintenanceReserve: number; // 1% of price / 12
  homeInsuranceEst: number;
  debtPayments: number;
  livingExpenses: number;
  rentalIncomeNet: number;
  totalHousingOutlay: number;
  totalMonthlyOutflow: number;
  netMonthlySurplus: number;
}

export interface EquityYearItem {
  year: number;
  startBalance: number;
  principalPaid: number;
  interestPaid: number;
  endBalance: number;
  homeValueEst: number;
  homeEquityEst: number;
}

export interface RateShockScenario {
  rateBump: number;
  newRate: number;
  newMonthlyPayment: number;
  paymentDifference: number;
  newSurplus: number;
  isAffordable: boolean;
}

export interface RentVsBuyComparison {
  year: number;
  cumulativeCostRent: number;
  cumulativeCostBuy: number;
  homeEquityBuilt: number;
  netWealthAdvantageBuy: number;
}

export interface CalculationFullResult {
  inputs: MortgageInputs;
  cmhc: CMHCResult;
  ltt: LTTResult;
  closing: ClosingCostsResult;
  stress: StressTestResult;
  cashFlow: MonthlyCashFlow;
  equitySchedule: EquityYearItem[];
  rateShockScenarios: RateShockScenario[];
  rentVsBuySchedule: RentVsBuyComparison[];
  breakEvenYear: number;
}
