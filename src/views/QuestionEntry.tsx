import { useState, useEffect } from 'react';
import { FileText, CheckCircle, AlertCircle, Save, Loader2 } from 'lucide-react';
import { useQuizStore } from '../store/useQuizStore';
import { parseQuestions } from '../features/parser/QuestionParser';
import { saveQuestionsBatch } from '../api/firestoreService';

export default function QuestionEntry() {
  const { rawText, setRawText, parsedQuestions, setParsedQuestions, setCorrectAnswer, clearParser } = useQuizStore();
  const [topic, setTopic] = useState('General');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const parsed = parseQuestions(rawText);
    setParsedQuestions(parsed);
    setSaveSuccess(false);
  }, [rawText, setParsedQuestions]);

  const isValidLength = parsedQuestions.length === 10;
  // Check if every parsed question has a correct answer assigned
  const allHaveAnswers = parsedQuestions.length > 0 && parsedQuestions.every(q => !!q.correctAnswer);
  
  const canSave = isValidLength && allHaveAnswers && !isSaving;

  const handleSave = async () => {
    if (!canSave) return;
    setIsSaving(true);
    try {
      // Append topic right before saving
      const finalQuestions = parsedQuestions.map(q => ({ ...q, topic }));
      await saveQuestionsBatch(finalQuestions);
      setSaveSuccess(true);
      clearParser();
    } catch (error) {
      console.error("Error saving questions", error);
      alert("Failed to save questions to database.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 animate-in fade-in duration-500">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50/50 p-4">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-slate-800">
            <FileText className="w-5 h-5 text-blue-500" />
            Bulk Question Entry
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Paste your raw question text below. The system will detect questions and options.
            Ensure you have exactly 10 questions to proceed, and select the correct answer for each.
          </p>
        </div>
        
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Select Topic
            </label>
            <select 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full md:w-1/3 rounded-lg border-slate-300 border p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              {['General', 'Geography', 'Mathematics', 'Science', 'History', 'Technology'].map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            className="w-full h-64 p-4 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors outline-none resize-y font-mono text-sm leading-relaxed"
            placeholder="eg:&#10;1) What is React?&#10;A) Library&#10;B) Framework"
          />
        </div>

        <div className="px-4 pb-4">
          {saveSuccess && (
            <div className="p-4 rounded-lg border bg-emerald-50 border-emerald-200 text-emerald-800 mb-4 flex items-center gap-2">
               <CheckCircle className="w-5 h-5 text-emerald-600" /> 
               Questions successfully saved to the pool!
            </div>
          )}

          {rawText.trim().length > 0 && !saveSuccess && (
            <div className={`p-4 rounded-lg border flex items-start flex-col sm:flex-row gap-4 transition-colors ${isValidLength ? (allHaveAnswers ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-blue-50 border-blue-200 text-blue-800') : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
              <div className="flex gap-3 flex-1">
                {isValidLength ? <CheckCircle className={`w-5 h-5 shrink-0 mt-0.5 ${allHaveAnswers ? 'text-emerald-600' : 'text-blue-600'}`} /> : <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />}
                <div>
                  <h3 className="font-semibold">{parsedQuestions.length} / 10 Questions Parsed</h3>
                  {!isValidLength && (
                    <p className="text-sm opacity-90 mt-1">
                      You currently have {parsedQuestions.length} questions recognized. Please modify your text so exactly 10 questions are extracted.
                    </p>
                  )}
                  {isValidLength && !allHaveAnswers && (
                    <p className="text-sm opacity-90 mt-1">
                      Perfect! {parsedQuestions.length} questions parsed. Now, please select the <strong>correct answer</strong> for each question below.
                    </p>
                  )}
                  {isValidLength && allHaveAnswers && (
                    <p className="text-sm opacity-90 mt-1">
                      All questions parsed and answers assigned! Ready to save to the database.
                    </p>
                  )}
                </div>
              </div>
              
              <button 
                disabled={!canSave}
                onClick={handleSave}
                className={`px-6 py-2.5 rounded-lg shadow-sm font-medium flex items-center justify-center gap-2 whitespace-nowrap transition-all w-full sm:w-auto
                  ${canSave ? 'bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {isSaving ? 'Saving...' : 'Save to Firestore'}
              </button>
            </div>
          )}
        </div>
      </div>

      {parsedQuestions.length > 0 && !saveSuccess && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-slate-800 flex items-center gap-2">
            Preview & Verify Answers
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {parsedQuestions.map((q, idx) => (
              <div key={q.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                <div className="font-medium text-slate-900 mb-3 flex gap-2">
                  <span className="text-blue-500 font-bold shrink-0">{idx + 1}.</span>
                  <span className="break-words">{q.text}</span>
                </div>
                <div className="space-y-2 pl-6 flex-1">
                  {q.options.map((opt) => {
                    const isSelected = q.correctAnswer === opt.id;
                    return (
                      <label 
                        key={opt.id} 
                        className={`flex gap-3 text-sm items-center p-2 rounded border cursor-pointer transition-colors ${isSelected ? 'bg-blue-50 border-blue-200 shadow-inner' : 'hover:bg-slate-50 border-transparent hover:border-slate-200'}`}
                      >
                        <input 
                          type="radio" 
                          name={`q-${q.id}`} 
                          value={opt.id}
                          checked={isSelected}
                          onChange={() => setCorrectAnswer(q.id, opt.id)}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className={`font-medium rounded px-1.5 min-w-[1.5rem] text-center uppercase border ${isSelected ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                          {opt.id}
                        </span>
                        <span className={isSelected ? 'text-slate-900 font-medium' : 'text-slate-600'}>{opt.text}</span>
                      </label>
                    );
                  })}
                  {q.options.length === 0 && (
                    <span className="text-xs text-red-500 italic">No options parsed</span>
                  )}
                </div>
                {!q.correctAnswer && q.options.length > 0 && (
                   <div className="text-xs text-amber-600 bg-amber-50 px-3 py-1.5 rounded-md mt-4 font-medium flex items-center gap-1.5">
                     <AlertCircle className="w-3.5 h-3.5" />
                     Please assign the correct answer
                   </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
