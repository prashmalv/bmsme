import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import StatusBar from '../components/StatusBar'
import LanguageSelector from '../components/LanguageSelector'

const PERSONAS = [
  {
    code: 'MSME',
    title: 'MSME उद्यमी / Owner',
    subtitle: 'Entrepreneur, artisan, job-seeker',
    desc: 'Schemes, loans, DPR, grievance, market intel — all in conversation.',
    icon: '👨‍🌾',
    gradient: 'linear-gradient(135deg,#1a4d8f 0%,#3a7ac8 100%)',
    badge: 'Citizen-facing',
    nav: '/login',
  },
  {
    code: 'OFFICER',
    title: 'DIC Officer / MSME Coordinator',
    subtitle: 'District, block, panchayat officials',
    desc: 'AI-triaged applications, stressed-MSME predictions, grievance clusters.',
    icon: '🧑‍💼',
    gradient: 'linear-gradient(135deg,#00833e 0%,#3fa66a 100%)',
    badge: 'Internal',
    nav: '/officer',
  },
  {
    code: 'SECRETARY',
    title: 'Secretary / Minister / CM Office',
    subtitle: 'Senior policy makers',
    desc: '"Ask Bihar" — voice briefings, anomaly map, policy what-if simulator.',
    icon: '🏛',
    gradient: 'linear-gradient(135deg,#091e3c 0%,#1a4d8f 60%,#e6a817 100%)',
    badge: 'Executive',
    nav: '/secretary',
  },
]

export default function PersonaSelect() {
  const navigate = useNavigate()
  const { setPersona } = useApp()

  const choose = (p) => {
    setPersona(p.code)
    navigate(p.nav)
  }

  return (
    <div className="app-shell">
      <StatusBar light />
      <div style={{ background: 'var(--grad-hero)', padding: '14px 16px 18px', color: '#fff', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
        <div className="pattern-bg" />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.5, opacity: 0.9 }}>BIHAR · CIMS PLATFORM</div>
            <LanguageSelector light />
          </div>
          <div style={{ fontSize: 22, fontWeight: 900, lineHeight: 1.2 }}>आगे बढ़ने के लिए केटेगरी चुनें</div>
          <div style={{ fontSize: 12, opacity: 0.9, marginTop: 4 }}>Choose your category to proceed — your AI copilot is tailored to it.</div>
        </div>
      </div>

      <div className="screen-scroll">
        <div className="content">
          {PERSONAS.map(p => (
            <button
              key={p.code}
              onClick={() => choose(p)}
              className="card"
              style={{
                padding: 0, border: 'none', background: p.gradient, color: '#fff',
                borderRadius: 18, overflow: 'hidden', textAlign: 'left',
                boxShadow: 'var(--shadow-2)', cursor: 'pointer', position: 'relative',
              }}
            >
              <div style={{ padding: 18, position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ fontSize: 44 }}>{p.icon}</div>
                  <span className="chip" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.35)', fontSize: 9.5 }}>{p.badge}</span>
                </div>
                <div style={{ fontSize: 17, fontWeight: 900, marginTop: 14, letterSpacing: -0.3 }}>{p.title}</div>
                <div style={{ fontSize: 11.5, opacity: 0.92, marginTop: 3, fontWeight: 600 }}>{p.subtitle}</div>
                <div style={{ fontSize: 12, opacity: 0.95, marginTop: 10, lineHeight: 1.5 }}>{p.desc}</div>
                <div style={{ marginTop: 14, fontSize: 12, fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.18)', padding: '6px 12px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.3)' }}>
                  Enter <span>→</span>
                </div>
              </div>
            </button>
          ))}

          <div style={{ marginTop: 8, padding: '12px 14px', background: '#fff', border: '1px solid var(--border)', borderRadius: 12 }}>
            <div style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--ink-mute)', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 6 }}>What's inside</div>
            <div style={{ fontSize: 11.5, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
              • <b>Udyog Mitra AI</b> — bilingual conversational copilot (Hindi · English · Bhojpuri · Maithili) with voice input<br/>
              • <b>AI Scheme Matcher</b> — eligibility scoring against 12+ Central & State schemes<br/>
              • <b>DPR Builder</b> — bankable detailed project report from a 5-minute conversation<br/>
              • <b>Grievance Auto-Routing</b> — MSEFC, TReDS, Single Window — AI picks the right channel<br/>
              • <b>Market Intelligence</b> — district-level demand signals & cluster insights<br/>
              • <b>"Ask Bihar" Cockpit</b> — state-level AI cockpit for Secretary / CM
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
