"use client";

interface Props {
  onFilter: (filters: { topic?: string; difficulty?: string }) => void;
}

export default function QuestionFilter({ onFilter }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFilter({ [name]: value });
  };

  return (
    <div className="flex gap-4 mb-4">
      <select
        name="topic"
        className="border p-2 rounded"
        onChange={handleChange}
      >
        <option value="">All Topics</option>
        <option value="Math">Math</option>
        <option value="Physics">Physics</option>
        <option value="Chemistry">Chemistry</option>
      </select>
      <select
        name="difficulty"
        className="border p-2 rounded"
        onChange={handleChange}
      >
        <option value="">All Difficulties</option>
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>
    </div>
  );
}
