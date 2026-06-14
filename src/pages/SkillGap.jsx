import React, { useState, useCallback } from 'react';
import { T, css } from '../constants/theme';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

// ---------- Job role skill database ----------

const ROLE_SKILLS = {
  'Frontend Developer': [
    { name: 'HTML', keywords: ['html', 'html5'] },
    { name: 'CSS', keywords: ['css', 'css3', 'sass', 'scss', 'tailwind'] },
    { name: 'JavaScript', keywords: ['javascript', 'js', 'es6'] },
    { name: 'React', keywords: ['react', 'reactjs', 'react.js'] },
    { name: 'TypeScript', keywords: ['typescript', 'ts'] },
    { name: 'Responsive Design', keywords: ['responsive', 'mobile-first', 'media queries'] },
    { name: 'Git', keywords: ['git', 'github', 'gitlab', 'version control'] },
    { name: 'REST APIs', keywords: ['rest', 'api', 'restful'] },
    { name: 'Testing', keywords: ['jest', 'testing', 'unit test', 'cypress'] },
    { name: 'Webpack/Build Tools', keywords: ['webpack', 'vite', 'babel', 'bundler'] },
  ],
  'Backend Developer': [
    { name: 'Node.js', keywords: ['node', 'node.js', 'express'] },
    { name: 'Python', keywords: ['python', 'django', 'flask'] },
    { name: 'Java', keywords: ['java', 'spring', 'spring boot'] },
    { name: 'SQL/Databases', keywords: ['sql', 'mysql', 'postgresql', 'database'] },
    { name: 'NoSQL', keywords: ['mongodb', 'nosql', 'redis', 'dynamodb'] },
    { name: 'REST/GraphQL APIs', keywords: ['rest', 'api', 'graphql'] },
    { name: 'Authentication', keywords: ['authentication', 'oauth', 'jwt', 'security'] },
    { name: 'Cloud (AWS/Azure/GCP)', keywords: ['aws', 'azure', 'gcp', 'cloud'] },
    { name: 'Docker', keywords: ['docker', 'container', 'kubernetes'] },
    { name: 'Git', keywords: ['git', 'github', 'version control'] },
  ],
  'Full Stack Developer': [
    { name: 'HTML/CSS', keywords: ['html', 'css'] },
    { name: 'JavaScript', keywords: ['javascript', 'js'] },
    { name: 'React/Frontend Framework', keywords: ['react', 'angular', 'vue'] },
    { name: 'Node.js/Backend', keywords: ['node', 'express', 'django', 'flask'] },
    { name: 'Databases (SQL/NoSQL)', keywords: ['sql', 'mongodb', 'database', 'postgresql'] },
    { name: 'REST APIs', keywords: ['rest', 'api'] },
    { name: 'Git', keywords: ['git', 'github', 'version control'] },
    { name: 'Cloud Deployment', keywords: ['aws', 'azure', 'deployment', 'heroku', 'vercel'] },
    { name: 'Docker', keywords: ['docker', 'container'] },
    { name: 'Testing', keywords: ['testing', 'jest', 'unit test'] },
  ],
  'Data Analyst': [
    { name: 'Excel', keywords: ['excel', 'spreadsheet'] },
    { name: 'SQL', keywords: ['sql', 'mysql', 'postgresql', 'queries'] },
    { name: 'Python/R', keywords: ['python', 'pandas', 'numpy', 'r programming'] },
    { name: 'Data Visualization', keywords: ['tableau', 'power bi', 'visualization', 'dashboards'] },
    { name: 'Statistics', keywords: ['statistics', 'statistical analysis', 'regression'] },
    { name: 'Data Cleaning', keywords: ['data cleaning', 'etl', 'data wrangling'] },
    { name: 'Reporting', keywords: ['reporting', 'kpi', 'metrics'] },
    { name: 'A/B Testing', keywords: ['a/b testing', 'experimentation'] },
  ],
  'Data Scientist': [
    { name: 'Python', keywords: ['python', 'pandas', 'numpy'] },
    { name: 'Machine Learning', keywords: ['machine learning', 'ml', 'scikit-learn', 'sklearn'] },
    { name: 'Deep Learning', keywords: ['deep learning', 'tensorflow', 'pytorch', 'neural network'] },
    { name: 'SQL', keywords: ['sql', 'database', 'queries'] },
    { name: 'Statistics', keywords: ['statistics', 'probability', 'hypothesis testing'] },
    { name: 'Data Visualization', keywords: ['matplotlib', 'seaborn', 'tableau', 'visualization'] },
    { name: 'Big Data Tools', keywords: ['spark', 'hadoop', 'big data'] },
    { name: 'Model Deployment', keywords: ['mlops', 'deployment', 'docker', 'flask api'] },
    { name: 'NLP', keywords: ['nlp', 'natural language processing', 'text mining'] },
  ],
  'DevOps Engineer': [
    { name: 'Linux', keywords: ['linux', 'unix', 'shell scripting', 'bash'] },
    { name: 'Docker', keywords: ['docker', 'containerization'] },
    { name: 'Kubernetes', keywords: ['kubernetes', 'k8s', 'orchestration'] },
    { name: 'CI/CD', keywords: ['ci/cd', 'jenkins', 'github actions', 'pipeline'] },
    { name: 'Cloud Platforms', keywords: ['aws', 'azure', 'gcp', 'cloud'] },
    { name: 'Infrastructure as Code', keywords: ['terraform', 'ansible', 'cloudformation', 'iac'] },
    { name: 'Monitoring', keywords: ['monitoring', 'grafana', 'prometheus', 'logging'] },
    { name: 'Networking', keywords: ['networking', 'dns', 'vpn', 'load balancer'] },
    { name: 'Git', keywords: ['git', 'version control'] },
  ],
  'UI/UX Designer': [
    { name: 'Figma', keywords: ['figma'] },
    { name: 'Adobe XD/Sketch', keywords: ['adobe xd', 'sketch', 'photoshop', 'illustrator'] },
    { name: 'Wireframing', keywords: ['wireframe', 'wireframing', 'prototyping'] },
    { name: 'User Research', keywords: ['user research', 'usability testing', 'interviews'] },
    { name: 'Design Systems', keywords: ['design system', 'component library', 'style guide'] },
    { name: 'Information Architecture', keywords: ['information architecture', 'user flows', 'sitemap'] },
    { name: 'Accessibility', keywords: ['accessibility', 'wcag', 'a11y'] },
    { name: 'HTML/CSS Basics', keywords: ['html', 'css'] },
  ],
  'Product Manager': [
    { name: 'Product Roadmapping', keywords: ['roadmap', 'product strategy', 'planning'] },
    { name: 'Agile/Scrum', keywords: ['agile', 'scrum', 'sprint', 'kanban'] },
    { name: 'Stakeholder Management', keywords: ['stakeholder', 'cross-functional', 'collaboration'] },
    { name: 'Data Analysis', keywords: ['data analysis', 'metrics', 'kpi', 'analytics'] },
    { name: 'User Research', keywords: ['user research', 'customer feedback', 'usability'] },
    { name: 'Wireframing/Prototyping', keywords: ['wireframe', 'prototype', 'figma'] },
    { name: 'Market Analysis', keywords: ['market research', 'competitive analysis'] },
    { name: 'Product Tools', keywords: ['jira', 'confluence', 'productboard', 'asana'] },
  ],
  'Digital Marketing': [
    { name: 'SEO', keywords: ['seo', 'search engine optimization', 'keyword research'] },
    { name: 'Social Media Marketing', keywords: ['social media', 'instagram', 'facebook ads', 'linkedin'] },
    { name: 'Content Marketing', keywords: ['content marketing', 'copywriting', 'blogging'] },
    { name: 'Email Marketing', keywords: ['email marketing', 'mailchimp', 'campaigns'] },
    { name: 'Google Ads/PPC', keywords: ['google ads', 'ppc', 'paid advertising', 'adwords'] },
    { name: 'Analytics', keywords: ['google analytics', 'analytics', 'data-driven'] },
    { name: 'Marketing Automation', keywords: ['automation', 'hubspot', 'marketo'] },
    { name: 'Branding', keywords: ['branding', 'brand strategy'] },
  ],
};

