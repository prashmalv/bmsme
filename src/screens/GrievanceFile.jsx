import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import StatusBar from '../components/StatusBar'
import AppBar from '../components/AppBar'

const CATEGORIES = [
  { code: 'DELAYED_PAYMENT',     label: 'Delayed payment from buyer', ico: '💸',
    route: 'MSEFC (Samadhaan portal) + TReDS for invoice discounting',
    portal: 'https://samadhaan.msme.gov.in', why: 'MSMED Act 2006, Sec 15-24' },
  { code: 'SCHEME_REJECTED',     label: 'Scheme application rejected', ico: '📑',
    route: 'DIC officer review + Bihar Single Window appeal',
    portal: 'https://investbihar.bihar.gov.in', why: 'Right to Public Grievance Redressal Act, Bihar 2015' },
  { code: 'LOAN_REFUSAL',        label: 'Bank refused loan', ico: '🏦',
    route: 'CGTMSE escalation + Lead District Manager (LDM) + Banking Ombudsman',
    portal: 'https://rbi.org.in', why: 'RBI Banking Ombudsman Scheme 2021' },
  { code: 'COMPLIANCE_HARASS',   label: 'Compliance / inspector harassment', ico: '🚨',
    route: 'Bihar Lokayukt + Industries Vigilance',
    portal: 'https://lokshikayat.bihar.gov.in', why: 'Bihar Lokayukta Act' },
  { code: 'INFRASTRUCTURE',      label: 'Power / road / water issue at unit', ico: '⚡',
    route: 'BIADA Industrial Estate Office + Bihar Single Window',
    portal: 'https://biadabihar.in', why: 'Industrial Estate SLAs' },
  { code: 'GST_OR_TAX',          label: 'GST / Tax issue', ico: '🧾',
    route: 'GST Helpdesk + State Tax Commissioner Bihar',
    portal: 'https://state.bihar.gov.in/commercialtax', why: 'CGST/SGST Act, Bihar' },
  { code: 'OTHER',               label: 'Other / not sure', ico: '❓',
    route: 'AI will auto-route based on your description',
    portal: 'https://industries.bihar.gov.in', why: 'Bihar Industries Dept grievance cell' },
]

