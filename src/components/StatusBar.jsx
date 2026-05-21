import { useEffect, useState } from 'react'

export default function StatusBar({ light = false }) {
  const [time, setTime] = useState(() =>
    new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false })
  )
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }))
    }, 30000)
    return () => clearInterval(id)
  }, [])
  return (
    <div className={`statusbar${light ? ' light' : ''}`}>
      <span>{time}</span>
      <span style={{ fontSize: 10, opacity: 0.85 }}>📶 5G · 🔋 100%</span>
    </div>
  )
}
