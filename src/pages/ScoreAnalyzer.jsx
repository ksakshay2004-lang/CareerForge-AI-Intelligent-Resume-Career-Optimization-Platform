import React, { useState, useCallback } from 'react';
import { T, css } from '../constants/theme';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

// ---------- ATS scoring logic ----------

const SECTION_KEYWORDS = {
  summary: ['summary', 'objective', 'profile'],
  experience: ['experience', 'employment', 'work history'],
  education: ['education', 'degree', 'university', 'college'],
  skills: ['skills', 'technologies', 'competencies'],
};

const ACTION_VERBS = [
  'managed', 'led', 'developed', 'created', 'designed', 'implemented',
  'improved', 'increased', 'reduced', 'built', 'launched', 'coordinated',
  'analyzed', 'optimized',
];

function analyzeResume(text) {
  const lower = text.toLowerCase();
  const suggestions = [];
  let score = 100;

  const wordCount = text.trim().split(/\s+/).length;
  if (wordCount < 150) {
    score -= 15;
    suggestions.push('Your resume seems too short. Aim for 400-800 words with detail on your achievements.');
  } else if (wordCount > 1000) {
    score -= 10;
    suggestions.push('Your resume is quite long. Consider trimming it to 1-2 pages.');
  }

  const hasEmail = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(text);
  const hasPhone = /(\+?\d[\d\-\s()]{7,}\d)/.test(text);
  if (!hasEmail) {
    score -= 10;
    suggestions.push('Add a valid email address so recruiters and ATS systems can find your contact info.');
  }
  if (!hasPhone) {
    score -= 5;
    suggestions.push('Add a phone number to your contact details.');
  }

  Object.entries(SECTION_KEYWORDS).forEach(([section, keywords]) => {
    const found = keywords.some((k) => lower.includes(k));
    if (!found) {
      score -= 8;
      suggestions.push(`Add a clear "${section.charAt(0).toUpperCase() + section.slice(1)}" section.`);
    }
  });

  const verbCount = ACTION_VERBS.filter((v) => lower.includes(v)).length;
  if (verbCount < 3) {
    score -= 10;
    suggestions.push('Use more action verbs (e.g. "led", "developed", "improved") to describe your work.');
  }

  const bulletCount = (text.match(/\n\s*[•\-\*]/g) || []).length;
  if (bulletCount < 3) {
    score -= 7;
    suggestions.push('Use bullet points to list responsibilities and achievements - it scans better in ATS systems.');
  }

  if (!/\d/.test(text)) {
    score -= 8;
    suggestions.push('Quantify achievements with numbers, e.g. "increased sales by 20%".');
  }

  const longLines = text.split('\n').filter((l) => l.length > 200).length;
  if (longLines > 0) {
    score -= 5;
    suggestions.push('Break up long paragraphs into shorter bullet points for better ATS readability.');
  }

  score = Math.max(0, Math.min(100, score));
  return { score, suggestions: suggestions.slice(0, 6) };
}

// ---------- Text extraction ----------

async function extractTextFromPDF(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let text = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((item) => item.str).join(' ') + '\n';
  }
  return text;
}

