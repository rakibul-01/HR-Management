import { Department, Employee, Salary, Attendance } from '../types';

export const initialDepartments: Department[] = [
  { department_id: 1, department_name: 'Human Resources' },
  { department_id: 2, department_name: 'Finance' },
  { department_id: 3, department_name: 'IT' },
  { department_id: 4, department_name: 'Marketing' },
];

export const initialEmployees: Employee[] = [
  { employee_id: 101, employee_name: 'Alice Smith', department_id: 1, email: 'alice@company.com' },
  { employee_id: 102, employee_name: 'Bob Johnson', department_id: 2, email: 'bob@company.com' },
  { employee_id: 103, employee_name: 'Charlie Brown', department_id: 3, email: 'charlie@company.com' },
  { employee_id: 104, employee_name: 'Diana Prince', department_id: 4, email: 'diana@company.com' },
  { employee_id: 105, employee_name: 'Edward Norton', department_id: 3, email: 'edward@company.com' },
];

export const initialSalaries: Salary[] = [
  { salary_id: 1, employee_id: 101, basic_salary: 50000.00, bonus: 5000.00 },
  { salary_id: 2, employee_id: 102, basic_salary: 60000.00, bonus: 6000.00 },
  { salary_id: 3, employee_id: 103, basic_salary: 70000.00, bonus: 7000.00 },
  { salary_id: 4, employee_id: 104, basic_salary: 55000.00, bonus: 5500.00 },
  { salary_id: 5, employee_id: 105, basic_salary: 72000.00, bonus: 7500.00 },
];

export const initialAttendance: Attendance[] = [
  { attendance_id: 1, employee_id: 101, attendance_date: '2025-04-01', status: 'Present' },
  { attendance_id: 2, employee_id: 101, attendance_date: '2025-04-02', status: 'Present' },
  { attendance_id: 3, employee_id: 102, attendance_date: '2025-04-01', status: 'Absent' },
  { attendance_id: 4, employee_id: 102, attendance_date: '2025-04-02', status: 'Present' },
  { attendance_id: 5, employee_id: 103, attendance_date: '2025-04-01', status: 'Leave' },
  { attendance_id: 6, employee_id: 103, attendance_date: '2025-04-02', status: 'Present' },
  { attendance_id: 7, employee_id: 104, attendance_date: '2025-04-01', status: 'Present' },
  { attendance_id: 8, employee_id: 105, attendance_date: '2025-04-01', status: 'Absent' },
];
