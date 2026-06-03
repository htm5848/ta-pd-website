// ── Research Tool Hub ────────────────────────────────────────────────────────
const RESEARCH_TOOLS = [
  { id:1, title:"Talking & Listening",      desc:"Track individual talking/listening at 1-min intervals", color:"var(--orange)", bg:"var(--orange-lt)", icon:'<circle cx="8" cy="8" r="3"/><path d="M1 8s2-5 7-5 7 5 7 5-2 5-7 5-7-5-7-5z"/>' },
  { id:2, title:"Whiteboard Usage",          desc:"Log which tables write on the board and what type",      color:"var(--blue)",   bg:"var(--blue-lt)",   icon:'<rect x="1" y="2" width="14" height="10" rx="1.5"/><path d="M4 15h8M8 12v3"/>' },
  { id:3, title:"TA Position Map",           desc:"Track where the TA stands during class over time",       color:"var(--green)",  bg:"var(--green-lt)",  icon:'<path d="M8 1a3 3 0 100 6 3 3 0 000-6z"/><path d="M2 14s-1-1 0-3c1-2 3-3 6-3s5 1 6 3c1 2 0 3 0 3"/>' },
  { id:4, title:"Question Type Logger",      desc:"Classify TA and student questions as they happen",       color:"var(--purple)", bg:"var(--purple-lt)", icon:'<circle cx="8" cy="8" r="7"/><path d="M8 5v3M8 11v.5"/>' },
  { id:5, title:"Group Dynamics Coder",      desc:"Rate each table: on-task, stuck, off-task, productive",  color:"var(--teal)",   bg:"var(--teal-lt)",   icon:'<rect x="1" y="1" width="6" height="6" rx="1"/><rect x="9" y="1" width="6" height="6" rx="1"/><rect x="1" y="9" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/>' },
  { id:6, title:"Student-TA Interactions",   desc:"Log who initiates, duration, and which table",           color:"var(--orange)", bg:"var(--orange-lt)", icon:'<path d="M14 10a1 1 0 01-1 1H4l-3 3V3a1 1 0 011-1h11a1 1 0 011 1v7z"/>' },
  { id:7, title:"Physics Reasoning",         desc:"Code student reasoning: recall, apply, conceptual",      color:"var(--blue)",   bg:"var(--blue-lt)",   icon:'<path d="M8 1l2 5h5l-4 3 2 5-5-3-5 3 2-5-4-3h5z"/>' },
  { id:8, title:"Time-on-Task Sweep",        desc:"Every 2 min: estimate % of students actively engaged",   color:"var(--green)",  bg:"var(--green-lt)",  icon:'<circle cx="8" cy="8" r="7"/><path d="M8 4v4l3 3"/>' },
];

let activeResearchTool = null;

function renderResearchToolGrid() {
  const grid = document.getElementById("research-tool-grid");
  if (!grid) return;
  grid.innerHTML = RESEARCH_TOOLS.map(t => `
    <div onclick="showResearchTool(${t.id})"
      style="background:var(--white);border:1px solid var(--sand-2);border-radius:12px;padding:16px;cursor:pointer;transition:all 0.15s;"
      onmouseover="this.style.boxShadow='0 4px 16px rgba(0,0,0,0.08)';this.style.borderColor='${t.color}'"
      onmouseout="this.style.boxShadow='';this.style.borderColor='var(--sand-2)'">
      <div style="width:36px;height:36px;border-radius:9px;background:${t.bg};display:flex;align-items:center;justify-content:center;margin-bottom:10px;">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="${t.color}" stroke-width="1.5" stroke-linecap="round">${t.icon}</svg>
      </div>
      <div style="font-size:12px;font-weight:600;color:var(--ink);margin-bottom:4px;line-height:1.3;">${t.title}</div>
      <div style="font-size:10px;color:var(--ink-3);line-height:1.5;">${t.desc}</div>
    </div>`).join("");
}

function showResearchTool(id) {
  document.getElementById("research-tool-grid").style.display = id ? "none" : "grid";
  for (let i = 1; i <= 8; i++) {
    const el = document.getElementById(`rtool-${i}`);
    if (el) el.style.display = (id === i) ? "block" : "none";
  }
  activeResearchTool = id;
  if (id === 2) renderWBTool();
  if (id === 3) initTAPosMap();
  if (id === 5) renderGDTool();
  if (id === 4) { renderQSummary(); renderQLog(); }
  if (id === 6) { renderIntLog(); renderIntSummary(); }
  if (id === 7) { renderReasoningSummary(); renderReasoningLog(); }
  if (id === 8) renderTOTLog();
}

// ── Tool 2: Whiteboard Usage ──────────────────────────────────────────────────
const WB_TYPES = ["Equations","Diagram","Words","Empty"];
const WB_TYPE_COLORS = { "Equations":"var(--blue)","Diagram":"var(--green)","Words":"var(--purple)","Empty":"var(--ink-3)" };
const wbState = {}; // { tableId: type }
const wbData = [];

function renderWBTool() {
  const n = parseInt(document.getElementById("wb-table-count")?.value || 6);
  const grid = document.getElementById("wb-table-grid");
  if (!grid) return;
  grid.innerHTML = Array.from({length:n},(_,i)=>{
    const id = i+1;
    const sel = wbState[id] || null;
    return `<div style="background:var(--white);border:1px solid var(--sand-2);border-radius:12px;padding:14px;">
      <div style="font-size:12px;font-weight:600;margin-bottom:10px;">Table ${id}</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
        ${WB_TYPES.map(t=>`<button onclick="setWBType(${id},'${t}')"
          style="padding:7px 4px;border:1px solid ${sel===t?WB_TYPE_COLORS[t]:"var(--sand-2)"};border-radius:7px;background:${sel===t?"rgba(0,0,0,0.05)":"var(--sand)"};color:${sel===t?WB_TYPE_COLORS[t]:"var(--ink-3)"};font-size:11px;font-weight:600;font-family:var(--sans);cursor:pointer;transition:all 0.1s;">${t}</button>`).join("")}
      </div>
    </div>`;
  }).join("");
}

function setWBType(id, type) { wbState[id] = type; renderWBTool(); }

function logWBSweep() {
  const n = parseInt(document.getElementById("wb-table-count")?.value || 6);
  const sweep = { time: new Date().toLocaleTimeString(), tables: {} };
  for (let i=1;i<=n;i++) sweep.tables[i] = wbState[i] || "Not observed";
  wbData.push(sweep);
  document.getElementById("wb-sweep-count").textContent = `${wbData.length} sweeps logged`;
  Object.keys(wbState).forEach(k => delete wbState[k]);
  renderWBTool();
}

function exportWBData() {
  if (!wbData.length) { alert("No sweeps logged yet."); return; }
  const tables = Object.keys(wbData[0].tables);
  let csv = "Sweep,Time," + tables.map(t=>`Table ${t}`).join(",") + "\n";
  wbData.forEach((d,i) => { csv += `${i+1},${d.time},${tables.map(t=>d.tables[t]).join(",")}\n`; });
  downloadCSV(csv, "whiteboard_usage");
}

// ── Tool 3: TA Position Map ───────────────────────────────────────────────────
const taPosData = [];
let taPosMapTables = [];

