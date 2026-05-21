import { useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useT } from '../i18n'
import NearbyMSME from './NearbyMSME'

export default function BottomNav({ hideNearby = false }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { appLanguage } = useApp()
  const t = useT(appLanguage)

  const items = [
    { ico: '🏠', label: t.home,        path: '/home' },
    { ico: '🎯', label: t.schemes,     path: '/schemes' },
    { ico: '📩', label: t.grievance,   path: '/grievances' },
    { ico: '👤', label: t.profile,     path: '/profile-setup' },
  ]

  return (
    <>
      {!hideNearby && <NearbyMSME bottomOffset={68} />}
      <div className="bottomnav">
        {items.map(item => {
          const active = location.pathname === item.path
          return (
            <button key={item.path} className={`bn-item${active ? ' active' : ''}`} onClick={() => navigate(item.path)}>
              <span className="bn-ico">{item.ico}</span>
              <span>{item.label}</span>
            </button>
          )
        })}
      </div>
    </>
  )
}
