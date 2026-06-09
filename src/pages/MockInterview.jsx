// src/pages/MockInterview.jsx (IMPROVED VERSION)
import React, { useState } from 'react';
import { T } from '../constants/theme';
import { useInterviewQuestions } from '../hooks/useInterviewQuestions';
import InterviewFeedback from '../components/InterviewFeedback';

const DOMAINS = [
  { id: 'software', label: 'Software Developer', icon: '💻', desc: 'Frontend, backend, full-stack' },
  { id: 'data-science', label: 'Data Scientist', icon: '📊', desc: 'ML, statistics, analytics' },
  { id: 'ml-engineer', label: 'ML Engineer', icon: '🤖', desc: 'Model deployment, MLOps' },
  { id: 'devops', label: 'DevOps Engineer', icon: '⚙️', desc: 'CI/CD, cloud, infrastructure' },
  { id: 'product', label: 'Product Manager', icon: '🗂️', desc: 'Roadmap, strategy, delivery' },
  { id: 'ui-ux', label: 'UI/UX Designer', icon: '🎨', desc: 'Design systems, user research' },
];

const QUESTION_TYPES = [
  { id: 'behavioral', label: 'Behavioral' },
  { id: 'technical', label: 'Technical' },
  { id: 'situational', label: 'Situational' },
];

const DIFFICULTIES = [
  { id: 'easy', label: 'Easy', points: 5 },
  { id: 'medium', label: 'Medium', points: 10 },
  { id: 'hard', label: 'Hard', points: 15 },
];

const SESSION_SIZES = [
  { value: 5, label: 'Quick (5)' },
  { value: 10, label: 'Standard (10)' },
  { value: 20, label: 'Deep Dive (20)' },
];

