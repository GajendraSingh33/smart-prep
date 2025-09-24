import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { formatOutput } from '@/utils/formatOutput';
import { extractTextFromFile } from '@/utils/fileProcessor';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export interface Question {
  id: string;
  text: string;
  topic: string;
  marks: number;
  difficulty: string;
}

interface GenerateJsonRequest {
  syllabus?: string;
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    console.log('[API] /api/generate POST', { contentType });

    if (contentType.includes('multipart/form-data')) {
      const form = await request.formData();
      const syllabus = String(form.get('syllabus') || '').trim();
      const files = form.getAll('files') as File[];

      if (!syllabus && (!files || files.length === 0)) {
        return NextResponse.json(
          { success: false, error: 'Syllabus or files are required' },
          { status: 400 }
        );
      }

      let extractedContent = '';
      if (files && files.length > 0) {
        for (const file of files) {
          const text = await extractTextFromFile(file);
          if (text) {
            extractedContent += `\n\n--- ${file.name} ---\n${text}`;
          }
        }
      }

      const combined = [syllabus, extractedContent].filter(Boolean).join('\n\n');
      const subjectName = (syllabus || 'Uploaded Material').trim();
      const fileHint = files && files.length > 0 ? ` based on ${files.map(f => f.name).slice(0,2).join(', ')}` : '';

      // Always craft a deterministic seed, even if extraction yields no text
      const seedText = `1. Define ${subjectName}. (2 marks) - General - easy\n2. Explain key concepts${fileHint}. (5 marks) - General - medium\n3. Compare and contrast two major ideas in ${subjectName}. (10 marks) - General - hard\n4. Design a short exercise related to ${subjectName}. (3 marks) - General - medium\n5. List core principles of ${subjectName}. (2 marks) - General - easy`;

      const parsed = formatOutput(combined || seedText);
      const questions: Question[] = parsed.map(q => ({ ...q, id: q.id || uuidv4() }));
      return NextResponse.json({ success: true, questions, processedFiles: files?.map(f => f.name) || [] });
    }

    if (contentType.includes('application/json')) {
      const body = (await request.json()) as GenerateJsonRequest;
      const syllabus = (body.syllabus || '').trim();
      if (!syllabus) {
        return NextResponse.json(
          { success: false, error: 'Syllabus is required' },
          { status: 400 }
        );
      }
      const seedText = `1. Define ${syllabus}. (2 marks) - ${syllabus} - easy\n2. Explain key concepts of ${syllabus}. (5 marks) - ${syllabus} - medium\n3. Compare and contrast topics within ${syllabus}. (10 marks) - ${syllabus} - hard`;
      const parsed = formatOutput(seedText);
      const questions: Question[] = parsed.map(q => ({ ...q, id: q.id || uuidv4() }));
      return NextResponse.json({ success: true, questions });
    }

    return NextResponse.json(
      { success: false, error: 'Unsupported content type.' },
      { status: 415 }
    );
  } catch (error) {
    console.error('Generate API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate questions', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const syllabus = (searchParams.get('syllabus') || '').trim();
    const subjectName = syllabus || 'General Subject';
    const seedText = `1. Define ${subjectName}. (2 marks) - General - easy\n2. Explain key concepts of ${subjectName}. (5 marks) - General - medium\n3. Compare and contrast two core ideas in ${subjectName}. (10 marks) - General - hard`;
    const parsed = formatOutput(seedText);
    const questions: Question[] = parsed.map(q => ({ ...q, id: q.id || uuidv4() }));
    return NextResponse.json({ success: true, questions });
  } catch (error) {
    console.error('Generate API GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate questions', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}