<?php
/**
 * Action: Save Employee (Create or Update)
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

$id = !empty($_POST['employee_id']) ? (int)$_POST['employee_id'] : null;
$name = trim($_POST['employee_name'] ?? '');
$departmentId = !empty($_POST['department_id']) ? (int)$_POST['department_id'] : null;
$email = trim($_POST['email'] ?? '');

// Validation
if (empty($name)) {
    setFlash('Employee name is required.', 'error');
    header('Location: ../employees.php');
    exit;
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    setFlash('A valid email address is required.', 'error');
    header('Location: ../employees.php');
    exit;
}

$db = getDBConnection();
$employeeModel = new Employee($db);

if ($id) {
    $employeeModel->update($id, $name, $departmentId, $email);
    setFlash('Employee updated successfully.', 'success');
} else {
    $employeeModel->create($name, $departmentId, $email);
    setFlash('Employee created successfully.', 'success');
}

header('Location: ../employees.php');
exit;
