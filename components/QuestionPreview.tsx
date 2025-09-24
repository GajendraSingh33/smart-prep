"use client";

export interface PreviewQuestion {
  text: string;
  topic?: string;
  marks: number;
  difficulty?: string;
}

interface Props {
  question: PreviewQuestion;
}

export default function QuestionPreview({ question }: Props) {
  return (
    <div className="border border-gray-200 rounded-lg shadow-sm p-4 bg-white">
      <h3 className="font-semibold mb-2">Preview</h3>
      <p className="mb-3">{question.text}</p>
      <div className="text-sm text-gray-600 space-y-1">
        <p><span className="font-medium">Topic:</span> {question.topic}</p>
        <p><span className="font-medium">Marks:</span> {question.marks}</p>
        <p><span className="font-medium">Difficulty:</span> {question.difficulty}</p>
      </div>
    </div>
  );
}
