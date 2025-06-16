// src/app/review/page.tsx
'use client';

import { useEffect, useState } from 'react';
import FeedbackCard from '@/components/FeedbackCard';
import { motion } from 'framer-motion';

export default function ReviewPage() {
  type ReviewResult = {
  topRoles: { role: string; fit: number }[];
  strengths: string[];
  weaknesses: string[];
  skillMatch: string[];
  roleSummary: string;
  score: number;
};

const [data, setData] = useState<ReviewResult | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem('reviewResult');
    if (raw) {
      setData(JSON.parse(raw));
    }
  }, []);

  if (!data) {
    return <p className="text-center py-20">Loading review...</p>;
  }

  return (
    <main className="min-h-screen px-4 py-10 bg-gray-50 flex flex-col items-center">
      <div className="max-w-4xl w-full space-y-6">
        <motion.h2
          className="text-3xl font-bold text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Resume Review Summary
        </motion.h2>

        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
            {/* src\app\review\page.tsx */}
          <FeedbackCard title="Top Role Matches" items={data.topRoles?.map((r) => `${r.role} - ${r.fit}%`) || []} />
          <FeedbackCard title="Strengths" items={data.strengths} />
          <FeedbackCard title="Weaknesses / Gaps" items={data.weaknesses} />
          <FeedbackCard title="Skill & Keyword Match" items={data.skillMatch} />
          <FeedbackCard title="Role Fit Summary" items={data.roleSummary} />
          <FeedbackCard title="Final Resume Score (/100)" items={[data.score.toString()]} />
        </motion.div>
      </div>
    </main>
  );
}
