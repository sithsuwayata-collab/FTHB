export interface GuideQuestion {
  id: string;
  category: 'money' | 'real-costs' | 'fit-timing' | 'process' | 'personal';
  title: string;
  subtitle: string;
  answerSummary: string;
  detailedPoints: string[];
  insiderTip: string;
  badge?: string;
  iconName: string;
}

export interface ChecklistItem {
  id: string;
  stage: 'early-prep' | 'financial-readiness' | 'house-hunting' | 'closing-keys';
  title: string;
  description: string;
  importance: 'critical' | 'recommended' | 'optional';
}

export interface GlossaryItem {
  term: string;
  category: 'Mortgage' | 'Taxes' | 'Legal' | 'Ownership';
  shortDefinition: string;
  explanation: string;
  pitfallToAvoid: string;
}

export const GUIDE_QUESTIONS: GuideQuestion[] = [
  // 1. MONEY
  {
    id: 'money-downpayment',
    category: 'money',
    title: 'How much do I need to put down?',
    subtitle: 'Tiered rules: 5% on the first $500k, 10% on remainder up to $1.5M, 20% on $1.5M+.',
    iconName: 'Coins',
    badge: 'Federal Rule',
    answerSummary: 'In Canada, the legal minimum down payment is tiered based on the purchase price. Any down payment under 20% requires mortgage default insurance.',
    detailedPoints: [
      'First $500,000 of home price: Minimum 5.0% down payment ($25,000 on a $500,000 home).',
      'Portion between $500,001 and $1,500,000: Minimum 10.0% down payment (for example, on a $750k home: $25,000 + $25,000 = $50,000 minimum).',
      'Properties priced over $1,500,000: Mandatory 20.0% down payment (default insurance is not available above $1.5M).',
      'Down Payment Under 20%: You must obtain mortgage default insurance (CMHC, Sagen, or Canada Guaranty). The insurance premium (2.8% to 4.0%) is added into your mortgage loan, but provincial sales tax on the premium must be paid in cash at closing in Ontario (8%), Quebec (9.975%), and Saskatchewan (6%).'
    ],
    insiderTip: 'You do not have to wait for a 20% down payment if home prices are rising faster than you can save. Buying with 5% to 10% down gets you into the property ladder sooner and locks in government-backed insured mortgage rates, which are often 0.20% to 0.40% lower than uninsured rates.'
  },
  {
    id: 'money-closing-costs',
    category: 'money',
    title: 'After the down payment, how much cash is left for closing costs?',
    subtitle: 'Budget roughly 1.5% to 4.0% of the purchase price on top of your down payment.',
    iconName: 'ReceiptText',
    badge: 'Cash Reserve Rule',
    answerSummary: 'Never deplete your bank accounts completely on the down payment. You will need liquid funds on closing day for transfer taxes, legal fees, inspection, and adjustments.',
    detailedPoints: [
      'Land Transfer Tax (LTT): Ontario, BC, and Quebec charge tiered land transfer taxes. In Alberta and Saskatchewan, you pay minimal land titles registration fees (saving $10,000 to $25,000 compared to Ontario or BC).',
      'Toronto Dual Tax: Buyers in the City of Toronto pay BOTH Ontario Provincial LTT and Toronto Municipal LTT (first-time buyer rebates help up to $8,475 total).',
      'Real Estate Lawyer / Notary: Budget $1,600 to $2,200 for title searches, mortgage registration, tax adjustments, and trust disbursements.',
      'Professional Home Inspection: $500 to $650 for an independent certified inspector (roof, electrical, plumbing, foundation, HVAC).',
      'Appraisal & Title Insurance: Bank appraisal ($350–$500) and lender title insurance ($350–$450).',
      'PST on Default Insurance: If you put down less than 20% in Ontario, Quebec, or Saskatchewan, sales tax on the CMHC premium is due immediately in cash at closing.'
    ],
    insiderTip: 'Always request an itemized "Statement of Adjustments" from your real estate lawyer at least 5 business days before your possession date so there are no unexpected bank draft shortfalls.'
  },
  {
    id: 'money-stress-test',
    category: 'money',
    title: 'What monthly payment can I carry if interest rates go up at renewal?',
    subtitle: 'OSFI B-20 Stress Test: Lenders test you at Contract Rate + 2.00% or 5.25%.',
    iconName: 'TrendingUp',
    badge: 'OSFI B-20 Mandate',
    answerSummary: 'In Canada, lenders legally must qualify you at a higher rate than you will actually pay, but your personal household budget matters much more than their approval ceiling.',
    detailedPoints: [
      'The B-20 Rule: You must qualify at whichever is higher: your contract interest rate + 2.00%, or the Bank of Canada benchmark floor of 5.25%. For example, a 4.25% mortgage is tested at 6.25%.',
      'Gross Debt Service (GDS): Maximum 39% of gross monthly income for shelter costs (Mortgage principal & interest + Property tax + Heat + 50% Condo fees).',
      'Total Debt Service (TDS): Maximum 44% of gross income including shelter costs PLUS all consumer debts (car loans, credit cards, student loans).',
      'The 5-Year Renewal Reality: Canadian mortgages typically have 3 or 5-year terms within a 25 or 30-year amortization. At renewal, your payment adjusts to prevailing market rates.'
    ],
    insiderTip: 'Do not borrow the absolute maximum amount the bank approves. Build in a $300 to $500/month safety buffer so that if interest rates rise 1.5% at your 5-year renewal, your family lifestyle remains completely uninterrupted.'
  },
  {
    id: 'money-credit-job',
    category: 'money',
    title: 'What do my debts, credit score, and job history look like to a lender?',
    subtitle: 'Equifax and TransUnion reports, probation periods, and debt-to-income impacts.',
    iconName: 'CreditCard',
    badge: 'Underwriting Basics',
    answerSummary: 'Lenders look for clean credit history (score 680+), stable completed probation periods, and manageable debt ratios.',
    detailedPoints: [
      'Credit Score Standards: A score above 680 unlocks tier-1 bank rates. Scores below 600 often push borrowers to alternative lenders with higher rates and lender fees.',
      'Employment Stability: Lenders expect permanent full-time employment with completed 3-month probation periods. Self-employed borrowers typically require 2 years of CRA Notice of Assessments (NOA).',
      'Car Loans Kill Mortgage Approval: A $500/month car financing payment reduces your mortgage borrowing capacity by approximately $80,000 to $100,000. Do not buy or lease a new car before buying a home.',
      'Credit Report Errors: Check your Equifax and TransUnion reports before shopping. Credit reporting errors can take 30 to 60 days to correct.'
    ],
    insiderTip: 'Keep credit card balances below 30% of your credit limits at all times. Paying your cards off in full twice a month boosts your credit score significantly faster than carrying a balance.'
  },
  {
    id: 'money-tax-accounts',
    category: 'money',
    title: 'Am I using the tax-advantaged accounts that can help (FHSA & HBP)?',
    subtitle: 'The FHSA ($40,000) and RRSP Home Buyers’ Plan ($60,000) combine for up to $100,000 per buyer.',
    iconName: 'PiggyBank',
    badge: 'Government Programs',
    answerSummary: 'Leverage Canada’s registered accounts to save for your down payment while generating substantial income tax refunds.',
    detailedPoints: [
      'First Home Savings Account (FHSA): Contribute up to $8,000 per year (lifetime max $40,000). Contributions are tax-deductible (reduces your income tax), growth is tax-free, and qualifying home withdrawals are 100% tax-free.',
      'RRSP Home Buyers’ Plan (HBP): Withdraw up to $60,000 tax-free per person ($120,000 for a couple) from your RRSP to buy your first home. You have 15 years to repay it back into your RRSP.',
      'Couples Advantage: A couple can combine two FHSAs ($80,000) and two HBPs ($120,000) for up to $200,000 in tax-advantaged down payment capital.',
      'Tax-Free Savings Account (TFSA): Any additional cash savings can grow tax-free in a TFSA and be withdrawn at any time with no penalty.'
    ],
    insiderTip: 'Even if you plan to buy within 6 to 12 months, depositing your down payment money into an FHSA allows you to claim thousands of dollars in tax deductions on your next tax return.'
  },

  // 2. THE REAL MONTHLY COST
  {
    id: 'costs-ongoing',
    category: 'real-costs',
    title: 'Have I added property tax, home insurance, utilities, and maintenance?',
    subtitle: 'Your mortgage payment is usually only 60% to 70% of total housing costs.',
    iconName: 'Flame',
    badge: '1% Maintenance Rule',
    answerSummary: 'When renting, your landlord covers broken appliances and structural maintenance. As an owner, you must budget for property taxes, heating, water, and repairs.',
    detailedPoints: [
      'Property Tax: Typically 0.5% to 1.3% of the assessed property value per year depending on the municipality ($3,500 to $6,500/year on typical starter homes).',
      'Homeowner Insurance: $100 to $180/month covering building structure, liability, and contents (mandatory for all mortgage lenders).',
      'Utilities (Heat, Hydro, Water): In Canadian winters, natural gas or electric heating bills rise significantly. Budget $250 to $450/month for combined heat, electricity, and water/waste.',
      'The 1% Annual Maintenance Rule: Set aside 1% of your home’s value every year in a savings account for routine and major repairs (e.g., ~$500/month on a $600k home for eventual roof, furnace, and appliance replacement).'
    ],
    insiderTip: 'When inspecting a property, ask the seller for their past 12 months of utility bills (gas, electricity, water) to avoid winter heating surprises.'
  },
  {
    id: 'costs-condo-fees',
    category: 'real-costs',
    title: 'If it’s a condo, how much are the fees, what do they cover, and is the reserve fund healthy?',
    subtitle: 'Understanding maintenance fees, status certificates, and special assessments.',
    iconName: 'Building2',
    badge: 'Condo Due Diligence',
    answerSummary: 'Condo fees range from $350 to $900+/month. 50% of the condo fee is factored into your mortgage debt ratios, reducing your purchasing power.',
    detailedPoints: [
      'What’s Covered: Fees typically include exterior maintenance, snow removal, common area cleaning, and building insurance. Some include heat or water; others do not.',
      'Borrowing Impact: Mortgage lenders include 50% of the condo fee in your GDS and TDS debt calculations. A $600/month condo fee reduces your maximum mortgage loan by roughly $40,000.',
      'Reserve Fund Study: A mandatory engineering study assessing future structural repairs. An underfunded reserve fund leads to surprise "Special Assessments" (one-time bills of $5,000 to $30,000+ per owner).',
      'Status Certificate Condition: Never buy a condo without a legal condition allowing your lawyer to inspect the Status Certificate for budget deficits and pending lawsuits.'
    ],
    insiderTip: 'A low condo fee is not always a bargain. If an older building has unrealistically low fees, it often means the board deferred maintenance, setting the stage for a massive fee hike or special assessment.'
  },
  {
    id: 'costs-emergency-fund',
    category: 'real-costs',
    title: 'Can I still save, handle a job loss for a few months, and cover an emergency after buying?',
    subtitle: 'Avoiding the "house-poor" trap by maintaining a 3 to 6-month buffer.',
    iconName: 'ShieldAlert',
    badge: 'Safety Net',
    answerSummary: 'Never close on a property with zero dollars left in your bank account. Keep a dedicated emergency fund of 3 to 6 months of total expenses post-closing.',
    detailedPoints: [
      'The House-Poor Trap: Spending every cent on your down payment and furniture leaves you exposed to immediate stress if one earner experiences job disruption.',
      'Liquid Emergency Fund: Keep 3 to 6 months of mortgage payments, property taxes, food, and debt payments in an easily accessible High-Interest Savings Account.',
      'Income Protection: Ensure your primary income earners have term life and disability insurance to protect mortgage payments.',
      'Home Equity Line of Credit (HELOC): Once you build 20%+ equity, a HELOC can provide an emergency backup safety line at prime interest rates.'
    ],
    insiderTip: 'If your post-closing savings balance will be under $5,000, consider reducing your purchase price or down payment slightly (even if it means paying a tiny fraction more in CMHC insurance) to protect your liquidity.'
  },

  // 3. FIT AND TIMING
  {
    id: 'fit-five-year-rule',
    category: 'fit-timing',
    title: 'Do I plan to stay at least five years?',
    subtitle: 'The 5-Year Rule: High transaction costs make short stays financially expensive.',
    iconName: 'CalendarClock',
    badge: 'Time Horizon',
    answerSummary: 'Selling real estate in Canada costs 4% to 5% in Realtor commissions, plus legal fees and mortgage prepayment penalties. Short stays rarely break even.',
    detailedPoints: [
      'Selling Costs: On a $650,000 home, paying 4.5% Realtor commission + HST equals ~$33,000. Add legal fees, staging, and moving, and selling costs easily exceed $40,000.',
      'Amortization Curve: In the first 3 to 4 years of a 25-year mortgage, a substantial portion of your monthly payment goes toward interest rather than principal reduction.',
      'Breakeven Horizon: It typically takes 4 to 6 years of modest property appreciation to recover your upfront closing costs and eventual selling expenses.',
      'Life Transition Planning: If you anticipate moving cities, changing career paths, or major family additions within 2 to 3 years, renting may offer superior flexibility.'
    ],
    insiderTip: 'If you are unsure whether you will stay in your current city for at least 5 years, renting and investing your surplus down payment in index funds or an FHSA is often the smarter financial move.'
  },
  {
    id: 'fit-rent-vs-buy',
    category: 'fit-timing',
    title: 'Would renting a bit longer make my position stronger?',
    subtitle: 'Weighing home price entry vs building a larger down payment and career tenure.',
    iconName: 'Scale',
    badge: 'Strategic Choice',
    answerSummary: 'Renting is not wasting money if it allows you to hit the 20% down payment threshold, complete job probation, or establish stronger credit history.',
    detailedPoints: [
      'Eliminating CMHC Fees: Waiting until you reach 20% down eliminates default insurance entirely, saving $15,000 to $30,000+ added to your principal.',
      'Career & Income Growth: Establishing 2+ years of consistent employment history qualifies you for the best tier-1 bank rates with no underwriting hurdles.',
      'Credit Score Optimization: Raising your credit score from 640 to 740 can reduce your contract mortgage rate by 0.30% to 0.60%, saving thousands in interest.',
      'Flexibility: Renting allows you to explore different neighborhoods before making a permanent multi-decade commitment.'
    ],
    insiderTip: 'Compare the unrecoverable costs of both options: Rent is unrecoverable, but so are mortgage interest, property taxes, condo fees, and home maintenance. Use our Rent vs Buy calculator to find your crossover point.'
  },
  {
    id: 'fit-tradeoffs',
    category: 'fit-timing',
    title: 'Which matters more: commute, schools, space, or price?',
    subtitle: 'The Starter Home Triangle: You can rarely get all four on a first-time budget.',
    iconName: 'Compass',
    badge: 'Prioritization',
    answerSummary: 'Identify your non-negotiables early. Most first-time buyers must trade off square footage or commute distance to stay within budget.',
    detailedPoints: [
      'Transit & Commute: Proximity to GO Trains, subways, or highway access can save 10+ hours per week of commuting time and thousands in vehicle fuel and insurance.',
      'School Districts: Top-rated school zones command a 10% to 20% price premium over adjacent school catchments.',
      'Space vs Location: For $650,000, you might choose between a 2-bedroom downtown condo, a suburban 3-bedroom townhouse, or a 4-bedroom detached home in an emerging community.',
      'Starter Home Strategy: Your first home is a springboard. Most Canadians live in their first property for 5 to 7 years, accumulate equity, and upgrade as family needs expand.'
    ],
    insiderTip: 'Rank your priorities from 1 to 4: Commute, Schools, Space, Price. Pick your top two non-negotiables, and be prepared to compromise on the other two.'
  },
  {
    id: 'fit-property-type',
    category: 'fit-timing',
    title: 'House, townhouse, or condo? Each carries different costs and risks.',
    subtitle: 'Comparing detached, freehold townhomes, condo townhouses, and apartment condos.',
    iconName: 'Home',
    badge: 'Property Types',
    answerSummary: 'Freehold homes provide total independence with full maintenance responsibilities; condos offer lower entry pricing and amenities but ongoing monthly fees.',
    detailedPoints: [
      'Detached Freehold: Full land and building ownership, maximum privacy, and highest long-term appreciation. Full responsibility for roof, yard, furnace, and exterior maintenance.',
      'Freehold Townhouse: Shares one or two walls with neighbors, but has NO monthly condo fees. The sweet spot for starter families wanting a yard without maintenance fees.',
      'Condo Townhouse: Lower purchase price than freehold, but includes a monthly condo fee for exterior building maintenance, roof repair, and landscaping.',
      'Apartment Condo: Lowest initial purchase price and minimal maintenance burden. Ideal for singles or busy couples, but subject to condo board bylaws and elevator waits.'
    ],
    insiderTip: 'When comparing a $600k freehold townhouse to a $550k condo townhouse with a $450/month condo fee, the freehold townhouse is often cheaper on a monthly cash flow basis and appreciates faster.'
  },
  {
    id: 'fit-new-build',
    category: 'fit-timing',
    title: 'Is a new build (pre-construction) worth it vs resale?',
    subtitle: 'Understanding builder deposits, GST/HST rules, occupancy fees, and closing delays.',
    iconName: 'HardHat',
    badge: 'Pre-Construction',
    answerSummary: 'New builds offer modern designs and Tarion warranties, but carry delayed completion dates, interim occupancy fees, and closing development levy surprises.',
    detailedPoints: [
      'GST/HST on New Homes: Resale homes are exempt from GST/HST. New construction includes GST/HST. Primary residence buyers qualify for rebates, but mismanaged paperwork can trigger surprise tax bills of $24,000+.',
      'Builder Cash Deposits: Builders require 10% to 20% in staggered cash deposits over 12 to 18 months, locking up your funds without liquidity.',
      'Development Levies: Builders can pass on municipal development charges at final closing ($10,000 to $25,000 surprise!). Always have your lawyer cap development levies in the contract.',
      'Interim Occupancy Fees: In high-rise condos, you pay the builder "phantom rent" (interest + taxes + condo fees) for months before the building legally registers and your mortgage begins.'
    ],
    insiderTip: 'For first-time home buyers, an established resale home with a verified professional home inspection offers far more predictability and transparency than buying off a floor plan.'
  },

  // 4. PROCESS & TEAM
  {
    id: 'process-preapproval',
    category: 'process',
    title: 'Have I talked to a mortgage broker and gotten a pre-approval?',
    subtitle: 'A pre-approval is NOT a final guarantee; it holds an interest rate for 90 to 120 days.',
    iconName: 'FileCheck2',
    badge: 'Approval Reality',
    answerSummary: 'A mortgage pre-approval confirms your maximum borrowing potential and locks in an interest rate, but final loan approval is conditional on property appraisal and underwriting.',
    detailedPoints: [
      'Broker vs Bank: A bank representative only sells their own proprietary mortgage products. An independent mortgage broker shops 30+ lenders (banks, credit unions, monoline lenders) at no cost to you.',
      'Rate Hold Protection: Pre-approvals lock in a fixed rate for 90 to 120 days. If interest rates rise while you house-hunt, you keep your lower locked rate; if rates drop, you get the lower rate.',
      'Subject to Property Appraisal: Even with pre-approval, the lender MUST approve the specific property you purchase (valuation, structural integrity, condo corporation health).',
      'The "Do Not Touch" Rule: Do not switch jobs, become self-employed, lease a car, or apply for new credit cards between your pre-approval and final closing day!'
    ],
    insiderTip: 'Get pre-approved with full document verification (income pay stubs, T4s, and bank statements submitted upfront), not just a superficial online questionnaire.'
  },
  {
    id: 'process-mortgage-types',
    category: 'process',
    title: 'Do I understand fixed vs variable rates, amortization length, and penalties?',
    subtitle: 'The costly trap of Interest Rate Differential (IRD) penalties on 5-year fixed bank mortgages.',
    iconName: 'Percent',
    badge: 'Mortgage Terms',
    answerSummary: 'The lowest interest rate isn’t always the best mortgage. Big bank 5-year fixed mortgages can carry massive $15,000 to $30,000 prepayment penalties if you break them early.',
    detailedPoints: [
      'Fixed vs Variable: Fixed rates guarantee payment stability for your term. Variable rates fluctuate with the Bank of Canada policy rate.',
      'The IRD Penalty Trap: Breaking a 5-year fixed mortgage with a major bank (due to job relocation, divorce, or selling) can trigger an Interest Rate Differential (IRD) penalty of $15,000 to $25,000+. Variable rate break penalties are legally capped at only 3 months of interest.',
      '25 vs 30-Year Amortization: 30-year amortizations lower your monthly payment slightly, improving qualification. First-time buyers now have access to 30-year amortizations on insured mortgages.',
      'Prepayment Privileges: Look for a mortgage allowing you to pay an extra 15% to 20% in lump sums each year without penalty, cutting years off your mortgage.'
    ],
    insiderTip: 'Over 60% of Canadian borrowers break or refinance their 5-year mortgage by year 3. If there is any chance you might move within 3 years, avoid rigid big-bank 5-year fixed terms.'
  },
  {
    id: 'process-conditions',
    category: 'process',
    title: 'Will I make an offer without a home inspection or financing condition?',
    subtitle: 'For first-time home buyers, the answer should almost always be NO.',
    iconName: 'AlertOctagon',
    badge: 'Non-Negotiable',
    answerSummary: 'Never submit a firm, unconditional offer unless you have massive cash reserves. Always include a 5-business-day financing condition and home inspection condition.',
    detailedPoints: [
      'Financing Condition: Protects your deposit. If the bank’s appraiser values the home at $620,000 when you offered $650,000, you must cover the $30,000 gap in cash or walk away clean with your deposit.',
      'Home Inspection Condition: Gives you the right to hire a certified home inspector to check the roof, foundation cracks, electrical wiring (knob-and-tube or aluminum), plumbing (kitec pipes), and furnace.',
      'Status Certificate Condition: Essential for condos. Protects you from buying into a corporation with major lawsuits, budget deficits, or impending special assessments.',
      'Deposit at Risk: Deposits on accepted offers ($15,000 to $50,000) are held in trust. If you waive conditions and fail to close, you forfeit this deposit and can be sued.'
    ],
    insiderTip: 'Do not let aggressive bidding or sales pressure convince you to waive your financing or inspection condition. Protecting your life savings comes first.'
  },
  {
    id: 'process-team',
    category: 'process',
    title: 'Who is on the team: broker, realtor, lawyer, and home inspector?',
    subtitle: 'Assembling the four professionals who work exclusively for YOUR interests.',
    iconName: 'Users',
    badge: 'Your Team',
    answerSummary: 'You need an independent team working strictly for you—never rely on the seller’s agent or lender.',
    detailedPoints: [
      '1. Independent Mortgage Broker: Shops multiple lenders to find the optimal approval terms, rate, and prepayment flexibility (free to you; paid by lender).',
      '2. Dedicated Buyer’s Realtor: Represents you exclusively, pulls neighborhood comparable sales, drafts protective contract clauses, and negotiates price.',
      '3. Real Estate Lawyer or Notary: Searches title, checks municipal tax accounts, handles fund transfers, and registers your ownership deed.',
      '4. Certified Home Inspector: Paid by you ($500–$650) to spend 3–4 hours testing every mechanical and structural system in the property.'
    ],
    insiderTip: 'Never use the seller’s listing agent to represent you (dual agency). You deserve your own dedicated buyer agent whose sole fiduciary duty is negotiating the lowest price for you.'
  },

  // 5. PERSONAL & FAMILY
  {
    id: 'personal-cobuying',
    category: 'personal',
    title: 'If buying with a partner or family member, have we agreed in writing?',
    subtitle: 'Joint Tenancy vs Tenants in Common, co-ownership agreements, and exit rules.',
    iconName: 'HeartHandshake',
    badge: 'Legal Agreements',
    answerSummary: 'Buying with a spouse, sibling, or parent is a great way to qualify. However, a legally binding co-ownership agreement is critical to protect family relationships.',
    detailedPoints: [
      'Joint Tenancy: Typical for married couples. If one person passes away, ownership automatically transfers to the surviving partner outside of probate.',
      'Tenants in Common: Essential when buying with siblings, friends, or parents. Allows distinct ownership shares (e.g. 50/50 or 60/40), and each owner can pass their share to their own heirs in their will.',
      'Written Co-Ownership Agreement: Drafted by your lawyer. Must detail: who pays what portion of mortgage, property tax, utilities, and repairs; what happens if someone wants to sell; and buyout dispute mechanisms.',
      'First-Time Buyer Rebate Impact: If one co-buyer previously owned a home anywhere in the world, your first-time buyer land transfer tax rebate will be prorated or reduced.'
    ],
    insiderTip: 'Always have your real estate lawyer draft a formal Co-Ownership Agreement before removing conditions on an offer when buying with anyone other than your legal spouse.'
  },
  {
    id: 'personal-rental-suite',
    category: 'personal',
    title: 'Would a rental suite or roommate help me qualify, and am I willing to be a landlord?',
    subtitle: 'Rental offsets for mortgage qualification and residential tenancy realities.',
    iconName: 'DoorOpen',
    badge: 'Mortgage Helper',
    answerSummary: 'A basement apartment or rental suite can add $1,200 to $2,000/month in income, and lenders offset your borrowing capacity by 50% or more. But tenant rights are extensive.',
    detailedPoints: [
      'Lender Rental Offset: Most Canadian lenders allow you to add 50% (and up to 80% with select lenders) of market rental income from a legal self-contained suite toward your qualifying income.',
      'Legal vs Unauthorized Suites: A legal secondary suite has municipal building permits, separate egress (exit window/door), smoke/CO detectors, and fire separation. Non-conforming suites carry insurance risks.',
      'Residential Tenancy Regulations: In Ontario (LTB) and BC (RTB), tenants have strong statutory protections. Resolving non-payment disputes can take several months through tribunal backlogs.',
      'Tax Reporting: Rental income must be reported to the CRA, but you can deduct proportional mortgage interest, property taxes, utilities, and maintenance.'
    ],
    insiderTip: 'Thoroughly screen prospective tenants (credit check, employment verification, previous landlord references). A reliable, quiet tenant who pays on time is worth more than top-of-market rent.'
  },
  {
    id: 'personal-funds-transfer',
    category: 'personal',
    title: 'How do family gifts and international funds work for down payments?',
    subtitle: 'The 90-day seasoning rule, FINTRAC compliance, and signed gift letters.',
    iconName: 'Landmark',
    badge: 'Funds Documentation',
    answerSummary: 'Funds gifted by family or transferred internationally must be documented meticulously to comply with Canadian anti-money laundering (FINTRAC) regulations.',
    detailedPoints: [
      'The 90-Day Seasoning Rule: Canadian mortgage lenders require 90 consecutive days of bank statements for all down payment funds. Large deposits inside that 90-day window require complete source verification.',
      'Family Gift Letters: If parents or relatives are gifting funds, lenders require a signed Gift Letter stating the funds are a non-repayable gift with no loan claims on the property.',
      'International Wires: Wire transfers over $10,000 CAD are automatically reported by Canadian banks to FINTRAC. Maintain all bank wire receipts and proof of source funds.',
      'Park Funds Early: Moving funds into your Canadian bank account at least 90 to 120 days before house-hunting drastically simplifies your mortgage underwriting approval.'
    ],
    insiderTip: 'Have family wire down payment funds well before you start making purchase offers. Once the funds sit in your Canadian bank for 90 days, underwriters consider them fully seasoned.'
  }
];

