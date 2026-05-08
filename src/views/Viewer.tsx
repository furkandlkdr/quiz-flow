import { useState, useEffect } from 'react';
import { BookOpen, Filter, Search, Loader2 } from 'lucide-react';
import { getAllQuestions } from '../api/firestoreService';
import type { Question } from '../features/parser/QuestionParser';
import { useTranslation } from 'react-i18next';
import { getDefaultTopicLabel } from '../utils/topic';

export default function Viewer() {
  const { t, i18n } = useTranslation();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTopic, setFilterTopic] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const qs = await getAllQuestions();
        setQuestions(qs);
      } catch (e) {
        console.error("Error fetching for viewer", e);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const topics = ['All', ...Array.from(new Set(questions.map(q => q.topic || getDefaultTopicLabel(i18n.language))))];

  const filtered = questions.filter(q => {
    const matchTopic = filterTopic === 'All' || q.topic === filterTopic;
    const matchSearch = q.text.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTopic && matchSearch;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 sm:py-8 animate-in fade-in transition-colors">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
            <BookOpen className="text-emerald-500 w-8 h-8" />
            {t('viewer.title')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm sm:text-base">{t('viewer.subtitle')}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder={t('common.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 w-full sm:w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm dark:text-white"
            />
          </div>
          <div className="relative">
            <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <select 
              value={filterTopic}
              onChange={(e) => setFilterTopic(e.target.value)}
              className="pl-9 pr-8 py-2 w-full sm:w-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm appearance-none dark:text-white"
            >
              {topics.map(tOption => <option key={tOption} value={tOption}>{tOption === 'All' ? t('common.all') : tOption}</option>)}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-12 sm:p-20 text-slate-500 dark:text-slate-400 gap-3">
           <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
           <p>{t('common.loading')}</p>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {filtered.length === 0 ? (
            <div className="p-8 sm:p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500 dark:text-slate-400">
               {t('viewer.noQuestions')}
            </div>
          ) : (
            filtered.map((q, idx) => (
              <div key={q.id} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-4 sm:p-6 flex flex-col md:flex-row gap-4 sm:gap-6">
                 <div className="flex-1 space-y-4">
                    <div className="flex items-start gap-3">
                      <span className="text-emerald-500 font-bold mt-1 shrink-0">{idx + 1}.</span>
                      <h3 className="text-base sm:text-lg font-medium text-slate-800 dark:text-slate-200 leading-relaxed">{q.text}</h3>
                    </div>
                    
                    <div className="space-y-2 pl-6 sm:pl-7">
                      {q.options.map(opt => {
                        const isCorrect = q.correctAnswer === opt.id;
                        return (
                          <div key={opt.id} className={`flex items-center gap-3 text-sm px-3 py-2 rounded-lg border transition-colors ${isCorrect ? 'bg-emerald-50 dark:bg-emerald-900/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 font-medium' : 'bg-slate-50 dark:bg-slate-800/50 border-transparent text-slate-600 dark:text-slate-400'}`}>
                             <span className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${isCorrect ? 'bg-emerald-200 dark:bg-emerald-700 text-emerald-800 dark:text-emerald-50' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300'}`}>
                               {opt.id}
                             </span>
                             <span className="break-words">{opt.text}</span>
                          </div>
                        )
                      })}
                    </div>
                 </div>

                 <div className="md:w-48 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex flex-col justify-center items-center text-center gap-2">
                    <span className="text-xs uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">{t('viewer.correctAnswer')}</span>
                    <span className="text-3xl sm:text-4xl font-black text-emerald-500">{q.correctAnswer}</span>
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-2 bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded-full">{q.topic || getDefaultTopicLabel(i18n.language)}</span>
                 </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
