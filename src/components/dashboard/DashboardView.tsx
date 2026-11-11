import React, { useEffect, useState } from 'react';
import { useHR } from '../../context/HRContext';
import { Users, Building2, BadgeDollarSign, CalendarCheck2, ArrowRight } from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    employees,
    departments,
    salaries,
    attendance,
    getTotalPayroll,
    getPresentTodayCount,
    getDepartmentEmployeeCounts,
    setActivePage
  } = useHR();

  const totalEmployees = employees.length;
  const totalDepartments = departments.length;
  const totalPayroll = getTotalPayroll();
  const presentToday = getPresentTodayCount();
  const deptCounts = getDepartmentEmployeeCounts();

  // Animated count-up simulation
  const [empCount, setEmpCount] = useState(0);
  const [deptCount, setDeptCount] = useState(0);
  const [payrollCount, setPayrollCount] = useState(0);
  const [presentCount, setPresentCount] = useState(0);

  useEffect(() => {
    const duration = 800;
    const start = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic

      setEmpCount(Math.round(totalEmployees * ease));
      setDeptCount(Math.round(totalDepartments * ease));
      setPayrollCount(totalPayroll * ease);
      setPresentCount(Math.round(presentToday * ease));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setEmpCount(totalEmployees);
        setDeptCount(totalDepartments);
        setPayrollCount(totalPayroll);
        setPresentCount(presentToday);
      }
    };

    requestAnimationFrame(animate);
  }, [totalEmployees, totalDepartments, totalPayroll, presentToday]);

  // Sort latest attendance records (latest 6)
  const sortedAttendance = [...attendance].sort((a, b) => {
    const dComp = b.attendance_date.localeCompare(a.attendance_date);
    if (dComp !== 0) return dComp;
    return b.attendance_id - a.attendance_id;
  }).slice(0, 6);

  // Department color palette
  const deptColors = ['#6366F1', '#10B981', '#0EA5E9', '#F59E0B', '#EC4899', '#8B5CF6'];

  // SVG Donut calculation
  const totalInDepts = deptCounts.reduce((acc, curr) => acc + curr.count, 0) || 1;
  let accumulatedAngle = 0;
  const radius = 64;
  const strokeWidth = 24;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="space-y-6">
      {/* 4 Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Employees */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex items-center justify-between transition-all hover:shadow-md hover:-translate-y-0.5">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Total Employees
            </p>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white tabular-nums tracking-tight">
              {empCount}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Departments */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex items-center justify-between transition-all hover:shadow-md hover:-translate-y-0.5">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Departments
            </p>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white tabular-nums tracking-tight">
              {deptCount}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        {/* Total Payroll */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex items-center justify-between transition-all hover:shadow-md hover:-translate-y-0.5">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Total Payroll
            </p>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white tabular-nums tracking-tight">
              ${payrollCount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <BadgeDollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Present Today */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex items-center justify-between transition-all hover:shadow-md hover:-translate-y-0.5">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Present Today
            </p>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white tabular-nums tracking-tight">
              {presentCount}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
            <CalendarCheck2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Grid: Department Chart + Latest Attendance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Employees per Department Chart */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Employees per Department
            </h2>
            <button
              onClick={() => setActivePage('departments')}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium"
            >
              Manage <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Donut Chart Visualization */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-4">
            <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth={strokeWidth}
                  className="text-slate-100 dark:text-slate-800"
                />
                {deptCounts.map((item, idx) => {
                  const percentage = item.count / totalInDepts;
                  const strokeDasharray = `${percentage * circumference} ${circumference}`;
                  const strokeDashoffset = -accumulatedAngle * circumference;
                  accumulatedAngle += percentage;
                  const color = deptColors[idx % deptColors.length];

                  return (
                    <circle
                      key={item.department.department_id}
                      cx="80"
                      cy="80"
                      r={radius}
                      fill="transparent"
                      stroke={color}
                      strokeWidth={strokeWidth}
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      className="transition-all duration-500"
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
                  {totalEmployees}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">Total Staff</span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex-1 space-y-2 w-full">
              {deptCounts.map((item, idx) => {
                const color = deptColors[idx % deptColors.length];
                const pct = totalInDepts > 0 ? Math.round((item.count / totalInDepts) * 100) : 0;
                return (
                  <div key={item.department.department_id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {item.department.department_name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 tabular-nums">
                      <span className="font-semibold text-slate-900 dark:text-white">{item.count}</span>
                      <span className="text-slate-400">({pct}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>{departments.length} Active departments</span>
            <span>{salaries.length} Configured payroll profiles</span>
          </div>
        </div>

        {/* Latest Attendance Records */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Latest Attendance
            </h2>
            <button
              onClick={() => setActivePage('attendance')}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Employee</th>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {sortedAttendance.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400 text-xs">
                      No attendance records logged
                    </td>
                  </tr>
                ) : (
                  sortedAttendance.map(att => {
                    const emp = employees.find(e => e.employee_id === att.employee_id);
                    const dept = departments.find(d => d.department_id === emp?.department_id);

                    let badgeColor = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400';
                    let dotColor = 'bg-emerald-500';

                    if (att.status === 'Absent') {
                      badgeColor = 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400';
                      dotColor = 'bg-rose-500';
                    } else if (att.status === 'Leave') {
                      badgeColor = 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400';
                      dotColor = 'bg-amber-500';
                    }

                    return (
                      <tr key={att.attendance_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="py-3 px-3 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                          {emp ? emp.employee_name : `Emp #${att.employee_id}`}
                        </td>
                        <td className="py-3 px-3 text-slate-600 dark:text-slate-300 text-xs">
                          {dept ? dept.department_name : 'Unassigned'}
                        </td>
                        <td className="py-3 px-3 text-slate-500 dark:text-slate-400 text-xs tabular-nums whitespace-nowrap">
                          {att.attendance_date}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${badgeColor}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                            {att.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Logged logs: {attendance.length}</span>
            <span>Current snapshot: April 2025</span>
          </div>
        </div>
      </div>
    </div>
  );
};
