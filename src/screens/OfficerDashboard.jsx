import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import StatusBar from '../components/StatusBar'
import AppBar from '../components/AppBar'
import RenderText from '../components/RenderText'

// Synthetic incoming queue — illustrates the AI-triaged inbox concept
const QUEUE = [
  {
    id: 'APP-2026-09128', applicant: 'Sunita Devi', scheme: 'MMUY', sector: 'Madhubani painting',
    district: 'Madhubani', flag: 'green', flagText: 'Strong match · all docs present · category fit',
    submittedAt: '2 hrs ago', amount: '₹6.5L',
  },
  {
    id: 'APP-2026-09127', applicant: 'Rajesh Mishra', scheme: 'PMEGP', sector: 'Furniture mfg',
    district: 'Patna', flag: 'amber', flagText: 'GST filings irregular · verify last 2 quarters before approval',
    submittedAt: '5 hrs ago', amount: '₹18L',
  },
  {
    id: 'APP-2026-09126', applicant: 'Mohd. Imran', scheme: 'PMFME', sector: 'Litchi processing',
    district: 'Muzaffarpur', flag: 'green', flagText: 'FPO-backed application · cluster aligned · ODOP eligible',
    submittedAt: '7 hrs ago', amount: '₹9.2L',
  },
  {
    id: 'APP-2026-09125', applicant: 'Anand Pratap', scheme: 'MMUY', sector: 'Auto repair',
    district: 'Gaya', flag: 'red', flagText: 'Duplicate Udyam detected · same Aadhaar applied 2x in 90 days',
    submittedAt: '9 hrs ago', amount: '₹10L',
  },
  {
    id: 'APP-2026-09124', applicant: 'Geeta Kumari', scheme: 'STANDUP', sector: 'Tailoring service',
    district: 'Bhojpur', flag: 'green', flagText: 'SC category, woman entrepreneur, greenfield — exemplary fit',
    submittedAt: '11 hrs ago', amount: '₹12L',
  },
]

const STRESSED = [
  { unit: 'Maa Silk Weavers',  district: 'Bhagalpur',   reason: 'GST e-way bills -34% MoM',     severity: 'high' },
  { unit: 'Aman Foods',         district: 'Muzaffarpur', reason: 'Payment overdue ₹4.2L · 60 days', severity: 'high' },
  { unit: 'Krishna Brass',      district: 'Nalanda',     reason: 'EPF filing irregular last quarter', severity: 'medium' },
  { unit: 'Bharat Stones',      district: 'Aurangabad',  reason: 'Power bill default · risk of disconnection', severity: 'medium' },
]

const FLAG_STYLE = {
  green: { bg: 'var(--secondary-light)', color: 'var(--secondary-dark)', ico: '✅' },
  amber: { bg: 'var(--accent-light)',    color: 'var(--accent-dark)',    ico: '⚠️' },
  red:   { bg: '#fee2e2',                color: '#991b1b',                ico: '🚨' },
}

async function callAI({ messages, persona, language }) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, persona, language, userProfile: { persona: 'DIC Officer' } }),
  })
  const data = await res.json()
  if (!res.ok || data.error) throw new Error(data.error || 'AI error')
  return data.reply
}

