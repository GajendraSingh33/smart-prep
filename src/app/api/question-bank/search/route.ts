import { NextRequest, NextResponse } from 'next/server';
import { loadQuestions } from '@/utils/fileStore';
import { Question } from '@/app/api/generate/route';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract search parameters
    const topic = searchParams.get('topic');
    const marksParam = searchParams.get('marks');
    const difficulty = searchParams.get('difficulty');
    const tags = searchParams.get('tags')?.split(',').map(tag => tag.trim()).filter(Boolean);
    const source = searchParams.get('source');
    const limitParam = searchParams.get('limit');
    const offsetParam = searchParams.get('offset');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Parse numeric parameters
    const marks = marksParam ? parseInt(marksParam, 10) : undefined;
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;
    const offset = offsetParam ? parseInt(offsetParam, 10) : 0;

    // Load all questions
    const allQuestions = await loadQuestions();

    // Apply filters
    let filteredQuestions = allQuestions;

    // Topic filter (partial match, case-insensitive)
    if (topic?.trim()) {
      filteredQuestions = filteredQuestions.filter(q => 
        q.topic.toLowerCase().includes(topic.toLowerCase()) ||
        q.text.toLowerCase().includes(topic.toLowerCase())
      );
    }

    // Marks filter (exact match)
    if (marks !== undefined && !isNaN(marks)) {
      filteredQuestions = filteredQuestions.filter(q => q.marks === marks);
    }

    // Difficulty filter (exact match, case-insensitive)
    if (difficulty?.trim()) {
      filteredQuestions = filteredQuestions.filter(q => 
        q.difficulty.toLowerCase() === difficulty.toLowerCase()
      );
    }

    // Tags filter (any matching tag)
    if (tags && tags.length > 0) {
      filteredQuestions = filteredQuestions.filter(q => 
        q.tags && q.tags.some(tag => 
          tags.some(searchTag => tag.toLowerCase().includes(searchTag.toLowerCase()))
        )
      );
    }

    // Source filter
    if (source?.trim()) {
      filteredQuestions = filteredQuestions.filter(q => 
        q.source?.toLowerCase() === source.toLowerCase()
      );
    }

    // Sort results
    filteredQuestions.sort((a, b) => {
      let aVal = a[sortBy as keyof Question];
      let bVal = b[sortBy as keyof Question];
      
      if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
        aVal = new Date(aVal as string).getTime();
        bVal = new Date(bVal as string).getTime();
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    // Apply pagination
    const totalCount = filteredQuestions.length;
    const startIndex = Math.max(0, offset);
    const endIndex = limit ? startIndex + limit : filteredQuestions.length;
    const paginatedQuestions = filteredQuestions.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      results: paginatedQuestions,
      pagination: {
        total: totalCount,
        limit: limit || totalCount,
        offset: startIndex,
        hasMore: endIndex < totalCount
      },
      filters: {
        topic,
        marks,
        difficulty,
        tags,
        source
      }
    });

  } catch (error) {
    console.error('Search questions error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to search questions', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}