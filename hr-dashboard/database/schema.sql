CREATE DATABASE IF NOT EXISTS hr_management;
USE hr_management;

CREATE TABLE Department (
  department_id INT PRIMARY KEY AUTO_INCREMENT,
  department_name VARCHAR(100) NOT NULL
);

CREATE TABLE Employee (
  employee_id INT PRIMARY KEY AUTO_INCREMENT,
  employee_name VARCHAR(100) NOT NULL,
  department_id INT,
  email VARCHAR(100),
  FOREIGN KEY (department_id) REFERENCES Department(department_id)
);

CREATE TABLE Salary (
  salary_id INT PRIMARY KEY AUTO_INCREMENT,
  employee_id INT,
  basic_salary DECIMAL(10,2) NOT NULL,
  bonus DECIMAL(10,2),
  FOREIGN KEY (employee_id) REFERENCES Employee(employee_id)
);

CREATE TABLE Attendance (
  attendance_id INT PRIMARY KEY AUTO_INCREMENT,
  employee_id INT,
  attendance_date DATE NOT NULL,
  status VARCHAR(50),
  FOREIGN KEY (employee_id) REFERENCES Employee(employee_id)
);
