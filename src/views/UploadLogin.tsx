import { useState } from 'react';
import { ShieldAlert, KeyRound } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function UploadLogin() {
  const { t } = useTranslation();
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const { hasPasscode, unlockPasscode } = useAuthStore();

  if (hasPasscode) {
    return <Navigate to="/upload" replace />;
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const VALID_PASS = import.meta.env.VITE_UPLOAD_PASS || 'admin123';
    
    if (pass === VALID_PASS) {
      unlockPasscode();
    } else {
      setError(t('login.incorrect'));
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 sm:mt-20 px-4 sm:px-8 py-8 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-300 mx-4 sm:mx-auto">
      <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-600 dark:text-blue-400">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-white mb-2">{t('login.restricted')}</h2>
      <p className="text-center text-slate-500 dark:text-slate-400 mb-8">{t('login.restrictedSub')}</p>
      
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
            <input 
              type="password" 
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder={t('login.passPlaceholder')}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none dark:text-white transition-colors"
            />
          </div>
          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        </div>
        <button type="submit" className="w-full bg-blue-600 dark:bg-blue-500 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition shadow">
          {t('login.unlock')}
        </button>
      </form>
    </div>
  );
}
