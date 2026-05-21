import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import StatusBar from '../components/StatusBar'
import AppBar from '../components/AppBar'
import BottomNav from '../components/BottomNav'
import SchemeCard from '../components/SchemeCard'
import { SCHEMES, scoreScheme } from '../data/schemes'

const FILTERS = [
  { code: 'ALL',     label: 'All' },
  { code: 'TOP',     label: '🎯 Best match' },
  { code: 'STATE',   label: '🟢 Bihar State' },
  { code: 'CENTRAL', label: '🔵 Centre' },
  { code: 'SUBSIDY', label: '🎁 Subsidy' },
  { code: 'LOAN',    label: '💳 Loan' },
]

export default function SchemeMatcher() {
  const navigate = useNavigate()
  const { profile, appLanguage } = useApp()
  const [filter, setFilter] = useState('TOP')

  const scored = SCHEMES.map(s => ({ ...s, score: scoreScheme(s, profile) }))

  const visible = scored.filter(s => {
    if (filter === 'STATE') return s.issuerType === 'STATE'
    if (filter === 'CENTRAL') return s.issuerType === 'CENTRAL'
    if (filter === 'SUBSIDY') return s.subsidyPct > 0
    if (filter === 'LOAN') return s.loanMax > 0
    return true
  }).sort((a, b) => b.score - a.score)

  return (
    <div className="app-shell">
      <StatusBar />
      <AppBar
        title="AI Scheme Matcher"
        subtitle={profile?.sector ? `${profile.sector} · ${profile.district || 'Bihar'}` : 'Set profile for better matches'}
      />

      <div className="screen-scroll">
        <div className="content" style={{ paddingBottom: 76 }}>

          <div style={{ background: 'var(--primary-ghost)', border: '1px solid var(--primary-light)', borderRadius: 12, padding: '10px 12px', display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: 22 }}>🎯</span>
            <div style={{ fontSize: 11, color: 'var(--primary-dark)', lineHeight: 1.5, fontWeight: 600 }}>
              Each scheme is scored by AI against your profile (domicile, sector, stage, category, age). Higher % = better fit. Tap a card to drill in.
            </div>
          </div>

          {/* Filter chips */}
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
            {FILTERS.map(f => (
              <button
                key={f.code}
                onClick={() => setFilter(f.code)}
                className="chip"
                style={{
                  flexShrink: 0, padding: '6px 11px', fontSize: 11, fontWeight: 700, cursor: 'pointer',
                  background: filter === f.code ? 'var(--grad-hero)' : '#fff',
                  color: filter === f.code ? '#fff' : 'var(--ink-soft)',
                  border: filter === f.code ? '1.5px solid var(--primary)' : '1.5px solid var(--border)',
                }}
              >{f.label}</button>
            ))}
          </div>

          {!profile?.sector && (
            <div className="card" style={{ borderLeft: '4px solid var(--accent)', background: 'var(--accent-light)' }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--accent-dark)' }}>⚡ Make matches sharper</div>
              <div style={{ fontSize: 11.5, color: 'var(--ink-soft)', marginTop: 4, lineHeight: 1.5 }}>
                Set your sector, business stage, and social category to get accurate AI scoring.
              </div>
              <button onClick={() => navigate('/profile-setup')} className="btn-ghost" style={{ marginTop: 8, fontSize: 11 }}>Complete profile →</button>
            </div>
          )}

          {filter === 'TOP' ? visible.slice(0, 6).map(s => (
            <SchemeCard key={s.code} scheme={s} score={s.score} language={appLanguage} />
          )) : visible.map(s => (
            <SchemeCard key={s.code} scheme={s} score={s.score} language={appLanguage} />
          ))}

          <div className="card" style={{ background: 'var(--grad-card)', borderLeft: '4px solid var(--primary)' }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--primary-dark)' }}>🧑‍💼 Ask Udyog Mitra AI</div>
            <div style={{ fontSize: 11.5, color: 'var(--ink-soft)', marginTop: 4, lineHeight: 1.5 }}>
              Confused which scheme to pick? Chat with Udyog Mitra AI — it knows your full profile and can compare schemes side-by-side.
            </div>
            <button onClick={() => navigate('/ai-chat', { state: { initialMsg: 'Mere profile ke liye top 3 schemes compare karein side-by-side with eligibility, subsidy and how to apply.' } })} className="btn-pri" style={{ marginTop: 10, padding: '10px 14px', fontSize: 12.5 }}>🧑‍💼 Compare top 3 with AI →</button>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
