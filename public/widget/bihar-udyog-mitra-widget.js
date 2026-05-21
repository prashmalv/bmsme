/*
 * Bihar Udyog Mitra AI — embeddable widget
 * ----------------------------------------
 * Single-file vanilla JS. No React, no jQuery, no build step.
 *
 * Embed:
 *   <script src="https://<your-vercel-domain>/widget/bihar-udyog-mitra-widget.js"
 *           data-api="https://<your-vercel-domain>/api/chat"
 *           defer></script>
 *
 * Optional data attributes on the <script>:
 *   data-api      — full URL to /api/chat (default: same origin /api/chat)
 *   data-language — initial language (Hindi | English | Bhojpuri | Maithili)
 *   data-position — bottom-right | bottom-left  (default: bottom-right)
 *
 * Render isolation via Shadow DOM so host page CSS cannot leak in.
 */
(function () {
  if (window.__biharUdyogMitraLoaded) return
  window.__biharUdyogMitraLoaded = true

  const script = document.currentScript || [...document.querySelectorAll('script')].pop()
  const CONFIG = {
    apiUrl:   script?.dataset?.api      || '/api/chat',
    language: script?.dataset?.language || 'Hindi',
    position: script?.dataset?.position || 'bottom-right',
  }

  // ───────────────────────────── Bihar MSME knowledge (for offline fallback only)
  const SECTORS = [
    { code: 'MFG',     label: 'Manufacturing',   ico: '🏭' },
    { code: 'TEXTILE', label: 'Textile / Silk',  ico: '🧵' },
    { code: 'FOOD',    label: 'Food Processing', ico: '🥫' },
    { code: 'ARTISAN', label: 'Artisan / Craft', ico: '🧑‍🎨' },
    { code: 'SERVICE', label: 'Services',        ico: '💼' },
    { code: 'TRADE',   label: 'Trading',         ico: '🛍' },
    { code: 'TECH',    label: 'Tech / Startup',  ico: '💻' },
    { code: 'LEATHER', label: 'Leather',         ico: '👞' },
  ]
  const BIHAR_DISTRICTS = ['Patna','Bhagalpur','Muzaffarpur','Madhubani','Darbhanga','Purnia','Gaya','Sitamarhi','Vaishali','Begusarai','Munger','Bhojpur','Saran','Nalanda','East Champaran','West Champaran','Aurangabad','Rohtas','Khagaria','Banka','Jamui','Samastipur','Sheikhpura','Lakhisarai','Jehanabad','Arwal','Saharsa','Madhepura','Supaul','Araria','Kishanganj','Katihar','Kaimur','Buxar','Nawada','Gopalganj','Siwan','Sheohar']
  const LANGS = [
    { code: 'Hindi',    flag: '🇮🇳', label: 'हिं' },
    { code: 'English',  flag: '🇬🇧', label: 'EN' },
    { code: 'Bhojpuri', flag: '🪔', label: 'भोज' },
    { code: 'Maithili', flag: '🪷', label: 'मैथ' },
  ]
  const QUICK_SUGGESTIONS = {
    Hindi:   ['मेरा silk ka business hai Bhagalpur me, ₹10 lakh chahiye', 'Mukhyamantri Udyami Yojana ke baare me batao', 'Delayed payment ke liye MSEFC kaise file karu'],
    English: ['I run a silk business in Bhagalpur, need ₹10 lakh', 'Tell me about Mukhyamantri Udyami Yojana', 'How to file MSEFC for delayed payment'],
    Bhojpuri:['हमर silk के काम बा Bhagalpur में, ₹10 lakh लोन चाहीं', 'Mukhyamantri Udyami Yojana का बा?', 'पईसा नाहीं मिलल — MSEFC में शिकायत कइसे करीं'],
    Maithili:['हमर silk के व्यवसाय अछि Bhagalpur में, ₹10 लाख लोन चाही', 'Mukhyamantri Udyami Yojana की अछि?', 'पाइ नहि भेटल — MSEFC में शिकायत कोना करू'],
  }

  // ───────────────────────────── Styles (scoped inside shadow DOM)
  const CSS = `
    :host{
      all:initial;
      font-family:'Inter','Noto Sans Devanagari',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
      color:#0c1e3a;
    }
    *{box-sizing:border-box;margin:0;padding:0}
    .launcher{
      position:fixed;${CONFIG.position === 'bottom-left' ? 'left:20px' : 'right:20px'};bottom:20px;
      width:62px;height:62px;border-radius:50%;
      background:linear-gradient(135deg,#091e3c 0%,#1a4d8f 55%,#e6a817 100%);
      color:#fff;border:none;cursor:pointer;
      box-shadow:0 8px 24px rgba(9,30,60,0.35), 0 0 0 4px rgba(230,168,23,0.18);
      font-size:28px;z-index:2147483646;
      display:flex;align-items:center;justify-content:center;
      transition:transform 0.2s;
      animation:bumWidgetPulse 2.5s ease-in-out infinite;
    }
    .launcher:hover{transform:scale(1.06)}
    .launcher .dot{
      position:absolute;top:5px;right:5px;width:14px;height:14px;background:#10B981;
      border:2px solid #fff;border-radius:50%;
    }
    @keyframes bumWidgetPulse{
      0%,100%{box-shadow:0 8px 24px rgba(9,30,60,0.35), 0 0 0 4px rgba(230,168,23,0.18)}
      50%{box-shadow:0 8px 24px rgba(9,30,60,0.5), 0 0 0 10px rgba(230,168,23,0.25)}
    }
    .panel{
      position:fixed;${CONFIG.position === 'bottom-left' ? 'left:20px' : 'right:20px'};bottom:92px;
      width:380px;max-width:calc(100vw - 40px);
      height:580px;max-height:calc(100vh - 120px);
      background:#fff;border-radius:18px;
      box-shadow:0 20px 60px rgba(9,30,60,0.35);
      display:none;flex-direction:column;overflow:hidden;
      z-index:2147483647;
      border:1px solid #cdd9ec;
    }
    .panel.open{display:flex;animation:bumWidgetSlide 0.22s ease-out}
    @keyframes bumWidgetSlide{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}

    .header{
      background:linear-gradient(135deg,#091e3c 0%,#1a4d8f 60%,#e6a817 130%);
      color:#fff;padding:12px 14px;display:flex;align-items:center;gap:10px;flex-shrink:0;
      position:relative;overflow:hidden;
    }
    .header::before{
      content:'';position:absolute;inset:0;
      background:radial-gradient(circle at 90% 0%, rgba(255,255,255,0.15) 0, transparent 40%);
    }
    .header .avatar{
      width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,0.2);
      display:flex;align-items:center;justify-content:center;font-size:18px;
      border:1px solid rgba(255,255,255,0.3);position:relative;z-index:1;
    }
    .header .meta{flex:1;min-width:0;position:relative;z-index:1}
    .header .title{font-size:14px;font-weight:800;letter-spacing:-0.2px}
    .header .sub{font-size:10px;opacity:0.9;margin-top:1px}
    .header .lang-btn{
      background:rgba(255,255,255,0.18);border:1px solid rgba(255,255,255,0.3);
      border-radius:14px;padding:4px 9px;font-size:11px;font-weight:700;color:#fff;cursor:pointer;
      position:relative;z-index:1;
    }
    .header .x{
      background:rgba(255,255,255,0.18);border:1px solid rgba(255,255,255,0.3);
      border-radius:50%;width:26px;height:26px;display:flex;align-items:center;justify-content:center;
      color:#fff;font-size:14px;cursor:pointer;flex-shrink:0;position:relative;z-index:1;
    }

    .lang-menu{
      position:absolute;top:48px;right:60px;background:#fff;border:1px solid #cdd9ec;
      border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,0.15);z-index:5;display:none;
      min-width:130px;overflow:hidden;
    }
    .lang-menu.open{display:block}
    .lang-menu button{
      display:flex;align-items:center;gap:8px;width:100%;padding:8px 12px;
      font-size:12px;font-weight:600;color:#0c1e3a;background:#fff;border:none;
      cursor:pointer;text-align:left;border-bottom:1px solid #f3f6fb;
    }
    .lang-menu button.active{background:rgba(26,77,143,0.1);color:#1a4d8f}

    .tabs{display:flex;background:#f3f6fb;border-bottom:1px solid #e0e7f3;flex-shrink:0}
    .tab{
      flex:1;padding:9px 8px;font-size:11.5px;font-weight:800;color:#697a96;
      background:none;border:none;cursor:pointer;text-align:center;
      position:relative;transition:color 0.15s;
    }
    .tab.active{color:#1a4d8f;background:#fff}
    .tab.active::after{
      content:'';position:absolute;left:0;right:0;bottom:0;height:2px;background:#1a4d8f;
    }

    .scroll{flex:1;overflow-y:auto;padding:10px;display:flex;flex-direction:column;gap:8px;background:linear-gradient(180deg,#eaf0f8 0%,#f3f6fb 100%)}
    .scroll::-webkit-scrollbar{width:6px}
    .scroll::-webkit-scrollbar-thumb{background:#cdd9ec;border-radius:3px}

    .hero-note{
      background:linear-gradient(135deg,#fdf3d6,#fbeaa3);
      border:1px solid #e6a817;border-radius:10px;
      padding:8px 10px;font-size:11px;color:#8a5d0b;line-height:1.5;font-weight:600;
      display:flex;gap:8px;align-items:flex-start;
    }
    .hero-note .ico{font-size:16px;flex-shrink:0}

    .msg-bot{display:flex;gap:6px;align-items:flex-end}
    .msg-bot .av{
      width:26px;height:26px;border-radius:50%;flex-shrink:0;
      background:linear-gradient(135deg,#091e3c,#1a4d8f);color:#fff;
      display:flex;align-items:center;justify-content:center;font-size:13px;
    }
    .bub-bot{
      background:#fff;border:1px solid #e0e7f3;border-radius:12px 12px 12px 4px;
      padding:9px 12px;font-size:12.5px;color:#0c1e3a;max-width:80%;line-height:1.55;
      box-shadow:0 1px 3px rgba(9,30,60,0.06);
    }
    .bub-bot strong{font-weight:800;color:#091e3c}
    .bub-bot a{color:#1a4d8f;font-weight:700;text-decoration:underline;word-break:break-all}
    .msg-user{display:flex;justify-content:flex-end}
    .bub-user{
      background:linear-gradient(135deg,#091e3c 0%,#1a4d8f 55%,#e6a817 110%);color:#fff;
      border-radius:12px 12px 4px 12px;padding:9px 12px;font-size:12.5px;max-width:78%;line-height:1.45;
      font-weight:500;
    }

    .quick-row{display:flex;flex-wrap:wrap;gap:5px;margin-left:32px;margin-top:2px}
    .quick{
      background:#fff;border:1px solid #cdd9ec;border-radius:14px;padding:5px 9px;
      font-size:11px;font-weight:700;color:#2c3e5e;cursor:pointer;line-height:1.3;
    }
    .quick:hover{background:rgba(26,77,143,0.08);border-color:#1a4d8f;color:#1a4d8f}

    .thinking{display:inline-flex;gap:3px;align-items:center}
    .thinking span{width:5px;height:5px;border-radius:50%;background:#1a4d8f;animation:bumThink 1s infinite}
    .thinking span:nth-child(2){animation-delay:0.18s}
    .thinking span:nth-child(3){animation-delay:0.36s}
    @keyframes bumThink{0%,100%{opacity:0.3}50%{opacity:1}}

    /* Simple input bar */
    .simple-input{
      padding:10px;background:#fff;border-top:1px solid #e0e7f3;flex-shrink:0;
      display:flex;flex-direction:column;gap:8px;
    }
    .mic-row{display:flex;align-items:center;gap:8px}
    .mic-btn{
      width:48px;height:48px;border-radius:50%;flex-shrink:0;border:none;cursor:pointer;
      background:linear-gradient(135deg,#091e3c,#1a4d8f);color:#fff;font-size:20px;
      display:flex;align-items:center;justify-content:center;
      transition:all 0.2s;position:relative;
    }
    .mic-btn:hover{transform:scale(1.05)}
    .mic-btn.listening{
      background:linear-gradient(135deg,#c41e3a,#ef4444);
      animation:bumPulseRing 1.2s ease-out infinite;
    }
    @keyframes bumPulseRing{
      0%{box-shadow:0 0 0 0 rgba(239,68,68,0.55)}
      100%{box-shadow:0 0 0 14px rgba(239,68,68,0)}
    }
    .mic-label{flex:1;font-size:12px;color:#2c3e5e;font-weight:600}
    .mic-label .hint{display:block;font-size:10.5px;color:#697a96;font-weight:500;margin-top:1px}
    .text-row{display:flex;gap:6px;align-items:center}
    .text-input{
      flex:1;padding:9px 14px;border:1.5px solid #cdd9ec;border-radius:22px;
      font-size:12.5px;color:#0c1e3a;outline:none;background:#f3f6fb;font-family:inherit;
    }
    .text-input:focus{border-color:#1a4d8f;background:#fff}
    .send-btn{
      width:38px;height:38px;border-radius:50%;flex-shrink:0;border:none;cursor:pointer;
      background:linear-gradient(135deg,#091e3c,#1a4d8f);color:#fff;font-size:16px;
      display:flex;align-items:center;justify-content:center;
    }
    .send-btn:disabled{background:#cdd9ec;cursor:not-allowed}

    /* Listening overlay */
    .listening-overlay{
      background:linear-gradient(135deg,#fee2e2,#fecaca);border:1px solid #fca5a5;
      border-radius:10px;padding:10px 12px;font-size:12px;color:#991b1b;
      display:flex;align-items:center;gap:8px;font-weight:700;
    }
    .listening-overlay .waves{display:flex;gap:2px;align-items:center}
    .listening-overlay .waves span{width:3px;border-radius:3px;background:#c41e3a;animation:bumWave 0.9s ease-in-out infinite}
    .listening-overlay .waves span:nth-child(1){height:8px;animation-delay:0s}
    .listening-overlay .waves span:nth-child(2){height:14px;animation-delay:0.13s}
    .listening-overlay .waves span:nth-child(3){height:18px;animation-delay:0.26s}
    .listening-overlay .waves span:nth-child(4){height:14px;animation-delay:0.39s}
    .listening-overlay .waves span:nth-child(5){height:8px;animation-delay:0.52s}
    @keyframes bumWave{0%,100%{transform:scaleY(0.4)}50%{transform:scaleY(1.1)}}

    /* Advanced form */
    .adv-pane{padding:12px;overflow-y:auto;flex:1;background:#f3f6fb}
    .adv-pane::-webkit-scrollbar{width:6px}
    .adv-pane::-webkit-scrollbar-thumb{background:#cdd9ec;border-radius:3px}
    .adv-row{margin-bottom:10px}
    .adv-label{font-size:11px;font-weight:800;color:#091e3c;margin-bottom:5px;display:block}
    .adv-input,.adv-select{
      width:100%;padding:8px 12px;font-size:12.5px;color:#0c1e3a;
      border:1.5px solid #cdd9ec;border-radius:10px;background:#fff;outline:none;font-family:inherit;
    }
    .adv-input:focus,.adv-select:focus{border-color:#1a4d8f}
    .chips{display:flex;flex-wrap:wrap;gap:5px}
    .adv-chip{
      padding:5px 10px;border-radius:14px;font-size:11px;font-weight:700;cursor:pointer;
      border:1.5px solid #cdd9ec;background:#fff;color:#2c3e5e;
    }
    .adv-chip.active{background:linear-gradient(135deg,#091e3c,#1a4d8f);color:#fff;border-color:#1a4d8f}
    .adv-save{
      width:100%;padding:10px;border:none;border-radius:10px;
      background:linear-gradient(135deg,#091e3c 0%,#1a4d8f 55%,#e6a817 100%);
      color:#fff;font-weight:800;font-size:13px;cursor:pointer;margin-top:6px;
    }

    /* Footer attribution */
    .footer{
      padding:6px 12px;background:#f3f6fb;border-top:1px solid #e0e7f3;flex-shrink:0;
      font-size:9.5px;color:#697a96;text-align:center;line-height:1.4;font-weight:600;
    }
    .footer a{color:#1a4d8f;font-weight:700;text-decoration:none}
  `

  // ───────────────────────────── markdown-lite render
  function renderMarkdown(text) {
    // Escape HTML
    let safe = (text || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    // bold
    safe = safe.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    // links
    safe = safe.replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>')
    // Lists & headings
    const lines = safe.split('\n')
    let html = ''
    for (const ln of lines) {
      if (/^### /.test(ln))       html += `<div style="font-weight:800;color:#0f3263;margin-top:6px">${ln.slice(4)}</div>`
      else if (/^## /.test(ln))   html += `<div style="font-weight:900;color:#091e3c;margin-top:8px;font-size:13px">${ln.slice(3)}</div>`
      else if (/^# /.test(ln))    html += `<div style="font-weight:900;color:#1a4d8f;margin-top:8px;font-size:14px">${ln.slice(2)}</div>`
      else if (/^[•\-\*] /.test(ln)) html += `<div style="display:flex;gap:6px;margin-top:3px"><span style="color:#1a4d8f;font-size:8px;margin-top:5px">●</span><span>${ln.slice(2)}</span></div>`
      else if (/^\d+\. /.test(ln)) html += `<div style="margin-top:3px">${ln}</div>`
      else if (ln.trim() === '')  html += '<div style="height:5px"></div>'
      else                         html += `<div>${ln}</div>`
    }
    return html
  }

  // ───────────────────────────── State
  let state = {
    msgs: [],
    typing: false,
    isOpen: false,
    isListening: false,
    tab: 'simple', // simple | advanced
    language: CONFIG.language,
    profile: JSON.parse(localStorage.getItem('bum_widget_profile') || 'null') || {},
  }
  let recognition = null

  // ───────────────────────────── DOM build
  const host = document.createElement('div')
  host.id = 'bihar-udyog-mitra-widget-root'
  document.body.appendChild(host)
  const root = host.attachShadow({ mode: 'open' })

  const style = document.createElement('style')
  style.textContent = CSS
  root.appendChild(style)

  const launcher = document.createElement('button')
  launcher.className = 'launcher'
  launcher.title = 'Udyog Mitra AI'
  launcher.innerHTML = '🤖<span class="dot"></span>'
  root.appendChild(launcher)

  const panel = document.createElement('div')
  panel.className = 'panel'
  panel.innerHTML = `
    <div class="header">
      <div class="avatar">🤖</div>
      <div class="meta">
        <div class="title">Udyog Mitra AI</div>
        <div class="sub" id="sub">● Online · ${state.language}</div>
      </div>
      <button class="lang-btn" id="langBtn">${LANGS.find(l => l.code === state.language)?.flag} ${LANGS.find(l => l.code === state.language)?.label}</button>
      <button class="x" id="closeBtn">×</button>
      <div class="lang-menu" id="langMenu">
        ${LANGS.map(l => `<button data-lang="${l.code}" class="${l.code === state.language ? 'active' : ''}">${l.flag} ${l.code}</button>`).join('')}
      </div>
    </div>

    <div class="tabs">
      <button class="tab active" id="tabSimple">🎤 Simple — Bolke poochho</button>
      <button class="tab" id="tabAdv">⚙️ Advanced</button>
    </div>

    <!-- Simple chat pane -->
    <div class="scroll" id="scroll"></div>

    <div class="simple-input" id="simpleInput">
      <div class="mic-row">
        <button class="mic-btn" id="micBtn" title="Tap to speak">🎤</button>
        <div class="mic-label">
          <span id="micText">Tap mic to speak</span>
          <span class="hint" id="micHint">Hindi · English · Bhojpuri · Maithili — sab samajhta hu</span>
        </div>
      </div>
      <div class="text-row">
        <input class="text-input" id="textInput" type="text" placeholder="…ya yahaan likhke poochiye" />
        <button class="send-btn" id="sendBtn" disabled>➤</button>
      </div>
    </div>

    <!-- Advanced form pane -->
    <div class="adv-pane" id="advPane" style="display:none">
      <div class="hero-note" style="margin-bottom:10px"><span class="ico">⚙️</span><div>Apna business profile ek baar set kar dijiye — Udyog Mitra AI har scheme, loan, training suggestion <b>aapke business ke liye sahi</b> de payega.</div></div>

      <div class="adv-row">
        <label class="adv-label">👤 Aapka naam</label>
        <input class="adv-input" id="advName" placeholder="e.g. Rajesh Kumar" />
      </div>
      <div class="adv-row">
        <label class="adv-label">🏪 Business name (optional)</label>
        <input class="adv-input" id="advBiz" placeholder="e.g. Maa Tara Silk Weavers" />
      </div>
      <div class="adv-row">
        <label class="adv-label">📍 District</label>
        <select class="adv-select" id="advDist">
          <option value="">— select Bihar district —</option>
          ${BIHAR_DISTRICTS.map(d => `<option value="${d}">${d}</option>`).join('')}
        </select>
      </div>
      <div class="adv-row">
        <label class="adv-label">🏭 Sector</label>
        <div class="chips" id="advSector">
          ${SECTORS.map(s => `<button class="adv-chip" data-code="${s.code}" data-label="${s.label}">${s.ico} ${s.label}</button>`).join('')}
        </div>
      </div>
      <div class="adv-row">
        <label class="adv-label">⏳ Business stage</label>
        <div class="chips" id="advStage">
          ${[{c:'NEW',l:'New / idea'},{c:'NEW',l:'0–6 months'},{c:'EXISTING',l:'6m–3 yrs'},{c:'EXISTING',l:'3+ years'}].map(x => `<button class="adv-chip" data-code="${x.c}" data-label="${x.l}">${x.l}</button>`).join('')}
        </div>
      </div>
      <div class="adv-row">
        <label class="adv-label">🪪 Category (for scheme matching)</label>
        <div class="chips" id="advCat">
          ${[{c:'GENERAL_YOUTH',l:'General'},{c:'SC',l:'SC'},{c:'ST',l:'ST'},{c:'EBC',l:'EBC'},{c:'BC',l:'BC'},{c:'MAHILA',l:'Mahila'},{c:'MINORITY',l:'Minority'}].map(x => `<button class="adv-chip" data-code="${x.c}" data-label="${x.l}">${x.l}</button>`).join('')}
        </div>
      </div>
      <div class="adv-row">
        <label class="adv-label">📦 Products / services</label>
        <input class="adv-input" id="advProducts" placeholder="e.g. Bhagalpuri silk sarees, hand-loom" />
      </div>
      <button class="adv-save" id="advSave">💾 Save & switch to Simple chat</button>
    </div>

    <div class="footer">
      Powered by Claude AI · Source: <a href="https://dcmsme.gov.in/Bihar.aspx" target="_blank">DC-MSME · Bihar</a> · Dept of Industries, Govt of Bihar
    </div>
  `
  root.appendChild(panel)

  // ───────────────────────────── References
  const $ = (sel) => root.querySelector(sel)
  const scrollEl = $('#scroll')
  const micBtn = $('#micBtn'), micText = $('#micText'), micHint = $('#micHint')
  const textInput = $('#textInput'), sendBtn = $('#sendBtn')
  const tabSimple = $('#tabSimple'), tabAdv = $('#tabAdv')
  const simpleInput = $('#simpleInput'), advPane = $('#advPane')
  const subEl = $('#sub'), langBtn = $('#langBtn'), langMenu = $('#langMenu')

  // ───────────────────────────── Open / close
  function open() {
    state.isOpen = true
    panel.classList.add('open')
    if (state.msgs.length === 0) greet()
  }
  function close() {
    state.isOpen = false
    panel.classList.remove('open')
  }
  launcher.addEventListener('click', () => state.isOpen ? close() : open())
  $('#closeBtn').addEventListener('click', close)

  // ───────────────────────────── Greeting
  function greet() {
    const name = state.profile.name ? ' ' + state.profile.name + ' जी' : ''
    const sector = state.profile.sector ? ` Aap **${state.profile.sector}** me hain${state.profile.district ? `, **${state.profile.district}** se` : ''} — har baat aapke business ke liye personalise karunga 🎯` : ''
    const text = state.language === 'English'
      ? `🙏 Namaskar${name}! I'm Udyog Mitra AI — Bihar's MSME copilot. Ask me anything — schemes, loans, DPR, grievances.${sector}`
      : `🙏 नमस्कार${name}! Main Udyog Mitra hu — Bihar MSMEs ka AI copilot. Mujhse poochho — scheme, loan, DPR, grievance.${sector}`
    pushBot(text)
    renderQuickChips()
  }

  // ───────────────────────────── Render messages
  function pushBot(text) {
    state.msgs.push({ from: 'bot', text })
    const div = document.createElement('div')
    div.className = 'msg-bot'
    div.innerHTML = `<div class="av">🤖</div><div class="bub-bot">${renderMarkdown(text)}</div>`
    scrollEl.appendChild(div)
    scrollEl.scrollTop = scrollEl.scrollHeight
  }
  function pushUser(text) {
    state.msgs.push({ from: 'user', text })
    const div = document.createElement('div')
    div.className = 'msg-user'
    div.innerHTML = `<div class="bub-user">${text.replace(/</g, '&lt;')}</div>`
    scrollEl.appendChild(div)
    scrollEl.scrollTop = scrollEl.scrollHeight
  }
  function renderQuickChips() {
    const wrapper = document.createElement('div')
    wrapper.className = 'quick-row'
    const list = QUICK_SUGGESTIONS[state.language] || QUICK_SUGGESTIONS.Hindi
    wrapper.innerHTML = list.map(q => `<button class="quick">${q}</button>`).join('')
    wrapper.querySelectorAll('.quick').forEach(btn => btn.addEventListener('click', () => send(btn.textContent)))
    scrollEl.appendChild(wrapper)
    scrollEl.scrollTop = scrollEl.scrollHeight
  }
  function showThinking() {
    const div = document.createElement('div')
    div.className = 'msg-bot'
    div.id = 'thinkingRow'
    div.innerHTML = `<div class="av">🤖</div><div class="bub-bot"><div class="thinking"><span></span><span></span><span></span></div></div>`
    scrollEl.appendChild(div)
    scrollEl.scrollTop = scrollEl.scrollHeight
  }
  function hideThinking() {
    const t = $('#thinkingRow')
    if (t) t.remove()
  }

  // ───────────────────────────── Voice (Web Speech)
  const VOICE_LANG_MAP = { Hindi: 'hi-IN', Bhojpuri: 'hi-IN', Maithili: 'hi-IN', English: 'en-IN' }
  function toggleVoice() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) {
      micText.textContent = 'Voice not supported · type instead'
      return
    }
    if (state.isListening) { recognition?.stop(); return }
    recognition = new SR()
    recognition.lang = VOICE_LANG_MAP[state.language] || 'en-IN'
    recognition.interimResults = true
    recognition.continuous = false
    recognition.onstart = () => {
      state.isListening = true
      micBtn.classList.add('listening')
      micBtn.innerHTML = `<div style="display:flex;gap:2px;align-items:center"><span style="width:3px;height:8px;background:#fff;border-radius:2px"></span><span style="width:3px;height:14px;background:#fff;border-radius:2px"></span><span style="width:3px;height:18px;background:#fff;border-radius:2px"></span><span style="width:3px;height:14px;background:#fff;border-radius:2px"></span><span style="width:3px;height:8px;background:#fff;border-radius:2px"></span></div>`
      micText.textContent = state.language === 'English' ? 'Listening…' : 'सुन रहा हूँ…'
      micHint.textContent = 'Bolna band kareiye, automatic send ho jaayega'
    }
    recognition.onresult = (e) => {
      let interim = '', finalT = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) finalT += e.results[i][0].transcript
        else interim += e.results[i][0].transcript
      }
      const txt = (finalT + interim).trim()
      if (txt) textInput.value = txt
      sendBtn.disabled = !textInput.value.trim()
      if (finalT) {
        // Auto-send the final transcript
        setTimeout(() => {
          if (textInput.value.trim()) send(textInput.value.trim())
        }, 400)
      }
    }
    recognition.onerror = (e) => {
      micText.textContent = e.error === 'no-speech' ? 'Kuch suna nahi · phir try kareiye' : 'Voice error · type kareiye'
    }
    recognition.onend = () => {
      state.isListening = false
      micBtn.classList.remove('listening')
      micBtn.innerHTML = '🎤'
      micText.textContent = 'Tap mic to speak'
      micHint.textContent = 'Hindi · English · Bhojpuri · Maithili — sab samajhta hu'
    }
    try { recognition.start() } catch { /* already started */ }
  }
  micBtn.addEventListener('click', toggleVoice)

  // ───────────────────────────── Send
  async function send(textOverride) {
    const text = (textOverride || textInput.value).trim()
    if (!text || state.typing) return
    textInput.value = ''
    sendBtn.disabled = true
    // Clear quick-chip suggestions if first message
    scrollEl.querySelectorAll('.quick-row').forEach(n => n.remove())
    pushUser(text)
    state.typing = true
    subEl.textContent = '⚡ Soch raha hu…'
    showThinking()
    try {
      const res = await fetch(CONFIG.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: state.msgs,
          userProfile: state.profile,
          language: state.language,
          persona: 'MSME',
        }),
      })
      const data = await res.json()
      hideThinking()
      if (!res.ok || data.error) throw new Error(data.error || 'AI error')
      pushBot(data.reply)
    } catch (err) {
      hideThinking()
      const code = err.message
      const fallback = (code === 'AI_OVERLOADED' || code === 'AI_UNAVAILABLE' || code === 'AI_NOT_CONFIGURED')
        ? localFallback(text)
        : '⚠️ Connection issue. Ek minute me try kariye. 🔄'
      pushBot(fallback)
    } finally {
      state.typing = false
      subEl.textContent = `● Online · ${state.language}`
    }
  }
  sendBtn.addEventListener('click', () => send())
  textInput.addEventListener('input', () => sendBtn.disabled = !textInput.value.trim())
  textInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') send() })

  // ───────────────────────────── Offline fallback (only if API truly unreachable)
  function localFallback(msg) {
    const m = msg.toLowerCase()
    if (/loan|udhar|paisa|कर्ज|लोन/.test(m)) {
      return `💰 **Bihar MSME loan ke 3 raste:**\n\n1. **Bihar Mukhyamantri Udyami Yojana (MMUY)** — ₹10L total: ₹5L subsidy + ₹5L interest-free. Apply: udyami.bihar.gov.in (Bihar's flagship state scheme)\n2. **PM MUDRA** — ₹50K to ₹20L, no collateral. Any bank.\n3. **PMEGP** — up to ₹25L mfg, 15-35% margin money subsidy. Portal: kviconline.gov.in/pmegpeportal\n\n👉 As per **DC-MSME Bihar** (dcmsme.gov.in/Bihar.aspx): contact MSME-DI Patna for hand-holding.`
    }
    if (/scheme|yojana|योजना/.test(m)) {
      return `🎯 **Top schemes for Bihar MSMEs:**\n\n• 🟢 **Bihar Mukhyamantri Udyami Yojana** — ₹5L subsidy + ₹5L interest-free\n• 🔵 **PM MUDRA** — collateral-free up to ₹20L\n• 🔵 **PMEGP** — for new manufacturing units\n• 🔵 **PMFME** — 35% subsidy for food processing (great for makhana, litchi)\n• 🔵 **CGTMSE** — collateral-free credit guarantee up to ₹5Cr\n\nSource: dcmsme.gov.in/Bihar.aspx`
    }
    if (/grievance|payment|shikayat|delayed/.test(m)) {
      return `⚖️ **MSEFC route — for delayed payment:**\n\n• Must be Udyam-registered\n• Payment >45 days overdue\n• File online: **samadhaan.msme.gov.in**\n• Legal basis: MSMED Act 2006, Sec 15-24\n• Also try **TReDS** (rxil.in / m1xchange.com) for invoice discounting`
    }
    return `🙏 Main Udyog Mitra AI hu. Aap mujhse poochh sakte hain:\n• Loan / scheme suggestions\n• Bihar Mukhyamantri Udyami Yojana details\n• MSEFC / delayed payment\n• DPR banwana\n• Skills / training\n\nSource: dcmsme.gov.in/Bihar.aspx · Dept of Industries, Bihar`
  }

  // ───────────────────────────── Language switcher
  langBtn.addEventListener('click', (e) => { e.stopPropagation(); langMenu.classList.toggle('open') })
  document.addEventListener('click', () => langMenu.classList.remove('open'))
  langMenu.addEventListener('click', (e) => e.stopPropagation())
  langMenu.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      state.language = btn.dataset.lang
      langMenu.querySelectorAll('button').forEach(b => b.classList.toggle('active', b === btn))
      const l = LANGS.find(x => x.code === state.language)
      langBtn.textContent = `${l.flag} ${l.label}`
      subEl.textContent = `● Online · ${state.language}`
      langMenu.classList.remove('open')
    })
  })

  // ───────────────────────────── Tabs
  tabSimple.addEventListener('click', () => switchTab('simple'))
  tabAdv.addEventListener('click', () => switchTab('advanced'))
  function switchTab(t) {
    state.tab = t
    tabSimple.classList.toggle('active', t === 'simple')
    tabAdv.classList.toggle('active', t === 'advanced')
    scrollEl.style.display = t === 'simple' ? 'flex' : 'none'
    simpleInput.style.display = t === 'simple' ? 'flex' : 'none'
    advPane.style.display = t === 'advanced' ? 'block' : 'none'
    if (t === 'advanced') restoreAdv()
  }
  function restoreAdv() {
    $('#advName').value = state.profile.name || ''
    $('#advBiz').value = state.profile.businessName || ''
    $('#advDist').value = state.profile.district || ''
    $('#advProducts').value = state.profile.products || ''
    root.querySelectorAll('#advSector .adv-chip').forEach(c => c.classList.toggle('active', c.dataset.label === state.profile.sector))
    root.querySelectorAll('#advStage .adv-chip').forEach(c => c.classList.toggle('active', c.dataset.label === state.profile.stageLabel))
    root.querySelectorAll('#advCat .adv-chip').forEach(c => c.classList.toggle('active', c.dataset.code === state.profile.categoryCode))
  }
  function toggleChipGroup(groupSel) {
    root.querySelectorAll(`${groupSel} .adv-chip`).forEach(chip => {
      chip.addEventListener('click', () => {
        root.querySelectorAll(`${groupSel} .adv-chip`).forEach(c => c.classList.toggle('active', c === chip))
      })
    })
  }
  toggleChipGroup('#advSector')
  toggleChipGroup('#advStage')
  toggleChipGroup('#advCat')

  $('#advSave').addEventListener('click', () => {
    const activeSector = root.querySelector('#advSector .adv-chip.active')
    const activeStage  = root.querySelector('#advStage .adv-chip.active')
    const activeCat    = root.querySelector('#advCat .adv-chip.active')
    state.profile = {
      ...state.profile,
      name: $('#advName').value.trim(),
      businessName: $('#advBiz').value.trim(),
      district: $('#advDist').value,
      sector: activeSector?.dataset.label || '',
      sectorCode: activeSector?.dataset.code || '',
      stageLabel: activeStage?.dataset.label || '',
      stage: activeStage?.dataset.code || '',
      categoryCode: activeCat?.dataset.code || '',
      category: activeCat?.dataset.label || '',
      products: $('#advProducts').value.trim(),
      domicile: 'BIHAR',
    }
    try { localStorage.setItem('bum_widget_profile', JSON.stringify(state.profile)) } catch {}
    // Reset chat to greet with new context
    state.msgs = []
    scrollEl.innerHTML = ''
    switchTab('simple')
    greet()
  })

})();
