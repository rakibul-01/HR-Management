<?php
/**
 * Action: Save Salary (Create or Update)
 */
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/Salary.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: ../salaries.php');
    exit;
}

if (!validateCsrfToken($_POST['csrf_token'] ?? '')) {
    setFlash('Invalid CSRF token.', 'error');
    header('Location: ../salaries.php');
    exit;
}

$id = !empty($_POST['salary_id']) ? (int)$_POST['salary_id'] : null;
$employeeId = (int)($_POST['employee_id'] ?? 0);
$basicSalaryStr = trim($_POST['basic_salary'] ?? '');
$bonusStr = trim($_POST['bonus'] ?? '0');

if ($employeeId <= 0) {
    setFlash('Please select an employee.', 'error');
    header('Location: ../salaries.php');
    exit;
}

if (!is_numeric($basicSalaryStr) || (float)$basicSalaryStr < 0) {
    setFlash('Basic salary must be a positive number.', 'error');
    header('Location: ../salaries.php');
    exit;
}

if ($bonusStr !== '' && (!is_numeric($bonusStr) || (float)$bonusStr < 0)) {
    setFlash('Bonus must be a non-negative number.', 'error');
    header('Location: ../salaries.php');
    exit;
}

$basicSalary = (float)$basicSalaryStr;
$bonus = ($bonusStr !== '') ? (float)$bonusStr : 0.00;

$db = getDBConnection();
$salaryModel = new Salary($db);

if ($id) {
    $salaryModel->update($id, $employeeId, $basicSalary, $bonus);
    setFlash('Salary record updated successfully.', 'success');
} else {
    $salaryModel->create($employeeId, $basicSalary, $bonus);
    setFlash('Salary record created successfully.', 'success');
}

header('Location: ../salaries.php');
exit;
