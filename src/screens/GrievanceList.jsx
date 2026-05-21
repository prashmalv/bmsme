import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import StatusBar from '../components/StatusBar'
import AppBar from '../components/AppBar'
import BottomNav from '../components/BottomNav'

const STATUS_STYLE = {
  OPEN:        { color: 'var(--accent-dark)', bg: 'var(--accent-light)',    label: '⏳ Open' },
  IN_PROGRESS: { color: 'var(--primary)',      bg: 'var(--primary-ghost)',   label: '🔄 In progress' },
  RESOLVED:    { color: 'var(--secondary-dark)', bg: 'var(--secondary-light)', label: '✅ Resolved' },
}

export default function GrievanceList() {
  const navigate = useNavigate()
  const { grievances } = useApp()

  return (
    <div className="app-shell">
      <StatusBar />
      <AppBar title="My Grievances" subtitle={`${grievances.length} filed`} />

      <div className="screen-scroll">
        <div className="content" style={{ paddingBottom: 76 }}>

          <button onClick={() => navigate('/grievance/new')} className="btn-pri">⚖️ File new grievance</button>

          {grievances.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 24 }}>
              <div style={{ fontSize: 40 }}>📭</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--ink)', marginTop: 6 }}>No grievances filed yet</div>
              <div style={{ fontSize: 11, color: 'var(--ink-mute)', marginTop: 4, lineHeight: 1.5 }}>
                Tap "File new grievance" to use the AI auto-router (MSEFC, TReDS, Single Window etc.)
              </div>
            </div>
          ) : (
            grievances.map(g => {
              const st = STATUS_STYLE[g.status] || STATUS_STYLE.OPEN
              return (
                <div key={g.id} className="card" style={{ borderLeft: `4px solid ${st.color}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--ink-mute)', letterSpacing: 0.4 }}>{g.id}</div>
                    <span className="chip" style={{ background: st.bg, color: st.color, fontSize: 9.5 }}>{st.label}</span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--ink)', marginTop: 5 }}>{g.categoryLabel}</div>
                  <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 4, lineHeight: 1.5 }}>
                    <b>Against:</b> {g.against || '—'} {g.amount ? `· ₹${g.amount}` : ''}
                  </div>
                  <div style={{ fontSize: 10.5, color: 'var(--ink-mute)', marginTop: 6, lineHeight: 1.45 }}>
                    🧑‍💼 Routed to: <b>{g.route}</b>
                  </div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                    <a href={g.portal} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ flex: 1, textDecoration: 'none', textAlign: 'center' }}>🌐 Open portal</a>
                    <button onClick={() => navigate('/ai-chat', { state: { initialMsg: `${g.id} grievance ke baare me — kya hua ab tak, aur next steps?` } })} className="btn-ghost" style={{ flex: 1 }}>🧑‍💼 Ask AI</button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