export const READINESS_CHECKLIST: ChecklistItem[] = [
  // Stage 1: Early Prep
  {
    id: 'chk-credit',
    stage: 'early-prep',
    title: 'Establish 2+ Active Canadian Credit Accounts',
    description: 'Maintain two active credit tradelines (e.g. credit cards or mobile contracts) with 100% on-time payments and utilization below 30%.',
    importance: 'critical',
  },
  {
    id: 'chk-fhsa',
    stage: 'early-prep',
    title: 'Open and Maximize Your FHSA & RRSP Accounts',
    description: 'Contribute up to $8,000/year to an FHSA to claim tax deductions while building your tax-free down payment.',
    importance: 'recommended',
  },
  {
    id: 'chk-probation',
    stage: 'early-prep',
    title: 'Complete Employment Probation Period',
    description: 'Ensure permanent full-time employment status with your current employer (or 2 years of CRA Notice of Assessments if self-employed).',
    importance: 'critical',
  },

  // Stage 2: Financial Readiness
  {
    id: 'chk-seasoning',
    stage: 'financial-readiness',
    title: 'Season Down Payment Funds for 90 Days',
    description: 'Ensure all down payment savings, gifts, or transfers are deposited into your Canadian bank account at least 90 days before shopping.',
    importance: 'critical',
  },
  {
    id: 'chk-preapproval',
    stage: 'financial-readiness',
    title: 'Obtain Verified Mortgage Pre-Approval with Rate Hold',
    description: 'Work with an independent mortgage broker to verify your income documents and lock in an interest rate for 90 to 120 days.',
    importance: 'critical',
  },
  {
    id: 'chk-closing-buffer',
    stage: 'financial-readiness',
    title: 'Budget 2% to 4% for Closing Costs + 3-Month Emergency Fund',
    description: 'Keep separate liquid funds for land transfer taxes, legal fees, inspection, title insurance, and post-closing emergency buffer.',
    importance: 'critical',
  },

  // Stage 3: House Hunting
  {
    id: 'chk-realtor',
    stage: 'house-hunting',
    title: 'Select a Dedicated Buyer’s Real Estate Agent',
    description: 'Choose a Realtor who understands first-time buyer contracts and represents your interests exclusively.',
    importance: 'recommended',
  },
  {
    id: 'chk-conditions',
    stage: 'house-hunting',
    title: 'Enforce Financing & Home Inspection Conditions in Offers',
    description: 'Never waive protective financing and inspection conditions without formal written sign-off from your broker.',
    importance: 'critical',
  },
  {
    id: 'chk-status-cert',
    stage: 'house-hunting',
    title: 'Review Condo Status Certificate (if Buying a Condo/Townhome)',
    description: 'Have your real estate lawyer review the condo reserve fund, special assessments, and building insurance.',
    importance: 'critical',
  },

  // Stage 4: Legal Closing
  {
    id: 'chk-lawyer',
    stage: 'closing-keys',
    title: 'Retain Real Estate Lawyer & Review Statement of Adjustments',
    description: 'Review mortgage registration, property tax prorations, and transfer final certified closing funds.',
    importance: 'critical',
  },
  {
    id: 'chk-insurance',
    stage: 'closing-keys',
    title: 'Bind Homeowner Insurance Policy',
    description: 'Obtain an active home insurance binder with your mortgage lender listed as the primary loss payee.',
    importance: 'critical',
  },
  {
    id: 'chk-utilities',
    stage: 'closing-keys',
    title: 'Transfer Utilities & Conduct Final Walk-Through',
    description: 'Set up gas, hydro, and water accounts, and inspect the home 24 hours before closing to ensure condition is preserved.',
    importance: 'recommended',
  }
];

