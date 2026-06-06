import { useState } from "react";

// ─── FONTS ──────────────────────────────────────────────────
function FontLoader() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Instrument+Serif:ital@0;1&display=swap');
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: 'Plus Jakarta Sans', sans-serif; background: #0a0a0f; color: #f0f0f5; }
      ::-webkit-scrollbar { width: 4px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: #2a2a3a; border-radius: 4px; }
      textarea, input { font-family: 'Plus Jakarta Sans', sans-serif; }
      @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
      .fade-up { animation: fadeUp 0.5s ease forwards; }
      .fade-in { animation: fadeIn 0.4s ease forwards; }
      button { cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; }
      button:active { transform: scale(0.97); }
    `}</style>
  );
}

// ─── DESIGN TOKENS ──────────────────────────────────────────
const T = {
  bg:        "#0a0a0f",
  surface:   "#111118",
  surface2:  "#18181f",
  border:    "#22222e",
  border2:   "#2e2e3e",
  text:      "#f0f0f5",
  muted:     "#6b6b80",
  muted2:    "#9090a0",
  accent:    "#7c6af7",
  accentBg:  "#1a1730",
  accentHover: "#6b5ae0",
  green:     "#22c55e",
  greenBg:   "#0d1f15",
  amber:     "#f59e0b",
  amberBg:   "#1f1708",
  red:       "#ef4444",
  redBg:     "#1f0d0d",
};

const css = {
  card: {
    background: T.surface,
    border: `1px solid ${T.border}`,
    borderRadius: 14,
    padding: "20px 24px",
  },
  input: {
    width: "100%",
    padding: "11px 14px",
    background: T.surface2,
    border: `1px solid ${T.border2}`,
    borderRadius: 10,
    fontSize: 14,
    color: T.text,
    outline: "none",
    transition: "border-color 0.2s",
  },
  label: {
    fontSize: 12,
    fontWeight: 600,
    color: T.muted2,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    display: "block",
    marginBottom: 8,
  },
  btnPrimary: {
    background: T.accent,
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "11px 22px",
    fontSize: 14,
    fontWeight: 600,
    transition: "background 0.2s",
  },
  btnGhost: {
    background: "transparent",
    color: T.muted2,
    border: `1px solid ${T.border2}`,
    borderRadius: 10,
    padding: "11px 22px",
    fontSize: 14,
    fontWeight: 500,
  },
  tag: (color = "accent") => {
    const map = {
      accent: { bg: T.accentBg, color: T.accent },
      green:  { bg: T.greenBg,  color: T.green  },
      amber:  { bg: T.amberBg,  color: T.amber  },
      red:    { bg: T.redBg,    color: T.red    },
    };
    return {
      background: map[color].bg,
      color: map[color].color,
      borderRadius: 20,
      padding: "3px 10px",
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: "0.03em",
    };
  },
};

// ════════════════════════════════════════════════════════════
// AUTH PAGE  (Login + Signup)
// ════════════════════════════════════════════════════════════
function AuthPage({ onAuth }) {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = () => {
    setError("");
    if (!form.email || !form.password) { setError("Please fill all fields."); return; }
    if (mode === "signup" && form.password !== form.confirm) { setError("Passwords don't match."); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); onAuth(form.name || form.email.split("@")[0]); }, 1000);
  };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, position: "relative", overflow: "hidden" }}>
      {/* Background glow */}
      <div style={{ position: "absolute", top: -120, left: "50%", transform: "translateX(-50%)", width: 600, height: 400, background: "radial-gradient(circle, rgba(124,106,247,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div className="fade-up" style={{ width: "100%", maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: T.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>⚡</div>
            <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: 22, fontStyle: "italic", color: T.text }}>CareerForge</span>
          </div>
          <div style={{ fontSize: 13, color: T.muted }}>AI-powered career optimization</div>
        </div>

        {/* Card */}
        <div style={{ ...css.card, padding: "32px 36px" }}>
          {/* Tabs */}
          <div style={{ display: "flex", background: T.surface2, borderRadius: 10, padding: 4, marginBottom: 28 }}>
            {["login", "signup"].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(""); }}
                style={{
                  flex: 1, padding: "9px 0", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600,
                  background: mode === m ? T.accent : "transparent",
                  color: mode === m ? "#fff" : T.muted,
                  transition: "all 0.2s",
                }}>
                {m === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          {/* Fields */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {mode === "signup" && (
              <div>
                <label style={css.label}>Full Name</label>
                <input placeholder="Akshara Kumar" value={form.name}
                  onChange={e => set("name", e.target.value)} style={css.input}
                  onFocus={e => e.target.style.borderColor = T.accent}
                  onBlur={e => e.target.style.borderColor = T.border2} />
              </div>
            )}
            <div>
              <label style={css.label}>Email</label>
              <input type="email" placeholder="you@email.com" value={form.email}
                onChange={e => set("email", e.target.value)} style={css.input}
                onFocus={e => e.target.style.borderColor = T.accent}
                onBlur={e => e.target.style.borderColor = T.border2} />
            </div>
            <div>
              <label style={css.label}>Password</label>
              <input type="password" placeholder="••••••••" value={form.password}
                onChange={e => set("password", e.target.value)} style={css.input}
                onFocus={e => e.target.style.borderColor = T.accent}
                onBlur={e => e.target.style.borderColor = T.border2} />
            </div>
            {mode === "signup" && (
              <div>
                <label style={css.label}>Confirm Password</label>
                <input type="password" placeholder="••••••••" value={form.confirm}
                  onChange={e => set("confirm", e.target.value)} style={css.input}
                  onFocus={e => e.target.style.borderColor = T.accent}
                  onBlur={e => e.target.style.borderColor = T.border2} />
              </div>
            )}
          </div>

          {error && (
            <div style={{ marginTop: 14, padding: "10px 14px", background: T.redBg, borderRadius: 8, fontSize: 13, color: T.red }}>
              {error}
            </div>
          )}

          <button onClick={submit} style={{ ...css.btnPrimary, width: "100%", marginTop: 22, opacity: loading ? 0.7 : 1, transition: "all 0.2s" }}>
            {loading ? "Please wait..." : mode === "login" ? "Sign In →" : "Create Account →"}
          </button>

          {mode === "login" && (
            <div style={{ textAlign: "center", marginTop: 16 }}>
              <span style={{ fontSize: 12, color: T.muted }}>Don't have an account? </span>
              <button onClick={() => setMode("signup")} style={{ background: "none", border: "none", fontSize: 12, color: T.accent, fontWeight: 600 }}>Sign up free</button>
            </div>
          )}
        </div>

        <div style={{ textAlign: "center", marginTop: 20, fontSize: 11, color: T.muted }}>
          No credit card required · Free forever plan available
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// SIDEBAR
// ════════════════════════════════════════════════════════════
const NAV = [
  { id: "dashboard",  label: "Dashboard",     icon: "▦",  group: "overview" },
  { id: "resume",     label: "Resume Builder", icon: "◧",  group: "tools" },
  { id: "score",      label: "Score Analyzer", icon: "◎",  group: "tools" },
  { id: "skillgap",   label: "Skill Gap",      icon: "◈",  group: "tools" },
  { id: "jobmatch",   label: "Job Match",      icon: "◉",  group: "tools" },
  { id: "linkedin",   label: "LinkedIn",       icon: "◆",  group: "tools" },
  { id: "interview",  label: "Mock Interview", icon: "◐",  group: "tools" },
];

function Sidebar({ active, onNav, user, onLogout }) {
  return (
    <aside style={{
      width: 220, flexShrink: 0, background: T.surface,
      borderRight: `1px solid ${T.border}`,
      display: "flex", flexDirection: "column",
      padding: "20px 12px",
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "0 8px", marginBottom: 32 }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: T.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>⚡</div>
        <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: 17, fontStyle: "italic", color: T.text }}>CareerForge</span>
      </div>

      {/* Nav groups */}
      {["overview", "tools"].map(group => (
        <div key={group} style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: T.muted, textTransform: "uppercase", padding: "0 10px", marginBottom: 6 }}>
            {group}
          </div>
          {NAV.filter(n => n.group === group).map(item => (
            <button key={item.id} onClick={() => onNav(item.id)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                width: "100%", padding: "9px 10px", borderRadius: 9,
                border: "none", textAlign: "left", fontSize: 13, fontWeight: 500,
                background: active === item.id ? T.accentBg : "transparent",
                color: active === item.id ? T.accent : T.muted2,
                transition: "all 0.15s",
                marginBottom: 2,
              }}
              onMouseEnter={e => { if (active !== item.id) e.currentTarget.style.background = T.surface2; e.currentTarget.style.color = T.text; }}
              onMouseLeave={e => { if (active !== item.id) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = T.muted2; } }}
            >
              <span style={{ fontSize: 15, opacity: 0.9 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      ))}

      {/* User */}
      <div style={{ marginTop: "auto", borderTop: `1px solid ${T.border}`, paddingTop: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 6px" }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%", background: T.accentBg,
            color: T.accent, fontWeight: 700, fontSize: 13,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            {user.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: T.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user}</div>
            <div style={{ fontSize: 11, color: T.muted }}>B.Tech IT</div>
          </div>
          <button onClick={onLogout} title="Sign out"
            style={{ background: "none", border: "none", color: T.muted, fontSize: 16, padding: 4 }}>↩</button>
        </div>
      </div>
    </aside>
  );
}

// ─── Shell ───────────────────────────────────────────────────
function Shell({ active, onNav, user, onLogout, title, children }) {
  return (
    <div style={{ display: "flex", height: "100vh", background: T.bg, overflow: "hidden" }}>
      <Sidebar active={active} onNav={onNav} user={user} onLogout={onLogout} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Topbar */}
        <div style={{ background: T.surface, borderBottom: `1px solid ${T.border}`, padding: "15px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 20, fontStyle: "italic", color: T.text }}>{title}</div>
          <button style={{ ...css.btnPrimary, padding: "8px 18px", fontSize: 13 }}>⬆ Upload Resume</button>
        </div>
        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: 28 }} className="fade-in">
          {children}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// DASHBOARD
// ════════════════════════════════════════════════════════════
function Dashboard({ onNav, user }) {
  const tools = [
    { id: "resume",    icon: "◧", name: "Resume Builder",  sub: "Last edited 2 days ago",  badge: "Done",    bc: "green"  },
    { id: "score",     icon: "◎", name: "Score Analyzer",  sub: "Score: 78/100",            badge: "Done",    bc: "green"  },
    { id: "skillgap",  icon: "◈", name: "Skill Gap",       sub: "3 gaps identified",        badge: "Review",  bc: "amber"  },
    { id: "jobmatch",  icon: "◉", name: "Job Match",       sub: "Paste a JD to start",      badge: "New",     bc: "accent" },
    { id: "linkedin",  icon: "◆", name: "LinkedIn",        sub: "Not started",              badge: "New",     bc: "accent" },
    { id: "interview", icon: "◐", name: "Mock Interview",  sub: "0 sessions done",          badge: "New",     bc: "accent" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 900 }}>
      {/* Welcome */}
      <div className="fade-up">
        <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 26, fontStyle: "italic", marginBottom: 4 }}>
          Welcome back, {user} 👋
        </div>
        <div style={{ fontSize: 13, color: T.muted }}>You're 3 steps away from a complete career profile.</div>
      </div>

      {/* Readiness bar */}
      <div className="fade-up" style={{ background: `linear-gradient(135deg, ${T.accent}22, ${T.accentBg})`, border: `1px solid ${T.accent}33`, borderRadius: 16, padding: "24px 28px", display: "flex", alignItems: "center", gap: 28 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: T.accent, textTransform: "uppercase", marginBottom: 6 }}>Career Readiness Score</div>
          <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 56, fontStyle: "italic", color: T.text, lineHeight: 1 }}>62<span style={{ fontSize: 22, color: T.muted }}>/100</span></div>
          <div style={{ fontSize: 12, color: T.muted, marginTop: 6 }}>Complete all modules to reach 100</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ height: 8, background: T.surface2, borderRadius: 4, overflow: "hidden" }}>
            <div style={{ width: "62%", height: "100%", background: T.accent, borderRadius: 4, transition: "width 1s ease" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11, color: T.muted }}>
            <span>0</span><span>100</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        {[
          { icon: "◧", label: "Resume Score",    val: "78", unit: "/100", c: "accent" },
          { icon: "◉", label: "Best Job Match",   val: "85", unit: "%",    c: "green"  },
          { icon: "◈", label: "Skill Gaps Found", val: "3",  unit: " gaps",c: "amber"  },
        ].map(s => (
          <div key={s.label} style={{ ...css.card }}>
            <div style={{ fontSize: 20, marginBottom: 10, opacity: 0.7 }}>{s.icon}</div>
            <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 32, fontStyle: "italic", color: s.c === "accent" ? T.accent : s.c === "green" ? T.green : T.amber }}>
              {s.val}<span style={{ fontSize: 14, color: T.muted }}>{s.unit}</span>
            </div>
            <div style={{ fontSize: 12, color: T.muted, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Modules grid */}
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.muted, marginBottom: 14 }}>Your Modules</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
          {tools.map(t => (
            <div key={t.id} onClick={() => onNav(t.id)}
              style={{ ...css.card, display: "flex", alignItems: "center", gap: 14, cursor: "pointer", transition: "border-color 0.2s, background 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = T.border2; e.currentTarget.style.background = T.surface2; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.background = T.surface; }}
            >
              <div style={{ width: 38, height: 38, borderRadius: 10, background: T.surface2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                {t.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{t.name}</div>
                <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{t.sub}</div>
              </div>
              <div style={css.tag(t.bc)}>{t.badge}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// RESUME BUILDER
// ════════════════════════════════════════════════════════════
function ResumeBuilder() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", linkedin: "", github: "", summary: "",
    education: [{ degree: "", school: "", year: "", gpa: "" }],
    skills: "",
    experience: [{ role: "", company: "", duration: "", desc: "" }],
    projects: [{ title: "", tech: "", desc: "" }],
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const steps = ["Personal", "Education", "Skills", "Experience", "Projects", "Preview"];

  const Field = ({ label, fkey, ph, type = "text", rows }) => (
    <div style={{ marginBottom: 16 }}>
      <label style={css.label}>{label}</label>
      {rows ? (
        <textarea rows={rows} placeholder={ph} value={form[fkey] || ""}
          onChange={e => set(fkey, e.target.value)}
          style={{ ...css.input, resize: "vertical" }}
          onFocus={e => e.target.style.borderColor = T.accent}
          onBlur={e => e.target.style.borderColor = T.border2} />
      ) : (
        <input type={type} placeholder={ph} value={form[fkey] || ""}
          onChange={e => set(fkey, e.target.value)} style={css.input}
          onFocus={e => e.target.style.borderColor = T.accent}
          onBlur={e => e.target.style.borderColor = T.border2} />
      )}
    </div>
  );

  const panels = [
    /* 0 Personal */
    <div key="p">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Field label="Full Name" fkey="name" ph="Akshara Kumar" />
        <Field label="Email" fkey="email" ph="akshara@email.com" type="email" />
        <Field label="Phone" fkey="phone" ph="+91 9876543210" />
        <Field label="LinkedIn" fkey="linkedin" ph="linkedin.com/in/akshara" />
        <Field label="GitHub" fkey="github" ph="github.com/akshara" />
      </div>
      <Field label="Professional Summary" fkey="summary" ph="A brief 2–3 sentence summary..." rows={4} />
    </div>,

    /* 1 Education */
    <div key="edu">
      {form.education.map((edu, i) => (
        <div key={i} style={{ ...css.card, marginBottom: 16, background: T.surface2 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.muted, letterSpacing: "0.06em", marginBottom: 14, textTransform: "uppercase" }}>Degree {i + 1}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[["Degree", "degree", "B.Tech IT"], ["University", "school", "XYZ University"], ["Graduation Year", "year", "2025"], ["GPA / %", "gpa", "8.5 / 10"]].map(([lbl, k, ph]) => (
              <div key={k}>
                <label style={css.label}>{lbl}</label>
                <input placeholder={ph} value={edu[k]}
                  onChange={e => { const u = [...form.education]; u[i][k] = e.target.value; set("education", u); }}
                  style={css.input}
                  onFocus={e => e.target.style.borderColor = T.accent}
                  onBlur={e => e.target.style.borderColor = T.border2} />
              </div>
            ))}
          </div>
        </div>
      ))}
      <button onClick={() => set("education", [...form.education, { degree: "", school: "", year: "", gpa: "" }])}
        style={{ ...css.btnGhost, fontSize: 13 }}>+ Add degree</button>
    </div>,

    /* 2 Skills */
    <div key="sk">
      <Field label="Skills (comma separated)" fkey="skills" ph="Python, SQL, React, AWS, Machine Learning..." rows={4} />
      <div style={{ padding: "14px 16px", background: T.accentBg, borderRadius: 10, border: `1px solid ${T.accent}33` }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: T.accent, marginBottom: 6 }}>💡 Pro tip</div>
        <div style={{ fontSize: 13, color: T.muted2, lineHeight: 1.7 }}>Include tools, languages, frameworks, and soft skills. The more specific, the better your ATS score.</div>
      </div>
    </div>,

    /* 3 Experience */
    <div key="ex">
      {form.experience.map((exp, i) => (
        <div key={i} style={{ ...css.card, marginBottom: 16, background: T.surface2 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.muted, letterSpacing: "0.06em", marginBottom: 14, textTransform: "uppercase" }}>Experience {i + 1}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            {[["Role", "role", "Software Engineer Intern"], ["Company", "company", "TechCorp"], ["Duration", "duration", "Jun–Aug 2024"]].map(([lbl, k, ph]) => (
              <div key={k}>
                <label style={css.label}>{lbl}</label>
                <input placeholder={ph} value={exp[k]}
                  onChange={e => { const u = [...form.experience]; u[i][k] = e.target.value; set("experience", u); }}
                  style={css.input}
                  onFocus={e => e.target.style.borderColor = T.accent}
                  onBlur={e => e.target.style.borderColor = T.border2} />
              </div>
            ))}
          </div>
          <label style={css.label}>Description</label>
          <textarea rows={3} placeholder="• Built REST APIs reducing response time by 40%..." value={exp.desc}
            onChange={e => { const u = [...form.experience]; u[i].desc = e.target.value; set("experience", u); }}
            style={{ ...css.input, resize: "vertical" }}
            onFocus={e => e.target.style.borderColor = T.accent}
            onBlur={e => e.target.style.borderColor = T.border2} />
        </div>
      ))}
      <button onClick={() => set("experience", [...form.experience, { role: "", company: "", duration: "", desc: "" }])}
        style={{ ...css.btnGhost, fontSize: 13 }}>+ Add experience</button>
    </div>,

    /* 4 Projects */
    <div key="pr">
      {form.projects.map((p, i) => (
        <div key={i} style={{ ...css.card, marginBottom: 16, background: T.surface2 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.muted, letterSpacing: "0.06em", marginBottom: 14, textTransform: "uppercase" }}>Project {i + 1}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            {[["Title", "title", "CareerForge AI"], ["Tech Stack", "tech", "React, FastAPI, PostgreSQL"]].map(([lbl, k, ph]) => (
              <div key={k}>
                <label style={css.label}>{lbl}</label>
                <input placeholder={ph} value={p[k]}
                  onChange={e => { const u = [...form.projects]; u[i][k] = e.target.value; set("projects", u); }}
                  style={css.input}
                  onFocus={e => e.target.style.borderColor = T.accent}
                  onBlur={e => e.target.style.borderColor = T.border2} />
              </div>
            ))}
          </div>
          <label style={css.label}>Description</label>
          <textarea rows={3} placeholder="AI-powered resume analyzer helping students improve ATS scores..." value={p.desc}
            onChange={e => { const u = [...form.projects]; u[i].desc = e.target.value; set("projects", u); }}
            style={{ ...css.input, resize: "vertical" }}
            onFocus={e => e.target.style.borderColor = T.accent}
            onBlur={e => e.target.style.borderColor = T.border2} />
        </div>
      ))}
      <button onClick={() => set("projects", [...form.projects, { title: "", tech: "", desc: "" }])}
        style={{ ...css.btnGhost, fontSize: 13 }}>+ Add project</button>
    </div>,

    /* 5 Preview */
    <div key="pv">
      <div style={{ background: "#fff", color: "#111", borderRadius: 12, padding: "32px 36px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <div style={{ borderBottom: "3px solid #7c6af7", paddingBottom: 16, marginBottom: 20 }}>
          <div style={{ fontSize: 26, fontWeight: 800, color: "#111" }}>{form.name || "Your Name"}</div>
          <div style={{ fontSize: 13, color: "#555", marginTop: 4 }}>
            {[form.email, form.phone, form.linkedin, form.github].filter(Boolean).join(" · ")}
          </div>
        </div>
        {form.summary && <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", color: "#7c6af7", textTransform: "uppercase", marginBottom: 8 }}>Summary</div>
          <div style={{ fontSize: 13, lineHeight: 1.7, color: "#333" }}>{form.summary}</div>
        </div>}
        {form.skills && <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", color: "#7c6af7", textTransform: "uppercase", marginBottom: 10 }}>Skills</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {form.skills.split(",").map(s => s.trim()).filter(Boolean).map(s => (
              <span key={s} style={{ background: "#ede9fe", color: "#5b21b6", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 500 }}>{s}</span>
            ))}
          </div>
        </div>}
        {form.education.some(e => e.degree) && <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", color: "#7c6af7", textTransform: "uppercase", marginBottom: 10 }}>Education</div>
          {form.education.filter(e => e.degree).map((e, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div style={{ fontWeight: 600, fontSize: 13 }}>{e.degree} — {e.school}</div>
              <div style={{ fontSize: 12, color: "#666" }}>{e.year}{e.gpa && ` · GPA: ${e.gpa}`}</div>
            </div>
          ))}
        </div>}
        {form.projects.some(p => p.title) && <div>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", color: "#7c6af7", textTransform: "uppercase", marginBottom: 10 }}>Projects</div>
          {form.projects.filter(p => p.title).map((p, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 600, fontSize: 13 }}>{p.title} <span style={{ color: "#888", fontWeight: 400 }}>· {p.tech}</span></div>
              <div style={{ fontSize: 12, color: "#444", lineHeight: 1.6, marginTop: 2 }}>{p.desc}</div>
            </div>
          ))}
        </div>}
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
        <button style={{ ...css.btnPrimary, flex: 1 }}>⬇ Download PDF</button>
        <button style={{ ...css.btnGhost, flex: 1 }}>⬇ Download DOCX</button>
      </div>
    </div>,
  ];

  return (
    <div style={{ maxWidth: 760 }}>
      {/* Stepper */}
      <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 32 }}>
        {steps.map((s, i) => (
          <div key={s} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : "initial" }}>
            <div onClick={() => setStep(i)} style={{
              width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
              background: i === step ? T.accent : i < step ? T.greenBg : T.surface2,
              border: i === step ? `2px solid ${T.accent}` : i < step ? `2px solid ${T.green}` : `1px solid ${T.border2}`,
              color: i === step ? "#fff" : i < step ? T.green : T.muted,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 700, cursor: "pointer",
            }}>{i < step ? "✓" : i + 1}</div>
            <div style={{ fontSize: 11, marginLeft: 6, color: i === step ? T.text : T.muted, whiteSpace: "nowrap", marginRight: 8, fontWeight: i === step ? 600 : 400 }}>{s}</div>
            {i < steps.length - 1 && <div style={{ flex: 1, height: 1, background: i < step ? T.green + "55" : T.border, marginRight: 8 }} />}
          </div>
        ))}
      </div>

      {panels[step]}

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28 }}>
        <button style={{ ...css.btnGhost, visibility: step === 0 ? "hidden" : "visible" }} onClick={() => setStep(s => s - 1)}>← Back</button>
        {step < steps.length - 1 && <button style={css.btnPrimary} onClick={() => setStep(s => s + 1)}>Next →</button>}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// SCORE ANALYZER
// ════════════════════════════════════════════════════════════
function ScoreAnalyzer() {
  const [uploaded, setUploaded] = useState(false);
  const score = 78;
  const checks = [
    { label: "ATS Compatibility",       pass: true,  note: "Format is fully ATS-friendly" },
    { label: "Contact Information",     pass: true,  note: "All fields present" },
    { label: "Quantified Achievements", pass: false, note: "Add numbers to impact statements" },
    { label: "GitHub / Portfolio Link", pass: false, note: "Missing from contact section" },
    { label: "Keyword Optimization",    pass: true,  note: "Strong keyword density detected" },
    { label: "Grammar & Readability",   pass: true,  note: "No major issues found" },
    { label: "Project Descriptions",    pass: false, note: "Add more technical detail" },
    { label: "Skills Section",          pass: true,  note: "Well-structured skills list" },
  ];
  const passed = checks.filter(c => c.pass).length;

  if (!uploaded) return (
    <div style={{ maxWidth: 600 }}>
      <div style={{ ...css.card, textAlign: "center", padding: 56 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>◎</div>
        <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 22, fontStyle: "italic", marginBottom: 8 }}>Analyze your resume</div>
        <div style={{ fontSize: 13, color: T.muted, marginBottom: 28 }}>Get an instant ATS score with actionable suggestions</div>
        <div onClick={() => setUploaded(true)}
          style={{ border: `2px dashed ${T.border2}`, borderRadius: 12, padding: "40px 24px", marginBottom: 20, cursor: "pointer", transition: "border-color 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.borderColor = T.accent}
          onMouseLeave={e => e.currentTarget.style.borderColor = T.border2}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>⬆</div>
          <div style={{ fontSize: 14, color: T.muted2 }}>Click to upload PDF or DOCX</div>
          <div style={{ fontSize: 12, color: T.muted, marginTop: 4 }}>Max 5MB</div>
        </div>
        <button style={{ ...css.btnPrimary, padding: "12px 32px" }} onClick={() => setUploaded(true)}>Analyze Resume</button>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 760 }}>
      {/* Score hero */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 16, marginBottom: 20 }}>
        <div style={{ background: `linear-gradient(135deg, ${T.accent}, #5b4bd0)`, borderRadius: 14, padding: "24px 28px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "rgba(255,255,255,0.6)", textTransform: "uppercase", marginBottom: 6 }}>Resume Score</div>
          <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 72, fontStyle: "italic", color: "#fff", lineHeight: 1 }}>{score}</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>out of 100</div>
          <div style={{ background: "rgba(0,0,0,0.25)", borderRadius: 4, height: 6, marginTop: 16, overflow: "hidden" }}>
            <div style={{ width: `${score}%`, height: "100%", background: "rgba(255,255,255,0.7)", borderRadius: 4 }} />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { label: "Checks passed",  val: `${passed}/${checks.length}`, c: "green" },
            { label: "Issues to fix",  val: `${checks.length - passed}`,  c: "amber" },
            { label: "ATS Ready",      val: "Yes ✓",                      c: "accent" },
          ].map(s => (
            <div key={s.label} style={{ ...css.card, display: "flex", justifyContent: "space-between", alignItems: "center", flex: 1 }}>
              <div style={{ fontSize: 13, color: T.muted }}>{s.label}</div>
              <div style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontSize: 22, color: s.c === "green" ? T.green : s.c === "amber" ? T.amber : T.accent }}>{s.val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Checklist */}
      <div style={css.card}>
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 18 }}>Detailed Analysis</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {checks.map(c => (
            <div key={c.label} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "12px 14px", borderRadius: 10,
              background: c.pass ? T.greenBg : T.amberBg,
              border: `1px solid ${c.pass ? T.green + "33" : T.amber + "33"}`,
            }}>
              <div style={{
                width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                background: c.pass ? T.green : T.amber, color: "#000",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700,
              }}>{c.pass ? "✓" : "!"}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: c.pass ? T.green : T.amber }}>{c.label}</div>
                <div style={{ fontSize: 12, color: T.muted, marginTop: 1 }}>{c.note}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// SKILL GAP
