import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { formatOutput } from '@/utils/formatOutput';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface GenerateBody {
  syllabus?: string;
  extractedContent?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as GenerateBody;
    const syllabus = (body.syllabus || '').trim();
    const extracted = (body.extractedContent || '').trim();

    if (!syllabus && !extracted) {
      return NextResponse.json(
        { success: false, error: 'Syllabus or extractedContent is required' },
        { status: 400 }
      );
    }

    const subjectName = syllabus || 'Uploaded Material';
    const seedText = `1. Define ${subjectName}. (2 marks) - General - easy\n2. Explain key concepts of ${subjectName}. (5 marks) - General - medium\n3. Compare and contrast two core ideas in ${subjectName}. (10 marks) - General - hard\n4. Design a short exercise related to ${subjectName}. (3 marks) - General - medium\n5. List core principles of ${subjectName}. (2 marks) - General - easy`;

    const basis = [syllabus, extracted].filter(Boolean).join('\n\n') || seedText;
    const parsed = formatOutput(basis);
    const questions = parsed.map(q => ({ ...q, id: q.id || uuidv4() }));

    return NextResponse.json({ success: true, questions });
  } catch (error) {
    console.error('generate2 error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate questions', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}


