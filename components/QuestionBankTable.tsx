"use client";

type Question = {
  text: string;
  topic: string;
  marks: number;
  difficulty: string;
};

interface Props {
  questions: Question[];
}

export default function QuestionBankTable({ questions }: Props) {
  return (
    <table className="w-full border-collapse border border-gray-300 text-sm">
      <thead>
        <tr className="bg-gray-100">
          <th className="border px-2 py-1">#</th>
          <th className="border px-2 py-1">Question</th>
          <th className="border px-2 py-1">Topic</th>
          <th className="border px-2 py-1">Marks</th>
          <th className="border px-2 py-1">Difficulty</th>
        </tr>
      </thead>
      <tbody>
        {questions.map((q, i) => (
          <tr key={i}>
            <td className="border px-2 py-1">{i + 1}</td>
            <td className="border px-2 py-1">{q.text}</td>
            <td className="border px-2 py-1">{q.topic}</td>
            <td className="border px-2 py-1">{q.marks}</td>
            <td className="border px-2 py-1">{q.difficulty}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
