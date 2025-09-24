"use client";

import { useState } from "react";

type Question = {
  text: string;
  topic: string;
  marks: number;
  difficulty: string;
};

interface Props {
  questions: Question[];
}

export default function PracticeMode({ questions }: Props) {
  const [index, setIndex] = useState(0);
  const [answered, setAnswered] = useState<Set<number>>(new Set());

  const next = () => setIndex((i) => (i + 1) % questions.length);
  const prev = () => setIndex((i) => (i - 1 + questions.length) % questions.length);
  const markAnswered = () => setAnswered((prev) => new Set(prev).add(index));

  return (
    <div className="p-4 bg-gray-50 rounded shadow">
      {questions.length > 0 ? (
        <>
          <h2 className="font-semibold mb-2">
            Q{index + 1}. {questions[index].text}
          </h2>
          <p className="text-sm text-gray-600">
            Topic: {questions[index].topic} | Marks: {questions[index].marks} | Difficulty: {questions[index].difficulty}
          </p>
          <div className="mt-4 flex gap-2">
            <button
              onClick={prev}
              className="bg-gray-200 text-gray-900 px-4 py-2 rounded hover:bg-gray-300"
            >
              Prev
            </button>
            <button
              onClick={next}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Next
            </button>
            <button
              onClick={markAnswered}
              className={`px-4 py-2 rounded ${answered.has(index) ? 'bg-blue-400 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
            >
              {answered.has(index) ? 'Answered' : 'Mark as Answered'}
            </button>
          </div>
        </>
      ) : (
        <p>No questions available</p>
      )}
    </div>
  );
}
