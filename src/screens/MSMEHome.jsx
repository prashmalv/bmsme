import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import StatusBar from '../components/StatusBar'
import BottomNav from '../components/BottomNav'
import LanguageSelector from '../components/LanguageSelector'
import { BIHAR_DISTRICTS } from '../data/districts'

export default function MSMEHome() {
  const navigate = useNavigate()
  const { user, profile, logout, appLanguage } = useApp()
  const [live, setLive] = useState(null)

  useEffect(() => {
    fetch('/api/live-data').then(r => r.json()).then(setLive).catch(() => {})
  }, [])

  const district = BIHAR_DISTRICTS.find(d => d.name === profile?.district)
  const greeting = appLanguage === 'English'
    ? `Hello, ${user?.name || 'Entrepreneur'}!`
    : `नमस्कार, ${user?.name || 'उद्यमी'} जी!`

  const heroSubtitle = profile?.sector
    ? (appLanguage === 'English'
        ? `${profile.sector} · ${profile.district || 'Bihar'}`
        : `${profile.sector} · ${profile.district || 'बिहार'}`)
    : 'Apni profile complete kareiye for personalised AI advice'

  const quickActions = [
    { ico: '🧑‍💼', label: 'Udyog Mitra AI',   sub: 'Bolke ya likhke poochho',     path: '/ai-chat',         color: 'var(--grad-hero)' },
    { ico: '🎯', label: 'Scheme Matcher',   sub: 'AI eligibility scoring',     path: '/schemes',         color: 'var(--grad-green)' },
    { ico: '📄', label: 'DPR Builder',      sub: 'Bankable project report',    path: '/dpr',             color: 'var(--grad-saffron)' },
    { ico: '⚖️', label: 'File Grievance',   sub: 'MSEFC · TReDS · Single Window', path: '/grievance/new', color: 'linear-gradient(135deg,#c41e3a,#e84855)' },
    { ico: '📈', label: 'Market Intel',     sub: 'Demand · price · trends',    path: '/market',          color: 'linear-gradient(135deg,#6b21a8,#a855f7)' },
    { ico: '📩', label: 'My Grievances',    sub: 'Track applications',         path: '/grievances',      color: 'linear-gradient(135deg,#0f766e,#14b8a6)' },
  ]

  return (
    <div className="app-shell">
      <StatusBar light />

      {/* Header */}
      <div style={{ background: 'var(--grad-hero)', padding: '12px 16px 18px', color: '#fff', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
        <div className="pattern-bg" />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="avatar-circle" style={{ background: 'rgba(255,255,255,0.18)', border: '2px solid rgba(255,255,255,0.3)', fontSize: 14 }}>{user?.initials || 'NN'}</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: -0.2 }}>{greeting}</div>
                <div style={{ fontSize: 10.5, opacity: 0.9, marginTop: 1 }}>{heroSubtitle}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <LanguageSelector light />
              <button onClick={logout} style={{ background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 8, color: '#fff', fontSize: 10, fontWeight: 700, padding: '4px 8px', cursor: 'pointer' }}>Logout</button>
            </div>
          </div>

        </div>
      </div>

      <div className="screen-scroll">
        <div className="content" style={{ paddingBottom: 76 }}>

          {/* Live ecosystem KPIs */}
          <div className="section-title">
            <span>Bihar MSME · Live</span>
            <span className="badge-live">LIVE</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {live ? (
              <>
                <div className="kpi">
                  <div className="kpi-label">Udyam in Bihar</div>
                  <div className="kpi-value">{(live.state.udyamRegistrations/1000).toFixed(1)}K</div>
                  <div className="kpi-delta up">+{live.state.todayNewRegistrations} today</div>
                </div>
                <div className="kpi">
                  <div className="kpi-label">Active schemes</div>
                  <div className="kpi-value">{live.state.activeSchemes}</div>
                  <div className="kpi-delta up">Central + State</div>
                </div>
                <div className="kpi">
                  <div className="kpi-label">RAMP disbursed</div>
                  <div className="kpi-value">₹{live.state.rampDisbursedCr}Cr</div>
                  <div className="kpi-delta up">of ₹{live.state.rampTargetCr}Cr</div>
                </div>
                <div className="kpi">
                  <div className="kpi-label">Women-led MSMEs</div>
                  <div className="kpi-value">{live.state.femaleEntrepreneursPct}%</div>
                  <div className="kpi-delta up">All-time high</div>
                </div>
              </>
            ) : (
              [...Array(4)].map((_, i) => <div key={i} className="kpi shimmer" style={{ height: 70 }} />)
            )}
          </div>

          {/* Cluster card for user's district */}
          {district && (
            <div className="card" style={{ display: 'flex', gap: 12, alignItems: 'flex-start', background: 'var(--grad-card)' }}>
              <div style={{ fontSize: 38, lineHeight: 1 }}>{district.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--ink-mute)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Your cluster</div>
                <div style={{ fontSize: 15, fontWeight: 900, color: 'var(--ink)', marginTop: 2 }}>{district.name}</div>
                <div style={{ fontSize: 11.5, color: 'var(--ink-soft)', marginTop: 4, lineHeight: 1.45 }}>{district.signature}</div>
                <button onClick={() => navigate('/market')} className="btn-ghost" style={{ marginTop: 8, fontSize: 11 }}>📈 Cluster intelligence →</button>
              </div>
            </div>
          )}

          {/* Quick actions */}
          <div className="section-title"><span>AI Copilot Actions</span></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {quickActions.map(a => (
              <button
                key={a.label}
                onClick={() => navigate(a.path)}
                style={{
                  background: a.color, color: '#fff', border: 'none',
                  borderRadius: 14, padding: 14, textAlign: 'left',
                  boxShadow: 'var(--shadow-1)', cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', gap: 6, minHeight: 110,
                }}
              >
                <span style={{ fontSize: 24 }}>{a.ico}</span>
                <div style={{ fontSize: 13, fontWeight: 800 }}>{a.label}</div>
                <div style={{ fontSize: 10, opacity: 0.92, lineHeight: 1.4 }}>{a.sub}</div>
              </button>
            ))}
          </div>

          {/* Top schemes nudge */}
          {live?.schemes && (
            <>
              <div className="section-title"><span>Trending Schemes This Month</span></div>
              <div className="card" style={{ padding: 0 }}>
                {live.schemes.slice(0, 4).map((s, i) => (
                  <div key={s.code}
                    onClick={() => navigate(`/scheme/${s.code}`)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '12px 14px', cursor: 'pointer',
                      borderBottom: i < 3 ? '1px solid var(--soft)' : 'none',
                    }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--primary-ghost)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 11, flexShrink: 0 }}>{s.code}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--ink)' }}>{s.name}</div>
                      <div style={{ fontSize: 10.5, color: 'var(--ink-mute)', marginTop: 2 }}>
                        {s.applicationsThisMonth.toLocaleString('en-IN')} applied · ₹{s.disbursedThisMonth} Cr disbursed
                      </div>
                    </div>
                    <span style={{ fontSize: 16, color: 'var(--ink-mute)' }}>→</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Anomaly alert (proof point AI is alive) */}
          {live?.anomalies?.length > 0 && (
            <div className="card" style={{ borderLeft: '4px solid var(--accent)', background: 'linear-gradient(180deg, var(--accent-light) 0%, #fff 60%)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 18 }}>📡</span>
                <div style={{ fontSize: 12, fontWeight: 900, color: 'var(--accent-dark)' }}>AI Anomaly Detection</div>
                <span className="chip chip-saffron" style={{ marginLeft: 'auto', fontSize: 9 }}>NEW</span>
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--ink-soft)', marginTop: 8, lineHeight: 1.5 }}>
                {live.anomalies[0].text}
              </div>
              <button onClick={() => navigate('/ai-chat')} className="btn-ghost" style={{ marginTop: 10, fontSize: 11 }}>Ask AI for context →</button>
            </div>
          )}

          {!profile?.sector && (
            <div className="card" style={{ borderLeft: '4px solid var(--secondary)', background: 'var(--secondary-light)' }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--secondary-dark)' }}>🎯 Personalise your AI</div>
              <div style={{ fontSize: 11.5, color: 'var(--ink-soft)', marginTop: 4, lineHeight: 1.5 }}>
                Apna sector aur district batayein — Udyog Mitra AI tab har scheme, loan, training tailored degi.
              </div>
              <button onClick={() => navigate('/profile-setup')} className="btn-sec" style={{ marginTop: 10, fontSize: 12, padding: '8px 12px', width: 'auto', display: 'inline-block' }}>
                Complete profile →
              </button>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
