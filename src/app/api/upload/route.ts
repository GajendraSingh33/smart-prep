import { NextRequest, NextResponse } from 'next/server';
import { extractTextFromFile } from '@/utils/fileProcessor';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json(
        { success: false, error: 'Use multipart/form-data with files' },
        { status: 415 }
      );
    }

    const form = await request.formData();
    const files = form.getAll('files') as File[];
    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No files uploaded' },
        { status: 400 }
      );
    }

    const parts: string[] = [];
    const processed: string[] = [];
    for (const file of files) {
      const text = await extractTextFromFile(file);
      if (text) {
        parts.push(`--- ${file.name} ---\n${text}`);
      }
      processed.push(file.name);
    }

    const extractedContent = parts.join('\n\n');
    return NextResponse.json({ success: true, extractedContent, processed });
  } catch (error) {
    console.error('upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process upload', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}


