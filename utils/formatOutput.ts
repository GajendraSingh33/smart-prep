import { v4 as uuidv4 } from 'uuid';

export interface Question {
  id: string;
  text: string;
  topic: string;
  marks: number;
  difficulty: string;
}

/**
 * Extracts marks from text like "(5 marks)" or "(2 mark)" or "5 marks"
 */
function extractMarks(text: string): { marks: number; cleanText: string } {
  // Patterns to match marks
  const patterns = [
    /\((\d+)\s*marks?\)/i,           // (5 marks) or (5 mark)
    /\[(\d+)\s*marks?\]/i,           // [5 marks] or [5 mark]
    /(\d+)\s*marks?\b/i,             // 5 marks or 5 mark
    /\((\d+)\s*pts?\)/i,             // (5 pts) or (5 pt)
    /(\d+)\s*pts?\b/i,               // 5 pts or 5 pt
    /\((\d+)\)/                      // (5)
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const marks = parseInt(match[1], 10);
      const cleanText = text.replace(pattern, '').trim();
      return { marks, cleanText };
    }
  }
  
  // Default to 1 mark if no marks found
  return { marks: 1, cleanText: text };
}

/**
 * Extracts topic from text after dash or hyphen
 */
function extractTopic(text: string): { topic: string; cleanText: string } {
  // Look for patterns like "- Topic" or "– Topic" or "| Topic"
  const patterns = [
    /\s*[-–—|]\s*([^-–—|]+)$/,       // Topic at the end after dash
    /\s*[-–—|]\s*([^-–—|]+)\s*[-–—|]/,  // Topic in the middle between dashes
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const topic = match[1].trim();
      const cleanText = text.replace(pattern, '').trim();
      return { topic, cleanText };
    }
  }
  
  // Try to extract topic from common patterns
  const topicKeywords = [
    'topic:', 'subject:', 'area:', 'category:', 'section:'
  ];
  
  for (const keyword of topicKeywords) {
    const regex = new RegExp(`${keyword}\\s*([^\\n\\r]+)`, 'i');
    const match = text.match(regex);
    if (match) {
      const topic = match[1].trim();
      const cleanText = text.replace(regex, '').trim();
      return { topic, cleanText };
    }
  }
  
  // Default topic
  return { topic: 'General', cleanText: text };
}

/**
 * Infers difficulty based on marks
 */
function inferDifficulty(marks: number): string {
  if (marks <= 2) return 'easy';
  if (marks <= 5) return 'medium';
  return 'hard';
}

/**
 * Extracts difficulty from text if explicitly mentioned
 */
function extractDifficulty(text: string): { difficulty: string | null; cleanText: string } {
  const difficultyPatterns = [
    { pattern: /\b(easy|simple|basic)\b/i, difficulty: 'easy' },
    { pattern: /\b(medium|moderate|intermediate)\b/i, difficulty: 'medium' },
    { pattern: /\b(hard|difficult|complex|advanced|challenging)\b/i, difficulty: 'hard' },
  ];
  
  for (const { pattern, difficulty } of difficultyPatterns) {
    const match = text.match(pattern);
    if (match) {
      const cleanText = text.replace(pattern, '').trim();
      return { difficulty, cleanText };
    }
  }
  
  return { difficulty: null, cleanText: text };
}

/**
 * Cleans question text by removing numbering and extra whitespace
 */
function cleanQuestionText(text: string): string {
  // Remove common question numbering patterns
  const numberingPatterns = [
    /^\d+\.\s*/,                     // 1. or 2. 
    /^\d+\)\s*/,                     // 1) or 2)
    /^\(\d+\)\s*/,                   // (1) or (2)
    /^[a-z]\.\s*/i,                  // a. or A.
    /^[a-z]\)\s*/i,                  // a) or A)
    /^[ivx]+\.\s*/i,                 // i. or II. (roman numerals)
    /^Question\s*\d*:?\s*/i,         // Question 1: or Question:
    /^Q\d*:?\s*/i,                   // Q1: or Q:
  ];
  
  let cleaned = text.trim();
  
  for (const pattern of numberingPatterns) {
    cleaned = cleaned.replace(pattern, '');
  }
  
  // Clean up extra whitespace
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  
  // Ensure question ends with question mark if it's a question
  if (cleaned.toLowerCase().startsWith('what') || 
      cleaned.toLowerCase().startsWith('how') || 
      cleaned.toLowerCase().startsWith('why') || 
      cleaned.toLowerCase().startsWith('when') || 
      cleaned.toLowerCase().startsWith('where') || 
      cleaned.toLowerCase().includes('?')) {
    if (!cleaned.endsWith('?')) {
      cleaned += '?';
    }
  }
  
  return cleaned;
}

