import React, { useState, useRef } from 'react';

// A4 dimensions at 96dpi: 794px × 1123px
const A4 = { width: 794, minHeight: 1123 };

const TEMPLATES = [
  { id: 'classic',   label: 'Classic',   desc: 'Elegant two-column, serif, ATS-safe' },
  { id: 'modern',    label: 'Modern',    desc: 'Dark header, blue accents, tech-ready' },
  { id: 'minimal',   label: 'Minimal',   desc: 'Whitespace-driven, single column' },
  { id: 'executive', label: 'Executive', desc: 'Dense serif, senior professionals' },
];

const EMPTY = {
  name: '', title: '', email: '', phone: '', location: '', linkedin: '', summary: '',
  experience: [{ company: '', role: '', duration: '', bullets: '' }],
  education: [{ school: '', degree: '', year: '' }],
  skills: '',
};

const SAMPLE = {
  name: 'Alex Johnson', title: 'Senior Product Designer',
  email: 'alex@email.com', phone: '+1 555 0100',
  location: 'San Francisco, CA', linkedin: 'linkedin.com/in/alexj',
  summary: 'Results-driven designer with 8+ years building user-centred digital products across fintech and SaaS. Passionate about bridging strategy and craft.',
  experience: [
    { company: 'Acme Corp', role: 'Lead Product Designer', duration: '2020 – Present',
      bullets: 'Led end-to-end redesign of flagship product used by 2M+ users\nGrew NPS from 31 to 67 through iterative design sprints\nManaged a team of 4 designers across 3 product verticals' },
    { company: 'StartupXYZ', role: 'UI/UX Designer', duration: '2017 – 2020',
      bullets: 'Designed mobile-first onboarding flow that cut drop-off by 34%\nBuilt and maintained a cross-platform design system' },
  ],
  education: [{ school: 'UC Berkeley', degree: 'B.S. Design & Technology', year: '2017' }],
  skills: 'Figma, React, UX Research, Prototyping, Design Systems, Agile, Framer',
};

/* ── Shared helpers ──────────────────────────────────────────── */
function FLabel({ children }) {
  return <label style={{ display:'block', fontSize:11, fontWeight:600, color:'#6b7280',
    textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:5 }}>{children}</label>;
}
function FInput({ value, onChange, placeholder, multiline, rows=3 }) {
  const s = { width:'100%', boxSizing:'border-box', padding:'8px 10px',
    border:'1px solid #e5e7eb', borderRadius:7, fontSize:13.5, color:'#111827',
    background:'#fff', outline:'none', fontFamily:'inherit', resize:'vertical' };
  return multiline
    ? <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows} style={s}/>
    : <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{...s,resize:undefined}}/>;
}
function Field({ label, children }) {
  return <div style={{ marginBottom:16 }}><FLabel>{label}</FLabel>{children}</div>;
}

