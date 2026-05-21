import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import StatusBar from '../components/StatusBar'
import AppBar from '../components/AppBar'
import { BIHAR_DISTRICTS } from '../data/districts'

const SECTORS = [
  { code: 'MFG',     label: 'Manufacturing',    ico: '🏭' },
  { code: 'TEXTILE', label: 'Textile / Silk',   ico: '🧵' },
  { code: 'FOOD',    label: 'Food Processing',  ico: '🥫' },
  { code: 'ARTISAN', label: 'Artisan / Craft',  ico: '🧑‍🎨' },
  { code: 'SERVICE', label: 'Services',         ico: '💼' },
  { code: 'TRADE',   label: 'Trading / Retail', ico: '🛍' },
  { code: 'TECH',    label: 'Tech / Startup',   ico: '💻' },
  { code: 'LEATHER', label: 'Leather',          ico: '👞' },
]

const STAGES = [
  { code: 'NEW',      label: 'Idea / Want to start', ico: '💡' },
  { code: 'NEW',      label: '0–6 months old',       ico: '🌱' },
  { code: 'EXISTING', label: '6m–3 yrs',             ico: '🌿' },
  { code: 'EXISTING', label: '3+ years',             ico: '🌳' },
]

const TURNOVER = ['< ₹5L', '₹5L–₹25L', '₹25L–₹1Cr', '₹1Cr–₹10Cr', '> ₹10Cr']
const EMPLOYEES = ['Only me', '2–5', '6–20', '21–50', '50+']

const CATEGORIES = [
  { code: 'GENERAL_YOUTH', label: 'General' },
  { code: 'SC',            label: 'SC' },
  { code: 'ST',            label: 'ST' },
  { code: 'EBC',           label: 'EBC' },
  { code: 'BC',            label: 'BC (Backward Class)' },
  { code: 'MAHILA',        label: 'Mahila' },
  { code: 'MINORITY',      label: 'Alpsankhyak (Minority)' },
]

const NEEDS = [
  { code: 'LOAN',      label: 'Loan / Credit',    ico: '💳' },
  { code: 'SUBSIDY',   label: 'Subsidy / Grant',  ico: '🎁' },
  { code: 'TRAINING',  label: 'Skill / Training', ico: '🎓' },
  { code: 'MARKET',    label: 'Market access',    ico: '📣' },
  { code: 'CERT',      label: 'Certification',    ico: '🏅' },
  { code: 'GRIEVANCE', label: 'Grievance / payment', ico: '⚖️' },
]

function ChipMulti({ options, selected, onToggle }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {options.map(opt => {
        const val = typeof opt === 'string' ? opt : (opt.code || opt.label)
        const label = typeof opt === 'string' ? opt : opt.label
        const ico = typeof opt === 'object' ? opt.ico : null
        const isSel = (selected || []).includes(val) || selected === val
        return (
          <button key={val} onClick={() => onToggle(val)}
            className={`chip ${isSel ? 'chip-primary' : 'chip-neutral'}`}
            style={{
              padding: '7px 12px', fontSize: 11.5, fontWeight: 700, cursor: 'pointer',
              border: isSel ? '1.5px solid var(--primary)' : '1.5px solid var(--border)',
              background: isSel ? 'var(--grad-hero)' : '#fff',
              color: isSel ? '#fff' : 'var(--ink-soft)',
            }}>
            {ico && <span style={{ marginRight: 4 }}>{ico}</span>}{label}
          </button>
        )
      })}
    </div>
  )
}