function initTAPosMap() {
  const n = parseInt(document.getElementById("ta-pos-table-count")?.value || 6);
  taPosMapTables = Array.from({length: n}, (_, i) => ({
    id: i + 1,
    pos: { x: 10 + (i % 2) * 130, y: 10 + Math.floor(i / 2) * 105 }
  }));
  renderTAPosMap();
}

function renderTAPosMap() {
  const n = parseInt(document.getElementById("ta-pos-table-count")?.value || 6);
  // If count changed, reinit
  if (taPosMapTables.length !== n) {
    taPosMapTables = Array.from({length: n}, (_, i) => ({
      id: i + 1,
      pos: { x: 10 + (i % 2) * 130, y: 10 + Math.floor(i / 2) * 105 }
    }));
  }
  const canvas = document.getElementById("ta-pos-canvas");
  if (!canvas) return;

  // Remove existing table nodes (keep position dots)
  canvas.querySelectorAll(".ta-pos-table-node").forEach(el => el.remove());

  taPosMapTables.forEach((t, i) => {
    const div = document.createElement("div");
    div.className = "ta-pos-table-node";
    div.draggable = true;
    div.style.cssText = `position:absolute;left:${t.pos.x}px;top:${t.pos.y}px;width:82px;height:60px;background:var(--blue-lt);border:2px solid var(--blue-md);border-radius:9px;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:grab;user-select:none;z-index:2;`;
    div.innerHTML = `<div style="font-size:9px;font-weight:700;color:var(--blue);font-family:var(--mono);letter-spacing:0.05em;">TABLE</div><div style="font-size:18px;font-weight:700;color:var(--blue);font-family:var(--mono);">${t.id}</div>`;
    div.onclick = e => e.stopPropagation(); // don't log position when dragging table
    div.ondragstart = e => {
      e.dataTransfer.setData("tpi", i);
      e.dataTransfer.setData("tpox", e.clientX - canvas.getBoundingClientRect().left - t.pos.x);
      e.dataTransfer.setData("tpoy", e.clientY - canvas.getBoundingClientRect().top - t.pos.y);
    };
    canvas.appendChild(div);
  });
}

function dropTAPosTable(e) {
  e.preventDefault();
  const canvas = document.getElementById("ta-pos-canvas");
  const i = parseInt(e.dataTransfer.getData("tpi"));
  if (isNaN(i)) return;
  const ox = parseFloat(e.dataTransfer.getData("tpox")) || 0;
  const oy = parseFloat(e.dataTransfer.getData("tpoy")) || 0;
  const rect = canvas.getBoundingClientRect();
  taPosMapTables[i].pos = {
    x: Math.max(0, Math.min(e.clientX - rect.left - ox, rect.width - 84)),
    y: Math.max(0, Math.min(e.clientY - rect.top - oy, rect.height - 62))
  };
  renderTAPosMap();
}

function getNearestTable(x, y) {
  if (!taPosMapTables.length) return null;
  let nearest = null, minDist = Infinity;
  taPosMapTables.forEach(t => {
    const cx = t.pos.x + 41, cy = t.pos.y + 30;
    const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
    if (dist < minDist) { minDist = dist; nearest = t; }
  });
  return minDist < 80 ? `Table ${nearest.id}` : null;
}

function logTAPosition(event, label) {
  const canvas = document.getElementById("ta-pos-canvas");
  let x = null, y = null, desc = label || "map click", nearTable = "";
  if (event && canvas) {
    const rect = canvas.getBoundingClientRect();
    x = Math.round(((event.clientX - rect.left) / rect.width) * 100);
    y = Math.round(((event.clientY - rect.top) / rect.height) * 100);
    const px = event.clientX - rect.left;
    const py = event.clientY - rect.top;
    nearTable = getNearestTable(px, py) || "";
    desc = nearTable ? `Near ${nearTable}` : `Open area (${x}%,${y}%)`;

    // Draw dot
    const dot = document.createElement("div");
    dot.style.cssText = `position:absolute;left:${px}px;top:${py}px;width:14px;height:14px;background:var(--orange);border-radius:50%;border:2px solid #fff;transform:translate(-50%,-50%);box-shadow:0 1px 4px rgba(0,0,0,0.25);z-index:10;pointer-events:none;`;
    const num = document.createElement("span");
    num.style.cssText = `position:absolute;top:-16px;left:50%;transform:translateX(-50%);font-size:9px;font-family:var(--mono);font-weight:700;color:var(--orange);white-space:nowrap;`;
    num.textContent = taPosData.length + 1;
    dot.appendChild(num);
    canvas.appendChild(dot);
  }
  taPosData.push({ time: new Date().toLocaleTimeString(), desc, nearTable, x, y });
  renderTAPosLog();
}

function renderTAPosLog() {
  const log = document.getElementById("ta-pos-log");
  const count = document.getElementById("ta-pos-count");
  if (!log) return;
  log.innerHTML = taPosData.slice().reverse().map((d, i) => `
    <div style="padding:9px 14px;border-bottom:1px solid var(--sand-2);display:flex;gap:10px;align-items:center;font-size:12px;">
      <span style="font-family:var(--mono);color:var(--ink-3);font-size:10px;min-width:58px;">${d.time}</span>
      <span style="color:var(--ink-2);flex:1;">${d.desc}</span>
      ${d.nearTable ? `<span style="font-size:10px;background:var(--blue-lt);color:var(--blue);padding:2px 7px;border-radius:20px;font-family:var(--mono);white-space:nowrap;">${d.nearTable}</span>` : ""}
    </div>`).join("") || `<div style="padding:20px;text-align:center;color:var(--ink-3);font-size:13px;">Click the map to log TA positions</div>`;
  if (count) count.textContent = `${taPosData.length} positions logged`;
}

function exportTAPosData() {
  if (!taPosData.length) { alert("No positions logged."); return; }
  let csv = "Log#,Time,Description,NearestTable,X%,Y%\n";
  taPosData.forEach((d, i) => { csv += `${i+1},${d.time},"${d.desc}","${d.nearTable}",${d.x??''},${d.y??''}\n`; });
  downloadCSV(csv, "ta_position");
}

// ── Tool 4: Question Type Logger ─────────────────────────────────────────────
const qData = [];
let qAsker = "TA";

function setQAsker(a) {
  qAsker = a;
  document.getElementById("qasker-ta").style.background = a==="TA"?"var(--orange)":"var(--white)";
  document.getElementById("qasker-ta").style.color = a==="TA"?"#fff":"var(--ink-2)";
  document.getElementById("qasker-ta").style.borderColor = a==="TA"?"var(--orange)":"var(--sand-2)";
  document.getElementById("qasker-student").style.background = a==="Student"?"var(--blue)":"var(--white)";
  document.getElementById("qasker-student").style.color = a==="Student"?"#fff":"var(--ink-2)";
  document.getElementById("qasker-student").style.borderColor = a==="Student"?"var(--blue)":"var(--sand-2)";
}

function logQuestion(type) {
  const note = document.getElementById("q-note")?.value || "";
  qData.push({ time: new Date().toLocaleTimeString(), type, asker: qAsker, note });
  document.getElementById("q-note").value = "";
  renderQSummary(); renderQLog();
}

