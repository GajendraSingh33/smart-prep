import { NextRequest, NextResponse } from 'next/server';
import { generatePDF } from '@/lib/pdfGenerator';
import { Question } from '@/app/api/generate/route';

interface PDFRequest {
  questions: Question[];
  title?: string;
  subject?: string;
  instructions?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: PDFRequest = await request.json();
    
    // Validate questions array
    if (!body.questions || !Array.isArray(body.questions) || body.questions.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Questions array is required and cannot be empty' },
        { status: 400 }
      );
    }

    // Validate question structure (id is optional for PDF)
    const invalidQuestions = body.questions.filter(q => 
      !q.text || !q.topic || typeof q.marks !== 'number' || !q.difficulty
    );

    if (invalidQuestions.length > 0) {
      return NextResponse.json(
        { success: false, error: 'All questions must have text, topic, marks, and difficulty' },
        { status: 400 }
      );
    }

    // Generate PDF buffer with additional options
    const pdfOptions = {
      title: body.title || 'Generated Question Paper',
      subject: body.subject || 'Academic Assessment',
      instructions: body.instructions || 'Answer all questions. Show your work clearly.'
    };

    const pdfBuffer = await generatePDF(body.questions, pdfOptions);

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `question-paper-${timestamp}.pdf`;

    // Set headers for PDF download
    const headers = new Headers();
    headers.set('Content-Type', 'application/pdf');
    headers.set('Content-Disposition', `attachment; filename="${filename}"`);
    headers.set('Content-Length', pdfBuffer.length.toString());
    headers.set('Cache-Control', 'no-cache');

    // Convert Buffer → Uint8Array so NextResponse accepts it
    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers
    });

  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate PDF', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
