import React, { useState, useMemo } from 'react';
import { useHR } from '../../context/HRContext';
import { Salary } from '../../types';
import { Search, Plus, Edit2, Trash2, ArrowUpDown, X, AlertTriangle } from 'lucide-react';

export const SalariesView: React.FC = () => {
  const { salaries, employees, departments, addSalary, updateSalary, deleteSalary } = useHR();

  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<'id' | 'emp' | 'basic' | 'bonus' | 'total'>('emp');
  const [sortAsc, setSortAsc] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSal, setEditingSal] = useState<Salary | null>(null);
  const [employeeIdInput, setEmployeeIdInput] = useState<string>('');
  const [basicSalaryInput, setBasicSalaryInput] = useState<string>('');
  const [bonusInput, setBonusInput] = useState<string>('');

  // Delete Confirm
  const [deletingSal, setDeletingSal] = useState<Salary | null>(null);

  const handleOpenAdd = () => {
    setEditingSal(null);
    setEmployeeIdInput('');
    setBasicSalaryInput('');
    setBonusInput('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sal: Salary) => {
    setEditingSal(sal);
    setEmployeeIdInput(String(sal.employee_id));
    setBasicSalaryInput(String(sal.basic_salary));
    setBonusInput(sal.bonus !== null ? String(sal.bonus) : '');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const empId = parseInt(employeeIdInput, 10);
    const basic = parseFloat(basicSalaryInput);
    const bonus = bonusInput ? parseFloat(bonusInput) : 0;

    if (editingSal) {
      const res = updateSalary(editingSal.salary_id, empId, basic, bonus);
      if (res.success) setIsModalOpen(false);
    } else {
      const res = addSalary(empId, basic, bonus);
      if (res.success) setIsModalOpen(false);
    }
  };

  const handleConfirmDelete = () => {
    if (deletingSal) {
      deleteSalary(deletingSal.salary_id);
      setDeletingSal(null);
    }
  };

  const toggleSort = (field: 'id' | 'emp' | 'basic' | 'bonus' | 'total') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const filteredSalaries = useMemo(() => {
    const q = search.toLowerCase().trim();
    let result = salaries.filter(sal => {
      const emp = employees.find(e => e.employee_id === sal.employee_id);
      const dept = departments.find(d => d.department_id === emp?.department_id);
      return (
        (emp && emp.employee_name.toLowerCase().includes(q)) ||
        (dept && dept.department_name.toLowerCase().includes(q)) ||
        String(sal.basic_salary).includes(q)
      );
    });

    result.sort((a, b) => {
      if (sortField === 'id') {
        return sortAsc ? a.salary_id - b.salary_id : b.salary_id - a.salary_id;
      }
      if (sortField === 'emp') {
        const nameA = employees.find(e => e.employee_id === a.employee_id)?.employee_name || '';
        const nameB = employees.find(e => e.employee_id === b.employee_id)?.employee_name || '';
        return sortAsc ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
      }
      if (sortField === 'basic') {
        return sortAsc ? a.basic_salary - b.basic_salary : b.basic_salary - a.basic_salary;
      }
      if (sortField === 'bonus') {
        const bonusA = a.bonus || 0;
        const bonusB = b.bonus || 0;
        return sortAsc ? bonusA - bonusB : bonusB - bonusA;
      }
      if (sortField === 'total') {
        const totalA = (a.basic_salary || 0) + (a.bonus || 0);
        const totalB = (b.basic_salary || 0) + (b.bonus || 0);
        return sortAsc ? totalA - totalB : totalB - totalA;
      }
      return 0;
    });

    return result;
  }, [salaries, employees, departments, search, sortField, sortAsc]);

  const deletingEmployeeName = useMemo(() => {
    if (!deletingSal) return '';
    return employees.find(e => e.employee_id === deletingSal.employee_id)?.employee_name || `Emp #${deletingSal.employee_id}`;
  }, [deletingSal, employees]);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
      {/* Header Bar */}
      <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search salaries by employee or dept..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white rounded-xl text-sm font-medium shadow-sm shadow-indigo-500/25 transition-all hover:shadow-md hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Salary Record</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider sticky top-0">
            <tr>
              <th className="py-3 px-4 w-20">ID</th>
              <th
                onClick={() => toggleSort('emp')}
                className="py-3 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white select-none whitespace-nowrap"
              >
                <div className="flex items-center gap-1.5">
                  <span>Employee</span>
                  <ArrowUpDown className="w-3.5 h-3.5 opacity-60" />
                </div>
              </th>
              <th className="py-3 px-4 whitespace-nowrap">Department</th>
              <th
                onClick={() => toggleSort('basic')}
                className="py-3 px-4 text-right cursor-pointer hover:text-slate-900 dark:hover:text-white select-none whitespace-nowrap"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Basic Salary</span>
                  <ArrowUpDown className="w-3.5 h-3.5 opacity-60" />
                </div>
              </th>
              <th
                onClick={() => toggleSort('bonus')}
                className="py-3 px-4 text-right cursor-pointer hover:text-slate-900 dark:hover:text-white select-none whitespace-nowrap"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Bonus</span>
                  <ArrowUpDown className="w-3.5 h-3.5 opacity-60" />
                </div>
              </th>
              <th
                onClick={() => toggleSort('total')}
                className="py-3 px-4 text-right cursor-pointer hover:text-slate-900 dark:hover:text-white select-none whitespace-nowrap"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Total Salary</span>
                  <ArrowUpDown className="w-3.5 h-3.5 opacity-60" />
                </div>
              </th>
              <th className="py-3 px-4 text-right whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredSalaries.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400 text-sm">
                  No records
                </td>
              </tr>
            ) : (
              filteredSalaries.map(sal => {
                const emp = employees.find(e => e.employee_id === sal.employee_id);
                const dept = departments.find(d => d.department_id === emp?.department_id);
                const total = (Number(sal.basic_salary) || 0) + (Number(sal.bonus) || 0);

                return (
                  <tr
                    key={sal.salary_id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-500 tabular-nums">
                      #{sal.salary_id}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                      {emp ? emp.employee_name : `Emp #${sal.employee_id}`}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 text-xs whitespace-nowrap">
                      {dept ? dept.department_name : 'Unassigned'}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-900 dark:text-slate-100">
                      ${Number(sal.basic_salary).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
                      +${Number(sal.bonus || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums font-bold text-slate-900 dark:text-white">
                      ${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(sal)}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          title="Edit Salary"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingSal(sal)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                          title="Delete Salary"
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
                {editingSal ? 'Edit Salary' : 'Add Salary'}
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
                      {e.employee_name} (ID: #{e.employee_id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Basic Salary ($) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={basicSalaryInput}
                  onChange={e => setBasicSalaryInput(e.target.value)}
                  placeholder="50000.00"
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Bonus ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={bonusInput}
                  onChange={e => setBonusInput(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
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
                  {editingSal ? 'Update Salary' : 'Save Salary'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingSal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4 animate-scale-in">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Delete Salary Record</h3>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Are you sure you want to delete the compensation profile for{' '}
              <strong className="text-slate-900 dark:text-white">{deletingEmployeeName}</strong>?
            </p>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                onClick={() => setDeletingSal(null)}
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