function renderQSummary() {
  const el = document.getElementById("q-summary");
  if (!el) return;
  const types = ["Conceptual","Procedural","Leading","Open-ended"];
  const cols = ["var(--orange)","var(--blue)","var(--green)","var(--purple)"];
  const bgs = ["var(--orange-lt)","var(--blue-lt)","var(--green-lt)","var(--purple-lt)"];
  el.innerHTML = types.map((t,i) => {
    const n = qData.filter(d=>d.type===t).length;
    return `<div style="background:${bgs[i]};border-radius:8px;padding:10px;text-align:center;"><div style="font-size:20px;font-weight:700;color:${cols[i]};">${n}</div><div style="font-size:10px;color:${cols[i]};font-family:var(--mono);">${t}</div></div>`;
  }).join("");
}

function renderQLog() {
  const el = document.getElementById("q-log");
  if (!el) return;
  el.innerHTML = qData.slice().reverse().map(d=>`
    <div style="padding:8px 14px;border-bottom:1px solid var(--sand-2);display:flex;gap:8px;align-items:center;font-size:12px;">
      <span style="font-family:var(--mono);color:var(--ink-3);font-size:10px;min-width:58px;">${d.time}</span>
      <span style="font-weight:600;color:var(--ink);">${d.type}</span>
      <span style="font-size:10px;background:var(--sand-2);color:var(--ink-3);padding:1px 6px;border-radius:10px;">${d.asker}</span>
      ${d.note?`<span style="color:var(--ink-3);font-size:11px;">${d.note}</span>`:""}
    </div>`).join("") || `<div style="padding:20px;text-align:center;color:var(--ink-3);font-size:13px;">No questions logged yet</div>`;
}

function exportQData() {
  if (!qData.length) { alert("No questions logged."); return; }
  let csv = "Log#,Time,Type,AskedBy,Note\n";
  qData.forEach((d,i) => { csv += `${i+1},${d.time},${d.type},${d.asker},"${d.note}"\n`; });
  downloadCSV(csv, "question_types");
}

// ── Tool 5: Group Dynamics ────────────────────────────────────────────────────
const GD_STATES = ["On-task","Productive","Stuck","Off-task"];
const GD_COLORS = {"On-task":"var(--green)","Productive":"var(--blue)","Stuck":"var(--orange)","Off-task":"#E53E3E"};
const GD_BG = {"On-task":"var(--green-lt)","Productive":"var(--blue-lt)","Stuck":"var(--orange-lt)","Off-task":"#FFF5F5"};
const gdState = {};
const gdData = [];

function renderGDTool() {
  const n = parseInt(document.getElementById("gd-table-count")?.value || 6);
  const grid = document.getElementById("gd-table-grid");
  if (!grid) return;
  grid.innerHTML = Array.from({length:n},(_,i)=>{
    const id=i+1; const sel=gdState[id]||null;
    return `<div style="background:var(--white);border:1px solid ${sel?GD_COLORS[sel]:"var(--sand-2)"};border-radius:12px;padding:14px;${sel?`border-left:4px solid ${GD_COLORS[sel]};`:""}">
      <div style="font-size:12px;font-weight:600;margin-bottom:10px;">Table ${id}</div>
      <div style="display:flex;flex-direction:column;gap:5px;">
        ${GD_STATES.map(s=>`<button onclick="setGDState(${id},'${s}')"
          style="padding:6px 10px;border:1px solid ${sel===s?GD_COLORS[s]:"var(--sand-2)"};border-radius:7px;background:${sel===s?GD_BG[s]:"var(--sand)"};color:${sel===s?GD_COLORS[s]:"var(--ink-3)"};font-size:11px;font-weight:600;font-family:var(--sans);cursor:pointer;text-align:left;">${s}</button>`).join("")}
      </div>
    </div>`;
  }).join("");
}

function setGDState(id, state) { gdState[id]=state; renderGDTool(); }

function logGDSweep() {
  const n = parseInt(document.getElementById("gd-table-count")?.value||6);
  const sweep = { time:new Date().toLocaleTimeString(), tables:{} };
  for(let i=1;i<=n;i++) sweep.tables[i]=gdState[i]||"Not coded";
  gdData.push(sweep);
  document.getElementById("gd-sweep-count").textContent=`${gdData.length} sweeps`;
  Object.keys(gdState).forEach(k=>delete gdState[k]);
  renderGDTool();
}

function exportGDData() {
  if(!gdData.length){alert("No sweeps logged.");return;}
  const tables=Object.keys(gdData[0].tables);
  let csv="Sweep,Time,"+tables.map(t=>`Table ${t}`).join(",")+"\n";
  gdData.forEach((d,i)=>{csv+=`${i+1},${d.time},${tables.map(t=>d.tables[t]).join(",")}\n`;});
  downloadCSV(csv,"group_dynamics");
}

// ── Tool 6: Student-TA Interactions ──────────────────────────────────────────
const intData = [];
let intInitiator = "TA";
let intDuration = "Quick";

function setInitiator(a) {
  intInitiator=a;
  ["TA","Student"].forEach(x=>{
    const b=document.getElementById(`init-${x.toLowerCase()}`);
    if(!b)return;
    const active=x===a;
    b.style.background=active?(x==="TA"?"var(--orange)":"var(--blue)"):"var(--white)";
    b.style.color=active?"#fff":"var(--ink-2)";
    b.style.borderColor=active?(x==="TA"?"var(--orange)":"var(--blue)"):"var(--sand-2)";
  });
}

function setDuration(d) {
  intDuration=d;
  ["Quick","Medium","Long"].forEach(x=>{
    const b=document.getElementById(`dur-${x}`);
    if(!b)return;
    const active=x===d;
    b.style.background=active?"var(--blue-lt)":"var(--white)";
    b.style.color=active?"var(--blue)":"var(--ink-2)";
    b.style.borderColor=active?"var(--blue-md)":"var(--sand-2)";
  });
}

function logInteraction() {
  const table=document.getElementById("int-table")?.value||"?";
  intData.push({time:new Date().toLocaleTimeString(),initiator:intInitiator,duration:intDuration,table});
  renderIntLog(); renderIntSummary();
}

function renderIntLog() {
  const el=document.getElementById("int-log"); if(!el)return;
  el.innerHTML=intData.slice().reverse().map(d=>`
    <div style="padding:8px 14px;border-bottom:1px solid var(--sand-2);display:flex;gap:8px;align-items:center;font-size:12px;">
      <span style="font-family:var(--mono);color:var(--ink-3);font-size:10px;min-width:58px;">${d.time}</span>
      <span style="font-weight:600;">${d.initiator}</span>
      <span style="font-size:10px;background:var(--sand-2);color:var(--ink-3);padding:1px 6px;border-radius:10px;">${d.duration}</span>
      <span style="font-size:10px;color:var(--ink-3);">Table ${d.table}</span>
    </div>`).join("")||`<div style="padding:20px;text-align:center;color:var(--ink-3);font-size:13px;">No interactions logged</div>`;
}

