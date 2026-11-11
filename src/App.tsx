import React, { useState } from 'react';
import { HRProvider, useHR } from './context/HRContext';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { ToastContainer } from './components/layout/ToastContainer';
import { DashboardView } from './components/dashboard/DashboardView';
import { EmployeesView } from './components/employees/EmployeesView';
import { DepartmentsView } from './components/departments/DepartmentsView';
import { SalariesView } from './components/salaries/SalariesView';
import { AttendanceView } from './components/attendance/AttendanceView';
import { ReportView } from './components/report/ReportView';
import { ProjectFilesView } from './components/code-viewer/ProjectFilesView';

const MainLayout: React.FC = () => {
  const { activePage } = useHR();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      {/* Sidebar */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-20 xl:ml-64 transition-all duration-300">
        <Topbar onMenuToggle={() => setMobileOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activePage === 'dashboard' && <DashboardView />}
          {activePage === 'employees' && <EmployeesView />}
          {activePage === 'departments' && <DepartmentsView />}
          {activePage === 'salaries' && <SalariesView />}
          {activePage === 'attendance' && <AttendanceView />}
          {activePage === 'report' && <ReportView />}
          {activePage === 'files' && <ProjectFilesView />}
        </main>
      </div>

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <HRProvider>
      <MainLayout />
    </HRProvider>
  );
}
