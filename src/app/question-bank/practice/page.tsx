// app/practice/page.tsx
"use client";

import { useEffect, useState } from "react";
import PracticeMode from "../../../../components/PracticeMode";

type Question = {
  id: string;
  text: string;
  topic: string;
  marks: number;
  difficulty: string;
};

export default function PracticePage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/question-bank/random?count=5");
      if (!res.ok) {
        throw new Error(`Failed to fetch questions (status: ${res.status})`);
      }

      const data = await res.json();
      setQuestions(data.questions || data.randomQuestions || []);
    } catch (err: any) {
      console.error(err);
      setError("Failed to load questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const topicsCount = new Set(questions.map((q) => q.topic).filter(Boolean)).size;
  const avgMarks =
    questions.length > 0
      ? (questions.reduce((acc, q) => acc + q.marks, 0) / questions.length).toFixed(1)
      : "0";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-3">
            Practice <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Mode</span>
          </h1>
          <p className="text-xl text-gray-800 font-semibold">
            Sharpen your skills with a fresh set of questions each time
          </p>
        </div>

        {/* Quick Stats + Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-xl p-6 text-white">
            <p className="text-sm font-medium opacity-90">Questions in this set</p>
            <p className="text-4xl font-extrabold mt-1">{questions.length || 5}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-xl p-6 text-white">
            <p className="text-sm font-medium opacity-90">Topics Covered</p>
            <p className="text-4xl font-extrabold mt-1">{topicsCount}</p>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-xl p-6 text-white">
            <p className="text-sm font-medium opacity-90">Avg. Marks</p>
            <p className="text-4xl font-extrabold mt-1">{avgMarks}</p>
          </div>

          <div className="flex items-stretch">
            <button
              onClick={fetchQuestions}
              disabled={loading}
              className={`w-full rounded-xl shadow-xl text-white text-lg font-bold transition-all duration-200
                ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"}
                px-6`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3 py-6">
                  <span className="h-5 w-5 border-4 border-white/60 border-t-white rounded-full animate-spin" />
                  Getting New Set...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-3 py-6">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582M20 20v-5h-.581M20 9A7.966 7.966 0 0012 5c-2.21 0-4.208.895-5.657 2.343M4 15a7.966 7.966 0 008 4c2.21 0 4.208-.895 5.657-2.343" />
                  </svg>
                  Get New Set
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-indigo-600"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-8 w-8 bg-indigo-600 rounded-full animate-pulse"></div>
              </div>
            </div>
            <p className="mt-6 text-xl font-bold text-gray-900">Loading questions...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-100 border-2 border-red-400 rounded-xl p-6 mb-8">
            <div className="flex items-start">
              <svg className="h-6 w-6 text-red-700 mt-1 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v4m0 4h.01M4.93 4.93l14.14 14.14" />
              </svg>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-red-900">Failed to load questions</h3>
                <p className="text-lg font-semibold text-red-800 mt-1">{error}</p>
                <button
                  onClick={fetchQuestions}
                  className="mt-4 inline-flex items-center px-5 py-2.5 rounded-lg text-white font-bold bg-red-600 hover:bg-red-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Practice Content */}
        {!loading && !error && (
          <div className="bg-white border-2 border-gray-300 rounded-xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Your Practice Set</h2>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-gray-800 bg-gray-100 px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                {questions.length} questions
              </span>
            </div>

            {/* Scope to enforce visible text and numbers inside PracticeMode */}
            <div className="pm-scope text-gray-900">
              <PracticeMode questions={questions} />
            </div>

            <div className="mt-6 flex justify-end">
              <button
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white text-base font-bold transition-all duration-200
                ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}
                onClick={fetchQuestions}
                disabled={loading}
              >
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582M20 20v-5h-.581M20 9A7.966 7.966 0 0012 5c-2.21 0-4.208.895-5.657 2.343M4 15a7.966 7.966 0 008 4c2.21 0 4.208-.895 5.657-2.343" />
                </svg>
                Get New Set
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Global overrides so question numbers and text are always visible inside PracticeMode */}
      <style jsx global>{`
        /* Make all text and generated content dark and fully opaque */
        .pm-scope,
        .pm-scope * {
          color: #111827 !important; /* gray-900 */
        }
        .pm-scope p,
        .pm-scope span,
        .pm-scope li,
        .pm-scope h1,
        .pm-scope h2,
        .pm-scope h3,
        .pm-scope h4,
        .pm-scope h5,
        .pm-scope h6,
        .pm-scope small,
        .pm-scope strong,
        .pm-scope em,
        .pm-scope div {
          opacity: 1 !important;
        }
        /* Ensure numbers shown via ::marker or counters are visible */
        .pm-scope li::marker,
        .pm-scope ol > li::marker,
        .pm-scope ul > li::marker {
          color: #111827 !important;
          font-weight: 700 !important;
        }
        /* If numbers/text are injected via pseudo elements */
        .pm-scope *::before,
        .pm-scope *::after {
          color: #111827 !important;
          opacity: 1 !important;
        }
        /* If using prose or marker utilities */
        .pm-scope .prose :where(ol > li)::marker,
        .pm-scope .prose :where(ul > li)::marker {
          color: #111827 !important;
        }
        /* Typical muted utility classes overridden */
        .pm-scope .text-muted-foreground,
        .pm-scope .text-gray-400,
        .pm-scope .text-gray-500,
        .pm-scope .text-gray-600 {
          color: #111827 !important;
        }
        /* Inputs and placeholders, in case PracticeMode has any */
        .pm-scope input::placeholder,
        .pm-scope textarea::placeholder {
          color: #111827 !important;
          opacity: 1 !important;
        }
        .pm-scope input,
        .pm-scope textarea,
        .pm-scope select {
          color: #111827 !important;
        }
        /* Keep disabled button visual feedback */
        .pm-scope button[disabled] {
          opacity: 0.6 !important;
        }
      `}</style>
    </div>
  );
}