function renderIntSummary() {
  const el=document.getElementById("int-summary"); if(!el)return;
  const taCount=intData.filter(d=>d.initiator==="TA").length;
  const stuCount=intData.filter(d=>d.initiator==="Student").length;
  const total=intData.length;
  el.innerHTML=[
    ["Total",total,"var(--ink)","var(--sand-2)"],
    ["TA init",taCount,"var(--orange)","var(--orange-lt)"],
    ["Student init",stuCount,"var(--blue)","var(--blue-lt)"]
  ].map(([l,n,c,bg])=>`<div style="background:${bg};border-radius:8px;padding:10px;text-align:center;"><div style="font-size:20px;font-weight:700;color:${c};">${n}</div><div style="font-size:10px;color:${c};font-family:var(--mono);">${l}</div></div>`).join("");
}

function exportIntData() {
  if(!intData.length){alert("No interactions logged.");return;}
  let csv="Log#,Time,Initiator,Duration,Table\n";
  intData.forEach((d,i)=>{csv+=`${i+1},${d.time},${d.initiator},${d.duration},${d.table}\n`;});
  downloadCSV(csv,"interactions");
}

// ── Tool 7: Physics Reasoning ─────────────────────────────────────────────────
const reasoningData=[];

function logReasoning(type) {
  const table=document.getElementById("reasoning-table")?.value||"All";
  reasoningData.push({time:new Date().toLocaleTimeString(),type,table});
  renderReasoningSummary(); renderReasoningLog();
}

function renderReasoningSummary() {
  const el=document.getElementById("reasoning-summary"); if(!el)return;
  const types=["Recalling facts","Applying formulas","Conceptual reasoning","Analogical thinking"];
  const cols=["var(--teal)","var(--orange)","var(--blue)","var(--purple)"];
  const bgs=["var(--teal-lt)","var(--orange-lt)","var(--blue-lt)","var(--purple-lt)"];
  el.innerHTML=types.map((t,i)=>{
    const n=reasoningData.filter(d=>d.type===t).length;
    return `<div style="background:${bgs[i]};border-radius:8px;padding:8px;text-align:center;"><div style="font-size:18px;font-weight:700;color:${cols[i]};">${n}</div><div style="font-size:9px;color:${cols[i]};font-family:var(--mono);line-height:1.3;">${t}</div></div>`;
  }).join("");
}

function renderReasoningLog() {
  const el=document.getElementById("reasoning-log"); if(!el)return;
  el.innerHTML=reasoningData.slice().reverse().map(d=>`
    <div style="padding:8px 14px;border-bottom:1px solid var(--sand-2);display:flex;gap:8px;font-size:12px;align-items:center;">
      <span style="font-family:var(--mono);color:var(--ink-3);font-size:10px;min-width:58px;">${d.time}</span>
      <span style="font-weight:600;color:var(--ink);">${d.type}</span>
      ${d.table!=="All"?`<span style="font-size:10px;color:var(--ink-3);">Table ${d.table}</span>`:""}
    </div>`).join("")||`<div style="padding:20px;text-align:center;color:var(--ink-3);font-size:13px;">No instances logged</div>`;
}

function exportReasoningData() {
  if(!reasoningData.length){alert("No instances logged.");return;}
  let csv="Log#,Time,Type,Table\n";
  reasoningData.forEach((d,i)=>{csv+=`${i+1},${d.time},${d.type},${d.table}\n`;});
  downloadCSV(csv,"physics_reasoning");
}

// ── Tool 8: Time-on-Task ──────────────────────────────────────────────────────
const totData=[];

function logTOT() {
  const val=parseInt(document.getElementById("tot-slider")?.value||70);
  const note=document.getElementById("tot-note")?.value||"";
  totData.push({time:new Date().toLocaleTimeString(),pct:val,note});
  document.getElementById("tot-note").value="";
  renderTOTLog();
}

function renderTOTLog() {
  const el=document.getElementById("tot-log"); if(!el)return;
  el.innerHTML=totData.slice().reverse().map((d,i)=>`
    <div style="padding:10px 16px;border-bottom:1px solid var(--sand-2);display:flex;align-items:center;gap:12px;">
      <span style="font-family:var(--mono);color:var(--ink-3);font-size:10px;min-width:58px;">${d.time}</span>
      <div style="flex:1;height:6px;background:var(--sand-2);border-radius:3px;overflow:hidden;"><div style="height:100%;background:${d.pct>=70?"var(--green)":d.pct>=40?"var(--orange)":"#E53E3E"};border-radius:3px;width:${d.pct}%;"></div></div>
      <span style="font-size:14px;font-weight:700;font-family:var(--mono);color:${d.pct>=70?"var(--green)":d.pct>=40?"var(--orange)":"#E53E3E"};min-width:38px;text-align:right;">${d.pct}%</span>
      ${d.note?`<span style="font-size:11px;color:var(--ink-3);">${d.note}</span>`:""}
    </div>`).join("")||`<div style="padding:20px;text-align:center;color:var(--ink-3);font-size:13px;">No sweeps logged yet</div>`;
}

function exportTOTData() {
  if(!totData.length){alert("No sweeps logged.");return;}
  let csv="Log#,Time,Engagement%,Note\n";
  totData.forEach((d,i)=>{csv+=`${i+1},${d.time},${d.pct},"${d.note}"\n`;});
  downloadCSV(csv,"time_on_task");
}

// ── Shared CSV export helper ──────────────────────────────────────────────────
function downloadCSV(csv, name) {
  const a=document.createElement("a");
  a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));
  a.download=`${name}_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
}
let obsState = {
  tables: [], selectedTable: 0, interval: 1,
  timerSeconds: 60, timerRunning: false, timerHandle: null, data: [],
};

function startObservation() {
  const n = parseInt(document.getElementById("obs-table-count").value);
  const course = document.getElementById("obs-course").value;
  const dt = document.getElementById("obs-datetime").value;
  obsState.tables = Array.from({length: n}, (_, i) => ({
    id: i+1,
    pos: { x: 10 + (i % 2) * 120, y: 10 + Math.floor(i / 2) * 100 },
    students: [{id:1,name:"Person 1",talking:false,listening:false},{id:2,name:"Person 2",talking:false,listening:false},{id:3,name:"Person 3",talking:false,listening:false},{id:4,name:"Person 4",talking:false,listening:false}]
  }));
  obsState.selectedTable = 0; obsState.interval = 1; obsState.timerSeconds = 60; obsState.data = [];
  document.getElementById("obs-setup").style.display = "none";
  document.getElementById("obs-tool").style.display = "block";
  document.getElementById("obs-course-label").textContent = course;
  document.getElementById("obs-datetime-label").textContent = dt ? new Date(dt).toLocaleString("en-US",{weekday:"short",month:"short",day:"numeric",hour:"numeric",minute:"2-digit"}) : new Date().toLocaleString();
  renderTableList(); selectTable(0);
}

function renderTableList() {
  renderClassroomMap();
}

function renderClassroomMap() {
  const canvas = document.getElementById("classroom-canvas");
  if (!canvas) return;
  canvas.innerHTML = "";
  obsState.tables.forEach((t, i) => {
    if (!t.pos) t.pos = { x: 30 + (i % 2) * 130, y: 20 + Math.floor(i / 2) * 110 };
    const isSelected = i === obsState.selectedTable;
    const div = document.createElement("div");
    div.draggable = true;
    div.style.cssText = `position:absolute;left:${t.pos.x}px;top:${t.pos.y}px;width:90px;height:72px;background:${isSelected?"var(--orange)":"var(--white)"};border:2px solid ${isSelected?"var(--orange)":"var(--sand-3)"};border-radius:10px;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;box-shadow:${isSelected?"0 4px 14px rgba(232,74,0,0.3)":"0 1px 4px rgba(0,0,0,0.08)"};user-select:none;transition:box-shadow 0.15s;`;
    div.innerHTML = `<div style="font-size:9px;font-weight:700;color:${isSelected?"#fff":"var(--ink-3)"};font-family:var(--mono);letter-spacing:0.05em;">TABLE</div><div style="font-size:20px;font-weight:700;color:${isSelected?"#fff":"var(--blue)"};font-family:var(--mono);">${t.id}</div><div style="font-size:9px;color:${isSelected?"rgba(255,255,255,0.7)":"var(--ink-3)"};">${t.students.length} stu</div>`;
    div.onclick = () => selectTable(i);
    div.ondragstart = (e) => {
      e.dataTransfer.setData("ti", i);
      e.dataTransfer.setData("ox", e.clientX - canvas.getBoundingClientRect().left - t.pos.x);
      e.dataTransfer.setData("oy", e.clientY - canvas.getBoundingClientRect().top - t.pos.y);
    };
    canvas.appendChild(div);
  });
}

