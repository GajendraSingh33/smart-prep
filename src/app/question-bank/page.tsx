// app/question-bank/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import QuestionBankTable from "../../../components/QuestionBankTable";
import QuestionFilter, { FilterOptions } from "../../../components/QuestionFilter";

interface Question {
  id: string;
  text: string;
  marks: number;
  topic?: string;
  difficulty?: string;
}

export default function QuestionBankPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = async (filters?: FilterOptions) => {
    setLoading(true);
    setError(null);
    try {
      const query = filters
        ? `?topic=${filters.topic || ""}&difficulty=${filters.difficulty || ""}&marks=${filters.marks || ""}`
        : "";
      const res = await fetch(`/api/question-bank/search${query}`);
      if (!res.ok) throw new Error("Failed to fetch questions");
      const data: { success: boolean; results: Question[] } = await res.json();
      setQuestions(data.results || []);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-10 text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-3">
            Question <span className="text-indigo-600">Bank</span>
          </h1>
          <p className="text-xl text-gray-800 font-semibold">
            Explore and manage your comprehensive collection of exam questions
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-indigo-600 rounded-xl shadow-xl p-6 transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-semibold text-white">Total Questions</p>
                <p className="text-4xl font-bold text-white">{questions.length}</p>
              </div>
              <div className="bg-white/30 backdrop-blur rounded-full p-3">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-purple-600 rounded-xl shadow-xl p-6 transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-semibold text-white">Topics Covered</p>
                <p className="text-4xl font-bold text-white">
                  {new Set(questions.map(q => q.topic).filter(Boolean)).size}
                </p>
              </div>
              <div className="bg-white/30 backdrop-blur rounded-full p-3">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-green-600 rounded-xl shadow-xl p-6 transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-semibold text-white">Avg. Marks</p>
                <p className="text-4xl font-bold text-white">
                  {questions.length > 0
                    ? (questions.reduce((acc, q) => acc + q.marks, 0) / questions.length).toFixed(1)
                    : "0"}
                </p>
              </div>
              <div className="bg-white/30 backdrop-blur rounded-full p-3">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white border-2 border-gray-300 rounded-xl shadow-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Filter Questions</h2>
          <div className="filter-scope">
            <QuestionFilter onFilter={fetchQuestions} />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-indigo-600"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-8 w-8 bg-indigo-600 rounded-full animate-pulse"></div>
              </div>
            </div>
            <p className="mt-4 text-xl font-bold text-gray-900 animate-pulse">
              Loading questions...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border-2 border-red-400 rounded-lg p-6 mb-8">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-xl font-bold text-red-900">Error</h3>
                <p className="text-lg font-semibold text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Questions Table */}
        {!loading && questions.length > 0 && (
          <div className="bg-white border-2 border-gray-300 rounded-xl shadow-xl overflow-hidden">
            <div className="px-6 py-4 bg-gray-200 border-b-2 border-gray-300">
              <h2 className="text-xl font-bold text-gray-900">Questions List</h2>
            </div>
            {/* Scope wrapper so we can force text colors and opacity */}
            <div className="qb-scope">
              <QuestionBankTable questions={questions} />
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && questions.length === 0 && !error && (
          <div className="bg-white border-2 border-gray-300 rounded-xl shadow-xl p-12 text-center">
            <div className="mx-auto w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No questions found</h3>
            <p className="text-lg font-semibold text-gray-800 mb-6">
              Try adjusting your filters or add some questions to get started.
            </p>
            <button className="inline-flex items-center px-6 py-3 border-2 border-transparent text-lg font-bold rounded-lg shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
              </svg>
              Add New Question
            </button>
          </div>
        )}
      </div>

      {/* Global styles to force dark placeholders and visible table text */}
      <style jsx global>{`
        /* ----- Filter placeholders & inputs ----- */
        .filter-scope input::placeholder,
        .filter-scope textarea::placeholder {
          color: #111827 !important; /* gray-900 */
          opacity: 1 !important;
        }
        .filter-scope input,
        .filter-scope textarea,
        .filter-scope select {
          color: #111827 !important;
        }
        .filter-scope select:invalid,
        .filter-scope select option[disabled],
        .filter-scope select option[value=""] {
          color: #1f2937 !important; /* gray-800 for placeholder-like options */
        }
        /* react-select (if used inside QuestionFilter) */
        .filter-scope .react-select__placeholder,
        .filter-scope .Select__placeholder,
        .filter-scope .rs__placeholder {
          color: #111827 !important;
        }
        .filter-scope .react-select__single-value,
        .filter-scope .react-select__input-container {
          color: #111827 !important;
        }
        .filter-scope .react-select__control {
          border-color: #9ca3af !important; /* gray-400 */
          color: #111827 !important;
        }
        .filter-scope .react-select__input input::placeholder {
          color: #111827 !important;
        }

        /* ----- Question list visibility fixes ----- */
        .qb-scope,
        .qb-scope * {
          color: #111827 !important;   /* force dark text everywhere */
          opacity: 1 !important;       /* kill any low-opacity styles */
        }
        .qb-scope table {
          width: 100%;
          border-collapse: collapse;
        }
        .qb-scope thead th {
          background-color: #e5e7eb !important; /* gray-200 */
          color: #111827 !important;
          font-weight: 700 !important;
          border-bottom: 2px solid #d1d5db !important; /* gray-300 */
        }
        .qb-scope tbody tr {
          background-color: #ffffff !important;
        }
        .qb-scope tbody tr:nth-child(even) {
          background-color: #f9fafb !important; /* gray-50 */
        }
        .qb-scope th,
        .qb-scope td {
          border-bottom: 1px solid #e5e7eb !important;
        }
        /* If using shadcn/ui or other muted classes */
        .qb-scope .text-muted-foreground,
        .qb-scope .text-gray-400,
        .qb-scope .text-gray-500,
        .qb-scope .text-gray-600 {
          color: #111827 !important;
        }
      `}</style>
    </div>
  );
}