import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

type Question = {
  text: string;
  topic: string;
  marks: number;
  difficulty: string;
};

type PdfOptions = {
  title?: string;
  subject?: string;
  instructions?: string;
};

export async function generatePDF(questions: Question[], options?: PdfOptions): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const { height } = page.getSize();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  let y = height - 50;

  page.drawText(options?.title || "Exam Paper", {
    x: 50,
    y,
    size: 18,
    font,
    color: rgb(0, 0, 0),
  });

  y -= 40;

  if (options?.instructions) {
    page.drawText(options.instructions, { x: 50, y, size: 10, font });
    y -= 30;
  }

  questions.forEach((q, i) => {
    const text = `Q${i + 1}. ${q.text} (${q.marks} marks) - ${q.topic} - ${q.difficulty}`;
    page.drawText(text, { x: 50, y, size: 12, font });
    y -= 30;
  });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
