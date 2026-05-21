import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import StatusBar from '../components/StatusBar'
import LanguageSelector from '../components/LanguageSelector'

export default function Login() {
  const navigate = useNavigate()
  const { login, profile } = useApp()
  const [mobile, setMobile] = useState('')
  const [otp, setOtp] = useState('')
  const [stage, setStage] = useState('mobile') // mobile | otp
  const [sending, setSending] = useState(false)

  const sendOtp = () => {
    if (mobile.length !== 10) return
    setSending(true)
    setTimeout(() => { setSending(false); setStage('otp') }, 700)
  }

  const verify = () => {
    if (otp.length !== 4) return
    const initials = profile?.name ? profile.name.slice(0, 2).toUpperCase() : 'NN'
    login({
      name: profile?.name || 'नागरिक',
      initials,
      mobile: '+91 ' + mobile.slice(0, 5) + '•••' + mobile.slice(-2),
      district: profile?.district || 'Patna',
    })
    // Go straight to home; profile setup is optional and accessible from the chat's Advanced tab
    navigate('/home')
  }

  return (
    <div className="app-shell">
      <StatusBar light />
      <div style={{ background: 'var(--grad-hero)', padding: '14px 16px 22px', color: '#fff', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
        <div className="pattern-bg" />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <button onClick={() => navigate('/persona')} style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 8, color: '#fff', fontSize: 12, fontWeight: 700, padding: '4px 10px', cursor: 'pointer' }}>← Back</button>
            <LanguageSelector light />
          </div>
          <div style={{ fontSize: 20, fontWeight: 900, lineHeight: 1.2 }}>Aapka Udyam pehchaan</div>
          <div style={{ fontSize: 11.5, opacity: 0.9, marginTop: 6 }}>Sirf Aadhaar-linked mobile number — Bihar MSME ke liye 60 second me login.</div>
        </div>
      </div>

      <div className="screen-scroll">
        <div className="content">
          <div style={{ background: 'var(--accent-light)', border: '1px solid var(--accent)', borderRadius: 12, padding: '10px 12px', display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: 20 }}>🔐</span>
            <div style={{ fontSize: 11, color: 'var(--accent-dark)', lineHeight: 1.5, fontWeight: 700 }}>
              Department of Industries Bihar verifies you via mobile OTP (linked to Aadhaar). 100% secure, no documents needed.
            </div>
          </div>

          {stage === 'mobile' && (
            <>
              <div style={{ marginTop: 6 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--ink)', marginBottom: 7 }}>📱 Mobile number</div>
                <div className="input focused" style={{ gap: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--ink-soft)' }}>+91</span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    placeholder="10-digit Aadhaar-linked"
                    value={mobile}
                    maxLength={10}
                    onChange={e => setMobile(e.target.value.replace(/\D/g, ''))}
                    style={{ fontSize: 16, fontWeight: 700, letterSpacing: 1 }}
                  />
                  {mobile.length === 10 && <span style={{ color: 'var(--success)' }}>✓</span>}
                </div>
              </div>
              <button className="btn-pri" onClick={sendOtp} disabled={mobile.length !== 10 || sending}>
                {sending ? 'Sending OTP…' : 'Send OTP →'}
              </button>
              <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--ink-mute)', marginTop: 4 }}>
                By continuing you agree to Bihar's <a href="#" style={{ color: 'var(--primary)', fontWeight: 700 }}>Terms of Use</a> and digital governance policy.
              </div>
            </>
          )}

          {stage === 'otp' && (
            <>
              <div style={{ marginTop: 6 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--ink)', marginBottom: 4 }}>🔢 OTP bhejaa gaya hai</div>
                <div style={{ fontSize: 11, color: 'var(--ink-mute)', marginBottom: 10 }}>+91 {mobile} — OTP for demo: <b style={{ color: 'var(--primary)' }}>4321</b></div>
                <div className="input focused">
                  <input
                    type="tel"
                    inputMode="numeric"
                    placeholder="4-digit OTP"
                    value={otp}
                    maxLength={4}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                    style={{ fontSize: 22, fontWeight: 800, letterSpacing: 8, textAlign: 'center' }}
                  />
                </div>
              </div>
              <button className="btn-pri" onClick={verify} disabled={otp.length !== 4}>
                Verify & Continue →
              </button>
              <button className="btn-ghost" onClick={() => setStage('mobile')} style={{ width: '100%' }}>← Change number</button>
            </>
          )}

          <div style={{ marginTop: 18, background: 'var(--soft)', borderRadius: 12, padding: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--ink-soft)', marginBottom: 6 }}>🧑‍💼 Why we ask for this</div>
            <div style={{ fontSize: 10.5, color: 'var(--ink-mute)', lineHeight: 1.5 }}>
              Your mobile is linked to Aadhaar (for free) and used by Udyog Mitra AI to:
              <br/>· auto-fetch your Udyam Registration (if any)
              <br/>· personalise scheme recommendations
              <br/>· track applications & grievances
              <br/>No password, no documents — just secure mobile-based identity.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
