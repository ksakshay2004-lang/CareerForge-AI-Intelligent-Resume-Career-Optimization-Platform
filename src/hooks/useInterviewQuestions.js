// src/hooks/useInterviewQuestions.js
import { useState, useCallback } from 'react';
import { getRandomQuestion, getMultipleQuestions } from '../services/aiQuestionGenerator';
import aiEvaluationService from '../services/aiEvaluationService';

export function useInterviewQuestions() {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionsQueue, setQuestionsQueue] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [stats, setStats] = useState({
    answered: 0,
    averageScore: 0,
    totalTime: 0,
  });

  const loadNewQuestion = useCallback((domain, type, difficulty) => {
    setLoading(true);
    try {
      const question = getRandomQuestion(domain, type, difficulty);
      setCurrentQuestion(question);
      setEvaluation(null);
      return question;
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMultipleQuestions = useCallback((domain, type, difficulty, count = 10) => {
    setLoading(true);
    try {
      const questions = getMultipleQuestions(domain, type, difficulty, count);
      setQuestionsQueue(questions);
      if (questions.length > 0) {
        setCurrentQuestion(questions[0]);
      }
      return questions;
    } finally {
      setLoading(false);
    }
  }, []);

  const submitAnswer = useCallback(async (answer, timeSpent) => {
    if (!currentQuestion) return null;
    
    setLoading(true);
    try {
      const evaluationResult = await aiEvaluationService.evaluateAnswer(
        currentQuestion.question,
        answer,
        currentQuestion.domain,
        currentQuestion.type
      );
      
      const result = {
        ...currentQuestion,
        userAnswer: answer,
        evaluation: evaluationResult,
        timeSpent,
        timestamp: new Date(),
      };
      
      setHistory(prev => [...prev, result]);
      setEvaluation(evaluationResult);
      setStats(prev => ({
        answered: prev.answered + 1,
        averageScore: (prev.averageScore * prev.answered + evaluationResult.score) / (prev.answered + 1),
        totalTime: prev.totalTime + timeSpent,
      }));
      
      return evaluationResult;
    } finally {
      setLoading(false);
    }
  }, [currentQuestion]);

  const nextQuestion = useCallback(() => {
    if (questionsQueue.length > 1) {
      const newQueue = questionsQueue.slice(1);
      setQuestionsQueue(newQueue);
      setCurrentQuestion(newQueue[0]);
      setEvaluation(null);
    } else {
      setCurrentQuestion(null);
      setQuestionsQueue([]);
    }
  }, [questionsQueue]);

  return {
    currentQuestion,
    questionsQueue,
    history,
    loading,
    evaluation,
    stats,
    loadNewQuestion,
    loadMultipleQuestions,
    submitAnswer,
    nextQuestion,
    hasMoreQuestions: questionsQueue.length > 0,
  };
}