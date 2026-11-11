import React, { useState, useMemo } from 'react';
import { useHR } from '../../context/HRContext';
import { Department } from '../../types';
import { Search, Plus, Edit2, Trash2, ArrowUpDown, X, AlertTriangle } from 'lucide-react';

export const DepartmentsView: React.FC = () => {
  const { departments, employees, addDepartment, updateDepartment, deleteDepartment } = useHR();

  const [search, setSearch] = useState('');
  const [sortAsc, setSortAsc] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [nameInput, setNameInput] = useState('');

  // Delete Confirm
  const [deletingDept, setDeletingDept] = useState<Department | null>(null);

  const handleOpenAdd = () => {
    setEditingDept(null);
    setNameInput('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (dept: Department) => {
    setEditingDept(dept);
    setNameInput(dept.department_name);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDept) {
      const res = updateDepartment(editingDept.department_id, nameInput);
      if (res.success) setIsModalOpen(false);
    } else {
      const res = addDepartment(nameInput);
      if (res.success) setIsModalOpen(false);
    }
  };

  const handleConfirmDelete = () => {
    if (deletingDept) {
      const res = deleteDepartment(deletingDept.department_id);
      if (res.success) {
        setDeletingDept(null);
      }
    }
  };

  const filteredDepartments = useMemo(() => {
    const q = search.toLowerCase().trim();
    let result = departments.filter(d => d.department_name.toLowerCase().includes(q));

    result.sort((a, b) =>
      sortAsc
        ? a.department_name.localeCompare(b.department_name)
        : b.department_name.localeCompare(a.department_name)
    );
    return result;
  }, [departments, search, sortAsc]);

  const assignedCountForDept = (id: number) => {
    return employees.filter(e => e.department_id === id).length;
  };

  const deptColorClasses: Record<number, string> = {
    1: 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300',
    2: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
    3: 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300',
    4: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
      {/* Header Controls */}
      <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search departments..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white rounded-xl text-sm font-medium shadow-sm shadow-indigo-500/25 transition-all hover:shadow-md hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Department</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider sticky top-0">
            <tr>
              <th className="py-3 px-4 w-24">ID</th>
              <th
                onClick={() => setSortAsc(!sortAsc)}
                className="py-3 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white select-none whitespace-nowrap"
              >
                <div className="flex items-center gap-1.5">
                  <span>Department Name</span>
                  <ArrowUpDown className="w-3.5 h-3.5 opacity-60" />
                </div>
              </th>
              <th className="py-3 px-4 text-right whitespace-nowrap">Assigned Employees</th>
              <th className="py-3 px-4 text-right whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredDepartments.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-slate-400 text-sm">
                  No records
                </td>
              </tr>
            ) : (
              filteredDepartments.map(dept => {
                const assigned = assignedCountForDept(dept.department_id);
                const colorClass = deptColorClasses[dept.department_id] || 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
                return (
                  <tr
                    key={dept.department_id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-500 tabular-nums">
                      #{dept.department_id}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium ${colorClass}`}>
                        {dept.department_name}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-medium text-slate-900 dark:text-white tabular-nums">
                      {assigned}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(dept)}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          title="Edit Department"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingDept(dept)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                          title="Delete Department"
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
                {editingDept ? 'Edit Department' : 'Add Department'}
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
                  Department Name *
                </label>
                <input
                  type="text"
                  required
                  value={nameInput}
                  onChange={e => setNameInput(e.target.value)}
                  placeholder="e.g. Operations"
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
                  {editingDept ? 'Update Department' : 'Save Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingDept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4 animate-scale-in">
            {assignedCountForDept(deletingDept.department_id) > 0 ? (
              <>
                <div className="flex items-center gap-3 text-amber-600">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Cannot Delete Department</h3>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  The department <strong className="text-slate-900 dark:text-white">{deletingDept.department_name}</strong> currently has{' '}
                  <strong className="text-slate-900 dark:text-white">
                    {assignedCountForDept(deletingDept.department_id)} employee(s)
                  </strong>{' '}
                  assigned to it. Please reassign those employees to another department before deleting.
                </p>

                <div className="pt-2 flex items-center justify-end">
                  <button
                    onClick={() => setDeletingDept(null)}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-sm font-medium transition-colors"
                  >
                    Close
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 text-rose-600">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Delete Department</h3>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Are you sure you want to delete <strong className="text-slate-900 dark:text-white">{deletingDept.department_name}</strong>?
                  This action cannot be undone.
                </p>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    onClick={() => setDeletingDept(null)}
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
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