export default function GrievanceFile() {
  const navigate = useNavigate()
  const { profile, addGrievance, showToast } = useApp()
  const [cat, setCat] = useState(null)
  const [against, setAgainst] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState('')
  const [desc, setDesc] = useState('')
  const [submitted, setSubmitted] = useState(null)

  const submit = () => {
    const g = addGrievance({
      categoryCode: cat.code,
      categoryLabel: cat.label,
      against,
      amount,
      eventDate: date,
      description: desc,
      route: cat.route,
      portal: cat.portal,
      legalRef: cat.why,
      district: profile?.district || 'Bihar',
      filedBy: profile?.name || 'Anonymous',
    })
    setSubmitted(g)
    showToast('Grievance filed · AI ne sahi authority pe route kar diya')
  }

  if (submitted) {
    return (
      <div className="app-shell">
        <StatusBar />
        <AppBar title="Grievance filed" subtitle="AI auto-routed to the correct authority" onBack={() => navigate('/grievances')} />
        <div className="screen-scroll">
          <div className="content">
            <div style={{ background: 'var(--secondary-light)', border: '1px solid var(--secondary)', borderRadius: 14, padding: 18, textAlign: 'center' }}>
              <div style={{ fontSize: 46, marginBottom: 6 }}>✅</div>
              <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--secondary-dark)' }}>Submitted successfully</div>
              <div style={{ fontSize: 11.5, color: 'var(--ink-soft)', marginTop: 6, lineHeight: 1.5 }}>
                Tracking ID: <b style={{ color: 'var(--primary)' }}>{submitted.id}</b><br/>
                SLA: response within 3 working days
              </div>
            </div>

            <div className="card">
              <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--ink-mute)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>AI Routing decision</div>
              <div style={{ fontSize: 12.5, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
                <b>Route:</b> {submitted.route}<br/>
                <b>Legal basis:</b> {submitted.legalRef}<br/>
                <b>Portal:</b> <a href={submitted.portal} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'underline' }}>{submitted.portal}</a>
              </div>
            </div>

            <button onClick={() => navigate('/grievances')} className="btn-pri">📩 View my grievances</button>
            <button onClick={() => navigate('/ai-chat', { state: { initialMsg: `Mein ${submitted.id} grievance file kiya hai (${submitted.categoryLabel}). Iska escalation timeline aur agle steps kya hain?` } })} className="btn-sec">🧑‍💼 Ask AI about next steps</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <StatusBar />
      <AppBar title="File Grievance" subtitle="AI auto-routes to MSEFC, TReDS, Single Window, etc." />

      <div className="screen-scroll">
        <div className="content">

          <div style={{ background: 'var(--primary-ghost)', border: '1px solid var(--primary-light)', borderRadius: 12, padding: '10px 12px', display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: 22 }}>⚖️</span>
            <div style={{ fontSize: 11, color: 'var(--primary-dark)', lineHeight: 1.5, fontWeight: 600 }}>
              Aap sirf problem batayein. AI sahi authority — MSEFC / TReDS / Lokayukta / Single Window / Banking Ombudsman — pe automatically route karega.
            </div>
          </div>

          <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--ink)', marginBottom: 4 }}>Pehle bataiye — kya issue hai?</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {CATEGORIES.map(c => (
              <button
                key={c.code}
                onClick={() => setCat(c)}
                className="card"
                style={{
                  padding: 12, cursor: 'pointer', textAlign: 'left',
                  border: cat?.code === c.code ? '2px solid var(--primary)' : '1px solid var(--border)',
                  background: cat?.code === c.code ? 'var(--primary-ghost)' : '#fff',
                  display: 'flex', alignItems: 'center', gap: 10,
                }}
              >
                <span style={{ fontSize: 22 }}>{c.ico}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--ink)' }}>{c.label}</div>
                  {cat?.code === c.code && (
                    <div style={{ fontSize: 10.5, color: 'var(--primary-dark)', marginTop: 4, lineHeight: 1.5 }}>
                      🧑‍💼 AI routes to: <b>{c.route}</b>
                    </div>
                  )}
                </div>
                {cat?.code === c.code && <span style={{ color: 'var(--primary)', fontSize: 16 }}>✓</span>}
              </button>
            ))}
          </div>

          {cat && (
            <>
              <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--ink)', marginTop: 8 }}>Kis ke against / kis party ke saath issue?</div>
              <div className="input"><input placeholder="e.g. ABC Garments Pvt Ltd, Patna" value={against} onChange={e => setAgainst(e.target.value)} /></div>

              {cat.code === 'DELAYED_PAYMENT' && (
                <>
                  <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--ink)', marginTop: 8 }}>Amount outstanding</div>
                  <div className="input"><span className="ic">₹</span><input placeholder="e.g. 4,50,000" value={amount} onChange={e => setAmount(e.target.value)} /></div>
                </>
              )}

              <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--ink)', marginTop: 8 }}>Event date</div>
              <div className="input"><input type="date" value={date} onChange={e => setDate(e.target.value)} /></div>

              <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--ink)', marginTop: 8 }}>Brief description</div>
              <div className="input">
                <textarea
                  placeholder="What happened, when, and what you've already tried?"
                  rows={4}
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                  style={{ resize: 'none', width: '100%', border: 'none', outline: 'none', background: 'transparent', fontSize: 13, color: 'var(--ink)' }}
                />
              </div>

              <button onClick={submit} className="btn-pri" disabled={!against || !desc}>
                ⚖️ Submit & AI auto-route →
              </button>
              <button onClick={() => navigate('/ai-chat', { state: { initialMsg: `Mujhe ${cat.label} ki problem hai against "${against || '...'}". Best way to handle this — step by step batao.` } })} className="btn-sec">🧑‍💼 Pehle AI se baat karein</button>
            </>
          )}

          <div style={{ height: 14 }} />
        </div>
      </div>
    </div>
  )
}
