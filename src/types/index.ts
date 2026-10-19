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

export type CreditTier = 'excellent' | 'good' | 'fair' | 'poor';

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

export interface PracticalExpenses {
  carPayment: number;       // Contractual debt (TDS)
  creditCardsLoans: number; // Contractual debt (TDS)
  groceriesFood: number;    // Living expense
  childcareFamily: number;  // Living expense
  phoneInternet: number;    // Living expense
  personalMisc: number;     // Living expense
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
  creditTier: CreditTier;
  expenses: PracticalExpenses;
  contractRate: number;
  amortizationYears: number; // 25 or 30
  province: ProvinceCode;
  annualPropertyTax: number;
  monthlyCondoFee: number;
  monthlyHeating: number;
  rentalIncome: number;
  rentalOffsetPct: number;
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

export interface ApprovalProbability {
  score: number; // 0 to 100
  rating: 'Very High' | 'High' | 'Moderate' | 'Low' | 'Critical Shortfall';
  headline: string;
  colorClass: string;
  barColor: string;
  gdsScore: number;
  tdsScore: number;
  downPaymentScore: number;
  cashFlowScore: number;
  creditScore: number;
  strengths: string[];
  blockers: string[];
  smartTips: string[];
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
  homeMaintenanceReserve: number;
  homeInsuranceEst: number;
  totalContractualDebts: number;
  totalLivingExpenses: number;
  rentalIncomeNet: number;
  totalHousingOutlay: number;
  totalMonthlyOutflow: number;
  netMonthlySurplus: number;
}

export interface CalculationFullResult {
  inputs: MortgageInputs;
  cmhc: CMHCResult;
  ltt: LTTResult;
  closing: ClosingCostsResult;
  stress: StressTestResult;
  cashFlow: MonthlyCashFlow;
  approval: ApprovalProbability;
}
