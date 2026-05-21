import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import StatusBar from '../components/StatusBar'
import AppBar from '../components/AppBar'
import RenderText from '../components/RenderText'

const BRIEFING_TEMPLATES = [
  '🌅 Aaj ka morning briefing — top 3 cheezein',
  '🚨 Anomalies in last 24 hrs',
  '🏆 Best performing districts this week',
  '⚠️ Show stressed clusters — root causes',
  '💡 If I add ₹50 Cr to MMUY, expected outcomes',
  '🎯 RAMP convergence — Centre + State alignment',
  '📊 Centre vs other states — Bihar position',
]

async function callAI({ messages, persona, language }) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, persona, language, userProfile: { persona: 'Secretary' } }),
  })
  const data = await res.json()
  if (!res.ok || data.error) throw new Error(data.error || 'AI error')
  return data.reply
}

export default function SecretaryCockpit() {
  const navigate = useNavigate()
  const { appLanguage } = useApp()
  const [live, setLive] = useState(null)
  const [msgs, setMsgs] = useState([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    fetch('/api/live-data').then(r => r.json()).then(setLive).catch(() => {})
  }, [])
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs, typing])

  const ask = async (text) => {
    const msg = (text || input).trim()
    if (!msg || typing) return
    setInput('')
    const hist = [...msgs, { from: 'user', text: msg }]
    setMsgs(hist)
    setTyping(true)
    try {
      const reply = await callAI({ messages: hist, persona: 'SECRETARY', language: appLanguage })
      setMsgs(prev => [...prev, { from: 'bot', text: reply }])
    } catch {
      setMsgs(prev => [...prev, { from: 'bot', text: '⚠️ AI unavailable.' }])
    }
    setTyping(false)
  }

  return (
    <div className="app-shell">
      <StatusBar light />
      <AppBar
        variant="grad"
        title="Ask Bihar · Executive Cockpit"
        subtitle="Secretary · Department of Industries"
        onBack={() => navigate('/persona')}
      />

      <div className="screen-scroll">
        <div className="content" style={{ paddingBottom: 16 }}>

          <div className="card-hero" style={{ padding: 16 }}>
            <div className="pattern-bg" />
            <div style={{ position: 'relative', zIndex: 2 }}>
              <span className="chip" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', fontSize: 9.5 }}>🇮🇳 STATE INTEL</span>
              <div style={{ fontSize: 17, fontWeight: 900, marginTop: 8, letterSpacing: -0.2 }}>Aaj Bihar MSME ki health</div>
              {live ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 12 }}>
                  <div>
                    <div style={{ fontSize: 9.5, opacity: 0.85, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Cumulative Udyam</div>
                    <div style={{ fontSize: 22, fontWeight: 900 }}>{(live.state.udyamRegistrations/1000).toFixed(1)}K</div>
                    <div style={{ fontSize: 10, color: '#86efac' }}>+{live.state.todayNewRegistrations} today</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 9.5, opacity: 0.85, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>RAMP progress</div>
                    <div style={{ fontSize: 22, fontWeight: 900 }}>₹{live.state.rampDisbursedCr}Cr</div>
                    <div style={{ fontSize: 10, color: '#fcd34d' }}>{Math.round((live.state.rampDisbursedCr / live.state.rampTargetCr) * 100)}% of ₹{live.state.rampTargetCr}Cr</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 9.5, opacity: 0.85, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>MSEFC open</div>
                    <div style={{ fontSize: 22, fontWeight: 900 }}>{live.state.msefcOpenCases.toLocaleString('en-IN')}</div>
                    <div style={{ fontSize: 10, color: '#fcd34d' }}>{live.state.avgResolutionDays} days avg</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 9.5, opacity: 0.85, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Women-led</div>
                    <div style={{ fontSize: 22, fontWeight: 900 }}>{live.state.femaleEntrepreneursPct}%</div>
                    <div style={{ fontSize: 10, color: '#86efac' }}>all-time high</div>
                  </div>
                </div>
              ) : <div className="shimmer" style={{ height: 100, borderRadius: 10, marginTop: 12 }} />}
            </div>
          </div>

          {/* Anomaly stream */}
          <div className="section-title"><span>AI Anomaly Stream</span><span className="badge-live">LIVE</span></div>
          {live?.anomalies.map(a => (
            <div key={a.id} className="card" style={{ borderLeft: `4px solid ${a.severity === 'high' ? 'var(--danger)' : a.severity === 'medium' ? 'var(--accent-dark)' : 'var(--secondary)'}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="chip" style={{ background: a.severity === 'high' ? '#fee2e2' : a.severity === 'medium' ? 'var(--accent-light)' : 'var(--secondary-light)', color: a.severity === 'high' ? '#991b1b' : a.severity === 'medium' ? 'var(--accent-dark)' : 'var(--secondary-dark)', fontSize: 9.5, fontWeight: 800 }}>
                  {a.severity.toUpperCase()}
                </span>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--ink-mute)' }}>📍 {a.district}</span>
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--ink)', marginTop: 6, lineHeight: 1.5 }}>{a.text}</div>
              <button onClick={() => ask(`Root-cause analysis for: ${a.text}`)} className="btn-ghost" style={{ marginTop: 8, fontSize: 11 }}>🧑‍💼 AI root-cause →</button>
            </div>
          ))}

          {/* District table */}
          {live?.districts && (
            <>
              <div className="section-title"><span>Top Districts · Disbursement</span></div>
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table className="tbl">
                  <thead><tr><th>District</th><th>MSMEs</th><th>₹Cr</th><th>Stress</th></tr></thead>
                  <tbody>
                    {live.districts.map(d => (
                      <tr key={d.name}>
                        <td><b>{d.name}</b></td>
                        <td>{(d.msmes/1000).toFixed(1)}K</td>
                        <td>₹{d.disbursementCr}</td>
                        <td>
                          <span className="chip" style={{ fontSize: 9, padding: '2px 6px',
                            background: d.stress === 'high' ? '#fee2e2' : d.stress === 'medium' ? 'var(--accent-light)' : 'var(--secondary-light)',
                            color:      d.stress === 'high' ? '#991b1b' : d.stress === 'medium' ? 'var(--accent-dark)' : 'var(--secondary-dark)' }}>
                            {d.stress}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Ask Bihar AI */}
          <div className="section-title"><span>🧑‍💼 Ask Bihar — Conversational Intelligence</span></div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {BRIEFING_TEMPLATES.map(q => (
              <button key={q} onClick={() => ask(q)} className="chip chip-neutral" style={{ fontSize: 10.5, padding: '6px 10px', cursor: 'pointer', whiteSpace: 'normal', textAlign: 'left' }}>{q}</button>
            ))}
          </div>

          <div className="card" style={{ padding: 0, overflow: 'hidden', minHeight: msgs.length || typing ? 280 : 0 }}>
            {msgs.length === 0 && !typing ? null : (
              <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8, background: 'var(--soft)' }}>
                {msgs.map((m, i) => m.from === 'bot'
                  ? <div key={i} className="chat-msg-bot"><div className="chat-avatar">🧑‍💼</div><div className="chat-bubble-bot"><RenderText text={m.text} /></div></div>
                  : <div key={i} className="chat-msg-user"><div className="chat-bubble-user">{m.text}</div></div>
                )}
                {typing && <div className="chat-msg-bot"><div className="chat-avatar">🧑‍💼</div><div className="chat-bubble-bot"><div className="ai-thinking"><span/><span/><span/></div></div></div>}
                <div ref={bottomRef} />
              </div>
            )}
            <div style={{ display: 'flex', gap: 6, padding: 10, borderTop: msgs.length ? '1px solid var(--border)' : 'none' }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && ask()}
                placeholder="Bihar ki MSME health pe koi bhi sawaal poochho…"
                style={{ flex: 1, padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: 24, fontSize: 13, outline: 'none', background: 'var(--soft)' }}
              />
              <button onClick={() => ask()} style={{ background: 'var(--grad-hero)', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: 24, fontWeight: 800, fontSize: 12.5, cursor: 'pointer' }}>Ask</button>
            </div>
          </div>

          <div style={{ height: 12 }} />
        </div>
      </div>
    </div>
  )
}
