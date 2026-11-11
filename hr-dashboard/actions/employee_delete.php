<?php
/**
 * Action: Delete Employee
 */
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/Employee.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: ../employees.php');
    exit;
}

if (!validateCsrfToken($_POST['csrf_token'] ?? '')) {
    setFlash('Invalid CSRF token.', 'error');
    header('Location: ../employees.php');
    exit;
}

$id = (int)($_POST['employee_id'] ?? 0);
if ($id <= 0) {
    setFlash('Invalid employee ID.', 'error');
    header('Location: ../employees.php');
    exit;
}

$db = getDBConnection();
$employeeModel = new Employee($db);
$result = $employeeModel->delete($id);

setFlash($result['message'], $result['success'] ? 'success' : 'error');
header('Location: ../employees.php');
exit;
