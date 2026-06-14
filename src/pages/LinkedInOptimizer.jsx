import { useState, useEffect, useRef } from "react";

function getScoreColor(score) {
  if (score >= 80) return "#1D9E75";
  if (score >= 55) return "#378ADD";
  return "#D85A30";
}

function ScoreRing({ score }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const size = 80;
    canvas.width = size;
    canvas.height = size;
    const cx = size / 2, cy = size / 2, r = 30, lw = 7;
    ctx.clearRect(0, 0, size, size);
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = lw;
    ctx.stroke();
    const start = -Math.PI / 2;
    const end = start + (score / 100) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(cx, cy, r, start, end);
    ctx.strokeStyle = getScoreColor(score);
    ctx.lineWidth = lw;
    ctx.lineCap = "round";
    ctx.stroke();
  }, [score]);

  return (
    <div style={{ position: "relative", width: 80, height: 80, flexShrink: 0 }}>
      <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: 0 }} />
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)", textAlign: "center", lineHeight: 1,
      }}>
        <span style={{ display: "block", fontSize: 20, fontWeight: 600, color: getScoreColor(score) }}>
          {score}
        </span>
        <span style={{ fontSize: 10, color: "#94a3b8" }}>/ 100</span>
      </div>
    </div>
  );
}

const ISSUE_STYLES = {
  error:   { bg: "#fef2f2", border: "#fecaca", labelColor: "#dc2626", label: "Missing" },
  warning: { bg: "#fff7ed", border: "#fed7aa", labelColor: "#c2410c", label: "Improve" },
  tip:     { bg: "#eff6ff", border: "#bfdbfe", labelColor: "#1d4ed8", label: "Tip"     },
};

function IssueCard({ issue }) {
  const s = ISSUE_STYLES[issue.type] || ISSUE_STYLES.tip;
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: 10,
      padding: "10px 14px", borderRadius: 8,
      background: s.bg, border: `1px solid ${s.border}`, marginBottom: 8,
    }}>
      <span style={{
        flexShrink: 0, fontSize: 11, fontWeight: 700, color: s.labelColor,
        background: "#fff", border: `1px solid ${s.border}`,
        borderRadius: 6, padding: "2px 8px", whiteSpace: "nowrap", marginTop: 1,
      }}>
        {issue.section ? `${issue.section} · ` : ""}{s.label}
      </span>
      <span style={{ fontSize: 14, color: "#475569", lineHeight: 1.5 }}>{issue.text}</span>
    </div>
  );
}

function SectionBar({ label, score }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
      <span style={{ width: 90, fontSize: 13, fontWeight: 500, color: "#334155" }}>{label}</span>
      <div style={{ flex: 1, height: 7, background: "#e2e8f0", borderRadius: 4, overflow: "hidden" }}>
        <div style={{
          width: `${score}%`, height: "100%",
          background: getScoreColor(score), borderRadius: 4,
          transition: "width 0.4s ease",
        }} />
      </div>
      <span style={{ width: 36, fontSize: 13, color: "#64748b", textAlign: "right" }}>{score}%</span>
    </div>
  );
}

const LOADING_MESSAGES = [
  "Reading your LinkedIn profile…",
  "Analyzing headline and summary…",
  "Checking experience and skills…",
  "Calculating optimization score…",
  "Preparing your recommendations…",
];

const SYSTEM_PROMPT = `You are a professional LinkedIn profile analyzer.

The user provides a LinkedIn profile URL. Since you cannot scrape LinkedIn directly, analyze the URL slug for clues and provide expert best-practice guidance.

You MUST return ONLY valid JSON — no markdown fences, no backticks, no explanation, just raw JSON.

Return exactly this structure:
{
  "score": <integer 0-100>,
  "sections": {
    "Headline": <integer 0-100>,
    "About": <integer 0-100>,
    "Experience": <integer 0-100>,
    "Skills": <integer 0-100>
  },
  "summary": "<2-3 sentence overview of what makes a strong LinkedIn profile>",
  "issues": [
    { "type": "tip", "section": "Headline", "text": "<actionable advice>" },
    { "type": "warning", "section": "About", "text": "<actionable advice>" },
    { "type": "tip", "section": "Experience", "text": "<actionable advice>" },
    { "type": "tip", "section": "Skills", "text": "<actionable advice>" }
  ]
}

Rules:
- 5-7 issues max
- Default score is 65
- Make advice specific and actionable
- Return ONLY the JSON object, nothing else`;

