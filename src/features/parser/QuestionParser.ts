export interface Option {
  id: string; // The letter A, B, C, etc.
  text: string;
}

export interface Question {
  id: string;
  topic?: string;
  text: string;
  options: Option[];
  correctAnswer?: string;
}

export function parseQuestions(rawText: string): Question[] {
  const lines = rawText.split('\n');
  const questions: Question[] = [];
  let currentQuestion: Question | null = null;
  let currentOption: Option | null = null;

  // Regex to detect start of a question: "1)", "2-", "3."
  const qRegex = /^\s*(\d+)[\)\-\.]\s*(.+)$/;
  // Regex to detect start of an option: "A)", "B.", "C-", "c)"
  const optRegex = /^\s*([A-Ea-e])[\)\-\.]\s*(.+)$/;

  for (let i = 0; i < lines.length; i++) {
    const lineStr = lines[i];
    
    if (lineStr.trim() === '' || lineStr.startsWith('<!--')) {
      continue;
    }

    const qMatch = qRegex.exec(lineStr);
    if (qMatch) {
      if (currentQuestion) {
        questions.push(currentQuestion);
      }
      currentQuestion = {
        id: crypto.randomUUID(),
        text: qMatch[2].trim(),
        options: []
      };
      currentOption = null;
      continue;
    }

    const oMatch = optRegex.exec(lineStr);
    if (oMatch && currentQuestion) {
      currentOption = {
        id: oMatch[1].toUpperCase(),
        text: oMatch[2].trim()
      };
      currentQuestion.options.push(currentOption);
      continue;
    }

    // Continuation line
    if (currentOption) {
      currentOption.text += '\n' + lineStr.trim();
    } else if (currentQuestion) {
      currentQuestion.text += '\n' + lineStr.trim();
    }
  }

  if (currentQuestion) {
    questions.push(currentQuestion);
  }

  return questions;
}
