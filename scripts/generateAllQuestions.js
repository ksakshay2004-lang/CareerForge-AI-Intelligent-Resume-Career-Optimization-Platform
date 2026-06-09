// A:\resume_builder\careerforge\scripts\generateAllQuestions.js
const fs = require('fs');
const path = require('path');

// Smart Question Generator - Creates 200+ questions per category automatically
class SmartQuestionGenerator {
  constructor() {
    this.topics = {
      software: ['algorithms', 'data structures', 'system design', 'debugging', 'code review', 'architecture', 'APIs', 'databases', 'testing', 'performance', 'security', 'refactoring'],
      'data-science': ['statistics', 'machine learning', 'data cleaning', 'visualization', 'model evaluation', 'feature engineering', 'EDA', 'hypothesis testing', 'regression', 'classification', 'clustering', 'A/B testing'],
      'ml-engineer': ['model deployment', 'feature engineering', 'model monitoring', 'scaling', 'versioning', 'pipelines', 'inference', 'training', 'validation', 'MLOps', 'experiment tracking', 'model registry'],
      devops: ['ci/cd', 'monitoring', 'containers', 'orchestration', 'infrastructure', 'security', 'logging', 'alerting', 'backups', 'scaling', 'terraform', 'kubernetes'],
      product: ['roadmap', 'prioritization', 'user research', 'metrics', 'stakeholder management', 'MVP', 'feedback', 'analytics', 'strategy', 'launch', 'retention', 'user stories'],
      'ui-ux': ['user research', 'prototyping', 'usability testing', 'design systems', 'accessibility', 'wireframing', 'user flows', 'interaction design', 'visual design', 'information architecture', 'responsive design', 'user personas']
    };
    
    this.patterns = {
      behavioral: {
        easy: [
          'Tell me about a time you worked with {topic}.',
          'Describe your experience with {topic}.',
          'How do you approach {topic} in your daily work?',
          'What interests you most about {topic}?',
          'Share an example of how you use {topic}.',
          'When did you first learn about {topic}?',
          'How has {topic} helped you in your career?'
        ],
        medium: [
          'Tell me about a challenging {topic} situation you handled.',
          'Describe a time you improved {topic} at your company.',
          'How do you stay updated with {topic} best practices?',
          'Tell me about a disagreement about {topic} and how you resolved it.',
          'Describe a time you had to learn {topic} quickly.',
          'Tell me about a time you taught {topic} to someone else.',
          'How do you handle feedback about your {topic} approach?'
        ],
        hard: [
          'Describe a time your {topic} approach failed. What did you learn?',
          'Tell me about a complex {topic} problem you solved.',
          'How would you teach {topic} to a junior team member?',
          'Describe a time you had to convince leadership about {topic}.',
          'Tell me about a {topic} decision that had significant impact.',
          'How have you evolved your {topic} approach over time?',
          'Describe a situation where you had to innovate in {topic}.'
        ]
      },
      technical: {
        easy: [
          'Explain the basics of {topic}.',
          'What is {topic} and why is it important?',
          'Compare {topic} with alternative approaches.',
          'When would you use {topic}?',
          'What are the key principles of {topic}?',
          'What tools do you use for {topic}?',
          'Give an example of {topic} in practice.'
        ],
        medium: [
          'How would you optimize {topic} for performance?',
          'Describe a scenario where {topic} would be the wrong choice.',
          'What are the trade-offs when implementing {topic}?',
          'How do you debug issues with {topic}?',
          'What tools do you use for {topic} and why?',
          'How does {topic} scale?',
          'What are common pitfalls with {topic}?'
        ],
        hard: [
          'Design a system that handles {topic} at scale.',
          'How would you debug a production issue related to {topic}?',
          'Explain how you would implement {topic} from scratch.',
          'What are the limitations of current {topic} approaches?',
          'How would you improve {topic} in your current stack?',
          'What would you change about how {topic} is commonly implemented?',
          'How do you balance different concerns when working with {topic}?'
        ]
      },
      situational: {
        easy: [
          'Your team disagrees on {topic}. What do you do?',
          'A deadline is missed due to {topic}. How do you respond?',
          'A stakeholder questions your {topic} approach. How do you handle it?',
          'You discover a bug related to {topic}. What steps do you take?',
          'A team member is struggling with {topic}. How do you help?',
          'You have limited time to learn {topic}. What do you do?',
          'Your manager asks about your {topic} skills. How do you respond?'
        ],
        medium: [
          'Production is down because of {topic}. Walk through your response.',
          'Your manager wants to cut corners on {topic}. What do you do?',
          'A team member is struggling with {topic}. How do you help?',
          'You have competing priorities involving {topic}. How do you decide?',
          'A legacy system has {topic} issues. How do you approach fixes?',
          'Your team is adopting new {topic} practices. How do you adapt?',
          'You disagree with the team on {topic}. What do you do?'
        ],
        hard: [
          'You discover a critical {topic} issue from 6 months ago. What now?',
          'Leadership wants to deprioritize {topic} for features. How do you advocate?',
          'Your company is acquired and new leadership wants to change {topic}. How do you adapt?',
          'You inherit a system with severe {topic} problems. What is your plan?',
          'How do you balance technical debt from {topic} with new features?',
          'Your team is resistant to improving {topic}. How do you drive change?',
          'You need to rebuild trust after a {topic} failure. What do you do?'
        ]
      }
    };
  }
  