export default function MockInterview() {
  const [search, setSearch] = useState('');
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [questionType, setQuestionType] = useState('technical');
  const [difficulty, setDifficulty] = useState('medium');
  const [sessionSize, setSessionSize] = useState(10);
  const [stage, setStage] = useState('select');
  const [userAnswer, setUserAnswer] = useState('');
  const [showSample, setShowSample] = useState(false);
  const [startTime, setStartTime] = useState(null);
  
  const {
    currentQuestion,
    questionsQueue,
    history,
    loading,
    evaluation,
    stats,
    loadMultipleQuestions,
    submitAnswer,
    nextQuestion,
    hasMoreQuestions,
  } = useInterviewQuestions();
  
  const filteredDomains = DOMAINS.filter(d =>
    d.label.toLowerCase().includes(search.toLowerCase()) ||
    d.desc.toLowerCase().includes(search.toLowerCase())
  );
  
  const handleStartSession = () => {
    if (!selectedDomain) return;
    loadMultipleQuestions(selectedDomain, questionType, difficulty, sessionSize);
    setStage('interview');
    setUserAnswer('');
    setShowSample(false);
    setStartTime(Date.now());
  };
  
  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim() || !startTime) return;
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    await submitAnswer(userAnswer, timeSpent);
    setUserAnswer('');
    setStartTime(Date.now());
  };
  
  const handleNextQuestion = () => {
    nextQuestion();
    setUserAnswer('');
    setShowSample(false);
    setStartTime(Date.now());
  };
  
  const handleFinishSession = () => {
    setStage('results');
  };
  
  const handleBackToSelect = () => {
    setStage('select');
    setSelectedDomain(null);
    setUserAnswer('');
    setShowSample(false);
  };
  
  const styles = {
    page: { 
      maxWidth: 1200, 
      margin: '0 auto', 
      padding: '20px',
      minHeight: '100vh',
    },
    
    // Header Section
    header: {
      marginBottom: 32,
      textAlign: 'center',
    },
    title: { 
      fontSize: 32, 
      fontWeight: 700, 
      color: T.text, 
      marginBottom: 8,
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    subtitle: { 
      fontSize: 16, 
      color: T.textLight, 
      marginBottom: 0,
    },
    
    // Selection Screen
    searchInput: {
      width: '100%',
      padding: '14px 18px',
      borderRadius: 12,
      border: `1.5px solid ${T.border || '#E5E7EB'}`,
      fontSize: 14,
      marginBottom: 24,
      transition: 'all 0.2s',
      outline: 'none',
      '&:focus': {
        borderColor: T.primary,
      },
    },
    
    domainGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
      gap: 16,
      marginBottom: 32,
    },
    domainCard: (selected) => ({
      padding: '20px',
      borderRadius: 16,
      cursor: 'pointer',
      border: selected ? `2px solid ${T.primary}` : `1.5px solid ${T.border || '#E5E7EB'}`,
      background: selected ? T.primaryLight : (T.cardBg || 'white'),
      transition: 'all 0.2s ease',
      transform: selected ? 'scale(1.02)' : 'scale(1)',
      boxShadow: selected ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      },
    }),
    domainIcon: { fontSize: 32, marginBottom: 12 },
    domainLabel: (selected) => ({
      fontSize: 16,
      fontWeight: 600,
      color: selected ? T.primary : T.text,
      marginBottom: 4,
    }),
    domainDesc: { fontSize: 13, color: T.textLight, lineHeight: 1.4 },
    
    filterContainer: {
      background: T.cardBg || 'white',
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
      border: `1px solid ${T.border || '#E5E7EB'}`,
    },
    filterRow: {
      display: 'flex',
      gap: 24,
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'center',
    },
    filterGroup: { 
      display: 'flex', 
      gap: 10, 
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    filterLabel: { 
      fontSize: 13, 
      color: T.textLight, 
      fontWeight: 600,
      letterSpacing: '0.5px',
    },
    chip: (active) => ({
      padding: '8px 18px',
      borderRadius: 30,
      cursor: 'pointer',
      fontSize: 13,
      fontWeight: 500,
      border: active ? `2px solid ${T.primary}` : `1.5px solid ${T.border || '#E5E7EB'}`,
      background: active ? T.primaryLight : 'transparent',
      color: active ? T.primary : T.textLight,
      transition: 'all 0.2s',
      '&:hover': {
        transform: 'translateY(-1px)',
      },
    }),
    
    startButton: (enabled) => ({
      width: '100%',
      padding: '16px',
      borderRadius: 12,
      fontSize: 16,
      fontWeight: 600,
      border: 'none',
      cursor: enabled ? 'pointer' : 'not-allowed',
      background: enabled ? `linear-gradient(135deg, ${T.primary}, ${T.primary}dd)` : '#E5E7EB',
      color: enabled ? 'white' : '#AAA',
      transition: 'all 0.2s',
      '&:hover': enabled ? {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      } : {},
    }),
    
    // Interview Screen
    topBar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24,
      paddingBottom: 16,
      borderBottom: `1px solid ${T.border || '#E5E7EB'}`,
    },
    backButton: {
      background: 'none',
      border: 'none',
      color: T.textLight,
      cursor: 'pointer',
      fontSize: 14,
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '8px 12px',
      borderRadius: 8,
      transition: 'all 0.2s',
      '&:hover': {
        background: T.primaryLight,
        color: T.primary,
      },
    },
    statsBadge: {
      display: 'flex',
      gap: 20,
      alignItems: 'center',
    },
    statItem: {
      fontSize: 13,
      color: T.textLight,
      display: 'flex',
      alignItems: 'center',
      gap: 6,
    },
    
    progressBar: {
      height: 6,
      background: '#E5E7EB',
      borderRadius: 3,
      marginBottom: 24,
      overflow: 'hidden',
    },
    progressFill: (progress) => ({
      height: '100%',
      width: `${progress}%`,
      background: `linear-gradient(90deg, ${T.primary}, ${T.primary}aa)`,
      borderRadius: 3,
      transition: 'width 0.3s ease',
    }),
    
    questionCard: {
      background: T.cardBg || 'white',
      borderRadius: 20,
      padding: 32,
      marginBottom: 24,
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      border: `1px solid ${T.border || '#E5E7EB'}`,
    },
    questionMeta: {
      display: 'flex',
      gap: 10,
      marginBottom: 20,
      flexWrap: 'wrap',
    },
    badge: (type) => {
      const colors = {
        primary: { bg: T.primaryLight, color: T.primary },
        domain: { bg: '#E0E7FF', color: '#4F46E5' },
        difficulty: { bg: '#FEF3C7', color: '#D97706' },
        type: { bg: '#D1FAE5', color: '#059669' },
        points: { bg: '#FCE7F3', color: '#DB2777' },
      };
      const color = colors[type] || colors.primary;
      return {
        padding: '6px 14px',
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 600,
        background: color.bg,
        color: color.color,
      };
    },
    questionText: {
      fontSize: 22,
      fontWeight: 500,
      color: T.text,
      lineHeight: 1.5,
      marginBottom: 24,
    },
    hintBox: {
      background: T.primaryLight,
      borderRadius: 12,
      padding: '16px 20px',
      marginBottom: 24,
      display: 'flex',
      gap: 12,
      borderLeft: `4px solid ${T.primary}`,
    },
    hintText: { fontSize: 14, color: T.text, flex: 1, lineHeight: 1.5 },
    
    textarea: {
      width: '100%',
      minHeight: 180,
      padding: '16px',
      borderRadius: 12,
      border: `1.5px solid ${T.border || '#E5E7EB'}`,
      fontSize: 14,
      fontFamily: 'inherit',
      marginBottom: 20,
      resize: 'vertical',
      transition: 'all 0.2s',
      outline: 'none',
      '&:focus': {
        borderColor: T.primary,
        boxShadow: `0 0 0 3px ${T.primary}20`,
      },
    },
    
    buttonRow: { display: 'flex', gap: 12, marginBottom: 0 },
    primaryButton: {
      flex: 1,
      padding: '14px 24px',
      borderRadius: 12,
      background: `linear-gradient(135deg, ${T.primary}, ${T.primary}dd)`,
      color: 'white',
      border: 'none',
      fontSize: 15,
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.2s',
      '&:hover': {
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      },
    },
    secondaryButton: {
      padding: '14px 24px',
      borderRadius: 12,
      background: 'transparent',
      color: T.text,
      border: `1.5px solid ${T.border || '#E5E7EB'}`,
      fontSize: 15,
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'all 0.2s',
      '&:hover': {
        background: T.primaryLight,
        borderColor: T.primary,
      },
    },
    
    sampleAnswerBox: {
      background: 'linear-gradient(135deg, #F0FDF4, #DCFCE7)',
      borderRadius: 16,
      padding: 24,
      marginBottom: 24,
      border: '1px solid #BBF7D0',
    },
    
    resultsCard: {
      background: T.cardBg || 'white',
      borderRadius: 20,
      padding: 40,
      border: `1px solid ${T.border || '#E5E7EB'}`,
      textAlign: 'center',
    },
    resultsTitle: { fontSize: 28, fontWeight: 700, color: T.text, marginBottom: 32 },
    resultsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: 24,
      marginBottom: 32,
    },
    resultCard: {
      padding: 24,
      background: T.primaryLight,
      borderRadius: 16,
      textAlign: 'center',
    },
    resultValue: { fontSize: 36, fontWeight: 700, color: T.primary, marginBottom: 8 },
    resultLabel: { fontSize: 14, color: T.textLight },
    
    infoText: { 
      marginTop: 16, 
      fontSize: 13, 
      color: T.textLight, 
      textAlign: 'center',
      display: 'flex',
      justifyContent: 'center',
      gap: 24,
      flexWrap: 'wrap',
    },
  };
  
  // Selection screen
  if (stage === 'select') {
    return (
      <div style={styles.page}>
        <div style={styles.header}>
          <h2 style={styles.title}>🎯 Mock Interview</h2>
          <p style={styles.subtitle}>Practice with 10,800+ real interview questions. Get AI-powered feedback.</p>
        </div>
        
        <input
          style={styles.searchInput}
          placeholder="🔍 Search domain..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        
        <div style={styles.domainGrid}>
          {filteredDomains.map(domain => (
            <div
              key={domain.id}
              style={styles.domainCard(selectedDomain === domain.id)}
              onClick={() => setSelectedDomain(domain.id)}
            >
              <div style={styles.domainIcon}>{domain.icon}</div>
              <div style={styles.domainLabel(selectedDomain === domain.id)}>{domain.label}</div>
              <div style={styles.domainDesc}>{domain.desc}</div>
            </div>
          ))}
        </div>
        
        <div style={styles.filterContainer}>
          <div style={styles.filterRow}>
            <div style={styles.filterGroup}>
              <span style={styles.filterLabel}>📋 Type:</span>
              {QUESTION_TYPES.map(type => (
                <button
                  key={type.id}
                  style={styles.chip(questionType === type.id)}
                  onClick={() => setQuestionType(type.id)}
                >
                  {type.label}
                </button>
              ))}
            </div>
            
            <div style={styles.filterGroup}>
              <span style={styles.filterLabel}>⚡ Difficulty:</span>
              {DIFFICULTIES.map(diff => (
                <button
                  key={diff.id}
                  style={styles.chip(difficulty === diff.id)}
                  onClick={() => setDifficulty(diff.id)}
                >
                  {diff.label}
                </button>
              ))}
            </div>
            
            <div style={styles.filterGroup}>
              <span style={styles.filterLabel}>📊 Session:</span>
              {SESSION_SIZES.map(size => (
                <button
                  key={size.value}
                  style={styles.chip(sessionSize === size.value)}
                  onClick={() => setSessionSize(size.value)}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <button
          style={styles.startButton(!!selectedDomain)}
          onClick={handleStartSession}
          disabled={!selectedDomain}
        >
          {selectedDomain 
            ? `🚀 Start ${SESSION_SIZES.find(s => s.value === sessionSize).label} Question Session` 
            : '✨ Select a domain to start'}
        </button>
        
        <div style={styles.infoText}>
          <span>📚 10,800+ questions</span>
          <span>🤖 AI-powered evaluation</span>
          <span>📊 Detailed feedback</span>
          <span>⚡ Real-time scoring</span>
        </div>
      </div>
    );
  }
  
  // Results screen
  if (stage === 'results') {
    const averageScore = stats.averageScore || 0;
    const totalQuestions = history.length;
    const totalTime = stats.totalTime;
    
    return (
      <div style={styles.page}>
        <button style={styles.backButton} onClick={handleBackToSelect}>
          ← New Session
        </button>
        
        <div style={styles.resultsCard}>
          <h2 style={styles.resultsTitle}>🎉 Session Complete!</h2>
          
          <div style={styles.resultsGrid}>
            <div style={styles.resultCard}>
              <div style={styles.resultValue}>{totalQuestions}</div>
              <div style={styles.resultLabel}>Questions Answered</div>
            </div>
            <div style={styles.resultCard}>
              <div style={styles.resultValue}>{Math.round(averageScore)}%</div>
              <div style={styles.resultLabel}>Average Score</div>
            </div>
            <div style={styles.resultCard}>
              <div style={styles.resultValue}>{Math.floor(totalTime / 60)}:{String(totalTime % 60).padStart(2, '0')}</div>
              <div style={styles.resultLabel}>Total Time</div>
            </div>
            <div style={styles.resultCard}>
              <div style={styles.resultValue}>{(totalQuestions / (totalTime / 60)).toFixed(1)}</div>
              <div style={styles.resultLabel}>Questions/min</div>
            </div>
          </div>
          
          <button
            style={styles.primaryButton}
            onClick={handleBackToSelect}
          >
            Start New Session →
          </button>
        </div>
      </div>
    );
  }
  
  // Interview screen
  const progress = ((history.length) / sessionSize) * 100;
  const remaining = sessionSize - history.length;
  const currentDifficulty = DIFFICULTIES.find(d => d.id === currentQuestion?.difficulty);
  
  return (
    <div style={styles.page}>
      <div style={styles.topBar}>
        <button style={styles.backButton} onClick={handleFinishSession}>
          ← End Session
        </button>
        <div style={styles.statsBadge}>
          <div style={styles.statItem}>📊 Score: {Math.round(stats.averageScore || 0)}%</div>
          <div style={styles.statItem}>✅ Answered: {history.length}</div>
        </div>
      </div>
      
      <div style={styles.progressBar}>
        <div style={styles.progressFill(progress)} />
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <span style={{ fontSize: 13, color: T.textLight }}>
          Question {history.length + 1} of {sessionSize}
        </span>
        <span style={{ fontSize: 13, fontWeight: 500, color: T.primary }}>
          {remaining} remaining
        </span>
      </div>
      
      {currentQuestion && (
        <>
          <div style={styles.questionCard}>
            <div style={styles.questionMeta}>
              <span style={styles.badge('domain')}>
                {DOMAINS.find(d => d.id === currentQuestion.domain)?.icon} {DOMAINS.find(d => d.id === currentQuestion.domain)?.label}
              </span>
              <span style={styles.badge('difficulty')}>
                {currentDifficulty?.label || currentQuestion.difficulty}
              </span>
              <span style={styles.badge('type')}>
                {QUESTION_TYPES.find(t => t.id === currentQuestion.type)?.label}
              </span>
              <span style={styles.badge('points')}>
                🎯 {currentQuestion.points} pts
              </span>
            </div>
            
            <div style={styles.questionText}>{currentQuestion.question}</div>
            
            {currentQuestion.hint && !evaluation && (
              <div style={styles.hintBox}>
                <span style={{ fontSize: 20 }}>💡</span>
                <div style={styles.hintText}>{currentQuestion.hint}</div>
              </div>
            )}
            
            {!evaluation ? (
              <>
                <textarea
                  style={styles.textarea}
                  placeholder="✏️ Type your answer here. Be specific, use examples, and quantify results when possible..."
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                />
                
                <div style={styles.buttonRow}>
                  <button
                    style={{ ...styles.primaryButton, opacity: userAnswer.trim() ? 1 : 0.6 }}
                    onClick={handleSubmitAnswer}
                    disabled={!userAnswer.trim() || loading}
                  >
                    {loading ? '🤔 Evaluating...' : '📝 Submit Answer'}
                  </button>
                  <button style={styles.secondaryButton} onClick={() => setShowSample(!showSample)}>
                    {showSample ? '🙈 Hide Sample' : '👀 Show Sample'}
                  </button>
                </div>
              </>
            ) : (
              <div style={styles.buttonRow}>
                {hasMoreQuestions ? (
                  <button style={styles.primaryButton} onClick={handleNextQuestion}>
                    Next Question →
                  </button>
                ) : (
                  <button style={styles.primaryButton} onClick={handleFinishSession}>
                    Complete Session 🎉
                  </button>
                )}
                <button style={styles.secondaryButton} onClick={() => setShowSample(!showSample)}>
                  {showSample ? 'Hide Sample' : 'Show Sample'}
                </button>
              </div>
            )}
          </div>
          
          {showSample && currentQuestion.sampleAnswer && (
            <div style={styles.sampleAnswerBox}>
              <div style={{ fontWeight: 'bold', marginBottom: 12, color: '#059669', fontSize: 14 }}>
                ✓ Sample Answer
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.6, color: T.text }}>{currentQuestion.sampleAnswer}</div>
              {currentQuestion.tips && (
                <div style={{ marginTop: 16, padding: 12, background: 'white', borderRadius: 8 }}>
                  <span style={{ fontWeight: 600, color: '#059669' }}>💡 Tip:</span>
                  <span style={{ marginLeft: 8, fontSize: 13, color: T.textLight }}>{currentQuestion.tips}</span>
                </div>
              )}
            </div>
          )}
          
          <InterviewFeedback evaluation={evaluation} stats={stats} />
        </>
      )}
      
      {loading && !currentQuestion && (
        <div style={{ textAlign: 'center', padding: 60, color: T.textLight }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🤔</div>
          <div>Loading questions...</div>
        </div>
      )}
    </div>
  );
}