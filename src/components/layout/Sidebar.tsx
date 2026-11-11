import React from 'react';
import { useHR } from '../../context/HRContext';
import { ActivePage } from '../../types';
import {
  LayoutDashboard,
  Users,
  Building2,
  BadgeDollarSign,
  CalendarCheck2,
  FileSpreadsheet,
  FileCode2,
  X,
  RotateCcw
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const { activePage, setActivePage, resetToSeedData } = useHR();

  const navItems: { id: ActivePage; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5 shrink-0" /> },
    { id: 'employees', label: 'Employees', icon: <Users className="w-5 h-5 shrink-0" /> },
    { id: 'departments', label: 'Departments', icon: <Building2 className="w-5 h-5 shrink-0" /> },
    { id: 'salaries', label: 'Salaries', icon: <BadgeDollarSign className="w-5 h-5 shrink-0" /> },
    { id: 'attendance', label: 'Attendance', icon: <CalendarCheck2 className="w-5 h-5 shrink-0" /> },
    { id: 'report', label: 'Report', icon: <FileSpreadsheet className="w-5 h-5 shrink-0" /> },
    { id: 'files', label: 'PHP Code & Files', icon: <FileCode2 className="w-5 h-5 shrink-0 text-amber-500" /> },
  ];

  const handleNavClick = (id: ActivePage) => {
    setActivePage(id);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300
          ${mobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0 lg:w-20 xl:w-64'}`}
      >
        {/* Brand Header */}
        <div className="h-17 px-4 xl:px-6 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div className="hidden xl:block">
              <span className="font-bold text-slate-900 dark:text-white tracking-tight text-base whitespace-nowrap">
                HR Management
              </span>
            </div>
          </div>

          {/* Close button for mobile */}
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-white lg:hidden"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all relative group
                  ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-sm shadow-indigo-500/25'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-indigo-500 rounded-r-md hidden xl:block" />
                )}
                {item.icon}
                <span className="whitespace-nowrap lg:hidden xl:inline">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 shrink-0">
          <button
            onClick={resetToSeedData}
            title="Reset database to initial sample data from seed.sql"
            className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4 shrink-0" />
            <span className="whitespace-nowrap lg:hidden xl:inline">Reset Seed Data</span>
          </button>
        </div>
      </aside>
    </>
  );
};