export default function OfficerDashboard() {
  const navigate = useNavigate()
  const { appLanguage } = useApp()
  const [tab, setTab] = useState('queue')
  const [askOpen, setAskOpen] = useState(false)
  const [msgs, setMsgs] = useState([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs, typing])

  const ask = async (text) => {
    const msg = (text || input).trim()
    if (!msg || typing) return
    setInput('')
    const hist = [...msgs, { from: 'user', text: msg }]
    setMsgs(hist)
    setTyping(true)
    try {
      const reply = await callAI({ messages: hist, persona: 'OFFICER', language: appLanguage })
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
        variant="officer"
        title="DIC Officer Console"
        subtitle="District · Patna · MSME Coordinator"
        onBack={() => navigate('/persona')}
      />

      {/* KPI strip */}
      <div style={{ background: 'linear-gradient(180deg,#091e3c,#0f3263)', padding: '12px 14px', display: 'flex', gap: 8, flexShrink: 0, overflowX: 'auto' }}>
        {[
          { label: 'Pending review', val: '127', d: '+12 today',  color: '#fcd34d' },
          { label: 'AI-flagged red',  val: '14',  d: 'investigate', color: '#fca5a5' },
          { label: 'Stressed units',  val: '38',  d: 'this month',  color: '#fdba74' },
          { label: 'Disbursed (Apr)', val: '₹42Cr', d: '94% target', color: '#86efac' },
        ].map(k => (
          <div key={k.label} style={{ minWidth: 130, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, padding: '10px 12px', color: '#fff', flexShrink: 0 }}>
            <div style={{ fontSize: 10, opacity: 0.8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>{k.label}</div>
            <div style={{ fontSize: 20, fontWeight: 900, marginTop: 2 }}>{k.val}</div>
            <div style={{ fontSize: 10, color: k.color, marginTop: 2, fontWeight: 700 }}>{k.d}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, padding: '10px 14px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        {[
          { code: 'queue',   label: '📥 AI-triaged queue' },
          { code: 'stress',  label: '🚨 Stressed MSMEs' },
          { code: 'clusters',label: '📊 Grievance clusters' },
        ].map(t => (
          <button
            key={t.code}
            onClick={() => setTab(t.code)}
            className="chip"
            style={{
              padding: '6px 11px', fontSize: 11, fontWeight: 700, cursor: 'pointer',
              background: tab === t.code ? 'var(--primary)' : 'var(--soft)',
              color: tab === t.code ? '#fff' : 'var(--ink-soft)',
              border: 'none',
            }}
          >{t.label}</button>
        ))}
      </div>

      <div className="screen-scroll">
        <div className="content" style={{ paddingBottom: 80 }}>

          {tab === 'queue' && (
            <>
              <div style={{ background: 'var(--primary-ghost)', border: '1px solid var(--primary-light)', borderRadius: 12, padding: '10px 12px', display: 'flex', gap: 10, alignItems: 'center' }}>
                <span style={{ fontSize: 20 }}>🧑‍💼</span>
                <div style={{ fontSize: 11, color: 'var(--primary-dark)', lineHeight: 1.5, fontWeight: 600 }}>
                  AI pre-screens every application — green/amber/red flags with reasoning. Focus on reds first.
                </div>
              </div>

              {QUEUE.map(a => {
                const f = FLAG_STYLE[a.flag]
                return (
                  <div key={a.id} className="card" style={{ borderLeft: `4px solid ${f.color}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--ink-mute)', letterSpacing: 0.4 }}>{a.id}</span>
                      <span className="chip" style={{ background: f.bg, color: f.color, fontSize: 9.5, fontWeight: 800 }}>{f.ico} {a.flag.toUpperCase()}</span>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--ink)' }}>{a.applicant} <span style={{ fontWeight: 600, fontSize: 12, color: 'var(--ink-mute)' }}>· {a.scheme}</span></div>
                    <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 4 }}>{a.sector} · {a.district} · {a.amount}</div>
                    <div style={{ fontSize: 11, color: f.color, marginTop: 8, lineHeight: 1.5, fontWeight: 600, background: f.bg, padding: '6px 10px', borderRadius: 8 }}>
                      🧑‍💼 {a.flagText}
                    </div>
                    <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                      <button className="btn-ghost" style={{ flex: 1 }}>👀 Review</button>
                      {a.flag === 'green' && <button className="btn-pri" style={{ flex: 1, padding: '8px 12px', fontSize: 12 }}>✅ Approve</button>}
                      {a.flag === 'red' && <button className="btn-ghost" style={{ flex: 1, color: '#991b1b' }}>🚨 Escalate</button>}
                    </div>
                  </div>
                )
              })}
            </>
          )}

          {tab === 'stress' && (
            <>
              <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 12, padding: '10px 12px', display: 'flex', gap: 10, alignItems: 'center' }}>
                <span style={{ fontSize: 20 }}>⚠️</span>
                <div style={{ fontSize: 11, color: '#991b1b', lineHeight: 1.5, fontWeight: 700 }}>
                  AI ne yeh MSMEs ko risk pe flag kiya — drop in GST filings, EPF irregular, payment overdue. Proactive outreach kareiye.
                </div>
              </div>

              {STRESSED.map((s, i) => (
                <div key={i} className="card" style={{ borderLeft: `4px solid ${s.severity === 'high' ? 'var(--danger)' : 'var(--accent-dark)'}` }}>
                  <div style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--ink)' }}>{s.unit}</div>
                  <div style={{ fontSize: 11, color: 'var(--ink-mute)', marginTop: 3 }}>📍 {s.district}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--ink-soft)', marginTop: 8, lineHeight: 1.5 }}>
                    <b>Why flagged:</b> {s.reason}
                  </div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                    <button className="btn-ghost" style={{ flex: 1 }}>📞 Outreach</button>
                    <button className="btn-ghost" style={{ flex: 1 }}>📋 Add to watchlist</button>
                  </div>
                </div>
              ))}
            </>
          )}

          {tab === 'clusters' && (
            <>
              <div className="card">
                <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--ink-mute)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>This week · 247 grievances clustered into 6 themes</div>
                {[
                  { theme: 'Delayed payment from outside-state buyers', n: 78, ratio: 32 },
                  { theme: 'MMUY application stuck in bank verification', n: 54, ratio: 22 },
                  { theme: 'GST refund not received', n: 41, ratio: 17 },
                  { theme: 'Power supply quality at industrial estate', n: 32, ratio: 13 },
                  { theme: 'Skill training capacity at MSME-DI', n: 24, ratio: 10 },
                  { theme: 'Misc', n: 18, ratio: 6 },
                ].map((c, i) => (
                  <div key={i} style={{ marginTop: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, fontWeight: 700, color: 'var(--ink)' }}>
                      <span>{c.theme}</span>
                      <span style={{ color: 'var(--ink-mute)' }}>{c.n} ({c.ratio}%)</span>
                    </div>
                    <div className="prog" style={{ marginTop: 4 }}><div className="prog-bar" style={{ width: `${c.ratio*2}%` }} /></div>
                  </div>
                ))}
              </div>
              <div className="card" style={{ background: 'var(--accent-light)', borderLeft: '4px solid var(--accent)' }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--accent-dark)' }}>🎯 AI Recommendation</div>
                <div style={{ fontSize: 11.5, color: 'var(--ink-soft)', marginTop: 6, lineHeight: 1.55 }}>
                  Top 2 themes account for <b>54%</b> of grievances. Run a targeted MSEFC bulk-conciliation drive AND a workshop with district lead bank to clear MMUY pipeline. Estimated impact: +320 resolutions in 30 days.
                </div>
              </div>
            </>
          )}

        </div>
      </div>

      {/* Floating Ask AI */}
      <button onClick={() => setAskOpen(o => !o)} style={{
        position: 'fixed', bottom: 18, right: 'calc(max(16px, (100vw - 440px) / 2 + 16px))',
        width: 54, height: 54, borderRadius: '50%', background: 'var(--grad-hero)', color: '#fff',
        border: 'none', boxShadow: 'var(--shadow-2)', fontSize: 22, cursor: 'pointer', zIndex: 100,
      }}>🧑‍💼</button>

      {askOpen && (
        <div style={{
          position: 'fixed', bottom: 80, right: 'calc(max(12px, (100vw - 440px) / 2 + 12px))',
          width: 'min(380px, calc(100vw - 24px))', maxHeight: '70vh',
          background: '#fff', border: '1px solid var(--border)', borderRadius: 16,
          boxShadow: '0 16px 40px rgba(0,0,0,0.25)', zIndex: 101,
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>
          <div style={{ background: 'var(--grad-hero)', color: '#fff', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 18 }}>🧑‍💼</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 800 }}>Officer AI Assistant</div>
              <div style={{ fontSize: 10, opacity: 0.85 }}>Triaging · pattern detection · policy lookup</div>
            </div>
            <button onClick={() => setAskOpen(false)} style={{ background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 6, padding: '3px 8px', color: '#fff', fontSize: 14, cursor: 'pointer' }}>×</button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 8, background: 'var(--soft)' }}>
            {msgs.length === 0 && (
              <div style={{ fontSize: 11.5, color: 'var(--ink-mute)', textAlign: 'center', padding: 16, lineHeight: 1.5 }}>
                Try: "Show me top stressed units in Patna" or "Why is MMUY pipeline slow this week?"
              </div>
            )}
            {msgs.map((m, i) => m.from === 'bot'
              ? <div key={i} className="chat-msg-bot"><div className="chat-avatar" style={{ width: 26, height: 26, fontSize: 12 }}>🧑‍💼</div><div className="chat-bubble-bot" style={{ fontSize: 12 }}><RenderText text={m.text} /></div></div>
              : <div key={i} className="chat-msg-user"><div className="chat-bubble-user" style={{ fontSize: 12 }}>{m.text}</div></div>
            )}
            {typing && <div className="chat-msg-bot"><div className="chat-avatar" style={{ width: 26, height: 26, fontSize: 12 }}>🧑‍💼</div><div className="chat-bubble-bot"><div className="ai-thinking"><span/><span/><span/></div></div></div>}
            <div ref={bottomRef} />
          </div>
          <div style={{ padding: 8, borderTop: '1px solid var(--border)', background: '#fff', display: 'flex', gap: 6 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && ask()}
              placeholder="Ask officer AI…"
              style={{ flex: 1, padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 16, fontSize: 12.5, outline: 'none' }}
            />
            <button onClick={() => ask()} style={{ background: 'var(--grad-hero)', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 16, fontWeight: 800, fontSize: 12, cursor: 'pointer' }}>Ask</button>
          </div>
        </div>
      )}
    </div>
  )
}
