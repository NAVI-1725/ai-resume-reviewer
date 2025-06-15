
// src/app/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import ResumeInput from '@/components/ResumeInput';
import RoleSelect from '@/components/RoleSelect';
import { motion } from 'framer-motion';

export default function HomePage() {
  const router = useRouter();

  const [resume, setResume] = useState('');
  const [role, setRole] = useState('');
  const [inputMode, setInputMode] = useState<'paste' | 'upload' | 'link' | 'drive' | ''>('');

  useEffect(() => {
    fetch('/samples/resume1.txt')
      .then((res) => res.text())
      .then((text) => {
        if (!resume.trim()) setResume(text);
      });
  }, []);

  const handleReview = async () => {
    if (!resume.trim()) {
      alert('Please provide your resume.');
      return;
    }

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume, role }),
      });

      if (!res.ok) {
        const errorBody = await res.text();
        console.error('API failed. Response body:', errorBody);
        throw new Error('API failed');
      }

      const data = await res.json();
      sessionStorage.setItem('reviewResult', JSON.stringify(data));
      sessionStorage.setItem('resume', resume);
      sessionStorage.setItem('role', role);
      router.push('/review');
    } catch (err) {
      console.error('Error:', err);
      alert('Failed to analyze resume. Try again.');
    }
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-[120%] h-[120%] animate-pulse bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-20 rounded-full blur-[100px] rotate-45"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-2xl w-full p-10 rounded-3xl shadow-2xl border border-white/30 bg-white/70 backdrop-blur-lg space-y-6"
      >
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-extrabold text-center text-gray-900 drop-shadow-sm"
        >
          AI RESUME REVIEWER
        </motion.h1>
{/* in src\app\page.tsx */}
        <div className="space-y-2 text-center">
          <p className="text-md font-medium text-gray-800">How would you like to provide your resume?</p>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {['paste', 'upload', 'link', 'drive'].map((mode) => (
              <button
                key={mode}
                // src\app\page.tsx
                onClick={() => setInputMode(mode as 'paste' | 'upload' | 'link' | 'drive')}
                className={`py-2 rounded-xl text-sm font-semibold transition ${
                  inputMode === mode
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {mode === 'paste' && 'Paste Text'}
                {mode === 'upload' && 'Upload File'}
                {mode === 'link' && 'Paste Link'}
                {mode === 'drive' && 'Google Drive'}
              </button>
            ))}
          </div>
        </div>

        {inputMode === 'paste' && <ResumeInput value={resume} onChange={setResume} />}

        {inputMode === 'upload' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Resume (.txt or .pdf)</label>
            <input
              type="file"
              accept=".txt,.pdf"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = () => setResume(reader.result as string);
                  reader.readAsText(file);
                }
              }}
              className="block w-full text-sm text-gray-700"
            />
          </div>
        )}

        {inputMode === 'link' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Paste Resume URL</label>
            <input
              type="url"
              placeholder="https://example.com/resume.txt"
              onBlur={async (e) => {
                const url = e.target.value;
                if (url) {
                  const res = await fetch(url);
                  const text = await res.text();
                  setResume(text);
                }
              }}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800"
            />
          </div>
        )}
{/* in src\app\page.tsx */}
        {inputMode === 'drive' && (
          <div className="text-sm">
            <button
              type="button"
              onClick={() => {
                const script = document.createElement('script');
                script.src = 'https://apis.google.com/js/api.js';
                script.onload = () => {
                  window.gapi.load('picker', () => {
                    const picker = new window.google.picker.PickerBuilder()
                      .addView(window.google.picker.ViewId.DOCS)
                      .setOAuthToken('YOUR_OAUTH_ACCESS_TOKEN')
                      .setDeveloperKey('YOUR_API_KEY')
                      .setCallback((data: any) => {
                        if (data.action === window.google.picker.Action.PICKED) {
                          const fileId = data.docs[0].id;
                          fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
                            headers: { Authorization: 'Bearer YOUR_OAUTH_ACCESS_TOKEN' }
                          })
                            .then((res) => res.text())
                            .then((text) => setResume(text));
                        }
                      })
                      .build();
                    picker.setVisible(true);
                  });
                };
                document.body.appendChild(script);
              }}
              className="text-blue-600 underline hover:text-blue-800"
            >
              Import from Google Drive
            </button>
          </div>
        )}

        <RoleSelect value={role} onChange={setRole} />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleReview}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-black to-gray-800 text-white font-semibold shadow-lg transition duration-200"
        >
          Review Resume
        </motion.button>
      </motion.div>
    </main>
  );
}
