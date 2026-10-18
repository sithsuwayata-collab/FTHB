import { ProvinceCode, ProvinceInfo } from '../types';

export const PROVINCES_DATA: Record<ProvinceCode, ProvinceInfo> = {
  'ON': {
    code: 'ON',
    name: 'Ontario (General / GTA Suburbs)',
    shortName: 'Ontario',
    hasLTT: true,
    lttName: 'Ontario Land Transfer Tax (LTT)',
    firstTimeRebateName: 'ON First-Time Buyer Rebate (Up to $4,000)',
    defaultPropTaxRate: 0.0085,
    pstOnCMHC: 0.08,
    popularCities: ['Mississauga', 'Brampton', 'Markham', 'Milton', 'Ottawa', 'Kitchener-Waterloo', 'Hamilton'],
    keyHighlight: 'Up to $4,000 provincial LTT rebate. 8% PST on CMHC premium due at closing.'
  },
  'ON-TOR': {
    code: 'ON-TOR',
    name: 'Ontario (City of Toronto - Dual LTT)',
    shortName: 'City of Toronto',
    hasLTT: true,
    lttName: 'Combined Provincial + Toronto Municipal LTT',
    firstTimeRebateName: 'Combined ON ($4,000) + Toronto ($4,475) Rebates ($8,475 Total)',
    defaultPropTaxRate: 0.0066,
    pstOnCMHC: 0.08,
    popularCities: ['Scarborough', 'North York', 'Etobicoke', 'Downtown Toronto'],
    keyHighlight: 'Dual land transfer tax applies in Toronto, but first-time buyers get up to $8,475 in rebates.'
  },
  'BC': {
    code: 'BC',
    name: 'British Columbia',
    shortName: 'British Columbia',
    hasLTT: true,
    lttName: 'BC Property Transfer Tax (PTT)',
    firstTimeRebateName: 'BC First-Time Home Buyers PTT Exemption (Up to $835k/860k)',
    defaultPropTaxRate: 0.0038,
    pstOnCMHC: 0.0,
    popularCities: ['Vancouver', 'Surrey', 'Burnaby', 'Coquitlam', 'Victoria', 'Kelowna'],
    keyHighlight: 'PTT exemption up to $835k for eligible first-time buyers. No PST on CMHC.'
  },
  'AB': {
    code: 'AB',
    name: 'Alberta',
    shortName: 'Alberta',
    hasLTT: false,
    lttName: 'Alberta Land Titles Transfer Fee',
    firstTimeRebateName: 'Zero Provincial LTT (Saves $10k–$25k vs ON/BC)',
    defaultPropTaxRate: 0.0075,
    pstOnCMHC: 0.0,
    popularCities: ['Calgary', 'Edmonton', 'Airdrie', 'Cochrane'],
    keyHighlight: 'No provincial sales tax and no land transfer tax. Lowest closing fees in Canada.'
  },
  'QC': {
    code: 'QC',
    name: 'Quebec',
    shortName: 'Quebec',
    hasLTT: true,
    lttName: 'Quebec Welcome Tax (Droit de mutation)',
    firstTimeRebateName: 'Municipal First-Time Home Purchase Assistance',
    defaultPropTaxRate: 0.0095,
    pstOnCMHC: 0.09975,
    popularCities: ['Montreal', 'Laval', 'Brossard', 'Gatineau', 'Quebec City'],
    keyHighlight: 'Municipal welcome tax scale. 9.975% QST on CMHC premium due at closing.'
  },
  'MB': {
    code: 'MB',
    name: 'Manitoba',
    shortName: 'Manitoba',
    hasLTT: true,
    lttName: 'Manitoba Land Transfer Tax',
    firstTimeRebateName: 'Standard Provincial Scale',
    defaultPropTaxRate: 0.0125,
    pstOnCMHC: 0.0,
    popularCities: ['Winnipeg', 'Brandon'],
    keyHighlight: 'Accessible starter homes with standard tiered provincial transfer tax.'
  },
  'SK': {
    code: 'SK',
    name: 'Saskatchewan',
    shortName: 'Saskatchewan',
    hasLTT: false,
    lttName: 'Saskatchewan Land Titles Fee (ISC)',
    firstTimeRebateName: 'First-Time Homebuyers Non-Refundable Tax Credit',
    defaultPropTaxRate: 0.011,
    pstOnCMHC: 0.06,
    popularCities: ['Saskatoon', 'Regina'],
    keyHighlight: 'Low barrier of entry for detached homes. 6% PST on CMHC premium.'
  },
  'NS': {
    code: 'NS',
    name: 'Nova Scotia',
    shortName: 'Nova Scotia',
    hasLTT: true,
    lttName: 'Municipal Deed Transfer Tax (DTT ~1.5%)',
    firstTimeRebateName: 'First-Time Home Buyers Rebate',
    defaultPropTaxRate: 0.0115,
    pstOnCMHC: 0.0,
    popularCities: ['Halifax', 'Dartmouth', 'Bedford'],
    keyHighlight: 'Coastal lifestyle with ~1.5% deed transfer tax set by municipality.'
  },
  'NB': {
    code: 'NB',
    name: 'New Brunswick',
    shortName: 'New Brunswick',
    hasLTT: true,
    lttName: 'Real Property Transfer Tax (1.0%)',
    firstTimeRebateName: 'Affordable Starter Scale',
    defaultPropTaxRate: 0.0135,
    pstOnCMHC: 0.0,
    popularCities: ['Moncton', 'Fredericton', 'Saint John'],
    keyHighlight: '1.0% transfer tax. High national affordability index.'
  },
  'PE': {
    code: 'PE',
    name: 'Prince Edward Island',
    shortName: 'PEI',
    hasLTT: true,
    lttName: 'PEI Real Property Transfer Tax (1.0%)',
    firstTimeRebateName: 'First-Time Buyer Exemption on Primary Residence',
    defaultPropTaxRate: 0.012,
    pstOnCMHC: 0.0,
    popularCities: ['Charlottetown', 'Stratford'],
    keyHighlight: 'Exemption for first-time buyers on primary residence under qualifying thresholds.'
  },
  'NL': {
    code: 'NL',
    name: 'Newfoundland & Labrador',
    shortName: 'Newfoundland',
    hasLTT: false,
    lttName: 'Registration of Deeds Fee (~0.4%)',
    firstTimeRebateName: 'First-Time Homebuyers Assistance',
    defaultPropTaxRate: 0.009,
    pstOnCMHC: 0.0,
    popularCities: ['St. John\'s', 'Mount Pearl'],
    keyHighlight: 'Lowest entry prices in eastern Canada with minimal registry fees.'
  }
};
