import React from 'react';
import { T, css } from '../constants/theme';

export default function Dashboard({ onNavigate, user }) {
  const actions = [
    {
      title: "Resume Builder",
      description: "Build a polished, ATS-friendly resume from scratch using guided templates.",
      icon: "📝",
      cta: "Build My Resume →",
      page: "resume",
    },
    {
      title: "Resume Score",
      description: "Upload your resume and get an instant ATS compatibility score with improvement tips.",
      icon: "📈",
      cta: "Check My Score →",
      page: "score",
    },
    {
      title: "Skill Gap Analysis",
      description: "Upload your resume, pick a target role, and see exactly which skills you're missing.",
      icon: "🔍",
      cta: "Find My Skill Gaps →",
      page: "skillgap",
    },
    {
      title: "LinkedIn Optimizer",
      description: "Get suggestions to improve your LinkedIn profile and stand out to recruiters.",
      icon: "🔗",
      cta: "Optimize My Profile →",
      page: "linkedin",
    },
    {
      title: "Mock Interview",
      description: "Practice with AI-driven mock interviews tailored to your target role.",
      icon: "🎤",
      cta: "Start Mock Interview →",
      page: "interview",
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 28, fontWeight: 600, color: T.text, marginBottom: 8 }}>
          Welcome back, {user?.name || 'there'}
        </h2>
        <p style={{ fontSize: 15, color: T.textLight }}>
          Choose a tool below to get started on your career journey.
        </p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 24,
      }}>
        {actions.map((a) => (
          <div
            key={a.page}
            style={{
              ...css.card,
              display: 'flex',
              flexDirection: 'column',
              borderTop: `3px solid #2563eb`,
            }}
          >
            <div style={{
              fontSize: 24,
              width: 48,
              height: 48,
              borderRadius: 12,
              backgroundColor: '#eff6ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}>
              {a.icon}
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 600, color: T.text, marginBottom: 8 }}>
              {a.title}
            </h3>
            <p style={{ fontSize: 14, color: T.textLight, lineHeight: 1.5, marginBottom: 20, flexGrow: 1 }}>
              {a.description}
            </p>
            <button onClick={() => onNavigate(a.page)} style={css.btnPrimary}>
              {a.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}