import { Routes, Route, Link, useLocation } from 'react-router-dom';
import QuestionEntry from './views/QuestionEntry';
import StudentQuiz from './views/StudentQuiz';
import { Database, GraduationCap, PlayCircle, Settings } from 'lucide-react';

function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-blue-600 p-2 rounded-xl group-hover:bg-blue-700 transition-colors">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">QuizMaster</h1>
          </Link>

          <nav className="flex gap-2">
            <Link
              to="/solve"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${location.pathname === '/solve' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
            >
              <PlayCircle className="w-4 h-4" />
              Solve Quiz
            </Link>
            <Link
              to="/admin"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${location.pathname === '/admin' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
            >
              <Database className="w-4 h-4" />
              Manage Questions
            </Link>
            <button className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1 py-8">
        <Routes>
          <Route path="/" element={
            <div className="text-center mt-20 fade-in animate-in duration-500">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">Welcome to QuizMaster</h2>
              <p className="text-slate-600 mb-8 max-w-xl mx-auto">Create robust tests securely and solve them with integrated recursive learning loops.</p>
              <div className="flex gap-4 justify-center">
                <Link to="/solve" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow hover:bg-blue-700 flex items-center gap-2">
                  <PlayCircle className="w-5 h-5" /> Start Learning
                </Link>
                <Link to="/admin" className="bg-white text-slate-700 border border-slate-200 px-6 py-3 rounded-xl font-semibold shadow-sm hover:bg-slate-50 flex items-center gap-2">
                  <Database className="w-5 h-5" /> Manage Content
                </Link>
              </div>
            </div>
          } />
          <Route path="/admin" element={<QuestionEntry />} />
          <Route path="/solve" element={<StudentQuiz />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
