import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType } from 'docx';
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
  const rows: TableRow[] = [];

  for (let i = 0; i < questions.length; i += 2) {
    const left = questions[i];
    const right = questions[i + 1];

    const makeCell = (q?: Question, idx?: number) => {
      if (!q) return new TableCell({ children: [new Paragraph('')] });

      const children: Paragraph[] = [];
      children.push(new Paragraph({ children: [new TextRun({ text: `${(idx ?? 0) + 1}) ${q.text}` })] }));
      children.push(new Paragraph(''));
      q.options.forEach(opt => {
        children.push(new Paragraph({ children: [new TextRun({ text: `${opt.id}) `, bold: true }), new TextRun({ text: opt.text })] }));
      });

      return new TableCell({ children });
    };

    rows.push(new TableRow({ children: [makeCell(left, i), makeCell(right, i + 1)] }));
  }

  const table = new Table({
    rows,
    width: { size: 100, type: WidthType.PERCENTAGE }
  });

  const answersLabel = lang.startsWith('tr') ? 'Cevaplar:' : 'Answers:';
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          table,
          new Paragraph(''),
          new Paragraph(answersLabel),
          ...questions.map((q, idx) => new Paragraph({ children: [new TextRun({ text: `${idx + 1}) ${q.correctAnswer || ''}` })] }))
        ]
      }
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