export default function ProfileSetup() {
  const navigate = useNavigate()
  const { setProfile, profile, user, showToast } = useApp()

  const [form, setForm] = useState({
    name: profile?.name || user?.name || '',
    businessName: profile?.businessName || '',
    district: profile?.district || '',
    sector: profile?.sector || '',
    sectorCode: profile?.sectorCode || '',
    stage: profile?.stage || '',
    stageLabel: profile?.stageLabel || '',
    turnover: profile?.turnover || '',
    employees: profile?.employees || '',
    category: profile?.category || '',
    categoryCode: profile?.categoryCode || '',
    gender: profile?.gender || '',
    age: profile?.age || '',
    udyam: profile?.udyam || '',
    products: profile?.products || '',
    needs: profile?.needs || [],
  })

  const toggleNeed = (code) => {
    setForm(p => ({
      ...p,
      needs: p.needs.includes(code) ? p.needs.filter(n => n !== code) : [...p.needs, code],
    }))
  }

  const save = () => {
    setProfile({
      ...form,
      domicile: 'BIHAR',
    })
    showToast('Profile saved · AI ko personalise kar diya')
    navigate('/home')
  }

  const filled = [form.name, form.district, form.sector, form.stage].filter(Boolean).length

  return (
    <div className="app-shell">
      <StatusBar />
      <AppBar
        title="Apna business batayein"
        subtitle="20 second — AI har baat personalise karega"
        onBack={() => navigate('/home')}
      />

      <div className="screen-scroll">
        <div className="content">
          <div style={{ background: 'var(--secondary-light)', border: '1px solid var(--secondary)', borderRadius: 12, padding: '10px 12px', display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: 20 }}>🎯</span>
            <div style={{ fontSize: 11, color: 'var(--secondary-dark)', lineHeight: 1.5, fontWeight: 700 }}>
              Yeh detail Udyog Mitra AI ko de dijiye — taa ki har scheme, loan, training suggestion <b>aapke business ke liye sahi</b> ho.
            </div>
          </div>

          <div className="section-title">Pehchaan</div>

          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--ink)', marginBottom: 6 }}>👤 Aapka naam</div>
            <div className="input"><span className="ic">🙏</span>
              <input placeholder="e.g. Rajesh Kumar"
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            </div>
          </div>

          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--ink)', marginBottom: 6 }}>🏪 Business / unit ka naam <span style={{ fontWeight: 500, color: 'var(--ink-mute)' }}>(optional)</span></div>
            <div className="input"><span className="ic">🏷</span>
              <input placeholder="e.g. Maa Tara Silk Weavers"
                value={form.businessName}
                onChange={e => setForm(p => ({ ...p, businessName: e.target.value }))} />
            </div>
          </div>

          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--ink)', marginBottom: 6 }}>📍 Bihar district</div>
            <div className="input">
              <span className="ic">🗺</span>
              <select
                value={form.district}
                onChange={e => setForm(p => ({ ...p, district: e.target.value }))}
                style={{ flex: 1, border: 'none', background: 'transparent', fontSize: 13.5, color: 'var(--ink)', outline: 'none' }}
              >
                <option value="">— select district —</option>
                {BIHAR_DISTRICTS.map(d => (
                  <option key={d.name} value={d.name}>{d.emoji} {d.name} · {d.signature}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="section-title">Business ki nature</div>

          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--ink)', marginBottom: 6 }}>🏭 Sector / kya banate / karte hain</div>
            <ChipMulti
              options={SECTORS}
              selected={form.sectorCode}
              onToggle={(v) => {
                const s = SECTORS.find(x => x.code === v)
                setForm(p => ({ ...p, sectorCode: v, sector: s?.label || '' }))
              }}
            />
          </div>

          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--ink)', marginBottom: 6 }}>⏳ Business ki age</div>
            <ChipMulti
              options={STAGES}
              selected={form.stageLabel}
              onToggle={(v) => {
                const s = STAGES.find(x => x.label === v)
                setForm(p => ({ ...p, stageLabel: v, stage: s?.code || '' }))
              }}
            />
          </div>

          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--ink)', marginBottom: 6 }}>📦 Aapke products / services kya hain?</div>
            <div className="input"><span className="ic">📝</span>
              <input placeholder="e.g. Bhagalpuri silk sarees, hand-loom"
                value={form.products}
                onChange={e => setForm(p => ({ ...p, products: e.target.value }))} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--ink)', marginBottom: 6 }}>💰 Annual turnover</div>
              <ChipMulti options={TURNOVER} selected={form.turnover} onToggle={(v) => setForm(p => ({ ...p, turnover: p.turnover === v ? '' : v }))} />
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--ink)', marginBottom: 6 }}>👥 Employees</div>
              <ChipMulti options={EMPLOYEES} selected={form.employees} onToggle={(v) => setForm(p => ({ ...p, employees: p.employees === v ? '' : v }))} />
            </div>
          </div>

          <div className="section-title">Pehchaan-related (scheme matching ke liye)</div>

          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--ink)', marginBottom: 6 }}>🪪 Social category</div>
            <ChipMulti
              options={CATEGORIES}
              selected={form.categoryCode}
              onToggle={(v) => {
                const c = CATEGORIES.find(x => x.code === v)
                setForm(p => ({ ...p, categoryCode: v, category: c?.label || '' }))
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--ink)', marginBottom: 6 }}>⚧ Gender</div>
              <ChipMulti options={['Male','Female','Other']} selected={form.gender} onToggle={(v) => setForm(p => ({ ...p, gender: p.gender === v ? '' : v }))} />
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--ink)', marginBottom: 6 }}>🎂 Age</div>
              <div className="input"><input type="number" placeholder="e.g. 32" value={form.age} onChange={e => setForm(p => ({ ...p, age: e.target.value }))} /></div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--ink)', marginBottom: 6 }}>🆔 Udyam Registration No. <span style={{ fontWeight: 500, color: 'var(--ink-mute)' }}>(optional — agar already registered)</span></div>
            <div className="input"><span className="ic">📋</span>
              <input placeholder="UDYAM-BR-XX-0000000"
                value={form.udyam}
                onChange={e => setForm(p => ({ ...p, udyam: e.target.value.toUpperCase() }))} />
            </div>
          </div>

          <div className="section-title">Aaj aap kya chahte hain?</div>

          <div>
            <ChipMulti
              options={NEEDS}
              selected={form.needs}
              onToggle={(v) => toggleNeed(v)}
            />
          </div>

          <div style={{ background: 'var(--primary-ghost)', border: '1px solid var(--primary-light)', borderRadius: 12, padding: 12, marginTop: 6 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--primary-dark)', marginBottom: 6 }}>🎯 Profile completion · {filled}/4 critical fields</div>
            <div className="prog"><div className="prog-bar" style={{ width: `${(filled/4)*100}%` }} /></div>
          </div>

          <button className="btn-pri" onClick={save} disabled={filled < 2}>
            🚀 Save & enter Udyog Mitra AI
          </button>
          <div style={{ height: 12 }} />
        </div>
      </div>
    </div>
  )
}
