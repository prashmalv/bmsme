// Central + State schemes available to Bihar MSMEs.
// Each scheme tagged with eligibility flags used by the SchemeMatcher
// for client-side eligibility scoring before sending to AI for deep reasoning.

export const SCHEMES = [
  {
    code: 'MMUY',
    name: 'Bihar Mukhyamantri Udyami Yojana',
    nameHi: 'बिहार मुख्यमंत्री उद्यमी योजना',
    issuer: 'Department of Industries, Bihar',
    issuerType: 'STATE',
    flagship: true,
    loanMax: 1000000,
    subsidyPct: 50,
    subsidyMaxAmt: 500000,
    portal: 'https://udyami.bihar.gov.in',
    summary: '₹10L loan — 50% subsidy (max ₹5L), rest interest-free. For new manufacturing or service units in Bihar.',
    eligibility: {
      domicile: 'BIHAR',
      ageMin: 18,
      ageMax: 50,
      educationMin: '12th',
      stage: ['NEW'],
      categories: ['GENERAL_YOUTH','SC','ST','EBC','BC','MAHILA','MINORITY'],
    },
    benefits: ['₹5L subsidy', '₹5L interest-free loan', 'Sector-agnostic', 'Multi-category support'],
    icon: '🏛',
    color: 'var(--secondary)',
    badge: 'FLAGSHIP',
  },
  {
    code: 'PMEGP',
    name: 'PM Employment Generation Programme',
    nameHi: 'पीएम रोजगार सृजन कार्यक्रम',
    issuer: 'KVIC + DIC, Ministry of MSME',
    issuerType: 'CENTRAL',
    loanMax: 2500000,
    subsidyPct: 35,
    subsidyMaxAmt: 875000,
    portal: 'https://www.kviconline.gov.in/pmegpeportal',
    summary: 'Loan up to ₹25L (mfg) / ₹10L (service) with 15-35% margin money subsidy.',
    eligibility: {
      ageMin: 18,
      educationMin: '8th',
      stage: ['NEW'],
      sectors: ['MFG','SERVICE'],
    },
    benefits: ['Margin money 15-35%', 'New units only', 'Rural areas get higher subsidy'],
    icon: '🏭',
    color: 'var(--primary)',
  },
  {
    code: 'MUDRA',
    name: 'PM MUDRA Yojana',
    nameHi: 'पीएम मुद्रा योजना',
    issuer: 'MUDRA / SIDBI',
    issuerType: 'CENTRAL',
    loanMax: 2000000,
    subsidyPct: 0,
    portal: 'https://www.udyamimitra.in',
    summary: 'Shishu (≤₹50K) · Kishore (₹50K-₹5L) · Tarun (₹5L-₹10L) · Tarun Plus (₹10L-₹20L). No collateral.',
    eligibility: {
      stage: ['NEW','EXISTING'],
      sectors: ['MFG','SERVICE','TRADE'],
    },
    benefits: ['No collateral', 'Quick disbursal', 'Through any bank/MFI'],
    icon: '💳',
    color: 'var(--primary)',
  },
  {
    code: 'STANDUP',
    name: 'Stand-Up India',
    nameHi: 'स्टैंड-अप इंडिया',
    issuer: 'SIDBI / Banks',
    issuerType: 'CENTRAL',
    loanMax: 10000000,
    loanMin: 1000000,
    subsidyPct: 0,
    portal: 'https://www.standupmitra.in',
    summary: '₹10L to ₹1Cr composite loan for greenfield enterprise by SC/ST/Women entrepreneurs.',
    eligibility: {
      stage: ['NEW'],
      categories: ['SC','ST','MAHILA'],
    },
    benefits: ['Up to ₹1 Cr', 'Greenfield project support', 'Long tenor (7 yrs)'],
    icon: '🚀',
    color: 'var(--accent-dark)',
  },
  {
    code: 'VISHWA',
    name: 'PM Vishwakarma Yojana',
    nameHi: 'पीएम विश्वकर्मा योजना',
    issuer: 'Ministry of MSME',
    issuerType: 'CENTRAL',
    loanMax: 300000,
    portal: 'https://pmvishwakarma.gov.in',
    summary: 'For 18 traditional artisan trades. Toolkit ₹15K + ₹500/day stipend + ₹1L (5%) + ₹2L credit.',
    eligibility: {
      stage: ['NEW','EXISTING'],
      sectors: ['ARTISAN'],
    },
    benefits: ['Toolkit ₹15,000', 'Skill stipend', '5% interest credit', 'Marketing support'],
    icon: '🧑‍🎨',
    color: 'var(--accent-dark)',
  },
  {
    code: 'PMFME',
    name: 'PM FME (Food Processing)',
    nameHi: 'पीएम एफएमई (खाद्य प्रसंस्करण)',
    issuer: 'Ministry of Food Processing Industries',
    issuerType: 'CENTRAL',
    loanMax: 3000000,
    subsidyPct: 35,
    subsidyMaxAmt: 1000000,
    portal: 'https://pmfme.mofpi.gov.in',
    summary: '35% capital subsidy (max ₹10L) on food processing units. Cluster-based ODOP focus.',
    eligibility: {
      stage: ['NEW','EXISTING'],
      sectors: ['FOOD'],
    },
    benefits: ['35% subsidy', 'ODOP cluster support (makhana, litchi, mango)', 'FPO/SHG eligible'],
    icon: '🥫',
    color: 'var(--secondary)',
  },
  {
    code: 'CGTMSE',
    name: 'Credit Guarantee Trust (CGTMSE)',
    nameHi: 'क्रेडिट गारंटी ट्रस्ट',
    issuer: 'SIDBI + Govt of India',
    issuerType: 'CENTRAL',
    loanMax: 50000000,
    subsidyPct: 0,
    portal: 'https://www.cgtmse.in',
    summary: 'Collateral-free credit guarantee up to ₹5 Cr to MSMEs.',
    eligibility: {
      stage: ['NEW','EXISTING'],
      sectors: ['MFG','SERVICE','TRADE'],
    },
    benefits: ['No collateral needed', 'Up to ₹5 Cr', 'Guarantee fee 0.37-1.35%'],
    icon: '🛡',
    color: 'var(--primary)',
  },
  {
    code: 'CLCSS',
    name: 'CLCSS — Technology Upgrade',
    nameHi: 'सीएलसीएसएस',
    issuer: 'Ministry of MSME',
    issuerType: 'CENTRAL',
    loanMax: 10000000,
    subsidyPct: 15,
    subsidyMaxAmt: 1500000,
    portal: 'https://clcss.dcmsme.gov.in',
    summary: '15% capital subsidy on technology upgrade (max ₹15L subsidy).',
    eligibility: {
      stage: ['EXISTING'],
      sectors: ['MFG'],
    },
    benefits: ['15% capex subsidy', 'For modernisation', 'Eligible sectors notified'],
    icon: '⚙️',
    color: 'var(--primary)',
  },
  {
    code: 'BIHTEX',
    name: 'Bihar Textile & Leather Policy 2022',
    nameHi: 'बिहार वस्त्र और चमड़ा नीति',
    issuer: 'Department of Industries, Bihar',
    issuerType: 'STATE',
    loanMax: 50000000,
    subsidyPct: 25,
    portal: 'https://industries.bihar.gov.in',
    summary: 'Capital subsidy 25%, interest subvention 7%, payroll subsidy ₹5K/worker/month for 5 yrs.',
    eligibility: {
      domicile: 'BIHAR',
      stage: ['NEW','EXISTING'],
      sectors: ['TEXTILE','LEATHER'],
    },
    benefits: ['25% capital subsidy', 'Payroll subsidy', '7% interest subvention', '5-yr horizon'],
    icon: '🧵',
    color: 'var(--accent-dark)',
  },
  {
    code: 'BIH_STARTUP',
    name: 'Bihar Startup Policy 2022',
    nameHi: 'बिहार स्टार्टअप नीति 2022',
    issuer: 'Department of Industries, Bihar',
    issuerType: 'STATE',
    loanMax: 1000000,
    portal: 'https://startup.bihar.gov.in',
    summary: 'Interest-free seed funding up to ₹10L, co-working, incubator support.',
    eligibility: {
      domicile: 'BIHAR',
      stage: ['NEW'],
      sectors: ['TECH','SERVICE','MFG'],
    },
    benefits: ['Interest-free seed funding', 'Incubator access', 'Matching grants'],
    icon: '🚀',
    color: 'var(--secondary)',
  },
  {
    code: 'ZED',
    name: 'ZED Certification',
    nameHi: 'जेड सर्टिफिकेशन',
    issuer: 'Quality Council of India',
    issuerType: 'CENTRAL',
    loanMax: 0,
    subsidyPct: 80,
    portal: 'https://zed.msme.gov.in',
    summary: 'Zero Defect Zero Effect. Bronze/Silver/Gold tiers. 80% subsidy on cert fee for MSMEs.',
    eligibility: {
      stage: ['EXISTING'],
      sectors: ['MFG'],
    },
    benefits: ['Cert fee subsidy', 'GeM priority', 'Export readiness'],
    icon: '🏅',
    color: 'var(--accent-dark)',
  },
]

// Quick lookup
export const findScheme = (code) => SCHEMES.find(s => s.code === code)

// Eligibility scorer — returns 0-100 match
export function scoreScheme(scheme, profile) {
  if (!profile) return 50
  let score = 100
  const el = scheme.eligibility || {}

  if (el.domicile === 'BIHAR' && profile.domicile && profile.domicile !== 'BIHAR') score -= 60
  if (el.ageMin && profile.age && profile.age < el.ageMin) score -= 40
  if (el.ageMax && profile.age && profile.age > el.ageMax) score -= 30
  if (el.stage && profile.stage && !el.stage.includes(profile.stage)) score -= 40
  if (el.sectors && profile.sectorCode && !el.sectors.includes(profile.sectorCode)) score -= 35
  if (el.categories && profile.categoryCode && !el.categories.includes(profile.categoryCode)) {
    // Categories filter only matters if scheme is explicitly category-restricted (Stand-Up India etc.)
    if (scheme.code === 'STANDUP') score -= 70
    else if (scheme.code === 'MMUY') score -= 5  // MMUY has all categories — minor penalty if mismatch
  }

  return Math.max(0, Math.min(100, score))
}
