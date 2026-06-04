import { saveAs } from 'file-saver';
import { AlignmentType, Document, Packer, Paragraph, Table, TableCell, TableLayoutType, TableRow, TextRun, PageOrientation, WidthType } from 'docx';
import type { Question } from '../parser/QuestionParser';

export function generatePlainTextForWord(questions: Question[], lang = 'en'): string {
  const lines: string[] = [];
  questions.forEach((q, idx) => {
    const num = idx + 1;
    lines.push(`${num}) ${q.text}`);
    q.options.forEach(opt => {
      lines.push(`${opt.id}) ${opt.text}`);
    });
    lines.push('');
  });

  lines.push(lang.startsWith('tr') ? 'Cevaplar:' : 'Answers:');
  questions.forEach((q, idx) => {
    lines.push(`${idx + 1}) ${q.correctAnswer || ''}`);
  });

  return lines.join('\n');
}

export function downloadMarkdownFile(questions: Question[], lang = 'en') {
  const md = generatePlainTextForWord(questions, lang);
  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
  const name = lang.startsWith('tr') ? 'sorular.md' : 'questions.md';
  saveAs(blob, name);
}

export async function exportQuestionsDocx(questions: Question[], lang = 'en') {
  const pageWidth = 16838;
  const pageHeight = 11906;
  const pageMargin = 720;
  const cellMargins = {
    marginUnitType: WidthType.DXA,
    top: 180,
    bottom: 180,
    left: 240,
    right: 240,
  };

  const makeQuestionCell = (q?: Question, idx?: number) => {
    const children: Paragraph[] = [];

    if (q) {
      children.push(
        new Paragraph({
          keepNext: true,
          spacing: { before: 0, after: 120 },
          children: [
            new TextRun({ text: `${(idx ?? 0) + 1}) `, bold: true }),
            new TextRun({ text: q.text }),
          ],
        })
      );

      q.options.forEach((opt, optIndex) => {
        children.push(
          new Paragraph({
            keepNext: optIndex < q.options.length - 1,
            spacing: { before: 0, after: optIndex < q.options.length - 1 ? 40 : 120 },
            indent: { left: 480 },
            children: [
              new TextRun({ text: `${opt.id}) `, bold: true }),
              new TextRun({ text: opt.text }),
            ],
          })
        );
      });
    } else {
      children.push(new Paragraph(''));
    }

    return new TableCell({
      margins: cellMargins,
      children,
    });
  };

  const rows: TableRow[] = [];
  for (let i = 0; i < questions.length; i += 2) {
    rows.push(new TableRow({
      cantSplit: true,
      children: [makeQuestionCell(questions[i], i), makeQuestionCell(questions[i + 1], i + 1)],
    }));
  }

  const questionTable = new Table({
    rows,
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.AUTOFIT,
  });

  const answerBlocks: Paragraph[] = [
    new Paragraph({
      spacing: { before: 0, after: 240 },
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: lang.startsWith('tr') ? 'Cevaplar' : 'Answers', bold: true })],
    }),
    ...questions.map((q, idx) => new Paragraph({
      spacing: { before: 0, after: 80 },
      children: [new TextRun({ text: `${idx + 1}) `, bold: true }), new TextRun({ text: q.correctAnswer || '' })],
    })),
  ];

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            size: { width: pageWidth, height: pageHeight, orientation: PageOrientation.LANDSCAPE },
            margin: { top: pageMargin, right: pageMargin, bottom: pageMargin, left: pageMargin },
          },
        },
        children: [questionTable],
      },
      {
        properties: {
          type: 'nextPage',
          page: {
            size: { width: pageWidth, height: pageHeight, orientation: PageOrientation.LANDSCAPE },
            margin: { top: pageMargin, right: pageMargin, bottom: pageMargin, left: pageMargin },
          },
        },
        children: answerBlocks,
      },
    ]
  });

  const blob = await Packer.toBlob(doc);
  const name = lang.startsWith('tr') ? 'sorular.docx' : 'questions.docx';
  saveAs(blob, name);
}

export async function copyToClipboardPlainText(questions: Question[], lang = 'en') {
  const txt = generatePlainTextForWord(questions, lang);
  if (navigator.clipboard && navigator.clipboard.writeText) {
    await navigator.clipboard.writeText(txt);
    return true;
  }

  const el = document.createElement('textarea');
  el.value = txt;
  document.body.appendChild(el);
  el.select();
  try {
    document.execCommand('copy');
    return true;
  } finally {
    document.body.removeChild(el);
  }
}
