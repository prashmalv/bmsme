import { Routes, Route, Navigate } from 'react-router-dom'
import { useApp } from './context/AppContext'

import Splash from './screens/Splash'
import PersonaSelect from './screens/PersonaSelect'
import Login from './screens/Login'
import ProfileSetup from './screens/ProfileSetup'
import MSMEHome from './screens/MSMEHome'
import UdyogMitraAI from './screens/UdyogMitraAI'
import SchemeMatcher from './screens/SchemeMatcher'
import DPRBuilder from './screens/DPRBuilder'
import GrievanceFile from './screens/GrievanceFile'
import GrievanceList from './screens/GrievanceList'
import MarketIntel from './screens/MarketIntel'
import OfficerDashboard from './screens/OfficerDashboard'
import SecretaryCockpit from './screens/SecretaryCockpit'
import SchemeDetail from './screens/SchemeDetail'

function ProtectedRoute({ children }) {
  const { isLoggedIn } = useApp()
  return isLoggedIn ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Splash />} />
      <Route path="/persona" element={<PersonaSelect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile-setup" element={<ProfileSetup />} />

      {/* MSME Owner persona */}
      <Route path="/home" element={<ProtectedRoute><MSMEHome /></ProtectedRoute>} />
      <Route path="/ai-chat" element={<ProtectedRoute><UdyogMitraAI /></ProtectedRoute>} />
      <Route path="/schemes" element={<ProtectedRoute><SchemeMatcher /></ProtectedRoute>} />
      <Route path="/scheme/:code" element={<ProtectedRoute><SchemeDetail /></ProtectedRoute>} />
      <Route path="/dpr" element={<ProtectedRoute><DPRBuilder /></ProtectedRoute>} />
      <Route path="/grievance/new" element={<ProtectedRoute><GrievanceFile /></ProtectedRoute>} />
      <Route path="/grievances" element={<ProtectedRoute><GrievanceList /></ProtectedRoute>} />
      <Route path="/market" element={<ProtectedRoute><MarketIntel /></ProtectedRoute>} />

      {/* DIC Officer persona */}
      <Route path="/officer" element={<OfficerDashboard />} />

      {/* Secretary / CM persona */}
      <Route path="/secretary" element={<SecretaryCockpit />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
