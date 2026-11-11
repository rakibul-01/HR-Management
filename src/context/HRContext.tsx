import React, { createContext, useContext, useState, useEffect } from 'react';
import { Department, Employee, Salary, Attendance, ReportRow, ToastMessage, ActivePage } from '../types';
import { initialDepartments, initialEmployees, initialSalaries, initialAttendance } from '../data/seedData';

interface HRContextType {
  departments: Department[];
  employees: Employee[];
  salaries: Salary[];
  attendance: Attendance[];
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  // Department CRUD
  addDepartment: (name: string) => { success: boolean; message: string };
  updateDepartment: (id: number, name: string) => { success: boolean; message: string };
  deleteDepartment: (id: number) => { success: boolean; message: string };

  // Employee CRUD
  addEmployee: (name: string, departmentId: number | null, email: string) => { success: boolean; message: string };
  updateEmployee: (id: number, name: string, departmentId: number | null, email: string) => { success: boolean; message: string };
  deleteEmployee: (id: number) => { success: boolean; message: string };

  // Salary CRUD
  addSalary: (employeeId: number, basicSalary: number, bonus: number | null) => { success: boolean; message: string };
  updateSalary: (id: number, employeeId: number, basicSalary: number, bonus: number | null) => { success: boolean; message: string };
  deleteSalary: (id: number) => { success: boolean; message: string };

  // Attendance CRUD
  addAttendance: (employeeId: number, date: string, status: 'Present' | 'Absent' | 'Leave') => { success: boolean; message: string };
  updateAttendance: (id: number, employeeId: number, date: string, status: 'Present' | 'Absent' | 'Leave') => { success: boolean; message: string };
  deleteAttendance: (id: number) => { success: boolean; message: string };

  // Calculations & Queries
  getTotalPayroll: () => number;
  getPresentTodayCount: () => number;
  getDepartmentEmployeeCounts: () => { department: Department; count: number }[];
  getJoinedReport: (filters?: {
    department_id?: number | null;
    status?: string | null;
    start_date?: string | null;
    end_date?: string | null;
    search?: string | null;
  }) => ReportRow[];

  resetToSeedData: () => void;
}

const HRContext = createContext<HRContextType | null>(null);

const STORAGE_KEYS = {
  DEPTS: 'hr_management_depts',
  EMPS: 'hr_management_emps',
  SALARIES: 'hr_management_salaries',
  ATTENDANCE: 'hr_management_attendance',
  THEME: 'hr_dashboard_theme',
};