export const GLOSSARY_TERMS: GlossaryItem[] = [
  {
    term: 'GDS (Gross Debt Service Ratio)',
    category: 'Mortgage',
    shortDefinition: 'Percentage of gross income dedicated to shelter costs (Max 39%).',
    explanation: 'Canadian lenders calculate your mortgage payment, property taxes, heating allowance ($175/mo), and 50% of condo fees divided by your gross monthly household income. Under OSFI rules, this cannot exceed 39.0%.',
    pitfallToAvoid: 'Forgetting to include heating and condo fees when calculating affordability. A $500/month condo fee directly reduces your borrowing power.'
  },
  {
    term: 'TDS (Total Debt Service Ratio)',
    category: 'Mortgage',
    shortDefinition: 'Percentage of gross income covering shelter costs PLUS all consumer debt (Max 44%).',
    explanation: 'TDS adds your existing consumer debt obligations (car loans, student loans, credit card minimum payments, lines of credit) to your shelter costs. Under OSFI rules, this cannot exceed 44.0%.',
    pitfallToAvoid: 'Financing or leasing a car before buying a home. A $500/month car payment can reduce your mortgage qualification by up to $100,000.'
  },
  {
    term: 'CMHC Default Insurance',
    category: 'Mortgage',
    shortDefinition: 'Mandatory insurance protecting the lender if your down payment is under 20%.',
    explanation: 'Provided by CMHC, Sagen, or Canada Guaranty. Protects the lender in the event of borrower default. Premium ranges from 2.8% to 4.0% of the loan amount and is added to your mortgage principal.',
    pitfallToAvoid: 'Sales tax on the premium (PST) in Ontario (8%), Quebec (9.975%), and Saskatchewan (6%) is NOT added to the mortgage—it must be paid in cash at closing.'
  },
  {
    term: 'Amortization vs Term',
    category: 'Mortgage',
    shortDefinition: 'Amortization is the total payoff timeline (25–30 yrs); Term is your current rate contract length (3–5 yrs).',
    explanation: 'Amortization is the total number of years required to pay off the mortgage completely. The term is the duration of your current contract and interest rate agreement. When the term expires, you renew your mortgage at current market rates.',
    pitfallToAvoid: 'Confusing the term with amortization. You will renew your mortgage 5 to 6 times over a 25-year amortization period.'
  },
  {
    term: 'OSFI B-20 Stress Test',
    category: 'Mortgage',
    shortDefinition: 'Statutory qualification rate: Max(Contract Rate + 2.00%, 5.25%).',
    explanation: 'A federal regulation requiring lenders to qualify your mortgage at a rate 2.00% higher than your actual contract rate (or 5.25%, whichever is greater) to ensure you can absorb future interest rate hikes.',
    pitfallToAvoid: 'Budgeting only for the actual contract rate payment. Always test your personal budget against the higher stress rate.'
  },
  {
    term: 'FHSA (First Home Savings Account)',
    category: 'Taxes',
    shortDefinition: 'Tax-free account: tax deduction on deposit + 100% tax-free withdrawal for home purchase.',
    explanation: 'A registered Canadian account combining the benefits of an RRSP and a TFSA. You can contribute up to $8,000 per year (up to $40,000 lifetime). Deposits reduce your taxable income, and qualifying withdrawals are tax-free.',
    pitfallToAvoid: 'Failing to open an account early. FHSA contribution room only begins accumulating once the account is opened.'
  },
  {
    term: 'HBP (Home Buyers’ Plan)',
    category: 'Taxes',
    shortDefinition: 'Withdraw up to $60,000 tax-free from your RRSP with 15 years to repay.',
    explanation: 'A federal program allowing eligible first-time home buyers to withdraw up to $60,000 from their RRSP without tax withholding. Repayment is spread over 15 years starting in the second or third year.',
    pitfallToAvoid: 'Missing annual repayment installments. Any missed repayment is added back to your annual taxable income and taxed at your marginal rate.'
  },
  {
    term: 'Land Transfer Tax (LTT)',
    category: 'Taxes',
    shortDefinition: 'Provincial and municipal tax paid in cash upon property closing.',
    explanation: 'Taxes levied by provincial governments when property title is transferred. The City of Toronto levies an additional municipal tax, resulting in a dual LTT for Toronto properties.',
    pitfallToAvoid: 'Overlooking LTT in Ontario or BC. On a $750,000 home, LTT can cost $15,000 to $25,000 before rebates.'
  },
  {
    term: 'IRD Penalty (Interest Rate Differential)',
    category: 'Mortgage',
    shortDefinition: 'Hefty bank penalty if you break a fixed-rate mortgage before the term expires.',
    explanation: 'Big 5 Canadian banks calculate fixed mortgage break penalties using their posted rates, which can result in penalties of $15,000 to $30,000 if you sell or refinance before the term is up.',
    pitfallToAvoid: 'Signing a rigid 5-year fixed mortgage with a major bank if you might relocate or upgrade within 3 years. Variable rate penalties are capped at just 3 months of interest.'
  },
  {
    term: 'Status Certificate',
    category: 'Legal',
    shortDefinition: 'Legal disclosure of a condo corporation’s financial health, reserve fund, and bylaws.',
    explanation: 'Contains financial statements, reserve fund balance, upcoming fee increases, building insurance, and pending lawsuits against the condominium corporation.',
    pitfallToAvoid: 'Waiving your lawyer’s review of the Status Certificate. An underfunded reserve fund leads to surprise special assessments of $10,000 to $50,000.'
  },
  {
    term: 'Title Insurance',
    category: 'Legal',
    shortDefinition: 'Insurance policy protecting against property title defects, survey issues, and fraud.',
    explanation: 'A one-time premium paid at closing that protects you and your lender against undisclosed title defects, zoning infractions, property fraud, and boundary survey discrepancies.',
    pitfallToAvoid: 'Skipping homeowner title insurance coverage. It costs under $400 and covers you for as long as you own the home.'
  },
  {
    term: '90-Day Seasoning Rule',
    category: 'Ownership',
    shortDefinition: 'Anti-money laundering requirement to verify that down payment funds were not borrowed.',
    explanation: 'Canadian mortgage underwriters examine 90 consecutive days of bank statements to ensure down payment funds did not originate from unapproved credit or undocumented loans.',
    pitfallToAvoid: 'Depositing large, undocumented cash sums right before buying. Transfer overseas funds or family gifts at least 90 days before shopping.'
  }
];

