import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export default function LangToggle() {
  const { i18n } = useTranslation();

  const toggleLang = () => {
    const newLang = i18n.language.startsWith('tr') ? 'en' : 'tr';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLang}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
      title="Toggle Language"
    >
      <Globe className="w-4 h-4" />
      <span className="text-sm font-medium uppercase">{i18n.language.substring(0, 2)}</span>
    </button>
  );
}
