import { useState } from 'react'

// Bihar MSME ecosystem support points — the equivalent of Rajasthan's "Nearby" pin,
// but for entrepreneurs: where to actually walk in to get help.
const CATEGORIES = [
  { ico: '🏛',  label: 'DIC Office',         query: 'District Industries Centre' },
  { ico: '🏦',  label: 'Lead Bank',          query: 'SBI MSME branch lead bank' },
  { ico: '💰',  label: 'MUDRA Bank',         query: 'MUDRA loan bank branch' },
  { ico: '🎓',  label: 'MSME Training',      query: 'MSME training institute MSME-DI' },
  { ico: '⚖️',  label: 'MSEFC',              query: 'MSEFC Micro Small Enterprises Facilitation Council' },
  { ico: '🏭',  label: 'Industrial Estate',  query: 'BIADA industrial estate' },
  { ico: '🛒',  label: 'Raw Material Hub',   query: 'wholesale raw material market' },
  { ico: '🎪',  label: 'Exhibition Hall',    query: 'exhibition hall trade fair venue' },
  { ico: '📦',  label: 'GeM Help Centre',    query: 'GeM seller help centre' },
  { ico: '🧾',  label: 'GST Suvidha',        query: 'GST Suvidha Kendra' },
  { ico: '🚚',  label: 'Transport Nagar',    query: 'transport nagar logistics hub' },
  { ico: '⚡',  label: 'Power / Discom',     query: 'electricity board office Bihar discom' },
]

export default function NearbyMSME({ bottomOffset = 70 }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const openMaps = (cat) => {
    setLoading(true)
    const doOpen = (lat, lng) => {
      const url = lat
        ? `https://www.google.com/maps/search/${encodeURIComponent(cat.query)}/@${lat},${lng},14z`
        : `https://www.google.com/maps/search/${encodeURIComponent(cat.query + ' near me Bihar')}`
      window.open(url, '_blank')
      setLoading(false)
      setOpen(false)
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => doOpen(pos.coords.latitude, pos.coords.longitude),
        () => doOpen(null, null),
        { timeout: 5000, maximumAge: 60000 }
      )
    } else {
      doOpen(null, null)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(v => !v)}
        title="Find Nearby MSME Help"
        style={{
          position: 'fixed', bottom: bottomOffset,
          right: 'calc(max(16px, (100vw - 440px) / 2 + 16px))',
          width: 48, height: 48, borderRadius: '50%',
          background: open ? 'var(--primary)' : '#fff',
          color: open ? '#fff' : 'var(--primary)',
          border: '2px solid var(--primary)',
          boxShadow: '0 4px 16px rgba(26,77,143,0.25)',
          fontSize: 20, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 200, transition: 'all 0.2s',
        }}
      >📍</button>

      {open && (
        <div onClick={() => setOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 201 }} />
      )}

      {open && (
        <div style={{
          position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
          width: '100%', maxWidth: 440, background: '#fff',
          borderTopLeftRadius: 20, borderTopRightRadius: 20,
          padding: '14px 16px 28px', zIndex: 202,
          boxShadow: '0 -8px 32px rgba(0,0,0,0.2)',
          maxHeight: '80vh', overflowY: 'auto',
        }}>
          <div style={{ width: 40, height: 4, background: 'var(--border)', borderRadius: 4, margin: '0 auto 14px' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 18 }}>📍</span>
            <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--ink)' }}>MSME Ecosystem Near You</div>
          </div>
          <div style={{ fontSize: 11, color: 'var(--ink-mute)', marginBottom: 14, lineHeight: 1.5 }}>
            {loading ? '📡 Getting your location…' : 'Find DIC offices, lead banks, training centers, MSEFC, industrial estates — opens in Google Maps.'}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat.label}
                onClick={() => openMaps(cat)}
                disabled={loading}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                  padding: '14px 6px', borderRadius: 12,
                  border: '1.5px solid var(--border)', background: '#fff',
                  cursor: loading ? 'wait' : 'pointer', transition: 'background 0.15s',
                }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.background = 'var(--primary-ghost)' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff' }}
              >
                <span style={{ fontSize: 24 }}>{cat.ico}</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--ink-soft)', textAlign: 'center', lineHeight: 1.2 }}>{cat.label}</span>
              </button>
            ))}
          </div>

          <div style={{ marginTop: 14, padding: '10px 12px', background: 'var(--accent-light)', borderRadius: 10, fontSize: 10.5, color: 'var(--accent-dark)', lineHeight: 1.5, fontWeight: 600 }}>
            💡 Need someone to talk to? Tap <b>DIC Office</b> for the nearest District Industries Centre — every Bihar district has one with a designated MSME Coordinator.
          </div>
        </div>
      )}
    </>
  )
}
