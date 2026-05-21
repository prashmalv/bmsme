import { useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import StatusBar from '../components/StatusBar'
import AppBar from '../components/AppBar'
import { findScheme, scoreScheme } from '../data/schemes'

export default function SchemeDetail() {
  const navigate = useNavigate()
  const { code } = useParams()
  const { profile, appLanguage } = useApp()
  const scheme = findScheme(code)

  if (!scheme) {
    return (
      <div className="app-shell">
        <StatusBar />
        <AppBar title="Scheme not found" />
        <div className="content"><div>Scheme code {code} not in our database yet.</div></div>
      </div>
    )
  }

  const score = scoreScheme(scheme, profile)
  const scoreColor = score >= 70 ? 'var(--secondary)' : score >= 40 ? 'var(--accent-dark)' : 'var(--danger)'
  const name = appLanguage === 'English' ? scheme.name : (scheme.nameHi || scheme.name)

  return (
    <div className="app-shell">
      <StatusBar light />

      <div style={{ background: scheme.color || 'var(--grad-hero)', color: '#fff', padding: '12px 16px 18px', position: 'relative', overflow: 'hidden' }}>
        <div className="pattern-bg" />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <button onClick={() => navigate(-1)} style={{ color: '#fff', background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 8, padding: '4px 10px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>← Back</button>
            <span className="chip" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', fontSize: 9.5 }}>
              {scheme.issuerType === 'STATE' ? '🟢 BIHAR STATE' : '🔵 CENTRAL'}
            </span>
            {scheme.flagship && <span className="chip" style={{ background: 'var(--accent)', color: '#3D1F00', fontSize: 9.5, fontWeight: 800 }}>⭐ FLAGSHIP</span>}
          </div>
          <div style={{ fontSize: 38, lineHeight: 1, marginBottom: 6 }}>{scheme.icon}</div>
          <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: -0.2, lineHeight: 1.2 }}>{name}</div>
          <div style={{ fontSize: 11, opacity: 0.9, marginTop: 4 }}>{scheme.issuer}</div>
        </div>
      </div>

      <div className="screen-scroll">
        <div className="content">

          <div className="card" style={{ borderLeft: `4px solid ${scoreColor}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--ink)' }}>🎯 AI eligibility match</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: scoreColor }}>{Math.round(score)}%</div>
            </div>
            <div className="prog"><div className="prog-bar" style={{ width: `${score}%`, background: scoreColor }} /></div>
            <div style={{ fontSize: 11, color: 'var(--ink-mute)', marginTop: 8, lineHeight: 1.5 }}>
              {score >= 70
                ? '✅ Strong match. AI recommends applying.'
                : score >= 40
                ? '⚠️ Partial match — kuch eligibility points dekhne padenge. AI se confirm karein.'
                : '❌ Not the best fit for your current profile.'}
            </div>
          </div>

          <div className="card">
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--ink-mute)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Summary</div>
            <div style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.55 }}>{scheme.summary}</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {scheme.loanMax > 0 && (
              <div className="kpi">
                <div className="kpi-label">Max loan</div>
                <div className="kpi-value">₹{(scheme.loanMax/100000).toFixed(0)}L</div>
              </div>
            )}
            {scheme.subsidyPct > 0 && (
              <div className="kpi">
                <div className="kpi-label">Subsidy</div>
                <div className="kpi-value">{scheme.subsidyPct}%</div>
                {scheme.subsidyMaxAmt && <div className="kpi-delta up">up to ₹{(scheme.subsidyMaxAmt/100000).toFixed(0)}L</div>}
              </div>
            )}
          </div>

          {scheme.benefits && (
            <div className="card">
              <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--ink-mute)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Key Benefits</div>
              {scheme.benefits.map((b, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginTop: 6, alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--secondary)' }}>✓</span>
                  <span style={{ fontSize: 12.5, color: 'var(--ink-soft)' }}>{b}</span>
                </div>
              ))}
            </div>
          )}

          <a href={scheme.portal} target="_blank" rel="noopener noreferrer" className="btn-pri" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, textDecoration: 'none' }}>
            🌐 Apply on official portal →
          </a>

          <button
            onClick={() => navigate('/ai-chat', { state: { initialMsg: `${name} ke baare me detail me batao — eligibility, documents, step-by-step process for someone with my profile.` } })}
            className="btn-sec"
          >🤖 Ask AI to walk me through</button>

          <button
            onClick={() => navigate('/dpr', { state: { schemeCode: scheme.code } })}
            className="btn-ghost"
            style={{ width: '100%' }}
          >📄 Build DPR for this scheme</button>

          <div style={{ height: 16 }} />
        </div>
      </div>
    </div>
  )
}
