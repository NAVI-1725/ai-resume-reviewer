// src/hooks/useResumeInput.ts
import { useState } from 'react';

export function useResumeInput() {
  const [resume, setResume] = useState('');
  const [role, setRole] = useState('');
  type ReviewResult = {
  topRoles: { role: string; fit: number }[];
  strengths: string[];
  weaknesses: string[];
  skillMatch: string[];
  roleSummary: string;
  score: number;
};

const [result, setResult] = useState<ReviewResult | null>(null);

  const handleReview = async (onSuccess?: () => void, onError?: () => void) => {
    if (!resume.trim()) {
      alert('Please paste your resume.');
      return;
    }

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resume, role }),
      });

      if (!res.ok) throw new Error('API failed');

      const data = await res.json();

      sessionStorage.setItem('reviewResult', JSON.stringify(data));
      sessionStorage.setItem('resume', resume);
      sessionStorage.setItem('role', role);

      setResult(data);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Error:', err);
      alert('Failed to analyze resume. Try again.');
      if (onError) onError();
    }
  };

  return {
    resume,
    setResume,
    role,
    setRole,
    result,
    handleReview,
  };
}
