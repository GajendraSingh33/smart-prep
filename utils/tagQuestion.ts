// utils/tagQuestions.ts

export type Question = {
  id: string;
  question: string;
  topic?: string;
  marks: number;
  difficulty?: "easy" | "medium" | "hard";
};

export function autoTag(question: Question): Question {
  let difficulty: "easy" | "medium" | "hard";
  if (question.marks <= 2) {
    difficulty = "easy";
  } else if (question.marks <= 5) {
    difficulty = "medium";
  } else {
    difficulty = "hard";
  }

  // Topic inference based on keywords
  const qText = question.question.toLowerCase();
  let topic = question.topic;

  if (!topic) {
    if (qText.includes("network")) {
      topic = "Computer Networks";
    } else if (qText.includes("os") || qText.includes("operating system")) {
      topic = "Operating Systems";
    } else if (qText.includes("dbms") || qText.includes("database")) {
      topic = "DBMS";
    } else {
      topic = "General";
    }
  }

  return {
    ...question,
    difficulty,
    topic,
  };
}
