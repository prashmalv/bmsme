import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import StatusBar from '../components/StatusBar'
import AppBar from '../components/AppBar'
import BottomNav from '../components/BottomNav'
import { BIHAR_DISTRICTS } from '../data/districts'

// Synthetic cluster signals — in production, fed by GST e-way bill ingestion + ONDC + GeM
const CLUSTER_INSIGHTS = {
  TEXTILE: [
    { signal: 'rising',  text: 'Bhagalpuri silk online demand +24% YoY on Amazon Karigar & Etsy', impact: 'high' },
    { signal: 'rising',  text: 'GeM enquiries from defence canteens for cotton handloom up 3.2x', impact: 'high' },
    { signal: 'falling', text: 'Raw silk (tussar cocoon) prices +18%, squeezing weaver margins', impact: 'medium' },
    { signal: 'opportunity', text: 'ONDC Bihar cluster onboarding window opens June — 0% commission first 6 months' },
  ],
  FOOD: [
    { signal: 'rising', text: 'Mithila Makhana exports to UAE +56% — 3 new EXIM licenses issued this quarter', impact: 'high' },
    { signal: 'rising', text: 'Shahi Litchi price-per-kg up 22% vs last season; cold chain shortage in Muzaffarpur', impact: 'medium' },
    { signal: 'opportunity', text: 'PMFME ODOP cluster grant — 35% subsidy on processing units in Darbhanga / Khagaria' },
  ],
  ARTISAN: [
    { signal: 'rising', text: 'Madhubani painting NFTs gaining traction — INFLOW campaign by Tribes India', impact: 'medium' },
    { signal: 'opportunity', text: 'Karigar 2026 trade fair in Patna next month — DIC subsidising stall fees' },
  ],
  MFG: [
    { signal: 'rising', text: 'BIADA industrial estate vacancies down to 4% — early signal of capex revival', impact: 'medium' },
    { signal: 'opportunity', text: 'CGTMSE collateral limit raised to ₹5Cr — more headroom for SMEs to scale' },
  ],
  SERVICE: [
    { signal: 'rising', text: 'Patna B2B service hiring up 18%; IT/BPO outsourcing demand from Delhi-NCR firms', impact: 'medium' },
  ],
  TRADE: [
    { signal: 'rising', text: 'ONDC seller commission cap announced — 4-7%, vs Amazon/Flipkart 18-25%', impact: 'high' },
  ],
  TECH: [
    { signal: 'opportunity', text: 'Bihar Startup Policy 2022 — ₹10L interest-free seed for DPIIT-recognised startups' },
  ],
  LEATHER: [
    { signal: 'rising', text: 'Footwear PLI scheme — Bihar cluster (Muzaffarpur) flagged for new ₹120Cr park' },
  ],
}

const SIGNAL_STYLE = {
  rising:      { bg: 'var(--secondary-light)', color: 'var(--secondary-dark)', ico: '📈' },
  falling:     { bg: '#fee2e2',                color: '#991b1b',                ico: '📉' },
  opportunity: { bg: 'var(--accent-light)',    color: 'var(--accent-dark)',     ico: '🎯' },
}

export default function MarketIntel() {
  const navigate = useNavigate()
  const { profile } = useApp()
  const [live, setLive] = useState(null)

  useEffect(() => {
    fetch('/api/live-data').then(r => r.json()).then(setLive).catch(() => {})
  }, [])

  const sector = profile?.sectorCode || 'MFG'
  const district = profile?.district
  const districtData = BIHAR_DISTRICTS.find(d => d.name === district)
  const insights = CLUSTER_INSIGHTS[sector] || CLUSTER_INSIGHTS.MFG

  const liveDist = live?.districts.find(d => d.name === district)

  return (
    <div className="app-shell">
      <StatusBar />
      <AppBar title="Market Intelligence" subtitle={`${profile?.sector || 'All sectors'} · ${district || 'Bihar'}`} />

      <div className="screen-scroll">
        <div className="content" style={{ paddingBottom: 76 }}>

          {districtData && (
            <div className="card-hero" style={{ padding: 16 }}>
              <div className="pattern-bg" />
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ fontSize: 36 }}>{districtData.emoji}</div>
                <div style={{ fontSize: 18, fontWeight: 900, marginTop: 6, letterSpacing: -0.2 }}>{districtData.name} cluster</div>
                <div style={{ fontSize: 11, opacity: 0.92, marginTop: 4 }}>{districtData.signature}</div>
                {liveDist && (
                  <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                    <div>
                      <div style={{ fontSize: 9.5, opacity: 0.85, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>MSMEs</div>
                      <div style={{ fontSize: 17, fontWeight: 900 }}>{(liveDist.msmes/1000).toFixed(1)}K</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 9.5, opacity: 0.85, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Disbursed</div>
                      <div style={{ fontSize: 17, fontWeight: 900 }}>₹{liveDist.disbursementCr}Cr</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 9.5, opacity: 0.85, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Stress</div>
                      <div style={{ fontSize: 17, fontWeight: 900, color: liveDist.stress === 'high' ? '#fca5a5' : liveDist.stress === 'medium' ? '#fcd34d' : '#86efac' }}>{liveDist.stress.toUpperCase()}</div>
                    </div>
                  </div>
                )}
                {liveDist?.stressReason && (
                  <div style={{ marginTop: 10, fontSize: 11, background: 'rgba(255,255,255,0.15)', padding: '7px 10px', borderRadius: 8, lineHeight: 1.45 }}>
                    🚨 AI flag: {liveDist.stressReason}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="section-title"><span>AI Market Signals</span><span className="badge-live">LIVE</span></div>

          {insights.map((it, i) => {
            const s = SIGNAL_STYLE[it.signal] || SIGNAL_STYLE.rising
            return (
              <div key={i} className="card" style={{ borderLeft: `4px solid ${s.color}` }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 22 }}>{s.ico}</span>
                  <div style={{ flex: 1 }}>
                    <span className="chip" style={{ background: s.bg, color: s.color, fontSize: 9.5, fontWeight: 800 }}>
                      {it.signal.toUpperCase()}
                    </span>
                    <div style={{ fontSize: 12.5, color: 'var(--ink)', marginTop: 6, lineHeight: 1.5 }}>{it.text}</div>
                  </div>
                </div>
              </div>
            )
          })}

          <div className="card" style={{ background: 'var(--grad-card)', borderLeft: '4px solid var(--primary)' }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--primary-dark)' }}>🤖 Drill deeper with AI</div>
            <div style={{ fontSize: 11.5, color: 'var(--ink-soft)', marginTop: 4, lineHeight: 1.5 }}>
              Ask Udyog Mitra AI for sector-level forecasts, competitor intelligence, or specific buyer leads.
            </div>
            <button
              onClick={() => navigate('/ai-chat', { state: { initialMsg: `Mere sector (${profile?.sector || sector}) aur ${district || 'Bihar'} cluster ke liye next 6 months ka detailed forecast — top opportunities, threats, aur 3 actionable steps.` } })}
              className="btn-pri"
              style={{ marginTop: 10, fontSize: 12.5, padding: '10px 14px' }}
            >🤖 Ask for 6-month forecast →</button>
          </div>

          <div style={{ height: 8 }} />
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