function dropTable(e) {
  e.preventDefault();
  const canvas = document.getElementById("classroom-canvas");
  const i = parseInt(e.dataTransfer.getData("ti"));
  const ox = parseFloat(e.dataTransfer.getData("ox")) || 0;
  const oy = parseFloat(e.dataTransfer.getData("oy")) || 0;
  const rect = canvas.getBoundingClientRect();
  obsState.tables[i].pos = {
    x: Math.max(0, Math.min(e.clientX - rect.left - ox, 144)),
    y: Math.max(0, Math.min(e.clientY - rect.top - oy, 286))
  };
  renderClassroomMap();
}

function selectTable(i) {
  obsState.selectedTable = i;
  document.getElementById("obs-selected-table-label").textContent = `Table ${obsState.tables[i].id} · ${obsState.tables[i].students.length} students`;
  renderStudentGrid(); renderClassroomMap();
}

function renderStudentGrid() {
  const t = obsState.tables[obsState.selectedTable];
  document.getElementById("obs-student-grid").innerHTML = t.students.map(s => `
    <div style="background:var(--white);border:1px solid var(--sand-2);border-radius:12px;padding:16px;">
      <div style="font-size:13px;font-weight:600;margin-bottom:12px;">${s.name}</div>
      <div style="display:flex;flex-direction:column;gap:10px;">
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <span style="font-size:13px;color:var(--ink-2);">Talking</span>
          <button onclick="toggleObs(${s.id},'talking')" style="width:52px;height:26px;border-radius:13px;border:none;cursor:pointer;font-size:10px;font-weight:700;font-family:var(--mono);background:${s.talking?"var(--green)":"#E53E3E"};color:#fff;">${s.talking?"ON":"OFF"}</button>
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <span style="font-size:13px;color:var(--ink-2);">Listening</span>
          <button onclick="toggleObs(${s.id},'listening')" style="width:52px;height:26px;border-radius:13px;border:none;cursor:pointer;font-size:10px;font-weight:700;font-family:var(--mono);background:${s.listening?"var(--green)":"#E53E3E"};color:#fff;">${s.listening?"ON":"OFF"}</button>
        </div>
      </div>
    </div>`).join("");
}

function toggleObs(studentId, field) {
  const s = obsState.tables[obsState.selectedTable].students.find(x => x.id === studentId);
  if (s) { s[field] = !s[field]; renderStudentGrid(); }
}

function addStudent() {
  const t = obsState.tables[obsState.selectedTable];
  const newId = Math.max(...t.students.map(s=>s.id),0)+1;
  t.students.push({id:newId,name:`Person ${newId}`,talking:false,listening:false});
  selectTable(obsState.selectedTable);
}

function removeStudent() {
  const t = obsState.tables[obsState.selectedTable];
  if (t.students.length > 1) { t.students.pop(); selectTable(obsState.selectedTable); }
}

function addTable() {
  const newId = obsState.tables.length + 1;
  const i = obsState.tables.length;
  // Fit within 236px wide canvas, 2-column layout
  obsState.tables.push({
    id: newId,
    pos: { x: 10 + (i % 2) * 120, y: 10 + Math.floor(i / 2) * 100 },
    students: [
      {id:1,name:"Person 1",talking:false,listening:false},
      {id:2,name:"Person 2",talking:false,listening:false},
      {id:3,name:"Person 3",talking:false,listening:false},
      {id:4,name:"Person 4",talking:false,listening:false}
    ]
  });
  renderClassroomMap();
}

function toggleTimer() {
  const btn = document.getElementById("obs-timer-btn");
  if (obsState.timerRunning) {
    clearInterval(obsState.timerHandle); obsState.timerRunning = false;
    btn.textContent = "Resume"; btn.style.background = "var(--blue)";
  } else {
    obsState.timerRunning = true; btn.textContent = "Pause"; btn.style.background = "var(--orange)";
    obsState.timerHandle = setInterval(() => {
      obsState.timerSeconds--;
      const m = Math.floor(obsState.timerSeconds/60).toString().padStart(2,"0");
      const s = (obsState.timerSeconds%60).toString().padStart(2,"0");
      const el = document.getElementById("obs-timer");
      el.textContent = `${m}:${s}`;
      el.style.color = obsState.timerSeconds <= 10 ? "var(--orange)" : "var(--blue)";
      if (obsState.timerSeconds <= 0) {
        clearInterval(obsState.timerHandle); obsState.timerRunning = false;
        btn.textContent = "Start"; btn.style.background = "var(--blue)";
      }
    }, 1000);
  }
}

function submitInterval() {
  obsState.data.push({interval:obsState.interval,time:new Date().toLocaleTimeString(),tables:JSON.parse(JSON.stringify(obsState.tables)),notes:document.getElementById("obs-notes").value});
  obsState.interval++;
  document.getElementById("obs-interval-label").textContent = `Interval ${obsState.interval}`;
  document.getElementById("obs-notes").value = "";
  clearInterval(obsState.timerHandle); obsState.timerRunning = false; obsState.timerSeconds = 60;
  document.getElementById("obs-timer").textContent = "01:00";
  document.getElementById("obs-timer").style.color = "var(--blue)";
  document.getElementById("obs-timer-btn").textContent = "Start";
  document.getElementById("obs-timer-btn").style.background = "var(--blue)";
  obsState.tables.forEach(t => t.students.forEach(s => {s.talking=false;s.listening=false;}));
  renderStudentGrid(); renderClassroomMap();
  alert(`✓ Interval ${obsState.interval-1} recorded! ${obsState.data.length} total intervals saved.`);
}

