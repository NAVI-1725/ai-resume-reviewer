// src/lib/openai.ts
export const generatePrompt = (resume: string, selectedRole?: string) => {
  return `
You are a senior recruiter. Analyze the following resume${selectedRole ? ` for the role of ${selectedRole}` : ''}:

${resume}

You must return ONLY a valid JSON object in this exact format — no extra commentary, no explanation, no notes:

{
  "topRoles": [
    { "role": "AI Engineer", "fit": 87 },
    { "role": "Data Scientist", "fit": 78 },
    { "role": "ML Intern", "fit": 70 }
  ],
  "strengths": ["Strong Python skills", "Experience with ML models"],
  "weaknesses": ["No production deployment listed"],
  "skillMatch": ["Python", "TensorFlow", "NLP"],
  "roleSummary": "Highly suitable for AI/ML based roles.",
  "score": 85
}
`;
};
