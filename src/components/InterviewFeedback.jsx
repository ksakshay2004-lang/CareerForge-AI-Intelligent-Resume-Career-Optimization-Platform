// src/components/InterviewFeedback.jsx
import React from 'react';
import { T } from '../constants/theme';

export default function InterviewFeedback({ evaluation, stats }) {
  if (!evaluation) return null;
  
  const getScoreColor = (score) => {
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#F59E0B';
    return '#EF4444';
  };
  
  const styles = {
    container: {
      background: T.cardBg || 'white',
      borderRadius: '12px',
      padding: '24px',
      marginTop: '20px',
      border: `1px solid ${T.border || '#E5E7EB'}`,
    },
    scoreSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      marginBottom: '24px',
      paddingBottom: '20px',
      borderBottom: `1px solid ${T.border || '#E5E7EB'}`,
    },
    scoreCircle: {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      background: `linear-gradient(135deg, ${getScoreColor(evaluation.score)}20, ${getScoreColor(evaluation.score)}40)`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    scoreNumber: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: getScoreColor(evaluation.score),
    },
    scoreLabel: {
      fontSize: '12px',
      color: T.textLight,
    },
    feedback: {
      flex: 1,
    },
    feedbackText: {
      fontSize: '16px',
      color: T.text,
      marginBottom: '8px',
      lineHeight: '1.5',
    },
    statsRow: {
      display: 'flex',
      gap: '24px',
      marginBottom: '20px',
      padding: '16px',
      background: T.primaryLight || '#F3F4F6',
      borderRadius: '8px',
    },
    stat: {
      flex: 1,
    },
    statLabel: {
      fontSize: '12px',
      color: T.textLight,
      marginBottom: '4px',
    },
    statValue: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: T.text,
    },
    section: {
      marginTop: '20px',
    },
    sectionTitle: {
      fontSize: '14px',
      fontWeight: 'bold',
      color: T.text,
      marginBottom: '12px',
    },
    listItem: {
      padding: '8px 0',
      color: T.textLight,
      fontSize: '14px',
      lineHeight: '1.5',
      borderBottom: `1px solid ${T.border || '#E5E7EB'}`,
    },
    suggestions: {
      background: '#FEF3C7',
      padding: '16px',
      borderRadius: '8px',
      marginTop: '16px',
    },
  };
  
  return (
    <div style={styles.container}>
      <div style={styles.scoreSection}>
        <div style={styles.scoreCircle}>
          <div style={styles.scoreNumber}>{Math.round(evaluation.score)}</div>
          <div style={styles.scoreLabel}>Score</div>
        </div>
        <div style={styles.feedback}>
          <div style={styles.feedbackText}>{evaluation.overallFeedback}</div>
          <div style={{ fontSize: '12px', color: T.textLight }}>
            {evaluation.wordCount} words • AI-powered evaluation
          </div>
        </div>
      </div>
      
      {stats && (
        <div style={styles.statsRow}>
          <div style={styles.stat}>
            <div style={styles.statLabel}>Questions Answered</div>
            <div style={styles.statValue}>{stats.answered}</div>
          </div>
          <div style={styles.stat}>
            <div style={styles.statLabel}>Average Score</div>
            <div style={styles.statValue}>{Math.round(stats.averageScore)}%</div>
          </div>
          <div style={styles.stat}>
            <div style={styles.statLabel}>Total Time</div>
            <div style={styles.statValue}>{Math.round(stats.totalTime)}s</div>
          </div>
        </div>
      )}
      
      {evaluation.strengths?.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>✓ Strengths</div>
          {evaluation.strengths.map((strength, i) => (
            <div key={i} style={styles.listItem}>• {strength}</div>
          ))}
        </div>
      )}
      
      {evaluation.improvements?.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>↑ Areas for Improvement</div>
          {evaluation.improvements.map((improvement, i) => (
            <div key={i} style={styles.listItem}>• {improvement}</div>
          ))}
        </div>
      )}
      
      {evaluation.suggestions?.length > 0 && (
        <div style={styles.suggestions}>
          <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>💡 Suggestions for Next Time</div>
          {evaluation.suggestions.map((suggestion, i) => (
            <div key={i} style={{ fontSize: '13px', marginTop: '4px' }}>• {suggestion}</div>
          ))}
        </div>
      )}
    </div>
  );
}