// src/lib/roleFitAnalyzer.ts
// Very basic mock logic for role suggestion based on keywords
export function detectTopRoles(resume: string): { role: string; fit: number }[] {
  const keywords = resume.toLowerCase();
  const roles = [
    { role: 'AI Engineer', keywords: ['machine learning', 'deep learning', 'python', 'tensorflow'] },
    { role: 'Frontend Developer', keywords: ['react', 'javascript', 'css', 'html'] },
    { role: 'Backend Developer', keywords: ['node', 'express', 'api', 'database'] },
    { role: 'Data Scientist', keywords: ['pandas', 'numpy', 'data analysis', 'statistics'] },
    { role: 'ML Intern', keywords: ['model', 'train', 'sklearn'] },
  ];

  return roles
    .map(({ role, keywords: kw }) => ({
      role,
      fit: kw.reduce((score, k) => (keywords.includes(k) ? score + 20 : score), 0),
    }))
    .sort((a, b) => b.fit - a.fit)
    .slice(0, 3);
}