// Fallback data when proxy is not available
const FALLBACK_RESULT = {
  score: 65,
  sections: {
    Headline: 68,
    About: 62,
    Experience: 70,
    Skills: 60
  },
  summary: "Your LinkedIn profile has good foundation but there's room for improvement. Focus on optimizing your headline with keywords, writing a compelling About section, and expanding your skills list to improve visibility in recruiter searches.",
  issues: [
    { type: "tip", section: "Headline", text: "Add industry keywords and your value proposition to your headline. Instead of just your job title, include what you excel at." },
    { type: "warning", section: "About", text: "Your About section should tell a compelling story. Add specific achievements and career highlights in the first 3 lines." },
    { type: "tip", section: "Experience", text: "Use bullet points with quantifiable achievements (numbers, percentages, results) rather than just listing responsibilities." },
    { type: "tip", section: "Skills", text: "Add 3-5 more relevant skills to reach the 5-skill minimum. Endorsements from colleagues will boost credibility." },
    { type: "warning", section: "General", text: "Add a professional profile photo if you haven't already — profiles with photos get 14x more views." },
    { type: "tip", section: "General", text: "Personalize your LinkedIn URL to remove random numbers — it looks more professional." }
  ]
};

export default function LinkedInOptimizer() {
  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState(LOADING_MESSAGES[0]);
  const [result, setResult] = useState(null);
  const [apiError, setApiError] = useState("");
  const [usingFallback, setUsingFallback] = useState(false);
  const timerRef = useRef(null);

  const validate = (value) =>
    /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9\-_%]+\/?/.test(value.trim());

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
    if (urlError) setUrlError("");
    if (apiError) setApiError("");
  };

  const startLoadingCycle = () => {
    let i = 0;
    setLoadingText(LOADING_MESSAGES[0]);
    timerRef.current = setInterval(() => {
      i = (i + 1) % LOADING_MESSAGES.length;
      setLoadingText(LOADING_MESSAGES[i]);
    }, 2500);
  };

  const stopLoadingCycle = () => clearInterval(timerRef.current);

  const analyze = async () => {
    if (!url.trim()) { setUrlError("Please enter your LinkedIn profile URL."); return; }
    if (!validate(url)) { setUrlError("Enter a valid LinkedIn URL (e.g. https://www.linkedin.com/in/your-name)"); return; }

    setUrlError("");
    setResult(null);
    setApiError("");
    setUsingFallback(false);
    setLoading(true);
    startLoadingCycle();

    try {
      const proxyUrl = process.env.REACT_APP_PROXY_URL || "http://localhost:3001/api/ai";
      
      console.log("Calling proxy at:", proxyUrl);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const res = await fetch(proxyUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: SYSTEM_PROMPT,
          userMessage: `Analyze this LinkedIn profile and return JSON only: ${url}`,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      if (!data.text) {
        throw new Error("No response from AI");
      }

      // Strip any accidental markdown fences
      const clean = data.text.replace(/```json|```/g, "").trim();

      // Extract JSON object if wrapped in extra text
      const jsonMatch = clean.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.warn("No JSON found, using fallback");
        throw new Error("No valid JSON in response");
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      // Validate required fields
      if (!parsed.score || !parsed.sections || !parsed.issues) {
        console.warn("Missing required fields, using fallback");
        throw new Error("Incomplete response structure");
      }
      
      setResult(parsed);
    } catch (err) {
      console.error("Analysis error:", err);
      
      // Check if proxy is running
      if (err.name === "AbortError") {
        setApiError("Request timeout. Please check if proxy.js is running properly.");
      } else if (err.message.includes("Failed to fetch") || err.message.includes("NetworkError")) {
        setApiError("Cannot connect to AI service. Please make sure proxy.js is running: node proxy.js");
      } else {
        setApiError(err.message || "Something went wrong. Using fallback recommendations.");
      }
      
      // Use fallback data when API fails
      console.log("Using fallback data");
      setUsingFallback(true);
      setResult(FALLBACK_RESULT);
    } finally {
      stopLoadingCycle();
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") analyze(); };

  const card = {
    background: "#ffffff", border: "1px solid #e2e8f0",
    borderRadius: 16, padding: "28px 32px",
    maxWidth: 680, margin: "0 auto",
    fontFamily: "Inter, system-ui, sans-serif",
  };

  const inputStyle = {
    flex: 1, height: 42, padding: "0 14px",
    borderRadius: 8, border: `1px solid ${urlError ? "#fca5a5" : "#cbd5e1"}`,
    fontSize: 14, color: "#0f172a", outline: "none", background: "#fff",
  };

  const btnStyle = (disabled) => ({
    height: 42, padding: "0 20px", borderRadius: 8,
    border: "none",
    background: disabled ? "#e2e8f0" : "#2563eb",
    color: disabled ? "#94a3b8" : "#fff",
    fontSize: 14, fontWeight: 600,
    cursor: disabled ? "not-allowed" : "pointer",
    whiteSpace: "nowrap", transition: "background 0.15s",
  });

  return (
    <div style={card}>
      <h2 style={{ fontSize: 22, fontWeight: 600, color: "#0f172a", margin: "0 0 6px" }}>
        LinkedIn Profile Analyzer
      </h2>
      <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 24px" }}>
        Paste your LinkedIn URL — AI will review your profile and give you an optimization score with actionable suggestions.
      </p>

      <div style={{ display: "flex", gap: 10, marginBottom: 6 }}>
        <input
          type="url" value={url}
          onChange={handleUrlChange} onKeyDown={handleKeyDown}
          placeholder="https://www.linkedin.com/in/your-name"
          style={inputStyle} disabled={loading}
        />
        <button onClick={analyze} disabled={loading || !url.trim()} style={btnStyle(loading || !url.trim())}>
          {loading ? "Analyzing…" : "Analyze ✦"}
        </button>
      </div>

      {urlError && <p style={{ fontSize: 13, color: "#dc2626", margin: "0 0 12px" }}>{urlError}</p>}

      <p style={{ fontSize: 12, color: "#94a3b8", margin: "4px 0 24px" }}>
        Powered by AI (free) · LinkedIn doesn't allow automated scraping — paste your sections for a precise score.
      </p>

      {loading && (
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "16px 20px", background: "#f8fafc",
          border: "1px solid #e2e8f0", borderRadius: 10, marginBottom: 20,
        }}>
          <div style={{
            width: 18, height: 18,
            border: "2px solid #e2e8f0", borderTopColor: "#2563eb",
            borderRadius: "50%", animation: "li-spin 0.7s linear infinite", flexShrink: 0,
          }} />
          <style>{`@keyframes li-spin { to { transform: rotate(360deg); } }`}</style>
          <span style={{ fontSize: 14, color: "#64748b" }}>{loadingText}</span>
        </div>
      )}

      {apiError && !usingFallback && (
        <div style={{ marginBottom: 16 }}>
          <IssueCard issue={{ type: "error", section: "Error", text: apiError }} />
          <div style={{
            marginTop: 12, padding: "10px", background: "#fef3c7",
            border: "1px solid #fde68a", borderRadius: 8, fontSize: 13,
            color: "#92400e"
          }}>
            💡 <strong>Quick fix:</strong> Open a new terminal and run <code style={{ background: "#fff", padding: "2px 6px", borderRadius: 4 }}>node proxy.js</code>
          </div>
        </div>
      )}

      {usingFallback && result && !apiError && (
        <div style={{
          marginBottom: 16, padding: "10px 14px", background: "#fef3c7",
          border: "1px solid #fde68a", borderRadius: 8, fontSize: 12,
          color: "#92400e"
        }}>
          ⚡ Using demo recommendations. For personalized AI analysis, make sure proxy.js is running.
        </div>
      )}

      {result && (
        <div>
          <div style={{
            display: "flex", alignItems: "center", gap: 20,
            background: usingFallback ? "#fef3c7" : "#eff6ff",
            border: `1px solid ${usingFallback ? "#fde68a" : "#bfdbfe"}`,
            borderRadius: 12, padding: "20px 24px", marginBottom: 24,
          }}>
            <ScoreRing score={result.score} />
            <div>
              <p style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 600, color: "#1e3a8a" }}>
                Profile Optimization Score
              </p>
              <p style={{ margin: 0, fontSize: 14, color: "#64748b" }}>
                {result.issues?.length ?? 0} suggestion{result.issues?.length !== 1 ? "s" : ""} to boost your visibility
              </p>
            </div>
          </div>

          {result.sections && (
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#334155", margin: "0 0 12px" }}>
                Section Breakdown
              </p>
              {Object.entries(result.sections).map(([label, score]) => (
                <SectionBar key={label} label={label} score={score} />
              ))}
            </div>
          )}

          {result.summary && (
            <p style={{
              fontSize: 14, color: "#475569", lineHeight: 1.6,
              background: "#f8fafc", border: "1px solid #e2e8f0",
              borderRadius: 8, padding: "12px 16px", marginBottom: 20,
            }}>
              {result.summary}
            </p>
          )}

          {result.issues?.length > 0 && (
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#334155", margin: "0 0 10px" }}>
                Suggestions
              </p>
              {result.issues.map((issue, i) => (
                <IssueCard key={i} issue={issue} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}