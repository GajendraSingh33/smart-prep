import { NextRequest, NextResponse } from 'next/server';
import { loadQuestions } from '@/utils/fileStore';
import { Question } from '@/app/api/generate/route';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const countParam = searchParams.get('count');
    const topic = searchParams.get('topic');
    const difficulty = searchParams.get('difficulty');
    const marksParam = searchParams.get('marks');
    const excludeIds = searchParams.get('excludeIds')?.split(',').filter(Boolean) || [];
    
    // Parse parameters
    const count = countParam ? parseInt(countParam, 10) : 3;
    const marks = marksParam ? parseInt(marksParam, 10) : undefined;

    // Validate count parameter
    if (isNaN(count) || count < 1) {
      return NextResponse.json(
        { success: false, error: 'Count must be a positive number' },
        { status: 400 }
      );
    }

    if (count > 100) {
      return NextResponse.json(
        { success: false, error: 'Count cannot exceed 100' },
        { status: 400 }
      );
    }

    // Load all questions
    let allQuestions = await loadQuestions();

    // Apply filters before random selection
    if (topic?.trim()) {
      allQuestions = allQuestions.filter(q => 
        q.topic.toLowerCase().includes(topic.toLowerCase())
      );
    }

    if (difficulty?.trim()) {
      allQuestions = allQuestions.filter(q => 
        q.difficulty.toLowerCase() === difficulty.toLowerCase()
      );
    }

    if (marks !== undefined && !isNaN(marks)) {
      allQuestions = allQuestions.filter(q => q.marks === marks);
    }

    // Exclude specified IDs
    if (excludeIds.length > 0) {
      allQuestions = allQuestions.filter(q => !excludeIds.includes(q.id));
    }

    // Handle case where no questions match criteria
    if (allQuestions.length === 0) {
      return NextResponse.json({
        success: true,
        randomQuestions: [],
        message: 'No questions match the specified criteria'
      });
    }

    // Handle case where fewer questions exist than requested
    const availableCount = Math.min(count, allQuestions.length);
    
    // Randomly select unique questions using Fisher-Yates shuffle
    const shuffled = [...allQuestions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    const randomQuestions = shuffled.slice(0, availableCount);

    return NextResponse.json({
      success: true,
      randomQuestions,
      questions: randomQuestions,
      totalAvailable: allQuestions.length,
      requested: count,
      returned: randomQuestions.length
    });

  } catch (error) {
    console.error('Random questions error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get random questions', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}