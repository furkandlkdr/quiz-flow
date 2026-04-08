import { useEffect } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import QuestionEntry from './views/QuestionEntry';
import StudentQuiz from './views/StudentQuiz';
import Viewer from './views/Viewer';
import AdminDashboard from './views/AdminDashboard';
import AdminLogin from './views/AdminLogin';
import UploadLogin from './views/UploadLogin';
import { Database, GraduationCap, PlayCircle, BookOpen, Key } from 'lucide-react';
import { useAuthStore } from './store/useAuthStore';
import { useThemeStore } from './store/useThemeStore';
import { useTranslation } from 'react-i18next';
import ThemeToggle from './components/ThemeToggle';
import LangToggle from './components/LangToggle';

// Route Guards
const UploadGuard = ({ children }: { children: React.ReactNode }) => {
  const { hasPasscode } = useAuthStore();
  return hasPasscode ? <>{children}</> : <Navigate to="/upload-login" replace />;
};

function App() {
  const location = useLocation();
  const { theme } = useThemeStore();
  const { t } = useTranslation();

  // Handle dark mode global class injection
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  // Update Dynamic Title
  useEffect(() => {
    const map: Record<string, string> = {
      '/': t('home.title') + ' | QuizFlow',
      '/solve': t('nav.solveQuiz') + ' | QuizFlow',
      '/viewer': t('nav.cheatSheet') + ' | QuizFlow',
      '/admin': t('admin.title') + ' | QuizFlow',
      '/upload': t('upload.title') + ' | QuizFlow',
    };
    document.title = map[location.pathname] || 'QuizFlow';
  }, [location.pathname, t]);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col font-sans transition-colors duration-200">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 shadow-sm transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 py-2 sm:h-16 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
          <div className="flex items-center justify-between w-full sm:w-auto">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="bg-blue-600 dark:bg-blue-500 p-2 rounded-xl group-hover:bg-blue-700 dark:group-hover:bg-blue-600 transition-colors">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">QuizFlow</h1>
            </Link>
            
            <div className="sm:hidden flex items-center gap-2">
               <LangToggle />
               <ThemeToggle />
            </div>
          </div>
          
          <nav className="flex gap-1 sm:gap-2 overflow-x-auto items-center w-full sm:w-auto pb-1 sm:pb-0 scrollbar-hide">
            <Link 
              to="/viewer" 
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap ${location.pathname === '/viewer' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'}`}
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">{t('nav.cheatSheet')}</span>
            </Link>
            <Link 
              to="/solve" 
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap ${location.pathname === '/solve' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'}`}
            >
              <PlayCircle className="w-4 h-4" />
              <span className="hidden sm:inline">{t('nav.solveQuiz')}</span>
            </Link>
            <Link 
              to="/upload" 
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap ${(location.pathname === '/upload' || location.pathname === '/upload-login') ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'}`}
            >
              <Key className="w-4 h-4" />
              <span className="hidden sm:inline">{t('nav.editorUpload')}</span>
            </Link>
            <Link 
              to="/admin" 
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap ${(location.pathname === '/admin' || location.pathname === '/login') ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'}`}
            >
              <Database className="w-4 h-4" />
              <span className="hidden sm:inline">{t('nav.admin')}</span>
            </Link>

            <div className="hidden sm:flex items-center gap-2 ml-2 pl-2 border-l border-slate-200 dark:border-slate-700">
               <LangToggle />
               <ThemeToggle />
            </div>
          </nav>
        </div>
      </header>
      
      <main className="flex-1 py-4 sm:py-8">
        <Routes>
          <Route path="/" element={
            <div className="text-center mt-12 sm:mt-20 fade-in animate-in duration-500 px-4">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-white mb-4 tracking-tight">{t('home.title')}</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-xl mx-auto leading-relaxed">
                {t('home.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/solve" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow hover:bg-blue-700 flex justify-center items-center gap-2 transition">
                  <PlayCircle className="w-5 h-5" /> {t('home.startLearning')}
                </Link>
                <Link to="/viewer" className="bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 px-6 py-3 rounded-xl font-semibold shadow-sm hover:bg-emerald-50 dark:hover:bg-emerald-900/20 flex justify-center items-center gap-2 transition">
                  <BookOpen className="w-5 h-5" /> {t('home.browseCheatSheet')}
                </Link>
              </div>
            </div>
          } />

          {/* Secure Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/login" element={<AdminLogin />} />
          
          {/* Passcode Routes */}
          <Route path="/upload" element={<UploadGuard><QuestionEntry /></UploadGuard>} />
          <Route path="/upload-login" element={<UploadLogin />} />

          {/* Public Routes */}
          <Route path="/solve" element={<StudentQuiz />} />
          <Route path="/viewer" element={<Viewer />} />
        </Routes>
      </main>

      <footer className="w-full py-6 mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 text-center pb-2">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Made with <span className="text-red-500 animate-pulse inline-block mx-0.5">❤️</span> by{' '}
            <a 
              href="https://furkan.software" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-bold transition-colors underline decoration-2 underline-offset-4 decoration-indigo-200 dark:decoration-indigo-900 hover:decoration-indigo-500 dark:hover:decoration-indigo-400"
            >
              Nafair
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
