import React from 'react';
import { useHR } from '../../context/HRContext';
import { Sun, Moon, Menu } from 'lucide-react';

interface TopbarProps {
  onMenuToggle: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onMenuToggle }) => {
  const { activePage, theme, toggleTheme } = useHR();

  const pageTitles: Record<string, string> = {
    dashboard: 'Dashboard',
    employees: 'Employees',
    departments: 'Departments',
    salaries: 'Salaries',
    attendance: 'Attendance',
    report: 'HR Report',
    files: 'PHP Project Source Code & Files',
  };

  return (
    <header className="h-17 px-4 sm:px-8 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 z-30 transition-colors">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="p-2 -ml-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg lg:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          {pageTitles[activePage] || 'Dashboard'}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-all shadow-xs"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-700" />
          )}
        </button>
      </div>
    </header>
  );
};