/* ── A4 wrapper ─────────────────────────────────────────────── */
function A4Page({ children, scale=1 }) {
  return (
    <div style={{
      width: A4.width * scale,
      minHeight: A4.minHeight * scale,
      background: '#fff',
      boxSizing: 'border-box',
      transform: scale !== 1 ? `scale(${scale})` : undefined,
      transformOrigin: 'top left',
      overflow: 'hidden',
    }}>
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   TEMPLATE 1 — CLASSIC
   Left sidebar (30%) + right content (70%), serif, two-rule header
══════════════════════════════════════════════════════════════ */
function ClassicResume({ data }) {
  const skills = data.skills.split(',').map(s=>s.trim()).filter(Boolean);
  const SectionHead = ({ children }) => (
    <div style={{ fontSize:9.5, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.13em',
      color:'#1a1a1a', borderBottom:'1.5px solid #1a1a1a', paddingBottom:3, marginBottom:9, marginTop:16 }}>
      {children}
    </div>
  );
  return (
    <A4Page>
      {/* TOP HEADER */}
      <div style={{ padding:'32px 36px 20px', borderBottom:'3px double #1a1a1a',
        fontFamily:'Georgia,serif', textAlign:'center' }}>
        <div style={{ fontSize:28, fontWeight:700, letterSpacing:'-0.01em', color:'#111' }}>
          {data.name||'Your Name'}
        </div>
        <div style={{ fontSize:13, color:'#555', marginTop:4, fontStyle:'italic' }}>
          {data.title||'Professional Title'}
        </div>
        <div style={{ display:'flex', justifyContent:'center', gap:18, marginTop:8,
          fontSize:10.5, color:'#444', flexWrap:'wrap' }}>
          {data.email&&<span>✉ {data.email}</span>}
          {data.phone&&<span>✆ {data.phone}</span>}
          {data.location&&<span>⌖ {data.location}</span>}
          {data.linkedin&&<span>🔗 {data.linkedin}</span>}
        </div>
      </div>
      {/* TWO COLUMNS */}
      <div style={{ display:'grid', gridTemplateColumns:'200px 1fr', fontFamily:'Georgia,serif' }}>
        {/* SIDEBAR */}
        <div style={{ background:'#f7f6f3', padding:'16px 18px', borderRight:'1px solid #e0ddd8', minHeight:900 }}>
          {skills.length>0&&(
            <>
              <SectionHead>Skills</SectionHead>
              {skills.map((s,i)=>(
                <div key={i} style={{ fontSize:11, color:'#333', padding:'3px 0', borderBottom:'1px dotted #ddd' }}>
                  {s}
                </div>
              ))}
            </>
          )}
          {data.education.some(e=>e.school)&&(
            <>
              <SectionHead>Education</SectionHead>
              {data.education.map((e,i)=>e.school&&(
                <div key={i} style={{ marginBottom:12 }}>
                  <div style={{ fontSize:11.5, fontWeight:700, color:'#111' }}>{e.school}</div>
                  <div style={{ fontSize:10.5, color:'#555', marginTop:1 }}>{e.degree}</div>
                  <div style={{ fontSize:10, color:'#888', marginTop:1 }}>{e.year}</div>
                </div>
              ))}
            </>
          )}
        </div>
        {/* MAIN */}
        <div style={{ padding:'16px 28px' }}>
          {data.summary&&(
            <>
              <SectionHead>Profile</SectionHead>
              <p style={{ fontSize:11.5, color:'#333', lineHeight:1.65, margin:0 }}>{data.summary}</p>
            </>
          )}
          {data.experience.some(e=>e.company)&&(
            <>
              <SectionHead>Experience</SectionHead>
              {data.experience.map((ex,i)=>ex.company&&(
                <div key={i} style={{ marginBottom:16 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
                    <span style={{ fontSize:12.5, fontWeight:700, color:'#111' }}>{ex.role}</span>
                    <span style={{ fontSize:10.5, color:'#888' }}>{ex.duration}</span>
                  </div>
                  <div style={{ fontSize:11, color:'#666', fontStyle:'italic', marginBottom:5 }}>{ex.company}</div>
                  {ex.bullets&&ex.bullets.split('\n').filter(Boolean).map((b,j)=>(
                    <div key={j} style={{ fontSize:11, color:'#444', paddingLeft:12, lineHeight:1.55 }}>• {b}</div>
                  ))}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </A4Page>
  );
}

/* ══════════════════════════════════════════════════════════════
   TEMPLATE 2 — MODERN
   Full-width dark navy header, blue accent labels, right sidebar
══════════════════════════════════════════════════════════════ */
function ModernResume({ data }) {
  const skills = data.skills.split(',').map(s=>s.trim()).filter(Boolean);
  const Accent = '#2563eb';
  const SHead = ({ children }) => (
    <div style={{ fontSize:9, fontWeight:800, textTransform:'uppercase', letterSpacing:'0.14em',
      color:Accent, marginBottom:8, marginTop:18, paddingBottom:3, borderBottom:`2px solid ${Accent}` }}>
      {children}
    </div>
  );
  return (
    <A4Page>
      {/* HEADER */}
      <div style={{ background:'#0f172a', color:'#fff', padding:'28px 36px 22px',
        fontFamily:'system-ui,sans-serif' }}>
        <div style={{ fontSize:30, fontWeight:800, letterSpacing:'-0.02em' }}>{data.name||'Your Name'}</div>
        <div style={{ fontSize:13, color:'#94a3b8', marginTop:3, fontWeight:500 }}>
          {data.title||'Professional Title'}
        </div>
        <div style={{ display:'flex', gap:20, marginTop:12, flexWrap:'wrap', fontSize:11, color:'#cbd5e1' }}>
          {data.email&&<span>✉ {data.email}</span>}
          {data.phone&&<span>✆ {data.phone}</span>}
          {data.location&&<span>⌖ {data.location}</span>}
          {data.linkedin&&<span>in {data.linkedin}</span>}
        </div>
      </div>
      {/* BODY */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 220px', fontFamily:'system-ui,sans-serif' }}>
        {/* MAIN */}
        <div style={{ padding:'8px 28px 28px' }}>
          {data.summary&&(
            <>
              <SHead>Profile</SHead>
              <p style={{ fontSize:11.5, color:'#334155', lineHeight:1.7, margin:0 }}>{data.summary}</p>
            </>
          )}
          {data.experience.some(e=>e.company)&&(
            <>
              <SHead>Experience</SHead>
              {data.experience.map((ex,i)=>ex.company&&(
                <div key={i} style={{ marginBottom:18 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
                    <span style={{ fontSize:13, fontWeight:700, color:'#0f172a' }}>{ex.role}</span>
                    <span style={{ fontSize:10.5, color:'#94a3b8' }}>{ex.duration}</span>
                  </div>
                  <div style={{ fontSize:11.5, color:Accent, fontWeight:600, marginBottom:5 }}>{ex.company}</div>
                  {ex.bullets&&ex.bullets.split('\n').filter(Boolean).map((b,j)=>(
                    <div key={j} style={{ fontSize:11, color:'#475569', paddingLeft:12, lineHeight:1.6 }}>▸ {b}</div>
                  ))}
                </div>
              ))}
            </>
          )}
        </div>
        {/* SIDEBAR */}
        <div style={{ background:'#f1f5f9', padding:'8px 18px 28px', borderLeft:'1px solid #e2e8f0' }}>
          {skills.length>0&&(
            <>
              <SHead>Skills</SHead>
              <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
                {skills.map((s,i)=>(
                  <span key={i} style={{ fontSize:10, background:'#dbeafe', color:'#1d4ed8',
                    borderRadius:20, padding:'3px 9px', fontWeight:500 }}>{s}</span>
                ))}
              </div>
            </>
          )}
          {data.education.some(e=>e.school)&&(
            <>
              <SHead>Education</SHead>
              {data.education.map((e,i)=>e.school&&(
                <div key={i} style={{ marginBottom:12 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:'#0f172a' }}>{e.school}</div>
                  <div style={{ fontSize:11, color:'#475569' }}>{e.degree}</div>
                  <div style={{ fontSize:10.5, color:'#94a3b8' }}>{e.year}</div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </A4Page>
  );
}

/* ══════════════════════════════════════════════════════════════
   TEMPLATE 3 — MINIMAL
   Single column, ultra-clean, timeline grid layout
══════════════════════════════════════════════════════════════ */
function MinimalResume({ data }) {
  const skills = data.skills.split(',').map(s=>s.trim()).filter(Boolean);
  const SHead = ({ children }) => (
    <div style={{ fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.18em',
      color:'#9ca3af', marginBottom:14, marginTop:24, paddingBottom:6,
      borderBottom:'1px solid #f0f0f0' }}>
      {children}
    </div>
  );
  return (
    <A4Page>
      <div style={{ padding:'44px 52px', fontFamily:"'Helvetica Neue',Arial,sans-serif" }}>
        {/* HEADER */}
        <div style={{ marginBottom:28 }}>
          <div style={{ fontSize:32, fontWeight:300, letterSpacing:'-0.03em', color:'#111' }}>
            {data.name||'Your Name'}
          </div>
          <div style={{ fontSize:13, color:'#6b7280', marginTop:4 }}>{data.title}</div>
          <div style={{ display:'flex', gap:22, marginTop:10, fontSize:11, color:'#9ca3af', flexWrap:'wrap' }}>
            {data.email&&<span>{data.email}</span>}
            {data.phone&&<span>{data.phone}</span>}
            {data.location&&<span>{data.location}</span>}
            {data.linkedin&&<span>{data.linkedin}</span>}
          </div>
        </div>
        {/* SUMMARY */}
        {data.summary&&(
          <>
            <SHead>About</SHead>
            <p style={{ fontSize:12, color:'#374151', lineHeight:1.75, margin:'0 0 0 0',
              fontStyle:'italic' }}>{data.summary}</p>
          </>
        )}
        {/* EXPERIENCE */}
        {data.experience.some(e=>e.company)&&(
          <>
            <SHead>Work</SHead>
            {data.experience.map((ex,i)=>ex.company&&(
              <div key={i} style={{ display:'grid', gridTemplateColumns:'140px 1fr',
                gap:16, marginBottom:18 }}>
                <div>
                  <div style={{ fontSize:11, color:'#6b7280', lineHeight:1.5 }}>{ex.duration}</div>
                  <div style={{ fontSize:11, color:'#9ca3af', marginTop:2 }}>{ex.company}</div>
                </div>
                <div>
                  <div style={{ fontSize:13, fontWeight:600, color:'#111', marginBottom:4 }}>{ex.role}</div>
                  {ex.bullets&&ex.bullets.split('\n').filter(Boolean).map((b,j)=>(
                    <div key={j} style={{ fontSize:11.5, color:'#4b5563', lineHeight:1.6 }}>– {b}</div>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
        {/* EDUCATION */}
        {data.education.some(e=>e.school)&&(
          <>
            <SHead>Education</SHead>
            {data.education.map((e,i)=>e.school&&(
              <div key={i} style={{ display:'grid', gridTemplateColumns:'140px 1fr',
                gap:16, marginBottom:12 }}>
                <div style={{ fontSize:11, color:'#9ca3af' }}>{e.year}</div>
                <div>
                  <div style={{ fontSize:13, fontWeight:600, color:'#111' }}>{e.degree}</div>
                  <div style={{ fontSize:11, color:'#6b7280' }}>{e.school}</div>
                </div>
              </div>
            ))}
          </>
        )}
        {/* SKILLS */}
        {skills.length>0&&(
          <>
            <SHead>Skills</SHead>
            <div style={{ fontSize:12, color:'#374151', lineHeight:2 }}>
              {skills.join('  ·  ')}
            </div>
          </>
        )}
      </div>
    </A4Page>
  );
}

/* ══════════════════════════════════════════════════════════════
   TEMPLATE 4 — EXECUTIVE
   Centered all-caps name, double rule, traditional formal serif
══════════════════════════════════════════════════════════════ */
function ExecutiveResume({ data }) {
  const skills = data.skills.split(',').map(s=>s.trim()).filter(Boolean);
  const SHead = ({ children }) => (
    <div style={{ fontWeight:700, fontSize:10, textTransform:'uppercase', letterSpacing:'0.14em',
      borderBottom:'1.5px solid #1a1a1a', paddingBottom:3, marginBottom:10, marginTop:18 }}>
      {children}
    </div>
  );
  return (
    <A4Page>
      <div style={{ padding:'38px 48px', fontFamily:"'Times New Roman',Georgia,serif" }}>
        {/* HEADER */}
        <div style={{ textAlign:'center', marginBottom:6 }}>
          <div style={{ fontSize:24, fontWeight:700, textTransform:'uppercase',
            letterSpacing:'0.16em', color:'#111' }}>{data.name||'Your Name'}</div>
          <div style={{ fontSize:11.5, color:'#555', marginTop:4, fontStyle:'italic' }}>{data.title}</div>
          <div style={{ display:'flex', justifyContent:'center', gap:18, marginTop:7,
            fontSize:10.5, color:'#555', flexWrap:'wrap' }}>
            {data.email&&<span>{data.email}</span>}
            {data.phone&&<span>{data.phone}</span>}
            {data.location&&<span>{data.location}</span>}
            {data.linkedin&&<span>{data.linkedin}</span>}
          </div>
          <div style={{ height:1, background:'#1a1a1a', margin:'10px 0 2px' }}/>
          <div style={{ height:3, background:'#1a1a1a' }}/>
        </div>
        {/* SUMMARY */}
        {data.summary&&(
          <>
            <SHead>Executive Summary</SHead>
            <p style={{ fontSize:11.5, color:'#222', lineHeight:1.7, margin:0,
              textAlign:'justify' }}>{data.summary}</p>
          </>
        )}
        {/* EXPERIENCE */}
        {data.experience.some(e=>e.company)&&(
          <>
            <SHead>Professional Experience</SHead>
            {data.experience.map((ex,i)=>ex.company&&(
              <div key={i} style={{ marginBottom:16 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
                  <span style={{ fontSize:12.5, fontWeight:700, color:'#111' }}>{ex.company}</span>
                  <span style={{ fontSize:10.5, color:'#666' }}>{ex.duration}</span>
                </div>
                <div style={{ fontSize:11.5, fontStyle:'italic', color:'#444', marginBottom:5 }}>{ex.role}</div>
                {ex.bullets&&ex.bullets.split('\n').filter(Boolean).map((b,j)=>(
                  <div key={j} style={{ fontSize:11, color:'#333', paddingLeft:14,
                    textIndent:'-8px', lineHeight:1.6 }}>• {b}</div>
                ))}
              </div>
            ))}
          </>
        )}
        {/* BOTTOM GRID */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:32, marginTop:4 }}>
          {data.education.some(e=>e.school)&&(
            <div>
              <SHead>Education</SHead>
              {data.education.map((e,i)=>e.school&&(
                <div key={i} style={{ marginBottom:10 }}>
                  <div style={{ fontSize:12, fontWeight:700 }}>{e.school}</div>
                  <div style={{ fontSize:11, color:'#555' }}>{e.degree}{e.year&&` · ${e.year}`}</div>
                </div>
              ))}
            </div>
          )}
          {skills.length>0&&(
            <div>
              <SHead>Core Competencies</SHead>
              <div style={{ columns:2, columnGap:12 }}>
                {skills.map((s,i)=>(
                  <div key={i} style={{ fontSize:11, color:'#333', breakInside:'avoid',
                    paddingBottom:3 }}>• {s}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </A4Page>
  );
}

const RENDERERS = {
  classic: ClassicResume, modern: ModernResume,
  minimal: MinimalResume, executive: ExecutiveResume,
};

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
export default function ResumeBuilder() {
  const [step, setStep]       = useState('template');
  const [template, setTemplate] = useState('classic');
  const [data, setData]       = useState(EMPTY);
  const previewRef            = useRef(null);

  const set    = (k,v) => setData(d=>({...d,[k]:v}));
  const setExp = (i,k,v) => setData(d=>{
    const e=[...d.experience]; e[i]={...e[i],[k]:v}; return {...d,experience:e};
  });
  const setEdu = (i,k,v) => setData(d=>{
    const e=[...d.education]; e[i]={...e[i],[k]:v}; return {...d,education:e};
  });
  const addExp    = ()=>setData(d=>({...d,experience:[...d.experience,{company:'',role:'',duration:'',bullets:''}]}));
  const removeExp = i=>setData(d=>({...d,experience:d.experience.filter((_,idx)=>idx!==i)}));
  const addEdu    = ()=>setData(d=>({...d,education:[...d.education,{school:'',degree:'',year:''}]}));
  const removeEdu = i=>setData(d=>({...d,education:d.education.filter((_,idx)=>idx!==i)}));

  const handlePrint = () => {
    const content = previewRef.current?.innerHTML;
    if (!content) return;
    const w = window.open('','_blank');
    w.document.write(`<html><head><title>${data.name||'Resume'}</title>
    <style>
      *{margin:0;padding:0;box-sizing:border-box;}
      body{background:#fff; -webkit-print-color-adjust:exact; print-color-adjust:exact;}
      @page{size:A4;margin:0;}
      @media print{body{margin:0;}}
    </style></head><body>${content}</body></html>`);
    w.document.close();
    w.focus();
    setTimeout(()=>w.print(),400);
  };

  const ResumeComp = RENDERERS[template];
  const btnP = { background:'#0f172a',color:'#fff',border:'none',borderRadius:8,
    padding:'10px 22px',fontSize:14,fontWeight:600,cursor:'pointer' };
  const btnS = { background:'#fff',color:'#374151',border:'1px solid #e5e7eb',
    borderRadius:8,padding:'10px 22px',fontSize:14,fontWeight:500,cursor:'pointer' };
  const panel = { background:'#fff',borderRadius:12,border:'1px solid #e5e7eb',padding:24,marginBottom:16 };

  /* ── STEP 1: Template picker ── */
  if (step==='template') return (
    <div style={{ fontFamily:'system-ui,sans-serif', maxWidth:860, margin:'0 auto' }}>
      <div style={{ marginBottom:24 }}>
        <h2 style={{ fontSize:22,fontWeight:700,color:'#111',margin:'0 0 4px' }}>Resume Builder</h2>
        <p style={{ color:'#6b7280',fontSize:14,margin:0 }}>Choose a template to get started</p>
      </div>
      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:28 }}>
        {TEMPLATES.map(t=>{
          const RC = RENDERERS[t.id];
          const isSelected = template===t.id;
          return (
            <div key={t.id} onClick={()=>setTemplate(t.id)} style={{
              border:`2px solid ${isSelected?'#2563eb':'#e5e7eb'}`,
              borderRadius:12, padding:16, cursor:'pointer',
              background: isSelected?'#eff6ff':'#fff',
              transition:'all 0.15s'
            }}>
              <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:6 }}>
                <span style={{ fontWeight:700,fontSize:15,color:'#111' }}>{t.label}</span>
                {isSelected&&<span style={{ fontSize:11,background:'#2563eb',color:'#fff',
                  padding:'2px 10px',borderRadius:20 }}>Selected</span>}
              </div>
              <p style={{ fontSize:12,color:'#6b7280',margin:'0 0 12px' }}>{t.desc}</p>
              {/* Scaled A4 mini-preview */}
              <div style={{ width:'100%', height:200, overflow:'hidden', borderRadius:6,
                border:'1px solid #e5e7eb', background:'#f9fafb', position:'relative' }}>
                <div style={{ transform:'scale(0.33)', transformOrigin:'top left',
                  width: A4.width, pointerEvents:'none' }}>
                  <RC data={SAMPLE}/>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <button onClick={()=>setStep('form')} style={btnP}>
        Continue with {TEMPLATES.find(t=>t.id===template)?.label} →
      </button>
    </div>
  );

  /* ── STEP 2: Form ── */
  if (step==='form') return (
    <div style={{ fontFamily:'system-ui,sans-serif', maxWidth:700, margin:'0 auto' }}>
      <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20 }}>
        <div>
          <h2 style={{ fontSize:20,fontWeight:700,color:'#111',margin:0 }}>Fill in your details</h2>
          <p style={{ color:'#9ca3af',fontSize:13,margin:'2px 0 0' }}>
            Template: <strong>{TEMPLATES.find(t=>t.id===template)?.label}</strong>
          </p>
        </div>
        <button onClick={()=>setStep('template')} style={btnS}>← Change template</button>
      </div>

      {/* Personal Info */}
      <div style={panel}>
        <div style={{ fontSize:12,fontWeight:700,color:'#374151',marginBottom:14,
          textTransform:'uppercase',letterSpacing:'0.06em' }}>Personal Info</div>
        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:12 }}>
          <Field label="Full Name"><FInput value={data.name} onChange={v=>set('name',v)} placeholder="Alex Johnson"/></Field>
          <Field label="Professional Title"><FInput value={data.title} onChange={v=>set('title',v)} placeholder="Senior Product Designer"/></Field>
          <Field label="Email"><FInput value={data.email} onChange={v=>set('email',v)} placeholder="alex@email.com"/></Field>
          <Field label="Phone"><FInput value={data.phone} onChange={v=>set('phone',v)} placeholder="+1 555 0100"/></Field>
          <Field label="Location"><FInput value={data.location} onChange={v=>set('location',v)} placeholder="San Francisco, CA"/></Field>
          <Field label="LinkedIn"><FInput value={data.linkedin} onChange={v=>set('linkedin',v)} placeholder="linkedin.com/in/alex"/></Field>
        </div>
        <Field label="Professional Summary">
          <FInput value={data.summary} onChange={v=>set('summary',v)}
            placeholder="Brief overview of your background and strengths…" multiline rows={3}/>
        </Field>
      </div>

      {/* Experience */}
      <div style={panel}>
        <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14 }}>
          <div style={{ fontSize:12,fontWeight:700,color:'#374151',textTransform:'uppercase',letterSpacing:'0.06em' }}>Experience</div>
          <button onClick={addExp} style={{...btnS,padding:'6px 14px',fontSize:12}}>+ Add Position</button>
        </div>
        {data.experience.map((ex,i)=>(
          <div key={i} style={{ background:'#f9fafb',borderRadius:8,padding:14,marginBottom:12,border:'1px solid #f0f0f0' }}>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10 }}>
              <span style={{ fontSize:12,fontWeight:600,color:'#6b7280' }}>Position {i+1}</span>
              {data.experience.length>1&&(
                <button onClick={()=>removeExp(i)} style={{...btnS,padding:'3px 10px',fontSize:11,
                  color:'#ef4444',borderColor:'#fecaca'}}>Remove</button>
              )}
            </div>
            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:10 }}>
              <Field label="Company"><FInput value={ex.company} onChange={v=>setExp(i,'company',v)} placeholder="Acme Corp"/></Field>
              <Field label="Role / Title"><FInput value={ex.role} onChange={v=>setExp(i,'role',v)} placeholder="Lead Designer"/></Field>
              <Field label="Duration"><FInput value={ex.duration} onChange={v=>setExp(i,'duration',v)} placeholder="Jan 2021 – Present"/></Field>
            </div>
            <Field label="Achievements (one per line)">
              <FInput value={ex.bullets} onChange={v=>setExp(i,'bullets',v)} multiline rows={3}
                placeholder={"Led end-to-end redesign of flagship product\nGrew NPS from 31 to 67"}/>
            </Field>
          </div>
        ))}
      </div>

      {/* Education */}
      <div style={panel}>
        <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14 }}>
          <div style={{ fontSize:12,fontWeight:700,color:'#374151',textTransform:'uppercase',letterSpacing:'0.06em' }}>Education</div>
          <button onClick={addEdu} style={{...btnS,padding:'6px 14px',fontSize:12}}>+ Add</button>
        </div>
        {data.education.map((e,i)=>(
          <div key={i} style={{ background:'#f9fafb',borderRadius:8,padding:14,marginBottom:12,border:'1px solid #f0f0f0' }}>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10 }}>
              <span style={{ fontSize:12,fontWeight:600,color:'#6b7280' }}>Degree {i+1}</span>
              {data.education.length>1&&(
                <button onClick={()=>removeEdu(i)} style={{...btnS,padding:'3px 10px',fontSize:11,
                  color:'#ef4444',borderColor:'#fecaca'}}>Remove</button>
              )}
            </div>
            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr 90px',gap:10 }}>
              <Field label="School / University"><FInput value={e.school} onChange={v=>setEdu(i,'school',v)} placeholder="UC Berkeley"/></Field>
              <Field label="Degree"><FInput value={e.degree} onChange={v=>setEdu(i,'degree',v)} placeholder="B.S. Computer Science"/></Field>
              <Field label="Year"><FInput value={e.year} onChange={v=>setEdu(i,'year',v)} placeholder="2020"/></Field>
            </div>
          </div>
        ))}
      </div>

      {/* Skills */}
      <div style={panel}>
        <div style={{ fontSize:12,fontWeight:700,color:'#374151',textTransform:'uppercase',
          letterSpacing:'0.06em',marginBottom:14 }}>Skills</div>
        <Field label="Skills (comma-separated)">
          <FInput value={data.skills} onChange={v=>set('skills',v)}
            placeholder="Figma, React, UX Research, Prototyping, Agile" multiline rows={2}/>
        </Field>
      </div>

      <div style={{ display:'flex',gap:12,marginTop:4 }}>
        <button onClick={()=>setStep('preview')} style={btnP}>Preview Resume →</button>
        <button onClick={()=>setStep('template')} style={btnS}>← Back</button>
      </div>
    </div>
  );

  /* ── STEP 3: Preview (A4) ── */
  return (
    <div style={{ fontFamily:'system-ui,sans-serif' }}>
      <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16 }}>
        <div>
          <h2 style={{ fontSize:20,fontWeight:700,color:'#111',margin:0 }}>Resume Preview</h2>
          <p style={{ color:'#9ca3af',fontSize:13,margin:'2px 0 0' }}>A4 format · ready to print or save as PDF</p>
        </div>
        <div style={{ display:'flex',gap:10 }}>
          <button onClick={()=>setStep('form')} style={btnS}>← Edit</button>
          <button onClick={()=>setStep('template')} style={btnS}>Switch template</button>
          <button onClick={handlePrint} style={btnP}>⬇ Print / Save PDF</button>
        </div>
      </div>

      {/* Template toggle pills */}
      <div style={{ display:'flex',gap:8,marginBottom:20 }}>
        {TEMPLATES.map(t=>(
          <button key={t.id} onClick={()=>setTemplate(t.id)} style={{
            padding:'5px 16px',borderRadius:20,fontSize:12,fontWeight:500,cursor:'pointer',
            border:`1px solid ${template===t.id?'#2563eb':'#e5e7eb'}`,
            background:template===t.id?'#eff6ff':'#fff',
            color:template===t.id?'#1d4ed8':'#374151',
            transition:'all 0.15s'
          }}>{t.label}</button>
        ))}
      </div>

      {/* A4 paper shadow */}
      <div style={{ display:'flex',justifyContent:'center',background:'#e5e7eb',
        padding:'32px 24px',borderRadius:8 }}>
        <div style={{ boxShadow:'0 8px 32px rgba(0,0,0,0.18)',borderRadius:2 }}>
          <div ref={previewRef}>
            <ResumeComp data={data}/>
          </div>
        </div>
      </div>

      <p style={{ textAlign:'center',color:'#9ca3af',fontSize:12,marginTop:12 }}>
        Tip: Click "Print / Save PDF" → in the print dialog select "Save as PDF" and set paper to A4.
      </p>
    </div>
  );
}