/**
 * Parses a single question line into a Question object
 */
function parseQuestionLine(line: string): Question | null {
  if (!line.trim()) return null;
  
  let text = line.trim();
  
  // Extract marks
  const { marks, cleanText: textAfterMarks } = extractMarks(text);
  text = textAfterMarks;
  
  // Extract topic
  const { topic, cleanText: textAfterTopic } = extractTopic(text);
  text = textAfterTopic;
  
  // Extract explicit difficulty
  const { difficulty: explicitDifficulty, cleanText: textAfterDifficulty } = extractDifficulty(text);
  text = textAfterDifficulty;
  
  // Clean the question text
  const cleanedText = cleanQuestionText(text);
  
  // Skip if text is too short or invalid
  if (cleanedText.length < 5) {
    return null;
  }
  
  // Determine difficulty
  const difficulty = explicitDifficulty || inferDifficulty(marks);
  
  return {
    id: uuidv4(),
    text: cleanedText,
    topic: topic || 'General',
    marks,
    difficulty: difficulty.toLowerCase()
  };
}

/**
 * Main function to format OpenAI output into Question array
 */
export function formatOutput(rawText: string): Question[] {
  if (!rawText || typeof rawText !== 'string') {
    console.warn('Invalid input to formatOutput:', rawText);
    return [];
  }
  
  const questions: Question[] = [];
  
  // Split by lines and clean up
  const lines = rawText
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.length > 0);
  
  // Alternative split patterns for different AI response formats
  const questionSeparators = [
    /\d+\./,                         // 1. 2. 3.
    /Question\s*\d*/i,               // Question 1, Question 2
    /Q\d*/i,                         // Q1, Q2
    /^\d+\)/,                        // 1) 2) 3)
  ];
  
  // Try to parse each line as a potential question
  for (const line of lines) {
    // Skip obvious non-question lines
    if (line.length < 10 || 
        line.toLowerCase().includes('here are') ||
        line.toLowerCase().includes('questions:') ||
        line.toLowerCase().includes('sample questions') ||
        line.startsWith('---') ||
        line.startsWith('===')) {
      continue;
    }
    
    const question = parseQuestionLine(line);
    if (question) {
      questions.push(question);
    }
  }
  
  // If no questions found, try parsing the entire text as one block
  if (questions.length === 0) {
    // Split by double line breaks or question patterns
    const blocks = rawText.split(/\n\n+|\d+\.\s+/).filter(block => block.trim().length > 10);
    
    for (const block of blocks) {
      const question = parseQuestionLine(block);
      if (question) {
        questions.push(question);
      }
    }
  }
  
  // Final validation and deduplication
  const validQuestions = questions.filter((question, index, array) => {
    // Remove duplicates based on text similarity
    const isDuplicate = array.slice(0, index).some(existing => 
      existing.text.toLowerCase().trim() === question.text.toLowerCase().trim()
    );
    
    return !isDuplicate && question.text.length >= 5;
  });
  
  console.log(`Formatted ${validQuestions.length} questions from AI output`);
  return validQuestions;
}

/**
 * Advanced formatting with custom patterns
 */
export function formatOutputAdvanced(rawText: string, customPatterns?: {
  markPatterns?: RegExp[];
  topicPatterns?: RegExp[];
  difficultyPatterns?: { pattern: RegExp; difficulty: string }[];
}): Question[] {
  // Use custom patterns if provided
  if (customPatterns) {
    // Implementation would extend the base formatOutput with custom patterns
    // This is a placeholder for advanced customization
  }
  
  return formatOutput(rawText);
}

/**
 * Utility to validate and clean a batch of questions
 */
export function validateAndCleanQuestions(questions: Question[]): Question[] {
  return questions.filter(question => {
    // Basic validation
    if (!question.text || !question.topic || !question.marks) {
      return false;
    }
    
    // Clean up the question
    question.text = question.text.trim();
    question.topic = question.topic.trim();
    question.difficulty = question.difficulty.toLowerCase();
    
    // Ensure valid difficulty
    if (!['easy', 'medium', 'hard'].includes(question.difficulty)) {
      question.difficulty = inferDifficulty(question.marks);
    }
    
    return true;
  });
}