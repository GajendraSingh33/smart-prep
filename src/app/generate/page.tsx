// app/generate/page.tsx
"use client";

import React, { useState } from "react";
import InputForm from "../../../components/InputForm";
import QuestionPreview from "../../../components/QuestionPreview";
import PdfDownloadButton from "../../../components/PdfDownloadButton";

interface Question {
  id: string;
  text: string;
  marks: number;
  topic: string;
  difficulty: string;
}

export default function GeneratePage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (payload: FormData) => {
    setLoading(true);
    setError(null);
    try {
      let extractedContent = "";
      const files = payload.getAll("files") as File[];
      if (files && files.length > 0) {
        const uploadFd = new FormData();
        for (const f of files) uploadFd.append("files", f);
        const upRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadFd,
          cache: "no-store",
        });
        if (upRes.ok) {
          const up = await upRes.json();
          extractedContent = up.extractedContent || "";
        }
      }

      const syllabus = String(payload.get("syllabus") || "").trim();
      const genRes = await fetch("/api/generate2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ syllabus, extractedContent }),
        cache: "no-store",
      });

      if (!genRes.ok) {
        const bodyText = await genRes.text().catch(() => "");
        throw new Error(
          `Failed to generate (${genRes.status})${
            bodyText ? `: ${bodyText.slice(0, 160)}` : ""
          }`
        );
      }

      const data: { success: boolean; questions: Question[] } =
        await genRes.json();
      setQuestions(data.questions || []);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToBank = async (question: Question) => {
    try {
      const res = await fetch("/api/question-bank/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      if (!res.ok) throw new Error("Failed to add question");
      alert("Question added to bank!");
    } catch (err: any) {
      alert(err.message || "Error adding question");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-600 flex flex-col items-center justify-start p-8">
      {/* Header */}
      <h1 className="text-5xl font-extrabold text-white drop-shadow-lg mb-10 tracking-wide text-center">
        🎓 Generate Exam Questions
      </h1>

      {/* Card container */}
      <div className="bg-white/95 backdrop-blur-md shadow-2xl rounded-3xl p-10 w-full max-w-3xl border border-purple-200">
        <h2 className="text-2xl font-bold text-purple-700 mb-6 text-center">
          Upload syllabus or files & let AI do the rest ✨
        </h2>

        <InputForm onSubmit={handleGenerate} />

        {loading && (
          <div className="mt-8 text-center">
            <p className="text-lg font-medium text-indigo-600 animate-pulse">
              ⚡ Generating smart questions...
            </p>
          </div>
        )}

        {error && (
          <div className="mt-6 text-center text-red-600 font-semibold bg-red-50 border border-red-300 rounded-lg p-3">
            ❌ {error}
          </div>
        )}

        {questions.length > 0 && (
          <div className="mt-10 space-y-6">
            <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-5 rounded-2xl shadow-inner">
              <QuestionPreview question={questions[0]} />
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
              {questions.map((q) => (
                <button
                  key={q.id}
                  onClick={() => handleAddToBank(q)}
                  className="bg-gradient-to-r from-green-400 to-emerald-500 hover:from-emerald-500 hover:to-green-400 text-white px-5 py-2 rounded-xl font-semibold shadow-md transition transform hover:scale-105"
                >
                  Save: {q.text.slice(0, 24)}
                  {q.text.length > 24 ? "…" : ""}
                </button>
              ))}
              <PdfDownloadButton
                questions={questions}
                fileName="questions.pdf"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
