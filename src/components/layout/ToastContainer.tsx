import React from 'react';
import { useHR } from '../../context/HRContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useHR();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
      {toasts.map(toast => {
        let borderClass = 'border-l-4 border-indigo-500';
        let Icon = Info;
        let iconColor = 'text-indigo-500';

        if (toast.type === 'success') {
          borderClass = 'border-l-4 border-emerald-500';
          Icon = CheckCircle2;
          iconColor = 'text-emerald-500';
        } else if (toast.type === 'error') {
          borderClass = 'border-l-4 border-rose-500';
          Icon = AlertCircle;
          iconColor = 'text-rose-500';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 ${borderClass} rounded-lg shadow-lg text-sm text-slate-800 dark:text-slate-100 animate-slide-in`}
          >
            <div className="flex items-center gap-2.5">
              <Icon className={`w-4 h-4 shrink-0 ${iconColor}`} />
              <span className="font-medium">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
