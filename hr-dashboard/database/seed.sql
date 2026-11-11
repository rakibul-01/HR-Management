USE hr_management;

INSERT INTO Department (department_id, department_name) VALUES
(1,'Human Resources'),(2,'Finance'),(3,'IT'),(4,'Marketing');

INSERT INTO Employee (employee_id, employee_name, department_id, email) VALUES
(101,'Alice Smith',1,'alice@company.com'),
(102,'Bob Johnson',2,'bob@company.com'),
(103,'Charlie Brown',3,'charlie@company.com'),
(104,'Diana Prince',4,'diana@company.com'),
(105,'Edward Norton',3,'edward@company.com');

INSERT INTO Salary (salary_id, employee_id, basic_salary, bonus) VALUES
(1,101,50000.00,5000.00),(2,102,60000.00,6000.00),(3,103,70000.00,7000.00),
(4,104,55000.00,5500.00),(5,105,72000.00,7500.00);

INSERT INTO Attendance (attendance_id, employee_id, attendance_date, status) VALUES
(1,101,'2025-04-01','Present'),(2,101,'2025-04-02','Present'),
(3,102,'2025-04-01','Absent'),(4,102,'2025-04-02','Present'),
(5,103,'2025-04-01','Leave'),(6,103,'2025-04-02','Present'),
(7,104,'2025-04-01','Present'),(8,105,'2025-04-01','Absent');
