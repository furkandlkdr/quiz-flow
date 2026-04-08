import { useState } from 'react';
import { Database, LogIn, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { loginAdmin } from '../api/authService';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function AdminLogin() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { isAdmin, loading: authLoading } = useAuthStore();

  if (authLoading) {
    return <div className="flex justify-center p-20"><Loader2 className="w-8 h-8 animate-spin text-blue-500"/></div>;
  }

  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await loginAdmin(email, pass);
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 sm:mt-20 px-4 sm:px-8 py-8 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-300 mx-4 sm:mx-auto">
      <div className="w-16 h-16 bg-slate-900 dark:bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white shadow-lg">
        <Database className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-white mb-2">{t('login.adminTitle')}</h2>
      <p className="text-center text-slate-500 dark:text-slate-400 mb-8">{t('login.adminSub')}</p>
      
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('login.emailPlace')}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-slate-900 dark:focus:ring-indigo-500 outline-none dark:text-white transition-colors"
            required
          />
        </div>
        <div>
          <input 
            type="password" 
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder={t('login.passPlace')}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-slate-900 dark:focus:ring-indigo-500 outline-none dark:text-white transition-colors"
            required
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button 
          disabled={loading}
          type="submit" 
          className="w-full bg-slate-900 dark:bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-slate-800 dark:hover:bg-indigo-500 transition shadow flex justify-center items-center gap-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
          {t('login.loginFirebase')}
        </button>
      </form>
    </div>
  );
}
