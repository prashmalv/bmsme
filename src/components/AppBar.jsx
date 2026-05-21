import { useNavigate } from 'react-router-dom'

export default function AppBar({ title, subtitle, variant = 'default', onBack, right }) {
  const navigate = useNavigate()
  return (
    <div className={`appbar${variant === 'grad' ? ' grad' : variant === 'officer' ? ' officer' : ''}`}>
      <button className="appbar-back" onClick={onBack || (() => navigate(-1))}>←</button>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="appbar-title">{title}</div>
        {subtitle && <div className="appbar-sub">{subtitle}</div>}
      </div>
      {right}
    </div>
  )
}
