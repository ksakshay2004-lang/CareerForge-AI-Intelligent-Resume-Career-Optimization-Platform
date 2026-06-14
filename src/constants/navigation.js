export const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "📊", group: "main" },
  { id: "resume", label: "Resume Builder", icon: "📄", group: "tools" },
  { id: "score", label: "Resume Score", icon: "📈", group: "tools" },
  { id: "skillgap", label: "Skill Gap Analysis", icon: "🔍", group: "tools" },
  { id: "linkedin", label: "LinkedIn Optimizer", icon: "🔗", group: "tools" },
  { id: "interview", label: "Mock Interview", icon: "🎤", group: "tools" },
];

export const SCREENS = {
  dashboard: { title: "Dashboard", component: "Dashboard" },
  resume: { title: "Resume Builder", component: "ResumeBuilder" },
  score: { title: "Resume Score", component: "ScoreAnalyzer" },
  skillgap: { title: "Skill Gap", component: "SkillGap" },
  linkedin: { title: "LinkedIn Optimizer", component: "LinkedInOptimizer" },
  interview: { title: "Mock Interview", component: "MockInterview" },
};