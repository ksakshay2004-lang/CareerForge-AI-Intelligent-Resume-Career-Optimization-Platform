// src/services/aiEvaluationService.js
export class AIEvaluationService {
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
    
    // Length scoring
    if (words > 150) { score += 30; strengths.push('Comprehensive and detailed answer'); }
    else if (words > 80) { score += 20; strengths.push('Good length with sufficient detail'); }
    else if (words > 40) { score += 10; }
    else { improvements.push('Provide more detail and specific examples'); }
    
    // Quality metrics
    if (hasMetrics) { score += 25; strengths.push('Excellent use of metrics and measurable outcomes'); }
    else { improvements.push('Include specific metrics or numbers to demonstrate impact'); }
    
    if (hasStructure) { score += 20; strengths.push('Well-structured answer with clear progression'); }
    else { improvements.push('Use a clear structure (e.g., STAR method, chronological order)'); }
    
    if (hasExample) { score += 15; strengths.push('Good use of concrete examples'); }
    else { improvements.push('Add specific examples from your experience'); }
    
    // Domain-specific scoring
    const domainKeywords = getDomainKeywords(domain);
    const hasDomainKeywords = domainKeywords.some(keyword => 
      answer.toLowerCase().includes(keyword.toLowerCase())
    );
    
    if (hasDomainKeywords) { score += 10; strengths.push(`Shows strong ${domain} domain knowledge`); }
    else { improvements.push(`Incorporate ${domain}-specific terminology and concepts`); }
    
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
      suggestions: generateSuggestions(score, domain),
      wordCount: words,
    };
  }
}

function getDomainKeywords(domain) {
  const keywords = {
    software: ['code', 'architecture', 'database', 'api', 'performance', 'scalability'],
    'data-science': ['model', 'accuracy', 'features', 'training', 'validation', 'metrics'],
    'ml-engineer': ['deployment', 'pipeline', 'inference', 'monitoring', 'latency'],
    devops: ['ci/cd', 'container', 'kubernetes', 'automation', 'monitoring'],
    product: ['user', 'metric', 'roadmap', 'stakeholder', 'priority'],
    'ui-ux': ['user', 'research', 'prototype', 'usability', 'accessibility']
  };
  return keywords[domain] || ['experience', 'solution', 'approach'];
}

function generateSuggestions(score, domain) {
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

export default new AIEvaluationService();