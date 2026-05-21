// Lightweight markdown renderer — handles **bold**, links, # ## ### headings,
// • / - / * bullets, 1. numbered lists, and pipe tables.

function inline(text) {
  const regex = /(\*\*[^*]+\*\*|https?:\/\/[^\s\)\]>"]+)/g
  const parts = []
  let last = 0, match
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push({ t: 'text', v: text.slice(last, match.index) })
    const m = match[0]
    if (m.startsWith('**')) parts.push({ t: 'bold', v: m.slice(2, -2) })
    else parts.push({ t: 'link', v: m })
    last = match.index + m.length
  }
  if (last < text.length) parts.push({ t: 'text', v: text.slice(last) })
  return parts.map((p, i) => {
    if (p.t === 'bold') return <strong key={i}>{p.v}</strong>
    if (p.t === 'link') return (
      <a key={i} href={p.v} target="_blank" rel="noopener noreferrer"
        style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'underline', wordBreak: 'break-all' }}>
        {p.v}
      </a>
    )
    return <span key={i}>{p.v}</span>
  })
}

function TableBlock({ lines }) {
  const dataLines = lines.filter(l => !/^\|[\s\-:|]+\|/.test(l))
  if (!dataLines.length) return null
  const parse = l => l.split('|').slice(1, -1).map(c => c.trim())
  const [head, ...rows] = dataLines
  const headers = parse(head)
  return (
    <div style={{ overflowX: 'auto', margin: '8px 0', borderRadius: 10, border: '1px solid var(--border)' }}>
      <table className="tbl">
        <thead><tr>{headers.map((h, i) => <th key={i}>{h}</th>)}</tr></thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} style={{ background: ri % 2 === 0 ? '#fff' : 'var(--soft)' }}>
              {parse(row).map((cell, ci) => <td key={ci}>{inline(cell)}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function RenderText({ text }) {
  const lines = (text || '').split('\n')
  const elements = []
  let tableLines = []
  const flushTable = (key) => {
    if (tableLines.length) {
      elements.push(<TableBlock key={`tbl-${key}`} lines={tableLines} />)
      tableLines = []
    }
  }
  lines.forEach((line, li) => {
    if (/^\|/.test(line.trim())) { tableLines.push(line); return }
    flushTable(li)

    if (/^### /.test(line)) {
      elements.push(<div key={li} style={{ fontSize: 12, fontWeight: 800, color: 'var(--primary-dark)', marginTop: 10, marginBottom: 2 }}>{inline(line.slice(4))}</div>)
    } else if (/^## /.test(line)) {
      elements.push(<div key={li} style={{ fontSize: 13.5, fontWeight: 900, color: 'var(--ink)', marginTop: 12, marginBottom: 3, borderBottom: '1.5px solid var(--soft)', paddingBottom: 3 }}>{inline(line.slice(3))}</div>)
    } else if (/^# /.test(line)) {
      elements.push(<div key={li} style={{ fontSize: 15, fontWeight: 900, color: 'var(--primary)', marginTop: 14, marginBottom: 4 }}>{inline(line.slice(2))}</div>)
    } else if (/^[•\-\*] /.test(line)) {
      elements.push(
        <div key={li} style={{ display: 'flex', gap: 8, marginTop: 4, alignItems: 'flex-start' }}>
          <span style={{ color: 'var(--primary)', fontSize: 9, marginTop: 4, flexShrink: 0 }}>●</span>
          <span style={{ flex: 1 }}>{inline(line.slice(2))}</span>
        </div>
      )
    } else if (/^\d+\. /.test(line)) {
      const dot = line.indexOf('. ')
      const num = line.slice(0, dot)
      const rest = line.slice(dot + 2)
      elements.push(
        <div key={li} style={{ display: 'flex', gap: 8, marginTop: 4, alignItems: 'flex-start' }}>
          <span style={{ color: 'var(--primary)', fontWeight: 800, fontSize: 11, flexShrink: 0, minWidth: 16 }}>{num}.</span>
          <span style={{ flex: 1 }}>{inline(rest)}</span>
        </div>
      )
    } else if (line.trim() === '') {
      elements.push(<div key={li} style={{ height: 6 }} />)
    } else {
      elements.push(<div key={li}>{inline(line)}</div>)
    }
  })
  flushTable('end')
  return <div style={{ lineHeight: 1.6, fontSize: 13 }}>{elements}</div>
}
