import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import StatusBar from '../components/StatusBar'
import AppBar from '../components/AppBar'
import RenderText from '../components/RenderText'

const STEPS = [
  { key: 'idea',      q: 'Aap kya banayenge / kya service denge? (1-2 line me batao)', placeholder: 'e.g. Bhagalpuri silk sarees — 200 units/month — sell online aur retail to Patna stores' },
  { key: 'investment', q: 'Kitna paisa total invest karenge? (machinery + raw material + working capital)', placeholder: 'e.g. ₹15 lakh' },
  { key: 'capacity',  q: 'Aapki production capacity kya hogi (units per month or revenue per month)?', placeholder: 'e.g. 200 sarees per month at ₹3,500 average' },
  { key: 'team',      q: 'Kitne log kaam karenge (aap + employees)?', placeholder: 'e.g. Khud + 4 weavers + 1 helper' },
  { key: 'market',    q: 'Aapke customers / market kahaan hoga?', placeholder: 'e.g. Local Bhagalpur retailers + Amazon/Flipkart + GeM' },
]

async function generateDPR({ profile, answers, scheme, language }) {
  const messages = [
    { from: 'user', text: `I want a bankable Detailed Project Report (DPR) for a loan application. Generate it now with all standard sections (executive summary, promoter background, project description, market analysis, technical feasibility, financial projections (3 yrs), break-even analysis, risk analysis, conclusion). Use realistic numbers based on the inputs below. Format as clean markdown with ## headings.

INPUTS:
- Business idea: ${answers.idea || 'not provided'}
- Total investment: ${answers.investment || 'not provided'}
- Production capacity: ${answers.capacity || 'not provided'}
- Team: ${answers.team || 'not provided'}
- Market: ${answers.market || 'not provided'}
- Sector: ${profile?.sector || 'not provided'}
- District: ${profile?.district || 'not provided'}
- Stage: ${profile?.stage || 'not provided'}
${scheme ? `- Target scheme: ${scheme}` : ''}

Generate a complete DPR.` },
  ]
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, userProfile: profile, language, persona: 'MSME' }),
  })
  const data = await res.json()
  if (!res.ok || data.error) throw new Error(data.error || 'AI error')
  return data.reply
}

export default function DPRBuilder() {
  const navigate = useNavigate()
  const location = useLocation()
  const { profile, appLanguage, showToast } = useApp()
  const targetScheme = location.state?.schemeCode

  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [draft, setDraft] = useState('')
  const [val, setVal] = useState('')
  const [busy, setBusy] = useState(false)

  const cur = STEPS[step]

  const next = () => {
    if (!val.trim()) return
    const updated = { ...answers, [cur.key]: val.trim() }
    setAnswers(updated)
    setVal('')
    if (step < STEPS.length - 1) {
      setStep(step + 1)
    } else {
      runAI(updated)
    }
  }

  const runAI = async (final) => {
    setBusy(true)
    setStep(STEPS.length)
    try {
      const txt = await generateDPR({ profile, answers: final, scheme: targetScheme, language: appLanguage })
      setDraft(txt)
    } catch (err) {
      setDraft(`⚠️ AI temporarily unavailable — code: ${err.message}. Aap fields update karke phir try karein.`)
    } finally {
      setBusy(false)
    }
  }

  const copyDraft = async () => {
    try {
      await navigator.clipboard.writeText(draft)
      showToast('DPR copied to clipboard')
    } catch {
      showToast('Copy failed · select text manually')
    }
  }

  const restart = () => {
    setStep(0); setAnswers({}); setDraft(''); setVal('')
  }

  return (
    <div className="app-shell">
      <StatusBar />
      <AppBar
        title="AI DPR Builder"
        subtitle={targetScheme ? `For ${targetScheme} application` : 'Bankable Detailed Project Report'}
      />

      <div className="screen-scroll">
        <div className="content">

          <div style={{ background: 'var(--accent-light)', border: '1px solid var(--accent)', borderRadius: 12, padding: '10px 12px', display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: 22 }}>📄</span>
            <div style={{ fontSize: 11, color: 'var(--accent-dark)', lineHeight: 1.5, fontWeight: 700 }}>
              5 simple sawaal — AI poora bankable DPR generate kar dega (executive summary, financials, market analysis, break-even, risk).
            </div>
          </div>

          {/* Progress */}
          {step < STEPS.length && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 700, color: 'var(--ink-mute)', marginBottom: 6 }}>
                <span>Step {step + 1} of {STEPS.length}</span>
                <span>{Math.round(((step) / STEPS.length) * 100)}%</span>
              </div>
              <div className="prog"><div className="prog-bar" style={{ width: `${(step / STEPS.length) * 100}%` }} /></div>
            </div>
          )}

          {step < STEPS.length ? (
            <div className="card" style={{ background: 'var(--grad-card)' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--primary-dark)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Question {step + 1}</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--ink)', marginTop: 6, lineHeight: 1.4 }}>{cur.q}</div>
              <div className="input focused" style={{ marginTop: 12 }}>
                <textarea
                  placeholder={cur.placeholder}
                  value={val}
                  onChange={e => setVal(e.target.value)}
                  rows={3}
                  style={{ resize: 'none', width: '100%', border: 'none', outline: 'none', fontSize: 13, color: 'var(--ink)', background: 'transparent' }}
                />
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                {step > 0 && <button onClick={() => setStep(step - 1)} className="btn-ghost" style={{ flex: 1 }}>← Back</button>}
                <button onClick={next} className="btn-pri" disabled={!val.trim()} style={{ flex: 2 }}>
                  {step === STEPS.length - 1 ? '🤖 Generate DPR with AI →' : 'Next →'}
                </button>
              </div>
            </div>
          ) : busy ? (
            <div className="card" style={{ textAlign: 'center', padding: 24 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📄</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--ink)' }}>AI is drafting your DPR…</div>
              <div className="ai-thinking" style={{ marginTop: 12 }}><span /><span /><span /></div>
              <div style={{ fontSize: 11, color: 'var(--ink-mute)', marginTop: 14, lineHeight: 1.5 }}>
                Executive summary · market analysis · financial projections · break-even · risk… <br/>≈ 15 seconds
              </div>
            </div>
          ) : (
            <>
              <div className="card" style={{ background: 'var(--secondary-light)', borderLeft: '4px solid var(--secondary)' }}>
                <div style={{ fontSize: 12, fontWeight: 900, color: 'var(--secondary-dark)' }}>✅ AI-generated bankable DPR draft</div>
                <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 4, lineHeight: 1.5 }}>
                  Copy → paste in MS Word / Google Docs → sign → submit to bank. Review the financial assumptions before signing.
                </div>
              </div>
              <div className="card">
                <RenderText text={draft} />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={copyDraft} className="btn-pri" style={{ flex: 2 }}>📋 Copy DPR</button>
                <button onClick={restart} className="btn-ghost" style={{ flex: 1 }}>↺ Redo</button>
              </div>
              <button onClick={() => navigate('/ai-chat', { state: { initialMsg: 'Mere DPR me kya improvements karu — banker ki nazar se review karke 5 actionable suggestions do.' } })} className="btn-sec">🤖 Ask AI to review my DPR</button>
            </>
          )}

          <div style={{ height: 14 }} />
        </div>
      </div>
    </div>
  )
}
