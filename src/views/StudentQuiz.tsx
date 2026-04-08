import { useState } from 'react';
import { useQuizStore } from '../store/useQuizStore';
import { getRandomQuestions } from '../api/firestoreService';
import { PlayCircle, CheckCircle2, XCircle, ArrowRight, Loader2, RotateCcw, ShieldCheck } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Question } from '../features/parser/QuestionParser';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export default function StudentQuiz() {
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
        alert("No questions found in Firestore! Please create some in the Admin panel.");
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
      <div className="max-w-xl mx-auto p-8 text-center space-y-6 bg-white rounded-2xl shadow-sm border border-slate-200 mt-12">
        <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto">
          <PlayCircle className="w-8 h-8 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Ready to Practice?</h2>
          <p className="text-slate-500 mt-2">Start a new session to fetch up to 25 random questions from your pool.</p>
        </div>
        <button 
          onClick={fetchPoolAndStart}
          disabled={isLoading}
          className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold shadow hover:bg-blue-700 transition flex items-center justify-center gap-2 mx-auto w-full md:w-auto"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Start Quiz"}
        </button>
      </div>
    );
  }

  if (isFinished) {
    const isPerfect = wrongAnswers.length === 0;

    return (
      <div className="max-w-xl mx-auto p-8 text-center space-y-6 bg-white rounded-2xl shadow-sm border border-slate-200 mt-12 animate-in slide-in-from-bottom-4">
        {isPerfect ? (
          <div className="bg-emerald-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto text-emerald-600">
            <ShieldCheck className="w-8 h-8" />
          </div>
        ) : (
          <div className="bg-amber-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto text-amber-600">
            <RotateCcw className="w-8 h-8" />
          </div>
        )}
        
        <div>
          <h2 className="text-3xl font-bold text-slate-800">
            {isPerfect ? "Loop Mastered!" : "Learning Loop Triggered"}
          </h2>
          <p className="text-slate-500 mt-3 max-w-md mx-auto leading-relaxed">
            {isPerfect 
              ? "Flawless execution! You answered everything correctly. Your progress is saved."
              : `You missed ${wrongAnswers.length} questions. In order to engrain the knowledge, we are going to restart the loop with ONLY the ones you got wrong.`
            }
          </p>
        </div>

        <div className="flex justify-center gap-4 pt-4">
          <button 
            onClick={quitQuiz}
            className="px-6 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition"
          >
            End Session
          </button>
          {!isPerfect && (
            <button 
              onClick={() => {
                setSelectedOption(null);
                setIsRevealed(false);
                restartLoop();
              }}
              className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 shadow flex items-center justify-center gap-2"
            >
              Start Next Loop
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
      // Move to next question
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
    <div className="max-w-2xl mx-auto px-4 mt-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm font-medium text-slate-500 mb-2">
          <span>Question {currentIndex + 1} of {activeQuiz.length}</span>
          <span className="text-amber-500 flex gap-1 items-center">
             Mistakes in this loop: {wrongAnswers.length}
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden flex">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${(currentIndex / activeQuiz.length) * 100}%` }}
          />
        </div>
      </div>

      <div className={cn(
        "bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 transition-transform duration-200",
        shake && "animate-[shake_0.4s_ease-in-out]" 
      )}>
        <h3 className="text-lg md:text-xl font-medium text-slate-800 mb-8 leading-relaxed">
          {currentQ.text}
        </h3>

        <div className="space-y-3">
          {currentQ.options.map((opt) => {
            const isSelected = selectedOption === opt.id;
            const isCorrect = currentQ.correctAnswer === opt.id;
            
            let stateClass = "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50";
            
            if (isRevealed) {
              if (isCorrect) {
                stateClass = "border-emerald-500 bg-emerald-50 text-emerald-900 shadow-[0_0_0_1px_#10b981]";
              } else if (isSelected && !isCorrect) {
                stateClass = "border-red-500 bg-red-50 text-red-900 opacity-60";
              } else {
                stateClass = "border-slate-200 opacity-60";
              }
            } else if (isSelected) {
              stateClass = "border-blue-500 bg-blue-50 text-blue-900 ring-1 ring-blue-500";
            }

            return (
              <button
                key={opt.id}
                onClick={() => handleSelect(opt.id)}
                className={cn(
                  "w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between group",
                  stateClass,
                  isRevealed && !isCorrect && isSelected && "animate-pulse" // emphasis on wrong
                )}
              >
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-sm font-bold border",
                    isSelected || (isRevealed && isCorrect) ? "bg-white/80 border-transparent" : "bg-slate-100 border-slate-200 text-slate-500 group-hover:bg-white"
                  )}>
                    {opt.id}
                  </span>
                  <span className="font-medium text-slate-700">{opt.text}</span>
                </div>

                {isRevealed && isCorrect && <CheckCircle2 className="w-6 h-6 text-emerald-500 ml-2 shrink-0" />}
                {isRevealed && isSelected && !isCorrect && <XCircle className="w-6 h-6 text-red-500 ml-2 shrink-0" />}
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex justify-between items-center border-t border-slate-100 pt-6">
          <button 
            onClick={quitQuiz}
            className="text-sm font-medium text-slate-500 hover:text-slate-800 transition"
          >
            End Quiz
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedOption && !isRevealed}
            className={cn(
              "px-6 py-3 rounded-xl font-semibold shadow flex items-center gap-2 transition-all",
              isRevealed ? "bg-blue-600 text-white hover:bg-blue-700" :
                (selectedOption ? "bg-slate-800 text-white hover:bg-slate-900" : "bg-slate-100 text-slate-400 cursor-not-allowed")
            )}
          >
            {isRevealed ? (
              <>Next Question <ArrowRight className="w-4 h-4"/></>
            ) : "Check Answer"}
          </button>
        </div>
      </div>
    </div>
  );
}
