import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Define the Question interface
export interface Question {
  id: string;
  text: string;
  topic: string;
  marks: number;
  difficulty: string;
  tags?: string[];
  source?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Path to the questions.json file
const QUESTIONS_FILE_PATH = path.join(process.cwd(), 'data', 'questions.json');

/**
 * Ensures the data directory exists
 */
async function ensureDataDirectory(): Promise<void> {
  const dataDir = path.dirname(QUESTIONS_FILE_PATH);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

/**
 * Reads questions from questions.json file
 * Creates empty array if file doesn't exist
 */
export async function readQuestions(): Promise<Question[]> {
  try {
    await ensureDataDirectory();
    const data = await fs.readFile(QUESTIONS_FILE_PATH, 'utf-8');
    const questions = JSON.parse(data);
    
    // Validate that it's an array
    if (!Array.isArray(questions)) {
      console.warn('Questions file contains invalid data, creating empty array');
      return [];
    }
    
    return questions;
  } catch (error: any) {
    // If file doesn't exist or is corrupted, create empty array
    if (error.code === 'ENOENT' || error instanceof SyntaxError) {
      console.log('Questions file not found or corrupted, creating new one');
      await writeQuestions([]);
      return [];
    }
    
    console.error('Error reading questions file:', error);
    throw new Error(`Failed to read questions: ${error.message}`);
  }
}

/**
 * Writes questions to questions.json file with pretty formatting
 */
export async function writeQuestions(questions: Question[]): Promise<void> {
  try {
    await ensureDataDirectory();
    
    // Validate input
    if (!Array.isArray(questions)) {
      throw new Error('Questions must be an array');
    }
    
    // Pretty format with 2 spaces indentation
    const jsonData = JSON.stringify(questions, null, 2);
    
    // Write to file atomically (write to temp file first, then rename)
    const tempPath = `${QUESTIONS_FILE_PATH}.tmp`;
    await fs.writeFile(tempPath, jsonData, 'utf-8');
    await fs.rename(tempPath, QUESTIONS_FILE_PATH);
    
    console.log(`Successfully wrote ${questions.length} questions to file`);
  } catch (error: any) {
    console.error('Error writing questions file:', error);
    throw new Error(`Failed to write questions: ${error.message}`);
  }
}

/**
 * Adds a single question to the questions file
 * Appends to existing questions
 */
export async function addQuestion(question: Question): Promise<void> {
  try {
    // Validate question
    const validationError = validateQuestion(question);
    if (validationError) {
      throw new Error(`Invalid question: ${validationError}`);
    }
    
    // Read existing questions
    const existingQuestions = await readQuestions();
    
    // Check for duplicate ID
    const existingIndex = existingQuestions.findIndex(q => q.id === question.id);
    if (existingIndex !== -1) {
      // Update existing question
      existingQuestions[existingIndex] = {
        ...question,
        updatedAt: new Date().toISOString()
      };
      console.log(`Updated existing question with ID: ${question.id}`);
    } else {
      // Add new question
      const newQuestion = {
        ...question,
        createdAt: question.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      existingQuestions.push(newQuestion);
      console.log(`Added new question with ID: ${question.id}`);
    }
    
    // Write back to file
    await writeQuestions(existingQuestions);
  } catch (error: any) {
    console.error('Error adding question:', error);
    throw new Error(`Failed to add question: ${error.message}`);
  }
}

/**
 * Alternative name for addQuestion to match API requirements
 */
export async function appendQuestion(question: Question): Promise<void> {
  return addQuestion(question);
}

/**
 * Loads all questions (alias for readQuestions for consistency)
 */
export async function loadQuestions(): Promise<Question[]> {
  return readQuestions();
}

/**
 * Validates a question object
 */
export function validateQuestion(question: any): string | null {
  if (!question || typeof question !== 'object') {
    return 'Question must be an object';
  }
  
  if (!question.id || typeof question.id !== 'string' || question.id.trim() === '') {
    return 'Question must have a valid ID';
  }
  
  if (!question.text || typeof question.text !== 'string' || question.text.trim() === '') {
    return 'Question must have valid text';
  }
  
  if (!question.topic || typeof question.topic !== 'string' || question.topic.trim() === '') {
    return 'Question must have a valid topic';
  }
  
  if (typeof question.marks !== 'number' || question.marks <= 0 || !Number.isInteger(question.marks)) {
    return 'Question must have valid positive integer marks';
  }
  
  if (!question.difficulty || typeof question.difficulty !== 'string' || 
      !['easy', 'medium', 'hard'].includes(question.difficulty.toLowerCase())) {
    return 'Question must have valid difficulty (easy, medium, or hard)';
  }
  
  return null;
}

/**
 * Deletes a question by ID
 */
export async function deleteQuestion(id: string): Promise<boolean> {
  try {
    const questions = await readQuestions();
    const initialLength = questions.length;
    const filteredQuestions = questions.filter(q => q.id !== id);
    
    if (filteredQuestions.length === initialLength) {
      return false; // Question not found
    }
    
    await writeQuestions(filteredQuestions);
    console.log(`Deleted question with ID: ${id}`);
    return true;
  } catch (error: any) {
    console.error('Error deleting question:', error);
    throw new Error(`Failed to delete question: ${error.message}`);
  }
}

/**
 * Updates a question by ID
 */
export async function updateQuestion(id: string, updates: Partial<Question>): Promise<boolean> {
  try {
    const questions = await readQuestions();
    const questionIndex = questions.findIndex(q => q.id === id);
    
    if (questionIndex === -1) {
      return false; // Question not found
    }
    
    // Merge updates with existing question
    const updatedQuestion = {
      ...questions[questionIndex],
      ...updates,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };
    
    // Validate updated question
    const validationError = validateQuestion(updatedQuestion);
    if (validationError) {
      throw new Error(`Invalid question update: ${validationError}`);
    }
    
    questions[questionIndex] = updatedQuestion;
    await writeQuestions(questions);
    console.log(`Updated question with ID: ${id}`);
    return true;
  } catch (error: any) {
    console.error('Error updating question:', error);
    throw new Error(`Failed to update question: ${error.message}`);
  }
}