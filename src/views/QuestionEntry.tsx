import { useState, useEffect } from 'react';
import { FileText, CheckCircle, AlertCircle, Save, Loader2 } from 'lucide-react';
import { useQuizStore } from '../store/useQuizStore';
import { parseQuestions } from '../features/parser/QuestionParser';
import { saveQuestionsBatch } from '../api/firestoreService';
import { useTranslation } from 'react-i18next';

export default function QuestionEntry() {
  const { t } = useTranslation();
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
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 animate-in fade-in duration-500 transition-colors">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 p-4">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-slate-800 dark:text-white">
            <FileText className="w-5 h-5 text-blue-500" />
            {t('upload.title')}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t('upload.subtitle')}
          </p>
        </div>
        
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              {t('upload.selectTopic')}
            </label>
            <input 
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full md:w-1/3 rounded-lg border-slate-300 dark:border-slate-700 bg-transparent dark:text-white p-2 border focus:ring-2 focus:ring-blue-500 outline-none transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-500"
              placeholder={t('upload.selectTopic')}
            />
          </div>

          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            className="w-full h-64 p-4 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-colors outline-none resize-y font-mono text-sm leading-relaxed dark:text-slate-300"
            placeholder={t('upload.placeholder')}
          />
        </div>

        <div className="px-4 pb-4">
          {saveSuccess && (
            <div className="p-4 rounded-lg border bg-emerald-50 dark:bg-emerald-900/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 mb-4 flex items-center gap-2">
               <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> 
               {t('upload.success')}
            </div>
          )}

          {rawText.trim().length > 0 && !saveSuccess && (
            <div className={`p-4 rounded-lg border flex items-start flex-col sm:flex-row gap-4 transition-colors ${isValidLength ? (allHaveAnswers ? 'bg-emerald-50 dark:bg-emerald-900/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300' : 'bg-blue-50 dark:bg-blue-900/40 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300') : 'bg-amber-50 dark:bg-amber-900/40 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300'}`}>
              <div className="flex gap-3 flex-1">
                {isValidLength ? <CheckCircle className={`w-5 h-5 shrink-0 mt-0.5 ${allHaveAnswers ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-600 dark:text-blue-400'}`} /> : <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />}
                <div>
                  <h3 className="font-semibold">{t('upload.xParsed', { count: parsedQuestions.length })}</h3>
                  {!isValidLength && (
                    <p className="text-sm opacity-90 mt-1">
                      {t('upload.modifyText', { count: parsedQuestions.length })}
                    </p>
                  )}
                  {isValidLength && !allHaveAnswers && (
                    <p className="text-sm opacity-90 mt-1">
                      <span dangerouslySetInnerHTML={{ __html: t('upload.perfectParsed', { count: parsedQuestions.length }) }}></span>
                    </p>
                  )}
                  {isValidLength && allHaveAnswers && (
                    <p className="text-sm opacity-90 mt-1">
                      {t('upload.readyToSave')}
                    </p>
                  )}
                </div>
              </div>
              
              <button 
                disabled={!canSave}
                onClick={handleSave}
                className={`px-6 py-2.5 rounded-lg shadow-sm font-medium flex items-center justify-center gap-2 whitespace-nowrap transition-all w-full sm:w-auto
                  ${canSave ? 'bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer' : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'}`}
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {isSaving ? t('upload.saving') : t('upload.saveToFirestore')}
              </button>
            </div>
          )}
        </div>
      </div>

      {parsedQuestions.length > 0 && !saveSuccess && (
        <div className="space-y-4 pt-2">
          <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
            {t('upload.previewVerify')}
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {parsedQuestions.map((q, idx) => (
              <div key={q.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col transition-colors">
                <div className="font-medium text-slate-900 dark:text-slate-100 mb-3 flex gap-2">
                  <span className="text-blue-500 font-bold shrink-0">{idx + 1}.</span>
                  <span className="break-words max-h-40 overflow-y-auto pr-2">{q.text}</span>
                </div>
                <div className="space-y-2 pl-4 sm:pl-6 flex-1">
                  {q.options.map((opt) => {
                    const isSelected = q.correctAnswer === opt.id;
                    return (
                      <label 
                        key={opt.id} 
                        className={`flex gap-3 text-sm items-center p-2 rounded border cursor-pointer transition-colors ${isSelected ? 'bg-blue-50 dark:bg-blue-900/40 border-blue-200 dark:border-blue-800 shadow-inner' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 border-transparent hover:border-slate-200 dark:hover:border-slate-700'}`}
                      >
                        <input 
                          type="radio" 
                          name={`q-${q.id}`} 
                          value={opt.id}
                          checked={isSelected}
                          onChange={() => setCorrectAnswer(q.id, opt.id)}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-slate-600 bg-transparent shrink-0"
                        />
                        <span className={`font-medium rounded px-1.5 min-w-[1.5rem] text-center uppercase border shrink-0 ${isSelected ? 'bg-blue-100 dark:bg-blue-800/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'}`}>
                          {opt.id}
                        </span>
                        <span className={`break-words ${isSelected ? 'text-slate-900 dark:text-white font-medium' : 'text-slate-600 dark:text-slate-300'}`}>{opt.text}</span>
                      </label>
                    );
                  })}
                  {q.options.length === 0 && (
                    <span className="text-xs text-red-500 dark:text-red-400 italic">{t('upload.noOptions')}</span>
                  )}
                </div>
                {!q.correctAnswer && q.options.length > 0 && (
                   <div className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-3 py-2 rounded-md mt-4 font-medium flex items-center gap-1.5 border border-amber-200 dark:border-amber-800/50">
                     <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                     {t('upload.assignAnswer')}
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
