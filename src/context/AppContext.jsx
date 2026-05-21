import { createContext, useContext, useEffect, useState } from 'react'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [persona, setPersona] = useState('MSME') // MSME | OFFICER | SECRETARY
  const [profile, setProfile] = useState(null)   // business profile (district, sector, etc.)
  const [toast, setToast] = useState(null)
  const [appLanguage, setAppLanguage] = useState('Hindi')
  const [grievances, setGrievances] = useState([])

  // Persist profile + persona across reloads (UX nicety)
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('umai_state') || '{}')
      if (saved.profile) setProfile(saved.profile)
      if (saved.persona) setPersona(saved.persona)
      if (saved.user) { setUser(saved.user); setIsLoggedIn(true) }
      if (saved.appLanguage) setAppLanguage(saved.appLanguage)
      if (saved.grievances) setGrievances(saved.grievances)
    } catch {}
  }, [])
  useEffect(() => {
    try {
      localStorage.setItem('umai_state', JSON.stringify({
        profile, persona, user, appLanguage, grievances,
      }))
    } catch {}
  }, [profile, persona, user, appLanguage, grievances])

  const login = (userData) => {
    const u = userData || {
      name: 'Rajesh Kumar',
      initials: 'RK',
      mobile: '+91 98765•••432',
      district: 'Patna',
    }
    setUser(u)
    setIsLoggedIn(true)
  }

  const logout = () => {
    setUser(null)
    setIsLoggedIn(false)
    setProfile(null)
    try { localStorage.removeItem('umai_state') } catch {}
  }

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  const addGrievance = (g) => {
    const id = 'BIH-GRV-' + new Date().getFullYear() + '-' + String(10000 + grievances.length + 1)
    const grievance = { id, createdAt: new Date().toISOString(), status: 'OPEN', ...g }
    setGrievances(prev => [grievance, ...prev])
    return grievance
  }

  return (
    <AppContext.Provider value={{
      user, isLoggedIn, login, logout,
      persona, setPersona,
      profile, setProfile,
      appLanguage, setAppLanguage,
      toast, showToast,
      grievances, addGrievance,
    }}>
      {children}
      {toast && <div className="toast">{toast}</div>}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}
