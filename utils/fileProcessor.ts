import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export async function extractTextFromFile(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const filename = file.name || 'upload';
  const lower = filename.toLowerCase();

  try {
    if (lower.endsWith('.pdf')) {
      const data = await pdfParse(buffer);
      return data.text || '';
    }

    if (lower.endsWith('.docx')) {
      const result = await mammoth.extractRawText({ buffer });
      return result.value || '';
    }

    if (lower.endsWith('.doc')) {
      // Legacy .doc not supported by mammoth; return empty string
      return '';
    }

    if (lower.endsWith('.txt')) {
      return buffer.toString('utf-8');
    }

    if (lower.endsWith('.ppt') || lower.endsWith('.pptx')) {
      // PPT parsing not supported in this minimal implementation
      return '';
    }

    if (lower.endsWith('.png') || lower.endsWith('.jpg') || lower.endsWith('.jpeg')) {
      // OCR intentionally omitted for performance in this version
      return '';
    }

    return '';
  } catch (err) {
    console.error('Failed to extract text from file:', filename, err);
    return '';
  }
}