export const PRESET_SCENARIOS = [
  {
    name: 'Toronto Starter Condo',
    province: 'ON-TOR' as const,
    price: 620000,
    income: 130000,
    debt: 350,
    living: 2200,
    fhsa: 16000,
    hbp: 30000,
    savings: 20000,
    gift: 5000,
    rate: 4.29,
    amort: 25,
    tax: 3800,
    condo: 520,
    rental: 0,
    rent: 2600,
    description: 'High-density transit-oriented starter condo in the City of Toronto.'
  },
  {
    name: 'Calgary Detached Home',
    province: 'AB' as const,
    price: 650000,
    income: 140000,
    debt: 400,
    living: 2300,
    fhsa: 16000,
    hbp: 35000,
    savings: 25000,
    gift: 0,
    rate: 4.19,
    amort: 25,
    tax: 4600,
    condo: 0,
    rental: 0,
    rent: 2400,
    description: 'Spacious detached single-family home with yard and double garage in Alberta (Zero LTT).'
  },
  {
    name: 'Ottawa Freehold Townhome',
    province: 'ON' as const,
    price: 595000,
    income: 125000,
    debt: 300,
    living: 2100,
    fhsa: 16000,
    hbp: 30000,
    savings: 20000,
    gift: 0,
    rate: 4.25,
    amort: 25,
    tax: 4200,
    condo: 0,
    rental: 0,
    rent: 2300,
    description: 'Family-friendly freehold townhome with no monthly condo fees in the national capital.'
  },
  {
    name: 'Edmonton Starter with Suite',
    province: 'AB' as const,
    price: 460000,
    income: 105000,
    debt: 250,
    living: 1900,
    fhsa: 8000,
    hbp: 25000,
    savings: 15000,
    gift: 0,
    rate: 4.15,
    amort: 25,
    tax: 3600,
    condo: 0,
    rental: 1300,
    rent: 1850,
    description: 'High-cash-flow starter home where basement tenant rental income subsidizes the mortgage.'
  },
  {
    name: 'Vancouver Metro Townhouse',
    province: 'BC' as const,
    price: 820000,
    income: 175000,
    debt: 450,
    living: 2600,
    fhsa: 16000,
    hbp: 50000,
    savings: 30000,
    gift: 15000,
    rate: 4.29,
    amort: 25,
    tax: 3200,
    condo: 380,
    rental: 0,
    rent: 3100,
    description: 'Modern townhouse in Greater Vancouver (Surrey/Coquitlam/Burnaby) with PTT exemption.'
  },
  {
    name: 'Montreal Starter Condo',
    province: 'QC' as const,
    price: 430000,
    income: 95000,
    debt: 200,
    living: 1800,
    fhsa: 16000,
    hbp: 25000,
    savings: 15000,
    gift: 0,
    rate: 4.25,
    amort: 25,
    tax: 3400,
    condo: 310,
    rental: 0,
    rent: 1750,
    description: 'Urban Montreal condo close to metro with affordable entry pricing.'
  }
];
