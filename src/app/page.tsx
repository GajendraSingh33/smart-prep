"use client";

import React from "react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-600 flex flex-col items-center justify-center p-8">
      {/* Title */}
      <h1 className="text-6xl font-extrabold text-white drop-shadow-lg mb-6 text-center">
        🎓 Exam Helper Bot
      </h1>

      {/* Subtitle */}
      <p className="text-lg sm:text-xl text-indigo-100 mb-10 text-center max-w-2xl">
        Generate probable exam questions, practice effectively, and download
        custom question papers as PDFs — all in one place! 🚀
      </p>

      {/* Glassmorphism Card */}
      <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl p-10 w-full max-w-xl text-center">
        <h2 className="text-2xl font-bold text-purple-700 mb-6">
          Start your journey ✨
        </h2>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {/* Generate Questions Button */}
          <Link
            href="/generate"
            className="px-6 py-3 rounded-xl font-semibold text-white 
                       bg-gradient-to-r from-green-400 to-emerald-500 
                       hover:from-emerald-500 hover:to-green-400 
                       shadow-lg transform hover:scale-105 transition"
          >
            🚀 Generate Questions
          </Link>

          {/* Question Bank Button */}
          <Link
            href="/question-bank"
            className="px-6 py-3 rounded-xl font-semibold text-white 
                       bg-gradient-to-r from-blue-400 to-indigo-500 
                       hover:from-indigo-500 hover:to-blue-400 
                       shadow-lg transform hover:scale-105 transition"
          >
            📚 Question Bank
          </Link>

          {/* Practice Button */}
          <Link
            href="/practice"
            className="px-6 py-3 rounded-xl font-semibold text-white 
                       bg-gradient-to-r from-pink-400 to-purple-500 
                       hover:from-purple-500 hover:to-pink-400 
                       shadow-lg transform hover:scale-105 transition"
          >
            📝 Practice Mode
          </Link>
        </div>
      </div>
    </div>
  );
}
