import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Question } from '../features/parser/QuestionParser';

interface QuizState {
  // Gatekeeper / Parsing State
  rawText: string;
  parsedQuestions: Question[];
  setRawText: (text: string) => void;
  setParsedQuestions: (questions: Question[]) => void;
  setCorrectAnswer: (questionId: string, optionId: string) => void;
  clearParser: () => void;

  // Learning Loop State
  activeQuiz: Question[];
  wrongAnswers: Question[];
  currentIndex: number;
  startQuiz: (pool: Question[]) => void;
  submitAnswer: (isCorrect: boolean, currentQuestion: Question) => void;
  nextQuestion: () => void;
  restartLoop: () => void;
  quitQuiz: () => void;
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set) => ({
      // GATEKEEPER
      rawText: '',
      parsedQuestions: [],
      setRawText: (text) => set({ rawText: text }),
      setParsedQuestions: (questions) => set({ parsedQuestions: questions }),
      setCorrectAnswer: (qId, oId) => set((state) => ({
        parsedQuestions: state.parsedQuestions.map(q => 
          q.id === qId ? { ...q, correctAnswer: oId } : q
        )
      })),
      clearParser: () => set({ rawText: '', parsedQuestions: [] }),

      // LEARNING LOOP
      activeQuiz: [],
      wrongAnswers: [],
      currentIndex: 0,
      
      startQuiz: (pool) => set({ 
        activeQuiz: pool, 
        wrongAnswers: [], 
        currentIndex: 0 
      }),
      
      submitAnswer: (isCorrect, currentQuestion) => set((state) => {
        const nextWrong = isCorrect ? state.wrongAnswers : [...state.wrongAnswers, currentQuestion];
        return { wrongAnswers: nextWrong };
      }),

      nextQuestion: () => set((state) => ({
        currentIndex: Math.min(state.currentIndex + 1, state.activeQuiz.length)
      })),

      restartLoop: () => set((state) => ({
        activeQuiz: [...state.wrongAnswers],
        wrongAnswers: [],
        currentIndex: 0
      })),

      quitQuiz: () => set({
        activeQuiz: [],
        wrongAnswers: [],
        currentIndex: 0
      })
    }),
    {
      name: 'quiz-storage',
      // We only want to persist the learning loop, not the temporary parser text
      partialize: (state) => ({
        activeQuiz: state.activeQuiz,
        wrongAnswers: state.wrongAnswers,
        currentIndex: state.currentIndex
      })
    }
  )
);
