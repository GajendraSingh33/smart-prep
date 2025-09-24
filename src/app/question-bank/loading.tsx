// app/question-bank/loading.tsx
import React from "react";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-gray-50">
      <div className="flex flex-col items-center space-y-4">
        {/* Spinner */}
        <svg
          className="animate-spin h-12 w-12 text-blue-600"
          viewBox="0 0 24 24"
          role="status"
          aria-label="Loading"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>

        {/* Message */}
        <p className="text-sm text-gray-600">Fetching questions…</p>
      </div>
    </div>
  );
}
