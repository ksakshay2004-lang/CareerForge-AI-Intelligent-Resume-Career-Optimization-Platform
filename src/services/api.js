const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
const OPENROUTER_PROXY_URL = 'http://localhost:3001/api/ai';

// Helper function for API calls
async function apiCall(endpoint, options = {}) {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...defaultOptions,
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API Error: ${response.status}`);
  }

  return response.json();
}

// New: Call the OpenRouter AI proxy
export async function callOpenRouterAI(system, userMessage) {
  try {
    console.log('[API] Calling OpenRouter AI...');
    
    const response = await fetch(OPENROUTER_PROXY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        system: system,
        userMessage: userMessage,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || `HTTP ${response.status}: Failed to get AI response`);
    }

    const data = await response.json();
    console.log('[API] OpenRouter AI response received');
    
    return {
      success: true,
      text: data.text,
    };
  } catch (error) {
    console.error('[API] OpenRouter AI error:', error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}

// New: Analyze LinkedIn profile
export async function analyzeLinkedInProfile(linkedinUrl, profileContent = null) {
  console.log('[API] analyzeLinkedInProfile called for:', linkedinUrl);
  
  const systemPrompt = `You are an expert LinkedIn profile optimizer with years of experience in career coaching and recruitment. 
Your task is to analyze LinkedIn profiles and provide detailed, actionable recommendations to improve visibility, 
engagement, and career opportunities. Provide a score out of 100 and specific suggestions for each section:
- Profile headline and summary
- Experience descriptions
- Skills section
- Recommendations and endorsements
- Overall profile completeness

Be specific, encouraging, and practical. Format your response with clear sections and bullet points.`;

  let userMessage = `Please analyze this LinkedIn profile: ${linkedinUrl}`;
  
  if (profileContent) {
    userMessage = `Please analyze this LinkedIn profile content:

URL: ${linkedinUrl}

Profile Content:
${profileContent}

Provide a comprehensive analysis with optimization suggestions.`;
  }

  const result = await callOpenRouterAI(systemPrompt, userMessage);
  
  if (result.success) {
    // Parse the AI response to extract score and suggestions
    const analysis = result.text;
    const scoreMatch = analysis.match(/(\d{1,3})\s*\/?\s*100/);
    const score = scoreMatch ? parseInt(scoreMatch[1]) : null;
    
    return {
      success: true,
      analysis: analysis,
      score: score,
      suggestions: analysis,
    };
  } else {
    return {
      success: false,
      error: result.error,
      analysis: null,
      score: null,
      suggestions: null,
    };
  }
}

// New: Generate resume optimization suggestions
export async function optimizeResumeWithAI(resumeText, jobDescription = null) {
  console.log('[API] optimizeResumeWithAI called');
  
  let systemPrompt = `You are an expert resume writer and career coach. Analyze the provided resume and provide 
detailed optimization suggestions to make it more effective. Focus on:
- ATS compatibility
- Action verbs and achievements
- Keyword optimization
- Formatting and readability
- Quantifiable results`;

  let userMessage = `Please analyze and optimize this resume:\n\n${resumeText}`;
  
  if (jobDescription) {
    userMessage += `\n\nTarget Job Description:\n${jobDescription}`;
  }

  const result = await callOpenRouterAI(systemPrompt, userMessage);
  
  if (result.success) {
    return {
      success: true,
      suggestions: result.text,
    };
  } else {
    return {
      success: false,
      error: result.error,
    };
  }
}

// Existing functions below
export async function analyzeResume(resumeFile, jobTitle = null) {
  console.log('[API] analyzeResume called');
  
  // If you want to use AI for resume analysis, uncomment this:
  /*
  const resumeText = await resumeFile.text(); // Read file content
  return await optimizeResumeWithAI(resumeText, jobTitle);
  */
  
  // Temporary mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        score: 78,
        overallScore: 78,
        sections: { content: 82, format: 75, keywords: 79, ats: 76 },
        suggestions: ["Add quantifiable achievements", "Include industry keywords", "Optimize for ATS"],
        missingKeywords: ["React", "Node.js", "MongoDB"],
      });
    }, 1500);
  });
}

export async function analyzeJobMatch(resumeText, jobDescription) {
  console.log('[API] analyzeJobMatch called');
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        matchPercentage: 85,
        matchedSkills: ["JavaScript", "React", "Python"],
        missingSkills: ["TypeScript", "AWS"],
        recommendations: ["Add TypeScript experience", "Highlight cloud skills"],
      });
    }, 1500);
  });
}

export async function analyzeSkillGap(currentSkills, targetRole) {
  console.log('[API] analyzeSkillGap called');
  
  // Optionally use AI for skill gap analysis:
  /*
  const systemPrompt = `You are a career development expert. Analyze skill gaps and provide learning recommendations.`;
  const userMessage = `Current skills: ${currentSkills.join(', ')}\nTarget role: ${targetRole}`;
  return await callOpenRouterAI(systemPrompt, userMessage);
  */
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        missingSkills: [
          { name: "TypeScript", importance: "high", estimatedTime: "2 weeks" },
          { name: "Docker", importance: "high", estimatedTime: "2 weeks" }
        ],
        recommendations: ["Complete TypeScript certification", "Practice Docker"],
        marketDemand: 87,
        salaryImpact: "+15%"
      });
    }, 1500);
  });
}

export async function generateResume(userData, template = "professional") {
  console.log('[API] generateResume called');
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        content: "Generated resume content",
        format: "pdf",
        downloadUrl: "/api/resumes/download/123"
      });
    }, 2000);
  });
}