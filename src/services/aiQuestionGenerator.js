// src/services/aiQuestionGenerator.js

class AIQuestionGenerator {
  constructor() {
    // Initialize with fallback questions
    this.fallbackQuestions = this.generateFallbackBank();
  }
  
  generateFallbackBank() {
    const domains = ['software', 'data-science', 'ml-engineer', 'devops', 'product', 'ui-ux'];
    const types = ['behavioral', 'technical', 'situational'];
    const difficulties = ['easy', 'medium', 'hard'];
    
    const bank = {};
    
    for (const domain of domains) {
      bank[domain] = {};
      for (const type of types) {
        bank[domain][type] = {};
        for (const difficulty of difficulties) {
          bank[domain][type][difficulty] = this.generateQuestionsForCategory(domain, type, difficulty, 200);
        }
      }
    }
    
    return bank;
  }
  
  generateQuestionsForCategory(domain, type, difficulty, count) {
    const questions = [];
    
    const topics = {
      software: ['algorithms', 'data structures', 'APIs', 'databases', 'testing', 'debugging', 'architecture', 'performance', 'security', 'refactoring'],
      'data-science': ['statistics', 'machine learning', 'data cleaning', 'visualization', 'model evaluation', 'EDA', 'feature engineering', 'A/B testing', 'regression', 'classification'],
      'ml-engineer': ['model deployment', 'feature engineering', 'monitoring', 'pipelines', 'MLOps', 'inference', 'training', 'validation', 'experiment tracking', 'model registry'],
      devops: ['CI/CD', 'monitoring', 'containers', 'Kubernetes', 'infrastructure', 'automation', 'logging', 'alerting', 'backups', 'scaling'],
      product: ['roadmap', 'prioritization', 'user research', 'metrics', 'stakeholders', 'MVP', 'feedback', 'analytics', 'strategy', 'launch'],
      'ui-ux': ['user research', 'prototyping', 'usability testing', 'design systems', 'accessibility', 'wireframing', 'user flows', 'interaction design', 'visual design', 'information architecture']
    };
    
    const templates = {
      behavioral: {
        easy: `Tell me about your experience with {topic}.`,
        medium: `Tell me about a challenging {topic} situation you handled.`,
        hard: `Describe a time your {topic} approach failed. What did you learn?`
      },
      technical: {
        easy: `Explain the basics of {topic}.`,
        medium: `How would you optimize {topic} for performance?`,
        hard: `Design a system that handles {topic} at scale.`
      },
      situational: {
        easy: `Your team disagrees on {topic}. What do you do?`,
        medium: `Production is down because of {topic}. Walk through your response.`,
        hard: `You discover a critical {topic} issue from 6 months ago. What now?`
      }
    };
    
    const domainTopics = topics[domain] || topics.software;
    const template = templates[type]?.[difficulty] || `Question about {topic}?`;
    
    for (let i = 1; i <= count; i++) {
      const topic = domainTopics[i % domainTopics.length];
      const questionText = template.replace('{topic}', topic);
      
      questions.push({
        id: `${domain}-${type}-${difficulty}-${i}`,
        question: questionText,
        hint: `Use the ${type} answering format. ${type === 'behavioral' ? 'Use STAR method.' : type === 'technical' ? 'Be specific with examples.' : 'Walk through your process.'}`,
        sampleAnswer: `A strong answer about ${topic} would include a specific example, your actions, measurable results, and lessons learned.`,
        tips: `Be specific, use metrics, and focus on your role. ${type === 'behavioral' ? 'Use STAR: Situation, Task, Action, Result.' : ''}`,
        difficulty: difficulty,
        type: type,
        domain: domain,
        topic: topic,
        points: difficulty === 'easy' ? 5 : difficulty === 'medium' ? 10 : 15,
        estimatedTime: difficulty === 'easy' ? 2 : difficulty === 'medium' ? 4 : 6,
      });
    }
    
    return questions;
  }
  
  // This is the missing function that getRandomQuestion needs
  getRandomQuestion(domain, type, difficulty) {
    const pool = this.fallbackQuestions[domain]?.[type]?.[difficulty] || [];
    if (pool.length === 0) return null;
    return pool[Math.floor(Math.random() * pool.length)];
  }
  
