import type { Question } from '../features/parser/QuestionParser';

const naturalCompare = (left: string, right: string) => {
  return left.localeCompare(right, undefined, { numeric: true, sensitivity: 'base' });
};

export function sortQuestionsAlphabetically(questions: Question[]) {
  return [...questions].sort((left, right) => {
    const topicCompare = naturalCompare(left.topic || '', right.topic || '');
    if (topicCompare !== 0) return topicCompare;

    const textCompare = naturalCompare(left.text, right.text);
    if (textCompare !== 0) return textCompare;

    return naturalCompare(left.id || '', right.id || '');
  });
}

export function sortStringsAlphabetically(values: string[]) {
  return [...values].sort(naturalCompare);
}