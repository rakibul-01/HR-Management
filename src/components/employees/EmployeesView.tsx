import React, { useState, useMemo } from 'react';
import { useHR } from '../../context/HRContext';
import { Employee } from '../../types';
import { Search, Plus, Edit2, Trash2, ArrowUpDown, X, AlertTriangle } from 'lucide-react';

export const EmployeesView: React.FC = () => {
  const { employees, departments, addEmployee, updateEmployee, deleteEmployee } = useHR();

  // Search & Sorting state
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<'id' | 'name' | 'dept' | 'email'>('name');
  const [sortAsc, setSortAsc] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmp, setEditingEmp] = useState<Employee | null>(null);
  const [nameInput, setNameInput] = useState('');
  const [deptInput, setDeptInput] = useState<string>('');
  const [emailInput, setEmailInput] = useState('');

  // Delete Confirm Modal
  const [deletingEmp, setDeletingEmp] = useState<Employee | null>(null);

  const handleOpenAdd = () => {
    setEditingEmp(null);
    setNameInput('');
    setDeptInput('');
    setEmailInput('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (emp: Employee) => {
    setEditingEmp(emp);
    setNameInput(emp.employee_name);
    setDeptInput(emp.department_id ? String(emp.department_id) : '');
    setEmailInput(emp.email);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const deptId = deptInput ? parseInt(deptInput, 10) : null;

    if (editingEmp) {
      const res = updateEmployee(editingEmp.employee_id, nameInput, deptId, emailInput);
      if (res.success) setIsModalOpen(false);
    } else {
      const res = addEmployee(nameInput, deptId, emailInput);
      if (res.success) setIsModalOpen(false);
    }
  };

  const handleConfirmDelete = () => {
    if (deletingEmp) {
      deleteEmployee(deletingEmp.employee_id);
      setDeletingEmp(null);
    }
  };

  const toggleSort = (field: 'id' | 'name' | 'dept' | 'email') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // Filter & Sort
  const filteredEmployees = useMemo(() => {
    const q = search.toLowerCase().trim();
    let result = employees.filter(emp => {
      const dept = departments.find(d => d.department_id === emp.department_id);
      return (
        emp.employee_name.toLowerCase().includes(q) ||
        emp.email.toLowerCase().includes(q) ||
        (dept && dept.department_name.toLowerCase().includes(q))
      );
    });

    result.sort((a, b) => {
      if (sortField === 'id') {
        return sortAsc ? a.employee_id - b.employee_id : b.employee_id - a.employee_id;
      }
      if (sortField === 'name') {
        return sortAsc
          ? a.employee_name.localeCompare(b.employee_name)
          : b.employee_name.localeCompare(a.employee_name);
      }
      if (sortField === 'email') {
        return sortAsc ? a.email.localeCompare(b.email) : b.email.localeCompare(a.email);
      }
      if (sortField === 'dept') {
        const deptA = departments.find(d => d.department_id === a.department_id)?.department_name || '';
        const deptB = departments.find(d => d.department_id === b.department_id)?.department_name || '';
        return sortAsc ? deptA.localeCompare(deptB) : deptB.localeCompare(deptA);
      }
      return 0;
    });

    return result;
  }, [employees, departments, search, sortField, sortAsc]);

  // Chip colors for departments
  const getDeptColorClass = (deptId: number | null) => {
    switch (deptId) {
      case 1:
        return 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300';
      case 2:
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300';
      case 3:
        return 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300';
      case 4:
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
      {/* Table Header Bar */}
      <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email, or dept..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white rounded-xl text-sm font-medium shadow-sm shadow-indigo-500/25 transition-all hover:shadow-md hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider sticky top-0">
            <tr>
              <th
                onClick={() => toggleSort('id')}
                className="py-3 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white select-none whitespace-nowrap"
              >
                <div className="flex items-center gap-1.5">
                  <span>ID</span>
                  <ArrowUpDown className="w-3.5 h-3.5 opacity-60" />
                </div>
              </th>
              <th
                onClick={() => toggleSort('name')}
                className="py-3 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white select-none whitespace-nowrap"
              >
                <div className="flex items-center gap-1.5">
                  <span>Employee Name</span>
                  <ArrowUpDown className="w-3.5 h-3.5 opacity-60" />
                </div>
              </th>
              <th
                onClick={() => toggleSort('dept')}
                className="py-3 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white select-none whitespace-nowrap"
              >
                <div className="flex items-center gap-1.5">
                  <span>Department</span>
                  <ArrowUpDown className="w-3.5 h-3.5 opacity-60" />
                </div>
              </th>
              <th
                onClick={() => toggleSort('email')}
                className="py-3 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white select-none whitespace-nowrap"
              >
                <div className="flex items-center gap-1.5">
                  <span>Email</span>
                  <ArrowUpDown className="w-3.5 h-3.5 opacity-60" />
                </div>
              </th>
              <th className="py-3 px-4 text-right whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredEmployees.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-400 text-sm">
                  No records
                </td>
              </tr>
            ) : (
              filteredEmployees.map(emp => {
                const dept = departments.find(d => d.department_id === emp.department_id);
                return (
                  <tr
                    key={emp.employee_id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-500 tabular-nums">
                      #{emp.employee_id}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                      {emp.employee_name}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${getDeptColorClass(emp.department_id)}`}>
                        {dept ? dept.department_name : 'Unassigned'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                      {emp.email}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(emp)}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          title="Edit Employee"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingEmp(emp)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                          title="Delete Employee"
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
                {editingEmp ? 'Edit Employee' : 'Add Employee'}
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
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={nameInput}
                  onChange={e => setNameInput(e.target.value)}
                  placeholder="e.g. Alice Smith"
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Department
                </label>
                <select
                  value={deptInput}
                  onChange={e => setDeptInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="">Select Department</option>
                  {departments.map(d => (
                    <option key={d.department_id} value={d.department_id}>
                      {d.department_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={e => setEmailInput(e.target.value)}
                  placeholder="e.g. alice@company.com"
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
                  {editingEmp ? 'Update Employee' : 'Save Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingEmp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4 animate-scale-in">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Delete Employee</h3>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Are you sure you want to remove <strong className="text-slate-900 dark:text-white">{deletingEmp.employee_name}</strong>?
              All associated salary assignments and attendance logs will also be deleted in a safe database transaction.
            </p>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                onClick={() => setDeletingEmp(null)}
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
