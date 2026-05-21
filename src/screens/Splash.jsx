import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Splash() {
  const navigate = useNavigate()
  useEffect(() => {
    const t = setTimeout(() => navigate('/persona'), 2200)
    return () => clearTimeout(t)
  }, [navigate])

  return (
    <div className="app-shell" style={{
      background: 'var(--grad-hero)', color: '#fff',
      alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden',
    }}>
      <div className="pattern-bg" />

      {/* Animated chakra-ish ring */}
      <div style={{
        position: 'absolute', top: '24%', left: '50%', transform: 'translateX(-50%)',
        width: 120, height: 120, borderRadius: '50%',
        background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: '2px solid rgba(255,255,255,0.3)',
        boxShadow: '0 0 60px rgba(230,168,23,0.4)',
        animation: 'pulse 2s ease-in-out infinite',
      }}>
        <div style={{ fontSize: 56 }}>🪷</div>
      </div>

      <div style={{ position: 'absolute', top: '52%', left: 0, right: 0, textAlign: 'center', padding: '0 24px', zIndex: 2 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.4, opacity: 0.9, marginBottom: 6 }}>उद्योग विभाग · BIHAR SARKAR</div>
        <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: -0.5, lineHeight: 1.15 }}>उद्योग मित्र AI</div>
        <div style={{ fontSize: 14, fontWeight: 700, marginTop: 4, opacity: 0.95 }}>Udyog Mitra · Bihar's MSME Copilot</div>
        <div style={{ fontSize: 11.5, marginTop: 12, opacity: 0.85, lineHeight: 1.5, maxWidth: 320, margin: '12px auto 0' }}>
          AI-powered Centralized Integrated Management System for MSMEs · Department of Industries, Government of Bihar
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 40, left: 0, right: 0, textAlign: 'center', zIndex: 2 }}>
        <div className="ai-thinking" style={{ display: 'inline-flex' }}>
          <span style={{ background: '#fff' }} />
          <span style={{ background: '#fff' }} />
          <span style={{ background: '#fff' }} />
        </div>
        <div style={{ fontSize: 10, marginTop: 12, opacity: 0.7, letterSpacing: 1 }}>Tender 1127/UM · CIMS & BI Platform · RAMP</div>
      </div>
    </div>
  )
}