  generateQuestions(domain, type, difficulty, count = 200) {
    const questions = [];
    const domainTopics = this.topics[domain] || this.topics.software;
    const patterns = this.patterns[type][difficulty];
    
    for (let i = 1; i <= count; i++) {
      const topic = domainTopics[i % domainTopics.length];
      const pattern = patterns[i % patterns.length];
      const questionText = pattern.replace('{topic}', topic);
      
      questions.push({
        id: `${domain}-${type}-${difficulty}-${i}`,
        question: questionText,
        hint: this.generateHint(topic, type, domain),
        sampleAnswer: this.generateSampleAnswer(topic, type, difficulty, domain),
        tips: this.generateTips(domain, type),
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
  
  generateHint(topic, type, domain) {
    const hints = {
      behavioral: `Use STAR method (Situation, Task, Action, Result) with a real example about ${topic}.`,
      technical: `Provide specific technical details about ${topic}. Include examples and edge cases.`,
      situational: `Walk through your decision-making process step by step for ${topic}.`
    };
    return `${hints[type] || 'Be thorough and specific.'} Focus on ${domain} best practices.`;
  }
  
  generateSampleAnswer(topic, type, difficulty, domain) {
    let answer = `A strong answer for ${topic} would include:\n\n`;
    answer += `1. Specific example from your ${domain} experience\n`;
    answer += `2. Clear explanation of your approach to ${topic}\n`;
    answer += `3. Measurable outcomes or results\n`;
    answer += `4. Lessons learned or improvements made\n\n`;
    
    if (difficulty === 'hard') {
      answer += `For a challenging ${topic} scenario, you should also discuss trade-offs, alternative approaches, and how you handled ambiguity.`;
    } else if (difficulty === 'medium') {
      answer += `Focus on your specific actions and the direct impact they had. Include metrics if possible.`;
    } else {
      answer += `Start with fundamentals and show your understanding of core concepts.`;
    }
    
    return answer;
  }
  
  generateTips(domain, type) {
    const tips = [
      `Be specific with numbers and metrics from your ${domain} experience.`,
      `Use real examples from your work, not hypotheticals.`,
      `Structure your answer clearly (Problem → Action → Result).`,
      `Show your problem-solving process, not just the solution.`
    ];
    
    if (type === 'technical') {
      tips.push(`Include code or technical details if relevant.`);
    }
    
    return tips.slice(0, 3).join(' ');
  }
  
  generateFullBank() {
    const domains = Object.keys(this.topics);
    const types = ['behavioral', 'technical', 'situational'];
    const difficulties = ['easy', 'medium', 'hard'];
    
    const bank = {};
    
    console.log('\n🚀 Starting question generation...\n');
    
    for (const domain of domains) {
      console.log(`📚 Generating for ${domain}...`);
      bank[domain] = {};
      
      for (const type of types) {
        console.log(`  ├─ ${type}...`);
        bank[domain][type] = {};
        
        for (const difficulty of difficulties) {
          process.stdout.write(`  │  └─ ${difficulty}: generating 200 questions...`);
          bank[domain][type][difficulty] = this.generateQuestions(domain, type, difficulty, 200);
          console.log(` ✅`);
        }
      }
      console.log('');
    }
    
    return bank;
  }
}

// Generate and save
console.log('='.repeat(50));
console.log('🎯 INTERVIEW QUESTION BANK GENERATOR');
console.log('='.repeat(50));

const generator = new SmartQuestionGenerator();
const questionBank = generator.generateFullBank();

// Calculate total
let totalQuestions = 0;
for (const domain of Object.keys(questionBank)) {
  for (const type of Object.keys(questionBank[domain])) {
    for (const difficulty of Object.keys(questionBank[domain][type])) {
      totalQuestions += questionBank[domain][type][difficulty].length;
    }
  }
}

console.log('='.repeat(50));
console.log('✅ GENERATION COMPLETE!');
console.log('='.repeat(50));
console.log(`📊 Statistics:`);
console.log(`   - Domains: ${Object.keys(questionBank).length}`);
console.log(`   - Questions per combination: 200`);
console.log(`   - TOTAL QUESTIONS: ${totalQuestions.toLocaleString()}`);
console.log('');

// Save to file
const outputPath = path.join(__dirname, '../src/data/questionBank.json');
const dataDir = path.join(__dirname, '../src/data');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('📁 Created data directory');
}

fs.writeFileSync(outputPath, JSON.stringify(questionBank, null, 2));
console.log(`💾 Saved to: ${outputPath}`);
console.log('\n🎉 Done! You can now import the questions in your React app.\n');