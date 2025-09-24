import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { appendQuestion, validateQuestion } from '@/utils/fileStore';
import { Question } from '@/app/api/generate/route';

interface AddQuestionRequest {
  question: Question;
  tags?: string[];
  source?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: AddQuestionRequest = await request.json();
    
    // Validate question input
    if (!body.question || typeof body.question !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Valid question object is required' },
        { status: 400 }
      );
    }

    let { question } = body;
    const { tags, source } = body;

    // Validate required question fields
    if (!question.text?.trim() || !question.topic?.trim() || 
        typeof question.marks !== 'number' || question.marks <= 0 || 
        !question.difficulty?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Question must have valid text, topic, marks (positive number), and difficulty' },
        { status: 400 }
      );
    }

    // Ensure question has an ID
    if (!question.id?.trim()) {
      question.id = uuidv4();
    }

    // Add metadata
    const enhancedQuestion = {
      ...question,
      id: question.id,
      text: question.text.trim(),
      topic: question.topic.trim(),
      difficulty: question.difficulty.trim(),
      tags: tags || [],
      source: source || 'manual',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Validate question structure
    const validationError = validateQuestion(enhancedQuestion);
    if (validationError) {
      return NextResponse.json(
        { success: false, error: validationError },
        { status: 400 }
      );
    }

    // Save to question bank
    await appendQuestion(enhancedQuestion);

    return NextResponse.json({
      success: true,
      saved: enhancedQuestion
    });

  } catch (error) {
    console.error('Add question error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save question', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}