export const HRProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [departments, setDepartments] = useState<Department[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DEPTS);
      return saved ? JSON.parse(saved) : initialDepartments;
    } catch {
      return initialDepartments;
    }
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EMPS);
      return saved ? JSON.parse(saved) : initialEmployees;
    } catch {
      return initialEmployees;
    }
  });

  const [salaries, setSalaries] = useState<Salary[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SALARIES);
      return saved ? JSON.parse(saved) : initialSalaries;
    } catch {
      return initialSalaries;
    }
  });

  const [attendance, setAttendance] = useState<Attendance[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
      return saved ? JSON.parse(saved) : initialAttendance;
    } catch {
      return initialAttendance;
    }
  });

  const [activePage, setActivePage] = useState<ActivePage>('dashboard');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  // Theme synchronization
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Local storage persistence
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DEPTS, JSON.stringify(departments));
      localStorage.setItem(STORAGE_KEYS.EMPS, JSON.stringify(employees));
      localStorage.setItem(STORAGE_KEYS.SALARIES, JSON.stringify(salaries));
      localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));
    } catch (e) {
      console.error('Failed to sync to local storage:', e);
    }
  }, [departments, employees, salaries, attendance]);

  // Toast Helper
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 5);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Reset to seed data
  const resetToSeedData = () => {
    setDepartments(initialDepartments);
    setEmployees(initialEmployees);
    setSalaries(initialSalaries);
    setAttendance(initialAttendance);
    showToast('Database reset to initial sample data.', 'info');
  };

  // ===================== DEPARTMENT CRUD =====================
  const addDepartment = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return { success: false, message: 'Department name is required.' };
    const maxId = departments.reduce((max, d) => Math.max(max, d.department_id), 0);
    const newDept: Department = { department_id: maxId + 1, department_name: trimmed };
    setDepartments(prev => [...prev, newDept]);
    showToast('Department created successfully.');
    return { success: true, message: 'Department created successfully.' };
  };

  const updateDepartment = (id: number, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return { success: false, message: 'Department name is required.' };
    setDepartments(prev => prev.map(d => (d.department_id === id ? { ...d, department_name: trimmed } : d)));
    showToast('Department updated successfully.');
    return { success: true, message: 'Department updated successfully.' };
  };

  const deleteDepartment = (id: number) => {
    const assignedEmps = employees.filter(e => e.department_id === id);
    if (assignedEmps.length > 0) {
      const msg = `Cannot delete department: ${assignedEmps.length} employee(s) are assigned to it.`;
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
    setDepartments(prev => prev.filter(d => d.department_id !== id));
    showToast('Department deleted successfully.');
    return { success: true, message: 'Department deleted successfully.' };
  };

  // ===================== EMPLOYEE CRUD =====================
  const addEmployee = (name: string, departmentId: number | null, email: string) => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    if (!trimmedName) return { success: false, message: 'Employee name is required.' };
    if (!trimmedEmail || !trimmedEmail.includes('@')) return { success: false, message: 'A valid email is required.' };

    const maxId = employees.reduce((max, e) => Math.max(max, e.employee_id), 100);
    const newEmp: Employee = {
      employee_id: maxId + 1,
      employee_name: trimmedName,
      department_id: departmentId,
      email: trimmedEmail,
    };
    setEmployees(prev => [...prev, newEmp]);
    showToast('Employee created successfully.');
    return { success: true, message: 'Employee created successfully.' };
  };

  const updateEmployee = (id: number, name: string, departmentId: number | null, email: string) => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    if (!trimmedName) return { success: false, message: 'Employee name is required.' };
    if (!trimmedEmail || !trimmedEmail.includes('@')) return { success: false, message: 'A valid email is required.' };

    setEmployees(prev =>
      prev.map(e =>
        e.employee_id === id
          ? { ...e, employee_name: trimmedName, department_id: departmentId, email: trimmedEmail }
          : e
      )
    );
    showToast('Employee updated successfully.');
    return { success: true, message: 'Employee updated successfully.' };
  };

  const deleteEmployee = (id: number) => {
    // Cascading delete corresponding salary and attendance records (transaction behavior)
    setSalaries(prev => prev.filter(s => s.employee_id !== id));
    setAttendance(prev => prev.filter(a => a.employee_id !== id));
    setEmployees(prev => prev.filter(e => e.employee_id !== id));
    showToast('Employee and associated records deleted.');
    return { success: true, message: 'Employee and associated records deleted.' };
  };

  // ===================== SALARY CRUD =====================
  const addSalary = (employeeId: number, basicSalary: number, bonus: number | null) => {
    if (!employeeId) return { success: false, message: 'Please select an employee.' };
    if (isNaN(basicSalary) || basicSalary < 0) return { success: false, message: 'Basic salary must be non-negative.' };

    const maxId = salaries.reduce((max, s) => Math.max(max, s.salary_id), 0);
    const newSalary: Salary = {
      salary_id: maxId + 1,
      employee_id: employeeId,
      basic_salary: Number(basicSalary),
      bonus: bonus !== null ? Number(bonus) : 0,
    };
    setSalaries(prev => [...prev, newSalary]);
    showToast('Salary record created successfully.');
    return { success: true, message: 'Salary record created successfully.' };
  };

  const updateSalary = (id: number, employeeId: number, basicSalary: number, bonus: number | null) => {
    if (!employeeId) return { success: false, message: 'Please select an employee.' };
    if (isNaN(basicSalary) || basicSalary < 0) return { success: false, message: 'Basic salary must be non-negative.' };

    setSalaries(prev =>
      prev.map(s =>
        s.salary_id === id
          ? { ...s, employee_id: employeeId, basic_salary: Number(basicSalary), bonus: bonus !== null ? Number(bonus) : 0 }
          : s
      )
    );
    showToast('Salary record updated successfully.');
    return { success: true, message: 'Salary record updated successfully.' };
  };

  const deleteSalary = (id: number) => {
    setSalaries(prev => prev.filter(s => s.salary_id !== id));
    showToast('Salary record deleted successfully.');
    return { success: true, message: 'Salary record deleted successfully.' };
  };

  // ===================== ATTENDANCE CRUD =====================
  const addAttendance = (employeeId: number, date: string, status: 'Present' | 'Absent' | 'Leave') => {
    if (!employeeId) return { success: false, message: 'Please select an employee.' };
    if (!date) return { success: false, message: 'Attendance date is required.' };

    const maxId = attendance.reduce((max, a) => Math.max(max, a.attendance_id), 0);
    const newAtt: Attendance = {
      attendance_id: maxId + 1,
      employee_id: employeeId,
      attendance_date: date,
      status: status,
    };
    setAttendance(prev => [...prev, newAtt]);
    showToast('Attendance recorded successfully.');
    return { success: true, message: 'Attendance recorded successfully.' };
  };

  const updateAttendance = (id: number, employeeId: number, date: string, status: 'Present' | 'Absent' | 'Leave') => {
    if (!employeeId) return { success: false, message: 'Please select an employee.' };
    if (!date) return { success: false, message: 'Attendance date is required.' };

    setAttendance(prev =>
      prev.map(a =>
        a.attendance_id === id
          ? { ...a, employee_id: employeeId, attendance_date: date, status: status }
          : a
      )
    );
    showToast('Attendance record updated successfully.');
    return { success: true, message: 'Attendance record updated successfully.' };
  };

  const deleteAttendance = (id: number) => {
    setAttendance(prev => prev.filter(a => a.attendance_id !== id));
    showToast('Attendance record deleted successfully.');
    return { success: true, message: 'Attendance record deleted successfully.' };
  };

  // ===================== CALCULATIONS & REPORT =====================
  const getTotalPayroll = () => {
    return salaries.reduce((sum, s) => sum + (Number(s.basic_salary) || 0) + (Number(s.bonus) || 0), 0);
  };

  const getPresentTodayCount = () => {
    if (attendance.length === 0) return 0;
    // Find highest date or today
    const dates = attendance.map(a => a.attendance_date).sort();
    const latestDate = dates[dates.length - 1];
    const presentRecords = attendance.filter(a => a.attendance_date === latestDate && a.status === 'Present');
    const uniquePresentEmps = new Set(presentRecords.map(a => a.employee_id));
    return uniquePresentEmps.size;
  };

  const getDepartmentEmployeeCounts = () => {
    return departments.map(d => ({
      department: d,
      count: employees.filter(e => e.department_id === d.department_id).length,
    }));
  };

  /**
   * Joined HR report based on Section 4:
   * SELECT e.employee_name, d.department_name, e.email, s.basic_salary, s.bonus, a.attendance_date, a.status
   * FROM Employee e
   * LEFT JOIN Department d ON e.department_id = d.department_id
   * LEFT JOIN Salary s     ON e.employee_id   = s.employee_id
   * LEFT JOIN Attendance a ON e.employee_id   = a.employee_id
   * ORDER BY e.employee_name, a.attendance_date;
   */
  const getJoinedReport = (filters?: {
    department_id?: number | null;
    status?: string | null;
    start_date?: string | null;
    end_date?: string | null;
    search?: string | null;
  }) => {
    const reportRows: ReportRow[] = [];

    employees.forEach(emp => {
      const dept = departments.find(d => d.department_id === emp.department_id);
      const sal = salaries.find(s => s.employee_id === emp.employee_id);
      const empAttendance = attendance.filter(a => a.employee_id === emp.employee_id);

      const basic = sal ? Number(sal.basic_salary) : null;
      const bonus = sal ? Number(sal.bonus || 0) : null;
      const total = sal ? (basic ?? 0) + (bonus ?? 0) : null;

      if (empAttendance.length === 0) {
        // Left join with no attendance row
        reportRows.push({
          employee_id: emp.employee_id,
          employee_name: emp.employee_name,
          department_name: dept ? dept.department_name : 'Unassigned',
          email: emp.email,
          basic_salary: basic,
          bonus: bonus,
          total_salary: total,
          attendance_date: null,
          status: null,
        });
      } else {
        empAttendance.forEach(att => {
          reportRows.push({
            employee_id: emp.employee_id,
            employee_name: emp.employee_name,
            department_name: dept ? dept.department_name : 'Unassigned',
            email: emp.email,
            basic_salary: basic,
            bonus: bonus,
            total_salary: total,
            attendance_date: att.attendance_date,
            status: att.status,
          });
        });
      }
    });

    // Apply Filters
    let filtered = reportRows;

    if (filters?.department_id) {
      const targetDept = departments.find(d => d.department_id === Number(filters.department_id));
      if (targetDept) {
        filtered = filtered.filter(r => r.department_name === targetDept.department_name);
      }
    }

    if (filters?.status) {
      filtered = filtered.filter(r => r.status === filters.status);
    }

    if (filters?.start_date) {
      filtered = filtered.filter(r => r.attendance_date && r.attendance_date >= filters.start_date!);
    }

    if (filters?.end_date) {
      filtered = filtered.filter(r => r.attendance_date && r.attendance_date <= filters.end_date!);
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase().trim();
      filtered = filtered.filter(
        r =>
          r.employee_name.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q) ||
          r.department_name.toLowerCase().includes(q)
      );
    }

    // Sort by employee_name, then attendance_date
    filtered.sort((a, b) => {
      const nameCompare = a.employee_name.localeCompare(b.employee_name);
      if (nameCompare !== 0) return nameCompare;
      return (a.attendance_date || '').localeCompare(b.attendance_date || '');
    });

    return filtered;
  };

  return (
    <HRContext.Provider
      value={{
        departments,
        employees,
        salaries,
        attendance,
        activePage,
        setActivePage,
        theme,
        toggleTheme,
        toasts,
        showToast,
        removeToast,
        addDepartment,
        updateDepartment,
        deleteDepartment,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        addSalary,
        updateSalary,
        deleteSalary,
        addAttendance,
        updateAttendance,
        deleteAttendance,
        getTotalPayroll,
        getPresentTodayCount,
        getDepartmentEmployeeCounts,
        getJoinedReport,
        resetToSeedData,
      }}
    >
      {children}
    </HRContext.Provider>
  );
};

export const useHR = () => {
  const context = useContext(HRContext);
  if (!context) {
    throw new Error('useHR must be used within an HRProvider');
  }
  return context;
};
