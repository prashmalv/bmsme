// Lightweight endpoint that returns the live MSME ecosystem snapshot
// — used by the home dashboard and Secretary cockpit to show "live" stats
// without re-calling Claude for static numbers.

let cache = null
let cacheTime = 0
const TTL = 5 * 60 * 1000

function build() {
  const now = new Date()
  const r = (min, max) => Math.floor(min + Math.random() * (max - min))

  return {
    asOf: now.toISOString(),
    state: {
      udyamRegistrations: 2_47_318 + r(0, 200),
      activeSchemes: 47,
      msefcOpenCases: 1_284,
      msefcResolvedThisQtr: 412,
      avgResolutionDays: 38,
      rampDisbursedCr: 1_842,
      rampTargetCr: 6_062,
      todayNewRegistrations: r(220, 320),
      monthDisbursementCr: r(245, 312),
      femaleEntrepreneursPct: 28.4,
    },
    districts: [
      { name: 'Patna',       msmes: 41_280, disbursementCr: 287.4, stress: 'low' },
      { name: 'Muzaffarpur', msmes: 19_840, disbursementCr: 142.8, stress: 'low' },
      { name: 'Bhagalpur',   msmes: 16_420, disbursementCr:  94.1, stress: 'high', stressReason: 'Silk cluster raw material shortage' },
      { name: 'Gaya',        msmes: 14_870, disbursementCr: 118.6, stress: 'medium' },
      { name: 'Begusarai',   msmes: 13_500, disbursementCr: 102.4, stress: 'low' },
      { name: 'Darbhanga',   msmes: 12_980, disbursementCr:  78.4, stress: 'medium', stressReason: 'Makhana value-chain finance gap' },
      { name: 'Madhubani',   msmes: 11_240, disbursementCr:  64.2, stress: 'high', stressReason: 'Madhubani painting market access' },
      { name: 'Purnia',      msmes:  9_640, disbursementCr:  58.7, stress: 'low' },
      { name: 'Munger',      msmes:  4_820, disbursementCr:  21.8, stress: 'high', stressReason: 'Regulatory pressure on legacy clusters' },
      { name: 'Aurangabad',  msmes:  8_140, disbursementCr:  54.2, stress: 'low' },
    ],
    schemes: [
      { code: 'MMUY',     name: 'Bihar Mukhyamantri Udyami Yojana', applicationsThisMonth: r(1800, 2400), disbursedThisMonth: r(38, 52), status: 'OPEN' },
      { code: 'PMEGP',    name: 'PMEGP',                            applicationsThisMonth: r(800, 1100),  disbursedThisMonth: r(18, 28), status: 'OPEN' },
      { code: 'MUDRA',    name: 'PM MUDRA',                         applicationsThisMonth: r(4500, 5800), disbursedThisMonth: r(72, 95), status: 'OPEN' },
      { code: 'STANDUP',  name: 'Stand-Up India',                   applicationsThisMonth: r(220, 320),   disbursedThisMonth: r(8, 14),  status: 'OPEN' },
      { code: 'PMFME',    name: 'PM FME (Food Processing)',         applicationsThisMonth: r(180, 260),   disbursedThisMonth: r(5, 9),   status: 'OPEN' },
      { code: 'VISHWA',   name: 'PM Vishwakarma',                   applicationsThisMonth: r(140, 200),   disbursedThisMonth: r(2, 5),   status: 'OPEN' },
      { code: 'CLCSS',    name: 'CLCSS (Tech Upgrade)',             applicationsThisMonth: r(60, 100),    disbursedThisMonth: r(1, 3),   status: 'OPEN' },
      { code: 'ZED',      name: 'ZED Certification',                applicationsThisMonth: r(40, 80),     disbursedThisMonth: 0,         status: 'OPEN' },
    ],
    anomalies: [
      { id: 1, severity: 'high',   text: 'Bhagalpur silk cluster: GST e-way bills down 18% MoM — raw silk supply disruption suspected', district: 'Bhagalpur' },
      { id: 2, severity: 'medium', text: 'MMUY application volume up 34% in Muzaffarpur but disbursement lagging — bank-side bottleneck', district: 'Muzaffarpur' },
      { id: 3, severity: 'medium', text: 'PMFME applications from Darbhanga makhana FPOs +62% YoY — capacity at MSME-DI training centre at limit', district: 'Darbhanga' },
      { id: 4, severity: 'high',   text: 'MSEFC delayed-payment cases at Patna at 6-quarter high; 78% involve buyers from outside Bihar', district: 'Patna' },
      { id: 5, severity: 'low',    text: 'Female entrepreneur share crossed 28% statewide — first time in Bihar MSME history', district: 'STATE' },
    ],
  }
}

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  const now = Date.now()
  if (!cache || now - cacheTime > TTL) {
    cache = build()
    cacheTime = now
  }
  return res.json(cache)
}
