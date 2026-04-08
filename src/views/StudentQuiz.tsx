import { useState } from 'react';
import { useQuizStore } from '../store/useQuizStore';
import { getRandomQuestions } from '../api/firestoreService';
import { PlayCircle, CheckCircle2, XCircle, ArrowRight, Loader2, RotateCcw, ShieldCheck } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Question } from '../features/parser/QuestionParser';
import { useTranslation } from 'react-i18next';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export default function StudentQuiz() {
  const { t } = useTranslation();
  const { 
    activeQuiz, 
    currentIndex, 
    startQuiz, 
    submitAnswer, 
    nextQuestion, 
    restartLoop,
    quitQuiz,
    wrongAnswers
  } = useQuizStore();

  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [shake, setShake] = useState(false);

  const fetchPoolAndStart = async () => {
    setIsLoading(true);
    try {
      const q = await getRandomQuestions(25);
      if (q.length === 0) {
        alert(t('solve.noQuestionsFound'));
        return;
      }
      startQuiz(q);
    } catch (e) {
      console.error(e);
      alert("Error fetching questions.");
    } finally {
      setIsLoading(false);
    }
  };

  const currentQ: Question | undefined = activeQuiz[currentIndex];
  // if no active quiz or finished
  const isFinished = activeQuiz.length > 0 && currentIndex >= activeQuiz.length;

  if (activeQuiz.length === 0) {
    return (
      <div className="max-w-xl mx-auto p-6 sm:p-8 text-center space-y-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 mt-12 transition-colors mx-4 sm:mx-auto">
        <div className="bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto transition-colors">
          <PlayCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white transition-colors">{t('solve.ready')}</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 transition-colors">{t('solve.readySub')}</p>
        </div>
        <button 
          onClick={fetchPoolAndStart}
          disabled={isLoading}
          className="bg-blue-600 dark:bg-blue-500 text-white px-8 py-3 rounded-xl font-semibold shadow hover:bg-blue-700 dark:hover:bg-blue-600 transition flex items-center justify-center gap-2 mx-auto w-full md:w-auto"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : t('solve.start')}
        </button>
      </div>
    );
  }

  if (isFinished) {
    const isPerfect = wrongAnswers.length === 0;

    return (
      <div className="max-w-xl mx-auto p-6 sm:p-8 text-center space-y-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 mt-12 animate-in slide-in-from-bottom-4 transition-colors mx-4 sm:mx-auto">
        {isPerfect ? (
          <div className="bg-emerald-100 dark:bg-emerald-900/30 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-8 h-8" />
          </div>
        ) : (
          <div className="bg-amber-100 dark:bg-amber-900/30 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto text-amber-600 dark:text-amber-400">
            <RotateCcw className="w-8 h-8" />
          </div>
        )}
        
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white transition-colors">
            {isPerfect ? t('solve.mastered') : t('solve.triggered')}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-3 max-w-md mx-auto leading-relaxed transition-colors">
            {isPerfect 
              ? t('solve.flawless')
              : t('solve.missed', { count: wrongAnswers.length })
            }
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <button 
            onClick={quitQuiz}
            className="px-6 py-3 w-full sm:w-auto bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            {t('solve.endSession')}
          </button>
          {!isPerfect && (
            <button 
              onClick={() => {
                setSelectedOption(null);
                setIsRevealed(false);
                restartLoop();
              }}
              className="px-6 py-3 w-full sm:w-auto bg-emerald-600 dark:bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-700 dark:hover:bg-emerald-600 shadow flex items-center justify-center gap-2 transition"
            >
              {t('solve.nextLoop')}
            </button>
          )}
        </div>
      </div>
    );
  }

  const handleSelect = (optId: string) => {
    if (isRevealed) return;
    setSelectedOption(optId);
  };

  const handleSubmit = () => {
    if (isRevealed) {
      setSelectedOption(null);
      setIsRevealed(false);
      nextQuestion();
      return;
    }

    if (!selectedOption) return;

    const isCorrect = selectedOption === currentQ.correctAnswer;
    setIsRevealed(true);
    
    if (!isCorrect) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
    
    submitAnswer(isCorrect, currentQ);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 mt-8 transition-colors">
      <div className="mb-6 sm:mb-8">
        <div className="flex justify-between text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mb-2 transition-colors">
          <span>{t('solve.questionXofY', { current: currentIndex + 1, total: activeQuiz.length })}</span>
          <span className="text-amber-500 dark:text-amber-400 flex gap-1 items-center">
             {t('solve.mistakes', { count: wrongAnswers.length })}
          </span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden flex transition-colors">
          <div 
            className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${(currentIndex / activeQuiz.length) * 100}%` }}
          />
        </div>
      </div>

      <div className={cn(
        "bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-4 sm:p-6 md:p-8 transition-transform duration-200 transition-colors",
        shake && "animate-[shake_0.4s_ease-in-out]" 
      )}>
        <h3 className="text-base sm:text-lg md:text-xl font-medium text-slate-800 dark:text-slate-100 mb-6 sm:mb-8 leading-relaxed">
          {currentQ.text}
        </h3>

        <div className="space-y-3">
          {currentQ.options.map((opt) => {
            const isSelected = selectedOption === opt.id;
            const isCorrect = currentQ.correctAnswer === opt.id;
            
            let stateClass = "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800";
            
            if (isRevealed) {
              if (isCorrect) {
                stateClass = "border-emerald-500 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-900 dark:text-emerald-300 shadow-[0_0_0_1px_#10b981] dark:shadow-[0_0_0_1px_#059669]";
              } else if (isSelected && !isCorrect) {
                stateClass = "border-red-500 dark:border-red-600 bg-red-50 dark:bg-red-900/30 text-red-900 dark:text-red-300 opacity-60";
              } else {
                stateClass = "border-slate-200 dark:border-slate-800 opacity-60 dark:opacity-40";
              }
            } else if (isSelected) {
              stateClass = "border-blue-500 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-300 ring-1 ring-blue-500";
            }

            return (
              <button
                key={opt.id}
                onClick={() => handleSelect(opt.id)}
                className={cn(
                  "w-full text-left px-3 py-3 sm:p-4 rounded-xl border-2 transition-all flex items-center justify-between group",
                  stateClass,
                  isRevealed && !isCorrect && isSelected && "animate-pulse" 
                )}
              >
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-sm font-bold border transition-colors",
                    isSelected || (isRevealed && isCorrect) ? "bg-white/80 dark:bg-slate-900/80 border-transparent dark:border-transparent" : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 group-hover:bg-white dark:group-hover:bg-slate-700"
                  )}>
                    {opt.id}
                  </span>
                  <span className="font-medium text-slate-700 dark:text-slate-200 break-words">{opt.text}</span>
                </div>

                {isRevealed && isCorrect && <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500 shrink-0 ml-2" />}
                {isRevealed && isSelected && !isCorrect && <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col-reverse sm:flex-row justify-between items-center sm:items-center border-t border-slate-100 dark:border-slate-800 pt-6 gap-4 sm:gap-0">
          <button 
            onClick={quitQuiz}
            className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition"
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedOption && !isRevealed}
            className={cn(
              "px-6 py-3 rounded-xl font-semibold shadow flex items-center justify-center gap-2 transition-all w-full sm:w-auto",
              isRevealed ? "bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600" :
                (selectedOption ? "bg-slate-800 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-900 dark:hover:bg-slate-100" : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed")
            )}
          >
            {isRevealed ? (
              <>{t('solve.nextQuestion')} <ArrowRight className="w-4 h-4"/></>
            ) : t('solve.checkAnswer')}
          </button>
        </div>
      </div>
    </div>
  );
}
