import { useNavigate } from 'react-router-dom'

export default function SchemeCard({ scheme, score, language = 'English' }) {
  const navigate = useNavigate()
  const name = language === 'English' ? scheme.name : (scheme.nameHi || scheme.name)
  const scorePct = score != null ? Math.round(score) : null
  const scoreColor = scorePct == null ? '' : (scorePct >= 70 ? 'var(--secondary)' : scorePct >= 40 ? 'var(--accent-dark)' : 'var(--danger)')

  return (
    <div
      className="card"
      onClick={() => navigate(`/scheme/${scheme.code}`)}
      style={{ display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer', position: 'relative' }}
    >
      {scheme.flagship && (
        <span style={{ position: 'absolute', top: 10, right: 10 }} className="chip chip-saffron">⭐ FLAGSHIP</span>
      )}
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: scheme.color || 'var(--primary)', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 22, flexShrink: 0,
      }}>{scheme.icon}</div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: 9.5, fontWeight: 800, color: scheme.issuerType === 'STATE' ? 'var(--secondary)' : 'var(--primary)', background: scheme.issuerType === 'STATE' ? 'var(--secondary-light)' : 'var(--primary-ghost)', padding: '2px 6px', borderRadius: 5 }}>
            {scheme.issuerType === 'STATE' ? '🟢 BIHAR' : '🔵 CENTRE'}
          </span>
          <span style={{ fontSize: 9.5, color: 'var(--ink-mute)', fontWeight: 600 }}>{scheme.code}</span>
        </div>
        <div style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--ink)', marginTop: 4, paddingRight: scheme.flagship ? 70 : 0 }}>{name}</div>
        <div style={{ fontSize: 11.5, color: 'var(--ink-mute)', marginTop: 4, lineHeight: 1.45 }}>{scheme.summary}</div>

        {scorePct != null && (
          <div style={{ marginTop: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontWeight: 700, color: scoreColor, marginBottom: 4 }}>
              <span>AI eligibility match</span>
              <span>{scorePct}%</span>
            </div>
            <div className="prog"><div className="prog-bar" style={{ width: `${scorePct}%`, background: scoreColor }} /></div>
          </div>
        )}

        {scheme.benefits && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 10 }}>
            {scheme.benefits.slice(0, 3).map((b, i) => (
              <span key={i} className="chip chip-neutral" style={{ fontSize: 9.5 }}>{b}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
