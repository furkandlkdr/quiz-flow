import { useState, useEffect } from 'react';
import { Database, Trash2, Edit3, Loader2, LogOut, X } from 'lucide-react';
import { getAllQuestions, deleteQuestion, updateQuestion } from '../api/firestoreService';
import type { Question } from '../features/parser/QuestionParser';
import QuestionEntry from './QuestionEntry';
import { downloadMarkdownFile, exportQuestionsDocx, copyToClipboardPlainText } from '../features/export/exportQuestions';
import { useAuthStore } from '../store/useAuthStore';
import { logoutAdmin } from '../api/authService';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getDefaultTopicLabel } from '../utils/topic';

export default function AdminDashboard() {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState<'manage' | 'upload'>('manage');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Edit logic
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  const { isAdmin, loading: authLoading } = useAuthStore();

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const qs = await getAllQuestions();
      setQuestions(qs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'manage' && isAdmin) {
      fetchQuestions();
    }
  }, [activeTab, isAdmin]);

  if (authLoading) return <div className="p-20 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500" /></div>;
  if (!isAdmin) return <Navigate to="/login" replace />;

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('admin.deleteConfirm'))) return;
    await deleteQuestion(id);
    setQuestions(q => q.filter(x => x.id !== id));
  };

  const handleUpdate = async () => {
    if (!editingQuestion) return;
    setEditLoading(true);
    await updateQuestion(editingQuestion.id!, editingQuestion);
    setQuestions(q => q.map(x => x.id === editingQuestion.id ? editingQuestion : x));
    setEditingQuestion(null);
    setEditLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 text-slate-900 dark:text-slate-100 transition-colors">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
          <Database className="text-indigo-600 dark:text-indigo-400" />
          {t('admin.title')}
        </h1>
        <button 
          onClick={() => logoutAdmin()} 
          className="text-sm font-medium text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" /> {t('common.signOut')}
        </button>
      </div>

      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 mb-6 overflow-x-auto overflow-y-hidden">
        <button 
          onClick={() => setActiveTab('manage')}
          className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 whitespace-nowrap ${activeTab === 'manage' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/20' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
        >
          {t('admin.managePool')}
        </button>
        <button 
          onClick={() => setActiveTab('upload')}
          className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 whitespace-nowrap ${activeTab === 'upload' ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-900/20' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
        >
          {t('admin.bulkUpload')}
        </button>
      </div>

      {activeTab === 'upload' && (
        <QuestionEntry />
      )}

      {activeTab === 'manage' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in transition-colors">
          {loading ? (
            <div className="p-20 text-center text-slate-500 flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
              {t('admin.loadingDb')}
            </div>
          ) : (
             <div>
               {/* Export toolbar - shown when at least one question selected */}
               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 px-2 sm:px-3">
                 {selectedIds.length > 0 ? (
                   <span className="text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">{t('admin.selectedCount', { count: selectedIds.length })}</span>
                 ) : (
                   <span className="text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">{t('admin.selectThenExport')}</span>
                 )}
                 <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto sm:items-center sm:justify-end">
                   <button disabled={selectedIds.length === 0} onClick={async () => { const sel = questions.filter(q => selectedIds.includes(q.id!)); await copyToClipboardPlainText(sel, i18n.language); alert(t('admin.copySuccess')); }} className="w-full sm:w-auto px-3 py-2 text-sm bg-slate-100 dark:bg-slate-800 rounded-md hover:bg-slate-200 disabled:opacity-50">
                    {t('admin.copyForWord')}
                   </button>
                   <button disabled={selectedIds.length === 0} onClick={async () => { const sel = questions.filter(q => selectedIds.includes(q.id!)); await exportQuestionsDocx(sel, i18n.language); }} className="w-full sm:w-auto px-3 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50">
                     {t('admin.exportDocx')}
                   </button>
                   <button disabled={selectedIds.length === 0} onClick={() => { const sel = questions.filter(q => selectedIds.includes(q.id!)); downloadMarkdownFile(sel, i18n.language); }} className="w-full sm:w-auto px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 rounded-md hover:bg-slate-100 disabled:opacity-50">
                     {t('admin.exportMd')}
                   </button>
                 </div>
               </div>

               <div className="md:hidden px-2 sm:px-3 pb-3 space-y-3">
                 {questions.length === 0 ? (
                   <div className="p-6 text-center text-slate-400 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">{t('admin.noQuestions')}</div>
                 ) : questions.map(q => {
                   const isSelected = selectedIds.includes(q.id!);
                   return (
                     <div key={q.id} className={`rounded-2xl border p-4 shadow-sm transition-colors ${isSelected ? 'border-indigo-300 dark:border-indigo-700 bg-indigo-50/60 dark:bg-indigo-950/30' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'}`}>
                       <div className="flex items-start justify-between gap-3 mb-3">
                         <label className="flex items-center gap-3 min-w-0">
                           <input type="checkbox" checked={isSelected} onChange={e => {
                             if (e.target.checked) setSelectedIds(s => [...s, q.id!]); else setSelectedIds(s => s.filter(id => id !== q.id));
                           }} />
                           <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded text-xs font-medium whitespace-nowrap">{q.topic || getDefaultTopicLabel(i18n.language)}</span>
                         </label>
                         <div className="flex gap-2 shrink-0">
                           <button onClick={() => setEditingQuestion(q)} className="text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 p-2 rounded-lg transition" title={t('admin.editQuestion')}>
                             <Edit3 className="w-4 h-4" />
                           </button>
                           <button onClick={() => handleDelete(q.id!)} className="text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg transition" title="Delete">
                             <Trash2 className="w-4 h-4" />
                           </button>
                         </div>
                       </div>
                       <div className="text-sm font-medium text-slate-800 dark:text-slate-200 whitespace-normal break-words leading-relaxed mb-3">
                         {q.text}
                       </div>
                       <div className="flex items-center justify-between gap-3 text-xs">
                         <span className="text-slate-500 dark:text-slate-400">{t('admin.correctAnswer')}</span>
                         <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 px-2 py-1 rounded text-xs font-bold uppercase">{q.correctAnswer}</span>
                       </div>
                     </div>
                   );
                 })}
               </div>

               <div className="relative hidden md:block overflow-x-auto w-full">
                 <table className="w-full table-auto text-sm text-left text-slate-600 dark:text-slate-300">
                   <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                     <tr>
                       <th className="px-4 sm:px-6 py-4 font-semibold w-12">
                         <input type="checkbox" checked={selectedIds.length > 0 && selectedIds.length === questions.length} onChange={e => {
                           if (e.target.checked) setSelectedIds(questions.map(q => q.id!)); else setSelectedIds([]);
                         }} />
                       </th>
                       <th className="px-4 sm:px-6 py-4 font-semibold">{t('admin.topic')}</th>
                       <th className="px-4 sm:px-6 py-4 font-semibold w-1/2">{t('admin.questionText')}</th>
                       <th className="px-4 sm:px-6 py-4 font-semibold">{t('admin.correctAnswer')}</th>
                       <th className="px-4 sm:px-6 py-4 font-semibold text-right">{t('admin.actions')}</th>
                     </tr>
                   </thead>
                   <tbody>
                     {questions.length === 0 ? (
                       <tr><td colSpan={5} className="p-8 text-center text-slate-400">{t('admin.noQuestions')}</td></tr>
                     ) : questions.map(q => (
                       <tr key={q.id} className="bg-white dark:bg-slate-900 border-b hover:bg-slate-50 dark:hover:bg-slate-800/50 transition border-slate-100 dark:border-slate-800 last:border-0">
                         <td className="px-4 sm:px-6 py-4">
                           <input type="checkbox" checked={selectedIds.includes(q.id!)} onChange={e => {
                             if (e.target.checked) setSelectedIds(s => [...s, q.id!]); else setSelectedIds(s => s.filter(id => id !== q.id));
                           }} />
                         </td>
                         <td className="px-4 sm:px-6 py-4">
                           <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded text-xs font-medium whitespace-nowrap">{q.topic || getDefaultTopicLabel(i18n.language)}</span>
                         </td>
                         <td className="px-4 sm:px-6 py-4 font-medium text-slate-800 dark:text-slate-200 whitespace-normal break-words align-top">
                           {q.text}
                         </td>
                         <td className="px-4 sm:px-6 py-4">
                           <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 px-2 py-1 rounded text-xs font-bold uppercase">{q.correctAnswer}</span>
                         </td>
                         <td className="px-4 sm:px-6 py-4 text-right flex justify-end gap-2">
                           <button onClick={() => setEditingQuestion(q)} className="text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 p-2 rounded-lg transition" title={t('admin.editQuestion')}>
                             <Edit3 className="w-4 h-4" />
                           </button>
                           <button onClick={() => handleDelete(q.id!)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 p-2 rounded-lg transition" title="Delete">
                             <Trash2 className="w-4 h-4" />
                           </button>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
             </div>
          )}
        </div>
      )}

      {/* Edit Modal Overlay */}
      {editingQuestion && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-white">
                <Edit3 className="text-indigo-500 w-5 h-5" />
                {t('admin.editQuestion')}
              </h2>
              <button onClick={() => setEditingQuestion(null)} className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
               <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">{t('admin.topic')}</label>
                  <input type="text" value={editingQuestion.topic || ''} onChange={e => setEditingQuestion({...editingQuestion, topic: e.target.value})} className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 bg-transparent rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white" />
               </div>
               <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">{t('admin.questionText')}</label>
                  <textarea rows={3} value={editingQuestion.text} onChange={e => setEditingQuestion({...editingQuestion, text: e.target.value})} className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 bg-transparent rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white" />
               </div>
               
               <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t('admin.correctAnswer')}</label>
                  {editingQuestion.options.map(opt => (
                    <div key={opt.id} className="flex gap-2 items-center">
                       <input 
                         type="radio" 
                         name="correct-answer-edit"
                         checked={editingQuestion.correctAnswer === opt.id}
                         onChange={() => setEditingQuestion({...editingQuestion, correctAnswer: opt.id})}
                         className="w-4 h-4 text-indigo-600 shrink-0"
                       />
                       <span className="font-bold text-slate-700 dark:text-slate-300 pointer-events-none">{opt.id})</span>
                       <input 
                          type="text" 
                          value={opt.text} 
                          title="Option text"
                          onChange={e => {
                            const newOps = editingQuestion.options.map(o => o.id === opt.id ? { ...o, text: e.target.value } : o);
                            setEditingQuestion({...editingQuestion, options: newOps});
                          }} 
                          className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 bg-transparent rounded focus:ring-2 focus:ring-indigo-500 outline-none text-sm dark:text-slate-200" 
                       />
                    </div>
                  ))}
               </div>
            </div>

            <div className="p-4 sm:p-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 bg-slate-50 dark:bg-slate-800/20">
               <button onClick={() => setEditingQuestion(null)} className="px-5 py-2 font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition">
                  {t('common.cancel')}
               </button>
               <button onClick={handleUpdate} disabled={editLoading} className="px-5 py-2 font-medium bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl transition flex gap-2 items-center">
                  {editLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {t('admin.updateButton')}
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
