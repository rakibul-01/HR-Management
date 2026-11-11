import React, { useState, useMemo } from 'react';
import { useHR } from '../../context/HRContext';
import { Search, Download, Printer, RotateCcw } from 'lucide-react';

export const ReportView: React.FC = () => {
  const { departments, getJoinedReport, showToast } = useHR();

  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const records = useMemo(() => {
    return getJoinedReport({
      department_id: deptFilter ? parseInt(deptFilter, 10) : null,
      status: statusFilter || null,
      start_date: startDate || null,
      end_date: endDate || null,
      search: search || null,
    });
  }, [getJoinedReport, deptFilter, statusFilter, startDate, endDate, search]);

  const handleResetFilters = () => {
    setSearch('');
    setDeptFilter('');
    setStatusFilter('');
    setStartDate('');
    setEndDate('');
  };

  const handleExportCSV = () => {
    if (records.length === 0) {
      showToast('No records to export.', 'info');
      return;
    }

    const headers = [
      'Employee Name',
      'Department',
      'Email',
      'Basic Salary',
      'Bonus',
      'Total Compensation',
      'Attendance Date',
      'Status'
    ];

    const csvRows = [
      headers.join(','),
      ...records.map(r => {
        const row = [
          `"${(r.employee_name || '').replace(/"/g, '""')}"`,
          `"${(r.department_name || '').replace(/"/g, '""')}"`,
          `"${(r.email || '').replace(/"/g, '""')}"`,
          r.basic_salary !== null ? r.basic_salary.toFixed(2) : '0.00',
          r.bonus !== null ? r.bonus.toFixed(2) : '0.00',
          r.total_salary !== null ? r.total_salary.toFixed(2) : '0.00',
          `"${r.attendance_date || 'N/A'}"`,
          `"${r.status || 'N/A'}"`
        ];
        return row.join(',');
      })
    ];

    const blob = new Blob(['\uFEFF' + csvRows.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `hr_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('Report downloaded as CSV successfully.');
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
      {/* Header Controls Bar */}
      <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 no-print">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative min-w-44">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search name or email..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Department Filter */}
          <select
            value={deptFilter}
            onChange={e => setDeptFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Departments</option>
            {departments.map(d => (
              <option key={d.department_id} value={d.department_id}>
                {d.department_name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Statuses</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Leave">Leave</option>
          </select>

          {/* Date range */}
          <div className="flex items-center gap-1.5 text-xs">
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              title="From date"
              className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
            />
            <span className="text-slate-400">to</span>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              title="To date"
              className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {(search || deptFilter || statusFilter || startDate || endDate) && (
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Action Buttons: Export CSV & Print */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white rounded-xl text-sm font-medium shadow-sm shadow-indigo-500/25 transition-all hover:shadow-md hover:-translate-y-0.5"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Printable Report Header */}
      <div className="hidden print:block p-6 border-b border-slate-300">
        <h1 className="text-2xl font-bold text-slate-900">HR Comprehensive Joined Report</h1>
        <p className="text-xs text-slate-500 mt-1">
          Generated on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} · Total records: {records.length}
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider sticky top-0">
            <tr>
              <th className="py-3 px-4 whitespace-nowrap">Employee Name</th>
              <th className="py-3 px-4 whitespace-nowrap">Department</th>
              <th className="py-3 px-4 whitespace-nowrap">Email</th>
              <th className="py-3 px-4 text-right whitespace-nowrap">Basic Salary</th>
              <th className="py-3 px-4 text-right whitespace-nowrap">Bonus</th>
              <th className="py-3 px-4 text-right whitespace-nowrap">Total Compensation</th>
              <th className="py-3 px-4 whitespace-nowrap">Attendance Date</th>
              <th className="py-3 px-4 whitespace-nowrap">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {records.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400 text-sm">
                  No records matching the filter criteria
                </td>
              </tr>
            ) : (
              records.map((r, idx) => {
                let badgeColor = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400';
                let dotColor = 'bg-emerald-500';

                if (r.status === 'Absent') {
                  badgeColor = 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400';
                  dotColor = 'bg-rose-500';
                } else if (r.status === 'Leave') {
                  badgeColor = 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400';
                  dotColor = 'bg-amber-500';
                }

                return (
                  <tr
                    key={idx}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                      {r.employee_name}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {r.department_name}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 text-xs">
                      {r.email}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-900 dark:text-slate-100">
                      {r.basic_salary !== null
                        ? `$${r.basic_salary.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        : '—'}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
                      {r.bonus !== null
                        ? `+$${r.bonus.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        : '—'}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums font-bold text-slate-900 dark:text-white">
                      {r.total_salary !== null
                        ? `$${r.total_salary.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        : '—'}
                    </td>
                    <td className="py-3.5 px-4 font-mono tabular-nums text-xs text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {r.attendance_date || '—'}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {r.status ? (
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${badgeColor}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                          {r.status}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Summary */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 no-print">
        <span>Showing {records.length} joined records</span>
        <span className="italic">Query: Employee LEFT JOIN Department, Salary, Attendance</span>
      </div>
    </div>
  );
};