const LEARNING_LINKS = {
  default: [
    { label: 'Coursera', url: 'https://www.coursera.org/search?query=' },
    { label: 'freeCodeCamp', url: 'https://www.freecodecamp.org/news/search/?query=' },
    { label: 'YouTube', url: 'https://www.youtube.com/results?search_query=' },
  ],
};

function getLearningLinks(skillName) {
  const query = encodeURIComponent(skillName);
  return LEARNING_LINKS.default.map((l) => ({ label: l.label, url: l.url + query }));
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

// ---------- Skill gap analysis ----------

function analyzeSkillGap(text, role) {
  const lower = text.toLowerCase();
  const skills = ROLE_SKILLS[role] || [];

  const matched = [];
  const missing = [];

  skills.forEach((skill) => {
    const found = skill.keywords.some((k) => lower.includes(k.toLowerCase()));
    if (found) {
      matched.push(skill);
    } else {
      missing.push(skill);
    }
  });

  const matchPercent = skills.length > 0
    ? Math.round((matched.length / skills.length) * 100)
    : 0;

  return { matched, missing, matchPercent, total: skills.length };
}

// ---------- Helper: match color ----------

function getMatchColor(percent) {
  if (percent >= 75) return '#2563eb';
  if (percent >= 50) return '#3b82f6';
  return '#93c5fd';
}

// ---------- Component ----------

export default function SkillGap() {
  const [status, setStatus] = useState('idle'); // idle | loading | done | error
  const [fileName, setFileName] = useState(null);
  const [resumeText, setResumeText] = useState(null);
  const [role, setRole] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(async (file) => {
    setStatus('loading');
    setError(null);
    setResult(null);
    setFileName(file.name);
    try {
      const text = await extractText(file);
      if (!text || text.trim().length < 20) {
        throw new Error('Could not extract readable text from this file. Try a different file.');
      }
      setResumeText(text);
      setStatus('ready');
    } catch (err) {
      setError(err.message || 'Something went wrong while reading your resume.');
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

  const handleAnalyze = () => {
    if (!resumeText || !role) return;
    const analysis = analyzeSkillGap(resumeText, role);
    setResult(analysis);
    setStatus('done');
  };

  const matchColor = result ? getMatchColor(result.matchPercent) : '#2563eb';

  return (
    <div style={css.card}>
      <h2 style={{ fontSize: 24, fontWeight: 600, color: T.text, marginBottom: 16 }}>
        Skill Gap Analysis
      </h2>
      <p style={{ color: T.textLight, marginBottom: 20 }}>
        Upload your resume and select a target role to identify missing skills and get learning recommendations.
      </p>

      {/* Upload area */}
      <div
        onDrop={onDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onClick={() => document.getElementById('skillgap-upload-input').click()}
        style={{
          border: `2px dashed ${isDragging ? '#2563eb' : '#93c5fd'}`,
          borderRadius: 12,
          padding: 28,
          textAlign: 'center',
          marginBottom: 16,
          cursor: 'pointer',
          backgroundColor: isDragging ? '#eff6ff' : '#f8fafc',
          transition: 'all 0.15s ease',
        }}
      >
        <input
          id="skillgap-upload-input"
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

      {/* Role selector */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: T.text, marginBottom: 6 }}>
          Target Job Role
        </label>
        <select
          value={role}
          onChange={(e) => { setRole(e.target.value); setResult(null); setStatus(resumeText ? 'ready' : 'idle'); }}
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: 8,
            border: '1px solid #bfdbfe',
            backgroundColor: '#ffffff',
            color: T.text,
            fontSize: 14,
            cursor: 'pointer',
          }}
        >
          <option value="">Select a role...</option>
          {Object.keys(ROLE_SKILLS).map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      {/* Analyze button */}
      <button
        onClick={handleAnalyze}
        disabled={!resumeText || !role}
        style={{
          width: '100%',
          padding: '12px 16px',
          borderRadius: 8,
          border: 'none',
          backgroundColor: (!resumeText || !role) ? '#cbd5e1' : '#2563eb',
          color: '#ffffff',
          fontSize: 15,
          fontWeight: 600,
          cursor: (!resumeText || !role) ? 'not-allowed' : 'pointer',
          marginBottom: 20,
          transition: 'background-color 0.15s ease',
        }}
      >
        Analyze Skill Gap
      </button>

      {/* Loading state */}
      {status === 'loading' && (
        <p style={{ color: '#2563eb', fontWeight: 500, textAlign: 'center' }}>Reading your resume...</p>
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
          {/* Match summary */}
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
              background: `conic-gradient(${matchColor} ${result.matchPercent * 3.6}deg, #e2e8f0 0deg)`,
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
                <span style={{ fontSize: 20, fontWeight: 700, color: matchColor }}>
                  {result.matchPercent}%
                </span>
                <span style={{ fontSize: 10, color: '#94a3b8' }}>match</span>
              </div>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#1e3a8a' }}>
                {role} Skill Match
              </p>
              <p style={{ margin: '4px 0 0', fontSize: 14, color: '#64748b' }}>
                {result.matched.length} of {result.total} key skills found in <strong>{fileName}</strong>
              </p>
            </div>
          </div>

          {/* Matched skills */}
          {result.matched.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 15, fontWeight: 600, color: T.text, marginBottom: 10 }}>
                ✅ Skills You Have
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {result.matched.map((skill) => (
                  <span
                    key={skill.name}
                    style={{
                      backgroundColor: '#dbeafe',
                      color: '#1e40af',
                      borderRadius: 20,
                      padding: '6px 14px',
                      fontSize: 13,
                      fontWeight: 500,
                    }}
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Missing skills */}
          {result.missing.length > 0 ? (
            <div>
              <p style={{ fontSize: 15, fontWeight: 600, color: T.text, marginBottom: 10 }}>
                📌 Skills to Develop
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {result.missing.map((skill) => (
                  <div
                    key={skill.name}
                    style={{
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: 8,
                      padding: '12px 16px',
                    }}
                  >
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: T.text }}>
                      {skill.name}
                    </p>
                    <div style={{ display: 'flex', gap: 12, marginTop: 6, flexWrap: 'wrap' }}>
                      {getLearningLinks(skill.name).map((link) => {
                        return (
                          <a
                            key={link.label}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: 13, color: '#2563eb', textDecoration: 'none' }}
                          >
                            Learn on {link.label} {'\u2192'}
                          </a>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{
              backgroundColor: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: 8,
              padding: '14px 16px',
              color: '#1e40af',
              fontSize: 14,
              textAlign: 'center',
            }}>
              {'\uD83C\uDF89'} Great news {'\u2014'} your resume covers all the key skills for this role!
            </div>
          )}
        </div>
      )}
    </div>
  );
}