function resetObservation() {
  if (confirm("Reset? All data will be lost.")) {
    clearInterval(obsState.timerHandle);
    document.getElementById("obs-setup").style.display = "block";
    document.getElementById("obs-tool").style.display = "none";
  }
}

function exportData() {
  if (!obsState.data.length) { alert("No intervals recorded yet."); return; }
  let csv = "Interval,Time,Table,Student,Talking,Listening,Notes\n";
  obsState.data.forEach(d => d.tables.forEach(t => t.students.forEach(s => {
    csv += `${d.interval},${d.time},Table ${t.id},${s.name},${s.talking?1:0},${s.listening?1:0},"${d.notes}"\n`;
  })));
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv],{type:"text/csv"}));
  a.download = `observation_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
}

// ── Real Box Folder Data ────────────────────────────────────────────────────
const BOX_WEEKS = [
  { name: "Week 1", id: "379166527000" },
  { name: "Week 2", id: "379167801261" },
  { name: "Week 3", id: "379165319446" },
  { name: "Week 4", id: "379167076074" },
  { name: "Week 5", id: "379169423610" },
];

const WEEK_COLORS = [
  { bg: "#FFF0EA", border: "#FFD4C0", color: "#E84A00" },
  { bg: "#E8EEF6", border: "#C2D0E4", color: "#13294B" },
  { bg: "#E8F5EE", border: "#A7D9BB", color: "#1A6B3C" },
  { bg: "#F0ECFC", border: "#C9BCF4", color: "#5B3FA6" },
  { bg: "#E6F4F4", border: "#9DD0D0", color: "#0B6E6E" },
];

function renderWeekGrid() {
  const grid = document.getElementById("week-grid");
  grid.innerHTML = BOX_WEEKS.map((w, i) => {
    const c = WEEK_COLORS[i % WEEK_COLORS.length];
    return `
    <div onclick="openWeek('${w.id}','${w.name}')"
      style="background:${c.bg};border:1px solid ${c.border};border-radius:14px;padding:20px;cursor:pointer;transition:all 0.15s;display:flex;flex-direction:column;gap:12px;"
      onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 4px 16px rgba(0,0,0,0.1)'"
      onmouseout="this.style.transform='';this.style.boxShadow=''">
      <div style="width:40px;height:40px;border-radius:10px;background:${c.color};display:flex;align-items:center;justify-content:center;">
        <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round">
          <path d="M1 4a1 1 0 011-1h4l2 2h6a1 1 0 011 1v7a1 1 0 01-1 1H2a1 1 0 01-1-1V4z"/>
        </svg>
      </div>
      <div>
        <div style="font-size:14px;font-weight:600;color:${c.color};letter-spacing:-0.01em;">${w.name}</div>
        <div style="font-size:11px;color:${c.color};opacity:0.7;margin-top:2px;font-family:var(--mono)">Illinois Box · PHYS 211</div>
      </div>
      <div style="font-size:11px;color:${c.color};display:flex;align-items:center;gap:4px;font-weight:500;">
        Open folder →
      </div>
    </div>`;
  }).join("");
}

function openWeek(folderId, folderName) {
  document.getElementById("week-grid").style.display = "none";
  document.getElementById("week-detail").style.display = "block";
  document.getElementById("week-detail-title").textContent = folderName;

  const container = document.getElementById("week-files-container");
  container.innerHTML = `
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px;gap:14px;color:var(--ink-3);">
      <svg width="32" height="32" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
        <path d="M1 4a1 1 0 011-1h4l2 2h6a1 1 0 011 1v7a1 1 0 01-1 1H2a1 1 0 01-1-1V4z"/>
      </svg>
      <div style="font-size:14px;font-weight:500;color:var(--ink-2)">This folder is empty</div>
      <div style="font-size:12px;text-align:center;line-height:1.6;">
        Add files to <strong>${folderName}</strong> in Illinois Box and they'll appear here automatically.<br>
        <a href="https://app.box.com/folder/${folderId}" target="_blank" style="color:var(--orange);text-decoration:none;font-weight:500;">Open in Box ↗</a>
      </div>
    </div>`;

  document.getElementById("week-detail-count").textContent = "0 files";
}

function backToWeeks() {
  document.getElementById("week-grid").style.display = "grid";
  document.getElementById("week-detail").style.display = "none";
}

// ── First Time TA Modules ────────────────────────────────────────────────────
const TA_MODULES = [
  { id:1,  title:"Collaborative Learning and Norm Setting",       desc:"Establish group norms, build trust, and set expectations for productive collaborative learning environments.",       icon:"M3 5h10M3 8h7M3 11h4", color:"orange" },
  { id:2,  title:"Feedback and Grading",                          desc:"Learn evidence-based strategies for giving effective, actionable feedback that promotes student growth.",              icon:"M2 4h12M2 8h8M2 12h5", color:"blue"   },
  { id:3,  title:"Students' Resistance to Collaborative Group Work", desc:"Understand why students resist group work and learn practical techniques to address and reduce that resistance.", icon:"M8 1a3 3 0 100 6 3 3 0 000-6zM2 14s1-3 6-3 6 3 6 3", color:"purple" },
  { id:4,  title:"Common Issues in Collaborative Group Work",     desc:"Identify and navigate the most frequent challenges: dominant students, free riders, and unproductive dynamics.",    icon:"M2 8h12M8 2v12",        color:"teal"   },
  { id:5,  title:"Review of Collaborative Group Work",            desc:"Synthesize your understanding of group work facilitation and reflect on your first weeks as a discussion TA.",      icon:"M2 8l4 4 8-8",          color:"green"  },
  { id:6,  title:"Problem Structures",                            desc:"Explore how problem design shapes student thinking — open vs. closed, scaffolded vs. independent, and more.",        icon:"M3 3h10v10H3z",         color:"orange" },
  { id:7,  title:"Supporting Collaborative Learning",             desc:"Develop your toolkit for actively supporting groups: when to intervene, when to step back, and how to ask good questions.", icon:"M8 2v12M2 8h12",   color:"blue"   },
  { id:8,  title:"How does good collaboration look like?",        desc:"Examine real examples of productive collaboration and develop your eye for what to look for in your own classroom.", icon:"M2 5h12M2 11h12M5 2v12", color:"purple"},
  { id:9,  title:"Review of Problem-Based Learning",              desc:"Revisit the principles of problem-based learning and connect them to your classroom practice this semester.",       icon:"M8 1l2 5h5l-4 3 2 5-5-3-5 3 2-5-4-3h5z", color:"teal" },
  { id:10, title:"Survey",                                         desc:"Complete the end-of-training survey to share your experience and help improve this professional development program.", icon:"M3 2h10v12H3zM6 6h4M6 9h4M6 12h2", color:"green" },
];

const taCompleted = new Set();

const TA_COLORS = {
  orange: { bg:"var(--orange-lt)", border:"var(--orange-md)", color:"var(--orange)" },
  blue:   { bg:"var(--blue-lt)",   border:"var(--blue-md)",   color:"var(--blue)"   },
  purple: { bg:"var(--purple-lt)", border:"#C9BCF4",          color:"var(--purple)" },
  teal:   { bg:"var(--teal-lt)",   border:"#9DD0D0",          color:"var(--teal)"   },
  green:  { bg:"var(--green-lt)",  border:"#A7D9BB",          color:"var(--green)"  },
};

function renderTAModules() {
  const grid = document.getElementById("ta-modules-grid");
  if (!grid) return;
  grid.innerHTML = TA_MODULES.map(m => {
    const c = TA_COLORS[m.color];
    const done = taCompleted.has(m.id);
    return `
    <div style="background:var(--white);border:1px solid ${done ? c.border : "var(--sand-2)"};border-radius:14px;padding:20px;display:flex;flex-direction:column;gap:12px;transition:all 0.15s;${done ? `border-left:4px solid ${c.color};` : ""}"
      onmouseover="this.style.boxShadow='0 4px 16px rgba(0,0,0,0.08)'" onmouseout="this.style.boxShadow='none'">
      <div style="display:flex;align-items:flex-start;gap:12px;">
        <div style="width:36px;height:36px;border-radius:9px;background:${c.bg};border:1px solid ${c.border};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          ${done
            ? `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="${c.color}" stroke-width="2" stroke-linecap="round"><path d="M2 8l4 4 8-8"/></svg>`
            : `<span style="font-size:12px;font-weight:700;color:${c.color};font-family:var(--mono);">${m.id}</span>`
          }
        </div>
        <div style="flex:1;">
          <div style="font-size:13px;font-weight:600;letter-spacing:-0.01em;color:var(--ink);line-height:1.4;">${m.title}</div>
        </div>
        ${done ? `<span style="font-size:10px;font-family:var(--mono);background:${c.bg};color:${c.color};padding:2px 8px;border-radius:20px;font-weight:600;white-space:nowrap;">Done ✓</span>` : ""}
      </div>
      <p style="font-size:12px;color:var(--ink-3);line-height:1.6;margin:0;">${m.desc}</p>
      <button onclick="toggleTAModule(${m.id}, this)"
        style="padding:8px 0;border-radius:8px;border:1px solid ${done ? c.border : "var(--sand-2)"};background:${done ? c.bg : "var(--sand)"};color:${done ? c.color : "var(--ink-3)"};font-size:12px;font-weight:600;font-family:var(--sans);cursor:pointer;transition:all 0.15s;width:100%;">
        ${done ? "Mark as incomplete" : "Mark as complete"}
      </button>
    </div>`;
  }).join("");
  updateTAProgress();
}

function toggleTAModule(id, btn) {
  if (taCompleted.has(id)) taCompleted.delete(id);
  else taCompleted.add(id);
  renderTAModules();
}

function updateTAProgress() {
  const n = taCompleted.size;
  const pct = (n / TA_MODULES.length) * 100;
  const bar = document.getElementById("ta-progress-bar");
  const label = document.getElementById("ta-progress-label");
  if (bar) bar.style.width = pct + "%";
  if (label) label.textContent = `${n} of ${TA_MODULES.length} completed`;
}
// ── Table Snapshot ────────────────────────────────────────────────────────────
const tableSnapshots = {};

const TABLE_SNAP_COLORS = [
  {bg:"#FFF0EA",border:"#FFD4C0",color:"#E84A00"},
  {bg:"#E8EEF6",border:"#C2D0E4",color:"#13294B"},
  {bg:"#E8F5EE",border:"#A7D9BB",color:"#1A6B3C"},
  {bg:"#F0ECFC",border:"#C9BCF4",color:"#5B3FA6"},
  {bg:"#E6F4F4",border:"#9DD0D0",color:"#0B6E6E"},
  {bg:"#FFFBEB",border:"#FDE68A",color:"#92400E"},
  {bg:"#FEF2F2",border:"#FCA5A5",color:"#991B1B"},
  {bg:"#F0FDF4",border:"#86EFAC",color:"#166534"},
];

function renderTableSnapshot() {
  const n = parseInt(document.getElementById("table-count-select")?.value || 6);
  const grid = document.getElementById("table-snapshot-grid");
  if (!grid) return;
  grid.innerHTML = Array.from({length: n}, (_, i) => {
    const id = i + 1;
    const c = TABLE_SNAP_COLORS[i % TABLE_SNAP_COLORS.length];
    const snap = tableSnapshots[id] || { rating: 0, note: "" };
    return `
    <div style="border:1px solid ${c.border};border-radius:10px;padding:12px;background:${c.bg};">
      <div style="font-size:12px;font-weight:600;color:${c.color};margin-bottom:8px;">Table ${id}</div>
      <div style="display:flex;gap:3px;margin-bottom:8px;">
        ${[1,2,3,4,5].map(r => `
          <button onclick="setTableRating(${id},${r})"
            style="flex:1;height:26px;border:none;border-radius:5px;cursor:pointer;font-size:11px;font-weight:700;font-family:var(--mono);background:${snap.rating>=r?c.color:"var(--sand-2)"};color:${snap.rating>=r?"#fff":"var(--ink-3)"};transition:all 0.1s;">${r}</button>`).join("")}
      </div>
      <textarea id="table-note-${id}" placeholder="Quick note…" onchange="setTableNote(${id},this.value)"
        style="width:100%;min-height:50px;border:1px solid ${c.border};border-radius:6px;padding:6px 8px;font-size:11px;font-family:var(--sans);color:var(--ink);background:rgba(255,255,255,0.7);outline:none;resize:none;line-height:1.5;"
        onfocus="this.style.background='#fff'" onblur="this.style.background='rgba(255,255,255,0.7)'"
      >${snap.note}</textarea>
    </div>`;
  }).join("");
}

function setTableRating(tableId, rating) {
  if (!tableSnapshots[tableId]) tableSnapshots[tableId] = {rating:0,note:""};
  tableSnapshots[tableId].rating = rating;
  renderTableSnapshot();
}

function setTableNote(tableId, note) {
  if (!tableSnapshots[tableId]) tableSnapshots[tableId] = {rating:0,note:""};
  tableSnapshots[tableId].note = note;
}

const LIKERT_ITEMS = [
  { id: "engagement",    label: "Student engagement" },
  { id: "participation", label: "Student participation" },
  { id: "confidence",    label: "My own confidence" },
  { id: "preparedness",  label: "Preparedness for class" },
  { id: "overall",       label: "Overall session quality" },
];

const likertValues = {};

function renderLikert() {
  const container = document.getElementById("likert-rows");
  if (!container) return;
  container.innerHTML = LIKERT_ITEMS.map(item => `
    <div style="display:grid;grid-template-columns:100px repeat(5,1fr);gap:0;align-items:center;padding:6px 2px;border-radius:8px;transition:background 0.1s;"
      onmouseover="this.style.background='var(--sand)'" onmouseout="this.style.background='transparent'">
      <div style="font-size:11px;font-weight:500;color:var(--ink-2);padding-right:6px;">${item.label}</div>
      ${[1,2,3,4,5].map(n => `
        <div style="display:flex;justify-content:center;">
          <button onclick="setLikert('${item.id}',${n},this)"
            id="likert-${item.id}-${n}"
            style="width:28px;height:28px;border-radius:6px;border:2px solid var(--sand-2);background:var(--sand);cursor:pointer;font-size:11px;font-weight:600;color:var(--ink-3);transition:all 0.15s;font-family:var(--mono);"
            onmouseover="if(!this.classList.contains('selected'))this.style.borderColor='var(--orange-md)'"
            onmouseout="if(!this.classList.contains('selected'))this.style.borderColor='var(--sand-2)'"
          >${n}</button>
        </div>
      `).join("")}
    </div>
  `).join("");
}

function setLikert(itemId, value, btn) {
  likertValues[itemId] = value;
  // Reset all buttons for this row
  [1,2,3,4,5].forEach(n => {
    const b = document.getElementById(`likert-${itemId}-${n}`);
    if (b) {
      b.classList.remove("selected");
      b.style.background = "var(--sand)";
      b.style.borderColor = "var(--sand-2)";
      b.style.color = "var(--ink-3)";
    }
  });
  // Highlight selected
  btn.classList.add("selected");
  btn.style.background = "var(--orange)";
  btn.style.borderColor = "var(--orange)";
  btn.style.color = "#fff";
}

function saveLog() {
  const week = document.getElementById("log-week-select").value;
  const filled = Object.keys(likertValues).length;
  if (filled < LIKERT_ITEMS.length) {
    alert(`Please rate all ${LIKERT_ITEMS.length} dimensions before saving.`);
    return;
  }
  const avg = (Object.values(likertValues).reduce((a,b) => a+b, 0) / LIKERT_ITEMS.length).toFixed(1);
  alert(`✓ ${week} log saved!\nAverage rating: ${avg} / 5`);
}

// ── Navigation ──────────────────────────────────────────────────────────────
const PAGE_META = {
  dashboard:   { title: "Dashboard",          sub: "· PHYS 211" },
  materials:   { title: "Materials",           sub: "· Illinois Box" },
  grading:     { title: "Grading",             sub: "· 3 pending" },
  teaching:    { title: "Teaching summary",    sub: "· Week 9" },
  comms:       { title: "Coordinator comms",   sub: "· 1 unread" },
  firstta:     { title: "First Time TA",       sub: "· 10 modules" },
  observation: { title: "Classroom Observation", sub: "· Researcher" },
};

function showPage(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
  document.getElementById("page-" + id).classList.remove("hidden");
  document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));
  document.querySelectorAll(".nav-item").forEach(n => {
    if (n.getAttribute("onclick")?.includes(id)) n.classList.add("active");
  });
  const m = PAGE_META[id] || {};
  document.getElementById("topbar-title").textContent = m.title || id;
  document.getElementById("topbar-sub").textContent = m.sub || "";
  if (id === "materials") {
    renderWeekGrid();
    document.getElementById("week-grid").style.display = "grid";
    document.getElementById("week-detail").style.display = "none";
  }
  if (id === "teaching") { renderLikert(); renderTableSnapshot(); }
  if (id === "firstta")  renderTAModules();
  if (id === "observation") { renderResearchToolGrid(); showResearchTool(null); }
}

// ── Role switcher ───────────────────────────────────────────────────────────
const ROLES = {
  ta:         { name: "Your Name",    role: "TA · Discussion 3",        initials: "YO" },
  coord:      { name: "Tim Stelzer",  role: "Discussion Coordinator",   initials: "TS" },
  admin:      { name: "Prof. Zhang",  role: "Admin · PHYS 211",         initials: "PZ" },
  researcher: { name: "Researcher",   role: "Researcher · PHYS 211",    initials: "RE" },
};

// ── Admin password — change this to whatever you like ───────────────────────
const ADMIN_PASSWORD = "Admin@PHYS211";

function showAdminLogin() {
  const modal = document.getElementById("admin-modal");
  modal.style.display = "flex";
  document.getElementById("admin-password-input").value = "";
  document.getElementById("admin-login-error").style.display = "none";
  setTimeout(() => document.getElementById("admin-password-input").focus(), 50);
}

function closeAdminLogin() {
  document.getElementById("admin-modal").style.display = "none";
}

function toggleAdminPwVisibility() {
  const input = document.getElementById("admin-password-input");
  const icon  = document.getElementById("pw-eye-icon");
  if (input.type === "password") {
    input.type = "text";
    icon.innerHTML = '<path d="M1 8s2-5 7-5 7 5 7 5-2 5-7 5-7-5-7-5z"/><circle cx="8" cy="8" r="2"/><path d="M2 2l12 12" stroke-width="1.5"/>';
  } else {
    input.type = "password";
    icon.innerHTML = '<path d="M1 8s2-5 7-5 7 5 7 5-2 5-7 5-7-5-7-5z"/><circle cx="8" cy="8" r="2"/>';
  }
}

function submitAdminLogin() {
  const input = document.getElementById("admin-password-input");
  if (input.value === ADMIN_PASSWORD) {
    closeAdminLogin();
    setRole("admin");
  } else {
    const err = document.getElementById("admin-login-error");
    err.style.display = "block";
    input.style.borderColor = "#FCA5A5";
    input.value = "";
    input.focus();
    setTimeout(() => { input.style.borderColor = "var(--sand-2)"; }, 1500);
  }
}

function setRole(r) {
  document.querySelectorAll(".role-btn").forEach(b => b.classList.remove("active"));
  const btn = r === "admin"
    ? document.getElementById("admin-role-btn")
    : document.querySelector(`.role-btn[onclick="setRole('${r}')"]`);
  if (btn) btn.classList.add("active");
  const info = ROLES[r];
  document.getElementById("user-name").textContent    = info.name;
  document.getElementById("user-role").textContent    = info.role;
  document.getElementById("user-avatar").textContent  = info.initials;
  const obsNav = document.getElementById("nav-observation");
  if (obsNav) obsNav.style.display = r === "researcher" ? "flex" : "none";
  if (r === "researcher") showPage("observation");
}

// ── Teaching mood tags ───────────────────────────────────────────────────────
function toggleMood(btn) { btn.classList.toggle("active"); }

// ── Comms send ───────────────────────────────────────────────────────────────
function sendMsg() {
  const input = document.getElementById("msg-input");
  const text  = input.value.trim();
  if (!text) return;
  const body  = document.querySelector(".thread-body");
  const now   = new Date().toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"});
  body.innerHTML += `
    <div class="msg outgoing">
      <div class="msg-bubble">${text}</div>
      <div class="msg-time">Today ${now}</div>
    </div>`;
  input.value = "";
  body.scrollTop = body.scrollHeight;
}
document.getElementById("msg-input")?.addEventListener("keydown", e => {
  if (e.key === "Enter") sendMsg();
});

// ── Date stamps ─────────────────────────────────────────────────────────────
const now = new Date();
const fmt  = { weekday:"long", month:"long", day:"numeric" };
document.getElementById("today-date").textContent = now.toLocaleDateString("en-US", fmt);
document.getElementById("log-date").textContent   = now.toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" });

// ── Init ─────────────────────────────────────────────────────────────────────
renderWeekGrid();
renderLikert();
renderTableSnapshot();
renderResearchToolGrid();
// Set observation datetime default to now
const dtInput = document.getElementById("obs-datetime");
if (dtInput) dtInput.value = new Date().toISOString().slice(0,16);