async function extractTextFromDocx(file) {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

async function extractText(file) {
  const name = file.name.toLowerCase();
  if (name.endsWith('.pdf')) return extractTextFromPDF(file);
  if (name.endsWith('.docx')) return extractTextFromDocx(file);
  if (name.endsWith('.doc')) {
    throw new Error('Legacy .doc files are not supported in-browser. Please upload a .docx or .pdf file.');
  }
  if (name.endsWith('.txt')) return file.text();
  throw new Error('Unsupported file type. Please upload a PDF, DOCX, or TXT file.');
}

// ---------- Helper: score color ----------

function getScoreColor(score) {
  if (score >= 80) return '#2563eb'; // strong blue
  if (score >= 60) return '#3b82f6'; // medium blue
  return '#93c5fd'; // light blue (still on theme, indicates room to improve)
}

// ---------- Component ----------

export default function ScoreAnalyzer() {
  const [status, setStatus] = useState('idle'); // idle | loading | done | error
  const [fileName, setFileName] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(async (file) => {
    setStatus('loading');
    setError(null);
    setFileName(file.name);
    try {
      const text = await extractText(file);
      if (!text || text.trim().length < 20) {
        throw new Error('Could not extract readable text from this file. Try a different file.');
      }
      setResult(analyzeResume(text));
      setStatus('done');
    } catch (err) {
      setError(err.message || 'Something went wrong while analyzing your resume.');
      setStatus('error');
    }
  }, []);

  const onInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const scoreColor = result ? getScoreColor(result.score) : '#2563eb';

  return (
    <div style={css.card}>
      <h2 style={{ fontSize: 24, fontWeight: 600, color: T.text, marginBottom: 16 }}>
        Resume Score Analyzer
      </h2>

      {/* Upload area */}
      <div
        onDrop={onDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onClick={() => document.getElementById('resume-upload-input').click()}
        style={{
          border: `2px dashed ${isDragging ? '#2563eb' : '#93c5fd'}`,
          borderRadius: 12,
          padding: 28,
          textAlign: 'center',
          marginBottom: 20,
          cursor: 'pointer',
          backgroundColor: isDragging ? '#eff6ff' : '#f8fafc',
          transition: 'all 0.15s ease',
        }}
      >
        <input
          id="resume-upload-input"
          type="file"
          accept=".pdf,.docx,.txt"
          onChange={onInputChange}
          style={{ display: 'none' }}
        />
        <div style={{ fontSize: 28, marginBottom: 8 }}>📄</div>
        <p style={{ color: '#2563eb', fontWeight: 600, margin: 0, fontSize: 15 }}>
          {fileName ? `Selected: ${fileName}` : 'Click or drag a PDF / DOCX resume here'}
        </p>
        <p style={{ color: '#94a3b8', margin: '4px 0 0', fontSize: 13 }}>
          Supports PDF, DOCX, and TXT files
        </p>
      </div>

      {/* Loading state */}
      {status === 'loading' && (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <p style={{ color: '#2563eb', fontWeight: 500 }}>Analyzing your resume...</p>
          <div style={{
            width: '100%',
            height: 6,
            backgroundColor: '#e2e8f0',
            borderRadius: 4,
            overflow: 'hidden',
            marginTop: 8,
          }}>
            <div style={{
              width: '60%',
              height: '100%',
              backgroundColor: '#2563eb',
              borderRadius: 4,
              animation: 'pulse 1.2s ease-in-out infinite',
            }} />
          </div>
          <style>{`
            @keyframes pulse {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(160%); }
            }
          `}</style>
        </div>
      )}

      {/* Error state */}
      {status === 'error' && (
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: 8,
          padding: '12px 16px',
          color: '#dc2626',
          fontSize: 14,
        }}>
          {error}
        </div>
      )}

      {/* Results */}
      {status === 'done' && result && (
        <div>
          {/* Score card */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: 12,
            padding: '20px 24px',
            marginBottom: 20,
          }}>
            <div style={{
              position: 'relative',
              width: 80,
              height: 80,
              flexShrink: 0,
              borderRadius: '50%',
              background: `conic-gradient(${scoreColor} ${result.score * 3.6}deg, #e2e8f0 0deg)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <div style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
              }}>
                <span style={{ fontSize: 20, fontWeight: 700, color: scoreColor }}>
                  {result.score}
                </span>
                <span style={{ fontSize: 10, color: '#94a3b8' }}>/ 100</span>
              </div>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#1e3a8a' }}>
                ATS Compatibility Score
              </p>
              <p style={{ margin: '4px 0 0', fontSize: 14, color: '#64748b' }}>
                {result.suggestions.length} improvement{result.suggestions.length !== 1 ? 's' : ''} suggested for{' '}
                <strong>{fileName}</strong>
              </p>
            </div>
          </div>

          {/* Suggestions */}
          {result.suggestions.length > 0 && (
            <div>
              <p style={{ fontSize: 15, fontWeight: 600, color: T.text, marginBottom: 10 }}>
                Suggested Improvements
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {result.suggestions.map((s, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 10,
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: 8,
                      padding: '10px 14px',
                    }}
                  >
                    <span style={{
                      flexShrink: 0,
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      backgroundColor: '#dbeafe',
                      color: '#2563eb',
                      fontSize: 12,
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: 1,
                    }}>
                      {i + 1}
                    </span>
                    <span style={{ fontSize: 14, color: '#475569', lineHeight: 1.5 }}>
                      {s}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}