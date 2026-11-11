export interface Department {
  department_id: number;
  department_name: string;
}

export interface Employee {
  employee_id: number;
  employee_name: string;
  department_id: number | null;
  email: string;
}

export interface Salary {
  salary_id: number;
  employee_id: number;
  basic_salary: number;
  bonus: number | null;
}

export interface Attendance {
  attendance_id: number;
  employee_id: number;
  attendance_date: string;
  status: 'Present' | 'Absent' | 'Leave';
}

export interface ReportRow {
  employee_id?: number;
  employee_name: string;
  department_name: string;
  email: string;
  basic_salary: number | null;
  bonus: number | null;
  total_salary: number | null;
  attendance_date: string | null;
  status: 'Present' | 'Absent' | 'Leave' | null;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export type ActivePage = 'dashboard' | 'employees' | 'departments' | 'salaries' | 'attendance' | 'report' | 'files';