  // This is the missing function that getMultipleQuestions needs
  getMultipleQuestions(domain, type, difficulty, count = 10) {
    const pool = this.fallbackQuestions[domain]?.[type]?.[difficulty] || [];
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, pool.length));
  }
  
  async generateQuestions(domain, type, difficulty, count = 200) {
    // If you have OpenAI API key, use it
    const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
    
    if (API_KEY && API_KEY !== 'your-api-key-here') {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{
              role: 'user',
              content: `Generate ${count} ${difficulty} ${type} interview questions for a ${domain} position. Return as JSON array with fields: question, hint, sampleAnswer`
            }],
            temperature: 0.8,
          }),
        });
        
        const data = await response.json();
        const aiQuestions = JSON.parse(data.choices[0].message.content);
        return aiQuestions;
      } catch (error) {
        console.error('AI generation failed, using fallback:', error);
        return this.getMultipleQuestions(domain, type, difficulty, count);
      }
    }
    
    // Fallback to generated questions
    return this.getMultipleQuestions(domain, type, difficulty, count);
  }
  
  async evaluateAnswer(question, answer, domain, type) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const words = answer.trim().split(/\s+/).length;
    const hasMetrics = /\d+%|\d+x|\d+ (users|customers|requests|ms|seconds)/i.test(answer);
    const hasStructure = /first|second|finally|step|approach|method/i.test(answer);
    const hasExample = /example|instance|case|scenario/i.test(answer);
    
    let score = 0;
    let strengths = [];
    let improvements = [];
    
    if (words > 150) { score += 30; strengths.push('Comprehensive and detailed answer'); }
    else if (words > 80) { score += 20; strengths.push('Good length with sufficient detail'); }
    else if (words > 40) { score += 10; }
    else { improvements.push('Provide more detail and specific examples'); }
    
    if (hasMetrics) { score += 25; strengths.push('Excellent use of metrics and measurable outcomes'); }
    else { improvements.push('Include specific metrics or numbers to demonstrate impact'); }
    
    if (hasStructure) { score += 20; strengths.push('Well-structured answer with clear progression'); }
    else { improvements.push('Use a clear structure (e.g., STAR method, chronological order)'); }
    
    if (hasExample) { score += 15; strengths.push('Good use of concrete examples'); }
    else { improvements.push('Add specific examples from your experience'); }
    
    score = Math.min(100, Math.max(0, score));
    
    let overallFeedback = '';
    if (score >= 80) overallFeedback = 'Excellent answer! Very comprehensive and well-structured.';
    else if (score >= 60) overallFeedback = 'Good answer with solid foundations. Could be enhanced with more specifics.';
    else if (score >= 40) overallFeedback = 'Decent attempt, but needs more detail and structure.';
    else overallFeedback = 'Answer is too brief. Focus on providing specific examples and clear structure.';
    
    return {
      score,
      strengths: strengths.slice(0, 3),
      improvements: improvements.slice(0, 3),
      overallFeedback,
      suggestions: this.generateSuggestions(score, domain),
      wordCount: words,
    };
  }
  
  generateSuggestions(score, domain) {
    if (score >= 80) {
      return [
        'Consider adding alternative approaches you considered',
        'Include lessons learned for future similar situations'
      ];
    } else if (score >= 60) {
      return [
        'Add more specific metrics to quantify your impact',
        'Structure your answer with clear bullet points',
        'Include a brief conclusion summarizing key points'
      ];
    } else {
      return [
        'Start with a clear structure using STAR method',
        'Add at least one concrete example with numbers',
        'Explain your reasoning step by step',
        `Include ${domain}-specific terminology to show expertise`
      ];
    }
  }
}

// Create an instance
const aiQuestionGenerator = new AIQuestionGenerator();

// Export the instance as default
export default aiQuestionGenerator;

// ALSO export the individual functions (this fixes your import error!)
export const getRandomQuestion = (domain, type, difficulty) => 
  aiQuestionGenerator.getRandomQuestion(domain, type, difficulty);

export const getMultipleQuestions = (domain, type, difficulty, count) => 
  aiQuestionGenerator.getMultipleQuestions(domain, type, difficulty, count);

// Export the class for testing if needed
export { AIQuestionGenerator };