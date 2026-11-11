import React, { useState, useMemo } from 'react';
import { useHR } from '../../context/HRContext';
import { Attendance } from '../../types';
import { Plus, Edit2, Trash2, ArrowUpDown, X, AlertTriangle, RotateCcw } from 'lucide-react';

export const AttendanceView: React.FC = () => {
  const { attendance, employees, departments, addAttendance, updateAttendance, deleteAttendance } = useHR();

  // Filters
  const [empFilter, setEmpFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [sortAsc, setSortAsc] = useState(false); // default latest first

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAtt, setEditingAtt] = useState<Attendance | null>(null);
  const [employeeIdInput, setEmployeeIdInput] = useState<string>('');
  const [dateInput, setDateInput] = useState<string>(new Date().toISOString().slice(0, 10));
  const [statusInput, setStatusInput] = useState<'Present' | 'Absent' | 'Leave'>('Present');

  // Delete Confirm
  const [deletingAtt, setDeletingAtt] = useState<Attendance | null>(null);

  const handleOpenAdd = () => {
    setEditingAtt(null);
    setEmployeeIdInput('');
    setDateInput('2025-04-03');
    setStatusInput('Present');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (att: Attendance) => {
    setEditingAtt(att);
    setEmployeeIdInput(String(att.employee_id));
    setDateInput(att.attendance_date);
    setStatusInput(att.status);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const empId = parseInt(employeeIdInput, 10);

    if (editingAtt) {
      const res = updateAttendance(editingAtt.attendance_id, empId, dateInput, statusInput);
      if (res.success) setIsModalOpen(false);
    } else {
      const res = addAttendance(empId, dateInput, statusInput);
      if (res.success) setIsModalOpen(false);
    }
  };

  const handleConfirmDelete = () => {
    if (deletingAtt) {
      deleteAttendance(deletingAtt.attendance_id);
      setDeletingAtt(null);
    }
  };

  const handleResetFilters = () => {
    setEmpFilter('');
    setStatusFilter('');
    setStartDate('');
    setEndDate('');
  };

  const filteredAttendance = useMemo(() => {
    let result = attendance.filter(att => {
      if (empFilter && att.employee_id !== parseInt(empFilter, 10)) return false;
      if (statusFilter && att.status !== statusFilter) return false;
      if (startDate && att.attendance_date < startDate) return false;
      if (endDate && att.attendance_date > endDate) return false;
      return true;
    });

    result.sort((a, b) => {
      const dComp = b.attendance_date.localeCompare(a.attendance_date);
      if (dComp !== 0) return sortAsc ? -dComp : dComp;
      return sortAsc ? a.attendance_id - b.attendance_id : b.attendance_id - a.attendance_id;
    });

    return result;
  }, [attendance, empFilter, statusFilter, startDate, endDate, sortAsc]);

  const deletingEmployeeName = useMemo(() => {
    if (!deletingAtt) return '';
    return employees.find(e => e.employee_id === deletingAtt.employee_id)?.employee_name || `Emp #${deletingAtt.employee_id}`;
  }, [deletingAtt, employees]);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
      {/* Header Filters Bar */}
      <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Employee Filter */}
          <select
            value={empFilter}
            onChange={e => setEmpFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Employees</option>
            {employees.map(e => (
              <option key={e.employee_id} value={e.employee_id}>
                {e.employee_name}
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

          {(empFilter || statusFilter || startDate || endDate) && (
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white rounded-xl text-sm font-medium shadow-sm shadow-indigo-500/25 transition-all hover:shadow-md hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          <span>Record Attendance</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider sticky top-0">
            <tr>
              <th className="py-3 px-4 w-20">ID</th>
              <th className="py-3 px-4 whitespace-nowrap">Employee</th>
              <th className="py-3 px-4 whitespace-nowrap">Department</th>
              <th
                onClick={() => setSortAsc(!sortAsc)}
                className="py-3 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white select-none whitespace-nowrap"
              >
                <div className="flex items-center gap-1.5">
                  <span>Attendance Date</span>
                  <ArrowUpDown className="w-3.5 h-3.5 opacity-60" />
                </div>
              </th>
              <th className="py-3 px-4 whitespace-nowrap">Status</th>
              <th className="py-3 px-4 text-right whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredAttendance.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400 text-sm">
                  No records
                </td>
              </tr>
            ) : (
              filteredAttendance.map(att => {
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
                  <tr
                    key={att.attendance_id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-500 tabular-nums">
                      #{att.attendance_id}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                      {emp ? emp.employee_name : `Emp #${att.employee_id}`}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 text-xs whitespace-nowrap">
                      {dept ? dept.department_name : 'Unassigned'}
                    </td>
                    <td className="py-3.5 px-4 font-mono tabular-nums text-xs text-slate-600 dark:text-slate-300">
                      {att.attendance_date}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${badgeColor}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                        {att.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(att)}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          title="Edit Attendance"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingAtt(att)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                          title="Delete Attendance"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-scale-in">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingAtt ? 'Edit Attendance' : 'Record Attendance'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Employee *
                </label>
                <select
                  required
                  value={employeeIdInput}
                  onChange={e => setEmployeeIdInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="">Select Employee</option>
                  {employees.map(e => (
                    <option key={e.employee_id} value={e.employee_id}>
                      {e.employee_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Attendance Date *
                </label>
                <input
                  type="date"
                  required
                  value={dateInput}
                  onChange={e => setDateInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Status *
                </label>
                <select
                  required
                  value={statusInput}
                  onChange={e => setStatusInput(e.target.value as 'Present' | 'Absent' | 'Leave')}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="Leave">Leave</option>
                </select>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white rounded-xl text-sm font-medium shadow-sm transition-all"
                >
                  {editingAtt ? 'Update Record' : 'Save Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingAtt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4 animate-scale-in">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Delete Attendance Record</h3>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Are you sure you want to delete the attendance log for{' '}
              <strong className="text-slate-900 dark:text-white">{deletingEmployeeName}</strong> on{' '}
              <span className="font-mono">{deletingAtt.attendance_date}</span>?
            </p>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                onClick={() => setDeletingAtt(null)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-medium shadow-sm transition-colors"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