// ════════════════════════════════════════════════════════════
function SkillGap() {
  const [role, setRole] = useState("Data Analyst");
  const [analyzed, setAnalyzed] = useState(false);

  const roles = ["Data Analyst", "Frontend Developer", "Backend Developer", "ML Engineer", "Full Stack"];
  const data = {
    "Data Analyst":       { have: ["Python", "SQL", "Excel", "Statistics basics"], missing: ["Tableau", "Power BI", "Advanced Statistics"], courses: [{ n: "Tableau for Analysts", p: "Coursera", d: "12 hrs" }, { n: "Power BI Complete Guide", p: "Udemy", d: "8 hrs" }, { n: "Statistics for Data Science", p: "edX", d: "20 hrs" }] },
    "Frontend Developer": { have: ["HTML", "CSS", "JavaScript"], missing: ["React.js", "TypeScript", "Tailwind CSS"], courses: [{ n: "React – Complete Guide", p: "Udemy", d: "40 hrs" }, { n: "TypeScript Fundamentals", p: "Coursera", d: "10 hrs" }, { n: "Tailwind CSS Masterclass", p: "YouTube", d: "5 hrs" }] },
    "Backend Developer":  { have: ["Python", "SQL", "REST APIs"], missing: ["Docker", "Redis", "Microservices"], courses: [{ n: "Docker & Kubernetes", p: "Udemy", d: "20 hrs" }, { n: "Redis for Developers", p: "Redis Univ.", d: "6 hrs" }, { n: "Microservices Design", p: "Coursera", d: "15 hrs" }] },
    "ML Engineer":        { have: ["Python", "NumPy", "Pandas"], missing: ["TensorFlow", "MLOps", "AWS SageMaker"], courses: [{ n: "Deep Learning Specialization", p: "Coursera", d: "30 hrs" }, { n: "MLOps Fundamentals", p: "Google", d: "12 hrs" }, { n: "AWS ML Specialty", p: "AWS Training", d: "25 hrs" }] },
    "Full Stack":         { have: ["HTML", "CSS", "JavaScript", "Python"], missing: ["React", "Node.js", "PostgreSQL", "Docker"], courses: [{ n: "Full Stack Open", p: "Helsinki Uni.", d: "30 hrs" }, { n: "Node.js – Advanced", p: "Udemy", d: "18 hrs" }, { n: "Docker for Developers", p: "Udemy", d: "10 hrs" }] },
  };
  const d = data[role] || data["Data Analyst"];

  return (
    <div style={{ maxWidth: 760 }}>
      {/* Role select */}
      <div style={{ ...css.card, marginBottom: 20 }}>
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 14 }}>Select Target Role</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
          {roles.map(r => (
            <button key={r} onClick={() => { setRole(r); setAnalyzed(false); }}
              style={{
                padding: "8px 16px", borderRadius: 20, fontSize: 13, fontWeight: 500,
                border: `1px solid ${role === r ? T.accent : T.border2}`,
                background: role === r ? T.accentBg : "transparent",
                color: role === r ? T.accent : T.muted2,
                transition: "all 0.15s",
              }}>
              {r}
            </button>
          ))}
        </div>
        <button style={css.btnPrimary} onClick={() => setAnalyzed(true)}>Analyze Skill Gap</button>
      </div>

      {analyzed && (
        <div className="fade-in">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            <div style={css.card}>
              <div style={{ ...css.tag("green"), display: "inline-block", marginBottom: 14 }}>✓ Skills You Have</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {d.have.map(s => (
                  <div key={s} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                    <div style={{ width: 18, height: 18, borderRadius: "50%", background: T.greenBg, color: T.green, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, flexShrink: 0 }}>✓</div>
                    <span style={{ color: T.muted2 }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={css.card}>
              <div style={{ ...css.tag("amber"), display: "inline-block", marginBottom: 14 }}>⚠ Skills You Need</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {d.missing.map(s => (
                  <div key={s} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                    <div style={{ width: 18, height: 18, borderRadius: "50%", background: T.amberBg, color: T.amber, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, flexShrink: 0 }}>!</div>
                    <span style={{ color: T.muted2 }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={css.card}>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 18 }}>📚 Recommended Learning Path</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {d.courses.map((c, i) => (
                <div key={c.n} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 10, border: `1px solid ${T.border}`, background: T.surface2 }}>
                  <div style={{ width: 30, height: 30, borderRadius: "50%", background: T.accentBg, color: T.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{c.n}</div>
                    <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{c.p} · {c.d}</div>
                  </div>
                  <button style={{ ...css.btnGhost, padding: "6px 14px", fontSize: 12 }}>Start →</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// JOB MATCH
// ════════════════════════════════════════════════════════════
function JobMatch() {
  const [jd, setJd] = useState("");
  const [matched, setMatched] = useState(false);
  const matchPct = 82;
  const matchSkills = ["Python", "SQL", "Machine Learning", "Data Analysis", "Git"];
  const missingSkills = ["TensorFlow", "AWS", "Spark"];

  if (!matched) return (
    <div style={{ maxWidth: 700 }}>
      <div style={css.card}>
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Paste Job Description</div>
        <div style={{ fontSize: 13, color: T.muted, marginBottom: 18 }}>Copy the full JD from LinkedIn or any job portal</div>
        <textarea rows={12} placeholder="We are looking for a Data Analyst with experience in Python, SQL, Tableau, Power BI..."
          value={jd} onChange={e => setJd(e.target.value)}
          style={{ ...css.input, resize: "vertical", marginBottom: 18 }}
          onFocus={e => e.target.style.borderColor = T.accent}
          onBlur={e => e.target.style.borderColor = T.border2} />
        <button style={css.btnPrimary} onClick={() => setMatched(true)}>Calculate Match %</button>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 760 }} className="fade-in">
      {/* Score */}
      <div style={{ background: `linear-gradient(135deg, #1a1730, #0d1f15)`, border: `1px solid ${T.accent}33`, borderRadius: 16, padding: "28px 32px", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 20 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: T.accent, textTransform: "uppercase", marginBottom: 6 }}>Job Match Score</div>
            <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 72, fontStyle: "italic", color: T.green, lineHeight: 1 }}>{matchPct}%</div>
          </div>
          <div style={{ flex: 1, paddingBottom: 12 }}>
            <div style={{ fontSize: 13, color: T.muted2, marginBottom: 12 }}>Strong match — you qualify for this role</div>
            <div style={{ height: 8, background: T.surface2, borderRadius: 4, overflow: "hidden" }}>
              <div style={{ width: `${matchPct}%`, height: "100%", background: T.green, borderRadius: 4 }} />
            </div>
            <div style={{ fontSize: 12, color: T.muted, marginTop: 6 }}>{matchSkills.length} of {matchSkills.length + missingSkills.length} required skills matched</div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div style={css.card}>
          <div style={{ ...css.tag("green"), display: "inline-block", marginBottom: 14 }}>✓ Matching Skills</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {matchSkills.map(s => (
              <span key={s} style={{ background: T.greenBg, color: T.green, padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 500 }}>{s}</span>
            ))}
          </div>
        </div>
        <div style={css.card}>
          <div style={{ ...css.tag("amber"), display: "inline-block", marginBottom: 14 }}>⚠ Missing Skills</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {missingSkills.map(s => (
              <span key={s} style={{ background: T.amberBg, color: T.amber, padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 500 }}>{s}</span>
            ))}
          </div>
        </div>
      </div>
      <button style={css.btnGhost} onClick={() => setMatched(false)}>← Try another job description</button>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// LINKEDIN OPTIMIZER
// ════════════════════════════════════════════════════════════
function LinkedIn() {
  const [text, setText] = useState("");
  const [done, setDone] = useState(false);
  const suggestions = [
    { field: "Headline",       before: "BTech Student", after: "Aspiring Data Analyst | Python · SQL · ML Enthusiast", type: "rewrite" },
    { field: "About Section",  before: "Missing / too short", after: "Add a 3-sentence summary: who you are, what you do, what you're seeking", type: "add" },
    { field: "Skills Section", before: "4 skills listed", after: "Add at least 10 relevant skills to improve search visibility", type: "improve" },
    { field: "Profile Photo",  before: "No photo detected", after: "A professional headshot increases profile views by 14×", type: "add" },
  ];

  if (!done) return (
    <div style={{ maxWidth: 700 }}>
      <div style={css.card}>
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Paste Your LinkedIn Profile Data</div>
        <div style={{ fontSize: 13, color: T.muted, marginBottom: 18 }}>Copy your headline, about section, and experience from LinkedIn</div>
        <textarea rows={10} placeholder="Headline: BTech Student&#10;About: I am a final year student...&#10;Skills: Python, SQL..."
          value={text} onChange={e => setText(e.target.value)}
          style={{ ...css.input, resize: "vertical", marginBottom: 18 }}
          onFocus={e => e.target.style.borderColor = T.accent}
          onBlur={e => e.target.style.borderColor = T.border2} />
        <button style={css.btnPrimary} onClick={() => setDone(true)}>Optimize Profile</button>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 760 }} className="fade-in">
      <div style={{ ...css.card, marginBottom: 20, background: `linear-gradient(135deg, ${T.accentBg}, ${T.surface})`, border: `1px solid ${T.accent}33` }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: T.accent, textTransform: "uppercase", marginBottom: 6 }}>Profile Optimization Score</div>
        <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 48, fontStyle: "italic", color: T.text }}>64<span style={{ fontSize: 20, color: T.muted }}>/100</span></div>
        <div style={{ fontSize: 13, color: T.muted, marginTop: 4 }}>Apply all suggestions to reach 92+</div>
      </div>
      <div style={css.card}>
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 18 }}>Suggestions</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {suggestions.map(s => (
            <div key={s.field} style={{ padding: "14px 16px", borderRadius: 10, background: T.surface2, border: `1px solid ${T.border}` }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{s.field}</div>
                <span style={css.tag(s.type === "rewrite" ? "accent" : s.type === "add" ? "green" : "amber")}>{s.type}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={{ padding: "10px 12px", borderRadius: 8, background: T.redBg, border: `1px solid ${T.red}22` }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: T.red, marginBottom: 4, textTransform: "uppercase" }}>Before</div>
                  <div style={{ fontSize: 12, color: T.muted2 }}>{s.before}</div>
                </div>
                <div style={{ padding: "10px 12px", borderRadius: 8, background: T.greenBg, border: `1px solid ${T.green}22` }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: T.green, marginBottom: 4, textTransform: "uppercase" }}>After</div>
                  <div style={{ fontSize: 12, color: T.muted2 }}>{s.after}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// MOCK INTERVIEW
// ════════════════════════════════════════════════════════════
function Interview() {
  const [role, setRole] = useState(null);
  const [qIdx, setQIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [done, setDone] = useState(false);

  const roles = [
    { id: "Software Engineer",    icon: "💻", color: "accent" },
    { id: "Data Analyst",         icon: "◎",  color: "green"  },
    { id: "Frontend Developer",   icon: "◧",  color: "amber"  },
    { id: "HR Round",             icon: "◐",  color: "accent" },
  ];
  const qs = {
    "Software Engineer":  ["Tell me about yourself and your technical background.", "Describe a challenging project and how you solved a key problem.", "What is the difference between a stack and a queue?"],
    "Data Analyst":       ["Tell me about yourself.", "How would you handle missing data in a large dataset?", "Explain supervised vs unsupervised learning."],
    "Frontend Developer": ["Tell me about yourself.", "What is the virtual DOM in React and why does it matter?", "How do you optimize a slow-loading web page?"],
    "HR Round":           ["Tell me about yourself.", "Where do you see yourself in 5 years?", "What is your greatest strength and weakness?"],
  };

  const getFeedback = () => {
    const words = answer.trim().split(" ").length;
    setFeedback({
      score: words > 30 ? 85 : words > 15 ? 65 : 40,
      pts: [
        words > 30 ? { t: "Good length and detail", pass: true } : { t: "Answer is too brief — expand with examples", pass: false },
        { t: "Relevant to the question asked", pass: true },
        { t: "Try to include specific metrics or outcomes", pass: false },
      ],
    });
  };

  const next = () => {
    if (qIdx + 1 >= qs[role].length) { setDone(true); return; }
    setQIdx(i => i + 1); setAnswer(""); setFeedback(null);
  };

  if (!role) return (
    <div style={{ maxWidth: 680 }}>
      <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 22, fontStyle: "italic", marginBottom: 4 }}>Mock Interview</div>
      <div style={{ fontSize: 13, color: T.muted, marginBottom: 24 }}>Choose an interview type to begin your practice session</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
        {roles.map(r => (
          <div key={r.id} onClick={() => setRole(r.id)}
            style={{ ...css.card, cursor: "pointer", textAlign: "center", padding: 28, transition: "border-color 0.2s, background 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = T.accent; e.currentTarget.style.background = T.surface2; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.background = T.surface; }}>
            <div style={{ fontSize: 36, marginBottom: 14 }}>{r.icon}</div>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{r.id}</div>
            <div style={{ fontSize: 12, color: T.muted }}>{qs[r.id].length} questions</div>
          </div>
        ))}
      </div>
    </div>
  );

  if (done) return (
    <div style={{ ...css.card, maxWidth: 560, textAlign: "center", padding: 56 }} className="fade-in">
      <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
      <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 24, fontStyle: "italic", marginBottom: 8 }}>Interview Complete!</div>
      <div style={{ fontSize: 13, color: T.muted, marginBottom: 28 }}>You answered all {qs[role].length} questions for the {role} round.</div>
      <div style={{ background: T.accentBg, border: `1px solid ${T.accent}33`, borderRadius: 10, padding: "16px 20px", marginBottom: 28, textAlign: "left" }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: T.accent, marginBottom: 4 }}>Session Summary</div>
        <div style={{ fontSize: 13, color: T.muted2 }}>Role: {role} · Questions: {qs[role].length} · Avg Score: 72/100</div>
      </div>
      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <button style={css.btnPrimary} onClick={() => { setRole(null); setQIdx(0); setAnswer(""); setFeedback(null); setDone(false); }}>Try Another Role</button>
        <button style={css.btnGhost} onClick={() => { setQIdx(0); setAnswer(""); setFeedback(null); setDone(false); }}>Retry</button>
      </div>
    </div>
  );

  const questions = qs[role];
  return (
    <div style={{ maxWidth: 700 }} className="fade-in">
      {/* Progress */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <div style={{ flex: 1, height: 4, background: T.surface2, borderRadius: 2, overflow: "hidden" }}>
          <div style={{ width: `${((qIdx + 1) / questions.length) * 100}%`, height: "100%", background: T.accent, borderRadius: 2, transition: "width 0.4s ease" }} />
        </div>
        <div style={{ fontSize: 12, color: T.muted, flexShrink: 0 }}>Q {qIdx + 1} / {questions.length}</div>
      </div>

      {/* Question */}
      <div style={{ background: T.accentBg, border: `1px solid ${T.accent}33`, borderRadius: 14, padding: "24px 28px", marginBottom: 22 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: T.accent, textTransform: "uppercase", marginBottom: 10 }}>Question {qIdx + 1}</div>
        <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 20, fontStyle: "italic", color: T.text, lineHeight: 1.5 }}>{questions[qIdx]}</div>
      </div>

      {/* Answer */}
      <div style={{ marginBottom: 18 }}>
        <label style={css.label}>Your Answer</label>
        <textarea rows={6} placeholder="Type your answer here. Speak naturally as if you're in a real interview..."
          value={answer} onChange={e => setAnswer(e.target.value)}
          style={{ ...css.input, resize: "vertical" }}
          onFocus={e => e.target.style.borderColor = T.accent}
          onBlur={e => e.target.style.borderColor = T.border2} />
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 22 }}>
        <button style={{ ...css.btnPrimary, opacity: !answer.trim() ? 0.5 : 1 }} onClick={getFeedback} disabled={!answer.trim()}>
          Get AI Feedback
        </button>
        <button style={css.btnGhost} onClick={next}>{qIdx + 1 >= questions.length ? "Finish" : "Skip →"}</button>
      </div>

      {feedback && (
        <div style={{ ...css.card }} className="fade-in">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>AI Feedback</div>
            <div style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontSize: 28, color: feedback.score >= 70 ? T.green : T.amber }}>{feedback.score}<span style={{ fontSize: 14, color: T.muted }}>/100</span></div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
            {feedback.pts.map((p, i) => (
              <div key={i} style={{ padding: "10px 14px", borderRadius: 8, background: p.pass ? T.greenBg : T.amberBg, border: `1px solid ${p.pass ? T.green + "33" : T.amber + "33"}`, fontSize: 13, color: p.pass ? T.green : T.amber }}>
                {p.pass ? "✓" : "⚠"} {p.t}
              </div>
            ))}
          </div>
          <button style={css.btnPrimary} onClick={next}>
            {qIdx + 1 >= questions.length ? "Finish Interview 🎉" : "Next Question →"}
          </button>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// ROOT APP
// ════════════════════════════════════════════════════════════
const SCREENS = {
  dashboard: { title: "Dashboard",          comp: Dashboard    },
  resume:    { title: "Resume Builder",     comp: ResumeBuilder },
  score:     { title: "Score Analyzer",     comp: ScoreAnalyzer },
  skillgap:  { title: "Skill Gap Detector", comp: SkillGap      },
  jobmatch:  { title: "Job Match",          comp: JobMatch      },
  linkedin:  { title: "LinkedIn Optimizer", comp: LinkedIn      },
  interview: { title: "Mock Interview",     comp: Interview     },
};

export default function App() {
  const [authed, setAuthed] = useState(false);
  const [user, setUser]     = useState("");
  const [screen, setScreen] = useState("dashboard");

  const login = (name) => { setUser(name); setAuthed(true); };
  const logout = () => { setAuthed(false); setUser(""); setScreen("dashboard"); };

  const { title, comp: Comp } = SCREENS[screen];

  return (
    <>
      <FontLoader />
      {!authed ? (
        <AuthPage onAuth={login} />
      ) : (
        <Shell active={screen} onNav={setScreen} user={user} onLogout={logout} title={title}>
          <Comp onNavigate={setScreen} user={user} />
        </Shell>
      )}
    </>
  );
}