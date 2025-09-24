"use client";

// Define the Question interface here if not available elsewhere
export interface Question {
  text: string;
  topic: string;
  marks: number;
  difficulty: string;
}

interface Props {
  questions: Question[];
}

export default function QuestionPreview({ questions }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[70vh] overflow-y-auto p-4">
      {questions.map((q, index) => (
        <div
          key={index}
          className="border border-gray-200 rounded-lg shadow-sm p-4 bg-white hover:shadow-md transition"
        >
          <h3 className="font-semibold mb-2">Q{index + 1}.</h3>
          <p className="mb-3">{q.text}</p>
          <div className="text-sm text-gray-600 space-y-1">
            <p><span className="font-medium">Topic:</span> {q.topic}</p>
            <p><span className="font-medium">Marks:</span> {q.marks}</p>
            <p><span className="font-medium">Difficulty:</span> {q.difficulty}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
